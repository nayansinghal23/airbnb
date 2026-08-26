import Redis from "ioredis";

// Singleton pattern
function connectToRedis() {
    try {
        let connection: Redis | null = null;
        return () => {
            if(!connection) {
                connection = new Redis({
                    port: Number(process.env.REDIS_PORT) || 6379,
                    host: process.env.REDIS_HOST || 'localhost',
                    maxRetriesPerRequest: null,
                });
            }
            return connection;
        }
    } catch (error) {
        console.error("Error connecting to redis : ", error);
        throw error;
    }
};

export const getRedisConnection = connectToRedis();