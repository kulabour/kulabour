/**
 * Multi-Language Support for KULABOUR Voice Agent
 * Supports all major Indian languages
 */

export const SUPPORTED_LANGUAGES = {
    // Major Indian Languages (22 scheduled languages)
    hi: { name: 'Hindi', native: 'हिन्दी', code: 'hi-IN' },
    en: { name: 'English', native: 'English', code: 'en-IN' },
    ta: { name: 'Tamil', native: 'தமிழ்', code: 'ta-IN' },
    te: { name: 'Telugu', native: 'తెలుగు', code: 'te-IN' },
    kn: { name: 'Kannada', native: 'ಕನ್ನಡ', code: 'kn-IN' },
    ml: { name: 'Malayalam', native: 'മലയാളം', code: 'ml-IN' },
    bn: { name: 'Bengali', native: 'বাংলা', code: 'bn-IN' },
    mr: { name: 'Marathi', native: 'मराठी', code: 'mr-IN' },
    gu: { name: 'Gujarati', native: 'ગુજરાતી', code: 'gu-IN' },
    pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', code: 'pa-IN' },
    or: { name: 'Odia', native: 'ଓଡ଼ିଆ', code: 'or-IN' },
    as: { name: 'Assamese', native: 'অসমীয়া', code: 'as-IN' },
    ur: { name: 'Urdu', native: 'اردو', code: 'ur-IN' },
    sa: { name: 'Sanskrit', native: 'संस्कृत', code: 'sa-IN' },
    ks: { name: 'Kashmiri', native: 'कश्मीरी', code: 'ks-IN' },
    ne: { name: 'Nepali', native: 'नेपाली', code: 'ne-IN' },
    sd: { name: 'Sindhi', native: 'سنڌي', code: 'sd-IN' },
    kok: { name: 'Konkani', native: 'कोंकणी', code: 'kok-IN' },
    mai: { name: 'Maithili', native: 'मैथिली', code: 'mai-IN' },
    mni: { name: 'Manipuri', native: 'মৈতৈলোন্', code: 'mni-IN' },
    sat: { name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', code: 'sat-IN' },
    doi: { name: 'Dogri', native: 'डोगरी', code: 'doi-IN' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Common phrases in all Indian languages
 */
export const MULTILINGUAL_PHRASES = {
    // Greetings
    welcome: {
        hi: 'नमस्ते! मैं KULABOUR वॉइस असिस्टेंट हूं',
        en: 'Hello! I am KULABOUR voice assistant',
        ta: 'வணக்கம்! நான் KULABOUR குரல் உதவியாளர்',
        te: 'నమస్కారం! నేను KULABOUR వాయిస్ అసిస్టెంట్',
        kn: 'ನಮಸ್ಕಾರ! ನಾನು KULABOUR ಧ್ವನಿ ಸಹಾಯಕ',
        ml: 'നമസ്കാരം! ഞാൻ KULABOUR വോയ്സ് അസിസ്റ്റന്റ്',
        bn: 'নমস্কার! আমি KULABOUR ভয়েস সহায়ক',
        mr: 'नमस्कार! मी KULABOUR व्हॉइस असिस्टंट',
        gu: 'નમસ્તે! હું KULABOUR વૉઇસ આસિસ્ટન્ટ છું',
        pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ KULABOUR ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਹਾਂ',
    },

    // Service booking
    needService: {
        hi: 'कौनसी सेवा चाहिए?',
        en: 'Which service do you need?',
        ta: 'உங்களுக்கு என்ன சேவை வேண்டும்?',
        te: 'మీకు ఏ సేవ కావాలి?',
        kn: 'ನಿಮಗೆ ಯಾವ ಸೇವೆ ಬೇಕು?',
        ml: 'നിങ്ങൾക്ക് ഏത് സേവനം വേണം?',
        bn: 'আপনার কোন সেবা প্রয়োজন?',
        mr: 'तुम्हाला कोणती सेवा हवी आहे?',
        gu: 'તમને કઈ સેવા જોઈએ છે?',
        pa: 'ਤੁਹਾਨੂੰ ਕਿਹੜੀ ਸੇਵਾ ਚਾਹੀਦੀ ਹੈ?',
    },

    // Worker found
    workerFound: {
        hi: 'मैंने {{count}} कारीगर ढूंढे',
        en: 'I found {{count}} workers',
        ta: 'நான் {{count}} தொழிலாளர்களைக் கண்டேன்',
        te: 'నేను {{count}} కార్మికులను కనుగొన్నాను',
        kn: 'ನಾನು {{count}} ಕಾರ್ಮಿಕರನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೇನೆ',
        ml: 'ഞാൻ {{count}} തൊഴിലാളികളെ കണ്ടെത്തി',
        bn: 'আমি {{count}} কর্মী খুঁজে পেয়েছি',
        mr: 'मला {{count}} कामगार सापडले',
        gu: 'મને {{count}} કામદારો મળ્યા',
        pa: 'ਮੈਨੂੰ {{count}} ਕਾਮੇ ਮਿਲੇ',
    },

    // Price
    price: {
        hi: 'कीमत: ₹{{amount}}',
        en: 'Price: ₹{{amount}}',
        ta: 'விலை: ₹{{amount}}',
        te: 'ధర: ₹{{amount}}',
        kn: 'ಬೆಲೆ: ₹{{amount}}',
        ml: 'വില: ₹{{amount}}',
        bn: 'মূল্য: ₹{{amount}}',
        mr: 'किंमत: ₹{{amount}}',
        gu: 'કિંમત: ₹{{amount}}',
        pa: 'ਕੀਮਤ: ₹{{amount}}',
    },

    // Confirmation
    confirm: {
        hi: 'बुकिंग कन्फर्म करूं?',
        en: 'Should I confirm the booking?',
        ta: 'முன்பதிவை உறுதிப்படுத்தவா?',
        te: 'బుకింగ్‌ను నిర్ధారించాలా?',
        kn: 'ಬುಕಿಂಗ್ ಅನ್ನು ದೃಢೀಕರಿಸಬೇಕೇ?',
        ml: 'ബുക്കിംഗ് സ്ഥിരീകരിക്കണോ?',
        bn: 'বুকিং নিশ্চিত করব?',
        mr: 'बुकिंग निश्चित करू?',
        gu: 'બુકિંગની પુષ્ટિ કરું?',
        pa: 'ਬੁਕਿੰਗ ਦੀ ਪੁਸ਼ਟੀ ਕਰਾਂ?',
    },

    // Thank you
    thankYou: {
        hi: 'धन्यवाद! आपकी बुकिंग कन्फर्म हो गई',
        en: 'Thank you! Your booking is confirmed',
        ta: 'நன்றி! உங்கள் முன்பதிவு உறுதிப்படுத்தப்பட்டது',
        te: 'ధన్యవాదాలు! మీ బుకింగ్ నిర్ధారించబడింది',
        kn: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
        ml: 'നന്ദി! നിങ്ങളുടെ ബുക്കിംഗ് സ്ഥിരീകരിച്ചു',
        bn: 'ধন্যবাদ! আপনার বুকিং নিশ্চিত করা হয়েছে',
        mr: 'धन्यवाद! तुमची बुकिंग निश्चित झाली',
        gu: 'આભાર! તમારી બુકિંગની પુષ્ટિ થઈ',
        pa: 'ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਬੁਕਿੰਗ ਦੀ ਪੁਸ਼ਟੀ ਹੋ ਗਈ',
    },
};

/**
 * Auto-detect user's language from speech
 */
export function detectLanguage(text: string): LanguageCode {
    // Check for language-specific scripts
    const scripts = {
        hi: /[\u0900-\u097F]/, // Devanagari (Hindi, Marathi, Sanskrit)
        ta: /[\u0B80-\u0BFF]/, // Tamil
        te: /[\u0C00-\u0C7F]/, // Telugu
        kn: /[\u0C80-\u0CFF]/, // Kannada
        ml: /[\u0D00-\u0D7F]/, // Malayalam
        bn: /[\u0980-\u09FF]/, // Bengali
        gu: /[\u0A80-\u0AFF]/, // Gujarati
        pa: /[\u0A00-\u0A7F]/, // Punjabi (Gurmukhi)
        or: /[\u0B00-\u0B7F]/, // Odia
    };

    for (const [lang, regex] of Object.entries(scripts)) {
        if (regex.test(text)) {
            return lang as LanguageCode;
        }
    }

    // Default to English if no script detected
    return 'en';
}

/**
 * Translate phrase to user's language
 */
export function translate(
    phraseKey: keyof typeof MULTILINGUAL_PHRASES,
    language: LanguageCode,
    params?: Record<string, any>
): string {
    const phraseSet = MULTILINGUAL_PHRASES[phraseKey] as Partial<Record<LanguageCode, string>>;
    let phrase = phraseSet?.[language] ||
        phraseSet?.en ||
        phraseKey;

    // Replace parameters
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            phrase = phrase.replace(`{{${key}}}`, String(value));
        });
    }

    return phrase;
}

