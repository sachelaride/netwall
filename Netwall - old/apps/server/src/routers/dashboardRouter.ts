import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import si from 'systeminformation';
import { prisma } from '../utils/prisma';
import { influxDB } from '../services/influxdb';

export const dashboardRouter = router({
    getServerStats: protectedProcedure.query(async () => {
        try {
            const [cpu, mem, load, net] = await Promise.all([
                si.currentLoad(),
                si.mem(),
                si.fullLoad(),
                si.networkStats()
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
                uptime: si.time().uptime
            };
        } catch (error) {
            console.error('[DashboardRouter] Error fetching server stats:', error);
            throw new Error('Failed to fetch server stats');
        }
    }),

    getDatabaseStats: protectedProcedure.query(async () => {
        try {
            // PostgreSQL Stats
            const pgStats: any = await prisma.$queryRaw`
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
                    bucket: influxDB.bucket,
                    status: 'online'
                }
            };
        } catch (error) {
            console.error('[DashboardRouter] Error fetching database stats:', error);
            return {
                postgres: { sizeBytes: 0, connections: 0, status: 'error' },
                influx: { bucket: '', status: 'error' }
            };
        }
    }),

    getGlobalStats: protectedProcedure.query(async () => {
        const [totalDevices, onlineDevices, discoveredDevices] = await Promise.all([
            prisma.device.count(),
            prisma.device.count({ where: { status: 'ONLINE' } }),
            (prisma as any).monitoredDevice.count()
        ]);

        return {
            total: totalDevices,
            online: onlineDevices,
            offline: totalDevices - onlineDevices,
            discovered: discoveredDevices
        };
    })
});
