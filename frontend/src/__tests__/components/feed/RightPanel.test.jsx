import React from 'react';
import { render, screen } from '@testing-library/react';
import RightPanel from '../../../components/feed/RightPanel';

describe('RightPanel Component', () => {
  it('should render without crashing', () => {
    render(<RightPanel />);
    expect(screen.getByRole('complementary', { name: /sidebar/i })).toBeInTheDocument();
  });

  it('should render aside element', () => {
    render(<RightPanel />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveClass('right-panel');
  });
});
