import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, TouchableOpacity, Text, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface WorkerAvatarProps {
    name: string;
    skill: string;
    rating: number;
    isOnline: boolean;
    imageUri?: string;
    size?: 'small' | 'medium' | 'large';
    onPress?: () => void;
}

export function WorkerAvatar3D({
    name,
    skill,
    rating,
    isOnline,
    imageUri,
    size = 'medium',
    onPress,
}: WorkerAvatarProps) {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const sizes = {
        small: { container: 60, avatar: 48, ring: 56 },
        medium: { container: 90, avatar: 72, ring: 84 },
        large: { container: 120, avatar: 96, ring: 112 },
    };

    const s = sizes[size];

    useEffect(() => {
        // Floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 3000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 3000,
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
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Subtle rotation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 30000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Animated.View
                style={{
                    width: s.container,
                    alignItems: 'center',
                    transform: [{ translateY: floatAnim }],
                }}
            >
                {/* Glow effect */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        width: s.ring + 20,
                        height: s.ring + 20,
                        borderRadius: (s.ring + 20) / 2,
                        backgroundColor: isOnline ? '#107C10' : '#6E6E6E',
                        opacity: glowOpacity,
                    }}
                />

                {/* Rotating ring */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        width: s.ring,
                        height: s.ring,
                        borderRadius: s.ring / 2,
                        borderWidth: 2,
                        borderColor: isOnline ? '#107C10' : '#6E6E6E',
                        borderStyle: 'dashed',
                        transform: [{ rotate }],
                    }}
                />

                {/* Avatar */}
                <LinearGradient
                    colors={['#1a1a2e', '#16213e', '#0f3460']}
                    style={{
                        width: s.avatar,
                        height: s.avatar,
                        borderRadius: s.avatar / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 3,
                        borderColor: isOnline ? '#107C10' : '#3a3a3a',
                        shadowColor: isOnline ? '#107C10' : '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.5,
                        shadowRadius: 12,
                    }}
                >
                    <Ionicons
                        name="person"
                        size={s.avatar * 0.5}
                        color={isOnline ? '#fff' : 'rgba(255,255,255,0.5)'}
                    />
                </LinearGradient>

                {/* Online indicator */}
                {isOnline && (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: s.container * 0.25,
                            right: s.container * 0.15,
                            width: 14,
                            height: 14,
                            borderRadius: 7,
                            backgroundColor: '#107C10',
                            borderWidth: 2,
                            borderColor: '#0a0a15',
                            shadowColor: '#107C10',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 1,
                            shadowRadius: 6,
                        }}
                    />
                )}

                {/* Name and skill */}
                <View style={{ marginTop: 8, alignItems: 'center' }}>
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: size === 'large' ? 14 : 12,
                            fontWeight: '700',
                        }}
                    >
                        {name}
                    </Text>
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: size === 'large' ? 12 : 10,
                        }}
                    >
                        {skill}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Ionicons name="star" size={10} color="#FFB900" />
                        <Text
                            style={{
                                color: '#FFB900',
                                fontSize: 10,
                                fontWeight: '600',
                                marginLeft: 3,
                            }}
                        >
                            {rating}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}
