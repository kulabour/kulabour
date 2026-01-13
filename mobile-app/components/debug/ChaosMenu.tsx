import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert, StyleSheet } from 'react-native';
import { logger } from '../../services/LoggerService';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../design/Button'; // Using our new Design System!
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../design/DesignSystem';

/**
 * Chaos Menu - For Reliability Testing
 * HIDDEN IN PRODUCTION
 */
export const ChaosMenu = () => {
    const [visible, setVisible] = useState(false);

    // 1. Simulate API 500 Error
    const simulateApiFailure = () => {
        logger.warn('Chaos', 'Simulating API 500 Failure');
        Alert.alert('Simulated', 'Next API call will fail with 500');
        // In a real app, we would set an interceptor here
    };

    // 2. Simulate Network Timeout
    const simulateNetworkLatency = () => {
        logger.warn('Chaos', 'Simulating 5s Network Latency');
        Alert.alert('Simulated', 'Network set to Slow 3G (simulated)');
    };

    // 3. Simulate App Crash (Uncaught Exception)
    const simulateCrash = () => {
        logger.error('Chaos', 'Simulating Uncaught Exception!');
        throw new Error('Chaos Monkey: Intentional Crash');
    };

    // 4. Simulate Memory Warning
    const simulateMemoryWarning = () => {
        logger.warn('Chaos', 'Simulating Memory Warning');
        // Could consume array implementation here
        Alert.alert('Chaos', 'Memory Pressure Event Triggered');
    };

    if (!__DEV__) return null; // Only show in Dev

    return (
        <>
            {/* Trigger Button (Secret: Tap Top Right?) - For now just a visible bug icon */}
            <TouchableOpacity
                style={styles.triggerButton}
                onPress={() => setVisible(true)}
                onLongPress={simulateCrash}
            >
                <Ionicons name="bug" size={20} color="#fff" />
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.title}>🐒 Chaos Engineering</Text>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.subtitle}>
                            Intentionally break things to test reliability.
                        </Text>

                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Network & API</Text>
                                <Button
                                    title="Simulate API 500"
                                    onPress={simulateApiFailure}
                                    variant="outline"
                                    style={styles.button}
                                />
                                <Button
                                    title="Simulate Slow Network"
                                    onPress={simulateNetworkLatency}
                                    variant="outline"
                                    style={styles.button}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>System Resource</Text>
                                <Button
                                    title="Trigger High Memory"
                                    onPress={simulateMemoryWarning}
                                    variant="outline"
                                    style={styles.button}
                                />
                                <Button
                                    title="Fill Local Storage"
                                    onPress={() => logger.warn('Chaos', 'Storage Full simulated')}
                                    variant="outline"
                                    style={styles.button}
                                />
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: COLORS.danger }]}>Destructive</Text>
                                <Button
                                    title="💥 CRASH APP NOW"
                                    onPress={simulateCrash}
                                    variant="danger"
                                    style={styles.button}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    triggerButton: {
        position: 'absolute',
        top: 50,
        right: 120, // Next to existing icons
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#7C3AED', // Violet
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        padding: SPACING.l,
        height: '60%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.s,
    },
    title: {
        fontSize: TYPOGRAPHY.h2,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    subtitle: {
        color: '#6B7280',
        marginBottom: SPACING.l,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: '#374151',
        marginBottom: SPACING.s,
    },
    button: {
        marginBottom: SPACING.s,
    }
});
