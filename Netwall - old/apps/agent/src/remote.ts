import { io, Socket } from 'socket.io-client';
import screenshot from 'screenshot-desktop';

export class RemoteAccessModule {
    private socket: Socket;
    private isStreaming = false;
    private streamInterval: NodeJS.Timeout | null = null;

    constructor(serverUrl: string, private agentId: string) {
        this.socket = io(serverUrl, {
            query: { agentId }
        });

        this.setupHandlers();
    }

    private setupHandlers() {
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

    private async startStreaming() {
        if (this.isStreaming) return;
        this.isStreaming = true;

        console.log('[Remote] Starting desktop stream');
        this.streamInterval = setInterval(async () => {
            try {
                const img = await screenshot({ format: 'jpg' });
                this.socket.emit('stream-frame', {
                    agentId: this.agentId,
                    frame: img.toString('base64')
                });
            } catch (err) {
                console.error('[Remote] Capture error:', err);
            }
        }, 500); // 2 FPS for now to keep it simple
    }

    private stopStreaming() {
        this.isStreaming = false;
        if (this.streamInterval) {
            clearInterval(this.streamInterval);
            this.streamInterval = null;
        }
        console.log('[Remote] Desktop stream stopped');
    }
}
