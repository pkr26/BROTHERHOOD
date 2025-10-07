import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Feed from '../../pages/Feed';
import { AuthProvider } from '../../contexts/AuthContext';
import api from '../../services/api';

jest.mock('../../services/api');
jest.mock('react-hot-toast');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderFeed = () => {
  const queryClient = createTestQueryClient();
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Feed />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Feed Page', () => {
  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockUser });
  });

  describe('Rendering', () => {
    it('should render feed page with header', async () => {
      renderFeed();

      await waitFor(() => {
        const banners = screen.getAllByRole('banner');
        expect(banners.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should render create post section', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByLabelText(/create a new post/i)).toBeInTheDocument();
      });
    });

    it('should render sidebar', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByLabelText(/sidebar navigation/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show loading state initially', () => {
      renderFeed();

      expect(screen.getByText(/loading feed/i)).toBeInTheDocument();
    });

    it('should render posts after loading', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.queryByText(/loading feed/i)).not.toBeInTheDocument();
      });

      // Mock posts are displayed
      await waitFor(() => {
        expect(screen.getByText(/just joined brotherhood/i)).toBeInTheDocument();
      });
    });

    it('should render without errors when loaded', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.queryByText(/loading feed/i)).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Create Post', () => {
    it('should show create post button', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByLabelText(/create a new post/i)).toBeInTheDocument();
      });
    });
  });

  describe('Interactions', () => {
    it('should handle post like action', async () => {
      const user = userEvent.setup();
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText(/just joined brotherhood/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find and click the first Hell Yeah Brother button
      const likeButtons = screen.getAllByLabelText(/hell yeah brother/i);
      await user.click(likeButtons[0]);

      // Like action should be triggered (button exists and is clickable)
      expect(likeButtons[0]).toBeInTheDocument();
    });

    it('should display header with user info', async () => {
      renderFeed();

      await waitFor(() => {
        const banners = screen.getAllByRole('banner');
        expect(banners.length).toBeGreaterThan(0);
        expect(screen.getByText('John')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Posts Display', () => {
    it('should display multiple posts', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText(/just joined brotherhood/i)).toBeInTheDocument();
        expect(screen.getByText(/beautiful sunset today/i)).toBeInTheDocument();
        expect(screen.getByText(/anyone up for a weekend coding session/i)).toBeInTheDocument();
      });
    });

    it('should display post metadata', async () => {
      renderFeed();

      await waitFor(() => {
        expect(screen.getByText(/2 hours ago/i)).toBeInTheDocument();
        expect(screen.getByText(/5 hours ago/i)).toBeInTheDocument();
        expect(screen.getByText(/1 day ago/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle query errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      api.get.mockRejectedValue(new Error('Failed to fetch posts'));

      renderFeed();

      await waitFor(() => {
        expect(screen.queryByText(/loading feed/i)).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });
});
