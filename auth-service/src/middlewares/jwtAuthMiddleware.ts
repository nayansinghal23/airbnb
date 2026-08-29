import { Request, Response, NextFunction } from 'express'

import { verifyJWTToken } from '../utils/verifyJWTToken';

import { loginService } from '../services/user.service';

export const jwtAuthMiddlware = async (req: Request, res: Response, next: NextFunction) => {
    const publicPaths = ['/login', '/register', "/logout"];
    if (publicPaths.includes(req.path)) return next();

    const access_token = req.cookies['access_token']
    if(!access_token) {
        return res.status(401).json({
            message: "Unauthenticated user"
        });
    }

    const payload = verifyJWTToken(access_token);
    const { userId, email }: any = payload;

    const user = await loginService(email);
    if(!user || !user.id || user.id !== userId) {
        return res.status(401).json({
            message: "Unauthenticated user"
        });
    }

    (req as any).userId = user.id;
    next();
}