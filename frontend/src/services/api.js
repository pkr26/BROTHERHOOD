import axios from 'axios';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import logger from '../utils/logger';

/**
 * API Configuration with HTTP-only Cookie Authentication
 *
 * SECURITY ARCHITECTURE:
 * ----------------------
 * This application uses HTTP-only cookies for authentication tokens.
 *
 * ✅ Security Benefits:
 * - Immune to XSS attacks (JavaScript cannot access HTTP-only cookies)
 * - Automatic CSRF protection via SameSite=Strict cookie flag
 * - Backend-managed token refresh (no client-side token handling)
 * - Tokens automatically sent with every request
 *
 * 📋 Backend Requirements:
 * The backend must set authentication cookies with these flags:
 * - httpOnly: true (prevents JavaScript access)
 * - secure: true (HTTPS only in production)
 * - sameSite: 'strict' (prevents CSRF attacks)
 * - path: '/' (available for all routes)
 *
 * 🔄 Authentication Flow:
 * 1. POST /auth/login → Backend sets HTTP-only cookie
 * 2. GET /auth/me → Cookie sent automatically, returns user data
 * 3. POST /auth/logout → Backend clears the cookie
 * 4. 401 response → Frontend redirects to login
 *
 * 🚫 What We DON'T Do:
 * - No tokens in localStorage/sessionStorage
 * - No manual Authorization headers
 * - No client-side token expiration handling
 * - No token refresh logic (backend handles it)
 */

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  withCredentials: true, // Critical: Enables sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sanitize response data to prevent XSS with circular reference protection
const sanitizeData = (data, seen = new WeakSet()) => {
  // Handle primitives
  if (data === null || typeof data !== 'object') {
    if (typeof data === 'string') {
      return DOMPurify.sanitize(data);
    }
    return data;
  }

  // Check for circular references
  if (seen.has(data)) {
    return data; // Return as-is to avoid infinite loop
  }

  // Mark object as seen
  seen.add(data);

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item, seen));
  }

  // Handle objects
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeData(value, seen);
  }

  return sanitized;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add request ID for tracking
    config.headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Log request
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      requestId: config.headers['X-Request-ID'],
    });

    return config;
  },
  (error) => {
    logger.error('Request configuration error', { error: error.message });
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Sanitize response data
    if (response.data) {
      response.data = sanitizeData(response.data);
    }

    // Log successful response
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
    });

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error with appropriate level
    const status = error.response?.status;
    const logContext = {
      status: status || 'Network Error',
      url: originalRequest?.url,
      error: error.message,
    };

    if (status >= 500) {
      logger.error('API Server Error', logContext);
    } else if (status === 401 || status === 403) {
      logger.warn('API Authentication/Authorization Error', logContext);
    } else if (!error.response) {
      logger.error('API Network Error', logContext);
    } else {
      logger.debug('API Client Error', logContext);
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth and redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response.status === 403) {
      toast.error('You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Handle 429 Too Many Requests
    if (error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      toast.error(`Too many requests. Please try again in ${retryAfter} seconds.`);
      return Promise.reject(error);
    }

    // Handle 500 Server Errors with retry
    if (error.response.status >= 500 && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (error.response.status >= 500 && originalRequest._retryCount < 3) {
      originalRequest._retryCount++;

      // Exponential backoff
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;

      await new Promise(resolve => setTimeout(resolve, delay));

      return api(originalRequest);
    }

    // Handle validation errors
    if (error.response.status === 422) {
      const validationErrors = error.response.data.detail;
      if (Array.isArray(validationErrors)) {
        validationErrors.forEach(err => {
          toast.error(`${err.loc.join('.')}: ${err.msg}`);
        });
      }
    }

    return Promise.reject(error);
  }
);

// In-memory cache implementation (more secure than sessionStorage)
const apiCache = new Map();
const MAX_CACHE_SIZE = 50; // Limit cache size to prevent memory issues

// Clear old cache entries
const pruneCache = () => {
  if (apiCache.size > MAX_CACHE_SIZE) {
    // Remove oldest entries (first items in Map)
    const entriesToRemove = apiCache.size - MAX_CACHE_SIZE;
    const keys = Array.from(apiCache.keys());
    for (let i = 0; i < entriesToRemove; i++) {
      apiCache.delete(keys[i]);
    }
  }
};

// Helper functions for common API calls
export const apiHelpers = {
  // GET request with in-memory caching
  get: async (url, config = {}) => {
    const cacheKey = `${url}_${JSON.stringify(config.params || {})}`;

    if (config.cache !== false && apiCache.has(cacheKey)) {
      const { data, timestamp } = apiCache.get(cacheKey);
      const cacheAge = Date.now() - timestamp;

      // Cache for 5 minutes by default
      const maxAge = config.cacheTime || 5 * 60 * 1000;

      if (cacheAge < maxAge) {
        logger.debug('API Cache hit', { url, cacheAge: `${Math.round(cacheAge / 1000)}s` });
        return { data, cached: true };
      } else {
        // Remove expired cache
        logger.debug('API Cache expired', { url });
        apiCache.delete(cacheKey);
      }
    }

    try {
      logger.info('API GET request', { url, params: config.params });
      const response = await api.get(url, config);

      if (config.cache !== false) {
        apiCache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
        pruneCache();
        logger.debug('API Response cached', { url });
      }

      return response;
    } catch (error) {
      logger.error('API GET request failed', {
        url,
        params: config.params,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Clear cache manually if needed
  clearCache: () => {
    logger.info('API Cache cleared', { cacheSize: apiCache.size });
    apiCache.clear();
  },

  // POST request with CSRF protection
  post: async (url, data, config = {}) => {
    try {
      logger.info('API POST request', { url });
      const response = await api.post(url, data, config);
      logger.info('API POST success', { url, status: response.status });
      return response;
    } catch (error) {
      logger.error('API POST request failed', {
        url,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  // PUT request
  put: async (url, data, config = {}) => {
    try {
      logger.info('API PUT request', { url });
      const response = await api.put(url, data, config);
      logger.info('API PUT success', { url, status: response.status });
      return response;
    } catch (error) {
      logger.error('API PUT request failed', {
        url,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data, config = {}) => {
    try {
      logger.info('API PATCH request', { url });
      const response = await api.patch(url, data, config);
      logger.info('API PATCH success', { url, status: response.status });
      return response;
    } catch (error) {
      logger.error('API PATCH request failed', {
        url,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      logger.info('API DELETE request', { url });
      const response = await api.delete(url, config);
      logger.info('API DELETE success', { url, status: response.status });
      return response;
    } catch (error) {
      logger.error('API DELETE request failed', {
        url,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Upload file with progress
  upload: async (url, formData, onProgress) => {
    try {
      logger.info('API File upload started', { url });
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
            logger.debug('Upload progress', { url, progress: `${percentCompleted}%` });
          }
        },
      });
      logger.info('API File upload completed', { url, status: response.status });
      return response;
    } catch (error) {
      logger.error('API File upload failed', {
        url,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  },
};

export default api;