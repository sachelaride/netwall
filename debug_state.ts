
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const devices = await prisma.device.findMany();
    console.log('--- Devices in DB ---');
    console.log(JSON.stringify(devices, null, 2));

    const { connectedAgents } = require('./apps/server/src/agentState');
    console.log('\n--- Connected Agents ---');
    console.log(Array.from(connectedAgents.entries()));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
