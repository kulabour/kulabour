<<<<<<< HEAD
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
=======
import React, { useState, useCallback } from 'react';
import { TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
>>>>>>> a1da97853617b063e925290de903e16ff3c3c152
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
<<<<<<< HEAD
import { FlashList } from '@shopify/flash-list';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import '../../../global.css';
=======
import { Ionicons } from '@expo/vector-icons';
>>>>>>> a1da97853617b063e925290de903e16ff3c3c152

// Enterprise Design System
import { Box } from '../../../components/primitives/Box';
import { Text } from '../../../components/primitives/Text';
import { Card } from '../../../components/design-system/Card';
import { Button } from '../../../components/design-system/Button';

import '../../../global.css';
import { Config } from '../../../Config';

const MOCK_JOBS = [
    {
        id: 1,
        title: 'Emergency Pipe Repair',
        price: '₹549',
        customerName: 'Rajesh Mehta',
        location: 'Koramangala, 4th Block, Flat 402',
<<<<<<< HEAD
        time: 'Today, 2:00 PM',
        status: 'pending',
        distance: '2.5 km',
=======
        time: 'Now • 2.3 km away',
        priority: 'urgent',
        category: 'Plumbing',
>>>>>>> a1da97853617b063e925290de903e16ff3c3c152
    },
    {
        id: 2,
        title: 'Deep Home Cleaning',
        price: '₹1,299',
        customerName: 'Priya Sharma',
        location: 'Indiranagar, Brigade Road, Villa 12',
        time: '3:00 PM • 5.1 km',
        priority: 'medium',
        category: 'Cleaning',
    },
];

export default function WorkerHome() {
    const [isOnline, setIsOnline] = useState(true);
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [jobs, setJobs] = useState(Config.FEATURES.USE_MOCK_DATA ? MOCK_JOBS : []);

<<<<<<< HEAD
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
=======
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (Config.FEATURES.USE_MOCK_DATA) {
            setJobs([...MOCK_JOBS].sort(() => Math.random() - 0.5)); // Shuffle for effect
        } else {
            console.log('Fetching real jobs...');
        }
        setRefreshing(false);
    }, []);

    return (
        <Box className="flex-1 bg-surface-base">
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A3B5D" />
                    }
                >

                    {/* Header Section */}
                    <Box className="px-lg pt-sm pb-lg bg-brand-primary rounded-b-[32px] mb-lg shadow-lg">
                        <Box className="flex-row justify-between items-center mb-lg">
                            <Box className="flex-row items-center gap-md">
                                <Box className="w-12 h-12 rounded-full bg-white/20 items-center justify-center border border-white/30">
                                    <Text className="text-2xl">👷</Text>
                                </Box>
                                <Box>
                                    <Text variant="caption" className="text-white/80">Welcome back,</Text>
                                    <Text variant="h3" className="text-white font-bold">John Doe</Text>
                                </Box>
                            </Box>
                            <Button
                                size="sm"
                                variant={isOnline ? 'solid' : 'outline'}
                                label={isOnline ? 'ONLINE' : 'OFFLINE'}
                                className={isOnline ? 'bg-feedback-success border-transparent' : 'border-white/40'}
                                onPress={() => setIsOnline(!isOnline)}
                                accessibilityLabel={isOnline ? 'Go Offline' : 'Go Online'}
                            />
                        </Box>

                        {/* Stats Row */}
                        <Box className="flex-row gap-md">
                            <Card variant="glass" className="flex-1 bg-white/10 border-white/20">
                                <Text variant="caption" className="text-white/70 uppercase tracking-widest mb-xs">Today</Text>
                                <Text variant="h2" className="text-white font-bold mb-xs">₹3.2K</Text>
                                <Text variant="caption" className="text-feedback-success font-bold">Earnings</Text>
                            </Card>
                            <Card variant="glass" className="flex-1 bg-white/10 border-white/20">
                                <Text variant="caption" className="text-white/70 uppercase tracking-widest mb-xs">Rating</Text>
                                <Text variant="h2" className="text-white font-bold mb-xs">4.9</Text>
                                <Text variant="caption" className="text-brand-accent font-bold">⭐⭐⭐⭐⭐</Text>
                            </Card>
                        </Box>
                    </Box>

                    {/* Jobs Section */}
                    <Box className="px-lg">
                        <Box className="flex-row justify-between items-center mb-md">
                            <Text variant="h3" className="text-text-primary">Available Jobs ({jobs.length})</Text>
                            <Button variant="ghost" label="See All" size="sm" className="!px-0" />
                        </Box>

                        <Box className="space-y-md">
                            {jobs.length === 0 ? (
                                <Box className="p-xl items-center justify-center bg-surface-subtle rounded-xl border border-dashed border-border-subtle">
                                    <Text className="text-text-tertiary mb-sm">No jobs available</Text>
                                    <Button variant="outline" size="sm" label="Refresh" onPress={onRefresh} />
                                </Box>
                            ) : (
                                jobs.map((job) => (
                                    <TouchableOpacity
                                        key={job.id}
                                        activeOpacity={0.9}
                                        onPress={() => router.push(`/(worker)/job/${job.id}`)}
                                        accessibilityLabel={`View job: ${job.title}`}
                                    >
                                        <Card variant="elevated" className="border-l-4 border-l-brand-primary">
                                            <Box className="flex-row justify-between items-start mb-sm">
                                                <Box className="bg-brand-primary/10 px-sm py-xs rounded-md">
                                                    <Text variant="caption" className="text-brand-primary font-bold uppercase">{job.category}</Text>
                                                </Box>
                                                <Text variant="h3" className="text-brand-primary font-bold">{job.price}</Text>
                                            </Box>

                                            <Text variant="h3" className="mb-xs text-text-primary">{job.title}</Text>
                                            <Text variant="body" className="text-text-secondary mb-md">{job.customerName}</Text>

                                            <Box className="space-y-xs pt-sm border-t border-border-subtle">
                                                <Box className="flex-row items-center gap-xs">
                                                    <Text className="text-sm">📍</Text>
                                                    <Text variant="caption" className="text-text-tertiary flex-1" numberOfLines={1}>{job.location}</Text>
                                                </Box>
                                                <Box className="flex-row items-center gap-xs">
                                                    <Text className="text-sm">⏰</Text>
                                                    <Text variant="caption" className="text-text-tertiary">{job.time}</Text>
                                                </Box>
                                            </Box>

                                            <Button
                                                label="Accept Job"
                                                variant="solid"
                                                fullWidth
                                                className="mt-md"
                                                onPress={() => router.push(`/(worker)/job/${job.id}`)}
                                                accessibilityLabel={`Accept ${job.title}`}
                                            />
                                        </Card>
                                    </TouchableOpacity>
                                ))
                            )}
                        </Box>
                    </Box>

                </ScrollView>
            </SafeAreaView>
        </Box>
    );
}
>>>>>>> a1da97853617b063e925290de903e16ff3c3c152
