import { Request, Response } from 'express';

import { confirmBookingService, createBookingService, getBookingsForUserIdService } from '../services/booking.service';

export const createBookingController = async (req: Request, res: Response) => {
    try {
        const cookie = req.headers.cookie, userId = req.headers['x-user-id'];
        if(!cookie || !cookie.includes("access_token") || !userId) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated",
            })
        }
        
        const booking = await createBookingService({ ...req.body, userId: Number(userId) });
        if(!booking) {
            return res.status(400).json({
                success: false,
                message: "Unable to create a booking"
            })
        }
    
        res.status(201).json({
            bookingId: booking.bookingId,
            idempotencyKey: booking.idempotencyKey,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
        });
    }
}

export const confrimBookingController = async (req: Request, res: Response) => {
    try {
        const booking = await confirmBookingService(req.params.idempotencyKey);
        if(!booking) {
            return res.status(400).json({
                success: false,
                message: "Unable to confirm a booking"
            })
        }

        res.status(200).json({
            bookingId: booking.id,
            status: booking.status,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to confirm booking",
        });
    }
}

export const getBookingsForUserIdController = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
        if(!userId || Number.isNaN(userId)) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            })
        }
    try {
        const bookings = await getBookingsForUserIdService(userId);
        res.status(200).json({
            success: true,
            data: bookings,
            message: `Bookings for user id ${userId}`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to find bookings",
        });
    }
}