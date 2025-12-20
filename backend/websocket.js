const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeWebSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', // In production, specify your mobile app domain
            methods: ['GET', 'POST'],
        },
    });

    // Authentication Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id} (User: ${socket.user.id})`);

        // Join booking room
        socket.on('join_booking', (bookingId) => {
            socket.join(`booking_${bookingId}`);
            console.log(`📍 Client ${socket.id} joined booking_${bookingId}`);
        });

        // Leave booking room
        socket.on('leave_booking', (bookingId) => {
            socket.leave(`booking_${bookingId}`);
            console.log(`📤 Client ${socket.id} left booking_${bookingId}`);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    console.log('🔌 WebSocket server initialized');
    return io;
};

// Emit booking status change to all clients in the booking room
const emitBookingUpdate = (bookingId, data) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('booking:status_changed', data);
        console.log(`📢 Emitted status update for booking_${bookingId}:`, data.status);
    }
};

// Emit worker location update
const emitLocationUpdate = (bookingId, location) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('worker:location_update', location);
    }
};

// Emit worker assigned
const emitWorkerAssigned = (bookingId, workerData) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('booking:assigned', workerData);
    }
};

module.exports = {
    initializeWebSocket,
    emitBookingUpdate,
    emitLocationUpdate,
    emitWorkerAssigned,
};
