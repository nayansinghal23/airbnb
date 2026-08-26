import { prisma } from "../lib/prisma";

export async function findByRoomCategoryIdAndDate(id: number, startDate: Date, endDate: Date) {
    return await prisma.room.findMany({
        where: {
            id,
            dateOfAvailability: {
                gte: startDate,
                lte: endDate
            },
            deletedAt: null,
        },
        select: {
            dateOfAvailability: true,
        }
    });
}

export async function bulkInsertRooms(data: any[]) {
    const result = await prisma.room.createMany({ data });
    return result.count;
}