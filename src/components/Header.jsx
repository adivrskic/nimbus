import { useState, useEffect } from "react";
import {
  Cloudy,
  LogOut,
  Coins,
  FolderOpen,
  Sun,
  Moon,
  SunMoon,
  Loader2,
} from "lucide-react";
import { track } from "../lib/analytics";

import { useAuth } from "../contexts/AuthContext";
import { useGenerationState } from "../contexts/GenerationContext";
import { useModals } from "../contexts/ModalContext";
import { useTheme } from "../contexts/ThemeContext";
import "./Header.scss";

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { previewPill } = useGenerationState();
  const { openAuth, openTokenPurchase, openProjects } = useModals();
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

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const userTokens = profile?.tokens || 0;

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && !profile) refreshProfile();
  }, [isAuthenticated, user, profile, refreshProfile]);

  useEffect(() => {
    if (justVerifiedEmail && !isAuthenticated) openAuth();
  }, [justVerifiedEmail, isAuthenticated, openAuth]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=signup")) {
      window.history.replaceState(null, "", window.location.pathname);
      if (!isAuthenticated) openAuth();
      else refreshProfile();
    }
  }, [isAuthenticated, refreshProfile, openAuth]);

  const handleLogout = async () => {
    track("logout");
    setIsLoggingOut(true);
    await logout();
  };

  const shouldShowLoading = () => {
    if (isPageLoading) return true;
    if (isAuthenticated) return false;
    return authIsLoading;
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="header__nav-icon" />;
      case "light":
        return <Sun className="header__nav-icon" />;
      default:
        return <SunMoon className="header__nav-icon" />;
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

  const marbleStyle = previewPill?.colors
    ? {
        background: `radial-gradient(circle at 35% 35%, ${previewPill.colors.c}, ${previewPill.colors.a} 50%, ${previewPill.colors.b})`,
      }
    : undefined;

  const isClickable = previewPill?.visible && !previewPill?.isGenerating;
  const isGenerating = previewPill?.visible && previewPill?.isGenerating;

  return (
    <header className="header">
      <div className="header__inner">
        {/* Logo — glassmorphism section */}
        <div className="header__section header__section--logo">
          <div className="header__logo">
            <span className="header__logo-icon">
              <Cloudy size={28} />
            </span>
            <span className="header__logo-text">nimbus</span>
          </div>
        </div>

        {/* Nav — glassmorphism section */}
        <div className="header__section header__section--nav">
          <nav className="header__nav">
            {isAuthenticated ? (
              <>
                {isClickable ? (
                  <button
                    className="header__marble-wrapper header__marble-wrapper--clickable"
                    onClick={previewPill.onRestore}
                    title="View Generated Project"
                  >
                    <div
                      className="header__marble-surface"
                      style={marbleStyle}
                    />
                  </button>
                ) : (
                  <div
                    className={`header__marble-wrapper${
                      isGenerating ? " header__marble-wrapper--generating" : ""
                    }`}
                  >
                    <div
                      className={`header__marble-surface${
                        isGenerating
                          ? " header__marble-surface--generating"
                          : ""
                      }`}
                      style={marbleStyle}
                    />
                    {isGenerating && (
                      <Loader2 size={14} className="header__marble-spinner" />
                    )}
                  </div>
                )}
                <button
                  className="header__pill"
                  onClick={openTokenPurchase}
                  title="Get more tokens"
                >
                  <Coins className="header__nav-icon header__nav-icon--sm" />
                  <span>{userTokens}</span>
                </button>

                <button
                  className="header__icon-btn"
                  onClick={openProjects}
                  title="Projects"
                >
                  <FolderOpen className="header__nav-icon" />
                </button>

                <button
                  className="header__icon-btn"
                  onClick={handleThemeToggle}
                  aria-label={getThemeLabel()}
                  title={getThemeLabel()}
                >
                  {getThemeIcon()}
                </button>

                <button
                  className="header__icon-btn header__icon-btn--danger"
                  onClick={handleLogout}
                  disabled={isLoggingOut || authIsLoading}
                  title="Sign out"
                >
                  {isLoggingOut ? (
                    <span className="spinner-small" />
                  ) : (
                    <LogOut className="header__nav-icon" />
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  className="header__icon-btn"
                  onClick={handleThemeToggle}
                  aria-label={getThemeLabel()}
                  title={getThemeLabel()}
                >
                  {getThemeIcon()}
                </button>

                <button
                  className="header__cta"
                  onClick={openAuth}
                  disabled={shouldShowLoading()}
                >
                  {shouldShowLoading() ? (
                    <span className="loading-indicator">
                      <span className="spinner-small" />
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
  );
}

export default Header;
