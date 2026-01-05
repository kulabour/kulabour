/**
 * KULABOUR Partner - Job History
 * Simple list of past jobs with earnings
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Sample job history
const JOB_HISTORY = [
    { id: '1', emoji: '⚡', service: 'बिजली का काम', customer: 'राजेश जी', price: 350, date: 'आज', status: 'done' },
    { id: '2', emoji: '🔧', service: 'नल मरम्मत', customer: 'प्रिया मैडम', price: 250, date: 'आज', status: 'done' },
    { id: '3', emoji: '❄️', service: 'AC सर्विस', customer: 'संजय भाई', price: 500, date: 'कल', status: 'done' },
    { id: '4', emoji: '🧱', service: 'मिस्त्री काम', customer: 'अमित जी', price: 600, date: 'कल', status: 'done' },
    { id: '5', emoji: '🎨', service: 'पेंटिंग', customer: 'रेखा मैडम', price: 400, date: '2 दिन पहले', status: 'done' },
];

export default function PartnerJobs() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
                style={{ paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>
                        📋 पिछले काम
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {JOB_HISTORY.map((job) => (
                    <View
                        key={job.id}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {/* Service icon */}
                        <View
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: '#F3F4F6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                            }}
                        >
                            <Text style={{ fontSize: 32 }}>{job.emoji}</Text>
                        </View>

                        {/* Details */}
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#111', fontSize: 18, fontWeight: '700' }}>
                                {job.service}
                            </Text>
                            <Text style={{ color: '#666', fontSize: 14 }}>
                                {job.customer} • {job.date}
                            </Text>
                        </View>

                        {/* Price */}
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: '#22C55E', fontSize: 20, fontWeight: '900' }}>
                                ₹{job.price}
                            </Text>
                            <View style={{
                                backgroundColor: '#DCFCE7',
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 8,
                                marginTop: 4,
                            }}>
                                <Text style={{ color: '#22C55E', fontSize: 10, fontWeight: '600' }}>
                                    ✅ पूरा
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Summary */}
                <View style={{
                    backgroundColor: '#22C55E',
                    borderRadius: 16,
                    padding: 20,
                    marginTop: 8,
                }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                        कुल कमाई (इस हफ्ते)
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 36, fontWeight: '900' }}>
                        ₹2,100
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
