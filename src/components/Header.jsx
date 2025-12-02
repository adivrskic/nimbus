import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Moon, Sun, Cloudy, Settings, LogOut, ChevronDown } from "lucide-react";
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

  const {
    user,
    profile,
    isAuthenticated,
    logout,
    refreshProfile,
    justVerifiedEmail,
    clearJustVerifiedFlag,
    isLoading: authIsLoading,
  } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false); // New state for page loading

  const userMenuRef = useRef(null);

  // Show a brief loading state when page first loads
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000); // Show loading for 2 seconds max

    return () => clearTimeout(timer);
  }, []);

  // Close all modals when not authenticated
  useEffect(() => {
    if (!isAuthenticated && !authIsLoading) {
      console.log("🎯 Header: User not authenticated, closing modals");
      setIsAuthModalOpen(false);
      setIsAccountModalOpen(false);
      setIsUserMenuOpen(false);
    }
  }, [isAuthenticated, authIsLoading]);

  // Refresh profile when authenticated but profile missing
  useEffect(() => {
    if (isAuthenticated && user && !profile) {
      console.log("User authenticated but profile missing, refreshing...");
      refreshProfile();
    }
  }, [isAuthenticated, user, profile, refreshProfile]);

  // Auto-open auth modal when user just verified email but isn't signed in
  useEffect(() => {
    if (justVerifiedEmail && !isAuthenticated) {
      console.log("User just verified email, opening auth modal...");
      setIsAuthModalOpen(true);
    }
  }, [justVerifiedEmail, isAuthenticated]);

  // Handle URL hash changes (email verification, password reset)
  useEffect(() => {
    const hash = window.location.hash;

    // Handle email confirmation
    if (hash && hash.includes("type=signup")) {
      // Remove the hash from URL
      window.history.replaceState(null, "", window.location.pathname);

      // Open auth modal if not already authenticated
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
      } else {
        // If already authenticated, refresh profile
        refreshProfile();
      }
    }

    // Handle password reset
    if (hash && hash.includes("type=recovery")) {
      // Open account modal to security tab for password change
      if (isAuthenticated) {
        setIsAccountModalOpen(true);
      }
    }
  }, [isAuthenticated, refreshProfile]);

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

  // Improved logout handler
  const handleLogout = async () => {
    console.log("🎯 Header: Logout initiated");
    setIsUserMenuOpen(false);
    setIsAccountModalOpen(false);
    setIsLoggingOut(true);

    await logout();
    // logout() will reload the page, so we don't need to reset isLoggingOut
  };

  const handleOpenAccountModal = () => {
    setIsAccountModalOpen(true);
    setIsUserMenuOpen(false);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    clearJustVerifiedFlag();
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    clearJustVerifiedFlag();
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

  // Determine if we should show loading
  const shouldShowLoading = () => {
    // Only show loading for a limited time after page load
    if (isPageLoading) return true;

    // Don't show loading if we're authenticated
    if (isAuthenticated) return false;

    // Don't show loading if it's been more than 5 seconds
    return authIsLoading;
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
                disabled={shouldShowLoading()}
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {isAuthenticated ? (
                <div className="header__user-menu" ref={userMenuRef}>
                  <button
                    className="header__user-button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    disabled={isLoggingOut || authIsLoading}
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
                        disabled={isLoggingOut || authIsLoading}
                      >
                        <Settings size={16} />
                        Account Settings
                      </button>

                      <button
                        className="dropdown-item dropdown-item--danger"
                        onClick={handleLogout}
                        disabled={isLoggingOut || authIsLoading}
                      >
                        {isLoggingOut ? (
                          <>
                            <span className="spinner-small"></span>
                            Signing Out...
                          </>
                        ) : (
                          <>
                            <LogOut size={16} />
                            Sign Out
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                  disabled={shouldShowLoading()}
                >
                  {shouldShowLoading() ? (
                    <span className="loading-indicator">
                      <span className="spinner-small"></span>
                      Loading...
                    </span>
                  ) : (
                    "Get Started"
                  )}
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
        onForgotPassword={handleForgotPassword}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      {/* User Account Modal */}
      {isAuthenticated && (
        <UserAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}
    </>
  );
}

export default Header;
