import axios from "axios";

const HOTEL_SERVICE_URL = 'http://localhost:3001/api/v1';

export async function getAvailableRooms(roomCategoryId: number, checkInDate: Date, checkOutDate: Date) {
    const response = await axios.get(`${HOTEL_SERVICE_URL}/room/available`, {
        params: {
            roomCategoryId, checkInDate, checkOutDate,
        }
    });
    return response.data.data;
}

export async function updateBookingIdToRooms(bookingId: number, roomIds: number[]) {
    const response = await axios.post(`${HOTEL_SERVICE_URL}/room/update-booking-id`, {
        bookingId,
        roomIds,
    });
    return response.data;
}