import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import '../../../global.css';

const jobs = [
    {
        id: 1,
        title: 'Emergency Pipe Repair',
        price: '₹549',
        customerName: 'Rajesh Mehta',
        location: 'Koramangala, 4th Block, Flat 402',
        time: 'Today, 2:00 PM',
        status: 'pending',
        distance: '2.5 km',
    },
    {
        id: 2,
        title: 'Deep Home Cleaning',
        price: '₹1,299',
        customerName: 'Priya Sharma',
        location: 'Indiranagar, Brigade Road, Villa 12',
        time: 'Today at 3:00 PM • 5.1 km',
        priority: 'medium' as const,
        category: 'Cleaning',
    },
    {
        id: 3,
        title: 'Ceiling Fan Installation',
        price: '₹399',
        customerName: 'Amit Patel',
        location: 'HSR Layout, Sector 2, Apartment 203',
        time: 'Tomorrow at 10:00 AM • 3.7 km',
        priority: 'medium' as const,
        category: 'Electrical',
    },
];

export default function WorkerHome() {
    const [isOnline, setIsOnline] = useState(true);
    const router = useRouter();

    const renderHeader = useCallback(() => (
        <View className="px-6 pt-4 pb-2">
            {/* Header */}
            <View className="flex-row justify-between items-start mb-8">
                <View className="flex-row items-center">
                    <Avatar name="John Doe" size="lg" online={isOnline} />
                    <View className="ml-4">
                        <Text className="text-slate-400 text-sm mb-1 font-medium">Welcome back,</Text>
                        <Text className="text-white text-2xl font-bold">John Doe</Text>
                        <View className="flex-row items-center mt-1">
                            <View className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`} />
                            <Text className={`text-xs font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {isOnline ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    className={`px-4 py-2 rounded-full border ${isOnline ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-800 border-slate-600'}`}
                    onPress={() => setIsOnline(!isOnline)}
                >
                    <Ionicons name="power" size={20} color={isOnline ? '#34d399' : '#94a3b8'} />
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-8">
                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    className="flex-1 rounded-2xl p-4 border border-white/5 relative overflow-hidden"
                >
                    <View className="absolute top-0 right-0 p-2 opacity-10">
                        <Ionicons name="construct" size={40} color="white" />
                    </View>
                    <Text className="text-slate-400 text-xs mb-2 uppercase tracking-wide font-bold">Today&apos;s Jobs</Text>
                    <View className="flex-row items-baseline gap-2">
                        <Text className="text-white text-3xl font-bold">7</Text>
                        <Text className="text-emerald-400 text-xs font-bold">▲ 2</Text>
                    </View>
                </LinearGradient>

                <LinearGradient
                    colors={['#1e293b', '#0f172a']}
                    className="flex-1 rounded-2xl p-4 border border-white/5 relative overflow-hidden"
                >
                    <View className="absolute top-0 right-0 p-2 opacity-10">
                        <Ionicons name="wallet" size={40} color="#34d399" />
                    </View>
                    <Text className="text-slate-400 text-xs mb-2 uppercase tracking-wide font-bold">Earnings</Text>
                    <Text className="text-emerald-400 text-3xl font-bold">₹3.2K</Text>
                </LinearGradient>
            </View>

            {/* Rating Card */}
            <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                className="rounded-3xl p-1 border border-blue-500/20 mb-8"
            >
                <View className="bg-[#0f172a]/60 backdrop-blur-md rounded-[20px] p-5 flex-row justify-between items-center">
                    <View>
                        <Text className="text-slate-300 text-sm mb-1 font-medium">Overall Rating</Text>
                        <View className="flex-row items-end gap-2">
                            <Text className="text-white text-4xl font-bold">4.9</Text>
                            <Text className="text-sm text-yellow-400 mb-1.5">⭐⭐⭐⭐⭐</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
                        <Text className="text-blue-400 font-bold text-sm">View 248 Reviews</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Available Jobs Header */}
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-white text-xl font-bold">Available Jobs</Text>
                    <Text className="text-slate-400 text-sm">{jobs.length} jobs nearby</Text>
                </View>
                <TouchableOpacity className="bg-slate-800 px-3 py-1.5 rounded-lg border border-white/5">
                    <Text className="text-blue-400 text-xs font-bold uppercase tracking-wide">View All</Text>
                </TouchableOpacity>
            </View>
        </View>
    ), [isOnline]);

    const renderItem = ({ item }: { item: typeof jobs[0] }) => (
        <View className="px-6 mb-4">
            <TouchableOpacity onPress={() => router.push(`/(worker)/job/${item.id}`)} activeOpacity={0.9}>
                <View className="bg-slate-800/40 rounded-3xl p-5 border border-white/5 overflow-hidden relative">
                    {/* Priority Stripe */}
                    {item.priority === 'urgent' && (
                        <View className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                    )}

                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-4 pl-2">
                        <View className="flex-1 mr-2">
                            <View className="flex-row items-center mb-2 gap-2">
                                {item.priority === 'urgent' && (
                                    <View className="bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                                        <Text className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Urgent</Text>
                                    </View>
                                )}
                                <View className="bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                                    <Text className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">{item.category}</Text>
                                </View>
                            </View>
                            <Text className="text-white text-lg font-bold mb-1 leading-6">{item.title}</Text>
                        </View>
                        <Text className="text-emerald-400 font-bold text-xl">{item.price}</Text>
                    </View>

                    {/* Details */}
                    <View className="pl-2 space-y-2 mb-4">
                        <View className="flex-row items-center">
                            <Ionicons name="location-outline" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                            <Text className="text-slate-400 text-sm flex-1" numberOfLines={1}>{item.location}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={14} color="#94a3b8" style={{ marginRight: 6 }} />
                            <Text className="text-slate-400 text-sm">{item.time}</Text>
                        </View>
                    </View>

                    {/* Action */}
                    <View className="pl-2">
                        <Button variant="primary" size="md" fullWidth>
                            Accept Job
                        </Button>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
                <FlashList<typeof jobs[0]>
                    data={jobs}
                    renderItem={renderItem}
                    // @ts-expect-error - FlashList estimatedItemSize match issue
                    estimatedItemSize={280}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={CONTENT_CONTAINER_STYLE}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView >
        </View>
    );
}

const CONTENT_CONTAINER_STYLE = { paddingBottom: 100 };
