import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { NotificationService } from '../notification/notification.service';
import { MatchCandidate, MatchConfig, MatchResult, DEFAULT_MATCH_CONFIG } from './matching.types';
import { Booking } from '@prisma/client';

/**
 * SMART WORKER AUTO-MATCHING ENGINE
 * ──────────────────────────────────────────────────────────────────────────────
 * Automatically finds and assigns the best available worker for a booking.
 *
 * SCORING MODEL (composite 0-100):
 *   Proximity   40% — closer workers rank higher (inverse distance)
 *   Rating      25% — higher-rated workers preferred
 *   Response    20% — workers who respond faster get priority
 *   Availability 15% — workers with fewer jobs today are boosted
 *
 * FLOW:
 *   1. Customer creates booking → status = MATCHING
 *   2. Engine finds candidates within progressive radius (5km → 10km → 15km)
 *   3. Scores candidates, sends job alert to top worker
 *   4. Worker has 60s to accept
 *   5. Accept → assign worker, status = ACCEPTED, notify customer
 *   6. Decline/Timeout → try next candidate or expand radius
 *   7. All retries exhausted → status = PENDING, notify customer (fallback to manual)
 */

@Injectable()
export class MatchingService {
  private readonly config: MatchConfig = DEFAULT_MATCH_CONFIG;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly notificationService: NotificationService,
  ) {}

  // ─── Main Orchestrator ─────────────────────────────────────────────────────

  /**
   * Find and assign the best available worker for a booking.
   * This runs as a fire-and-forget async process after booking creation.
   */
  async findAndAssignWorker(booking: Booking): Promise<MatchResult> {
    let totalAttempts = 0;

    console.log(`🔍 Matching engine started for booking ${booking.id}`);

    // Load booking with category for skill matching
    const fullBooking = await this.prisma.booking.findUnique({
      where: { id: booking.id },
      include: { category: true, customer: true },
    });

    if (!fullBooking) {
      return { matched: false, attempts: 0 };
    }

    // Notify customer that matching has started
    this.notificationService.notify(
      fullBooking.customerId,
      'BOOKING_CREATED',
      '🔍 Finding Your Worker',
      'We\'re searching for the best available worker near you...',
      { bookingId: booking.id },
    );

    // Progressive radius expansion
    for (const radiusKm of this.config.maxRadiusSteps) {
      console.log(`🔍 Searching within ${radiusKm}km for booking ${booking.id}`);

      const categorySkill = fullBooking.category?.name || '';
      const candidates = await this.findCandidates(
        categorySkill,
        fullBooking.latitude,
        fullBooking.longitude,
        radiusKm,
      );

      if (candidates.length === 0) {
        console.log(`   → No candidates found at ${radiusKm}km, expanding...`);
        continue;
      }

      // Sort by score (highest first)
      candidates.sort((a, b) => b.score - a.score);

      // Try top N candidates
      const topCandidates = candidates.slice(0, this.config.maxWorkersToContact);

      for (const candidate of topCandidates) {
        totalAttempts++;

        // Record the matching attempt
        await this.prisma.matchingAttempt.create({
          data: {
            bookingId: booking.id,
            workerId: candidate.workerId,
            score: candidate.score,
            distanceKm: candidate.distance,
            status: 'PENDING',
          },
        });

        // Send job alert to worker
        await this.notificationService.notifyWorkerJobAlert(
          candidate.workerId,
          fullBooking,
        );

        console.log(
          `   → Sent job alert to worker ${candidate.workerId} ` +
          `(score: ${candidate.score.toFixed(1)}, distance: ${candidate.distance.toFixed(1)}km)`,
        );

        // Wait for response (check Redis for accept/decline signal)
        const response = await this.waitForResponse(
          booking.id,
          candidate.workerId,
          this.config.responseTimeoutMs,
        );

        if (response === 'accepted') {
          // Worker accepted! Assign them
          const worker = await this.prisma.workerProfile.findUnique({
            where: { id: candidate.workerId },
            include: { user: true },
          });

          await this.prisma.booking.update({
            where: { id: booking.id },
            data: { status: 'ACCEPTED', workerId: candidate.workerId },
          });

          // Update matching attempt
          await this.prisma.matchingAttempt.updateMany({
            where: { bookingId: booking.id, workerId: candidate.workerId },
            data: { status: 'ACCEPTED', respondedAt: new Date() },
          });

          // Notify customer
          if (worker) {
            await this.notificationService.notifyCustomerMatched(
              fullBooking.customerId,
              worker,
              fullBooking,
            );
          }

          console.log(`✅ Booking ${booking.id} matched to worker ${candidate.workerId}`);

          return {
            matched: true,
            workerId: candidate.workerId,
            score: candidate.score,
            distance: candidate.distance,
            attempts: totalAttempts,
          };
        }

        // Worker declined or timed out — update attempt and try next
        const status = response === 'declined' ? 'DECLINED' : 'TIMEOUT';
        await this.prisma.matchingAttempt.updateMany({
          where: { bookingId: booking.id, workerId: candidate.workerId },
          data: { status, respondedAt: new Date() },
        });

        console.log(`   → Worker ${candidate.workerId} ${status.toLowerCase()}, trying next...`);
      }
    }

    // All retries exhausted — no match found
    console.log(`❌ No match found for booking ${booking.id} after ${totalAttempts} attempts`);

    // Set booking back to PENDING for manual assignment
    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'PENDING' },
    });

    // Notify customer
    await this.notificationService.notifyCustomerMatchFailed(
      fullBooking.customerId,
      booking.id,
    );

    return { matched: false, attempts: totalAttempts };
  }

  // ─── Candidate Scoring ──────────────────────────────────────────────────────

  /**
   * Calculate composite score for a worker.
   * Weights: Proximity 40%, Rating 25%, ResponseRate 20%, Availability 15%
   */
  scoreWorker(
    worker: { rating: number; responseRate: number; currentLat: number | null; currentLng: number | null },
    bookingLat: number,
    bookingLng: number,
    maxRadius: number,
    completedToday: number = 0,
  ): number {
    // Proximity score (0-100): closer = higher
    const distance = this.haversineKm(
      bookingLat, bookingLng,
      worker.currentLat || 0, worker.currentLng || 0,
    );
    const proximityScore = Math.max(0, (1 - distance / maxRadius) * 100);

    // Rating score (0-100): based on 5-star scale
    const ratingScore = (worker.rating / 5) * 100;

    // Response rate score (0-100): direct mapping
    const responseScore = worker.responseRate;

    // Availability score (0-100): fewer jobs today = higher score
    const availabilityScore = Math.max(0, 100 - completedToday * 20);

    // Weighted composite
    return (
      proximityScore * 0.4 +
      ratingScore * 0.25 +
      responseScore * 0.2 +
      availabilityScore * 0.15
    );
  }

  // ─── Candidate Search ──────────────────────────────────────────────────────

  /**
   * Find online workers with matching skills within a radius.
   * Uses Haversine bounding box (same approach as SmartSearchService).
   */
  async findCandidates(
    categorySkill: string,
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<MatchCandidate[]> {
    // Haversine bounding box approximation
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));

    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;
    const minLng = lng - lngDelta;
    const maxLng = lng + lngDelta;

    const workers = await this.prisma.workerProfile.findMany({
      where: {
        isOnline: true,
        skills: { has: categorySkill },
        currentLat: { gte: minLat, lte: maxLat },
        currentLng: { gte: minLng, lte: maxLng },
      },
      include: { user: true },
    });

    const candidates: MatchCandidate[] = [];

    for (const worker of workers) {
      if (!worker.currentLat || !worker.currentLng) continue;

      const distance = this.haversineKm(lat, lng, worker.currentLat, worker.currentLng);
      if (distance > radiusKm) continue;

      // Check how many jobs the worker has completed today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const completedToday = await this.prisma.booking.count({
        where: {
          workerId: worker.id,
          status: 'COMPLETED',
          updatedAt: { gte: todayStart },
        },
      });

      const score = this.scoreWorker(worker, lat, lng, radiusKm, completedToday);

      candidates.push({
        workerId: worker.id,
        distance: Math.round(distance * 10) / 10,
        rating: worker.rating,
        responseRate: worker.responseRate,
        isAvailable: true,
        completedToday,
        score,
      });
    }

    return candidates;
  }

  // ─── Worker Response Handling ───────────────────────────────────────────────

  /**
   * Process a worker's accept/decline response to a job alert.
   * Called by the booking controller when a worker responds.
   */
  async handleWorkerResponse(
    bookingId: string,
    workerId: string,
    accepted: boolean,
    reason?: string,
  ): Promise<void> {
    const responseKey = `matching:response:${bookingId}:${workerId}`;

    if (accepted) {
      await this.redis.setWithTTL(responseKey, 'accepted', 120);
    } else {
      await this.redis.setWithTTL(responseKey, 'declined', 120);

      // Record decline reason
      if (reason) {
        await this.prisma.matchingAttempt.updateMany({
          where: { bookingId, workerId },
          data: { declineReason: reason },
        });
      }
    }
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  /**
   * Wait for a worker's response via Redis polling.
   * Returns 'accepted', 'declined', or 'timeout'.
   */
  private async waitForResponse(
    bookingId: string,
    workerId: string,
    timeoutMs: number,
  ): Promise<'accepted' | 'declined' | 'timeout'> {
    const responseKey = `matching:response:${bookingId}:${workerId}`;
    const pollIntervalMs = 2000; // Check every 2 seconds
    const maxPolls = Math.ceil(timeoutMs / pollIntervalMs);

    for (let i = 0; i < maxPolls; i++) {
      const response = await this.redis.get(responseKey);
      if (response === 'accepted') return 'accepted';
      if (response === 'declined') return 'declined';

      // Sleep before next poll
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }

    return 'timeout';
  }

  /**
   * Haversine distance in km.
   * Copied from SmartSearchService for self-containment.
   */
  private haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
