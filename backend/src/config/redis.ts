import Redis from 'ioredis';
import { config } from './index';

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis => {
    if (!redisClient) {
        redisClient = new Redis(config.redis.url, {
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: true,
        });

        redisClient.on('connect', () => {
            console.log('Redis connected');
        });

        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        redisClient.on('close', () => {
            console.warn('Redis connection closed');
        });
    }

    return redisClient;
};

export const connectRedis = async (): Promise<void> => {
    try {
        const client = getRedisClient();
        await client.connect();
        console.log('Redis connected successfully');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        // Redis is optional, don't exit on failure
    }
};

export const disconnectRedis = async (): Promise<void> => {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        console.log('Redis connection closed');
    }
};

export const cache = {
    async get<T>(key: string): Promise<T | null> {
        const client = getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    },

    async set(key: string, value: unknown, ttlSeconds: number = 3600): Promise<void> {
        const client = getRedisClient();
        await client.setex(key, ttlSeconds, JSON.stringify(value));
    },

    async del(key: string): Promise<void> {
        const client = getRedisClient();
        await client.del(key);
    },

    async delPattern(pattern: string): Promise<void> {
        const client = getRedisClient();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(...keys);
        }
    },

    async exists(key: string): Promise<boolean> {
        const client = getRedisClient();
        return (await client.exists(key)) === 1;
    },

    async ttl(key: string): Promise<number> {
        const client = getRedisClient();
        return await client.ttl(key);
    },
};

export default { getRedisClient, connectRedis, disconnectRedis, cache };
