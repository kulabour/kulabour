"use strict";
/**
 * Security utilities for KULABOUR Backend
 * Input validation, sanitization, and security helpers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureCompare = exports.logSecurityEvent = exports.validateRequiredFields = exports.maskSensitiveData = exports.isTrustedRequest = exports.getRateLimitKey = exports.isValidObjectId = exports.sanitizeString = exports.isValidIndianPhone = exports.isValidEmail = exports.hashForLog = exports.generateJWTSecret = exports.generateSecureToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = __importDefault(require("./logger"));
/**
 * Generate a cryptographically secure random string
 * @param {number} length - Length of the string
 * @returns {string} Secure random string
 */
const generateSecureToken = (length = 32) => {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateSecureToken = generateSecureToken;
/**
 * Generate a secure JWT secret (use this for production)
 * Run: node -e "logger.info(require('./utils/security').generateJWTSecret())"
 * @returns {string} 64-character secure secret
 */
const generateJWTSecret = () => {
    return crypto_1.default.randomBytes(64).toString('base64');
};
exports.generateJWTSecret = generateJWTSecret;
/**
 * Hash a password-like string for safe logging/storage
 * NOT for password storage (use bcrypt for that)
 * @param {string} value - Value to hash
 * @returns {string} SHA256 hash
 */
const hashForLog = (value) => {
    return crypto_1.default.createHash('sha256').update(value).digest('hex').substring(0, 16);
};
exports.hashForLog = hashForLog;
/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid Indian phone
 */
const isValidIndianPhone = (phone) => {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};
exports.isValidIndianPhone = isValidIndianPhone;
/**
 * Sanitize a string for safe display
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string')
        return '';
    return str
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove JS protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
};
exports.sanitizeString = sanitizeString;
/**
 * Validate ObjectId format (MongoDB)
 * @param {string} id - ID to validate
 * @returns {boolean} Is valid ObjectId
 */
const isValidObjectId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};
exports.isValidObjectId = isValidObjectId;
/**
 * Rate limit key generator based on user or IP
 * @param {object} req - Express request object
 * @returns {string} Unique key for rate limiting
 */
const getRateLimitKey = (req) => {
    if (req.user && req.user._id) {
        return `user:${req.user._id}`;
    }
    return `ip:${req.ip}`;
};
exports.getRateLimitKey = getRateLimitKey;
/**
 * Check if request is from a trusted source
 * @param {object} req - Express request object
 * @returns {boolean} Is trusted
 */
const isTrustedRequest = (req) => {
    const trustedIPs = ['127.0.0.1', '::1', 'localhost'];
    const trustedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
    const clientIP = req.ip || req.connection.remoteAddress || '';
    const origin = req.get('origin') || req.get('referer');
    return trustedIPs.includes(clientIP) ||
        trustedOrigins.some(o => origin?.includes(o));
};
exports.isTrustedRequest = isTrustedRequest;
/**
 * Mask sensitive data for logging
 * @param {object} obj - Object containing sensitive data
 * @param {string[]} fields - Fields to mask
 * @returns {object} Object with masked fields
 */
const maskSensitiveData = (obj, fields = ['password', 'token', 'otp', 'secret']) => {
    const masked = { ...obj };
    fields.forEach(field => {
        if (masked[field]) {
            masked[field] = '***MASKED***';
        }
    });
    return masked;
};
exports.maskSensitiveData = maskSensitiveData;
/**
 * Validate request body against required fields
 * @param {object} body - Request body
 * @param {string[]} required - Required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
const validateRequiredFields = (body, required) => {
    const missing = required.filter(field => {
        const value = body[field];
        return value === undefined || value === null || value === '';
    });
    return {
        valid: missing.length === 0,
        missing
    };
};
exports.validateRequiredFields = validateRequiredFields;
/**
 * Create a security audit log entry
 * @param {string} event - Security event type
 * @param {object} details - Event details
 */
const logSecurityEvent = (event, details) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        ...details
    };
    // In production, send to security monitoring service
    logger_1.default.warn({ security: logEntry }, 'SECURITY EVENT');
};
exports.logSecurityEvent = logSecurityEvent;
/**
 * Constant-time string comparison (prevents timing attacks)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} Are equal
 */
const secureCompare = (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string')
        return false;
    if (a.length !== b.length)
        return false;
    return crypto_1.default.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};
exports.secureCompare = secureCompare;
