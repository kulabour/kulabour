/**
 * KULABOUR - बेहतर और आसान होम पेज
 * Better & Easier Home Page
 * 
 * Design Principles:
 * 1. Very simple and clean UI
 * 2. Real worker photos that users can relate to
 * 3. Hindi-first with large readable text
 * 4. Big touch targets for easy tapping
 * 5. Clear visual hierarchy
 * 6. Minimal complexity - anyone can use it
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    Vibration,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import Hero3D from '../components/3d/Hero3D';
import { LiquidMetalCard } from '../components/LiquidMetalCard';
import Pressable3D from '../components/3d/Pressable3D';
import { KuliVoiceAssistant } from '../components/KuliVoiceAssistant';

const { width } = Dimensions.get('window');

// Real worker images from assets
const WORKER_IMAGES = {
    mason: require('../assets/workers/mason_worker_1765822213392.png'),
    electrician: require('../assets/workers/electrician_worker_1765822229980.png'),
    plumber: require('../assets/workers/plumber_worker_1765822248570.png'),
    carpenter: require('../assets/workers/carpenter_worker_1765822266722.png'),
    painter: require('../assets/workers/painter_worker_1765822284400.png'),
    ac: require('../assets/workers/ac_technician_1765822302471.png'),
    cleaner: require('../assets/workers/cleaner_worker_1765822320088.png'),
    jcb: require('../assets/workers/jcb_operator_1765822341872.png'),
};

// Main services with simple labels
const MAIN_SERVICES = [
    {
        key: 'mason',
        emoji: '🧱',
        hindi: 'मिस्त्री',
        english: 'Mason',
        price: 600,
        workers: 23,
        color: '#FF6B35',
        description: 'ईंट, सीमेंट का काम'
    },
    {
        key: 'electrician',
        emoji: '⚡',
        hindi: 'बिजली वाला',
        english: 'Electrician',
        price: 200,
        workers: 18,
        color: '#FFD700',
        description: 'बिजली, पंखा, स्विच'
    },
    {
        key: 'plumber',
        emoji: '🔧',
        hindi: 'नल वाला',
        english: 'Plumber',
        price: 250,
        workers: 15,
        color: '#4169E1',
        description: 'नल, पाइप, टंकी'
    },
    {
        key: 'carpenter',
        emoji: '🪚',
        hindi: 'बढ़ई',
        english: 'Carpenter',
        price: 300,
        workers: 12,
        color: '#8B4513',
        description: 'दरवाजा, अलमारी'
    },
    {
        key: 'painter',
        emoji: '🎨',
        hindi: 'रंग वाला',
        english: 'Painter',
        price: 400,
        workers: 9,
        color: '#9B59B6',
        description: 'पेंट, पुट्टी'
    },
    {
        key: 'ac',
        emoji: '❄️',
        hindi: 'AC वाला',
        english: 'AC Repair',
        price: 499,
        workers: 8,
        color: '#00CED1',
        description: 'AC सर्विस, गैस'
    },
    {
        key: 'cleaner',
        emoji: '🧹',
        hindi: 'सफाई वाला',
        english: 'Cleaner',
        price: 350,
        workers: 14,
        color: '#32CD32',
        description: 'घर की सफाई'
    },
    {
        key: 'jcb',
        emoji: '🚜',
        hindi: 'JCB वाला',
        english: 'JCB Operator',
        price: 1200,
        workers: 5,
        color: '#FFA500',
        description: 'खुदाई, तोड़-फोड़'
    },
];

// ServiceCard with real image
function ServiceCard({ service, onPress }: { service: typeof MAIN_SERVICES[0]; onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={() => {
                Vibration.vibrate(50);
                onPress();
            }}
            style={{
                width: width / 2 - 24,
                marginHorizontal: 8,
                marginBottom: 16,
                backgroundColor: '#fff',
                borderRadius: 20,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
            }}
            activeOpacity={0.85}
        >
            {/* Worker Image */}
            <View style={{ height: 120, position: 'relative' }}>
                <Image
                    source={WORKER_IMAGES[service.key as keyof typeof WORKER_IMAGES]}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                />

                {/* Gradient overlay for text readability */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 }}
                />

                {/* Emoji badge */}
                <View
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: service.color,
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: service.color,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                >
                    <Text style={{ fontSize: 24 }}>{service.emoji}</Text>
                </View>

                {/* Workers online badge */}
                <View
                    style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: 'rgba(34, 197, 94, 0.95)',
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#fff',
                            marginRight: 4,
                        }}
                    />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                        {service.workers} ऑनलाइन
                    </Text>
                </View>

                {/* Hindi name on image */}
                <Text
                    style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 12,
                        color: '#fff',
                        fontSize: 22,
                        fontWeight: '900',
                        textShadowColor: 'rgba(0,0,0,0.8)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3,
                    }}
                >
                    {service.hindi}
                </Text>
            </View>

            {/* Content section */}
            <View style={{ padding: 14 }}>
                {/* Description */}
                <Text style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>
                    {service.description}
                </Text>

                {/* Price and Book row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ color: '#999', fontSize: 11 }}>शुरू से</Text>
                        <Text style={{ color: '#22C55E', fontSize: 20, fontWeight: '900' }}>
                            ₹{service.price}
                        </Text>
                    </View>

                    <View
                        style={{
                            backgroundColor: '#0078D4',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                            बुक करो →
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function BetterHomePage() {
    const router = useRouter();
    const [greeting, setGreeting] = useState({ hindi: '', english: '' });
    const [isVoiceVisible, setVoiceVisible] = useState(false);

    const handleVoiceCommand = (command: string, service?: string) => {
        if (service) {
            // Close assistant after a delay and navigate
            setTimeout(() => {
                setVoiceVisible(false);
                router.push(`/booking/selection?service=${service}`);
            }, 2000);
        }
    };

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting({ hindi: 'सुप्रभात', english: 'Good Morning' });
        } else if (hour >= 12 && hour < 17) {
            setGreeting({ hindi: 'नमस्ते', english: 'Good Afternoon' });
        } else if (hour >= 17 && hour < 21) {
            setGreeting({ hindi: 'शुभ संध्या', english: 'Good Evening' });
        } else {
            setGreeting({ hindi: 'शुभ रात्रि', english: 'Good Night' });
        }
    }, []);

    const handleServicePress = (serviceKey: string) => {
        Vibration.vibrate(100);
        router.push(`/booking/selection?service=${serviceKey}`);
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
            <StatusBar barStyle="light-content" backgroundColor="#0078D4" />

            {/* Transparent Header with 3D Hero */}
            <View
                style={{
                    paddingTop: 10,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                    marginBottom: -20, // Negative margin to overlap with scroll view if needed
                }}
            >
                {/* 3D Hero Element */}
                <Hero3D />

                {/* Overlaid Greeting & Search */}
                <View style={{ position: 'absolute', top: 20, left: 20, right: 20, paddingTop: 40 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 }}>
                        {greeting.hindi} 👋
                    </Text>
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 32,
                            fontWeight: '900',
                            marginTop: 4,
                            textShadowColor: 'rgba(0,0,0,0.5)',
                            textShadowRadius: 8,
                            textShadowOffset: { width: 0, height: 2 }
                        }}
                    >
                        क्या चाहिए आज?
                    </Text>

                    {/* Glassmorphism Search Button */}
                    <TouchableOpacity
                        onPress={() => {
                            Vibration.vibrate(50);
                            setVoiceVisible(true);
                        }}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glass effect
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            paddingVertical: 16,
                            borderRadius: 30,
                            marginTop: 30,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.3)',
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#EF4444',
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                shadowColor: '#EF4444',
                                shadowOpacity: 0.5,
                                shadowRadius: 8,
                            }}
                        >
                            <Ionicons name="mic" size={26} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 2 }}>
                                🎤 बोलो क्या काम है?
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                                Speak what you need
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

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
                        <Ionicons name="people" size={28} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#22C55E', fontSize: 22, fontWeight: '900' }}>
                            127 मज़दूर ऑनलाइन 🟢
                        </Text>
                        <Text style={{ color: '#666', fontSize: 14 }}>
                            आपके पास में काम के लिए तैयार
                        </Text>
                    </View>
                </View>

                {/* Section title */}
                <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
                    <Text style={{ color: '#333', fontSize: 22, fontWeight: '800' }}>
                        सेवाएं चुनो 👇
                    </Text>
                    <Text style={{ color: '#888', fontSize: 13 }}>
                        Select the service you need
                    </Text>
                </View>

                {/* Services Grid */}
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        paddingHorizontal: 8,
                        marginTop: 8,
                    }}
                >
                    {MAIN_SERVICES.map((service, index) => (
                        <LiquidMetalCard
                            key={service.key}
                            hindi={service.hindi}
                            english={service.english}
                            price={service.price.toString()}
                            imageUri={Image.resolveAssetSource(WORKER_IMAGES[service.key as keyof typeof WORKER_IMAGES]).uri}
                            rating={4.8} // Mock rating
                            workersOnline={service.workers}
                            index={index}
                            href={`/booking/selection?service=${service.key}`}
                        />
                    ))}
                </View>

                {/* Quick action - Emergency booking */}
                <View style={{ margin: 16 }}>
                    <Pressable3D
                        onPress={() => {
                            Vibration.vibrate(100);
                            router.push('/booking/emergency');
                        }}
                        color="#B91C1C" // Darker red for depth
                    >
                        <View
                            style={{
                                backgroundColor: '#EF4444',
                                padding: 20,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Text style={{ fontSize: 32 }}>🚨</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>
                                    अभी बुक करो!
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15 }}>
                                    5 मिनट में मज़दूर मिलेगा 🚀
                                </Text>
                            </View>
                            <Ionicons name="arrow-forward-circle" size={36} color="#fff" />
                        </View>
                    </Pressable3D>
                </View>

                {/* My bookings */}
                <TouchableOpacity
                    onPress={() => {
                        Vibration.vibrate(50);
                        router.push('/(customer)/bookings');
                    }}
                    style={{
                        backgroundColor: '#fff',
                        marginHorizontal: 16,
                        marginBottom: 16,
                        padding: 20,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#E5E5E5',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#E8F4FD',
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16,
                        }}
                    >
                        <Text style={{ fontSize: 28 }}>📋</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#333', fontSize: 20, fontWeight: '800' }}>
                            मेरी बुकिंग
                        </Text>
                        <Text style={{ color: '#888', fontSize: 14 }}>
                            पिछले और चालू काम देखो
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={28} color="#0078D4" />
                </TouchableOpacity>

                {/* Help section */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        marginHorizontal: 16,
                        marginBottom: 16,
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
                        {[
                            { emoji: '📞', label: 'फ़ोन करो', color: '#22C55E' },
                            { emoji: '💬', label: 'चैट करो', color: '#0078D4' },
                            { emoji: '❓', label: 'FAQ', color: '#F59E0B' },
                        ].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => Vibration.vibrate(50)}
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        backgroundColor: item.color,
                                        width: 60,
                                        height: 60,
                                        borderRadius: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                                </View>
                                <Text style={{ color: '#666', fontSize: 14, fontWeight: '600' }}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* For workers CTA */}
                <Link href="/partner" asChild>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#1a1a2e',
                            marginHorizontal: 16,
                            marginBottom: 16,
                            padding: 24,
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 48, marginRight: 16 }}>👷</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
                                काम खोज रहे हो?
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
                                Partner बनो, पैसे कमाओ 💰
                            </Text>
                        </View>
                        <Ionicons name="arrow-forward" size={28} color="#fff" />
                    </TouchableOpacity>
                </Link>
            </ScrollView>

            <KuliVoiceAssistant
                isVisible={isVoiceVisible}
                onClose={() => setVoiceVisible(false)}
                onCommand={handleVoiceCommand}
            />
        </SafeAreaView>
    );
}
