/**
 * KULABOUR - Visual Step Booking
 * Simple 3-step booking for uneducated users
 * 
 * Design:
 * 1. Step 1: Pick service (BIG icons)
 * 2. Step 2: Confirm location (Map + big button)
 * 3. Step 3: Confirm booking (Price + call button)
 * 
 * Each step is ONE action only
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Vibration,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { socket } from '../../api/client';

import { ConfirmButtons, StatusIndicator } from '../../components/BigActionButtons';

const { width } = Dimensions.get('window');

// Step indicator
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 20 }}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: index < currentStep ? '#22C55E' : index === currentStep ? '#0078D4' : '#E5E5E5',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {index < currentStep ? (
                            <Ionicons name="checkmark" size={28} color="#fff" />
                        ) : (
                            <Text style={{ color: index === currentStep ? '#fff' : '#666', fontSize: 20, fontWeight: '800' }}>
                                {index + 1}
                            </Text>
                        )}
                    </View>
                    {index < totalSteps - 1 && (
                        <View
                            style={{
                                width: 40,
                                height: 4,
                                backgroundColor: index < currentStep ? '#22C55E' : '#E5E5E5',
                            }}
                        />
                    )}
                </View>
            ))}
        </View>
    );
}

// Services data
const SERVICES = [
    { key: 'mason', emoji: '🧱', hindi: 'मिस्त्री', price: 600, color: '#FF6B35' },
    { key: 'electrician', emoji: '⚡', hindi: 'बिजली वाला', price: 200, color: '#FFD700' },
    { key: 'plumber', emoji: '🔧', hindi: 'नल वाला', price: 250, color: '#4169E1' },
    { key: 'carpenter', emoji: '🪚', hindi: 'बढ़ई', price: 300, color: '#8B4513' },
    { key: 'painter', emoji: '🎨', hindi: 'रंग वाला', price: 400, color: '#9B59B6' },
    { key: 'ac', emoji: '❄️', hindi: 'AC वाला', price: 499, color: '#00CED1' },
];

export default function VisualBooking() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [workerFound, setWorkerFound] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    // Socket Connection
    React.useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        // Listen for booking status updates
        if (bookingId) {
            const statusEvent = `booking_status_${bookingId}`;
            socket.on(statusEvent, (data: any) => {
                console.log('Booking Status Update:', data);
                if (data.status === 'accepted') {
                    Vibration.vibrate([0, 100, 50, 100]);
                    setIsSearching(false);
                    setWorkerFound(true);
                }
            });

            return () => {
                socket.off(statusEvent);
            };
        }
    }, [bookingId]);

    const handleServiceSelect = (service: typeof SERVICES[0]) => {
        Vibration.vibrate(100);
        setSelectedService(service);
        setStep(1);
    };

    const handleLocationConfirm = () => {
        Vibration.vibrate(100);
        setStep(2);
        setIsSearching(true);

        // Emit Booking Request
        if (selectedService) {
            const newBookingId = 'booking_' + Date.now();
            setBookingId(newBookingId);

            socket.emit('request_booking', {
                bookingId: newBookingId,
                service: selectedService.hindi,
                price: selectedService.price,
                emoji: selectedService.emoji,
                customerName: 'Anil Test User', // TODO: Get from profile
                address: 'Sector 15, Noida', // TODO: Real location
                timestamp: new Date().toISOString()
            });
        }

        // Fallback simulation removed - relying on real socket event!
    };

    const handleBookingConfirm = () => {
        Vibration.vibrate([0, 100, 50, 100, 50, 200]);
        if (bookingId) {
            router.push(`/(customer)/tracking/${bookingId}`);
        } else {
            // Fallback
            router.push('/(customer)/bookings');
        }
    };

    const handleBack = () => {
        Vibration.vibrate(50);
        if (step > 0) {
            setStep(step - 1);
            if (step === 1) setSelectedService(null);
            if (step === 2) setWorkerFound(false);
        } else {
            router.back();
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            {/* Header */}
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
                style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 }}
            >
                <TouchableOpacity
                    onPress={handleBack}
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 18, marginLeft: 8 }}>वापस</Text>
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900' }}>
                    बुकिंग करो
                </Text>
            </LinearGradient>

            {/* Step indicator */}
            <StepIndicator currentStep={step} totalSteps={3} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Step 0: Select Service */}
                {step === 0 && (
                    <View style={{ padding: 16 }}>
                        <Text style={{ color: '#333', fontSize: 24, fontWeight: '800', marginBottom: 20, textAlign: 'center' }}>
                            क्या चाहिए? 👇
                        </Text>

                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {SERVICES.map((service) => (
                                <TouchableOpacity
                                    key={service.key}
                                    onPress={() => handleServiceSelect(service)}
                                    style={{
                                        width: (width - 48) / 3,
                                        marginBottom: 20,
                                        alignItems: 'center',
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: 24,
                                            backgroundColor: service.color,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: service.color,
                                            shadowOffset: { width: 0, height: 4 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 8,
                                        }}
                                    >
                                        <Text style={{ fontSize: 48 }}>{service.emoji}</Text>
                                    </View>
                                    <Text style={{ color: '#333', fontSize: 16, fontWeight: '700', marginTop: 10, textAlign: 'center' }}>
                                        {service.hindi}
                                    </Text>
                                    <Text style={{ color: '#22C55E', fontSize: 14, fontWeight: '600' }}>
                                        ₹{service.price}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 1: Confirm Location */}
                {step === 1 && selectedService && (
                    <View style={{ padding: 16 }}>
                        <Text style={{ color: '#333', fontSize: 24, fontWeight: '800', marginBottom: 20, textAlign: 'center' }}>
                            कहाँ आना है? 📍
                        </Text>

                        {/* Selected service reminder */}
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 20,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: selectedService.color,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Text style={{ fontSize: 32 }}>{selectedService.emoji}</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#333', fontSize: 22, fontWeight: '800' }}>
                                    {selectedService.hindi}
                                </Text>
                                <Text style={{ color: '#22C55E', fontSize: 18, fontWeight: '600' }}>
                                    ₹{selectedService.price}
                                </Text>
                            </View>
                        </View>

                        {/* Map placeholder */}
                        <View
                            style={{
                                backgroundColor: '#E5E5E5',
                                height: 200,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <Text style={{ fontSize: 64 }}>🗺️</Text>
                            <Text style={{ color: '#666', fontSize: 18, marginTop: 12 }}>
                                आपकी जगह
                            </Text>
                        </View>

                        {/* Current location */}
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 20,
                                borderRadius: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <Text style={{ fontSize: 32, marginRight: 16 }}>📍</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#333', fontSize: 18, fontWeight: '700' }}>
                                    सेक्टर 15, नोएडा
                                </Text>
                                <Text style={{ color: '#666', fontSize: 14 }}>
                                    GPS से मिली जगह
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#F3F4F6',
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 12,
                                }}
                            >
                                <Text style={{ color: '#0078D4', fontWeight: '600' }}>बदलो</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Confirm button */}
                        <TouchableOpacity
                            onPress={handleLocationConfirm}
                            style={{
                                backgroundColor: '#22C55E',
                                paddingVertical: 24,
                                borderRadius: 20,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>
                                ✅ हाँ, यही जगह है
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 2: Worker Found / Booking Confirm */}
                {step === 2 && selectedService && (
                    <View style={{ padding: 16 }}>
                        {isSearching ? (
                            // Searching animation
                            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                <Text style={{ fontSize: 80 }}>🔍</Text>
                                <Text style={{ color: '#333', fontSize: 28, fontWeight: '800', marginTop: 20, textAlign: 'center' }}>
                                    ढूंढ रहे हैं...
                                </Text>
                                <Text style={{ color: '#666', fontSize: 18, marginTop: 8, textAlign: 'center' }}>
                                    पास में {selectedService.hindi} ढूंढ रहे हैं
                                </Text>
                            </View>
                        ) : workerFound ? (
                            // Worker found
                            <View>
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 64 }}>🎉</Text>
                                    <Text style={{ color: '#22C55E', fontSize: 28, fontWeight: '900', marginTop: 12 }}>
                                        मिल गया!
                                    </Text>
                                </View>

                                {/* Worker card */}
                                <View
                                    style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 24,
                                        padding: 20,
                                        marginBottom: 20,
                                        borderWidth: 3,
                                        borderColor: '#22C55E',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                        <View
                                            style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 40,
                                                backgroundColor: '#E8F5E9',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 16,
                                            }}
                                        >
                                            <Text style={{ fontSize: 48 }}>👷</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ color: '#333', fontSize: 24, fontWeight: '800' }}>
                                                रामेश कुमार
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                                <Text style={{ fontSize: 18, marginRight: 4 }}>⭐</Text>
                                                <Text style={{ color: '#F59E0B', fontSize: 18, fontWeight: '700' }}>4.8</Text>
                                                <Text style={{ color: '#666', fontSize: 14, marginLeft: 8 }}>
                                                    (234 काम)
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Text style={{ color: '#666', fontSize: 14 }}>दूरी</Text>
                                            <Text style={{ color: '#333', fontSize: 22, fontWeight: '800' }}>1.2 km</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Text style={{ color: '#666', fontSize: 14 }}>आएगा</Text>
                                            <Text style={{ color: '#333', fontSize: 22, fontWeight: '800' }}>10 min</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Text style={{ color: '#666', fontSize: 14 }}>कीमत</Text>
                                            <Text style={{ color: '#22C55E', fontSize: 22, fontWeight: '800' }}>₹{selectedService.price}</Text>
                                        </View>
                                    </View>

                                    <View
                                        style={{
                                            backgroundColor: '#E8F5E9',
                                            padding: 12,
                                            borderRadius: 12,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: 20, marginRight: 8 }}>✅</Text>
                                        <Text style={{ color: '#22C55E', fontSize: 16, fontWeight: '700' }}>
                                            सत्यापित कारीगर
                                        </Text>
                                    </View>
                                </View>

                                {/* Chat Button */}
                                <TouchableOpacity
                                    onPress={() => router.push(`/(customer)/chat/param_worker_id`)} // TODO: Use real worker ID from socket payload
                                    style={{
                                        backgroundColor: '#E3F2FD',
                                        paddingVertical: 16,
                                        borderRadius: 20,
                                        marginBottom: 16,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#0078D4',
                                    }}
                                >
                                    <Ionicons name="chatbubble" size={24} color="#0078D4" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#0078D4', fontSize: 18, fontWeight: '700' }}>
                                        बात करो (Chat)
                                    </Text>
                                </TouchableOpacity>

                                {/* Book button */}
                                <ConfirmButtons
                                    onYes={handleBookingConfirm}
                                    onNo={() => setStep(0)}
                                    yesLabel="बुक करो ✅"
                                    noLabel="दूसरा देखो"
                                />
                            </View>
                        ) : null}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
