import { Request, Response } from "express";

import { generateRooms } from "../services/roomGeneration.service";

import { addRoomsToQueue } from "../producers/roomGeneration.producer";

export async function generateRoomsHandler(req: Request, res: Response) {
    try {
        const { scheduleType } = req.query;
        if(scheduleType === "immediate") {
            const { totalDatesProcessed, totalRoomsCreated } = await generateRooms(req.body);
            return res.status(201).json({
                success: true,
                data: { totalDatesProcessed, totalRoomsCreated },
                message: "Rooms added immediately.",
            });
        } else if(scheduleType === "scheduled") {
            addRoomsToQueue(req.body);
            return res.status(201).json({
                success: true,
                message: "Adding rooms might require some time.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Unsupported scheduleType",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to generate rooms",
        });
    }
}