import 'cross-fetch/polyfill';
import { getSystemMetrics, getInstalledSoftware } from './collector';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@netwall/server';
import os from 'os';
import { loadConfig } from './config';
import 'dotenv/config';

const config = loadConfig();
const AGENT_ID = config.agentId;
const SERVER_URL = config.serverUrl;

// Initialize tRPC client
const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: `${SERVER_URL}/trpc`,
        }),
    ],
});

async function reportSoftware() {
    try {
        console.log(`[Inventory] Collecting software list...`);
        const software = await getInstalledSoftware();
        // Since we don't have a specific "device ID" persistent in the agent yet, 
        // we'll try to identify by hostname or IP. For now, let's assume AGENT_ID is mapped on the server.
        // Actually, the server needs to find the device by IP or Hostname.
        // Let's refine the server's inventory router to handle hostname.
        await client.inventory.reportSoftware.mutate({
            deviceId: AGENT_ID, // Sending hostname as an identifier
            software
        });
        console.log(`[Inventory] Reported ${software.length} programs to server.`);
    } catch (e) {
        console.warn(`[Inventory] Failed to report software:`, e);
    }
}

import { RemoteAccessModule } from './remote';
import { installAgent, uninstallAgent } from './install';

async function startAgent() {
    // Command line handling
    const args = process.argv.slice(2);

    if (args.includes('--uninstall')) {
        await uninstallAgent();
        process.exit(0);
    }

    if (args.includes('--install')) {
        const serverUrlArg = args.find(a => a.startsWith('--server='))?.split('=')[1];
        await installAgent(serverUrlArg);
        process.exit(0);
    }

    console.log(`Starting Netwall Agent on ${AGENT_ID}...`);
    console.log(`Target Server: ${SERVER_URL}`);

    // Initialize remote access
    new RemoteAccessModule(SERVER_URL, AGENT_ID);

    // Initial report
    await reportSoftware();

    // Routine metrics loop
    const metricsInterval = (config as any).metricsInterval || 5000;
    setInterval(async () => {
        try {
            const metrics = await getSystemMetrics();
            console.log(`[${new Date().toISOString()}] Perf: CPU=${metrics.cpu.load.toFixed(1)}%, RAM=${metrics.memory.percent.toFixed(1)}%`);
            try {
                await client.metrics.ingest.mutate(metrics);
            } catch (sendError) {
                console.error('Failed to send metrics to server:', sendError instanceof Error ? sendError.message : sendError);
            }
        } catch (error) {
            console.error('Error collecting metrics:', error);
        }
    }, metricsInterval);

    // Software inventory report loop
    const inventoryInterval = (config as any).inventoryInterval || 3600000; // Default 1 hour
    setInterval(reportSoftware, inventoryInterval);
}

startAgent();
