"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingHost = pingHost;
const child_process_1 = require("child_process");
const os_1 = require("os");
function pingHost(ip) {
    return new Promise((resolve) => {
        const isWin = (0, os_1.platform)() === 'win32';
        const command = isWin
            ? `ping -n 1 -w 1000 ${ip}`
            : `ping -c 1 -W 1 ${ip}`;
        console.log(`[Ping] Testing ${ip}...`);
        // Set a timeout to prevent hanging
        const timeout = setTimeout(() => {
            console.log(`[Ping] Timeout for ${ip}`);
            resolve(false);
        }, 2000); // 2 second timeout
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            clearTimeout(timeout);
            if (error) {
                console.log(`[Ping] Failed for ${ip}: ${error.message}`);
                resolve(false);
            }
            else {
                console.log(`[Ping] Success for ${ip}`);
                resolve(true);
            }
        });
    });
}
