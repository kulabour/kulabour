/**
 * KULABOUR Worker Registration - Skills Selection
 * Step 5: Select your work skills
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Vibration,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Skill {
    id: string;
    hindi: string;
    english: string;
    emoji: string;
    color: string;
    selected: boolean;
}

export default function WorkerSkillsScreen() {
    const router = useRouter();
    const [skills, setSkills] = useState<Skill[]>([
        { id: 'mason', hindi: 'मिस्त्री', english: 'Mason', emoji: '🧱', color: '#FF6B35', selected: false },
        { id: 'electrician', hindi: 'बिजली वाला', english: 'Electrician', emoji: '⚡', color: '#FFD700', selected: false },
        { id: 'plumber', hindi: 'नल वाला', english: 'Plumber', emoji: '🔧', color: '#0078D4', selected: false },
        { id: 'carpenter', hindi: 'बढ़ई', english: 'Carpenter', emoji: '🪚', color: '#8B4513', selected: false },
        { id: 'painter', hindi: 'रंग वाला', english: 'Painter', emoji: '🎨', color: '#9B59B6', selected: false },
        { id: 'ac_technician', hindi: 'AC वाला', english: 'AC Technician', emoji: '❄️', color: '#00CED1', selected: false },
        { id: 'cleaner', hindi: 'सफाई वाला', english: 'Cleaner', emoji: '🧹', color: '#22C55E', selected: false },
        { id: 'helper', hindi: 'हेल्पर', english: 'Helper/Labour', emoji: '💪', color: '#6B7280', selected: false },
        { id: 'welder', hindi: 'वेल्डर', english: 'Welder', emoji: '🔥', color: '#EF4444', selected: false },
        { id: 'tile_fitter', hindi: 'टाइल्स वाला', english: 'Tile Fitter', emoji: '🔲', color: '#8B5CF6', selected: false },
        { id: 'jcb_operator', hindi: 'JCB वाला', english: 'JCB Operator', emoji: '🚜', color: '#F59E0B', selected: false },
        { id: 'driver', hindi: 'ड्राइवर', english: 'Driver', emoji: '🚗', color: '#1F2937', selected: false },
    ]);

    const toggleSkill = (id: string) => {
        Vibration.vibrate(30);
        setSkills(skills.map(s =>
            s.id === id ? { ...s, selected: !s.selected } : s
        ));
    };

    const handleComplete = () => {
        Vibration.vibrate([0, 100, 100, 200, 100, 100]);
        router.push('/auth/worker/complete');
    };

    const selectedCount = skills.filter(s => s.selected).length;
    const canProceed = selectedCount >= 1;

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
                        Last Step (5 of 5)
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 4 }}>
                        🛠️ आपका काम क्या है?
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 }}>
                        Select Your Skills
                    </Text>
                </View>

                {/* Progress bar - Full */}
                <View style={{ flexDirection: 'row', marginTop: 16, paddingHorizontal: 20 }}>
                    {[1, 2, 3, 4, 5].map((step) => (
                        <View
                            key={step}
                            style={{
                                flex: 1,
                                height: 6,
                                backgroundColor: '#fff',
                                borderRadius: 3,
                                marginHorizontal: 2,
                            }}
                        />
                    ))}
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                {/* Selection info */}
                <View
                    style={{
                        backgroundColor: selectedCount > 0 ? '#DCFCE7' : '#FEF3C7',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ fontSize: 24, marginRight: 12 }}>
                        {selectedCount > 0 ? '✅' : '👆'}
                    </Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            color: selectedCount > 0 ? '#166534' : '#92400E',
                            fontSize: 15,
                            fontWeight: '600'
                        }}>
                            {selectedCount > 0
                                ? `${selectedCount} काम चुना`
                                : 'कम से कम 1 काम चुनें'
                            }
                        </Text>
                        <Text style={{
                            color: selectedCount > 0 ? '#22C55E' : '#B45309',
                            fontSize: 12
                        }}>
                            जितने ज्यादा काम, उतनी ज्यादा कमाई!
                        </Text>
                    </View>
                </View>

                {/* Skills Grid */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
                    {skills.map((skill) => (
                        <TouchableOpacity
                            key={skill.id}
                            onPress={() => toggleSkill(skill.id)}
                            style={{
                                width: (width - 52) / 2,
                                margin: 6,
                                backgroundColor: skill.selected ? skill.color + '20' : '#fff',
                                borderRadius: 16,
                                padding: 18,
                                alignItems: 'center',
                                borderWidth: 3,
                                borderColor: skill.selected ? skill.color : '#E5E7EB',
                            }}
                        >
                            <View
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    backgroundColor: skill.color + '30',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 12,
                                }}
                            >
                                <Text style={{ fontSize: 36 }}>{skill.emoji}</Text>
                            </View>
                            <Text style={{
                                color: '#111',
                                fontSize: 18,
                                fontWeight: '800',
                                textAlign: 'center',
                            }}>
                                {skill.hindi}
                            </Text>
                            <Text style={{ color: '#6B7280', fontSize: 12 }}>
                                {skill.english}
                            </Text>
                            {skill.selected && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        backgroundColor: skill.color,
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
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
                    onPress={handleComplete}
                    disabled={!canProceed}
                    style={{
                        backgroundColor: canProceed ? '#22C55E' : '#9CA3AF',
                        paddingVertical: 18,
                        borderRadius: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>
                        {canProceed ? '✅ रजिस्ट्रेशन पूरा करें' : 'कम से कम 1 काम चुनें'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
