/**
 * KULABOUR Partner App - Job Request Modal
 * Like Rapido/Swiggy partner apps - shows incoming job with countdown timer
 * 
 * Features:
 * - Countdown timer (25 seconds like Rapido)
 * - Big Accept/Reject buttons
 * - Job details (service, earnings, distance, customer)
 * - Haptic feedback for urgency
 * - Auto-reject when timer expires
 */

import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    Easing,
    Vibration,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export interface JobRequest {
    id: string;
    emoji: string;
    serviceHindi: string;
    serviceEnglish: string;
    description: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    distance: string;
    eta: string;
    earnings: number;
    urgency?: 'normal' | 'urgent' | 'emergency';
}

interface JobRequestModalProps {
    visible: boolean;
    job: JobRequest | null;
    onAccept: (job: JobRequest) => void;
    onReject: (job: JobRequest) => void;
    countdownSeconds?: number;
}

export function JobRequestModal({
    visible,
    job,
    onAccept,
    onReject,
    countdownSeconds = 25,
}: JobRequestModalProps) {
    const [timeLeft, setTimeLeft] = useState(countdownSeconds);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Start animations and timer when modal opens
    useEffect(() => {
        if (visible && job) {
            // Reset timer
            setTimeLeft(countdownSeconds);

            // Entry animation
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }).start();

            // Pulse animation for urgency
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Start countdown
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Auto-reject when time expires
                        handleReject();
                        return 0;
                    }
                    // Vibrate every 5 seconds as reminder
                    if (prev % 5 === 0) {
                        Vibration.vibrate(100);
                    }
                    return prev - 1;
                });
            }, 1000);

            // Initial vibration pattern for new job
            Vibration.vibrate([0, 500, 200, 500, 200, 500]);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [visible, job]);

    const handleAccept = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        Vibration.vibrate([0, 100, 100, 200]);
        scaleAnim.setValue(0);
        if (job) onAccept(job);
    };

    const handleReject = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        Vibration.vibrate(50);
        scaleAnim.setValue(0);
        if (job) onReject(job);
    };

    // Timer color based on time left
    const getTimerColor = () => {
        if (timeLeft <= 5) return '#EF4444'; // Red
        if (timeLeft <= 10) return '#F59E0B'; // Orange
        return '#22C55E'; // Green
    };

    if (!job) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 16,
                }}
            >
                <Animated.View
                    style={{
                        width: width - 32,
                        backgroundColor: '#fff',
                        borderRadius: 28,
                        overflow: 'hidden',
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    {/* Header - Flashing alert */}
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <LinearGradient
                            colors={['#22C55E', '#16A34A']}
                            style={{
                                paddingVertical: 20,
                                paddingHorizontal: 24,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 36, marginRight: 12 }}>🔔</Text>
                            <View>
                                <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900' }}>
                                    नया काम आया!
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                                    New Job Request
                                </Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    {/* Timer countdown */}
                    <View
                        style={{
                            backgroundColor: getTimerColor() + '20',
                            borderBottomWidth: 3,
                            borderBottomColor: getTimerColor(),
                            paddingVertical: 16,
                            paddingHorizontal: 24,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="timer" size={28} color={getTimerColor()} />
                        <Text
                            style={{
                                color: getTimerColor(),
                                fontSize: 32,
                                fontWeight: '900',
                                marginLeft: 12,
                            }}
                        >
                            {timeLeft}s
                        </Text>
                        <Text
                            style={{
                                color: getTimerColor(),
                                fontSize: 16,
                                marginLeft: 8,
                            }}
                        >
                            में जवाब दो
                        </Text>
                    </View>

                    {/* Job content */}
                    <View style={{ padding: 24 }}>
                        {/* Service type */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
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
                                <Text style={{ fontSize: 40 }}>{job.emoji}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#111', fontSize: 26, fontWeight: '800' }}>
                                    {job.serviceHindi}
                                </Text>
                                <Text style={{ color: '#666', fontSize: 14 }}>
                                    {job.serviceEnglish}
                                </Text>
                                <Text style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
                                    {job.description}
                                </Text>
                            </View>
                        </View>

                        {/* Customer info */}
                        <View
                            style={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 32, marginRight: 14 }}>👤</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#111', fontSize: 18, fontWeight: '700' }}>
                                    {job.customerName}
                                </Text>
                                <Text style={{ color: '#666', fontSize: 13 }}>ग्राहक (Customer)</Text>
                            </View>
                        </View>

                        {/* Location */}
                        <View
                            style={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: 16,
                                padding: 16,
                                marginBottom: 16,
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 28, marginRight: 12 }}>📍</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#111', fontSize: 16, fontWeight: '600' }}>
                                        {job.customerAddress}
                                    </Text>
                                    <View style={{ flexDirection: 'row', marginTop: 6 }}>
                                        <View
                                            style={{
                                                backgroundColor: '#DCFCE7',
                                                paddingHorizontal: 12,
                                                paddingVertical: 4,
                                                borderRadius: 12,
                                                marginRight: 8,
                                            }}
                                        >
                                            <Text style={{ color: '#16A34A', fontWeight: '700' }}>
                                                📏 {job.distance}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: '#FEF3C7',
                                                paddingHorizontal: 12,
                                                paddingVertical: 4,
                                                borderRadius: 12,
                                            }}
                                        >
                                            <Text style={{ color: '#B45309', fontWeight: '700' }}>
                                                ⏱️ {job.eta}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Earnings - BIG and prominent */}
                        <View
                            style={{
                                backgroundColor: '#DCFCE7',
                                borderRadius: 20,
                                padding: 24,
                                marginBottom: 24,
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: '#22C55E',
                            }}
                        >
                            <Text style={{ color: '#666', fontSize: 16 }}>
                                आपको मिलेंगे (You'll Earn)
                            </Text>
                            <Text style={{ color: '#22C55E', fontSize: 56, fontWeight: '900' }}>
                                ₹{job.earnings}
                            </Text>
                        </View>

                        {/* Accept/Reject buttons */}
                        <View style={{ flexDirection: 'row' }}>
                            {/* Reject button */}
                            <TouchableOpacity
                                onPress={handleReject}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#EF4444',
                                    paddingVertical: 22,
                                    borderRadius: 18,
                                    marginRight: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons name="close" size={36} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginLeft: 8 }}>
                                    नहीं
                                </Text>
                            </TouchableOpacity>

                            {/* Accept button */}
                            <TouchableOpacity
                                onPress={handleAccept}
                                style={{
                                    flex: 1.5,
                                    backgroundColor: '#22C55E',
                                    paddingVertical: 22,
                                    borderRadius: 18,
                                    marginLeft: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons name="checkmark" size={36} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginLeft: 8 }}>
                                    हाँ, लूँगा
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

export default JobRequestModal;
