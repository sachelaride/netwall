"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const influxdb_1 = require("../services/influxdb");
exports.monitoringRouter = (0, trpc_1.router)({
    // Returns metric series for a given device IP and time range
    getDeviceMetrics: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        deviceIp: zod_1.z.string(),
        timeRange: zod_1.z.enum(['1h', '24h', '7d']).default('1h'),
    }))
        .query(async ({ input }) => {
        const { deviceIp, timeRange } = input;
        const durationMap = {
            '1h': '-1h',
            '24h': '-24h',
            '7d': '-7d',
        };
        const duration = durationMap[timeRange];
        const query = `
        from(bucket: "${influxdb_1.influxDB.bucket}")
          |> range(start: ${duration})
          |> filter(fn: (r) => r["_measurement"] == "interface_traffic")
          |> filter(fn: (r) => r["device"] == "${deviceIp}")
          |> filter(fn: (r) => r["_field"] == "ifInOctets" or r["_field"] == "ifOutOctets")
          |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
          |> yield(name: "mean")
      `;
        try {
            const result = await influxdb_1.influxDB.queryRows(query);
            const grouped = new Map();
            for (const row of result) {
                const timestamp = row._time;
                const field = row._field;
                const value = row._value;
                if (!grouped.has(timestamp))
                    grouped.set(timestamp, {});
                const entry = grouped.get(timestamp);
                if (field === 'ifInOctets')
                    entry.bytesIn = value;
                else if (field === 'ifOutOctets')
                    entry.bytesOut = value;
            }
            const data = [];
            for (const [timestamp, vals] of grouped.entries()) {
                data.push({ timestamp, bytesIn: vals.bytesIn || 0, bytesOut: vals.bytesOut || 0 });
            }
            data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            return data;
        }
        catch (error) {
            console.error('[Monitoring] InfluxDB query error:', error);
            return [];
        }
    }),
});
