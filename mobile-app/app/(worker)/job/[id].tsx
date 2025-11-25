import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Card from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/ui/Avatar';
import '../../../global.css';

const jobDetails = {
    id: 1,
    title: 'Emergency Pipe Repair',
    price: '₹549',
    customerName: 'Rajesh Mehta',
    customerPhone: '+91 98765 43210',
    location: 'Koramangala, 4th Block, Flat 402',
    fullAddress: 'Flat 402, Building A, Koramangala 4th Block, Bangalore - 560034',
    time: 'Now • 2.3 km away',
    priority: 'urgent',
    category: 'Plumbing',
    description: 'Water leaking from kitchen tap. Need immediate repair before it gets worse. Worker should bring necessary tools and spare parts.',
    estimatedDuration: '30-45 mins',
    serviceType: 'Leaking Tap Repair',
    paymentMode: 'Cash on Completion',
};

export default function JobDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-6 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center mr-4"
                    >
                        <Text className="text-white text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Job Details</Text>
                </View>

                {/* Customer Card */}
                <View className="px-6 mb-6">
                    <Card variant="glass" shadow="medium">
                        <View className="flex-row items-center mb-4">
                            <Avatar name={jobDetails.customerName} size="md" />
                            <View className="ml-4 flex-1">
                                <Text className="text-white text-lg font-bold mb-1">
                                    {jobDetails.customerName}
                                </Text>
                                <Text className="text-white/60 text-sm">Customer</Text>
                            </View>
                            <TouchableOpacity className="w-12 h-12 bg-neon-blue/20 rounded-full items-center justify-center">
                                <Text className="text-2xl">📞</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-white/5 rounded-xl p-3">
                            <Text className="text-white/50 text-xs mb-1">Phone</Text>
                            <Text className="text-white font-semibold">{jobDetails.customerPhone}</Text>
                        </View>
                    </Card>
                </View>

                {/* Job Info */}
                <View className="px-6 mb-6">
                    <Card variant="elevated" shadow="3d">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1">
                                <View className="flex-row items-center mb-3">
                                    <View className="bg-error/20 px-3 py-1 rounded-pill border border-error/50">
                                        <Text className="text-error text-xs font-bold uppercase tracking-wide">
                                            {jobDetails.priority}
                                        </Text>
                                    </View>
                                    <View className="ml-2 bg-neon-blue/20 px-3 py-1 rounded-pill">
                                        <Text className="text-neon-blue text-xs font-bold">
                                            {jobDetails.category}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-white text-2xl font-bold mb-2">
                                    {jobDetails.title}
                                </Text>
                                <Text className="text-white/60 text-sm">{jobDetails.serviceType}</Text>
                            </View>
                        </View>

                        <View className="bg-gradient-to-r from-success/10 to-neon-green/10 rounded-xl p-4 border border-success/30 mb-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-white/70">Payment</Text>
                                <Text className="text-success text-3xl font-bold">{jobDetails.price}</Text>
                            </View>
                            <Text className="text-white/50 text-xs mt-1">{jobDetails.paymentMode}</Text>
                        </View>

                        <View className="space-y-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-white/5 rounded-full items-center justify-center mr-3">
                                    <Text className="text-xl">📍</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white/50 text-xs mb-1">Location</Text>
                                    <Text className="text-white text-sm">{jobDetails.fullAddress}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-white/5 rounded-full items-center justify-center mr-3">
                                    <Text className="text-xl">⏰</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white/50 text-xs mb-1">Time & Distance</Text>
                                    <Text className="text-white text-sm">{jobDetails.time}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-white/5 rounded-full items-center justify-center mr-3">
                                    <Text className="text-xl">⏱️</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white/50 text-xs mb-1">Estimated Duration</Text>
                                    <Text className="text-white text-sm">{jobDetails.estimatedDuration}</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Description */}
                <View className="px-6 mb-6">
                    <Card>
                        <Text className="text-white text-lg font-bold mb-3">Description</Text>
                        <Text className="text-white/70 text-sm leading-6">
                            {jobDetails.description}
                        </Text>
                    </Card>
                </View>

                {/* Map Preview Placeholder */}
                <View className="px-6 mb-6">
                    <Card className="h-48 items-center justify-center bg-dark-obsidian">
                        <Text className="text-white/30 text-sm mb-2">📍 Map Preview</Text>
                        <Text className="text-white/50 text-xs">{jobDetails.location}</Text>
                    </Card>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View className="px-6 py-4 bg-dark-charcoal border-t border-white/10">
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <Button variant="ghost" size="lg">
                            <Text className="text-lg">💬</Text> Contact
                        </Button>
                    </View>
                    <View className="flex-1">
                        <Button variant="primary" size="lg" glow>
                            Start Navigation
                        </Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
