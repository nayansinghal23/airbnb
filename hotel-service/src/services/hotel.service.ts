import { createHotel, getAllHotels, getHotelById } from "../repositories/hotel.repository";

import { CreateHotelDTO } from "../dto/hotel.dto";

export async function createHotelService(hotel: CreateHotelDTO) {
    return createHotel(hotel);
}

export async function getHotelByIdService(id: number) {
    return getHotelById(id);
}

export async function getAllHotelsService() {
    return getAllHotels();
}