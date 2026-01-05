/**
 * KULABOUR DIMENSION - "KULI" AI Voice Assistant
 * A Hindi-first voice AI that helps users book workers naturally
 * Speaks like a friendly local contractor!
 */

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    Modal,
    Dimensions,
    Easing,
    Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { haptic } from '../engine/HapticRhythm';

const { width, height } = Dimensions.get('window');

// AI responses in Hindi/English mix (natural Indian style)
const AI_RESPONSES = {
    customer: {
        greeting: [
            "नमस्ते भाई! क्या काम करवाना है?",
            "हाँ बोलो, कौन सा मिस्त्री चाहिए?",
            "बताओ क्या मदद करूँ आज?",
        ],
        confirmBooking: [
            "अच्छा, {service} बुक करू? बोलो हाँ या ना।",
            "{service} के लिए ₹{price} लगेगा। Done करूँ?",
        ],
        searching: [
            "ठहरो, पास में देख रहा हूँ...",
            "Wait करो, best {service} ढूंढ रहा हूँ...",
        ],
        found: [
            "मिल गया भाई! {name} available है, rating {rating} है।",
            "{name} सबसे नज़दीक है, {distance} दूर।",
        ],
        error: [
            "अरे यार, समझ नहीं आया। फिर से बोलो।",
            "Sorry भाई, थोड़ा clear बोलो।",
        ],
        thanks: [
            "Done भाई! Worker आ रहा है।",
            "Book हो गया! Track करो app में।",
        ],
    },
    worker: {
        greeting: [
            "नमस्ते उस्ताद! काम शुरू करें?",
            "हाँ भाई, क्या report देखनी है?",
            "बोलो उस्ताद, क्या मदद चाहिए?",
        ],
        online: [
            "ठीक है, अब आप Online हैं। काम का wait करो।",
            "Online कर दिया। तैयार रहना!",
        ],
        offline: [
            "Chalo, छुट्टी! Offline कर दिया।",
            "OK, आराम करो। Offline हो गए।",
        ],
        earnings: [
            "आज की कमाई ₹{amount} है। बहुत बढ़िया!",
            "Total balance ₹{amount} है। Bank भेज दूँ?",
        ],
        readJob: [
            "नया काम: {service}, {distance} दूर। ₹{price} मिलेंगे। लूँ?",
        ],
        error: [
            "सुनाई नहीं दिया उस्ताद। जोर से बोलो।",
            "समझ नहीं आया। फिर से बताओ।",
        ]
    }
};

interface VoiceAssistantProps {
    isVisible: boolean;
    onClose: () => void;
    onCommand: (command: string, service?: string) => void;
    mode?: 'customer' | 'worker';
}

