import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Find Trusted Workers\nNear You',
    titleHi: 'अपने पास विश्वसनीय\nकारीगर खोजें',
    subtitle: 'Book verified painters, plumbers, electricians & more in 60 seconds',
    icon: 'account-search' as const,
    color: '#E65100',
  },
  {
    title: 'Real-Time Tracking\n& Live Updates',
    titleHi: 'रियल-टाइम ट्रैकिंग\nऔर लाइव अपडेट',
    subtitle: 'Track your worker\'s arrival and get notified at every step',
    icon: 'map-marker-radius' as const,
    color: '#00796B',
  },
  {
    title: 'Secure Payments\n& Fair Pricing',
    titleHi: 'सुरक्षित भुगतान\nऔर उचित मूल्य',
    subtitle: 'Pay via UPI, cards or cash. Transparent pricing with no hidden charges',
    icon: 'shield-check' as const,
    color: '#FFB300',
  },
];

const LANGUAGES = [
  { code: 'en', label: 'English', labelNative: 'English' },
  { code: 'hi', label: 'Hindi', labelNative: 'हिंदी' },
  { code: 'gu', label: 'Gujarati', labelNative: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', labelNative: 'मराठी' },
  { code: 'ta', label: 'Tamil', labelNative: 'தமிழ்' },
  { code: 'te', label: 'Telugu', labelNative: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', labelNative: 'বাংলা' },
  { code: 'kn', label: 'Kannada', labelNative: 'ಕನ್ನಡ' },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLang, setSelectedLang] = useState('en');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const animateToSlide = (next: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setCurrentSlide(next), 150);
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      animateToSlide(currentSlide + 1);
    }
  };

  const handleGetStarted = (role: 'customer' | 'worker') => {
    router.replace({
      pathname: '/login',
      params: { role, lang: selectedLang }
    });
  };

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#E65100', '#FF8F00', '#FFB300']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="hard-hat" size={36} color="#E65100" />
          </View>
          <Text style={styles.logoText}>KULI</Text>
          <Text style={styles.logoTextHi}>कुली</Text>
          <Text style={styles.tagline}>Har Kaam Ka Hero</Text>
        </Animated.View>

        {/* Slide Content */}
        <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={slide.icon} size={80} color="rgba(255,255,255,0.9)" />
          </View>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideTitleHi}>{slide.titleHi}</Text>
          <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
        </Animated.View>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => animateToSlide(i)}>
              <View style={[styles.dot, currentSlide === i && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        {/* Language Selection */}
        <View style={styles.languageContainer}>
          <Text style={styles.languageLabel}>Choose Language / भाषा चुनें</Text>
          <View style={styles.languageGrid}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                style={[
                  styles.languagePill,
                  selectedLang === lang.code && styles.languagePillActive,
                ]}
                onPress={() => setSelectedLang(lang.code)}
              >
                <Text
                  style={[
                    styles.languagePillText,
                    selectedLang === lang.code && styles.languagePillTextActive,
                  ]}
                >
                  {lang.labelNative}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          {isLast ? (
            <>
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                onPress={() => handleGetStarted('customer')}
              >
                <MaterialCommunityIcons name="account-search" size={22} color="#E65100" />
                <Text style={styles.primaryButtonText}>I Need a Worker</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
                onPress={() => handleGetStarted('worker')}
              >
                <MaterialCommunityIcons name="toolbox" size={22} color="#FFFFFF" />
                <Text style={styles.secondaryButtonText}>I Am a Worker</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>Next</Text>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#E65100" />
              </Pressable>
              <Pressable onPress={() => handleGetStarted('customer')}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 8 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
  },
  logoText: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginTop: 8, letterSpacing: 4 },
  logoTextHi: { fontSize: 20, color: 'rgba(255,255,255,0.8)', marginTop: -4 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontStyle: 'italic' },
  slideContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconContainer: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  slideTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', lineHeight: 36 },
  slideTitleHi: { fontSize: 18, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 4 },
  slideSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 12, lineHeight: 22, paddingHorizontal: 16 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: 4 },
  dotActive: { width: 24, backgroundColor: '#FFFFFF' },
  languageContainer: { marginBottom: 20 },
  languageLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 10 },
  languageGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  languagePill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)',
  },
  languagePillActive: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  languagePillText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  languagePillTextActive: { color: '#E65100', fontWeight: '600' },
  buttonsContainer: { gap: 12 },
  primaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#FFFFFF', height: 52, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  primaryButtonText: { fontSize: 17, fontWeight: '700', color: '#E65100' },
  secondaryButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 52, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
  },
  secondaryButtonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
  buttonPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  skipText: { fontSize: 15, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 4 },
});
