/**
 * KULABOUR - Location Service
 * Handles real route directions, live location tracking via WebSocket,
 * and ETA calculations with traffic data
 */

import { apiClient } from './client';

// Types
export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface RouteStep {
    coordinates: Coordinates;
    instruction: string;
    distance: number; // meters
    duration: number; // seconds
}

export interface RouteData {
    coordinates: Coordinates[];
    totalDistance: number; // meters
    totalDuration: number; // seconds
    steps: RouteStep[];
    polyline: string; // encoded polyline
}

export interface ETAData {
    eta: string; // formatted time
    etaMinutes: number;
    distance: string; // formatted distance
    distanceMeters: number;
    trafficCondition: 'light' | 'moderate' | 'heavy';
}

// Google Directions API response types
interface DirectionsResponse {
    routes: Array<{
        overview_polyline: { points: string };
        legs: Array<{
            distance: { value: number; text: string };
            duration: { value: number; text: string };
            duration_in_traffic?: { value: number; text: string };
            steps: Array<{
                start_location: { lat: number; lng: number };
                end_location: { lat: number; lng: number };
                html_instructions: string;
                distance: { value: number };
                duration: { value: number };
            }>;
        }>;
    }>;
    status: string;
}

// WebSocket message types
type LocationUpdateCallback = (location: Coordinates, eta: ETAData) => void;
type ConnectionStatusCallback = (status: 'connected' | 'disconnected' | 'error') => void;

class LocationService {
    private apiKey: string;
    private wsConnection: WebSocket | null = null;
    private locationListeners: Map<string, LocationUpdateCallback> = new Map();
    private statusListeners: Set<ConnectionStatusCallback> = new Set();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;

    constructor() {
        // API key should be stored in environment variables
        this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    }

    /**
     * Get route between two points using Google Directions API
     */
    async getRoute(origin: Coordinates, destination: Coordinates): Promise<RouteData | null> {
        try {
            // For production, use actual Google Directions API
            // For now, return a simulated route with intermediate points
            const route = this.generateSimulatedRoute(origin, destination);
            return route;
        } catch (error) {
            console.error('[Location] Failed to get route:', error);
            return null;
        }
    }

    /**
     * Generate simulated route with curve (for demo purposes)
     * In production, replace with actual Google Directions API call
     */
    private generateSimulatedRoute(origin: Coordinates, destination: Coordinates): RouteData {
        const points: Coordinates[] = [];
        const steps = 20;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;

            // Add a curve by using a control point
            const midLat = (origin.latitude + destination.latitude) / 2;
            const midLng = (origin.longitude + destination.longitude) / 2;

            // Offset the midpoint to create a curve
            const offset = 0.005 * Math.sin(t * Math.PI);

            const lat = origin.latitude + (destination.latitude - origin.latitude) * t + offset;
            const lng = origin.longitude + (destination.longitude - origin.longitude) * t;

            points.push({ latitude: lat, longitude: lng });
        }

        const totalDistance = this.calculateDistance(origin, destination);
        const totalDuration = Math.round(totalDistance / 500 * 60); // Assume 30 km/h average speed

