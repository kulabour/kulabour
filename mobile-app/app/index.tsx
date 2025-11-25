import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { apiClient } from '../services/api/client';

export default function LandingPage() {
    // Initialize API client (restore token) on app launch
    useEffect(() => {
        apiClient.initialize();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}>
                <View className="items-center mb-12">
                    <Text className="text-3xl font-bold text-primary mb-2">KULABOUR</Text>
                    <Text className="text-gray-500">Instant Construction Services</Text>
                </View>

                <View className="gap-6">
                    {/* Worker Card */}
                    <Link href="/(worker)/onboarding" asChild>
                        <TouchableOpacity className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 items-center">
                            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                                <Text className="text-2xl">👷</Text>
                            </View>
                            <Text className="text-xl font-bold text-gray-900 mb-1">Worker App</Text>
                            <Text className="text-gray-500 text-center text-sm">Find jobs, get paid instantly</Text>
                        </TouchableOpacity>
                    </Link>

                    {/* Customer Card */}
                    <Link href="/(customer)/auth/welcome" asChild>
                        <TouchableOpacity className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 items-center">
                            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                                <Text className="text-2xl">🏠</Text>
                            </View>
                            <Text className="text-xl font-bold text-gray-900 mb-1">Customer App</Text>
                            <Text className="text-gray-500 text-center text-sm">Book services in minutes</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
