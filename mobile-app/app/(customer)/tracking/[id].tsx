import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import LiveMapTracker from '../../../components/LiveMapTracker';
import { socket } from '../../../api/client';
import { Coordinates } from '../../../services/api/LocationService';

export default function TrackingScreen() {
    const { id } = useLocalSearchParams(); // bookingId
    const router = useRouter();

    // Mock initial locations
    const customerLocation = { latitude: 28.58, longitude: 77.30 }; // Noida Sector 15
    const workerInitialLocation = { latitude: 28.57, longitude: 77.32 }; // Nearby

    const [currentWorkerLocation, setCurrentWorkerLocation] = useState<Coordinates | undefined>(undefined);

    useEffect(() => {
        // Connect socket if not connected
        if (!socket.connected) {
            socket.on('connect', () => {
                console.log('Socket connected for tracking');
            });
            socket.connect();
        }

        // Listen for location updates for this booking
        const locationEvent = `worker_location_${id}`;
        const completionEvent = `job_completed_${id}`;

        console.log(`Listening for ${locationEvent} and ${completionEvent}`);

        socket.on(locationEvent, (data: any) => {
            console.log('📍 Tracking Update:', data);
            setCurrentWorkerLocation({
                latitude: data.latitude,
                longitude: data.longitude
            });
        });

        socket.on(completionEvent, (data: any) => {
            console.log('🎉 Job Completed:', data);
            // Navigate to payment
            router.push({
                pathname: '/(customer)/payment',
                params: { bookingId: id }
            });
        });

        return () => {
            socket.off(locationEvent);
            socket.off(completionEvent);
        };
    }, [id]);

    const handleWorkerArrived = () => {
        // Handle arrival - maybe show a rating modal or completion screen
        console.log('Worker has arrived!');
    };

    return (
        <View style={styles.container}>
            <LiveMapTracker
                customerLocation={customerLocation}
                workerInitialLocation={workerInitialLocation}
                workerName="Ramesh Kumar"
                bookingId={id as string}
                onWorkerArrived={handleWorkerArrived}
                currentLocation={currentWorkerLocation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
