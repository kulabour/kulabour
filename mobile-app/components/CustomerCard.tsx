/**
 * KULABOUR Partner App - Customer Card Component
 * Shows customer details to the worker (like Rapido/Swiggy partner apps)
 * 
 * Displays:
 * - Customer photo and name
 * - Phone number with call button
 * - Address and location
 * - Registration date (member since)
 * - Customer rating
 * - Distance and ETA
 */

import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export interface CustomerInfo {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address: string;
    city?: string;
    registrationDate: Date;
    rating: number;
    totalBookings: number;
    isVerified: boolean;
    photo?: string;
    distance?: string;
    eta?: string;
}

interface CustomerCardProps {
    customer: CustomerInfo;
    onViewMap?: () => void;
    onCall?: () => void;
    showFullDetails?: boolean;
}

export function CustomerCard({
    customer,
    onViewMap,
    onCall,
    showFullDetails = true
}: CustomerCardProps) {

    const handleCall = () => {
        Vibration.vibrate(50);
        if (onCall) {
            onCall();
        } else {
            Linking.openURL(`tel:${customer.phone}`);
        }
    };

    const formatMemberSince = () => {
        const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
            'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'];
        const date = customer.registrationDate;
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const getMembershipDuration = () => {
        const now = new Date();
        const regDate = customer.registrationDate;
        const months = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        if (months < 1) return 'नया सदस्य';
        if (months < 12) return `${months} महीने`;
        const years = Math.floor(months / 12);
        return `${years} साल`;
    };

    return (
        <View
            style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                margin: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 6,
                overflow: 'hidden',
            }}
        >
            {/* Header with gradient */}
            <LinearGradient
                colors={['#0078D4', '#005A9E']}
                style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                    👤 ग्राहक की जानकारी
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginLeft: 8 }}>
                    Customer Details
                </Text>
            </LinearGradient>

            <View style={{ padding: 20 }}>
                {/* Customer photo and name row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    {/* Photo */}
                    <View
                        style={{
                            width: 70,
                            height: 70,
                            borderRadius: 35,
                            backgroundColor: '#E8F4FD',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 16,
                            borderWidth: 3,
                            borderColor: '#0078D4',
                        }}
                    >
                        {customer.photo ? (
                            <Image
                                source={{ uri: customer.photo }}
                                style={{ width: 64, height: 64, borderRadius: 32 }}
                            />
                        ) : (
                            <Text style={{ fontSize: 40 }}>👤</Text>
                        )}
                    </View>

                    <View style={{ flex: 1 }}>
                        {/* Name with verified badge */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#111', fontSize: 22, fontWeight: '800' }}>
                                {customer.name}
                            </Text>
                            {customer.isVerified && (
                                <View
                                    style={{
                                        backgroundColor: '#22C55E',
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        borderRadius: 10,
                                        marginLeft: 8,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Ionicons name="checkmark-circle" size={12} color="#fff" />
                                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', marginLeft: 4 }}>
                                        Verified
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Rating */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Ionicons name="star" size={16} color="#F59E0B" />
                            <Text style={{ color: '#F59E0B', fontSize: 16, fontWeight: '700', marginLeft: 4 }}>
                                {customer.rating.toFixed(1)}
                            </Text>
                            <Text style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>
                                ({customer.totalBookings} bookings)
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Phone row with call button */}
                <View
                    style={{
                        backgroundColor: '#F0FDF4',
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#22C55E',
                    }}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#22C55E',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                        }}
                    >
                        <Ionicons name="call" size={24} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#666', fontSize: 12 }}>फ़ोन नंबर</Text>
                        <Text style={{ color: '#111', fontSize: 18, fontWeight: '700' }}>
                            +91 {customer.phone.slice(0, 5)}XXXXX
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleCall}
                        style={{
                            backgroundColor: '#22C55E',
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
                            📞 Call
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Address row */}
                <View
                    style={{
                        backgroundColor: '#F3F4F6',
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: '#EF4444',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                        }}
                    >
                        <Ionicons name="location" size={24} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#666', fontSize: 12 }}>पता (Address)</Text>
                        <Text style={{ color: '#111', fontSize: 16, fontWeight: '600' }}>
                            {customer.address}
                        </Text>
                        {customer.city && (
                            <Text style={{ color: '#888', fontSize: 13 }}>
                                {customer.city}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Distance and ETA */}
                {(customer.distance || customer.eta) && (
                    <View
                        style={{
                            flexDirection: 'row',
                            marginBottom: 12,
                        }}
                    >
                        {customer.distance && (
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: 12,
                                    padding: 12,
                                    marginRight: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>📏</Text>
                                <Text style={{ color: '#F59E0B', fontSize: 20, fontWeight: '900' }}>
                                    {customer.distance}
                                </Text>
                                <Text style={{ color: '#92400E', fontSize: 12 }}>दूरी</Text>
                            </View>
                        )}
                        {customer.eta && (
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: '#DCFCE7',
                                    borderRadius: 12,
                                    padding: 12,
                                    marginLeft: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ fontSize: 24 }}>⏱️</Text>
                                <Text style={{ color: '#22C55E', fontSize: 20, fontWeight: '900' }}>
                                    {customer.eta}
                                </Text>
                                <Text style={{ color: '#166534', fontSize: 12 }}>पहुँचने का समय</Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Registration info */}
                {showFullDetails && (
                    <View
                        style={{
                            backgroundColor: '#F3F4F6',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: '#8B5CF6',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}
                        >
                            <Ionicons name="time" size={24} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#666', fontSize: 12 }}>
                                सदस्य बने (Member Since)
                            </Text>
                            <Text style={{ color: '#111', fontSize: 16, fontWeight: '600' }}>
                                {formatMemberSince()}
                            </Text>
                            <Text style={{ color: '#8B5CF6', fontSize: 13, fontWeight: '600' }}>
                                {getMembershipDuration()} से सदस्य
                            </Text>
                        </View>
                    </View>
                )}

                {/* Email if available */}
                {showFullDetails && customer.email && (
                    <View
                        style={{
                            backgroundColor: '#F3F4F6',
                            borderRadius: 16,
                            padding: 16,
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: '#0078D4',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}
                        >
                            <Ionicons name="mail" size={24} color="#fff" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#666', fontSize: 12 }}>ईमेल (Email)</Text>
                            <Text style={{ color: '#111', fontSize: 15, fontWeight: '600' }}>
                                {customer.email}
                            </Text>
                        </View>
                    </View>
                )}

                {/* View on Map button */}
                {onViewMap && (
                    <TouchableOpacity
                        onPress={() => {
                            Vibration.vibrate(50);
                            onViewMap();
                        }}
                        style={{
                            backgroundColor: '#0078D4',
                            borderRadius: 16,
                            paddingVertical: 18,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="map" size={24} color="#fff" />
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800', marginLeft: 10 }}>
                            🗺️ नक्शे पर देखें
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

export default CustomerCard;
