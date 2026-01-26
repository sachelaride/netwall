import fs from 'fs';
import path from 'path';
import os from 'os';

interface Config {
    serverUrl: string;
    agentId: string;
    metricsInterval?: number;
    inventoryInterval?: number;
}

// In packaged mode (pkg), execPath is the path to the exe. 
// In dev mode, it's the path to node/tsx.
const isPackaged = (process as any).pkg !== undefined;
const baseDir = isPackaged ? path.dirname(process.execPath) : process.cwd();
const CONFIG_FILE = path.join(baseDir, 'config.json');

const defaultConfig: Config = {
    serverUrl: 'http://localhost:3001',
    agentId: os.hostname(),
};

export function loadConfig(): Config {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf8');
            return { ...defaultConfig, ...JSON.parse(data) };
        }
    } catch (error) {
        console.warn('Failed to load config.json, using defaults or env');
    }

    return {
        serverUrl: process.env.SERVER_URL || defaultConfig.serverUrl,
        agentId: process.env.AGENT_ID || defaultConfig.agentId,
    };
}
