/**
 * KULABOUR - Theme Context
 * Dark/Light mode with animated transitions
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';

const THEME_KEY = '@kulabour_theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
}

const lightColors: ThemeColors = {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    primary: '#0078D4',
    text: '#1A1A1A',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
};

const darkColors: ThemeColors = {
    background: '#0D1117',
    surface: '#161B22',
    primary: '#00D9FF',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.6)',
    border: 'rgba(255,255,255,0.1)',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
};

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    setMode: (mode: ThemeMode) => void;
    toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('dark'); // Default dark for premium feel
    const progress = useSharedValue(1); // 0 = light, 1 = dark

    const isDark = mode === 'system'
        ? systemColorScheme === 'dark'
        : mode === 'dark';

    const colors = isDark ? darkColors : lightColors;

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        progress.value = withTiming(isDark ? 1 : 0, { duration: 300 });
    }, [isDark]);

    const loadTheme = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_KEY);
            if (saved && ['light', 'dark', 'system'].includes(saved)) {
                setModeState(saved as ThemeMode);
            }
        } catch (e) {
            console.warn('Failed to load theme preference');
        }
    };

    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        try {
            await AsyncStorage.setItem(THEME_KEY, newMode);
        } catch (e) {
            console.warn('Failed to save theme preference');
        }
    };

    const toggle = () => {
        setMode(isDark ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ mode, isDark, colors, setMode, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

/**
 * Animated Theme Toggle Component
 */
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ThemeToggle() {
    const { isDark, toggle } = useTheme();
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);

    const handlePress = () => {
        rotation.value = withTiming(rotation.value + 360, { duration: 500 });
        scale.value = withTiming(0.8, { duration: 100 }, () => {
            scale.value = withTiming(1, { duration: 200 });
        });
        toggle();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value}deg` },
            { scale: scale.value },
        ],
    }));

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
            <Animated.View
                style={[
                    animatedStyle,
                    {
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: isDark ? '#1F2937' : '#FDE68A',
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: isDark ? '#00D9FF' : '#F59E0B',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                    }
                ]}
            >
                <Ionicons
                    name={isDark ? 'moon' : 'sunny'}
                    size={24}
                    color={isDark ? '#00D9FF' : '#F59E0B'}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}
