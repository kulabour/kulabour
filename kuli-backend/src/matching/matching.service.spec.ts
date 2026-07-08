import { Test, TestingModule } from '@nestjs/testing';
import { MatchingService } from './matching.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { NotificationService } from '../notification/notification.service';

describe('MatchingService - Smart Worker Auto-Matching Engine', () => {
  let service: MatchingService;
  let prismaMock: any;
  let redisMock: any;
  let notificationMock: any;

  // Mumbai coordinates for testing
  const BOOKING_LAT = 19.076;
  const BOOKING_LNG = 72.8777;

  beforeEach(async () => {
    prismaMock = {
      booking: {
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
      },
      workerProfile: {
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
      },
      matchingAttempt: {
        create: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };

    redisMock = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      setWithTTL: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    notificationMock = {
      notify: jest.fn().mockResolvedValue(undefined),
      notifyWorkerJobAlert: jest.fn().mockResolvedValue(undefined),
      notifyCustomerMatched: jest.fn().mockResolvedValue(undefined),
      notifyCustomerMatchFailed: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
        { provide: NotificationService, useValue: notificationMock },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── scoreWorker() — Composite Scoring ─────────────────────────────────────

  describe('scoreWorker()', () => {
    it('should give worker at 0km distance the maximum proximity score (40 points)', () => {
      const worker = {
        rating: 0,
        responseRate: 0,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // At 0km: proximityScore = (1 - 0/5) * 100 = 100 → 100 * 0.4 = 40
      // Rating = 0, Response = 0, Availability = (100 - 0*20) * 0.15 = 15
      expect(score).toBeCloseTo(40 + 0 + 0 + 15, 0);
    });

    it('should give worker at max radius 0 proximity score', () => {
      // Place worker exactly at radius boundary (5km away)
      // Using the approximate formula: 5km ≈ 0.045 degrees latitude
      const worker = {
        rating: 0,
        responseRate: 0,
        currentLat: BOOKING_LAT + 0.045,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // At ~5km from 5km radius: proximity ≈ 0
      // Availability = 100 * 0.15 = 15
      expect(score).toBeLessThanOrEqual(15 + 1); // tolerance for haversine precision
    });

    it('should give worker with 5.0 rating exactly 25 rating points', () => {
      const worker = {
        rating: 5.0,
        responseRate: 0,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // Proximity = 40, Rating = (5/5) * 100 * 0.25 = 25, Response = 0, Availability = 15
      expect(score).toBeCloseTo(40 + 25 + 0 + 15, 0);
    });

    it('should give worker with 100% response rate exactly 20 response points', () => {
      const worker = {
        rating: 0,
        responseRate: 100,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // Proximity = 40, Rating = 0, Response = 100 * 0.2 = 20, Availability = 15
      expect(score).toBeCloseTo(40 + 0 + 20 + 15, 0);
    });

    it('should give available worker (0 jobs today) 15 availability points', () => {
      const worker = {
        rating: 0,
        responseRate: 0,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // Availability = max(0, 100 - 0*20) * 0.15 = 15
      expect(score).toBeCloseTo(40 + 0 + 0 + 15, 0);
    });

    it('should give worker with 5 completed jobs today 0 availability points', () => {
      const worker = {
        rating: 0,
        responseRate: 0,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 5);

      // Availability = max(0, 100 - 5*20) * 0.15 = 0
      expect(score).toBeCloseTo(40 + 0 + 0 + 0, 0);
    });

    it('should calculate a perfect score of 100 for ideal worker', () => {
      const worker = {
        rating: 5.0,
        responseRate: 100,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // Proximity=40 + Rating=25 + Response=20 + Availability=15 = 100
      expect(score).toBeCloseTo(100, 0);
    });

    it('should handle worker with null coordinates gracefully (falls back to 0,0)', () => {
      const worker = {
        rating: 3.0,
        responseRate: 50,
        currentLat: null,
        currentLng: null,
      };

      // Should not throw — falls back to (0,0)
      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // Distance from Mumbai to (0,0) is ~8500km, way beyond 5km radius
      // Proximity score capped at 0
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should calculate partial rating score for worker with 2.5 rating', () => {
      const worker = {
        rating: 2.5,
        responseRate: 0,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 0);

      // Rating = (2.5/5) * 100 * 0.25 = 12.5
      expect(score).toBeCloseTo(40 + 12.5 + 0 + 15, 0);
    });

    it('should clamp availability score to 0 when worker has more than 5 jobs today', () => {
      const worker = {
        rating: 0,
        responseRate: 0,
        currentLat: BOOKING_LAT,
        currentLng: BOOKING_LNG,
      };

      const score = service.scoreWorker(worker, BOOKING_LAT, BOOKING_LNG, 5, 10);

      // Availability = max(0, 100 - 10*20) * 0.15 = max(0, -100) * 0.15 = 0
      expect(score).toBeCloseTo(40 + 0 + 0 + 0, 0);
    });
  });

  // ─── findCandidates() ─────────────────────────────────────────────────────

  describe('findCandidates()', () => {
    it('should return workers sorted by score descending', async () => {
      prismaMock.workerProfile.findMany.mockResolvedValue([
        {
          id: 'worker1',
          rating: 3.0,
          responseRate: 50,
          currentLat: BOOKING_LAT + 0.01,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Worker A' },
        },
        {
          id: 'worker2',
          rating: 5.0,
          responseRate: 90,
          currentLat: BOOKING_LAT + 0.001,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Worker B' },
        },
      ]);
      prismaMock.booking.count.mockResolvedValue(0);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      expect(candidates.length).toBe(2);
      // Worker2 (closer + higher rating + higher response rate) should score higher
      const worker2 = candidates.find((c) => c.workerId === 'worker2');
      const worker1 = candidates.find((c) => c.workerId === 'worker1');
      expect(worker2!.score).toBeGreaterThan(worker1!.score);
    });

    it('should return empty array when no workers are online', async () => {
      prismaMock.workerProfile.findMany.mockResolvedValue([]);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      expect(candidates).toEqual([]);
    });

    it('should exclude workers with null coordinates', async () => {
      prismaMock.workerProfile.findMany.mockResolvedValue([
        {
          id: 'worker1',
          rating: 4.0,
          responseRate: 80,
          currentLat: null,
          currentLng: null,
          isOnline: true,
          user: { name: 'Worker Null' },
        },
      ]);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      expect(candidates).toEqual([]);
    });

    it('should include workers at exact radius boundary', async () => {
      // Worker at ~4.9km — just inside 5km radius
      const almostAtRadius = BOOKING_LAT + 0.044;
      prismaMock.workerProfile.findMany.mockResolvedValue([
        {
          id: 'workerEdge',
          rating: 4.0,
          responseRate: 70,
          currentLat: almostAtRadius,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Edge Worker' },
        },
      ]);
      prismaMock.booking.count.mockResolvedValue(0);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      expect(candidates.length).toBe(1);
      expect(candidates[0].workerId).toBe('workerEdge');
    });

    it('should exclude workers beyond the radius (Haversine filter)', async () => {
      // Worker at ~10km from booking — outside 5km radius
      prismaMock.workerProfile.findMany.mockResolvedValue([
        {
          id: 'workerFar',
          rating: 5.0,
          responseRate: 100,
          currentLat: BOOKING_LAT + 0.09,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Far Worker' },
        },
      ]);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      expect(candidates).toEqual([]);
    });

    it('should account for completedToday in availability scoring', async () => {
      prismaMock.workerProfile.findMany.mockResolvedValue([
        {
          id: 'workerBusy',
          rating: 5.0,
          responseRate: 100,
          currentLat: BOOKING_LAT + 0.005,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Busy Worker' },
        },
        {
          id: 'workerFresh',
          rating: 5.0,
          responseRate: 100,
          currentLat: BOOKING_LAT + 0.005,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Fresh Worker' },
        },
      ]);

      // First call for workerBusy = 4 jobs, second for workerFresh = 0 jobs
      prismaMock.booking.count
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(0);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      const busy = candidates.find((c) => c.workerId === 'workerBusy');
      const fresh = candidates.find((c) => c.workerId === 'workerFresh');

      expect(fresh!.score).toBeGreaterThan(busy!.score);
      expect(fresh!.completedToday).toBe(0);
      expect(busy!.completedToday).toBe(4);
    });

    it('should handle new workers (0 reviews / default rating) without penalty', async () => {
      prismaMock.workerProfile.findMany.mockResolvedValue([
        {
          id: 'newWorker',
          rating: 0,
          responseRate: 0,
          currentLat: BOOKING_LAT + 0.001,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'New Worker' },
        },
      ]);
      prismaMock.booking.count.mockResolvedValue(0);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      expect(candidates.length).toBe(1);
      // Should still have proximity and availability points
      expect(candidates[0].score).toBeGreaterThan(0);
      expect(candidates[0].workerId).toBe('newWorker');
    });

    it('should break ties by completedToday (fewer completed = higher score)', async () => {
      prismaMock.workerProfile.findMany.mockResolvedValue([
        {
          id: 'workerA',
          rating: 4.0,
          responseRate: 80,
          currentLat: BOOKING_LAT + 0.005,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Worker A' },
        },
        {
          id: 'workerB',
          rating: 4.0,
          responseRate: 80,
          currentLat: BOOKING_LAT + 0.005,
          currentLng: BOOKING_LNG,
          isOnline: true,
          user: { name: 'Worker B' },
        },
      ]);

      // workerA has 3 jobs today, workerB has 0
      prismaMock.booking.count
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(0);

      const candidates = await service.findCandidates('Plumber', BOOKING_LAT, BOOKING_LNG, 5);

      const workerA = candidates.find((c) => c.workerId === 'workerA');
      const workerB = candidates.find((c) => c.workerId === 'workerB');

      // Worker B with fewer completedToday should have higher availability score → higher total
      expect(workerB!.score).toBeGreaterThan(workerA!.score);
    });
  });

  // ─── handleWorkerResponse() ────────────────────────────────────────────────

  describe('handleWorkerResponse()', () => {
    it('should set Redis key to "accepted" with TTL when worker accepts', async () => {
      await service.handleWorkerResponse('booking123', 'worker456', true);

      expect(redisMock.setWithTTL).toHaveBeenCalledWith(
        'matching:response:booking123:worker456',
        'accepted',
        120,
      );
    });

    it('should set Redis key to "declined" with TTL when worker declines', async () => {
      await service.handleWorkerResponse('booking123', 'worker456', false);

      expect(redisMock.setWithTTL).toHaveBeenCalledWith(
        'matching:response:booking123:worker456',
        'declined',
        120,
      );
    });

    it('should record decline reason in MatchingAttempt when provided', async () => {
      await service.handleWorkerResponse('booking123', 'worker456', false, 'Too far away');

      expect(prismaMock.matchingAttempt.updateMany).toHaveBeenCalledWith({
        where: { bookingId: 'booking123', workerId: 'worker456' },
        data: { declineReason: 'Too far away' },
      });
    });

    it('should not update decline reason if none is provided', async () => {
      await service.handleWorkerResponse('booking123', 'worker456', false);

      expect(prismaMock.matchingAttempt.updateMany).not.toHaveBeenCalled();
    });

    it('should not update MatchingAttempt when worker accepts (only Redis)', async () => {
      await service.handleWorkerResponse('booking123', 'worker456', true);

      expect(prismaMock.matchingAttempt.updateMany).not.toHaveBeenCalled();
    });
  });

  // ─── findAndAssignWorker() — Full Orchestration ────────────────────────────

  describe('findAndAssignWorker()', () => {
    const mockBooking = {
      id: 'booking123',
      customerId: 'customer456',
      latitude: BOOKING_LAT,
      longitude: BOOKING_LNG,
      status: 'MATCHING',
      categoryId: 'cat1',
    } as any;

    const mockFullBooking = {
      ...mockBooking,
      category: { name: 'Plumber' },
      customer: { id: 'customer456', name: 'Test Customer' },
    };

    it('should return matched=false when no booking found', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(null);

      const result = await service.findAndAssignWorker(mockBooking);

      expect(result).toEqual({ matched: false, attempts: 0 });
    });

    it('should notify customer when matching starts', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(mockFullBooking);
      prismaMock.workerProfile.findMany.mockResolvedValue([]);

      await service.findAndAssignWorker(mockBooking);

      expect(notificationMock.notify).toHaveBeenCalledWith(
        'customer456',
        'BOOKING_CREATED',
        expect.stringContaining('Finding'),
        expect.any(String),
        expect.objectContaining({ bookingId: 'booking123' }),
      );
    });

    it('should notify customer on match failure after all retries', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(mockFullBooking);
      prismaMock.workerProfile.findMany.mockResolvedValue([]);

      const result = await service.findAndAssignWorker(mockBooking);

      expect(result.matched).toBe(false);
      expect(notificationMock.notifyCustomerMatchFailed).toHaveBeenCalledWith(
        'customer456',
        'booking123',
      );
    });

    it('should set booking back to PENDING when no match found', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(mockFullBooking);
      prismaMock.workerProfile.findMany.mockResolvedValue([]);

      await service.findAndAssignWorker(mockBooking);

      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking123' },
        data: { status: 'PENDING' },
      });
    });
  });
});
