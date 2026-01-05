"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analytics = exports.trackRatingGiven = exports.trackAppOpened = exports.trackChatMessage = exports.trackPushNotificationSent = exports.trackServiceView = exports.trackServiceSearch = exports.trackWorkerVerification = exports.trackWorkerAvailabilityChange = exports.trackPaymentFailed = exports.trackPaymentCompleted = exports.trackPaymentInitiated = exports.trackBookingCancelled = exports.trackBookingCompleted = exports.trackBookingAccepted = exports.trackBookingCreated = exports.trackProfileUpdate = exports.trackUserLogin = exports.trackUserSignup = void 0;
const mixpanel_1 = __importDefault(require("mixpanel"));
const logger_1 = __importDefault(require("./logger"));
// Initialize Mixpanel
let mixpanel = null;
let analyticsEnabled = false;
if (process.env.MIXPANEL_TOKEN) {
    mixpanel = mixpanel_1.default.init(process.env.MIXPANEL_TOKEN, {
        protocol: 'https',
        keepAlive: false,
    });
    analyticsEnabled = true;
    logger_1.default.info('Mixpanel analytics initialized');
}
else {
    logger_1.default.warn('Mixpanel not configured. Set MIXPANEL_TOKEN in .env');
}
// Helper to safely track events
const track = (event, properties, distinctId) => {
    if (!analyticsEnabled || !mixpanel) {
        logger_1.default.debug({ event, properties }, '[MOCK] Analytics event');
        return;
    }
    try {
        if (distinctId) {
            mixpanel.track(event, {
                distinct_id: distinctId,
                ...properties,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
            });
        }
        else {
            mixpanel.track(event, {
                ...properties,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
            });
        }
        logger_1.default.debug({ event, distinctId }, 'Analytics event tracked');
    }
    catch (error) {
        logger_1.default.error({ error: error.message, event }, 'Analytics tracking failed');
    }
};
// Helper to set user properties
const setUserProperties = (userId, properties) => {
    if (!analyticsEnabled || !mixpanel) {
        return;
    }
    try {
        mixpanel.people.set(userId, properties);
        logger_1.default.debug({ userId, properties }, 'User properties set');
    }
    catch (error) {
        logger_1.default.error({ error: error.message }, 'Set user properties failed');
    }
};
// Increment user property
const incrementUserProperty = (userId, property, value = 1) => {
    if (!analyticsEnabled || !mixpanel) {
        return;
    }
    try {
        mixpanel.people.increment(userId, property, value);
    }
    catch (error) {
        logger_1.default.error({ error: error.message }, 'Increment property failed');
    }
};
// ===== USER EVENTS =====
const trackUserSignup = (userId, userType, data) => {
    track('User Signup', {
        user_type: userType,
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        location: data.location,
        signup_method: 'mobile_otp',
    }, userId);
    // Set user profile
    setUserProperties(userId, {
        $name: data.name,
        $phone: data.mobile,
        $email: data.email,
        user_type: userType,
        location: data.location,
        signup_date: new Date().toISOString(),
    });
};
exports.trackUserSignup = trackUserSignup;
const trackUserLogin = (userId, userType) => {
    track('User Login', {
        user_type: userType,
        login_method: 'mobile_otp',
    }, userId);
    incrementUserProperty(userId, 'login_count');
};
exports.trackUserLogin = trackUserLogin;
const trackProfileUpdate = (userId, updatedFields) => {
    track('Profile Updated', {
        fields_updated: updatedFields,
    }, userId);
};
exports.trackProfileUpdate = trackProfileUpdate;
// ===== BOOKING EVENTS =====
const trackBookingCreated = (bookingId, data) => {
    track('Booking Created', {
        booking_id: bookingId,
        service_id: data.serviceId,
        service_name: data.serviceName,
        amount: data.amount,
        location: data.location,
        urgency: data.urgency || 'normal',
    }, data.customerId);
    incrementUserProperty(data.customerId, 'bookings_created');
};
exports.trackBookingCreated = trackBookingCreated;
const trackBookingAccepted = (bookingId, data) => {
    track('Booking Accepted', {
        booking_id: bookingId,
        service_name: data.serviceName,
        response_time_seconds: data.responseTime,
    }, data.workerId);
    incrementUserProperty(data.workerId, 'bookings_accepted');
    // Also track for customer
    track('Booking Matched', {
        booking_id: bookingId,
        service_name: data.serviceName,
        time_to_match_seconds: data.responseTime,
    }, data.customerId);
};
exports.trackBookingAccepted = trackBookingAccepted;
const trackBookingCompleted = (bookingId, data) => {
    track('Booking Completed', {
        booking_id: bookingId,
        service_name: data.serviceName,
        amount: data.amount,
        duration_minutes: data.duration,
        rating: data.rating,
    }, data.workerId);
    incrementUserProperty(data.workerId, 'bookings_completed');
    incrementUserProperty(data.customerId, 'bookings_as_customer');
};
exports.trackBookingCompleted = trackBookingCompleted;
const trackBookingCancelled = (bookingId, data) => {
    track('Booking Cancelled', {
        booking_id: bookingId,
        service_name: data.serviceName,
        cancelled_by: data.userType,
        reason: data.reason,
        stage: data.stage,
    }, data.userId);
    incrementUserProperty(data.userId, 'bookings_cancelled');
};
exports.trackBookingCancelled = trackBookingCancelled;
// ===== PAYMENT EVENTS =====
const trackPaymentInitiated = (bookingId, data) => {
    track('Payment Initiated', {
        booking_id: bookingId,
        amount: data.amount,
        payment_method: data.paymentMethod,
    }, data.customerId);
};
exports.trackPaymentInitiated = trackPaymentInitiated;
const trackPaymentCompleted = (bookingId, data) => {
    track('Payment Completed', {
        booking_id: bookingId,
        amount: data.amount,
        platform_fee: data.platformFee,
        worker_earning: data.workerEarning,
        payment_method: data.paymentMethod,
    }, data.customerId);
    // Track revenue
    mixpanel?.track('Revenue', {
        distinct_id: data.customerId,
        booking_id: bookingId,
        amount: data.platformFee,
    });
    // Update worker earnings
    incrementUserProperty(data.workerId, 'total_earnings', data.workerEarning);
};
exports.trackPaymentCompleted = trackPaymentCompleted;
const trackPaymentFailed = (bookingId, data) => {
    track('Payment Failed', {
        booking_id: bookingId,
        amount: data.amount,
        failure_reason: data.reason,
    }, data.customerId);
};
exports.trackPaymentFailed = trackPaymentFailed;
// ===== WORKER EVENTS =====
const trackWorkerAvailabilityChange = (workerId, isAvailable) => {
    track('Worker Availability Changed', {
        is_available: isAvailable,
        status: isAvailable ? 'online' : 'offline',
    }, workerId);
    setUserProperties(workerId, {
        is_available: isAvailable,
        last_availability_change: new Date().toISOString(),
    });
};
exports.trackWorkerAvailabilityChange = trackWorkerAvailabilityChange;
const trackWorkerVerification = (workerId, data) => {
    track('Worker Verification', {
        document_type: data.documentType,
        verification_status: data.status,
    }, workerId);
    if (data.status === 'approved') {
        setUserProperties(workerId, {
            is_verified: true,
            verification_date: new Date().toISOString(),
        });
    }
};
exports.trackWorkerVerification = trackWorkerVerification;
// ===== SEARCH & DISCOVERY =====
const trackServiceSearch = (userId, data) => {
    track('Service Searched', {
        search_query: data.query,
        filters: data.filters,
        results_count: data.resultsCount,
    }, userId);
};
exports.trackServiceSearch = trackServiceSearch;
const trackServiceView = (userId, data) => {
    track('Service Viewed', {
        service_id: data.serviceId,
        service_name: data.serviceName,
        source: data.source,
    }, userId);
};
exports.trackServiceView = trackServiceView;
// ===== ENGAGEMENT EVENTS =====
const trackPushNotificationSent = (userId, data) => {
    track('Push Notification Sent', {
        notification_type: data.notificationType,
        delivery_status: data.deliveryStatus,
    }, userId);
};
exports.trackPushNotificationSent = trackPushNotificationSent;
const trackChatMessage = (userId, data) => {
    track('Chat Message Sent', {
        booking_id: data.bookingId,
        message_type: data.messageType,
    }, userId);
    incrementUserProperty(userId, 'messages_sent');
};
exports.trackChatMessage = trackChatMessage;
// ===== RETENTION & ENGAGEMENT =====
const trackAppOpened = (userId) => {
    track('App Opened', {}, userId);
    incrementUserProperty(userId, 'app_opens');
    setUserProperties(userId, {
        last_seen: new Date().toISOString(),
    });
};
exports.trackAppOpened = trackAppOpened;
const trackRatingGiven = (userId, data) => {
    track('Rating Given', {
        booking_id: data.bookingId,
        rating_value: data.ratingValue,
        has_review: data.hasReview,
    }, userId);
};
exports.trackRatingGiven = trackRatingGiven;
// Export helpers
exports.analytics = {
    track,
    setUserProperties,
    incrementUserProperty,
    isEnabled: () => analyticsEnabled,
};
exports.default = exports.analytics;
