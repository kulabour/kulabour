/**
 * Security utilities for KULABOUR Backend
 * Input validation, sanitization, and security helpers
 */

import crypto from 'crypto';
import { Request } from 'express';
import logger from './logger';

// Add user property to Request interface
declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                [key: string]: any;
            };
        }
    }
}

/**
 * Generate a cryptographically secure random string
 * @param {number} length - Length of the string
 * @returns {string} Secure random string
 */
export const generateSecureToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a secure JWT secret (use this for production)
 * Run: node -e "logger.info(require('./utils/security').generateJWTSecret())"
 * @returns {string} 64-character secure secret
 */
export const generateJWTSecret = (): string => {
    return crypto.randomBytes(64).toString('base64');
};

/**
 * Hash a password-like string for safe logging/storage
 * NOT for password storage (use bcrypt for that)
 * @param {string} value - Value to hash
 * @returns {string} SHA256 hash
 */
export const hashForLog = (value: string): string => {
    return crypto.createHash('sha256').update(value).digest('hex').substring(0, 16);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid Indian phone
 */
export const isValidIndianPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitize a string for safe display
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str: any): string => {
    if (typeof str !== 'string') return '';
    return str
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove JS protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
};

/**
 * Validate ObjectId format (MongoDB)
 * @param {string} id - ID to validate
 * @returns {boolean} Is valid ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};

/**
 * Rate limit key generator based on user or IP
 * @param {object} req - Express request object
 * @returns {string} Unique key for rate limiting
 */
export const getRateLimitKey = (req: Request): string => {
    if (req.user && req.user._id) {
        return `user:${req.user._id}`;
    }
    return `ip:${req.ip}`;
};

/**
 * Check if request is from a trusted source
 * @param {object} req - Express request object
 * @returns {boolean} Is trusted
 */
export const isTrustedRequest = (req: Request): boolean => {
    const trustedIPs = ['127.0.0.1', '::1', 'localhost'];
    const trustedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

    const clientIP = req.ip || req.connection.remoteAddress || '';
    const origin = req.get('origin') || req.get('referer');

    return trustedIPs.includes(clientIP) ||
        trustedOrigins.some(o => origin?.includes(o));
};

/**
 * Mask sensitive data for logging
 * @param {object} obj - Object containing sensitive data
 * @param {string[]} fields - Fields to mask
 * @returns {object} Object with masked fields
 */
export const maskSensitiveData = (obj: any, fields: string[] = ['password', 'token', 'otp', 'secret']): any => {
    const masked = { ...obj };
    fields.forEach(field => {
        if (masked[field]) {
            masked[field] = '***MASKED***';
        }
    });
    return masked;
};

/**
 * Validate request body against required fields
 * @param {object} body - Request body
 * @param {string[]} required - Required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
export const validateRequiredFields = (body: any, required: string[]): { valid: boolean; missing: string[] } => {
    const missing = required.filter(field => {
        const value = body[field];
        return value === undefined || value === null || value === '';
    });

    return {
        valid: missing.length === 0,
        missing
    };
};

/**
 * Create a security audit log entry
 * @param {string} event - Security event type
 * @param {object} details - Event details
 */
export const logSecurityEvent = (event: string, details: any): void => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        ...details
    };

    // In production, send to security monitoring service
    logger.warn({ security: logEntry }, 'SECURITY EVENT');
};

/**
 * Constant-time string comparison (prevents timing attacks)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} Are equal
 */
export const secureCompare = (a: string, b: string): boolean => {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};


