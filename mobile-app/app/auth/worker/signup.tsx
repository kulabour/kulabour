/**
 * KULABOUR Worker Registration - Main Signup Screen
 * Entry point for new worker registration
 * 
 * Steps:
 * 1. Language Selection
 * 2. Phone + OTP
 * 3. Basic Details
 * 4. Document Verification (Aadhar, Labour Card, eShram, Bank)
 * 5. Terms & Policies
 * 6. Skills Selection
 * 7. Profile Complete
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Vibration,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authAPI } from '../../../api/client';

const { width } = Dimensions.get('window');

export default function WorkerSignupScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (phone.length < 10) return;

        Vibration.vibrate(50);
        setIsLoading(true);

        try {
            await authAPI.sendOTP(phone);
            setIsLoading(false);
            router.push({
                pathname: '/auth/worker/otp',
                params: { phone }
            });
        } catch (error) {
            setIsLoading(false);
            // alert('Failed to send OTP'); // Optional: show error
            console.error(error);
            // Verify navigation still works for demo if api fails? 
            // Ideally we should block. But for robust demo, maybe fallback?
            // No, let's trust the backend.
        }
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
                {/* Back button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        position: 'absolute',
                        top: 50,
                        left: 16,
                        padding: 8,
                    }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 56 }}>👷</Text>
                    <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 12 }}>
                        कुली बनो
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, marginTop: 4 }}>
                        Become a KULABOUR Partner
                    </Text>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ padding: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Language Selection */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ color: '#333', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
                            🌐 भाषा चुनें (Select Language)
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {[
                                { code: 'hi', name: 'हिंदी', selected: true },
                                { code: 'en', name: 'English', selected: false },
                                { code: 'mr', name: 'मराठी', selected: false },
                                { code: 'ta', name: 'தமிழ்', selected: false },
                                { code: 'te', name: 'తెలుగు', selected: false },
                                { code: 'bn', name: 'বাংলা', selected: false },
                            ].map((lang, index) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    onPress={() => Vibration.vibrate(30)}
                                    style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 12,
                                        borderRadius: 12,
                                        margin: 4,
                                        backgroundColor: lang.selected ? '#22C55E' : '#fff',
                                        borderWidth: 2,
                                        borderColor: lang.selected ? '#22C55E' : '#E5E7EB',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: '600',
                                            color: lang.selected ? '#fff' : '#333',
                                        }}
                                    >
                                        {lang.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Phone Number Input */}
                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ color: '#333', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
                            📱 मोबाइल नंबर (Mobile Number)
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 16,
                                padding: 4,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: phone.length === 10 ? '#22C55E' : '#E5E7EB',
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
                                placeholder="मोबाइल नंबर डालें"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                maxLength={10}
                                style={{
                                    flex: 1,
                                    fontSize: 24,
                                    fontWeight: '700',
                                    color: '#111',
                                    paddingVertical: 12,
                                    letterSpacing: 2,
                                }}
                            />
                            {phone.length === 10 && (
                                <View
                                    style={{
                                        backgroundColor: '#22C55E',
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 8,
                                    }}
                                >
                                    <Ionicons name="checkmark" size={24} color="#fff" />
                                </View>
                            )}
                        </View>
                        <Text style={{ color: '#6B7280', fontSize: 13, marginTop: 8 }}>
                            इस नंबर पर OTP आएगा
                        </Text>
                    </View>

                    {/* Benefits */}
                    <View
                        style={{
                            backgroundColor: '#F0FDF4',
                            borderRadius: 16,
                            padding: 20,
                            marginBottom: 24,
                            borderWidth: 2,
                            borderColor: '#22C55E20',
                        }}
                    >
                        <Text style={{ color: '#166534', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>
                            🎁 KULABOUR Partner के फायदे:
                        </Text>
                        {[
                            '💰 रोज़ाना कमाई + बोनस',
                            '🏦 सीधे बैंक में पैसे',
                            '📅 अपनी मर्जी से काम करो',
                            '🛡️ ₹5 लाख का दुर्घटना बीमा',
                            '📞 24/7 सपोर्ट',
                        ].map((benefit, index) => (
                            <View
                                key={index}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}
                            >
                                <Text style={{ color: '#166534', fontSize: 15 }}>
                                    {benefit}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Get OTP Button */}
                    <TouchableOpacity
                        onPress={handleSendOTP}
                        disabled={phone.length < 10 || isLoading}
                        style={{
                            backgroundColor: phone.length === 10 ? '#22C55E' : '#9CA3AF',
                            paddingVertical: 20,
                            borderRadius: 16,
                            alignItems: 'center',
                            marginBottom: 24,
                            opacity: isLoading ? 0.7 : 1,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
                            {isLoading ? '⏳ भेज रहे हैं...' : '📲 OTP भेजें'}
                        </Text>
                    </TouchableOpacity>

                    {/* Already registered */}
                    <TouchableOpacity
                        onPress={() => router.push('/auth/worker/login')}
                        style={{ alignItems: 'center', paddingVertical: 16 }}
                    >
                        <Text style={{ color: '#6B7280', fontSize: 15 }}>
                            पहले से अकाउंट है? <Text style={{ color: '#22C55E', fontWeight: '700' }}>लॉगिन करें</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Customer signup link */}
                    <TouchableOpacity
                        onPress={() => router.push('/auth/customer/signup')}
                        style={{
                            alignItems: 'center',
                            paddingVertical: 16,
                            backgroundColor: '#F3F4F6',
                            borderRadius: 12,
                            marginTop: 8,
                        }}
                    >
                        <Text style={{ color: '#6B7280', fontSize: 14 }}>
                            मजदूर नहीं हो? <Text style={{ color: '#0078D4', fontWeight: '700' }}>ग्राहक बनो →</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
