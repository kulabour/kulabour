/**
 * KULABOUR - Big Action Buttons
 * Designed for users who prefer visual over text
 * 
 * Features:
 * - HUGE tap targets (entire screen width)
 * - BIG icons that clearly show the action
 * - Hindi-first labels
 * - Color coding for actions
 * - Haptic feedback for confirmation
 */

import React from 'react';
import { View, Text, TouchableOpacity, Vibration, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface BigActionButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    emoji?: string;
    hindiLabel: string;
    hindiSublabel?: string;
    color: string;
    onPress: () => void;
    disabled?: boolean;
}

/**
 * Full-width action button with BIG icon
 * Single most important action on screen
 */
export function BigActionButton({
    icon,
    emoji,
    hindiLabel,
    hindiSublabel,
    color,
    onPress,
    disabled = false,
}: BigActionButtonProps) {
    const handlePress = () => {
        if (!disabled) {
            Vibration.vibrate(100);
            onPress();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.85}
            disabled={disabled}
            style={{ marginHorizontal: 16, marginVertical: 8 }}
        >
            <LinearGradient
                colors={disabled ? ['#ccc', '#aaa'] : [color, `${color}cc`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    width: width - 32,
                    paddingVertical: 24,
                    paddingHorizontal: 24,
                    borderRadius: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    // Deep shadow for 3D feel
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 10,
                }}
            >
                {/* Large icon */}
                <View
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 20,
                    }}
                >
                    {emoji ? (
                        <Text style={{ fontSize: 48 }}>{emoji}</Text>
                    ) : (
                        <Ionicons name={icon} size={48} color="#fff" />
                    )}
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 28,
                            fontWeight: '900',
                        }}
                    >
                        {hindiLabel}
                    </Text>
                    {hindiSublabel && (
                        <Text
                            style={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: 16,
                                marginTop: 4,
                            }}
                        >
                            {hindiSublabel}
                        </Text>
                    )}
                </View>

                {/* Arrow */}
                <Ionicons name="arrow-forward" size={32} color="#fff" />
            </LinearGradient>
        </TouchableOpacity>
    );
}

/**
 * Circular icon button for grid layouts
 */
export function CircleIconButton({
    icon,
    emoji,
    label,
    color,
    onPress,
    size = 80,
}: {
    icon?: keyof typeof Ionicons.glyphMap;
    emoji?: string;
    label: string;
    color: string;
    onPress: () => void;
    size?: number;
}) {
    return (
        <TouchableOpacity
            onPress={() => {
                Vibration.vibrate(50);
                onPress();
            }}
            activeOpacity={0.8}
            style={{ alignItems: 'center', marginHorizontal: 8 }}
        >
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 6,
                }}
            >
                {emoji ? (
                    <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
                ) : icon ? (
                    <Ionicons name={icon} size={size * 0.5} color="#fff" />
                ) : null}
            </View>
            <Text
                style={{
                    color: '#333',
                    fontSize: 14,
                    fontWeight: '700',
                    marginTop: 8,
                    textAlign: 'center',
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

/**
 * Yes/No confirmation buttons
 * Very clear with color coding
 */
export function ConfirmButtons({
    onYes,
    onNo,
    yesLabel = 'हाँ',
    noLabel = 'नहीं',
}: {
    onYes: () => void;
    onNo: () => void;
    yesLabel?: string;
    noLabel?: string;
}) {
    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
            {/* NO - Red */}
            <TouchableOpacity
                onPress={() => {
                    Vibration.vibrate(50);
                    onNo();
                }}
                style={{
                    flex: 1,
                    backgroundColor: '#EF4444',
                    paddingVertical: 20,
                    borderRadius: 16,
                    marginRight: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Ionicons name="close" size={32} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginLeft: 8 }}>
                    {noLabel}
                </Text>
            </TouchableOpacity>

            {/* YES - Green */}
            <TouchableOpacity
                onPress={() => {
                    Vibration.vibrate(100);
                    onYes();
                }}
                style={{
                    flex: 1,
                    backgroundColor: '#22C55E',
                    paddingVertical: 20,
                    borderRadius: 16,
                    marginLeft: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Ionicons name="checkmark" size={32} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', marginLeft: 8 }}>
                    {yesLabel}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/**
 * Status indicator with icon
 * For showing booking status, worker status, etc.
 */
export function StatusIndicator({
    status,
}: {
    status: 'waiting' | 'coming' | 'arrived' | 'working' | 'done';
}) {
    const statusConfig = {
        waiting: { icon: '⏳', label: 'इंतज़ार करो', color: '#F59E0B', bg: '#FEF3C7' },
        coming: { icon: '🏃', label: 'आ रहा है', color: '#3B82F6', bg: '#DBEAFE' },
        arrived: { icon: '🙋', label: 'पहुँच गया', color: '#22C55E', bg: '#DCFCE7' },
        working: { icon: '🔨', label: 'काम चालू', color: '#8B5CF6', bg: '#EDE9FE' },
        done: { icon: '✅', label: 'काम पूरा', color: '#22C55E', bg: '#DCFCE7' },
    };

    const config = statusConfig[status];

    return (
        <View
            style={{
                backgroundColor: config.bg,
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                marginVertical: 8,
                borderWidth: 2,
                borderColor: config.color,
            }}
        >
            <Text style={{ fontSize: 40, marginRight: 16 }}>{config.icon}</Text>
            <Text
                style={{
                    color: config.color,
                    fontSize: 24,
                    fontWeight: '800',
                }}
            >
                {config.label}
            </Text>
        </View>
    );
}

/**
 * Call button - One tap to call
 */
export function CallButton({
    phoneNumber,
    label = 'फ़ोन करो',
}: {
    phoneNumber: string;
    label?: string;
}) {
    const handleCall = () => {
        Vibration.vibrate(100);
        // In real app: Linking.openURL(`tel:${phoneNumber}`);
    };

    return (
        <TouchableOpacity
            onPress={handleCall}
            style={{
                backgroundColor: '#22C55E',
                paddingHorizontal: 32,
                paddingVertical: 20,
                borderRadius: 50,
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                shadowColor: '#22C55E',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
            }}
        >
            <Text style={{ fontSize: 32, marginRight: 12 }}>📞</Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}
