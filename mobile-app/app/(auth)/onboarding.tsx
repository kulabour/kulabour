/**
 * KULABOUR - Premium Onboarding Experience
 * Swipeable carousel with stunning animations
 */

import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolation,
    withSpring,
    withTiming,
    FadeIn,
    FadeOut,
    SharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { haptic } from '../../engine/HapticRhythm';

const { width, height } = Dimensions.get('window');

const SLIDES: Array<{
    emoji: string;
    title: string;
    subtitle: string;
    description: string;
    gradient: [string, string];
    icon: string;
}> = [
        {
            emoji: '🔨',
            title: 'मुस्त्री चाहिए?',
            subtitle: 'Find Skilled Workers',
            description: 'Connect with verified workers in seconds. From plumbers to electricians, we\'ve got you covered.',
            gradient: ['#FF6B6B', '#FF8E53'],
            icon: 'construct',
        },
        {
            emoji: '⚡',
            title: 'तुरंत मिलेगा',
            subtitle: 'Instant Booking',
            description: 'Book workers in real-time. Track their location and get instant confirmations.',
            gradient: ['#4FACFE', '#00F2FE'],
            icon: 'flash',
        },
        {
            emoji: '💯',
            title: 'भरोसेमंद सेवा',
            subtitle: 'Trusted Service',
            description: 'All workers are verified. Read reviews, check ratings, and pay securely.',
            gradient: ['#43E97B', '#38F9D7'],
            icon: 'shield-checkmark',
        },
        {
            emoji: '🚀',
            title: 'शुरू करें!',
            subtitle: 'Get Started',
            description: 'Join thousands of satisfied customers. Your perfect worker is just a tap away.',
            gradient: ['#FA709A', '#FEE140'],
            icon: 'rocket',
        },
    ];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const handleSkip = () => {
        haptic('tap');
        router.replace('/(auth)/login');
    };

    const handleGetStarted = () => {
        haptic('success');
        router.replace('/(auth)/login');
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            {/* Skip Button */}
            {currentIndex < SLIDES.length - 1 && (
                <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className="absolute top-16 right-6 z-50"
                >
                    <TouchableOpacity
                        onPress={handleSkip}
                        className="px-4 py-2 bg-gray-100 rounded-full"
                        activeOpacity={0.7}
                    >
                        <Text className="text-gray-600 font-semibold">Skip</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            {/* Slides */}
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                    haptic('tap');
                }}
            >
                {SLIDES.map((slide, index) => (
                    <SlideItem
                        key={index}
                        slide={slide}
                        index={index}
                        scrollX={scrollX}
                    />
                ))}
            </Animated.ScrollView>

            {/* Pagination Dots */}
            <View className="absolute bottom-32 left-0 right-0 flex-row justify-center">
                {SLIDES.map((_, index) => (
                    <PaginationDot
                        key={index}
                        index={index}
                        scrollX={scrollX}
                    />
                ))}
            </View>

            {/* Get Started Button */}
            {currentIndex === SLIDES.length - 1 && (
                <Animated.View
                    entering={FadeIn.delay(200)}
                    className="absolute bottom-12 left-8 right-8"
                >
                    <TouchableOpacity
                        onPress={handleGetStarted}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={SLIDES[currentIndex].gradient}
                            className="py-5 rounded-2xl flex-row items-center justify-center"
                            style={{
                                shadowColor: SLIDES[currentIndex].gradient[0],
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 16,
                                elevation: 12,
                            }}
                        >
                            <Text className="text-white font-black text-lg mr-2">Get Started</Text>
                            <Ionicons name="arrow-forward" size={24} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

function SlideItem({ slide, index, scrollX }: { slide: typeof SLIDES[0]; index: number; scrollX: SharedValue<number> }) {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.8, 1, 0.8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.4, 1, 0.4],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            scrollX.value,
            inputRange,
            [100, 0, 100],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }, { translateY }],
            opacity,
        };
    });

    const emojiStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const rotate = interpolate(
            scrollX.value,
            inputRange,
            [-30, 0, 30],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            scrollX.value,
            inputRange,
            [0.6, 1, 0.6],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ rotate: `${rotate}deg` }, { scale }],
        };
    });

    return (
        <View style={{ width }} className="flex-1 items-center justify-center px-8">
            <Animated.View style={animatedStyle} className="items-center">
                {/* Gradient Circle Background */}
                <View className="mb-12">
                    <LinearGradient
                        colors={[slide.gradient[0], slide.gradient[1], slide.gradient[0]] as [string, string, string]}
                        className="w-64 h-64 rounded-full items-center justify-center"
                        style={{
                            shadowColor: slide.gradient[0],
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.3,
                            shadowRadius: 40,
                            elevation: 20,
                        }}
                    >
                        <View className="w-56 h-56 bg-white rounded-full items-center justify-center">
                            <Animated.Text style={[emojiStyle, { fontSize: 100 }]}>
                                {slide.emoji}
                            </Animated.Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Content */}
                <Text className="text-5xl font-black text-center mb-2 text-gray-900">
                    {slide.title}
                </Text>
                <Text className="text-xl font-semibold text-center mb-6 text-gray-600">
                    {slide.subtitle}
                </Text>
                <Text className="text-base text-center text-gray-500 leading-6 px-4">
                    {slide.description}
                </Text>
            </Animated.View>
        </View>
    );
}

function PaginationDot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
        );

        return {
            width: dotWidth,
            opacity,
        };
    });

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#0078D4',
                    marginHorizontal: 4,
                }
            ]}
        />
    );
}
