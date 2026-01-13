import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import '../../../global.css';

const earningsData = {
    today: { amount: 3245, jobs: 7, trend: '+12%' },
    week: { amount: 18650, jobs: 42, trend: '+8%' },
    month: { amount: 67890, jobs: 156, trend: '+15%' },
};

const transactions = [
    {
        id: 1,
        date: 'Today, 4:30 PM',
        service: 'Emergency Pipe Repair',
        amount: 549,
        status: 'completed',
    },
    {
        id: 2,
        date: 'Today, 2:15 PM',
        service: 'Ceiling Fan Installation',
        amount: 399,
        status: 'completed',
    },
    {
        id: 3,
        date: 'Today, 11:00 AM',
        service: 'Home Cleaning',
        amount: 1299,
        status: 'completed',
    },
    {
        id: 4,
        date: 'Yesterday, 5:45 PM',
        service: 'Electric Repair',
        amount: 650,
        status: 'completed',
    },
];

export default function Earnings() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
    const stats = earningsData[period];

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" />
            {/* Background Effects */}
            <View className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <View className="absolute top-0 right-0 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
            </View>

            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className="px-6 pt-4 pb-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-3xl font-bold">Earnings</Text>
                            <TouchableOpacity className="bg-slate-800 p-2 rounded-full border border-white/10">
                                <Ionicons name="download-outline" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* Period Filter */}
                        <View className="flex-row gap-2 bg-slate-800/50 p-1 rounded-2xl border border-white/5 self-start mb-6">
                            {(['today', 'week', 'month'] as const).map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    onPress={() => setPeriod(p)}
                                    className={`px-4 py-1.5 rounded-xl ${period === p ? 'bg-slate-700 shadow-sm' : 'bg-transparent'}`}
                                >
                                    <Text className={`text-sm font-semibold capitalize ${period === p ? 'text-white' : 'text-slate-500'}`}>
                                        {p === 'today' ? 'Today' : p === 'week' ? 'Week' : 'Month'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Total Earnings Card */}
                        <LinearGradient
                            colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                            className="rounded-3xl p-1 border border-emerald-500/20 mb-8"
                        >
                            <View className="bg-[#0f172a]/80 backdrop-blur-md rounded-[22px] p-6 relative overflow-hidden">
                                <View className="absolute right-0 top-0 p-6 opacity-20">
                                    <Ionicons name="trending-up" size={80} color="#10b981" />
                                </View>

                                <Text className="text-slate-400 text-sm mb-2 font-medium uppercase tracking-wider">Total Earnings</Text>
                                <Text className="text-5xl font-bold text-white mb-6">
                                    ₹{stats.amount.toLocaleString('en-IN')}
                                </Text>

                                <View className="flex-row gap-8 border-t border-white/5 pt-4">
                                    <View>
                                        <Text className="text-slate-400 text-xs mb-1">Jobs Completed</Text>
                                        <Text className="text-white text-xl font-bold">{stats.jobs}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-slate-400 text-xs mb-1">Growth</Text>
                                        <Text className="text-emerald-400 text-xl font-bold">{stats.trend}</Text>
                                    </View>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Stats Grid */}
                        <View className="flex-row gap-3 mb-8">
                            <View className="flex-1 bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                                <Text className="text-slate-500 text-xs mb-2 uppercase font-bold">Avg/Job</Text>
                                <Text className="text-white text-2xl font-bold">
                                    ₹{Math.round(stats.amount / stats.jobs)}
                                </Text>
                            </View>
                            <View className="flex-1 bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                                <Text className="text-slate-500 text-xs mb-2 uppercase font-bold">Pending</Text>
                                <Text className="text-amber-400 text-2xl font-bold">
                                    ₹1,250
                                </Text>
                            </View>
                        </View>

                        {/* Recent Transactions */}
                        <Text className="text-white text-lg font-bold mb-4">Recent Transactions</Text>
                        <View className="space-y-3">
                            {transactions.map((transaction) => (
                                <TouchableOpacity
                                    key={transaction.id}
                                    activeOpacity={0.7}
                                    className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 flex-row items-center justify-between"
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-10 h-10 rounded-full bg-slate-700/50 items-center justify-center mr-3 border border-white/5">
                                            <Ionicons
                                                name={transaction.service.includes("Pipe") ? "water-outline" : "flash-outline"}
                                                size={18}
                                                color="#cbd5e1"
                                            />
                                        </View>
                                        <View className="flex-1 mr-2">
                                            <Text className="text-white font-bold text-sm mb-0.5">{transaction.service}</Text>
                                            <Text className="text-slate-500 text-xs">{transaction.date}</Text>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-emerald-400 font-bold text-lg">+₹{transaction.amount}</Text>
                                        <View className="bg-emerald-500/10 px-1.5 py-0.5 rounded ml-auto mt-0.5 border border-emerald-500/20">
                                            <Text className="text-emerald-500 text-[10px] uppercase font-bold">Paid</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
