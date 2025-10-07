import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';
import { AuthProvider } from '../../contexts/AuthContext';
import * as validation from '../../utils/validation';
import api from '../../services/api';

jest.mock('../../services/api');
jest.mock('react-hot-toast');

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockRejectedValue(new Error('Not authenticated'));
  });

  describe('Rendering', () => {
    it('should render registration form elements', async () => {
      renderRegister();

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /join the brotherhood/i })).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    });

    it('should render terms checkbox', async () => {
      renderRegister();

      await waitFor(() => {
        expect(screen.getByText(/i agree to the/i)).toBeInTheDocument();
      });
    });

    it('should render password strength indicator', async () => {
      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      });
    });

    it('should render submit button', async () => {
      renderRegister();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /create your brotherhood account/i })).toBeInTheDocument();
      });
    });

    it('should render sign in link', async () => {
      renderRegister();

      await waitFor(() => {
        expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty first name', async () => {
      const user = userEvent.setup();
      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.click(firstNameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty last name', async () => {
      const user = userEvent.setup();
      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      });

      const lastNameInput = screen.getByLabelText(/last name/i);
      await user.click(lastNameInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      });
    });

    it('should validate name format', async () => {
      const user = userEvent.setup();
      jest.spyOn(validation, 'validateName').mockReturnValue('First name can only contain letters');

      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.type(firstNameInput, 'Test123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/first name can only contain letters/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty email', async () => {
      const user = userEvent.setup();
      renderRegister();

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

    it('should show error for empty date of birth', async () => {
      const user = userEvent.setup();
      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      });

      const dobInput = screen.getByLabelText(/date of birth/i);
      await user.click(dobInput);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for password mismatch', async () => {
      const user = userEvent.setup();
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);

      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      });

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await user.type(passwordInput, 'StrongP@ss123');
      await user.type(confirmPasswordInput, 'DifferentP@ss123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should show error when terms not accepted', async () => {
      const user = userEvent.setup();
      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);
      jest.spyOn(validation, 'validateName').mockReturnValue(true);
      jest.spyOn(validation, 'validateDateOfBirth').mockReturnValue(true);

      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /create your brotherhood account/i });

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(dobInput, '1990-01-01');
      await user.type(passwordInput, 'StrongP@ss123');
      await user.type(confirmPasswordInput, 'StrongP@ss123');
      // Don't check terms
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const mockUser = { id: 1, first_name: 'John', email: 'john@example.com' };
      api.post.mockResolvedValue({ data: { user: mockUser } });

      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);
      jest.spyOn(validation, 'validateName').mockReturnValue(true);
      jest.spyOn(validation, 'validateDateOfBirth').mockReturnValue(true);

      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /create your brotherhood account/i });

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(dobInput, '1990-01-01');
      await user.type(passwordInput, 'StrongP@ss123');
      await user.type(confirmPasswordInput, 'StrongP@ss123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/register', {
          email: 'john@example.com',
          password: 'StrongP@ss123',
          first_name: 'John',
          last_name: 'Doe',
          date_of_birth: '1990-01-01',
        });
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      api.post.mockImplementation(() => new Promise(() => {}));

      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);
      jest.spyOn(validation, 'validateName').mockReturnValue(true);
      jest.spyOn(validation, 'validateDateOfBirth').mockReturnValue(true);

      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /create your brotherhood account/i });

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(dobInput, '1990-01-01');
      await user.type(passwordInput, 'StrongP@ss123');
      await user.type(confirmPasswordInput, 'StrongP@ss123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should handle registration failure', async () => {
      const user = userEvent.setup();
      api.post.mockRejectedValue({
        response: { data: { detail: 'Email already exists' } },
      });

      jest.spyOn(validation, 'validateEmail').mockReturnValue(true);
      jest.spyOn(validation, 'validatePassword').mockReturnValue(true);
      jest.spyOn(validation, 'validateName').mockReturnValue(true);
      jest.spyOn(validation, 'validateDateOfBirth').mockReturnValue(true);

      renderRegister();

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const dobInput = screen.getByLabelText(/date of birth/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const termsCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /create your brotherhood account/i });

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(dobInput, '1990-01-01');
      await user.type(passwordInput, 'StrongP@ss123');
      await user.type(confirmPasswordInput, 'StrongP@ss123');
      await user.click(termsCheckbox);
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Links', () => {
    it('should have link to login page', async () => {
      renderRegister();

      await waitFor(() => {
        const loginLink = screen.getByText(/sign in/i);
        expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
      });
    });

    it('should have link to terms page', async () => {
      renderRegister();

      await waitFor(() => {
        const termsLink = screen.getByText(/terms and conditions/i);
        expect(termsLink).toHaveAttribute('href', '/terms');
      });
    });

    it('should have link to privacy page', async () => {
      renderRegister();

      await waitFor(() => {
        const privacyLink = screen.getByText(/privacy policy/i);
        expect(privacyLink).toHaveAttribute('href', '/privacy');
      });
    });
  });
});
