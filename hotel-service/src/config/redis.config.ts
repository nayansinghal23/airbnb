import IORedis from "ioredis";

const REDIS_SERVER_URL = process.env.REDIS_SERVER_URL || "redis://localhost:6379";

// Singleton pattern
function connectToRedis() {
    try {
        let connection: IORedis | null = null;
        return () => {
            if(!connection) {
                connection = new IORedis(REDIS_SERVER_URL, {
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