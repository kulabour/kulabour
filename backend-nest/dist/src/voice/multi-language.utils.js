"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_LANGUAGES = void 0;
exports.detectLanguage = detectLanguage;
exports.SUPPORTED_LANGUAGES = {
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
};
function detectLanguage(text) {
    const scripts = {
        hi: /[\u0900-\u097F]/,
        ta: /[\u0B80-\u0BFF]/,
        te: /[\u0C00-\u0C7F]/,
        kn: /[\u0C80-\u0CFF]/,
        ml: /[\u0D00-\u0D7F]/,
        bn: /[\u0980-\u09FF]/,
        gu: /[\u0A80-\u0AFF]/,
        pa: /[\u0A00-\u0A7F]/,
        or: /[\u0B00-\u0B7F]/,
    };
    for (const [lang, regex] of Object.entries(scripts)) {
        if (regex.test(text)) {
            return lang;
        }
    }
    return 'en';
}
//# sourceMappingURL=multi-language.utils.js.map