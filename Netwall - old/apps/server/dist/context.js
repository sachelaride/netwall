"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = void 0;
const createContext = ({ req, res }) => {
    // Aqui poderíamos extrair o token do header authorization
    // const token = req.headers.authorization;
    return {
        req,
        res,
        user: { id: 'admin', role: 'ADMIN' }, // Mock user per plan
    };
};
exports.createContext = createContext;
