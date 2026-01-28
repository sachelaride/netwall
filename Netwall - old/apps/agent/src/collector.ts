import si from 'systeminformation';

export interface SystemMetrics {
    cpu: {
        load: number;
        cores: number[];
    };
    memory: {
        total: number;
        used: number;
        free: number;
        percent: number;
    };
    disk: Array<{
        fs: string;
        size: number;
        used: number;
        usePercent: number;
        mount: string;
    }>;
    network: Array<{
        iface: string;
        rx_bytes: number;
        tx_bytes: number;
        operstate: string;
    }>;
    uptime: number;
    timestamp: Date;
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
    const cpuLoad = await si.currentLoad();
    const mem = await si.mem();
    const fsSize = await si.fsSize();
    const networkStats = await si.networkStats();

    return {
        cpu: {
            load: cpuLoad.currentLoad,
            cores: cpuLoad.cpus.map((c) => c.load),
        },
        memory: {
            total: mem.total,
            used: mem.active,
            free: mem.available,
            percent: (mem.active / mem.total) * 100,
        },
        disk: fsSize.map(fs => ({
            fs: fs.fs,
            size: fs.size,
            used: fs.use,
            usePercent: fs.use / fs.size * 100,
            mount: fs.mount
        })),
        network: networkStats.map(net => ({
            iface: net.iface,
            rx_bytes: net.rx_bytes,
            tx_bytes: net.tx_bytes,
            operstate: net.operstate
        })),
        uptime: si.time().uptime,
        timestamp: new Date(),
    };
}

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getInstalledSoftware(): Promise<string[]> {
    try {
        if (process.platform === 'win32') {
            const { stdout } = await execAsync('wmic product get name');
            return stdout.split('\n').map(l => l.trim()).filter(l => l && l !== 'Name');
        } else if (process.platform === 'linux') {
            const { stdout } = await execAsync("dpkg-query -W -f='${Package}\n'");
            return stdout.split('\n').filter(l => l.trim());
        }
        return [];
    } catch (e) {
        console.error('Error fetching software list:', e);
        return [];
    }
}
