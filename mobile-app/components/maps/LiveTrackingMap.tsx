import { View, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect, useRef, useMemo } from 'react';
import Card from '../ui/Card';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface LiveTrackingMapProps {
    workerLocation: Coordinate;
    customerLocation: Coordinate;
    workerName: string;
    eta: string;
}

export default function LiveTrackingMap({
    workerLocation,
    customerLocation,
    workerName,
    eta
}: LiveTrackingMapProps) {
    const mapRef = useRef<MapView>(null);
    // Use useMemo for initial route to avoid setState in effect
    const routeCoordinates = useMemo(
        () => [workerLocation, customerLocation],
        [workerLocation, customerLocation]
    );

    const [isMapReady, setIsMapReady] = useState(false);

    useEffect(() => {
        if (isMapReady && mapRef.current) {
            mapRef.current.fitToCoordinates([workerLocation, customerLocation], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [isMapReady, workerLocation, customerLocation]);

    return (
        <View className="flex-1 rounded-3xl overflow-hidden bg-dark-charcoal">
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={{ flex: 1 }}
                onMapReady={() => setIsMapReady(true)}
                initialRegion={{
                    ...customerLocation,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                customMapStyle={DARK_MAP_STYLE}
            >
                {/* Customer Marker */}
                <Marker coordinate={customerLocation} title="You">
                    <View className="w-8 h-8 bg-neon-blue rounded-full border-2 border-white items-center justify-center">
                        <View className="w-3 h-3 bg-white rounded-full" />
                    </View>
                </Marker>

                {/* Worker Marker */}
                <Marker coordinate={workerLocation} title={workerName}>
                    <View className="items-center">
                        <View className="bg-white px-2 py-1 rounded-md mb-1 shadow-sm">
                            <Text className="text-xs font-bold">{eta}</Text>
                        </View>
                        <View className="w-10 h-10 bg-neon-green rounded-full border-2 border-white items-center justify-center shadow-lg">
                            <Text className="text-lg">🛵</Text>
                        </View>
                    </View>
                </Marker>

                {/* Route Polyline */}
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor="#00f2ff" // neon-blue
                    strokeWidth={4}
                    lineDashPattern={[1]}
                />
            </MapView>

            {/* Overlay Info */}
            <View className="absolute bottom-4 left-4 right-4">
                <Card variant="glass" glassmorphism>
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-white/50 text-xs uppercase tracking-wider">Arriving In</Text>
                            <Text className="text-white font-bold text-xl">{eta}</Text>
                        </View>
                        <View className="h-8 w-[1px] bg-white/10" />
                        <View>
                            <Text className="text-white/50 text-xs uppercase tracking-wider">Distance</Text>
                            <Text className="text-white font-bold text-xl">2.4 km</Text>
                        </View>
                    </View>
                </Card>
            </View>
        </View>
    );
}

// Dark Mode Map Style
const DARK_MAP_STYLE = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#263c3f" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#6b9a76" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#38414e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#212a37" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9ca5b3" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#1f2835" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#f3d19c" }]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{ "color": "#2f3948" }]
    },
    {
        "featureType": "transit.station",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#515c6d" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#17263c" }]
    }
];
