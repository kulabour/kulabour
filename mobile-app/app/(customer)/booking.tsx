import { Text, ScrollView, TouchableOpacity, Alert, Animated, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { apiClient, BookingResponse } from '../../services/api/client';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

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
        // Mock data for missing state
        const selectedTimeSlot = new Date().toISOString();
        const address = 'Koramangala, Bangalore';

        if (!selectedTimeSlot || !address) {
            Alert.alert('Missing Details', 'Please select a time and enter your address');
            return;
        }

        setIsBooking(true);

        try {
            const bookingData = {
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                customerId: 'user123', // TODO: Get from auth context
                customerName: 'Anil Kumar',
                address: address, // Use a default or actual address
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
                Alert.alert('Booking Failed', (typeof response.error === 'string' ? response.error : response.error?.message) || 'Please try again');
            }
        } catch { // Removed unused 'error' variable
            Alert.alert('Error', 'Could not create booking. Please check your connection.');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#020617]">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {services.map((service) => (
                    <TouchableOpacity
                        key={service.id}
                        className={`rounded-2xl p-4 mb-3 border relative overflow-hidden transition-all ${selectedService.id === service.id
                            ? 'bg-blue-600/10 border-blue-500'
                            : 'bg-slate-800/40 border-white/5'
                            }`}
                        onPress={() => setSelectedService(service)}
                        activeOpacity={0.9}
                    >
                        <View className="flex-row justify-between items-start z-10">
                            <View className="flex-1 mr-4">
                                <Text className={`text-base font-bold mb-1 ${selectedService.id === service.id ? 'text-white' : 'text-slate-200'}`}>
                                    {service.name}
                                </Text>
                                <View className="flex-row items-center">
                                    <Ionicons name="time-outline" size={14} color="#94a3b8" style={{ marginRight: 4 }} />
                                    <Text className="text-slate-400 text-xs">{service.duration}</Text>
                                </View>
                            </View>
                            <Text className={`font-bold text-lg ${selectedService.id === service.id ? 'text-blue-400' : 'text-white'}`}>
                                ₹{service.price}
                            </Text>
                        </View>
                        {selectedService.id === service.id && (
                            <View className="absolute top-0 right-0 p-2">
                                <View className="w-4 h-4 rounded-full bg-blue-500 items-center justify-center">
                                    <Ionicons name="checkmark" size={10} color="white" />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}



                <View className="px-6 mb-8">
                    <Text className="text-white text-lg font-bold mb-4">Add-ons</Text>
                    <View className="flex-row gap-3">
                        {addons.map((addon) => (
                            <TouchableOpacity
                                key={addon.id}
                                className={`flex-1 rounded-2xl p-3 border ${selectedAddons.includes(addon.id)
                                    ? 'bg-emerald-500/10 border-emerald-500'
                                    : 'bg-slate-800/40 border-white/5'
                                    }`}
                                onPress={() => toggleAddon(addon.id)}
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-bold text-sm mb-1">{addon.name}</Text>
                                <View className="flex-row justify-between items-center mt-2">
                                    <Text className="text-emerald-400 font-bold">+₹{addon.price}</Text>
                                    {selectedAddons.includes(addon.id) && (
                                        <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Price Breakdown */}
                <View className="px-6 mb-24">
                    <View className="bg-slate-800/40 rounded-3xl p-6 border border-white/5">
                        <Text className="text-white text-lg font-bold mb-4">Payment Summary</Text>

                        <View className="space-y-3 mb-4">
                            <View className="flex-row justify-between">
                                <Text className="text-slate-400 text-sm">{selectedService.name}</Text>
                                <Text className="text-white font-medium">₹{selectedService.price}</Text>
                            </View>
                            {selectedAddons.map(id => {
                                const addon = addons.find(a => a.id === id);
                                return addon ? (
                                    <View key={id} className="flex-row justify-between">
                                        <Text className="text-slate-400 text-sm">{addon.name}</Text>
                                        <Text className="text-white font-medium">₹{addon.price}</Text>
                                    </View>
                                ) : null;
                            })}
                            <View className="flex-row justify-between">
                                <Text className="text-slate-400 text-sm">Platform fee</Text>
                                <Text className="text-white font-medium">₹29</Text>
                            </View>
                        </View>

                        <View className="h-px bg-white/10 mb-4" />

                        <View className="flex-row justify-between items-end">
                            <Text className="text-white font-bold text-lg">Total Amount</Text>
                            <Text className="text-3xl font-bold text-white">
                                <Text className="text-2xl text-slate-400 font-normal">₹</Text>
                                {calculateTotal()}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView >


            {/* Bottom Action Bar */}
            < View className="absolute bottom-0 left-0 right-0 bg-[#020617]/90 blur-xl pt-4 pb-8 px-6 border-t border-white/5" >
                <TouchableOpacity
                    className={`rounded-2xl py-4 items-center flex-row justify-center relative overflow-hidden ${isBooking ? 'opacity-80' : ''}`}
                    onPress={handleConfirmBooking}
                    disabled={isBooking}
                >
                    <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="absolute inset-0"
                    />
                    {isBooking ? (
                        <Text className="text-white font-bold text-lg">Processing...</Text>
                    ) : (
                        <>
                            <Text className="text-white font-bold text-lg mr-2">Confirm Booking</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </View >
        </SafeAreaView >
    );
}
