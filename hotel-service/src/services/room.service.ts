import { GetAvailableRoomsDTO, UpdateBookingIdToRoomsDTO } from "../dto/room.dto";

import { findByRoomCategoryIdAndDateRange, updateBookingIdToRooms } from "../repositories/room.repository";

export async function getAvailableRoomsService(dto: GetAvailableRoomsDTO) {
    return await findByRoomCategoryIdAndDateRange(dto);
}

export async function updateBookingIdToRoomsService(dto: UpdateBookingIdToRoomsDTO) {
    return await updateBookingIdToRooms(dto);
}