import { InfluxDB } from '@influxdata/influxdb-client';
export declare const influxDB: {
    client: InfluxDB;
    writeApi: import("@influxdata/influxdb-client").WriteApi;
    queryApi: import("@influxdata/influxdb-client").QueryApi;
    org: string;
    bucket: string;
    queryRows: (query: string) => Promise<unknown[]>;
};
