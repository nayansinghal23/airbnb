export interface GetAvailableRoomsDTO {
    roomCategoryId: number;
    hotelId: number;
    checkInDate: Date;
    checkOutDate: Date;
}

export interface UpdateBookingIdToRoomsDTO {
    bookingId: number
    roomIds: number[]
}