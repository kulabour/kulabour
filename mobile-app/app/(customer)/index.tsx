import { ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api/client';
import '../../global.css';

// Enterprise Components
import { Box } from '../../components/primitives/Box';
import { Text } from '../../components/primitives/Text';
import { Input } from '../../components/design-system/Input';
import { Card } from '../../components/design-system/Card';
import { Button } from '../../components/design-system/Button';

const localImages: Record<string, any> = {
    'Cleaning': require('../../assets/3d/cleaning_icon_3d_1763842077573.png'),
    'Plumbing': require('../../assets/3d/plumbing_icon_3d_1763842092010.png'),
    'Electrical': require('../../assets/3d/electrical_icon_3d_1763842106305.png'),
    'Painting': require('../../assets/3d/painting_icon_3d_1763842121533.png'),
};

export default function CustomerHome() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await apiClient.get<any[]>('/api/services');
            if (response.success && response.data) {
                setServices(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="flex-1 bg-surface-base">
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <Box className="px-lg pt-sm pb-lg">
                        <Box className="flex-row justify-between items-center mb-lg">
                            <Box>
                                <Text variant="caption" className="text-text-secondary mb-1">Hello,</Text>
                                <Text variant="h2" className="text-text-primary">Anil Kumar</Text>
                            </Box>
                            <TouchableOpacity
                                accessibilityLabel="Notifications"
                                accessibilityRole="button"
                                className="w-12 h-12 rounded-full bg-surface-subtle border border-border-subtle items-center justify-center shadow-sm"
                            >
                                <Text className="text-xl">🔔</Text>
                            </TouchableOpacity>
                        </Box>

                        {/* Search Bar */}
                        <Input
                            placeholder="Search services..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            leftIcon={<Text className="text-xl">🔍</Text>}
                            containerClassName="h-[56px] shadow-sm bg-surface-base border-border-subtle"
                            accessibilityLabel="Search services"
                        />
                    </Box>

                    {/* Popular Services Banner */}
                    <Box className="px-lg mb-xl">
                        <Card variant="filled" className="bg-brand-secondary/5 border-brand-primary/20 relative overflow-hidden">
                            <Box className="absolute right-0 top-0 w-32 h-32 bg-brand-primary/10 rounded-full translate-x-1/3 -translate-y-1/3" />

                            <Text variant="caption" className="text-brand-primary font-bold mb-xs uppercase tracking-wide">⚡ Popular</Text>
                            <Text variant="h3" className="text-text-primary mb-xs">Emergency Plumbing</Text>
                            <Text variant="body" className="text-text-secondary text-sm mb-md">Available 24/7 • Avg response: 15 mins</Text>

                            <Button
                                label="Book Now"
                                size="sm"
                                variant="solid"
                                accessibilityLabel="Book Emergency Plumbing"
                                onPress={() => router.push('/(customer)/booking')}
                            />
                        </Card>
                    </Box>

                    {/* Categories */}
                    <Box className="px-lg mb-lg">
                        <Box className="flex-row justify-between items-center mb-md">
                            <Text variant="h3">Services</Text>
                            <Button
                                variant="ghost"
                                label="See All"
                                size="sm"
                                className="!px-0"
                                accessibilityLabel="View all services"
                            />
                        </Box>

                        {loading ? (
                            <Box className="flex-row flex-wrap justify-between">
                                {[1, 2, 3, 4].map((i) => (
                                    <Box key={i} className="w-[48%] h-40 bg-surface-muted rounded-xl mb-md animate-pulse" />
                                ))}
                            </Box>
                        ) : (
                            <Box className="flex-row flex-wrap justify-between">
                                {services.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={{ width: '48%', marginBottom: 16 }}
                                        onPress={() => router.push('/(customer)/booking')}
                                        activeOpacity={0.9}
                                        accessibilityRole="button"
                                        accessibilityLabel={`Book ${category.name}`}
                                    >
                                        <Card variant="elevated" className="items-center p-lg h-full justify-between">
                                            <Box className="items-center mb-sm h-24 justify-center">
                                                {localImages[category.name] ? (
                                                    <Image
                                                        source={localImages[category.name]}
                                                        className="w-20 h-20"
                                                        resizeMode="contain"
                                                    />
                                                ) : (
                                                    <Text className="text-5xl">{category.icon}</Text>
                                                )}
                                            </Box>
                                            <Box className="items-center w-full">
                                                <Text variant="body" className="font-bold text-center mb-xs" numberOfLines={1}>
                                                    {category.name}
                                                </Text>
                                                <Box className="flex-row w-full justify-between items-center pt-xs border-t border-border-subtle">
                                                    <Text variant="caption" className="text-text-tertiary">{category.workers} active</Text>
                                                    <Text variant="caption" className="text-feedback-success font-bold">{category.avgPrice}</Text>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </TouchableOpacity>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Recent Bookings */}
                    <Box className="px-lg pb-xl">
                        <Text variant="h3" className="mb-md">Recent Activity</Text>
                        <Card variant="outlined" className="flex-row items-center p-md">
                            <Box className="w-12 h-12 bg-surface-muted rounded-full items-center justify-center mr-md">
                                <Text className="text-xl">🔧</Text>
                            </Box>
                            <Box className="flex-1">
                                <Text variant="body" className="font-bold mb-xs">Pipe Repair</Text>
                                <Text variant="caption" className="text-text-tertiary">Completed • 2 days ago</Text>
                            </Box>
                            <Text variant="body" className="text-text-primary font-bold">₹499</Text>
                        </Card>
                    </Box>
                </ScrollView>
            </SafeAreaView>
        </Box>
    );
}
