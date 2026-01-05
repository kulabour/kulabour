/**
 * KULABOUR - Biometric Authentication Service
 * Secure fingerprint/face authentication for payments and sensitive actions
 */

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';

// Types
export interface BiometricResult {
    success: boolean;
    error?: string;
    type?: 'fingerprint' | 'facial' | 'iris';
}

export interface BiometricCapabilities {
    isAvailable: boolean;
    isEnrolled: boolean;
    supportedTypes: LocalAuthentication.AuthenticationType[];
    canUseFingerprint: boolean;
    canUseFacial: boolean;
}

const BIOMETRIC_ENABLED_KEY = '@kulabour_biometric_enabled';
const BIOMETRIC_PROMPT_HINDI = 'अपनी पहचान सत्यापित करें';
const BIOMETRIC_PROMPT_ENGLISH = 'Verify your identity';

class BiometricService {
    private isEnabled: boolean = false;
    private capabilities: BiometricCapabilities | null = null;

    constructor() {
        this.initialize();
    }

    /**
     * Initialize the service
     */
    private async initialize() {
        await this.checkCapabilities();
        await this.loadEnabledState();
    }

    /**
     * Check device biometric capabilities
     */
    async checkCapabilities(): Promise<BiometricCapabilities> {
        try {
            const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
                LocalAuthentication.hasHardwareAsync(),
                LocalAuthentication.isEnrolledAsync(),
                LocalAuthentication.supportedAuthenticationTypesAsync(),
            ]);

            this.capabilities = {
                isAvailable: hasHardware,
                isEnrolled,
                supportedTypes,
                canUseFingerprint: supportedTypes.includes(
                    LocalAuthentication.AuthenticationType.FINGERPRINT
                ),
                canUseFacial: supportedTypes.includes(
                    LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
                ),
            };

            console.log('[Biometric] Capabilities:', this.capabilities);
            return this.capabilities;
        } catch (error) {
            console.error('[Biometric] Failed to check capabilities:', error);
            this.capabilities = {
                isAvailable: false,
                isEnrolled: false,
                supportedTypes: [],
                canUseFingerprint: false,
                canUseFacial: false,
            };
            return this.capabilities;
        }
    }

    /**
     * Get cached capabilities
     */
    getCapabilities(): BiometricCapabilities | null {
        return this.capabilities;
    }

    /**
     * Check if biometric is available and enrolled
     */
    async isAvailable(): Promise<boolean> {
        const caps = await this.checkCapabilities();
        return caps.isAvailable && caps.isEnrolled;
    }

    /**
     * Load enabled state from storage
     */
    private async loadEnabledState() {
        try {
            const stored = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
            this.isEnabled = stored === 'true';
        } catch (error) {
            console.error('[Biometric] Failed to load enabled state:', error);
        }
    }

    /**
     * Check if biometric is enabled by user
     */
    isBiometricEnabled(): boolean {
        return this.isEnabled;
    }

    /**
     * Enable/disable biometric authentication
     */
    async setBiometricEnabled(enabled: boolean): Promise<boolean> {
        if (enabled) {
            // Verify biometric works before enabling
            const result = await this.authenticate('बायोमेट्रिक सेटअप');
            if (!result.success) {
                return false;
            }
        }

        try {
            await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, String(enabled));
            this.isEnabled = enabled;
            return true;
        } catch (error) {
            console.error('[Biometric] Failed to save enabled state:', error);
            return false;
        }
    }

    /**
     * Authenticate user with biometrics
     */
    async authenticate(reason: string = BIOMETRIC_PROMPT_HINDI): Promise<BiometricResult> {
        if (!this.capabilities?.isAvailable) {
            return {
                success: false,
                error: 'Biometric authentication not available on this device',
            };
        }

        if (!this.capabilities?.isEnrolled) {
            return {
                success: false,
                error: 'No biometric credentials enrolled. Please set up fingerprint or face ID in device settings.',
            };
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: reason,
                cancelLabel: 'रद्द करें',
                fallbackLabel: 'पासकोड उपयोग करें',
                disableDeviceFallback: false,
            });

            if (result.success) {
                console.log('[Biometric] Authentication successful');
                return {
                    success: true,
                    type: this.capabilities.canUseFacial ? 'facial' : 'fingerprint',
                };
            } else {
                console.log('[Biometric] Authentication failed:', result.error);
                return {
                    success: false,
                    error: this.getErrorMessage(result.error),
                };
            }
        } catch (error: any) {
            console.error('[Biometric] Authentication error:', error);
            return {
                success: false,
                error: error.message || 'Authentication failed',
            };
        }
    }

    /**
     * Authenticate for payment
     */
    async authenticateForPayment(amount: number): Promise<BiometricResult> {
        const reason = `₹${amount} के पेमेंट को अप्रूव करें`;
        return this.authenticate(reason);
    }

    /**
     * Authenticate for sensitive data access
     */
    async authenticateForSensitiveData(): Promise<BiometricResult> {
        return this.authenticate('संवेदनशील डेटा देखने के लिए पहचान सत्यापित करें');
    }

    /**
     * Get user-friendly error message
     */
    private getErrorMessage(error: string): string {
        const errorMessages: Record<string, string> = {
            user_cancel: 'आपने रद्द किया',
            user_fallback: 'पासकोड का उपयोग करें',
            system_cancel: 'सिस्टम द्वारा रद्द किया गया',
            lockout: 'बहुत सारे प्रयास। कृपया बाद में कोशिश करें।',
            lockout_permanent: 'बायोमेट्रिक लॉक है। डिवाइस सेटिंग्स में अनलॉक करें।',
            not_enrolled: 'बायोमेट्रिक सेटअप नहीं है',
            not_available: 'बायोमेट्रिक उपलब्ध नहीं है',
        };

        return errorMessages[error] || 'पहचान सत्यापन विफल';
    }

    /**
     * Get biometric type name in Hindi
     */
    getBiometricTypeName(): string {
        if (!this.capabilities) return 'बायोमेट्रिक';
        if (this.capabilities.canUseFacial) return 'फेस ID';
        if (this.capabilities.canUseFingerprint) return 'फिंगरप्रिंट';
        return 'बायोमेट्रिक';
    }

    /**
     * Show setup prompt to user
     */
    showSetupPrompt(): void {
        Alert.alert(
            'बायोमेट्रिक सेटअप करें',
            'पेमेंट को सुरक्षित करने के लिए फिंगरप्रिंट या फेस ID सेट करें।',
            [
                { text: 'बाद में', style: 'cancel' },
                { text: 'सेटअप करें', onPress: () => this.setBiometricEnabled(true) },
            ]
        );
    }
}

export const biometricService = new BiometricService();
export default BiometricService;
