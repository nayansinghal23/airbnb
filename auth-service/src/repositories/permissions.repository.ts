import { prisma } from "../lib/prisma";

import { CreatePermissionDTO, UpdatePermissionDTO } from "../dto/permissions.dto";

export const getPermissionById = async (id: number) => {
    const permission = await prisma.permission.findUnique({
        where: { id },
    });
    return permission;
}

export const getPermissionByName = async (name: string) => {
    const permission = await prisma.permission.findUnique({
        where: { name },
    });
    return permission;
}

export const getAllPermissions = async () => {
    const permission = await prisma.permission.findMany();
    return permission;
}

export const createPermission = async (data: CreatePermissionDTO) => {
    const permission = await prisma.permission.create({ data });
    return permission;
}

export const deletePermissionById = async (id: number) => {
    const permission = await prisma.permission.delete({
        where: { id },
    });
    return permission;
}

export const updatePermission = async (data: UpdatePermissionDTO) => {
    const permission = await prisma.permission.update({
        where: { id: data.id },
        data
    });
    return permission;
}