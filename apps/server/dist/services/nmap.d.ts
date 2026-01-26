export type DeviceType = 'SERVER' | 'ROUTER' | 'SWITCH' | 'PRINTER' | 'WORKSTATION' | 'OTHER';
export interface ScanResult {
    ip: string;
    hostname: string;
    mac?: string;
    vendor?: string;
    openPorts: number[];
    type: DeviceType;
}
export declare function scanNetwork(subnet: string): Promise<ScanResult[]>;
