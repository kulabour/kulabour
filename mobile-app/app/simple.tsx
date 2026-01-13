/**
 * KULABOUR - Simple Home Page
 * Designed for uneducated workers and customers in India
 * 
 * UX Principles Applied:
 * 1. Hindi-first with simple words
 * 2. BIG icons and touch targets
 * 3. Minimal text - images speak
 * 4. Color coding (Green = good, Red = warning)
 * 5. Clear visual hierarchy
 * 6. Strong haptic feedback
 * 7. Real worker photos
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Vibration,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SimpleServiceGrid } from '../components/SimpleServiceCard';
import { BigActionButton, CircleIconButton, StatusIndicator } from '../components/BigActionButtons';

const { width } = Dimensions.get('window');

// Simple service data
const SERVICES = [
    { key: 'mason', emoji: '🧱', hindi: 'मिस्त्री', price: 600, workers: 23, color: '#FF6B35' },
    { key: 'electrician', emoji: '⚡', hindi: 'बिजली वाला', price: 200, workers: 18, color: '#FFD700' },
    { key: 'plumber', emoji: '🔧', hindi: 'नल वाला', price: 250, workers: 15, color: '#4169E1' },
    { key: 'carpenter', emoji: '🪚', hindi: 'बढ़ई', price: 300, workers: 12, color: '#8B4513' },
    { key: 'painter', emoji: '🎨', hindi: 'रंग वाला', price: 400, workers: 9, color: '#9B59B6' },
    { key: 'ac', emoji: '❄️', hindi: 'AC वाला', price: 499, workers: 8, color: '#00CED1' },
    { key: 'cleaner', emoji: '🧹', hindi: 'सफाई वाला', price: 350, workers: 14, color: '#32CD32' },
    { key: 'jcb', emoji: '🚜', hindi: 'JCB वाला', price: 1200, workers: 5, color: '#FFA500' },
];

export default function SimpleHomePage() {
    const router = useRouter();
    const [greeting, setGreeting] = useState(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'सुप्रभात';
        if (hour >= 12 && hour < 17) return 'नमस्ते';
        if (hour >= 17 && hour < 21) return 'शुभ संध्या';
        return 'शुभ रात्रि';
    });

    const handleServicePress = (serviceKey: string) => {
        Vibration.vibrate(100);
        router.push(`/booking/selection?service=${serviceKey}`);
    };

    const handleVoicePress = () => {
        Vibration.vibrate(100);
        // Open voice assistant
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <StatusBar barStyle="light-content" />

            {/* Header - Simple and clean */}
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
                style={{
                    paddingTop: 60,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                }}
            >
                {/* Greeting - BIG and friendly */}
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18 }}>
                    {greeting} 👋
                </Text>
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 36,
                        fontWeight: '900',
                        marginTop: 4,
                    }}
                >
                    क्या चाहिए?
                </Text>

                {/* Voice button - Very prominent */}
                <TouchableOpacity
                    onPress={handleVoicePress}
                    style={{
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderRadius: 30,
                        marginTop: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#0078D4',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16,
                        }}
                    >
                        <Ionicons name="mic" size={28} color="#fff" />
                    </View>
                    <Text style={{ color: '#666', fontSize: 20 }}>
                        बोलो... क्या काम है?
                    </Text>
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Live workers indicator */}
                <View
                    style={{
                        backgroundColor: '#E8F5E9',
                        margin: 16,
                        padding: 16,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#22C55E',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#22C55E',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16,
                        }}
                    >
                        <Text style={{ fontSize: 28 }}>🟢</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#22C55E', fontSize: 24, fontWeight: '900' }}>
                            127 मज़दूर ऑनलाइन
                        </Text>
                        <Text style={{ color: '#666', fontSize: 16 }}>
                            आपके पास में तैयार हैं
                        </Text>
                    </View>
                </View>

                {/* Service Grid - BIG icons */}
                <Text
                    style={{
                        color: '#333',
                        fontSize: 24,
                        fontWeight: '800',
                        marginHorizontal: 16,
                        marginBottom: 12,
                    }}
                >
                    सेवाएं चुनो 👇
                </Text>

                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingHorizontal: 8,
                    }}
                >
                    {SERVICES.map((service) => (
                        <TouchableOpacity
                            key={service.key}
                            onPress={() => handleServicePress(service.key)}
                            style={{
                                width: (width - 48) / 4,
                                marginHorizontal: 4,
                                marginBottom: 20,
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 20,
                                    backgroundColor: service.color,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    shadowColor: service.color,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 8,
                                    elevation: 6,
                                }}
                            >
                                <Text style={{ fontSize: 40 }}>{service.emoji}</Text>
                            </View>
                            <Text
                                style={{
                                    color: '#333',
                                    fontSize: 14,
                                    fontWeight: '700',
                                    marginTop: 8,
                                    textAlign: 'center',
                                }}
                            >
                                {service.hindi}
                            </Text>
                            <Text
                                style={{
                                    color: '#22C55E',
                                    fontSize: 12,
                                    fontWeight: '600',
                                }}
                            >
                                ₹{service.price}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick actions */}
                <Text
                    style={{
                        color: '#333',
                        fontSize: 24,
                        fontWeight: '800',
                        marginHorizontal: 16,
                        marginTop: 16,
                        marginBottom: 12,
                    }}
                >
                    जल्दी करो ⚡
                </Text>

                {/* Emergency booking */}
                <BigActionButton
                    icon="flash"
                    emoji="🚨"
                    hindiLabel="अभी बुक करो"
                    hindiSublabel="5 मिनट में मिलेगा"
                    color="#EF4444"
                    onPress={() => router.push('/booking/emergency')}
                />

                {/* My bookings */}
                <BigActionButton
                    icon="list"
                    emoji="📋"
                    hindiLabel="मेरी बुकिंग"
                    hindiSublabel="पिछले काम देखो"
                    color="#0078D4"
                    onPress={() => router.push('/(customer)/bookings')}
                />

                {/* Help section */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        margin: 16,
                        padding: 20,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: '#E5E5E5',
                    }}
                >
                    <Text style={{ color: '#333', fontSize: 20, fontWeight: '800', marginBottom: 16 }}>
                        मदद चाहिए? 🤔
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <CircleIconButton
                            emoji="📞"
                            label="फ़ोन करो"
                            color="#22C55E"
                            onPress={() => { }}
                        />
                        <CircleIconButton
                            emoji="💬"
                            label="चैट करो"
                            color="#0078D4"
                            onPress={() => { }}
                        />
                        <CircleIconButton
                            emoji="❓"
                            label="सवाल"
                            color="#F59E0B"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* For workers */}
                <TouchableOpacity
                    onPress={() => router.push('/(worker)/home')}
                    style={{
                        backgroundColor: '#1a1a2e',
                        margin: 16,
                        padding: 24,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 48, marginRight: 16 }}>👷</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>
                            काम करना है?
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
                            मज़दूर बनो, पैसे कमाओ
                        </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={28} color="#fff" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
