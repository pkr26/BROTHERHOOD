import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../../../components/feed/Sidebar';

const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
};

describe('Sidebar Component', () => {
  it('should render without crashing', () => {
    render(
      <BrowserRouter>
        <Sidebar user={mockUser} />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/sidebar navigation/i)).toBeInTheDocument();
  });

  it('should display menu items', () => {
    render(
      <BrowserRouter>
        <Sidebar user={mockUser} />
      </BrowserRouter>
    );
    expect(screen.getByText('Friends')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
  });

  it('should display footer links', () => {
    render(
      <BrowserRouter>
        <Sidebar user={mockUser} />
      </BrowserRouter>
    );
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('should display copyright', () => {
    render(
      <BrowserRouter>
        <Sidebar user={mockUser} />
      </BrowserRouter>
    );
    expect(screen.getByText(/© 2024 Brotherhood/i)).toBeInTheDocument();
  });
});
