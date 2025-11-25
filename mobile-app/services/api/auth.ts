/**
 * Authentication API
 * Endpoints for user authentication and session management
 */

import { apiClient } from './client';
import { cache } from './cache';

export interface LoginRequest {
    phone: string;
    userType: 'worker' | 'customer';
}

export interface OTPVerifyRequest {
    phone: string;
    otp: string;
    userType: 'worker' | 'customer';
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        phone: string;
        name?: string;
        userType: 'worker' | 'customer';
        isVerified: boolean;
    };
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(data: LoginRequest) {
    // Mock implementation - replace with real API
    console.log('[API] Sending OTP to:', data.phone);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    return {
        success: true,
        data: {
            message: 'OTP sent successfully',
            expiresIn: 300, // 5 minutes
        },
    };

    // Real API call (uncomment when backend is ready):
    // return apiClient.post<{ message: string; expiresIn: number }>(
    //     '/auth/send-otp',
    //     data
    // );
}

/**
 * Verify OTP and login
 */
export async function verifyOTP(data: OTPVerifyRequest) {
    // Mock implementation
    console.log('[API] Verifying OTP for:', data.phone);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful login
    const mockUser: AuthResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
            id: 'user_' + Date.now(),
            phone: data.phone,
            name: data.userType === 'worker' ? 'Rajesh Kumar' : 'Priya Sharma',
            userType: data.userType,
            isVerified: true,
        },
    };

    // Set token in client
    await apiClient.setToken(mockUser.token);

    return {
        success: true,
        data: mockUser,
    };

    // Real API call:
    // const response = await apiClient.post<AuthResponse>('/auth/verify-otp', data);
    // if (response.success && response.data?.token) {
    //     apiClient.setToken(response.data.token);
    // }
    // return response;
}

/**
 * Logout user
 */
export async function logout() {
    apiClient.clearToken();

    // Real API call:
    // return apiClient.post('/auth/logout');

    return { success: true };
}

/**
 * Get current user profile
 */
export async function getCurrentUser() {
    // Try cache first
    const cached = await cache.get('auth:currentUser');
    if (cached) {
        return { success: true, data: JSON.parse(cached) };
    }

    // Mock implementation (fallback)
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = {
        success: true,
        data: {
            id: 'user_123',
            phone: '+919876543210',
            name: 'Test User',
            email: 'test@kulabour.com',
            userType: 'customer' as const,
            rating: 4.5,
            completedJobs: 25,
        },
    };

    // Store in cache for 5 minutes
    await cache.set('auth:currentUser', JSON.stringify(result.data), 300);
    return result;

    // Real API call:
    // return apiClient.get('/auth/me');
}
