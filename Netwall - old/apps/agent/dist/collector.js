"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemMetrics = getSystemMetrics;
exports.getInstalledSoftware = getInstalledSoftware;
const systeminformation_1 = __importDefault(require("systeminformation"));
async function getSystemMetrics() {
    const cpuLoad = await systeminformation_1.default.currentLoad();
    const mem = await systeminformation_1.default.mem();
    const fsSize = await systeminformation_1.default.fsSize();
    const networkStats = await systeminformation_1.default.networkStats();
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
        uptime: systeminformation_1.default.time().uptime,
        timestamp: new Date(),
    };
}
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function getInstalledSoftware() {
    try {
        if (process.platform === 'win32') {
            const { stdout } = await execAsync('wmic product get name');
            return stdout.split('\n').map(l => l.trim()).filter(l => l && l !== 'Name');
        }
        else if (process.platform === 'linux') {
            const { stdout } = await execAsync("dpkg-query -W -f='${Package}\n'");
            return stdout.split('\n').filter(l => l.trim());
        }
        return [];
    }
    catch (e) {
        console.error('Error fetching software list:', e);
        return [];
    }
}
