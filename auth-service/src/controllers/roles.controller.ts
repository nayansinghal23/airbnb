import { Request, Response } from 'express';

import { assignUserRole, fetchAllRoles, fetchRoleById } from '../services/roles.service';

export const getRoleByIdController = async (req: Request, res: Response) => {
    const roleId = req.params.roleId;

    if (!roleId) {
        return res.status(400).json({
          success: false,
          message: "Role ID is required",
        });
    }

    const id = Number(roleId);

    if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role ID",
        });
    }

    try {
        const role = await fetchRoleById(id);
        if (!role) {
            return res.status(404).json({
              success: false,
              message: `Role with ID ${id} not found`,
            });
        }
    
        return res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: role,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch role",
        });
    }
}

export const getAllRolesController = async (req: Request, res: Response) => {
    try {
      const roles = await fetchAllRoles();
  
      return res.status(200).json({
        success: true,
        message: "Roles fetched successfully",
        data: roles,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch roles",
      });
    }
};

export const assignRoleToUser = async (req: Request, res: Response) => {
  const { userId, roleId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  if (!roleId) {
    return res.status(400).json({
      success: false,
      message: "Role ID is required",
    });
  }

  const userIdInt = Number(userId);
  const roleIdInt = Number(roleId);

  if (!Number.isInteger(userIdInt)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  if (!Number.isInteger(roleIdInt)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role ID",
    });
  }

  try {
    await assignUserRole(userIdInt, roleIdInt);

    return res.status(200).json({
      success: true,
      message: "Role assigned to user successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to assign role to user",
    });
  }
}