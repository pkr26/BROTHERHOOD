import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Create a query client with optimized settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error) => {
        if (error?.response?.status === 404) return false;
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default
      refetchOnReconnect: 'always',
    },
    mutations: {
      // Show error toast on mutation failure
      onError: (error) => {
        const message = error?.response?.data?.detail || error.message || 'Something went wrong';
        toast.error(message);
      },
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export default queryClient;