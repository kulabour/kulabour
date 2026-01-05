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
        return 'http://10.0.2.2:3001'; // NestJS Port
    }

    // iOS Simulator and Web can use localhost
    return 'http://localhost:3001'; // NestJS Port
};

const API_BASE_URL = getBaseUrl();

interface RequestConfig extends RequestInit {
    token?: string;
}

import { ApiResponse, ApiError, ErrorCodes } from '../../utils/apiResponse';
import { performanceMonitor } from '../PerformanceMonitor';

// ... (keep Token key and getBaseUrl logic) ...

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
            const traceId = performanceMonitor.startTrace('api_init');
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
            performanceMonitor.stopTrace(traceId);
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
     * Make HTTP request with standardized response
     */
    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        const { token, ...fetchConfig } = config;
        const traceId = performanceMonitor.startTrace(`api_request_${endpoint}`);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(config.headers as Record<string, string>),
        };

        // Add auth token if available
        const authToken = token || this.token;
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const startTime = Date.now();

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...fetchConfig,
                headers,
            });

            // Normalize response to standardized format
            const rawData = await response.json();

            performanceMonitor.stopTrace(traceId);

            if (!response.ok) {
                // Handle 401 Unauthorized globally
                if (response.status === 401) {
                    await this.clearToken();
                    console.warn('[API] Session expired, token cleared');
                    return {
                        success: false,
                        data: null,
                        error: {
                            code: ErrorCodes.AUTH_EXPIRED.code,
                            message: rawData.message || ErrorCodes.AUTH_EXPIRED.message,
                            hindiMessage: ErrorCodes.AUTH_EXPIRED.hindi
                        },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            requestId: rawData.metadata?.requestId || `${Date.now()}`,
                            version: '1.0.0',
                            latencyMs: Date.now() - startTime
                        }
                    };
                }

                return {
                    success: false,
                    data: null,
                    error: {
                        code: rawData.error?.code || 'API_ERROR',
                        message: rawData.message || rawData.error || 'Request failed',
                        hindiMessage: rawData.error?.hindiMessage,
                        details: rawData.error?.details
                    },
                    metadata: {
                        timestamp: new Date().toISOString(),
                        requestId: rawData.metadata?.requestId || `${Date.now()}`,
                        version: '1.0.0',
                        latencyMs: Date.now() - startTime
                    }
                };
            }

            // Success response
            // Handle if backend already returns standardized format
            if (rawData.metadata && rawData.success !== undefined) {
                return rawData as ApiResponse<T>;
            }

            // Wrap legacy response
            return {
                success: true,
                data: (rawData.data || rawData) as T,
                error: null,
                metadata: {
                    timestamp: new Date().toISOString(),
                    requestId: `${Date.now()}`,
                    version: '1.0.0',
                    latencyMs: Date.now() - startTime
                }
            };

        } catch (error: any) {
            performanceMonitor.stopTrace(traceId);
            console.error('API Request Error:', error);

            return {
                success: false,
                data: null,
                error: {
                    code: error.name === 'AbortError' ? ErrorCodes.TIMEOUT.code : ErrorCodes.NETWORK_ERROR.code,
                    message: error.message || 'Network error',
                    hindiMessage: ErrorCodes.NETWORK_ERROR.hindi
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    requestId: `${Date.now()}`,
                    version: '1.0.0',
                    latencyMs: Date.now() - startTime
                }
            };
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: any,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
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
        body?: any,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        body?: any,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    /**
     * Upload file
     */
    async upload<T>(
        endpoint: string,
        file: File | Blob, // Ensure File/Blob types are available in RN if used directly
        additionalData?: Record<string, any>
    ): Promise<ApiResponse<T>> {
        const formData = new FormData();
        // @ts-ignore - React Native handling of FormData
        formData.append('file', file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        const headers: Record<string, string> = {
            // Content-Type should be left undefined for FormData to set boundary
        } as Record<string, string>;

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const startTime = Date.now();

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
                    data: null,
                    error: {
                        code: 'UPLOAD_FAILED',
                        message: data.message || 'Upload failed',
                    },
                    metadata: {
                        timestamp: new Date().toISOString(),
                        requestId: `${Date.now()}`,
                        version: '1.0.0',
                        latencyMs: Date.now() - startTime
                    }
                };
            }

            return {
                success: true,
                data: data.data || data,
                error: null,
                metadata: {
                    timestamp: new Date().toISOString(),
                    requestId: `${Date.now()}`,
                    version: '1.0.0',
                    latencyMs: Date.now() - startTime
                }
            };
        } catch (error: any) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'NETWORK_ERROR',
                    message: error.message || 'Upload error',
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    requestId: `${Date.now()}`,
                    version: '1.0.0',
                    latencyMs: Date.now() - startTime
                }
            };
        }
    }
}

// Export singleton instance
export const apiClient = new APIClient();
export const api = apiClient;

// Export class for custom instances
export default APIClient;
