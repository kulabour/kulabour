/**
 * KULABOUR - Real Voice Recognition Service
 * Integrates @react-native-voice/voice for actual speech recognition
 * Falls back to simulated recognition when not available
 */

import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { SERVICE_CATEGORIES } from '../data/serviceCatalog';

// Types
export interface VoiceRecognitionResult {
    text: string;
    confidence: number;
    isFinal: boolean;
    language: string;
}

export interface ParsedIntent {
    action: 'book' | 'cancel' | 'track' | 'call' | 'help' | 'search' | 'unknown';
    service?: string;
    serviceId?: string;
    quantity?: number;
    urgency?: 'now' | 'today' | 'tomorrow' | 'scheduled';
}

export type VoiceStatus =
    | 'idle'
    | 'initializing'
    | 'listening'
    | 'processing'
    | 'speaking'
    | 'error'
    | 'unavailable';

export type SupportedLanguage = 'hi-IN' | 'en-IN' | 'mr-IN' | 'ta-IN' | 'te-IN';

interface LanguageConfig {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    voicePitch: number;
    voiceRate: number;
}

// Language configurations
const LANGUAGES: LanguageConfig[] = [
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', voicePitch: 1.0, voiceRate: 0.9 },
    { code: 'en-IN', name: 'English', nativeName: 'English', voicePitch: 1.0, voiceRate: 1.0 },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', voicePitch: 1.0, voiceRate: 0.9 },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', voicePitch: 1.0, voiceRate: 0.85 },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', voicePitch: 1.0, voiceRate: 0.85 },
];

// Service keywords per language
const SERVICE_KEYWORDS: Record<string, Record<SupportedLanguage, string[]>> = {
    plumber: {
        'hi-IN': ['प्लंबर', 'नलकार', 'पाइप', 'नल', 'पानी'],
        'en-IN': ['plumber', 'plumbing', 'pipe', 'water', 'tap'],
        'mr-IN': ['प्लंबर', 'नळ', 'पाणी'],
        'ta-IN': ['பிளம்பர்', 'குழாய்'],
        'te-IN': ['ప్లంబర్', 'పైపు'],
    },
    electrician: {
        'hi-IN': ['इलेक्ट्रीशियन', 'बिजली', 'बिजली वाला', 'लाइट', 'पंखा'],
        'en-IN': ['electrician', 'electric', 'electricity', 'wiring', 'fan', 'light'],
        'mr-IN': ['इलेक्ट्रिशियन', 'वीज', 'पंखा'],
        'ta-IN': ['எலக்ட்ரீஷியன்', 'மின்சாரம்'],
        'te-IN': ['ఎలక్ట్రీషియన్', 'విద్యుత్'],
    },
    carpenter: {
        'hi-IN': ['कारपेंटर', 'बढ़ई', 'लकड़ी', 'फर्नीचर', 'दरवाजा'],
        'en-IN': ['carpenter', 'furniture', 'wood', 'door', 'cabinet'],
        'mr-IN': ['सुतार', 'लाकूड', 'फर्निचर'],
        'ta-IN': ['தச்சு', 'மரம்'],
        'te-IN': ['వడ్రంగి', 'చెక్క'],
    },
    painter: {
        'hi-IN': ['पेंटर', 'रंग', 'पेंट', 'पुताई', 'रंगाई'],
        'en-IN': ['painter', 'paint', 'painting', 'whitewash', 'color'],
        'mr-IN': ['पेंटर', 'रंग'],
        'ta-IN': ['ஓவியர்', 'வண்ணம்'],
        'te-IN': ['పెయింటర్', 'రంగు'],
    },
    cleaner: {
        'hi-IN': ['सफाई', 'क्लीनर', 'झाड़ू', 'पोंछा', 'धोना'],
        'en-IN': ['cleaner', 'cleaning', 'clean', 'sweep', 'mop', 'wash'],
        'mr-IN': ['स्वच्छता', 'साफसफाई'],
        'ta-IN': ['சுத்தம்', 'துப்புரவு'],
        'te-IN': ['శుభ్రం', 'క్లీనర్'],
    },
    ac: {
        'hi-IN': ['एसी', 'AC', 'कूलर', 'एयर कंडीशनर'],
        'en-IN': ['ac', 'air conditioner', 'cooling', 'air conditioning'],
        'mr-IN': ['एसी', 'वातानुकूलन'],
        'ta-IN': ['ஏசி', 'குளிர்சாதனம்'],
        'te-IN': ['ఏసీ', 'ఎయిర్ కండీషనర్'],
    },
};

