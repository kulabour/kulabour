import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    /**
     * Get cached data
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const val = await this.cacheManager.get<T>(key);
            return val === undefined ? null : val;
        } catch (error) {
            console.error(`Cache get error for key ${key}:`, error);
            return null;
        }
    }

    /**
     * Set cache with TTL (in seconds)
     */
    async set(key: string, value: any, ttl: number = 300): Promise<void> {
        try {
            await this.cacheManager.set(key, value, ttl);
        } catch (error) {
            console.error(`Cache set error for key ${key}:`, error);
        }
    }

    /**
     * Delete cached data
     */
    async del(key: string): Promise<void> {
        try {
            await this.cacheManager.del(key);
        } catch (error) {
            console.error(`Cache delete error for key ${key}:`, error);
        }
    }

    /**
     * Delete multiple keys by pattern
     */
    async delPattern(pattern: string): Promise<void> {
        try {
            // Note: This requires redis store, won't work with memory cache
            const keys = await (this.cacheManager as any).store.keys(pattern);
            await Promise.all(keys.map((key: string) => this.del(key)));
        } catch (error) {
            console.error(`Cache delete pattern error for ${pattern}:`, error);
        }
    }

    /**
     * Get or set pattern: return cached value or compute and cache
     */
    async getOrSet<T>(
        key: string,
        factory: () => Promise<T>,
        ttl: number = 300
    ): Promise<T> {
        const cached = await this.get<T>(key);

        if (cached !== null) {
            return cached;
        }

        const value = await factory();
        await this.set(key, value, ttl);
        return value;
    }

    /**
     * Cache invalidation helpers
     */
    async invalidateUserCache(userId: string): Promise<void> {
        await this.delPattern(`user:${userId}:*`);
    }

    async invalidateBookingCache(bookingId: string): Promise<void> {
        await this.delPattern(`booking:${bookingId}:*`);
    }

    async invalidateServiceCache(serviceId: string): Promise<void> {
        await this.delPattern(`service:${serviceId}:*`);
    }
}
