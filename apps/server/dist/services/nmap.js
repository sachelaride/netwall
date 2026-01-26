"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanNetwork = scanNetwork;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function scanNetwork(subnet) {
    try {
        // -sn: Ping Scan - fast but no port info
        // -F: Fast scan (top 100 ports) - better for type detection
        // We will use -F if we want type detection
        console.log(`[Scanning] Starting scan on ${subnet}...`);
        // Using -F to get some port info for heuristic type detection
        // Note: Needs to be run as root/sudo for MAC address detection on many systems
        // but since we are in a local network monitoring context, it might be available.
        const { stdout } = await execAsync(`nmap -F ${subnet}`);
        return parseNmapOutput(stdout);
    }
    catch (error) {
        console.error('Nmap execution failed:', error);
        // Fallback to simpler scan if -F fails or permissions are restricted
        try {
            const { stdout } = await execAsync(`nmap -sn ${subnet}`);
            return parseNmapOutput(stdout);
        }
        catch (innerError) {
            throw new Error('Failed to execute network scan');
        }
    }
}
function detectDeviceType(vendor, hostname, openPorts) {
    const v = vendor.toLowerCase();
    const h = hostname.toLowerCase();
    // Heuristics
    if (v.includes('hp') || v.includes('canon') || v.includes('epson') || v.includes('lexmark') || openPorts.includes(9100) || openPorts.includes(515)) {
        return 'PRINTER';
    }
    if (v.includes('cisco') || v.includes('tp-link') || v.includes('d-link') || v.includes('ubiquiti') || v.includes('mikrotik') || v.includes('dell networking') || openPorts.includes(161)) {
        // If it's Dell Networking or has SNMP open, it's likely a switch or router
        if (h.includes('sw') || v.includes('networking'))
            return 'SWITCH';
        return 'ROUTER';
    }
    if (h.includes('srv') || h.includes('server') || openPorts.includes(80) || openPorts.includes(443) || openPorts.includes(3306) || openPorts.includes(5432)) {
        return 'SERVER';
    }
    if (v.includes('apple') || v.includes('intel') || v.includes('dell') || v.includes('microsoft') || openPorts.includes(3389)) {
        return 'WORKSTATION';
    }
    return 'OTHER';
}
function parseNmapOutput(output) {
    const results = [];
    const lines = output.split('\n');
    let currentHost = null;
    for (const line of lines) {
        if (line.startsWith('Nmap scan report for')) {
            if (currentHost?.ip) {
                currentHost.type = detectDeviceType(currentHost.vendor || '', currentHost.hostname || '', currentHost.openPorts || []);
                results.push(currentHost);
            }
            const parts = line.split(' ');
            const ipOrHost = parts[parts.length - 1].replace(/[()]/g, '');
            currentHost = {
                ip: ipOrHost,
                hostname: parts.length > 5 ? parts[4] : '',
                openPorts: [],
                type: 'OTHER'
            };
        }
        else if (line.includes('MAC Address:')) {
            if (currentHost) {
                const parts = line.split(' ');
                currentHost.mac = parts[2];
                // Extract vendor between parentheses
                const vendorMatch = line.match(/\((.*)\)/);
                currentHost.vendor = vendorMatch ? vendorMatch[1] : 'Unknown';
            }
        }
        else if (line.includes('/tcp') && line.includes('open')) {
            if (currentHost) {
                const port = parseInt(line.split('/')[0]);
                if (!isNaN(port)) {
                    currentHost.openPorts?.push(port);
                }
            }
        }
    }
    if (currentHost?.ip) {
        currentHost.type = detectDeviceType(currentHost.vendor || '', currentHost.hostname || '', currentHost.openPorts || []);
        results.push(currentHost);
    }
    return results;
}
