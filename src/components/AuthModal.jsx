// src/components/AuthModal.jsx
import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.scss';

function AuthModal({ isOpen, onClose, onAuthSuccess, onForgotPassword }) {
  const {
    login,
    signup,
    signInWithGoogle,
    signInWithGitHub,
    signInWithFacebook,
    signInWithApple,
    signInWithLinkedIn
  } = useAuth();

  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
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
    setSuccessMessage('');

    try {
      let result;

      if (mode === 'login') {
        result = await login(formData.email, formData.password, rememberMe);

        if (result.success) {
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
          } else {
            localStorage.removeItem('rememberedEmail');
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
        setErrors({ submit: result.error || 'Authentication failed' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
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

  const handleGoogleSignIn   = createOAuthHandler(signInWithGoogle, 'Google');
  const handleGitHubSignIn   = createOAuthHandler(signInWithGitHub, 'GitHub');
  // const handleFacebookSignIn = createOAuthHandler(signInWithFacebook, 'Facebook');
  // const handleAppleSignIn    = createOAuthHandler(signInWithApple, 'Apple');
  // const handleLinkedInSignIn = createOAuthHandler(signInWithLinkedIn, 'LinkedIn');

  const handleForgotPassword = () => {
    if (onForgotPassword) onForgotPassword();
    else onClose();
  };

  const handleClose = () => {
    const savedEmail = localStorage.getItem('rememberedEmail');

    setFormData({
      name: '',
      email: savedEmail || '',
      password: '',
      confirmPassword: ''
    });

    setErrors({});
    setSuccessMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMode('login');
    onClose();
  };

  const switchMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setErrors({});
    setSuccessMessage('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop modal-backdrop--visible" onClick={handleClose} />

      <div className="auth-modal">
        <button className="auth-modal__close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="auth-modal__content">
          <div className="auth-modal__header">
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>
              {mode === 'login'
                ? 'Enter your credentials to continue'
                : 'Sign up to start building your website'}
            </p>
          </div>

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-field">
                <label htmlFor="name">
                  <User size={16} /> Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="password">
                <Lock size={16} /> Password
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {mode === 'signup' && (
              <div className="form-field">
                <label htmlFor="confirmPassword">
                  <Lock size={16} /> Confirm Password
                </label>
                <div className="password-input">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="form-error">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="form-extras">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" className="forgot-password" onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              </div>
            )}

            {errors.submit && (
              <div className="form-error form-error--submit">{errors.submit}</div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader size={18} className="spinning" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
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
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209
                1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567
                2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806
                5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344
                0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482
                18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707
                0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0
                9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454
                3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482
                0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656
                3.58 9 3.58z"/>
              </svg>
            </button>
            <button
              className="btn-social-icon"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              title="Continue with GitHub"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 
                8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 
                1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 
                3.48.99.11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 
                0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.17 
                0 0 1.01-.32 3.3 1.23.96-.26 1.99-.4 
                3.01-.4s2.05.14 3.01.4c2.29-1.55 3.3-1.23 
                3.3-1.23.66 1.65.25 2.87.12 3.17.77.84 
                1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 
                5.92.43.37.82 1.1.82 2.22v3.29c0 
                .32.19.7.79.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </button>

            {/* Facebook */}
            {/* <button
              className="btn-social-icon"
              onClick={handleFacebookSignIn}
              disabled={isLoading}
              title="Continue with Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 
                1.325v21.351C0 23.406.593 24 1.325 
                24h11.494v-9.294H9.691V11.01h3.128V8.414c0-3.1 
                1.894-4.788 4.659-4.788 1.325 
                0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 
                0-1.796.715-1.796 1.763V11.01h3.587l-.467 
                3.696h-3.12V24h6.116C23.407 24 24 
                23.406 24 22.676V1.325C24 .593 23.407 
                0 22.675 0z"/>
              </svg>
            </button> */}

            {/* Apple */}
            {/* <button
              className="btn-social-icon"
              onClick={handleAppleSignIn}
              disabled={isLoading}
              title="Continue with Apple"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365 1.43c0 1.14-.45 2.18-1.18 
                2.97-.76.82-2.04 1.45-3.1 1.36-.15-1.1.32-2.27 
                1.03-3.05.78-.94 2.16-1.62 3.25-1.64zM20.69 
                17.47c-.54 1.28-.8 1.84-1.5 2.96-1 
                1.62-2.4 3.63-4.17 3.66-1.55.03-1.96-.97-4.09-.97-2.14 
                0-2.59.94-4.1.99-1.76.05-3.1-1.87-4.11-3.48-2.82-4.52-3.12-9.82-1.39-12.62 
                1.22-2.02 3.16-3.2 4.98-3.2 1.85 
                0 3.02 1.07 4.55 1.07 1.49 
                0 2.4-1.07 4.54-1.07 1.67 0 3.45.91 
                4.66 2.48-4.1 2.25-3.43 8.11.63 10.28z"/>
              </svg>
            </button> */}

            {/* LinkedIn */}
            {/* <button
              className="btn-social-icon"
              onClick={handleLinkedInSignIn}
              disabled={isLoading}
              title="Continue with LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M22.23 0H1.77C.79 0 0 .77 0 
                1.72v20.56C0 23.23.79 24 1.77 
                24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 
                .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 
                7.59c-1.14 0-2.06-.92-2.06-2.06 0-1.13.92-2.06 
                2.06-2.06 1.13 0 2.06.93 2.06 2.06 0 1.14-.93 
                2.06-2.06 2.06zM20.45 20.45h-3.56v-5.58c0-1.33-.03-3.05-1.86-3.05-1.86 
                0-2.14 1.45-2.14 2.95v5.68h-3.56V9h3.42v1.56h.05c.48-.89 
                1.66-1.83 3.42-1.83 3.66 0 4.34 2.41 4.34 
                5.54v6.18z"/>
              </svg>
            </button> */}

          </div>


          <div className="auth-modal__footer">
            <p>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button type="button" className="switch-mode" onClick={switchMode} disabled={isLoading}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default AuthModal;
