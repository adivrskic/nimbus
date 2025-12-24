import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  Cloudy,
  Settings,
  LogOut,
  ChevronDown,
  Coins,
  FolderOpen,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import UserAccountModal from "./UserAccountModal";
import TokenPurchaseModal from "./TokenPurchaseModal";
import ProjectsModal from "./ProjectsModal";
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
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const userMenuRef = useRef(null);

  // Get user tokens
  const userTokens = profile?.tokens || 0;

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && !profile) {
      refreshProfile();
    }
  }, [isAuthenticated, user, profile, refreshProfile]);

  useEffect(() => {
    if (justVerifiedEmail && !isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  }, [justVerifiedEmail, isAuthenticated]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=signup")) {
      window.history.replaceState(null, "", window.location.pathname);
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
      } else {
        refreshProfile();
      }
    }
    if (hash && hash.includes("type=recovery")) {
      if (isAuthenticated) {
        setIsAccountModalOpen(true);
      }
    }
  }, [isAuthenticated, refreshProfile]);

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
    setIsUserMenuOpen(false);
    setIsAccountModalOpen(false);
    setIsLoggingOut(true);
    await logout();
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

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

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

  const shouldShowLoading = () => {
    if (isPageLoading) return true;
    if (isAuthenticated) return false;
    return authIsLoading;
  };

  const getTokenStatusClass = () => {
    if (userTokens >= 50) return "high";
    if (userTokens >= 20) return "medium";
    return "low";
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header__content">
            <a href="/" className="header__logo">
              <span className="header__logo-icon">
                <Cloudy size={32} />
              </span>
              <span className="header__logo-text">nimbus</span>
            </a>

            <nav className="header__nav">
              {isAuthenticated ? (
                <>
                  {/* Token Display in Header */}
                  <button
                    className={`header__tokens header__tokens--${getTokenStatusClass()}`}
                    onClick={() => setIsTokenModalOpen(true)}
                    title="Get more tokens"
                  >
                    <Coins size={16} />
                    <span>{userTokens}</span>
                  </button>

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

                        {/* Token Balance in Dropdown */}
                        <div
                          className={`dropdown-tokens dropdown-tokens--${getTokenStatusClass()}`}
                        >
                          <div className="token-info">
                            <Coins size={18} />
                            <span className="token-count">
                              {userTokens} tokens
                            </span>
                          </div>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setIsTokenModalOpen(true);
                            }}
                          >
                            Get More
                          </button>
                        </div>

                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsProjectsModalOpen(true);
                          }}
                        >
                          <FolderOpen size={16} />
                          My Projects
                        </button>

                        <button
                          className="dropdown-item"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsTokenModalOpen(true);
                          }}
                        >
                          <CreditCard size={16} />
                          Buy Tokens
                        </button>

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
                </>
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

      {/* Token Purchase Modal */}
      <TokenPurchaseModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
      />

      {/* Projects Modal */}
      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
      />
    </>
  );
}

export default Header;
