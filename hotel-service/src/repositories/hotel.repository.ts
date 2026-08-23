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