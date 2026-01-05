import { Server } from 'socket.io';
interface LocationUpdate {
    workerId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
}
export declare class TrackingService {
    private activeTracking;
    private server;
    setServer(server: Server): void;
    startTracking(bookingId: string, workerId: string, customerId: string): void;
    updateLocation(bookingId: string, workerId: string, location: {
        latitude: number;
        longitude: number;
        accuracy: number;
    }): void;
    calculateETA(currentLocation: {
        latitude: number;
        longitude: number;
    }, destination: {
        latitude: number;
        longitude: number;
    }): number;
    stopTracking(bookingId: string): void;
    getCurrentLocation(bookingId: string): LocationUpdate | null;
    private toRad;
}
export {};
