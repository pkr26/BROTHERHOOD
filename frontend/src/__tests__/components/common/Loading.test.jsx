import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  PageLoader,
  Spinner,
  Skeleton,
  ButtonLoader,
} from '../../../components/common/Loading';

describe('Loading.jsx Components', () => {
  // PageLoader tests
  describe('PageLoader - Easy cases', () => {
    test('should render with default message', () => {
      render(<PageLoader />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('should render with custom message', () => {
      render(<PageLoader message="Please wait" />);
      expect(screen.getByText('Please wait')).toBeInTheDocument();
    });
  });

  // Spinner tests
  describe('Spinner - Medium cases', () => {
    test('should render with default size and color', () => {
      const { container } = render(<Spinner />);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('w-6', 'h-6');
    });

    test('should render with different sizes', () => {
      ['sm', 'md', 'lg', 'xl'].forEach(size => {
        const { container } = render(<Spinner size={size} />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });

    test('should render with different colors', () => {
      ['primary', 'accent', 'white', 'gray'].forEach(color => {
        const { container } = render(<Spinner color={color} />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
      });
    });
  });

  // Skeleton tests
  describe('Skeleton - Hard cases', () => {
    test('should render with all variants', () => {
      ['text', 'title', 'rectangular', 'circular', 'card'].forEach(variant => {
        const { container } = render(<Skeleton variant={variant} />);
        const skeleton = container.querySelector('.bg-gray-200');
        expect(skeleton).toBeInTheDocument();
      });
    });

    test('should apply custom width and height', () => {
      const { container } = render(<Skeleton width="200px" height="100px" />);
      const skeleton = container.querySelector('.bg-gray-200');
      expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
    });

    test('should disable animation when specified', () => {
      const { container } = render(<Skeleton animation={false} />);
      const skeleton = container.querySelector('.bg-gray-200');
      expect(skeleton).not.toHaveClass('animate-pulse');
    });
  });

  // ButtonLoader tests
  describe('ButtonLoader - Medium cases', () => {
    test('should show children when not loading', () => {
      render(<ButtonLoader loading={false}>Click me</ButtonLoader>);
      expect(screen.getByText('Click me')).toBeVisible();
    });

    test('should hide children and show spinner when loading', () => {
      const { container } = render(<ButtonLoader loading={true}>Click me</ButtonLoader>);
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    test('should disable button when loading', () => {
      render(<ButtonLoader loading={true}>Click me</ButtonLoader>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

});
