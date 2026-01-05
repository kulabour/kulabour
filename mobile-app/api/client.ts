import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Config } from '../Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SecureStorage } from '../utils/SecureStorage';
import { router } from 'expo-router';
import { io, Socket } from 'socket.io-client';

// API Base URL
const API_BASE_URL = Config.API_URL;

// Socket Base URL (remove /api)
const SOCKET_BASE_URL = API_BASE_URL.replace('/api', '');

// Initialize Socket
export const socket: Socket = io(`${SOCKET_BASE_URL}/bookings`, {
    autoConnect: false,
    transports: ['websocket'],
});

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Add auth token to requests
        const token = await AsyncStorage.getItem('authToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (__DEV__) {
            console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// ===== RESPONSE INTERCEPTOR =====
api.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log response in development
        if (__DEV__) {
            console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }

        // Return data directly for cleaner usage
        return response.data;
    },
    async (error: AxiosError) => {
        // Handle errors globally
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data as any;

            console.error(`❌ API Error ${status}:`, errorData);

            // 401 Unauthorized - Token expired or invalid
            if (status === 401) {
                await SecureStorage.removeItem('authToken');
                await AsyncStorage.removeItem('user');

                // Redirect to login
                router.replace('/(auth)/login');

                return Promise.reject({
                    message: 'Session expired. Please login again.',
                    status: 401
                });
            }

            // 403 Forbidden
            if (status === 403) {
                return Promise.reject({
                    message: errorData.message || 'You do not have permission to perform this action.',
                    status: 403
                });
            }

            // 404 Not Found
            if (status === 404) {
                return Promise.reject({
                    message: errorData.message || 'Resource not found.',
                    status: 404
                });
            }

            // 429 Too Many Requests
            if (status === 429) {
                return Promise.reject({
                    message: 'Too many requests. Please try again later.',
                    status: 429
                });
            }

            // 500+ Server Errors
            if (status >= 500) {
                return Promise.reject({
                    message: 'Server error. Our team has been notified.',
                    status
                });
            }

            // Other errors
            return Promise.reject({
                message: errorData.message || errorData.error || 'Something went wrong.',
                status,
                details: errorData.details
            });
        }

        // Network error
        if (error.request) {
            console.error('Network error:', error.message);
            return Promise.reject({
                message: 'Network error. Please check your internet connection.',
                isNetworkError: true
            });
        }

        // Request setup error
        return Promise.reject({
            message: error.message || 'Request failed.',
        });
    }
);

// ===== API METHODS =====

// Auth
export const authAPI = {
    sendOTP: (mobile: string) =>
        api.post('/auth/send-otp', { mobile }),

    verifyOTP: (mobile: string, otp: string, role?: string, name?: string) =>
        api.post('/auth/verify-otp', { mobile, otp, role, name }),

    logout: () =>
        AsyncStorage.multiRemove(['authToken', 'user']),
};

// Payment API
export const paymentAPI = {
    createOrder: (bookingId: string, amount: number) => api.post('/payment/create-order', { bookingId, amount }),
    verifyPayment: (data: any) => api.post('/payment/verify', data),
};

// Bookings
export const bookingsAPI = {
    getAll: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/bookings', { params }),

    getById: (id: string) =>
        api.get(`/bookings/${id}`),

    create: (data: any) =>
        api.post('/bookings', data),

    updateStatus: (id: string, status: string, workerId?: string, workerName?: string) =>
        api.put(`/bookings/${id}/status`, { status, workerId, workerName }),

    accept: (id: string) =>
        api.put(`/bookings/${id}/accept`),

    cancel: (id: string) =>
        api.delete(`/bookings/${id}`),
};

// Services
export const servicesAPI = {
    getAll: () =>
        api.get('/services'),
};

// Users
export const usersAPI = {
    getProfile: () =>
        api.get('/users/me'),

    updateProfile: (data: any) =>
        api.put('/users/me', data),

    updateFcmToken: (userId: string, token: string) =>
        api.post(`/users/${userId}/fcm-token`, { token }),
};

// Export API instance for custom requests
export default api;

// ===== TYPES =====
export interface APIError {
    message: string;
    status?: number;
    details?: any;
    isNetworkError?: boolean;
}
