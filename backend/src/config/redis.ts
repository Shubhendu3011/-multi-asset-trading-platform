import { createClient } from 'redis';
import { logger } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis max reconnection attempts reached');
        return false;
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('✅ Redis client connected');
});

redisClient.on('ready', () => {
  logger.info('✅ Redis client ready');
});

redisClient.on('end', () => {
  logger.info('Redis client disconnected');
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    throw error;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    await redisClient.quit();
    logger.info('✅ Redis disconnected successfully');
  } catch (error) {
    logger.error('❌ Redis disconnection failed:', error);
    throw error;
  }
}; 