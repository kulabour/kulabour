import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Avatar from '../../../components/ui/Avatar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" />
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center rounded-full bg-slate-800 border border-white/10"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-lg font-bold">Job #{jobDetails.id}829</Text>
                        <View className="w-10" />
                    </View>

                    {/* Customer Info Card */}
                    <View className="px-6 mb-6">
                        <View className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex-row items-center">
                            <Avatar name={jobDetails.customerName} size="md" />
                            <View className="ml-4 flex-1">
                                <Text className="text-white text-lg font-bold mb-0.5">{jobDetails.customerName}</Text>
                                <Text className="text-slate-400 text-sm">Customer • 4.8★</Text>
                            </View>
                            <TouchableOpacity className="w-12 h-12 bg-emerald-500/10 rounded-full items-center justify-center border border-emerald-500/20">
                                <Ionicons name="call" size={20} color="#34d399" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Main Job Card */}
                    <View className="px-6 mb-6">
                        <LinearGradient
                            colors={['#1e293b', '#0f172a']}
                            className="rounded-3xl p-5 border border-white/5 relative overflow-hidden"
                        >
                            {/* Urgent Stripe */}
                            {jobDetails.priority === 'urgent' && (
                                <View className="absolute top-0 right-0 bg-red-500 px-3 py-1 rounded-bl-xl">
                                    <Text className="text-white text-xs font-bold uppercase">Urgent</Text>
                                </View>
                            )}

                            <View className="flex-row items-center gap-2 mb-3">
                                <View className="bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                                    <Text className="text-blue-400 text-xs font-bold uppercase tracking-wide">{jobDetails.category}</Text>
                                </View>
                            </View>

                            <Text className="text-white text-2xl font-bold mb-1">{jobDetails.title}</Text>
                            <Text className="text-slate-400 text-sm mb-6">{jobDetails.serviceType}</Text>

                            <View className="bg-slate-900/50 rounded-xl p-4 border border-white/5 space-y-4">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons name="cash-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-400 text-sm">Price</Text>
                                    </View>
                                    <Text className="text-emerald-400 font-bold text-xl">{jobDetails.price}</Text>
                                </View>
                                <View className="h-px bg-white/5" />
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons name="time-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-400 text-sm">Duration</Text>
                                    </View>
                                    <Text className="text-white font-semibold text-sm">{jobDetails.estimatedDuration}</Text>
                                </View>
                                <View className="h-px bg-white/5" />
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <Ionicons name="wallet-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
                                        <Text className="text-slate-400 text-sm">Payment</Text>
                                    </View>
                                    <Text className="text-white font-semibold text-sm">{jobDetails.paymentMode}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Location & Details */}
                    <View className="px-6 mb-24 space-y-4">
                        <View className="bg-slate-800/40 rounded-2xl p-5 border border-white/5">
                            <Text className="text-white font-bold text-lg mb-3">Location</Text>
                            <View className="flex-row items-center mb-3">
                                <Ionicons name="location" size={20} color="#3b82f6" style={{ marginRight: 8 }} />
                                <Text className="text-slate-300 text-sm flex-1">{jobDetails.fullAddress}</Text>
                            </View>
                            <View className="bg-slate-700/50 h-32 rounded-xl items-center justify-center border border-white/5">
                                <Text className="text-slate-500 text-xs">Map View Placeholder</Text>
                            </View>
                        </View>

                        <View className="bg-slate-800/40 rounded-2xl p-5 border border-white/5">
                            <Text className="text-white font-bold text-lg mb-2">Description</Text>
                            <Text className="text-slate-400 text-sm leading-6">{jobDetails.description}</Text>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>

            {/* Bottom Actions */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#020617]/90 blur-xl pt-4 pb-8 px-6 border-t border-white/5 flex-row gap-4">
                <TouchableOpacity className="flex-1 bg-slate-800 py-4 rounded-xl border border-white/10 items-center">
                    <Text className="text-white font-bold text-lg">Ignore</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-[2] bg-blue-600 py-4 rounded-xl items-center shadow-lg shadow-blue-500/20">
                    <Text className="text-white font-bold text-lg">Accept Job</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
