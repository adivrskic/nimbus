import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react';
import './AuthModal.scss';

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would call your auth API here:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.email, password: formData.password })
      // });

      // For demo purposes, just succeed
      const mockUser = {
        id: '123',
        name: formData.name || formData.email.split('@')[0],
        email: formData.email
      };

      // Call success callback
      if (onAuthSuccess) {
        onAuthSuccess(mockUser);
      }

      // Close modal
      handleClose();
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMode('login');
    onClose();
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setErrors({});
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

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-field">
                <label htmlFor="name">
                  <User size={16} />
                  Name
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
                <Mail size={16} />
                Email
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
                <Lock size={16} />
                Password
              </label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {mode === 'signup' && (
              <div className="form-field">
                <label htmlFor="confirmPassword">
                  <Lock size={16} />
                  Confirm Password
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
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            )}

            {mode === 'login' && (
              <div className="form-extras">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="forgot-password">
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
              className="btn btn--primary btn--full"
              disabled={isLoading}
            >
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
            <span>or</span>
          </div>

          <div className="social-auth">
            <button className="btn btn--social" disabled={isLoading}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="auth-modal__footer">
            <p>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button 
                type="button" 
                className="switch-mode"
                onClick={switchMode}
                disabled={isLoading}
              >
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