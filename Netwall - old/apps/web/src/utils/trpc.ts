import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@netwall/server';

export const trpc = createTRPCReact<AppRouter>();
