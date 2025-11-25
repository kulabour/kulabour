import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import JobCard from '../../../components/worker/JobCard';
import Avatar from '../../../components/ui/Avatar';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import '../../../global.css';

const jobs = [
    {
        id: 1,
        title: 'Emergency Pipe Repair',
        price: '₹549',
        customerName: 'Rajesh Mehta',
        location: 'Koramangala, 4th Block, Flat 402',
        time: 'Now • 2.3 km away',
        priority: 'urgent' as const,
        category: 'Plumbing',
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
                        <Text className="text-white/60 text-sm mb-1">Welcome back,</Text>
                        <Text className="text-white text-2xl font-bold">John Doe</Text>
                        <StatusBadge status={isOnline ? 'online' : 'offline'} size="sm" />
                    </View>
                </View>
                <TouchableOpacity
                    className={`px-4 py-2.5 rounded-pill ${isOnline ? 'bg-success/20 border-2 border-success' : 'bg-white/5 border-2 border-white/20'}`}
                    onPress={() => setIsOnline(!isOnline)}
                >
                    <Text className={`font-bold text-sm ${isOnline ? 'text-success' : 'text-white/50'}`}>
                        {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-6">
                <Card className="flex-1" shadow="md">
                    <Text className="text-white/50 text-xs mb-2 uppercase tracking-wide">Today's Jobs</Text>
                    <Text className="text-white text-3xl font-bold mb-1">7</Text>
                    <Text className="text-success text-sm font-semibold">+2 from yesterday</Text>
                </Card>
                <Card className="flex-1" shadow="md">
                    <Text className="text-white/50 text-xs mb-2 uppercase tracking-wide">Earnings</Text>
                    <Text className="text-neon-green text-3xl font-bold mb-1">₹3.2K</Text>
                    <Text className="text-white/50 text-sm">Today</Text>
                </Card>
            </View>

            {/* Rating Card */}
            <Card variant="gradient" shadow="md" className="mb-8">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-white/60 text-sm mb-1">Your Rating</Text>
                        <Text className="text-white text-4xl font-bold">4.9</Text>
                    </View>
                    <View className="items-end">
                        <Text className="text-yellow-400 text-3xl mb-1">⭐⭐⭐⭐⭐</Text>
                        <Text className="text-white/60 text-sm">248 reviews</Text>
                    </View>
                </View>
                <TouchableOpacity className="mt-4 bg-neon-blue/20 rounded-pill py-2 items-center">
                    <Text className="text-neon-blue font-semibold text-sm">View Reviews</Text>
                </TouchableOpacity>
            </Card>

            {/* Available Jobs Header */}
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-white text-2xl font-bold">Available Jobs</Text>
                    <Text className="text-white/50 text-sm mt-1">{jobs.length} jobs near you</Text>
                </View>
                <TouchableOpacity>
                    <Text className="text-neon-blue text-sm font-semibold">See All</Text>
                </TouchableOpacity>
            </View>
        </View>
    ), [isOnline]);

    const renderItem = ({ item }: { item: typeof jobs[0] }) => (
        <View className="px-6 mb-4">
            <TouchableOpacity onPress={() => router.push(`/(worker)/job/${item.id}`)} activeOpacity={0.8}>
                <Card shadow="md">
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <View className="flex-row items-center mb-2">
                                <StatusBadge status={item.priority} size="sm" />
                                <View className="ml-2 bg-neon-blue/20 px-2 py-1 rounded-md">
                                    <Text className="text-neon-blue text-xs font-bold">{item.category}</Text>
                                </View>
                            </View>
                            <Text className="text-white text-lg font-bold mb-1">{item.title}</Text>
                            <Text className="text-white/60 text-sm">{item.customerName}</Text>
                        </View>
                        <View className="bg-neon-green/20 px-4 py-2 rounded-xl">
                            <Text className="text-neon-green font-bold text-lg">{item.price}</Text>
                        </View>
                    </View>

                    {/* Details */}
                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <Text className="text-xl mr-2">📍</Text>
                            <Text className="text-white/70 text-sm flex-1">{item.location}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-xl mr-2">⏰</Text>
                            <Text className="text-white/70 text-sm">{item.time}</Text>
                        </View>
                    </View>

                    {/* Action */}
                    <View className="mt-4">
                        <Button variant="primary" size="md" glow fullWidth>
                            Accept Job
                        </Button>
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <FlashList<typeof jobs[0]>
                data={jobs}
                renderItem={renderItem}
                // @ts-ignore: estimatedItemSize is missing from types in v2.0.2
                estimatedItemSize={280}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={CONTENT_CONTAINER_STYLE}
            />
        </SafeAreaView >
    );
}

const CONTENT_CONTAINER_STYLE = { paddingBottom: 24 };
