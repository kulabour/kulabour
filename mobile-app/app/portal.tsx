import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PortalEntryPage() {
    const router = useRouter();

    // Portal animations
    const portalScale = useRef(new Animated.Value(0)).current;
    const portalOpacity = useRef(new Animated.Value(0)).current;
    const ringRotation = useRef(new Animated.Value(0)).current;
    const glowPulse = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Sequence of animations
        Animated.sequence([
            // Portal appears
            Animated.parallel([
                Animated.spring(portalScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(portalOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            // Text fades in
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous ring rotation
        Animated.loop(
            Animated.timing(ringRotation, {
                toValue: 1,
                duration: 20000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Glow pulsing
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowPulse, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(glowPulse, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleEnterPortal = () => {
        Vibration.vibrate(100);

        // Warp animation
        Animated.parallel([
            Animated.timing(portalScale, {
                toValue: 20,
                duration: 600,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(portalOpacity, {
                toValue: 0,
                duration: 400,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            router.replace('/(customer)/living');
        });
    };

    const ringRotationDegree = ringRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const glowOpacity = glowPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0.8],
    });

    return (
        <View className="flex-1 bg-black justify-center items-center">
            {/* Background gradient */}
            <LinearGradient
                colors={['#000', '#0a0a15', '#000']}
                className="absolute inset-0"
            />

            {/* Stars background */}
            {[...Array(50)].map((_, i) => (
                <View
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: 2,
                        height: 2,
                        borderRadius: 1,
                        backgroundColor: '#fff',
                        opacity: 0.3 + Math.random() * 0.5,
                    }}
                />
            ))}

            {/* Portal */}
            <TouchableOpacity onPress={handleEnterPortal} activeOpacity={0.9}>
                <Animated.View
                    style={{
                        width: 280,
                        height: 280,
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [{ scale: portalScale }],
                        opacity: portalOpacity,
                    }}
                >
                    {/* Outer glow */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: 320,
                            height: 320,
                            borderRadius: 160,
                            backgroundColor: '#0078D4',
                            opacity: glowOpacity,
                            transform: [{ scale: 1.2 }],
                        }}
                    />

                    {/* Rotating ring 1 */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: 280,
                            height: 280,
                            borderRadius: 140,
                            borderWidth: 3,
                            borderColor: '#0078D4',
                            borderStyle: 'dashed',
                            transform: [{ rotate: ringRotationDegree }],
                        }}
                    />

                    {/* Rotating ring 2 (counter) */}
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: 240,
                            height: 240,
                            borderRadius: 120,
                            borderWidth: 2,
                            borderColor: '#107C10',
                            borderStyle: 'dotted',
                            transform: [{
                                rotate: ringRotation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['360deg', '0deg'],
                                }),
                            }],
                        }}
                    />

                    {/* Inner core */}
                    <LinearGradient
                        colors={['#0078D4', '#005a9e', '#004078']}
                        style={{
                            width: 180,
                            height: 180,
                            borderRadius: 90,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#0078D4',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 1,
                            shadowRadius: 40,
                        }}
                    >
                        <Ionicons name="enter-outline" size={60} color="#fff" />
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>

            {/* Text */}
            <Animated.View
                style={{
                    marginTop: 60,
                    alignItems: 'center',
                    opacity: textOpacity,
                }}
            >
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 36,
                        fontWeight: '900',
                        textAlign: 'center',
                        textShadowColor: '#0078D4',
                        textShadowOffset: { width: 0, height: 4 },
                        textShadowRadius: 20,
                    }}
                >
                    KULABOUR
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginTop: 8 }}>
                    The Living Service Platform
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 20 }}>
                    Tap the portal to enter
                </Text>
            </Animated.View>
        </View>
    );
}
