import { authenticate, authorize, generateAccessToken, generateRefreshToken } from '../../middleware/auth';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../../models/User';

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../models/User');

describe('Auth Middleware Unit Tests', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        mockReq = {
            headers: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('Token Generators', () => {
        const user = { id: '123', mobile: '9999999999', userType: 'customer', name: 'Test User' };

        it('should generate access token', () => {
            (jwt.sign as jest.Mock).mockReturnValue('mock_access_token');
            const token = generateAccessToken(user);
            expect(token).toBe('mock_access_token');
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: '123', mobile: '9999999999', role: 'customer' },
                expect.any(String),
                { expiresIn: '15m' }
            );
        });

        it('should generate refresh token', () => {
            (jwt.sign as jest.Mock).mockReturnValue('mock_refresh_token');
            const token = generateRefreshToken(user);
            expect(token).toBe('mock_refresh_token');
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: '123', mobile: '9999999999', role: 'customer' },
                expect.any(String),
                { expiresIn: '7d' }
            );
        });
    });

    describe('authenticate', () => {
        it('should return 401 if no authorization header', async () => {
            await authenticate(mockReq as Request, mockRes as Response, next);
            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Authentication required' }));
        });

        it('should return 401 if valid token but user not found', async () => {
            mockReq.headers = { authorization: 'Bearer valid_token' };
            (jwt.verify as jest.Mock).mockReturnValue({ userId: '123' });

            // Mock mongoose findById.select
            const mockSelect = jest.fn().mockResolvedValue(null);
            (User.findById as jest.Mock).mockReturnValue({ select: mockSelect });

            await authenticate(mockReq as Request, mockRes as Response, next);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'User not found' }));
        });

        it('should call next if authentication successful', async () => {
            mockReq.headers = { authorization: 'Bearer valid_token' };
            (jwt.verify as jest.Mock).mockReturnValue({ userId: '123' });

            const mockUser = { _id: '123', isActive: true };
            const mockSelect = jest.fn().mockResolvedValue(mockUser);
            (User.findById as jest.Mock).mockReturnValue({ select: mockSelect });

            await authenticate(mockReq as Request, mockRes as Response, next);

            expect(next).toHaveBeenCalled();
            expect((mockReq as any).user).toEqual(mockUser);
        });
    });

    describe('authorize', () => {
        it('should allow access if user has required role', () => {
            mockReq.user = { role: 'admin' } as any;
            const middleware = authorize('admin');

            middleware(mockReq as Request, mockRes as Response, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user does not have required role', () => {
            mockReq.user = { role: 'customer' } as any;
            const middleware = authorize('admin');

            middleware(mockReq as Request, mockRes as Response, next);
            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Forbidden' }));
        });
    });
});
