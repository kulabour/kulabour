import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBarChart, AnimatedStatCard } from '../../components/AnimatedChart';

const { width } = Dimensions.get('window');

export default function WalletScreen() {
    const router = useRouter();

    const weeklyData = [
        { label: 'Mon', value: 450, color: '#3B82F6' },
        { label: 'Tue', value: 300, color: '#3B82F6' },
        { label: 'Wed', value: 850, color: '#22C55E' },
        { label: 'Thu', value: 600, color: '#3B82F6' },
        { label: 'Fri', value: 1200, color: '#22C55E' },
        { label: 'Sat', value: 950, color: '#22C55E' },
        { label: 'Sun', value: 200, color: '#EF4444' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="bg-white px-4 pt-4 pb-4 flex-row items-center shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">My Wallet (कमाई)</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Balance Card */}
                <View className="m-4">
                    <LinearGradient
                        colors={['#8B5CF6', '#6D28D9']}
                        className="rounded-3xl p-6 shadow-lg"
                    >
                        <Text className="text-white/70 text-lg mb-1">Total Balance</Text>
                        <Text className="text-white text-5xl font-black mb-6">₹4,550</Text>

                        <TouchableOpacity
                            className="bg-white py-3 px-6 rounded-xl self-start flex-row items-center"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="cash-outline" size={20} color="#6D28D9" style={{ marginRight: 8 }} />
                            <Text className="text-[#6D28D9] font-bold text-lg">Withdraw Now</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Animated Chart */}
                <View className="mx-4 mb-6">
                    <AnimatedBarChart
                        title="Weekly Earnings (साप्ताहिक कमाई)"
                        data={weeklyData}
                        height={250}
                    />
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap px-2">
                    <View className="w-1/2 p-2">
                        <AnimatedStatCard
                            label="Today"
                            value={1200}
                            trend={{ value: 15, positive: true }}
                        />
                    </View>
                    <View className="w-1/2 p-2">
                        <AnimatedStatCard
                            label="This Month"
                            value={18500}
                            trend={{ value: 8, positive: true }}
                        />
                    </View>
                </View>

                {/* Transaction History */}
                <View className="px-4 mt-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</Text>

                    {[1, 2, 3].map((i) => (
                        <View key={i} className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm">
                            <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mr-4">
                                <Ionicons name="arrow-down" size={24} color="#22C55E" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-gray-800 text-lg">Job Payment</Text>
                                <Text className="text-gray-500">Today, 2:30 PM</Text>
                            </View>
                            <Text className="font-bold text-green-600 text-lg">+ ₹450</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
