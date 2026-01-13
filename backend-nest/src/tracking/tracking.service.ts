import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

interface LocationUpdate {
    workerId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
}

@Injectable()
export class TrackingService {
    private activeTracking = new Map<string, LocationUpdate>();
    private server: Server;

    setServer(server: Server) {
        this.server = server;
    }

    /**
     * Start tracking a worker
     */
    startTracking(bookingId: string, workerId: string, customerId: string) {
        // Join worker and customer to tracking room
        this.server.to(`booking_${bookingId}`).emit('tracking_started', {
            bookingId,
            workerId,
            timestamp: new Date(),
        });

        console.log(`Started tracking for booking ${bookingId}`);
    }

    /**
     * Update worker location
     */
    updateLocation(
        bookingId: string,
        workerId: string,
        location: { latitude: number; longitude: number; accuracy: number }
    ) {
        const update: LocationUpdate = {
            workerId,
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            timestamp: new Date(),
        };

        // Store latest location
        this.activeTracking.set(bookingId, update);

        // Broadcast to customers in this booking room
        this.server.to(`booking_${bookingId}`).emit('location_update', {
            workerId,
            location: {
                latitude: update.latitude,
                longitude: update.longitude,
            },
            timestamp: update.timestamp,
        });
    }

    /**
     * Calculate ETA based on distance and speed
     */
    calculateETA(
        currentLocation: { latitude: number; longitude: number },
        destination: { latitude: number; longitude: number }
    ): number {
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(destination.latitude - currentLocation.latitude);
        const dLon = this.toRad(destination.longitude - currentLocation.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(currentLocation.latitude)) *
            Math.cos(this.toRad(destination.latitude)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km

        // Assume average speed of 30 km/h in urban areas
        const avgSpeed = 30;
        const eta = (distance / avgSpeed) * 60; // ETA in minutes

        return Math.round(eta);
    }

    /**
     * Stop tracking
     */
    stopTracking(bookingId: string) {
        this.activeTracking.delete(bookingId);

        this.server.to(`booking_${bookingId}`).emit('tracking_stopped', {
            bookingId,
            timestamp: new Date(),
        });

        console.log(`Stopped tracking for booking ${bookingId}`);
    }

    /**
     * Get current location for a booking
     */
    getCurrentLocation(bookingId: string): LocationUpdate | null {
        return this.activeTracking.get(bookingId) || null;
    }

    private toRad(degrees: number): number {
        return degrees * (Math.PI / 180);
    }
}
