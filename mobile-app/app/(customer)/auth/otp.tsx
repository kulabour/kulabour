import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/ui/Button';
import OTPInput from '../../../components/ui/OTPInput';
import { apiClient, OtpVerifyResponse } from '../../../services/api/client';
import '../../../global.css';

export default function OTP() {
    const router = useRouter();
    const { mobile } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVerify = async () => {
        if (otp.length < 4) return;

        setIsLoading(true);

        try {
            const response = await apiClient.post<OtpVerifyResponse>('/api/auth/verify-otp', {
                mobile,
                otp,
                userType: 'customer',
            });

            if (response.success && response.data) {
                // Save token
                await apiClient.setToken(response.data.accessToken);

                // Navigate to Home
                router.replace('/(customer)/index');
            } else {
                Alert.alert('Verification Failed', response.error?.message || 'Invalid OTP');
            }
        } catch {
            Alert.alert('Error', 'Could not verify OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const response = await apiClient.post<OtpVerifyResponse>('/api/auth/send-otp', { mobile });
            if (response.success) {
                setTimer(30);
                // Show OTP in development
                if (response.data?.debug?.otp) {
                    Alert.alert('OTP Sent', `Development OTP: ${response.data.debug.otp}`);
                }
            }
        } catch {
            Alert.alert('Error', 'Could not resend OTP');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-6"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View className="mt-8 mb-10">
                    <Text className="text-white text-3xl font-bold mb-2">Verification 🔐</Text>
                    <Text className="text-white/60 text-lg">
                        Enter the code sent to <Text className="text-white font-semibold">+91 {mobile}</Text>
                    </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-neon-blue mt-2">Edit Number</Text>
                    </TouchableOpacity>
                </View>

                <View className="space-y-8">
                    <OTPInput
                        length={4}
                        value={otp}
                        onChange={setOtp}
                        onComplete={() => { }}
                    />

                    <View className="items-center">
                        {timer > 0 ? (
                            <Text className="text-white/40">
                                Resend code in <Text className="text-neon-blue">{timer}s</Text>
                            </Text>
                        ) : (
                            <TouchableOpacity onPress={handleResend}>
                                <Text className="text-neon-blue font-semibold">Resend Code</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Button
                        variant="primary"
                        size="lg"
                        glow
                        fullWidth
                        loading={isLoading}
                        disabled={otp.length < 4}
                        onPress={handleVerify}
                    >
                        Verify & Continue
                    </Button>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
