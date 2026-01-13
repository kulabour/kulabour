/**
 * KULABOUR DIMENSION - Swipe-to-Bargain System (Reanimated Edition)
 * Negotiate prices with physics-based interactions!
 * PRO EDITION with Haptics & Particles
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolation,
    withSequence,
    withTiming,
    withRepeat,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { haptic } from '../engine/HapticRhythm';

const { width } = Dimensions.get('window');

interface SwipeBargainProps {
    basePrice: number;
    minDiscount: number; // e.g., 5%
    maxDiscount: number; // e.g., 20%
    onPriceChange: (newPrice: number, discount: number) => void;
    onConfirm: (finalPrice: number) => void;
    workerName: string;
}

export function SwipeToBargain({
    basePrice,
    minDiscount = 5,
    maxDiscount = 20,
    onPriceChange,
    onConfirm,
    workerName,
}: SwipeBargainProps) {
    const [currentPrice, setCurrentPrice] = useState(basePrice);
    const [bargainAttempts, setBargainAttempts] = useState(3);
    const [isLocked, setIsLocked] = useState(false);
    const [aiResponse, setAiResponse] = useState(`${workerName} का price: ₹${basePrice}`);
    const [currentDiscountDisplay, setCurrentDiscountDisplay] = useState(0);

    // Animation Values
    const translateX = useSharedValue(0);
    const sliderWidth = width - 80;
    const maxTranslate = sliderWidth - 60;
    const shake = useSharedValue(0);
    const glow = useSharedValue(0);

    useEffect(() => {
        glow.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500 }),
                withTiming(0, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const aiResponses = {
        low: [
            "थोड़ा और try करो...",
            "इतना कम? फिर से swipe करो!",
            "Come on, you can do better!",
        ],
        medium: [
            "अच्छा discount मिला! 👍",
            "Nice bargaining! Accept करो?",
            "Good deal! Confirm करो?",
        ],
        high: [
            "🔥 Maximum discount! जल्दी book करो!",
            "BEST PRICE! Miss मत करो!",
            "Jackpot! इससे अच्छा नहीं मिलेगा!",
        ],
        failed: [
            "Sorry, और discount possible नहीं है।",
            "Worker ने मना कर दिया 😅",
            "Try again next time!",
        ],
    };

    const handleGestureEnd = (velocity: number, position: number) => {
        if (isLocked || bargainAttempts <= 0) return;

        // Determine success based on velocity and position
        // High velocity = confident bargain
        const successChance = Math.min(0.9, (velocity / 2000) * 0.5 + (position / maxTranslate) * 0.5);
        const isSuccess = Math.random() < successChance;

        setBargainAttempts(prev => prev - 1);

        if (isSuccess) {
            haptic('success');

            // Calculate achieved discount
            const ratio = position / maxTranslate;
            const achievedDiscount = Math.round(minDiscount + ratio * (maxDiscount - minDiscount));
            const newPrice = Math.round(basePrice * (1 - achievedDiscount / 100));

            setCurrentDiscountDisplay(achievedDiscount);
            setCurrentPrice(newPrice);

            let response: string;
            if (achievedDiscount >= maxDiscount * 0.8) {
                response = aiResponses.high[Math.floor(Math.random() * aiResponses.high.length)];
            } else if (achievedDiscount >= maxDiscount * 0.4) {
                response = aiResponses.medium[Math.floor(Math.random() * aiResponses.medium.length)];
            } else {
                response = aiResponses.low[Math.floor(Math.random() * aiResponses.low.length)];
            }

            setAiResponse(`${response}`);
            onPriceChange(newPrice, achievedDiscount);
        } else {
            haptic('error');
            // Shake effect
            shake.value = withSequence(
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );

            setAiResponse(aiResponses.failed[Math.floor(Math.random() * aiResponses.failed.length)]);
            setCurrentDiscountDisplay(0);
            setCurrentPrice(basePrice);
        }

        if (bargainAttempts <= 1) {
            setIsLocked(true);
            if (bargainAttempts === 1) setAiResponse("Last offer! Take it or leave it.");
        }
    };

    const pan = Gesture.Pan()
        .enabled(!isLocked)
        .onStart(() => {
            runOnJS(haptic)('tap');
        })
        .onUpdate((event) => {
            let nextX = event.translationX;
            if (nextX < 0) nextX = 0;
            if (nextX > maxTranslate) nextX = maxTranslate;
            translateX.value = nextX;
        })
        .onEnd((event) => {
            const velocity = Math.abs(event.velocityX);
            const position = translateX.value;

            runOnJS(handleGestureEnd)(velocity, position);

            translateX.value = withSpring(0, { damping: 12, stiffness: 100 });
        });

    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const progressStyle = useAnimatedStyle(() => {
        const widthPercent = interpolate(
            translateX.value,
            [0, maxTranslate],
            [0, 100],
            Extrapolation.CLAMP
        );
        return {
            width: `${widthPercent}%`,
        };
    });

    const shakeStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: shake.value }],
        };
    });

    const glowStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(glow.value, [0, 1], [0.3, 0.8]),
        };
    })

    return (
        <Animated.View
            style={[
                {
                    padding: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: '#00D4FF',
                },
                shakeStyle
            ]}
        >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
                    💰 SWIPE TO BARGAIN
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginRight: 8 }}>
                        Attempts:
                    </Text>
                    {[...Array(3)].map((_, i) => (
                        <View
                            key={i}
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: i < bargainAttempts ? '#00FF88' : '#333',
                                marginLeft: 4,
                            }}
                        />
                    ))}
                </View>
            </View>

            {/* Price Display */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textDecorationLine: 'line-through' }}>
                    ₹{basePrice}
                </Text>
                <Text
                    style={{
                        color: '#00FF88',
                        fontSize: 42,
                        fontWeight: '900',
                        textShadowColor: '#00FF88',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 20,
                    }}
                >
                    ₹{currentPrice}
                </Text>
                {currentDiscountDisplay > 0 && (
                    <View
                        style={{
                            backgroundColor: '#00FF88',
                            paddingHorizontal: 12,
                            paddingVertical: 4,
                            borderRadius: 12,
                            marginTop: 8,
                        }}
                    >
                        <Text style={{ color: '#000', fontWeight: '800', fontSize: 14 }}>
                            {currentDiscountDisplay}% OFF!
                        </Text>
                    </View>
                )}
            </View>

            {/* Swipe Slider */}
            <View
                style={{
                    height: 70,
                    backgroundColor: '#111',
                    borderRadius: 35,
                    overflow: 'hidden',
                    marginBottom: 16,
                    justifyContent: 'center'
                }}
            >
                {/* Progress fill */}
                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 255, 136, 0.2)',
                        },
                        progressStyle
                    ]}
                />

                {/* Slider track hint */}
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.2)" />
                    <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginHorizontal: 8 }}>
                        SWIPE HARD FOR DISCOUNT
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.2)" />
                </View>

                {/* Draggable thumb */}
                <GestureDetector gesture={pan}>
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                left: 5,
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                            },
                            thumbStyle
                        ]}
                    >
                        <Animated.View
                            style={[
                                {
                                    flex: 1,
                                    borderRadius: 30,
                                    backgroundColor: '#00D4FF',
                                    position: 'absolute',
                                    inset: -4,
                                },
                                glowStyle
                            ]}
                        />
                        <LinearGradient
                            colors={['#00D4FF', '#00FF88']}
                            style={{
                                flex: 1,
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 24 }}>🤝</Text>
                        </LinearGradient>
                    </Animated.View>
                </GestureDetector>
            </View>

            {/* AI Response */}
            <View
                style={{
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    padding: 16,
                    borderRadius: 16,
                    borderLeftWidth: 3,
                    borderLeftColor: '#00D4FF',
                }}
            >
                <Text style={{ color: '#fff', fontSize: 14, lineHeight: 20 }}>
                    {aiResponse}
                </Text>
            </View>
        </Animated.View>
    );
}
