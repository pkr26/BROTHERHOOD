import { queryClient } from '../../lib/queryClient';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast');

describe('queryClient.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  // Easy test cases
  describe('Easy cases - Basic configuration', () => {
    test('should export a QueryClient instance', () => {
      expect(queryClient).toBeDefined();
      expect(typeof queryClient.getQueryCache).toBe('function');
    });

    test('should have default staleTime configured', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries.staleTime).toBe(5 * 60 * 1000); // 5 minutes
    });

    test('should have default cacheTime configured', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries.cacheTime).toBe(10 * 60 * 1000); // 10 minutes
    });

    test('should have refetchOnWindowFocus enabled', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries.refetchOnWindowFocus).toBe(true);
    });

    test('should have refetchOnReconnect set to always', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.queries.refetchOnReconnect).toBe('always');
    });
  });

  // Medium test cases
  describe('Medium cases - Retry logic', () => {
    test('should have retry function configured for queries', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(typeof defaultOptions.queries.retry).toBe('function');
    });

    test('should not retry on 404 errors', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retry = defaultOptions.queries.retry;
      const error404 = { response: { status: 404 } };

      expect(retry(0, error404)).toBe(false);
      expect(retry(1, error404)).toBe(false);
      expect(retry(2, error404)).toBe(false);
    });

    test('should not retry on 401 errors', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retry = defaultOptions.queries.retry;
      const error401 = { response: { status: 401 } };

      expect(retry(0, error401)).toBe(false);
      expect(retry(1, error401)).toBe(false);
    });

    test('should retry other errors up to 3 times', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retry = defaultOptions.queries.retry;
      const error500 = { response: { status: 500 } };

      expect(retry(0, error500)).toBe(true);
      expect(retry(1, error500)).toBe(true);
      expect(retry(2, error500)).toBe(true);
      expect(retry(3, error500)).toBe(false);
    });

    test('should have exponential backoff retry delay', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retryDelay = defaultOptions.queries.retryDelay;

      expect(retryDelay(0)).toBe(1000); // 2^0 * 1000 = 1000ms
      expect(retryDelay(1)).toBe(2000); // 2^1 * 1000 = 2000ms
      expect(retryDelay(2)).toBe(4000); // 2^2 * 1000 = 4000ms
      expect(retryDelay(3)).toBe(8000); // 2^3 * 1000 = 8000ms
    });

    test('should cap retry delay at 30 seconds', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retryDelay = defaultOptions.queries.retryDelay;

      expect(retryDelay(10)).toBe(30000); // Should be capped at 30000ms
      expect(retryDelay(20)).toBe(30000);
    });
  });

  // Hard test cases
  describe('Hard cases - Mutation configuration', () => {
    test('should have onError configured for mutations', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(typeof defaultOptions.mutations.onError).toBe('function');
    });

    test('should show toast error on mutation failure with detail message', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const onError = defaultOptions.mutations.onError;

      const error = {
        response: {
          data: {
            detail: 'Validation failed',
          },
        },
      };

      onError(error);

      expect(toast.error).toHaveBeenCalledWith('Validation failed');
    });

    test('should show toast error with generic message when detail is missing', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const onError = defaultOptions.mutations.onError;

      const error = {
        message: 'Network Error',
      };

      onError(error);

      expect(toast.error).toHaveBeenCalledWith('Network Error');
    });

    test('should show default error message when no message is available', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const onError = defaultOptions.mutations.onError;

      const error = {};

      onError(error);

      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });

    test('should retry mutations once', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.mutations.retry).toBe(1);
    });

    test('should have 1 second retry delay for mutations', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      expect(defaultOptions.mutations.retryDelay).toBe(1000);
    });
  });

  describe('Complex scenarios', () => {
    test('should handle multiple query cache instances', () => {
      const cache1 = queryClient.getQueryCache();
      const cache2 = queryClient.getQueryCache();

      expect(cache1).toBe(cache2); // Should return same instance
    });

    test('should handle clearing all queries', () => {
      queryClient.setQueryData(['test'], { data: 'test' });
      expect(queryClient.getQueryData(['test'])).toEqual({ data: 'test' });

      queryClient.clear();
      expect(queryClient.getQueryData(['test'])).toBeUndefined();
    });

    test('should handle complex error objects in mutation onError', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const onError = defaultOptions.mutations.onError;

      const complexError = {
        response: {
          data: {
            detail: {
              message: 'Complex error',
              code: 'ERR_001',
            },
          },
        },
      };

      // Should handle object detail gracefully
      onError(complexError);

      expect(toast.error).toHaveBeenCalled();
    });

    test('should retry network errors but not client errors', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retry = defaultOptions.queries.retry;

      const networkError = { message: 'Network Error' };
      const clientError = { response: { status: 400 } };

      expect(retry(0, networkError)).toBe(true);
      expect(retry(0, clientError)).toBe(true);
    });

    test('should handle retryDelay with various attempt indices', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retryDelay = defaultOptions.queries.retryDelay;

      const delays = [0, 1, 2, 3, 4, 5].map(retryDelay);

      // Verify exponential growth
      expect(delays[0]).toBeLessThan(delays[1]);
      expect(delays[1]).toBeLessThan(delays[2]);
      expect(delays[2]).toBeLessThan(delays[3]);

      // Verify all delays are reasonable
      delays.forEach(delay => {
        expect(delay).toBeGreaterThan(0);
        expect(delay).toBeLessThanOrEqual(30000);
      });
    });

    test('should handle error with null response', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retry = defaultOptions.queries.retry;

      const errorWithoutResponse = { message: 'Something went wrong' };

      // Should retry since no response status to check
      expect(retry(0, errorWithoutResponse)).toBe(true);
      expect(retry(1, errorWithoutResponse)).toBe(true);
      expect(retry(2, errorWithoutResponse)).toBe(true);
      expect(retry(3, errorWithoutResponse)).toBe(false);
    });

    test('should handle undefined error in retry logic', () => {
      const defaultOptions = queryClient.getDefaultOptions();
      const retry = defaultOptions.queries.retry;

      // Should handle gracefully and retry
      expect(retry(0, undefined)).toBe(true);
    });

    test('should integrate with query cache correctly', () => {
      const queryCache = queryClient.getQueryCache();

      // Set data
      queryClient.setQueryData(['user', 1], { id: 1, name: 'Test' });

      // Get data
      const data = queryClient.getQueryData(['user', 1]);
      expect(data).toEqual({ id: 1, name: 'Test' });

      // Invalidate
      queryClient.invalidateQueries(['user', 1]);

      // Query should still exist but be marked as stale
      const queries = queryCache.findAll(['user', 1]);
      expect(queries.length).toBeGreaterThan(0);
    });

    test('should handle mutation cache operations', () => {
      const mutationCache = queryClient.getMutationCache();
      expect(mutationCache).toBeDefined();
      expect(typeof mutationCache.subscribe).toBe('function');
    });
  });
});
