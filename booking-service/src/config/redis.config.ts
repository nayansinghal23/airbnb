import IORedis from "ioredis";
import Redlock from "redlock";

const REDIS_SERVER_URL = process.env.REDIS_SERVER_URL || "redis://localhost:6379";
export const TTL = Number(process.env.TTL) || 300000;

// Singleton pattern
function connectToRedis() {
  try {
      let connection: IORedis | null = null;
      return () => {
          if(!connection) {
              connection = new IORedis(REDIS_SERVER_URL);
          }
          return connection;
      }
  } catch (error) {
      console.error("Error connecting to redis : ", error);
      throw error;
  }
};

export const getRedisConnection = connectToRedis();

export const redLock = new Redlock([getRedisConnection()], {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  retryJitter: 200
});