import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BookingsService } from './bookings.service';
export declare class BookingsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private bookingsService;
    server: Server;
    private logger;
    constructor(bookingsService: BookingsService);
    private connectedUsers;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(roomId: string, client: Socket): {
        event: string;
        data: string;
    };
    handleBookingRequest(data: any, client: Socket): Promise<{
        status: string;
        data: any;
    }>;
    handleAcceptBooking(data: {
        bookingId: string;
        workerId: string;
    }, client: Socket): {
        status: string;
        data: {
            bookingId: string;
            workerId: string;
        };
    };
    handleLocationUpdate(data: {
        bookingId: string;
        latitude: number;
        longitude: number;
    }, client: Socket): void;
}
