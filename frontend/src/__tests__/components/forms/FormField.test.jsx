import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MdEmail } from 'react-icons/md';
import FormField from '../../../components/forms/FormField';

describe('FormField.jsx', () => {
  const defaultProps = {
    id: 'email',
    label: 'Email',
    type: 'text',
    placeholder: 'Enter email',
    register: { name: 'email' },
  };

  // Easy test cases
  describe('Easy cases - Rendering', () => {
    test('should render input field', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    test('should render with correct type', () => {
      render(<FormField {...defaultProps} type="email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('should render with placeholder', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    });

    test('should render label', () => {
      render(<FormField {...defaultProps} />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    test('should default to text type when type not specified', () => {
      const { type, ...propsWithoutType } = defaultProps;
      render(<FormField {...propsWithoutType} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'text');
    });
  });

  // Medium test cases
  describe('Medium cases - Props and styling', () => {
    test('should render with icon when provided', () => {
      render(<FormField {...defaultProps} icon={MdEmail} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('pl-10');
    });

    test('should not add icon padding when icon not provided', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Email');
      expect(input).not.toHaveClass('pl-10');
    });

    test('should display error message when error exists', () => {
      const error = { message: 'Email is required' };
      render(<FormField {...defaultProps} error={error} />);
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('should apply error styling when error exists', () => {
      const error = { message: 'Error' };
      render(<FormField {...defaultProps} error={error} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-danger');
    });

    test('should show required asterisk when required is true', () => {
      render(<FormField {...defaultProps} required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-danger');
    });

    test('should not show required asterisk when required is false', () => {
      render(<FormField {...defaultProps} required={false} />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    test('should handle custom className', () => {
      render(<FormField {...defaultProps} className="custom-class" />);
      const container = screen.getByLabelText('Email').closest('div')?.parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  // Hard test cases
  describe('Hard cases - Advanced functionality', () => {
    test('should set aria-invalid when error exists', () => {
      const error = { message: 'Error' };
      render(<FormField {...defaultProps} error={error} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    test('should not have aria-describedby when no error', () => {
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'false');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    test('should accept user input', async () => {
      const user = userEvent.setup();
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Email');

      await user.type(input, 'test@example.com');
      expect(input).toHaveValue('test@example.com');
    });

    test('should pass through register props', () => {
      const register = {
        name: 'email',
        ref: jest.fn(),
        onChange: jest.fn(),
        onBlur: jest.fn(),
      };
      render(<FormField {...defaultProps} register={register} />);
      const input = screen.getByLabelText('Email');
      expect(input.name).toBe('email');
    });

    test('should handle additional HTML attributes', () => {
      render(
        <FormField
          {...defaultProps}
          autoComplete="email"
          maxLength={100}
          disabled
          readOnly
        />
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('autocomplete', 'email');
      expect(input).toHaveAttribute('maxlength', '100');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('readonly');
    });

    test('should render without label when label prop is not provided', () => {
      const { label, ...propsWithoutLabel } = defaultProps;
      render(<FormField {...propsWithoutLabel} />);
      expect(screen.queryByText('Email')).not.toBeInTheDocument();
      const input = screen.getByPlaceholderText('Enter email');
      expect(input).toBeInTheDocument();
    });

    test('should handle different input types', () => {
      const types = ['text', 'email', 'number', 'tel', 'url', 'date'];

      types.forEach(type => {
        const { container } = render(
          <FormField {...defaultProps} type={type} />
        );
        const input = container.querySelector('input');
        expect(input).toHaveAttribute('type', type);
      });
    });

    test('should handle empty register object', () => {
      render(<FormField {...defaultProps} register={{}} />);
      const input = screen.getByLabelText('Email');
      expect(input).toBeInTheDocument();
    });

    test('should combine form-input class with conditional classes', () => {
      const error = { message: 'Error' };
      render(<FormField {...defaultProps} icon={MdEmail} error={error} />);
      const input = screen.getByLabelText('Email');

      expect(input).toHaveClass('form-input');
      expect(input).toHaveClass('pl-10');
      expect(input).toHaveClass('border-danger');
    });

    test('should associate label with input using htmlFor', () => {
      render(<FormField {...defaultProps} />);
      const label = screen.getByText('Email');
      const input = screen.getByLabelText('Email');

      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
    });

    test('should handle special characters in input', async () => {
      const user = userEvent.setup();
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Email');

      const specialInput = 'test+tag@example.com';
      await user.type(input, specialInput);
      expect(input).toHaveValue(specialInput);
    });

    test('should support pattern attribute', () => {
      render(<FormField {...defaultProps} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('pattern');
    });

    test('should handle minLength and maxLength', () => {
      render(<FormField {...defaultProps} minLength={5} maxLength={50} />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('minlength', '5');
      expect(input).toHaveAttribute('maxlength', '50');
    });

    test('should handle step attribute for number inputs', () => {
      render(<FormField {...defaultProps} type="number" step="0.01" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('step', '0.01');
    });

    test('should clear input value', async () => {
      const user = userEvent.setup();
      render(<FormField {...defaultProps} />);
      const input = screen.getByLabelText('Email');

      await user.type(input, 'test@example.com');
      expect(input).toHaveValue('test@example.com');

      await user.clear(input);
      expect(input).toHaveValue('');
    });
  });
});
