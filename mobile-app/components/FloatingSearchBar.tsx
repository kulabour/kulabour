import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    withSpring,
    interpolate,
    Extrapolation,
    FadeIn,
    FadeOut,
    SlideInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { haptic } from '../engine/HapticRhythm';

const { width, height } = Dimensions.get('window');

export function FloatingSearchBar() {
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [transcript, setTranscript] = useState('');

    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);
    const elevation = useSharedValue(0);
    const pulseScale = useSharedValue(1);

    // Sound wave bars
    const soundWaves = Array.from({ length: 20 }, () => useSharedValue(0.3));

    useEffect(() => {
        // Subtle breathing animation
        scale.value = withRepeat(
            withSequence(
                withTiming(1.02, { duration: 2000 }),
                withTiming(1, { duration: 2000 })
            ),
            -1,
            true
        );

        // Gentle rotation for 3D effect
        rotate.value = withRepeat(
            withSequence(
                withTiming(2, { duration: 3000 }),
                withTiming(-2, { duration: 3000 })
            ),
            -1,
            true
        );

        // Elevation pulse
        elevation.value = withRepeat(
            withSequence(
                withTiming(8, { duration: 2000 }),
                withTiming(0, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        if (isVoiceActive) {
            // Pulse animation
            pulseScale.value = withRepeat(
                withSequence(
                    withTiming(1.3, { duration: 600 }),
                    withTiming(1, { duration: 600 })
                ),
                -1,
                true
            );

            // Sound wave animation
            soundWaves.forEach((wave, index) => {
                wave.value = withRepeat(
                    withSequence(
                        withTiming(0.3 + Math.random() * 0.7, { duration: 100 + index * 15 }),
                        withTiming(0.3, { duration: 100 + index * 15 })
                    ),
                    -1,
                    true
                );
            });

            // Simulate voice recognition
            setTimeout(() => {
                setTranscript('प्लंबर चाहिए...');
            }, 1500);
        } else {
            pulseScale.value = withSpring(1);
            setTranscript('');
        }
    }, [isVoiceActive]);

    const animatedMicStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotateZ: `${rotate.value}deg` },
        ],
    }));

    const animatedButtonStyle = useAnimatedStyle(() => {
        const shadowOpacity = interpolate(elevation.value, [0, 8], [0.3, 0.6]);

        return {
            shadowOpacity,
            transform: [
                { translateY: -elevation.value / 4 },
            ],
        };
    });

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
        opacity: interpolate(pulseScale.value, [1, 1.3], [0.6, 0], Extrapolation.CLAMP),
    }));

    const handleVoicePress = () => {
        haptic('tap');
        setIsVoiceActive(true);
    };

    const closeVoice = () => {
        haptic('tap');
        setIsVoiceActive(false);
    };

    return (
        <>
            <View className="absolute top-12 left-4 right-4 z-50">
                {/* MICA VOICE BUTTON - 3D Hero Element */}
                <Animated.View style={animatedButtonStyle}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="mb-3"
                        onPress={handleVoicePress}
                    >
                        {/* 3D Container with Perspective */}
                        <View style={{
                            shadowColor: '#0078D4',
                            shadowOffset: { width: 0, height: 16 },
                            shadowOpacity: 0.4,
                            shadowRadius: 32,
                            elevation: 16,
                        }}>
                            <LinearGradient
                                colors={['#0086F0', '#0078D4', '#006BBD']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="rounded-2xl overflow-hidden"
                            >
                                {/* Mica Overlay - Microsoft's new material */}
                                <View className="absolute inset-0 bg-white/5" />

                                {/* Top Light Reflection */}
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.3)', 'transparent']}
                                    className="absolute top-0 left-0 right-0 h-24"
                                />

                                <View className="flex-row items-center justify-between py-6 px-6">
                                    <View className="flex-row items-center flex-1">
                                        <Animated.View style={[animatedMicStyle, {
                                            shadowColor: '#fff',
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 8,
                                        }]} className="mr-4">
                                            <View className="bg-white/25 p-4 rounded-2xl border-2 border-white/30" style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 8 },
                                                shadowOpacity: 0.3,
                                                shadowRadius: 16,
                                            }}>
                                                <Ionicons name="mic" size={36} color="white" />
                                            </View>
                                        </Animated.View>
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-3xl" style={{
                                                textShadowColor: 'rgba(0,0,0,0.3)',
                                                textShadowOffset: { width: 0, height: 2 },
                                                textShadowRadius: 4,
                                            }}>बोलें</Text>
                                            <Text className="text-white/95 text-base mt-1">Speak to search services</Text>
                                        </View>
                                    </View>
                                    <View className="bg-white/30 rounded-full p-2.5 border border-white/40">
                                        <Ionicons name="arrow-forward" size={24} color="white" />
                                    </View>
                                </View>

                                {/* Bottom Shadow for depth */}
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.2)']}
                                    className="absolute bottom-0 left-0 right-0 h-4"
                                />
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* MICA LOCATION BAR - Floating 3D Surface */}
                <View style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 16,
                    elevation: 8,
                }}>
                    <View className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                        {/* Mica material simulation */}
                        <View className="absolute inset-0 bg-gradient-to-b from-white/98 to-white/95" />

                        {/* Subtle top highlight */}
                        <View className="absolute top-0 left-0 right-0 h-px bg-white/80" />

                        <View className="flex-row items-center p-4 relative">
                            <View className="bg-primary/10 p-2.5 rounded-xl mr-3 border border-primary/20" style={{
                                shadowColor: '#0078D4',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                            }}>
                                <Ionicons name="location" size={20} color="#0078D4" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-text-secondary text-xs font-semibold uppercase tracking-wide">Your Location</Text>
                                <Text className="text-text-primary font-bold text-base">आपकी लोकेशन</Text>
                            </View>
                            <TouchableOpacity className="p-2">
                                <Ionicons name="chevron-down" size={22} color="#605E5C" />
                            </TouchableOpacity>
                        </View>

                        {/* Bottom subtle shadow */}
                        <View className="absolute bottom-0 left-0 right-0 h-px bg-black/5" />
                    </View>
                </View>
            </View>

            {/* Voice Assistant Modal */}
            <Modal
                visible={isVoiceActive}
                transparent
                animationType="none"
                onRequestClose={closeVoice}
            >
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    className="flex-1 bg-black/95 justify-center items-center"
                >
                    {/* Close button */}
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 60, right: 20 }}
                        onPress={closeVoice}
                    >
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text className="absolute top-24 text-center text-2xl font-black text-cyan-400 tracking-widest">
                        🎤 VOICE SEARCH
                    </Text>

                    {/* Pulsing orb */}
                    <View className="items-center justify-center" style={{ width: 200, height: 200 }}>
                        {/* Pulse ring */}
                        <Animated.View
                            style={[
                                pulseStyle,
                                {
                                    position: 'absolute',
                                    width: 180,
                                    height: 180,
                                    borderRadius: 90,
                                    backgroundColor: '#00D4FF',
                                }
                            ]}
                        />

                        {/* Core orb */}
                        <LinearGradient
                            colors={['#00FF88', '#00D4FF']}
                            className="w-32 h-32 rounded-full items-center justify-center"
                            style={{
                                shadowColor: '#00D4FF',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 1,
                                shadowRadius: 40,
                            }}
                        >
                            <Ionicons name="radio" size={50} color="#000" />
                        </LinearGradient>
                    </View>

                    {/* Sound wave visualization */}
                    <View className="flex-row items-center h-16 mt-8">
                        {soundWaves.map((wave, i) => {
                            const animatedWaveStyle = useAnimatedStyle(() => ({
                                transform: [{ scaleY: wave.value }],
                            }));

                            return (
                                <Animated.View
                                    key={i}
                                    style={[
                                        animatedWaveStyle,
                                        {
                                            width: 4,
                                            height: 40,
                                            marginHorizontal: 2,
                                            borderRadius: 2,
                                            backgroundColor: '#00D4FF',
                                        }
                                    ]}
                                />
                            );
                        })}
                    </View>

                    {/* Transcript */}
                    {transcript && (
                        <Animated.View
                            entering={SlideInUp.springify()}
                            className="mt-8"
                        >
                            <Text className="text-white/50 text-sm text-center">You said:</Text>
                            <Text className="text-white text-xl font-semibold text-center">"{transcript}"</Text>
                        </Animated.View>
                    )}

                    {/* Hint */}
                    <Text className="absolute bottom-12 text-white/40 text-sm">
                        बोलो... कौन सा मिस्त्री चाहिए?
                    </Text>
                </Animated.View>
            </Modal>
        </>
    );
}
