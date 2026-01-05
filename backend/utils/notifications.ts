import admin from 'firebase-admin';
import logger from './logger';

// Initialize Firebase Admin (with placeholder - add your service account)
let firebaseInitialized = false;

try {
    // Try to initialize with service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        admin.initializeApp({
            credential: admin.credential.cert(
                require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
            )
        });
        firebaseInitialized = true;
        logger.info('✅ Firebase Admin initialized');
    } else {
        logger.warn('⚠️  Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH in .env');
    }
} catch (error: any) {
    logger.warn({ data: error.message }, '⚠️  Firebase initialization failed:');
}

interface NotificationPayload {
    title: string;
    body: string;
    image?: string;
    data?: any;
    badge?: number;
}

/**
 * Send notification to a single device
 * @param {string} fcmToken - Firebase Cloud Messaging token  
 * @param {object} notification - Notification object
 */
export const sendToDevice = async (fcmToken: string, notification: NotificationPayload) => {
    if (!firebaseInitialized) {
        logger.info({ data: notification.title }, '📧 [MOCK] Would send notification:');
        return { success: false, reason: 'Firebase not configured' };
    }

    try {
        const message: admin.messaging.Message = {
            token: fcmToken,
            notification: {
                title: notification.title,
                body: notification.body,
                imageUrl: notification.image || undefined
            },
            data: notification.data || {},
            android: {
                priority: 'high',
                notification: {
                    sound: 'default',
                    channelId: 'kulabour_bookings',
                    color: '#0078D4'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: notification.badge || 1,
                        contentAvailable: true
                    }
                }
            }
        };

        const response = await admin.messaging().send(message);
        logger.info({ data: response }, '✅ Notification sent:');
        return { success: true, messageId: response };
    } catch (error: any) {
        logger.error({ data: error }, '❌ FCM send error:');
        return { success: false, error: error.message };
    }
};

/**
 * Send to multiple devices
 */
export const sendToDevices = async (fcmTokens: string[], notification: NotificationPayload) => {
    if (!firebaseInitialized) {
        logger.info({ deviceCount: fcmTokens.length }, '📧 [MOCK] Would send notification to devices');
        return { success: false };
    }

    try {
        // Send to each token individually (sendMulticast might not be available in all versions)
        let successCount = 0;
        for (const token of fcmTokens) {
            const result = await sendToDevice(token, notification);
            if (result.success) successCount++;
        }

        logger.info(`✅ Sent to ${successCount}/${fcmTokens.length} devices`);
        return { success: true, successCount };
    } catch (error: any) {
        logger.error({ data: error }, '❌ Multi-device send error:');
        return { success: false, error: error.message };
    }
};

// ===== NOTIFICATION TEMPLATES =====

/**
 * Send booking created notification to nearby workers
 */
export const sendBookingCreated = async (workerId: string, booking: any) => {
    // Dynamic require to avoid circular dependency/initialization issues if models depend on utils (unlikely here but safe)
    // Actually safe to import models here usually, but keeping logic similar.
    // Importing User model
    const User = (await import('../models/User')).default;
    const user = await User.findById(workerId);

    if (!user?.fcmToken) {
        logger.info({ data: workerId }, 'No FCM token for worker:');
        return;
    }

    return await sendToDevice(user.fcmToken, {
        title: `🔔 नया booking: ${booking.serviceName}`,
        body: `${booking.customerName} को ${booking.serviceName} चाहिए\n📍 ${booking.address}`,
        image: booking.serviceImage,
        data: {
            type: 'BOOKING_CREATED',
            bookingId: booking._id.toString(),
            navigate: '/bookings/' + booking._id
        },
        badge: 1
    });
};

/**
 * Send worker assigned notification to customer
 */
export const sendWorkerAssigned = async (customerId: string, booking: any) => {
    const User = (await import('../models/User')).default;
    const user = await User.findById(customerId);

    if (!user?.fcmToken) return;

    return await sendToDevice(user.fcmToken, {
        title: '✅ Worker Assigned!',
        body: `${booking.workerName} पहुंच रहे हैं\n📍 ${booking.address}`,
        data: {
            type: 'WORKER_ASSIGNED',
            bookingId: booking._id.toString(),
            workerId: (booking.workerId as any).toString()
        }
    });
};

/**
 * Send booking status update
 */
export const sendBookingStatusUpdate = async (userId: string, booking: any, newStatus: string) => {
    const User = (await import('../models/User')).default;
    const user = await User.findById(userId);

    if (!user?.fcmToken) return;

    const statusMessages: Record<string, string> = {
        accepted: `${booking.workerName} ने आपका booking accept किया`,
        arriving: `${booking.workerName} पहुंच रहे हैं (15-20 मिनट)`,
        in_progress: 'काम शुरू हो गया है',
        completed: '✅ काम पूरा हो गया! Payment pending',
        cancelled: '❌ Booking cancelled'
    };

    return await sendToDevice(user.fcmToken, {
        title: 'Booking Update',
        body: statusMessages[newStatus] || `Status: ${newStatus}`,
        data: {
            type: 'STATUS_UPDATE',
            bookingId: booking._id.toString(),
            status: newStatus
        }
    });
};

/**
 * Send payment received notification
 */
export const sendPaymentReceived = async (workerId: string, booking: any, amount: number) => {
    const User = (await import('../models/User')).default;
    const user = await User.findById(workerId);

    if (!user?.fcmToken) return;

    return await sendToDevice(user.fcmToken, {
        title: '💰 Payment Received',
        body: `₹${amount} मिल गया!\nBooking: ${booking.serviceName}`,
        data: {
            type: 'PAYMENT_RECEIVED',
            bookingId: booking._id.toString(),
            amount: amount.toString()
        }
    });
};

/**
 * Send chat message notification
 */
export const sendChatMessage = async (userId: string, fromName: string, message: string) => {
    const User = (await import('../models/User')).default;
    const user = await User.findById(userId);

    if (!user?.fcmToken) return;

    return await sendToDevice(user.fcmToken, {
        title: `💬 ${fromName}`,
        body: message,
        data: {
            type: 'CHAT_MESSAGE',
            fromName
        }
    });
};

export { admin };
export const isInitialized = () => firebaseInitialized;


