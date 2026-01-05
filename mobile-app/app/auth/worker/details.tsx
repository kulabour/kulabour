/**
 * KULABOUR Worker Registration - Basic Details
 * Step 3: Name, Address, Profile Photo
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Vibration,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WorkerDetailsScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    const handlePhotoUpload = () => {
        Vibration.vibrate(50);
        // Would open camera/gallery
        setPhoto('https://via.placeholder.com/150');
    };

    const handleNext = () => {
        if (!name || !address || !city) return;

        Vibration.vibrate([0, 50, 50, 50]);
        router.push('/auth/worker/documents');
    };

    const isValid = name.length > 2 && address.length > 5 && city.length > 2;

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
                        Step 2 of 5
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 4 }}>
                        👤 अपनी जानकारी दें
                    </Text>
                </View>

                {/* Progress bar */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 16,
                        paddingHorizontal: 20,
                    }}
                >
                    {[1, 2, 3, 4, 5].map((step) => (
                        <View
                            key={step}
                            style={{
                                flex: 1,
                                height: 6,
                                backgroundColor: step <= 2 ? '#fff' : 'rgba(255,255,255,0.3)',
                                borderRadius: 3,
                                marginHorizontal: 2,
                            }}
                        />
                    ))}
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                {/* Photo Upload */}
                <TouchableOpacity
                    onPress={handlePhotoUpload}
                    style={{
                        alignSelf: 'center',
                        marginBottom: 24,
                    }}
                >
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            backgroundColor: '#E5E7EB',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 4,
                            borderColor: '#22C55E',
                            borderStyle: photo ? 'solid' : 'dashed',
                        }}
                    >
                        {photo ? (
                            <Image
                                source={{ uri: photo }}
                                style={{ width: 112, height: 112, borderRadius: 56 }}
                            />
                        ) : (
                            <>
                                <Text style={{ fontSize: 40 }}>📷</Text>
                                <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>
                                    फोटो अपलोड
                                </Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Name Input */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: '#333', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                        👤 पूरा नाम (Full Name) *
                    </Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="जैसे: राजेश कुमार"
                        placeholderTextColor="#9CA3AF"
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            padding: 16,
                            fontSize: 18,
                            borderWidth: 2,
                            borderColor: name.length > 2 ? '#22C55E' : '#E5E7EB',
                        }}
                    />
                </View>

                {/* Father's Name */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: '#333', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                        👨 पिता का नाम (Father's Name)
                    </Text>
                    <TextInput
                        value={fatherName}
                        onChangeText={setFatherName}
                        placeholder="जैसे: श्याम लाल"
                        placeholderTextColor="#9CA3AF"
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            padding: 16,
                            fontSize: 18,
                            borderWidth: 2,
                            borderColor: '#E5E7EB',
                        }}
                    />
                </View>

                {/* Address */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ color: '#333', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                        🏠 घर का पता (Address) *
                    </Text>
                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        placeholder="मकान/गली नंबर, मोहल्ला"
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={3}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 14,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 2,
                            borderColor: address.length > 5 ? '#22C55E' : '#E5E7EB',
                            minHeight: 80,
                            textAlignVertical: 'top',
                        }}
                    />
                </View>

                {/* City and Pincode Row */}
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ color: '#333', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            🏙️ शहर (City) *
                        </Text>
                        <TextInput
                            value={city}
                            onChangeText={setCity}
                            placeholder="नोएडा"
                            placeholderTextColor="#9CA3AF"
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 14,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 2,
                                borderColor: city.length > 2 ? '#22C55E' : '#E5E7EB',
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={{ color: '#333', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
                            📮 पिनकोड
                        </Text>
                        <TextInput
                            value={pincode}
                            onChangeText={setPincode}
                            placeholder="201301"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="number-pad"
                            maxLength={6}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 14,
                                padding: 16,
                                fontSize: 16,
                                borderWidth: 2,
                                borderColor: pincode.length === 6 ? '#22C55E' : '#E5E7EB',
                            }}
                        />
                    </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!isValid}
                    style={{
                        backgroundColor: isValid ? '#22C55E' : '#9CA3AF',
                        paddingVertical: 20,
                        borderRadius: 16,
                        alignItems: 'center',
                        marginTop: 12,
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                        आगे बढ़ें →
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
