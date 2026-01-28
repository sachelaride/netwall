export interface NetworkInterface {
    index: number;
    description: string;
    mac: string;
    operStatus: number;
    adminStatus: number;
    speed?: number;
}
export interface SnmpData {
    sysDescr?: string;
    sysName?: string;
    interfaces: NetworkInterface[];
}
export declare class SnmpService {
    private communities;
    probeDevice(ip: string): Promise<SnmpData | null>;
    manualProbe(ip: string, community: string): Promise<SnmpData | null>;
    private getInterfaces;
    getTrafficMetrics(ip: string, community: string, interfaces: number[], logger?: (msg: string) => void): Promise<Array<{
        index: number;
        in: number;
        out: number;
    }>>;
}
