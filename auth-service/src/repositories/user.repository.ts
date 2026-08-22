import { prisma } from "../lib/prisma"

import { UserDTO } from "../dto/user.dto"

export const createUser = async (data: UserDTO) => {
    const user = await prisma.user.create({ data });
    return user;
}

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });
    return user;
}

export const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    });
    return user;
}