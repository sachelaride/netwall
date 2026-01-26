import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { SnmpService } from '../services/snmp';
import { pingHost } from '../utils/ping';
import { prisma } from '../utils/prisma';

const snmpService = new SnmpService();

// We keep this for the poller to have an easy reference, 
// but we will sync it from the DB.
export let monitoredDevices: any[] = [];

// Helper to sync local state from DB
export async function syncMonitoredDevices() {
    const devices = await prisma.monitoredDevice.findMany();
    monitoredDevices = devices.map(d => ({
        ip: d.ip,
        community: d.community,
        interfaces: d.interfaces,
        status: d.status,
        lastScan: d.lastScan.getTime()
    }));
    return monitoredDevices;
}

export const snmpRouter = router({
    testConnection: protectedProcedure
        .input(z.object({ ip: z.string(), community: z.string() }))
        .mutation(async ({ input }) => {
            // 1. Ping Check
            const pingRes = await pingHost(input.ip);

            if (!pingRes.alive) {
                return {
                    success: false,
                    ping: false,
                    snmp: false,
                    message: 'Device unreachable (Ping failed)'
                } as const;
            }

            // 2. SNMP Check
            console.log(`[SNMP] Starting probe for ${input.ip} with community '${input.community}'`);
            const data = await snmpService.manualProbe(input.ip, input.community);
            console.log(`[SNMP] Probe completed for ${input.ip}, data:`, data ? 'SUCCESS' : 'FAILED');

            if (!data) {
                return {
                    success: false,
                    ping: true,
                    snmp: false,
                    message: 'Ping OK, but SNMP failed'
                } as const;
            }

            return {
                success: true,
                ping: true,
                snmp: true,
                data
            } as const;
        }),

    startMonitoring: protectedProcedure
        .input(z.object({
            ip: z.string(),
            community: z.string(),
            interfaces: z.array(z.number())
        }))
        .mutation(async ({ input }) => {
            await prisma.monitoredDevice.upsert({
                where: { ip: input.ip },
                update: {
                    community: input.community,
                    interfaces: input.interfaces,
                    status: 'up',
                    lastScan: new Date()
                },
                create: {
                    ip: input.ip,
                    community: input.community,
                    interfaces: input.interfaces,
                    status: 'up'
                }
            });

            await syncMonitoredDevices();
            console.log(`[Monitoring] PERSISTED monitoring for ${input.ip} on interfaces: ${input.interfaces.join(', ')}`);
            return { success: true };
        }),

    stopMonitoring: protectedProcedure
        .input(z.object({ ip: z.string() }))
        .mutation(async ({ input }) => {
            await prisma.monitoredDevice.delete({
                where: { ip: input.ip }
            });
            await syncMonitoredDevices();
            return { success: true };
        }),

    getMonitoredDevices: protectedProcedure
        .query(async () => {
            const monitored = await prisma.monitoredDevice.findMany();

            // Enrich was IP-only data with names from DB
            const enriched = await Promise.all(monitored.map(async (m) => {
                const device = await prisma.device.findUnique({
                    where: { ipAddress: m.ip },
                    select: { name: true }
                });
                return {
                    ...m,
                    name: device?.name || m.ip
                };
            }));
            return enriched;
        })
});
