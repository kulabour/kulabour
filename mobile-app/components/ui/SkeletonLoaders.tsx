/**
 * KULABOUR - Skeleton Loading Components
 * Shimmer effect loading placeholders for better perceived performance
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    interpolate,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Base shimmer animation hook
function useShimmerAnimation() {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1500, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    return useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(shimmer.value, [0, 1], [-width, width]) },
        ],
    }));
}

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

// Base Skeleton Component
export function Skeleton({
    width: w = '100%',
    height: h = 20,
    borderRadius = 8,
    style,
}: SkeletonProps) {
    const shimmerStyle = useShimmerAnimation();

    return (
        <View
            style={[
                styles.skeleton,
                { width: w as any, height: h, borderRadius },
                style,
            ]}
        >
            <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shimmerGradient}
                />
            </Animated.View>
        </View>
    );
}

// Circle Skeleton (for avatars)
export function SkeletonCircle({ size = 48, style }: { size?: number; style?: ViewStyle }) {
    return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
}

// Service Card Skeleton
export function ServiceCardSkeleton() {
    return (
        <View style={styles.serviceCard}>
            <Skeleton width={70} height={70} borderRadius={18} />
            <Skeleton width={60} height={12} style={{ marginTop: 8 }} />
            <Skeleton width={40} height={10} style={{ marginTop: 4 }} />
        </View>
    );
}

// Service Grid Skeleton (4 cards in a row)
export function ServiceGridSkeleton({ rows = 2 }: { rows?: number }) {
    return (
        <View style={styles.gridContainer}>
            {Array.from({ length: rows * 4 }).map((_, index) => (
                <ServiceCardSkeleton key={index} />
            ))}
        </View>
    );
}

// Booking Card Skeleton
export function BookingCardSkeleton() {
    return (
        <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
                <SkeletonCircle size={56} />
                <View style={styles.bookingInfo}>
                    <Skeleton width={120} height={16} />
                    <Skeleton width={80} height={12} style={{ marginTop: 6 }} />
                </View>
                <Skeleton width={60} height={28} borderRadius={14} />
            </View>
            <View style={styles.bookingDivider} />
            <View style={styles.bookingFooter}>
                <Skeleton width={100} height={14} />
                <Skeleton width={80} height={14} />
            </View>
        </View>
    );
}

// Worker Profile Skeleton
export function WorkerProfileSkeleton() {
    return (
        <View style={styles.workerProfile}>
            <SkeletonCircle size={80} />
            <Skeleton width={150} height={20} style={{ marginTop: 12 }} />
            <Skeleton width={100} height={14} style={{ marginTop: 6 }} />
            <View style={styles.workerStats}>
                <Skeleton width={70} height={40} borderRadius={12} />
                <Skeleton width={70} height={40} borderRadius={12} />
                <Skeleton width={70} height={40} borderRadius={12} />
            </View>
        </View>
    );
}

// Cart Item Skeleton
export function CartItemSkeleton() {
    return (
        <View style={styles.cartItem}>
            <Skeleton width={60} height={60} borderRadius={16} />
            <View style={styles.cartItemInfo}>
                <Skeleton width={120} height={16} />
                <Skeleton width={80} height={12} style={{ marginTop: 6 }} />
            </View>
            <View style={styles.cartItemRight}>
                <Skeleton width={80} height={36} borderRadius={10} />
                <Skeleton width={50} height={18} style={{ marginTop: 8 }} />
            </View>
        </View>
    );
}

// Chat Message Skeleton
export function ChatMessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
    return (
        <View style={[styles.chatMessage, isOwn && styles.chatMessageOwn]}>
            <Skeleton
                width={Math.random() * 100 + 100}
                height={36}
                borderRadius={18}
            />
        </View>
    );
}

// Chat Skeleton (multiple messages)
export function ChatSkeleton({ count = 5 }: { count?: number }) {
    return (
        <View style={styles.chatContainer}>
            {Array.from({ length: count }).map((_, index) => (
                <ChatMessageSkeleton key={index} isOwn={index % 3 === 0} />
            ))}
        </View>
    );
}

// Earnings Card Skeleton
export function EarningsCardSkeleton() {
    return (
        <View style={styles.earningsCard}>
            <Skeleton width={80} height={14} />
            <Skeleton width={120} height={36} style={{ marginTop: 8 }} />
            <View style={styles.earningsStats}>
                <View>
                    <Skeleton width={60} height={10} />
                    <Skeleton width={80} height={20} style={{ marginTop: 4 }} />
                </View>
                <View>
                    <Skeleton width={60} height={10} />
                    <Skeleton width={80} height={20} style={{ marginTop: 4 }} />
                </View>
            </View>
        </View>
    );
}

// Full Page Skeleton (Home Screen)
export function HomePageSkeleton() {
    return (
        <View style={styles.homePage}>
            {/* Header */}
            <View style={styles.homeHeader}>
                <View>
                    <Skeleton width={100} height={16} />
                    <Skeleton width={150} height={28} style={{ marginTop: 6 }} />
                </View>
                <SkeletonCircle size={44} />
            </View>

            {/* Search */}
            <Skeleton height={56} borderRadius={16} style={{ marginHorizontal: 16 }} />

            {/* Online indicator */}
            <Skeleton
                height={70}
                borderRadius={16}
                style={{ margin: 16 }}
            />

            {/* Category tabs */}
            <View style={styles.categoryTabs}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} width={100} height={44} borderRadius={22} />
                ))}
            </View>

            {/* Service grid */}
            <ServiceGridSkeleton rows={3} />
        </View>
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
    },
    shimmerContainer: {
        width: '100%',
        height: '100%',
    },
    shimmerGradient: {
        flex: 1,
        width: width * 0.5,
    },
    serviceCard: {
        width: (width - 48) / 4,
        alignItems: 'center',
        marginBottom: 16,
        marginHorizontal: 4,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    bookingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookingInfo: {
        flex: 1,
        marginLeft: 12,
    },
    bookingDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    bookingFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    workerProfile: {
        alignItems: 'center',
        padding: 20,
    },
    workerStats: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        borderRadius: 16,
    },
    cartItemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    cartItemRight: {
        alignItems: 'flex-end',
    },
    chatMessage: {
        marginVertical: 4,
        marginHorizontal: 16,
    },
    chatMessageOwn: {
        alignItems: 'flex-end',
    },
    chatContainer: {
        flex: 1,
        paddingVertical: 16,
    },
    earningsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        margin: 16,
    },
    earningsStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    homePage: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    homeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 50,
        backgroundColor: '#0078D4',
    },
    categoryTabs: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        gap: 8,
        marginBottom: 16,
    },
});

export default {
    Skeleton,
    SkeletonCircle,
    ServiceCardSkeleton,
    ServiceGridSkeleton,
    BookingCardSkeleton,
    WorkerProfileSkeleton,
    CartItemSkeleton,
    ChatMessageSkeleton,
    ChatSkeleton,
    EarningsCardSkeleton,
    HomePageSkeleton,
};
