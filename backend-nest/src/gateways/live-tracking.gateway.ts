/**
 * KULABOUR - Live Tracking WebSocket Gateway
 * Real-time location updates for worker tracking
 */

import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

interface LocationUpdate {
    bookingId: string;
    workerId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    timestamp: number;
}

interface ETAUpdate {
    bookingId: string;
    etaMinutes: number;
    distanceMeters: number;
    trafficCondition: 'light' | 'moderate' | 'heavy';
}

interface TrackingSubscription {
    bookingId: string;
    userId: string;
    role: 'customer' | 'worker';
}

@WebSocketGateway({
    cors: {
        origin: '*', // Configure for production
    },
    namespace: '/live-tracking',
})
export class LiveTrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(LiveTrackingGateway.name);

    // Track active connections
    private activeConnections: Map<string, {
        userId: string;
        role: string;
        subscriptions: Set<string>;
    }> = new Map();

    // Track worker locations in memory for quick access
    private workerLocations: Map<string, LocationUpdate> = new Map();

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        this.activeConnections.set(client.id, {
            userId: '',
            role: '',
            subscriptions: new Set(),
        });

        // Send connection acknowledgment
        client.emit('connection_ack', {
            connected: true,
            timestamp: Date.now(),
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);

        // Cleanup subscriptions
        const connection = this.activeConnections.get(client.id);
        if (connection) {
            connection.subscriptions.forEach(bookingId => {
                client.leave(`booking:${bookingId}`);
            });
        }

        this.activeConnections.delete(client.id);
    }

    @SubscribeMessage('subscribe')
    handleSubscribe(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: TrackingSubscription,
    ) {
        const { bookingId, userId, role } = data;

        // Update connection info
        const connection = this.activeConnections.get(client.id);
        if (connection) {
            connection.userId = userId;
            connection.role = role;
            connection.subscriptions.add(bookingId);
        }

        // Join booking room
        client.join(`booking:${bookingId}`);

        this.logger.log(`User ${userId} (${role}) subscribed to booking ${bookingId}`);

        // Send current worker location if available
        const currentLocation = this.workerLocations.get(bookingId);
        if (currentLocation) {
            client.emit('location_update', currentLocation);
        }

        return { success: true, bookingId };
    }

    @SubscribeMessage('unsubscribe')
    handleUnsubscribe(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { bookingId: string },
    ) {
        const { bookingId } = data;

        // Leave room
        client.leave(`booking:${bookingId}`);

        // Update connection
        const connection = this.activeConnections.get(client.id);
        if (connection) {
            connection.subscriptions.delete(bookingId);
        }

        this.logger.log(`Client ${client.id} unsubscribed from booking ${bookingId}`);
        return { success: true };
    }

    @SubscribeMessage('worker_location')
    handleWorkerLocation(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: LocationUpdate,
    ) {
        const { bookingId } = data;

        // Store latest location
        this.workerLocations.set(bookingId, {
            ...data,
            timestamp: Date.now(),
        });

        // Broadcast to all clients watching this booking
        this.server.to(`booking:${bookingId}`).emit('location_update', {
            ...data,
            timestamp: Date.now(),
        });

        this.logger.debug(`Worker location update for booking ${bookingId}`);
        return { success: true };
    }

    @SubscribeMessage('worker_eta')
    handleWorkerETA(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: ETAUpdate,
    ) {
        const { bookingId } = data;

        // Broadcast ETA update
        this.server.to(`booking:${bookingId}`).emit('eta_update', {
            ...data,
            timestamp: Date.now(),
        });

        return { success: true };
    }

    @SubscribeMessage('worker_arrived')
    handleWorkerArrived(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { bookingId: string; workerId: string },
    ) {
        const { bookingId, workerId } = data;

        // Notify customer
        this.server.to(`booking:${bookingId}`).emit('worker_arrived', {
            bookingId,
            workerId,
            arrivedAt: Date.now(),
        });

        this.logger.log(`Worker ${workerId} arrived for booking ${bookingId}`);

        // Cleanup location tracking
        this.workerLocations.delete(bookingId);

        return { success: true };
    }

    @SubscribeMessage('ping')
    handlePing(@ConnectedSocket() client: Socket) {
        return { pong: true, timestamp: Date.now() };
    }

    // Utility methods for external use

    /**
     * Emit location update from external service
     */
    emitLocationUpdate(bookingId: string, location: LocationUpdate) {
        this.workerLocations.set(bookingId, location);
        this.server.to(`booking:${bookingId}`).emit('location_update', location);
    }

    /**
     * Emit booking status change
     */
    emitBookingStatus(bookingId: string, status: string, details?: any) {
        this.server.to(`booking:${bookingId}`).emit('booking_status', {
            bookingId,
            status,
            details,
            timestamp: Date.now(),
        });
    }

    /**
     * Get active listeners count for a booking
     */
    getListenerCount(bookingId: string): number {
        const room = this.server.sockets.adapter.rooms.get(`booking:${bookingId}`);
        return room ? room.size : 0;
    }
}
