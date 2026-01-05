/**
 * KULABOUR - Security Utilities
 * Input sanitization, validation, and security helpers
 */

// Indian Phone Number Validation
const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
const INDIAN_PHONE_WITH_CODE_REGEX = /^\+91[6-9]\d{9}$/;

/**
 * Sanitize string input - remove potential XSS
 */
export function sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return '';

    return input
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        // Remove javascript: URLs
        .replace(/javascript:/gi, '')
        // Remove data: URLs (except for images if needed)
        .replace(/data:/gi, '')
        // Escape special characters
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        // Trim whitespace
        .trim();
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject<T extends object>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
    if (!phone) return false;

    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Check with or without country code
    return INDIAN_PHONE_REGEX.test(cleaned) ||
        INDIAN_PHONE_WITH_CODE_REGEX.test(cleaned);
}

/**
 * Format Indian phone number
 */
export function formatIndianPhone(phone: string): string {
    if (!phone) return '';

    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');

    // Remove country code if present
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = cleaned.slice(2);
    }

    // Format as: +91 XXXXX XXXXX
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }

    return phone;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate Aadhaar number (12 digits)
 */
export function isValidAadhaar(aadhaar: string): boolean {
    if (!aadhaar) return false;

    const cleaned = aadhaar.replace(/[\s-]/g, '');
    return /^\d{12}$/.test(cleaned);
}

/**
 * Mask Aadhaar number (show only last 4 digits)
 */
export function maskAadhaar(aadhaar: string): string {
    if (!aadhaar) return '';

    const cleaned = aadhaar.replace(/[\s-]/g, '');
    if (cleaned.length !== 12) return aadhaar;

    return `XXXX XXXX ${cleaned.slice(-4)}`;
}

/**
 * Validate PAN card number
 */
export function isValidPAN(pan: string): boolean {
    if (!pan) return false;

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase().trim());
}

/**
 * Validate Indian pincode
 */
export function isValidPincode(pincode: string): boolean {
    if (!pincode) return false;

    return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Validate IFSC code
 */
export function isValidIFSC(ifsc: string): boolean {
    if (!ifsc) return false;

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.toUpperCase().trim());
}

/**
 * Validate UPI ID
 */
export function isValidUPI(upi: string): boolean {
    if (!upi) return false;

    const upiRegex = /^[\w.-]+@[\w]+$/;
    return upiRegex.test(upi.trim());
}

/**
 * Generate secure OTP (6 digits)
 */
export function generateOTP(): string {
    // Use crypto if available, otherwise Math.random
    const array = new Uint32Array(1);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
        return String(100000 + (array[0] % 900000));
    }
    return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Mask phone number for display
 */
export function maskPhone(phone: string): string {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) return phone;

    // Show first 2 and last 2 digits
    const lastTen = cleaned.slice(-10);
    return `${lastTen.slice(0, 2)}******${lastTen.slice(-2)}`;
}

/**
 * Mask email for display
 */
export function maskEmail(email: string): string {
    if (!email || !email.includes('@')) return '';

    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;

    const maskedLocal = `${local.charAt(0)}${'*'.repeat(local.length - 2)}${local.charAt(local.length - 1)}`;
    return `${maskedLocal}@${domain}`;
}

/**
 * Check for SQL injection patterns
 */
export function containsSQLInjection(input: string): boolean {
    if (!input) return false;

    const sqlPatterns = [
        /(\s|^)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)(\s|$)/i,
        /('|")\s*(OR|AND)\s*('|"|\d)/i,
        /;\s*(DROP|DELETE|UPDATE|INSERT)/i,
        /--/,
        /\/\*/,
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Rate limit tracker (simple in-memory implementation)
 */
class RateLimiter {
    private attempts: Map<string, number[]> = new Map();
    private maxAttempts: number;
    private windowMs: number;

    constructor(maxAttempts: number = 5, windowMs: number = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    /**
     * Check if action is allowed
     */
    isAllowed(key: string): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        // Remove old attempts outside window
        const validAttempts = attempts.filter(time => now - time < this.windowMs);

        if (validAttempts.length >= this.maxAttempts) {
            return false;
        }

        validAttempts.push(now);
        this.attempts.set(key, validAttempts);
        return true;
    }

    /**
     * Get remaining attempts
     */
    getRemainingAttempts(key: string): number {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        const validAttempts = attempts.filter(time => now - time < this.windowMs);
        return Math.max(0, this.maxAttempts - validAttempts.length);
    }

    /**
     * Get time until reset
     */
    getTimeUntilReset(key: string): number {
        const attempts = this.attempts.get(key) || [];
        if (attempts.length === 0) return 0;

        const oldestAttempt = Math.min(...attempts);
        const resetTime = oldestAttempt + this.windowMs;
        return Math.max(0, resetTime - Date.now());
    }

    /**
     * Reset attempts for a key
     */
    reset(key: string): void {
        this.attempts.delete(key);
    }
}

// Export singleton instances
export const otpRateLimiter = new RateLimiter(3, 60000); // 3 OTPs per minute
export const loginRateLimiter = new RateLimiter(5, 300000); // 5 logins per 5 minutes
export const paymentRateLimiter = new RateLimiter(10, 60000); // 10 payment attempts per minute

export default {
    sanitizeString,
    sanitizeObject,
    isValidIndianPhone,
    formatIndianPhone,
    isValidEmail,
    isValidAadhaar,
    maskAadhaar,
    isValidPAN,
    isValidPincode,
    isValidIFSC,
    isValidUPI,
    generateOTP,
    maskPhone,
    maskEmail,
    containsSQLInjection,
    otpRateLimiter,
    loginRateLimiter,
    paymentRateLimiter,
};
