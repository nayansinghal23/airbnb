import { prisma } from "../lib/prisma"

import { CreateHotelDTO } from "../dto/hotel.dto";

export const createHotel = async (data: CreateHotelDTO) => {
    const hotel = await prisma.hotel.create({ data });
    return hotel;
}

export const getHotelById = async (id: number) => {
    const hotel = await prisma.hotel.findUnique({
        where: { id },
    });
    return hotel;
}

export const getAllHotels = async () => {
    const hotels = await prisma.hotel.findMany({
        where: { deletedAt: null },
    });
    return hotels;
}

export const fetchHotelsByOwnerId = async (ownerId: number) => {
    const hotels = await prisma.hotel.findMany({
        where: { deletedAt: null, ownerId },
    });
    return hotels;
}

export const softDeleteHotel = async (id: number) => {
    const hotel = await prisma.hotel.update({
        where: { id },
        data: { deletedAt: new Date(), },
    });
    return hotel;
}