import z from 'zod';
import { Request, Response } from 'express';

import { getAvailableRoomsService, updateBookingIdToRoomsService } from '../services/room.service';

import { getAvailableRoomsSchema } from '../validators/room.validator';

export async function getAvailableRoomsHandler(req: Request, res: Response) {
    try {
        const result = getAvailableRoomsSchema.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json({
              success: false,
              message: "Invalid request parameters",
              errors: z.treeifyError(result.error),
            });
        }

        const { roomCategoryId, hotelId, checkInDate, checkOutDate } = result.data;
        const rooms = await getAvailableRoomsService({ checkInDate, checkOutDate, roomCategoryId, hotelId });
        return res.status(200).json({
            success: true,
            data: rooms,
            message: "Available rooms b/w check-in and check-out date.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch available rooms",
        });
    }
}

export async function updateBookingIdToRoomsHandler(req: Request, res: Response) {
    try {
        const rooms = await updateBookingIdToRoomsService(req.body);
        return res.status(200).json({
            success: true,
            data: rooms,
            message: "Booking-id linked with corresponding rooms",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to link booking-id",
        });
    }
}