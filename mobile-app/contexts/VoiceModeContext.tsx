import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

interface VoiceModeContextType {
    isVoiceModeEnabled: boolean;
    toggleVoiceMode: () => void;
    setVoiceMode: (enabled: boolean) => void;
    isListening: boolean;
    setIsListening: (listening: boolean) => void;
}

const VoiceModeContext = createContext<VoiceModeContextType | undefined>(undefined);

export function VoiceModeProvider({ children }: { children: ReactNode }) {
    const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const toggleVoiceMode = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsVoiceModeEnabled(prev => !prev);
    };

    const setVoiceMode = (enabled: boolean) => {
        setIsVoiceModeEnabled(enabled);
    };

    return (
        <VoiceModeContext.Provider
            value={{
                isVoiceModeEnabled,
                toggleVoiceMode,
                setVoiceMode,
                isListening,
                setIsListening
            }}
        >
            {children}
        </VoiceModeContext.Provider>
    );
}

export function useVoiceMode() {
    const context = useContext(VoiceModeContext);
    if (context === undefined) {
        throw new Error('useVoiceMode must be used within a VoiceModeProvider');
    }
    return context;
}
