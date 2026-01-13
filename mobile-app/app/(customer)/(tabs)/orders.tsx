// Orders Screen
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import Card from '../../../components/ui/GlassCard';
import StatusBadge from '../../../components/ui/StatusBadge';
import Avatar from '../../../components/ui/Avatar';
import FilterChip from '../../../components/ui/FilterChip';
import '../../../global.css';

const ordersData = [
    {
        id: 1,
        service: 'Emergency Plumbing',
        worker: 'Rajesh Kumar',
        status: 'active',
        date: 'Today, 3:00 PM',
        price: '₹549',
        address: 'Koramangala, 4th Block',
    },
    {
        id: 2,
        service: 'House Cleaning',
        worker: 'Priya Sharma',
        status: 'completed',
        date: 'Yesterday, 10:00 AM',
        price: '₹1,299',
        address: 'Indiranagar, Villa 12',
    },
    {
        id: 3,
        service: 'Fan Installation',
        worker: 'Amit Patel',
        status: 'completed',
        date: '3 days ago',
        price: '₹399',
        address: 'HSR Layout, Sector 2',
    },
];

export default function Orders() {
    const [filter, setFilter] = useState<'active' | 'past'>('active');

    const filteredOrders =
        filter === 'active'
            ? ordersData.filter((o) => o.status === 'active')
            : ordersData.filter((o) => o.status === 'completed');

    const renderHeader = () => (
        <View className="px-6 pt-4 pb-6">
            <Text className="text-white text-3xl font-bold mb-6">My Orders</Text>

            {/* Filter Tabs */}
            <View className="flex-row gap-3">
                <FilterChip
                    label="Active"
                    selected={filter === 'active'}
                    onPress={() => setFilter('active')}
                />
                <FilterChip
                    label="Past Orders"
                    selected={filter === 'past'}
                    onPress={() => setFilter('past')}
                />
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View className="px-6">
            <Card className="items-center py-12">
                <Text className="text-6xl mb-4">📦</Text>
                <Text className="text-white text-lg font-bold mb-2">
                    No {filter} orders
                </Text>
                <Text className="text-white/50 text-sm text-center">
                    {filter === 'active'
                        ? 'You have no active bookings at the moment'
                        : 'Your completed orders will appear here'}
                </Text>
            </Card>
        </View>
    );

    const renderItem = ({ item }: { item: typeof ordersData[0] }) => (
        <View className="px-6 mb-4">
            <TouchableOpacity activeOpacity={0.8}>
                <Card variant="default" shadow="md">
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold mb-2">
                                {item.service}
                            </Text>
                            <StatusBadge
                                status={item.status as 'active' | 'completed' | 'cancelled'}
                                size="sm"
                            />
                        </View>
                        <Text className="text-neon-green text-xl font-bold">
                            {item.price}
                        </Text>
                    </View>

                    {/* Worker Info */}
                    {item.worker && (
                        <View className="flex-row items-center mb-3">
                            <Avatar name={item.worker} size="sm" />
                            <View className="ml-3 flex-1">
                                <Text className="text-white/50 text-xs mb-1">
                                    Worker
                                </Text>
                                <Text className="text-white font-semibold">
                                    {item.worker}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Details */}
                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <Text className="text-lg mr-2">📍</Text>
                            <Text className="text-white/60 text-sm flex-1">
                                {item.address}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-lg mr-2">📅</Text>
                            <Text className="text-white/60 text-sm">
                                {item.date}
                            </Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View className="flex-row gap-2 mt-4">
                        {item.status === 'active' ? (
                            <>
                                <TouchableOpacity className="flex-1 bg-neon-blue rounded-xl py-2.5 items-center">
                                    <Text className="text-white font-bold">
                                        Track Order
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-white/10 border border-white/20 rounded-xl py-2.5 items-center">
                                    <Text className="text-white font-bold">
                                        Contact
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity className="flex-1 bg-white/10 border border-white/20 rounded-xl py-2.5 items-center">
                                    <Text className="text-white font-bold">
                                        View Invoice
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-neon-blue/20 border border-neon-blue rounded-xl py-2.5 items-center">
                                    <Text className="text-neon-blue font-bold">
                                        Rebook
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <FlashList
                data={filteredOrders}
                renderItem={renderItem}
                // @ts-expect-error -- FlashList estimatedItemSize match issue
                estimatedItemSize={300}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </SafeAreaView>
    );
}
