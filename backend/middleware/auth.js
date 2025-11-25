const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        }

        req.user = user; // Attach user info to request
        next();
    });
};

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};

// Generate refresh token  
const generateRefreshToken = (user) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken,
    JWT_SECRET,
};
