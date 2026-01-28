"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const prisma_1 = require("../utils/prisma");
exports.inventoryRouter = (0, trpc_1.router)({
    reportSoftware: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        deviceId: zod_1.z.string(),
        software: zod_1.z.array(zod_1.z.string())
    }))
        .mutation(async ({ input }) => {
        const { deviceId, software } = input;
        // Find device first by ID or Hostname
        let device = await prisma_1.prisma.device.findUnique({
            where: { id: deviceId }
        });
        if (!device) {
            device = await prisma_1.prisma.device.findFirst({
                where: { OR: [{ hostname: deviceId }, { ipAddress: deviceId }] }
            });
        }
        if (!device) {
            console.warn(`[Inventory] Device ${deviceId} not found. Skipping software report.`);
            return { success: false, error: 'Device not found' };
        }
        // Sync software: delete old and insert new (simple sync)
        try {
            // Transactional sync
            await prisma_1.prisma.$transaction([
                prisma_1.prisma.softwareInventory.deleteMany({
                    where: { deviceId: device.id }
                }),
                prisma_1.prisma.softwareInventory.createMany({
                    data: software.map(name => ({
                        name,
                        deviceId: device.id
                    })),
                    skipDuplicates: true
                })
            ]);
            return { success: true };
        }
        catch (error) {
            console.error('[Inventory] Error syncing software:', error);
            return { success: false };
        }
    }),
    getSoftwareByDevice: trpc_1.protectedProcedure
        .input(zod_1.z.object({ deviceId: zod_1.z.string() }))
        .query(async ({ input }) => {
        return prisma_1.prisma.softwareInventory.findMany({
            where: { deviceId: input.deviceId },
            orderBy: { name: 'asc' }
        });
    })
});
