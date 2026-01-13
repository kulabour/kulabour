import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

interface HolographicCardProps {
    hindi: string;
    english: string;
    imageUri: string;
    price: string;
    href: string;
    rating: number;
    verified: boolean;
    index: number;
}

export function HolographicCard({
    hindi,
    english,
    imageUri,
    price,
    href,
    rating,
    verified,
    index,
}: HolographicCardProps) {
    // Breathing animation
    const breatheAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        // Breathing effect
        Animated.loop(
            Animated.sequence([
                Animated.timing(breatheAnim, {
                    toValue: 1,
                    duration: 3000 + index * 200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(breatheAnim, {
                    toValue: 0,
                    duration: 3000 + index * 200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Glow pulsing
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Floating effect
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -8,
                    duration: 4000 + index * 300,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 4000 + index * 300,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [index]);

    const breatheScale = breatheAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.02],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const cardWidth = (width - 60) / 2;

    return (
        <Link href={href as any} asChild>
            <TouchableOpacity
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                activeOpacity={0.9}
            >
                <Animated.View
                    style={{
                        width: cardWidth,
                        marginHorizontal: 6,
                        marginBottom: 16,
                        transform: [
                            { scale: breatheScale },
                            { translateY: floatAnim },
                            { scale: isPressed ? 0.95 : 1 },
                        ],
                    }}
                >
                    {/* Outer Glow */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            inset: -4,
                            borderRadius: 24,
                            backgroundColor: '#0078D4',
                            opacity: glowOpacity,
                            shadowColor: '#0078D4',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 20,
                        }}
                    />

                    {/* Main Card */}
                    <View
                        style={{
                            borderRadius: 20,
                            overflow: 'hidden',
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.15)',
                        }}
                    >
                        {/* Image Section with Holographic Effect */}
                        <View style={{ height: 120, position: 'relative' }}>
                            <Image
                                source={{ uri: imageUri }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />

                            {/* Holographic Overlay */}
                            <LinearGradient
                                colors={[
                                    'transparent',
                                    'rgba(0, 120, 212, 0.1)',
                                    'rgba(16, 124, 16, 0.1)',
                                    'transparent',
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{ position: 'absolute', inset: 0 }}
                            />

                            {/* Verified Badge */}
                            {verified && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(16, 124, 16, 0.9)',
                                        paddingHorizontal: 8,
                                        paddingVertical: 4,
                                        borderRadius: 12,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Ionicons name="checkmark-circle" size={12} color="#fff" />
                                    <Text style={{ color: '#fff', fontSize: 10, marginLeft: 4, fontWeight: '600' }}>
                                        सत्यापित
                                    </Text>
                                </View>
                            )}

                            {/* Price Badge */}
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    paddingHorizontal: 10,
                                    paddingVertical: 6,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255, 185, 0, 0.5)',
                                }}
                            >
                                <Text style={{ color: '#FFB900', fontSize: 14, fontWeight: 'bold' }}>
                                    ₹{price}
                                </Text>
                            </View>
                        </View>

                        {/* Content Section */}
                        <LinearGradient
                            colors={['rgba(10,10,15,0.95)', 'rgba(20,25,35,0.98)']}
                            style={{ padding: 14 }}
                        >
                            {/* Hindi Title - Primary */}
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 22,
                                    fontWeight: '900',
                                    marginBottom: 2,
                                    textShadowColor: 'rgba(0, 120, 212, 0.5)',
                                    textShadowOffset: { width: 0, height: 2 },
                                    textShadowRadius: 8,
                                }}
                            >
                                {hindi}
                            </Text>

                            {/* English Subtitle */}
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 }}>
                                {english}
                            </Text>

                            {/* Rating */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="star" size={14} color="#FFB900" />
                                <Text style={{ color: '#FFB900', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                                    {rating}
                                </Text>
                                <View
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        marginHorizontal: 8,
                                    }}
                                />
                                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                                    Available Now
                                </Text>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Bottom Reflection */}
                    <View
                        style={{
                            height: 20,
                            marginTop: -10,
                            marginHorizontal: 10,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            backgroundColor: 'rgba(0, 120, 212, 0.1)',
                            transform: [{ scaleY: -0.3 }],
                        }}
                    />
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
}
