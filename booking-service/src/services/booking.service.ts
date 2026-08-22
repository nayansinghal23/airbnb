import { $Enums } from '@prisma/client';

import {
    changeBookingStatus,
    createBooking, 
    createIdempotencyKey,
    finalizeIdempotencyKey,
    getIdempotencyKeyWithLock
} from '../repositories/booking.repository';
import { generateIdempotencyKey } from '../utils/generateIdempotencyKey';
import { CreateBookingDTO } from '../dto/booking.dto';
import { prisma } from '../lib/prisma';
import { TTL, redLock } from '../config/redis.config';

export async function createBookingService(dto: CreateBookingDTO) {
    const bookingResource = `hotel:${dto.hotelId}`;
    try {
        await redLock.acquire([bookingResource], TTL);
        const booking = await createBooking({
            userId: dto.userId,
            hotelId: dto.hotelId,
            totalGuests: dto.totalGuests,
            amount: dto.amount,
        });
        const idempotencyKey = generateIdempotencyKey();
        await createIdempotencyKey(idempotencyKey, booking.id);
        return {
            bookingId: booking.id,
            idempotencyKey,
        };
    } catch (error) {
        console.error(`Failed to aquire lock on ${bookingResource} - `, error);
    }
}

// 2 parallel requests from user can cause double bookings
export async function confirmBookingService(key: string) {
    return await prisma.$transaction(async (tx) => { 
        const idempotencyKey = await getIdempotencyKeyWithLock(tx, key);
        if(!idempotencyKey || !idempotencyKey.bookingId) {
            throw new Error("No idempotency key found!!!");
        }
        
        if(idempotencyKey.finalized) {
            throw new Error("Idempotency key is already finalized!!!");
        }
        
        await finalizeIdempotencyKey(tx, key);
        const booking = await changeBookingStatus(tx, idempotencyKey.bookingId, $Enums.BookingStatus.CONFIRMED);
        return booking;
    });
}