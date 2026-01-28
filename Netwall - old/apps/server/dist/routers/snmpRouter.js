"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snmpRouter = exports.monitoredDevices = void 0;
exports.syncMonitoredDevices = syncMonitoredDevices;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const snmp_1 = require("../services/snmp");
const ping_1 = require("../utils/ping");
const prisma_1 = require("../utils/prisma");
const snmpService = new snmp_1.SnmpService();
// We keep this for the poller to have an easy reference, 
// but we will sync it from the DB.
exports.monitoredDevices = [];
// Helper to sync local state from DB
async function syncMonitoredDevices() {
    const devices = await prisma_1.prisma.monitoredDevice.findMany();
    exports.monitoredDevices = devices.map(d => ({
        ip: d.ip,
        community: d.community,
        interfaces: d.interfaces,
        status: d.status,
        lastScan: d.lastScan.getTime()
    }));
    return exports.monitoredDevices;
}
exports.snmpRouter = (0, trpc_1.router)({
    testConnection: trpc_1.protectedProcedure
        .input(zod_1.z.object({ ip: zod_1.z.string(), community: zod_1.z.string() }))
        .mutation(async ({ input }) => {
        // 1. Ping Check
        const isAlive = await (0, ping_1.pingHost)(input.ip);
        if (!isAlive) {
            return {
                success: false,
                ping: false,
                snmp: false,
                message: 'Device unreachable (Ping failed)'
            };
        }
        // 2. SNMP Check
        console.log(`[SNMP] Starting probe for ${input.ip} with community '${input.community}'`);
        const data = await snmpService.manualProbe(input.ip, input.community);
        console.log(`[SNMP] Probe completed for ${input.ip}, data:`, data ? 'SUCCESS' : 'FAILED');
        if (!data) {
            return {
                success: false,
                ping: true,
                snmp: false,
                message: 'Ping OK, but SNMP failed'
            };
        }
        return {
            success: true,
            ping: true,
            snmp: true,
            data
        };
    }),
    startMonitoring: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        ip: zod_1.z.string(),
        community: zod_1.z.string(),
        interfaces: zod_1.z.array(zod_1.z.number())
    }))
        .mutation(async ({ input }) => {
        await prisma_1.prisma.monitoredDevice.upsert({
            where: { ip: input.ip },
            update: {
                community: input.community,
                interfaces: input.interfaces,
                status: 'up',
                lastScan: new Date()
            },
            create: {
                ip: input.ip,
                community: input.community,
                interfaces: input.interfaces,
                status: 'up'
            }
        });
        await syncMonitoredDevices();
        console.log(`[Monitoring] PERSISTED monitoring for ${input.ip} on interfaces: ${input.interfaces.join(', ')}`);
        return { success: true };
    }),
    stopMonitoring: trpc_1.protectedProcedure
        .input(zod_1.z.object({ ip: zod_1.z.string() }))
        .mutation(async ({ input }) => {
        await prisma_1.prisma.monitoredDevice.delete({
            where: { ip: input.ip }
        });
        await syncMonitoredDevices();
        return { success: true };
    }),
    getMonitoredDevices: trpc_1.protectedProcedure
        .query(async () => {
        const monitored = await prisma_1.prisma.monitoredDevice.findMany();
        // Enrich was IP-only data with names from DB
        const enriched = await Promise.all(monitored.map(async (m) => {
            const device = await prisma_1.prisma.device.findUnique({
                where: { ipAddress: m.ip },
                select: { name: true }
            });
            return {
                ...m,
                name: device?.name || m.ip
            };
        }));
        return enriched;
    })
});
