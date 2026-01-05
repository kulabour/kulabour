"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.getStats = exports.flushAll = exports.mget = exports.incr = exports.exists = exports.delPattern = exports.del = exports.set = exports.get = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("./logger"));
// Redis configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true
};
// Create Redis client
const redis = new ioredis_1.default(redisConfig);
// Event handlers
redis.on('connect', () => {
    logger_1.default.debug('Redis: Connecting...');
});
redis.on('ready', () => {
    logger_1.default.info({ host: redisConfig.host, port: redisConfig.port }, 'Redis: Connected and ready');
});
redis.on('error', (err) => {
    logger_1.default.error({ error: err.message }, 'Redis error');
    // Don't crash the app if Redis fails
});
redis.on('close', () => {
    logger_1.default.info('Redis: Connection closed');
});
// Connect to Redis
redis.connect().catch(err => {
    logger_1.default.warn('Redis connection failed. Caching disabled.');
    logger_1.default.warn('Install Redis or set REDIS_HOST in .env');
});
/**
 * Get value from cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed value or null
 */
const get = async (key) => {
    try {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    }
    catch (err) {
        logger_1.default.error({ error: err.message, key }, 'Redis GET error');
        return null;
    }
};
exports.get = get;
/**
 * Set value in cache with TTL
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} ttl - Time to live in seconds (default: 1 hour)
 */
const set = async (key, value, ttl = 3600) => {
    try {
        await redis.setex(key, ttl, JSON.stringify(value));
    }
    catch (err) {
        logger_1.default.error({ error: err.message, key, ttl }, 'Redis SET error');
    }
};
exports.set = set;
/**
 * Delete single key
 * @param {string} key - Cache key
 */
const del = async (key) => {
    try {
        await redis.del(key);
    }
    catch (err) {
        logger_1.default.error({ error: err.message, key }, 'Redis DEL error');
    }
};
exports.del = del;
/**
 * Delete keys matching pattern
 * @param {string} pattern - Pattern to match (e.g., 'user:*')
 */
const delPattern = async (pattern) => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
            logger_1.default.debug({ keysDeleted: keys.length, pattern }, 'Deleted cache keys by pattern');
        }
    }
    catch (err) {
        logger_1.default.error({ error: err.message, pattern }, 'Redis DEL PATTERN error');
    }
};
exports.delPattern = delPattern;
/**
 * Check if key exists
 * @param {string} key - Cache key
 * @returns {Promise<boolean>}
 */
const exists = async (key) => {
    try {
        const result = await redis.exists(key);
        return result === 1;
    }
    catch (err) {
        logger_1.default.error({ error: err.message, key }, 'Redis EXISTS error');
        return false;
    }
};
exports.exists = exists;
/**
 * Increment counter (for rate limiting, analytics)
 * @param {string} key - Counter key
 * @param {number} ttl - Expiry in seconds
 * @returns {Promise<number>} - New value
 */
const incr = async (key, ttl = null) => {
    try {
        const value = await redis.incr(key);
        if (ttl && value === 1) {
            // Set TTL only on first increment
            await redis.expire(key, ttl);
        }
        return value;
    }
    catch (err) {
        logger_1.default.error({ error: err.message, key, ttl }, 'Redis INCR error');
        return 0;
    }
};
exports.incr = incr;
/**
 * Get multiple keys at once
 * @param {string[]} keys - Array of cache keys
 * @returns {Promise<any[]>}
 */
const mget = async (keys) => {
    try {
        const values = await redis.mget(...keys);
        return values.map(v => v ? JSON.parse(v) : null);
    }
    catch (err) {
        logger_1.default.error({ error: err.message, keyCount: keys.length }, 'Redis MGET error');
        return [];
    }
};
exports.mget = mget;
/**
 * Flush all cache (use with caution!)
 */
const flushAll = async () => {
    try {
        await redis.flushall();
        logger_1.default.warn('All cache flushed');
    }
    catch (err) {
        logger_1.default.error({ error: err.message }, 'Redis FLUSHALL error');
    }
};
exports.flushAll = flushAll;
/**
 * Get cache statistics
 * @returns {Promise<object>}
 */
const getStats = async () => {
    try {
        const info = await redis.info('stats');
        return {
            connected: redis.status === 'ready',
            totalKeys: await redis.dbsize(),
            info: info
        };
    }
    catch (err) {
        return {
            connected: false,
            error: err.message
        };
    }
};
exports.getStats = getStats;
// Export Redis client for advanced usage
exports.client = redis;
