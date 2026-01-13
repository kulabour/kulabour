import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface VoiceFabProps {
    userType: 'customer' | 'worker';
}

export function VoiceFab({ userType }: VoiceFabProps) {
    const router = useRouter();

    const handlePress = () => {
        if (userType === 'customer') {
            router.push('/(customer)/voice-assistant');
        } else {
            router.push('/(worker)/voice-assistant'); // or /partner/voice-assistant depending on routes
        }
    };

    return (
        <View style={styles.container} pointerEvents="box-none">
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                style={styles.touchable}
            >
                <BlurView intensity={80} tint="dark" style={styles.blur}>
                    <MaterialCommunityIcons name="microphone" size={28} color="white" />
                </BlurView>
                <View style={styles.pulse} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90, // Above bottom tabs
        right: 20,
        zIndex: 1000,
    },
    touchable: {
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#0078D4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    blur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 120, 212, 0.8)', // Primary color with opacity
    },
    pulse: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
});
