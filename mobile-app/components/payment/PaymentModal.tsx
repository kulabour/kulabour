import { View, Text, Modal, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface PaymentModalProps {
    visible: boolean;
    amount: number;
    method: string;
    onSuccess: (txnId: string) => void;
    onFailure: (error: string) => void;
    onClose: () => void;
}

export default function PaymentModal({
    visible,
    amount,
    method,
    onSuccess,
    onFailure,
    onClose
}: PaymentModalProps) {
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');

    useEffect(() => {
        if (visible) {
            setStatus('processing');
            // Simulate processing time
            const timer = setTimeout(() => {
                const isSuccess = true; // Force success for demo
                if (isSuccess) {
                    setStatus('success');
                    setTimeout(() => {
                        onSuccess(`TXN_${Date.now()}`);
                    }, 1500);
                } else {
                    setStatus('failed');
                    setTimeout(() => {
                        onFailure('Payment declined by bank');
                    }, 1500);
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 bg-black/80 justify-center items-center px-6">
                <Card variant="glass" className="w-full max-w-sm items-center py-8">
                    {status === 'processing' && (
                        <>
                            <ActivityIndicator size="large" color="#00f3ff" className="mb-6" />
                            <Text className="text-white text-xl font-bold mb-2">Processing Payment</Text>
                            <Text className="text-white/60 text-center mb-4">
                                Please wait while we securely process your payment of ₹{amount} via {method.toUpperCase()}
                            </Text>
                            <Text className="text-white/40 text-xs">Do not press back or close the app</Text>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <View className="w-20 h-20 bg-success/20 rounded-full items-center justify-center mb-6 animate-bounce">
                                <Ionicons name="checkmark" size={40} color="#00ff9d" />
                            </View>
                            <Text className="text-white text-2xl font-bold mb-2">Payment Successful!</Text>
                            <Text className="text-white/60 text-center">Redirecting...</Text>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <View className="w-20 h-20 bg-red-500/20 rounded-full items-center justify-center mb-6">
                                <Ionicons name="close" size={40} color="#ff4444" />
                            </View>
                            <Text className="text-white text-2xl font-bold mb-2">Payment Failed</Text>
                            <Text className="text-white/60 text-center mb-6">Something went wrong. Please try again.</Text>
                            <Button variant="ghost" onPress={onClose}>Close</Button>
                        </>
                    )}
                </Card>
            </View>
        </Modal>
    );
}
