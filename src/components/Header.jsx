import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Cloudy, User, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';
import './Header.scss';

function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    // Check for saved user in localStorage (for demo purposes)
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User authenticated:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('User logged out');
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__content">
            <Link to="/" className="header__logo">
              <span className="header__logo-icon"><Cloudy size={40} /></span>
              <span className="header__logo-text">nimbus</span>
            </Link>

            <nav className="header__nav">
              {isHomePage && (
                <>
                  <a href="#how-it-works" className="header__nav-link">How it Works</a>
                  <a href="#styles" className="header__nav-link">Design Styles</a>
                  <a href="#templates" className="header__nav-link">Templates</a>
                </>
              )}

              <button 
                className="header__theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              {user ? (
                <div className="header__user-menu">
                  <button className="header__user-button">
                    <User size={18} />
                    <span>{user.name || user.email}</span>
                  </button>
                  <div className="header__user-dropdown">
                    <div className="dropdown-header">
                      <p className="user-name">{user.name || 'User'}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Get Started
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Header;