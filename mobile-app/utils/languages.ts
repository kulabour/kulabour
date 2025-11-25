export type LanguageCode = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml' | 'mr' | 'bn';

export interface Language {
    code: LanguageCode;
    name: string;
    nativeName: string;
    flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

export interface FAQTranslation {
    greeting: string;
    help: string;
    payment: string;
    withdraw: string;
    job: string;
    book: string;
    cancel: string;
    track: string;
    fallback: string;
}

export const FAQ_TRANSLATIONS: Record<LanguageCode, FAQTranslation> = {
    en: {
        greeting: '👋 Hello! I\'m your AI assistant. How can I help you today?',
        help: 'I can help you with payments, bookings, job tracking, and general support. What would you like to know?',
        payment: '💳 For payments, you can use UPI, cards, or wallet. Your payment is secure and will be processed after job completion.',
        withdraw: '💰 To withdraw earnings, go to Wallet → Withdraw. Funds will be transferred to your bank within 24 hours.',
        job: '🔨 For job-related queries, check the Jobs tab. You can view active jobs, history, and earnings there.',
        book: '📱 To book a service, select a category from the home screen, choose your service, and confirm the booking.',
        cancel: '❌ To cancel a booking, go to Orders → Select booking → Cancel. Cancellation fees may apply.',
        track: '📍 Track your order in real-time from the Track Order screen. You can see worker location and ETA.',
        fallback: 'I\'m not sure about that. Try asking about payments, bookings, jobs, or tracking.',
    },
    hi: {
        greeting: '👋 नमस्ते! मैं आपका AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
        help: 'मैं भुगतान, बुकिंग, नौकरी ट्रैकिंग और सामान्य सहायता में आपकी मदद कर सकता हूं।',
        payment: '💳 भुगतान के लिए, आप UPI, कार्ड या वॉलेट का उपयोग कर सकते हैं।',
        withdraw: '💰 कमाई निकालने के लिए, वॉलेट → निकालें पर जाएं।',
        job: '🔨 नौकरी से संबंधित प्रश्नों के लिए, नौकरी टैब देखें।',
        book: '📱 सेवा बुक करने के लिए, होम स्क्रीन से एक श्रेणी चुनें।',
        cancel: '❌ बुकिंग रद्द करने के लिए, ऑर्डर → बुकिंग चुनें → रद्द करें।',
        track: '📍 ट्रैक ऑर्डर स्क्रीन से अपने ऑर्डर को वास्तविक समय में ट्रैक करें।',
        fallback: 'मुझे इसके बारे में यकीन नहीं है। भुगतान, बुकिंग या ट्रैकिंग के बारे में पूछें।',
    },
    kn: {
        greeting: '👋 ನਮସ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        help: 'ನಾನು ಪಾವತಿಗಳು, ಬುಕಿಂಗ್‌ಗಳು ಮತ್ತು ಕೆಲಸ ಟ್ರ್ಯಾಕಿಂಗ್‌ನಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.',
        payment: '💳 ಪಾವತಿಗಾಗಿ, ನೀವು UPI, ಕಾರ್ಡ್ ಅಥವಾ ವಾಲೆಟ್ ಬಳಸಬಹುದು.',
        withdraw: '💰 ಗಳಿಕೆಗಳನ್ನು ಹಿಂಪಡೆಯಲು, ವಾಲೆಟ್ → ಹಿಂತೆಗೆದುಕೊಳ್ಳಿ ಗೆ ಹೋಗಿ.',
        job: '🔨 ಕೆಲಸ-ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಿಗಾಗಿ, ಉದ್ಯೋಗಗಳ ಟ್ಯಾಬ್ ನೋಡಿ.',
        book: '📱 ಸೇವೆಯನ್ನು ಬುಕ್ ಮಾಡಲು, ಮುಖಪುಟದಿಂದ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        cancel: '❌ ಬುಕಿಂಗ್ ರದ್ದುಮಾಡಲು, ಆದೇಶಗಳು → ಬುಕಿಂಗ್ ಆಯ್ಕೆಮಾಡಿ → ರದ್ದುಮಾಡಿ.',
        track: '📍 ಟ್ರ್ಯಾಕ್ ಆರ್ಡರ್ ಪರದೆಯಿಂದ ನಿಮ್ಮ ಆದೇಶವನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
        fallback: 'ನನಗೆ ಅದರ ಬಗ್ಗೆ ಖಚಿತವಿಲ್ಲ. ಪಾವತಿಗಳು ಅಥವಾ ಬುಕಿಂಗ್ ಬಗ್ಗೆ ಕೇಳಿ.',
    },
    ta: {
        greeting: '👋 வணக்கம்! நான் உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவலாம்?',
        help: 'நான் பணம் செலுத்துதல், முன்பதிவுகள் மற்றும் வேலை கண்காணிப்பில் உதவ முடியும்.',
        payment: '💳 பணம் செலுத்த, UPI, கார்டு அல்லது வாலட் பயன்படுத்தலாம்.',
        withdraw: '💰 வருவாயை திரும்பப் பெற, வாலட் → திரும்பப் பெறு க்கு செல்லவும்.',
        job: '🔨 வேலை தொடர்பான கேள்விகளுக்கு, வேலைகள் தாவலைப் பார்க்கவும்.',
        book: '📱 சேவையை முன்பதிவு செய்ய, முகப்பு திரையில் இருந்து ஒரு வகையை தேர்ந்தெடுக்கவும்.',
        cancel: '❌ முன்பதிவை ரத்து செய்ய, ஆர்டர்கள் → முன்பதிவு தேர்வு → ரத்து.',
        track: '📍 டிராக் ஆர்டர் திரையில் இருந்து உங்கள் ஆர்டரை நேரலையில் கண்காணிக்கவும்.',
        fallback: 'எனக்கு அது பற்றி உறுதியாக தெரியவில்லை. பணம் அல்லது முன்பதிவு பற்றி கேளுங்கள்.',
    },
    te: {
        greeting: '👋 నమస్కారం! నేను మీ AI సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
        help: 'నేను చెల్లింపులు, బుకింగ్‌లు మరియు ఉద్యోగ ట్రాకింగ్‌లో సహాయం చేయగలను.',
        payment: '💳 చెల్లింపు కోసం, మీరు UPI, కార్డ్ లేదా వాలెట్ ఉపయోగించవచ్చు.',
        withdraw: '💰 ఆదాయాలను తిరిగి పొందడానికి, వాలెట్ → ఉపసంహరించండి కు వెళ్లండి.',
        job: '🔨 ఉద్యోగ సంబంధిత ప్రశ్నల కోసం, ఉద్యోగాల ట్యాబ్‌ని చూడండి.',
        book: '📱 సేవను బుక్ చేయడానికి, హోమ్ స్క్రీన్ నుండి వర్గాన్ని ఎంచుకోండి.',
        cancel: '❌ బుకింగ్‌ను రద్దు చేయడానికి, ఆర్డర్‌లు → బుకింగ్ ఎంచుకోండి → రద్దు చేయండి.',
        track: '📍 ట్రాక్ ఆర్డర్ స్క్రీన్ నుండి మీ ఆర్డర్‌ను రియల్ టైమ్‌లో ట్రాక్ చేయండి.',
        fallback: 'నాకు దాని గురించి ఖచ్చితంగా తెలియదు. చెల్లింపులు లేదా బుకింగ్ గురించి అడగండి.',
    },
    ml: {
        greeting: '👋 നമസ്കാരം! ഞാൻ നിങ്ങളുടെ AI സഹായകനാണ്. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കും?',
        help: 'പേയ്‌മെൻ്റുകൾ, ബുക്കിംഗുകൾ, ജോലി ട്രാക്കിംഗ് എന്നിവയിൽ ഞാൻ സഹായിക്കും.',
        payment: '💳 പേയ്‌മെൻ്റിന്, നിങ്ങൾക്ക് UPI, കാർഡ് അല്ലെങ്കിൽ വാലറ്റ് ഉപയോഗിക്കാം.',
        withdraw: '💰 വരുമാനം പിൻവലിക്കാൻ, വാലറ്റ് → പിൻവലിക്കുക എന്നതിലേക്ക് പോകുക.',
        job: '🔨 ജോലി സംബന്ധിച്ച ചോദ്യങ്ങൾക്ക്, ജോബ്‌സ് ടാബ് കാണുക.',
        book: '📱 സേവനം ബുക്ക് ചെയ്യാൻ, ഹോം സ്‌ക്രീനിൽ നിന്ന് ഒരു വിഭാഗം തിരഞ്ഞെടുക്കുക.',
        cancel: '❌ ബുക്കിംഗ് റദ്ദാക്കാൻ, ഓർഡറുകൾ → ബുക്കിംഗ് തിരഞ്ഞെടുക്കുക → റദ്ദാക്കുക.',
        track: '📍 ട്രാക്ക് ഓർഡർ സ്‌ക്രീനിൽ നിന്ന് നിങ്ങളുടെ ഓർഡർ തത്സമയം ട്രാക്ക് ചെയ്യുക.',
        fallback: 'എനിക്ക് അതിനെക്കുറിച്ച് ഉറപ്പില്ല. പേയ്‌മെൻ്റുകൾ അല്ലെങ്കിൽ ബുക്കിംഗുകൾ ചോദിക്കുക.',
    },
    mr: {
        greeting: '👋 नमस्कार! मी तुमचा AI सहाय्यक आहे. आज मी तुम्हाला कशी मदत करू शकतो?',
        help: 'मी पेमेंट, बुकिंग आणि जॉब ट्रॅकिंगमध्ये मदत करू शकतो.',
        payment: '💳 पेमेंटसाठी, तुम्ही UPI, कार्ड किंवा वॉलेट वापरू शकता.',
        withdraw: '💰 कमाई काढण्यासाठी, वॉलेट → काढा वर जा.',
        job: '🔨 नोकरी संबंधित प्रश्नांसाठी, जॉब्स टॅब पहा.',
        book: '📱 सेवा बुक करण्यासाठी, होम स्क्रीनवरून श्रेणी निवडा.',
        cancel: '❌ बुकिंग रद्द करण्यासाठी, ऑर्डर्स → बुकिंग निवडा → रद्द करा.',
        track: '📍 ट्रॅक ऑर्डर स्क्रीनवरून तुमची ऑर्डर रिअल टाइममध्ये ट्रॅक करा.',
        fallback: 'मला त्याबद्दल खात्री नाही. पेमेंट किंवा बुकिंगबद्दल विचारा.',
    },
    bn: {
        greeting: '👋 নমস্কার! আমি আপনার AI সহায়ক। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?',
        help: 'আমি পেমেন্ট, বুকিং এবং কাজ ট্র্যাকিংয়ে সাহায্য করতে পারি।',
        payment: '💳 পেমেন্টের জন্য, আপনি UPI, কার্ড বা ওয়ালেট ব্যবহার করতে পারেন।',
        withdraw: '💰 উপার্জন তুলতে, ওয়ালেট → উত্তোলন-এ যান।',
        job: '🔨 কাজ সম্পর্কিত প্রশ্নের জন্য, জবস ট্যাব দেখুন।',
        book: '📱 পরিষেবা বুক করতে, হোম স্ক্রীন থেকে একটি বিভাগ নির্বাচন করুন।',
        cancel: '❌ বুকিং বাতিল করতে, অর্ডার → বুকিং নির্বাচন → বাতিল করুন।',
        track: '📍 ট্র্যাক অর্ডার স্ক্রীন থেকে রিয়েল টাইমে আপনার অর্ডার ট্র্যাক করুন।',
        fallback: 'আমি এটি সম্পর্কে নিশ্চিত নই। পেমেন্ট বা বুকিং সম্পর্কে জিজ্ঞাসা করুন।',
    },
};

export const getLanguageName = (code: string): string => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    return lang?.name || 'English';
};
