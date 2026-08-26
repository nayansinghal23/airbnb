import { Request, Response } from "express";

import { generateRooms } from "../services/roomGeneration.service";

import { addRoomsToQueue } from "../producers/roomGeneration.producer";

export async function generateRoomsHandler(req: Request, res: Response) {
    try {
        // const { totalDatesProcessed, totalRoomsCreated } = await generateRooms(req.body);   
        addRoomsToQueue(req.body);
        return res.status(201).json({
            success: true,
            message: "Adding rooms might require some time.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate rooms",
        });
    }
}