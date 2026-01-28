"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const trpc_1 = require("../trpc");
const systeminformation_1 = __importDefault(require("systeminformation"));
const prisma_1 = require("../utils/prisma");
const influxdb_1 = require("../services/influxdb");
exports.dashboardRouter = (0, trpc_1.router)({
    getServerStats: trpc_1.protectedProcedure.query(async () => {
        try {
            const [cpu, mem, load, net] = await Promise.all([
                systeminformation_1.default.currentLoad(),
                systeminformation_1.default.mem(),
                systeminformation_1.default.fullLoad(),
                systeminformation_1.default.networkStats()
            ]);
            // Calculate network throughput
            const netStats = net[0] || { rx_sec: 0, tx_sec: 0 };
            return {
                cpu: {
                    load: cpu.currentLoad,
                    temp: 0, // Temp depends on hardware/OS permissions
                },
                memory: {
                    total: mem.total,
                    used: mem.used,
                    active: mem.active,
                    percent: (mem.used / mem.total) * 100
                },
                network: {
                    rx_sec: netStats.rx_sec || 0,
                    tx_sec: netStats.tx_sec || 0,
                },
                uptime: systeminformation_1.default.time().uptime
            };
        }
        catch (error) {
            console.error('[DashboardRouter] Error fetching server stats:', error);
            throw new Error('Failed to fetch server stats');
        }
    }),
    getDatabaseStats: trpc_1.protectedProcedure.query(async () => {
        try {
            // PostgreSQL Stats
            const pgStats = await prisma_1.prisma.$queryRaw `
                SELECT 
                    pg_database_size(current_database()) as size_bytes,
                    (SELECT count(*) FROM pg_stat_activity) as active_connections
            `;
            const pgSize = Number(pgStats[0].size_bytes);
            const pgConns = Number(pgStats[0].active_connections);
            // InfluxDB Stats (Basic info since deep stats are harder via client)
            // We can check if the bucket exists or get some metadata if needed
            return {
                postgres: {
                    sizeBytes: pgSize,
                    connections: pgConns,
                    status: 'online'
                },
                influx: {
                    bucket: influxdb_1.influxDB.bucket,
                    status: 'online'
                }
            };
        }
        catch (error) {
            console.error('[DashboardRouter] Error fetching database stats:', error);
            return {
                postgres: { sizeBytes: 0, connections: 0, status: 'error' },
                influx: { bucket: '', status: 'error' }
            };
        }
    }),
    getGlobalStats: trpc_1.protectedProcedure.query(async () => {
        const [totalDevices, onlineDevices, discoveredDevices] = await Promise.all([
            prisma_1.prisma.device.count(),
            prisma_1.prisma.device.count({ where: { status: 'ONLINE' } }),
            prisma_1.prisma.monitoredDevice.count()
        ]);
        return {
            total: totalDevices,
            online: onlineDevices,
            offline: totalDevices - onlineDevices,
            discovered: discoveredDevices
        };
    })
});
