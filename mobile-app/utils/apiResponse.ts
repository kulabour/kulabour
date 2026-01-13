/**
 * KULABOUR Standard API Response Wrapper
 * Ensures consistent response format across ALL API calls
 * 
 * SENIOR PATTERN: Every API response follows same structure
 */

export interface ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    error: ApiError | null;
    metadata: ResponseMetadata;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    // Hindi error message for user-facing errors
    hindiMessage?: string;
}

export interface ResponseMetadata {
    timestamp: string;
    requestId: string;
    version: string;
    latencyMs: number;
}

/**
 * Create success response
 */
export function successResponse<T>(
    data: T,
    requestId: string,
    startTime: number
): ApiResponse<T> {
    return {
        success: true,
        data,
        error: null,
        metadata: {
            timestamp: new Date().toISOString(),
            requestId,
            version: '1.0.0',
            latencyMs: Date.now() - startTime,
        },
    };
}

/**
 * Create error response
 */
export function errorResponse(
    code: string,
    message: string,
    hindiMessage?: string,
    details?: Record<string, any>
): ApiResponse<null> {
    return {
        success: false,
        data: null,
        error: {
            code,
            message,
            hindiMessage,
            details,
        },
        metadata: {
            timestamp: new Date().toISOString(),
            requestId: generateRequestId(),
            version: '1.0.0',
            latencyMs: 0,
        },
    };
}

/**
 * Common error codes with Hindi translations
 */
export const ErrorCodes = {
    // Auth errors
    AUTH_REQUIRED: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
        hindi: 'कृपया लॉगिन करें',
    },
    AUTH_EXPIRED: {
        code: 'AUTH_EXPIRED',
        message: 'Session expired',
        hindi: 'सेशन समाप्त हो गया। फिर से लॉगिन करें',
    },

    // Network errors
    NETWORK_ERROR: {
        code: 'NETWORK_ERROR',
        message: 'Network error',
        hindi: 'इंटरनेट कनेक्शन नहीं है',
    },
    TIMEOUT: {
        code: 'TIMEOUT',
        message: 'Request timed out',
        hindi: 'नेटवर्क धीमा है। दोबारा कोशिश करें',
    },

    // Business errors
    WORKER_NOT_AVAILABLE: {
        code: 'WORKER_NOT_AVAILABLE',
        message: 'Worker not available',
        hindi: 'वर्कर अभी उपलब्ध नहीं है',
    },
    BOOKING_FAILED: {
        code: 'BOOKING_FAILED',
        message: 'Booking failed',
        hindi: 'बुकिंग नहीं हो पाई। दोबारा कोशिश करें',
    },
    PAYMENT_FAILED: {
        code: 'PAYMENT_FAILED',
        message: 'Payment failed',
        hindi: 'पेमेंट नहीं हुआ। दोबारा कोशिश करें',
    },

    // Voice errors
    STT_FAILED: {
        code: 'STT_FAILED',
        message: 'Voice not recognized',
        hindi: 'आवाज़ समझ नहीं आई। दोबारा बोलें',
    },
    TTS_UNAVAILABLE: {
        code: 'TTS_UNAVAILABLE',
        message: 'Voice playback not available',
        hindi: 'आवाज़ चलाने में समस्या है',
    },

    // Validation errors
    INVALID_INPUT: {
        code: 'INVALID_INPUT',
        message: 'Invalid input',
        hindi: 'गलत जानकारी दी गई है',
    },
    MISSING_FIELD: {
        code: 'MISSING_FIELD',
        message: 'Required field missing',
        hindi: 'ज़रूरी जानकारी भरें',
    },
} as const;

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export { generateRequestId };
