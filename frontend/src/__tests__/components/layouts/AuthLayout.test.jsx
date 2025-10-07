import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthLayout from '../../../components/layouts/AuthLayout';

describe('AuthLayout Component', () => {
  it('should render without crashing', () => {
    render(
      <AuthLayout title="Test Title" subtitle="Test Subtitle">
        <div>Test Content</div>
      </AuthLayout>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render title and subtitle', () => {
    render(
      <AuthLayout title="Welcome" subtitle="Sign in to continue">
        <div>Content</div>
      </AuthLayout>
    );
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <AuthLayout title="Test">
        <div data-testid="test-content">Custom Content</div>
      </AuthLayout>
    );
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should render footer when provided', () => {
    render(
      <AuthLayout title="Test" footer={<div>Footer Content</div>}>
        <div>Content</div>
      </AuthLayout>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  it('should display Brotherhood branding', () => {
    render(
      <AuthLayout title="Test">
        <div>Content</div>
      </AuthLayout>
    );
    expect(screen.getAllByText('Brotherhood')[0]).toBeInTheDocument();
  });

  it('should render without title and subtitle', () => {
    render(
      <AuthLayout>
        <div>Just Content</div>
      </AuthLayout>
    );
    expect(screen.getByText('Just Content')).toBeInTheDocument();
  });
});
