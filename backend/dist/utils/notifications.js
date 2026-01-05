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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInitialized = exports.admin = exports.sendChatMessage = exports.sendPaymentReceived = exports.sendBookingStatusUpdate = exports.sendWorkerAssigned = exports.sendBookingCreated = exports.sendToDevices = exports.sendToDevice = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
const logger_1 = __importDefault(require("./logger"));
// Initialize Firebase Admin (with placeholder - add your service account)
let firebaseInitialized = false;
try {
    // Try to initialize with service account
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH))
        });
        firebaseInitialized = true;
        logger_1.default.info('✅ Firebase Admin initialized');
    }
    else {
        logger_1.default.warn('⚠️  Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH in .env');
    }
}
catch (error) {
    logger_1.default.warn({ data: error.message }, '⚠️  Firebase initialization failed:');
}
/**
 * Send notification to a single device
 * @param {string} fcmToken - Firebase Cloud Messaging token
 * @param {object} notification - Notification object
 */
const sendToDevice = async (fcmToken, notification) => {
    if (!firebaseInitialized) {
        logger_1.default.info({ data: notification.title }, '📧 [MOCK] Would send notification:');
        return { success: false, reason: 'Firebase not configured' };
    }
    try {
        const message = {
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
        const response = await firebase_admin_1.default.messaging().send(message);
        logger_1.default.info({ data: response }, '✅ Notification sent:');
        return { success: true, messageId: response };
    }
    catch (error) {
        logger_1.default.error({ data: error }, '❌ FCM send error:');
        return { success: false, error: error.message };
    }
};
exports.sendToDevice = sendToDevice;
/**
 * Send to multiple devices
 */
const sendToDevices = async (fcmTokens, notification) => {
    if (!firebaseInitialized) {
        logger_1.default.info({ deviceCount: fcmTokens.length }, '📧 [MOCK] Would send notification to devices');
        return { success: false };
    }
    try {
        // Send to each token individually (sendMulticast might not be available in all versions)
        let successCount = 0;
        for (const token of fcmTokens) {
            const result = await (0, exports.sendToDevice)(token, notification);
            if (result.success)
                successCount++;
        }
        logger_1.default.info(`✅ Sent to ${successCount}/${fcmTokens.length} devices`);
        return { success: true, successCount };
    }
    catch (error) {
        logger_1.default.error({ data: error }, '❌ Multi-device send error:');
        return { success: false, error: error.message };
    }
};
exports.sendToDevices = sendToDevices;
// ===== NOTIFICATION TEMPLATES =====
/**
 * Send booking created notification to nearby workers
 */
const sendBookingCreated = async (workerId, booking) => {
    // Dynamic require to avoid circular dependency/initialization issues if models depend on utils (unlikely here but safe)
    // Actually safe to import models here usually, but keeping logic similar.
    // Importing User model
    const User = (await Promise.resolve().then(() => __importStar(require('../models/User')))).default;
    const user = await User.findById(workerId);
    if (!user?.fcmToken) {
        logger_1.default.info({ data: workerId }, 'No FCM token for worker:');
        return;
    }
    return await (0, exports.sendToDevice)(user.fcmToken, {
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
exports.sendBookingCreated = sendBookingCreated;
/**
 * Send worker assigned notification to customer
 */
const sendWorkerAssigned = async (customerId, booking) => {
    const User = (await Promise.resolve().then(() => __importStar(require('../models/User')))).default;
    const user = await User.findById(customerId);
    if (!user?.fcmToken)
        return;
    return await (0, exports.sendToDevice)(user.fcmToken, {
        title: '✅ Worker Assigned!',
        body: `${booking.workerName} पहुंच रहे हैं\n📍 ${booking.address}`,
        data: {
            type: 'WORKER_ASSIGNED',
            bookingId: booking._id.toString(),
            workerId: booking.workerId.toString()
        }
    });
};
exports.sendWorkerAssigned = sendWorkerAssigned;
/**
 * Send booking status update
 */
const sendBookingStatusUpdate = async (userId, booking, newStatus) => {
    const User = (await Promise.resolve().then(() => __importStar(require('../models/User')))).default;
    const user = await User.findById(userId);
    if (!user?.fcmToken)
        return;
    const statusMessages = {
        accepted: `${booking.workerName} ने आपका booking accept किया`,
        arriving: `${booking.workerName} पहुंच रहे हैं (15-20 मिनट)`,
        in_progress: 'काम शुरू हो गया है',
        completed: '✅ काम पूरा हो गया! Payment pending',
        cancelled: '❌ Booking cancelled'
    };
    return await (0, exports.sendToDevice)(user.fcmToken, {
        title: 'Booking Update',
        body: statusMessages[newStatus] || `Status: ${newStatus}`,
        data: {
            type: 'STATUS_UPDATE',
            bookingId: booking._id.toString(),
            status: newStatus
        }
    });
};
exports.sendBookingStatusUpdate = sendBookingStatusUpdate;
/**
 * Send payment received notification
 */
const sendPaymentReceived = async (workerId, booking, amount) => {
    const User = (await Promise.resolve().then(() => __importStar(require('../models/User')))).default;
    const user = await User.findById(workerId);
    if (!user?.fcmToken)
        return;
    return await (0, exports.sendToDevice)(user.fcmToken, {
        title: '💰 Payment Received',
        body: `₹${amount} मिल गया!\nBooking: ${booking.serviceName}`,
        data: {
            type: 'PAYMENT_RECEIVED',
            bookingId: booking._id.toString(),
            amount: amount.toString()
        }
    });
};
exports.sendPaymentReceived = sendPaymentReceived;
/**
 * Send chat message notification
 */
const sendChatMessage = async (userId, fromName, message) => {
    const User = (await Promise.resolve().then(() => __importStar(require('../models/User')))).default;
    const user = await User.findById(userId);
    if (!user?.fcmToken)
        return;
    return await (0, exports.sendToDevice)(user.fcmToken, {
        title: `💬 ${fromName}`,
        body: message,
        data: {
            type: 'CHAT_MESSAGE',
            fromName
        }
    });
};
exports.sendChatMessage = sendChatMessage;
const isInitialized = () => firebaseInitialized;
exports.isInitialized = isInitialized;
