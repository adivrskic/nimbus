// AuthModal.jsx - Minimal, grayscale OAuth-only authentication
import { useState } from "react";
import { X, Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./AuthModal.scss";

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { signInWithGoogle, signInWithGitHub, signInWithApple } = useAuth();

  const { shouldRender, isVisible } = useModalAnimation(isOpen, 300);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [error, setError] = useState("");

  const handleOAuthSignIn = async (provider, signInFn) => {
    setIsLoading(true);
    setLoadingProvider(provider);
    setError("");

    try {
      const { error } = await signInFn();
      if (error) throw error;
      onAuthSuccess?.();
    } catch (err) {
      console.error(`${provider} sign-in error:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError("");
      onClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`modal-backdrop ${
          isVisible ? "modal-backdrop--visible" : ""
        }`}
        onClick={handleClose}
      />

      <div className={`auth-modal ${isVisible ? "auth-modal--visible" : ""}`}>
        <div className="auth-modal__content">
          <button className="auth-modal__close" onClick={handleClose}>
            <X size={20} />
          </button>

          <div className="auth-modal__header">
            <p>Continue to build</p>
          </div>

          {error && <div className="auth-modal__error">{error}</div>}

          <div className="auth-modal__providers">
            <button
              className="auth-provider-btn"
              onClick={() => handleOAuthSignIn("Google", signInWithGoogle)}
              disabled={isLoading}
            >
              {loadingProvider === "Google" ? (
                <Loader size={20} className="spinning" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 18 18">
                  <path
                    fill="#666"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                  />
                  <path
                    fill="#666"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  />
                  <path
                    fill="#666"
                    d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"
                  />
                  <path
                    fill="#666"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  />
                </svg>
              )}
              <span>Google</span>
            </button>

            <button
              className="auth-provider-btn"
              onClick={() => handleOAuthSignIn("GitHub", signInWithGitHub)}
              disabled={isLoading}
            >
              {loadingProvider === "GitHub" ? (
                <Loader size={20} className="spinning" />
              ) : (
                <svg width="20" height="20" fill="#666" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.26 1.99-.4 3.01-.4s2.05.14 3.01.4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.79.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              )}
              <span>GitHub</span>
            </button>

            <button
              className="auth-provider-btn"
              onClick={() => handleOAuthSignIn("Apple", signInWithApple)}
              disabled={isLoading}
            >
              {loadingProvider === "Apple" ? (
                <Loader size={20} className="spinning" />
              ) : (
                <svg width="20" height="20" fill="#666" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              )}
              <span>Apple</span>
            </button>
          </div>

          <div className="auth-modal__footer">
            <p>
              By continuing, you agree to our <a href="/legal#terms">Terms</a>{" "}
              and <a href="/legal#privacy">Privacy</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthModal;
