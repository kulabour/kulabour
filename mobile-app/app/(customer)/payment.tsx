import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import Card from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import PaymentModal from '../../components/payment/PaymentModal';
import '../../global.css';

const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '💳', popular: true },
    { id: 'card', name: 'Credit/Debit Card', icon: '💴', popular: false },
    { id: 'wallet', name: 'Wallet', icon: '👛', popular: false },
    { id: 'cod', name: 'Pay After Service', icon: '💵', popular: true },
];

export default function Payment() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [promoCode] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const serviceAmount = 499;
    const platformFee = 29;
    const discount = promoCode ? 50 : 0;
    const total = serviceAmount + platformFee - discount;

    const handlePayment = () => {
        if (selectedMethod === 'cod') {
            Alert.alert(
                'Confirm Booking',
                'Pay ₹' + total + ' after the service is completed.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Confirm',
                        onPress: () => router.push('/(customer)/confirmation')
                    }
                ]
            );
        } else {
            setIsProcessing(true);
        }
    };

    const handlePaymentSuccess = (txnId: string) => {
        setIsProcessing(false);
        // Navigate to confirmation with transaction details
        router.push({
            pathname: '/(customer)/confirmation',
            params: { txnId, amount: total }
        });
    };

    const handlePaymentFailure = (error: string) => {
        setIsProcessing(false);
        Alert.alert('Payment Failed', error);
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
                    <Text className="text-white text-2xl font-bold">Payment</Text>
                </View>

                {/* Payment Methods */}
                <View className="px-6 mb-6">
                    <Text className="text-white text-xl font-bold mb-4">
                        Choose Payment Method
                    </Text>
                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            onPress={() => setSelectedMethod(method.id)}
                            activeOpacity={0.8}
                        >
                            <Card
                                variant={selectedMethod === method.id ? 'glass' : 'default'}
                                shadow={selectedMethod === method.id ? 'medium' : 'soft'}
                                className={`mb-3 ${selectedMethod === method.id
                                    ? 'border-2 border-neon-blue shadow-glow-blue'
                                    : ''
                                    }`}
                            >
                                <View className="flex-row items-center">
                                    <View
                                        className={`w-12 h-12 rounded-full items-center justify-center ${selectedMethod === method.id
                                            ? 'bg-neon-blue/20'
                                            : 'bg-white/5'
                                            }`}
                                    >
                                        <Text className="text-3xl">{method.icon}</Text>
                                    </View>
                                    <View className="ml-4 flex-1">
                                        <Text className="text-white font-bold text-base mb-1">
                                            {method.name}
                                        </Text>
                                        {method.popular && (
                                            <Text className="text-neon-green text-xs font-semibold">
                                                Popular Choice
                                            </Text>
                                        )}
                                    </View>
                                    <View
                                        className={`w-6 h-6 rounded-full border-2 ${selectedMethod === method.id
                                            ? 'bg-neon-blue border-neon-blue'
                                            : 'border-white/30'
                                            } items-center justify-center`}
                                    >
                                        {selectedMethod === method.id && (
                                            <View className="w-3 h-3 bg-white rounded-full" />
                                        )}
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Promo Code */}
                <View className="px-6 mb-6">
                    <Card>
                        <Text className="text-white font-bold mb-3">Have a Promo Code?</Text>
                        <View className="flex-row gap-3">
                            <View className="flex-1 bg-dark-obsidian rounded-xl px-4 py-3 border border-white/10">
                                <Text className="text-white">{promoCode || 'Enter code'}</Text>
                            </View>
                            <Button variant="ghost" size="md">
                                Apply
                            </Button>
                        </View>
                    </Card>
                </View>

                {/* Price Breakdown */}
                <View className="px-6 mb-6">
                    <Card variant="default" shadow="3d">
                        <Text className="text-white text-lg font-bold mb-4">
                            Payment Summary
                        </Text>
                        <View className="space-y-3">
                            <View className="flex-row justify-between">
                                <Text className="text-white/70">Service Amount</Text>
                                <Text className="text-white font-semibold">₹{serviceAmount}</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-white/70">Platform Fee</Text>
                                <Text className="text-white font-semibold">₹{platformFee}</Text>
                            </View>
                            {discount > 0 && (
                                <View className="flex-row justify-between">
                                    <Text className="text-success">Discount</Text>
                                    <Text className="text-success font-semibold">-₹{discount}</Text>
                                </View>
                            )}
                            <View className="h-px bg-white/10 my-2" />
                            <View className="flex-row justify-between items-center">
                                <Text className="text-white font-bold text-xl">Total Amount</Text>
                                <Text className="text-neon-green font-bold text-2xl">₹{total}</Text>
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>

            {/* Bottom Action */}
            <View className="px-6 py-4 bg-dark-charcoal border-t border-white/10">
                <Button
                    variant="primary"
                    size="lg"
                    glow
                    fullWidth
                    onPress={handlePayment}
                >
                    {selectedMethod === 'cod' ? 'Place Order' : `Pay Now • ₹${total}`}
                </Button>
            </View>

            {/* Payment Modal */}
            <PaymentModal
                visible={isProcessing}
                amount={total}
                method={selectedMethod}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
                onClose={() => setIsProcessing(false)}
            />
        </SafeAreaView>
    );
}
