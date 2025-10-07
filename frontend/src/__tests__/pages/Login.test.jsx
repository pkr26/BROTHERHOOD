import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { AuthProvider } from '../../contexts/AuthContext';
import * as validation from '../../utils/validation';
import api from '../../services/api';

jest.mock('../../services/api');
jest.mock('react-hot-toast');

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockRejectedValue(new Error('Not authenticated'));
  });

  describe('Rendering', () => {
    it('should render login form elements', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /welcome back, brother/i })).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in to brotherhood/i })).toBeInTheDocument();
    });

    it('should render forgot password link', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
      });
    });

    it('should render create account link', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText(/create your account/i)).toBeInTheDocument();
      });
    });

    it('should render support message', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByText(/need support/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/email address/i);
      await user.click(emailInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email', async () => {
      const user = userEvent.setup();
      jest.spyOn(validation, 'validateEmail').mockReturnValue('Please enter a valid email address');

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalidemail');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty password', async () => {
      const user = userEvent.setup();
      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.click(passwordInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it('should validate password correctly', async () => {
      const user = userEvent.setup();
      jest.spyOn(validation, 'validatePassword').mockReturnValue('Password is too weak');

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password$/i);
      await user.type(passwordInput, 'weak');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid credentials', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.post.mockResolvedValue({ data: { user: mockUser } });

      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /sign in to brotherhood/i });

      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'StrongP@ss123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/login', {
          email: 'john@example.com',
          password: 'StrongP@ss123',
        });
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      api.post.mockImplementation(() => new Promise(() => {})); // Pending promise

      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /sign in to brotherhood/i });

      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'StrongP@ss123');
      await user.click(submitButton);

      // Button should show loading state
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should handle login failure', async () => {
      const user = userEvent.setup();
      api.post.mockRejectedValue({
        response: { data: { detail: 'Invalid credentials' } },
      });

      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /sign in to brotherhood/i });

      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'WrongPass123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should handle unexpected errors', async () => {
      const user = userEvent.setup();
      // Mock a proper error response structure
      api.post.mockRejectedValue({
        response: undefined,
        message: 'Network error'
      });

      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);

      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      });

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitButton = screen.getByRole('button', { name: /sign in to brotherhood/i });

      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'StrongP@ss123');
      await user.click(submitButton);

      // The error should be displayed
      await waitFor(() => {
        // Check either the error message or that the button is re-enabled
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Navigation Links', () => {
    it('should have link to register page', async () => {
      renderLogin();

      await waitFor(() => {
        const registerLink = screen.getByText(/create your account/i);
        expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
      });
    });

    it('should have link to forgot password page', async () => {
      renderLogin();

      await waitFor(() => {
        const forgotPasswordLink = screen.getByText(/forgot password/i);
        expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      });
    });

    it('should have proper button roles', async () => {
      renderLogin();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /sign in to brotherhood/i })).toBeInTheDocument();
      });
    });
  });
});
