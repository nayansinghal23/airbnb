import { Request, Response } from 'express';

import { createHotelService, fetchHotelsByOwnerIdService, getAllHotelsService, getHotelByIdService, softDeleteHotelService } from '../services/hotel.service';

export async function createHotelHandler(req: Request, res: Response) {
    try {
        const hotel = await createHotelService(req.body);

        if(!hotel) {
            return res.status(500).json({
                success: false,
                message: "Failed to create a hotel",
            });
        }

        return res.status(201).json({
            success: true,
            data: hotel,
            message: "Hotel created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotel",
        });
    }
}

export async function getHotelByIdHandler(req: Request, res: Response) {
    try {
        const hotelId = Number(req.params.hotelId);
        if(!hotelId || Number.isNaN(hotelId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Hotel ID",
            });
        }

        const hotel = await getHotelByIdService(hotelId);

        if(!hotel) {
            return res.status(404).json({
                success: false,
                message: `Hotel not found with ${hotelId} ID.`,
            });
        }

        return res.status(200).json({
            success: true,
            data: hotel,
            message: "Hotel fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotel",
        });
    }
}

export async function getAllHotelsHandler(req: Request, res: Response) {
    try {
        const hotels = await getAllHotelsService();

        return res.status(200).json({
            success: true,
            data: hotels,
            message: "Hotel fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotels",
        });
    }
}

export async function softDeleteHotelHandler(req: Request, res: Response) {
    try {
        const hotelId = Number(req.params.hotelId);
        if(!hotelId || Number.isNaN(hotelId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Hotel ID",
            });
        }

        const hotel = await softDeleteHotelService(hotelId);

        if(!hotel) {
            return res.status(404).json({
                success: false,
                message: `Hotel not found with ${hotelId} ID.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotel",
        });
    }
}

export async function fetchHotelsByOwnerIdHandler(req: Request, res: Response) {
    try {
        const ownerId = Number(req.params.ownerId);
        if(!ownerId || Number.isNaN(ownerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Owner ID",
            });
        }

        const hotels = await fetchHotelsByOwnerIdService(ownerId);

        return res.status(200).json({
            success: true,
            data: hotels,
            message: "Hotels fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotel",
        });
    }
}