import { prisma } from "../lib/prisma";

export async function findRoomCategoryById(id: number) {
    const roomCategory = await prisma.roomCategory.findUnique({
        where: { id },
    });
    return roomCategory;
}