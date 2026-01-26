import { InfluxDB } from '@influxdata/influxdb-client';

// Configuration (should come from env vars)
// Hardcoding the token for the current environment to ensure it works
const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN || '';
const org = process.env.INFLUX_ORG || 'netmonitor';
const bucket = process.env.INFLUX_BUCKET || 'metrics';

if (token === 'my-token' || !token) {
    console.warn('[InfluxDB Service] WARNING: InfluxDB token is missing or default. Ingestion will fail.');
} else {
    console.log('[InfluxDB Service] Initialized:', {
        url,
        org,
        bucket,
        tokenPrefix: token.substring(0, 5) + '...'
    });
}

const influxDBClient = new InfluxDB({ url, token });

export const influxDB = {
    client: influxDBClient,
    writeApi: influxDBClient.getWriteApi(org, bucket),
    queryApi: influxDBClient.getQueryApi(org),
    org,
    bucket,
    // Helper to query rows more easily
    queryRows: async (query: string) => {
        return await influxDBClient.getQueryApi(org).collectRows(query);
    }
};
