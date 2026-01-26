import { io, Socket } from 'socket.io-client';
import screenshot from 'screenshot-desktop';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export class RemoteAccessModule {
    private socket: Socket;
    private isStreaming = false;
    private streamInterval: NodeJS.Timeout | null = null;
    private permissionMode: 'viewer' | 'administrator' | null = null;

    constructor(serverUrl: string, private agentId: string) {
        this.socket = io(serverUrl, {
            query: { agentId }
        });

        this.setupHandlers();
    }

    private vncProcess: any = null;

    private setupHandlers() {
        this.socket.on('connect', () => {
            console.log('[Remote] Connected to signaling server');
        });

        this.socket.on('access-request', async (data: { requestId: string, mode: 'viewer' | 'administrator' }) => {
            console.log(`[Remote] ===== ACCESS REQUEST RECEIVED =====`);
            console.log(`[Remote] RequestID: ${data.requestId}`);
            console.log(`[Remote] Mode: ${data.mode}`);
            console.log(`[Remote] About to show dialog...`);

            const granted = await this.promptUser(data.mode);

            console.log(`[Remote] User response: ${granted ? 'GRANTED' : 'REJECTED'}`);

            if (granted) {
                this.permissionMode = data.mode;
                console.log(`[Remote] Permission mode set to: ${this.permissionMode}`);

                // Start Embedded VNC Server
                try {
                    const vncConfig = await this.startVNCServer();
                    this.socket.emit('access-response', {
                        requestId: data.requestId,
                        granted: true,
                        vncConfig
                    });
                } catch (e) {
                    console.error('[Remote] Failed to start VNC:', e);
                    this.socket.emit('access-response', { requestId: data.requestId, granted: false });
                }
            } else {
                this.socket.emit('access-response', {
                    requestId: data.requestId,
                    granted: false
                });
            }
        });

        this.socket.on('stop-session', () => {
            this.stopVNCServer();
        });

        this.socket.on('request-stream-start', () => {
            console.log('[Remote] Stream start command received');
            this.startStreaming();
        });

        this.socket.on('request-stream-stop', () => {
            console.log('[Remote] Stream stop command received');
            this.stopStreaming();
        });

        this.socket.on('user-input', async (input: { type: string, data: any }) => {
            if (this.permissionMode !== 'administrator') return;

            try {
                if (input.type === 'mousemove') {
                    // Get screen resolution
                    const { stdout } = await execAsync('powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Screen]::PrimaryScreen.Bounds | Select-Object Width,Height | ConvertTo-Json"');
                    const screen = JSON.parse(stdout);
                    const x = Math.round(input.data.x * screen.Width);
                    const y = Math.round(input.data.y * screen.Height);

                    // Move mouse using PowerShell
                    await execAsync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})"`);

                } else if (input.type === 'mousedown') {
                    // Simulate mouse click using VBScript (more reliable for clicks)
                    const vbsScript = `
                    Set WshShell = WScript.CreateObject("WScript.Shell")
                    WshShell.SendKeys "{CLICK}"
                    `;
                    const fs = require('fs');
                    const tempFile = require('path').join(require('os').tmpdir(), 'click.vbs');
                    fs.writeFileSync(tempFile, vbsScript);
                    await execAsync(`cscript //nologo "${tempFile}"`);
                    fs.unlinkSync(tempFile);

                } else if (input.type === 'keydown') {
                    // Simulate keyboard using PowerShell SendKeys
                    const key = input.data.key;
                    let sendKey = key;

                    // Map special keys
                    const keyMap: any = {
                        'Enter': '{ENTER}',
                        'Backspace': '{BACKSPACE}',
                        'Tab': '{TAB}',
                        'Escape': '{ESC}',
                        'Delete': '{DELETE}',
                        'ArrowUp': '{UP}',
                        'ArrowDown': '{DOWN}',
                        'ArrowLeft': '{LEFT}',
                        'ArrowRight': '{RIGHT}',
                    };

                    if (keyMap[key]) {
                        sendKey = keyMap[key];
                    } else if (key.length === 1) {
                        sendKey = key;
                    } else {
                        return; // Ignore other special keys
                    }

                    await execAsync(`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('${sendKey}')"`);
                }
            } catch (err) {
                console.error('[Remote] Input simulation error:', err);
            }
        });

        this.socket.on('disconnect', () => {
            this.stopStreaming();
        });
    }

    private async promptUser(mode: string): Promise<boolean> {
        try {
            const title = "Netwall - Solicitação de Acesso Remoto";
            const modeText = mode === 'viewer' ? 'VISUALIZAÇÃO' : 'CONTROLE TOTAL (Administrador)';
            const message = `Um técnico está solicitando acesso de ${modeText} ao seu computador. Deseja permitir?`;

            // Create a temporary PowerShell script file
            const scriptContent = `
            Add-Type -AssemblyName PresentationFramework
            $result = [System.Windows.MessageBox]::Show('${message}', '${title}', 'YesNo', 'Question')
            if ($result -eq 'Yes') { Write-Output 'Yes' } else { Write-Output 'No' }
            `;

            const fs = require('fs');
            const path = require('path');
            const os = require('os');
            const tempScript = path.join(os.tmpdir(), `netwall_prompt_${Date.now()}.ps1`);

            fs.writeFileSync(tempScript, scriptContent);

            console.log(`[Remote] Executing prompt script: ${tempScript}`);

            // Executing with a timeout
            return new Promise((resolve) => {
                const child = require('child_process').spawn('powershell', [
                    '-NoProfile',
                    '-ExecutionPolicy', 'Bypass',
                    '-File', tempScript
                ]);

                let stdout = '';
                child.stdout.on('data', (data: any) => { stdout += data.toString(); });

                child.on('error', (err: any) => {
                    console.error('[Remote] Spawn error:', err);
                    resolve(false);
                });

                child.on('close', (code: number) => {
                    try { fs.unlinkSync(tempScript); } catch (e) { }
                    resolve(stdout.trim() === 'Yes');
                });

                // Timeout after 30 seconds
                setTimeout(() => {
                    if (!child.killed) child.kill();
                    resolve(false);
                }, 30000);
            });
        } catch (err) {
            console.error('[Remote] Permission prompt error:', err);
            return false;
        }
    }

    private async startStreaming() {
        if (this.isStreaming) return;
        this.isStreaming = true;
        // ... (remaining implementation stays same)

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

    private async startVNCServer(): Promise<{ port: number, password: string }> {
        const fs = require('fs');
        const path = require('path');
        const { spawn } = require('child_process');

        // Look for winvnc.exe in current dir or tools/ folder
        const possiblePaths = [
            path.join(process.cwd(), 'winvnc.exe'),
            path.join(process.cwd(), 'tools', 'winvnc.exe'),
            'C:\\NetwallAgent\\winvnc.exe'
        ];

        const vncPath = possiblePaths.find(p => fs.existsSync(p));
        if (!vncPath) {
            throw new Error('VNC executable (winvnc.exe) not found');
        }

        const port = 5901;
        const password = Math.random().toString(36).slice(-8);

        console.log(`[Remote] Starting VNC Server at ${vncPath} on port ${port}`);

        // Launch Embedded VNC
        // Assuming UltraVNC or similar that supports args or runs with default config we might overwrite
        // Real implementation would write ultravnc.ini here.
        this.vncProcess = spawn(vncPath, ['-run'], {
            detached: true,
            stdio: 'ignore'
        });

        // Open Firewall Port
        await execAsync(`powershell -Command "New-NetFirewallRule -DisplayName 'Netwall VNC' -Direction Inbound -LocalPort ${port} -Protocol TCP -Action Allow"`);

        return { port, password };
    }

    private stopVNCServer() {
        if (this.vncProcess) {
            try {
                process.kill(this.vncProcess.pid);
                console.log('[Remote] VNC Server stopped');
            } catch (e) {
                console.error('[Remote] Error stopping VNC:', e);
            }
            this.vncProcess = null;
        }

        // Close Firewall Port
        exec(`powershell -Command "Remove-NetFirewallRule -DisplayName 'Netwall VNC'"`, (err) => {
            if (err) console.error('[Remote] Failed to remove firewall rule:', err);
        });
    }
}
