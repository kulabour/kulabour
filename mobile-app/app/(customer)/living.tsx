import React from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { ParticleField } from '../../components/ParticleField';
import { MagicSearchBar } from '../../components/MagicSearchBar';
import { MagicTouchLayer } from '../../components/MagicTouchLayer';
import { HolographicCard } from '../../components/HolographicCard';

const SERVICES = [
    { hindi: "मिस्त्री", english: "Mason", price: "600/day", imageUri: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=400", rating: 4.9, verified: true, href: "/(customer)/booking/mason" },
    { hindi: "बिजली वाला", english: "Electrician", price: "200/visit", imageUri: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", rating: 4.8, verified: true, href: "/(customer)/booking/electrician" },
    { hindi: "नल वाला", english: "Plumber", price: "250/visit", imageUri: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400", rating: 4.9, verified: true, href: "/(customer)/booking/plumber" },
    { hindi: "बढ़ई", english: "Carpenter", price: "300/day", imageUri: "https://images.unsplash.com/photo-1611021061285-19a873c9d2f6?w=400", rating: 4.7, verified: true, href: "/(customer)/booking/carpenter" },
    { hindi: "रंग वाला", english: "Painter", price: "15/sqft", imageUri: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400", rating: 4.8, verified: true, href: "/(customer)/booking/painter" },
    { hindi: "एसी वाला", english: "AC Repair", price: "499/visit", imageUri: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400", rating: 4.7, verified: true, href: "/(customer)/booking/ac" },
    { hindi: "जेसीबी", english: "JCB Operator", price: "1200/hr", imageUri: "https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?w=400", rating: 4.8, verified: true, href: "/(customer)/booking/jcb" },
    { hindi: "सफाई", english: "Deep Cleaning", price: "999", imageUri: "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?w=400", rating: 4.9, verified: true, href: "/(customer)/booking/cleaning" },
];

export default function LivingHomePage() {
    return (
        <MagicTouchLayer>
            <View className="flex-1">
                {/* Particle Background */}
                <ParticleField particleCount={25} />

                {/* Content */}
                <View className="flex-1 z-10">
                    {/* Magic Search Bar */}
                    <MagicSearchBar />

                    {/* Live Workers Indicator */}
                    <View className="px-6 mb-4">
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(16, 124, 16, 0.15)',
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(16, 124, 16, 0.3)',
                                alignSelf: 'flex-start',
                            }}
                        >
                            <View
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#107C10',
                                    marginRight: 10,
                                    shadowColor: '#107C10',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 1,
                                    shadowRadius: 8,
                                }}
                            />
                            <Text style={{ color: '#107C10', fontWeight: '700', fontSize: 14 }}>
                                47 Workers Online
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 8, fontSize: 12 }}>
                                • Near You
                            </Text>
                        </View>
                    </View>

                    {/* Section Title */}
                    <View className="px-6 mb-4">
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 32,
                                fontWeight: '900',
                                textShadowColor: 'rgba(0, 120, 212, 0.5)',
                                textShadowOffset: { width: 0, height: 4 },
                                textShadowRadius: 16,
                            }}
                        >
                            सेवाएं
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>
                            Tap any card to book instantly
                        </Text>
                    </View>

                    {/* Holographic Service Grid */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
                    >
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {SERVICES.map((service, index) => (
                                <HolographicCard
                                    key={index}
                                    hindi={service.hindi}
                                    english={service.english}
                                    imageUri={service.imageUri}
                                    price={service.price}
                                    href={service.href}
                                    rating={service.rating}
                                    verified={service.verified}
                                    index={index}
                                />
                            ))}
                        </View>

                        {/* Partner Mode CTA */}
                        <View
                            style={{
                                marginTop: 16,
                                marginHorizontal: 6,
                                padding: 20,
                                borderRadius: 20,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.1)',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    backgroundColor: 'rgba(0, 120, 212, 0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 16,
                                }}
                            >
                                <Ionicons name="briefcase" size={24} color="#0078D4" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                                    Are you a worker?
                                </Text>
                                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                                    Join as Partner →
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </MagicTouchLayer>
    );
}
