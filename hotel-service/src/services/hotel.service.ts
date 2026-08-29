import { createHotel, fetchHotelsByOwnerId, getAllHotels, getHotelById, softDeleteHotel } from "../repositories/hotel.repository";
import { findRoomCategoriesByHotelId } from "../repositories/roomCategory.repository";

import { CreateHotelDTO } from "../dto/hotel.dto";

export async function createHotelService(hotel: CreateHotelDTO) {
    return createHotel(hotel);
}

export async function getHotelByIdService(id: number) {
    return getHotelById(id);
}

export async function fetchHotelsByOwnerIdService(ownerId: number) {
    return fetchHotelsByOwnerId(ownerId);
}

export async function getAllHotelsService() {
    return getAllHotels();
}

export async function softDeleteHotelService(hotelId: number) {
    return softDeleteHotel(hotelId);
}

export async function findRoomCategoriesByHotelIdService(hotelId: number) {
    return findRoomCategoriesByHotelId(hotelId);
}