/**
 * Customer Registration Complete
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function CustomerCompleteScreen() {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();

        Vibration.vibrate([0, 100, 100, 200, 100, 300]);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 24,
                }}
            >
                <Animated.View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 28,
                        padding: 32,
                        alignItems: 'center',
                        width: '100%',
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: '#E0F2FE',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 24,
                        }}
                    >
                        <Text style={{ fontSize: 56 }}>🎉</Text>
                    </View>

                    <Text style={{ color: '#111', fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 8 }}>
                        स्वागत है! 🎊
                    </Text>

                    <Text style={{ color: '#0078D4', fontSize: 16, fontWeight: '700', marginBottom: 16 }}>
                        Welcome to KULABOUR!
                    </Text>

                    <Text style={{ color: '#6B7280', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>
                        अब आप मजदूर बुक कर सकते हैं{'\n'}
                        तुरंत सर्विस पाएं!
                    </Text>

                    <View
                        style={{
                            backgroundColor: '#F3F4F6',
                            borderRadius: 14,
                            padding: 18,
                            width: '100%',
                            marginBottom: 24,
                        }}
                    >
                        <Text style={{ color: '#333', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
                            🏠 अभी उपलब्ध सर्विसेज:
                        </Text>
                        {['⚡ बिजली वाला', '🔧 नल वाला', '🧱 मिस्त्री', '🎨 रंग वाला', '🪚 बढ़ई'].map((s, i) => (
                            <Text key={i} style={{ color: '#6B7280', fontSize: 13, marginBottom: 4 }}>{s}</Text>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={() => router.replace('/')}
                        style={{
                            backgroundColor: '#0078D4',
                            paddingVertical: 18,
                            borderRadius: 16,
                            width: '100%',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>
                            🏠 मजदूर बुक करें
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </LinearGradient>
        </View>
    );
}
