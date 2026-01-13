import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface VoiceTutorialProps {
    visible: boolean;
    onComplete: () => void;
}

const TUTORIAL_STEPS = [
    {
        icon: '🎤',
        title: 'माइक टैप करें',
        subtitle: 'Tap the microphone button',
        description: 'नीचे माइक बटन दबाएं'
    },
    {
        icon: '🗣️',
        title: 'बोलें',
        subtitle: 'Speak your request',
        description: 'उदाहरण: "मुझे प्लम्बर चाहिए"'
    },
    {
        icon: '✅',
        title: 'वर्कर मिलें',
        subtitle: 'Get workers instantly',
        description: 'आसपास के वर्कर मिलेंगे'
    },
];

export function VoiceTutorial({ visible, onComplete }: VoiceTutorialProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!visible) {
            setCurrentStep(0);
        }
    }, [visible]);

    const handleNext = () => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const step = TUTORIAL_STEPS[currentStep];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onComplete}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Skip button */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={onComplete}
                    >
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>

                    {/* Step content */}
                    <Text style={styles.icon}>{step.icon}</Text>
                    <Text style={styles.title}>{step.title}</Text>
                    <Text style={styles.subtitle}>{step.subtitle}</Text>
                    <Text style={styles.description}>{step.description}</Text>

                    {/* Progress dots */}
                    <View style={styles.dotsContainer}>
                        {TUTORIAL_STEPS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentStep && styles.dotActive
                                ]}
                            />
                        ))}
                    </View>

                    {/* Next button */}
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextText}>
                            {currentStep < TUTORIAL_STEPS.length - 1 ? 'Next' : 'Got it!'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    skipButton: {
        alignSelf: 'flex-end',
        padding: 8,
    },
    skipText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    icon: {
        fontSize: 80,
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#94A3B8',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 32,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#475569',
    },
    dotActive: {
        backgroundColor: '#0078D4',
        width: 24,
    },
    nextButton: {
        backgroundColor: '#0078D4',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
    },
    nextText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
