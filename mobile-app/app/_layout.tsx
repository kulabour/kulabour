// IMPORTANT: Import Reanimated FIRST to avoid worklets errors
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Slot } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../api/queryClient';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Import global CSS
import "../global.css";

import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    useEffect(() => {
        // Skip notifications on web
        if (Platform.OS === 'web') return;

        // Initialize Notifications (mobile only)
        // notificationService.initialize().then(token => setExpoPushToken(token));

        return () => {
            if (notificationListener.current) notificationListener.current.remove();
            if (responseListener.current) responseListener.current.remove();
        };
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <SafeAreaProvider>
                        <View style={styles.container}>
                            <StatusBar style="light" />
                            <View style={styles.content}>
                                <Slot />
                            </View>
                        </View>
                    </SafeAreaProvider>
                </QueryClientProvider>
            </ErrorBoundary>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
