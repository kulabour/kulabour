/**
 * KULABOUR - Simple Service Card
 * Designed for uneducated workers and customers in India
 * 
 * Design Principles:
 * 1. LARGE icons - Easy to recognize
 * 2. MINIMAL text - Only Hindi, simple words
 * 3. COLOR CODING - Green = available, Red = busy
 * 4. REAL photos - Relatable Indian workers
 * 5. BIG touch targets - Easy to tap
 * 6. PRICE prominent - Most important info
 */

import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Vibration,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

// Real worker images that resonate with Indian users
const WORKER_IMAGES = {
    mason: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
    electrician: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
    plumber: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    carpenter: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=400',
    painter: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
    ac: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
    cleaner: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    jcb: 'https://images.unsplash.com/photo-1580901369227-308f6f40bdeb?w=400',
};

// Simple Hindi labels
const SERVICE_LABELS = {
    mason: { hindi: 'मिस्त्री', icon: '🧱', color: '#FF6B35' },
    electrician: { hindi: 'बिजली वाला', icon: '⚡', color: '#FFD700' },
    plumber: { hindi: 'नल वाला', icon: '🔧', color: '#4169E1' },
    carpenter: { hindi: 'बढ़ई', icon: '🪚', color: '#8B4513' },
    painter: { hindi: 'रंग वाला', icon: '🎨', color: '#9B59B6' },
    ac: { hindi: 'AC वाला', icon: '❄️', color: '#00CED1' },
    cleaner: { hindi: 'सफाई वाला', icon: '🧹', color: '#32CD32' },
    jcb: { hindi: 'JCB वाला', icon: '🚜', color: '#FFA500' },
};

interface SimpleServiceCardProps {
    serviceType: keyof typeof SERVICE_LABELS;
    price: number;
    isAvailable: boolean;
    workersNearby: number;
    onPress: () => void;
}

export function SimpleServiceCard({
    serviceType,
    price,
    isAvailable,
    workersNearby,
    onPress,
}: SimpleServiceCardProps) {
    const service = SERVICE_LABELS[serviceType];
    const imageUrl = WORKER_IMAGES[serviceType];

    const handlePress = () => {
        // Strong haptic feedback for confirmation
        Vibration.vibrate(100);
        onPress();
    };

    // Card is full width for easy tapping
    const cardWidth = width - 32;

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={{ marginBottom: 16, marginHorizontal: 16 }}
        >
            <View
                style={{
                    width: cardWidth,
                    borderRadius: 20,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    // Large shadow for 3D feel
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                }}
            >
                {/* Image section with large worker photo */}
                <View style={{ height: 160, position: 'relative' }}>
                    <Image
                        source={{ uri: imageUrl }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />

                    {/* Gradient overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={{ position: 'absolute', inset: 0 }}
                    />

                    {/* Large emoji icon overlay - VERY visible */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: service.color,
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: service.color,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.5,
                            shadowRadius: 8,
                        }}
                    >
                        <Text style={{ fontSize: 32 }}>{service.icon}</Text>
                    </View>

                    {/* Availability indicator - GREEN = Ready */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            backgroundColor: isAvailable ? '#22C55E' : '#EF4444',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#fff',
                                marginRight: 8,
                            }}
                        />
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
                            {isAvailable ? 'तैयार' : 'व्यस्त'}
                        </Text>
                    </View>

                    {/* Hindi name - VERY LARGE */}
                    <Text
                        style={{
                            position: 'absolute',
                            bottom: 12,
                            left: 16,
                            color: '#fff',
                            fontSize: 36,
                            fontWeight: '900',
                            textShadowColor: 'rgba(0,0,0,0.8)',
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 4,
                        }}
                    >
                        {service.hindi}
                    </Text>
                </View>

                {/* Bottom section - PRICE prominent */}
                <View style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Price - BIGGEST element */}
                        <View>
                            <Text style={{ color: '#666', fontSize: 14 }}>कीमत</Text>
                            <Text style={{ color: '#111', fontSize: 32, fontWeight: '900' }}>
                                ₹{price}
                            </Text>
                        </View>

                        {/* Workers nearby with icon */}
                        <View style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    backgroundColor: '#E8F5E9',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 4,
                                }}
                            >
                                <Ionicons name="people" size={24} color="#22C55E" />
                            </View>
                            <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '700' }}>
                                {workersNearby} पास में
                            </Text>
                        </View>

                        {/* BIG book button */}
                        <TouchableOpacity
                            onPress={handlePress}
                            style={{
                                backgroundColor: '#0078D4',
                                paddingHorizontal: 24,
                                paddingVertical: 16,
                                borderRadius: 16,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>
                                बुक करो →
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

/**
 * Simple Icon Grid for quick service selection
 * Uses ONLY icons and Hindi - no English
 */
export function SimpleServiceGrid({ onSelect }: { onSelect: (service: string) => void }) {
    const services = Object.entries(SERVICE_LABELS);

    return (
        <View
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 8,
                justifyContent: 'space-between',
            }}
        >
            {services.map(([key, value]) => (
                <TouchableOpacity
                    key={key}
                    onPress={() => {
                        Vibration.vibrate(50);
                        onSelect(key);
                    }}
                    style={{
                        width: (width - 48) / 4,
                        aspectRatio: 1,
                        marginBottom: 16,
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: value.color + '20',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 8,
                            borderWidth: 3,
                            borderColor: value.color,
                        }}
                    >
                        <Text style={{ fontSize: 36 }}>{value.icon}</Text>
                    </View>
                    <Text
                        style={{
                            color: '#333',
                            fontSize: 14,
                            fontWeight: '700',
                            textAlign: 'center',
                        }}
                    >
                        {value.hindi}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
