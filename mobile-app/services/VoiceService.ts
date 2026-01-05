/**
 * KULABOUR - Enhanced Voice Service
 * Real voice recognition with Hindi support
 * Text-to-speech for notifications and guidance
 * Multi-language support (Hindi, English, Marathi, Tamil, Telugu)
 */

import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { SERVICE_CATEGORIES } from '../data/serviceCatalog';
import { logger } from './ProductionLogger';
import { videoHelpService } from './VideoHelpService';

// Types
export interface VoiceCommand {
    text: string;
    confidence: number;
    language: string;
    intent?: ParsedIntent;
}

export interface ParsedIntent {
    action: 'book' | 'cancel' | 'track' | 'call' | 'help' | 'search' | 'unknown';
    service?: string;
    serviceId?: string;
    quantity?: number;
    urgency?: 'now' | 'today' | 'tomorrow' | 'scheduled';
}

export type VoiceServiceStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
export type SupportedLanguage = 'hi-IN' | 'en-IN' | 'mr-IN' | 'ta-IN' | 'te-IN';

interface LanguageConfig {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    voicePitch: number;
    voiceRate: number;
}

const SUPPORTED_LANGUAGES: LanguageConfig[] = [
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी', voicePitch: 1.0, voiceRate: 0.9 },
    { code: 'en-IN', name: 'English', nativeName: 'English', voicePitch: 1.0, voiceRate: 1.0 },
    { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', voicePitch: 1.0, voiceRate: 0.9 },
    { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', voicePitch: 1.0, voiceRate: 0.85 },
    { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', voicePitch: 1.0, voiceRate: 0.85 },
];

// Service keywords for each supported language
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
    mason: {
        'hi-IN': ['मिस्त्री', 'राजमिस्त्री', 'चिनाई', 'ईंट'],
        'en-IN': ['mason', 'masonry', 'brick', 'construction'],
        'mr-IN': ['गवंडी', 'बांधकाम'],
        'ta-IN': ['கொத்தனார்', 'கட்டிடம்'],
        'te-IN': ['మేస్త్రీ', 'నిర్మాణం'],
    },
};

// Action keywords
const ACTION_KEYWORDS: Record<string, Record<SupportedLanguage, string[]>> = {
    book: {
        'hi-IN': ['बुक', 'चाहिए', 'भेजो', 'बुला', 'मंगाओ', 'लाओ'],
        'en-IN': ['book', 'need', 'want', 'send', 'call', 'get', 'hire'],
        'mr-IN': ['बुक', 'हवे', 'पाठवा', 'बोलवा'],
        'ta-IN': ['புக்', 'வேண்டும்', 'அனுப்பு'],
        'te-IN': ['బుక్', 'కావాలి', 'పంపించు'],
    },
    cancel: {
        'hi-IN': ['कैंसल', 'रद्द', 'बंद', 'मत'],
        'en-IN': ['cancel', 'stop', 'abort', 'end'],
        'mr-IN': ['रद्द', 'कॅन्सल'],
        'ta-IN': ['ரத்து', 'நிறுத்து'],
        'te-IN': ['రద్దు', 'ఆపు'],
    },
    track: {
        'hi-IN': ['ट्रैक', 'कहां', 'कितनी दूर', 'पता'],
        'en-IN': ['track', 'where', 'location', 'status', 'find'],
        'mr-IN': ['ट्रॅक', 'कुठे'],
        'ta-IN': ['எங்கே', 'நிலை'],
        'te-IN': ['ట్రాక్', 'ఎక్కడ'],
    },
    help: {
        'hi-IN': ['मदद', 'हेल्प', 'सहायता', 'क्या करूं'],
        'en-IN': ['help', 'assist', 'support', 'what'],
        'mr-IN': ['मदत', 'हेल्प'],
        'ta-IN': ['உதவி', 'ஹெல்ப்'],
        'te-IN': ['సహాయం', 'హెల్ప్'],
    },
};

// Pre-built voice responses
const VOICE_RESPONSES: Record<SupportedLanguage, Record<string, string | ((arg: string) => string)>> = {
    'hi-IN': {
        greeting: 'नमस्ते! मैं कुली हूं। आप किस सेवा की तलाश में हैं?',
        listening: 'मैं सुन रहा हूं...',
        processing: 'समझ रहा हूं...',
        serviceFound: (service: string) => `ठीक है, मैं ${service} खोज रहा हूं। कृपया प्रतीक्षा करें।`,
        serviceAdded: (service: string) => `${service} कार्ट में जोड़ दिया गया।`,
        noMatch: 'माफ़ कीजिए, मुझे समझ नहीं आया। कृपया दोबारा बोलें।',
        bookingConfirmed: 'आपकी बुकिंग हो गई है। कार्यकर्ता जल्द ही पहुंचेंगे।',
        workerArriving: (eta: string) => `कार्यकर्ता ${eta} में पहुंचेंगे।`,
        error: 'कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।',
        help: 'आप बोल सकते हैं: प्लंबर चाहिए, इलेक्ट्रीशियन भेजो, या AC रिपेयर करना है।',
    },
    'en-IN': {
        greeting: 'Hello! I am Kuli. What service are you looking for?',
        listening: 'Listening...',
        processing: 'Processing...',
        serviceFound: (service: string) => `Got it, I am searching for ${service}. Please wait.`,
        serviceAdded: (service: string) => `${service} added to cart.`,
        noMatch: 'Sorry, I did not understand. Please try again.',
        bookingConfirmed: 'Your booking is confirmed. The worker will arrive soon.',
        workerArriving: (eta: string) => `Worker will arrive in ${eta}.`,
        error: 'Something went wrong. Please try again.',
        help: 'You can say: I need a plumber, send an electrician, or repair my AC.',
    },
    'mr-IN': {
        greeting: 'नमस्कार! मी कुली आहे. तुम्हाला कोणती सेवा हवी आहे?',
        listening: 'मी ऐकत आहे...',
        processing: 'समजून घेत आहे...',
        serviceFound: (service: string) => `ठीक आहे, मी ${service} शोधत आहे.`,
        serviceAdded: (service: string) => `${service} कार्टमध्ये जोडले.`,
        noMatch: 'माफ करा, मला समजले नाही. कृपया पुन्हा सांगा.',
        bookingConfirmed: 'तुमची बुकिंग झाली आहे.',
        workerArriving: (eta: string) => `कामगार ${eta} मध्ये येतील.`,
        error: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
        help: 'तुम्ही म्हणू शकता: प्लंबर हवे, इलेक्ट्रिशियन पाठवा.',
    },
    'ta-IN': {
        greeting: 'வணக்கம்! நான் குலி. உங்களுக்கு என்ன சேவை தேவை?',
        listening: 'கேட்கிறேன்...',
        processing: 'செயலாக்குகிறேன்...',
        serviceFound: (service: string) => `சரி, ${service} தேடுகிறேன்.`,
        serviceAdded: (service: string) => `${service} கார்ட்டில் சேர்க்கப்பட்டது.`,
        noMatch: 'மன்னிக்கவும், புரியவில்லை. மீண்டும் சொல்லுங்கள்.',
        bookingConfirmed: 'உங்கள் புக்கிங் உறுதிசெய்யப்பட்டது.',
        workerArriving: (eta: string) => `தொழிலாளி ${eta} இல் வருவார்.`,
        error: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.',
        help: 'நீங்கள் சொல்லலாம்: பிளம்பர் வேண்டும்.',
    },
    'te-IN': {
        greeting: 'నమస్కారం! నేను కులి. మీకు ఏ సేవ కావాలి?',
        listening: 'వింటున్నాను...',
        processing: 'ప్రాసెస్ చేస్తున్నాను...',
        serviceFound: (service: string) => `సరే, ${service} వెతుకుతున్నాను.`,
        serviceAdded: (service: string) => `${service} కార్ట్‌లో జోడించబడింది.`,
        noMatch: 'క్షమించండి, అర్థం కాలేదు. మళ్ళీ చెప్పండి.',
        bookingConfirmed: 'మీ బుకింగ్ కన్ఫర్మ్ అయింది.',
        workerArriving: (eta: string) => `వర్కర్ ${eta}లో వస్తారు.`,
        error: 'ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.',
        help: 'మీరు చెప్పవచ్చు: ప్లంబర్ కావాలి.',
    },
};

class VoiceService {
    private status: VoiceServiceStatus = 'idle';
    private currentLanguage: SupportedLanguage = 'hi-IN';
    private listeners: Map<string, Set<(data: any) => void>> = new Map();
    private isRecognitionAvailable: boolean = false;

    constructor() {
        this.checkSpeechAvailability();
    }

    /**
     * Check if speech is available
     */
    private async checkSpeechAvailability() {
        try {
            const voices = await Speech.getAvailableVoicesAsync();
            this.isRecognitionAvailable = voices.length > 0;
            logger.info('Voice', `${voices.length} voices available`);
        } catch (error) {
            logger.error('Voice', 'Speech check failed', error);
        }
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages(): LanguageConfig[] {
        return SUPPORTED_LANGUAGES;
    }

    /**
     * Set current language
     */
    setLanguage(language: SupportedLanguage) {
        this.currentLanguage = language;
        logger.info('Voice', `Language set to: ${language}`);
    }

    /**
     * Get current language
     */
    getLanguage(): SupportedLanguage {
        return this.currentLanguage;
    }

    /**
     * Speak text in the current language
     */
    async speak(text: string, language?: SupportedLanguage): Promise<void> {
        const lang = language || this.currentLanguage;
        const config = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

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
                onError: (error: any) => {
                    logger.error('Voice', 'Speech error', error);
                    this.handleVoiceError(error);
                    this.status = 'error';
                    this.emit('statusChange', this.status);
                    resolve();
                },
            });
        });
    }

    /**
     * Handle voice errors with smart help
     */
    private async handleVoiceError(error: any) {
        // Find help video for voice issues
        const video = await videoHelpService.getRecommendation('voice_error');
        if (video) {
            this.emit('recommendation', video);
            logger.info('Voice', 'Emitted video recommendation on error');
        }
    }

    /**
     * Speak a predefined response
     */
    async speakResponse(key: string, arg?: string): Promise<void> {
        const responses = VOICE_RESPONSES[this.currentLanguage] || VOICE_RESPONSES['hi-IN'];
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
    stop(): void {
        Speech.stop();
        this.status = 'idle';
        this.emit('statusChange', this.status);
    }

    /**
     * Check if currently speaking
     */
    async isSpeaking(): Promise<boolean> {
        return await Speech.isSpeakingAsync();
    }

    /**
     * Get current status
     */
    getStatus(): VoiceServiceStatus {
        return this.status;
    }

    /**
     * Parse voice command to extract intent
     */
    parseCommand(text: string): ParsedIntent {
        const lowerText = text.toLowerCase();

        let intent: ParsedIntent = {
            action: 'unknown',
        };

        // Detect action
        for (const [action, keywords] of Object.entries(ACTION_KEYWORDS)) {
            const langKeywords = keywords[this.currentLanguage] || keywords['hi-IN'];
            if (langKeywords.some(kw => lowerText.includes(kw.toLowerCase()) || text.includes(kw))) {
                intent.action = action as ParsedIntent['action'];
                break;
            }
        }

        // Detect service
        for (const [serviceId, keywords] of Object.entries(SERVICE_KEYWORDS)) {
            const langKeywords = keywords[this.currentLanguage] || keywords['hi-IN'];
            if (langKeywords.some(kw => lowerText.includes(kw.toLowerCase()) || text.includes(kw))) {
                intent.serviceId = serviceId;
                intent.service = this.getServiceName(serviceId);
                break;
            }
        }

        // Detect urgency
        const urgencyKeywords = {
            now: ['अभी', 'तुरंत', 'फौरन', 'now', 'immediately', 'urgent'],
            today: ['आज', 'today'],
            tomorrow: ['कल', 'tomorrow'],
        };

        for (const [urgency, keywords] of Object.entries(urgencyKeywords)) {
            if (keywords.some(kw => lowerText.includes(kw.toLowerCase()) || text.includes(kw))) {
                intent.urgency = urgency as ParsedIntent['urgency'];
                break;
            }
        }

        // Default to 'book' if service is detected but no action
        if (intent.service && intent.action === 'unknown') {
            intent.action = 'book';
        }

        return intent;
    }

    /**
     * Get service name from ID
     */
    private getServiceName(serviceId: string): string {
        for (const category of Object.values(SERVICE_CATEGORIES)) {
            const service = category.services.find(s => s.id === serviceId);
            if (service) {
                return this.currentLanguage.startsWith('en') ? service.english : service.hindi;
            }
        }
        return serviceId;
    }

    /**
     * Simulate voice recognition (for demo)
     * In production, integrate @react-native-voice/voice
     */
    async simulateRecognition(durationMs: number = 3000): Promise<VoiceCommand> {
        this.status = 'listening';
        this.emit('statusChange', this.status);

        await new Promise(resolve => setTimeout(resolve, durationMs));

        this.status = 'processing';
        this.emit('statusChange', this.status);

        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulated results based on current language
        const demoCommands: Record<SupportedLanguage, string[]> = {
            'hi-IN': ['प्लंबर चाहिए', 'इलेक्ट्रीशियन बुक करो', 'सफाई वाला भेजो', 'AC रिपेयर करना है'],
            'en-IN': ['I need a plumber', 'Book an electrician', 'Send a cleaner', 'Repair my AC'],
            'mr-IN': ['प्लंबर हवे', 'इलेक्ट्रिशियन पाठवा', 'साफसफाई करायची आहे'],
            'ta-IN': ['பிளம்பர் வேண்டும்', 'எலக்ட்ரீஷியன் அனுப்புங்கள்'],
            'te-IN': ['ప్లంబర్ కావాలి', 'ఎలక్ట్రీషియన్ పంపించండి'],
        };

        const commands = demoCommands[this.currentLanguage];
        const text = commands[Math.floor(Math.random() * commands.length)];

        const result: VoiceCommand = {
            text,
            confidence: 0.85 + Math.random() * 0.15,
            language: this.currentLanguage,
            intent: this.parseCommand(text),
        };

        this.status = 'idle';
        this.emit('statusChange', this.status);
        this.emit('result', result);

        return result;
    }

    // Event emitter pattern
    private emit(event: string, data: any): void {
        this.listeners.get(event)?.forEach(cb => cb(data));
    }

    on(event: string, callback: (data: any) => void): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
        return () => this.listeners.get(event)?.delete(callback);
    }
}

export const voiceService = new VoiceService();
export default VoiceService;
