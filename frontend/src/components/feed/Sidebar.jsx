import { Link } from 'react-router-dom';

/**
 * Sidebar navigation component
 *
 * @param {Object} props
 * @param {Object} props.user - Current user object (reserved for future user-specific content)
 */
const Sidebar = ({ user }) => { // TODO: Use user prop for personalized sidebar content
  const menuItems = [
    { icon: '👥', label: 'Friends', path: '/friends' },
    { icon: '👨‍👩‍👧‍👦', label: 'Groups', path: '/groups' },
    { icon: '🎯', label: 'Challenges', path: '/challenges' },
  ];

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="sidebar-item"
          aria-label={item.label}
        >
          <span className="sidebar-icon" aria-hidden="true">
            {item.icon}
          </span>
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
        <div className="copyright">© 2024 Brotherhood</div>
      </div>
    </aside>
  );
};

export default Sidebar;
