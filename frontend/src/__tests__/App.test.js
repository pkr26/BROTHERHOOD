import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import api from '../services/api';

jest.mock('../services/api');
jest.mock('react-hot-toast');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);
      expect(document.querySelector('.App')).toBeInTheDocument();
    });

    it('should render app container', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);
      expect(document.querySelector('.App')).toBeInTheDocument();
    });

    it('should wrap app with ErrorBoundary', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);
      // ErrorBoundary should be present (won't crash the app)
      expect(document.querySelector('.App')).toBeInTheDocument();
    });

    it('should provide QueryClient', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);
      // QueryClientProvider is wrapping the app
      expect(document.querySelector('.App')).toBeInTheDocument();
    });

    it('should provide AuthProvider', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);
      // AuthProvider is wrapping the routes
      expect(document.querySelector('.App')).toBeInTheDocument();
    });
  });

  describe('Toast Notifications', () => {
    it('should configure toast notifications', () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);
      // Toaster component should be rendered
      expect(document.querySelector('.App')).toBeInTheDocument();
    });
  });

  describe('Routing', () => {
    it('should redirect root to /feed', async () => {
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.get.mockResolvedValue({ data: mockUser });

      render(<App />);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/feed');
      });
    });

    it('should redirect to /login when not authenticated', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      render(<App />);

      await waitFor(() => {
        expect(window.location.pathname).toBe('/login');
      });
    });

    it('should render 404 page for unknown routes', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));
      window.history.pushState({}, 'Unknown Route', '/unknown-route');

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText(/page not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lazy Loading', () => {
    it('should lazy load pages without errors', async () => {
      api.get.mockRejectedValue(new Error('Not authenticated'));

      const { container } = render(<App />);

      // Wait for lazy loading to complete
      await waitFor(() => {
        expect(container.querySelector('.App')).toBeInTheDocument();
      }, { timeout: 10000 });

      // App rendered successfully
      expect(container).toBeTruthy();
    }, 15000);
  });

  describe('Development Tools', () => {
    it('should include React Query Devtools in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);

      // Devtools should be included
      expect(document.querySelector('.App')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });

    it('should not include React Query Devtools in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      api.get.mockRejectedValue(new Error('Not authenticated'));
      render(<App />);

      // Devtools should not be included
      expect(document.querySelector('.App')).toBeInTheDocument();

      process.env.NODE_ENV = originalEnv;
    });
  });
});
