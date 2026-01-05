import React, { useState, memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image'; // Optimized image component
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ServiceCardProps {
    title: string;
    hindi: string;
    english?: string;
    imageUri?: string;
    icon?: string;
    href: string;
    available?: boolean;
    price?: string;
    delay?: number;
    rating?: number;
    verified?: boolean;
}

// Memoized component - only re-renders if props change
export const ServiceCard = memo(function ServiceCard({
    title,
    hindi,
    english,
    imageUri,
    icon,
    href,
    available = true,
    price = "299",
    delay = 0,
    rating = 4.5,
    verified = true
}: ServiceCardProps) {
    const pressed = useSharedValue(0);
    const hovered = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(pressed.value, [0, 1], [1, 0.96]);
        const rotateX = interpolate(hovered.value, [0, 1], [0, 5]);
        const translateY = interpolate(pressed.value, [0, 1], [0, 4]);

        return {
            transform: [
                { scale },
                { perspective: 1000 },
                { rotateX: `${rotateX}deg` },
                { translateY },
            ],
        };
    });

    const shadowStyle = useAnimatedStyle(() => {
        const shadowOpacity = interpolate(pressed.value, [0, 1], [0.2, 0.4]);
        const elevation = interpolate(pressed.value, [0, 1], [12, 24]);

        return {
            shadowOpacity,
            elevation,
        };
    });

    return (
        <Link href={href as any} asChild>
            <Pressable
                onPressIn={() => {
                    pressed.value = withSpring(1, { damping: 15 });
                }}
                onPressOut={() => {
                    pressed.value = withSpring(0, { damping: 15 });
                }}
            >
                <Animated.View
                    entering={FadeInDown.delay(delay).duration(600).springify().damping(12)}
                    style={[
                        animatedStyle,
                        shadowStyle,
                        {
                            shadowColor: '#0078D4',
                            shadowOffset: { width: 0, height: 12 },
                            shadowRadius: 24,
                        }
                    ]}
                    className="w-[170px] h-[220px] m-2"
                >
                    {/* 3D Card Container */}
                    <View className="flex-1 rounded-3xl overflow-hidden bg-white border border-gray-100/50">
                        {/* Image Background with Parallax */}
                        <View className="absolute inset-0">
                            {imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    className="w-full h-full"
                                    contentFit="cover"
                                    transition={200}
                                    cachePolicy="memory-disk"
                                    priority="high"
                                />
                            ) : (
                                <View className="flex-1 items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                    <Text className="text-6xl">{icon}</Text>
                                </View>
                            )}
                        </View>

                        {/* Mica Gradient Overlay - 3D Depth */}
                        <LinearGradient
                            colors={[
                                'transparent',
                                'rgba(32, 31, 30, 0.4)',
                                'rgba(32, 31, 30, 0.85)',
                                'rgba(32, 31, 30, 0.95)'
                            ]}
                            locations={[0, 0.3, 0.7, 1]}
                            className="absolute inset-0 justify-end p-4"
                        >
                            {/* Top Highlight for 3D effect */}
                            <LinearGradient
                                colors={['rgba(255,255,255,0.15)', 'transparent']}
                                className="absolute top-0 left-0 right-0 h-20"
                            />

                            {/* Microsoft Verified Badge - 3D */}
                            {verified && (
                                <View className="absolute top-3 left-3" style={{
                                    shadowColor: '#0078D4',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 8,
                                }}>
                                    <LinearGradient
                                        colors={['#0086F0', '#0078D4']}
                                        className="px-2.5 py-1.5 rounded-lg flex-row items-center border border-white/20"
                                    >
                                        <Ionicons name="checkmark-circle" size={13} color="white" />
                                        <Text className="text-[9px] font-bold text-white ml-1.5 tracking-wide">VERIFIED</Text>
                                    </LinearGradient>
                                </View>
                            )}

                            {/* 3D Status Indicator */}
                            {available && (
                                <View className="absolute top-3 right-3" style={{
                                    shadowColor: '#107C10',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 8,
                                }}>
                                    <LinearGradient
                                        colors={['#13A10E', '#107C10']}
                                        className="px-2.5 py-1.5 rounded-lg flex-row items-center border border-white/30"
                                    >
                                        <View className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
                                        <Text className="text-[9px] font-extrabold text-white uppercase tracking-widest">ONLINE</Text>
                                    </LinearGradient>
                                </View>
                            )}

                            {/* Content with 3D Typography */}
                            <View>
                                {/* Hindi - PRIMARY with 3D Shadow */}
                                <Text
                                    className="text-white font-black text-3xl leading-8 mb-1"
                                    style={{
                                        textShadowColor: 'rgba(0,0,0,0.5)',
                                        textShadowOffset: { width: 0, height: 3 },
                                        textShadowRadius: 6,
                                        letterSpacing: -0.5,
                                    }}
                                >
                                    {hindi}
                                </Text>

                                {/* English - Secondary */}
                                {english && (
                                    <Text className="text-white/90 font-semibold text-sm mb-2">{english}</Text>
                                )}

                                {/* 3D Rating Component */}
                                <View className="flex-row items-center mt-2 mb-2">
                                    <View className="flex-row items-center bg-warning/30 px-2 py-1 rounded-lg mr-2 border border-warning/40" style={{
                                        shadowColor: '#FFB900',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                    }}>
                                        <Ionicons name="star" size={14} color="#FFB900" />
                                        <Text className="text-white font-bold text-sm ml-1.5">{rating}</Text>
                                    </View>
                                    <Text className="text-white/80 text-xs font-medium">(500+ bookings)</Text>
                                </View>

                                {/* 3D Price Badge with Mica */}
                                <View style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                }}>
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                                        className="self-start px-3 py-1.5 rounded-xl border-2 border-white/40"
                                    >
                                        <View className="flex-row items-baseline">
                                            <Text className="text-primary font-black text-sm">₹{price}</Text>
                                            <Text className="text-text-secondary text-[10px] font-semibold ml-1">onwards</Text>
                                        </View>
                                    </LinearGradient>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Bottom Edge Highlight for 3D depth */}
                        <View className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
                    </View>
                </Animated.View>
            </Pressable>
        </Link>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for memo
    // Only re-render if these specific props change
    return (
        prevProps.title === nextProps.title &&
        prevProps.price === nextProps.price &&
        prevProps.rating === nextProps.rating &&
        prevProps.available === nextProps.available &&
        prevProps.verified === nextProps.verified
    );
});
