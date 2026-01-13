import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Particle {
    x: Animated.Value;
    y: Animated.Value;
    scale: Animated.Value;
    opacity: Animated.Value;
    color: string;
}

const PARTICLE_COLORS = [
    '#0078D4', // Primary Blue
    '#107C10', // Success Green
    '#FFB900', // Warning Gold
    '#00B7C3', // Cyan
    '#8764B8', // Purple
];

export function ParticleField({ particleCount = 30 }: { particleCount?: number }) {
    const particles = useRef<Particle[]>([]);

    useEffect(() => {
        // Initialize particles
        particles.current = Array.from({ length: particleCount }, () => ({
            x: new Animated.Value(Math.random() * width),
            y: new Animated.Value(Math.random() * height),
            scale: new Animated.Value(0.3 + Math.random() * 0.7),
            opacity: new Animated.Value(0.1 + Math.random() * 0.5),
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        }));

        // Animate each particle
        particles.current.forEach((particle, index) => {
            const animateParticle = () => {
                const duration = 8000 + Math.random() * 12000;
                const newX = Math.random() * width;
                const newY = Math.random() * height;

                Animated.parallel([
                    // Float movement
                    Animated.timing(particle.x, {
                        toValue: newX,
                        duration,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.y, {
                        toValue: newY,
                        duration,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    // Pulsing scale
                    Animated.sequence([
                        Animated.timing(particle.scale, {
                            toValue: 0.5 + Math.random() * 1,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(particle.scale, {
                            toValue: 0.3 + Math.random() * 0.5,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                    // Breathing opacity
                    Animated.sequence([
                        Animated.timing(particle.opacity, {
                            toValue: 0.3 + Math.random() * 0.6,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                        Animated.timing(particle.opacity, {
                            toValue: 0.1 + Math.random() * 0.3,
                            duration: duration / 2,
                            easing: Easing.inOut(Easing.sin),
                            useNativeDriver: true,
                        }),
                    ]),
                ]).start(() => animateParticle());
            };

            // Stagger start times
            setTimeout(animateParticle, index * 200);
        });
    }, [particleCount]);

    return (
        <View className="absolute inset-0 overflow-hidden" pointerEvents="none">
            {/* Gradient Background */}
            <LinearGradient
                colors={['#0a0a0f', '#0d1117', '#161b22']}
                className="absolute inset-0"
            />

            {/* Glow layers */}
            <View className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20"
                style={{ backgroundColor: '#0078D4', transform: [{ scale: 2 }], filter: 'blur(100px)' }}
            />
            <View className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-15"
                style={{ backgroundColor: '#107C10', transform: [{ scale: 2 }], filter: 'blur(80px)' }}
            />

            {/* Particles */}
            {particles.current.map((particle, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: particle.color,
                        transform: [
                            { translateX: particle.x },
                            { translateY: particle.y },
                            { scale: particle.scale },
                        ],
                        opacity: particle.opacity,
                        shadowColor: particle.color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 10,
                    }}
                />
            ))}
        </View>
    );
}
