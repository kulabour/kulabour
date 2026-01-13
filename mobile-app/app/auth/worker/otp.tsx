/**
 * KULABOUR Worker Registration - OTP Verification
 * Step 2: Verify phone number via OTP
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authAPI, usersAPI } from '../../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationService } from '../../../services/NotificationService';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

export default function WorkerOTPScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const phone = params.phone as string || '9876543210';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all digits entered
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
            verifyOTP(newOtp.join(''));
        }

        Vibration.vibrate(30);
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };



    const verifyOTP = async (otpCode: string) => {
        setIsVerifying(true);
        Vibration.vibrate([0, 100, 100, 100]);

        try {
            const response: any = await authAPI.verifyOTP(phone, otpCode, 'worker');

            // Store session
            await AsyncStorage.setItem('authToken', response.access_token);
            if (response.user) {
                await AsyncStorage.setItem('user', JSON.stringify(response.user));

                // Sync FCM Token
                const token = notificationService.getToken();
                if (token) {
                    // Ensure we don't block the UI if this fails
                    usersAPI.updateFcmToken(response.user._id, token).catch(e => console.log('FCM Sync Failed', e));
                }
            }

            setIsVerifying(false);
            // Navigate to appropriate screen based on user status
            // For now, assuming new users go to details, existing to dashboard
            // But MVP flow:
            router.push('/auth/worker/details');
        } catch (error: any) {
            setIsVerifying(false);
            Alert.alert('Verification Failed', error.message || 'Invalid OTP');
            setOtp(['', '', '', '', '', '']);
        }
    };

    const resendOTP = () => {
        Vibration.vibrate(50);
        setTimer(30);
        setOtp(['', '', '', '', '', '']);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Header */}
            <LinearGradient
                colors={['#22C55E', '#16A34A']}
                style={{
                    paddingTop: 60,
                    paddingBottom: 40,
                    paddingHorizontal: 24,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ position: 'absolute', top: 50, left: 16, padding: 8 }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 48 }}>📲</Text>
                    <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 12 }}>
                        OTP डालें
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 4 }}>
                        +91 {phone} पर भेजा गया
                    </Text>
                </View>
            </LinearGradient>

            <View style={{ padding: 24 }}>
                {/* OTP Input */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 24,
                    }}
                >
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            style={{
                                width: (width - 80) / 6,
                                height: 70,
                                borderRadius: 16,
                                backgroundColor: digit ? '#22C55E' : '#fff',
                                borderWidth: 3,
                                borderColor: digit ? '#22C55E' : '#E5E7EB',
                                textAlign: 'center',
                                fontSize: 28,
                                fontWeight: '900',
                                color: digit ? '#fff' : '#111',
                            }}
                        />
                    ))}
                </View>

                {/* Timer */}
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    {timer > 0 ? (
                        <Text style={{ color: '#6B7280', fontSize: 16 }}>
                            🕒 {timer} सेकंड में दोबारा भेजें
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={resendOTP}>
                            <Text style={{ color: '#22C55E', fontSize: 18, fontWeight: '700' }}>
                                📲 OTP दोबारा भेजें
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Verify Button */}
                <TouchableOpacity
                    onPress={() => verifyOTP(otp.join(''))}
                    disabled={otp.some(d => !d) || isVerifying}
                    style={{
                        backgroundColor: otp.every(d => d) ? '#22C55E' : '#9CA3AF',
                        paddingVertical: 20,
                        borderRadius: 16,
                        alignItems: 'center',
                        marginBottom: 24,
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
                        {isVerifying ? '⏳ जाँच रहे हैं...' : '✅ वेरिफाई करें'}
                    </Text>
                </TouchableOpacity>

                {/* Help text */}
                <View
                    style={{
                        backgroundColor: '#FEF3C7',
                        padding: 16,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>💡</Text>
                    <Text style={{ flex: 1, color: '#92400E', fontSize: 14 }}>
                        OTP नहीं मिला? स्पैम फोल्डर चेक करें या नंबर verify करें
                    </Text>
                </View>
            </View>
        </View>
    );
}
