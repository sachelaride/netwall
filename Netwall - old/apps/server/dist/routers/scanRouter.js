"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const nmap_1 = require("../services/nmap");
const prisma_1 = require("../utils/prisma");
const snmp_1 = require("../services/snmp");
const snmpService = new snmp_1.SnmpService();
exports.scanRouter = (0, trpc_1.router)({
    // Rota para iniciar um scan rápido
    quickScan: trpc_1.protectedProcedure
        .input(zod_1.z.object({ subnet: zod_1.z.string().optional() }))
        .mutation(async ({ input }) => {
        const target = input.subnet || '192.168.1.0/24';
        const results = await (0, nmap_1.scanNetwork)(target);
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
                    }
                    else if (desc.includes('router') || desc.includes('gateway')) {
                        finalType = 'ROUTER';
                    }
                }
            }
            return prisma_1.prisma.device.upsert({
                where: { ipAddress: device.ip },
                update: {
                    name: finalName,
                    model: finalModel,
                    hostname: device.hostname,
                    macAddress: device.mac,
                    type: finalType,
                    status: 'ONLINE',
                    lastSeen: new Date(),
                },
                create: {
                    name: finalName,
                    model: finalModel,
                    ipAddress: device.ip,
                    hostname: device.hostname,
                    macAddress: device.mac,
                    type: finalType,
                    status: 'ONLINE',
                    lastSeen: new Date(),
                },
            });
        });
        await Promise.all(enrichmentPromises);
        return { target, devices: results };
    }),
    // Rota para obter dispositivos armazenados com filtros
    getDevices: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        search: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    }).optional())
        .query(async ({ input }) => {
        const where = {};
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
            }
            else {
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
        const sortMapping = {
            name: 'name',
            ip: 'ipAddress',
            utilizador: 'user',
            tipo: 'type',
            departamento: 'department'
        };
        const orderBy = {};
        const field = input?.sortBy ? sortMapping[input.sortBy] || 'ipAddress' : 'ipAddress';
        orderBy[field] = input?.sortOrder || 'asc';
        const devices = await prisma_1.prisma.device.findMany({
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
            lastSeen: d.lastSeen?.toISOString()
        }));
    }),
    // Rota para atualizar um dispositivo
    updateDevice: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        department: zod_1.z.string().optional(),
        user: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData = { ...data };
        if (data.type) {
            updateData.type = data.type.toUpperCase();
        }
        return prisma_1.prisma.device.update({
            where: { id },
            data: updateData
        });
    }),
    // Rota para deletar um dispositivo
    deleteDevice: trpc_1.protectedProcedure
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .mutation(async ({ input }) => {
        await prisma_1.prisma.device.delete({
            where: { id: input.id }
        });
        return { success: true };
    }),
    // Rota para atualização em massa (Bulk Update)
    bulkUpdateDevices: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        ids: zod_1.z.array(zod_1.z.string()),
        department: zod_1.z.string().optional(),
        user: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        const { ids, ...data } = input;
        const updateData = { ...data };
        if (data.type) {
            updateData.type = data.type.toUpperCase();
        }
        await prisma_1.prisma.device.updateMany({
            where: {
                id: { in: ids }
            },
            data: updateData
        });
        return { success: true, count: ids.length };
    }),
});
