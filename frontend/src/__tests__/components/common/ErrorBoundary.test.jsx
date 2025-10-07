import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../../components/common/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary.jsx', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  // Easy cases
  describe('Easy cases', () => {
    test('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('should catch errors and display fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    test('should display Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  // Medium cases
  describe('Medium cases', () => {
    test('should display Go Home link', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      const homeLink = screen.getByText('Go Home');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    test('should reset error state when Try Again is clicked', () => {
      const GoodComponent = () => <div>Working</div>;
      let shouldThrow = true;

      const ConditionalError = () => {
        if (shouldThrow) throw new Error('Test');
        return <GoodComponent />;
      };

      render(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

      shouldThrow = false;
      fireEvent.click(screen.getByText('Try Again'));

      // After reset, error boundary should be cleared
      expect(screen.queryByText(/Something went wrong/i)).not.toBeInTheDocument();
    });

    test('should call onReset prop when provided', () => {
      const onReset = jest.fn();
      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(onReset).toHaveBeenCalled();
    });
  });

  // Hard cases
  describe('Hard cases', () => {
    test('should use custom fallback when provided', () => {
      const customFallback = (error, errorInfo, reset) => (
        <div>
          <h1>Custom Error</h1>
          <button onClick={reset}>Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });

    test('should log error in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
      process.env.NODE_ENV = originalEnv;
    });

    test('should show error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error Details/i)).toBeInTheDocument();
      process.env.NODE_ENV = originalEnv;
    });
  });
});
