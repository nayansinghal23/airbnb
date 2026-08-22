import { Request, Response, NextFunction } from "express";

import { checkPermission } from "../services/roles.service";

export const fetchAllRolesMiddleware = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId || Number.isNaN(userId)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const hasRole = await checkPermission(userId, roles);
      if (!hasRole) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: You do not have the required roles",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking user roles",
      });
    }
  };
};