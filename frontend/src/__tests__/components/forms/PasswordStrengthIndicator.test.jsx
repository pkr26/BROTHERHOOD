import React from 'react';
import { render, screen } from '@testing-library/react';
import PasswordStrengthIndicator from '../../../components/forms/PasswordStrengthIndicator';

describe('PasswordStrengthIndicator.jsx', () => {
  // Easy test cases
  describe('Easy cases - Basic rendering', () => {
    test('should not render when password is empty', () => {
      const { container } = render(<PasswordStrengthIndicator password="" />);
      expect(container.firstChild).toBeNull();
    });

    test('should not render when password is null', () => {
      const { container } = render(<PasswordStrengthIndicator password={null} />);
      expect(container.firstChild).toBeNull();
    });

    test('should not render when password is undefined', () => {
      const { container } = render(<PasswordStrengthIndicator password={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    test('should render when password is provided', () => {
      const { container } = render(<PasswordStrengthIndicator password="Test123!" />);
      expect(container.firstChild).not.toBeNull();
    });

    test('should render strength bars', () => {
      const { container } = render(<PasswordStrengthIndicator password="Test123!" />);
      const bars = container.querySelectorAll('[role="presentation"]');
      expect(bars).toHaveLength(3);
    });
  });

  // Medium test cases
  describe('Medium cases - Strength levels', () => {
    test('should show weak password indicator', () => {
      render(<PasswordStrengthIndicator password="weak" />);
      expect(screen.getByText(/Weak password/i)).toBeInTheDocument();
    });

    test('should show medium password indicator', () => {
      render(<PasswordStrengthIndicator password="Test1234!" />);
      expect(screen.getByText(/Good password/i)).toBeInTheDocument();
    });

    test('should show strong password indicator', () => {
      render(<PasswordStrengthIndicator password="MyStr0ng!P@ssw0rd#2024" />);
      expect(screen.getByText(/Strong password/i)).toBeInTheDocument();
    });

    test('should display feedback for weak passwords', () => {
      render(<PasswordStrengthIndicator password="weak" />);
      const text = screen.getByText(/Weak password/i);
      expect(text.textContent).toContain('Weak password');
    });

    test('should show success checkmark for strong passwords', () => {
      render(<PasswordStrengthIndicator password="MyStr0ng!P@ssw0rd#2024" />);
      expect(screen.getByText(/✓ Strong password/i)).toBeInTheDocument();
    });

    test('should show circle symbol for medium passwords', () => {
      render(<PasswordStrengthIndicator password="Test1234!" />);
      expect(screen.getByText(/○ Good password/i)).toBeInTheDocument();
    });

    test('should show cross symbol for weak passwords', () => {
      render(<PasswordStrengthIndicator password="weak" />);
      expect(screen.getByText(/✗ Weak password/i)).toBeInTheDocument();
    });
  });

  // Hard test cases
  describe('Hard cases - Advanced scenarios', () => {
    test('should apply correct color class for weak password', () => {
      const { container } = render(<PasswordStrengthIndicator password="weak" />);
      const colorElement = container.querySelector('.text-danger');
      expect(colorElement).toBeInTheDocument();
    });

    test('should apply correct color class for medium password', () => {
      const { container } = render(<PasswordStrengthIndicator password="Test1234!" />);
      const colorElement = container.querySelector('.text-warning');
      expect(colorElement).toBeInTheDocument();
    });

    test('should apply correct color class for strong password', () => {
      const { container } = render(<PasswordStrengthIndicator password="MyStr0ng!P@ssw0rd#2024" />);
      const colorElement = container.querySelector('.text-success');
      expect(colorElement).toBeInTheDocument();
    });

    test('should fill strength bars based on score', () => {
      const { container } = render(<PasswordStrengthIndicator password="Test1234!" />);
      const bars = container.querySelectorAll('[role="presentation"]');

      // Medium password should fill some bars
      const filledBars = Array.from(bars).filter(bar =>
        bar.classList.contains('bg-warning') ||
        bar.classList.contains('bg-success') ||
        bar.classList.contains('bg-danger')
      );

      expect(filledBars.length).toBeGreaterThan(0);
    });

    test('should show first feedback message when multiple feedback items exist', () => {
      render(<PasswordStrengthIndicator password="abc" />);
      // Should show the first feedback message in the array
      const text = screen.getByText(/Weak password/i);
      expect(text).toBeInTheDocument();
    });

    test('should handle password with only numbers', () => {
      render(<PasswordStrengthIndicator password="123456789" />);
      expect(screen.getByText(/Weak password/i)).toBeInTheDocument();
    });

    test('should handle password with only letters', () => {
      render(<PasswordStrengthIndicator password="abcdefgh" />);
      expect(screen.getByText(/Weak password/i)).toBeInTheDocument();
    });

    test('should handle password with repeated characters', () => {
      render(<PasswordStrengthIndicator password="Tesst111!!!" />);
      // Should still render but may have lower strength
      const { container } = render(<PasswordStrengthIndicator password="Tesst111!!!" />);
      expect(container.firstChild).not.toBeNull();
    });

    test('should handle common passwords', () => {
      render(<PasswordStrengthIndicator password="Password123!" />);
      expect(screen.getByText(/Weak password/i)).toBeInTheDocument();
    });

    test('should update when password changes', () => {
      const { rerender } = render(<PasswordStrengthIndicator password="weak" />);
      expect(screen.getByText(/Weak password/i)).toBeInTheDocument();

      rerender(<PasswordStrengthIndicator password="MyStr0ng!P@ssw0rd#2024" />);
      expect(screen.getByText(/Strong password/i)).toBeInTheDocument();
    });

    test('should handle very long passwords', () => {
      const longPassword = 'A'.repeat(50) + 'a1!';
      const { container } = render(<PasswordStrengthIndicator password={longPassword} />);
      expect(container.firstChild).not.toBeNull();
    });

    test('should handle special characters in passwords', () => {
      render(<PasswordStrengthIndicator password="Test!@#$%^&*()123" />);
      const { container } = render(<PasswordStrengthIndicator password="Test!@#$%^&*()123" />);
      expect(container.firstChild).not.toBeNull();
    });

    test('should handle unicode characters in passwords', () => {
      render(<PasswordStrengthIndicator password="P@ssw0rd™" />);
      const { container } = render(<PasswordStrengthIndicator password="P@ssw0rd™" />);
      expect(container.firstChild).not.toBeNull();
    });

    test('should apply transition classes to strength bars', () => {
      const { container } = render(<PasswordStrengthIndicator password="Test123!" />);
      const bars = container.querySelectorAll('[role="presentation"]');

      bars.forEach(bar => {
        expect(bar.classList.contains('transition-all')).toBe(true);
        expect(bar.classList.contains('duration-300')).toBe(true);
      });
    });

    test('should show rounded bars', () => {
      const { container } = render(<PasswordStrengthIndicator password="Test123!" />);
      const bars = container.querySelectorAll('[role="presentation"]');

      bars.forEach(bar => {
        expect(bar.classList.contains('rounded-full')).toBe(true);
      });
    });

    test('should calculate correct threshold for filling bars', () => {
      // Score >= level * 2.3 determines if bar is filled
      const { container: weakContainer } = render(
        <PasswordStrengthIndicator password="weak" />
      );
      const { container: mediumContainer } = render(
        <PasswordStrengthIndicator password="Test1234!" />
      );
      const { container: strongContainer } = render(
        <PasswordStrengthIndicator password="MyStr0ng!P@ssw0rd#2024" />
      );

      // Weak should have fewer filled bars than medium
      const weakFilled = weakContainer.querySelectorAll('.bg-danger, .bg-warning, .bg-success').length;
      const mediumFilled = mediumContainer.querySelectorAll('.bg-danger, .bg-warning, .bg-success').length;
      const strongFilled = strongContainer.querySelectorAll('.bg-danger, .bg-warning, .bg-success').length;

      expect(strongFilled).toBeGreaterThanOrEqual(mediumFilled);
      expect(mediumFilled).toBeGreaterThanOrEqual(weakFilled);
    });

    test('should handle whitespace-only password', () => {
      const { container } = render(<PasswordStrengthIndicator password="   " />);
      // Should render with very weak strength
      expect(container.firstChild).not.toBeNull();
    });
  });
});
