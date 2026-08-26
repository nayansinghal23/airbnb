import { Request, Response } from 'express';

import { confirmBookingService, createBookingService } from '../services/booking.service';

export const createBookingController = async (req: Request, res: Response) => {
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
}

export const confrimBookingController = async (req: Request, res: Response) => {
    const booking = await confirmBookingService(req.params.idempotencyKey);

    res.status(200).json({
        bookingId: booking.id,
        status: booking.status,
    });
}