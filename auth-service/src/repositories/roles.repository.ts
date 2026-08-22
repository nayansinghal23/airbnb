import { prisma } from "../lib/prisma"

import { CreateRoleDTO, UpdateRoleDTO } from "../dto/role.dto";

export const getRoleById = async (id: number) => {
    const role = await prisma.role.findUnique({
        where: { id },
    });
    return role;
}

export const getRoleByName = async (name: string) => {
    const role = await prisma.role.findUnique({
        where: { name },
    });
    return role;
}

export const getAllRoles = async () => {
    const role = await prisma.role.findMany();
    return role;
}

export const createRole = async (data: CreateRoleDTO) => {
    const role = await prisma.role.create({
        data,
    });
    return role;
}

export const deleteRoleById = async (id: number) => {
    const role = await prisma.role.delete({
        where: { id },
    });
    return role;
}

export const updateRole = async (data: UpdateRoleDTO) => {
    const role = await prisma.role.update({
        where: { id: data.id },
        data
    });
    return role;
}