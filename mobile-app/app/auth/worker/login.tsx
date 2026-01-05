/**
 * Worker Login Screen
 * For existing workers to log in
 */

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Enterprise Design System
import { Button } from '../../../components/design-system/Button';
import { Input } from '../../../components/design-system/Input';
import { Box } from '../../../components/primitives/Box';
import { Text } from '../../../components/primitives/Text';
import { authAPI } from '../../../api/client';
import { Alert } from 'react-native';

export default function WorkerLoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (phone.length < 10) return;

        Vibration.vibrate(50);
        setIsLoading(true);

        try {
            await authAPI.sendOTP(phone);
            setIsLoading(false);
            router.push({
                pathname: '/auth/worker/otp',
                params: { phone, isLogin: 'true' }
            });
        } catch (error: any) {
            setIsLoading(false);
            Alert.alert('Error', error.message || 'Failed to send OTP');
        }
    };

    return (
        <Box className="flex-1 bg-brand-primary">
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, paddingHorizontal: 24 }}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                        className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-white/10"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Header */}
                    <Box className="mt-8 mb-10 items-center">
                        <Text className="text-6xl mb-4">👷</Text>
                        <Text variant="h1" className="text-white mb-2 font-bold">वापस आओ</Text>
                        <Text variant="body" className="text-white/80">Welcome Back!</Text>
                    </Box>

                    {/* Form */}
                    <Box className="space-y-6">
                        <Box className="bg-surface-base rounded-lg p-md shadow-lg">
                            <Text variant="h3" className="mb-md text-text-primary font-bold">
                                📱 अपना मोबाइल नंबर डालें
                            </Text>

                            <Input
                                label="Mobile Number"
                                placeholder="मोबाइल नंबर"
                                value={phone}
                                onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                                keyboardType="numeric"
                                maxLength={10}
                                leftIcon={<Text variant="body" className="text-text-secondary mr-1">🇮🇳 +91</Text>}
                                containerClassName="mb-0 border-0"
                                accessibilityLabel="Mobile Number"
                            />
                        </Box>

                        <Button
                            label={isLoading ? '⏳ भेज रहे हैं...' : '📲 OTP भेजें'}
                            variant="solid"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                            isDisabled={phone.length < 10}
                            onPress={handleLogin}
                            accessibilityLabel="Send OTP"
                        />
                    </Box>

                    {/* Register Link */}
                    <TouchableOpacity
                        onPress={() => router.push('/auth/worker/signup')}
                        accessibilityRole="button"
                        accessibilityLabel="Register for new account"
                        className="mt-8 items-center padding-vertical-16"
                    >
                        <Text variant="body" className="text-white/60">
                            नए हो? <Text variant="body" className="text-white font-bold">रजिस्टर करें</Text>
                        </Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </SafeAreaView>
        </Box>
    );
}
