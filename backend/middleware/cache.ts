import { Request, Response, NextFunction } from 'express';
import * as cache from '../utils/cache';

/**
 * Cache middleware for GET requests
 * Caches response data in Redis for specified duration
 * 
 * @param {number} duration - Cache duration in seconds (default: 1 hour)
 * @param {function} keyGenerator - Optional custom key generator function
 * @returns {function} Express middleware
 */
export const cacheMiddleware = (duration = 3600, keyGenerator: ((req: Request) => string) | null = null) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        // Generate cache key
        const cacheKey = keyGenerator
            ? keyGenerator(req)
            : `cache:${req.originalUrl || req.url}`;

        try {
            // Check if cached response exists
            const cachedData = await cache.get(cacheKey);

            if (cachedData) {
                console.log(`✨ Cache HIT: ${cacheKey}`);
                return res.json(cachedData);
            }

            console.log(`❌ Cache MISS: ${cacheKey}`);

            // Store original res.json function
            // @ts-ignore
            const originalJson = res.json.bind(res);

            // Override res.json to cache response
            // @ts-ignore
            res.json = function (body: any) {
                // Cache the response
                cache.set(cacheKey, body, duration)
                    .catch(err => console.error('Cache set error:', err));

                // Call original json function
                return originalJson(body);
            };

            next();
        } catch (err) {
            console.error('Cache middleware error:', err);
            // Continue without caching on error
            next();
        }
    };
};

/**
 * Invalidate cache for specific patterns
 * Use in POST/PUT/DELETE routes to clear related cache
 * 
 * Example: invalidateCache('user:*') after user update
 * 
 * @param {string|string[]} patterns - Pattern(s) to invalidate
 * @returns {function} Express middleware
 */
export const invalidateCache = (patterns: string | string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const patternArray = Array.isArray(patterns) ? patterns : [patterns];

            for (const pattern of patternArray) {
                await cache.delPattern(pattern);
            }
        } catch (err) {
            console.error('Cache invalidation error:', err);
            // Don't block request on cache invalidation failure
        }

        next();
    };
};

/**
 * Cache stats endpoint middleware
 * Add to route: app.get('/api/cache/stats', cacheStats)
 */
export const cacheStats = async (req: Request, res: Response) => {
    try {
        const stats = await cache.getStats();
        res.json({
            success: true,
            cache: stats
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cache stats'
        });
    }
};
