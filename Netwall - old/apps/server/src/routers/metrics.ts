import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { influxDB } from '../services/influxdb';
import { Point } from '@influxdata/influxdb-client';
import { prisma } from '../utils/prisma';

export const metricsRouter = router({
    ingest: protectedProcedure
        .input(z.object({
            cpu: z.object({
                load: z.number(),
                cores: z.array(z.number()),
            }),
            memory: z.object({
                total: z.number(),
                used: z.number(),
                free: z.number(),
                percent: z.number(),
            }),
            disk: z.array(z.object({
                fs: z.string(),
                size: z.number(),
                used: z.number(),
                usePercent: z.number(),
                mount: z.string(),
            })).optional(),
            network: z.array(z.object({
                iface: z.string(),
                rx_bytes: z.number(),
                tx_bytes: z.number(),
                operstate: z.string(),
            })).optional(),
            uptime: z.number(),
            timestamp: z.string().or(z.date()),
        }))
        .mutation(async ({ input, ctx }) => {
            const agentId = ctx.user?.id || 'unknown';
            console.log(`[Metrics Received] Device Agent: ${agentId}`, {
                cpu: input.cpu.load,
                mem: input.memory.percent
            });

            try {
                // Link agent to device if not already linked (by IP)
                // In a real scenario, we might use a more robust identification
                // For now, if the agent identifies itself, we update the device record
                if (agentId !== 'unknown') {
                    await (prisma.device as any).updateMany({
                        where: {
                            OR: [
                                { agentId: agentId },
                                { hostname: agentId } // Fallback to hostname if agentId not yet set
                            ]
                        },
                        data: {
                            agentId: agentId,
                            status: 'ONLINE',
                            lastSeen: new Date(),
                            lastCpuUsage: input.cpu.load,
                            lastRamUsage: input.memory.percent
                        }
                    });
                }

                // Ensure timestamp is a Date object
                const time = input.timestamp instanceof Date
                    ? input.timestamp
                    : new Date(input.timestamp);

                const point = new Point('system_metrics')
                    .tag('device_id', agentId)
                    .floatField('cpu_load', input.cpu.load)
                    .floatField('mem_percent', input.memory.percent)
                    .floatField('mem_used', input.memory.used)
                    .floatField('uptime', input.uptime)
                    .timestamp(time);

                // ... (rest of disk/network points remain same)
                if (input.disk && input.disk.length > 0) {
                    input.disk.forEach(d => {
                        const diskPoint = new Point('disk_usage')
                            .tag('device_id', agentId)
                            .tag('mount', d.mount)
                            .floatField('used_percent', (d as any).usePercent)
                            .floatField('size', d.size)
                            .floatField('used', d.used)
                            .timestamp(time);
                        influxDB.writeApi.writePoint(diskPoint);
                    });
                }

                if (input.network && input.network.length > 0) {
                    input.network.forEach(n => {
                        const netPoint = new Point('network_traffic')
                            .tag('device_id', agentId)
                            .tag('interface', n.iface)
                            .floatField('rx_bytes', n.rx_bytes)
                            .floatField('tx_bytes', n.tx_bytes)
                            .timestamp(time);
                        influxDB.writeApi.writePoint(netPoint);
                    });
                }

                influxDB.writeApi.writePoint(point);
                await influxDB.writeApi.flush();

            } catch (error) {
                console.error('Error writing to InfluxDB or updating Device:', error);
            }

            return { success: true };
        }),

    getSystemMetrics: protectedProcedure
        .input(z.object({
            deviceId: z.string().optional(),
            timeRange: z.enum(['1h', '24h', '7d']).default('1h')
        }))
        .query(async ({ input, ctx }) => {
            const durationMap = {
                '1h': '-1h',
                '24h': '-24h',
                '7d': '-7d'
            } as const;
            const duration = durationMap[input.timeRange];
            // Use provided deviceId or fallback to current user id (if agent is authenticated as user/device)
            const targetDevice = input.deviceId || ctx.user?.id;

            if (!targetDevice) {
                return [];
            }

            const query = `
                from(bucket: "${influxDB.bucket}")
                    |> range(start: ${duration})
                    |> filter(fn: (r) => r["_measurement"] == "system_metrics")
                    |> filter(fn: (r) => r["device_id"] == "${targetDevice}")
                    |> filter(fn: (r) => r["_field"] == "cpu_load" or r["_field"] == "mem_percent")
                    |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
                    |> yield(name: "mean")
            `;

            try {
                const result = await influxDB.queryApi.collectRows(query);

                const grouped = new Map<string, { cpu?: number; memory?: number }>();

                for (const row of result as any[]) {
                    const timestamp = row._time;
                    const field = row._field;
                    const value = row._value;

                    if (!grouped.has(timestamp)) {
                        grouped.set(timestamp, {});
                    }

                    const entry = grouped.get(timestamp)!;
                    if (field === 'cpu_load') {
                        entry.cpu = value;
                    } else if (field === 'mem_percent') {
                        entry.memory = value;
                    }
                }

                const data = Array.from(grouped.entries()).map(([timestamp, values]) => ({
                    timestamp,
                    cpu: values.cpu || 0,
                    memory: values.memory || 0
                }));

                // Sort by timestamp
                data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                return data;

            } catch (error) {
                console.error('[Metrics] Error querying InfluxDB:', error);
                return [];
            }
        }),

    getInterfaceMetrics: protectedProcedure
        .input(z.object({
            deviceIp: z.string(),
            interfaceIndex: z.number(),
            timeRange: z.enum(['1m', '1h', '24h', '7d']).default('1h')
        }))
        .query(async ({ input }) => {
            const { deviceIp, interfaceIndex, timeRange } = input;

            const durationMap = {
                '1m': '-1m',
                '1h': '-1h',
                '24h': '-24h',
                '7d': '-7d'
            } as const;

            const windowMap = {
                '1m': '5s',
                '1h': '1m',
                '24h': '5m',
                '7d': '30m'
            } as const;

            const duration = durationMap[timeRange];
            const window = windowMap[timeRange];

            const query = `
                from(bucket: "${influxDB.bucket}")
                    |> range(start: ${duration})
                    |> filter(fn: (r) => r["_measurement"] == "interface_traffic")
                    |> filter(fn: (r) => r["device"] == "${deviceIp}")
                    |> filter(fn: (r) => r["interface_index"] == "${interfaceIndex}") 
                    |> filter(fn: (r) => r["_field"] == "ifInOctets" or r["_field"] == "ifOutOctets")
                    |> derivative(unit: 1s, nonNegative: true)
                    |> aggregateWindow(every: ${window}, fn: mean, createEmpty: false)
                    |> yield(name: "mean")
            `;

            try {
                const result = await influxDB.queryApi.collectRows(query);
                console.log(`[Metrics Query] Found ${result.length} rows for ${deviceIp}`);

                const grouped = new Map<string, { bytesIn?: number; bytesOut?: number }>();

                for (const row of result as any[]) {
                    const timestamp = row._time;
                    const field = row._field;
                    const value = row._value;

                    if (!grouped.has(timestamp)) {
                        grouped.set(timestamp, {});
                    }

                    const entry = grouped.get(timestamp)!;
                    if (field === 'ifInOctets') {
                        entry.bytesIn = value;
                    } else if (field === 'ifOutOctets') {
                        entry.bytesOut = value;
                    }
                }

                const data = Array.from(grouped.entries()).map(([timestamp, values]) => ({
                    timestamp,
                    bytesIn: values.bytesIn || 0,
                    bytesOut: values.bytesOut || 0
                }));

                data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                return data;
            } catch (error) {
                console.error('[Metrics] Error querying InfluxDB:', error);
                return [];
            }
        })
});
