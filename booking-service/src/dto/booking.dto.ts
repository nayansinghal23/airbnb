export interface CreateBookingDTO {
    userId: number
    hotelId: number
    totalGuests: number
    amount: number
    checkInDate: Date
    checkOutDate: Date
    roomCategoryId: number
};