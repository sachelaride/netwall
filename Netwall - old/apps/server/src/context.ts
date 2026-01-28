import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    // Aqui poderíamos extrair o token do header authorization
    // const token = req.headers.authorization;

    return {
        req,
        res,
        user: { id: 'admin', role: 'ADMIN' }, // Mock user per plan
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
