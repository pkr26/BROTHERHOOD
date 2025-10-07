// Mock logger before importing api
jest.mock('../../utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// Create global mock instance that will be reused
const mockAxiosInstance = {
  interceptors: {
    request: { use: jest.fn((onFulfilled, onRejected) => {
      mockAxiosInstance._requestInterceptor = { onFulfilled, onRejected };
    }) },
    response: { use: jest.fn((onFulfilled, onRejected) => {
      mockAxiosInstance._responseInterceptor = { onFulfilled, onRejected };
    }) },
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  _requestInterceptor: null,
  _responseInterceptor: null,
};

// Mock axios module
jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  default: mockAxiosInstance,
}));

const mockSanitize = jest.fn((input) => input);
jest.mock('dompurify', () => ({
  sanitize: mockSanitize,
}));

const mockToastError = jest.fn();
jest.mock('react-hot-toast', () => ({
  error: mockToastError,
}));

// Import after mocking
const { apiHelpers } = require('../../services/api');
const logger = require('../../utils/logger');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiHelpers.clearCache();
  });

  describe('apiHelpers.get', () => {
    it('should make GET request', async () => {
      const mockData = { id: 1, name: 'test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await apiHelpers.get('/test');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', {});
      expect(result.data).toEqual(mockData);
    });

    it('should cache GET requests by default', async () => {
      const mockData = { id: 1, name: 'test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      await apiHelpers.get('/test');
      const result = await apiHelpers.get('/test');

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(result.cached).toBe(true);
    });

    it('should not cache when cache: false is set', async () => {
      const mockData = { id: 1, name: 'test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      await apiHelpers.get('/test', { cache: false });
      await apiHelpers.get('/test', { cache: false });

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should expire cache after cacheTime', async () => {
      const mockData = { id: 1, name: 'test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      await apiHelpers.get('/test', { cacheTime: -1 });
      await apiHelpers.get('/test', { cacheTime: -1 });

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });

    it('should clear cache manually', async () => {
      const mockData = { id: 1, name: 'test' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      await apiHelpers.get('/test');
      apiHelpers.clearCache();
      await apiHelpers.get('/test');

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('apiHelpers.post', () => {
    it('should make POST request', async () => {
      const mockData = { name: 'test' };
      mockAxiosInstance.post.mockResolvedValue({ data: mockData });

      await apiHelpers.post('/test', mockData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', mockData, {});
    });
  });

  describe('apiHelpers.put', () => {
    it('should make PUT request', async () => {
      const mockData = { name: 'test' };
      mockAxiosInstance.put.mockResolvedValue({ data: mockData });

      await apiHelpers.put('/test', mockData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', mockData, {});
    });
  });

  describe('apiHelpers.patch', () => {
    it('should make PATCH request', async () => {
      const mockData = { name: 'test' };
      mockAxiosInstance.patch.mockResolvedValue({ data: mockData });

      await apiHelpers.patch('/test', mockData);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/test', mockData, {});
    });
  });

  describe('apiHelpers.delete', () => {
    it('should make DELETE request', async () => {
      mockAxiosInstance.delete.mockResolvedValue({ data: {} });

      await apiHelpers.delete('/test');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test', {});
    });
  });

  describe('apiHelpers.upload', () => {
    it('should make upload request with progress callback', async () => {
      const formData = new FormData();
      const onProgress = jest.fn();
      mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });

      await apiHelpers.upload('/upload', formData, onProgress);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/upload',
        formData,
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: expect.any(Function),
        })
      );
    });

    it('should call progress callback during upload', async () => {
      const formData = new FormData();
      const onProgress = jest.fn();

      mockAxiosInstance.post.mockImplementation((url, data, config) => {
        config.onUploadProgress({ loaded: 50, total: 100 });
        return Promise.resolve({ data: { id: 1 } });
      });

      await apiHelpers.upload('/upload', formData, onProgress);

      expect(onProgress).toHaveBeenCalledWith(50);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(apiHelpers.get('/test')).rejects.toThrow('Network Error');
    });

    it('should handle 401 errors', async () => {
      const error = {
        response: { status: 401, data: { detail: 'Unauthorized' } },
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(apiHelpers.get('/test')).rejects.toEqual(error);
    });

    it('should handle 403 errors', async () => {
      const error = {
        response: { status: 403, data: { detail: 'Forbidden' } },
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(apiHelpers.get('/test')).rejects.toEqual(error);
    });
  });

  describe('Cache Management', () => {
    it('should prune cache when size exceeds MAX_CACHE_SIZE', async () => {
      const mockData = { id: 1 };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      // Make 51 requests (MAX_CACHE_SIZE is 50)
      for (let i = 0; i < 51; i++) {
        await apiHelpers.get(`/test${i}`);
      }

      // First request should be evicted from cache
      await apiHelpers.get('/test0');

      // Should make 52 total requests (51 initial + 1 for test0 after eviction)
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(52);
    });

    it('should use different cache keys for different params', async () => {
      const mockData = { id: 1 };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      await apiHelpers.get('/test', { params: { id: 1 } });
      await apiHelpers.get('/test', { params: { id: 2 } });

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Interceptors', () => {
    describe('Request Interceptor', () => {
      it('should add request ID header', () => {
        const config = { headers: {}, method: 'GET', url: '/test' };
        const result = mockAxiosInstance._requestInterceptor.onFulfilled(config);

        expect(result.headers['X-Request-ID']).toBeDefined();
        expect(result.headers['X-Request-ID']).toMatch(/^\d+-[a-z0-9]+$/);
      });

      it('should add CSRF token if available', () => {
        // Create a meta tag with CSRF token
        const meta = document.createElement('meta');
        meta.setAttribute('name', 'csrf-token');
        meta.setAttribute('content', 'test-csrf-token');
        document.head.appendChild(meta);

        const config = { headers: {}, method: 'POST', url: '/test' };
        const result = mockAxiosInstance._requestInterceptor.onFulfilled(config);

        expect(result.headers['X-CSRF-Token']).toBe('test-csrf-token');

        // Cleanup
        document.head.removeChild(meta);
      });

      it('should log request details', () => {
        const config = { headers: {}, method: 'POST', url: '/test' };
        mockAxiosInstance._requestInterceptor.onFulfilled(config);

        expect(logger.debug).toHaveBeenCalledWith('API Request', {
          method: 'POST',
          url: '/test',
          requestId: expect.any(String),
        });
      });

      it('should handle request interceptor errors', () => {
        const error = new Error('Request config error');
        const result = mockAxiosInstance._requestInterceptor.onRejected(error);

        expect(logger.error).toHaveBeenCalledWith('Request configuration error', {
          error: 'Request config error',
        });
        expect(result).rejects.toEqual(error);
      });
    });

    describe('Response Interceptor', () => {
      it('should sanitize response data', () => {
        const response = {
          data: { message: '<script>alert("xss")</script>' },
          status: 200,
          config: { url: '/test' },
        };

        mockAxiosInstance._responseInterceptor.onFulfilled(response);

        expect(mockSanitize).toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalledWith('API Response', {
          status: 200,
          url: '/test',
        });
      });

      it('should sanitize nested objects', () => {
        const response = {
          data: {
            user: {
              name: '<b>John</b>',
              posts: [{ content: '<i>test</i>' }],
            },
          },
          status: 200,
          config: { url: '/test' },
        };

        mockAxiosInstance._responseInterceptor.onFulfilled(response);

        // Sanitize is called for each string value: 'name' and 'content'
        expect(mockSanitize).toHaveBeenCalledWith('<b>John</b>');
        expect(mockSanitize).toHaveBeenCalledWith('<i>test</i>');
      });

      it('should handle circular references in response data', () => {
        const circular = { a: 1 };
        circular.self = circular;

        const response = {
          data: circular,
          status: 200,
          config: { url: '/test' },
        };

        // Should not throw
        expect(() => {
          mockAxiosInstance._responseInterceptor.onFulfilled(response);
        }).not.toThrow();
      });

      it('should handle network errors without response', async () => {
        const error = new Error('Network Error');
        error.config = { url: '/test' };

        const result = mockAxiosInstance._responseInterceptor.onRejected(error);

        await expect(result).rejects.toEqual(error);
        expect(mockToastError).toHaveBeenCalledWith('Network error. Please check your connection.');
        expect(logger.error).toHaveBeenCalledWith('API Network Error', {
          status: 'Network Error',
          url: '/test',
          error: 'Network Error',
        });
      });

      it('should handle 401 errors and redirect to login', async () => {
        const originalLocation = window.location.href;
        delete window.location;
        window.location = { href: '/feed', pathname: '/feed' };

        const error = {
          response: { status: 401 },
          config: { url: '/test', _retry: false },
          message: 'Unauthorized',
        };

        const result = mockAxiosInstance._responseInterceptor.onRejected(error);

        await expect(result).rejects.toEqual(error);
        expect(mockToastError).toHaveBeenCalledWith('Session expired. Please login again.');
        expect(window.location.href).toBe('/login');
        expect(logger.warn).toHaveBeenCalledWith('API Authentication/Authorization Error', {
          status: 401,
          url: '/test',
          error: 'Unauthorized',
        });

        // Cleanup
        window.location.href = originalLocation;
      });

      it('should not redirect to login if already on login page', async () => {
        delete window.location;
        window.location = { href: '/login', pathname: '/login' };

        const error = {
          response: { status: 401 },
          config: { url: '/test' },
          message: 'Unauthorized',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
        expect(mockToastError).not.toHaveBeenCalledWith('Session expired. Please login again.');
      });

      it('should not retry 401 if already retried', async () => {
        const error = {
          response: { status: 401 },
          config: { url: '/test', _retry: true },
          message: 'Unauthorized',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
      });

      it('should handle 403 Forbidden errors', async () => {
        const error = {
          response: { status: 403 },
          config: { url: '/test' },
          message: 'Forbidden',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
        expect(mockToastError).toHaveBeenCalledWith('You do not have permission to perform this action.');
      });

      it('should handle 429 Too Many Requests with retry-after header', async () => {
        const error = {
          response: {
            status: 429,
            headers: { 'retry-after': '120' },
          },
          config: { url: '/test' },
          message: 'Too Many Requests',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
        expect(mockToastError).toHaveBeenCalledWith('Too many requests. Please try again in 120 seconds.');
      });

      it('should handle 429 Too Many Requests without retry-after header', async () => {
        const error = {
          response: {
            status: 429,
            headers: {},
          },
          config: { url: '/test' },
          message: 'Too Many Requests',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
        expect(mockToastError).toHaveBeenCalledWith('Too many requests. Please try again in 60 seconds.');
      });

      it('should retry 500 errors with exponential backoff', async () => {
        jest.useFakeTimers();

        const error = {
          response: { status: 500 },
          config: { url: '/test' },
          message: 'Server Error',
        };

        mockAxiosInstance._responseInterceptor.onRejected(error);

        expect(error.config._retryCount).toBe(1);

        jest.useRealTimers();
      });

      it('should not retry 500 errors more than 3 times', async () => {
        const error = {
          response: { status: 500 },
          config: { url: '/test', _retryCount: 3 },
          message: 'Server Error',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
        expect(logger.error).toHaveBeenCalledWith('API Server Error', {
          status: 500,
          url: '/test',
          error: 'Server Error',
        });
      });

      it('should handle 422 validation errors with array of errors', async () => {
        const error = {
          response: {
            status: 422,
            data: {
              detail: [
                { loc: ['body', 'email'], msg: 'Invalid email format' },
                { loc: ['body', 'password'], msg: 'Password too short' },
              ],
            },
          },
          config: { url: '/test' },
          message: 'Validation Error',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
        expect(mockToastError).toHaveBeenCalledWith('body.email: Invalid email format');
        expect(mockToastError).toHaveBeenCalledWith('body.password: Password too short');
      });

      it('should handle 422 validation errors with non-array detail', async () => {
        const error = {
          response: {
            status: 422,
            data: { detail: 'Single validation error' },
          },
          config: { url: '/test' },
          message: 'Validation Error',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
      });

      it('should handle client errors (4xx) other than 401, 403, 422, 429', async () => {
        const error = {
          response: { status: 404 },
          config: { url: '/test' },
          message: 'Not Found',
        };

        await expect(mockAxiosInstance._responseInterceptor.onRejected(error)).rejects.toEqual(error);
        expect(logger.debug).toHaveBeenCalledWith('API Client Error', {
          status: 404,
          url: '/test',
          error: 'Not Found',
        });
      });
    });
  });

  describe('sanitizeData edge cases', () => {
    it('should handle null values', () => {
      const response = {
        data: null,
        status: 200,
        config: { url: '/test' },
      };

      const result = mockAxiosInstance._responseInterceptor.onFulfilled(response);
      expect(result.data).toBeNull();
    });

    it('should handle primitive values', () => {
      const response = {
        data: 123,
        status: 200,
        config: { url: '/test' },
      };

      const result = mockAxiosInstance._responseInterceptor.onFulfilled(response);
      expect(result.data).toBe(123);
    });

    it('should handle arrays', () => {
      const response = {
        data: ['<script>test</script>', 'normal text', 123],
        status: 200,
        config: { url: '/test' },
      };

      mockAxiosInstance._responseInterceptor.onFulfilled(response);
      expect(mockSanitize).toHaveBeenCalled();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle GET request errors with status code', async () => {
      const error = {
        response: { status: 500, data: { detail: 'Server error' } },
        message: 'Request failed',
      };
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(apiHelpers.get('/test')).rejects.toEqual(error);
      expect(logger.error).toHaveBeenCalledWith('API GET request failed', {
        url: '/test',
        params: undefined,
        error: 'Request failed',
        status: 500,
      });
    });

    it('should handle POST request errors', async () => {
      const error = {
        response: { status: 400 },
        message: 'Bad request',
      };
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(apiHelpers.post('/test', { data: 'test' })).rejects.toEqual(error);
      expect(logger.error).toHaveBeenCalledWith('API POST request failed', {
        url: '/test',
        error: 'Bad request',
        status: 400,
      });
    });

    it('should handle PUT request errors', async () => {
      const error = {
        response: { status: 400 },
        message: 'Bad request',
      };
      mockAxiosInstance.put.mockRejectedValue(error);

      await expect(apiHelpers.put('/test', { data: 'test' })).rejects.toEqual(error);
      expect(logger.error).toHaveBeenCalledWith('API PUT request failed', {
        url: '/test',
        error: 'Bad request',
        status: 400,
      });
    });

    it('should handle PATCH request errors', async () => {
      const error = {
        response: { status: 400 },
        message: 'Bad request',
      };
      mockAxiosInstance.patch.mockRejectedValue(error);

      await expect(apiHelpers.patch('/test', { data: 'test' })).rejects.toEqual(error);
      expect(logger.error).toHaveBeenCalledWith('API PATCH request failed', {
        url: '/test',
        error: 'Bad request',
        status: 400,
      });
    });

    it('should handle DELETE request errors', async () => {
      const error = {
        response: { status: 400 },
        message: 'Bad request',
      };
      mockAxiosInstance.delete.mockRejectedValue(error);

      await expect(apiHelpers.delete('/test')).rejects.toEqual(error);
      expect(logger.error).toHaveBeenCalledWith('API DELETE request failed', {
        url: '/test',
        error: 'Bad request',
        status: 400,
      });
    });

    it('should handle upload errors', async () => {
      const error = {
        response: { status: 413 },
        message: 'File too large',
      };
      const formData = new FormData();
      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(apiHelpers.upload('/upload', formData)).rejects.toEqual(error);
      expect(logger.error).toHaveBeenCalledWith('API File upload failed', {
        url: '/upload',
        error: 'File too large',
        status: 413,
      });
    });

    it('should handle upload without progress callback', async () => {
      const formData = new FormData();
      mockAxiosInstance.post.mockResolvedValue({ data: { id: 1 } });

      await apiHelpers.upload('/upload', formData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/upload',
        formData,
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    });
  });
});
