import { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = __DEV__ ? 'http://localhost:5000' : 'https://api.kulabour.com';

interface LocationData {
    latitude: number;
    longitude: number;
    heading: number | null;
    speed: number | null;
    accuracy: number | null;
    timestamp: number;
}

interface UseWorkerLocationProps {
    bookingId: string;
    isActive: boolean; // Only send location when worker is on active job
}

/**
 * Hook for worker to send real-time location updates
 * Usage: const { status, error } = useWorkerLocation(bookingId, isActive);
 */
export function useWorkerLocation({ bookingId, isActive }: UseWorkerLocationProps) {
    const [status, setStatus] = useState<'inactive' | 'requesting' | 'active' | 'error'>('inactive');
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        if (!isActive) {
            // Clean up if not active
            cleanup();
            setStatus('inactive');
            return;
        }

        setupLocationTracking();

        return () => cleanup();
    }, [bookingId, isActive]);

    async function setupLocationTracking() {
        setStatus('requesting');

        try {
            // Request permission
            const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();

            if (permissionStatus !== 'granted') {
                setError('Location permission denied');
                setStatus('error');
                return;
            }

            // Connect to Socket.io
            const socket = io(SOCKET_URL, {
                auth: {
                    token: await AsyncStorage.getItem('authToken')
                },
                transports: ['websocket']
            });

            socketRef.current = socket;

            socket.on('connect', () => {
                console.log('✅ Socket connected for location tracking');
            });

            socket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
            });

            socket.on('error', (err) => {
                console.error('Socket error:', err);
                setError('Connection error');
            });

            // Start watching location
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000, // Update every 5 seconds
                    distanceInterval: 10, // Or every 10 meters
                },
                (location) => {
                    const locationData: LocationData = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        heading: location.coords.heading,
                        speed: location.coords.speed,
                        accuracy: location.coords.accuracy,
                        timestamp: location.timestamp
                    };

                    // Send to server
                    socket.emit('worker:location:update', {
                        bookingId,
                        ...locationData
                    });

                    console.log('📍 Location sent:', locationData.latitude, locationData.longitude);
                }
            );

            locationSubscriptionRef.current = subscription;
            setStatus('active');

        } catch (err: any) {
            console.error('Location tracking error:', err);
            setError(err.message || 'Failed to start tracking');
            setStatus('error');
        }
    }

    function cleanup() {
        locationSubscriptionRef.current?.remove();
        locationSubscriptionRef.current = null;

        socketRef.current?.disconnect();
        socketRef.current = null;
    }

    return { status, error };
}

interface UseCustomerTrackingProps {
    bookingId: string;
    workerId?: string;
}

/**
 * Hook for customer to receive worker location updates
 * Usage: const { workerLocation, isConnected } = useCustomerTracking({ bookingId });
 */
export function useCustomerTracking({ bookingId, workerId }: UseCustomerTrackingProps) {
    const [workerLocation, setWorkerLocation] = useState<LocationData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!bookingId) return;

        setupTracking();

        return () => {
            socketRef.current?.disconnect();
        };
    }, [bookingId]);

    async function setupTracking() {
        const socket = io(SOCKET_URL, {
            auth: {
                token: await AsyncStorage.getItem('authToken')
            },
            transports: ['websocket']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Socket connected for customer tracking');
            setIsConnected(true);

            // Join tracking room for this booking
            socket.emit('customer:track:booking', bookingId);

            // Request last known location if worker is assigned
            if (workerId) {
                socket.emit('worker:location:get', { workerId }, (location: LocationData | null) => {
                    if (location) {
                        setWorkerLocation(location);
                    }
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
            setIsConnected(false);
        });

        // Listen for worker location updates
        socket.on('worker:location', (location: LocationData) => {
            console.log('📍 Worker location updated:', location);
            setWorkerLocation(location);
        });
    }

    return { workerLocation, isConnected };
}
