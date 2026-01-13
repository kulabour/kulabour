import { KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Enterprise Design System
import { Button } from '../../../components/design-system/Button';
import { Input } from '../../../components/design-system/Input';
import { Box } from '../../../components/primitives/Box';
import { Text } from '../../../components/primitives/Text';

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
        <Box className="flex-1 bg-brand-primary">
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1, paddingHorizontal: 24 }}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                        className="mt-4 w-10 h-10 items-center justify-center rounded-full bg-white/10"
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Header */}
                    <Box className="mt-8 mb-10">
                        <Text variant="h1" className="text-white mb-2">Welcome Back 👋</Text>
                        <Text variant="body" className="text-white/80">Enter your mobile number to continue</Text>
                    </Box>

                    {/* Form */}
                    <Box className="space-y-6">
                        <Box className="bg-surface-base rounded-lg p-md shadow-lg">
                            <Input
                                label="Mobile Number"
                                placeholder="Enter 10 digit number"
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="numeric"
                                maxLength={10}
                                leftIcon={<Text variant="body" className="text-text-secondary mr-1">+91</Text>}
                                containerClassName="mb-0 border-0"
                            />
                        </Box>

                        <Button
                            label="Send OTP"
                            variant="solid"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                            isDisabled={mobile.length < 10}
                            onPress={handleSendOTP}
                        />
                    </Box>

                    {/* Social Login */}
                    <Box className="mt-8 items-center">
                        <Text variant="caption" className="text-white/60 mb-6">Or continue with</Text>
                        <Box className="flex-row gap-4">
                            <Button
                                variant="outline"
                                accessibilityLabel="Continue with Google"
                                className="w-14 h-14 !px-0 rounded-xl border-white/20 bg-white/5"
                                icon={<Ionicons name="logo-google" size={24} color="white" />}
                            />
                            <Button
                                variant="outline"
                                accessibilityLabel="Continue with Apple"
                                className="w-14 h-14 !px-0 rounded-xl border-white/20 bg-white/5"
                                icon={<Ionicons name="logo-apple" size={24} color="white" />}
                            />
                        </Box>
                    </Box>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Box>
    );
}
