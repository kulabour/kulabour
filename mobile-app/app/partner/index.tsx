/**
 * KULABOUR PARTNER APP - Home Page
 * Like Rapido Captain / Swiggy Delivery / Zepto Rider
 * 
 * Features:
 * 1. Online/Offline toggle (big green/red button)
 * 2. Customer details card when job assigned
 * 3. Job request popup with countdown
 * 4. Earnings dashboard
 * 5. Quick actions grid
 * 6. Heat map access
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Vibration,
    Dimensions,
    Animated,
    Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Import custom components
import { CustomerCard, CustomerInfo } from '../../components/CustomerCard';
import { JobRequestModal, JobRequest } from '../../components/JobRequestModal';

const { width, height } = Dimensions.get('window');

// Sample customer data
const sampleCustomer: CustomerInfo = {
    id: 'cust123',
    name: 'राजेश शर्मा',
    phone: '9876543210',
    email: 'rajesh.sharma@gmail.com',
    address: 'A-45, सेक्टर 15, नोएडा',
    city: 'Noida, UP',
    registrationDate: new Date('2024-01-15'),
    rating: 4.5,
    totalBookings: 12,
    isVerified: true,
    distance: '2.3 km',
    eta: '8 min',
};

// Sample job request
const sampleJob: JobRequest = {
    id: 'job123',
    emoji: '⚡',
    serviceHindi: 'बिजली का काम',
    serviceEnglish: 'Electrical Work',
    description: 'पंखा नहीं चल रहा - Fan not working',
    customerName: 'राजेश शर्मा',
    customerPhone: '9876543210',
    customerAddress: 'A-45, सेक्टर 15, नोएडा',
    distance: '2.3 km',
    eta: '8 min',
    earnings: 350,
};

export default function PartnerHomePage() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(false);
    const [showJobRequest, setShowJobRequest] = useState(false);
    const [currentJob, setCurrentJob] = useState<JobRequest | null>(null);
    const [currentCustomer, setCurrentCustomer] = useState<CustomerInfo | null>(null);
    const [jobStatus, setJobStatus] = useState<'idle' | 'accepted' | 'arrived' | 'working' | 'completed'>('idle');

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const onlineGlow = useRef(new Animated.Value(0)).current;

    // Stats
    const todayEarnings = 1450;
    const todayJobs = 6;
    const weekEarnings = 8200;
    const weekJobs = 23;
    const monthEarnings = 32500;
    const monthJobs = 89;
    const rating = 4.8;

    // Animations when going online
    useEffect(() => {
        if (isOnline) {
            // Pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Glow animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(onlineGlow, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(onlineGlow, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Simulate new job after 3 seconds
            const timer = setTimeout(() => {
                if (!currentJob) {
                    setShowJobRequest(true);
                }
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            pulseAnim.setValue(1);
            onlineGlow.setValue(0);
        }
    }, [isOnline]);

    const toggleOnline = () => {
        Vibration.vibrate(100);
        setIsOnline(!isOnline);

        if (isOnline) {
            // Going offline - reset state
            setCurrentJob(null);
            setCurrentCustomer(null);
            setJobStatus('idle');
        }
    };

    const handleAcceptJob = (job: JobRequest) => {
        Vibration.vibrate([0, 100, 100, 200]);
        setShowJobRequest(false);
        setCurrentJob(job);
        setCurrentCustomer(sampleCustomer);
        setJobStatus('accepted');
    };

    const handleRejectJob = (job: JobRequest) => {
        Vibration.vibrate(50);
        setShowJobRequest(false);
    };

    const handleArrived = () => {
        Vibration.vibrate([0, 100, 100, 100]);
        setJobStatus('arrived');
    };

    const handleStartWork = () => {
        Vibration.vibrate([0, 100, 100, 100]);
        setJobStatus('working');
    };

    const handleCompleteJob = () => {
        Vibration.vibrate([0, 200, 100, 300, 100, 200]);
        setJobStatus('completed');

        // Reset after 2 seconds
        setTimeout(() => {
            setCurrentJob(null);
            setCurrentCustomer(null);
            setJobStatus('idle');
        }, 3000);
    };

    const glowOpacity = onlineGlow.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={isOnline ? ['#22C55E', '#16A34A'] : ['#6B7280', '#4B5563']}
                style={{ paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20 }}
            >
                {/* Logo row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 32 }}>👷</Text>
                        <View style={{ marginLeft: 12 }}>
                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>
                                KULABOUR
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                                Partner App
                            </Text>
                        </View>
                    </View>

                    {/* Menu button */}
                    <TouchableOpacity
                        onPress={() => Vibration.vibrate(30)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: 12,
                            borderRadius: 14,
                        }}
                    >
                        <Ionicons name="menu" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Online/Offline Toggle - THE MAIN ACTION */}
                <TouchableOpacity onPress={toggleOnline} activeOpacity={0.9}>
                    <Animated.View
                        style={{
                            transform: [{ scale: isOnline ? pulseAnim : 1 }],
                        }}
                    >
                        {/* Glow effect when online */}
                        {isOnline && (
                            <Animated.View
                                style={{
                                    position: 'absolute',
                                    inset: -4,
                                    backgroundColor: '#fff',
                                    borderRadius: 24,
                                    opacity: glowOpacity,
                                }}
                            />
                        )}

                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderRadius: 20,
                                padding: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderWidth: isOnline ? 2 : 0,
                                borderColor: '#fff',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* Status icon */}
                                <View
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 35,
                                        backgroundColor: isOnline ? '#fff' : 'rgba(255,255,255,0.3)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 16,
                                    }}
                                >
                                    <Text style={{ fontSize: 40 }}>{isOnline ? '🟢' : '🔴'}</Text>
                                </View>

                                <View>
                                    <Text style={{ color: '#fff', fontSize: 32, fontWeight: '900' }}>
                                        {isOnline ? 'ऑनलाइन' : 'ऑफलाइन'}
                                    </Text>
                                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15 }}>
                                        {isOnline ? '✨ काम के लिए तैयार' : 'टैप करके ऑनलाइन हों'}
                                    </Text>
                                </View>
                            </View>

                            {/* Toggle switch */}
                            <View
                                style={{
                                    width: 80,
                                    height: 44,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    borderRadius: 22,
                                    padding: 4,
                                }}
                            >
                                <View
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: '#fff',
                                        alignSelf: isOnline ? 'flex-end' : 'flex-start',
                                    }}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Current Job with Customer Details */}
                {currentJob && currentCustomer && jobStatus !== 'completed' && (
                    <View>
                        {/* Job Progress Header */}
                        <View
                            style={{
                                backgroundColor: '#0078D4',
                                marginHorizontal: 16,
                                marginTop: 16,
                                borderRadius: 16,
                                padding: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 28,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Text style={{ fontSize: 32 }}>{currentJob.emoji}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>
                                    {currentJob.serviceHindi}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                                    {jobStatus === 'accepted' && '🚗 ग्राहक के पास जाओ'}
                                    {jobStatus === 'arrived' && '📍 ग्राहक के पास पहुंचे'}
                                    {jobStatus === 'working' && '🔨 काम चालू है...'}
                                </Text>
                            </View>
                            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900' }}>
                                ₹{currentJob.earnings}
                            </Text>
                        </View>

                        {/* Customer Card */}
                        <CustomerCard
                            customer={currentCustomer}
                            onViewMap={() => Vibration.vibrate(50)}
                            showFullDetails={true}
                        />

                        {/* Action Buttons based on status */}
                        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                            {jobStatus === 'accepted' && (
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => Vibration.vibrate(50)}
                                        style={{
                                            flex: 1,
                                            backgroundColor: '#0078D4',
                                            paddingVertical: 18,
                                            borderRadius: 16,
                                            marginRight: 8,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Ionicons name="navigate" size={24} color="#fff" />
                                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 8 }}>
                                            Navigate
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleArrived}
                                        style={{
                                            flex: 1.2,
                                            backgroundColor: '#22C55E',
                                            paddingVertical: 18,
                                            borderRadius: 16,
                                            marginLeft: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
                                            📍 पहुँच गया
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {jobStatus === 'arrived' && (
                                <TouchableOpacity
                                    onPress={handleStartWork}
                                    style={{
                                        backgroundColor: '#F59E0B',
                                        paddingVertical: 20,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
                                        🔨 काम शुरू करो
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {jobStatus === 'working' && (
                                <TouchableOpacity
                                    onPress={handleCompleteJob}
                                    style={{
                                        backgroundColor: '#22C55E',
                                        paddingVertical: 22,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>
                                        ✅ काम पूरा हुआ
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Job Completed Celebration */}
                {jobStatus === 'completed' && (
                    <View
                        style={{
                            backgroundColor: '#22C55E',
                            margin: 16,
                            borderRadius: 24,
                            padding: 32,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ fontSize: 64, marginBottom: 16 }}>🎉</Text>
                        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 8 }}>
                            बधाई हो!
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 16 }}>
                            आपने ₹{currentJob?.earnings} कमाए
                        </Text>
                        <View
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                borderRadius: 16,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>
                                अगला काम जल्दी आएगा...
                            </Text>
                        </View>
                    </View>
                )}

                {/* Earnings Section */}
                <View style={{ margin: 16 }}>
                    <Text style={{ color: '#333', fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
                        💰 कमाई (Earnings)
                    </Text>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            padding: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        {/* Earnings grid */}
                        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                            {/* Today */}
                            <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E5E5E5' }}>
                                <Text style={{ color: '#666', fontSize: 13 }}>आज</Text>
                                <Text style={{ color: '#22C55E', fontSize: 30, fontWeight: '900' }}>
                                    ₹{todayEarnings}
                                </Text>
                                <Text style={{ color: '#888', fontSize: 12 }}>{todayJobs} काम</Text>
                            </View>
                            {/* This Week */}
                            <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#E5E5E5' }}>
                                <Text style={{ color: '#666', fontSize: 13 }}>इस हफ्ते</Text>
                                <Text style={{ color: '#333', fontSize: 24, fontWeight: '800' }}>
                                    ₹{weekEarnings}
                                </Text>
                                <Text style={{ color: '#888', fontSize: 12 }}>{weekJobs} काम</Text>
                            </View>
                            {/* This Month */}
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ color: '#666', fontSize: 13 }}>इस महीने</Text>
                                <Text style={{ color: '#333', fontSize: 24, fontWeight: '800' }}>
                                    ₹{monthEarnings}
                                </Text>
                                <Text style={{ color: '#888', fontSize: 12 }}>{monthJobs} काम</Text>
                            </View>
                        </View>

                        {/* Withdraw button */}
                        <TouchableOpacity
                            onPress={() => {
                                Vibration.vibrate(50);
                                router.push('/partner/earnings');
                            }}
                            style={{
                                backgroundColor: '#8B5CF6',
                                paddingVertical: 16,
                                borderRadius: 14,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 20, marginRight: 8 }}>💸</Text>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                                पैसे निकालो (Withdraw)
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Rating */}
                <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 20,
                            padding: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: '#FEF3C7',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                            }}
                        >
                            <Text style={{ fontSize: 32 }}>⭐</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#666', fontSize: 14 }}>आपकी रेटिंग</Text>
                            <Text style={{ color: '#F59E0B', fontSize: 28, fontWeight: '900' }}>
                                {rating}/5
                            </Text>
                        </View>
                        <View
                            style={{
                                backgroundColor: '#DCFCE7',
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 14,
                            }}
                        >
                            <Text style={{ color: '#22C55E', fontWeight: '800' }}>बहुत अच्छी! 🎉</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{ margin: 16 }}>
                    <Text style={{ color: '#333', fontSize: 22, fontWeight: '800', marginBottom: 12 }}>
                        ⚡ Quick Actions
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
                        {[
                            { emoji: '📋', hindi: 'पिछले काम', english: 'Job History', color: '#0078D4', route: '/partner/jobs' },
                            { emoji: '🗺️', hindi: 'हीट मैप', english: 'Heat Map', color: '#EF4444', route: '/partner/heatmap' },
                            { emoji: '📞', hindi: 'हेल्प', english: 'Support', color: '#F59E0B', route: '/partner/help' },
                            { emoji: '⚙️', hindi: 'सेटिंग्स', english: 'Settings', color: '#6B7280', route: '/partner/settings' },
                        ].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    Vibration.vibrate(30);
                                    // router.push(item.route);
                                }}
                                style={{
                                    width: (width - 48) / 2,
                                    margin: 4,
                                    backgroundColor: '#fff',
                                    padding: 20,
                                    borderRadius: 18,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        backgroundColor: item.color + '20',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 12,
                                    }}
                                >
                                    <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
                                </View>
                                <View>
                                    <Text style={{ color: '#333', fontSize: 16, fontWeight: '700' }}>
                                        {item.hindi}
                                    </Text>
                                    <Text style={{ color: '#888', fontSize: 11 }}>
                                        {item.english}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Offline message */}
            {!isOnline && !currentJob && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        left: 16,
                        right: 16,
                        backgroundColor: '#1F2937',
                        padding: 20,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 40, marginRight: 16 }}>💤</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
                            आप ऑफलाइन हैं
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                            काम पाने के लिए ऑनलाइन हों ☝️
                        </Text>
                    </View>
                </View>
            )}

            {/* Job Request Modal */}
            <JobRequestModal
                visible={showJobRequest}
                job={sampleJob}
                onAccept={handleAcceptJob}
                onReject={handleRejectJob}
                countdownSeconds={25}
            />
        </View>
    );
}
