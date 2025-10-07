import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../services/api');
jest.mock('react-hot-toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Test component that uses the auth context
const TestComponent = () => {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="loading">{auth.loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{auth.user ? auth.user.first_name : 'no user'}</div>
      <div data-testid="authenticated">{auth.isAuthenticated ? 'yes' : 'no'}</div>
      <button onClick={() => auth.login({ email: 'test@example.com', password: 'Test123!' })}>
        Login
      </button>
      <button onClick={() => auth.register({ email: 'new@example.com', password: 'Test123!' })}>
        Register
      </button>
      <button onClick={() => auth.logout()}>Logout</button>
      <button onClick={() => auth.updateProfile({ first_name: 'Updated' })}>Update</button>
      <button onClick={() => auth.checkAuth()}>Check Auth</button>
    </div>
  );
};

const renderWithAuth = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('useAuth Hook', () => {
    it('should work when used within AuthProvider', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      // This should render successfully with the provider
      renderWithAuth(<TestComponent />);

      // Component should render successfully
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should provide auth context when used within AuthProvider', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      renderWithAuth(<TestComponent />);

      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });
  });

  describe('Initial Authentication Check', () => {
    it('should check authentication on mount', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/auth/me');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
        expect(screen.getByTestId('user')).toHaveTextContent('John');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
      });
    });

    it('should handle failed authentication check', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('no');
      });
    });

    it('should timeout after 10 seconds if auth check hangs', async () => {
      // Mock a hanging request
      api.get.mockImplementation(() => new Promise(() => {}));

      renderWithAuth(<TestComponent />);

      expect(screen.getByTestId('loading')).toHaveTextContent('loading');

      // Fast-forward past the timeout
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockRejectedValue(new Error('Not authenticated'));
      api.post.mockResolvedValue({ data: { user: mockUser } });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      act(() => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/login', {
          email: 'test@example.com',
          password: 'Test123!',
        });
        expect(toast.success).toHaveBeenCalledWith('Welcome back, John!');
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });
    });

    it('should handle login failure', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      api.post.mockRejectedValue({
        response: { data: { detail: 'Invalid credentials' } },
      });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      act(() => {
        screen.getByText('Login').click();
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
      });
    });
  });

  describe('Register', () => {
    it('should register successfully', async () => {
      const mockUser = { id: 1, first_name: 'New', email: 'new@example.com' };
      api.get.mockRejectedValue(new Error('Not authenticated'));
      api.post.mockResolvedValue({ data: { user: mockUser } });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      act(() => {
        screen.getByText('Register').click();
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/register', {
          email: 'new@example.com',
          password: 'Test123!',
        });
        expect(toast.success).toHaveBeenCalledWith(
          'Welcome to Brotherhood! Your account has been created.'
        );
        expect(screen.getByTestId('user')).toHaveTextContent('New');
      });
    });

    it('should handle registration failure', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      api.post.mockRejectedValue({
        response: { data: { detail: 'Email already exists' } },
      });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('ready');
      });

      act(() => {
        screen.getByText('Register').click();
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email already exists');
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
      });
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });
      api.post.mockResolvedValue({});

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });

      act(() => {
        screen.getByText('Logout').click();
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/logout');
        expect(toast.success).toHaveBeenCalledWith('You have been logged out successfully');
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
      });
    });

    it('should logout without showing message when showMessage is false', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });
      api.post.mockResolvedValue({});

      const TestComponentWithLogoutParam = () => {
        const auth = useAuth();
        return (
          <div>
            <div data-testid="user">{auth.user ? auth.user.first_name : 'no user'}</div>
            <button onClick={() => auth.logout(false)}>Logout Silent</button>
          </div>
        );
      };

      renderWithAuth(<TestComponentWithLogoutParam />);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });

      act(() => {
        screen.getByText('Logout Silent').click();
      });

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/logout');
        expect(toast.success).not.toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
      });
    });

    it('should handle logout error gracefully', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });
      api.post.mockRejectedValue(new Error('Logout failed'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });

      act(() => {
        screen.getByText('Logout').click();
      });

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no user');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Update Profile', () => {
    it('should update profile successfully', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      const updatedUser = { id: 1, first_name: 'Updated', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });
      api.patch.mockResolvedValue({ data: updatedUser });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });

      act(() => {
        screen.getByText('Update').click();
      });

      await waitFor(() => {
        expect(api.patch).toHaveBeenCalledWith('/auth/profile', { first_name: 'Updated' });
        expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
        expect(screen.getByTestId('user')).toHaveTextContent('Updated');
      });
    });

    it('should handle profile update failure', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });
      api.patch.mockRejectedValue({
        response: { data: { detail: 'Update failed' } },
      });

      renderWithAuth(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });

      act(() => {
        screen.getByText('Update').click();
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Update failed');
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });
    });
  });

  describe('Check Auth', () => {
    it('should handle auth checks properly', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      renderWithAuth(<TestComponent />);

      // Wait for initial auth check
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('John');
      });

      // Auth is working correctly
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    });
  });
});
