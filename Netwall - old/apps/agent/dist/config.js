"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const CONFIG_FILE = path_1.default.join(process.cwd(), 'config.json');
const defaultConfig = {
    serverUrl: 'http://localhost:3001',
    agentId: os_1.default.hostname(),
};
function loadConfig() {
    try {
        if (fs_1.default.existsSync(CONFIG_FILE)) {
            const data = fs_1.default.readFileSync(CONFIG_FILE, 'utf8');
            return { ...defaultConfig, ...JSON.parse(data) };
        }
    }
    catch (error) {
        console.warn('Failed to load config.json, using defaults or env');
    }
    return {
        serverUrl: process.env.SERVER_URL || defaultConfig.serverUrl,
        agentId: process.env.AGENT_ID || defaultConfig.agentId,
    };
}
