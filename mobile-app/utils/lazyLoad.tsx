import { lazy, Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Loading fallback component
const LoadingFallback = () => (
    <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0078D4" />
    </View>
);

// Lazy load heavy components
export const GlobalCanvas = lazy(() => import('../components/3d/GlobalCanvas'));
export const VoiceOverlay = lazy(() => import('../components/ui/VoiceOverlay'));
export const ChatScreen = lazy(() => import('../components/shared/AIChatbot'));

// Map components (heavy leaflet dependencies)
export const MapView = lazy(() => import('../components/LiveMapTracker'));
export const LiveTracking = lazy(() => import('../components/maps/LiveTrackingMap'));

// Wrapper component with Suspense
export const LazyComponent = ({
    Component,
    fallback = <LoadingFallback />
}: {
    Component: React.LazyExoticComponent<any>;
    fallback?: React.ReactNode;
}) => (
    <Suspense fallback={fallback}>
        <Component />
    </Suspense>
);

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
});
