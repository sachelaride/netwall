import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { influxDB } from '../services/influxdb';
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export const reportRouter = router({
    generateDeviceReport: protectedProcedure
        .input(z.object({
            deviceId: z.string().optional(),
            timeRange: z.enum(['1h', '24h', '7d']).default('1h')
        }))
        .mutation(async ({ input }) => {
            const doc = new PDFDocument({ margin: 50 });
            const stream = new PassThrough();
            const chunks: Buffer[] = [];

            stream.on('data', (chunk) => chunks.push(chunk));

            // Header
            doc.fillColor('#1e293b').fontSize(24).text('Netwall - Network Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).fillColor('#64748b').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
            doc.moveDown(2);

            // Devices Section
            doc.fontSize(18).fillColor('#0f172a').text('Monitored Devices', { underline: true });
            doc.moveDown();

            const devices = await prisma.device.findMany({
                where: input.deviceId ? { id: input.deviceId } : { status: 'ONLINE' },
                orderBy: { ipAddress: 'asc' }
            });

            devices.forEach((device, index) => {
                const d = device as any;
                doc.fontSize(12).fillColor('#334155').text(`${index + 1}. ${d.name} (${d.ipAddress})`);
                doc.fontSize(10).fillColor('#64748b').text(`   Type: ${d.type} | Status: ${d.status}`);
                doc.fontSize(10).fillColor('#64748b').text(`   Latency: ${d.lastLatency ? d.lastLatency.toFixed(2) + ' ms' : 'N/A'}`);
                doc.moveDown(0.5);
            });

            if (devices.length === 0) {
                doc.fontSize(12).fillColor('#ef4444').text('No active devices found for this report.');
            }

            doc.moveDown();

            // Stats Section (Brief)
            doc.fontSize(18).fillColor('#0f172a').text('Network Statistics Summary', { underline: true });
            doc.moveDown();
            doc.fontSize(12).fillColor('#334155').text(`Total Devices Monitored: ${devices.length}`);
            doc.text(`Report Period: Last ${input.timeRange}`);

            doc.end();

            return new Promise<{ base64: string }>((resolve) => {
                stream.on('end', () => {
                    const pdfBuffer = Buffer.concat(chunks);
                    resolve({ base64: pdfBuffer.toString('base64') });
                });
            });
        }),
});
