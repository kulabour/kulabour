/**
 * KULABOUR - Payment Modal
 * Razorpay-style payment flow with multiple options
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInUp,
    SlideOutDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { haptic } from '../engine/HapticRhythm';

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    amount: number;
    onSuccess: (transactionId: string) => void;
    onError: (error: string) => void;
}

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cod';

const paymentMethods = [
    { id: 'upi' as PaymentMethod, name: 'UPI', icon: '📱', description: 'GPay, PhonePe, Paytm' },
    { id: 'card' as PaymentMethod, name: 'Card', icon: '💳', description: 'Credit/Debit Cards' },
    { id: 'wallet' as PaymentMethod, name: 'Wallet', icon: '👛', description: 'KULABOUR Wallet' },
    { id: 'cod' as PaymentMethod, name: 'Cash', icon: '💵', description: 'Pay after service' },
];

export default function PaymentModal({
    visible,
    onClose,
    amount,
    onSuccess,
    onError,
}: PaymentModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
    const [upiId, setUpiId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const successScale = useSharedValue(0);

    const handlePayment = async () => {
        haptic('tap');
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (90% success rate)
        if (Math.random() > 0.1) {
            setIsProcessing(false);
            setShowSuccess(true);
            successScale.value = withSequence(
                withSpring(1.2, { damping: 10 }),
                withSpring(1, { damping: 15 })
            );
            haptic('success');

            setTimeout(() => {
                const txnId = `TXN${Date.now()}`;
                onSuccess(txnId);
                setShowSuccess(false);
                onClose();
            }, 2000);
        } else {
            setIsProcessing(false);
            haptic('error');
            onError('Payment failed. Please try again.');
        }
    };

    const successStyle = useAnimatedStyle(() => ({
        transform: [{ scale: successScale.value }],
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                className="flex-1 bg-black/70 justify-end"
            >
                <Animated.View
                    entering={SlideInUp.springify()}
                    exiting={SlideOutDown}
                    className="bg-white rounded-t-3xl max-h-[85%]"
                >
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
                        <View>
                            <Text className="text-gray-500 text-sm">Total Amount</Text>
                            <Text className="text-gray-900 text-3xl font-black">₹{amount}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                haptic('tap');
                                onClose();
                            }}
                            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Success State */}
                    {showSuccess ? (
                        <View className="p-12 items-center">
                            <Animated.View style={successStyle}>
                                <LinearGradient
                                    colors={['#22C55E', '#16A34A']}
                                    className="w-32 h-32 rounded-full items-center justify-center"
                                    style={{
                                        shadowColor: '#22C55E',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 16,
                                    }}
                                >
                                    <Ionicons name="checkmark" size={64} color="white" />
                                </LinearGradient>
                            </Animated.View>
                            <Text className="text-gray-900 text-2xl font-black mt-6">Payment Successful!</Text>
                            <Text className="text-gray-500 mt-2">Booking confirmed</Text>
                        </View>
                    ) : (
                        <ScrollView className="p-6">
                            {/* Payment Methods */}
                            <Text className="text-gray-900 font-bold text-lg mb-4">
                                Payment Method
                            </Text>

                            <View className="gap-3 mb-6">
                                {paymentMethods.map((method) => (
                                    <TouchableOpacity
                                        key={method.id}
                                        onPress={() => {
                                            haptic('tap');
                                            setSelectedMethod(method.id);
                                        }}
                                        className={`flex-row items-center p-4 rounded-xl border-2 ${selectedMethod === method.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <Text className="text-3xl mr-4">{method.icon}</Text>
                                        <View className="flex-1">
                                            <Text className="text-gray-900 font-bold">{method.name}</Text>
                                            <Text className="text-gray-500 text-sm">{method.description}</Text>
                                        </View>
                                        <View className={`w-6 h-6 rounded-full border-2 ${selectedMethod === method.id
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                            } items-center justify-center`}>
                                            {selectedMethod === method.id && (
                                                <Ionicons name="checkmark" size={16} color="white" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* UPI Input */}
                            {selectedMethod === 'upi' && (
                                <View className="mb-6">
                                    <Text className="text-gray-700 font-semibold mb-2">UPI ID</Text>
                                    <TextInput
                                        value={upiId}
                                        onChangeText={setUpiId}
                                        placeholder="yourname@upi"
                                        className="bg-gray-100 rounded-xl p-4 text-gray-900"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            )}

                            {/* Pay Button */}
                            <TouchableOpacity
                                onPress={handlePayment}
                                disabled={isProcessing}
                                activeOpacity={0.9}
                            >
                                <LinearGradient
                                    colors={isProcessing ? ['#9CA3AF', '#6B7280'] : ['#0078D4', '#005A9E']}
                                    className="py-5 rounded-xl items-center"
                                    style={{
                                        shadowColor: '#0078D4',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 12,
                                    }}
                                >
                                    <Text className="text-white text-lg font-black">
                                        {isProcessing ? '⏳ Processing...' : `Pay ₹${amount}`}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Security Badge */}
                            <View className="flex-row items-center justify-center mt-6">
                                <Ionicons name="shield-checkmark" size={16} color="#22C55E" />
                                <Text className="text-gray-500 text-sm ml-2">
                                    100% Secure Payments
                                </Text>
                            </View>
                        </ScrollView>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}
