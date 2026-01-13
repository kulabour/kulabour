import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import '../../../global.css';

export default function Login() {
    const router = useRouter();
    const [mobile, setMobile] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = () => {
        if (mobile.length < 10) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push({
                pathname: '/(customer)/auth/otp',
                params: { mobile }
            });
        }, 1500);
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 px-6"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View className="mt-8 mb-10">
                    <Text className="text-white text-3xl font-bold mb-2">Welcome Back 👋</Text>
                    <Text className="text-white/60 text-lg">Enter your mobile number to continue</Text>
                </View>

                <View className="space-y-6">
                    <Input
                        label="Mobile Number"
                        placeholder="Enter 10 digit number"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="numeric"
                        maxLength={10}
                        leftIcon={<Text className="text-white/60 text-base ml-1">+91</Text>}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        glow
                        fullWidth
                        loading={isLoading}
                        disabled={mobile.length < 10}
                        onPress={handleSendOTP}
                    >
                        Send OTP
                    </Button>
                </View>

                <View className="mt-8 items-center">
                    <Text className="text-white/40 mb-6">Or continue with</Text>
                    <View className="flex-row gap-4">
                        <TouchableOpacity className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                            <Ionicons name="logo-google" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                            <Ionicons name="logo-apple" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
