import { Request, Response, NextFunction } from "express";

import { contiansAnyRole } from "../services/roles.service";

export const confirmAnyRoleMiddleware = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(401).json({
              success: false,
              message: "Unauthorized",
            });
        }

        const id = Number(userId);
        if(Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        try {
            const hasRole = await contiansAnyRole(id, roles);
            if (!hasRole) {
                return res.status(403).json({
                  success: false,
                  message: "Forbidden: You do not have any of the required roles",
                });
            }
    
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error checking user roles",
            });
        }
    }
}