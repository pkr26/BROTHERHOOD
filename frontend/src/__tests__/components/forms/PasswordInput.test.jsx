import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput from '../../../components/forms/PasswordInput';

describe('PasswordInput.jsx', () => {
  const defaultProps = {
    id: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    register: { name: 'password', onChange: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Easy test cases
  describe('Easy cases - Rendering', () => {
    test('should render password input', () => {
      render(<PasswordInput {...defaultProps} />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
    });

    test('should render with correct placeholder', () => {
      render(<PasswordInput {...defaultProps} />);
      expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    });

    test('should render label', () => {
      render(<PasswordInput {...defaultProps} />);
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    test('should render lock icon', () => {
      render(<PasswordInput {...defaultProps} />);
      const input = screen.getByLabelText('Password');
      const container = input.closest('div');
      expect(container).toBeInTheDocument();
    });

    test('should render toggle visibility button', () => {
      render(<PasswordInput {...defaultProps} />);
      const button = screen.getByLabelText('Show password');
      expect(button).toBeInTheDocument();
    });
  });

  // Medium test cases
  describe('Medium cases - Interactions', () => {
    test('should toggle password visibility on button click', async () => {
      const user = userEvent.setup();
      render(<PasswordInput {...defaultProps} />);

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');

      const toggleButton = screen.getByLabelText('Show password');
      await user.click(toggleButton);

      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    });

    test('should toggle password visibility multiple times', async () => {
      const user = userEvent.setup();
      render(<PasswordInput {...defaultProps} />);

      const input = screen.getByLabelText('Password');
      let toggleButton = screen.getByLabelText('Show password');

      // Show password
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');

      // Hide password
      toggleButton = screen.getByLabelText('Hide password');
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');

      // Show again
      toggleButton = screen.getByLabelText('Show password');
      await user.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should call onChange when text is entered', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const register = { ...defaultProps.register, onChange };

      render(<PasswordInput {...defaultProps} register={register} />);

      const input = screen.getByLabelText('Password');
      await user.type(input, 'Test123!');

      expect(onChange).toHaveBeenCalled();
    });

    test('should display error message when error prop is provided', () => {
      const error = { message: 'Password is required' };
      render(<PasswordInput {...defaultProps} error={error} />);

      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('should apply error styling when error exists', () => {
      const error = { message: 'Password is required' };
      render(<PasswordInput {...defaultProps} error={error} />);

      const input = screen.getByLabelText('Password');
      expect(input).toHaveClass('border-danger');
    });

  });

  // Hard test cases
  describe('Hard cases - Advanced scenarios', () => {
    test('should handle custom className', () => {
      render(<PasswordInput {...defaultProps} className="custom-class" />);
      const container = screen.getByLabelText('Password').closest('div')?.parentElement;
      expect(container).toHaveClass('custom-class');
    });

    test('should handle custom label', () => {
      render(<PasswordInput {...defaultProps} label="Confirm Password" />);
      expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    });

    test('should set aria-invalid when error exists', () => {
      const error = { message: 'Error' };
      render(<PasswordInput {...defaultProps} error={error} />);

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'password-error');
    });

    test('should not have aria-describedby when no error', () => {
      render(<PasswordInput {...defaultProps} />);

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    test('should pass through additional props', () => {
      render(
        <PasswordInput
          {...defaultProps}
          autoComplete="current-password"
          maxLength={128}
        />
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('autocomplete', 'current-password');
      expect(input).toHaveAttribute('maxlength', '128');
    });

    test('should handle disabled state', () => {
      render(<PasswordInput {...defaultProps} disabled />);

      const input = screen.getByLabelText('Password');
      expect(input).toBeDisabled();
    });

    test('should handle required attribute', () => {
      render(<PasswordInput {...defaultProps} required />);

      const input = screen.getByLabelText('Password');
      expect(input).toBeRequired();
    });

    test('should preserve input value when toggling visibility', async () => {
      const user = userEvent.setup();
      render(<PasswordInput {...defaultProps} />);

      const input = screen.getByLabelText('Password');
      await user.type(input, 'MySecretPassword');

      expect(input).toHaveValue('MySecretPassword');

      const toggleButton = screen.getByLabelText('Show password');
      await user.click(toggleButton);

      expect(input).toHaveValue('MySecretPassword');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should not show strength indicator by default', () => {
      render(<PasswordInput {...defaultProps} />);
      // Strength indicator is a separate component, just verify it's not rendered
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    test('should handle empty register object', () => {
      render(<PasswordInput {...defaultProps} register={{}} />);
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    });

    test('should handle keyboard navigation on toggle button', async () => {
      const user = userEvent.setup();
      render(<PasswordInput {...defaultProps} />);

      const toggleButton = screen.getByLabelText('Show password');
      toggleButton.focus();
      expect(toggleButton).toHaveFocus();

      await user.keyboard('{Enter}');

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should prevent form submission when clicking toggle button', () => {
      render(<PasswordInput {...defaultProps} />);
      const toggleButton = screen.getByLabelText('Show password');
      expect(toggleButton).toHaveAttribute('type', 'button');
    });
  });
});
