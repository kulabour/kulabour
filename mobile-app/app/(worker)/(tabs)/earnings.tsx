import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Card from '../../../components/ui/Card';
import FilterChip from '../../../components/ui/FilterChip';
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
        <SafeAreaView className="flex-1 bg-dark-navy">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <Text className="text-white text-3xl font-bold mb-6">Earnings</Text>

                    {/* Period Filter */}
                    <View className="flex-row gap-2">
                        <FilterChip
                            label="Today"
                            selected={period === 'today'}
                            onPress={() => setPeriod('today')}
                        />
                        <FilterChip
                            label="This Week"
                            selected={period === 'week'}
                            onPress={() => setPeriod('week')}
                        />
                        <FilterChip
                            label="This Month"
                            selected={period === 'month'}
                            onPress={() => setPeriod('month')}
                        />
                    </View>
                </View>

                {/* Total Earnings Card */}
                <View className="px-6 mb-6">
                    <Card variant="gradient" shadow="3d">
                        <View className="items-center py-4">
                            <Text className="text-white/60 text-sm mb-2 uppercase tracking-wide">
                                Total Earnings
                            </Text>
                            <Text className="text-neon-green text-5xl font-bold mb-4">
                                ₹{stats.amount.toLocaleString('en-IN')}
                            </Text>
                            <View className="flex-row gap-4">
                                <View className="items-center">
                                    <Text className="text-white text-2xl font-bold">
                                        {stats.jobs}
                                    </Text>
                                    <Text className="text-white/50 text-xs">Jobs</Text>
                                </View>
                                <View className="w-px bg-white/20 h-10" />
                                <View className="items-center">
                                    <Text className="text-success text-2xl font-bold">
                                        {stats.trend}
                                    </Text>
                                    <Text className="text-white/50 text-xs">Growth</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Stats Grid */}
                <View className="px-6 mb-6">
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <Card>
                                <Text className="text-white/50 text-xs mb-2">Avg/Job</Text>
                                <Text className="text-white text-2xl font-bold">
                                    ₹{Math.round(stats.amount / stats.jobs)}
                                </Text>
                            </Card>
                        </View>
                        <View className="flex-1">
                            <Card>
                                <Text className="text-white/50 text-xs mb-2">Completed</Text>
                                <Text className="text-success text-2xl font-bold">
                                    {stats.jobs}
                                </Text>
                            </Card>
                        </View>
                    </View>
                </View>

                {/* Earnings Graph Placeholder */}
                <View className="px-6 mb-6">
                    <Card variant="elevated" shadow="medium">
                        <Text className="text-white font-bold text-lg mb-4">
                            Earnings Trend
                        </Text>
                        <View className="h-48 items-center justify-center bg-dark-obsidian rounded-xl">
                            <Text className="text-white/30 text-sm mb-2">📈</Text>
                            <Text className="text-white/50 text-xs">Graph visualization</Text>
                        </View>
                    </Card>
                </View>

                {/* Recent Transactions */}
                <View className="px-6 pb-6">
                    <Text className="text-white text-xl font-bold mb-4">
                        Recent Transactions
                    </Text>
                    {transactions.map((transaction) => (
                        <TouchableOpacity key={transaction.id} activeOpacity={0.8}>
                            <Card className="mb-3">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-base mb-1">
                                            {transaction.service}
                                        </Text>
                                        <Text className="text-white/50 text-sm">
                                            {transaction.date}
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-success font-bold text-xl">
                                            +₹{transaction.amount}
                                        </Text>
                                        <View className="bg-success/20 px-2 py-0.5 rounded-md mt-1">
                                            <Text className="text-success text-xs font-bold uppercase">
                                                Paid
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
