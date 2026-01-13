/**
 * KULABOUR - Enhanced Live Map Tracker
 * Real-time worker location tracking with animated markers,
 * actual route polylines, and live ETA updates
 */

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline, AnimatedRegion } from 'react-native-maps';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { locationService, Coordinates, ETAData } from '../services/api/LocationService';

const { width, height } = Dimensions.get('window');

interface LiveMapTrackerProps {
    customerLocation: Coordinates;
    workerInitialLocation: Coordinates;
    workerName: string;
    workerPhoto?: string;
    workerPhone?: string;
    bookingId?: string;
    onWorkerArrived?: () => void;
}

// Animated pulse marker for worker
function WorkerMarker({ name, photo, isMoving }: { name: string; photo?: string; isMoving: boolean }) {
    const pulse = useSharedValue(1);
    const glow = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.4, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        );

        if (isMoving) {
            glow.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 500 }),
                    withTiming(0.5, { duration: 500 })
                ),
                -1,
                true
            );
        }
    }, [isMoving]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 2 - pulse.value,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        shadowOpacity: glow.value * 0.8,
    }));

    return (
        <View style={styles.markerContainer}>
            {/* Outer pulse ring */}
            <Animated.View style={[styles.markerPulse, pulseStyle]} />

            {/* Marker body */}
            <Animated.View style={[styles.markerOuter, glowStyle]}>
                <LinearGradient
                    colors={isMoving ? ['#22C55E', '#16A34A'] : ['#F59E0B', '#D97706']}
                    style={styles.markerInner}
                >
                    <Text style={styles.markerEmoji}>👷</Text>
                </LinearGradient>
            </Animated.View>

            {/* Arrow pointer */}
            <View style={[styles.markerArrow, { borderTopColor: isMoving ? '#16A34A' : '#D97706' }]} />
        </View>
    );
}

// Customer destination marker
function CustomerMarker() {
    return (
        <View style={styles.customerMarker}>
            <LinearGradient colors={['#0078D4', '#005A9E']} style={styles.customerMarkerInner}>
                <Ionicons name="home" size={20} color="white" />
            </LinearGradient>
            <View style={styles.customerMarkerPin} />
        </View>
    );
}

