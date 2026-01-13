/**
 * KULABOUR - Cart Screen
 * Full cart view with service list, quantity controls, and checkout
 * Hindi-first UI with large touch targets for accessibility
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Vibration,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
    Layout,
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideOutLeft,
} from 'react-native-reanimated';
import { useCart, CartItem } from '../../contexts/CartContext';
import { FlashList } from '@shopify/flash-list';

export default function CartScreen() {
    const router = useRouter();
    const {
        state,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
        getPlatformFee,
        getGST,
        getTotal,
        getItemCount,
    } = useCart();

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'custom'>('today');

    const handleQuantityChange = (item: CartItem, increment: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
        if (newQuantity <= 0) {
            handleRemoveItem(item);
        } else {
            updateQuantity(item.id, newQuantity);
        }
    };

    const handleRemoveItem = (item: CartItem) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            'हटाना है?',
            `${item.hindi} को कार्ट से हटाएं?`,
            [
                { text: 'नहीं', style: 'cancel' },
                {
                    text: 'हां, हटाओ',
                    style: 'destructive',
                    onPress: () => removeItem(item.id),
                },
            ]
        );
    };

    const handleClearCart = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            'पूरा कार्ट खाली करें?',
            'सब सर्विस हट जाएंगी',
            [
                { text: 'नहीं', style: 'cancel' },
                {
                    text: 'हां, खाली करो',
                    style: 'destructive',
                    onPress: () => clearCart(),
                },
            ]
        );
    };

    const handleProceedToPayment = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsProcessing(true);

        // Simulate booking creation
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsProcessing(false);
        router.push('/(customer)/payment');
    };

    if (state.items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>🛒</Text>
                    <Text style={styles.emptyTitle}>कार्ट खाली है</Text>
                    <Text style={styles.emptySubtitle}>सर्विस जोड़ने के लिए होम जाएं</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => router.push('/(customer)/home')}
                    >
                        <LinearGradient
                            colors={['#0078D4', '#005A9E']}
                            style={styles.emptyButtonGradient}
                        >
                            <Text style={styles.emptyButtonText}>🏠 होम जाओ</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item, index }: { item: CartItem; index: number }) => (
        <Animated.View
            entering={SlideInRight.delay(index * 100)}
            exiting={SlideOutLeft}
            layout={Layout.springify()}
        >
            <View style={[styles.cartItem, { borderLeftColor: item.categoryColor }]}>
                <View style={styles.itemLeft}>
                    <View style={[styles.itemEmoji, { backgroundColor: item.categoryColor + '20' }]}>
                        <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
                    </View>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemHindi}>{item.hindi}</Text>
                        <Text style={styles.itemEnglish}>{item.english}</Text>
                        <Text style={styles.itemPrice}>
                            ₹{item.price}/{item.unit}
                        </Text>
                    </View>
                </View>

                <View style={styles.itemRight}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item, false)}
                            style={styles.quantityButton}
                        >
                            <Ionicons
                                name={item.quantity === 1 ? 'trash' : 'remove'}
                                size={18}
                                color={item.quantity === 1 ? '#EF4444' : '#333'}
                            />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange(item, true)}
                            style={[styles.quantityButton, styles.quantityButtonAdd]}
                        >
                            <Ionicons name="add" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.itemTotal}>
                        ₹{item.price * item.quantity}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );

    const ListFooter = () => (
        <>
            {/* Schedule Selection */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📅 कब चाहिए?</Text>
                <View style={styles.dateOptions}>
                    {[
                        { key: 'today', label: 'आज', icon: '🔥' },
                        { key: 'tomorrow', label: 'कल', icon: '📆' },
                        { key: 'custom', label: 'बाद में', icon: '⏰' },
                    ].map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            onPress={() => {
                                Haptics.selectionAsync();
                                setSelectedDate(option.key as typeof selectedDate);
                            }}
                            style={[
                                styles.dateOption,
                                selectedDate === option.key && styles.dateOptionSelected,
                            ]}
                        >
                            <Text style={{ fontSize: 24 }}>{option.icon}</Text>
                            <Text
                                style={[
                                    styles.dateOptionText,
                                    selectedDate === option.key && styles.dateOptionTextSelected,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Address */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📍 पता</Text>
                <TouchableOpacity style={styles.addressCard}>
                    <View style={styles.addressIcon}>
                        <Ionicons name="home" size={24} color="#0078D4" />
                    </View>
                    <View style={styles.addressDetails}>
                        <Text style={styles.addressLabel}>घर</Text>
                        <Text style={styles.addressText}>
                            Koramangala, 4th Block{'\n'}Flat 402, Bangalore - 560034
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            {/* Price Breakdown */}
            <View style={styles.priceCard}>
                <Text style={styles.priceSectionTitle}>💰 पैसे का हिसाब</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>सर्विस चार्ज</Text>
                    <Text style={styles.priceValue}>₹{getSubtotal()}</Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>प्लेटफॉर्म फीस</Text>
                    <Text style={styles.priceValue}>₹{getPlatformFee()}</Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>GST (18%)</Text>
                    <Text style={styles.priceValue}>₹{getGST()}</Text>
                </View>

                <View style={styles.priceDivider} />

                <View style={styles.priceRow}>
                    <Text style={styles.totalLabel}>कुल रकम</Text>
                    <Text style={styles.totalValue}>₹{getTotal()}</Text>
                </View>
            </View>

            {/* Savings Banner */}
            <View style={styles.savingsBanner}>
                <Text style={{ fontSize: 28, marginRight: 12 }}>🎉</Text>
                <View style={{ flex: 1 }}>
                    <Text style={styles.savingsTitle}>आपने बचाए ₹150!</Text>
                    <Text style={styles.savingsSubtitle}>एक साथ बुकिंग पर डिस्काउंट</Text>
                </View>
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>🛒 मेरा कार्ट</Text>
                    <Text style={styles.headerSubtitle}>{getItemCount()} सर्विस</Text>
                </View>
                <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
                    <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {/* Using FlashList for Performance */}
            <View style={{ flex: 1 }}>
                <FlashList
                    data={state.items}
                    renderItem={renderItem}
                    // @ts-ignore: estimatedItemSize exists in FlashList but having type issues
                    estimatedItemSize={120}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 150 }}
                    ListFooterComponent={ListFooter}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Bottom CTA */}
            <View style={styles.bottomCTA}>
                <View style={styles.ctaLeft}>
                    <Text style={styles.ctaTotalLabel}>कुल रकम</Text>
                    <Text style={styles.ctaTotalValue}>₹{getTotal()}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.ctaButton, isProcessing && styles.ctaButtonDisabled]}
                    onPress={handleProceedToPayment}
                    disabled={isProcessing}
                >
                    <LinearGradient
                        colors={isProcessing ? ['#999', '#777'] : ['#22C55E', '#16A34A']}
                        style={styles.ctaButtonGradient}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Text style={styles.ctaButtonText}>पेमेंट करो</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    clearButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 12,
        padding: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemEmoji: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemHindi: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    itemEnglish: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 13,
        color: '#22C55E',
        fontWeight: '600',
        marginTop: 4,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonAdd: {
        backgroundColor: '#22C55E',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginHorizontal: 12,
    },
    itemTotal: {
        fontSize: 18,
        fontWeight: '900',
        color: '#333',
        marginTop: 8,
    },
    section: {
        marginHorizontal: 16,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333',
        marginBottom: 12,
    },
    dateOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    dateOption: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    dateOptionSelected: {
        borderColor: '#22C55E',
        backgroundColor: '#DCFCE7',
    },
    dateOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginTop: 4,
    },
    dateOptionTextSelected: {
        color: '#16A34A',
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
    },
    addressIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E0F2FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addressDetails: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    addressText: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    priceCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
        borderRadius: 20,
    },
    priceSectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333',
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 15,
        color: '#666',
    },
    priceValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
    },
    priceDivider: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#22C55E',
    },
    savingsBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F59E0B',
    },
    savingsTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#D97706',
    },
    savingsSubtitle: {
        fontSize: 13,
        color: '#92400E',
        marginTop: 2,
    },
    bottomCTA: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    ctaLeft: {},
    ctaTotalLabel: {
        fontSize: 12,
        color: '#666',
    },
    ctaTotalValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#333',
    },
    ctaButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    ctaButtonDisabled: {
        opacity: 0.7,
    },
    ctaButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 16,
        gap: 8,
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
    },
    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyEmoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    emptyButtonGradient: {
        paddingHorizontal: 32,
        paddingVertical: 16,
    },
    emptyButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});
