import { Request, Response } from "express";

import { startScheduler, stopScheduler, getSchedulerStatus, manualExtendAvailability } from "../scheduler/roomScheduler";

export async function startSchedulerHandler(req: Request, res: Response) {
    try {
        startScheduler();
        
        res.status(200).json({
            message: "Room availability extension scheduler started successfully",
            success: true,
            data: {
                status: "started"
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to start room availability extension scheduler",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export async function stopSchedulerHandler(req: Request, res: Response) {
    try {
        stopScheduler();
        
        res.status(200).json({
            message: "Room availability extension scheduler stopped successfully",
            success: true,
            data: {
                status: "stopped"
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to stop room availability extension scheduler",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export async function getSchedulerStatusHandler(req: Request, res: Response) {
    try {
        const status = getSchedulerStatus();
        
        res.status(200).json({
            message: "Scheduler status retrieved successfully",
            success: true,
            data: status
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get scheduler status",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}

export async function manualExtendAvailabilityHandler(req: Request, res: Response) {
    try {
        await manualExtendAvailability();
        
        res.status(200).json({
            message: "Manual room availability extension completed successfully",
            success: true,
            data: {
                action: "manual_extension_completed"
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to perform manual room availability extension",
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
} 