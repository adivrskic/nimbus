import { useState, useEffect, useRef } from "react";
import {
  Cloudy,
  LogOut,
  ChevronDown,
  Coins,
  FolderOpen,
  Sun,
  Moon,
  SunMoon,
} from "lucide-react";
import { track } from "../lib/analytics";

import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";
import AuthModal from "./Modals/AuthModal";
import TokenPurchaseModal from "./Modals/TokenPurchaseModal";
import ProjectsModal from "./Modals/ProjectsModal";
import LegalModal from "./Modals/LegalModal";
import { useTheme } from "../contexts/ThemeContext";
import "./Header.scss";

function Header() {
  const { theme, toggleTheme } = useTheme();

  const { editProject, deployProject } = useProject();
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
  const [, setIsForgotPasswordOpen] = useState(false);
  const [, setIsAccountModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalSection, setLegalSection] = useState(null);

  const userMenuRef = useRef(null);
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
    track("logout");
    setIsUserMenuOpen(false);
    setIsAccountModalOpen(false);
    setIsLoggingOut(true);
    await logout();
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

  const handleOpenLegal = (section) => {
    setLegalSection(section);
    setIsLegalModalOpen(true);
  };

  const handleCloseLegal = () => {
    setIsLegalModalOpen(false);
    setLegalSection(null);
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

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon size={16} />;
      case "light":
        return <Sun size={16} />;
      default:
        return <SunMoon size={16} />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "dark":
        return "Switch to light mode";
      case "light":
        return "Switch to dark mode";
      default:
        return "Toggle theme";
    }
  };

  const handleThemeToggle = () => {
    track("theme-toggle");
    document.documentElement.style.transition = "background-color 0.3s ease";
    toggleTheme();
    setTimeout(() => {
      document.documentElement.style.transition = "";
    }, 300);
  };

  return (
    <>
      <div
        className={`header-backdrop ${isUserMenuOpen ? "active" : ""}`}
        onClick={() => setIsUserMenuOpen(false)}
      />

      <header className="header">
        <div className="container">
          <div className="header__content">
            <div className="header__logo">
              <span className="header__logo-icon">
                <Cloudy size={32} />
              </span>
              <span className="header__logo-text">nimbus</span>
            </div>

            <nav className="header__nav">
              {isAuthenticated ? (
                <>
                  <button
                    className="header__tokens"
                    onClick={() => setIsTokenModalOpen(true)}
                    title="Get more tokens"
                  >
                    <Coins size={14} />
                    <span>{userTokens}</span>
                  </button>

                  <div className="header__user-menu" ref={userMenuRef}>
                    <button
                      className="header__user-button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      disabled={isLoggingOut || authIsLoading}
                    >
                      <div className="user-avatar">{getUserInitials()}</div>
                      <ChevronDown
                        size={14}
                        className={`chevron ${isUserMenuOpen ? "open" : ""}`}
                      />
                    </button>

                    {isUserMenuOpen && (
                      <div className="dropdown">
                        <div className="dropdown__header">
                          <div className="dropdown__header-left">
                            <span className="dropdown__name">
                              {getUserDisplayName()}
                            </span>
                            <span className="dropdown__email">
                              {user?.email}
                            </span>
                          </div>
                          <button
                            className="dropdown__theme-toggle"
                            onClick={handleThemeToggle}
                            aria-label={getThemeLabel()}
                            title={getThemeLabel()}
                          >
                            {getThemeIcon()}
                          </button>
                        </div>

                        <div className="dropdown__tokens">
                          <span>{userTokens} tokens</span>
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setIsTokenModalOpen(true);
                            }}
                          >
                            Get More
                          </button>
                        </div>

                        <div className="dropdown__items">
                          <button
                            className="dropdown__item"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setIsProjectsModalOpen(true);
                            }}
                          >
                            <FolderOpen size={14} />
                            Projects
                          </button>

                          <button
                            className="dropdown__item dropdown__item--danger"
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
                                <LogOut size={14} />
                                Sign Out
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="header__theme-toggle--mobile"
                    onClick={handleThemeToggle}
                    aria-label={getThemeLabel()}
                    title={getThemeLabel()}
                  >
                    {getThemeIcon()}
                  </button>
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
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
        onForgotPassword={handleForgotPassword}
        onOpenLegal={handleOpenLegal}
      />

      <TokenPurchaseModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <ProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        onEditProject={(project) => {
          setIsProjectsModalOpen(false);
          editProject(project);
        }}
        onDeployProject={(project) => {
          setIsProjectsModalOpen(false);
          deployProject(project);
        }}
      />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={handleCloseLegal}
        initialSection={legalSection}
      />
    </>
  );
}

export default Header;