        return {
            coordinates: points,
            totalDistance,
            totalDuration,
            steps: points.map((coord, index) => ({
                coordinates: coord,
                instruction: index === 0 ? 'Start' : index === points.length - 1 ? 'Arrive' : 'Continue',
                distance: totalDistance / steps,
                duration: totalDuration / steps,
            })),
            polyline: this.encodePolyline(points),
        };
    }

    /**
     * Calculate distance between two points in meters (Haversine formula)
     */
    calculateDistance(point1: Coordinates, point2: Coordinates): number {
        const R = 6371000; // Earth's radius in meters
        const lat1 = point1.latitude * Math.PI / 180;
        const lat2 = point2.latitude * Math.PI / 180;
        const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
        const dLng = (point2.longitude - point1.longitude) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Calculate ETA based on current position
     */
    calculateETA(
        currentPosition: Coordinates,
        destination: Coordinates,
        averageSpeedKmh: number = 25
    ): ETAData {
        const distanceMeters = this.calculateDistance(currentPosition, destination);
        const distanceKm = distanceMeters / 1000;

        // Calculate time in minutes
        const etaMinutes = Math.round((distanceKm / averageSpeedKmh) * 60);

        // Format distance
        const distance = distanceKm < 1
            ? `${Math.round(distanceMeters)} मी`
            : `${distanceKm.toFixed(1)} कि.मी.`;

        // Format ETA
        const eta = etaMinutes < 60
            ? `${etaMinutes} मिनट`
            : `${Math.floor(etaMinutes / 60)} घंटा ${etaMinutes % 60} मिनट`;

        // Determine traffic condition based on speed
        const trafficCondition: ETAData['trafficCondition'] =
            averageSpeedKmh > 30 ? 'light' : averageSpeedKmh > 15 ? 'moderate' : 'heavy';

        return {
            eta,
            etaMinutes,
            distance,
            distanceMeters,
            trafficCondition,
        };
    }

    /**
     * Connect to WebSocket for live location updates
     */
    connectToLiveTracking(bookingId: string, onUpdate: LocationUpdateCallback): () => void {
        const listenerId = `${bookingId}_${Date.now()}`;
        this.locationListeners.set(listenerId, onUpdate);

        // Connect if not already connected
        if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
            this.initializeWebSocket();
        }

        // Subscribe to this booking's updates
        this.sendMessage({
            type: 'subscribe',
            bookingId,
        });

        // Return cleanup function
        return () => {
            this.locationListeners.delete(listenerId);
            if (this.locationListeners.size === 0) {
                this.disconnect();
            }
        };
    }

    /**
     * Initialize WebSocket connection
     */
    private initializeWebSocket() {
        const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001';

        try {
            this.wsConnection = new WebSocket(`${wsUrl}/live-tracking`);

            this.wsConnection.onopen = () => {
                console.log('[Location] WebSocket connected');
                this.reconnectAttempts = 0;
                this.notifyStatusListeners('connected');
            };

            this.wsConnection.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'location_update') {
                        const location: Coordinates = {
                            latitude: data.latitude,
                            longitude: data.longitude,
                        };
                        const eta = this.calculateETA(location, data.destination);

                        this.locationListeners.forEach(callback => {
                            callback(location, eta);
                        });
                    }
                } catch (error) {
                    console.error('[Location] Failed to parse WebSocket message:', error);
                }
            };

            this.wsConnection.onclose = () => {
                console.log('[Location] WebSocket disconnected');
                this.notifyStatusListeners('disconnected');
                this.attemptReconnect();
            };

            this.wsConnection.onerror = (error) => {
                console.error('[Location] WebSocket error:', error);
                this.notifyStatusListeners('error');
            };
        } catch (error) {
            console.error('[Location] Failed to initialize WebSocket:', error);
        }
    }

    /**
     * Attempt to reconnect with exponential backoff
     */
    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('[Location] Max reconnection attempts reached');
            return;
        }

        const delay = Math.pow(2, this.reconnectAttempts) * 1000;
        this.reconnectAttempts++;

        this.reconnectTimeout = setTimeout(() => {
            console.log(`[Location] Reconnection attempt ${this.reconnectAttempts}`);
            this.initializeWebSocket();
        }, delay);
    }

    /**
     * Send message through WebSocket
     */
    private sendMessage(message: object) {
        if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
            this.wsConnection.send(JSON.stringify(message));
        }
    }

    /**
     * Disconnect WebSocket
     */
    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        if (this.wsConnection) {
            this.wsConnection.close();
            this.wsConnection = null;
        }
    }

    /**
     * Register status listener
     */
    onStatusChange(callback: ConnectionStatusCallback): () => void {
        this.statusListeners.add(callback);
        return () => this.statusListeners.delete(callback);
    }

    /**
     * Notify all status listeners
     */
    private notifyStatusListeners(status: 'connected' | 'disconnected' | 'error') {
        this.statusListeners.forEach(callback => callback(status));
    }

    /**
     * Encode coordinates to polyline (simplified)
     */
    private encodePolyline(coords: Coordinates[]): string {
        // Simplified polyline encoding
        return coords.map(c => `${c.latitude.toFixed(5)},${c.longitude.toFixed(5)}`).join(';');
    }

    /**
     * Decode polyline to coordinates (simplified)
     */
    decodePolyline(encoded: string): Coordinates[] {
        return encoded.split(';').map(pair => {
            const [lat, lng] = pair.split(',').map(Number);
            return { latitude: lat, longitude: lng };
        });
    }

    /**
     * Simulate worker movement along route (for demo)
     */
    simulateWorkerMovement(
        route: Coordinates[],
        onUpdate: (position: Coordinates, progress: number) => void,
        durationMs: number = 30000
    ): () => void {
        let currentIndex = 0;
        const stepDuration = durationMs / route.length;

        const interval = setInterval(() => {
            if (currentIndex < route.length) {
                const progress = currentIndex / (route.length - 1);
                onUpdate(route[currentIndex], progress);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }
}

export const locationService = new LocationService();
export default LocationService;
