import DOMPurify from 'dompurify';

/**
 * Email validation with improved regex
 * RFC 5322 compliant (simplified version)
 */
export const validateEmail = (email) => {
  // More robust email validation regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
    return `Did you mean ${email.replace(domain, commonDomainTypos[domain])}?`;
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
  if (strength.score < 3) return 'Password is too weak. Please make it stronger.';

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
 * Username validation
 */
export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 20) return 'Username must be less than 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return true;
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
 * Phone number validation
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional

  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10) return 'Phone number must be at least 10 digits';
  if (cleaned.length > 15) return 'Phone number is too long';

  return true;
};

/**
 * URL validation
 */
export const validateUrl = (url) => {
  if (!url) return true; // URL is optional

  try {
    new URL(url);
    return true;
  } catch {
    return 'Please enter a valid URL';
  }
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

  return DOMPurify.sanitize(input, defaultOptions);
};

// Initialize DOMPurify hooks once to prevent memory leaks
let hooksInitialized = false;

const initializeDOMPurifyHooks = () => {
  if (hooksInitialized) return;

  // Add rel="noopener noreferrer" to all links
  DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  hooksInitialized = true;
};

/**
 * Sanitize HTML content
 */
export const sanitizeHtml = (html, options = {}) => {
  if (!html) return '';

  // Initialize hooks once
  initializeDOMPurifyHooks();

  const defaultOptions = {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'br', 'p',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel'],
    ...options
  };

  return DOMPurify.sanitize(html, defaultOptions);
};

/**
 * File validation
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;

  if (!file) return 'File is required';

  // Check file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / 1024 / 1024).toFixed(0);
    return `File size must be less than ${sizeMB}MB`;
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return `File extension must be one of: ${allowedExtensions.join(', ')}`;
  }

  return true;
};

/**
 * Profanity filter (basic implementation)
 */
export const containsProfanity = (text) => {
  // This is a very basic implementation
  // In production, use a proper profanity detection library
  const profanityList = [
    // Add actual profanity words here
    // For demo purposes, using placeholder
    'badword1', 'badword2'
  ];

  const lowercaseText = text.toLowerCase();
  return profanityList.some(word => lowercaseText.includes(word));
};

/**
 * Credit card validation (basic)
 */
export const validateCreditCard = (number) => {
  if (!number) return 'Card number is required';

  // Remove spaces and dashes
  const cleaned = number.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(cleaned)) return 'Card number must contain only digits';
  if (cleaned.length < 13 || cleaned.length > 19) return 'Invalid card number length';

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) return 'Invalid card number';

  return true;
};

const validationUtils = {
  validateEmail,
  validatePassword,
  getPasswordStrength,
  validateUsername,
  validateName,
  validateDateOfBirth,
  validatePhone,
  validateUrl,
  sanitizeInput,
  sanitizeHtml,
  validateFile,
  containsProfanity,
  validateCreditCard,
};

export default validationUtils;