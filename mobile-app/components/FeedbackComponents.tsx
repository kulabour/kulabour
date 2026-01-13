/**
 * KULABOUR - Premium Feedback Components
 * Animated success, error, and confirmation feedback
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    withRepeat,
    interpolate,
    Extrapolation,
    FadeIn,
    FadeOut,
    ZoomIn,
    SlideInUp,
} from 'react-native-reanimated';
import { haptic } from '../engine/HapticRhythm';

const { width, height } = Dimensions.get('window');

interface FeedbackProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    type: 'success' | 'error' | 'confirm';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

/**
 * Animated Success Screen with Confetti
 */
export function SuccessFeedback({
    visible,
    onClose,
    title = 'सफल!',
    message = 'आपका काम हो गया',
}: Omit<FeedbackProps, 'type'>) {
    const checkScale = useSharedValue(0);
    const ringScale = useSharedValue(0);
    const confettiOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            haptic('success');

            // Animate check
            checkScale.value = withDelay(200, withSpring(1, { damping: 8 }));

            // Animate ring
            ringScale.value = withSequence(
                withDelay(100, withSpring(1.2, { damping: 10 })),
                withSpring(1, { damping: 8 })
            );

            // Show confetti
            confettiOpacity.value = withDelay(300, withTiming(1, { duration: 500 }));
        } else {
            checkScale.value = 0;
            ringScale.value = 0;
            confettiOpacity.value = 0;
        }
    }, [visible]);

    const checkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
    }));

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: interpolate(ringScale.value, [0, 0.5, 1], [0, 0.5, 0.2], Extrapolation.CLAMP),
    }));

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                className="flex-1 bg-black/80 justify-center items-center"
            >
                <Animated.View
                    entering={ZoomIn.springify()}
                    className="bg-white rounded-3xl p-8 mx-8 items-center"
                    style={{
                        shadowColor: '#22C55E',
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.3,
                        shadowRadius: 24,
                    }}
                >
                    {/* Success Icon with Ring */}
                    <View className="mb-6">
                        <Animated.View
                            style={[
                                ringStyle,
                                {
                                    position: 'absolute',
                                    width: 120,
                                    height: 120,
                                    borderRadius: 60,
                                    backgroundColor: '#22C55E',
                                    left: -10,
                                    top: -10,
                                }
                            ]}
                        />
                        <Animated.View style={checkStyle}>
                            <LinearGradient
                                colors={['#22C55E', '#16A34A']}
                                className="w-24 h-24 rounded-full items-center justify-center"
                            >
                                <Ionicons name="checkmark" size={48} color="white" />
                            </LinearGradient>
                        </Animated.View>
                    </View>

                    <Text className="text-2xl font-black text-gray-900 mb-2">{title}</Text>
                    <Text className="text-gray-500 text-center mb-6">{message}</Text>

                    <TouchableOpacity
                        onPress={() => {
                            haptic('tap');
                            onClose();
                        }}
                        className="w-full"
                    >
                        <LinearGradient
                            colors={['#22C55E', '#16A34A']}
                            className="py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-lg">ठीक है 👍</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

/**
 * Animated Error Screen with Shake
 */
export function ErrorFeedback({
    visible,
    onClose,
    title = 'कुछ गड़बड़ हुई!',
    message = 'कृपया फिर से कोशिश करें',
}: Omit<FeedbackProps, 'type'>) {
    const shake = useSharedValue(0);
    const iconScale = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            haptic('error');

            iconScale.value = withSpring(1, { damping: 8 });
            shake.value = withSequence(
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );
        } else {
            iconScale.value = 0;
        }
    }, [visible]);

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shake.value }],
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                className="flex-1 bg-black/80 justify-center items-center"
            >
                <Animated.View
                    entering={ZoomIn.springify()}
                    style={shakeStyle}
                    className="bg-white rounded-3xl p-8 mx-8 items-center"
                >
                    {/* Error Icon */}
                    <Animated.View style={iconStyle} className="mb-6">
                        <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            className="w-24 h-24 rounded-full items-center justify-center"
                            style={{
                                shadowColor: '#EF4444',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 16,
                            }}
                        >
                            <Ionicons name="close" size={48} color="white" />
                        </LinearGradient>
                    </Animated.View>

                    <Text className="text-2xl font-black text-gray-900 mb-2">{title}</Text>
                    <Text className="text-gray-500 text-center mb-6">{message}</Text>

                    <TouchableOpacity
                        onPress={() => {
                            haptic('tap');
                            onClose();
                        }}
                        className="w-full"
                    >
                        <LinearGradient
                            colors={['#EF4444', '#DC2626']}
                            className="py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-lg">फिर से कोशिश करें</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

