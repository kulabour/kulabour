/**
 * KULABOUR DIMENSION - Haptic Rhythm Engine
 * Creates construction-themed haptic patterns for immersive feedback
 * Feel the construction work through your phone!
 */

import { Vibration, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticPattern = 'tap' | 'success' | 'error' | 'hammer' | 'drill' | 'welding' |
    'booking' | 'workerArrived' | 'payment' | 'notification';

const PATTERNS: Record<HapticPattern, number[]> = {
    // Basic patterns
    tap: [0, 10],
    success: [0, 50, 50, 100],
    error: [0, 100, 50, 100, 50, 100],

    // Construction-themed patterns!
    hammer: [0, 80, 100, 80, 100, 80], // Hammer strikes
    drill: [0, 20, 30, 20, 30, 20, 30, 20, 30, 20, 30, 20], // Drill vibration
    welding: [0, 150, 50, 150, 50, 150], // Welding arcs

    // App-specific patterns
    booking: [0, 100, 100, 50, 50, 200], // Booking confirmation
    workerArrived: [0, 50, 100, 50, 100, 50, 150, 50, 200], // Worker arriving (increasing intensity)
    payment: [0, 100, 50, 100, 50, 300], // Payment success
    notification: [0, 50, 50, 50, 100, 150], // New notification
};

/**
 * Trigger a haptic feedback pattern
 */
export function haptic(pattern: HapticPattern = 'tap') {
    if (Platform.OS === 'ios') {
        // Use Expo Haptics for iOS for better feel
        switch (pattern) {
            case 'tap':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'success':
            case 'booking':
            case 'payment':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'error':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                break;
            case 'workerArrived':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                break;
            default:
                // Fall back to custom pattern
                Vibration.vibrate(PATTERNS[pattern]);
        }
    } else {
        // Android uses Vibration API
        Vibration.vibrate(PATTERNS[pattern]);
    }
}

/**
 * Continuous haptic feedback (for sliders, scrolling, etc.)
 */
export function hapticSelection() {
    if (Platform.OS === 'ios') {
        Haptics.selectionAsync();
    } else {
        Vibration.vibrate(5);
    }
}

/**
 * Stop any ongoing vibration
 */
export function hapticStop() {
    Vibration.cancel();
}

/**
 * Play a custom rhythmic pattern
 * @param bpm - Beats per minute
 * @param beats - Number of beats
 * @param intensity - Vibration intensity in ms
 */
export function hapticRhythm(bpm: number = 120, beats: number = 4, intensity: number = 50) {
    const interval = 60000 / bpm; // ms between beats
    const pattern: number[] = [0];

    for (let i = 0; i < beats; i++) {
        pattern.push(intensity);
        pattern.push(interval - intensity);
    }

    Vibration.vibrate(pattern);
}

/**
 * Play a "loading" haptic pattern
 */
export function hapticLoading() {
    const pattern = [0, 30, 150, 30, 150, 30, 150, 30];
    Vibration.vibrate(pattern, true); // repeat
}

/**
 * Celebration haptic sequence!
 */
export async function hapticCelebration() {
    const celebrationPattern = [
        0, 50, 100, 50, 100, 150, 50, 150, 50, 200, 100, 100, 50, 50, 50, 50, 100, 300
    ];

    Vibration.vibrate(celebrationPattern);
}

/**
 * Create a custom construction sound haptic
 * @param type - Type of construction sound
 * @param duration - Duration in ms
 */
export function hapticConstruction(
    type: 'hammer' | 'drill' | 'saw' | 'grinder' | 'compressor',
    duration: number = 1000
) {
    let pattern: number[];

    switch (type) {
        case 'hammer':
            // Heavy impacts with pauses
            pattern = Array.from({ length: Math.floor(duration / 200) }, () => [80, 120]).flat();
            break;
        case 'drill':
            // Continuous high-frequency
            pattern = Array.from({ length: Math.floor(duration / 50) }, () => [15, 35]).flat();
            break;
        case 'saw':
            // Rhythmic back-and-forth
            pattern = Array.from({ length: Math.floor(duration / 300) }, () => [100, 100, 50, 50]).flat();
            break;
        case 'grinder':
            // Intense continuous
            pattern = Array.from({ length: Math.floor(duration / 40) }, () => [20, 20]).flat();
            break;
        case 'compressor':
            // Pulsing
            pattern = Array.from({ length: Math.floor(duration / 500) }, () => [200, 300]).flat();
            break;
        default:
            pattern = [0, 50];
    }

    Vibration.vibrate([0, ...pattern]);
}

export default {
    haptic,
    hapticSelection,
    hapticStop,
    hapticRhythm,
    hapticLoading,
    hapticCelebration,
    hapticConstruction,
};
