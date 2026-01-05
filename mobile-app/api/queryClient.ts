import { QueryClient } from '@tanstack/react-query';

// Create Query Client
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache for 5 minutes by default
            staleTime: 1000 * 60 * 5,
            // Keep data in cache for 24 hours
            gcTime: 1000 * 60 * 60 * 24,
            // Retry failed requests 2 times
            retry: 2,
            // Retry with exponential backoff
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus (when app comes to foreground)
            refetchOnWindowFocus: true,
            // Refetch when network reconnects
            refetchOnReconnect: true,
        },
        mutations: {
            // Retry mutations once
            retry: 1,
        },
    },
});
