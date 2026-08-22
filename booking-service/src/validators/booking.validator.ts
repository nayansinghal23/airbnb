import { z } from 'zod';

export const createBookingSchema = z.object({
    userId: z.number().int().positive(),
    hotelId: z.number().int().positive(),
    totalGuests: z.number().int().positive(),
    amount: z.number().int().positive(),
});