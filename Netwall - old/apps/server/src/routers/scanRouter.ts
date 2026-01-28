import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { scanNetwork } from '../services/nmap';
import { prisma } from '../utils/prisma';
import { SnmpService } from '../services/snmp';

const snmpService = new SnmpService();

export const scanRouter = router({
    // Rota para iniciar um scan rápido
    quickScan: protectedProcedure
        .input(z.object({ subnet: z.string().optional() }))
        .mutation(async ({ input }) => {
            const target = input.subnet || '192.168.1.0/24';
            const results = await scanNetwork(target);

            console.log(`[Scan] Found ${results.length} devices on ${target}. Enriching with SNMP...`);

            // Persist to database with SNMP enrichment
            const enrichmentPromises = results.map(async (device) => {
                // Try SNMP probe to get better name and model
                const snmpData = await snmpService.probeDevice(device.ip);

                let finalType = device.type;
                let finalName = device.hostname || device.ip;
                let finalModel = null;

                if (snmpData) {
                    if (snmpData.sysName) {
                        finalName = snmpData.sysName;
                    }
                    if (snmpData.sysDescr) {
                        finalModel = snmpData.sysDescr;
                        const desc = snmpData.sysDescr.toLowerCase();
                        // Heuristic override based on SNMP description
                        if (desc.includes('switch') || desc.includes('networking')) {
                            finalType = 'SWITCH';
                        } else if (desc.includes('router') || desc.includes('gateway')) {
                            finalType = 'ROUTER';
                        }
                    }
                }

                return prisma.device.upsert({
                    where: { ipAddress: device.ip },
                    update: {
                        name: finalName,
                        model: finalModel,
                        hostname: device.hostname,
                        macAddress: device.mac,
                        type: finalType as any,
                        status: 'ONLINE',
                        lastSeen: new Date(),
                    },
                    create: {
                        name: finalName,
                        model: finalModel,
                        ipAddress: device.ip,
                        hostname: device.hostname,
                        macAddress: device.mac,
                        type: finalType as any,
                        status: 'ONLINE',
                        lastSeen: new Date(),
                    },
                });
            });

            await Promise.all(enrichmentPromises);

            return { target, devices: results };
        }),

    // Rota para obter dispositivos armazenados com filtros
    getDevices: protectedProcedure
        .input(z.object({
            search: z.string().optional(),
            type: z.string().optional(),
            department: z.string().optional(),
            sortBy: z.string().optional(),
            sortOrder: z.enum(['asc', 'desc']).optional(),
        }).optional())
        .query(async ({ input }) => {
            const where: any = {};

            if (input?.search) {
                // Check if it's an IP range (e.g., 192.168.0.1-192.168.0.50)
                if (input.search.includes('-')) {
                    const parts = input.search.split('-').map(p => p.trim());
                    if (parts.length === 2) {
                        where.ipAddress = {
                            gte: parts[0],
                            lte: parts[1]
                        };
                    }
                } else {
                    where.OR = [
                        { name: { contains: input.search, mode: 'insensitive' } },
                        { ipAddress: { contains: input.search, mode: 'insensitive' } },
                        { hostname: { contains: input.search, mode: 'insensitive' } },
                        { user: { contains: input.search, mode: 'insensitive' } },
                    ];
                }
            }

            if (input?.type && input.type !== 'all') {
                where.type = input.type.toUpperCase();
            }

            if (input?.department) {
                where.department = { contains: input.department, mode: 'insensitive' };
            }

            // Mapeamento de campos do frontend para o Prisma
            const sortMapping: any = {
                name: 'name',
                ip: 'ipAddress',
                utilizador: 'user',
                tipo: 'type',
                departamento: 'department'
            };

            const orderBy: any = {};
            const field = input?.sortBy ? sortMapping[input.sortBy] || 'ipAddress' : 'ipAddress';
            orderBy[field] = input?.sortOrder || 'asc';

            const devices = await prisma.device.findMany({
                where,
                orderBy,
            });

            // Map Prisma models back to what frontend expects
            return devices.map(d => ({
                id: d.id,
                ip: d.ipAddress,
                name: d.name,
                model: d.model || '',
                hostname: d.hostname || '',
                mac: d.macAddress || '',
                type: d.type.toLowerCase(),
                status: d.status.toLowerCase(),
                department: d.department || '',
                user: d.user || '',
                lastSeen: d.lastSeen?.toISOString(),
                lastLatency: (d as any).lastLatency,
                parentId: (d as any).parentId
            }));
        }),

    // Rota para definir o dispositivo pai (amarração)
    setParentDevice: protectedProcedure
        .input(z.object({
            deviceId: z.string(),
            parentId: z.string().nullable()
        }))
        .mutation(async ({ input }) => {
            return prisma.device.update({
                where: { id: input.deviceId },
                data: { parentId: input.parentId }
            });
        }),

    // Rota para atualizar um dispositivo
    updateDevice: protectedProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().optional(),
            type: z.string().optional(),
            department: z.string().optional(),
            user: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            const { id, ...data } = input;
            const updateData: any = { ...data };
            if (data.type) {
                updateData.type = data.type.toUpperCase();
            }

            return prisma.device.update({
                where: { id },
                data: updateData
            });
        }),

    // Rota para deletar um dispositivo
    deleteDevice: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await prisma.device.delete({
                where: { id: input.id }
            });
            return { success: true };
        }),

    // Rota para atualização em massa (Bulk Update)
    bulkUpdateDevices: protectedProcedure
        .input(z.object({
            ids: z.array(z.string()),
            department: z.string().optional(),
            user: z.string().optional(),
            type: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            const { ids, ...data } = input;
            const updateData: any = { ...data };
            if (data.type) {
                updateData.type = data.type.toUpperCase();
            }

            await prisma.device.updateMany({
                where: {
                    id: { in: ids }
                },
                data: updateData
            });

            return { success: true, count: ids.length };
        }),
});
