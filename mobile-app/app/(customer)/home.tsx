/**
 * KULABOUR Customer App - Complete Home
 * All 70+ services with categories
 * Hindi-first, icon-based for uneducated users
 * Now with Cart functionality for multi-service booking
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Vibration,
    Dimensions,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import * as Haptics from 'expo-haptics';

import SERVICE_CATEGORIES from '../../data/serviceCatalog';
import FloatingCartButton from '../../components/ui/FloatingCartButton';
import { useCart } from '../../contexts/CartContext';
import { COLORS, SPACING } from '../../components/design/DesignSystem';

const { width } = Dimensions.get('window');

export default function CustomerHome() {
    const router = useRouter();
    const { addItem, isInCart, getItemQuantity } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const greeting = (() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'सुप्रभात';
        if (hour >= 12 && hour < 17) return 'नमस्ते';
        if (hour >= 17 && hour < 21) return 'शुभ संध्या';
        return 'शुभ रात्रि';
    })();

    const handleAddToCart = (service: any, category: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        addItem({
            id: `${category.id}_${service.id}`,
            serviceId: service.id,
            categoryId: category.id,
            emoji: service.emoji,
            hindi: service.hindi,
            english: service.english,
            price: service.price,
            unit: service.unit,
            categoryColor: category.color,
        });
    };

    const handleServicePress = (serviceId: string, categoryId: string) => {
        Vibration.vibrate(100);
        router.push(`/booking/selection?service=${serviceId}&category=${categoryId}`);
    };

    const handleCategoryPress = (categoryId: string) => {
        Vibration.vibrate(50);
        setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    };

    const categories = Object.values(SERVICE_CATEGORIES);

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
            <StatusBar barStyle="light-content" />

            {/* Floating Cart Button */}
            <FloatingCartButton />

            {/* Header */}
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
                style={{ paddingTop: 50, paddingBottom: 20, paddingHorizontal: 16 }}
            >
                {/* Greeting */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <View>
                        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                            {greeting} 👋
                        </Text>
                        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '900' }}>
                            क्या चाहिए?
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {/* Help Button */}
                        <Link href="/(customer)/help" asChild>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    padding: 12,
                                    borderRadius: 14,
                                }}
                            >
                                <Ionicons name="help-circle" size={24} color="#fff" />
                            </TouchableOpacity>
                        </Link>
                        {/* Voice Toggle */}
                        <TouchableOpacity
                            onPress={() => require('../../contexts/VoiceModeContext').useVoiceMode().toggleVoiceMode()}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                padding: 12,
                                borderRadius: 14,
                            }}
                        >
                            <Ionicons name="mic" size={24} color="#fff" />
                        </TouchableOpacity>

                        {/* Profile */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                padding: 12,
                                borderRadius: 14,
                            }}
                        >
                            <Ionicons name="person" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search bar */}
                <TouchableOpacity
                    style={{
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                        borderRadius: 16,
                    }}
                >
                    <Ionicons name="search" size={22} color="#666" />
                    <TextInput
                        placeholder="खोजो... (plumber, electrician)"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{
                            flex: 1,
                            marginLeft: 12,
                            fontSize: 16,
                            color: '#333',
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#0078D4',
                            padding: 10,
                            borderRadius: 12,
                        }}
                    >
                        <Ionicons name="mic" size={20} color="#fff" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Live workers indicator */}
                <View
                    style={{
                        backgroundColor: '#DCFCE7',
                        margin: 16,
                        padding: 16,
                        borderRadius: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#22C55E',
                    }}
                >
                    <Text style={{ fontSize: 32, marginRight: 12 }}>🟢</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#22C55E', fontSize: 22, fontWeight: '900' }}>
                            247 मज़दूर ऑनलाइन
                        </Text>
                        <Text style={{ color: '#666', fontSize: 14 }}>
                            आपके पास में तैयार हैं
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/booking/emergency')}
                        style={{
                            backgroundColor: '#EF4444',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>🚨 तुरंत</Text>
                    </TouchableOpacity>
                </View>

                {/* Category tabs - horizontal scroll */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 8 }}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => handleCategoryPress(category.id)}
                            style={{
                                backgroundColor: selectedCategory === category.id ? category.color : '#fff',
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                borderRadius: 30,
                                marginHorizontal: 4,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 2,
                                borderColor: category.color,
                            }}
                        >
                            <Text style={{ fontSize: 20, marginRight: 6 }}>{category.emoji}</Text>
                            <Text
                                style={{
                                    color: selectedCategory === category.id ? '#fff' : '#333',
                                    fontSize: 14,
                                    fontWeight: '700',
                                }}
                            >
                                {category.hindi}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Services Grid */}
                {categories.map((category) => {
                    // Show only selected category or all if none selected
                    if (selectedCategory && selectedCategory !== category.id) return null;

                    return (
                        <View key={category.id} style={{ marginTop: 16 }}>
                            {/* Category header */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 16,
                                    marginBottom: 12,
                                }}
                            >
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: category.color,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 12,
                                    }}
                                >
                                    <Text style={{ fontSize: 20 }}>{category.emoji}</Text>
                                </View>
                                <Text style={{ color: '#333', fontSize: 20, fontWeight: '800' }}>
                                    {category.hindi}
                                </Text>
                            </View>

                            {/* Services in this category */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    paddingHorizontal: 8,
                                }}
                            >
                                {category.services.map((service) => {
                                    const inCart = isInCart(service.id);
                                    const quantity = getItemQuantity(service.id);

                                    return (
                                        <View
                                            key={service.id}
                                            style={{
                                                width: (width - 48) / 4,
                                                marginHorizontal: 4,
                                                marginBottom: 16,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() => handleAddToCart(service, category)}
                                                activeOpacity={0.8}
                                                style={{ alignItems: 'center' }}
                                            >
                                                <View
                                                    style={{
                                                        width: 70,
                                                        height: 70,
                                                        borderRadius: 18,
                                                        backgroundColor: inCart ? category.color + '20' : '#fff',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        shadowColor: '#000',
                                                        shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.1,
                                                        shadowRadius: 4,
                                                        elevation: 3,
                                                        borderWidth: 2,
                                                        borderColor: inCart ? category.color : category.color + '40',
                                                    }}
                                                >
                                                    <Text style={{ fontSize: 32 }}>{service.emoji}</Text>
                                                    {/* Add to Cart Badge */}
                                                    {inCart ? (
                                                        <View
                                                            style={{
                                                                position: 'absolute',
                                                                top: -6,
                                                                right: -6,
                                                                backgroundColor: '#22C55E',
                                                                width: 22,
                                                                height: 22,
                                                                borderRadius: 11,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderWidth: 2,
                                                                borderColor: '#fff',
                                                            }}
                                                        >
                                                            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900' }}>
                                                                {quantity}
                                                            </Text>
                                                        </View>
                                                    ) : (
                                                        <View
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: -4,
                                                                right: -4,
                                                                backgroundColor: '#22C55E',
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: 12,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                shadowColor: '#22C55E',
                                                                shadowOffset: { width: 0, height: 2 },
                                                                shadowOpacity: 0.4,
                                                                shadowRadius: 4,
                                                                elevation: 4,
                                                            }}
                                                        >
                                                            <Ionicons name="add" size={16} color="#fff" />
                                                        </View>
                                                    )}
                                                </View>
                                                <Text
                                                    style={{
                                                        color: '#333',
                                                        fontSize: 12,
                                                        fontWeight: '600',
                                                        marginTop: 6,
                                                        textAlign: 'center',
                                                    }}
                                                    numberOfLines={2}
                                                >
                                                    {service.hindi}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: '#22C55E',
                                                        fontSize: 11,
                                                        fontWeight: '700',
                                                    }}
                                                >
                                                    ₹{service.price}/{service.unit}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    );
                })}

                {/* Recommended for You (AI Powered) */}
                {/* Feature Flag Check */}
                {require('../../services/FeatureFlagService').featureFlags.isEnabled('ENABLE_SMART_RECOMMENDATIONS') && (
                    <View style={{ margin: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <Text style={{ color: '#333', fontSize: 20, fontWeight: '800' }}>
                                ✨ आपके लिए (Recommended)
                            </Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {(() => {
                                // Import here to avoid top-level issues if any
                                // In a real app, this would be in a useEffect
                                const recommendations = require('../../services/RecommendationService').default.getRecommendations();

                                return recommendations.map((service: any, index: number) => (
                                    <TouchableOpacity
                                        key={`${service.id}-${index}`}
                                        onPress={() => {
                                            Vibration.vibrate(50);
                                            // Find category ID - simplified lookup
                                            const categoryId = (Object.keys(SERVICE_CATEGORIES) as Array<keyof typeof SERVICE_CATEGORIES>).find(catId =>
                                                SERVICE_CATEGORIES[catId].services.find((s: any) => s.id === service.id)
                                            ) || 'emergency';

                                            router.push(`/booking/selection?service=${service.id}&category=${categoryId}`);
                                        }}
                                        style={{
                                            backgroundColor: '#fff',
                                            padding: 16,
                                            borderRadius: 20,
                                            marginRight: 12,
                                            width: 160,
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 8,
                                            elevation: 2,
                                            borderWidth: 1,
                                            borderColor: '#f0f0f0',
                                        }}
                                    >
                                        {/* AI Reason Badge */}
                                        <View
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                backgroundColor: '#DBEAFE',
                                                paddingHorizontal: 8,
                                                paddingVertical: 4,
                                                borderRadius: 8,
                                            }}
                                        >
                                            <Text style={{ fontSize: 10, color: '#1E40AF', fontWeight: '700' }}>
                                                {service.reason || 'Popular'}
                                            </Text>
                                        </View>

                                        <Text style={{ fontSize: 48, marginTop: 12, marginBottom: 8 }}>{service.emoji}</Text>

                                        <Text
                                            style={{
                                                color: '#333',
                                                fontSize: 16,
                                                fontWeight: '700',
                                                textAlign: 'center',
                                                height: 40,
                                                textAlignVertical: 'center'
                                            }}
                                            numberOfLines={2}
                                        >
                                            {service.hindi}
                                        </Text>

                                        <Text style={{ color: '#22C55E', fontSize: 18, fontWeight: '900', marginTop: 4 }}>
                                            ₹{service.price}
                                        </Text>
                                    </TouchableOpacity>
                                ));
                            })()}
                        </ScrollView>
                    </View>
                )}

                {/* Help section */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        margin: 16,
                        padding: 20,
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: '#333', fontSize: 18, fontWeight: '800', marginBottom: 16 }}>
                        मदद चाहिए? 🤔
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: '#22C55E',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}
                            >
                                <Text style={{ fontSize: 28 }}>📞</Text>
                            </View>
                            <Text style={{ color: '#333', fontWeight: '700' }}>कॉल करो</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/support')}>
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: '#0078D4',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}
                            >
                                <Text style={{ fontSize: 28 }}>💬</Text>
                            </View>
                            <Text style={{ color: '#333', fontWeight: '700' }}>चैट करो</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center' }}>
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: '#F59E0B',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 8,
                                }}
                            >
                                <Text style={{ fontSize: 28 }}>❓</Text>
                            </View>
                            <Text style={{ color: '#333', fontWeight: '700' }}>FAQ</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Become a partner */}
                <TouchableOpacity
                    onPress={() => router.push('/partner')}
                    style={{
                        backgroundColor: '#1F2937',
                        margin: 16,
                        padding: 20,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 44, marginRight: 16 }}>👷</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>
                            काम करना है?
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                            पार्टनर बनो, पैसे कमाओ
                        </Text>
                    </View>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
