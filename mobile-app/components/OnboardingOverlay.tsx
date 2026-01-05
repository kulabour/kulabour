import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const ONBOARDING_KEY = 'onboarding_completed';

const steps = [
    {
        id: 1,
        title: 'Welcome to KULABOUR',
        description: 'Find skilled workers instantly for all your service needs',
        highlight: 'home-screen',
    },
    {
        id: 2,
        title: 'Search for Services',
        description: 'Browse categories or search for specific services you need',
        highlight: 'search-input',
    },
    {
        id: 3,
        title: 'Book & Track',
        description: 'Book services easily and track workers in real-time',
        highlight: 'booking-button',
    },
    {
        id: 4,
        title: 'Rate & Review',
        description: 'Share your experience to help others make better choices',
        highlight: 'rating-stars',
    },
];

export function OnboardingOverlay() {
    const [visible, setVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        try {
            const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
            if (!completed) {
                setVisible(true);
            }
        } catch (error) {
            console.error('Failed to check onboarding:', error);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            setVisible(false);
        } catch (error) {
            console.error('Failed to save onboarding:', error);
        }
    };

    if (!visible) return null;

    const step = steps[currentStep];

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <BlurView intensity={80} style={StyleSheet.absoluteFill}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.title}>{step.title}</Text>
                        <Text style={styles.description}>{step.description}</Text>

                        {/* Progress dots */}
                        <View style={styles.dotsContainer}>
                            {steps.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        index === currentStep && styles.dotActive,
                                    ]}
                                />
                            ))}
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                                <Text style={styles.nextText}>
                                    {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 32,
        paddingBottom: 48,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 32,
        lineHeight: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: '#0078D4',
        width: 24,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    skipText: {
        fontSize: 16,
        color: '#64748B',
    },
    nextButton: {
        backgroundColor: '#0078D4',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    nextText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
});
