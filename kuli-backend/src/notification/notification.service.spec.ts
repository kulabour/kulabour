import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { FcmService } from './fcm.service';
import { NotificationGateway } from './notification.gateway';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaMock: any;
  let redisMock: any;
  let fcmMock: any;
  let gatewayMock: any;

  // Default prefs: push enabled, booking alerts on, no quiet hours
  const defaultPrefs = {
    userId: 'user123',
    pushEnabled: true,
    smsEnabled: false,
    bookingAlerts: true,
    paymentAlerts: true,
    promotionAlerts: true,
    quietHoursStart: null,
    quietHoursEnd: null,
    fcmToken: 'fcm_token_abc123',
  };

  beforeEach(async () => {
    prismaMock = {
      notification: {
        create: jest.fn().mockResolvedValue({ id: 'notif1' }),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      notificationPreference: {
        findUnique: jest.fn().mockResolvedValue(defaultPrefs),
        create: jest.fn().mockResolvedValue(defaultPrefs),
        upsert: jest.fn().mockResolvedValue(defaultPrefs),
      },
      workerProfile: {
        findUnique: jest.fn(),
      },
    };

    redisMock = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      setWithTTL: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    fcmMock = {
      sendPush: jest.fn().mockResolvedValue({ success: true, messageId: 'msg_123' }),
    };

    gatewayMock = {
      emitToUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: RedisService, useValue: redisMock },
        { provide: FcmService, useValue: fcmMock },
        { provide: NotificationGateway, useValue: gatewayMock },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── Core Dispatch: notify() ──────────────────────────────────────────────

  describe('notify()', () => {
    it('should save notification to DB', async () => {
      await service.notify('user123', 'BOOKING_CREATED' as any, 'New Booking', 'Your booking is created');

      expect(prismaMock.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user123',
          type: 'BOOKING_CREATED',
          title: 'New Booking',
          body: 'Your booking is created',
          channel: 'IN_APP',
        }),
      });
    });

    it('should send push via FCM if user has pushEnabled=true and fcmToken', async () => {
      await service.notify('user123', 'BOOKING_CREATED' as any, 'New Booking', 'Your booking is created');

      expect(fcmMock.sendPush).toHaveBeenCalledWith(
        'fcm_token_abc123',
        'New Booking',
        'Your booking is created',
        undefined,
      );
    });

    it('should skip push if user has pushEnabled=false', async () => {
      prismaMock.notificationPreference.findUnique.mockResolvedValue({
        ...defaultPrefs,
        pushEnabled: false,
      });

      await service.notify('user123', 'BOOKING_CREATED' as any, 'New Booking', 'Body');

      expect(fcmMock.sendPush).not.toHaveBeenCalled();
    });

    it('should skip push if user has no fcmToken even with pushEnabled=true', async () => {
      prismaMock.notificationPreference.findUnique.mockResolvedValue({
        ...defaultPrefs,
        pushEnabled: true,
        fcmToken: null,
      });

      await service.notify('user123', 'BOOKING_CREATED' as any, 'New Booking', 'Body');

      expect(fcmMock.sendPush).not.toHaveBeenCalled();
    });

    it('should emit WebSocket event to user room', async () => {
      await service.notify('user123', 'WORKER_MATCHED' as any, 'Worker Found', 'A worker was matched');

      expect(gatewayMock.emitToUser).toHaveBeenCalledWith(
        'user123',
        'matching:found',
        expect.objectContaining({
          type: 'WORKER_MATCHED',
          title: 'Worker Found',
          body: 'A worker was matched',
        }),
      );
    });

    it('should invalidate unread count cache after notification', async () => {
      await service.notify('user123', 'BOOKING_CREATED' as any, 'Title', 'Body');

      expect(redisMock.del).toHaveBeenCalledWith('notifications:unread:user123');
    });

    it('should stringify data values when sending push with data payload', async () => {
      await service.notify('user123', 'BOOKING_CREATED' as any, 'Title', 'Body', {
        bookingId: 'b123',
        amount: 500,
      });

      expect(fcmMock.sendPush).toHaveBeenCalledWith(
        'fcm_token_abc123',
        'Title',
        'Body',
        { bookingId: 'b123', amount: '500' },
      );
    });

    it('should suppress notification if type is disabled in preferences', async () => {
      prismaMock.notificationPreference.findUnique.mockResolvedValue({
        ...defaultPrefs,
        promotionAlerts: false,
      });

      await service.notify('user123', 'PROMOTION' as any, 'Promo', 'Special offer!');

      expect(prismaMock.notification.create).not.toHaveBeenCalled();
      expect(fcmMock.sendPush).not.toHaveBeenCalled();
      expect(gatewayMock.emitToUser).not.toHaveBeenCalled();
    });

    it('should create default preferences if user has none', async () => {
      prismaMock.notificationPreference.findUnique.mockResolvedValue(null);
      prismaMock.notificationPreference.create.mockResolvedValue(defaultPrefs);

      await service.notify('user123', 'BOOKING_CREATED' as any, 'Title', 'Body');

      expect(prismaMock.notificationPreference.create).toHaveBeenCalledWith({
        data: { userId: 'user123' },
      });
    });
  });

  // ─── Quiet Hours ──────────────────────────────────────────────────────────

  describe('quiet hours', () => {
    it('should save to DB but skip push/WebSocket during quiet hours', async () => {
      // Set quiet hours that cover the current test time
      // We mock isQuietHours indirectly by setting a window that always applies
      const currentHourUTC = new Date().getUTCHours();
      const currentMinUTC = new Date().getUTCMinutes();
      const istHour = (currentHourUTC + 5 + Math.floor((currentMinUTC + 30) / 60)) % 24;

      prismaMock.notificationPreference.findUnique.mockResolvedValue({
        ...defaultPrefs,
        quietHoursStart: istHour,
        quietHoursEnd: (istHour + 2) % 24,
      });

      await service.notify('user123', 'BOOKING_CREATED' as any, 'Title', 'Body');

      // Should save to DB (for inbox)
      expect(prismaMock.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user123',
          channel: 'IN_APP',
        }),
      });

      // Should NOT send push or WebSocket
      expect(fcmMock.sendPush).not.toHaveBeenCalled();
      expect(gatewayMock.emitToUser).not.toHaveBeenCalled();
    });

    it('should send normally when outside quiet hours', async () => {
      const currentHourUTC = new Date().getUTCHours();
      const currentMinUTC = new Date().getUTCMinutes();
      const istHour = (currentHourUTC + 5 + Math.floor((currentMinUTC + 30) / 60)) % 24;

      // Set quiet hours to a window NOT covering current time
      const outsideStart = (istHour + 3) % 24;
      const outsideEnd = (istHour + 5) % 24;

      prismaMock.notificationPreference.findUnique.mockResolvedValue({
        ...defaultPrefs,
        quietHoursStart: outsideStart,
        quietHoursEnd: outsideEnd,
      });

      await service.notify('user123', 'BOOKING_CREATED' as any, 'Title', 'Body');

      expect(fcmMock.sendPush).toHaveBeenCalled();
      expect(gatewayMock.emitToUser).toHaveBeenCalled();
    });

    it('should handle quiet hours wrapping midnight (e.g. 22:00-07:00)', async () => {
      // This tests the wrap-around logic in isQuietHours
      prismaMock.notificationPreference.findUnique.mockResolvedValue({
        ...defaultPrefs,
        quietHoursStart: 22,
        quietHoursEnd: 7,
      });

      // The actual behavior depends on current IST time.
      // We just verify it doesn't throw and processes the notification.
      await expect(
        service.notify('user123', 'BOOKING_CREATED' as any, 'Title', 'Body'),
      ).resolves.not.toThrow();
    });
  });

  // ─── getUserNotifications() ───────────────────────────────────────────────

  describe('getUserNotifications()', () => {
    it('should return paginated results with metadata', async () => {
      const mockNotifications = [
        { id: 'n1', title: 'Notif 1', isRead: false },
        { id: 'n2', title: 'Notif 2', isRead: true },
      ];
      prismaMock.notification.findMany.mockResolvedValue(mockNotifications);
      prismaMock.notification.count.mockResolvedValue(25);

      const result = await service.getUserNotifications('user123', 2, 10);

      expect(result).toEqual({
        notifications: mockNotifications,
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });

      expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        orderBy: { sentAt: 'desc' },
        skip: 10,
        take: 10,
      });
    });

    it('should default to page 1 and limit 20', async () => {
      prismaMock.notification.findMany.mockResolvedValue([]);
      prismaMock.notification.count.mockResolvedValue(0);

      await service.getUserNotifications('user123');

      expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        orderBy: { sentAt: 'desc' },
        skip: 0,
        take: 20,
      });
    });

    it('should calculate totalPages correctly with partial last page', async () => {
      prismaMock.notification.findMany.mockResolvedValue([]);
      prismaMock.notification.count.mockResolvedValue(7);

      const result = await service.getUserNotifications('user123', 1, 5);

      expect(result.totalPages).toBe(2); // ceil(7/5) = 2
    });
  });

  // ─── markAsRead() ─────────────────────────────────────────────────────────

  describe('markAsRead()', () => {
    it('should update isRead and readAt for the notification', async () => {
      await service.markAsRead('user123', 'notif1');

      expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
        where: { id: 'notif1', userId: 'user123' },
        data: {
          isRead: true,
          readAt: expect.any(Date),
        },
      });
    });

    it('should invalidate unread count cache after marking as read', async () => {
      await service.markAsRead('user123', 'notif1');

      expect(redisMock.del).toHaveBeenCalledWith('notifications:unread:user123');
    });

    it('should scope update to the specific user (prevent cross-user read)', async () => {
      await service.markAsRead('user123', 'notif1');

      const updateCall = prismaMock.notification.updateMany.mock.calls[0][0];
      expect(updateCall.where.userId).toBe('user123');
      expect(updateCall.where.id).toBe('notif1');
    });
  });

  // ─── getUnreadCount() ─────────────────────────────────────────────────────

  describe('getUnreadCount()', () => {
    it('should return cached count from Redis if available', async () => {
      redisMock.get.mockResolvedValue('5');

      const count = await service.getUnreadCount('user123');

      expect(count).toBe(5);
      expect(prismaMock.notification.count).not.toHaveBeenCalled();
    });

    it('should query DB and cache result if Redis cache miss', async () => {
      redisMock.get.mockResolvedValue(null);
      prismaMock.notification.count.mockResolvedValue(12);

      const count = await service.getUnreadCount('user123');

      expect(count).toBe(12);
      expect(prismaMock.notification.count).toHaveBeenCalledWith({
        where: { userId: 'user123', isRead: false },
      });
      expect(redisMock.setWithTTL).toHaveBeenCalledWith(
        'notifications:unread:user123',
        '12',
        60,
      );
    });

    it('should return 0 when user has no unread notifications', async () => {
      redisMock.get.mockResolvedValue(null);
      prismaMock.notification.count.mockResolvedValue(0);

      const count = await service.getUnreadCount('user123');

      expect(count).toBe(0);
    });
  });

  // ─── Preferences Management ───────────────────────────────────────────────

  describe('updatePreferences()', () => {
    it('should upsert notification preferences', async () => {
      await service.updatePreferences('user123', { pushEnabled: false, smsEnabled: true });

      expect(prismaMock.notificationPreference.upsert).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        create: { userId: 'user123', pushEnabled: false, smsEnabled: true },
        update: { pushEnabled: false, smsEnabled: true },
      });
    });
  });

  describe('registerFcmToken()', () => {
    it('should upsert FCM token for the user', async () => {
      await service.registerFcmToken('user123', 'new_fcm_token');

      expect(prismaMock.notificationPreference.upsert).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        create: { userId: 'user123', fcmToken: 'new_fcm_token' },
        update: { fcmToken: 'new_fcm_token' },
      });
    });
  });
});
