import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { metricsRouter } from './metrics';
import { scanRouter } from './scanRouter';
import { snmpRouter } from './snmpRouter';
import { monitoringRouter } from './monitoringRouter';
import { inventoryRouter } from './inventoryRouter';
import { dashboardRouter } from './dashboardRouter';
import { reportRouter } from './reportRouter';

// Router principal da aplicação
export const appRouter = router({
    // Sub-router de métricas (Ingest + Query)
    metrics: metricsRouter,

    // Sub-router de scanning
    scan: scanRouter,

    // Sub-router de SNMP
    snmp: snmpRouter,

    // Sub-router de monitoramento adicional (Interface traffic etc)
    monitoring: monitoringRouter,

    // Sub-router de inventário de software
    inventory: inventoryRouter,

    // Sub-router de dashboard
    dashboard: dashboardRouter,

    // Sub-router de relatórios (PDF)
    reports: reportRouter,

    // Rota de exemplo para health check
    health: publicProcedure.query(() => {
        return { status: 'ok', uptime: process.uptime() };
    }),

    // Exemplo de rota com validação de input
    hello: publicProcedure
        .input(z.object({ name: z.string().optional() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.name ?? 'World'} from Netwall!`,
            };
        }),
});

// Exporta o tipo do router para uso no frontend
export type AppRouter = typeof appRouter;
