import { Queue } from 'bullmq';

import { getRedisConnection } from '../config/redis.config';

export const ROOM_GENERATION_QUEUE = "queue-room-generation";

export const roomGenerationQueue = new Queue(ROOM_GENERATION_QUEUE, {
    connection: getRedisConnection(),
});