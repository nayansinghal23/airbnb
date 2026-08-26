import { z } from "zod";

import { roomGenerationJobSchema, roomGenerationSchema } from "../validators/roomGeneration.validator";

export type RoomGenerationRequest = z.infer<typeof roomGenerationSchema>;
export type RoomGenerationJob = z.infer<typeof roomGenerationJobSchema>;

export interface RoomGenerationResponse {
    success: boolean;
    totalRoomsCreated: number;
    totalDatesProcessed: number;
    errors: string[];
    jobId: string;
}
export interface RoomGenerationDTO {
    roomCategoryId: number;
    startDate: Date;
    endDate: Date;
}