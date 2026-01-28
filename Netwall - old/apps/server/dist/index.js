"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@trpc/server/adapters/express");
const appRouter_1 = require("./routers/appRouter");
const context_1 = require("./context");
const snmpRouter_1 = require("./routers/snmpRouter");
const snmp_1 = require("./services/snmp");
const influxdb_1 = require("./services/influxdb");
const influxdb_client_1 = require("@influxdata/influxdb-client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_FILE = path_1.default.join(process.cwd(), 'poller_debug.log');
function logDebug(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    try {
        fs_1.default.appendFileSync(LOG_FILE, line);
    }
    catch (e) { }
    console.log(msg);
}
// Inicializa o app Express
const app = (0, express_1.default)();
const snmpService = new snmp_1.SnmpService();
// Habilita CORS para permitir requisições do frontend
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = 3001;
// Endpoint principal do tRPC
app.use('/trpc', (0, express_2.createExpressMiddleware)({
    router: appRouter_1.appRouter,
    createContext: context_1.createContext,
}));
// Rota de teste básica (Health Check simples fora do tRPC)
app.get('/', (req, res) => {
    res.json({ message: 'Netwall API' });
});
logDebug('Server started, debug log initialized');
// Initialize monitoring from DB
(0, snmpRouter_1.syncMonitoredDevices)().then(devices => {
    logDebug(`Restored ${devices.length} monitored devices from DB`);
}).catch(err => {
    logDebug(`Error restoring monitored devices: ${err.message}`);
});
// Polling Loop for SNMP Monitoring
setInterval(async () => {
    if (snmpRouter_1.monitoredDevices.length === 0) {
        logDebug(`[SNMP Poller] No devices to poll`);
        return;
    }
    logDebug(`[SNMP Poller] Monitoring ${snmpRouter_1.monitoredDevices.length} devices: ${snmpRouter_1.monitoredDevices.map(d => d.ip).join(', ')}`);
    for (const device of snmpRouter_1.monitoredDevices) {
        try {
            if (device.interfaces.length === 0) {
                logDebug(`[SNMP Poller] Skipping ${device.ip} (Zero interfaces monitored)`);
                continue;
            }
            logDebug(`[SNMP Poller] Fetching metrics for ${device.ip} (Interfaces: ${device.interfaces.join(',')})`);
            const metrics = await snmpService.getTrafficMetrics(device.ip, device.community, device.interfaces, logDebug);
            logDebug(`[SNMP Poller] ${device.ip} returned ${metrics.length} interface metrics`);
            if (metrics.length > 0) {
                metrics.forEach(m => {
                    const point = new influxdb_client_1.Point('interface_traffic')
                        .tag('device', device.ip)
                        .tag('interface_index', m.index.toString())
                        .floatField('ifInOctets', Number(m.in))
                        .floatField('ifOutOctets', Number(m.out));
                    influxdb_1.influxDB.writeApi.writePoint(point);
                    logDebug(`  - Intf ${m.index}: In=${m.in}, Out=${m.out}`);
                });
                await influxdb_1.influxDB.writeApi.flush();
                logDebug(`[SNMP Poller] Data flushed to InfluxDB for ${device.ip}`);
            }
        }
        catch (error) {
            logDebug(`[SNMP Poller] ERROR polling ${device.ip}: ${error?.message || error}`);
        }
    }
}, 10000);
// Inicia o servidor na porta definida
app.listen(port, () => {
    logDebug(`Server running on http://localhost:${port}`);
});
