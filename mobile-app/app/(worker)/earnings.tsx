import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function WorkerEarnings() {
    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4 border-b border-gray-200 bg-white">
                <Text className="text-xl font-bold text-secondary">Earnings & Payouts</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Total Balance Card */}
                <View className="bg-primary rounded-2xl p-6 mb-6 shadow-lg">
                    <Text className="text-secondary/80 font-medium mb-1">Available Balance</Text>
                    <Text className="text-4xl font-bold text-secondary mb-4">₹1,250</Text>
                    <TouchableOpacity className="bg-secondary py-3 rounded-xl items-center">
                        <Text className="text-white font-bold">Cash Out Now</Text>
                    </TouchableOpacity>
                    <Text className="text-secondary/60 text-xs text-center mt-2">Next auto-payout: Monday, 10 AM</Text>
                </View>

                {/* Weekly Chart Placeholder */}
                <View className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <Text className="font-bold text-secondary mb-4">Weekly Earnings</Text>
                    <View className="flex-row justify-between items-end h-32 pb-2">
                        {[400, 850, 300, 600, 1200, 900, 850].map((val, i) => (
                            <View key={i} className="items-center">
                                <View style={{ height: val / 10, width: 20 }} className="bg-primary rounded-t-sm" />
                                <Text className="text-xs text-gray-400 mt-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Transaction History */}
                <Text className="font-bold text-secondary mb-3">Recent Transactions</Text>
                <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {[1, 2, 3].map((item) => (
                        <View key={item} className="p-4 border-b border-gray-100 flex-row justify-between items-center">
                            <View>
                                <Text className="font-bold text-secondary">Job Payment #{1000 + item}</Text>
                                <Text className="text-xs text-gray-500">Today, 2:30 PM</Text>
                            </View>
                            <Text className="font-bold text-success">+ ₹450</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
