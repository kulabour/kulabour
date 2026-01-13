import React, { useMemo, useRef, useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'; // Added Polyline
import { StyleSheet, View, Image } from 'react-native';
import { Box } from '../primitives/Box';
import { Coordinates } from '../../services/LocationService';

interface LiveTrackingMapProps {
    customerLocation: Coordinates;
    workerLocation?: Coordinates;
    workerName?: string;
    eta?: number;
    onRegionChange?: (region: any) => void;
}

const LiveTrackingMap = ({
    customerLocation,
    workerLocation,
    workerName,
    eta
}: LiveTrackingMapProps) => {

    const mapRef = useRef<MapView>(null);

    // Initial region logic
    const getInitialRegion = () => {
        if (workerLocation) {
            const lat = (customerLocation.latitude + workerLocation.latitude) / 2;
            const lng = (customerLocation.longitude + workerLocation.longitude) / 2;
            const deltaLat = Math.abs(customerLocation.latitude - workerLocation.latitude) * 1.5;
            const deltaLng = Math.abs(customerLocation.longitude - workerLocation.longitude) * 1.5;

            return {
                latitude: lat,
                longitude: lng,
                latitudeDelta: Math.max(deltaLat, 0.01),
                longitudeDelta: Math.max(deltaLng, 0.01),
            };
        }
        return {
            latitude: customerLocation.latitude,
            longitude: customerLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
    };

    return (
        <Box className="flex-1 rounded-3xl overflow-hidden border border-border-subtle shadow-md bg-surface-subtle">
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFill}
                initialRegion={getInitialRegion()}
                customMapStyle={mapStyle} // Optional: Add a clean/dark style json here
            >
                {/* Customer Marker (Home) */}
                <Marker
                    coordinate={customerLocation}
                    title="Your Location"
                    description="Service Address"
                >
                    <View style={styles.markerContainer}>
                        <View style={[styles.markerRing, { borderColor: '#10B981' }]} />
                        <View style={[styles.markerDot, { backgroundColor: '#10B981' }]} />
                    </View>
                </Marker>

                {/* Worker Marker (Driver) */}
                {workerLocation && (
                    <Marker
                        coordinate={workerLocation}
                        title="Worker"
                        description="On the way"
                        rotation={workerLocation.heading}
                        anchor={{ x: 0.5, y: 0.5 }}
                    >
                        {/* Bike/Worker Icon Placeholder */}
                        <View style={styles.workerMarker}>
                            <Image
                                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3063/3063823.png' }} // Simple car/bike icon
                                style={{ width: 24, height: 24, tintColor: 'white' }}
                            />
                        </View>
                    </Marker>
                )}

                {/* Path Line */}
                {workerLocation && (
                    <Polyline
                        coordinates={[customerLocation, workerLocation]}
                        strokeColor="#1A3B5D" // Brand Primary
                        strokeWidth={3}
                        lineDashPattern={[5, 5]} // Dashed line for straight-line estimation
                    />
                )}
            </MapView>
        </Box>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerRing: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        opacity: 0.5,
        position: 'absolute',
    },
    markerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
    },
    workerMarker: {
        backgroundColor: '#1A3B5D',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    }
});

// Minimal Silver Map Style
const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#e9e9e9" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    }
];

export default LiveTrackingMap;
