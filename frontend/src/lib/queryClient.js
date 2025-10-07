import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import logger from '../utils/logger';

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
        if (error?.response?.status === 404) {
          logger.debug('Query retry skipped - 404 Not Found', {
            url: error?.config?.url,
            failureCount
          });
          return false;
        }
        if (error?.response?.status === 401) {
          logger.warn('Query retry skipped - 401 Unauthorized', {
            url: error?.config?.url,
            failureCount
          });
          return false;
        }
        if (failureCount >= 3) {
          logger.error('Query max retries reached', {
            url: error?.config?.url,
            failureCount,
            error: error.message
          });
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default
      refetchOnReconnect: 'always',
      onError: (error) => {
        logger.error('React Query query failed', {
          error: error?.message,
          status: error?.response?.status,
          url: error?.config?.url
        });
      },
    },
    mutations: {
      // Show error toast on mutation failure
      onError: (error) => {
        const message = error?.response?.data?.detail || error.message || 'Something went wrong';
        logger.error('React Query mutation failed', {
          error: message,
          status: error?.response?.status,
          url: error?.config?.url,
          method: error?.config?.method
        });
        toast.error(message);
      },
      onSuccess: (data, variables, context) => {
        logger.debug('React Query mutation succeeded', {
          url: context?.url || 'unknown'
        });
      },
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export default queryClient;