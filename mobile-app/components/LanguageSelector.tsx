import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../services/MultiLanguageSupport';

interface LanguageSelectorProps {
    currentLanguage: LanguageCode;
    onLanguageChange: (language: LanguageCode) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
    const [showAll, setShowAll] = useState(false);

    // Most popular languages shown first
    const popularLanguages: LanguageCode[] = ['hi', 'en', 'ta', 'te', 'bn', 'mr'];
    const allLanguages = Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[];
    const displayLanguages = showAll ? allLanguages : popularLanguages;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🗣️ Select Your Language</Text>
            <Text style={styles.subtitle}>बोली चुनें | மொழியைத் தேர்வுசெய்</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.languageScroll}
            >
                {displayLanguages.map((code) => {
                    const lang = SUPPORTED_LANGUAGES[code];
                    const isSelected = code === currentLanguage;

                    return (
                        <TouchableOpacity
                            key={code}
                            style={[
                                styles.languageButton,
                                isSelected && styles.languageButtonActive,
                            ]}
                            onPress={() => onLanguageChange(code)}
                        >
                            <Text style={[
                                styles.languageNative,
                                isSelected && styles.languageNativeActive,
                            ]}>
                                {lang.native}
                            </Text>
                            <Text style={[
                                styles.languageName,
                                isSelected && styles.languageNameActive,
                            ]}>
                                {lang.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setShowAll(!showAll)}
            >
                <Text style={styles.showMoreText}>
                    {showAll ? '↑ Show Less' : `↓ Show All ${allLanguages.length} Languages`}
                </Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    🎙️ Speak naturally in any language
                </Text>
                <Text style={styles.infoSubtext}>
                    Voice agent will auto-detect and respond in your language
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#1E293B',
        borderRadius: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 16,
        textAlign: 'center',
    },
    languageScroll: {
        marginBottom: 12,
    },
    languageButton: {
        padding: 12,
        marginRight: 8,
        borderRadius: 8,
        backgroundColor: '#334155',
        minWidth: 100,
        alignItems: 'center',
    },
    languageButtonActive: {
        backgroundColor: '#0078D4',
    },
    languageNative: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    languageNativeActive: {
        color: 'white',
    },
    languageName: {
        fontSize: 12,
        color: '#94A3B8',
    },
    languageNameActive: {
        color: 'white',
    },
    showMoreButton: {
        padding: 12,
        alignItems: 'center',
    },
    showMoreText: {
        color: '#0078D4',
        fontSize: 14,
        fontWeight: '600',
    },
    infoBox: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#0F172A',
        borderRadius: 8,
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 4,
    },
    infoSubtext: {
        color: '#64748B',
        fontSize: 12,
    },
});
