"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheStats = exports.invalidateCache = exports.cacheMiddleware = void 0;
const cache = __importStar(require("../utils/cache"));
/**
 * Cache middleware for GET requests
 * Caches response data in Redis for specified duration
 *
 * @param {number} duration - Cache duration in seconds (default: 1 hour)
 * @param {function} keyGenerator - Optional custom key generator function
 * @returns {function} Express middleware
 */
const cacheMiddleware = (duration = 3600, keyGenerator = null) => {
    return async (req, res, next) => {
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
            res.json = function (body) {
                // Cache the response
                cache.set(cacheKey, body, duration)
                    .catch(err => console.error('Cache set error:', err));
                // Call original json function
                return originalJson(body);
            };
            next();
        }
        catch (err) {
            console.error('Cache middleware error:', err);
            // Continue without caching on error
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
/**
 * Invalidate cache for specific patterns
 * Use in POST/PUT/DELETE routes to clear related cache
 *
 * Example: invalidateCache('user:*') after user update
 *
 * @param {string|string[]} patterns - Pattern(s) to invalidate
 * @returns {function} Express middleware
 */
const invalidateCache = (patterns) => {
    return async (req, res, next) => {
        try {
            const patternArray = Array.isArray(patterns) ? patterns : [patterns];
            for (const pattern of patternArray) {
                await cache.delPattern(pattern);
            }
        }
        catch (err) {
            console.error('Cache invalidation error:', err);
            // Don't block request on cache invalidation failure
        }
        next();
    };
};
exports.invalidateCache = invalidateCache;
/**
 * Cache stats endpoint middleware
 * Add to route: app.get('/api/cache/stats', cacheStats)
 */
const cacheStats = async (req, res) => {
    try {
        const stats = await cache.getStats();
        res.json({
            success: true,
            cache: stats
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cache stats'
        });
    }
};
exports.cacheStats = cacheStats;
