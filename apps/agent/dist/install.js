"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uninstallAgent = uninstallAgent;
exports.installAgent = installAgent;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const os_1 = __importDefault(require("os"));
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
async function uninstallAgent() {
    const isWindows = process.platform === 'win32';
    const targetDir = isWindows ? 'C:\\NetwallAgent' : '/opt/netwall-agent';
    const daemonDir = path_1.default.join(targetDir, 'daemon');
    const serviceName = 'NetwallAgent';
    const wrapperPath = path_1.default.join(daemonDir, `${serviceName}.exe`);
    console.log('[Uninstall] Starting cleanup...');
    if (isWindows) {
        // 0. Kill any hanging processes
        console.log('[Uninstall] Killing hanging processes if any...');
        try {
            (0, child_process_1.execSync)('taskkill /F /IM NetwallAgent.exe /T', { stdio: 'pipe' });
        }
        catch (e) { }
        try {
            (0, child_process_1.execSync)('taskkill /F /IM agent-win.exe /T', { stdio: 'pipe' });
        }
        catch (e) { }
        await sleep(500);
        if (fs_1.default.existsSync(wrapperPath)) {
            console.log('[Uninstall] Stopping and uninstalling service via wrapper...');
            try {
                (0, child_process_1.execSync)(`"${wrapperPath}" stop`, { stdio: 'pipe' });
            }
            catch (e) { }
            try {
                (0, child_process_1.execSync)(`"${wrapperPath}" uninstall`, { stdio: 'pipe' });
            }
            catch (e) { }
            await sleep(2000);
        }
        console.log('[Uninstall] Forcing cleanup via sc delete...');
        try {
            (0, child_process_1.execSync)(`sc stop ${serviceName}`, { stdio: 'pipe' });
        }
        catch (e) { }
        try {
            (0, child_process_1.execSync)(`sc delete ${serviceName}`, { stdio: 'pipe' });
        }
        catch (e) { }
        // Loop to wait until the service is actually gone or we timeout
        let isPresent = true;
        for (let i = 0; i < 5; i++) {
            try {
                (0, child_process_1.execSync)(`sc query ${serviceName}`, { stdio: 'pipe' });
                console.log(`[Uninstall] Service still present (marked for deletion?), waiting... (${i + 1}/5)`);
                await sleep(2000);
            }
            catch (e) {
                isPresent = false;
                break;
            }
        }
        if (isPresent) {
            console.warn('[Uninstall] WARNING: Service is still "marked for deletion".');
            console.warn('[Uninstall] PLEASE CLOSE ALL SERVICES.MSC AND TASK MANAGER WINDOWS NOW.');
        }
        else {
            console.log('[Uninstall] Service successfully removed.');
        }
        await sleep(1000);
    }
    else {
        console.log('[Uninstall] Removing systemd service...');
        try {
            (0, child_process_1.execSync)('systemctl stop netwall-agent');
            (0, child_process_1.execSync)('systemctl disable netwall-agent');
            if (fs_1.default.existsSync('/etc/systemd/system/netwall-agent.service')) {
                fs_1.default.unlinkSync('/etc/systemd/system/netwall-agent.service');
                (0, child_process_1.execSync)('systemctl daemon-reload');
            }
        }
        catch (e) { }
    }
}
async function installAgent(serverUrl) {
    const isWindows = process.platform === 'win32';
    const targetDir = isWindows ? 'C:\\NetwallAgent' : '/opt/netwall-agent';
    const exeName = isWindows ? 'agent-win.exe' : 'agent-linux';
    const targetExe = path_1.default.join(targetDir, exeName);
    const configPath = path_1.default.join(targetDir, 'config.json');
    console.log(`[Install] Starting installation to ${targetDir}...`);
    try {
        // 0. Cleanup first
        await uninstallAgent();
        // 1. Create directory
        if (!fs_1.default.existsSync(targetDir)) {
            fs_1.default.mkdirSync(targetDir, { recursive: true });
        }
        // 2. Copy current executable
        const currentExe = process.execPath;
        const isPackaged = process.pkg !== undefined;
        if (!isPackaged && (currentExe.toLowerCase().includes('node') || currentExe.toLowerCase().includes('tsx'))) {
            console.warn('[Install] Running in dev mode (node/tsx). Skipping executable copy.');
        }
        else {
            fs_1.default.copyFileSync(currentExe, targetExe);
            console.log(`[Install] Copied executable to ${targetExe}`);
            // 2.1 Configure Firewall (Windows Only)
            if (isWindows) {
                console.log('[Install] Configuring Windows Firewall rules...');
                try {
                    // Allow ICMP (Ping) so the scanner can find us
                    (0, child_process_1.execSync)('netsh advfirewall firewall add rule name="Netwall Agent - ICMP" protocol=icmpv4:8,any dir=in action=allow', { stdio: 'pipe' });
                    // Allow the agent executable
                    (0, child_process_1.execSync)(`netsh advfirewall firewall add rule name="Netwall Agent - App" dir=in action=allow program="${targetExe}" enable=yes`, { stdio: 'pipe' });
                    console.log('[Install] Firewall rules configured.');
                }
                catch (fwErr) {
                    console.log(`[Install] Note: Firewall rule already exists or error: ${fwErr.message}`);
                }
            }
        }
        // 3. Create or Update config.json
        const currentConfig = fs_1.default.existsSync(configPath) ? JSON.parse(fs_1.default.readFileSync(configPath, 'utf8')) : {};
        const config = {
            serverUrl: serverUrl || currentConfig.serverUrl || 'http://localhost:3001',
            agentId: os_1.default.hostname()
        };
        fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(`[Install] Configuration updated with server: ${config.serverUrl}`);
        // 4. Register Service
        if (isWindows) {
            console.log('[Install] Registering Windows Service using manual wrapper (winsw)...');
            try {
                const daemonDir = path_1.default.join(targetDir, 'daemon');
                if (!fs_1.default.existsSync(daemonDir))
                    fs_1.default.mkdirSync(daemonDir, { recursive: true });
                const serviceName = 'NetwallAgent';
                const wrapperPath = path_1.default.join(daemonDir, `${serviceName}.exe`);
                const xmlPath = path_1.default.join(daemonDir, `${serviceName}.xml`);
                // 1. Ensure wrapper & config
                const sourceWinsw = path_1.default.resolve(__dirname, '..', '..', '..', 'node_modules', 'node-windows', 'bin', 'winsw', 'winsw.exe');
                try {
                    fs_1.default.copyFileSync(sourceWinsw, wrapperPath);
                    console.log(`[Install] Extracted service wrapper: ${wrapperPath}`);
                }
                catch (copyErr) {
                    console.error(`[Install] Failed to copy winsw.exe: ${copyErr.message}`);
                    throw copyErr;
                }
                const xmlContent = `
<service>
  <id>${serviceName}</id>
  <name>Netwall Monitor Agent</name>
  <description>Netwall Monitor Agent Service</description>
  <executable>${targetExe}</executable>
  <workingdirectory>${targetDir}</workingdirectory>
  <startmode>Automatic</startmode>
  <log mode="roll"></log>
</service>`.trim();
                fs_1.default.writeFileSync(xmlPath, xmlContent);
                console.log(`[Install] Generated service config: ${xmlPath}`);
                // 3. Install and Start using the wrapper
                console.log('[Install] Installing service...');
                try {
                    (0, child_process_1.execSync)(`"${wrapperPath}" install`, { stdio: 'inherit' });
                    console.log('[Install] Service installed.');
                }
                catch (e) {
                    console.log('[Install] Service install finished.');
                }
                console.log('[Install] Configuring service for Auto Start...');
                try {
                    (0, child_process_1.execSync)(`sc config ${serviceName} start= auto`, { stdio: 'inherit' });
                }
                catch (e) { }
                console.log('[Install] Starting service...');
                try {
                    (0, child_process_1.execSync)(`"${wrapperPath}" start`, { stdio: 'inherit' });
                    console.log('[Install] Windows Service registered and started.');
                }
                catch (startErr) {
                    console.error(`[Install] Failed to start service: ${startErr.message}`);
                    console.log('[Install] Tip: Close Services.msc if open and try again.');
                    console.log('[Install] Check C:\\NetwallAgent\\daemon for error logs.');
                }
            }
            catch (err) {
                console.error(`[Install] Service registration failed: ${err.message}`);
                console.log('[Install] Tip: Ensure you are running as Administrator.');
            }
        }
        else {
            console.log('[Install] Registering Systemd Service...');
            const serviceFile = `[Unit]
Description=Netwall Monitor Agent
After=network.target

[Service]
Type=simple
ExecStart=${targetExe}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`;
            const unitPath = '/etc/systemd/system/netwall-agent.service';
            try {
                fs_1.default.writeFileSync(unitPath, serviceFile);
                (0, child_process_1.execSync)('systemctl daemon-reload');
                (0, child_process_1.execSync)('systemctl enable netwall-agent');
                (0, child_process_1.execSync)('systemctl start netwall-agent');
                console.log('[Install] Systemd service registered and started.');
            }
            catch (err) {
                console.error(`[Install] Failed to register Systemd Service: ${err.message}`);
                console.log('[Install] Tip: Run with sudo to register services.');
            }
        }
        console.log('[Install] Installation complete!');
    }
    catch (error) {
        console.error(`[Install] FATAL ERROR: ${error.message}`);
    }
}
