/**
 * KULABOUR Partner - Earnings Screen
 * Simple earnings dashboard for workers
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatedBarChart, AnimatedStatCard } from '../../components/AnimatedChart';

const { width } = Dimensions.get('window');

export default function PartnerEarnings() {
    const router = useRouter();

    const earnings = {
        today: 1450,
        week: 8200,
        month: 32500,
        pending: 2400,
        withdrawn: 30100,
    };

    const weeklyData = [
        { label: 'सोम', value: 1200 },
        { label: 'मंग', value: 1500 },
        { label: 'बुध', value: 800 },
        { label: 'गुरु', value: 1400 },
        { label: 'शुक्र', value: 1800 },
        { label: 'शनि', value: 1050 },
        { label: 'रवि', value: 450 },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#111827' }}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#10B981', '#059669']}
                style={{ paddingTop: 50, paddingBottom: 30, paddingHorizontal: 20 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>
                        💰 कमाई
                    </Text>
                </View>

                {/* Total earnings */}
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                        इस महीने की कमाई
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 56, fontWeight: '900' }}>
                        ₹{earnings.month.toLocaleString()}
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16, marginTop: -20 }}>
                {/* Quick stats */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <View style={{ flex: 1 }}>
                        <AnimatedStatCard
                            label="आज"
                            value={earnings.today}
                            icon="📅"
                            trend={{ value: 12, positive: true }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <AnimatedStatCard
                            label="इस हफ्ते"
                            value={earnings.week}
                            icon="📆"
                            trend={{ value: 5, positive: true }}
                        />
                    </View>
                </View>

                {/* Weekly chart - Animated */}
                <View style={{ marginBottom: 16 }}>
                    <AnimatedBarChart
                        data={weeklyData}
                        title="हफ्ते की कमाई 📊"
                        height={250}
                    />
                </View>

                {/* Pending & Withdrawn */}
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                    <View style={{ flex: 1 }}>
                        <AnimatedStatCard
                            label="पेंडिंग"
                            value={earnings.pending}
                            icon="💳"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <AnimatedStatCard
                            label="निकाले"
                            value={earnings.withdrawn}
                            icon="✅"
                        />
                    </View>
                </View>

                {/* Withdraw button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#8B5CF6',
                        paddingVertical: 18,
                        borderRadius: 14,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16
                    }}
                >
                    <Text style={{ fontSize: 24, marginRight: 10 }}>💸</Text>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>
                        बैंक में भेजो
                    </Text>
                </TouchableOpacity>

                {/* Bank details */}
                <View style={{
                    backgroundColor: '#1F2937',
                    borderRadius: 16,
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)'
                }}>
                    <View style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: '#374151',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                    }}>
                        <Text style={{ fontSize: 28 }}>🏦</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                            बैंक खाता
                        </Text>
                        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>
                            XXXX XXXX 1234
                        </Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={{ color: '#10B981', fontWeight: '600' }}>बदलो</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
