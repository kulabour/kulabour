const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');

// In-memory OTP storage (replace with Redis in production)
const otpStore = new Map();

// Joi Schemas
const sendOtpSchema = Joi.object({
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required()
});

const verifyOtpSchema = Joi.object({
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    otp: Joi.string().length(6).required(),
    userType: Joi.string().valid('customer', 'worker').optional()
});

// Send OTP
router.post('/send-otp', (req, res) => {
    const { error } = sendOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const { mobile } = req.body;

    // Generate 6-digit OTP (More secure than 4)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (expires in 5 minutes)
    otpStore.set(mobile, { otp, expires: Date.now() + 5 * 60 * 1000 });

    // In production, send SMS via Twilio/AWS SNS
    console.log(`[SECURE LOG] OTP for ${mobile}: ${otp}`);

    res.json({
        success: true,
        message: 'OTP sent successfully',
        expiresIn: 300 // 5 minutes
    });
});

// Verify OTP and return JWT
router.post('/verify-otp', (req, res) => {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const { mobile, otp, userType } = req.body;

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
router.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'Refresh token required' });
    }

    try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('../middleware/auth');

        const user = jwt.verify(refreshToken, JWT_SECRET);
        const newAccessToken = generateAccessToken({
            id: user.id,
            mobile: user.mobile,
            userType: user.userType,
            name: user.name,
        });

        res.json({
            success: true,
            data: { accessToken: newAccessToken },
        });
    } catch (error) {
        res.status(403).json({ success: false, error: 'Invalid refresh token' });
    }
});

module.exports = router;
