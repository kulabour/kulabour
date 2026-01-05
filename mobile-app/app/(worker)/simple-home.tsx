/**
 * KULABOUR - Simple Worker Home
 * Designed for uneducated workers in India
 * 
 * Focuses on:
 * 1. ONE main action - Accept jobs
 * 2. BIG buttons for easy tap
 * 3. Clear status indicators with emojis
 * 4. Voice-first interaction
 * 5. Earnings shown prominently
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Vibration,
    Switch,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { BigActionButton, StatusIndicator, ConfirmButtons } from '../../components/BigActionButtons';
import { ParallaxView } from '../../engine/GyroscopeParallax';
import { KuliVoiceAssistant } from '../../components/KuliVoiceAssistant';
import { AnimatedStatCard, AnimatedLineChart } from '../../components/AnimatedChart';
import { useRouter } from 'expo-router';


const { width } = Dimensions.get('window');

import { socket } from '../../api/client';

export default function WorkerSimpleHome() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);
    const [hasNewJob, setHasNewJob] = useState(false); // Default to false
    const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
    const [isJobActive, setIsJobActive] = useState(false);
    const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

    // Socket Listener
    React.useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('new_booking_request', (data: any) => {
            console.log('🔔 New Job Received:', data);
            Vibration.vibrate([0, 500, 200, 500]);
            setNewJob({
                bookingId: data.bookingId,
                service: data.service,
                emoji: data.emoji,
                customerName: data.customerName,
                address: data.address,
                distance: '2.5 km', // Mock distance
                price: data.price
            });
            setHasNewJob(true);
        });

        return () => {
            socket.off('new_booking_request');
        };
    }, []);

    // Job data state
    const [newJob, setNewJob] = useState({
        bookingId: '',
        service: 'बिजली का काम',
        emoji: '⚡',
        customerName: 'राजेश भाई',
        address: 'सेक्टर 15, नोएडा',
        distance: '2 km',
        price: 300,
    });

    const todayEarnings = 1200;
    const totalJobs = 4;

    // Location Simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isJobActive && activeBookingId) {
            console.log('Starting loc simulation for', activeBookingId);
            let lat = 28.57;
            let lng = 77.32;

            interval = setInterval(() => {
                lat += 0.0001; // Move slightly
                lng += 0.0001;

                socket.emit('update_location', {
                    bookingId: activeBookingId,
                    latitude: lat,
                    longitude: lng
                });
                console.log('Emitted loc:', lat, lng);
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isJobActive, activeBookingId]);

    const handleAcceptJob = () => {
        Vibration.vibrate([0, 100, 50, 100]);
        if (newJob.bookingId) {
            socket.emit('accept_booking', {
                bookingId: newJob.bookingId,
                workerId: 'worker_123'
            });
            setActiveBookingId(newJob.bookingId);
            setIsJobActive(true);
        }
        setHasNewJob(false);
    };

    const handleRejectJob = () => {
        Vibration.vibrate(50);
        setHasNewJob(false);
    };

    const toggleOnline = () => {
        Vibration.vibrate(100);
        setIsOnline(!isOnline);
    };

    const handleCommand = (command: string, service?: string) => {
        console.log('Worker Voice Command:', command, service);
        if (command === 'online') {
            setIsOnline(true);
        } else if (command === 'offline') {
            setIsOnline(false);
        } else if (command === 'earnings') {
            router.push('/(worker)/wallet');
            setIsVoiceAssistantOpen(false);
        } else if (command === 'read_job' && hasNewJob) {
            // In a real app, TTS would read the job details here
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            {isJobActive && (
                <View style={{ position: 'absolute', top: 100, left: 20, right: 20, zIndex: 999, backgroundColor: '#22C55E', padding: 20, borderRadius: 10 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>✅ Job Active - Sharing Location</Text>
                    <Text style={{ color: 'white', marginBottom: 20 }}>Customer is tracking you...</Text>

                    <TouchableOpacity
                        onPress={() => {
                            Vibration.vibrate(100);
                            socket.emit('complete_job', { bookingId: activeBookingId });
                            setIsJobActive(false);
                            setActiveBookingId(null);
                        }}
                        style={{ backgroundColor: 'white', padding: 15, borderRadius: 8, alignItems: 'center' }}
                    >
                        <Text style={{ color: '#22C55E', fontWeight: 'bold', fontSize: 16 }}>Complete Job (काम पूरा हुआ)</Text>
                    </TouchableOpacity>
                </View>
            )}

            <KuliVoiceAssistant
                isVisible={isVoiceAssistantOpen}
                onClose={() => setIsVoiceAssistantOpen(false)}
                onCommand={handleCommand}
                mode="worker"
            />

            <StatusBar barStyle="light-content" />

            {/* Header with earnings */}
            <LinearGradient
                colors={isOnline ? ['#22C55E', '#16A34A'] : ['#6B7280', '#4B5563']}
                style={{
                    paddingTop: 60,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                }}
            >
                {/* Online/Offline toggle - VERY BIG */}
                <TouchableOpacity
                    onPress={toggleOnline}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        padding: 16,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32, marginRight: 12 }}>
                            {isOnline ? '🟢' : '🔴'}
                        </Text>
                        <View>
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>
                                {isOnline ? 'ऑनलाइन' : 'ऑफलाइन'}
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                                {isOnline ? 'काम मिल रहा है' : 'काम बंद है'}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width: 70,
                            height: 40,
                            borderRadius: 20,
                            justifyContent: 'center',
                            padding: 4,
                        }}
                    >
                        <View
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isOnline ? '#22C55E' : '#EF4444',
                                alignSelf: isOnline ? 'flex-end' : 'flex-start',
                            }}
                        />
                    </View>
                </TouchableOpacity>

                {/* Today's earnings - MOST IMPORTANT */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push('/(worker)/wallet')}
                    style={{ marginBottom: 20 }}
                >
                    <AnimatedStatCard
                        label="आज की कमाई 💰"
                        value={todayEarnings}
                        trend={{ value: 12, positive: true }}
                    />

                    {/* Mini Chart Preview */}
                    <View className="mt-4" style={{ height: 60, opacity: 0.8 }}>
                        <AnimatedLineChart
                            height={60}
                            showLabels={false}
                            data={[
                                { label: 'M', value: 400 },
                                { label: 'T', value: 300 },
                                { label: 'W', value: 600 },
                                { label: 'T', value: 450 },
                                { label: 'F', value: 800 },
                                { label: 'S', value: 1200 },
                            ]}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'flex-end' }}>
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 12,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>
                                ✅ {totalJobs} काम पूरे
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </LinearGradient>

            {/* Voice Assistant Trigger */}
            <TouchableOpacity
                onPress={() => {
                    Vibration.vibrate(50);
                    setIsVoiceAssistantOpen(true);
                }}
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: '#00D4FF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 100,
                    shadowColor: '#00D4FF',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                }}
            >
                <Ionicons name="mic" size={32} color="#fff" />
                {/* Pulse ring */}
                <View style={{
                    position: 'absolute',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: 'rgba(0, 212, 255, 0.3)',
                }} />
            </TouchableOpacity>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* New Job Alert - VERY PROMINENT */}
                {hasNewJob && isOnline && (
                    <View
                        style={{
                            backgroundColor: '#fff',
                            margin: 16,
                            borderRadius: 24,
                            overflow: 'hidden',
                            borderWidth: 3,
                            borderColor: '#22C55E',
                            shadowColor: '#22C55E',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                        }}
                    >
                        <ParallaxView depth={10}>

                            {/* Pulsing header */}
                            <LinearGradient
                                colors={['#22C55E', '#16A34A']}
                                style={{
                                    padding: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 36, marginRight: 12 }}>🔔</Text>
                                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900' }}>
                                    नया काम आया!
                                </Text>
                            </LinearGradient>

                            {/* Job details - Simple and clear */}
                            <View style={{ padding: 20 }}>
                                {/* Service type with big emoji */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    <View
                                        style={{
                                            width: 70,
                                            height: 70,
                                            borderRadius: 35,
                                            backgroundColor: '#FEF3C7',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 16,
                                        }}
                                    >
                                        <Text style={{ fontSize: 40 }}>{newJob.emoji}</Text>
                                    </View>
                                    <View>
                                        <Text style={{ color: '#333', fontSize: 24, fontWeight: '800' }}>
                                            {newJob.service}
                                        </Text>
                                        <Text style={{ color: '#666', fontSize: 16 }}>
                                            {newJob.customerName}
                                        </Text>
                                    </View>
                                </View>

                                {/* Location */}
                                <View
                                    style={{
                                        backgroundColor: '#F3F4F6',
                                        padding: 16,
                                        borderRadius: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 16,
                                    }}
                                >
                                    <Text style={{ fontSize: 28, marginRight: 12 }}>📍</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: '#333', fontSize: 18, fontWeight: '600' }}>
                                            {newJob.address}
                                        </Text>
                                        <Text style={{ color: '#22C55E', fontSize: 16, fontWeight: '700' }}>
                                            {newJob.distance} दूर
                                        </Text>
                                    </View>
                                </View>

                                {/* Price - BIG AND CLEAR */}
                                <View
                                    style={{
                                        backgroundColor: '#DCFCE7',
                                        padding: 20,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text style={{ color: '#666', fontSize: 16 }}>मिलेंगे</Text>
                                    <Text
                                        style={{
                                            color: '#22C55E',
                                            fontSize: 48,
                                            fontWeight: '900',
                                        }}
                                    >
                                        ₹{newJob.price}
                                    </Text>
                                </View>

                                {/* Accept/Reject buttons - HUGE */}
                                <ConfirmButtons
                                    onYes={handleAcceptJob}
                                    onNo={handleRejectJob}
                                    yesLabel="लूँगा ✅"
                                    noLabel="नहीं ❌"
                                />
                            </View>
                        </ParallaxView>
                    </View>
                )}

                {/* No new jobs message */}
                {!hasNewJob && isOnline && (
                    <View
                        style={{
                            backgroundColor: '#fff',
                            margin: 16,
                            padding: 40,
                            borderRadius: 24,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 64 }}>⏳</Text>
                        <Text
                            style={{
                                color: '#333',
                                fontSize: 24,
                                fontWeight: '800',
                                marginTop: 16,
                                textAlign: 'center',
                            }}
                        >
                            नया काम ढूंढ रहे हैं...
                        </Text>
                        <Text
                            style={{
                                color: '#666',
                                fontSize: 16,
                                marginTop: 8,
                                textAlign: 'center',
                            }}
                        >
                            जल्दी ही काम मिलेगा
                        </Text>
                    </View>
                )}

                {/* Offline message */}
                {!isOnline && (
                    <View
                        style={{
                            backgroundColor: '#fff',
                            margin: 16,
                            padding: 40,
                            borderRadius: 24,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 64 }}>😴</Text>
                        <Text
                            style={{
                                color: '#333',
                                fontSize: 24,
                                fontWeight: '800',
                                marginTop: 16,
                                textAlign: 'center',
                            }}
                        >
                            आप ऑफलाइन हैं
                        </Text>
                        <Text
                            style={{
                                color: '#666',
                                fontSize: 16,
                                marginTop: 8,
                                textAlign: 'center',
                            }}
                        >
                            ऑनलाइन होने के लिए ऊपर टैप करो
                        </Text>
                    </View>
                )}

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

                <BigActionButton
                    icon="wallet"
                    emoji="💰"
                    hindiLabel="पैसे निकालो"
                    hindiSublabel="बैंक में भेजो"
                    color="#8B5CF6"
                    onPress={() => router.push('/(worker)/wallet')}
                />

                <BigActionButton
                    icon="list"
                    emoji="📋"
                    hindiLabel="पिछले काम"
                    hindiSublabel="सब काम देखो"
                    color="#0078D4"
                    onPress={() => router.push('/(worker)/history')}
                />

                {/* Help */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        margin: 16,
                        padding: 20,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 40, marginRight: 16 }}>📞</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#333', fontSize: 18, fontWeight: '700' }}>
                            मदद चाहिए?
                        </Text>
                        <Text style={{ color: '#666', fontSize: 14 }}>
                            फ़ोन करो: 1800-123-4567
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#22C55E',
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                            कॉल
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
