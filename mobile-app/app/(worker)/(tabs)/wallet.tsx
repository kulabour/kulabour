import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import '../../../global.css';

export default function Wallet() {
    const availableBalance = 15420;
    const pendingClearance = 2850;
    const totalEarnings = 67890;

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <Text className="text-white text-3xl font-bold">Wallet</Text>
                </View>

                {/* Balance Card */}
                <View className="px-6 mb-6">
                    <Card variant="glass" shadow="3d" glassmorphism>
                        <View className="items-center py-6">
                            <Text className="text-white/60 text-sm mb-2 uppercase tracking-wide">
                                Available Balance
                            </Text>
                            <Text className="text-neon-green text-6xl font-bold mb-6">
                                ₹{availableBalance.toLocaleString('en-IN')}
                            </Text>
                            <View className="w-full">
                                <Button variant="success" size="lg" glow fullWidth>
                                    Withdraw Money
                                </Button>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Quick Stats */}
                <View className="px-6 mb-6">
                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <Card variant="default">
                                <Text className="text-white/50 text-xs mb-2">
                                    Pending Clearance
                                </Text>
                                <Text className="text-warning text-2xl font-bold">
                                    ₹{pendingClearance.toLocaleString('en-IN')}
                                </Text>
                                <Text className="text-white/40 text-xs mt-1">
                                    Clears in 2 days
                                </Text>
                            </Card>
                        </View>
                        <View className="flex-1">
                            <Card variant="default">
                                <Text className="text-white/50 text-xs mb-2">
                                    Total Earnings
                                </Text>
                                <Text className="text-neon-blue text-2xl font-bold">
                                    ₹{totalEarnings.toLocaleString('en-IN')}
                                </Text>
                                <Text className="text-white/40 text-xs mt-1">
                                    All time
                                </Text>
                            </Card>
                        </View>
                    </View>
                </View>

                {/* Payment Method */}
                <View className="px-6 mb-6">
                    <Text className="text-white text-xl font-bold mb-4">
                        Payment Method
                    </Text>
                    <Card>
                        <View className="flex-row items-center mb-3">
                            <View className="w-12 h-12 bg-neon-blue/20 rounded-full items-center justify-center mr-4">
                                <Text className="text-2xl">🏦</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base mb-1">
                                    HDFC Bank
                                </Text>
                                <Text className="text-white/50 text-sm">
                                    •••• •••• •••• 4567
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-neon-blue text-sm font-semibold">
                                    Change
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-white/5 rounded-xl p-3">
                            <Text className="text-white/50 text-xs mb-1">Account Holder</Text>
                            <Text className="text-white font-semibold">John Doe</Text>
                        </View>
                    </Card>
                </View>

                {/* Withdrawal History */}
                <View className="px-6 pb-6">
                    <Text className="text-white text-xl font-bold mb-4">
                        Withdrawal History
                    </Text>

                    <Card className="mb-3">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base mb-1">
                                    Withdrawal
                                </Text>
                                <Text className="text-white/50 text-sm">
                                    Dec 20, 2024 • HDFC Bank
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-bold text-xl">
                                    ₹10,000
                                </Text>
                                <View className="bg-success/20 px-2 py-0.5 rounded-md mt-1">
                                    <Text className="text-success text-xs font-bold">SUCCESS</Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    <Card className="mb-3">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base mb-1">
                                    Withdrawal
                                </Text>
                                <Text className="text-white/50 text-sm">
                                    Dec 15, 2024 • HDFC Bank
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-bold text-xl">
                                    ₹8,500
                                </Text>
                                <View className="bg-success/20 px-2 py-0.5 rounded-md mt-1">
                                    <Text className="text-success text-xs font-bold">SUCCESS</Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    <Card>
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base mb-1">
                                    Withdrawal
                                </Text>
                                <Text className="text-white/50 text-sm">
                                    Dec 10, 2024 • HDFC Bank
                                </Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-bold text-xl">
                                    ₹12,000
                                </Text>
                                <View className="bg-success/20 px-2 py-0.5 rounded-md mt-1">
                                    <Text className="text-success text-xs font-bold">SUCCESS</Text>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
