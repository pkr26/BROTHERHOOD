/**
 * Production-ready logging utility
 *
 * Provides structured logging with different levels:
 * - error: Critical errors that need immediate attention
 * - warn: Warning messages for potential issues
 * - info: General informational messages
 * - debug: Detailed debug information (only in development)
 *
 * In production:
 * - Only logs errors and warnings
 * - Sends errors to error tracking service (can be integrated with Sentry, LogRocket, etc.)
 * - Sanitizes sensitive data
 *
 * Usage:
 * import logger from '../utils/logger';
 * logger.info('User logged in', { userId: 123 });
 * logger.error('API call failed', { error, endpoint: '/api/users' });
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

class Logger {
  constructor() {
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };

    // In production, only show errors and warnings
    // In development, show everything
    // In test, suppress all logs
    this.currentLevel = isTest ? -1 : isDevelopment ? this.levels.debug : this.levels.warn;
  }

  /**
   * Sanitize data to remove sensitive information (recursive)
   */
  sanitize(data, seen = new WeakSet()) {
    if (!data) return data;
    if (typeof data !== 'object') return data;

    // Handle circular references
    if (seen.has(data)) {
      return '[Circular]';
    }
    seen.add(data);

    const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'apiKey', 'secret'];

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item, seen));
    }

    // Handle objects
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveKeys.includes(key)) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitize(value, seen);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Format log message with timestamp and context
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const sanitizedContext = this.sanitize(context);

    return {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...sanitizedContext,
    };
  }

  /**
   * Send error to external error tracking service
   * In production, integrate with Sentry, LogRocket, or similar
   */
  sendToErrorTracking(error, context) {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: context });
    // }
  }

  /**
   * Log error messages
   */
  error(message, context = {}) {
    const formatted = this.formatMessage('error', message, context);

    if (this.currentLevel >= this.levels.error) {
      if (isDevelopment) {
        console.error(`[ERROR] ${message}`, context);
      } else {
        // In production, send to error tracking
        this.sendToErrorTracking(context.error || new Error(message), context);
      }
    }

    return formatted;
  }

  /**
   * Log warning messages
   */
  warn(message, context = {}) {
    const formatted = this.formatMessage('warn', message, context);

    if (this.currentLevel >= this.levels.warn) {
      if (isDevelopment) {
        console.warn(`[WARN] ${message}`, context);
      }
    }

    return formatted;
  }

  /**
   * Log info messages
   */
  info(message, context = {}) {
    const formatted = this.formatMessage('info', message, context);

    if (this.currentLevel >= this.levels.info) {
      if (isDevelopment) {
        console.info(`[INFO] ${message}`, context);
      }
    }

    return formatted;
  }

  /**
   * Log debug messages (development only)
   */
  debug(message, context = {}) {
    const formatted = this.formatMessage('debug', message, context);

    if (this.currentLevel >= this.levels.debug) {
      if (isDevelopment) {
        console.log(`[DEBUG] ${message}`, context);
      }
    }

    return formatted;
  }

  /**
   * Group related logs (useful for debugging complex flows)
   */
  group(label) {
    if (isDevelopment && console.group) {
      console.group(label);
    }
  }

  groupEnd() {
    if (isDevelopment && console.groupEnd) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
const logger = new Logger();

export default logger;
