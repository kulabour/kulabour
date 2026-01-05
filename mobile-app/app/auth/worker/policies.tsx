/**
 * KULABOUR Worker Registration - Terms & Policies
 * Step 5: Accept all required policies for construction work
 * 
 * Policies:
 * 1. Service Terms (Construction Work)
 * 2. Payment Terms
 * 3. Safety Guidelines
 * 4. Cancellation Policy
 * 5. Dispute Resolution
 * 6. Worker Rights
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
    titleEn: string;
    emoji: string;
    required: boolean;
    accepted: boolean;
    content: string[];
}

export default function WorkerPoliciesScreen() {
    const router = useRouter();
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [currentPolicy, setCurrentPolicy] = useState<PolicyItem | null>(null);
    const [policies, setPolicies] = useState<PolicyItem[]>([
        {
            id: 'service_terms',
            title: 'सेवा की शर्तें',
            titleEn: 'Service Terms',
            emoji: '📋',
            required: true,
            accepted: false,
            content: [
                '✅ KULABOUR एक प्लेटफॉर्म है जो ग्राहकों और मजदूरों को जोड़ता है',
                '✅ आप एक स्वतंत्र सेवा प्रदाता हैं, KULABOUR के कर्मचारी नहीं',
                '✅ आपको अपने काम की गारंटी देनी होगी',
                '✅ ग्राहक की संपत्ति और सामान का ध्यान रखना होगा',
                '✅ काम की गुणवत्ता बनाए रखनी होगी',
                '✅ समय पर पहुंचना और काम पूरा करना अनिवार्य है',
                '✅ ग्राहक से सीधे पैसे न लें, सब पेमेंट ऐप से होगी',
            ],
        },
        {
            id: 'payment_terms',
            title: 'पेमेंट की शर्तें',
            titleEn: 'Payment Terms',
            emoji: '💰',
            required: true,
            accepted: false,
            content: [
                '💰 पेमेंट हर हफ्ते सीधे आपके बैंक अकाउंट में आएगी',
                '💰 KULABOUR 10-15% कमीशन लेता है',
                '💰 इंसेंटिव और बोनस अलग से मिलेंगे',
                '💰 कैंसिलेशन चार्ज कट सकता है',
                '💰 रेफरल बोनस: हर नए मजदूर पर ₹500',
                '💰 पीक आवर्स में ज्यादा कमाई',
                '💰 TDS कटौती लागू हो सकती है',
            ],
        },
        {
            id: 'safety_guidelines',
            title: 'सुरक्षा नियम',
            titleEn: 'Safety Guidelines',
            emoji: '🛡️',
            required: true,
            accepted: false,
            content: [
                '🛡️ काम करते समय सुरक्षा उपकरण (हेलमेट, दस्ताने) पहनें',
                '🛡️ बिजली का काम करते समय मेन स्विच ऑफ करें',
                '🛡️ ऊंचाई पर काम करते समय सेफ्टी बेल्ट पहनें',
                '🛡️ खतरनाक केमिकल से बचाव करें',
                '🛡️ आपातकालीन स्थिति में 112 पर कॉल करें',
                '🛡️ ₹5 लाख का दुर्घटना बीमा शामिल है',
                '🛡️ किसी भी दुर्घटना की तुरंत रिपोर्ट करें',
            ],
        },
        {
            id: 'cancellation_policy',
            title: 'कैंसिलेशन पॉलिसी',
            titleEn: 'Cancellation Policy',
            emoji: '❌',
            required: true,
            accepted: false,
            content: [
                '❌ काम स्वीकार करने के बाद कैंसिल करने पर जुर्माना',
                '❌ पहुंचने के बाद कैंसिल करने पर कम्पेंसेशन मिलेगा',
                '❌ बार-बार कैंसिल करने पर अकाउंट ब्लॉक हो सकता है',
                '❌ इमरजेंसी में कैंसिलेशन के लिए सपोर्ट से बात करें',
                '❌ ग्राहक द्वारा कैंसिल करने पर कोई असर नहीं',
                '❌ 24 घंटे पहले कैंसिल करने पर कोई चार्ज नहीं',
            ],
        },
        {
            id: 'dispute_resolution',
            title: 'विवाद समाधान',
            titleEn: 'Dispute Resolution',
            emoji: '⚖️',
            required: true,
            accepted: false,
            content: [
                '⚖️ किसी भी विवाद के लिए ऐप में शिकायत करें',
                '⚖️ 48 घंटे में जवाब मिलेगा',
                '⚖️ ग्राहक से सीधे बहस न करें',
                '⚖️ सबूत (फोटो/वीडियो) रखें',
                '⚖️ KULABOUR का फैसला अंतिम होगा',
                '⚖️ गंभीर शिकायतों पर कानूनी कार्रवाई हो सकती है',
                '⚖️ झूठी शिकायत करने पर अकाउंट बंद होगा',
            ],
        },
        {
            id: 'worker_rights',
            title: 'मजदूर अधिकार',
            titleEn: 'Worker Rights',
            emoji: '✊',
            required: true,
            accepted: false,
            content: [
                '✊ आप अपनी मर्जी से काम चुन सकते हैं',
                '✊ कोई भी काम जबरदस्ती नहीं कराया जाएगा',
                '✊ उचित पारिश्रमिक का अधिकार है',
                '✊ सुरक्षित कार्य वातावरण का अधिकार है',
                '✊ किसी भी भेदभाव के खिलाफ शिकायत का अधिकार',
                '✊ आप कभी भी प्लेटफॉर्म छोड़ सकते हैं',
                '✊ आपकी कमाई पर कोई रोक नहीं',
            ],
        },
    ]);

    const [acceptAll, setAcceptAll] = useState(false);

    const openPolicy = (policy: PolicyItem) => {
        Vibration.vibrate(30);
        setCurrentPolicy(policy);
        setShowPolicyModal(true);
    };

    const acceptPolicy = () => {
        if (!currentPolicy) return;

        Vibration.vibrate([0, 50, 50, 50]);
        setPolicies(policies.map(p =>
            p.id === currentPolicy.id ? { ...p, accepted: true } : p
        ));
        setShowPolicyModal(false);
    };

    const handleAcceptAll = () => {
        Vibration.vibrate([0, 100, 100, 100, 100, 100]);
        setPolicies(policies.map(p => ({ ...p, accepted: true })));
        setAcceptAll(true);
    };

    const handleNext = () => {
        Vibration.vibrate([0, 100, 100, 200]);
        router.push('/auth/worker/skills');
    };

    const allAccepted = policies.every(p => p.accepted);
    const acceptedCount = policies.filter(p => p.accepted).length;

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Header */}
            <LinearGradient
                colors={['#22C55E', '#16A34A']}
                style={{
                    paddingTop: 50,
                    paddingBottom: 24,
                    paddingHorizontal: 24,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ position: 'absolute', top: 50, left: 16, padding: 8, zIndex: 10 }}
                >
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginTop: 16 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                        Step 4 of 5
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 4 }}>
                        📜 नियम और शर्तें
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>
                        Terms & Policies
                    </Text>
                </View>

                {/* Progress bar */}
                <View style={{ flexDirection: 'row', marginTop: 16, paddingHorizontal: 20 }}>
                    {[1, 2, 3, 4, 5].map((step) => (
                        <View
                            key={step}
                            style={{
                                flex: 1,
                                height: 6,
                                backgroundColor: step <= 4 ? '#fff' : 'rgba(255,255,255,0.3)',
                                borderRadius: 3,
                                marginHorizontal: 2,
                            }}
                        />
                    ))}
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                {/* Status Banner */}
                <View
                    style={{
                        backgroundColor: allAccepted ? '#DCFCE7' : '#FEF3C7',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>
                        {allAccepted ? '✅' : '📝'}
                    </Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: allAccepted ? '#166534' : '#92400E', fontSize: 15, fontWeight: '600' }}>
                            {allAccepted
                                ? 'सभी शर्तें स्वीकार हो गईं!'
                                : `${acceptedCount}/${policies.length} शर्तें स्वीकार`
                            }
                        </Text>
                        <Text style={{ color: allAccepted ? '#22C55E' : '#B45309', fontSize: 12 }}>
                            {allAccepted
                                ? 'अब आप आगे बढ़ सकते हैं'
                                : 'सभी शर्तें पढ़ें और स्वीकार करें'
                            }
                        </Text>
                    </View>
                </View>

                {/* Accept All Button */}
                {!allAccepted && (
                    <TouchableOpacity
                        onPress={handleAcceptAll}
                        style={{
                            backgroundColor: '#0078D4',
                            paddingVertical: 16,
                            borderRadius: 14,
                            alignItems: 'center',
                            marginBottom: 20,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="checkmark-done" size={24} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 8 }}>
                            सभी शर्तें स्वीकार करें
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Policy Cards */}
                {policies.map((policy) => (
                    <TouchableOpacity
                        key={policy.id}
                        onPress={() => openPolicy(policy)}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 16,
                            padding: 18,
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: policy.accepted ? '#22C55E' : '#E5E7EB',
                        }}
                    >
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: policy.accepted ? '#DCFCE7' : '#F3F4F6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 14,
                            }}
                        >
                            <Text style={{ fontSize: 26 }}>{policy.emoji}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#111', fontSize: 16, fontWeight: '700' }}>
                                {policy.title}
                            </Text>
                            <Text style={{ color: '#6B7280', fontSize: 12 }}>
                                {policy.titleEn}
                            </Text>
                        </View>
                        {policy.accepted ? (
                            <View
                                style={{
                                    backgroundColor: '#22C55E',
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons name="checkmark" size={22} color="#fff" />
                            </View>
                        ) : (
                            <View
                                style={{
                                    backgroundColor: '#F3F4F6',
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 8,
                                }}
                            >
                                <Text style={{ color: '#6B7280', fontSize: 12 }}>पढ़ें →</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Fixed Bottom Button */}
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
                    onPress={handleNext}
                    disabled={!allAccepted}
                    style={{
                        backgroundColor: allAccepted ? '#22C55E' : '#9CA3AF',
                        paddingVertical: 18,
                        borderRadius: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                        {allAccepted ? 'आगे बढ़ें →' : 'सभी शर्तें स्वीकार करें पहले'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Policy Detail Modal */}
            <Modal visible={showPolicyModal} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 24,
                            maxHeight: '80%',
                        }}
                    >
                        {currentPolicy && (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 36, marginRight: 12 }}>{currentPolicy.emoji}</Text>
                                    <View>
                                        <Text style={{ color: '#111', fontSize: 20, fontWeight: '800' }}>
                                            {currentPolicy.title}
                                        </Text>
                                        <Text style={{ color: '#6B7280', fontSize: 13 }}>
                                            {currentPolicy.titleEn}
                                        </Text>
                                    </View>
                                </View>

                                <ScrollView style={{ maxHeight: 300, marginBottom: 20 }}>
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
                                            <Text style={{ color: '#333', fontSize: 14, lineHeight: 22 }}>
                                                {item}
                                            </Text>
                                        </View>
                                    ))}
                                </ScrollView>

                                <TouchableOpacity
                                    onPress={acceptPolicy}
                                    style={{
                                        backgroundColor: '#22C55E',
                                        paddingVertical: 18,
                                        borderRadius: 14,
                                        alignItems: 'center',
                                        marginBottom: 12,
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
                                        ✅ मैं सहमत हूँ (I Accept)
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setShowPolicyModal(false)}
                                    style={{ alignItems: 'center', paddingVertical: 12 }}
                                >
                                    <Text style={{ color: '#6B7280', fontSize: 15 }}>बाद में</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
