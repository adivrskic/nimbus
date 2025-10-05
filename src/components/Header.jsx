import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Cloudy } from 'lucide-react';
import './Header.scss';

function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
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
            
            {/* <button className="btn btn-primary">
              Get Started
            </button> */}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;