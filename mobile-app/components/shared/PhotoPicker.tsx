import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import Card from '../ui/Card';

interface PhotoPickerProps {
    onImageSelected: (uri: string) => void;
    label?: string;
    initialImage?: string;
}

export default function PhotoPicker({ onImageSelected, label = 'Upload Photo', initialImage }: PhotoPickerProps) {
    const [image, setImage] = useState<string | null>(initialImage || null);

    const handlePermissionDenied = () => {
        Alert.alert(
            'Permission Required',
            'This feature requires access to your photos/camera. Please enable it in settings.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
        );
    };

    const pickImage = async () => {
        // Request permissions
        const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            if (!canAskAgain) {
                handlePermissionDenied();
            } else {
                Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            }
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            onImageSelected(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            if (!canAskAgain) {
                handlePermissionDenied();
            } else {
                Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
            }
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            onImageSelected(result.assets[0].uri);
        }
    };

    const handlePress = () => {
        Alert.alert(
            'Select Photo',
            'Choose an option',
            [
                { text: 'Camera', onPress: takePhoto },
                { text: 'Gallery', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Card variant="glass" className="items-center justify-center h-48 border-dashed border-2 border-white/20">
                {image ? (
                    <Image source={image} className="w-full h-full rounded-xl" contentFit="cover" />
                ) : (
                    <View className="items-center">
                        <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
                            <Text className="text-2xl">📷</Text>
                        </View>
                        <Text className="text-white/70 font-semibold">{label}</Text>
                        <Text className="text-white/30 text-xs mt-1">Tap to upload</Text>
                    </View>
                )}
            </Card>
        </TouchableOpacity>
    );
}
