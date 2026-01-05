import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'hi';

interface Translations {
    [key: string]: {
        en: string;
        hi: string;
    };
}

const translations: Translations = {
    // Common
    'common.welcome': { en: 'Welcome', hi: 'स्वागत है' },
    'common.continue': { en: 'Continue', hi: 'जारी रखें' },
    'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
    'common.save': { en: 'Save', hi: 'सहेजें' },
    'common.search': { en: 'Search', hi: 'खोजें' },
    'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },

    // Home Screen
    'home.title': { en: 'Find Services', hi: 'सेवाएं खोजें' },
    'home.searchPlaceholder': { en: 'Search for services...', hi: 'सेवाओं की खोज करें...' },
    'home.popular': { en: 'Popular Services', hi: 'लोकप्रिय सेवाएं' },

    // Booking
    'booking.title': { en: 'Book Service', hi: 'सेवा बुक करें' },
    'booking.selectDate': { en: 'Select Date', hi: 'तारीख चुनें' },
    'booking.selectTime': { en: 'Select Time', hi: 'समय चुनें' },
    'booking.confirm': { en: 'Confirm Booking', hi: 'बुकिंग की पुष्टि करें' },
    'booking.address': { en: 'Service Address', hi: 'सेवा का पता' },

    // Payment
    'payment.title': { en: 'Payment', hi: 'भुगतान' },
    'payment.total': { en: 'Total Amount', hi: 'कुल राशि' },
    'payment.pay': { en: 'Pay Now', hi: 'अभी भुगतान करें' },
    'payment.cash': { en: 'Cash on Service', hi: 'सेवा पर नकद' },

    // Profile
    'profile.title': { en: 'Profile', hi: 'प्रोफ़ाइल' },
    'profile.name': { en: 'Name', hi: 'नाम' },
    'profile.phone': { en: 'Phone', hi: 'फ़ोन' },
    'profile.email': { en: 'Email', hi: 'ईमेल' },
    'profile.logout': { en: 'Logout', hi: 'लॉग आउट' },

    // Services
    'services.plumber': { en: 'Plumber', hi: 'प्लम्बर' },
    'services.electrician': { en: 'Electrician', hi: 'इलेक्ट्रीशियन' },
    'services.carpenter': { en: 'Carpenter', hi: 'बढ़ई' },
    'services.painter': { en: 'Painter', hi: 'पेंटर' },
    'services.cleaner': { en: 'Cleaner', hi: 'सफाई कर्मी' },

    // Status
    'status.pending': { en: 'Pending', hi: 'लंबित' },
    'status.confirmed': { en: 'Confirmed', hi: 'पुष्टि की गई' },
    'status.inProgress': { en: 'In Progress', hi: 'प्रगति में' },
    'status.completed': { en: 'Completed', hi: 'पूर्ण' },
    'status.cancelled': { en: 'Cancelled', hi: 'रद्द' },
};

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('hi'); // Default to Hindi

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const saved = await AsyncStorage.getItem('language');
            if (saved === 'en' || saved === 'hi') {
                setLanguageState(saved);
            }
        } catch (error) {
            console.error('Failed to load language:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem('language', lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Failed to save language:', error);
        }
    };

    const t = (key: string, fallback?: string): string => {
        const translation = translations[key];
        if (!translation) {
            return fallback || key;
        }
        return translation[language];
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}
