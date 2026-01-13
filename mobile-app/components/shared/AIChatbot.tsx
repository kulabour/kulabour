import { View, Text, ScrollView, TouchableOpacity, Animated, Modal } from 'react-native';
import { useState, useRef, useEffect, useMemo } from 'react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import VoiceRecorder from './VoiceRecorder';
import VoiceMessage from './VoiceMessage';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { SUPPORTED_LANGUAGES, FAQ_TRANSLATIONS, LanguageCode } from '../../utils/languages';
import { getAIResponse as getOpenAIResponse, isAIEnabled } from '../../services/ai/openai';

interface Message {
    id: number;
    message: string;
    isSent: boolean;
    timestamp: string;
    isAI?: boolean;
    type?: 'text' | 'audio';
    audioUri?: string;
    duration?: number;
}

interface AIChatbotProps {
    userType?: 'worker' | 'customer';
}

export default function AIChatbot({ userType = 'customer' }: AIChatbotProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            message: FAQ_TRANSLATIONS['en'].greeting,
            isSent: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAI: true,
            type: 'text',
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isRecordingMode, setIsRecordingMode] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Use useMemo for Animated.Value to avoid "ref access during render" lint error

    const typingAnimation = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        // Typing animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(typingAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(typingAnimation, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [typingAnimation]);

    const handleLanguageChange = (langCode: LanguageCode) => {
        setSelectedLanguage(langCode);
        setShowLanguageSelector(false);

        // Send greeting in new language
        const greetingMsg: Message = {
            id: messages.length + 1,
            message: FAQ_TRANSLATIONS[langCode].greeting,
            isSent: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAI: true,
            type: 'text',
        };
        setMessages((prev) => [...prev, greetingMsg]);
    };

    const getAIResponse = async (message: string): Promise<string> => {
        const lowerMessage = message.toLowerCase();
        const responses = FAQ_TRANSLATIONS[selectedLanguage];

        // Try OpenAI first
        if (isAIEnabled()) {
            try {
                // Build conversation history (last 5 messages)
                const conversationHistory = messages.slice(-5).map(msg => ({
                    role: msg.isAI ? ('assistant' as const) : ('user' as const),
                    content: msg.message,
                }));

                const aiResponse = await getOpenAIResponse(
                    message,
                    userType || 'customer',
                    selectedLanguage,
                    conversationHistory
                );

                return aiResponse;
            } catch (error) {
                console.log('[AI] Falling back to FAQ:', error);
            }
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('मदद') || lowerMessage.includes('உதவி')) {
            return responses.help;
        }
        if (lowerMessage.includes('payment') || lowerMessage.includes('भुगतान') || lowerMessage.includes('பணம்')) {
            return responses.payment;
        }
        if (lowerMessage.includes('withdraw') || lowerMessage.includes('निकाल')) {
            return responses.withdraw;
        }
        if (lowerMessage.includes('job') || lowerMessage.includes('नौकरी') || lowerMessage.includes('வேலை')) {
            return responses.job;
        }
        if (lowerMessage.includes('book') || lowerMessage.includes('बुक')) {
            return responses.book;
        }
        if (lowerMessage.includes('cancel') || lowerMessage.includes('रद्द')) {
            return responses.cancel;
        }
        if (lowerMessage.includes('track') || lowerMessage.includes('ट्रैक')) {
            return responses.track;
        }

        // Default response in selected language
        return responses.fallback;
    };

    const quickReplies = [
        '💰 Payment',
        '📅 Cancel',
        '📍 Track',
        '❓ Book',
        '👤 Help',
    ];

    const handleSend = (message: string) => {
        // Add user message
        const userMsg: Message = {
            id: messages.length + 1,
            message,
            isSent: true,
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
            type: 'text',
        };
        setMessages((prev) => [...prev, userMsg]);

        // Show typing indicator
        setIsTyping(true);

        // Simulate AI processing delay
        setTimeout(async () => {
            const aiResponse = await getAIResponse(message);
            const aiMsg: Message = {
                id: messages.length + 2,
                message: aiResponse,
                isSent: false,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                isAI: true,
                type: 'text',
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);

            // Scroll to bottom
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }, 1500);
    };

    const handleVoiceSend = (uri: string, duration: number) => {
        setIsRecordingMode(false);

        const voiceMsg: Message = {
            id: messages.length + 1,
            message: 'Voice Message',
            isSent: true,
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
            type: 'audio',
            audioUri: uri,
            duration: duration,
        };
        setMessages((prev) => [...prev, voiceMsg]);

        // Simulate AI listening and responding
        setIsTyping(true);
        setTimeout(async () => {
            const aiResponse = await getAIResponse("voice message"); // In real app, transcribe audio first
            const aiMsg: Message = {
                id: messages.length + 2,
                message: aiResponse, // Or "I heard your voice message..."
                isSent: false,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                isAI: true,
                type: 'text',
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 2000);
    };

    const handleQuickReply = (reply: string) => {
        const cleanReply = reply.replace(/[^\w\s]/gi, '').trim();
        handleSend(cleanReply);
    };

    const currentLanguage = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);

    return (
        <View className="flex-1 bg-dark-navy">
            {/* AI Header */}
            <View className="px-6 py-4 bg-gradient-to-r from-neon-blue/20 to-neon-teal/20 border-b border-neon-blue/30">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-neon-blue/30 rounded-full items-center justify-center mr-3 animate-glow-pulse">
                        <Text className="text-2xl">🤖</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg">AI Support Assistant</Text>
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 bg-success rounded-full mr-2 animate-glow-pulse" />
                            <Text className="text-success text-xs font-semibold">Online 24/7</Text>
                        </View>
                    </View>
                    {/* Language Selector Button */}
                    <TouchableOpacity
                        onPress={() => setShowLanguageSelector(true)}
                        className="bg-white/10 rounded-pill px-3 py-2 flex-row items-center"
                        activeOpacity={0.7}
                    >
                        <Text className="text-xl mr-2">{currentLanguage?.flag}</Text>
                        <Text className="text-white text-xs font-semibold">{currentLanguage?.nativeName}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Language Selector Modal */}
            <Modal
                visible={showLanguageSelector}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLanguageSelector(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setShowLanguageSelector(false)}
                    className="flex-1 bg-black/70 justify-center items-center px-6"
                >
                    <TouchableOpacity activeOpacity={1} className="w-full max-w-md">
                        <Card variant="glass" glassmorphism shadow="3d">
                            <Text className="text-white font-bold text-xl mb-4">Select Language</Text>
                            <Text className="text-white/50 text-sm mb-6">भाषा चुनें • மொழியைத் தேர்ந்தெடுக்கவும்</Text>

                            <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <TouchableOpacity
                                        key={lang.code}
                                        onPress={() => handleLanguageChange(lang.code)}
                                        className={`flex-row items-center p-4 rounded-xl mb-2 ${selectedLanguage === lang.code
                                            ? 'bg-neon-blue/30 border-2 border-neon-blue'
                                            : 'bg-white/5 border border-white/10'
                                            }`}
                                        activeOpacity={0.7}
                                    >
                                        <Text className="text-3xl mr-4">{lang.flag}</Text>
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-base">{lang.nativeName}</Text>
                                            <Text className="text-white/50 text-sm">{lang.name}</Text>
                                        </View>
                                        {selectedLanguage === lang.code && (
                                            <View className="w-6 h-6 bg-neon-blue rounded-full items-center justify-center">
                                                <Text className="text-white text-xs">✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View className="mt-4">
                                <Button
                                    variant="ghost"
                                    size="md"
                                    fullWidth
                                    onPress={() => setShowLanguageSelector(false)}
                                >
                                    Close
                                </Button>
                            </View>
                        </Card>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 px-6 py-4"
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }
            >
                {messages.map((msg) => (
                    <View key={msg.id} className={`mb-4 flex-row ${msg.isSent ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'audio' && msg.audioUri ? (
                            <VoiceMessage uri={msg.audioUri} duration={msg.duration || 0} />
                        ) : (
                            <ChatBubble
                                message={msg.message}
                                isSent={msg.isSent}
                                timestamp={msg.timestamp}
                            />
                        )}
                    </View>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <View className="mb-4 flex-row justify-start">
                        <View className="max-w-[75%]">
                            <View className="px-4 py-3 rounded-2xl bg-dark-charcoal border border-white/10 rounded-bl-sm">
                                <View className="flex-row gap-1">
                                    <Animated.View
                                        style={{
                                            opacity: typingAnimation,
                                            transform: [
                                                {
                                                    translateY: typingAnimation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -5],
                                                    }),
                                                },
                                            ],
                                        }}
                                        className="w-2 h-2 bg-neon-blue rounded-full"
                                    />
                                    <Animated.View
                                        style={{
                                            opacity: typingAnimation,
                                            transform: [
                                                {
                                                    translateY: typingAnimation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -5],
                                                    }),
                                                },
                                            ],
                                        }}
                                        className="w-2 h-2 bg-neon-blue rounded-full"
                                    />
                                    <Animated.View
                                        style={{
                                            opacity: typingAnimation,
                                            transform: [
                                                {
                                                    translateY: typingAnimation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, -5],
                                                    }),
                                                },
                                            ],
                                        }}
                                        className="w-2 h-2 bg-neon-blue rounded-full"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Quick Replies */}
            {messages.length <= 2 && !isRecordingMode && (
                <View className="px-6 pb-3">
                    <Text className="text-white/50 text-xs mb-2">Quick questions:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                            {quickReplies.map((reply, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleQuickReply(reply)}
                                    className="bg-dark-charcoal border border-neon-blue/30 rounded-pill px-4 py-2"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-neon-blue text-sm">{reply}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Input */}
            {isRecordingMode ? (
                <View className="px-4 py-3 bg-dark-charcoal border-t border-white/10 flex-row items-center">
                    <VoiceRecorder
                        onSend={handleVoiceSend}
                        onCancel={() => setIsRecordingMode(false)}
                    />
                </View>
            ) : (
                <ChatInput
                    onSend={handleSend}
                    onStartRecording={() => setIsRecordingMode(true)}
                    placeholder="Ask me anything..."
                />
            )}
        </View>
    );
}
