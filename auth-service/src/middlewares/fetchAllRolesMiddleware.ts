import { Request, Response, NextFunction } from "express";

import { checkPermission } from "../services/roles.service";
import { verifyJWTToken } from "../utils/verifyJWTToken";

export const fetchAllRolesMiddleware = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies['access_token']
      const { userId }: any = verifyJWTToken(access_token);
      const id = Number(req.params.userId) || userId;

      if (!id || Number.isNaN(id)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const hasRole = await checkPermission(id, roles);
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