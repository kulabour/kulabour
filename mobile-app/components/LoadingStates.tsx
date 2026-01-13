/**
 * KULABOUR - Premium Loading Components
 * Shimmer effects and skeleton screens for data loading
 */

import React, { useEffect } from 'react';
import { View, ViewStyle, DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';

/**
 * Shimmer Effect - Flowing light animation
 */
export function Shimmer({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style
}: {
    width?: DimensionValue;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}) {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500 }),
                withTiming(0, { duration: 0 })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            shimmer.value,
            [0, 1],
            [-300, 300],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ translateX }],
        };
    });

    return (
        <View style={[{ width, height, borderRadius, backgroundColor: '#E5E7EB', overflow: 'hidden' }, style]}>
            <Animated.View style={[{ width: 300, height: '100%' }, animatedStyle]}>
                <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.8)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </View>
    );
}

/**
 * Skeleton Card - For service cards loading
 */
export function SkeletonCard() {
    return (
        <View className="w-[170px] h-[220px] m-2 bg-gray-100 rounded-3xl overflow-hidden">
            <View className="flex-1 p-4 justify-end">
                <Shimmer width="80%" height={16} borderRadius={8} style={{ marginBottom: 8 }} />
                <Shimmer width="60%" height={12} borderRadius={6} style={{ marginBottom: 12 }} />
                <Shimmer width="40%" height={24} borderRadius={12} />
            </View>
        </View>
    );
}

/**
 * Skeleton List Item - For worker/job listings
 */
export function SkeletonListItem() {
    return (
        <View className="bg-white p-4 mb-3 rounded-xl flex-row items-center">
            {/* Avatar */}
            <Shimmer width={60} height={60} borderRadius={30} style={{ marginRight: 12 }} />

            {/* Content */}
            <View className="flex-1">
                <Shimmer width="70%" height={16} borderRadius={8} style={{ marginBottom: 8 }} />
                <Shimmer width="90%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
                <Shimmer width="50%" height={12} borderRadius={6} />
            </View>
        </View>
    );
}

/**
 * Skeleton Profile Header
 */
export function SkeletonProfileHeader() {
    return (
        <View className="items-center py-8">
            <Shimmer width={100} height={100} borderRadius={50} style={{ marginBottom: 16 }} />
            <Shimmer width={200} height={24} borderRadius={12} style={{ marginBottom: 8 }} />
            <Shimmer width={150} height={16} borderRadius={8} />
        </View>
    );
}

/**
 * Pulsing Loader - For buttons
 */
export function PulsingLoader({ size = 40, color = '#0078D4' }: { size?: number; color?: string }) {
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800 }),
                withTiming(0, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(pulse.value, [0, 1], [0.8, 1.2]);
        const opacity = interpolate(pulse.value, [0, 1], [0.4, 1]);

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        width: size * 0.6,
                        height: size * 0.6,
                        borderRadius: size * 0.3,
                        backgroundColor: color,
                    }
                ]}
            />
        </View>
    );
}

/**
 * Skeleton Grid - For service grids
 */
export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <View className="flex-row flex-wrap justify-center">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </View>
    );
}

/**
 * Skeleton Stats Card
 */
export function SkeletonStatCard() {
    return (
        <View className="bg-white p-5 rounded-2xl">
            <Shimmer width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
            <Shimmer width="60%" height={32} borderRadius={8} style={{ marginBottom: 4 }} />
            <Shimmer width="40%" height={12} borderRadius={6} />
        </View>
    );
}
