export declare const SUPPORTED_LANGUAGES: {
    readonly hi: {
        readonly name: "Hindi";
        readonly native: "हिन्दी";
        readonly code: "hi-IN";
    };
    readonly en: {
        readonly name: "English";
        readonly native: "English";
        readonly code: "en-IN";
    };
    readonly ta: {
        readonly name: "Tamil";
        readonly native: "தமிழ்";
        readonly code: "ta-IN";
    };
    readonly te: {
        readonly name: "Telugu";
        readonly native: "తెలుగు";
        readonly code: "te-IN";
    };
    readonly kn: {
        readonly name: "Kannada";
        readonly native: "ಕನ್ನಡ";
        readonly code: "kn-IN";
    };
    readonly ml: {
        readonly name: "Malayalam";
        readonly native: "മലയാളം";
        readonly code: "ml-IN";
    };
    readonly bn: {
        readonly name: "Bengali";
        readonly native: "বাংলা";
        readonly code: "bn-IN";
    };
    readonly mr: {
        readonly name: "Marathi";
        readonly native: "मराठी";
        readonly code: "mr-IN";
    };
    readonly gu: {
        readonly name: "Gujarati";
        readonly native: "ગુજરાતી";
        readonly code: "gu-IN";
    };
    readonly pa: {
        readonly name: "Punjabi";
        readonly native: "ਪੰਜਾਬੀ";
        readonly code: "pa-IN";
    };
    readonly or: {
        readonly name: "Odia";
        readonly native: "ଓଡ଼ିଆ";
        readonly code: "or-IN";
    };
    readonly as: {
        readonly name: "Assamese";
        readonly native: "অসমীয়া";
        readonly code: "as-IN";
    };
    readonly ur: {
        readonly name: "Urdu";
        readonly native: "اردو";
        readonly code: "ur-IN";
    };
    readonly sa: {
        readonly name: "Sanskrit";
        readonly native: "संस्कृत";
        readonly code: "sa-IN";
    };
    readonly ks: {
        readonly name: "Kashmiri";
        readonly native: "कश्मीरी";
        readonly code: "ks-IN";
    };
    readonly ne: {
        readonly name: "Nepali";
        readonly native: "नेपाली";
        readonly code: "ne-IN";
    };
    readonly sd: {
        readonly name: "Sindhi";
        readonly native: "سنڌي";
        readonly code: "sd-IN";
    };
    readonly kok: {
        readonly name: "Konkani";
        readonly native: "कोंकणी";
        readonly code: "kok-IN";
    };
    readonly mai: {
        readonly name: "Maithili";
        readonly native: "मैथिली";
        readonly code: "mai-IN";
    };
    readonly mni: {
        readonly name: "Manipuri";
        readonly native: "মৈতৈলোন্";
        readonly code: "mni-IN";
    };
    readonly sat: {
        readonly name: "Santali";
        readonly native: "ᱥᱟᱱᱛᱟᱲᱤ";
        readonly code: "sat-IN";
    };
    readonly doi: {
        readonly name: "Dogri";
        readonly native: "डोगरी";
        readonly code: "doi-IN";
    };
};
export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;
export declare function detectLanguage(text: string): LanguageCode;
