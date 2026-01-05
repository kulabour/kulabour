import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export function MagicSearchBar() {
    const [isFocused, setIsFocused] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Animations
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const micPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Continuous ambient pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Border glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    useEffect(() => {
        if (isListening) {
            // Mic pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(micPulse, {
                        toValue: 1.3,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(micPulse, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Wave animation for voice visualization
            Animated.loop(
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            micPulse.setValue(1);
            waveAnim.setValue(0);
        }
    }, [isListening]);

    const handleMicPress = () => {
        Vibration.vibrate(50);
        setIsListening(!isListening);
    };

    const borderColor = glowAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['rgba(0, 120, 212, 0.3)', 'rgba(16, 124, 16, 0.5)', 'rgba(0, 120, 212, 0.3)'],
    });

    const innerGlow = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.25],
    });

    return (
        <View className="px-5 pt-16 pb-4">
            <Animated.View
                style={{
                    borderRadius: 28,
                    overflow: 'hidden',
                    shadowColor: '#0078D4',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.4,
                    shadowRadius: 30,
                    elevation: 20,
                }}
            >
                {/* Animated Border */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 28,
                        borderWidth: 2,
                        borderColor: borderColor,
                    }}
                />

                {/* Glass Background */}
                <LinearGradient
                    colors={['rgba(15, 20, 30, 0.95)', 'rgba(10, 15, 25, 0.98)']}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderRadius: 28,
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {/* Search Icon with Pulse */}
                    <Animated.View
                        style={{
                            opacity: pulseAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.6, 1],
                            }),
                        }}
                    >
                        <Ionicons name="search" size={24} color="rgba(255,255,255,0.7)" />
                    </Animated.View>

                    {/* Input Field */}
                    <TextInput
                        placeholder="बोलो या टाइप करो..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        style={{
                            flex: 1,
                            marginLeft: 16,
                            fontSize: 18,
                            color: '#fff',
                            fontWeight: '500',
                        }}
                    />

                    {/* Magic Voice Button */}
                    <TouchableOpacity onPress={handleMicPress} activeOpacity={0.8}>
                        <Animated.View
                            style={{
                                transform: [{ scale: micPulse }],
                            }}
                        >
                            <LinearGradient
                                colors={isListening
                                    ? ['#107C10', '#0a5c0a']
                                    : ['#0078D4', '#005a9e']
                                }
                                style={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 26,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    shadowColor: isListening ? '#107C10' : '#0078D4',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: isListening ? 20 : 10,
                                }}
                            >
                                <Ionicons
                                    name={isListening ? "radio" : "mic"}
                                    size={26}
                                    color="#fff"
                                />
                            </LinearGradient>
                        </Animated.View>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Voice Visualization Waves */}
                {isListening && (
                    <View className="absolute bottom-0 left-0 right-0 h-1 flex-row justify-center items-end overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <Animated.View
                                key={i}
                                style={{
                                    width: 3,
                                    marginHorizontal: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#107C10',
                                    height: waveAnim.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [
                                            4 + Math.sin(i * 0.5) * 4,
                                            8 + Math.sin(i * 0.5) * 8,
                                            4 + Math.sin(i * 0.5) * 4,
                                        ],
                                    }),
                                    opacity: waveAnim.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [0.3, 1, 0.3],
                                    }),
                                }}
                            />
                        ))}
                    </View>
                )}
            </Animated.View>

            {/* Hint Text */}
            <View className="flex-row justify-center items-center mt-4">
                <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.4)" />
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginLeft: 6 }}>
                    "मुझे प्लंबर चाहिए" बोलें
                </Text>
            </View>
        </View>
    );
}
