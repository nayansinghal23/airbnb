import { Worker, Job } from 'bullmq';

import { getRedisConnection } from '../config/redis.config';

import { RoomGenerationDTO } from '../dto/roomGeneration.dto';

import { ROOM_GENERATION_QUEUE } from '../queues/roomGeneration.queue';

import { ROOM_GENERATION_PAYLOAD } from '../producers/roomGeneration.producer';

import { generateRooms } from '../services/roomGeneration.service';

export function setupRoomGenerationWorker() {
    const roomGenerationProcessor = new Worker<RoomGenerationDTO>(
        ROOM_GENERATION_QUEUE,
        async (job: Job) => {
            if(job.name !== ROOM_GENERATION_PAYLOAD) {
                throw new Error("Invalid job name");
            }
            // call service layer from here
            await generateRooms(job.data);
        },
        {
            connection: getRedisConnection(),
        }
    );
    
    roomGenerationProcessor.on("failed", () => {
        console.error("Room generation failed");
    });
    
    roomGenerationProcessor.on("completed", () => {
        console.log("Room generation success");
    });
}