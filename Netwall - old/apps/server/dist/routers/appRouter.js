"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const metrics_1 = require("./metrics");
const scanRouter_1 = require("./scanRouter");
const snmpRouter_1 = require("./snmpRouter");
const monitoringRouter_1 = require("./monitoringRouter");
const inventoryRouter_1 = require("./inventoryRouter");
const dashboardRouter_1 = require("./dashboardRouter");
// Router principal da aplicação
exports.appRouter = (0, trpc_1.router)({
    // Sub-router de métricas (Ingest + Query)
    metrics: metrics_1.metricsRouter,
    // Sub-router de scanning
    scan: scanRouter_1.scanRouter,
    // Sub-router de SNMP
    snmp: snmpRouter_1.snmpRouter,
    // Sub-router de monitoramento adicional (Interface traffic etc)
    monitoring: monitoringRouter_1.monitoringRouter,
    // Sub-router de inventário de software
    inventory: inventoryRouter_1.inventoryRouter,
    // Sub-router de dashboard
    dashboard: dashboardRouter_1.dashboardRouter,
    // Rota de exemplo para health check
    health: trpc_1.publicProcedure.query(() => {
        return { status: 'ok', uptime: process.uptime() };
    }),
    // Exemplo de rota com validação de input
    hello: trpc_1.publicProcedure
        .input(zod_1.z.object({ name: zod_1.z.string().optional() }))
        .query(({ input }) => {
        return {
            greeting: `Hello ${input.name ?? 'World'} from Netwall!`,
        };
    }),
});
