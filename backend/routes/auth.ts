import express, { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const router = express.Router();

// In-memory OTP storage (replace with Redis in production)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Send OTP (simulated)
router.post('/send-otp', (req: Request, res: Response) => {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
        return res.status(400).json({ success: false, error: 'Invalid mobile number' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Store OTP (expires in 5 minutes)
    otpStore.set(mobile, { otp, expires: Date.now() + 5 * 60 * 1000 });

    // In production, send SMS via Twilio/AWS SNS
    console.log(`[AUTH] OTP for ${mobile}: ${otp}`);

    res.json({
        success: true,
        message: 'OTP sent successfully',
        // For development only - remove in production!
        debug: { otp },
    });
});

// Verify OTP and return JWT
router.post('/verify-otp', (req: Request, res: Response) => {
    const { mobile, otp, userType } = req.body; // userType: 'customer' | 'worker'

    if (!mobile || !otp) {
        return res.status(400).json({ success: false, error: 'Mobile and OTP required' });
    }

    const storedData = otpStore.get(mobile);

    if (!storedData) {
        return res.status(400).json({ success: false, error: 'OTP not found or expired' });
    }

    if (storedData.expires < Date.now()) {
        otpStore.delete(mobile);
        return res.status(400).json({ success: false, error: 'OTP expired' });
    }

    if (storedData.otp !== otp) {
        return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // OTP verified - clear it
    otpStore.delete(mobile);

    // Create user payload
    const user = {
        id: `user_${mobile}`,
        mobile,
        userType: userType || 'customer',
        name: userType === 'worker' ? 'Worker Name' : 'Customer Name', // In production, get from DB
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user,
            accessToken,
            refreshToken,
        },
    });
});

// Refresh access token
router.post('/refresh', (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'Refresh token required' });
    }

    try {
        const JWT_SECRET = process.env.JWT_SECRET as string;
        // Check refreshing using refresh secret if distinct, but original code used JWT_SECRET or separate
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';

        const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
        const newAccessToken = generateAccessToken({
            id: user.userId, // Note: payload uses userId, previous code used id. generateAccessToken expects { id... }
            mobile: user.mobile,
            userType: user.role, // payload has role
            name: user.name || '',    // Name might not be in token, but interface needs it. 
        });

        res.json({
            success: true,
            data: { accessToken: newAccessToken },
        });
    } catch (error) {
        res.status(403).json({ success: false, error: 'Invalid refresh token' });
    }
});

export default router;
