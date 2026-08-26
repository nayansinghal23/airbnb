import { prisma } from "../lib/prisma";

import { GetAvailableRoomsDTO, UpdateBookingIdToRoomsDTO } from "../dto/room.dto";

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

export async function findLatestDateByRoomCategoryId(roomCategoryId: number): Promise<Date | null> {
    const result = await prisma.room.findFirst({
        where: {
            roomCategoryId,
            deletedAt: null
        },
        select: {
            dateOfAvailability: true,
        },
        orderBy: {
            dateOfAvailability: 'desc'
        }
    });
    
    return result ? result.dateOfAvailability : null;
}

export async function findLatestDatesForAllCategories(): Promise<Array<{roomCategoryId: number, latestDate: Date}>> {
    const results = await prisma.room.groupBy({
        by: ['roomCategoryId'],
        where: {
            deletedAt: null
        },
        _max: {
            dateOfAvailability: true,
        },
    });
    
    return results
        .filter(result => result._max.dateOfAvailability !== null)
        .map(result => ({
            roomCategoryId: result.roomCategoryId,
            latestDate: result._max.dateOfAvailability!,
    }));
}

export async function findByRoomCategoryIdAndDateRange(dto: GetAvailableRoomsDTO) {
    return await prisma.room.findMany({
        where: {
            roomCategoryId: dto.roomCategoryId,
            bookingId: null,
            dateOfAvailability: {
                gte: dto.checkInDate,
                lte: dto.checkOutDate,
            },
            deletedAt: null,
            hotelId: dto.hotelId,
        }
    })
}

export async function updateBookingIdToRooms(dto: UpdateBookingIdToRoomsDTO) {
    return prisma.room.updateMany({
        where: {
            id: { in: dto.roomIds },
        },
        data: { bookingId: dto.bookingId },
    })
}