"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const influxdb_1 = require("../services/influxdb");
const influxdb_client_1 = require("@influxdata/influxdb-client");
exports.metricsRouter = (0, trpc_1.router)({
    ingest: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        cpu: zod_1.z.object({
            load: zod_1.z.number(),
            cores: zod_1.z.array(zod_1.z.number()),
        }),
        memory: zod_1.z.object({
            total: zod_1.z.number(),
            used: zod_1.z.number(),
            free: zod_1.z.number(),
            percent: zod_1.z.number(),
        }),
        disk: zod_1.z.array(zod_1.z.object({
            fs: zod_1.z.string(),
            size: zod_1.z.number(),
            used: zod_1.z.number(),
            usePercent: zod_1.z.number(),
            mount: zod_1.z.string(),
        })).optional(),
        network: zod_1.z.array(zod_1.z.object({
            iface: zod_1.z.string(),
            rx_bytes: zod_1.z.number(),
            tx_bytes: zod_1.z.number(),
            operstate: zod_1.z.string(),
        })).optional(),
        uptime: zod_1.z.number(),
        timestamp: zod_1.z.string().or(zod_1.z.date()),
    }))
        .mutation(async ({ input, ctx }) => {
        console.log(`[Metrics Received] Device: ${ctx.user?.id || 'unknown'}`, {
            cpu: input.cpu.load,
            mem: input.memory.percent
        });
        try {
            // Ensure timestamp is a Date object
            const time = input.timestamp instanceof Date
                ? input.timestamp
                : new Date(input.timestamp);
            const point = new influxdb_client_1.Point('system_metrics')
                .tag('device_id', ctx.user?.id || 'unknown')
                .floatField('cpu_load', input.cpu.load)
                .floatField('mem_percent', input.memory.percent)
                .floatField('mem_used', input.memory.used)
                .floatField('uptime', input.uptime)
                .timestamp(time);
            // Add disk if available
            if (input.disk && input.disk.length > 0) {
                input.disk.forEach(d => {
                    const diskPoint = new influxdb_client_1.Point('disk_usage')
                        .tag('device_id', ctx.user?.id || 'unknown')
                        .tag('mount', d.mount)
                        .floatField('used_percent', d.usePercent)
                        .floatField('size', d.size)
                        .floatField('used', d.used)
                        .timestamp(time);
                    influxdb_1.influxDB.writeApi.writePoint(diskPoint);
                });
            }
            // Add network if available
            if (input.network && input.network.length > 0) {
                input.network.forEach(n => {
                    const netPoint = new influxdb_client_1.Point('network_traffic')
                        .tag('device_id', ctx.user?.id || 'unknown')
                        .tag('interface', n.iface)
                        .floatField('rx_bytes', n.rx_bytes)
                        .floatField('tx_bytes', n.tx_bytes)
                        .timestamp(time);
                    influxdb_1.influxDB.writeApi.writePoint(netPoint);
                });
            }
            influxdb_1.influxDB.writeApi.writePoint(point);
            await influxdb_1.influxDB.writeApi.flush();
        }
        catch (error) {
            console.error('Error writing to InfluxDB:', error);
        }
        return { success: true };
    }),
    getSystemMetrics: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        deviceId: zod_1.z.string().optional(),
        timeRange: zod_1.z.enum(['1h', '24h', '7d']).default('1h')
    }))
        .query(async ({ input, ctx }) => {
        const durationMap = {
            '1h': '-1h',
            '24h': '-24h',
            '7d': '-7d'
        };
        const duration = durationMap[input.timeRange];
        // Use provided deviceId or fallback to current user id (if agent is authenticated as user/device)
        const targetDevice = input.deviceId || ctx.user?.id;
        if (!targetDevice) {
            return [];
        }
        const query = `
                from(bucket: "${influxdb_1.influxDB.bucket}")
                    |> range(start: ${duration})
                    |> filter(fn: (r) => r["_measurement"] == "system_metrics")
                    |> filter(fn: (r) => r["device_id"] == "${targetDevice}")
                    |> filter(fn: (r) => r["_field"] == "cpu_load" or r["_field"] == "mem_percent")
                    |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
                    |> yield(name: "mean")
            `;
        try {
            const result = await influxdb_1.influxDB.queryApi.collectRows(query);
            const grouped = new Map();
            for (const row of result) {
                const timestamp = row._time;
                const field = row._field;
                const value = row._value;
                if (!grouped.has(timestamp)) {
                    grouped.set(timestamp, {});
                }
                const entry = grouped.get(timestamp);
                if (field === 'cpu_load') {
                    entry.cpu = value;
                }
                else if (field === 'mem_percent') {
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
        }
        catch (error) {
            console.error('[Metrics] Error querying InfluxDB:', error);
            return [];
        }
    }),
    getInterfaceMetrics: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        deviceIp: zod_1.z.string(),
        interfaceIndex: zod_1.z.number(),
        timeRange: zod_1.z.enum(['1m', '1h', '24h', '7d']).default('1h')
    }))
        .query(async ({ input }) => {
        const { deviceIp, interfaceIndex, timeRange } = input;
        const durationMap = {
            '1m': '-1m',
            '1h': '-1h',
            '24h': '-24h',
            '7d': '-7d'
        };
        const windowMap = {
            '1m': '5s',
            '1h': '1m',
            '24h': '5m',
            '7d': '30m'
        };
        const duration = durationMap[timeRange];
        const window = windowMap[timeRange];
        const query = `
                from(bucket: "${influxdb_1.influxDB.bucket}")
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
            const result = await influxdb_1.influxDB.queryApi.collectRows(query);
            console.log(`[Metrics Query] Found ${result.length} rows for ${deviceIp}`);
            const grouped = new Map();
            for (const row of result) {
                const timestamp = row._time;
                const field = row._field;
                const value = row._value;
                if (!grouped.has(timestamp)) {
                    grouped.set(timestamp, {});
                }
                const entry = grouped.get(timestamp);
                if (field === 'ifInOctets') {
                    entry.bytesIn = value;
                }
                else if (field === 'ifOutOctets') {
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
        }
        catch (error) {
            console.error('[Metrics] Error querying InfluxDB:', error);
            return [];
        }
    })
});
