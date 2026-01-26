import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { Server as SocketServer } from 'socket.io';

export const createContext = ({ req, res }: CreateExpressContextOptions, io?: SocketServer) => {
    // Aqui poderíamos extrair o token do header authorization
    // const token = req.headers.authorization;

    return {
        req,
        res,
        io, // Socket.io instance for real-time communication
        user: { id: 'admin', role: 'ADMIN' }, // Mock user per plan
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;
