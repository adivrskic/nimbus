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
import { useProject } from "../contexts/ProjectContext";
import { useGenerationState } from "../contexts/GenerationContext";
import AuthModal from "./Modals/AuthModal";
import TokenPurchaseModal from "./Modals/TokenPurchaseModal";
import ProjectsModal from "./Modals/ProjectsModal";
import LegalModal from "./Modals/LegalModal";
import { useTheme } from "../contexts/ThemeContext";
import "./Header.scss";

function Header() {
  const { theme, toggleTheme } = useTheme();

  const { editProject, deployProject } = useProject();
  const { previewPill } = useGenerationState();
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
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalSection, setLegalSection] = useState(null);

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
      // handled elsewhere
    }
  }, [isAuthenticated, refreshProfile]);

  const handleLogout = async () => {
    track("logout");
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
                    onClick={() => setIsTokenModalOpen(true)}
                    title="Get more tokens"
                  >
                    <Coins size={14} />
                    <span>{userTokens}</span>
                  </button>

                  <button
                    className="header__icon-btn"
                    onClick={() => setIsProjectsModalOpen(true)}
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
                  onClick={() => setIsAuthModalOpen(true)}
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