/**
 * Animated Confirmation Dialog
 */
export function ConfirmFeedback({
    visible,
    onClose,
    onConfirm,
    title = 'पक्का करें?',
    message = 'क्या आप यह करना चाहते हैं?',
    confirmText = 'हाँ',
    cancelText = 'नहीं',
}: Omit<FeedbackProps, 'type'>) {
    const iconPulse = useSharedValue(1);

    useEffect(() => {
        if (visible) {
            haptic('notification');
            iconPulse.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 800 }),
                    withTiming(1, { duration: 800 })
                ),
                -1,
                true
            );
        }
    }, [visible]);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconPulse.value }],
    }));

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                className="flex-1 bg-black/80 justify-center items-center"
            >
                <Animated.View
                    entering={SlideInUp.springify()}
                    className="bg-white rounded-3xl p-8 mx-8 items-center"
                >
                    {/* Question Icon */}
                    <Animated.View style={pulseStyle} className="mb-6">
                        <LinearGradient
                            colors={['#F59E0B', '#D97706']}
                            className="w-24 h-24 rounded-full items-center justify-center"
                            style={{
                                shadowColor: '#F59E0B',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.4,
                                shadowRadius: 16,
                            }}
                        >
                            <Ionicons name="help" size={48} color="white" />
                        </LinearGradient>
                    </Animated.View>

                    <Text className="text-2xl font-black text-gray-900 mb-2">{title}</Text>
                    <Text className="text-gray-500 text-center mb-6">{message}</Text>

                    <View className="flex-row w-full gap-3">
                        <TouchableOpacity
                            onPress={() => {
                                haptic('tap');
                                onClose();
                            }}
                            className="flex-1"
                        >
                            <View className="py-4 rounded-xl items-center bg-gray-200">
                                <Text className="text-gray-700 font-bold text-lg">{cancelText}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                haptic('success');
                                onConfirm?.();
                                onClose();
                            }}
                            className="flex-1"
                        >
                            <LinearGradient
                                colors={['#22C55E', '#16A34A']}
                                className="py-4 rounded-xl items-center"
                            >
                                <Text className="text-white font-bold text-lg">{confirmText}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

/**
 * Toast Notification - Floating message
 */
export function Toast({
    visible,
    message,
    type = 'info',
    duration = 3000,
    onHide,
}: {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onHide: () => void;
}) {
    useEffect(() => {
        if (visible) {
            haptic(type === 'error' ? 'error' : type === 'success' ? 'success' : 'tap');
            const timer = setTimeout(onHide, duration);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const colors = {
        success: ['#22C55E', '#16A34A'],
        error: ['#EF4444', '#DC2626'],
        info: ['#0078D4', '#005A9E'],
    };

    const icons = {
        success: 'checkmark-circle',
        error: 'close-circle',
        info: 'information-circle',
    };

    if (!visible) return null;

    return (
        <Animated.View
            entering={SlideInUp.springify()}
            exiting={FadeOut.duration(200)}
            className="absolute top-16 left-4 right-4 z-50"
        >
            <LinearGradient
                colors={colors[type] as [string, string]}
                className="flex-row items-center p-4 rounded-2xl"
                style={{
                    shadowColor: colors[type][0],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                }}
            >
                <Ionicons name={icons[type] as any} size={24} color="white" />
                <Text className="text-white font-semibold ml-3 flex-1">{message}</Text>
                <TouchableOpacity onPress={onHide}>
                    <Ionicons name="close" size={20} color="rgba(255,255,255,0.8)" />
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
}
