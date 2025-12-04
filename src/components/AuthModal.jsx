// src/components/AuthModal.jsx
import { useState, useEffect } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./AuthModal.scss";

function AuthModal({ isOpen, onClose, onAuthSuccess, onForgotPassword }) {
  const {
    login,
    signup,
    signInWithGoogle,
    signInWithGitHub,
    signInWithFacebook,
    signInWithApple,
    signInWithLinkedIn,
  } = useAuth();

  // Use the animation hook for smooth enter/exit transitions
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 300);

  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setFormData((prev) => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (mode === "signup") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      let result;

      if (mode === "login") {
        result = await login(formData.email, formData.password, rememberMe);

        if (result.success) {
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", formData.email);
          } else {
            localStorage.removeItem("rememberedEmail");
          }
        }
      } else {
        result = await signup(formData.email, formData.password, formData.name);
      }

      if (result.success) {
        if (result.requiresEmailConfirmation) {
          setSuccessMessage(result.message);
        } else {
          if (onAuthSuccess) onAuthSuccess(result.user);
          handleClose();
        }
      } else {
        // Modal stays open so user can retry with correct credentials
        setErrors({ submit: result.error || "Authentication failed" });
      }
    } catch (error) {
      setErrors({
        submit: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOAuthHandler = (oauthFunc, providerName) => async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const result = await oauthFunc();
      if (!result.success) {
        setErrors({ submit: `${providerName} sign-in failed` });
      }
    } catch (error) {
      setErrors({ submit: error.message || `${providerName} sign-in failed` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = createOAuthHandler(signInWithGoogle, "Google");
  const handleGitHubSignIn = createOAuthHandler(signInWithGitHub, "GitHub");
  // const handleFacebookSignIn = createOAuthHandler(signInWithFacebook, 'Facebook');
  // const handleAppleSignIn    = createOAuthHandler(signInWithApple, 'Apple');
  // const handleLinkedInSignIn = createOAuthHandler(signInWithLinkedIn, 'LinkedIn');

  const handleForgotPassword = () => {
    if (onForgotPassword) onForgotPassword();
    else onClose();
  };

  const handleClose = () => {
    const savedEmail = localStorage.getItem("rememberedEmail");

    setFormData({
      name: "",
      email: savedEmail || "",
      password: "",
      confirmPassword: "",
    });

    setErrors({});
    setSuccessMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMode("login");
    onClose();
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setErrors({});
    setSuccessMessage("");
  };

  // Don't render if not needed
  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`auth-modal-backdrop modal-backdrop ${
          isVisible ? "modal-backdrop--visible" : ""
        }`}
        onClick={handleClose}
      />

      <div className={`auth-modal ${isVisible ? "auth-modal--visible" : ""}`}>
        <div className="auth-modal__content">
          <div className="auth-modal__header">
            <button className="auth-modal__close" onClick={handleClose}>
              <X size={20} />
            </button>
            <div>
              <h2 className="auth-modal__title">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="auth-modal__subtitle">
                {mode === "login"
                  ? "Enter your credentials to continue"
                  : "Sign up to start building your website"}
              </p>
            </div>
          </div>

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="form-field">
                <label htmlFor="name">
                  <User size={16} /> Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <span className="form-error">{errors.name}</span>
                )}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">
                <Mail size={16} /> Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password">
                <Lock size={16} /> Password
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            {mode === "signup" && (
              <div className="form-field">
                <label htmlFor="confirmPassword">
                  <Lock size={16} /> Confirm Password
                </label>
                <div className="password-input">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {mode === "login" && (
              <div className="form-extras">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {errors.submit && (
              <div className="form-error form-error--submit">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="spinning" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-modal__divider">
            <span>or continue with</span>
          </div>

          <div className="social-auth--row">
            <button
              className="btn-social-icon"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              title="Continue with Google"
            >
              <svg width="20" height="20" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209
                1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567
                2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806
                5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344
                0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482
                18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707
                0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0
                9c0 1.452.348 2.827.957 4.042l3.007-2.335z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454
                3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482
                0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656
                3.58 9 3.58z"
                />
              </svg>
            </button>
            <button
              className="btn-social-icon"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              title="Continue with GitHub"
            >
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 
                8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 
                1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 
                3.48.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 
                0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 
                0 0 1.01-.32 3.3 1.23.96-.26 1.99-.4 
                3.01-.4s2.05.14 3.01.4c2.29-1.55 3.3-1.23 
                3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 
                1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 
                5.92.43.37.82 1.1.82 2.22v3.29c0 
                .32.19.7.79.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z"
                />
              </svg>
            </button>
          </div>

          <div className="auth-modal__footer">
            <p>
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                className="switch-mode"
                onClick={switchMode}
                disabled={isLoading}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthModal;
