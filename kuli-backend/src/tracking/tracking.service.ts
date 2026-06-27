import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

export interface WorkerLocation {
  lat: number;
  lng: number;
  updatedAt: string;
}

@Injectable()
export class TrackingService {
  constructor(private readonly redis: RedisService) {}

  /**
   * Called by the labourer app every ~10 seconds when online and on a job.
   * Stores GPS location in Redis with a 30-second TTL.
   * If the worker goes offline or the app closes, the key auto-expires.
   */
  async updateWorkerLocation(workerId: string, lat: number, lng: number): Promise<void> {
    await this.redis.setWorkerLocation(workerId, lat, lng);
  }

  /**
   * Called by the customer tracking screen (polling every ~5 seconds).
   * Returns null if worker has gone offline (key expired in Redis).
   */
  async getWorkerLocation(workerId: string): Promise<WorkerLocation | null> {
    return this.redis.getWorkerLocation(workerId);
  }

  /**
   * Update and cache the booking state so polling doesn't hit Postgres.
   * Called whenever booking status changes (ACCEPTED → EN_ROUTE → ARRIVED → etc.)
   */
  async updateBookingState(
    bookingId: string,
    state: {
      status: string;
      workerId?: string;
      eta?: number;
      workerLat?: number;
      workerLng?: number;
    },
  ): Promise<void> {
    await this.redis.setBookingState(bookingId, {
      ...state,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Get cached booking state — used by the live-tracking screen.
   */
  async getBookingState(bookingId: string): Promise<Record<string, unknown> | null> {
    return this.redis.getBookingState(bookingId);
  }

  /**
   * Clear booking state cache when booking is closed or cancelled.
   */
  async clearBookingState(bookingId: string): Promise<void> {
    await this.redis.deleteBookingState(bookingId);
  }
}
