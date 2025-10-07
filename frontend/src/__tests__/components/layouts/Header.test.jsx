import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../../components/layouts/Header';

const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
};

const renderHeader = (props = {}) => {
  return render(
    <BrowserRouter>
      <Header user={mockUser} onLogout={jest.fn()} {...props} />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('should render without crashing', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should display Brotherhood logo', () => {
    renderHeader();
    expect(screen.getByLabelText(/brotherhood home/i)).toBeInTheDocument();
  });

  it('should display search input', () => {
    renderHeader();
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search brotherhood/i)).toBeInTheDocument();
  });

  it('should display navigation links', () => {
    renderHeader();
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
  });

  it('should display user name', () => {
    renderHeader();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should display notification badge', () => {
    renderHeader();
    expect(screen.getByLabelText(/3 unread notifications/i)).toBeInTheDocument();
  });

  it('should toggle profile menu', () => {
    renderHeader();
    const profileButton = screen.getByLabelText(/user menu/i);

    fireEvent.click(profileButton);
    expect(screen.getByText(/log out/i)).toBeInTheDocument();

    fireEvent.click(profileButton);
    expect(screen.queryByText(/log out/i)).not.toBeInTheDocument();
  });

  it('should toggle notifications menu', () => {
    renderHeader();
    const notificationsButton = screen.getByLabelText('Notifications');

    fireEvent.click(notificationsButton);
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();

    fireEvent.click(notificationsButton);
    expect(screen.queryByText(/jane smith/i)).not.toBeInTheDocument();
  });

  it('should call onLogout when logout is clicked', () => {
    const onLogout = jest.fn();
    renderHeader({ onLogout });

    const profileButton = screen.getByLabelText(/user menu/i);
    fireEvent.click(profileButton);

    const logoutButton = screen.getByText(/log out/i);
    fireEvent.click(logoutButton);

    expect(onLogout).toHaveBeenCalled();
  });
});
