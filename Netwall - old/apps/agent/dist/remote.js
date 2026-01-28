"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteAccessModule = void 0;
const socket_io_client_1 = require("socket.io-client");
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
class RemoteAccessModule {
    constructor(serverUrl, agentId) {
        this.agentId = agentId;
        this.isStreaming = false;
        this.streamInterval = null;
        this.socket = (0, socket_io_client_1.io)(serverUrl, {
            query: { agentId }
        });
        this.setupHandlers();
    }
    setupHandlers() {
        this.socket.on('connect', () => {
            console.log('[Remote] Connected to signaling server');
        });
        this.socket.on('request-stream-start', (data) => {
            console.log('[Remote] Stream request received');
            // In a real app, we'd prompt the user here or check permissions
            this.startStreaming();
        });
        this.socket.on('request-stream-stop', () => {
            console.log('[Remote] Stream stop received');
            this.stopStreaming();
        });
        this.socket.on('disconnect', () => {
            this.stopStreaming();
        });
    }
    async startStreaming() {
        if (this.isStreaming)
            return;
        this.isStreaming = true;
        console.log('[Remote] Starting desktop stream');
        this.streamInterval = setInterval(async () => {
            try {
                const img = await (0, screenshot_desktop_1.default)({ format: 'jpg' });
                this.socket.emit('stream-frame', {
                    agentId: this.agentId,
                    frame: img.toString('base64')
                });
            }
            catch (err) {
                console.error('[Remote] Capture error:', err);
            }
        }, 500); // 2 FPS for now to keep it simple
    }
    stopStreaming() {
        this.isStreaming = false;
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
            this.streamInterval = null;
        }
        console.log('[Remote] Desktop stream stopped');
    }
}
exports.RemoteAccessModule = RemoteAccessModule;
