import DOMPurify from 'dompurify';
import logger from './logger';

/**
 * Email validation with improved regex
 * RFC 5322 compliant (simplified version)
 */
export const validateEmail = (email) => {
  // More robust email validation regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!email) return 'Email is required';
  if (email.length > 254) return 'Email is too long';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';

  // Check for common typos
  const commonDomainTypos = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'outlok.com': 'outlook.com',
  };

  const domain = email.split('@')[1];
  if (commonDomainTypos[domain]) {
    logger.debug('Email typo detected', {
      incorrectDomain: domain,
      suggestedDomain: commonDomainTypos[domain]
    });
    return `Did you mean ${email.replace(domain, commonDomainTypos[domain])}?`;
  }

  // Log suspicious email patterns
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    logger.warn('Suspicious email pattern detected', { email });
  }

  return true;
};

/**
 * Password validation with improved requirements
 */
export const validatePassword = (password) => {
  if (!password) return 'Password is required';

  // Minimum length check
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password is too long (max 128 characters)';

  // Character type requirements
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';

  // Check strength score
  const strength = getPasswordStrength(password);
  if (strength.score < 3) {
    logger.debug('Weak password attempt', {
      score: strength.score,
      strength: strength.strength
    });
    return 'Password is too weak. Please make it stronger.';
  }

  return true;
};

/**
 * Password strength calculator
 */
export const getPasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (!password) {
    return { score: 0, strength: 'none', feedback: ['Password is required'] };
  }

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Character variety checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Common patterns to avoid
  if (/^[0-9]+$/.test(password)) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid using only numbers');
  }

  if (/^[a-zA-Z]+$/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Add numbers or symbols');
  }

  // Repeated characters
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push('Avoid repeated characters');
  }

  // Common passwords check (simplified)
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score = 0;
    feedback.push('This password is too common');
  }

  // Determine strength level
  let strength = 'weak';
  if (score >= 7) strength = 'strong';
  else if (score >= 4) strength = 'medium';

  // Provide feedback
  if (strength === 'weak') {
    if (password.length < 8) feedback.push('Make it at least 8 characters');
    if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters');
    if (!/[0-9]/.test(password)) feedback.push('Add numbers');
    if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Add special characters');
  }

  return {
    score,
    strength,
    feedback,
    percentage: Math.min(100, (score / 7) * 100)
  };
};


/**
 * Name validation
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters`;
  if (name.length > 50) return `${fieldName} must be less than 50 characters`;
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return true;
};

/**
 * Date of birth validation
 */
export const validateDateOfBirth = (date) => {
  if (!date) return 'Date of birth is required';

  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  if (isNaN(birthDate.getTime())) return 'Please enter a valid date';
  if (birthDate > today) return 'Date of birth cannot be in the future';
  if (age < 13) return 'You must be at least 13 years old';
  if (age > 120) return 'Please enter a valid date of birth';

  return true;
};



/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input, options = {}) => {
  if (!input) return '';

  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
    ...options
  };

  const sanitized = DOMPurify.sanitize(input, defaultOptions);

  // Log potential XSS attempts
  if (sanitized !== input) {
    const removed = input.length - sanitized.length;
    if (removed > 10) { // Only log significant sanitization
      logger.warn('Potentially malicious input sanitized', {
        originalLength: input.length,
        sanitizedLength: sanitized.length,
        removedChars: removed,
        containsScript: input.toLowerCase().includes('<script'),
        containsIframe: input.toLowerCase().includes('<iframe'),
        containsOnEvent: /on\w+\s*=/i.test(input)
      });
    }
  }

  return sanitized;
};