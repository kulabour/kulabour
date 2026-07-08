import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // ─── Generic Helpers ───────────────────────────────────────────────────────

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async setWithTTL(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }

  async setJSON<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.set(key, serialized, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const count = await this.redis.exists(key);
    return count > 0;
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async incrby(key: string, increment: number): Promise<number> {
    return this.redis.incrby(key, increment);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async sadd(key: string, value: string): Promise<void> {
    await this.redis.sadd(key, value);
  }

  async srem(key: string, value: string): Promise<void> {
    await this.redis.srem(key, value);
  }

  // ─── OTP Store ─────────────────────────────────────────────────────────────

  /** Store a 4-digit OTP for a phone number (expires in 5 minutes) */
  async setOTP(phone: string, otp: string): Promise<void> {
    await this.setWithTTL(`otp:${phone}`, otp, 300); // 5 min TTL
  }

  /** Retrieve the OTP stored for a phone number */
  async getOTP(phone: string): Promise<string | null> {
    return this.get(`otp:${phone}`);
  }

  /** Delete OTP after successful verification */
  async deleteOTP(phone: string): Promise<void> {
    await this.del(`otp:${phone}`);
  }

  // ─── OTP Rate Limiting ──────────────────────────────────────────────────────

  /** Returns current attempt count. Resets after 10 minutes. */
  async trackOTPAttempt(phone: string): Promise<number> {
    const key = `otp:attempts:${phone}`;
    const count = await this.incr(key);
    if (count === 1) {
      await this.redis.expire(key, 600); // 10 min window
    }
    return count;
  }

  async getOTPAttempts(phone: string): Promise<number> {
    const val = await this.get(`otp:attempts:${phone}`);
    return val ? parseInt(val, 10) : 0;
  }

  async clearOTPAttempts(phone: string): Promise<void> {
    await this.del(`otp:attempts:${phone}`);
  }

  // ─── JWT Session / Blocklist ────────────────────────────────────────────────

  /** Store refresh token hash for a user session (7 day TTL) */
  async setSession(userId: string, deviceId: string, tokenHash: string): Promise<void> {
    await this.setWithTTL(`session:${userId}:${deviceId}`, tokenHash, 60 * 60 * 24 * 7);
  }

  async getSession(userId: string, deviceId: string): Promise<string | null> {
    return this.get(`session:${userId}:${deviceId}`);
  }

  /** Invalidate session on logout */
  async deleteSession(userId: string, deviceId: string): Promise<void> {
    await this.del(`session:${userId}:${deviceId}`);
  }

  // ─── Worker Real-Time Location ──────────────────────────────────────────────

  /** Update worker GPS location (30 second TTL — must keep refreshing) */
  async setWorkerLocation(
    workerId: string,
    lat: number,
    lng: number,
  ): Promise<void> {
    await this.setJSON(
      `worker:location:${workerId}`,
      { lat, lng, updatedAt: new Date().toISOString() },
      30,
    );
  }

  async getWorkerLocation(
    workerId: string,
  ): Promise<{ lat: number; lng: number; updatedAt: string } | null> {
    return this.getJSON(`worker:location:${workerId}`);
  }

  // ─── Booking State Cache ────────────────────────────────────────────────────

  /** Cache active booking state to reduce DB reads on polling */
  async setBookingState(
    bookingId: string,
    state: Record<string, unknown>,
  ): Promise<void> {
    await this.setJSON(`booking:state:${bookingId}`, state, 3600); // 1 hour
  }

  async getBookingState(bookingId: string): Promise<Record<string, unknown> | null> {
    return this.getJSON(`booking:state:${bookingId}`);
  }

  async deleteBookingState(bookingId: string): Promise<void> {
    await this.del(`booking:state:${bookingId}`);
  }

  // ─── Search Cache ───────────────────────────────────────────────────────────

  /** Cache search results for 60 seconds to reduce DB load */
  async setSearchCache<T>(cacheKey: string, results: T): Promise<void> {
    await this.setJSON(`search:${cacheKey}`, results, 60);
  }

  async getSearchCache<T>(cacheKey: string): Promise<T | null> {
    return this.getJSON<T>(`search:${cacheKey}`);
  }
}
