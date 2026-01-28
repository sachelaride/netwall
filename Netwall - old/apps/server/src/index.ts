import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers/appRouter';
export type { AppRouter } from './routers/appRouter';
import { createContext } from './context';
import { monitoredDevices, syncMonitoredDevices } from './routers/snmpRouter';
import { SnmpService } from './services/snmp';
import { influxDB } from './services/influxdb';
import { Point } from '@influxdata/influxdb-client';
import fs from 'fs';
import path from 'path';
import { Server as SocketServer } from 'socket.io';
import http from 'http';

const LOG_FILE = path.join(process.cwd(), 'poller_debug.log');

function logDebug(msg: string) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    try {
        fs.appendFileSync(LOG_FILE, line);
    } catch (e) { }
    console.log(msg);
}

// Inicializa o app Express
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: '*', // Adjust for production
        methods: ['GET', 'POST']
    }
});

const snmpService = new SnmpService();

// Habilita CORS para permitir requisições do frontend
app.use(cors());
app.use(express.json());

const port = 3001;

// Endpoint principal do tRPC
app.use(
    '/trpc',
    createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);

// Rota de teste básica (Health Check simples fora do tRPC)
app.get('/', (req, res) => {
    res.json({ message: 'Netwall API' });
});

logDebug('Server started, debug log initialized');

// Initialize monitoring from DB
syncMonitoredDevices().then(devices => {
    logDebug(`Restored ${devices.length} monitored devices from DB`);
}).catch(err => {
    logDebug(`Error restoring monitored devices: ${err.message}`);
});

// Polling Loop for SNMP Monitoring
setInterval(async () => {
    if (monitoredDevices.length === 0) {
        logDebug(`[SNMP Poller] No devices to poll`);
        return;
    }

    logDebug(`[SNMP Poller] Monitoring ${monitoredDevices.length} devices: ${monitoredDevices.map(d => d.ip).join(', ')}`);

    for (const device of monitoredDevices) {
        try {
            if (device.interfaces.length === 0) {
                logDebug(`[SNMP Poller] Skipping ${device.ip} (Zero interfaces monitored)`);
                continue;
            }
            logDebug(`[SNMP Poller] Fetching metrics for ${device.ip} (Interfaces: ${device.interfaces.join(',')})`);
            const metrics = await snmpService.getTrafficMetrics(device.ip, device.community, device.interfaces, logDebug);

            logDebug(`[SNMP Poller] ${device.ip} returned ${metrics.length} interface metrics`);

            if (metrics.length > 0) {
                metrics.forEach(m => {
                    const point = new Point('interface_traffic')
                        .tag('device', device.ip)
                        .tag('interface_index', m.index.toString())
                        .floatField('ifInOctets', Number(m.in))
                        .floatField('ifOutOctets', Number(m.out));

                    influxDB.writeApi.writePoint(point);
                    logDebug(`  - Intf ${m.index}: In=${m.in}, Out=${m.out}`);
                });

                await influxDB.writeApi.flush();
                logDebug(`[SNMP Poller] Data flushed to InfluxDB for ${device.ip}`);
            }
        } catch (error: any) {
            logDebug(`[SNMP Poller] ERROR polling ${device.ip}: ${error?.message || error}`);
        }
    }
}, 10000);

// Socket.io Handlers for Remote Access
io.on('connection', (socket) => {
    const agentId = socket.handshake.query.agentId as string;
    if (agentId) {
        logDebug(`[Socket] Agent ${agentId} connected`);
        socket.join(`agent:${agentId}`);
    }

    socket.on('join-session', (data: { agentId: string }) => {
        logDebug(`[Socket] User joining session for agent ${data.agentId}`);
        socket.join(`session:${data.agentId}`);
        // Request agent to start streaming
        io.to(`agent:${data.agentId}`).emit('request-stream-start');
    });

    socket.on('leave-session', (data: { agentId: string }) => {
        logDebug(`[Socket] User leaving session for agent ${data.agentId}`);
        socket.leave(`session:${data.agentId}`);
        // If no more users in session, stop agent stream
        const room = io.sockets.adapter.rooms.get(`session:${data.agentId}`);
        if (!room || room.size === 0) {
            io.to(`agent:${data.agentId}`).emit('request-stream-stop');
        }
    });

    socket.on('stream-frame', (data: { agentId: string, frame: string }) => {
        // Broadcast frame to all users in the session room
        io.to(`session:${data.agentId}`).emit('stream-frame', data.frame);
    });

    socket.on('disconnect', () => {
        if (agentId) {
            logDebug(`[Socket] Agent ${agentId} disconnected`);
        }
    });
});

// Inicia o servidor na porta definida
server.listen(port, () => {
    logDebug(`Server running on http://localhost:${port}`);
});
