import APIClient, { apiClient } from '../../services/api/client';
import * as SecureStore from 'expo-secure-store';

// Mock Expo Secure Store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('APIClient', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset client token
        apiClient.clearToken();
    });

    describe('initialize', () => {
        it('should restore token from storage', async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce('stored_token');

            await apiClient.initialize();

            // We can verify if token is set by making a request and checking headers
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });

            await apiClient.get('/test');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test'),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer stored_token'
                    })
                })
            );
        });
    });

    describe('request', () => {
        it('should make a successful request', async () => {
            const mockResponse = { success: true, data: { id: 1 } };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            });

            const response = await apiClient.get('/users/1');

            expect(response.success).toBe(true);
            expect(response.data).toEqual(mockResponse.data);
        });

        it('should handle 401 Unauthorized', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: () => Promise.resolve({ error: 'Unauthorized' })
            });

            await apiClient.setToken('invalid_token');
            const response = await apiClient.get('/protected');

            expect(response.success).toBe(false);
            expect(SecureStore.deleteItemAsync).toHaveBeenCalled(); // Should expire session
        });
    });
});
