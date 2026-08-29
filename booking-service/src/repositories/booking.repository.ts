import { $Enums, IdempotencyKey, Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { isValidUUID } from "../utils/isValidUUID";

export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
    const booking = await prisma.booking.create({
        data: bookingInput,
    });
    return booking;
}

export async function createIdempotencyKey(idemKey: string, bookingId: number) {
    const idempotencyKey = await prisma.idempotencyKey.create({
        data: {
            idemKey, // First, store the uuid as the key
            booking: {
                connect: {
                    id: bookingId, // Then, store booking table's primary key as foreign key to create 1:1 mapping 
                }
            }
        }
    });
    return idempotencyKey;
}

export async function getIdempotencyKeyWithLock(tx: Prisma.TransactionClient, key: string) {
    // Prevents SQL Injection
    if (!isValidUUID(key)) {
        throw new Error("Invalid idempotency key");
    }

    const idempotencyKey: Array<IdempotencyKey> = await tx.$queryRaw(
        Prisma.raw(`SELECT * FROM IdempotencyKey WHERE idemKey = '${key}' FOR UPDATE;`)
    );

    if(!idempotencyKey || !idempotencyKey.length) {
        throw new Error("Idempotency key not found");
    }
    
    return idempotencyKey[0];
}

export async function getBookingById(bookingId: number) {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId
        }
    });
    return booking;
}

// TODO : State Design Pattern to change booking status
export async function changeBookingStatus(tx: Prisma.TransactionClient, bookingId: number, status: $Enums.BookingStatus) {
    const booking = await tx.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status
        }
    });
    return booking;
}

export async function finalizeIdempotencyKey(tx: Prisma.TransactionClient, idemKey: string) {
    const idempotencyKey = await tx.idempotencyKey.update({
        where: {
            idemKey,
        },
        data: {
            finalized: true,
        }
    });
    return idempotencyKey;
}

export async function getBookingsForUserId(userId: number) {
    return prisma.booking.findMany({
        where: { userId }
    });
}