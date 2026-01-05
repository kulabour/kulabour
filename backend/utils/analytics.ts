import Mixpanel from 'mixpanel';
import logger from './logger';

// Initialize Mixpanel
let mixpanel: Mixpanel.Mixpanel | null = null;
let analyticsEnabled = false;

if (process.env.MIXPANEL_TOKEN) {
    mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN, {
        protocol: 'https',
        keepAlive: false,
    });
    analyticsEnabled = true;
    logger.info('Mixpanel analytics initialized');
} else {
    logger.warn('Mixpanel not configured. Set MIXPANEL_TOKEN in .env');
}

// Helper to safely track events
const track = (event: string, properties?: Record<string, any>, distinctId?: string) => {
    if (!analyticsEnabled || !mixpanel) {
        logger.debug({ event, properties }, '[MOCK] Analytics event');
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
        } else {
            mixpanel.track(event, {
                ...properties,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
            });
        }
        logger.debug({ event, distinctId }, 'Analytics event tracked');
    } catch (error: any) {
        logger.error({ error: error.message, event }, 'Analytics tracking failed');
    }
};

// Helper to set user properties
const setUserProperties = (userId: string, properties: Record<string, any>) => {
    if (!analyticsEnabled || !mixpanel) {
        return;
    }

    try {
        mixpanel.people.set(userId, properties);
        logger.debug({ userId, properties }, 'User properties set');
    } catch (error: any) {
        logger.error({ error: error.message }, 'Set user properties failed');
    }
};

// Increment user property
const incrementUserProperty = (userId: string, property: string, value: number = 1) => {
    if (!analyticsEnabled || !mixpanel) {
        return;
    }

    try {
        mixpanel.people.increment(userId, property, value);
    } catch (error: any) {
        logger.error({ error: error.message }, 'Increment property failed');
    }
};

// ===== USER EVENTS =====

export const trackUserSignup = (userId: string, userType: 'customer' | 'worker', data: {
    name: string;
    mobile: string;
    email?: string;
    location?: string;
}) => {
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

export const trackUserLogin = (userId: string, userType: 'customer' | 'worker') => {
    track('User Login', {
        user_type: userType,
        login_method: 'mobile_otp',
    }, userId);

    incrementUserProperty(userId, 'login_count');
};

export const trackProfileUpdate = (userId: string, updatedFields: string[]) => {
    track('Profile Updated', {
        fields_updated: updatedFields,
    }, userId);
};

// ===== BOOKING EVENTS =====

export const trackBookingCreated = (bookingId: string, data: {
    customerId: string;
    serviceId: string;
    serviceName: string;
    amount: number;
    location: string;
    urgency?: 'urgent' | 'normal';
}) => {
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

export const trackBookingAccepted = (bookingId: string, data: {
    workerId: string;
    customerId: string;
    serviceName: string;
    responseTime: number; // seconds
}) => {
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

export const trackBookingCompleted = (bookingId: string, data: {
    workerId: string;
    customerId: string;
    serviceName: string;
    amount: number;
    duration: number; // minutes
    rating?: number;
}) => {
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

export const trackBookingCancelled = (bookingId: string, data: {
    userId: string;
    userType: 'customer' | 'worker';
    serviceName: string;
    reason?: string;
    stage: 'pending' | 'accepted' | 'in_progress';
}) => {
    track('Booking Cancelled', {
        booking_id: bookingId,
        service_name: data.serviceName,
        cancelled_by: data.userType,
        reason: data.reason,
        stage: data.stage,
    }, data.userId);

    incrementUserProperty(data.userId, 'bookings_cancelled');
};

// ===== PAYMENT EVENTS =====

export const trackPaymentInitiated = (bookingId: string, data: {
    customerId: string;
    amount: number;
    paymentMethod: string;
}) => {
    track('Payment Initiated', {
        booking_id: bookingId,
        amount: data.amount,
        payment_method: data.paymentMethod,
    }, data.customerId);
};

export const trackPaymentCompleted = (bookingId: string, data: {
    customerId: string;
    workerId: string;
    amount: number;
    platformFee: number;
    workerEarning: number;
    paymentMethod: string;
}) => {
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

export const trackPaymentFailed = (bookingId: string, data: {
    customerId: string;
    amount: number;
    reason: string;
}) => {
    track('Payment Failed', {
        booking_id: bookingId,
        amount: data.amount,
        failure_reason: data.reason,
    }, data.customerId);
};

// ===== WORKER EVENTS =====

export const trackWorkerAvailabilityChange = (workerId: string, isAvailable: boolean) => {
    track('Worker Availability Changed', {
        is_available: isAvailable,
        status: isAvailable ? 'online' : 'offline',
    }, workerId);

    setUserProperties(workerId, {
        is_available: isAvailable,
        last_availability_change: new Date().toISOString(),
    });
};

export const trackWorkerVerification = (workerId: string, data: {
    documentType: string;
    status: 'submitted' | 'approved' | 'rejected';
}) => {
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

// ===== SEARCH & DISCOVERY =====

export const trackServiceSearch = (userId: string, data: {
    query: string;
    filters?: Record<string, any>;
    resultsCount: number;
}) => {
    track('Service Searched', {
        search_query: data.query,
        filters: data.filters,
        results_count: data.resultsCount,
    }, userId);
};

export const trackServiceView = (userId: string, data: {
    serviceId: string;
    serviceName: string;
    source: 'search' | 'browse' | 'notification';
}) => {
    track('Service Viewed', {
        service_id: data.serviceId,
        service_name: data.serviceName,
        source: data.source,
    }, userId);
};

// ===== ENGAGEMENT EVENTS =====

export const trackPushNotificationSent = (userId: string, data: {
    notificationType: string;
    deliveryStatus: 'sent' | 'failed';
}) => {
    track('Push Notification Sent', {
        notification_type: data.notificationType,
        delivery_status: data.deliveryStatus,
    }, userId);
};

export const trackChatMessage = (userId: string, data: {
    bookingId: string;
    messageType: 'text' | 'image' | 'location';
}) => {
    track('Chat Message Sent', {
        booking_id: data.bookingId,
        message_type: data.messageType,
    }, userId);

    incrementUserProperty(userId, 'messages_sent');
};

// ===== RETENTION & ENGAGEMENT =====

export const trackAppOpened = (userId: string) => {
    track('App Opened', {}, userId);
    incrementUserProperty(userId, 'app_opens');
    setUserProperties(userId, {
        last_seen: new Date().toISOString(),
    });
};

export const trackRatingGiven = (userId: string, data: {
    bookingId: string;
    ratingValue: number;
    hasReview: boolean;
}) => {
    track('Rating Given', {
        booking_id: data.bookingId,
        rating_value: data.ratingValue,
        has_review: data.hasReview,
    }, userId);
};

// Export helpers
export const analytics = {
    track,
    setUserProperties,
    incrementUserProperty,
    isEnabled: () => analyticsEnabled,
};

export default analytics;
