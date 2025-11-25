// Simple Redis cache wrapper for Node.js (ioredis)
// Install: npm i ioredis
import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
});

export const cache = {
    async get(key: string): Promise<string | null> {
        try {
            return await redis.get(key);
        } catch (e) {
            console.warn('Cache get error', e);
            return null;
        }
    },
    async set(key: string, value: string, ttlSeconds = 300): Promise<void> {
        try {
            await redis.set(key, value, 'EX', ttlSeconds);
        } catch (e) {
            console.warn('Cache set error', e);
        }
    },
    async del(key: string): Promise<void> {
        try {
            await redis.del(key);
        } catch (e) {
            console.warn('Cache del error', e);
        }
    },
};
