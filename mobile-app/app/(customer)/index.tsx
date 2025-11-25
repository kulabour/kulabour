import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api/client';
import AnimatedCard from '../../components/ui/AnimatedCard';
import '../../global.css';

const localImages: Record<string, any> = {
    'Cleaning': require('../../assets/3d/cleaning_icon_3d_1763842077573.png'),
    'Plumbing': require('../../assets/3d/plumbing_icon_3d_1763842092010.png'),
    'Electrical': require('../../assets/3d/electrical_icon_3d_1763842106305.png'),
    'Painting': require('../../assets/3d/painting_icon_3d_1763842121533.png'),
};

export default function CustomerHome() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await apiClient.get('/api/services');
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
        <SafeAreaView className="flex-1 bg-dark-navy">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-white/60 text-sm mb-1">Hello,</Text>
                            <Text className="text-white text-3xl font-bold">Anil Kumar</Text>
                        </View>
                        <TouchableOpacity className="w-12 h-12 rounded-full bg-dark-charcoal border border-white/10 items-center justify-center">
                            <Text className="text-2xl">🔔</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View className="bg-dark-charcoal rounded-2xl px-4 py-3 flex-row items-center border border-white/5">
                        <Text className="text-2xl mr-3">🔍</Text>
                        <TextInput
                            placeholder="Search services..."
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            className="flex-1 text-white text-base"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Popular Services Banner */}
                <View className="px-6 mb-8">
                    <View className="bg-gradient-to-r from-neon-blue/20 to-neon-teal/20 rounded-3xl p-6 border border-neon-blue/30">
                        <Text className="text-neon-blue text-sm font-bold mb-2 uppercase tracking-wide">⚡ Popular</Text>
                        <Text className="text-white text-2xl font-bold mb-2">Emergency Plumbing</Text>
                        <Text className="text-white/70 text-sm mb-4">Available 24/7 • Avg response: 15 mins</Text>
                        <TouchableOpacity className="bg-neon-blue rounded-pill px-6 py-3 self-start">
                            <Text className="text-white font-bold">Book Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories */}
                <View className="px-6 mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-2xl font-bold">Services</Text>
                        <TouchableOpacity>
                            <Text className="text-neon-blue text-sm font-semibold">See All</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View className="flex-row flex-wrap justify-between">
                            {[1, 2, 3, 4].map((i) => (
                                <View key={i} className="w-[48%] h-40 bg-white/5 rounded-2xl mb-4 animate-pulse" />
                            ))}
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap justify-between">
                            {services.map((category, index) => (
                                <AnimatedCard
                                    key={category.id}
                                    className="w-[48%] mb-4"
                                    onPress={() => router.push('/(customer)/booking')}
                                >
                                    <View className="bg-dark-charcoal rounded-2xl p-5 border border-white/5">
                                        <View className="items-center mb-3">
                                            {localImages[category.name] ? (
                                                <Image
                                                    source={localImages[category.name]}
                                                    className="w-24 h-24"
                                                    resizeMode="contain"
                                                />
                                            ) : (
                                                <Text className="text-6xl">{category.icon}</Text>
                                            )}
                                        </View>
                                        <Text className="text-white text-lg font-bold mb-1">
                                            {category.name}
                                        </Text>
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-white/50 text-xs">{category.workers} workers</Text>
                                            <Text className="text-neon-green text-sm font-bold">{category.avgPrice}</Text>
                                        </View>
                                    </View>
                                </AnimatedCard>
                            ))}
                        </View>
                    )}
                </View>

                {/* Recent Bookings */}
                <View className="px-6 pb-6">
                    <Text className="text-white text-2xl font-bold mb-4">Recent</Text>
                    <View className="bg-dark-charcoal rounded-2xl p-4 border border-white/5">
                        <View className="flex-row items-center">
                            <View className="w-14 h-14 bg-neon-blue/20 rounded-full items-center justify-center mr-4">
                                <Text className="text-2xl">🔧</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base mb-1">Pipe Repair</Text>
                                <Text className="text-white/50 text-sm">Completed • 2 days ago</Text>
                            </View>
                            <Text className="text-success font-bold">₹499</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
