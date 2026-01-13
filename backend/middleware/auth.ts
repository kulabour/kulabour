import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

/**
 * Authenticate user via JWT token
 * Requires: Authorization: Bearer <token>
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Fetch fresh user data from database
        const user = await User.findById(decoded.userId).select('-password');

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
        req.user = user as any;
        next();

    } catch (err: any) {
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

/**
 * Authorize user based on roles
 * Usage: authorize('customer', 'worker')
 */
export const authorize = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required to access this resource'
            });
        }

        const userRole = req.user.role || req.user.userType;

        if (!allowedRoles.includes(userRole as string)) {
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

/**
 * Optional authentication (attaches user if token provided, but doesn't require it)
 * Useful for routes that have different behavior for authenticated vs anonymous users
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No token provided, continue without user
        return next();
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await User.findById(decoded.userId).select('-password');

        if (user && user.isActive !== false) {
            req.user = user as any;
        }
    } catch (err) {
        // Ignore authentication errors for optional auth
        // User will be undefined, route can handle accordingly
    }

    next();
};

/**
 * Verify user owns the resource they're trying to access
 * Example: Ensure user can only update their own profile
 */
export const verifyOwnership = (resourceUserIdField: string = 'userId') => {
    return (req: Request, res: Response, next: NextFunction) => {
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

export const generateAccessToken = (user: { id: string | unknown, mobile: string, userType: string, name: string }) => {
    return jwt.sign(
        { userId: user.id, mobile: user.mobile, role: user.userType },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (user: { id: string | unknown, mobile: string, userType: string, name: string }) => {
    return jwt.sign(
        { userId: user.id, mobile: user.mobile, role: user.userType },
        process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET as string) + '_refresh',
        { expiresIn: '7d' }
    );
};
