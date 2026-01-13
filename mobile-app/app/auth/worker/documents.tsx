/**
 * KULABOUR Worker Registration - Document Verification
 * Step 4: Verify Aadhar, Labour Card, eShram Card, Bank Account
 * 
 * Required for instant construction work verification
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Vibration,
    TextInput,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface DocumentStatus {
    uploaded: boolean;
    verified: boolean;
    file?: string;
}

export default function WorkerDocumentsScreen() {
    const router = useRouter();

    // Document states
    const [aadharFront, setAadharFront] = useState<DocumentStatus>({ uploaded: false, verified: false });
    const [aadharBack, setAadharBack] = useState<DocumentStatus>({ uploaded: false, verified: false });
    const [labourCard, setLabourCard] = useState<DocumentStatus>({ uploaded: false, verified: false });
    const [eshramCard, setEshramCard] = useState<DocumentStatus>({ uploaded: false, verified: false });

    // Bank details
    const [bankAccountNo, setBankAccountNo] = useState('');
    const [confirmAccountNo, setConfirmAccountNo] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [upiId, setUpiId] = useState('');

    // Modal state
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentDoc, setCurrentDoc] = useState('');

    const handleUpload = (docType: string) => {
        Vibration.vibrate(50);
        setCurrentDoc(docType);
        setShowUploadModal(true);
    };

    const simulateUpload = () => {
        Vibration.vibrate([0, 100, 50, 100]);
        setShowUploadModal(false);

        // Simulate upload completion
        setTimeout(() => {
            switch (currentDoc) {
                case 'aadhar_front':
                    setAadharFront({ uploaded: true, verified: true });
                    break;
                case 'aadhar_back':
                    setAadharBack({ uploaded: true, verified: true });
                    break;
                case 'labour_card':
                    setLabourCard({ uploaded: true, verified: true });
                    break;
                case 'eshram_card':
                    setEshramCard({ uploaded: true, verified: true });
                    break;
            }
        }, 500);
    };

    const handleNext = () => {
        Vibration.vibrate([0, 50, 50, 100]);
        router.push('/auth/worker/policies');
    };

    const isDocumentsComplete = aadharFront.uploaded && aadharBack.uploaded;
    const isBankComplete = bankAccountNo.length >= 9 && ifscCode.length >= 11;
    const canProceed = isDocumentsComplete;

    const DocumentCard = ({
        title,
        titleEn,
        emoji,
        status,
        onPress,
        required = false,
        description = ''
    }: {
        title: string;
        titleEn: string;
        emoji: string;
        status: DocumentStatus;
        onPress: () => void;
        required?: boolean;
        description?: string;
    }) => (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
                borderWidth: 2,
                borderColor: status.uploaded ? (status.verified ? '#22C55E' : '#F59E0B') : '#E5E7EB',
                borderStyle: status.uploaded ? 'solid' : 'dashed',
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: status.uploaded ? '#DCFCE7' : '#F3F4F6',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                    }}
                >
                    <Text style={{ fontSize: 32 }}>{emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#111', fontSize: 18, fontWeight: '700' }}>
                            {title}
                        </Text>
                        {required && (
                            <Text style={{ color: '#EF4444', fontSize: 14, marginLeft: 4 }}>*</Text>
                        )}
                    </View>
                    <Text style={{ color: '#6B7280', fontSize: 13 }}>{titleEn}</Text>
                    {description && (
                        <Text style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>
                            {description}
                        </Text>
                    )}
                </View>
                {status.uploaded ? (
                    <View
                        style={{
                            backgroundColor: status.verified ? '#22C55E' : '#F59E0B',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 10,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                            {status.verified ? '✅ Verified' : '⏳ Pending'}
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            backgroundColor: '#0078D4',
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 10,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                            📷 Upload
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Progress Header */}
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
                        Step 3 of 5
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 4 }}>
                        📄 डॉक्यूमेंट वेरिफिकेशन
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>
                        Document Verification
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
                                backgroundColor: step <= 3 ? '#fff' : 'rgba(255,255,255,0.3)',
                                borderRadius: 3,
                                marginHorizontal: 2,
                            }}
                        />
                    ))}
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                {/* Info Banner */}
                <View
                    style={{
                        backgroundColor: '#FEF3C7',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>🔒</Text>
                    <Text style={{ flex: 1, color: '#92400E', fontSize: 13 }}>
                        आपके डॉक्यूमेंट सुरक्षित रहेंगे। सिर्फ वेरिफिकेशन के लिए उपयोग होंगे।
                    </Text>
                </View>

                {/* Section: Aadhar Card */}
                <Text style={{ color: '#333', fontSize: 18, fontWeight: '800', marginBottom: 12 }}>
                    🪪 आधार कार्ड (Aadhar Card) *
                </Text>

                <DocumentCard
                    title="आधार - आगे का भाग"
                    titleEn="Aadhar Front Side"
                    emoji="🪪"
                    status={aadharFront}
                    onPress={() => handleUpload('aadhar_front')}
                    required
                    description="नाम और फोटो वाला भाग"
                />

                <DocumentCard
                    title="आधार - पीछे का भाग"
                    titleEn="Aadhar Back Side"
                    emoji="🪪"
                    status={aadharBack}
                    onPress={() => handleUpload('aadhar_back')}
                    required
                    description="पता वाला भाग"
                />

                {/* Section: Labour Card */}
                <Text style={{ color: '#333', fontSize: 18, fontWeight: '800', marginTop: 20, marginBottom: 12 }}>
                    🏗️ लेबर कार्ड (Labour Card)
                </Text>

                <DocumentCard
                    title="लेबर कार्ड"
                    titleEn="Labour Card / Shramik Card"
                    emoji="🏗️"
                    status={labourCard}
                    onPress={() => handleUpload('labour_card')}
                    description="बिल्डिंग एंड कंस्ट्रक्शन वर्कर्स बोर्ड द्वारा जारी"
                />

                {/* Section: eShram Card */}
                <Text style={{ color: '#333', fontSize: 18, fontWeight: '800', marginTop: 20, marginBottom: 12 }}>
                    🛡️ ई-श्रम कार्ड (eShram Card)
                </Text>

                <DocumentCard
                    title="ई-श्रम कार्ड"
                    titleEn="eShram Card (UAN Based)"
                    emoji="🛡️"
                    status={eshramCard}
                    onPress={() => handleUpload('eshram_card')}
                    description="असंगठित श्रमिकों का राष्ट्रीय डेटाबेस"
                />

                {/* Section: Bank Account */}
                <Text style={{ color: '#333', fontSize: 18, fontWeight: '800', marginTop: 24, marginBottom: 12 }}>
                    🏦 बैंक अकाउंट (Bank Account)
                </Text>

                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 12,
                    }}
                >
                    {/* Account Number */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#333', fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
                            अकाउंट नंबर *
                        </Text>
                        <TextInput
                            value={bankAccountNo}
                            onChangeText={setBankAccountNo}
                            placeholder="जैसे: 1234567890123"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="number-pad"
                            style={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                borderWidth: 2,
                                borderColor: bankAccountNo.length >= 9 ? '#22C55E' : '#E5E7EB',
                            }}
                        />
                    </View>

                    {/* Confirm Account Number */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#333', fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
                            अकाउंट नंबर दोबारा डालें *
                        </Text>
                        <TextInput
                            value={confirmAccountNo}
                            onChangeText={setConfirmAccountNo}
                            placeholder="दोबारा डालें"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="number-pad"
                            style={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                borderWidth: 2,
                                borderColor: confirmAccountNo === bankAccountNo && confirmAccountNo.length >= 9 ? '#22C55E' : '#E5E7EB',
                            }}
                        />
                        {confirmAccountNo && confirmAccountNo !== bankAccountNo && (
                            <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
                                ❌ अकाउंट नंबर मैच नहीं हुआ
                            </Text>
                        )}
                    </View>

                    {/* IFSC Code */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#333', fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
                            IFSC कोड *
                        </Text>
                        <TextInput
                            value={ifscCode}
                            onChangeText={(text) => setIfscCode(text.toUpperCase())}
                            placeholder="जैसे: SBIN0001234"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="characters"
                            maxLength={11}
                            style={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                borderWidth: 2,
                                borderColor: ifscCode.length === 11 ? '#22C55E' : '#E5E7EB',
                            }}
                        />
                    </View>

                    {/* Account Holder Name */}
                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: '#333', fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
                            खाताधारक का नाम
                        </Text>
                        <TextInput
                            value={accountHolderName}
                            onChangeText={setAccountHolderName}
                            placeholder="जैसा बैंक में है"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="words"
                            style={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                borderWidth: 2,
                                borderColor: '#E5E7EB',
                            }}
                        />
                    </View>

                    {/* UPI ID (Optional) */}
                    <View>
                        <Text style={{ color: '#333', fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
                            UPI ID (वैकल्पिक)
                        </Text>
                        <TextInput
                            value={upiId}
                            onChangeText={setUpiId}
                            placeholder="जैसे: 9876543210@paytm"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                            style={{
                                backgroundColor: '#F3F4F6',
                                borderRadius: 12,
                                padding: 14,
                                fontSize: 16,
                                borderWidth: 2,
                                borderColor: '#E5E7EB',
                            }}
                        />
                    </View>
                </View>

                {/* Info about payments */}
                <View
                    style={{
                        backgroundColor: '#DCFCE7',
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>💰</Text>
                    <Text style={{ flex: 1, color: '#166534', fontSize: 13 }}>
                        आपकी कमाई सीधे इसी अकाउंट में आएगी। हर हफ्ते पेमेंट।
                    </Text>
                </View>
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
                    disabled={!canProceed}
                    style={{
                        backgroundColor: canProceed ? '#22C55E' : '#9CA3AF',
                        paddingVertical: 18,
                        borderRadius: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                        आगे बढ़ें →
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Upload Modal */}
            <Modal visible={showUploadModal} transparent animationType="slide">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'flex-end',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            padding: 24,
                        }}
                    >
                        <Text style={{ color: '#111', fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center' }}>
                            📷 डॉक्यूमेंट अपलोड करें
                        </Text>

                        <TouchableOpacity
                            onPress={simulateUpload}
                            style={{
                                backgroundColor: '#0078D4',
                                paddingVertical: 18,
                                borderRadius: 14,
                                alignItems: 'center',
                                marginBottom: 12,
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                                📷 कैमरा से फोटो लें
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={simulateUpload}
                            style={{
                                backgroundColor: '#F3F4F6',
                                paddingVertical: 18,
                                borderRadius: 14,
                                alignItems: 'center',
                                marginBottom: 12,
                            }}
                        >
                            <Text style={{ color: '#333', fontSize: 18, fontWeight: '700' }}>
                                🖼️ गैलरी से चुनें
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowUploadModal(false)}
                            style={{
                                paddingVertical: 16,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#6B7280', fontSize: 16 }}>
                                रद्द करें
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
