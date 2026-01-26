import { influxDB } from './apps/server/src/services/influxdb';

async function test() {
    try {
        console.log("Querying InfluxDB for interface_traffic...");
        const query = `from(bucket: "${influxDB.bucket}") |> range(start: -5m) |> filter(fn: (r) => r._measurement == "interface_traffic")`;
        const result = await influxDB.queryApi.collectRows(query);
        console.log("Found rows:", result.length);
        if (result.length > 0) {
            console.log("First row summary:", {
                time: (result[0] as any)._time,
                device: (result[0] as any).device,
                field: (result[0] as any)._field,
                value: (result[0] as any)._value
            });
        }
    } catch (e) {
        console.error("Query failed:", e);
    }
}

test();
