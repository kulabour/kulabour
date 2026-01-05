import Redis, { RedisOptions } from 'ioredis';
import logger from './logger';

// Redis configuration
const redisConfig: RedisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
};

// Create Redis client
const redis = new Redis(redisConfig);

// Event handlers
redis.on('connect', () => {
    logger.debug('Redis: Connecting...');
});

redis.on('ready', () => {
    logger.info({ host: redisConfig.host, port: redisConfig.port }, 'Redis: Connected and ready');
});

redis.on('error', (err: Error) => {
    logger.error({ error: err.message }, 'Redis error');
    // Don't crash the app if Redis fails
});

redis.on('close', () => {
    logger.info('Redis: Connection closed');
});

// Connect to Redis
redis.connect().catch(err => {
    logger.warn('Redis connection failed. Caching disabled.');
    logger.warn('Install Redis or set REDIS_HOST in .env');
});

/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed value or null
 */
export const get = async (key: string): Promise<any | null> => {
    try {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    } catch (err: any) {
        logger.error({ error: err.message, key }, 'Redis GET error');
        return null;
    }
};

/**
 * Set value in cache with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 */
export const set = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
    try {
        await redis.setex(key, ttl, JSON.stringify(value));
    } catch (err: any) {
        logger.error({ error: err.message, key, ttl }, 'Redis SET error');
    }
};

/**
 * Delete single key
 * @param {string} key - Cache key
 */
export const del = async (key: string): Promise<void> => {
    try {
        await redis.del(key);
    } catch (err: any) {
        logger.error({ error: err.message, key }, 'Redis DEL error');
    }
};

/**
 * Delete keys matching pattern
 * @param {string} pattern - Pattern to match (e.g., 'user:*')
 */
export const delPattern = async (pattern: string): Promise<void> => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
            logger.debug({ keysDeleted: keys.length, pattern }, 'Deleted cache keys by pattern');
        }
    } catch (err: any) {
        logger.error({ error: err.message, pattern }, 'Redis DEL PATTERN error');
    }
};

/**
 * Check if key exists
 * @param {string} key - Cache key
 * @returns {Promise<boolean>}
 */
export const exists = async (key: string): Promise<boolean> => {
    try {
        const result = await redis.exists(key);
        return result === 1;
    } catch (err: any) {
        logger.error({ error: err.message, key }, 'Redis EXISTS error');
        return false;
    }
};

/**
 * Increment counter (for rate limiting, analytics)
 * @param {string} key - Counter key
 * @param {number} ttl - Expiry in seconds
 * @returns {Promise<number>} - New value
 */
export const incr = async (key: string, ttl: number | null = null): Promise<number> => {
    try {
        const value = await redis.incr(key);
        if (ttl && value === 1) {
            // Set TTL only on first increment
            await redis.expire(key, ttl);
        }
        return value;
    } catch (err: any) {
        logger.error({ error: err.message, key, ttl }, 'Redis INCR error');
        return 0;
    }
};

/**
 * Get multiple keys at once
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<any[]>}
 */
export const mget = async (keys: string[]): Promise<any[]> => {
    try {
        const values = await redis.mget(...keys);
        return values.map(v => v ? JSON.parse(v) : null);
    } catch (err: any) {
        logger.error({ error: err.message, keyCount: keys.length }, 'Redis MGET error');
        return [];
    }
};

/**
 * Flush all cache (use with caution!)
 */
export const flushAll = async (): Promise<void> => {
    try {
        await redis.flushall();
        logger.warn('All cache flushed');
    } catch (err: any) {
        logger.error({ error: err.message }, 'Redis FLUSHALL error');
    }
};

/**
 * Get cache statistics
 * @returns {Promise<object>}
 */
export const getStats = async (): Promise<object> => {
    try {
        const info = await redis.info('stats');
        return {
            connected: redis.status === 'ready',
            totalKeys: await redis.dbsize(),
            info: info
        };
    } catch (err: any) {
        return {
            connected: false,
            error: err.message
        };
    }
};

// Export Redis client for advanced usage
export const client = redis;
