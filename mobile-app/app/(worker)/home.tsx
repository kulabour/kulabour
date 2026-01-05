import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function WorkerHome() {
    const [isOnline, setIsOnline] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header with Online Toggle */}
            <View className="bg-surface p-4 shadow-sm flex-row justify-between items-center border-b border-gray-100">
                <View>
                    <Text className="text-lg font-bold text-secondary">Partner Mode</Text>
                    <Text className={`text-xs font-medium ${isOnline ? 'text-success' : 'text-text-dim'}`}>
                        {isOnline ? 'You are Online' : 'You are Offline'}
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#00E676" }}
                    thumbColor={isOnline ? "#FFFFFF" : "#f4f3f4"}
                    onValueChange={setIsOnline}
                    value={isOnline}
                />
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Earnings Card (Zepto Style) */}
                <View className="bg-secondary rounded-2xl p-6 mb-6 shadow-card-3d">
                    <Text className="text-text-dim text-sm mb-1">Today's Earnings</Text>
                    <Text className="text-4xl font-bold text-primary mb-4">₹850</Text>

                    <View className="flex-row justify-between border-t border-gray-700 pt-4">
                        <View>
                            <Text className="text-gray-400 text-xs">Rides/Jobs</Text>
                            <Text className="text-white font-bold text-lg">4</Text>
                        </View>
                        <View>
                            <Text className="text-gray-400 text-xs">Login Hours</Text>
                            <Text className="text-white font-bold text-lg">3.5</Text>
                        </View>
                        <View>
                            <Text className="text-gray-400 text-xs">Incentives</Text>
                            <Text className="text-success font-bold text-lg">₹50</Text>
                        </View>
                    </View>
                </View>

                {/* Incentives Banner (Zomato Style) */}
                <View className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex-row items-center">
                    <View className="bg-blue-100 p-2 rounded-full mr-3">
                        <Ionicons name="gift" size={20} color="#2979FF" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-secondary font-bold">Complete 2 more jobs</Text>
                        <Text className="text-text-dim text-xs">to earn ₹200 extra bonus today!</Text>
                    </View>
                </View>

                {/* Demand Heatmap Placeholder */}
                <Text className="text-lg font-bold text-secondary mb-3">High Demand Areas</Text>
                <View className="h-48 bg-gray-200 rounded-xl mb-6 items-center justify-center border border-gray-300">
                    <Ionicons name="map" size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2">Heatmap Loading...</Text>
                </View>

                {/* Recent Activity */}
                <Text className="text-lg font-bold text-secondary mb-3">Recent Activity</Text>
                <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-3">
                                <Text>🧱</Text>
                            </View>
                            <View>
                                <Text className="font-bold text-secondary">Masonry Work</Text>
                                <Text className="text-xs text-gray-500">Sector 62, Noida</Text>
                            </View>
                        </View>
                        <Text className="font-bold text-success">+ ₹350</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                                <Text>🔧</Text>
                            </View>
                            <View>
                                <Text className="font-bold text-secondary">Plumbing Fix</Text>
                                <Text className="text-xs text-gray-500">Indirapuram</Text>
                            </View>
                        </View>
                        <Text className="font-bold text-success">+ ₹200</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
