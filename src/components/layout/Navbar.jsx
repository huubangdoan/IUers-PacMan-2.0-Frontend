
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home', page: 'home', end: true },
  { to: '/about', label: 'About Us', page: 'about' },
  { to: '/contact', label: 'Contact Us', page: 'contact' },
];

function Navbar({ onNavigate }) {
  return (
    <header className="navbar">
      <NavLink className="nav-logo" to="/">DSA Project</NavLink>
      <div className="nav-actions">
        <nav className="nav-links" aria-label="Điều hướng chính">
          {LINKS.map(({ to, label, page, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => [
                'nav-link',
                isActive && 'nav-link--active',
              ].filter(Boolean).join(' ')}
              onClick={(event) => {
                if (!event.defaultPrevented && event.button === 0
                    && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                  onNavigate(page);
                }
              }}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/login"
          className={({ isActive }) => `nav-link nav-link--login${isActive ? ' nav-link--active' : ''}`}
          onClick={(event) => {
            if (!event.defaultPrevented && event.button === 0
                && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
              onNavigate('login');
            }
          }}
        >
          Đăng Nhập
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
