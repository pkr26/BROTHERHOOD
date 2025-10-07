import logger from '../../utils/logger';

describe('Logger Utility', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('Data Sanitization', () => {
    it('should sanitize sensitive fields', () => {
      const data = {
        username: 'john',
        password: 'secret123',
        token: 'abc123',
        apiKey: 'key123',
      };

      const sanitized = logger.sanitize(data);

      expect(sanitized.username).toBe('john');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.apiKey).toBe('[REDACTED]');
    });

    it('should handle null and undefined', () => {
      expect(logger.sanitize(null)).toBeNull();
      expect(logger.sanitize(undefined)).toBeUndefined();
    });

    it('should sanitize nested objects', () => {
      const data = {
        user: {
          name: 'John',
          credentials: {
            password: 'secret',
            token: 'abc123',
          },
        },
      };

      const sanitized = logger.sanitize(data);

      expect(sanitized.user.name).toBe('John');
      expect(sanitized.user.credentials.password).toBe('[REDACTED]');
      expect(sanitized.user.credentials.token).toBe('[REDACTED]');
    });
  });

  describe('Message Formatting', () => {
    it('should format message with timestamp and level', () => {
      const formatted = logger.formatMessage('error', 'Test error', { userId: 123 });

      expect(formatted).toHaveProperty('timestamp');
      expect(formatted.level).toBe('ERROR');
      expect(formatted.message).toBe('Test error');
      expect(formatted.userId).toBe(123);
    });

    it('should sanitize context in formatted messages', () => {
      const formatted = logger.formatMessage('error', 'Auth failed', {
        email: 'user@example.com',
        password: 'secret123',
      });

      expect(formatted.email).toBe('user@example.com');
      expect(formatted.password).toBe('[REDACTED]');
    });
  });

  describe('Log Levels in Development', () => {
    it('should return formatted message for error logs', () => {
      const result = logger.error('Test error', { userId: 123 });

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('ERROR');
      expect(result.message).toBe('Test error');
      expect(result.userId).toBe(123);
    });

    it('should return formatted message for warning logs', () => {
      const result = logger.warn('Test warning', { code: 'WARN001' });

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('WARN');
      expect(result.message).toBe('Test warning');
      expect(result.code).toBe('WARN001');
    });

    it('should return formatted message for info logs', () => {
      const result = logger.info('Test info', { event: 'login' });

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('INFO');
      expect(result.message).toBe('Test info');
      expect(result.event).toBe('login');
    });

    it('should return formatted message for debug logs', () => {
      const result = logger.debug('Test debug', { step: 1 });

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('DEBUG');
      expect(result.message).toBe('Test debug');
      expect(result.step).toBe(1);
    });
  });

  describe('Log Levels in Production', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should log errors in production', () => {
      // In production, errors go to error tracking service
      // We just verify it doesn't throw
      expect(() => {
        logger.error('Production error', { userId: 123 });
      }).not.toThrow();
    });

    it('should log warnings in production', () => {
      // Warnings should still be logged
      expect(() => {
        logger.warn('Production warning');
      }).not.toThrow();
    });

    it('should suppress info in production', () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();

      logger.info('Production info');

      // Info should not be logged in production
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should suppress debug in production', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logger.debug('Production debug');

      // Debug should not be logged in production
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Log Levels in Test', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should suppress all logs in test environment', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const infoSpy = jest.spyOn(console, 'info').mockImplementation();
      const logSpy = jest.spyOn(console, 'log').mockImplementation();

      logger.error('Test error');
      logger.warn('Test warning');
      logger.info('Test info');
      logger.debug('Test debug');

      // No console output in test environment
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(logSpy).not.toHaveBeenCalled();

      errorSpy.mockRestore();
      warnSpy.mockRestore();
      infoSpy.mockRestore();
      logSpy.mockRestore();
    });
  });

  describe('Log Grouping', () => {
    it('should have grouping methods', () => {
      // Just verify the methods exist and don't throw
      expect(() => {
        logger.group('Test Group');
        logger.groupEnd();
      }).not.toThrow();
    });
  });

  describe('Return Values', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'; // Suppress console output
    });

    it('should return formatted log object from error', () => {
      const result = logger.error('Test error', { userId: 123 });

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('ERROR');
      expect(result.message).toBe('Test error');
      expect(result.userId).toBe(123);
    });

    it('should return formatted log object from warn', () => {
      const result = logger.warn('Test warning');

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('WARN');
      expect(result.message).toBe('Test warning');
    });

    it('should return formatted log object from info', () => {
      const result = logger.info('Test info');

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('INFO');
      expect(result.message).toBe('Test info');
    });

    it('should return formatted log object from debug', () => {
      const result = logger.debug('Test debug');

      expect(result).toHaveProperty('timestamp');
      expect(result.level).toBe('DEBUG');
      expect(result.message).toBe('Test debug');
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should handle empty context', () => {
      expect(() => {
        logger.error('Error without context');
      }).not.toThrow();
    });

    it('should handle circular references in context', () => {
      const obj = { name: 'test' };
      obj.self = obj; // Circular reference

      expect(() => {
        logger.error('Circular reference', { data: obj });
      }).not.toThrow();
    });

    it('should handle arrays in context', () => {
      const result = logger.info('Array context', { items: [1, 2, 3] });

      expect(result.items).toEqual([1, 2, 3]);
    });

    it('should handle complex nested structures', () => {
      const complex = {
        user: {
          name: 'John',
          settings: {
            theme: 'dark',
            notifications: ['email', 'push'],
          },
        },
        token: 'secret',
      };

      const result = logger.error('Complex data', complex);

      expect(result.user.name).toBe('John');
      expect(result.user.settings.notifications).toEqual(['email', 'push']);
      expect(result.token).toBe('[REDACTED]');
    });
  });
});
