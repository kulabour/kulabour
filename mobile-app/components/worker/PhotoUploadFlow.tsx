import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import PhotoPicker from '../shared/PhotoPicker';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface PhotoUploadFlowProps {
    onComplete: (beforeUri: string, afterUri: string) => void;
    jobId: string;
}

export default function PhotoUploadFlow({ onComplete }: PhotoUploadFlowProps) {
    const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
    const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async () => {
        if (!beforePhoto || !afterPhoto) return;

        setIsUploading(true);
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsUploading(false);

        onComplete(beforePhoto, afterPhoto);
    };

    return (
        <View className="flex-1">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Text className="text-white font-bold text-lg mb-4">1. Before Work Photo</Text>
                    <Text className="text-white/50 text-sm mb-4">
                        Take a clear photo of the area before starting work.
                    </Text>
                    <PhotoPicker
                        label="Upload Before Photo"
                        onImageSelected={setBeforePhoto}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-white font-bold text-lg mb-4">2. After Work Photo</Text>
                    <Text className="text-white/50 text-sm mb-4">
                        Take a photo of the completed work to verify quality.
                    </Text>
                    <PhotoPicker
                        label="Upload After Photo"
                        onImageSelected={setAfterPhoto}
                    />
                </View>

                <Card variant="gradient" className="mb-6">
                    <View className="flex-row items-center">
                        <Text className="text-2xl mr-3">💡</Text>
                        <View className="flex-1">
                            <Text className="text-white font-bold">Quick Tip</Text>
                            <Text className="text-white/70 text-xs">
                                Good photos help verify your work and ensure faster payments!
                            </Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>

            <View className="py-4 border-t border-white/10">
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    glow
                    disabled={!beforePhoto || !afterPhoto}
                    loading={isUploading}
                    onPress={handleSubmit}
                >
                    Submit Photos & Complete Job
                </Button>
            </View>
        </View>
    );
}
