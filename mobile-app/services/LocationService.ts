import * as Location from 'expo-location';
import { chatService } from './ChatService'; // Reusing the socket connection

export interface Coordinates {
    latitude: number;
    longitude: number;
    heading?: number;
}

class LocationService {
    private watchId: Location.LocationSubscription | null = null;
    private isTracking: boolean = false;

    /**
     * Request permissions and start watching location
     */
    async startTracking(role: 'worker' | 'customer', userId: string, jobId: string) {
        if (this.isTracking) return;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('Permission to access location was denied');
            return;
        }

        this.isTracking = true;

        this.watchId = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 5000, // Update every 5 seconds
                distanceInterval: 10, // Update every 10 meters
            },
            (location) => {
                const coords: Coordinates = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    heading: location.coords.heading || 0,
                };

                // Emit to socket
                // We use the 'send_location' event which the backend should broadcast to the job room
                // Note: ChatService's socket is used here for simplicity, ideally we'd have a shared SocketManager
                // Assuming chatService exposes a method to emit generic events or we extend it

                // For now, we will assume ChatService can emit arbitrary events or we add a helper
                // This is a temporary coupling; in a larger app, separate the SocketManager.
                // extending ChatService momentarily to allow this given the current codebase constraints

                // @ts-ignore - access private socket or add public method
                if (chatService['socket']) {
                    // @ts-ignore
                    chatService['socket'].emit('send_location', {
                        role,
                        userId,
                        jobId,
                        coords
                    });
                }
            }
        );
    }

    /**
     * Stop watching location
     */
    stopTracking() {
        if (this.watchId) {
            this.watchId.remove();
            this.watchId = null;
        }
        this.isTracking = false;
    }
}

export const locationService = new LocationService();
