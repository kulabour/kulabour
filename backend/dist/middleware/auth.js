"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.verifyOwnership = exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
/**
 * Authenticate user via JWT token
 * Requires: Authorization: Bearer <token>
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'Please provide a valid authorization token'
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Fetch fresh user data from database
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                error: 'User not found',
                message: 'The user associated with this token no longer exists'
            });
        }
        if (user.isActive === false) { // Explicit check for false, assuming default might be undefined or true
            return res.status(401).json({
                error: 'Account deactivated',
                message: 'Your account has been deactivated. Please contact support.'
            });
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token',
                message: 'The provided token is invalid'
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                message: 'Your session has expired. Please login again.'
            });
        }
        next(err); // Pass other errors to error handler
    }
};
exports.authenticate = authenticate;
/**
 * Authorize user based on roles
 * Usage: authorize('customer', 'worker')
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required to access this resource'
            });
        }
        const userRole = req.user.role || req.user.userType;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`,
                required: allowedRoles,
                current: userRole
            });
        }
        next();
    };
};
exports.authorize = authorize;
/**
 * Optional authentication (attaches user if token provided, but doesn't require it)
 * Useful for routes that have different behavior for authenticated vs anonymous users
 */
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No token provided, continue without user
        return next();
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (user && user.isActive !== false) {
            req.user = user;
        }
    }
    catch (err) {
        // Ignore authentication errors for optional auth
        // User will be undefined, route can handle accordingly
    }
    next();
};
exports.optionalAuth = optionalAuth;
/**
 * Verify user owns the resource they're trying to access
 * Example: Ensure user can only update their own profile
 */
const verifyOwnership = (resourceUserIdField = 'userId') => {
    return (req, res, next) => {
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
        if (!resourceUserId) {
            return res.status(400).json({
                error: 'Missing user ID',
                message: 'Resource user ID not found in request'
            });
        }
        if (!req.user || resourceUserId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only access your own resources'
            });
        }
        next();
    };
};
exports.verifyOwnership = verifyOwnership;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, mobile: user.mobile, role: user.userType }, process.env.JWT_SECRET, { expiresIn: '15m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id, mobile: user.mobile, role: user.userType }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh', { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
