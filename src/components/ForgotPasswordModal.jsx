// src/components/ForgotPasswordModal.jsx
import { useState } from "react";
import { X, Mail, Loader, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./AuthModal.scss";

function ForgotPasswordModal({ isOpen, onClose }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccessMessage(result.message);
        setEmail("");
        // Close modal after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(result.error || "Failed to send reset email");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccessMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop modal-backdrop--visible"
        onClick={handleClose}
      />
      <div className="auth-modal">
        <div className="auth-modal__content">
          <div className="auth-modal__header">
            <button className="auth-modal__close" onClick={handleClose}>
              <X size={20} />
            </button>
            <div>
              <h2>Reset Password</h2>
              <p>
                {successMessage
                  ? "Check your email"
                  : "Enter your email and we'll send you a reset link"}
              </p>
            </div>
          </div>

          {successMessage ? (
            <div className="success-message success-message--large">
              <CheckCircle size={48} />
              <p>{successMessage}</p>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={error ? "error" : ""}
                  autoComplete="email"
                  autoFocus
                />
                {error && <span className="form-error">{error}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn--full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn--full"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordModal;
