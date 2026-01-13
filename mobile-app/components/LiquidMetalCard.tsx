/**
 * KULABOUR DIMENSION - Liquid Metal Card System
 * Cards that morph, flow, and transform like liquid metal (T-1000 style!)
 * NEVER SEEN in any mobile app before!
 */

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ParallaxCard } from '../engine/GyroscopeParallax';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LiquidMetalCardProps {
    hindi: string;
    english: string;
    imageUri: string;
    price: string;
    href: string;
    rating: number;
    workersOnline: number;
    index: number;
}

export function LiquidMetalCard({
    hindi,
    english,
    imageUri,
    price,
    href,
    rating,
    workersOnline,
    index,
}: LiquidMetalCardProps) {
    // Animation values
    const morphAnim = useRef(new Animated.Value(0)).current;
    const liquidAnim = useRef(new Animated.Value(0)).current;
    const glowPulse = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    const [isPressed, setIsPressed] = useState(false);
    const [isMorphed, setIsMorphed] = useState(false);

    useEffect(() => {
        // Entry animation - liquid splash in
        Animated.sequence([
            Animated.delay(index * 100),
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(liquidAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Continuous liquid shimmer
        Animated.loop(
            Animated.timing(morphAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: true,
            })
        ).start();

        // Glow pulsing
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowPulse, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(glowPulse, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -8,
                    duration: 2500 + index * 200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2500 + index * 200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [index]);

    const handlePressIn = () => {
        setIsPressed(true);
        Vibration.vibrate(20);

        // Liquid morph effect
        Animated.spring(scaleAnim, {
            toValue: 0.92,
            tension: 300,
            friction: 10,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        setIsPressed(false);
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 300,
            friction: 10,
            useNativeDriver: true,
        }).start();
    };

    // Liquid shimmer interpolation
    const shimmerTranslate = morphAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [-100, 0, 100],
    });

    const liquidScale = liquidAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1.05, 1],
    });

    const glowOpacity = glowPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    const cardWidth = (SCREEN_WIDTH - 48) / 2;

    return (
        <Link href={href as any} asChild>
            <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <Animated.View
                    style={{
                        width: cardWidth,
                        marginHorizontal: 6,
                        marginBottom: 20,
                        transform: [
                            { scale: Animated.multiply(scaleAnim, liquidScale) },
                            { translateY: floatAnim },
                        ],
                    }}
                >
                    <ParallaxCard maxRotation={8}>
                        {/* Liquid Metal Glow */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                inset: -8,
                                borderRadius: 28,
                                backgroundColor: '#00D4FF',
                                opacity: glowOpacity,
                                shadowColor: '#00D4FF',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 30,
                            }}
                        />

                        {/* Main Card */}
                        <View
                            style={{
                                borderRadius: 24,
                                overflow: 'hidden',
                                backgroundColor: '#0a0a0a',
                                borderWidth: 1,
                                borderColor: isPressed ? '#00D4FF' : 'rgba(0, 212, 255, 0.3)',
                            }}
                        >
                            {/* Liquid Metal Shimmer Overlay */}
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 10,
                                    transform: [{ translateX: shimmerTranslate }],
                                }}
                                pointerEvents="none"
                            >
                                <LinearGradient
                                    colors={[
                                        'transparent',
                                        'rgba(0, 212, 255, 0.15)',
                                        'rgba(255, 255, 255, 0.25)',
                                        'rgba(0, 212, 255, 0.15)',
                                        'transparent',
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ flex: 1, width: 200 }}
                                />
                            </Animated.View>

                            {/* Image with Chrome Effect */}
                            <View style={{ height: 110, position: 'relative' }}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />

                                {/* Chrome reflection overlay */}
                                <LinearGradient
                                    colors={[
                                        'rgba(0, 212, 255, 0.2)',
                                        'transparent',
                                        'rgba(0, 0, 0, 0.6)',
                                    ]}
                                    style={{ position: 'absolute', inset: 0 }}
                                />

                                {/* Live workers badge */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        backgroundColor: 'rgba(0, 212, 255, 0.9)',
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 12,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: '#00FF88',
                                            marginRight: 6,
                                            shadowColor: '#00FF88',
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 1,
                                            shadowRadius: 4,
                                        }}
                                    />
                                    <Text style={{ color: '#000', fontSize: 10, fontWeight: '800' }}>
                                        {workersOnline} LIVE
                                    </Text>
                                </View>

                                {/* Price - Chrome Style */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: '#00D4FF',
                                    }}
                                >
                                    <Text style={{ color: '#00D4FF', fontSize: 14, fontWeight: '900' }}>
                                        ₹{price}
                                    </Text>
                                </View>
                            </View>

                            {/* Content - Liquid Metal Style */}
                            <LinearGradient
                                colors={['#0a0a0a', '#050505']}
                                style={{ padding: 14 }}
                            >
                                {/* Hindi Title - Glowing */}
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 24,
                                        fontWeight: '900',
                                        marginBottom: 2,
                                        textShadowColor: '#00D4FF',
                                        textShadowOffset: { width: 0, height: 0 },
                                        textShadowRadius: 10,
                                    }}
                                >
                                    {hindi}
                                </Text>

                                {/* English */}
                                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>
                                    {english}
                                </Text>

                                {/* Rating Row */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="star" size={14} color="#00D4FF" />
                                    <Text style={{ color: '#00D4FF', fontSize: 12, fontWeight: '700', marginLeft: 4 }}>
                                        {rating}
                                    </Text>
                                    <View
                                        style={{
                                            width: 1,
                                            height: 12,
                                            backgroundColor: 'rgba(0, 212, 255, 0.3)',
                                            marginHorizontal: 10,
                                        }}
                                    />
                                    <Ionicons name="flash" size={12} color="#00FF88" />
                                    <Text style={{ color: '#00FF88', fontSize: 11, marginLeft: 4, fontWeight: '600' }}>
                                        INSTANT
                                    </Text>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Bottom Chrome Reflection */}
                        <View
                            style={{
                                height: 12,
                                marginTop: -6,
                                marginHorizontal: 20,
                                borderBottomLeftRadius: 24,
                                borderBottomRightRadius: 24,
                                backgroundColor: 'rgba(0, 212, 255, 0.15)',
                                transform: [{ scaleY: -0.5 }],
                            }}
                        />
                    </ParallaxCard>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    );
}
