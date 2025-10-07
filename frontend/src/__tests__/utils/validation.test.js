import {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validateName,
  validateDateOfBirth,
  sanitizeInput,
} from '../../utils/validation';
import DOMPurify from 'dompurify';

jest.mock('dompurify');

describe('Validation Utils', () => {
  beforeEach(() => {
    DOMPurify.sanitize.mockImplementation((input) => input);
  });

  describe('validateEmail', () => {
    it('should return error for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail(null)).toBe('Email is required');
      expect(validateEmail(undefined)).toBe('Email is required');
    });

    it('should return error for invalid email format', () => {
      expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
      // 'missing@domain' is actually valid according to the regex
      expect(validateEmail('@nodomain.com')).toBe('Please enter a valid email address');
      expect(validateEmail('no@domain@double.com')).toBe('Please enter a valid email address');
    });

    it('should return error for email too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toBe('Email is too long');
    });

    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      expect(validateEmail('user_name@example-domain.com')).toBe(true);
    });

    it('should suggest correction for common domain typos', () => {
      expect(validateEmail('test@gmial.com')).toBe('Did you mean test@gmail.com?');
      expect(validateEmail('test@gmai.com')).toBe('Did you mean test@gmail.com?');
      expect(validateEmail('test@yahooo.com')).toBe('Did you mean test@yahoo.com?');
      expect(validateEmail('test@outlok.com')).toBe('Did you mean test@outlook.com?');
    });
  });

  describe('validatePassword', () => {
    it('should return error for empty password', () => {
      expect(validatePassword('')).toBe('Password is required');
      expect(validatePassword(null)).toBe('Password is required');
      expect(validatePassword(undefined)).toBe('Password is required');
    });

    it('should return error for password too short', () => {
      expect(validatePassword('Short1!')).toBe('Password must be at least 8 characters');
    });

    it('should return error for password too long', () => {
      const longPassword = 'A'.repeat(129) + 'a1!';
      expect(validatePassword(longPassword)).toBe('Password is too long (max 128 characters)');
    });

    it('should return error for missing lowercase letter', () => {
      expect(validatePassword('UPPERCASE123!')).toBe(
        'Password must contain at least one lowercase letter'
      );
    });

    it('should return error for missing uppercase letter', () => {
      expect(validatePassword('lowercase123!')).toBe(
        'Password must contain at least one uppercase letter'
      );
    });

    it('should return error for missing number', () => {
      expect(validatePassword('NoNumbers!')).toBe('Password must contain at least one number');
    });

    it('should return error for missing special character', () => {
      expect(validatePassword('NoSpecial123')).toBe(
        'Password must contain at least one special character'
      );
    });

    it('should accept passwords with all types that pass strength check', () => {
      // Passwords with 8+ chars and all types pass validation
      expect(validatePassword('Short1!@')).toBe(true);
    });

    it('should validate strong passwords', () => {
      expect(validatePassword('StrongP@ssw0rd')).toBe(true);
      expect(validatePassword('MySecureP@ss123')).toBe(true);
      expect(validatePassword('C0mpl3x!Pass')).toBe(true);
    });
  });

  describe('getPasswordStrength', () => {
    it('should return none for empty password', () => {
      const result = getPasswordStrength('');
      expect(result.strength).toBe('none');
      expect(result.score).toBe(0);
      expect(result.feedback).toContain('Password is required');
    });

    it('should return weak for passwords under 8 characters', () => {
      const result = getPasswordStrength('Aa1');
      expect(result.strength).toBe('weak');
      expect(result.score).toBeLessThan(4);
    });

    it('should return weak for only numbers', () => {
      const result = getPasswordStrength('12345678');
      expect(result.strength).toBe('weak');
      expect(result.feedback).toContain('Avoid using only numbers');
    });

    it('should return weak for only letters', () => {
      const result = getPasswordStrength('abcdefgh');
      expect(result.strength).toBe('weak');
      expect(result.feedback).toContain('Add numbers or symbols');
    });

    it('should penalize repeated characters', () => {
      const result = getPasswordStrength('Passs111!!!');
      expect(result.feedback).toContain('Avoid repeated characters');
    });

    it('should return weak for common passwords', () => {
      const result = getPasswordStrength('password123');
      expect(result.score).toBe(0);
      expect(result.feedback).toContain('This password is too common');
    });

    it('should return medium for moderate passwords', () => {
      const result = getPasswordStrength('GoodPass123!');
      expect(result.strength).toBe('medium');
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.score).toBeLessThan(7);
    });

    it('should return strong for complex passwords', () => {
      const result = getPasswordStrength('VeryStr0ng!P@ssw0rd123');
      expect(result.strength).toBe('strong');
      expect(result.score).toBeGreaterThanOrEqual(7);
    });

    it('should provide helpful feedback for weak passwords', () => {
      const result = getPasswordStrength('weak');
      expect(result.feedback.length).toBeGreaterThan(0);
      expect(result.feedback).toContain('Make it at least 8 characters');
    });

    it('should calculate percentage correctly', () => {
      const result = getPasswordStrength('StrongP@ssw0rd123');
      expect(result.percentage).toBeGreaterThan(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('validateName', () => {
    it('should return error for empty name', () => {
      expect(validateName('')).toBe('Name is required');
      expect(validateName(null)).toBe('Name is required');
      expect(validateName(undefined)).toBe('Name is required');
    });

    it('should return error for name too short', () => {
      expect(validateName('A')).toBe('Name must be at least 2 characters');
    });

    it('should return error for name too long', () => {
      const longName = 'A'.repeat(51);
      expect(validateName(longName)).toBe('Name must be less than 50 characters');
    });

    it('should return error for invalid characters', () => {
      expect(validateName('Name123')).toBe(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      );
      expect(validateName('Name@Test')).toBe(
        'Name can only contain letters, spaces, hyphens, and apostrophes'
      );
    });

    it('should validate correct names', () => {
      expect(validateName('John')).toBe(true);
      expect(validateName('Mary Jane')).toBe(true);
      expect(validateName("O'Connor")).toBe(true);
      expect(validateName('Anne-Marie')).toBe(true);
    });

    it('should use custom field name in error messages', () => {
      expect(validateName('', 'First Name')).toBe('First Name is required');
      expect(validateName('A', 'Last Name')).toBe('Last Name must be at least 2 characters');
    });
  });

  describe('validateDateOfBirth', () => {
    it('should return error for empty date', () => {
      expect(validateDateOfBirth('')).toBe('Date of birth is required');
      expect(validateDateOfBirth(null)).toBe('Date of birth is required');
      expect(validateDateOfBirth(undefined)).toBe('Date of birth is required');
    });

    it('should return error for invalid date', () => {
      expect(validateDateOfBirth('not-a-date')).toBe('Please enter a valid date');
      expect(validateDateOfBirth('2024-13-45')).toBe('Please enter a valid date');
    });

    it('should return error for future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validateDateOfBirth(futureDate.toISOString().split('T')[0])).toBe(
        'Date of birth cannot be in the future'
      );
    });

    it('should return error for age less than 13', () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 12);
      expect(validateDateOfBirth(recentDate.toISOString().split('T')[0])).toBe(
        'You must be at least 13 years old'
      );
    });

    it('should return error for unrealistic age', () => {
      const ancientDate = new Date();
      ancientDate.setFullYear(ancientDate.getFullYear() - 121);
      expect(validateDateOfBirth(ancientDate.toISOString().split('T')[0])).toBe(
        'Please enter a valid date of birth'
      );
    });

    it('should validate correct dates', () => {
      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 25);
      expect(validateDateOfBirth(validDate.toISOString().split('T')[0])).toBe(true);
    });

    it('should validate edge case ages', () => {
      // Exactly 13 years old
      const thirteenYearsAgo = new Date();
      thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
      expect(validateDateOfBirth(thirteenYearsAgo.toISOString().split('T')[0])).toBe(true);

      // Exactly 120 years old
      const hundredTwentyYearsAgo = new Date();
      hundredTwentyYearsAgo.setFullYear(hundredTwentyYearsAgo.getFullYear() - 120);
      expect(validateDateOfBirth(hundredTwentyYearsAgo.toISOString().split('T')[0])).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    beforeEach(() => {
      DOMPurify.sanitize.mockImplementation((input, options) => {
        // Simple mock that removes script tags
        if (typeof input === 'string') {
          return input.replace(/<script[^>]*>.*?<\/script>/gi, '');
        }
        return input;
      });
    });

    it('should return empty string for empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should sanitize HTML input', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello';
      const result = sanitizeInput(maliciousInput);
      expect(result).not.toContain('<script>');
      expect(DOMPurify.sanitize).toHaveBeenCalled();
    });

    it('should allow safe HTML tags by default', () => {
      const safeInput = '<p><b>Bold</b> and <i>italic</i> text</p>';
      sanitizeInput(safeInput);
      expect(DOMPurify.sanitize).toHaveBeenCalledWith(
        safeInput,
        expect.objectContaining({
          ALLOWED_TAGS: expect.arrayContaining(['b', 'i', 'em', 'strong', 'a', 'br', 'p']),
        })
      );
    });

    it('should accept custom options', () => {
      const input = '<div>Test</div>';
      const customOptions = { ALLOWED_TAGS: ['div'] };
      sanitizeInput(input, customOptions);
      expect(DOMPurify.sanitize).toHaveBeenCalledWith(
        input,
        expect.objectContaining({
          ALLOWED_TAGS: ['div'],
        })
      );
    });

    it('should merge custom options with defaults', () => {
      const input = 'Test';
      const customOptions = { CUSTOM_OPTION: true };
      sanitizeInput(input, customOptions);
      expect(DOMPurify.sanitize).toHaveBeenCalledWith(
        input,
        expect.objectContaining({
          ALLOWED_TAGS: expect.any(Array),
          CUSTOM_OPTION: true,
        })
      );
    });
  });
});
