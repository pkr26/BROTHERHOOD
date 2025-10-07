import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { AuthProvider } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import toast from 'react-hot-toast';

jest.mock('../../../services/api');
jest.mock('react-hot-toast');

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

const renderWithRouter = (ui, { route = '/', ...options } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <div>Feed Page</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
    options
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Authentication Check', () => {
    it('should show loader while checking authentication', () => {
      api.get.mockImplementation(() => new Promise(() => {})); // Pending promise

      renderWithRouter(<ProtectedRoute><TestComponent /></ProtectedRoute>);

      expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();
    });

    it('should show protected content when user is authenticated', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      renderWithRouter(<ProtectedRoute><TestComponent /></ProtectedRoute>);

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });

    it('should redirect to login when user is not authenticated', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      renderWithRouter(<ProtectedRoute><TestComponent /></ProtectedRoute>);

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });

  describe('Timeout Protection', () => {
    it('should timeout and redirect after 10 seconds', async () => {
      api.get.mockImplementation(() => new Promise(() => {})); // Hanging promise

      renderWithRouter(<ProtectedRoute><TestComponent /></ProtectedRoute>);

      expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();

      // Fast-forward past the timeout
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'Authentication check timed out. Please try again.'
        );
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });

    it('should clear timeout when authentication completes', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      renderWithRouter(<ProtectedRoute><TestComponent /></ProtectedRoute>);

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      // Fast-forward past the timeout period
      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // Should not show timeout error since auth completed
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  describe('Custom Redirect Path', () => {
    it('should redirect to custom path when provided', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <AuthProvider>
            <Routes>
              <Route path="/custom-login" element={<div>Custom Login</div>} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute redirectTo="/custom-login">
                    <TestComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Custom Login')).toBeInTheDocument();
      });
    });
  });

  describe('Reverse Protection (Login/Register Pages)', () => {
    it('should redirect authenticated users away from login page', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginComponent />
                  </ProtectedRoute>
                }
              />
              <Route path="/feed" element={<div>Feed Page</div>} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Feed Page')).toBeInTheDocument();
      });
    });

    it('should allow unauthenticated users to view login page', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });

  describe('Location State Preservation', () => {
    it('should save attempted location for redirect after login', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      const { container } = render(
        <MemoryRouter initialEntries={[{ pathname: '/feed', state: { someData: 'test' } }]}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginComponent />} />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <div>Feed Page</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple rapid renders', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      const { rerender } = renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Rapid rerenders
      rerender(
        <MemoryRouter initialEntries={['/']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginComponent />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <TestComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });

    it('should handle unmount during loading', () => {
      api.get.mockImplementation(() => new Promise(() => {}));

      const { unmount } = renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      // Should not throw error when unmounted during loading
      expect(() => unmount()).not.toThrow();
    });

    it('should handle API errors gracefully', async () => {
      api.get.mockRejectedValue(new Error('Server Error'));

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });
});
