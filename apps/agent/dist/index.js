"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("cross-fetch/polyfill");
const collector_1 = require("./collector");
const client_1 = require("@trpc/client");
const config_1 = require("./config");
require("dotenv/config");
const config = (0, config_1.loadConfig)();
const AGENT_ID = config.agentId;
const SERVER_URL = config.serverUrl;
// Initialize tRPC client
const client = (0, client_1.createTRPCProxyClient)({
    links: [
        (0, client_1.httpBatchLink)({
            url: `${SERVER_URL}/trpc`,
        }),
    ],
});
async function reportSoftware() {
    try {
        console.log(`[Inventory] Collecting software list...`);
        const software = await (0, collector_1.getInstalledSoftware)();
        // Since we don't have a specific "device ID" persistent in the agent yet, 
        // we'll try to identify by hostname or IP. For now, let's assume AGENT_ID is mapped on the server.
        // Actually, the server needs to find the device by IP or Hostname.
        // Let's refine the server's inventory router to handle hostname.
        await client.inventory.reportSoftware.mutate({
            deviceId: AGENT_ID, // Sending hostname as an identifier
            software
        });
        console.log(`[Inventory] Reported ${software.length} programs to server.`);
    }
    catch (e) {
        console.warn(`[Inventory] Failed to report software:`, e);
    }
}
const remote_1 = require("./remote");
const install_1 = require("./install");
async function startAgent() {
    // Command line handling
    const args = process.argv.slice(2);
    if (args.includes('--uninstall')) {
        await (0, install_1.uninstallAgent)();
        process.exit(0);
    }
    if (args.includes('--install')) {
        const serverUrlArg = args.find(a => a.startsWith('--server='))?.split('=')[1];
        await (0, install_1.installAgent)(serverUrlArg);
        process.exit(0);
    }
    console.log(`Starting Netwall Agent on ${AGENT_ID}...`);
    console.log(`Target Server: ${SERVER_URL}`);
    // Initialize remote access
    new remote_1.RemoteAccessModule(SERVER_URL, AGENT_ID);
    // Initial report
    await reportSoftware();
    // Routine metrics loop
    const metricsInterval = config.metricsInterval || 5000;
    setInterval(async () => {
        try {
            const metrics = await (0, collector_1.getSystemMetrics)();
            console.log(`[${new Date().toISOString()}] Perf: CPU=${metrics.cpu.load.toFixed(1)}%, RAM=${metrics.memory.percent.toFixed(1)}%`);
            try {
                await client.metrics.ingest.mutate(metrics);
            }
            catch (sendError) {
                console.error('Failed to send metrics to server:', sendError instanceof Error ? sendError.message : sendError);
            }
        }
        catch (error) {
            console.error('Error collecting metrics:', error);
        }
    }, metricsInterval);
    // Software inventory report loop
    const inventoryInterval = config.inventoryInterval || 3600000; // Default 1 hour
    setInterval(reportSoftware, inventoryInterval);
}
startAgent();
