/**
 * KULABOUR Customer Signup - Premium Edition
 * Enhanced with Reanimated animations and micro-interactions
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { haptic } from '../../../engine/HapticRhythm';

export default function CustomerSignupScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Animation values
    const buttonScale = useSharedValue(1);
    const buttonShake = useSharedValue(0);
    const progressWidth = useSharedValue(0);

    const handleSendOTP = () => {
        if (phone.length < 10) {
            // Shake animation for invalid
            buttonShake.value = withSequence(
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );
            haptic('error');
            return;
        }

        haptic('success');
        buttonScale.value = withSpring(0.95, { damping: 15 });
        setIsLoading(true);

        // Progress animation
        progressWidth.value = withTiming(100, { duration: 1000 });

        setTimeout(() => {
            setIsLoading(false);
            buttonScale.value = withSpring(1);
            router.push({
                pathname: '/auth/customer/otp',
                params: { phone, name }
            });
        }, 1000);
    };

    const isValid = phone.length === 10;

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: buttonScale.value },
            { translateX: buttonShake.value },
        ],
    }));

    const progressStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const InputField = ({
        label,
        emoji,
        value,
        onChangeText,
        placeholder,
        keyboardType = 'default',
        maxLength,
        delay,
        fieldName,
        children
    }: any) => {
        const isFocused = focusedField === fieldName;
        const hasValue = value?.length > 0;

        return (
            <Animated.View
                entering={FadeInDown.delay(delay).springify()}
                style={{ marginBottom: 20 }}
            >
                <Text style={{
                    color: isFocused ? '#0078D4' : '#333',
                    fontSize: 16,
                    fontWeight: '700',
                    marginBottom: 8,
                    transform: [{ scale: isFocused ? 1.02 : 1 }]
                }}>
                    {emoji} {label}
                </Text>
                {children || (
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        borderWidth: 2,
                        borderColor: isFocused ? '#0078D4' : (hasValue ? '#22C55E' : '#E5E7EB'),
                        shadowColor: isFocused ? '#0078D4' : 'transparent',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                    }}>
                        <TextInput
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            keyboardType={keyboardType}
                            maxLength={maxLength}
                            onFocus={() => {
                                setFocusedField(fieldName);
                                haptic('tap');
                            }}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                padding: 16,
                                fontSize: 18,
                                color: '#111',
                            }}
                        />
                        {hasValue && (
                            <View style={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                marginTop: -10,
                            }}>
                                <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                            </View>
                        )}
                    </View>
                )}
            </Animated.View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Premium Header with Parallax effect */}
            <Animated.View entering={FadeInUp.duration(600)}>
                <LinearGradient
                    colors={['#0078D4', '#005A9E']}
                    style={{
                        paddingTop: 60,
                        paddingBottom: 40,
                        paddingHorizontal: 24,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        shadowColor: '#0078D4',
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            haptic('tap');
                            router.back();
                        }}
                        style={{ position: 'absolute', top: 50, left: 16, padding: 8 }}
                    >
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center' }}>
                        <Animated.Text
                            entering={FadeInDown.delay(200).springify()}
                            style={{ fontSize: 56 }}
                        >
                            🏠
                        </Animated.Text>
                        <Animated.Text
                            entering={FadeInDown.delay(300).springify()}
                            style={{ color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 12 }}
                        >
                            काम करवाओ
                        </Animated.Text>
                        <Animated.Text
                            entering={FadeInDown.delay(400).springify()}
                            style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15 }}
                        >
                            Get Work Done
                        </Animated.Text>
                    </View>
                </LinearGradient>
            </Animated.View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    {/* Name Input */}
                    <InputField
                        label="आपका नाम (Your Name)"
                        emoji="👤"
                        value={name}
                        onChangeText={setName}
                        placeholder="जैसे: राजेश शर्मा"
                        delay={100}
                        fieldName="name"
                    />

                    {/* Phone Input */}
                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={{ marginBottom: 24 }}
                    >
                        <Text style={{ color: focusedField === 'phone' ? '#0078D4' : '#333', fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                            📱 मोबाइल नंबर (Mobile Number) *
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 16,
                                padding: 4,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: focusedField === 'phone' ? '#0078D4' : (phone.length === 10 ? '#22C55E' : '#E5E7EB'),
                                shadowColor: focusedField === 'phone' ? '#0078D4' : 'transparent',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 8,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: '#F3F4F6',
                                    paddingHorizontal: 16,
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    marginRight: 8,
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>
                                    🇮🇳 +91
                                </Text>
                            </View>
                            <TextInput
                                value={phone}
                                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                                placeholder="मोबाइल नंबर"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                maxLength={10}
                                onFocus={() => {
                                    setFocusedField('phone');
                                    haptic('tap');
                                }}
                                onBlur={() => setFocusedField(null)}
                                style={{
                                    flex: 1,
                                    fontSize: 22,
                                    fontWeight: '700',
                                    color: '#111',
                                    paddingVertical: 12,
                                    letterSpacing: 2,
                                }}
                            />
                            {phone.length === 10 && (
                                <View style={{ marginRight: 12 }}>
                                    <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                                </View>
                            )}
                        </View>
                    </Animated.View>

                    {/* Benefits - Animated */}
                    <Animated.View
                        entering={FadeInDown.delay(300).springify()}
                        style={{
                            backgroundColor: '#E0F2FE',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: '#BAE6FD',
                        }}
                    >
                        <Text style={{ color: '#0369A1', fontSize: 15, fontWeight: '700', marginBottom: 12 }}>
                            ✨ KULABOUR के फायदे:
                        </Text>
                        {[
                            { text: '✅ वेरिफाइड मजदूर', delay: 350 },
                            { text: '✅ तुरंत सर्विस', delay: 400 },
                            { text: '✅ फिक्स रेट - कोई मोलभाव नहीं', delay: 450 },
                            { text: '✅ 100% गारंटी', delay: 500 },
                            { text: '✅ 24/7 सपोर्ट', delay: 550 },
                        ].map((benefit, index) => (
                            <Animated.Text
                                key={index}
                                entering={FadeInDown.delay(benefit.delay).springify()}
                                style={{ color: '#075985', fontSize: 14, marginBottom: 6 }}
                            >
                                {benefit.text}
                            </Animated.Text>
                        ))}
                    </Animated.View>

                    {/* Send OTP Button - Animated */}
                    <Animated.View
                        entering={FadeInDown.delay(600).springify()}
                        style={buttonAnimatedStyle}
                    >
                        <TouchableOpacity
                            onPress={handleSendOTP}
                            disabled={isLoading}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={isValid ? ['#0078D4', '#005A9E'] : ['#9CA3AF', '#6B7280']}
                                style={{
                                    paddingVertical: 18,
                                    borderRadius: 16,
                                    alignItems: 'center',
                                    marginBottom: 24,
                                    overflow: 'hidden',
                                    shadowColor: isValid ? '#0078D4' : 'transparent',
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 12,
                                }}
                            >
                                {/* Progress bar */}
                                {isLoading && (
                                    <Animated.View
                                        style={[
                                            progressStyle,
                                            {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                            }
                                        ]}
                                    />
                                )}
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                                    {isLoading ? '⏳ भेज रहे हैं...' : '📲 OTP भेजें'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Already have account */}
                    <Animated.View entering={FadeInDown.delay(700).springify()}>
                        <TouchableOpacity
                            onPress={() => {
                                haptic('tap');
                                router.push('/(customer)/auth/login');
                            }}
                            style={{ alignItems: 'center', paddingVertical: 16 }}
                        >
                            <Text style={{ color: '#6B7280', fontSize: 15 }}>
                                पहले से अकाउंट है? <Text style={{ color: '#0078D4', fontWeight: '700' }}>लॉगिन करें</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Worker signup link */}
                    <Animated.View entering={FadeInDown.delay(800).springify()}>
                        <TouchableOpacity
                            onPress={() => {
                                haptic('tap');
                                router.push('/auth/worker/signup');
                            }}
                            style={{
                                alignItems: 'center',
                                paddingVertical: 16,
                                backgroundColor: '#F0FDF4',
                                borderRadius: 12,
                                marginTop: 8,
                                borderWidth: 1,
                                borderColor: '#BBF7D0',
                            }}
                        >
                            <Text style={{ color: '#6B7280', fontSize: 14 }}>
                                मजदूर हो? <Text style={{ color: '#22C55E', fontWeight: '700' }}>पार्टनर बनो →</Text>
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