// Voice responses per language
const RESPONSES: Record<SupportedLanguage, Record<string, string | ((arg: string) => string)>> = {
    'hi-IN': {
        greeting: 'नमस्ते! मैं कुली हूं। आप किस सेवा की तलाश में हैं?',
        listening: 'मैं सुन रहा हूं...',
        processing: 'समझ रहा हूं...',
        serviceFound: (s: string) => `ठीक है, मैं ${s} खोज रहा हूं।`,
        serviceAdded: (s: string) => `${s} कार्ट में जोड़ दिया गया।`,
        noMatch: 'माफ़ कीजिए, मुझे समझ नहीं आया। कृपया दोबारा बोलें।',
        error: 'कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।',
        notAvailable: 'वॉइस फीचर इस डिवाइस पर उपलब्ध नहीं है।',
    },
    'en-IN': {
        greeting: 'Hello! I am Kuli. What service are you looking for?',
        listening: 'Listening...',
        processing: 'Processing...',
        serviceFound: (s: string) => `Got it, searching for ${s}.`,
        serviceAdded: (s: string) => `${s} added to cart.`,
        noMatch: 'Sorry, I did not understand. Please try again.',
        error: 'Something went wrong. Please try again.',
        notAvailable: 'Voice feature is not available on this device.',
    },
    'mr-IN': {
        greeting: 'नमस्कार! मी कुली आहे. तुम्हाला कोणती सेवा हवी आहे?',
        listening: 'मी ऐकत आहे...',
        processing: 'समजून घेत आहे...',
        serviceFound: (s: string) => `ठीक आहे, मी ${s} शोधत आहे.`,
        serviceAdded: (s: string) => `${s} कार्टमध्ये जोडले.`,
        noMatch: 'माफ करा, मला समजले नाही.',
        error: 'काहीतरी चूक झाली.',
        notAvailable: 'व्हॉइस फीचर उपलब्ध नाही.',
    },
    'ta-IN': {
        greeting: 'வணக்கம்! நான் குலி. உங்களுக்கு என்ன சேவை தேவை?',
        listening: 'கேட்கிறேன்...',
        processing: 'செயலாக்குகிறேன்...',
        serviceFound: (s: string) => `சரி, ${s} தேடுகிறேன்.`,
        serviceAdded: (s: string) => `${s} கார்ட்டில் சேர்க்கப்பட்டது.`,
        noMatch: 'மன்னிக்கவும், புரியவில்லை.',
        error: 'ஏதோ தவறு நடந்தது.',
        notAvailable: 'வாய்ஸ் வசதி கிடைக்கவில்லை.',
    },
    'te-IN': {
        greeting: 'నమస్కారం! నేను కులి. మీకు ఏ సేవ కావాలి?',
        listening: 'వింటున్నాను...',
        processing: 'ప్రాసెస్ చేస్తున్నాను...',
        serviceFound: (s: string) => `సరే, ${s} వెతుకుతున్నాను.`,
        serviceAdded: (s: string) => `${s} కార్ట్‌లో జోడించబడింది.`,
        noMatch: 'క్షమించండి, అర్థం కాలేదు.',
        error: 'ఏదో తప్పు జరిగింది.',
        notAvailable: 'వాయిస్ ఫీచర్ అందుబాటులో లేదు.',
    },
};

// Event types
type VoiceEventCallback = (data: any) => void;

class RealVoiceService {
    private Voice: any = null;
    private status: VoiceStatus = 'idle';
    private currentLanguage: SupportedLanguage = 'hi-IN';
    private isInitialized: boolean = false;
    private isAvailable: boolean = false;
    private listeners: Map<string, Set<VoiceEventCallback>> = new Map();
    private partialResults: string[] = [];

    constructor() {
        this.initializeVoice();
    }

