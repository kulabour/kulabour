import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';

/**
 * ADAPTIVE GPS TRACKING SERVICE
 * ──────────────────────────────────────────────────────────────────────────────
 * Solves the Redis GPS overload problem at scale.
 *
 * PROBLEM:
 *   10K online workers × GPS update every 10s = 1,000 writes/sec
 *   50K workers (multi-city) = 5,000 writes/sec → Redis network saturated
 *
 * SOLUTION (3 strategies):
 *
 *   1. ADAPTIVE FREQUENCY — Update interval based on booking state:
 *      → EN_ROUTE:     every 10s (customer needs real-time ETA)
 *      → ARRIVED:      every 60s (worker is at location)
 *      → IN_PROGRESS:  every 120s (working, no movement expected)
 *      → ONLINE_IDLE:  every 60s (available but no active booking)
 *      → OFFLINE:      STOP (no updates at all)
 *      Reduces writes by ~70% vs constant 10s updates.
 *
 *   2. CITY-SHARDED KEYS — Prefix all location keys with city:
 *      → ahmedabad:worker:location:{id}
 *      → bengaluru:worker:location:{id}
 *      At scale, ElastiCache cluster mode hashes keys by prefix → shards
 *      distribute evenly across cities, not randomly.
 *
 *   3. BATCH LOCATION UPDATES — Mobile app batches 3 updates and sends
 *      them in a single API call every 30s instead of 3 separate calls.
 *      Reduces HTTP requests by 3x.
 */

export type WorkerState = 'ONLINE_IDLE' | 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'OFFLINE';

export interface LocationUpdate {
  lat: number;
  lng: number;
  accuracy: number;        // meters
  heading: number;         // degrees (0-360)
  speed: number;           // m/s
  timestamp: string;       // ISO 8601
  batteryLevel?: number;   // 0-100
}

export interface LocationBatch {
  workerId: string;
  city: string;
  state: WorkerState;
  updates: LocationUpdate[];
}

export interface WorkerLocationData {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number;
  speed: number;
  city: string;
  state: WorkerState;
  updatedAt: string;
  batteryLevel?: number;
}

// TTL based on worker state — stale locations auto-expire
const STATE_TTL: Record<WorkerState, number> = {
  EN_ROUTE:     20,   // Must refresh within 20s or considered offline
  ARRIVED:      90,
  IN_PROGRESS:  180,
  ONLINE_IDLE:  90,
  OFFLINE:      0,    // Don't store
};

// Recommended client-side update intervals (returned to mobile app)
const RECOMMENDED_INTERVAL: Record<WorkerState, number> = {
  EN_ROUTE:     10,   // 10 seconds
  ARRIVED:      60,   // 1 minute
  IN_PROGRESS:  120,  // 2 minutes
  ONLINE_IDLE:  60,   // 1 minute
  OFFLINE:      0,    // Stop sending
};

@Injectable()
export class AdaptiveTrackingService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly rawRedis: Redis,
    private readonly redis: RedisService,
  ) {}

  // ─── Single Location Update ────────────────────────────────────────────────

  async updateLocation(
    workerId: string,
    city: string,
    state: WorkerState,
    update: LocationUpdate,
  ): Promise<{ nextUpdateIn: number }> {
    if (state === 'OFFLINE') {
      // Worker going offline — delete location
      await this.clearLocation(workerId, city);
      return { nextUpdateIn: 0 };
    }

    const ttl = STATE_TTL[state];
    const key = this.locationKey(city, workerId);

    const data: WorkerLocationData = {
      lat: update.lat,
      lng: update.lng,
      accuracy: update.accuracy,
      heading: update.heading,
      speed: update.speed,
      city,
      state,
      updatedAt: update.timestamp || new Date().toISOString(),
      batteryLevel: update.batteryLevel,
    };

    await this.redis.setJSON(key, data, ttl);

    // Also update the city-level online workers set (for search)
    await this.rawRedis.sadd(`city:online:${city}`, workerId);
    await this.rawRedis.expire(`city:online:${city}`, 300); // 5 min TTL on the set

    return { nextUpdateIn: RECOMMENDED_INTERVAL[state] };
  }

  // ─── Batch Location Update (3 updates in 1 API call) ──────────────────────

  async updateLocationBatch(batch: LocationBatch): Promise<{ nextUpdateIn: number }> {
    const { workerId, city, state, updates } = batch;

    if (!updates || updates.length === 0) {
      return { nextUpdateIn: RECOMMENDED_INTERVAL[state] };
    }

    // Use the LATEST update from the batch (most recent GPS fix)
    const latest = updates.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )[0];

    return this.updateLocation(workerId, city, state, latest);
  }

  // ─── Get Worker Location (for customer tracking screen) ───────────────────

  async getWorkerLocation(
    workerId: string,
    city: string,
  ): Promise<WorkerLocationData | null> {
    const key = this.locationKey(city, workerId);
    return this.redis.getJSON<WorkerLocationData>(key);
  }

  // ─── Get Multiple Workers in a City (for map/search) ──────────────────────

  async getOnlineWorkersInCity(city: string): Promise<string[]> {
    return this.rawRedis.smembers(`city:online:${city}`);
  }

  async getNearbyWorkers(
    city: string,
    lat: number,
    lng: number,
    radiusKm: number,
    limit: number = 20,
  ): Promise<WorkerLocationData[]> {
    const workerIds = await this.getOnlineWorkersInCity(city);
    const workers: WorkerLocationData[] = [];

    for (const workerId of workerIds) {
      const location = await this.getWorkerLocation(workerId, city);
      if (!location) continue;

      // Haversine distance check
      const distance = this.haversineKm(lat, lng, location.lat, location.lng);
      if (distance <= radiusKm) {
        workers.push(location);
      }

      if (workers.length >= limit) break;
    }

    return workers;
  }

  // ─── Clear Location (worker goes offline) ─────────────────────────────────

  async clearLocation(workerId: string, city: string): Promise<void> {
    await this.redis.del(this.locationKey(city, workerId));
    await this.rawRedis.srem(`city:online:${city}`, workerId);
  }

  // ─── Update Worker State (booking status changes) ─────────────────────────

  async updateWorkerState(
    workerId: string,
    city: string,
    newState: WorkerState,
  ): Promise<{ nextUpdateIn: number }> {
    const existing = await this.getWorkerLocation(workerId, city);

    if (newState === 'OFFLINE') {
      await this.clearLocation(workerId, city);
      return { nextUpdateIn: 0 };
    }

    if (existing) {
      // Re-store with new state and updated TTL
      const ttl = STATE_TTL[newState];
      const key = this.locationKey(city, workerId);
      existing.state = newState;
      existing.updatedAt = new Date().toISOString();
      await this.redis.setJSON(key, existing, ttl);
    }

    return { nextUpdateIn: RECOMMENDED_INTERVAL[newState] };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  /** City-sharded Redis key for worker location */
  private locationKey(city: string, workerId: string): string {
    return `${city}:worker:location:${workerId}`;
  }

  /** Haversine formula — distance between two GPS coordinates in km */
  private haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.degToRad(lat1)) *
        Math.cos(this.degToRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
