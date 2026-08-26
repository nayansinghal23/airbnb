import { Request, Response } from 'express';

import { confirmBookingService, createBookingService } from '../services/booking.service';

export const createBookingController = async (req: Request, res: Response) => {
    try {
        const booking = await createBookingService(req.body);
    
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