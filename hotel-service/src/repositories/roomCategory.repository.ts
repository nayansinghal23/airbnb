import { RoomType } from "@prisma/client";

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

export async function createRoomCategories(hotelId: number) {
    const roomCategories = [
        {
          price: 3000,
          roomType: RoomType.SINGLE,
          roomCount: 10,
        },
        {
          price: 4500,
          roomType: RoomType.DOUBLE,
          roomCount: 15,
        },
        {
          price: 6000,
          roomType: RoomType.FAMILY,
          roomCount: 8,
        },
        {
          price: 8000,
          roomType: RoomType.DELUXE,
          roomCount: 5,
        },
        {
          price: 12000,
          roomType: RoomType.SUITE,
          roomCount: 3,
        },
    ];
  return prisma.roomCategory.createMany({
    data: roomCategories.map((category) => ({
      ...category,
      hotelId,
    })),
  });
}