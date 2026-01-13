/**
 * KULABOUR - Network Monitor Component
 * Shows network status indicator, sync progress, and manual sync option
 * Hindi-first UI for accessibility
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { offlineQueue, QueueStatus } from '../../services/OfflineQueueService';

interface NetworkMonitorProps {
    showWhenOnline?: boolean;
    position?: 'top' | 'bottom';
}

export default function NetworkMonitor({
    showWhenOnline = false,
    position = 'top',
}: NetworkMonitorProps) {
    const [status, setStatus] = useState<QueueStatus | null>(null);
    const [expanded, setExpanded] = useState(false);

    // Animation values
    const pulseScale = useSharedValue(1);
    const slideY = useSharedValue(position === 'top' ? -100 : 100);

    useEffect(() => {
        const unsubscribe = offlineQueue.onStatusChange(setStatus);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (status) {
            // Animate in/out based on visibility
            const shouldShow = !status.isOnline || status.pendingCount > 0 || showWhenOnline;
            slideY.value = withSpring(shouldShow ? 0 : (position === 'top' ? -100 : 100), {
                damping: 20,
                stiffness: 200,
            });

            // Pulse animation when syncing
            if (status.isSyncing) {
                pulseScale.value = withRepeat(
                    withSequence(
                        withTiming(1.1, { duration: 500 }),
                        withTiming(1, { duration: 500 })
                    ),
                    -1,
                    true
                );
            } else {
                pulseScale.value = withSpring(1);
            }
        }
    }, [status?.isOnline, status?.pendingCount, status?.isSyncing, showWhenOnline]);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: slideY.value }],
    }));

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const handleSync = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await offlineQueue.forceSync();
    };

    const handleExpand = () => {
        Haptics.selectionAsync();
        setExpanded(!expanded);
    };

    if (!status) return null;

    const shouldShow = !status.isOnline || status.pendingCount > 0 || showWhenOnline;
    if (!shouldShow && !expanded) return null;

    const getStatusColor = () => {
        if (!status.isOnline) return '#EF4444';
        if (status.isSyncing) return '#F59E0B';
        if (status.pendingCount > 0) return '#0078D4';
        return '#22C55E';
    };

    const getStatusText = () => {
        if (!status.isOnline) return 'ऑफलाइन';
        if (status.isSyncing) return 'सिंक हो रहा है...';
        if (status.pendingCount > 0) return `${status.pendingCount} पेंडिंग`;
        return 'ऑनलाइन';
    };

    const getStatusIcon = () => {
        if (!status.isOnline) return 'cloud-offline';
        if (status.isSyncing) return 'sync';
        if (status.pendingCount > 0) return 'cloud-upload';
        return 'cloud-done';
    };

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.containerTop : styles.containerBottom,
                containerStyle,
            ]}
        >
            <TouchableOpacity
                onPress={handleExpand}
                activeOpacity={0.9}
                style={styles.touchable}
            >
                <View style={[styles.banner, { backgroundColor: getStatusColor() }]}>
                    <Animated.View style={[styles.iconContainer, pulseStyle]}>
                        {status.isSyncing ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name={getStatusIcon()} size={18} color="#fff" />
                        )}
                    </Animated.View>

                    <Text style={styles.statusText}>{getStatusText()}</Text>

                    {status.pendingCount > 0 && !status.isSyncing && status.isOnline && (
                        <TouchableOpacity
                            onPress={handleSync}
                            style={styles.syncButton}
                        >
                            <Ionicons name="refresh" size={16} color="#fff" />
                            <Text style={styles.syncButtonText}>सिंक</Text>
                        </TouchableOpacity>
                    )}

                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="rgba(255,255,255,0.7)"
                        style={styles.chevron}
                    />
                </View>

                {/* Expanded details */}
                {expanded && (
                    <Animated.View
                        entering={FadeIn.duration(200)}
                        exiting={FadeOut.duration(150)}
                        style={styles.details}
                    >
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>स्टेटस</Text>
                            <View style={styles.detailValue}>
                                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                                <Text style={styles.detailValueText}>
                                    {status.isOnline ? 'कनेक्टेड' : 'डिस्कनेक्ट'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>पेंडिंग टास्क</Text>
                            <Text style={styles.detailValueText}>{status.pendingCount}</Text>
                        </View>

                        {status.failedCount > 0 && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>फेल टास्क</Text>
                                <View style={styles.failedBadge}>
                                    <Text style={styles.failedText}>{status.failedCount}</Text>
                                </View>
                            </View>
                        )}

                        {status.lastSyncAt && (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>आखिरी सिंक</Text>
                                <Text style={styles.detailValueText}>
                                    {formatTimeAgo(status.lastSyncAt)}
                                </Text>
                            </View>
                        )}

                        {status.pendingCount > 0 && (
                            <TouchableOpacity
                                onPress={handleSync}
                                disabled={status.isSyncing || !status.isOnline}
                                style={[
                                    styles.fullSyncButton,
                                    (!status.isOnline || status.isSyncing) && styles.fullSyncButtonDisabled,
                                ]}
                            >
                                {status.isSyncing ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="sync" size={18} color="#fff" />
                                        <Text style={styles.fullSyncButtonText}>
                                            अभी सिंक करो
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

// Helper function to format time ago
function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'अभी';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} मिनट पहले`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} घंटे पहले`;
    return `${Math.floor(seconds / 86400)} दिन पहले`;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 100,
    },
    containerTop: {
        top: 50,
    },
    containerBottom: {
        bottom: 100,
    },
    touchable: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    statusText: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    syncButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
        gap: 4,
    },
    syncButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    chevron: {
        marginLeft: 4,
    },
    details: {
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    detailLabel: {
        color: '#666',
        fontSize: 13,
    },
    detailValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailValueText: {
        color: '#333',
        fontSize: 13,
        fontWeight: '600',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    failedBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    failedText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '700',
    },
    fullSyncButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0078D4',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 12,
        gap: 8,
    },
    fullSyncButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    fullSyncButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
});
