"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitWorkerAssigned = exports.emitLocationUpdate = exports.emitBookingUpdate = exports.initializeWebSocket = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("./utils/logger"));
let io;
const initializeWebSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // In production, specify your mobile app domain
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        logger_1.default.debug({ socketId: socket.id, clientIP: socket.handshake.address }, 'WebSocket client connected');
        // Join booking room
        socket.on('join_booking', (bookingId) => {
            socket.join(`booking_${bookingId}`);
            logger_1.default.debug({ socketId: socket.id, bookingId }, 'Client joined booking room');
        });
        // Leave booking room
        socket.on('leave_booking', (bookingId) => {
            socket.leave(`booking_${bookingId}`);
            logger_1.default.debug({ socketId: socket.id, bookingId }, 'Client left booking room');
        });
        // Handle disconnect
        socket.on('disconnect', () => {
            logger_1.default.debug({ socketId: socket.id }, 'WebSocket client disconnected');
        });
    });
    logger_1.default.info('WebSocket server initialized');
    return io;
};
exports.initializeWebSocket = initializeWebSocket;
// Emit booking status change to all clients in the booking room
const emitBookingUpdate = (bookingId, data) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('booking:status_changed', data);
        logger_1.default.debug({ bookingId, status: data.status }, 'Emitted booking status update');
    }
};
exports.emitBookingUpdate = emitBookingUpdate;
// Emit worker location update
const emitLocationUpdate = (bookingId, location) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('worker:location_update', location);
        logger_1.default.debug({ bookingId, location }, 'Emitted worker location update');
    }
};
exports.emitLocationUpdate = emitLocationUpdate;
// Emit worker assigned
const emitWorkerAssigned = (bookingId, workerData) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('booking:assigned', workerData);
        logger_1.default.info({ bookingId, workerId: workerData._id }, 'Emitted worker assigned event');
    }
};
exports.emitWorkerAssigned = emitWorkerAssigned;
