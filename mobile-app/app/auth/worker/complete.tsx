/**
 * KULABOUR Worker Registration - Complete
 * Success screen after registration
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Animated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WorkerCompleteScreen() {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const confettiAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Entry animation
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(confettiAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        // Success vibration
        Vibration.vibrate([0, 100, 100, 200, 100, 100, 100, 300]);
    }, []);

    const goToPartnerApp = () => {
        Vibration.vibrate([0, 50, 50, 100]);
        router.replace('/partner');
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={['#22C55E', '#16A34A', '#15803D']}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                }}
            >
                {/* Success Card */}
                <Animated.View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 28,
                        padding: 32,
                        alignItems: 'center',
                        width: '100%',
                        transform: [{ scale: scaleAnim }],
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.2,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    {/* Celebration emoji */}
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: '#DCFCE7',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <Text style={{ fontSize: 56 }}>🎉</Text>
                    </View>

                    <Text style={{ color: '#111', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>
                        बधाई हो! 🎊
                    </Text>

                    <Text style={{ color: '#22C55E', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
                        Congratulations!
                    </Text>

                    <Text style={{ color: '#6B7280', fontSize: 16, textAlign: 'center', marginBottom: 24, lineHeight: 24 }}>
                        आप KULABOUR Partner बन गए!{'\n'}
                        अब काम शुरू करें और पैसे कमाएं!
                    </Text>

                    {/* Stats */}
                    <View
                        style={{
                            backgroundColor: '#F3F4F6',
                            borderRadius: 16,
                            padding: 20,
                            width: '100%',
                            marginBottom: 24,
                        }}
                    >
                        <Text style={{ color: '#333', fontSize: 14, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
                            📋 आपका प्रोफाइल:
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ color: '#6B7280', fontSize: 14 }}>वेरिफिकेशन</Text>
                            <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '700' }}>✅ पूरा</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ color: '#6B7280', fontSize: 14 }}>डॉक्यूमेंट्स</Text>
                            <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '700' }}>✅ Verified</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ color: '#6B7280', fontSize: 14 }}>बैंक अकाउंट</Text>
                            <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '700' }}>✅ Linked</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#6B7280', fontSize: 14 }}>बीमा</Text>
                            <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '700' }}>₹5 Lakh Active</Text>
                        </View>
                    </View>

                    {/* What's next */}
                    <View
                        style={{
                            backgroundColor: '#FEF3C7',
                            borderRadius: 12,
                            padding: 16,
                            width: '100%',
                            marginBottom: 24,
                        }}
                    >
                        <Text style={{ color: '#92400E', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                            💡 अब क्या करें?
                        </Text>
                        <Text style={{ color: '#B45309', fontSize: 13, lineHeight: 22 }}>
                            1. ऐप में ऑनलाइन हों{'\n'}
                            2. काम आने पर तुरंत स्वीकार करें{'\n'}
                            3. ग्राहक के पास जाकर काम करें{'\n'}
                            4. हर हफ्ते अपनी कमाई पाएं!
                        </Text>
                    </View>

                    {/* Go to Partner App */}
                    <TouchableOpacity
                        onPress={goToPartnerApp}
                        style={{
                            backgroundColor: '#22C55E',
                            paddingVertical: 18,
                            paddingHorizontal: 32,
                            borderRadius: 16,
                            width: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                            🚀 काम शुरू करें
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Footer */}
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 24, textAlign: 'center' }}>
                    KULABOUR Partner - आपका भरोसेमंद साथी
                </Text>
            </LinearGradient>
        </View>
    );
}
