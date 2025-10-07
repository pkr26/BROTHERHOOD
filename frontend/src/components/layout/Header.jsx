import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrotherhoodLogo from '../BrotherhoodLogo';
import {
  MdHome,
  MdNotifications,
  MdMessage,
  MdSearch,
  MdMenu
} from 'react-icons/md';

const Header = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name ? user.first_name[0] : '';
    const lastInitial = user.last_name ? user.last_name[0] : '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <Link to="/feed" className="header-logo">
            <BrotherhoodLogo />
          </Link>

          <form onSubmit={handleSearch} className="header-search">
            <div className="search-icon">
              <MdSearch />
            </div>
            <input
              type="text"
              placeholder="Search Brotherhood"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
        </div>

        {/* Center Section */}
        <nav className="header-center">
          <Link
            to="/feed"
            className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}
            title="Home"
          >
            <MdHome />
          </Link>
        </nav>

        {/* Right Section */}
        <div className="header-right">
          {/* Profile */}
          <div className="header-profile">
            <button
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {getUserInitials()}
              </div>
              <span className="profile-name">
                {user?.first_name || 'User'}
              </span>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu profile-menu">
                <Link to="/profile" className="dropdown-item">
                  <div className="dropdown-item-icon">👤</div>
                  <div>
                    <div className="dropdown-item-title">{user?.first_name} {user?.last_name}</div>
                    <div className="dropdown-item-subtitle">See your profile</div>
                  </div>
                </Link>

                <div className="dropdown-divider"></div>

                <button onClick={onLogout} className="dropdown-item">
                  <div className="dropdown-item-icon">🚪</div>
                  <div className="dropdown-item-title">Log Out</div>
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <button className="header-icon-button" title="Messages">
            <MdMessage />
          </button>

          {/* Notifications */}
          <div className="header-notifications">
            <button
              className="header-icon-button"
              title="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <MdNotifications />
              <span className="notification-badge">3</span>
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">👍</div>
                  <div className="notification-content">
                    <p><strong>John Doe</strong> liked your post</p>
                    <span className="notification-time">5 minutes ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">💬</div>
                  <div className="notification-content">
                    <p><strong>Jane Smith</strong> commented on your photo</p>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon">👥</div>
                  <div className="notification-content">
                    <p><strong>Mike Johnson</strong> sent you a friend request</p>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menu */}
          <button className="header-icon-button" title="Menu">
            <MdMenu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;