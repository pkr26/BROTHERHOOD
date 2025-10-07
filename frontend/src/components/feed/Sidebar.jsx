import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name ? user.first_name[0] : '';
    const lastInitial = user.last_name ? user.last_name[0] : '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  const menuItems = [
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '👥', label: 'Friends', path: '/friends' },
    { icon: '👨‍👩‍👧‍👦', label: 'Groups', path: '/groups' },
    { icon: '🎯', label: 'Challenges', path: '/challenges' },
  ];

  return (
    <div className="sidebar">
      {/* User Profile Link */}
      <Link to="/profile" className="sidebar-item">
        <div className="sidebar-icon user-avatar">
          {getUserInitials()}
        </div>
        <span className="sidebar-label">
          {user?.first_name} {user?.last_name}
        </span>
      </Link>

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <Link key={index} to={item.path} className="sidebar-item">
          <span className="sidebar-icon">{item.icon}</span>
          <span className="sidebar-label">{item.label}</span>
        </Link>
      ))}

      {/* Footer Links */}
      <div className="sidebar-footer">
        <div className="footer-links">
          <a href="/privacy">Privacy</a> ·
          <a href="/terms"> Terms</a> ·
          <a href="/about"> About</a> ·
          <a href="/help"> Help</a>
        </div>
        <div className="copyright">
          © 2024 Brotherhood
        </div>
      </div>
    </div>
  );
};

export default Sidebar;