export function KuliVoiceAssistant({ isVisible, onClose, onCommand, mode = 'customer' }: VoiceAssistantProps) {
    const [isListening, setIsListening] = useState(false);
    const [aiMessage, setAiMessage] = useState('');
    const [transcription, setTranscription] = useState('');

    // Animation values
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const orbRotation = useRef(new Animated.Value(0)).current;

    // Sound waves array
    const soundWaves = useRef(
        Array.from({ length: 30 }, () => new Animated.Value(0.3))
    ).current;

    useEffect(() => {
        if (isVisible) {
            // Entry animation
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }).start();

            // Greeting
            const responses = AI_RESPONSES[mode];
            const greeting = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
            setAiMessage(greeting);
            haptic('notification');

            // Continuous orb rotation
            Animated.loop(
                Animated.timing(orbRotation, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [isVisible]);

    useEffect(() => {
        if (isListening) {
            // ... existing animation code ...
            // Pulse animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            // Sound wave animation
            soundWaves.forEach((wave, index) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(wave, {
                            toValue: 0.3 + Math.random() * 0.7,
                            duration: 100 + index * 20,
                            useNativeDriver: true,
                        }),
                        Animated.timing(wave, {
                            toValue: 0.3,
                            duration: 100 + index * 20,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            });
        } else {
            pulseAnim.setValue(0);
            soundWaves.forEach(wave => wave.setValue(0.3));
        }
    }, [isListening]);

    const handleMicPress = () => {
        Vibration.vibrate(50);
        setIsListening(!isListening);

        if (!isListening) {
            setTranscription('');
            // Start listening simulation
            setTimeout(() => {
                // Simulate voice recognition based on mode
                let commands = [];
                if (mode === 'worker') {
                    commands = ['Online हो जाओ', 'कमाई दिखाओ', 'Job पढ़ो', 'Offline करो'];
                } else {
                    commands = ['plumber चाहिए', 'electrician book करो', 'AC repair'];
                }

                const randomCommand = commands[Math.floor(Math.random() * commands.length)];
                setTranscription(randomCommand);

                setTimeout(() => {
                    setIsListening(false);
                    processCommand(randomCommand);
                }, 1500);
            }, 2000);
        }
    };

    const processCommand = (command: string) => {
        haptic('success');
        const lowerCmd = command.toLowerCase();

        if (mode === 'customer') {
            // Customer Commands
            if (lowerCmd.includes('plumber') || lowerCmd.includes('नल')) {
                setAiMessage('अच्छा, Plumber ढूंढ रहा हूँ... मिल गया! Ramesh Ji available है, 4.9 rating। Book करूँ?');
                onCommand('search', 'plumber');
            } else if (lowerCmd.includes('electrician') || lowerCmd.includes('बिजली')) {
                setAiMessage('Electrician? Thik hai, Vijay nearby है। ₹200 per visit। Done करूँ?');
                onCommand('search', 'electrician');
            } else if (lowerCmd.includes('ac')) {
                setAiMessage('AC Repair? Cool! Sunil technician free hai, 30 min में aa sakta hai।');
                onCommand('search', 'ac');
            } else {
                setAiMessage(AI_RESPONSES.customer.error[0]);
            }
        } else {
            // Worker Commands
            if (lowerCmd.includes('online')) {
                setAiMessage(AI_RESPONSES.worker.online[0]);
                onCommand('online');
            } else if (lowerCmd.includes('offline')) {
                setAiMessage(AI_RESPONSES.worker.offline[0]);
                onCommand('offline');
            } else if (lowerCmd.includes('कमाई') || lowerCmd.includes('earnings')) {
                setAiMessage(AI_RESPONSES.worker.earnings[0].replace('{amount}', '1200'));
                onCommand('earnings');
            } else if (lowerCmd.includes('job') || lowerCmd.includes('काम')) {
                setAiMessage(AI_RESPONSES.worker.readJob[0].replace('{service}', 'Electrician').replace('{distance}', '2km').replace('{price}', '300'));
                onCommand('read_job');
            } else {
                setAiMessage(AI_RESPONSES.worker.error[0]);
            }
        }
    };

    const orbRotate = orbRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const pulseScale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
    });

    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 0.2],
    });

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ scale: scaleAnim }],
                }}
            >
                {/* Close button */}
                <TouchableOpacity
                    style={{ position: 'absolute', top: 60, right: 20 }}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={32} color="#fff" />
                </TouchableOpacity>

                {/* AI Name */}
                <Text
                    style={{
                        position: 'absolute',
                        top: 80,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        color: '#00D4FF',
                        fontSize: 24,
                        fontWeight: '900',
                        letterSpacing: 8,
                        textShadowColor: '#00D4FF',
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 20,
                    }}
                >
                    KULI AI
                </Text>

                {/* Main Orb */}
                <Animated.View
                    style={{
                        width: 200,
                        height: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: [{ rotate: orbRotate }],
                    }}
                >
                    {/* Outer rings */}
                    {[180, 160, 140].map((size, i) => (
                        <Animated.View
                            key={i}
                            style={{
                                position: 'absolute',
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                borderWidth: 1,
                                borderColor: `rgba(0, 212, 255, ${0.3 - i * 0.1})`,
                                borderStyle: i % 2 === 0 ? 'dashed' : 'solid',
                            }}
                        />
                    ))}

                    {/* Pulse ring when listening */}
                    {isListening && (
                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: 180,
                                height: 180,
                                borderRadius: 90,
                                backgroundColor: '#00D4FF',
                                opacity: pulseOpacity,
                                transform: [{ scale: pulseScale }],
                            }}
                        />
                    )}

                    {/* Core orb */}
                    <TouchableOpacity onPress={handleMicPress} activeOpacity={0.8}>
                        <LinearGradient
                            colors={isListening ? ['#00FF88', '#00D4FF'] : ['#00D4FF', '#0077FF']}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: isListening ? '#00FF88' : '#00D4FF',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 1,
                                shadowRadius: 40,
                            }}
                        >
                            <Ionicons
                                name={isListening ? "radio" : "mic"}
                                size={50}
                                color="#000"
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Sound wave visualization */}
                {isListening && (
                    <View
                        style={{
                            position: 'absolute',
                            bottom: height * 0.35,
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 60,
                        }}
                    >
                        {soundWaves.map((wave, i) => (
                            <Animated.View
                                key={i}
                                style={{
                                    width: 4,
                                    marginHorizontal: 2,
                                    borderRadius: 2,
                                    backgroundColor: '#00D4FF',
                                    transform: [{ scaleY: wave }],
                                    height: 40,
                                }}
                            />
                        ))}
                    </View>
                )}

                {/* Transcription */}
                {transcription && (
                    <View style={{ marginTop: 40 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center' }}>
                            You said:
                        </Text>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600', textAlign: 'center' }}>
                            "{transcription}"
                        </Text>
                    </View>
                )}

                {/* AI Message */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 100,
                        left: 30,
                        right: 30,
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderRadius: 20,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: 'rgba(0, 212, 255, 0.3)',
                    }}
                >
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 18,
                            textAlign: 'center',
                            lineHeight: 26,
                        }}
                    >
                        {aiMessage}
                    </Text>
                </View>

                {/* Hint */}
                <Text
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: 12,
                    }}
                >
                    {isListening ? 'बोलो...' : 'Tap to speak'}
                </Text>
            </Animated.View>
        </Modal>
    );
}
