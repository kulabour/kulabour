import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';

type MoodType = 'calm' | 'urgent' | 'celebration' | 'focus';
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string[];
    text: string;
    glow: string;
}

const MOOD_THEMES: Record<MoodType, ThemeColors> = {
    calm: {
        primary: '#0078D4',
        secondary: '#107C10',
        accent: '#00B7C3',
        background: ['#0a0a15', '#0d1520', '#0a0a15'],
        text: '#ffffff',
        glow: '#0078D4',
    },
    urgent: {
        primary: '#D13438',
        secondary: '#FFB900',
        accent: '#FF8C00',
        background: ['#1a0a0a', '#200808', '#1a0a0a'],
        text: '#ffffff',
        glow: '#D13438',
    },
    celebration: {
        primary: '#8764B8',
        secondary: '#FFB900',
        accent: '#00B7C3',
        background: ['#0f0a18', '#120d1a', '#0f0a18'],
        text: '#ffffff',
        glow: '#8764B8',
    },
    focus: {
        primary: '#107C10',
        secondary: '#0078D4',
        accent: '#00B7C3',
        background: ['#050a05', '#081008', '#050a05'],
        text: '#ffffff',
        glow: '#107C10',
    },
};

const TIME_MODIFIERS: Record<TimeOfDay, Partial<ThemeColors>> = {
    morning: {
        accent: '#FFB900',
    },
    afternoon: {
        accent: '#0078D4',
    },
    evening: {
        accent: '#8764B8',
    },
    night: {
        accent: '#00B7C3',
    },
};

interface LivingThemeContextType {
    mood: MoodType;
    timeOfDay: TimeOfDay;
    theme: ThemeColors;
    setMood: (mood: MoodType) => void;
    triggerCelebration: () => void;
    triggerUrgency: () => void;
}

const LivingThemeContext = createContext<LivingThemeContextType | undefined>(undefined);

function getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

export function LivingThemeProvider({ children }: { children: ReactNode }) {
    const [mood, setMood] = useState<MoodType>('calm');
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

    // Update time of day every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeOfDay(getTimeOfDay());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Compute theme based on mood and time
    const theme: ThemeColors = {
        ...MOOD_THEMES[mood],
        ...TIME_MODIFIERS[timeOfDay],
    };

    const triggerCelebration = () => {
        setMood('celebration');
        // Auto-reset after 5 seconds
        setTimeout(() => setMood('calm'), 5000);
    };

    const triggerUrgency = () => {
        setMood('urgent');
        // Auto-reset after 10 seconds
        setTimeout(() => setMood('calm'), 10000);
    };

    return (
        <LivingThemeContext.Provider
            value={{
                mood,
                timeOfDay,
                theme,
                setMood,
                triggerCelebration,
                triggerUrgency,
            }}
        >
            {children}
        </LivingThemeContext.Provider>
    );
}

export function useLivingTheme() {
    const context = useContext(LivingThemeContext);
    if (!context) {
        throw new Error('useLivingTheme must be used within a LivingThemeProvider');
    }
    return context;
}

// Time-based greeting
export function useGreeting(): string {
    const { timeOfDay } = useLivingTheme();

    const greetings: Record<TimeOfDay, { hindi: string; english: string }> = {
        morning: { hindi: 'सुप्रभात', english: 'Good Morning' },
        afternoon: { hindi: 'नमस्ते', english: 'Good Afternoon' },
        evening: { hindi: 'शुभ संध्या', english: 'Good Evening' },
        night: { hindi: 'शुभ रात्रि', english: 'Good Night' },
    };

    return `${greetings[timeOfDay].hindi} | ${greetings[timeOfDay].english}`;
}
