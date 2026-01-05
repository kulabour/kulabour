import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import StatusBadge from '../../components/ui/StatusBadge';
import { apiClient, BookingResponse } from '../../services/api/client';
import '../../global.css';

const services = [
    { id: 1, name: 'Leaking Tap Repair', price: 199, duration: '30 mins', popular: true },
    { id: 2, name: 'Pipe Replacement', price: 499, duration: '1-2 hours', popular: false },
    { id: 3, name: 'Drain Cleaning', price: 299, duration: '45 mins', popular: false },
    { id: 4, name: 'Bathroom Fitting', price: 799, duration: '2-3 hours', popular: false },
    { id: 5, name: 'Emergency Service', price: 899, duration: '15 mins arrival', popular: true },
];

const addons = [
    { id: 1, name: 'Same Day Service', price: 99 },
    { id: 2, name: 'Weekend Booking', price: 149 },
];

export default function Booking() {
    const router = useRouter();
    const [selectedService, setSelectedService] = useState(services[1]);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [isBooking, setIsBooking] = useState(false);

    const toggleAddon = (id: number) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const calculateTotal = () => {
        const servicePrice = selectedService.price;
        const addonsPrice = selectedAddons.reduce((sum, id) => {
            const addon = addons.find(a => a.id === id);
            return sum + (addon?.price || 0);
        }, 0);
        return servicePrice + addonsPrice + 29; // 29 is platform fee
    };

    const handleConfirmBooking = async () => {
        setIsBooking(true);

        try {
            const bookingData = {
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                customerId: 'user123', // TODO: Get from auth context
                customerName: 'Anil Kumar',
                address: 'Koramangala, 4th Block, Flat 402, Bangalore',
                scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
                addOns: selectedAddons.map(id => {
                    const addon = addons.find(a => a.id === id);
                    return { id, name: addon?.name || '', price: addon?.price || 0 };
                }),
                totalAmount: calculateTotal(),
            };

            const response = await apiClient.post<BookingResponse>('/api/bookings', bookingData);

            if (response.success) {
                Alert.alert(
                    'Booking Confirmed! 🎉',
                    `Booking ID: #${response.data?.id || 'N/A'}\nTotal: ₹${calculateTotal()}\n\nSearching for nearby worker...`,
                    [
                        {
                            text: 'Track Order',
                            onPress: () => router.push('/(customer)/track'),
                        },
                    ]
                );
            } else {
                Alert.alert('Booking Failed', response.error?.message || 'Please try again');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not create booking. Please check your connection.');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-6 pt-4 pb-6 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center mr-4"
                    >
                        <Text className="text-white text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Plumbing Services</Text>
                </View>

                {/* Service Icon */}
                <View className="items-center py-6">
                    <View className="w-40 h-40 bg-dark-charcoal rounded-3xl items-center justify-center border border-white/5">
                        <Image
                            source={require('../../assets/3d/plumbing_icon_3d_1763842092010.png')}
                            className="w-32 h-32"
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Service Selection */}
                <View className="px-6 mb-6">
                    <Text className="text-white text-xl font-bold mb-4">Select Service</Text>
                    {services.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            className={`bg-dark-charcoal rounded-2xl p-4 mb-3 border ${selectedService.id === service.id
                                ? 'border-neon-blue'
                                : 'border-white/5'
                                }`}
                            onPress={() => setSelectedService(service)}
                            activeOpacity={0.8}
                        >
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-2">
                                        <Text className="text-white font-bold text-base">{service.name}</Text>
                                        {service.popular && (
                                            <View className="ml-2 bg-warning/20 px-2 py-0.5 rounded-md">
                                                <Text className="text-warning text-xs font-bold">POPULAR</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-white/50 text-sm">⏱ {service.duration}</Text>
                                </View>
                                <Text className="text-neon-blue font-bold text-lg">₹{service.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Add-ons */}
                <View className="px-6 mb-6">
                    <Text className="text-white text-xl font-bold mb-4">Add-ons (Optional)</Text>
                    {addons.map((addon) => (
                        <TouchableOpacity
                            key={addon.id}
                            className={`bg-dark-charcoal rounded-2xl p-4 mb-3 border ${selectedAddons.includes(addon.id)
                                ? 'border-success'
                                : 'border-white/5'
                                }`}
                            onPress={() => toggleAddon(addon.id)}
                            activeOpacity={0.8}
                        >
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1 flex-row items-center">
                                    <View className={`w-6 h-6 rounded-md border-2 mr-3 ${selectedAddons.includes(addon.id)
                                        ? 'bg-success border-success'
                                        : 'border-white/30'
                                        } items-center justify-center`}>
                                        {selectedAddons.includes(addon.id) && (
                                            <Text className="text-white font-bold text-sm">✓</Text>
                                        )}
                                    </View>
                                    <Text className="text-white font-semibold">{addon.name}</Text>
                                </View>
                                <Text className="text-white/70">+₹{addon.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Address */}
                <View className="px-6 mb-6">
                    <Text className="text-white text-xl font-bold mb-3">Service Address</Text>
                    <View className="bg-dark-charcoal rounded-2xl p-4 border border-white/5">
                        <Text className="text-white font-bold mb-2">Home</Text>
                        <Text className="text-white/70 text-sm mb-3">
                            Koramangala, 4th Block{'\n'}Flat 402, Building A{'\n'}Bangalore - 560034
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-neon-blue text-sm font-semibold">Change Address →</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Price Breakdown */}
                <View className="px-6 mb-6">
                    <View className="bg-dark-charcoal rounded-2xl p-5 border border-white/5">
                        <Text className="text-white text-lg font-bold mb-4">Price Details</Text>
                        <View className="space-y-3">
                            <View className="flex-row justify-between">
                                <Text className="text-white/70">{selectedService.name}</Text>
                                <Text className="text-white">₹{selectedService.price}</Text>
                            </View>
                            {selectedAddons.map(id => {
                                const addon = addons.find(a => a.id === id);
                                return addon ? (
                                    <View key={id} className="flex-row justify-between">
                                        <Text className="text-white/70">{addon.name}</Text>
                                        <Text className="text-white">₹{addon.price}</Text>
                                    </View>
                                ) : null;
                            })}
                            <View className="flex-row justify-between">
                                <Text className="text-white/70">Platform fee</Text>
                                <Text className="text-white">₹29</Text>
                            </View>
                            <View className="h-px bg-white/10 my-2" />
                            <View className="flex-row justify-between">
                                <Text className="text-white font-bold text-lg">Total Amount</Text>
                                <Text className="text-neon-green font-bold text-xl">₹{calculateTotal()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View className="px-6 py-4 bg-dark-charcoal border-t border-white/10">
                <TouchableOpacity
                    className={`bg-neon-blue rounded-2xl py-4 items-center ${isBooking ? 'opacity-50' : ''}`}
                    onPress={handleConfirmBooking}
                    disabled={isBooking}
                >
                    <Text className="text-white font-bold text-lg">
                        {isBooking ? 'Creating Booking...' : `Confirm Booking • ₹${calculateTotal()}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
