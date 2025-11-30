// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  Cloudy,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import UserAccountModal from "./UserAccountModal";
import { useTheme } from "../contexts/ThemeContext";
import "./Header.scss";

function Header() {
  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const { user, profile, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  // Check URL hash for email confirmation redirect
  useEffect(() => {
    const hash = window.location.hash;

    // Handle email confirmation
    if (hash && hash.includes("type=signup")) {
      // Remove the hash from URL
      window.history.replaceState(null, "", window.location.pathname);

      // Open auth modal if not already authenticated
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
      }
    }

    // Handle password reset
    if (hash && hash.includes("type=recovery")) {
      // Open account modal to security tab for password change
      if (isAuthenticated) {
        setIsAccountModalOpen(true);
      }
    }
  }, [isAuthenticated]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const handleOpenAccountModal = () => {
    setIsAccountModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleForgotPassword = () => {
    setIsAuthModalOpen(false);
    setIsForgotPasswordOpen(true);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (profile?.full_name) {
      const parts = profile.full_name.trim().split(" ");
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
      }
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__content">
            <a href="/" className="header__logo">
              <span className="header__logo-icon">
                <Cloudy size={40} />
              </span>
              <span className="header__logo-text">nimbus</span>
            </a>

            <nav className="header__nav">
              {isHomePage && (
                <>
                  <a href="#how-it-works" className="header__nav-link">
                    How it Works
                  </a>
                  <a href="#styles" className="header__nav-link">
                    Design Styles
                  </a>
                  <a href="#templates" className="header__nav-link">
                    Templates
                  </a>
                </>
              )}

              <button
                className="header__theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {isAuthenticated ? (
                <div className="header__user-menu" ref={userMenuRef}>
                  <button
                    className="header__user-button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="user-avatar">{getUserInitials()}</div>
                    <span className="user-name">{getUserDisplayName()}</span>
                    <ChevronDown
                      size={16}
                      className={`chevron ${isUserMenuOpen ? "open" : ""}`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="header__user-dropdown">
                      <div className="dropdown-header">
                        <div className="user-avatar-large">
                          {getUserInitials()}
                        </div>
                        <div className="user-info">
                          <p className="user-name">{getUserDisplayName()}</p>
                          <p className="user-email">{user?.email}</p>
                        </div>
                      </div>

                      <button
                        className="dropdown-item"
                        onClick={handleOpenAccountModal}
                      >
                        <Settings size={16} />
                        Account Settings
                      </button>

                      <button
                        className="dropdown-item dropdown-item--danger"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onForgotPassword={handleForgotPassword}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      {/* User Account Modal */}
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}

export default Header;
