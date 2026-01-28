"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
// Inicialização do tRPC com Contexto Tipado
const t = server_1.initTRPC.context().create();
// Middleware de autenticação simples
const isAuthed = t.middleware(({ next, ctx }) => {
    // TODO: Implementar verificação real de token (JWT)
    // Por enquanto, permite tudo para facilitar o desenvolvimento inicial
    return next({
        ctx: {
            user: { id: 'admin', role: 'ADMIN' },
        },
    });
});
exports.router = t.router;
exports.publicProcedure = t.procedure;
exports.protectedProcedure = t.procedure.use(isAuthed);
