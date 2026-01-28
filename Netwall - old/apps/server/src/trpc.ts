import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import { z } from 'zod';

// Inicialização do tRPC com Contexto Tipado
const t = initTRPC.context<Context>().create();

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

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
