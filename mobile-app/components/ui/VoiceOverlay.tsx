import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useVoiceMode } from '../../contexts/VoiceModeContext';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    FadeIn,
    FadeOut
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function VoiceOverlay() {
    const { isVoiceModeEnabled, toggleVoiceMode } = useVoiceMode();
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isVoiceModeEnabled) {
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.2, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                true
            );
        } else {
            scale.value = 1;
        }
    }, [isVoiceModeEnabled]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    if (!isVoiceModeEnabled) return null;

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.container}
            pointerEvents="box-none" // Allow clicks to pass through except on the button
        >
            <View style={styles.floatingContainer}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={toggleVoiceMode}
                    style={styles.micButtonContainer}
                >
                    <Animated.View style={[styles.pulseRing, animatedStyle]} />
                    <LinearGradient
                        colors={['#EF4444', '#B91C1C']}
                        style={styles.micButton}
                    >
                        <Ionicons name="mic" size={32} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
                <View style={styles.statusLabel}>
                    <Text style={styles.statusText}>Voice Mode On</Text>
                    <Text style={styles.statusSubText}>बोलिये...</Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100, // Above simpler bottom navigation
        right: 20,
        zIndex: 9999,
        alignItems: 'flex-end',
    },
    floatingContainer: {
        alignItems: 'center',
    },
    micButtonContainer: {
        width: 72,
        height: 72,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    pulseRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 36,
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
    },
    micButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    statusLabel: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 4,
        alignItems: 'center',
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusSubText: {
        color: '#fbbf24',
        fontSize: 10,
        fontWeight: 'bold',
    }
});