export default function LiveMapTracker({
    customerLocation,
    workerInitialLocation,
    workerName,
    workerPhoto,
    workerPhone,
    bookingId,
    onWorkerArrived,
    currentLocation, // New prop
}: LiveMapTrackerProps & { currentLocation?: Coordinates }) {
    const mapRef = useRef<MapView>(null);

    const [workerLocation, setWorkerLocation] = useState<Coordinates>(workerInitialLocation);
    const [routeCoordinates, setRouteCoordinates] = useState<Coordinates[]>([]);
    const [etaData, setEtaData] = useState<ETAData | null>(null);
    const [isMoving, setIsMoving] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
    const [routeProgress, setRouteProgress] = useState(0);

    // Sync with external location updates
    useEffect(() => {
        if (currentLocation) {
            setWorkerLocation(currentLocation);
            // Recalculate ETA if needed (optional optimization: debounce this)
            const eta = locationService.calculateETA(currentLocation, customerLocation);
            setEtaData(eta);
        }
    }, [currentLocation]);

    // Calculate initial region to show both markers
    const getRegion = () => {
        const latDelta = Math.abs(customerLocation.latitude - workerLocation.latitude) * 2.5 + 0.01;
        const lngDelta = Math.abs(customerLocation.longitude - workerLocation.longitude) * 2.5 + 0.01;

        return {
            latitude: (customerLocation.latitude + workerLocation.latitude) / 2,
            longitude: (customerLocation.longitude + workerLocation.longitude) / 2,
            latitudeDelta: Math.max(latDelta, 0.02),
            longitudeDelta: Math.max(lngDelta, 0.02),
        };
    };

    // Initialize route and tracking
    useEffect(() => {
        initializeRoute();

        // Only start simulation if NO external location is provided
        let cleanup = () => { };
        if (!currentLocation) {
            cleanup = startSimulation();
        }

        return () => {
            cleanup();
        };
    }, []);

    const initializeRoute = async () => {
        const route = await locationService.getRoute(workerInitialLocation, customerLocation);
        if (route) {
            setRouteCoordinates(route.coordinates);
            const eta = locationService.calculateETA(workerInitialLocation, customerLocation);
            setEtaData(eta);
        }
    };

    const startSimulation = () => {
        // Generate route for simulation
        const route = locationService['generateSimulatedRoute'](workerInitialLocation, customerLocation);
        setRouteCoordinates(route.coordinates);

        // Simulate worker movement
        return locationService.simulateWorkerMovement(
            route.coordinates,
            (position, progress) => {
                setWorkerLocation(position);
                setRouteProgress(progress);

                // Update ETA
                const eta = locationService.calculateETA(position, customerLocation);
                setEtaData(eta);

                // Check if arrived
                if (progress >= 0.95) {
                    setIsMoving(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    onWorkerArrived?.();
                }
            },
            45000 // 45 second simulation
        );
    };

    const handleCallWorker = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // In production: Linking.openURL(`tel:${workerPhone}`);
    };

    const handleChatWorker = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Navigate to chat screen
    };

    const handleCenterMap = () => {
        mapRef.current?.animateToRegion(getRegion(), 500);
    };

    // Get traffic color based on condition
    const getTrafficColor = () => {
        switch (etaData?.trafficCondition) {
            case 'light': return '#22C55E';
            case 'moderate': return '#F59E0B';
            case 'heavy': return '#EF4444';
            default: return '#22C55E';
        }
    };

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={getRegion()}
                customMapStyle={darkMapStyle}
                showsUserLocation={false}
                showsMyLocationButton={false}
            >
                {/* Route polyline - completed portion */}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates.slice(0, Math.floor(routeCoordinates.length * routeProgress) + 1)}
                        strokeWidth={5}
                        strokeColor="#22C55E"
                    />
                )}

                {/* Route polyline - remaining portion */}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates.slice(Math.floor(routeCoordinates.length * routeProgress))}
                        strokeWidth={4}
                        strokeColor="rgba(34, 197, 94, 0.4)"
                        lineDashPattern={[10, 5]}
                    />
                )}

                {/* Worker marker */}
                <Marker
                    coordinate={workerLocation}
                    anchor={{ x: 0.5, y: 1 }}
                >
                    <WorkerMarker name={workerName} photo={workerPhoto} isMoving={isMoving} />
                </Marker>

                {/* Customer destination marker */}
                <Marker coordinate={customerLocation} anchor={{ x: 0.5, y: 1 }}>
                    <CustomerMarker />
                </Marker>
            </MapView>

            {/* Center button */}
            <TouchableOpacity style={styles.centerButton} onPress={handleCenterMap}>
                <Ionicons name="locate" size={24} color="#0078D4" />
            </TouchableOpacity>

            {/* Connection status indicator */}
            {connectionStatus !== 'connected' && (
                <View style={styles.connectionBanner}>
                    <Ionicons
                        name={connectionStatus === 'error' ? 'warning' : 'cloud-offline'}
                        size={16}
                        color="#fff"
                    />
                    <Text style={styles.connectionText}>
                        {connectionStatus === 'error' ? 'Connection error' : 'Reconnecting...'}
                    </Text>
                </View>
            )}

            {/* Info card */}
            <View style={styles.infoCard}>
                <LinearGradient colors={['#1A1F2E', '#141820']} style={styles.infoCardGradient}>
                    {/* Worker info row */}
                    <View style={styles.infoRow}>
                        <View style={styles.workerInfo}>
                            <View style={styles.workerAvatar}>
                                <Text style={{ fontSize: 28 }}>👷</Text>
                            </View>
                            <View>
                                <Text style={styles.workerName}>{workerName}</Text>
                                <View style={styles.statusRow}>
                                    <View style={[styles.statusDot, { backgroundColor: isMoving ? '#22C55E' : '#F59E0B' }]} />
                                    <Text style={styles.workerStatus}>
                                        {isMoving ? 'आ रहे हैं' : 'पहुंच गए!'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.etaBox}>
                            {etaData && (
                                <>
                                    <Text style={styles.etaLabel}>ETA</Text>
                                    <Text style={[styles.etaValue, { color: getTrafficColor() }]}>
                                        {etaData.eta}
                                    </Text>
                                    <Text style={styles.distance}>{etaData.distance}</Text>
                                </>
                            )}
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <LinearGradient
                                colors={['#22C55E', '#16A34A']}
                                style={[styles.progressFill, { width: `${routeProgress * 100}%` }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </View>
                        <Text style={styles.progressText}>{Math.round(routeProgress * 100)}% complete</Text>
                    </View>

                    {/* Action buttons */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionButton} onPress={handleCallWorker}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 217, 255, 0.2)' }]}>
                                <Ionicons name="call" size={20} color="#00D9FF" />
                            </View>
                            <Text style={styles.actionText}>कॉल करो</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={handleChatWorker}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(0, 217, 255, 0.2)' }]}>
                                <Ionicons name="chatbubble" size={20} color="#00D9FF" />
                            </View>
                            <Text style={styles.actionText}>मैसेज</Text>
                        </TouchableOpacity>

                        <View style={styles.actionButton}>
                            <View style={[styles.actionIcon, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                                <Ionicons name="shield-checkmark" size={20} color="#22C55E" />
                            </View>
                            <Text style={styles.actionText}>वेरिफाइड</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    markerContainer: { alignItems: 'center' },
    markerPulse: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#22C55E',
        opacity: 0.3,
    },
    markerOuter: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'white',
        padding: 3,
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
    markerInner: {
        flex: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerEmoji: { fontSize: 28 },
    markerArrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#16A34A',
        marginTop: -2,
    },
    customerMarker: { alignItems: 'center' },
    customerMarkerInner: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    customerMarkerPin: {
        width: 4,
        height: 14,
        backgroundColor: '#0078D4',
        marginTop: -2,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
    centerButton: {
        position: 'absolute',
        top: 60,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    connectionBanner: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 80,
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    connectionText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    infoCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 16,
    },
    infoCardGradient: { padding: 20, paddingBottom: 36 },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    workerInfo: { flexDirection: 'row', alignItems: 'center' },
    workerAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    workerName: { color: 'white', fontSize: 20, fontWeight: '800' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    workerStatus: { color: '#22C55E', fontSize: 14, fontWeight: '600' },
    etaBox: { alignItems: 'flex-end' },
    etaLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },
    etaValue: { fontSize: 28, fontWeight: '900' },
    distance: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
    progressContainer: { marginBottom: 16 },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: 3 },
    progressText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 11,
        textAlign: 'right',
        marginTop: 4,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 16,
    },
    actionButton: { alignItems: 'center' },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    actionText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
});

// Dark map style
const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];
