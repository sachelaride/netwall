import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { influxDB } from '../services/influxdb';

export const monitoringRouter = router({
    // Returns metric series for a given device IP and time range
    getDeviceMetrics: protectedProcedure
        .input(
            z.object({
                deviceIp: z.string(),
                timeRange: z.enum(['1h', '24h', '7d']).default('1h'),
            })
        )
        .query(async ({ input }) => {
            const { deviceIp, timeRange } = input;
            const durationMap = {
                '1h': '-1h',
                '24h': '-24h',
                '7d': '-7d',
            } as const;
            const duration = durationMap[timeRange];

            const query = `
        from(bucket: "${influxDB.bucket}")
          |> range(start: ${duration})
          |> filter(fn: (r) => r["_measurement"] == "interface_traffic")
          |> filter(fn: (r) => r["device"] == "${deviceIp}")
          |> filter(fn: (r) => r["_field"] == "ifInOctets" or r["_field"] == "ifOutOctets")
          |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
          |> yield(name: "mean")
      `;

            try {
                const result = await influxDB.queryRows(query) as any[];
                const grouped = new Map<string, { bytesIn?: number; bytesOut?: number }>();
                for (const row of result) {
                    const timestamp = row._time as string;
                    const field = row._field as string;
                    const value = row._value as number;
                    if (!grouped.has(timestamp)) grouped.set(timestamp, {});
                    const entry = grouped.get(timestamp)!;
                    if (field === 'ifInOctets') entry.bytesIn = value;
                    else if (field === 'ifOutOctets') entry.bytesOut = value;
                }
                const data = [] as Array<{ timestamp: string; bytesIn: number; bytesOut: number }>;
                for (const [timestamp, vals] of grouped.entries()) {
                    data.push({ timestamp, bytesIn: vals.bytesIn || 0, bytesOut: vals.bytesOut || 0 });
                }
                data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                return data;
            } catch (error) {
                console.error('[Monitoring] InfluxDB query error:', error);
                return [];
            }
        }),
});