    /**
     * Initialize voice recognition
     */
    private async initializeVoice() {
        this.status = 'initializing';
        this.emit('statusChange', this.status);

        try {
            // Dynamic import for @react-native-voice/voice
            const VoiceModule = await import('@react-native-voice/voice').catch(() => null);

            if (VoiceModule && VoiceModule.default) {
                this.Voice = VoiceModule.default;

                // Check availability
                this.isAvailable = await this.Voice.isAvailable();

                if (this.isAvailable) {
                    // Set up event handlers
                    this.Voice.onSpeechStart = this.onSpeechStart.bind(this);
                    this.Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
                    this.Voice.onSpeechResults = this.onSpeechResults.bind(this);
                    this.Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
                    this.Voice.onSpeechError = this.onSpeechError.bind(this);
                    this.Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);

                    this.isInitialized = true;
                    console.log('[Voice] Real voice recognition initialized');
                }
            }
        } catch (error) {
            console.log('[Voice] Voice recognition not available, using simulation');
            this.isAvailable = false;
        }

        this.status = this.isAvailable ? 'idle' : 'unavailable';
        this.emit('statusChange', this.status);
    }

    // Voice event handlers
    private onSpeechStart() {
        this.status = 'listening';
        this.partialResults = [];
        this.emit('statusChange', this.status);
        this.emit('speechStart', {});
    }

    private onSpeechEnd() {
        this.status = 'processing';
        this.emit('statusChange', this.status);
        this.emit('speechEnd', {});
    }

    private onSpeechResults(event: any) {
        const results = event.value || [];
        const text = results[0] || '';

        const result: VoiceRecognitionResult = {
            text,
            confidence: 0.9,
            isFinal: true,
            language: this.currentLanguage,
        };

        this.emit('result', result);
        this.status = 'idle';
        this.emit('statusChange', this.status);
    }

    private onSpeechPartialResults(event: any) {
        const results = event.value || [];
        const text = results[0] || '';

        this.partialResults.push(text);
        this.emit('partialResult', { text, results: this.partialResults });
    }

    private onSpeechError(event: any) {
        console.error('[Voice] Speech error:', event.error);
        this.status = 'error';
        this.emit('statusChange', this.status);
        this.emit('error', { code: event.error?.code, message: event.error?.message });
    }

    private onSpeechVolumeChanged(event: any) {
        this.emit('volumeChange', { volume: event.value });
    }

    // Public methods

    /**
     * Get supported languages
     */
    getSupportedLanguages(): LanguageConfig[] {
        return LANGUAGES;
    }

    /**
     * Set current language
     */
    setLanguage(language: SupportedLanguage) {
        this.currentLanguage = language;
        console.log('[Voice] Language set:', language);
    }

    /**
     * Get current language
     */
    getLanguage(): SupportedLanguage {
        return this.currentLanguage;
    }

    /**
     * Get current status
     */
    getStatus(): VoiceStatus {
        return this.status;
    }

    /**
     * Check if voice is available
     */
    checkAvailability(): boolean {
        return this.isAvailable;
    }

    /**
     * Start listening
     */
    async startListening(): Promise<boolean> {
        if (!this.isAvailable) {
            console.log('[Voice] Using simulation mode');
            return this.startSimulatedListening();
        }

        try {
            await this.Voice.start(this.currentLanguage);
            return true;
        } catch (error) {
            console.error('[Voice] Failed to start listening:', error);
            this.status = 'error';
            this.emit('statusChange', this.status);
            return false;
        }
    }

    /**
     * Stop listening
     */
    async stopListening(): Promise<void> {
        if (!this.isAvailable) {
            return;
        }

        try {
            await this.Voice.stop();
        } catch (error) {
            console.error('[Voice] Failed to stop listening:', error);
        }
    }

    /**
     * Cancel listening
     */
    async cancelListening(): Promise<void> {
        if (!this.isAvailable) {
            return;
        }

        try {
            await this.Voice.cancel();
            this.status = 'idle';
            this.emit('statusChange', this.status);
        } catch (error) {
            console.error('[Voice] Failed to cancel:', error);
        }
    }

    /**
     * Simulated listening for when real voice isn't available
     */
    private async startSimulatedListening(): Promise<boolean> {
        this.status = 'listening';
        this.emit('statusChange', this.status);
        this.emit('speechStart', {});

        // Simulate listening for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        this.status = 'processing';
        this.emit('statusChange', this.status);
        this.emit('speechEnd', {});

        // Simulate result with random demo command
        const demoCommands: Record<SupportedLanguage, string[]> = {
            'hi-IN': ['प्लंबर चाहिए', 'इलेक्ट्रीशियन भेजो', 'सफाई करनी है'],
            'en-IN': ['I need a plumber', 'Send an electrician', 'Book a cleaner'],
            'mr-IN': ['प्लंबर हवे', 'इलेक्ट्रिशियन पाठवा'],
            'ta-IN': ['பிளம்பர் வேண்டும்', 'எலக்ட்ரீஷியன்'],
            'te-IN': ['ప్లంబర్ కావాలి', 'ఎలక్ట్రీషియన్'],
        };

        const commands = demoCommands[this.currentLanguage] || demoCommands['hi-IN'];
        const text = commands[Math.floor(Math.random() * commands.length)];

        const result: VoiceRecognitionResult = {
            text,
            confidence: 0.85,
            isFinal: true,
            language: this.currentLanguage,
        };

        await new Promise(resolve => setTimeout(resolve, 500));

        this.emit('result', result);
        this.status = 'idle';
        this.emit('statusChange', this.status);

        return true;
    }

    /**
     * Speak text
     */
    async speak(text: string, language?: SupportedLanguage): Promise<void> {
        const lang = language || this.currentLanguage;
        const config = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

        this.status = 'speaking';
        this.emit('statusChange', this.status);

        return new Promise((resolve) => {
            Speech.speak(text, {
                language: lang,
                pitch: config.voicePitch,
                rate: config.voiceRate,
                onDone: () => {
                    this.status = 'idle';
                    this.emit('statusChange', this.status);
                    resolve();
                },
                onError: () => {
                    this.status = 'error';
                    this.emit('statusChange', this.status);
                    resolve();
                },
            });
        });
    }

    /**
     * Speak a predefined response
     */
    async speakResponse(key: string, arg?: string): Promise<void> {
        const responses = RESPONSES[this.currentLanguage] || RESPONSES['hi-IN'];
        let text = responses[key];

        if (typeof text === 'function' && arg) {
            text = text(arg);
        }

        if (text && typeof text === 'string') {
            await this.speak(text);
        }
    }

    /**
     * Stop speaking
     */
    stopSpeaking(): void {
        Speech.stop();
        this.status = 'idle';
        this.emit('statusChange', this.status);
    }

    /**
     * Parse text to extract intent
     */
    parseIntent(text: string): ParsedIntent {
        const lowerText = text.toLowerCase();
        const intent: ParsedIntent = { action: 'unknown' };

        // Detect service
        for (const [serviceId, keywords] of Object.entries(SERVICE_KEYWORDS)) {
            const langKeywords = keywords[this.currentLanguage] || keywords['hi-IN'];
            if (langKeywords.some(kw => lowerText.includes(kw.toLowerCase()) || text.includes(kw))) {
                intent.serviceId = serviceId;
                intent.service = this.getServiceName(serviceId);
                intent.action = 'book';
                break;
            }
        }

        return intent;
    }

    private getServiceName(serviceId: string): string {
        for (const category of Object.values(SERVICE_CATEGORIES)) {
            const service = category.services.find((s: any) => s.id === serviceId);
            if (service) {
                return this.currentLanguage.startsWith('en') ? service.english : service.hindi;
            }
        }
        return serviceId;
    }

    // Event emitter
    private emit(event: string, data: any): void {
        this.listeners.get(event)?.forEach(cb => cb(data));
    }

    on(event: string, callback: VoiceEventCallback): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
        return () => this.listeners.get(event)?.delete(callback);
    }

    /**
     * Cleanup
     */
    async destroy(): Promise<void> {
        if (this.Voice) {
            this.Voice.destroy();
        }
        this.listeners.clear();
    }
}

export const realVoiceService = new RealVoiceService();
export default RealVoiceService;
