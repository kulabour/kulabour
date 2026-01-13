/**
 * KULABOUR - Floating Cart Button
 * Animated floating action button showing cart status
 * Large touch target for easy access by all users
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCart } from '../../contexts/CartContext';

interface FloatingCartButtonProps {
    bottom?: number;
    right?: number;
}

export default function FloatingCartButton({
    bottom = 100,
    right = 20,
}: FloatingCartButtonProps) {
    const router = useRouter();
    const { getItemCount, getTotal } = useCart();

    const itemCount = getItemCount();
    const total = getTotal();

    // Animation values
    const scale = useSharedValue(0);
    const bounce = useSharedValue(1);
    const rotation = useSharedValue(0);

    // Show/hide animation based on cart items
    useEffect(() => {
        if (itemCount > 0) {
            scale.value = withSpring(1, { damping: 12, stiffness: 200 });
            // Bounce animation when item added
            bounce.value = withSequence(
                withSpring(1.2, { damping: 8 }),
                withSpring(1, { damping: 10 })
            );
        } else {
            scale.value = withSpring(0, { damping: 15 });
        }
    }, [itemCount]);

    // Subtle pulse animation when cart has items
    useEffect(() => {
        if (itemCount > 0) {
            rotation.value = withRepeat(
                withSequence(
                    withTiming(-3, { duration: 100 }),
                    withTiming(3, { duration: 200 }),
                    withTiming(0, { duration: 100 })
                ),
                3,
                false
            );
        }
    }, [itemCount]);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value * bounce.value },
            { rotate: `${rotation.value}deg` },
        ],
        opacity: interpolate(scale.value, [0, 0.5, 1], [0, 0.8, 1]),
    }));

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/(customer)/cart');
    };

    if (itemCount === 0) return null;

    return (
        <Animated.View style={[styles.container, { bottom, right }, containerStyle]}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.9}
                style={styles.touchable}
            >
                <LinearGradient
                    colors={['#22C55E', '#16A34A']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Cart Icon with Badge */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="cart" size={28} color="#fff" />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {itemCount > 9 ? '9+' : itemCount}
                            </Text>
                        </View>
                    </View>

                    {/* Total Price */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>कुल</Text>
                        <Text style={styles.priceValue}>₹{total}</Text>
                    </View>

                    {/* Arrow */}
                    <View style={styles.arrowContainer}>
                        <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1000,
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    touchable: {
        borderRadius: 30,
        overflow: 'hidden',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 30,
    },
    iconContainer: {
        position: 'relative',
        marginRight: 10,
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#EF4444',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
    },
    priceContainer: {
        marginRight: 8,
    },
    priceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '600',
    },
    priceValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    arrowContainer: {
        marginLeft: 4,
    },
});
