"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnmpService = void 0;
const net_snmp_1 = __importDefault(require("net-snmp"));
// OIDs
const OIDS = {
    sysDescr: '1.3.6.1.2.1.1.1.0',
    sysName: '1.3.6.1.2.1.1.5.0',
    ifDescr: '1.3.6.1.2.1.2.2.1.2',
    ifPhysAddress: '1.3.6.1.2.1.2.2.1.6',
    ifOperStatus: '1.3.6.1.2.1.2.2.1.8',
    ifAdminStatus: '1.3.6.1.2.1.2.2.1.7',
    ifInOctets: '1.3.6.1.2.1.2.2.1.10',
    ifOutOctets: '1.3.6.1.2.1.2.2.1.16',
    ifHCInOctets: '1.3.6.1.2.1.31.1.1.1.6',
    ifHCOutOctets: '1.3.6.1.2.1.31.1.1.1.10',
};
class SnmpService {
    constructor() {
        this.communities = ['unigran', 'public'];
    }
    async probeDevice(ip) {
        for (const community of this.communities) {
            try {
                const session = net_snmp_1.default.createSession(ip, community, {
                    timeout: 2000,
                    retries: 1
                });
                const sysInfo = await new Promise((resolve) => {
                    session.get([OIDS.sysDescr, OIDS.sysName], (error, varbinds) => {
                        if (error) {
                            console.log(`[SNMP probeDevice] Basic OIDs failed for ${ip} (${community}): ${error.message}`);
                            resolve([]);
                        }
                        else
                            resolve(varbinds);
                    });
                });
                if (sysInfo.length === 0) {
                    session.close();
                    continue; // Try next community
                }
                // Get interfaces (optional during probe)
                const interfaces = await this.getInterfaces(session);
                session.close();
                return {
                    sysDescr: sysInfo[0]?.value?.toString() || 'Unknown Device',
                    sysName: sysInfo[1]?.value?.toString() || ip,
                    interfaces
                };
            }
            catch (error) {
                console.log(`Failed with community ${community} on ${ip}`);
            }
        }
        return null;
    }
    async manualProbe(ip, community) {
        try {
            const session = net_snmp_1.default.createSession(ip, community, {
                timeout: 5000,
                retries: 2
            });
            const sysInfo = await new Promise((resolve, reject) => {
                session.get([OIDS.sysDescr, OIDS.sysName], (error, varbinds) => {
                    // Try to proceed even if sysName fails
                    if (error) {
                        console.warn(`[SNMP manualProbe] sysInfo error: ${error.message}`);
                        resolve([{ value: 'Unknown' }, { value: 'Unknown' }]);
                    }
                    else {
                        resolve(varbinds);
                    }
                });
            });
            const interfaces = await this.getInterfaces(session);
            session.close();
            // Return data if we at least have system info OR interfaces
            if (sysInfo.length > 0 || interfaces.length > 0) {
                return {
                    sysDescr: sysInfo[0]?.value?.toString() || 'Unknown',
                    sysName: sysInfo[1]?.value?.toString() || ip,
                    interfaces
                };
            }
        }
        catch (e) {
            console.log(`[SNMP manualProbe] Error:`, e);
            return null;
        }
        return null;
    }
    async getInterfaces(session) {
        return new Promise((resolve) => {
            const interfaces = new Map();
            session.subtree(OIDS.ifDescr, 10, (varbinds) => {
                for (const vb of varbinds) {
                    const parts = vb.oid.split('.');
                    const index = parseInt(parts[parts.length - 1]);
                    if (!interfaces.has(index))
                        interfaces.set(index, { index });
                    interfaces.get(index).description = vb.value.toString();
                }
            }, (error) => {
                if (error) {
                    console.error('Subtree ifDescr error:', error);
                    resolve([]);
                    return;
                }
                // After getting descriptions, get other attributes
                const indices = Array.from(interfaces.keys());
                if (indices.length === 0) {
                    resolve([]);
                    return;
                }
                // Chunk indices to avoid TooBig errors
                const chunkSize = 20;
                let processed = 0;
                const fetchAttributes = () => {
                    if (processed >= indices.length) {
                        resolve(Array.from(interfaces.values()));
                        return;
                    }
                    const chunk = indices.slice(processed, processed + chunkSize);
                    const oids = [];
                    chunk.forEach(idx => {
                        oids.push(`${OIDS.ifPhysAddress}.${idx}`);
                        oids.push(`${OIDS.ifOperStatus}.${idx}`);
                        oids.push(`${OIDS.ifAdminStatus}.${idx}`);
                    });
                    session.get(oids, (err, vbs) => {
                        if (!err) {
                            for (let i = 0; i < chunk.length; i++) {
                                const idx = chunk[i];
                                const vbPhys = vbs[i * 3];
                                const vbOper = vbs[i * 3 + 1];
                                const vbAdmin = vbs[i * 3 + 2];
                                if (vbPhys && !net_snmp_1.default.isVarbindError(vbPhys))
                                    interfaces.get(idx).mac = vbPhys.value.toString('hex').match(/.{1,2}/g)?.join(':') || '';
                                if (vbOper && !net_snmp_1.default.isVarbindError(vbOper))
                                    interfaces.get(idx).operStatus = vbOper.value;
                                if (vbAdmin && !net_snmp_1.default.isVarbindError(vbAdmin))
                                    interfaces.get(idx).adminStatus = vbAdmin.value;
                            }
                        }
                        processed += chunkSize;
                        fetchAttributes();
                    });
                };
                fetchAttributes();
            });
        });
    }
    async getTrafficMetrics(ip, community, interfaces, logger) {
        const session = net_snmp_1.default.createSession(ip, community, { timeout: 4000, retries: 1 });
        const results = [];
        // Chunk interfaces to avoid SNMP TooBig or timeouts
        const chunkSize = 10;
        const chunks = [];
        for (let i = 0; i < interfaces.length; i += chunkSize) {
            chunks.push(interfaces.slice(i, i + chunkSize));
        }
        for (const chunk of chunks) {
            try {
                const batchResults = await new Promise((resolveBatch) => {
                    const oids32 = [];
                    const oids64 = [];
                    chunk.forEach(i => {
                        oids32.push(`${OIDS.ifInOctets}.${i}`);
                        oids32.push(`${OIDS.ifOutOctets}.${i}`);
                        oids64.push(`${OIDS.ifHCInOctets}.${i}`);
                        oids64.push(`${OIDS.ifHCOutOctets}.${i}`);
                    });
                    // Batch 1: Standard 32-bit counters (Always exists)
                    session.get(oids32, (err32, vbs32) => {
                        if (err32) {
                            if (logger)
                                logger(`[SNMP] Batch 32-bit error for ${ip}: ${err32.message}`);
                            resolveBatch([]);
                            return;
                        }
                        const chunkMetrics = [];
                        // Batch 2: Try HC counters (Optional, don't fail if they don't exist)
                        session.get(oids64, (err64, vbs64) => {
                            for (let j = 0; j < chunk.length; j++) {
                                const idx = chunk[j];
                                const vbIn = vbs32[j * 2];
                                const vbOut = vbs32[j * 2 + 1];
                                let valIn = 0n;
                                let valOut = 0n;
                                // Prefer HC if available and not an error
                                if (!err64 && vbs64 && vbs64[j * 2] && !net_snmp_1.default.isVarbindError(vbs64[j * 2])) {
                                    valIn = Buffer.isBuffer(vbs64[j * 2].value) ? vbs64[j * 2].value.readBigUInt64BE() : BigInt(vbs64[j * 2].value.toString());
                                }
                                else if (vbIn && !net_snmp_1.default.isVarbindError(vbIn)) {
                                    valIn = BigInt(vbIn.value);
                                }
                                if (!err64 && vbs64 && vbs64[j * 2 + 1] && !net_snmp_1.default.isVarbindError(vbs64[j * 2 + 1])) {
                                    valOut = Buffer.isBuffer(vbs64[j * 2 + 1].value) ? vbs64[j * 2 + 1].value.readBigUInt64BE() : BigInt(vbs64[j * 2 + 1].value.toString());
                                }
                                else if (vbOut && !net_snmp_1.default.isVarbindError(vbOut)) {
                                    valOut = BigInt(vbOut.value);
                                }
                                chunkMetrics.push({ index: idx, in: Number(valIn), out: Number(valOut) });
                            }
                            resolveBatch(chunkMetrics);
                        });
                    });
                });
                results.push(...batchResults);
            }
            catch (e) {
                console.error(`[SNMP getTrafficMetrics] Chunk processing failed for ${ip}`);
            }
        }
        session.close();
        return results;
    }
}
exports.SnmpService = SnmpService;
