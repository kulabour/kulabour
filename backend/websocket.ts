import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from './utils/logger';

let io: Server;

export const initializeWebSocket = (server: HttpServer): Server => {
    io = new Server(server, {
        cors: {
            origin: '*', // In production, specify your mobile app domain
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket: Socket) => {
        logger.debug({ socketId: socket.id, clientIP: socket.handshake.address }, 'WebSocket client connected');

        // Join booking room
        socket.on('join_booking', (bookingId: string) => {
            socket.join(`booking_${bookingId}`);
            logger.debug({ socketId: socket.id, bookingId }, 'Client joined booking room');
        });

        // Leave booking room
        socket.on('leave_booking', (bookingId: string) => {
            socket.leave(`booking_${bookingId}`);
            logger.debug({ socketId: socket.id, bookingId }, 'Client left booking room');
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            logger.debug({ socketId: socket.id }, 'WebSocket client disconnected');
        });
    });

    logger.info('WebSocket server initialized');
    return io;
};

// Emit booking status change to all clients in the booking room
export const emitBookingUpdate = (bookingId: string, data: any) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('booking:status_changed', data);
        logger.debug({ bookingId, status: data.status }, 'Emitted booking status update');
    }
};

// Emit worker location update
export const emitLocationUpdate = (bookingId: string, location: any) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('worker:location_update', location);
        logger.debug({ bookingId, location }, 'Emitted worker location update');
    }
};

// Emit worker assigned
export const emitWorkerAssigned = (bookingId: string, workerData: any) => {
    if (io) {
        io.to(`booking_${bookingId}`).emit('booking:assigned', workerData);
        logger.info({ bookingId, workerId: workerData._id }, 'Emitted worker assigned event');
    }
};
