import { prisma } from "../lib/prisma";

export const getRolePermissionById = async (id: number) => {
    const rolePermission = await prisma.rolePermission.findUnique({
      where: { id },
    });
  
    return rolePermission;
};
  
export const getRolePermissionByRoleId = async (roleId: number) => {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
    });
  
    return rolePermissions;
};
  
export const addPermissionToRole = async (roleId: number, permissionId: number) => {
    const rolePermission = await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  
    return rolePermission;
};
  
export const removePermissionFromRole = async (roleId: number, permissionId: number) => {
    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
};
  
export const getAllRolePermissions = async () => {
    const rolePermissions = await prisma.rolePermission.findMany();
    return rolePermissions;
};