/**
 * Speech Recognition Service for KULABOUR Voice Assistant
 * Supports Hindi + Hinglish with offline capability for construction sites
 */

import { Platform } from 'react-native';
import Voice from '@react-native-voice/voice';

interface RecognitionResult {
    transcript: string;
    confidence: number;
    language: string;
    isFinal: boolean;
}

interface RecognitionOptions {
    language?: string;
    continuous?: boolean;
    maxAlternatives?: number;
}

class SpeechRecognitionService {
    private isListening = false;
    private recognition: typeof Voice = Voice;

    constructor() {
        this.setupListeners();
    }

    /**
     * Initialize speech recognition listeners
     */
    private setupListeners() {
        Voice.onSpeechStart = () => {
            console.log('🎤 Speech recognition started');
            this.isListening = true;
        };

        Voice.onSpeechEnd = () => {
            console.log('🎤 Speech recognition ended');
            this.isListening = false;
        };

        Voice.onSpeechError = (error) => {
            console.error('🎤 Speech recognition error:', error);
            this.isListening = false;
        };
    }

    /**
     * Start listening for speech
     * @param options Recognition options (language, continuous mode, etc.)
     * @returns Promise that resolves when speech is detected
     */
    async startListening(
        options: RecognitionOptions = {},
        onPartialResults?: (results: string[]) => void,
    ): Promise<RecognitionResult> {
        try {
            // Default to Hindi with fallback to English
            const language = options.language || 'hi-IN';

            // Set up partial results listener
            if (onPartialResults) {
                Voice.onSpeechPartialResults = (event) => {
                    if (event.value) {
                        onPartialResults(event.value);
                    }
                };
            }

            // Start recognition
            await Voice.start(language, {
                EXTRA_LANGUAGE_MODEL: 'LANGUAGE_MODEL_FREE_FORM',
                EXTRA_MAX_RESULTS: options.maxAlternatives || 3,
                EXTRA_PARTIAL_RESULTS: true,
            } as any);

            // Wait for final results
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.stopListening();
                    reject(new Error('Speech recognition timeout'));
                }, 30000); // 30 second timeout

                Voice.onSpeechResults = (event) => {
                    clearTimeout(timeout);

                    if (event.value && event.value.length > 0) {
                        resolve({
                            transcript: event.value[0],
                            confidence: 0.8, // @react-native-voice/voice doesn't provide confidence
                            language,
                            isFinal: true,
                        });
                    } else {
                        reject(new Error('No speech detected'));
                    }
                };

                Voice.onSpeechError = (error) => {
                    clearTimeout(timeout);
                    reject(error);
                };
            });
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            throw error;
        }
    }

    /**
     * Stop listening
     */
    async stopListening(): Promise<void> {
        try {
            await Voice.stop();
            this.isListening = false;
        } catch (error) {
            console.error('Failed to stop speech recognition:', error);
        }
    }

    /**
     * Cancel current recognition session
     */
    async cancel(): Promise<void> {
        try {
            await Voice.cancel();
            this.isListening = false;
        } catch (error) {
            console.error('Failed to cancel speech recognition:', error);
        }
    }

    /**
     * Check if device supports speech recognition
     */
    async isAvailable(): Promise<boolean> {
        try {
            const available = await Voice.isAvailable();
            return !!available; // Convert 1/true to boolean
        } catch (error) {
            console.error('Speech recognition not available:', error);
            return false;
        }
    }

    /**
     * Check if currently listening
     */
    getIsListening(): boolean {
        return this.isListening;
    }

    /**
     * Destroy and cleanup
     */
    async destroy(): Promise<void> {
        try {
            await Voice.destroy();
            Voice.removeAllListeners();
        } catch (error) {
            console.error('Failed to destroy voice recognition:', error);
        }
    }
}

// Export singleton instance
export const speechRecognitionService = new SpeechRecognitionService();
export default SpeechRecognitionService;
