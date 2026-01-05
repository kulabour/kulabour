/**
 * Customer Terms & Policies
 * Accept terms to use KULABOUR services
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Vibration,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface PolicyItem {
    id: string;
    title: string;
    emoji: string;
    accepted: boolean;
    content: string[];
}

export default function CustomerPoliciesScreen() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [currentPolicy, setCurrentPolicy] = useState<PolicyItem | null>(null);

    const [policies, setPolicies] = useState<PolicyItem[]>([
        {
            id: 'service_terms',
            title: 'सेवा की शर्तें (Service Terms)',
            emoji: '📋',
            accepted: false,
            content: [
                '✅ KULABOUR वेरिफाइड मजदूरों की सेवा प्रदान करता है',
                '✅ सेवा की गुणवत्ता की जिम्मेदारी मजदूर की है',
                '✅ पेमेंट सिर्फ ऐप के माध्यम से करें',
                '✅ मजदूर को सीधे नकद न दें',
                '✅ काम की निगरानी करना आपकी जिम्मेदारी है',
            ],
        },
        {
            id: 'payment_policy',
            title: 'पेमेंट नियम (Payment Policy)',
            emoji: '💰',
            accepted: false,
            content: [
                '💰 रेट पहले से फिक्स होता है',
                '💰 काम पूरा होने पर ही पेमेंट करें',
                '💰 EMI विकल्प उपलब्ध है',
                '💰 UPI, कार्ड, नेट बैंकिंग से पे करें',
                '💰 रिफंड 3-5 दिनों में मिलेगा',
            ],
        },
        {
            id: 'cancellation',
            title: 'कैंसिलेशन पॉलिसी (Cancellation)',
            emoji: '❌',
            accepted: false,
            content: [
                '❌ मजदूर आने से पहले फ्री कैंसिलेशन',
                '❌ मजदूर पहुंचने के बाद ₹50 चार्ज',
                '❌ काम शुरू होने के बाद पूरी राशि लगेगी',
                '❌ इमरजेंसी में सपोर्ट से बात करें',
            ],
        },
        {
            id: 'safety',
            title: 'सुरक्षा नियम (Safety)',
            emoji: '🛡️',
            accepted: false,
            content: [
                '🛡️ सभी मजदूर आधार वेरिफाइड हैं',
                '🛡️ बीमा कवर शामिल है',
                '🛡️ मजदूर को घर में अकेला न छोड़ें',
                '🛡️ कीमती सामान सुरक्षित रखें',
                '🛡️ किसी भी समस्या पर 112 कॉल करें',
            ],
        },
    ]);

    const openPolicy = (policy: PolicyItem) => {
        Vibration.vibrate(30);
        setCurrentPolicy(policy);
        setShowModal(true);
    };

    const acceptPolicy = () => {
        if (!currentPolicy) return;
        Vibration.vibrate(50);
        setPolicies(policies.map(p =>
            p.id === currentPolicy.id ? { ...p, accepted: true } : p
        ));
        setShowModal(false);
    };

    const acceptAll = () => {
        Vibration.vibrate([0, 100, 100, 100]);
        setPolicies(policies.map(p => ({ ...p, accepted: true })));
    };

    const handleComplete = () => {
        Vibration.vibrate([0, 100, 100, 200]);
        router.push('/auth/customer/complete');
    };

    const allAccepted = policies.every(p => p.accepted);

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
                style={{ paddingTop: 50, paddingBottom: 24, paddingHorizontal: 24 }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ position: 'absolute', top: 50, left: 16, padding: 8, zIndex: 10 }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginTop: 16 }}>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
                        📜 नियम और शर्तें
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                        Terms & Conditions
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                {!allAccepted && (
                    <TouchableOpacity
                        onPress={acceptAll}
                        style={{
                            backgroundColor: '#0078D4',
                            paddingVertical: 16,
                            borderRadius: 14,
                            alignItems: 'center',
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>
                            ✅ सभी शर्तें स्वीकार करें
                        </Text>
                    </TouchableOpacity>
                )}

                {policies.map((policy) => (
                    <TouchableOpacity
                        key={policy.id}
                        onPress={() => openPolicy(policy)}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            padding: 18,
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: policy.accepted ? '#0078D4' : '#E5E7EB',
                        }}
                    >
                        <Text style={{ fontSize: 28, marginRight: 14 }}>{policy.emoji}</Text>
                        <Text style={{ flex: 1, color: '#111', fontSize: 15, fontWeight: '600' }}>
                            {policy.title}
                        </Text>
                        {policy.accepted ? (
                            <View style={{
                                backgroundColor: '#0078D4',
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            </View>
                        ) : (
                            <Text style={{ color: '#6B7280', fontSize: 12 }}>पढ़ें →</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    padding: 20,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                }}
            >
                <TouchableOpacity
                    onPress={handleComplete}
                    disabled={!allAccepted}
                    style={{
                        backgroundColor: allAccepted ? '#0078D4' : '#9CA3AF',
                        paddingVertical: 18,
                        borderRadius: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>
                        {allAccepted ? '✅ आगे बढ़ें' : 'सभी शर्तें स्वीकार करें'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        padding: 24,
                    }}>
                        {currentPolicy && (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 32, marginRight: 12 }}>{currentPolicy.emoji}</Text>
                                    <Text style={{ color: '#111', fontSize: 18, fontWeight: '800', flex: 1 }}>
                                        {currentPolicy.title}
                                    </Text>
                                </View>

                                <ScrollView style={{ maxHeight: 250, marginBottom: 20 }}>
                                    {currentPolicy.content.map((item, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: '#F3F4F6',
                                                padding: 14,
                                                borderRadius: 12,
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Text style={{ color: '#333', fontSize: 14 }}>{item}</Text>
                                        </View>
                                    ))}
                                </ScrollView>

                                <TouchableOpacity
                                    onPress={acceptPolicy}
                                    style={{
                                        backgroundColor: '#0078D4',
                                        paddingVertical: 16,
                                        borderRadius: 14,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800' }}>
                                        ✅ मैं सहमत हूँ
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
