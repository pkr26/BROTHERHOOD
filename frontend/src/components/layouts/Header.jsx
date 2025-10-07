import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdHome, MdNotifications, MdMessage, MdSearch } from 'react-icons/md';
import BrotherhoodLogo from '../BrotherhoodLogo';
import { useClickOutside } from '../../hooks/useClickOutside';
import { getUserInitials } from '../../utils/userHelpers';
import logger from '../../utils/logger';

/**
 * Main header navigation component
 *
 * @param {Object} props
 * @param {Object} props.user - Current user object
 * @param {Function} props.onLogout - Logout handler
 */
const Header = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  // Close menus when clicking outside
  const profileMenuRef = useClickOutside(
    () => setShowProfileMenu(false),
    showProfileMenu
  );

  const notificationsRef = useClickOutside(
    () => setShowNotifications(false),
    showNotifications
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      logger.debug('Search initiated', { query: searchQuery });
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <Link to="/feed" className="header-logo" aria-label="Brotherhood Home">
            <BrotherhoodLogo size={32} />
          </Link>

          <form onSubmit={handleSearch} className="header-search" role="search">
            <div className="search-icon" aria-hidden="true">
              <MdSearch />
            </div>
            <input
              type="text"
              placeholder="Search Brotherhood"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search"
            />
          </form>
        </div>

        {/* Center Section */}
        <nav className="header-center" aria-label="Main navigation">
          <Link
            to="/feed"
            className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}
            title="Home"
            aria-label="Home"
            aria-current={location.pathname === '/feed' ? 'page' : undefined}
          >
            <MdHome />
          </Link>
        </nav>

        {/* Right Section */}
        <div className="header-right">
          {/* Messages Button */}
          <button
            className="header-icon-button"
            title="Messages"
            aria-label="Messages"
          >
            <MdMessage />
          </button>

          {/* Notifications Dropdown */}
          <div className="header-notifications" ref={notificationsRef}>
            <button
              className="header-icon-button"
              title="Notifications"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              aria-haspopup="true"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <MdNotifications />
              <span className="notification-badge" aria-label="3 unread notifications">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="dropdown-menu notifications-menu" role="menu">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                </div>
                <button
                  className="notification-item"
                  role="menuitem"
                  onClick={() => setShowNotifications(false)}
                >
                  <div className="notification-icon" aria-hidden="true">
                    👍
                  </div>
                  <div className="notification-content">
                    <p>
                      <strong>John Doe</strong> liked your post
                    </p>
                    <span className="notification-time">5 minutes ago</span>
                  </div>
                </button>
                <button
                  className="notification-item"
                  role="menuitem"
                  onClick={() => setShowNotifications(false)}
                >
                  <div className="notification-icon" aria-hidden="true">
                    💬
                  </div>
                  <div className="notification-content">
                    <p>
                      <strong>Jane Smith</strong> commented on your photo
                    </p>
                    <span className="notification-time">1 hour ago</span>
                  </div>
                </button>
                <button
                  className="notification-item"
                  role="menuitem"
                  onClick={() => setShowNotifications(false)}
                >
                  <div className="notification-icon" aria-hidden="true">
                    👥
                  </div>
                  <div className="notification-content">
                    <p>
                      <strong>Mike Johnson</strong> sent you a friend request
                    </p>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="header-profile" ref={profileMenuRef}>
            <button
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="User menu"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <div className="profile-avatar" aria-hidden="true">
                {getUserInitials(user)}
              </div>
              <span className="profile-name">{user?.first_name || 'User'}</span>
            </button>

            {showProfileMenu && (
              <div className="dropdown-menu profile-menu" role="menu">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <div className="dropdown-item-icon" aria-hidden="true">
                    👤
                  </div>
                  <div>
                    <div className="dropdown-item-title">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="dropdown-item-subtitle">See your profile</div>
                  </div>
                </Link>

                <div className="dropdown-divider" role="separator" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="dropdown-item"
                  role="menuitem"
                >
                  <div className="dropdown-item-icon" aria-hidden="true">
                    🚪
                  </div>
                  <div className="dropdown-item-title">Log Out</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
