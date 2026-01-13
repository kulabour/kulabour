/**
 * KULABOUR DIMENSION - Gyroscope Parallax Engine
 * Makes the ENTIRE UI respond to phone tilt like a living 3D world
 * NEVER BEFORE SEEN in any service app!
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Animated, Platform } from 'react-native';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';

interface ParallaxContextType {
    tiltX: Animated.Value;
    tiltY: Animated.Value;
    rotationX: number;
    rotationY: number;
    isSupported: boolean;
    intensity: number;
    setIntensity: (value: number) => void;
}

const ParallaxContext = createContext<ParallaxContextType | undefined>(undefined);

export function GyroscopeParallaxProvider({ children }: { children: ReactNode }) {
    const tiltX = useRef(new Animated.Value(0)).current;
    const tiltY = useRef(new Animated.Value(0)).current;
    const [rotationX, setRotationX] = useState(0);
    const [rotationY, setRotationY] = useState(0);
    const [isSupported, setIsSupported] = useState(false);
    const [intensity, setIntensity] = useState(1);

    useEffect(() => {
        let subscription: { remove: () => void } | null = null;

        const startListening = async () => {
            const available = await DeviceMotion.isAvailableAsync();
            setIsSupported(available);

            if (available) {
                DeviceMotion.setUpdateInterval(16); // 60fps

                subscription = DeviceMotion.addListener((data: DeviceMotionMeasurement) => {
                    if (data.rotation) {
                        const { beta, gamma } = data.rotation;

                        // Clamp values for smooth experience
                        const clampedX = Math.max(-30, Math.min(30, (gamma || 0) * 50)) * intensity;
                        const clampedY = Math.max(-30, Math.min(30, (beta || 0) * 50)) * intensity;

                        // Smooth animation
                        Animated.parallel([
                            Animated.spring(tiltX, {
                                toValue: clampedX,
                                friction: 8,
                                tension: 100,
                                useNativeDriver: true,
                            }),
                            Animated.spring(tiltY, {
                                toValue: clampedY,
                                friction: 8,
                                tension: 100,
                                useNativeDriver: true,
                            }),
                        ]).start();

                        setRotationX(clampedX);
                        setRotationY(clampedY);
                    }
                });
            }
        };

        startListening();

        return () => {
            subscription?.remove();
        };
    }, [intensity]);

    return (
        <ParallaxContext.Provider value={{
            tiltX,
            tiltY,
            rotationX,
            rotationY,
            isSupported,
            intensity,
            setIntensity
        }}>
            {children}
        </ParallaxContext.Provider>
    );
}

export function useGyroscopeParallax() {
    const context = useContext(ParallaxContext);
    if (!context) {
        // Return default values if not in provider
        return {
            tiltX: new Animated.Value(0),
            tiltY: new Animated.Value(0),
            rotationX: 0,
            rotationY: 0,
            isSupported: false,
            intensity: 1,
            setIntensity: () => { },
        };
    }
    return context;
}

/**
 * HOC to make any component parallax-enabled
 * Usage: <ParallaxView depth={20}>...</ParallaxView>
 */
interface ParallaxViewProps {
    children: ReactNode;
    depth?: number; // Parallax intensity multiplier
    style?: any;
    invertX?: boolean;
    invertY?: boolean;
}

export function ParallaxView({
    children,
    depth = 10,
    style,
    invertX = false,
    invertY = false
}: ParallaxViewProps) {
    const { tiltX, tiltY } = useGyroscopeParallax();

    const translateX = tiltX.interpolate({
        inputRange: [-30, 30],
        outputRange: invertX ? [depth, -depth] : [-depth, depth],
    });

    const translateY = tiltY.interpolate({
        inputRange: [-30, 30],
        outputRange: invertY ? [depth, -depth] : [-depth, depth],
    });

    return (
        <Animated.View
            style={[
                style,
                {
                    transform: [
                        { translateX },
                        { translateY },
                    ],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
}

/**
 * 3D Tilt Card - Tilts based on gyroscope
 */
export function ParallaxCard({
    children,
    style,
    maxRotation = 15,
}: {
    children: ReactNode;
    style?: any;
    maxRotation?: number;
}) {
    const { tiltX, tiltY } = useGyroscopeParallax();

    const rotateX = tiltY.interpolate({
        inputRange: [-30, 30],
        outputRange: [`${maxRotation}deg`, `-${maxRotation}deg`],
    });

    const rotateY = tiltX.interpolate({
        inputRange: [-30, 30],
        outputRange: [`-${maxRotation}deg`, `${maxRotation}deg`],
    });

    return (
        <Animated.View
            style={[
                style,
                {
                    transform: [
                        { perspective: 1000 },
                        { rotateX },
                        { rotateY },
                    ],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
}
