/**
 * Authentication API
 * Endpoints for user authentication and session management
 */

import { apiClient } from './client';

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
    accessToken: string;
    refreshToken?: string;
    user: {
        id: string;
        phone: string; // Backend sends 'mobile' but let's check
        mobile?: string;
        name?: string;
        userType: 'worker' | 'customer';
        isVerified?: boolean;
    };
}

/**
 * Send OTP to phone number
 */
export async function sendOTP(data: LoginRequest) {
    // Real API call:
    return apiClient.post<{ message: string; expiresIn: number }>(
        '/auth/send-otp',
        { mobile: data.phone }
    );
}

/**
 * Verify OTP and login
 */
export async function verifyOTP(data: OTPVerifyRequest) {
    // Real API call:
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', {
        mobile: data.phone,
        otp: data.otp,
        userType: data.userType
    });

    if (response.success && response.data) {
        // The backend returns { data: { accessToken, user, ... } }
        // Our APIClient unwraps the outer 'data', so here response.data IS the inner object.
        // However, backend calls it 'accessToken', not 'token'.
        // Let's check backend/routes/auth.js again.
        // It returns:
        // res.json({
        //     success: true,
        //     message: 'Login successful',
        //     data: { user, accessToken, refreshToken }
        // });

        // So response.data here will be { user, accessToken, refreshToken }
        // We need to use accessToken.

        const token = response.data.accessToken;
        if (token) {
            apiClient.setToken(token);
        }
    }
    return response;
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
    // TODO: Implement proper client-side caching if needed, e.g. using a global store or React Query

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

    return result;

    // Real API call:
    // return apiClient.get('/auth/me');
}
