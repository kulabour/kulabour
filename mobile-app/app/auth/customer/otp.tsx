/**
 * Customer OTP Verification
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
import { apiClient as api } from '../../../services/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get('window');

export default function CustomerOTPScreen() {
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

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

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

    const name = params.name as string || '';

    // ... inside component ...

    const verifyOTP = async (otpCode: string) => {
        setIsVerifying(true);
        Vibration.vibrate([0, 100, 100, 100]);

        try {
            // Using centralized authAPI which handles 'mobile' parameter correctly
            const response: any = await api.post('/auth/verify-otp', {
                mobile: phone,
                otp: otpCode,
                role: 'customer',
                name: name
            });

            if (response.access_token) {
                await AsyncStorage.setItem('authToken', response.access_token);
                if (response.user) {
                    await AsyncStorage.setItem('user', JSON.stringify(response.user));
                }

                router.push('/auth/customer/policies');
            } else {
                alert(response.message || 'OTP Verification Failed');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
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
                    <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 12 }}>
                        OTP डालें
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                        +91 {phone} पर भेजा गया
                    </Text>
                </View>
            </LinearGradient>

            <View style={{ padding: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
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
                                height: 65,
                                borderRadius: 14,
                                backgroundColor: digit ? '#0078D4' : '#fff',
                                borderWidth: 3,
                                borderColor: digit ? '#0078D4' : '#E5E7EB',
                                textAlign: 'center',
                                fontSize: 26,
                                fontWeight: '900',
                                color: digit ? '#fff' : '#111',
                            }}
                        />
                    ))}
                </View>

                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    {timer > 0 ? (
                        <Text style={{ color: '#6B7280', fontSize: 15 }}>
                            🕒 {timer} सेकंड में दोबारा भेजें
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={() => setTimer(30)}>
                            <Text style={{ color: '#0078D4', fontSize: 16, fontWeight: '700' }}>
                                📲 OTP दोबारा भेजें
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    onPress={() => verifyOTP(otp.join(''))}
                    disabled={otp.some(d => !d) || isVerifying}
                    style={{
                        backgroundColor: otp.every(d => d) ? '#0078D4' : '#9CA3AF',
                        paddingVertical: 18,
                        borderRadius: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                        {isVerifying ? '⏳ जाँच रहे हैं...' : '✅ वेरिफाई करें'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
