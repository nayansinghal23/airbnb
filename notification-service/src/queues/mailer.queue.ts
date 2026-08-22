import { Queue } from 'bullmq';

import { getRedisConnection } from '../config/redis.config';

export const MAILE_QUEUE = "queue-mailer";

export const mailerQueue = new Queue(MAILE_QUEUE, {
    connection: getRedisConnection(),
});