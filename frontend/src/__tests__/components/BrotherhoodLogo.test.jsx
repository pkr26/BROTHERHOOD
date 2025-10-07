import React from 'react';
import { render } from '@testing-library/react';
import BrotherhoodLogo from '../../components/BrotherhoodLogo';

describe('BrotherhoodLogo.jsx', () => {
  // Easy cases
  describe('Easy cases', () => {
    test('should render SVG element', () => {
      const { container } = render(<BrotherhoodLogo />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    test('should have default size of 24', () => {
      const { container } = render(<BrotherhoodLogo />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });

    test('should have correct viewBox', () => {
      const { container } = render(<BrotherhoodLogo />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  // Medium cases
  describe('Medium cases', () => {
    test('should accept custom size', () => {
      const { container } = render(<BrotherhoodLogo size={48} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    test('should accept custom className', () => {
      const { container } = render(<BrotherhoodLogo className="text-blue-500" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('text-blue-500');
    });

    test('should have currentColor fill', () => {
      const { container } = render(<BrotherhoodLogo />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });
  });

  // Hard cases
  describe('Hard cases', () => {
    test('should render two path elements', () => {
      const { container } = render(<BrotherhoodLogo />);
      const paths = container.querySelectorAll('path');
      expect(paths).toHaveLength(2);
    });

    test('should have opacity on second path', () => {
      const { container } = render(<BrotherhoodLogo />);
      const paths = container.querySelectorAll('path');
      expect(paths[1]).toHaveAttribute('opacity', '0.8');
    });

    test('should render with various sizes', () => {
      [16, 24, 32, 64, 128].forEach(size => {
        const { container } = render(<BrotherhoodLogo size={size} />);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('width', size.toString());
      });
    });
  });
});
