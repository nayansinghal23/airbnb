import { z } from 'zod';

export const createBookingSchema = z.object({
    hotelId: z.number().int().positive(),
    totalGuests: z.number().int().positive(),
    amount: z.number().int().positive(),
    checkInDate: z.string({ message: "Check-in date must be present" }),
    checkOutDate: z.string({ message: "Check-out date must be present" }),
    roomCategoryId: z.number({ message: "Room category-id must be present" }),
});