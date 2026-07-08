import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { FcmService } from './fcm.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationType, NotificationChannel } from '@prisma/client';
import { UpdateNotificationPrefsDto } from './dto/notification.dto';

/**
 * UNIFIED NOTIFICATION SERVICE
 * ──────────────────────────────────────────────────────────────────────────────
 * Central dispatcher for all notifications in the Kuli Platform.
 * Checks user preferences, dispatches via appropriate channels,
 * and persists to database for inbox retrieval.
 *
 * Channels:
 *   PUSH      — FCM push notification (mobile)
 *   WEBSOCKET — Real-time WebSocket event (in-app)
 *   SMS       — Fallback for critical alerts (handled by SmsGateway)
 *   IN_APP    — Stored in DB for inbox view
 */

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly fcm: FcmService,
    private readonly gateway: NotificationGateway,
  ) {}

  // ─── Core Dispatch ─────────────────────────────────────────────────────────

  /**
   * Send a notification to a user.
   * Checks preferences, dispatches via appropriate channels, and saves to DB.
   */
  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: any,
  ): Promise<void> {
    // Get or create notification preferences
    const prefs = await this.getOrCreatePrefs(userId);

    // Check if notification type is enabled
    if (!this.isTypeEnabled(type, prefs)) {
      console.log(`🔕 Notification suppressed for user ${userId}: ${type} (disabled)`);
      return;
    }

    // Check quiet hours
    if (this.isQuietHours(prefs)) {
      console.log(`🌙 Notification queued for user ${userId}: quiet hours active`);
      // Still save to DB for inbox, but skip push/SMS
      await this.saveNotification(userId, type, title, body, data, 'IN_APP');
      return;
    }

    // Save to DB (always — serves as inbox)
    await this.saveNotification(userId, type, title, body, data, 'IN_APP');

    // Dispatch via WebSocket (real-time, in-app)
    this.gateway.emitToUser(userId, this.getEventName(type), {
      type,
      title,
      body,
      data,
      timestamp: new Date().toISOString(),
    });

    // Dispatch via Push (FCM)
    if (prefs.pushEnabled && prefs.fcmToken) {
      const pushData = data ? this.stringifyData(data) : undefined;
      await this.fcm.sendPush(prefs.fcmToken, title, body, pushData);
    }

    // Invalidate unread count cache
    await this.redis.del(`notifications:unread:${userId}`);
  }

  // ─── Worker-Specific Notifications ──────────────────────────────────────────

  /**
   * Send a job alert to a worker — push + WebSocket.
   */
  async notifyWorkerJobAlert(workerId: string, booking: any): Promise<void> {
    // Get the worker's userId from their profile
    const profile = await this.prisma.workerProfile.findUnique({
      where: { id: workerId },
      select: { userId: true },
    });
    if (!profile) return;

    const title = '🔔 New Job Alert!';
    const body = `New ${booking.category?.name || 'job'} request near you — ₹${booking.totalAmount}`;

    await this.notify(profile.userId, 'WORKER_MATCHED', title, body, {
      bookingId: booking.id,
      categoryName: booking.category?.name,
      address: booking.address,
      totalAmount: booking.totalAmount,
      latitude: booking.latitude,
      longitude: booking.longitude,
    });
  }

  // ─── Customer-Specific Notifications ────────────────────────────────────────

  /**
   * Notify customer that a worker has been matched.
   */
  async notifyCustomerMatched(
    customerId: string,
    worker: any,
    booking: any,
  ): Promise<void> {
    const title = '✅ Worker Found!';
    const body = `${worker.user?.name || 'A worker'} has been matched to your booking. They'll be on their way soon!`;

    await this.notify(customerId, 'WORKER_MATCHED', title, body, {
      bookingId: booking.id,
      workerId: worker.id,
      workerName: worker.user?.name,
      workerRating: worker.rating,
    });
  }

  /**
   * Notify customer that no worker was found after all retries.
   */
  async notifyCustomerMatchFailed(
    customerId: string,
    bookingId: string,
  ): Promise<void> {
    const title = '😔 No Workers Available';
    const body = 'We couldn\'t find an available worker right now. We\'ll keep trying and notify you when someone becomes available.';

    await this.notify(customerId, 'MATCHING_FAILED', title, body, {
      bookingId,
    });
  }

  // ─── Inbox & Preferences ───────────────────────────────────────────────────

  /**
   * Get paginated notifications for a user (inbox).
   */
  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Mark a notification as read.
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });

    // Invalidate cache
    await this.redis.del(`notifications:unread:${userId}`);
  }

  /**
   * Get unread notification count (cached in Redis).
   */
  async getUnreadCount(userId: string): Promise<number> {
    // Check cache first
    const cached = await this.redis.get(`notifications:unread:${userId}`);
    if (cached !== null) return parseInt(cached, 10);

    // Query DB
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    // Cache for 60 seconds
    await this.redis.setWithTTL(`notifications:unread:${userId}`, String(count), 60);

    return count;
  }

  /**
   * Get user's notification preferences.
   */
  async getPreferences(userId: string) {
    return this.getOrCreatePrefs(userId);
  }

  /**
   * Update user's notification preferences.
   */
  async updatePreferences(userId: string, dto: UpdateNotificationPrefsDto) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }

  /**
   * Register or update FCM token for a user.
   */
  async registerFcmToken(userId: string, fcmToken: string) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, fcmToken },
      update: { fcmToken },
    });
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private async getOrCreatePrefs(userId: string) {
    let prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await this.prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return prefs;
  }

  private isTypeEnabled(type: NotificationType, prefs: any): boolean {
    switch (type) {
      case 'BOOKING_CREATED':
      case 'WORKER_MATCHED':
      case 'WORKER_ACCEPTED':
      case 'WORKER_DECLINED':
      case 'WORKER_EN_ROUTE':
      case 'WORKER_ARRIVED':
      case 'JOB_COMPLETED':
      case 'MATCHING_FAILED':
        return prefs.bookingAlerts;
      case 'PAYMENT_RECEIVED':
        return prefs.paymentAlerts;
      case 'PROMOTION':
        return prefs.promotionAlerts;
      default:
        return true;
    }
  }

  private isQuietHours(prefs: any): boolean {
    if (prefs.quietHoursStart == null || prefs.quietHoursEnd == null) return false;

    const now = new Date();
    // Use IST (UTC+5:30)
    const istHour = (now.getUTCHours() + 5 + Math.floor((now.getUTCMinutes() + 30) / 60)) % 24;

    const start = prefs.quietHoursStart;
    const end = prefs.quietHoursEnd;

    if (start <= end) {
      return istHour >= start && istHour < end;
    }
    // Wraps midnight (e.g., 22:00 — 07:00)
    return istHour >= start || istHour < end;
  }

  private getEventName(type: NotificationType): string {
    const eventMap: Record<string, string> = {
      BOOKING_CREATED: 'booking:status',
      WORKER_MATCHED: 'matching:found',
      WORKER_ACCEPTED: 'job:accepted',
      WORKER_DECLINED: 'booking:status',
      WORKER_EN_ROUTE: 'booking:status',
      WORKER_ARRIVED: 'booking:status',
      JOB_COMPLETED: 'booking:status',
      PAYMENT_RECEIVED: 'booking:status',
      MATCHING_FAILED: 'matching:failed',
      PROMOTION: 'booking:status',
    };
    return eventMap[type] || 'booking:status';
  }

  private saveNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data: any,
    channel: NotificationChannel,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        data: data || undefined,
        channel,
      },
    });
  }

  private stringifyData(data: any): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = String(value);
    }
    return result;
  }
}
