import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
export declare class LiveTrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    private activeConnections;
    private workerLocations;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSubscribe(client: Socket, data: TrackingSubscription): {
        success: boolean;
        bookingId: string;
    };
    handleUnsubscribe(client: Socket, data: {
        bookingId: string;
    }): {
        success: boolean;
    };
    handleWorkerLocation(client: Socket, data: LocationUpdate): {
        success: boolean;
    };
    handleWorkerETA(client: Socket, data: ETAUpdate): {
        success: boolean;
    };
    handleWorkerArrived(client: Socket, data: {
        bookingId: string;
        workerId: string;
    }): {
        success: boolean;
    };
    handlePing(client: Socket): {
        pong: boolean;
        timestamp: number;
    };
    emitLocationUpdate(bookingId: string, location: LocationUpdate): void;
    emitBookingStatus(bookingId: string, status: string, details?: any): void;
    getListenerCount(bookingId: string): number;
}
export {};
