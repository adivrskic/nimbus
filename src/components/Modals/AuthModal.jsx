import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  overlayVariants,
  authModalContentVariants,
  authModalItemVariants,
} from "../../configs/animations.config";
import { track } from "../../lib/analytics";

import "./modals.scss";

function AuthModal({ isOpen, onClose, onAuthSuccess, onOpenLegal }) {
  const { signInWithGoogle, signInWithGitHub, signInWithApple } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [error, setError] = useState("");

  const handleOAuthSignIn = async (provider, signInFn) => {
    setIsLoading(true);
    setLoadingProvider(provider);
    setError("");

    track("sign-in", {
      provider,
    });

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

  const handleLegalClick = (e, section) => {
    e.preventDefault();
    e.stopPropagation();

    onClose();
    setTimeout(() => {
      onOpenLegal(section);
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-overlay"
      onClick={handleClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="modal-content modal-content--sm"
        onClick={(e) => e.stopPropagation()}
        variants={authModalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="modal-header" variants={authModalItemVariants}>
          <span className="modal-title">Sign in to create</span>
          <button className="modal-close" onClick={handleClose}>
            <X size={16} />
          </button>
        </motion.div>

        {error && (
          <motion.div className="modal-error" variants={authModalItemVariants}>
            {error}
          </motion.div>
        )}

        <div className="auth-providers">
          <motion.button
            className="auth-provider"
            onClick={() => handleOAuthSignIn("Google", signInWithGoogle)}
            disabled={isLoading}
            variants={authModalItemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loadingProvider === "Google" ? (
              <Loader2 size={16} className="spinning" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 18 18">
                <path
                  fill="#888"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#888"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#888"
                  d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"
                />
                <path
                  fill="#888"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                />
              </svg>
            )}
            <span>Google</span>
          </motion.button>

          <motion.button
            className="auth-provider"
            onClick={() => handleOAuthSignIn("GitHub", signInWithGitHub)}
            disabled={isLoading}
            variants={authModalItemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loadingProvider === "GitHub" ? (
              <Loader2 size={16} className="spinning" />
            ) : (
              <svg width="16" height="16" fill="#888" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.26 1.99-.4 3.01-.4s2.05.14 3.01.4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.79.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span>GitHub</span>
          </motion.button>
        </div>

        <motion.div className="auth-footer" variants={authModalItemVariants}>
          By continuing, you agree to our{" "}
          <button
            type="button"
            className="auth-footer__link"
            onClick={(e) => handleLegalClick(e, "terms")}
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="auth-footer__link"
            onClick={(e) => handleLegalClick(e, "privacy")}
          >
            Privacy
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default AuthModal;
