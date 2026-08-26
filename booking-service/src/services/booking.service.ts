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
import { getAvailableRooms, updateBookingIdToRooms } from '../api/hotel.api';

export async function createBookingService(dto: CreateBookingDTO) {
    const bookingResource = `hotel:${dto.hotelId}`;
    try {
        const availableRooms = await getAvailableRooms(
            dto.roomCategoryId,
            dto.checkInDate,
            dto.checkOutDate,
        );

        const checkInDate = new Date(dto.checkInDate);
        const checkOutDate = new Date(dto.checkOutDate);

        const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

        if(availableRooms.length === 0 || availableRooms.length < totalNights) {
            throw new Error("No rooms available to book for the given dates.")
        }

        await redLock.acquire([bookingResource], TTL);
        const booking = await createBooking({
            userId: dto.userId,
            hotelId: dto.hotelId,
            totalGuests: dto.totalGuests,
            amount: dto.amount,
            checkInDate: new Date(dto.checkInDate),
            checkOutDate: new Date(dto.checkOutDate),
            roomCategoryId: dto.roomCategoryId,
        });
        const idempotencyKey = generateIdempotencyKey();
        await createIdempotencyKey(idempotencyKey, booking.id);
        await updateBookingIdToRooms(booking.id, availableRooms.map((room: any) => room.id))
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