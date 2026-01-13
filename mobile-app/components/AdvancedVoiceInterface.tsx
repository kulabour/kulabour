import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, TextInput, Platform, Linking } from 'react-native';
import * as Speech from 'expo-speech';
import { speechRecognitionService } from '../services/SpeechRecognitionService';
import { offlineQueue, QueueStatus } from '../services/OfflineQueueService';
import { voiceAnalytics } from '../services/VoiceAnalyticsService';

interface VoiceMessage {
    id: string;
    type: 'user' | 'assistant';
    text: string;
    timestamp: Date;
    emotion?: 'happy' | 'frustrated' | 'neutral';
}

interface AdvancedVoiceInterfaceProps {
    agent?: any; // Replace 'any' with WorkerVoiceAgent type if importable, or just any for now
    welcomeMessage?: string;
    quickActions?: string[];
    placeholder?: string;
    handsFree?: boolean;
}

export function AdvancedVoiceInterface({
    agent,
    welcomeMessage,
    quickActions,
    placeholder,
    handsFree
}: AdvancedVoiceInterfaceProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<VoiceMessage[]>([]);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [textInput, setTextInput] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);
    const [hindiTTSAvailable, setHindiTTSAvailable] = useState(true);
    const [queueStatus, setQueueStatus] = useState<QueueStatus>({ isOnline: true, pendingCount: 0, isSyncing: false, lastSyncAt: null, failedCount: 0 });
    const [isProcessing, setIsProcessing] = useState(false);

    // Hindi quick actions for construction workers
    const hindiQuickActions = [
        { label: '🛠️ Plumber', hindi: 'प्लम्बर', query: 'mujhe plumber chahiye' },
        { label: '⚡ Electrician', hindi: 'बिजली', query: 'bijli wala chahiye' },
        { label: '🪚 Carpenter', hindi: 'कारपेंटर', query: 'carpenter chahiye' },
        { label: '🎨 Painter', hindi: 'पेंटर', query: 'paint karna hai' },
    ];

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        connectVoiceAgent();
        checkHindiTTSAvailability();
        voiceAnalytics.startSession();

        // Subscribe to offline queue status
        const unsubscribe = offlineQueue.onStatusChange(setQueueStatus);

        return () => {
            ws.current?.close();
            unsubscribe();
            voiceAnalytics.endSession();
        };
    }, []);

    useEffect(() => {
        if (isListening || isSpeaking) {
            startPulseAnimation();
        }
    }, [isListening, isSpeaking]);

    const connectVoiceAgent = () => {
        const wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3001';
        ws.current = new WebSocket(`${wsUrl}/voice-agent`);

        ws.current.onopen = () => {
            console.log('🎙️ Voice agent connected');
        };

        ws.current.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'response') {
                // Add assistant message
                const message: VoiceMessage = {
                    id: Date.now().toString(),
                    type: 'assistant',
                    text: data.response,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, message]);

                // Speak response with natural voice
                await speakResponse(data.response, data.emotion);

                // Show suggestions if available
                if (data.suggestions?.length > 0) {
                    console.log('Suggestions:', data.suggestions);
                }
            }

            if (data.type === 'action') {
                handleAction(data.action);
            }
        };

        ws.current.onerror = (error) => {
            console.error('Voice agent error:', error);
        };
    };

    const startListening = async () => {
        try {
            setIsListening(true);
            setCurrentTranscript('');

            // Check if STT is available
            const available = await speechRecognitionService.isAvailable();
            if (!available) {
                alert('Speech recognition not available. Please type your message instead.');
                setIsListening(false);
                return;
            }

            // Start listening with partial results
            const result = await speechRecognitionService.startListening(
                { language: 'hi-IN' },
                (partialResults) => {
                    if (partialResults.length > 0) {
                        setCurrentTranscript(partialResults[0]);
                    }
                }
            );

            // Process final transcript
            if (result.transcript) {
                handleUserSpeech(result.transcript);
            }
            setIsListening(false);
        } catch (error) {
            console.error('Speech recognition failed:', error);
            alert('Could not understand. Please try again or type your message.');
            setIsListening(false);
        }
    };

    const handleUserSpeech = (transcript: string) => {
        // Add user message
        const message: VoiceMessage = {
            id: Date.now().toString(),
            type: 'user',
            text: transcript,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, message]);

        // Send to voice agent
        ws.current?.send(JSON.stringify({
            type: 'voice_input',
            transcript,
            metadata: {
                language: 'hi',
                // Can add emotion from tone analysis
            },
        }));
    };

    const checkHindiTTSAvailability = async () => {
        try {
            // On Android, check if Hindi voices are available
            if (Platform.OS === 'android') {
                const voices = await Speech.getAvailableVoicesAsync();
                const hindiVoice = voices.find(v => v.language.startsWith('hi'));
                setHindiTTSAvailable(!!hindiVoice);

                if (!hindiVoice) {
                    console.warn('📢 No Hindi TTS voice available on this device');
                }
            }
        } catch (error) {
            console.error('Failed to check TTS availability:', error);
            setHindiTTSAvailable(false);
        }
    };

    const speakResponse = async (text: string, emotion?: string) => {
        // If Hindi TTS not available, show text-only (don't play broken English voice)
        if (!hindiTTSAvailable) {
            console.log('📢 Hindi TTS unavailable - showing text only');
            return; // Text already shown in message bubble
        }

        setIsSpeaking(true);

        // Use natural-sounding voice
        const voice = emotion === 'happy'
            ? 'com.apple.voice.enhanced.hi-IN.Lekha' // iOS Hindi voice
            : 'com.apple.voice.compact.hi-IN.Lekha';

        try {
            await Speech.speak(text, {
                language: 'hi-IN',
                pitch: emotion === 'happy' ? 1.1 : 1.0,
                rate: 0.9,
                // @ts-ignore - voice property is valid on iOS but missing in some type definitions
                voice,
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
            });
        } catch (error) {
            console.error('TTS failed:', error);
            setIsSpeaking(false);
        }
    };

    const handleAction = (action: any) => {
        switch (action.type) {
            case 'create_booking':
                console.log('Creating booking:', action.data);
                // Navigate to booking confirmation
                break;
            case 'search_workers':
                console.log('Searching workers:', action.data);
                // Show worker list
                break;
        }
    };

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopListening = () => {
        setIsListening(false);
        Speech.stop();
    };

    return (
        <View style={styles.container}>
            {/* Hindi TTS unavailable warning */}
            {!hindiTTSAvailable && (
                <View style={styles.warningBanner}>
                    <Text style={styles.warningText}>
                        📢 Hindi voice not installed on your device.
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (Platform.OS === 'android') {
                                Linking.openSettings();
                            }
                        }}
                        style={styles.warningButton}
                    >
                        <Text style={styles.warningButtonText}>Download Hindi Voice</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Offline Status Indicator */}
            {(!queueStatus.isOnline || queueStatus.pendingCount > 0) && (
                <View style={[styles.offlineBar, !queueStatus.isOnline && styles.offlineBarRed]}>
                    <Text style={styles.offlineText}>
                        {!queueStatus.isOnline
                            ? '📵 Offline - Bookings will sync when online'
                            : queueStatus.isSyncing
                                ? `⏳ Syncing ${queueStatus.pendingCount} bookings...`
                                : `📦 ${queueStatus.pendingCount} bookings queued`
                        }
                    </Text>
                    {queueStatus.failedCount > 0 && (
                        <Text style={styles.failedText}>
                            ⚠️ {queueStatus.failedCount} failed
                        </Text>
                    )}
                </View>
            )}

            {/* Conversation History */}
            <View style={styles.messages}>
                {messages.map(msg => (
                    <View
                        key={msg.id}
                        style={[
                            styles.message,
                            msg.type === 'user' ? styles.userMessage : styles.assistantMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}
            </View>

            {/* Current Transcript */}
            {currentTranscript && (
                <View style={styles.transcript}>
                    <Text style={styles.transcriptText}>{currentTranscript}</Text>
                </View>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
                <View style={styles.processingBar}>
                    <Text style={styles.processingText}>⏳ Finding workers near you...</Text>
                </View>
            )}

            {/* Hindi Quick Actions */}
            <View style={styles.quickActions}>
                {hindiQuickActions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.quickActionButton}
                        onPress={() => handleUserSpeech(action.query)}
                    >
                        <Text style={styles.quickActionLabel}>{action.label}</Text>
                        <Text style={styles.quickActionHindi}>{action.hindi}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    onPress={isListening ? stopListening : startListening}
                    activeOpacity={0.8}
                >
                    <Animated.View
                        style={[
                            styles.voiceButton,
                            {
                                transform: [{ scale: pulseAnim }],
                                backgroundColor: isListening ? '#EF4444' : '#0078D4',
                            },
                        ]}
                    >
                        <Text style={styles.voiceButtonText}>
                            {isListening ? '🎤️ Listening...' : isSpeaking ? '🔊 Speaking...' : '🎤 Tap to speak'}
                        </Text>
                    </Animated.View>
                </TouchableOpacity>

                <Text style={styles.hint}>
                    {isListening
                        ? 'Speak naturally in Hindi or English'
                        : 'Tap and ask anything about services'}
                </Text>

                {/* Text input fallback */}
                {!showTextInput ? (
                    <TouchableOpacity
                        style={styles.textFallbackButton}
                        onPress={() => setShowTextInput(true)}
                    >
                        <Text style={styles.textFallbackText}>⌨️ Type instead</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            value={textInput}
                            onChangeText={setTextInput}
                            placeholder="Type your message in Hindi or English..."
                            placeholderTextColor="#64748B"
                            onSubmitEditing={() => {
                                if (textInput.trim()) {
                                    handleUserSpeech(textInput);
                                    setTextInput('');
                                    setShowTextInput(false);
                                }
                            }}
                        />
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={() => {
                                if (textInput.trim()) {
                                    handleUserSpeech(textInput);
                                    setTextInput('');
                                    setShowTextInput(false);
                                }
                            }}
                        >
                            <Text style={styles.sendButtonText}>➤</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    warningBanner: {
        backgroundColor: '#F59E0B',
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    warningText: {
        color: '#000',
        fontSize: 13,
        flex: 1,
        marginRight: 8,
    },
    warningButton: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    warningButtonText: {
        color: '#F59E0B',
        fontSize: 12,
        fontWeight: '600',
    },
    offlineBar: {
        backgroundColor: '#3B82F6',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    offlineBarRed: {
        backgroundColor: '#EF4444',
    },
    offlineText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '500',
    },
    failedText: {
        color: '#FEE2E2',
        fontSize: 12,
        marginLeft: 8,
    },
    processingBar: {
        backgroundColor: '#10B981',
        padding: 10,
        alignItems: 'center',
    },
    processingText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 12,
        gap: 8,
    },
    quickActionButton: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 80,
    },
    quickActionLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    quickActionHindi: {
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 2,
    },
    messages: {
        flex: 1,
        padding: 16,
    },
    message: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0078D4',
    },
    assistantMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#1E293B',
    },
    messageText: {
        color: 'white',
        fontSize: 16,
        lineHeight: 22,
    },
    transcript: {
        padding: 16,
        backgroundColor: '#1E293B',
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    transcriptText: {
        color: '#94A3B8',
        fontSize: 14,
        fontStyle: 'italic',
    },
    controls: {
        padding: 24,
        alignItems: 'center',
    },
    voiceButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#0078D4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    voiceButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    hint: {
        marginTop: 16,
        color: '#64748B',
        fontSize: 14,
        textAlign: 'center',
    },
    textFallbackButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#1E293B',
        borderRadius: 8,
    },
    textFallbackText: {
        color: '#94A3B8',
        fontSize: 14,
        textAlign: 'center',
    },
    textInputContainer: {
        flexDirection: 'row',
        marginTop: 16,
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#1E293B',
        borderRadius: 8,
        padding: 12,
        color: 'white',
        fontSize: 16,
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: '#0078D4',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 24,
    },
});
