const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const connectDB = require('./config/database');
const { initializeWebSocket } = require('./websocket');

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

const servicesRoutes = require('./routes/services');
const bookingsRoutes = require('./routes/bookings');
const verificationRoutes = require('./routes/verification');
const authRoutes = require('./routes/auth');

const compression = require('compression');
const helmet = require('helmet');

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/verification', verificationRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Instant Labor Backend is running!' });
});

// Health Check
app.get('/health', (req, res) => {
    const dbStatus = require('mongoose').connection.readyState;
    res.status(200).json({
        status: 'OK',
        timestamp: new Date(),
        database: dbStatus === 1 ? 'connected' : 'disconnected',
    });
});

// Connect to MongoDB and Start Server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`🔌 WebSocket server ready`);
    });
});
