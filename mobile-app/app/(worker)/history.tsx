import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function JobHistoryScreen() {
    const router = useRouter();

    const jobs = [
        { id: 1, service: 'Plumbing', customer: 'Rajesh Kumar', price: 450, status: 'Completed', date: 'Today, 2:30 PM', emoji: '🔧' },
        { id: 2, service: 'Electrical', customer: 'Amit Singh', price: 300, status: 'Completed', date: 'Yesterday, 5:00 PM', emoji: '⚡' },
        { id: 3, service: 'Cleaning', customer: 'Priya Sharma', price: 850, status: 'Completed', date: 'Yesterday, 10:00 AM', emoji: '🧹' },
        { id: 4, service: 'Painting', customer: 'Vikram Malhotra', price: 1200, status: 'Cancelled', date: '22 Dec, 9:00 AM', emoji: '🎨' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#F5F5F5]">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="bg-white px-4 pt-4 pb-4 flex-row items-center shadow-sm z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">Job History (पुराने काम)</Text>
            </View>

            <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 40 }}>
                {jobs.map((job) => (
                    <View key={job.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mr-3">
                                    <Text className="text-2xl">{job.emoji}</Text>
                                </View>
                                <View>
                                    <Text className="font-bold text-lg text-gray-800">{job.service}</Text>
                                    <Text className="text-gray-500">{job.customer}</Text>
                                </View>
                            </View>
                            <View className={`px-3 py-1 rounded-full ${job.status === 'Completed' ? 'bg-green-100' : 'bg-red-100'}`}>
                                <Text className={`${job.status === 'Completed' ? 'text-green-700' : 'text-red-700'} font-bold text-xs`}>
                                    {job.status.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View className="h-[1px] bg-gray-100 my-3" />

                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-400 text-sm">{job.date}</Text>
                            <Text className="font-extrabold text-xl text-gray-800">₹{job.price}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
