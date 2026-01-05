import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@WebSocketGateway({
    namespace: 'bookings',
    cors: {
        origin: '*',
    },
})
export class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('BookingsGateway');

    constructor(private bookingsService: BookingsService) { }

    // Track connected users: userId -> socketId
    private connectedUsers: Map<string, string> = new Map();



    handleConnection(client: Socket) {
        // ... existing handleConnection code ...
    }

    handleDisconnect(client: Socket) {
        // ... existing handleDisconnect code ...
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
        client.join(roomId);
        this.logger.log(`Client ${client.id} joined room ${roomId}`);
        return { event: 'joined_room', data: roomId };
    }

    @SubscribeMessage('request_booking')
    async handleBookingRequest(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        this.logger.log(`New booking request: ${JSON.stringify(data)}`);

        // Persist booking so PaymentService can find it later
        try {
            // Check if booking exists or create new
            // For MVP socket flow, we trust the client's ID or ensure uniqueness
            await this.bookingsService.create({
                _id: data.bookingId, // Use client ID
                ...data,
                status: 'requested',
                createdAt: new Date()
            }, { userId: 'mock_user', name: data.customerName }); // Mock user context

        } catch (e) {
            this.logger.warn('Failed to persist booking from socket event', e);
        }

        // Broadcast to all workers (or specific ones in a real geo-query)
        // For MVP/Mock: Broadcast to 'workers' room or just emit global
        this.server.emit('new_booking_request', data);

        return { status: 'requested', data };
    }

    @SubscribeMessage('accept_booking')
    handleAcceptBooking(@MessageBody() data: { bookingId: string, workerId: string }, @ConnectedSocket() client: Socket) {
        this.logger.log(`Booking accepted: ${JSON.stringify(data)}`);

        // Notify the specific customer if mapped, or broadcast to booking room
        this.server.emit(`booking_status_${data.bookingId}`, {
            status: 'accepted',
            workerId: data.workerId
        });

        return { status: 'confirmed', data };
    }

    @SubscribeMessage('update_location')
    handleLocationUpdate(@MessageBody() data: { bookingId: string, latitude: number, longitude: number }, @ConnectedSocket() client: Socket) {
        // Relay location to the specific booking channel
        // In a real app, optimize this to avoiding headers overhead, use UDP or binary if extremely frequent
        // For MVP, socket.io is fine
        this.server.emit(`worker_location_${data.bookingId}`, {
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: Date.now()
        });
    }
}
