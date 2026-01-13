/* eslint-disable @typescript-eslint/no-require-imports */
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api/client';
import AnimatedCard from '../../components/ui/AnimatedCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import '../../global.css';

import { ImageSourcePropType } from 'react-native';

interface Service {
    id: string;
    name: string;
    description?: string;
    price?: number;
}

const localImages: Record<string, ImageSourcePropType> = {
    'Cleaning': require('../../assets/3d/cleaning_icon_3d_1763842077573.png'),
    'Plumbing': require('../../assets/3d/plumbing_icon_3d_1763842092010.png'),
    'Electrical': require('../../assets/3d/electrical_icon_3d_1763842106305.png'),
    'Painting': require('../../assets/3d/painting_icon_3d_1763842121533.png'),
};

export default function CustomerHome() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await apiClient.get<Service[]>('/api/services');
            if (response.success && response.data) {
                setServices(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" />

            {/* Ambient Background Glows */}
            <View className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <View className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <View className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/10 rounded-full blur-[80px]" />
            </View>

            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Header */}
                    <View className="px-6 pt-2 pb-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-slate-400 text-sm mb-1 font-medium">Good Morning,</Text>
                                <Text className="text-white text-2xl font-bold">Anil Kumar</Text>
                            </View>
                            <TouchableOpacity className="w-12 h-12 rounded-full bg-slate-800/80 border border-white/10 items-center justify-center shadow-lg shadow-black/20">
                                <Ionicons name="notifications-outline" size={24} color="#94a3b8" />
                                <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#020617]" />
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar */}
                        <View className="relative">
                            <View className="absolute inset-0 bg-white/5 blur-md rounded-2xl" />
                            <View className="bg-slate-800/80 rounded-2xl px-4 py-3.5 flex-row items-center border border-white/10 shadow-xl">
                                <Ionicons name="search" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
                                <TextInput
                                    placeholder="Find a service (e.g. leaking tap)..."
                                    placeholderTextColor="#64748b"
                                    className="flex-1 text-white text-base font-medium"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                <TouchableOpacity className="bg-slate-700 p-1.5 rounded-lg">
                                    <Ionicons name="options-outline" size={18} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Popular Services Banner */}
                    <View className="px-6 mb-8">
                        <LinearGradient
                            colors={['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.05)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="rounded-3xl p-1 border border-blue-500/30"
                        >
                            <View className="p-5 rounded-[22px] bg-[#0f172a]/40 backdrop-blur-sm overflow-hidden relative">
                                <View className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <View className="flex-row items-start justify-between mb-8 relative z-10">
                                    <View className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20 self-start">
                                        <Text className="text-blue-400 text-xs font-bold uppercase tracking-wider">🔥 Trending</Text>
                                    </View>
                                </View>

                                <View className="flex-row items-end justify-between relative z-10">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-white text-xl font-bold mb-1">Emergency Plumbing</Text>
                                        <Text className="text-slate-400 text-xs mb-4">Express deployment • ~15 min arrival</Text>
                                        <TouchableOpacity className="bg-blue-600 px-5 py-2.5 rounded-xl self-start flex-row items-center">
                                            <Text className="text-white font-bold mr-2">Book Now</Text>
                                            <Ionicons name="arrow-forward" size={16} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                    {/* Ideally an image here */}
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Categories */}
                    <View className="px-6 mb-6">
                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-white text-lg font-bold">Categories</Text>
                            <TouchableOpacity>
                                <Text className="text-blue-400 text-sm font-semibold">View All</Text>
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <View className="flex-row flex-wrap justify-between">
                                {[1, 2, 3, 4].map((i) => (
                                    <View key={i} className="w-[48%] h-44 bg-slate-800/50 rounded-3xl mb-4 animate-pulse" />
                                ))}
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap justify-between">
                                {services.map((category) => (
                                    <AnimatedCard
                                        key={category.id}
                                        className="w-[48%] mb-4"
                                        onPress={() => router.push('/(customer)/booking')}
                                    >
                                        <View className="bg-slate-800/50 rounded-3xl p-4 border border-white/5 h-48 justify-between relative overflow-hidden group">
                                            <View className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-active:opacity-100" />

                                            <View className="items-center justify-center flex-1">
                                                {localImages[category.name] ? (
                                                    <Image
                                                        source={localImages[category.name]}
                                                        className="w-24 h-24"
                                                        resizeMode="contain"
                                                        alt={category.name}
                                                    />
                                                ) : (
                                                    <View className="w-20 h-20 bg-slate-700/50 rounded-full items-center justify-center mb-2">
                                                        <Text className="text-4xl">{category.icon}</Text>
                                                    </View>
                                                )}
                                            </View>

                                            <View>
                                                <Text className="text-white text-base font-bold text-center mb-1">
                                                    {category.name}
                                                </Text>
                                                <View className="flex-row justify-center items-center gap-1">
                                                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <Text className="text-slate-400 text-xs font-medium">{category.workers} Pros</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </AnimatedCard>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Recent Activity */}
                    <View className="px-6 pb-6">
                        <Text className="text-white text-lg font-bold mb-4">Recent Activity</Text>
                        <View className="bg-slate-800/30 rounded-3xl p-1">
                            <TouchableOpacity className="flex-row items-center bg-slate-800/80 p-4 rounded-[20px] border border-white/5 active:bg-slate-800 transition-colors">
                                <View className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center mr-4 border border-blue-500/20">
                                    <Ionicons name="water-outline" size={24} color="#3b82f6" />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-white font-bold text-base">Pipe Repair</Text>
                                        <Text className="text-emerald-400 font-bold text-sm">₹499</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-slate-500 text-xs font-medium">Completed • 2 days ago</Text>
                                        <View className="flex-row items-center bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                            <Ionicons name="checkmark-circle" size={10} color="#10b981" style={{ marginRight: 4 }} />
                                            <Text className="text-emerald-500 text-[10px] uppercase font-bold tracking-wide">Done</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
