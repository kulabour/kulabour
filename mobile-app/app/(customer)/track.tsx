import { View, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Design System
import { Box } from '../../components/primitives/Box';
import { Text } from '../../components/primitives/Text';
import { Card } from '../../components/design-system/Card';
import Avatar from '../../components/ui/Avatar';
import '../../global.css';

// Services
// import { locationService, Coordinates } from '../../services/LocationService';
// import { chatService } from '../../services/ChatService';
import { Config } from '../../Config';
import io, { Socket } from 'socket.io-client';

// Only import map on native platforms
const LiveTrackingMap = Platform.OS === 'web'
    ? null
    : require('../../components/maps/LiveTrackingMap').default;

export default function TrackScreen() {
    const router = useRouter();
    const [eta, setEta] = useState(15);
    const [status, setStatus] = useState('Worker on the way');

    // Tracking Socket
    const [socket, setSocket] = useState<Socket | null>(null);

    // Mock Customer Location (Indiranagar, Bangalore)
    const customerLocation = { latitude: 12.9716, longitude: 77.5946 };

    const [workerLocation, setWorkerLocation] = useState<any>({
        latitude: 12.9650, // Slightly south
        longitude: 77.5900,
        heading: 45
    });

    useEffect(() => {
        // Connect to Live Tracking Namespace
        const newSocket = io(Config.TRACKING_SOCKET_URL, {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('TrackScreen: Connected to Live Tracking');
            // Optional: Join a specific booking room
            // newSocket.emit('join_booking', 'booking_id_123');
        });

        newSocket.on('location_update', (payload: any) => {
            // Determine payload structure match
            if (payload.latitude && payload.longitude) {
                setWorkerLocation({
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    heading: payload.heading || 0
                });
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <Box className="flex-1 bg-surface-base">
            <SafeAreaView style={{ flex: 1 }}>

                {/* Header */}
                <Box className="px-lg py-md flex-row items-center border-b border-border-subtle z-10 bg-surface-base">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-md w-10 h-10 items-center justify-center rounded-full bg-surface-muted"
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Box>
                        <Text variant="h3" className="font-bold">Track Worker</Text>
                        <Text variant="caption" className="text-text-secondary">Order #2284</Text>
                    </Box>
                </Box>

                {/* Map Area */}
                <Box className="flex-1 bg-surface-subtle relative">
                    {Platform.OS === 'web' ? (
                        <Box className="flex-1 items-center justify-center p-xl">
                            <Text className="text-6xl mb-md">🗺️</Text>
                            <Text variant="h3" className="text-center mb-sm">Live Tracking Map</Text>
                            <Text variant="body" className="text-center text-text-tertiary">
                                Interactive map is available on the mobile application.
                            </Text>
                        </Box>
                    ) : (
                        LiveTrackingMap && (
                            <LiveTrackingMap
                                customerLocation={customerLocation}
                                workerLocation={workerLocation}
                            />
                        )
                    )}

                    {/* Floating Status Card */}
                    <Box className="absolute top-lg left-lg right-lg">
                        <Card variant="elevated" className="flex-row items-center p-md">
                            <Box className="w-12 h-12 rounded-full bg-brand-primary/10 items-center justify-center mr-md">
                                <Ionicons name="time" size={24} color="#1A3B5D" />
                            </Box>
                            <Box className="flex-1">
                                <Text variant="caption" className="text-text-secondary uppercase font-bold">Estimated Arrival</Text>
                                <Text variant="h2" className="text-brand-primary font-bold">{eta} mins</Text>
                            </Box>
                            <Box className="bg-feedback-success/10 px-sm py-xs rounded-md">
                                <Text variant="caption" className="text-feedback-success font-bold">On Time</Text>
                            </Box>
                        </Card>
                    </Box>
                </Box>

                {/* Worker Details Bottom Sheet */}
                <Box className="p-lg bg-surface-base border-t border-border-subtle shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Box className="flex-row items-center mb-lg">
                        <Avatar name="Rajesh Kumar" size="md" online />
                        <Box className="ml-md flex-1">
                            <Text variant="h3" className="font-bold">Rajesh Kumar</Text>
                            <Box className="flex-row items-center">
                                <Text variant="caption" className="text-brand-accent font-bold mr-xs">★ 4.8</Text>
                                <Text variant="caption" className="text-text-tertiary">• 234 jobs</Text>
                            </Box>
                        </Box>
                        <TouchableOpacity className="w-12 h-12 rounded-full bg-brand-primary items-center justify-center shadow-md">
                            <Ionicons name="call" size={24} color="white" />
                        </TouchableOpacity>
                    </Box>

                    <Box className="flex-row gap-md">
                        <TouchableOpacity
                            className="flex-1 items-center justify-center py-md rounded-xl bg-surface-muted border border-border-subtle"
                            onPress={() => router.push(`/(customer)/chat/worker_456`)}
                        >
                            <Text variant="body" className="font-bold text-text-primary">Msg Worker</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 items-center justify-center py-md rounded-xl bg-surface-muted border border-border-subtle">
                            <Text variant="body" className="font-bold text-feedback-error">Cancel</Text>
                        </TouchableOpacity>
                    </Box>
                </Box>

            </SafeAreaView>
        </Box>
    );
}
