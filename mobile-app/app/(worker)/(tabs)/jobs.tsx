import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { LinearGradient } from 'expo-linear-gradient';
import '../../../global.css';

const JOB_TABS = ['Active', 'Pending', 'Completed', 'Cancelled'] as const;
type JobStatus = typeof JOB_TABS[number];

interface Job {
    id: string;
    title: string;
    customer: string;
    location: string;
    price: number;
    date: string;
    status: JobStatus;
    urgent?: boolean;
}

const MOCK_JOBS: Job[] = [
    { id: '1', title: 'Leaking Tap Repair', customer: 'Rahul M.', location: 'Andheri West', price: 450, date: 'Today, 2:00 PM', status: 'Active', urgent: true },
    { id: '2', title: 'Kitchen Cleaning', customer: 'Priya S.', location: 'Bandra East', price: 1200, date: 'Tommorow, 10:00 AM', status: 'Pending' },
    { id: '3', title: 'Fan Installation', customer: 'Amit K.', location: 'Juhu', price: 300, date: 'Yesterday', status: 'Completed' },
    { id: '4', title: 'Bathroom Plumbing', customer: 'Raj R.', location: 'Dadar', price: 800, date: 'Dec 12, 2024', status: 'Completed' },
    { id: '5', title: 'Sofa Cleaning', customer: 'Meera P.', location: 'Powai', price: 1500, date: 'Dec 10, 2024', status: 'Cancelled' },
];

export default function MyJobs() {
    const [activeTab, setActiveTab] = useState<JobStatus>('Active');
    const router = useRouter();

    const filteredJobs = MOCK_JOBS.filter(job => job.status === activeTab);

    const renderJobCard = ({ item }: { item: Job }) => {
        const isActive = item.status === 'Active';

        return (
            <TouchableOpacity
                onPress={() => router.push(`/(worker)/job/${item.id}`)}
                className="mb-4"
                activeOpacity={0.8}
            >
                <View className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50">
                    {isActive && (
                        <LinearGradient
                            colors={['rgba(59, 130, 246, 0.1)', 'transparent']}
                            className="absolute inset-0"
                        />
                    )}

                    <View className="p-4">
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1 mr-4">
                                <Text className="text-white text-lg font-bold mb-1">{item.title}</Text>
                                <View className="flex-row items-center">
                                    <Ionicons name="location-outline" size={14} color="#94a3b8" />
                                    <Text className="text-slate-400 text-xs ml-1">{item.location}</Text>
                                </View>
                            </View>
                            <View className="flex-col items-end">
                                <View className={clsx(
                                    "px-2 py-1 rounded-md mb-1",
                                    item.status === 'Active' && "bg-blue-500/20",
                                    item.status === 'Pending' && "bg-amber-500/20",
                                    item.status === 'Completed' && "bg-emerald-500/20",
                                    item.status === 'Cancelled' && "bg-rose-500/20",
                                )}>
                                    <Text className={clsx(
                                        "text-xs font-bold",
                                        item.status === 'Active' && "text-blue-400",
                                        item.status === 'Pending' && "text-amber-400",
                                        item.status === 'Completed' && "text-emerald-400",
                                        item.status === 'Cancelled' && "text-rose-400",
                                    )}>{item.status}</Text>
                                </View>
                                <Text className="text-white font-bold text-base">₹{item.price}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between border-t border-white/5 pt-3 mt-1">
                            <View className="flex-row items-center">
                                <View className="w-6 h-6 rounded-full bg-slate-700 items-center justify-center mr-2">
                                    <Text className="text-xs text-white bg-transparent">{item.customer.charAt(0)}</Text>
                                </View>
                                <Text className="text-slate-300 text-sm">{item.customer}</Text>
                            </View>
                            <Text className="text-slate-500 text-xs">{item.date}</Text>
                        </View>
                    </View>

                    {isActive && (
                        <LinearGradient
                            colors={['transparent', 'rgba(59, 130, 246, 0.05)']}
                            className="absolute bottom-0 w-full h-1"
                        />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
            <View className="px-6 pt-2 pb-4">
                <Text className="text-white text-2xl font-bold">My Jobs</Text>
            </View>

            {/* Tabs */}
            <View className="px-6 mb-6">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3">
                    {JOB_TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={clsx(
                                "px-4 py-2 rounded-full border mr-3",
                                activeTab === tab
                                    ? "bg-blue-600 border-blue-500"
                                    : "bg-slate-900 border-slate-800"
                            )}
                        >
                            <Text className={clsx(
                                "font-semibold text-sm",
                                activeTab === tab ? "text-white" : "text-slate-400"
                            )}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Job List */}
            <FlatList
                data={filteredJobs}
                renderItem={renderJobCard}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <View className="w-16 h-16 bg-slate-900 rounded-full items-center justify-center mb-4">
                            <Ionicons name="document-text-outline" size={32} color="#475569" />
                        </View>
                        <Text className="text-slate-500 font-medium">No {activeTab.toLowerCase()} jobs</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
