/**
 * API Client
 * Base HTTP client for backend API integration with secure token storage
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

// Smart Base URL detection
const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

    // Android Emulator needs 10.0.2.2 to access host localhost
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000';
    }

    // iOS Simulator and Web can use localhost
    return 'http://localhost:5000';
};

const API_BASE_URL = getBaseUrl();

interface RequestConfig extends RequestInit {
    token?: string;
}

interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// New response interfaces
export interface OtpVerifyResponse {
    accessToken: string;
    debug?: { otp?: string };
}

export interface ServiceItem {
    id: number;
    name: string;
    price: number;
    duration: string;
    popular?: boolean;
}

export interface BookingResponse {
    id: string;
    status: string;
    // add other fields as needed
}


class APIClient {
    private baseURL: string;
    private token: string | null = null;
    private isInitialized = false;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Initialize client and restore session from secure storage
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            let token: string | null = null;
            if (Platform.OS === 'web') {
                token = localStorage.getItem(TOKEN_KEY);
            } else {
                token = await SecureStore.getItemAsync(TOKEN_KEY);
            }

            if (token) {
                this.token = token;
                console.log('[API] Session restored from secure storage');
            }
        } catch (error) {
            console.warn('[API] Failed to restore session:', error);
        } finally {
            this.isInitialized = true;
        }
    }

    /**
     * Set authentication token (saves to secure storage)
     */
    async setToken(token: string) {
        this.token = token;
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem(TOKEN_KEY, token);
            } else {
                await SecureStore.setItemAsync(TOKEN_KEY, token);
            }
            console.log('[API] Token saved to secure storage');
        } catch (error) {
            console.error('[API] Failed to save token:', error);
        }
    }

    /**
     * Clear authentication token (removes from secure storage)
     */
    async clearToken() {
        this.token = null;
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem(TOKEN_KEY);
            } else {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            }
            console.log('[API] Token cleared from secure storage');
        } catch (error) {
            console.error('[API] Failed to clear token:', error);
        }
    }

    /**
     * Make HTTP request
     */
    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<APIResponse<T>> {
        const { token, ...fetchConfig } = config;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(config.headers as Record<string, string>),
        };

        // Add auth token if available
        const authToken = token || this.token;
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...fetchConfig,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 Unauthorized globally
                if (response.status === 401) {
                    await this.clearToken();
                    console.warn('[API] Session expired, token cleared');
                }

                return {
                    success: false,
                    error: data.error || 'Request failed',
                    message: data.message,
                };
            }

            return {
                success: true,
                data: data.data || data,
                message: data.message,
            };
        } catch (error) {
            console.error('API Request Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }

    /**
     * Upload file
     */
    async upload<T>(
        endpoint: string,
        file: File | Blob,
        additionalData?: Record<string, string | number | boolean>
    ): Promise<APIResponse<T>> {
        const formData = new FormData();
        formData.append('file', file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        const headers: HeadersInit = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Upload failed',
                };
            }

            return {
                success: true,
                data: data.data || data,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Upload error',
            };
        }
    }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for custom instances
export default APIClient;
