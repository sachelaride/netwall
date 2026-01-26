import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '../utils/prisma';

export const inventoryRouter = router({
    reportSoftware: protectedProcedure
        .input(z.object({
            deviceId: z.string(),
            software: z.array(z.string())
        }))
        .mutation(async ({ input }) => {
            const { deviceId, software } = input;

            // Find device first by ID or Hostname
            let device = await prisma.device.findUnique({
                where: { id: deviceId }
            });

            if (!device) {
                device = await prisma.device.findFirst({
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
                await prisma.$transaction([
                    prisma.softwareInventory.deleteMany({
                        where: { deviceId: device.id }
                    }),
                    prisma.softwareInventory.createMany({
                        data: software.map(name => ({
                            name,
                            deviceId: device.id
                        })),
                        skipDuplicates: true
                    })
                ]);
                return { success: true };
            } catch (error) {
                console.error('[Inventory] Error syncing software:', error);
                return { success: false };
            }
        }),

    getSoftwareByDevice: protectedProcedure
        .input(z.object({ deviceId: z.string() }))
        .query(async ({ input }) => {
            return prisma.softwareInventory.findMany({
                where: { deviceId: input.deviceId },
                orderBy: { name: 'asc' }
            });
        })
});
