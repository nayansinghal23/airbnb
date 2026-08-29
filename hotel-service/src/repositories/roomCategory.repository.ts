import { prisma } from "../lib/prisma";

export async function findRoomCategoryById(id: number) {
    const roomCategory = await prisma.roomCategory.findUnique({
        where: { id },
    });
    return roomCategory;
}

export async function findRoomCategoriesByHotelId(hotelId: number) {
    const roomCategories = await prisma.roomCategory.findMany({
        where: { hotelId },
    });
    return roomCategories;
}