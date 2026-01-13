import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsAPI, servicesAPI, usersAPI, authAPI } from '../api/client';

// ===== BOOKINGS HOOKS =====

export const useBookings = (params?: { status?: string; page?: number }) => {
    return useQuery({
        queryKey: ['bookings', params],
        queryFn: () => bookingsAPI.getAll(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

export const useBooking = (id: string) => {
    return useQuery({
        queryKey: ['booking', id],
        queryFn: () => bookingsAPI.getById(id),
        enabled: !!id, // Only fetch if ID exists
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => bookingsAPI.create(data),
        onSuccess: () => {
            // Invalidate bookings list to refetch
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, workerId, workerName }: any) =>
            bookingsAPI.updateStatus(id, status, workerId, workerName),
        onSuccess: (data, variables) => {
            // Update cache for specific booking
            queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
            // Update bookings list
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useAcceptBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingsAPI.accept(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ['booking', id] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useCancelBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => bookingsAPI.cancel(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ['booking', id] });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

// ===== SERVICES HOOKS =====

export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: () => servicesAPI.getAll(),
        staleTime: 1000 * 60 * 60, // 1 hour (services don't change often)
    });
};

// ===== USER HOOKS =====

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: () => usersAPI.getProfile(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => usersAPI.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
};

// ===== AUTH HOOKS =====

export const useSendOTP = () => {
    return useMutation({
        mutationFn: (phone: string) => authAPI.sendOTP(phone),
    });
};

export const useVerifyOTP = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
            authAPI.verifyOTP(phone, otp),
        onSuccess: () => {
            // Clear all queries on login
            queryClient.clear();
        },
    });
};

// ===== OFFLINE STATUS HOOK =====

export const useIsOnline = () => {
    // Note: This requires expo-network or @react-native-community/netinfo
    // For now, return true (always online)
    // TODO: Implement actual network detection
    return true;
};
