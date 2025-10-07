import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import logger from '../utils/logger';

const AuthContext = createContext({});

/**
 * Authentication Context Provider
 *
 * SECURITY NOTE: This app uses HTTP-only cookies for authentication.
 * - Tokens are stored in HTTP-only cookies (managed by backend)
 * - No tokens stored in localStorage/sessionStorage
 * - CSRF protection via backend
 * - Automatic token refresh via cookie
 *
 * The backend sets the cookie with these flags:
 * - httpOnly: true (prevents JavaScript access)
 * - secure: true (HTTPS only in production)
 * - sameSite: 'strict' (CSRF protection)
 */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  // Check if user is authenticated (via HTTP-only cookie) with race condition protection
  const checkAuth = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckInProgress) {
      return !!user;
    }

    setAuthCheckInProgress(true);

    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      logger.info('Authentication check successful', { userId: response.data.id });
      return true;
    } catch (error) {
      logger.debug('Authentication check failed', { error: error.message });
      setUser(null);
      return false;
    } finally {
      setLoading(false);
      setAuthCheckInProgress(false);
    }
  }, [authCheckInProgress, user]);

  // Login function (backend sets HTTP-only cookie)
  const login = async (credentials) => {
    try {
      logger.info('Login attempt', { email: credentials.email });
      const response = await api.post('/auth/login', credentials);
      const { user: userData } = response.data;

      setUser(userData);
      logger.info('Login successful', { userId: userData.id, email: userData.email });
      toast.success(`Welcome back, ${userData.first_name}!`);
      navigate('/feed');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Invalid credentials';
      logger.warn('Login failed', {
        email: credentials.email,
        error: message,
        status: error.response?.status
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register function (backend sets HTTP-only cookie)
  const register = async (userData) => {
    try {
      logger.info('Registration attempt', { email: userData.email });
      const response = await api.post('/auth/register', userData);
      const { user: newUser } = response.data;

      setUser(newUser);
      logger.info('Registration successful', { userId: newUser.id, email: newUser.email });
      toast.success('Welcome to Brotherhood! Your account has been created.');
      navigate('/feed');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed';
      logger.warn('Registration failed', {
        email: userData.email,
        error: message,
        status: error.response?.status
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function (backend clears HTTP-only cookie)
  const logout = useCallback(async (showMessage = true) => {
    try {
      await api.post('/auth/logout');
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error', { error: error.message });
    } finally {
      setUser(null);

      if (showMessage) {
        toast.success('You have been logged out successfully');
      }

      navigate('/login');
    }
  }, [navigate]);

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      logger.info('Profile update attempt', { userId: user?.id });
      const response = await api.patch('/auth/profile', updates);
      const updatedUser = response.data;

      setUser(updatedUser);
      logger.info('Profile updated successfully', { userId: updatedUser.id });
      toast.success('Profile updated successfully');

      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update profile';
      logger.error('Profile update failed', {
        userId: user?.id,
        error: message,
        status: error.response?.status
      });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Check authentication on mount with timeout protection
  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        logger.warn('Authentication check timed out after 10 seconds');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    checkAuth().catch((err) => {
      if (isMounted) {
        logger.error('Failed to check authentication', { error: err.message });
        setLoading(false);
      }
    }).finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run on mount

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;