/**
 * Get voice settings for language
 */
export function getVoiceSettings(language: LanguageCode) {
    const voices: Record<LanguageCode, { voice?: string; pitch: number; rate: number }> = {
        hi: { pitch: 1.0, rate: 0.9 },
        en: { pitch: 1.0, rate: 1.0 },
        ta: { pitch: 1.0, rate: 0.9 },
        te: { pitch: 1.0, rate: 0.9 },
        kn: { pitch: 1.0, rate: 0.9 },
        ml: { pitch: 1.0, rate: 0.9 },
        bn: { pitch: 1.0, rate: 0.9 },
        mr: { pitch: 1.0, rate: 0.9 },
        gu: { pitch: 1.0, rate: 0.9 },
        pa: { pitch: 1.0, rate: 0.9 },
        or: { pitch: 1.0, rate: 0.9 },
        as: { pitch: 1.0, rate: 0.9 },
        ur: { pitch: 1.0, rate: 0.9 },
        sa: { pitch: 1.0, rate: 0.85 },
        ks: { pitch: 1.0, rate: 0.9 },
        ne: { pitch: 1.0, rate: 0.9 },
        sd: { pitch: 1.0, rate: 0.9 },
        kok: { pitch: 1.0, rate: 0.9 },
        mai: { pitch: 1.0, rate: 0.9 },
        mni: { pitch: 1.0, rate: 0.9 },
        sat: { pitch: 1.0, rate: 0.9 },
        doi: { pitch: 1.0, rate: 0.9 },
    };

    return voices[language] || voices.en;
}
