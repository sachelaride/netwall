import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './apps/server/src/routers/appRouter';

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc',
        }),
    ],
});

async function test() {
    try {
        const devices = await client.scan.getDevices.query({});
        console.log('Devices:', JSON.stringify(devices, null, 2));
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
