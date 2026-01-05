"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// In-memory OTP storage (replace with Redis in production)
const otpStore = new Map();
// Send OTP (simulated)
router.post('/send-otp', (req, res) => {
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
router.post('/verify-otp', (req, res) => {
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
    const accessToken = (0, auth_1.generateAccessToken)(user);
    const refreshToken = (0, auth_1.generateRefreshToken)(user);
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
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'Refresh token required' });
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        // Check refreshing using refresh secret if distinct, but original code used JWT_SECRET or separate
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET + '_refresh';
        const user = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        const newAccessToken = (0, auth_1.generateAccessToken)({
            id: user.userId, // Note: payload uses userId, previous code used id. generateAccessToken expects { id... }
            mobile: user.mobile,
            userType: user.role, // payload has role
            name: user.name || '', // Name might not be in token, but interface needs it. 
        });
        res.json({
            success: true,
            data: { accessToken: newAccessToken },
        });
    }
    catch (error) {
        res.status(403).json({ success: false, error: 'Invalid refresh token' });
    }
});
exports.default = router;
