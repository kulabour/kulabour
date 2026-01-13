import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Design System
import { Box } from '../../../components/primitives/Box';
import { Text } from '../../../components/primitives/Text';
import { Card } from '../../../components/design-system/Card';
import { Button } from '../../../components/design-system/Button';
import Avatar from '../../../components/ui/Avatar';

import '../../../global.css';

// Services
import { locationService } from '../../../services/LocationService';

export default function WorkerJobDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [isTracking, setIsTracking] = useState(false);

    const handleToggleTracking = async () => {
        if (!isTracking) {
            // Start Tracking
            await locationService.startTracking('worker', 'worker_123', id as string);
            setIsTracking(true);
            Alert.alert('Live Tracking Started', 'Customer can now see your location.');
        } else {
            // Stop Tracking
            locationService.stopTracking();
            setIsTracking(false);
            Alert.alert('Tracking Stopped', 'Location sharing disabled.');
        }
    };

    return (
        <Box className="flex-1 bg-surface-base">
            <SafeAreaView style={{ flex: 1 }}>

                {/* Header */}
                <Box className="px-lg py-md flex-row items-center border-b border-border-subtle">
                    <TouchableOpacity onPress={() => router.back()} className="mr-md">
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Box>
                        <Text variant="h3" className="font-bold">Job #{id}</Text>
                        <Text variant="caption" className="text-text-secondary">Pipe Repair • Pending</Text>
                    </Box>
                </Box>

                <ScrollView className="flex-1 p-lg" showsVerticalScrollIndicator={false}>

                    {/* Customer Info Card */}
                    <Card variant="outlined" className="mb-lg p-md">
                        <Box className="flex-row items-center mb-md">
                            <Avatar name="Rahul S" size="md" />
                            <Box className="ml-md">
                                <Text variant="h3" className="font-bold">Rahul Sharma</Text>
                                <Text variant="caption" className="text-text-secondary">+91 98765 43210</Text>
                            </Box>
                        </Box>
                        <Box className="flex-row gap-sm">
                            <Button
                                variant="outline"
                                size="sm"
                                label="Call"
                                icon={<Ionicons name="call" size={16} color="#1A3B5D" />}
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                label="Chat"
                                icon={<Ionicons name="chatbubbles" size={16} color="#1A3B5D" />}
                                className="flex-1"
                                onPress={() => router.push(`/(worker)/chat/${id}`)}
                            />
                        </Box>
                    </Card>

                    {/* Location Card */}
                    <Box className="mb-lg">
                        <Text variant="h3" className="mb-sm font-bold">Location</Text>
                        <Card variant="elevated" className="p-md flex-row items-start">
                            <Ionicons name="location" size={24} color="#1A3B5D" style={{ marginTop: 2, marginRight: 8 }} />
                            <Box>
                                <Text variant="body" className="font-bold mb-xs">Home Address</Text>
                                <Text variant="body" className="text-text-secondary leading-5">
                                    Flat 402, Krishna Heights,{'\n'}
                                    Koramangala 4th Block,{'\n'}
                                    Bangalore - 560034
                                </Text>
                            </Box>
                        </Card>
                    </Box>

                    {/* Tracking Action */}
                    <Box className="mt-md">
                        <Button
                            label={isTracking ? "Stop Sharing Location" : "Start Live Tracking"}
                            variant={isTracking ? "outline" : "solid"}
                            className={isTracking ? "border-feedback-error" : "bg-brand-accent"}
                            icon={<Ionicons name={isTracking ? "stop-circle" : "navigate"} size={20} color={isTracking ? "#EF4444" : "white"} />}
                            onPress={handleToggleTracking}
                        />
                        <Text variant="caption" className="text-center mt-sm text-text-tertiary">
                            {isTracking ? "Your location is visible to the customer" : "Share location when you start moving"}
                        </Text>
                    </Box>

                </ScrollView>

            </SafeAreaView>
        </Box>
    );
}
