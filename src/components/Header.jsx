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
      openAuth();
    }
  }, [justVerifiedEmail, isAuthenticated, openAuth]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=signup")) {
      window.history.replaceState(null, "", window.location.pathname);
      if (!isAuthenticated) {
        openAuth();
      } else {
        refreshProfile();
      }
    }
    if (hash && hash.includes("type=recovery")) {
      // handled elsewhere
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
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__logo">
            <span className="header__logo-icon">
              <Cloudy size={32} />
            </span>
            <span className="header__logo-text">nimbus</span>
          </div>

          <div className="header__center">
            {previewPill?.visible && (
              <button
                className={`header__preview-pill ${
                  previewPill.isGenerating
                    ? "header__preview-pill--generating"
                    : ""
                }`}
                onClick={previewPill.onRestore}
              >
                <span
                  className="header__marble"
                  style={{
                    background: previewPill.colors
                      ? `radial-gradient(circle at 35% 35%, ${previewPill.colors.c}, ${previewPill.colors.a} 50%, ${previewPill.colors.b})`
                      : undefined,
                  }}
                />
                <span className="header__preview-text">
                  {previewPill.isGenerating
                    ? "Generating..."
                    : "View Generated Project"}
                </span>
                {previewPill.isGenerating && (
                  <Loader2 size={13} className="header__preview-spinner" />
                )}
              </button>
            )}
          </div>

          <nav className="header__nav">
            <button
              className="header__icon-btn"
              onClick={handleThemeToggle}
              aria-label={getThemeLabel()}
              title={getThemeLabel()}
            >
              {getThemeIcon()}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  className="header__pill"
                  onClick={openTokenPurchase}
                  title="Get more tokens"
                >
                  <Coins size={14} />
                  <span>{userTokens}</span>
                </button>

                <button
                  className="header__icon-btn"
                  onClick={openProjects}
                  title="Projects"
                >
                  <FolderOpen size={16} />
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
                    <LogOut size={16} />
                  )}
                </button>
              </>
            ) : (
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
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
