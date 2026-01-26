import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { connectedAgents } from '../agentState';
import { Server as SocketServer } from 'socket.io';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'poller_debug.log');

function logDebug(msg: string) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    try {
        fs.appendFileSync(LOG_FILE, line);
    } catch (e) { }
    console.log(msg);
}

// Simple in-memory store for active requests
// In a production app, this might be in Redis or DB
export const activeRequests = new Map<string, {
    agentId: string,
    mode: 'viewer' | 'administrator',
    status: 'pending' | 'granted' | 'rejected',
    timestamp: number,
    connectionId?: string
}>();

export const remoteRouter = router({
    requestAccess: protectedProcedure
        .input(z.object({
            agentId: z.string(),
            mode: z.enum(['viewer', 'administrator'])
        }))
        .mutation(async ({ input, ctx }) => {
            logDebug(`[RemoteRouter] requestAccess called for agent ${input.agentId}, mode: ${input.mode}`);
            logDebug(`[RemoteRouter] ctx.io available: ${!!ctx.io}`);
            logDebug(`[RemoteRouter] connectedAgents: ${JSON.stringify(Array.from(connectedAgents.keys()))}`);

            const agent = connectedAgents.get(input.agentId);
            if (!agent) {
                logDebug(`[RemoteRouter] Agent ${input.agentId} not found in connectedAgents`);
                throw new Error('Agent offline or not found');
            }

            const requestId = Math.random().toString(36).substring(7);
            activeRequests.set(requestId, {
                agentId: input.agentId,
                mode: input.mode,
                status: 'pending',
                timestamp: Date.now()
            });

            // Emit the access request directly to the agent via Socket.io
            if (ctx.io) {
                const room = `agent:${input.agentId}`;
                logDebug(`[RemoteRouter] Emitting to room: ${room}`);
                ctx.io.to(room).emit('access-request', {
                    requestId,
                    mode: input.mode
                });
                logDebug(`[RemoteRouter] Sent access-request to agent ${input.agentId} for request ${requestId}`);
            } else {
                logDebug('[RemoteRouter] Socket.io instance not available in context');
            }

            return { requestId };
        }),

    checkRequestStatus: protectedProcedure
        .input(z.object({ requestId: z.string() }))
        .query(({ input }) => {
            const request = activeRequests.get(input.requestId);
            if (!request) return { status: 'rejected' };
            return {
                status: request.status,
                mode: request.mode,
                connectionId: request.connectionId
            };
        }),
});
