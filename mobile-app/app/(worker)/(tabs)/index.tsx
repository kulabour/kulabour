import React, { useState, useCallback } from 'react';
import { TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

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
        time: 'Now • 2.3 km away',
        priority: 'urgent',
        category: 'Plumbing',
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
