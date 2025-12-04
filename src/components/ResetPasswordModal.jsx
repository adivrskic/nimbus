// src/components/ResetPasswordModal.jsx
import { useState } from "react";
import { X, Lock, Eye, EyeOff, Loader, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./AuthModal.scss";

function ResetPasswordModal({ isOpen, onClose, onSuccess }) {
  const { updatePassword } = useAuth();
  const { shouldRender, isVisible } = useModalAnimation(isOpen, 300);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await updatePassword(formData.password);

      if (result.success) {
        setSuccessMessage("Password updated successfully!");
        setFormData({ password: "", confirmPassword: "" });

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          handleClose();
        }, 2000);
      } else {
        setErrors({ submit: result.error || "Failed to update password" });
      }
    } catch (error) {
      setErrors({
        submit: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ password: "", confirmPassword: "" });
    setErrors({});
    setSuccessMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
          <div className="auth-modal__header">
            <button className="auth-modal__close" onClick={handleClose}>
              <X size={20} />
            </button>
            <div>
              <h2>Reset Your Password</h2>
              <p>
                {successMessage
                  ? "Your password has been updated"
                  : "Enter your new password below"}
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
                <label htmlFor="password">
                  <Lock size={16} />
                  New Password
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
                    className={errors.password ? "error" : ""}
                    autoComplete="new-password"
                    autoFocus
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
                {errors.password && (
                  <span className="form-error">{errors.password}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">
                  <Lock size={16} />
                  Confirm New Password
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
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
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

              {errors.submit && (
                <div className="form-error form-error--submit">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn--full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="spinning" />
                    Updating password...
                  </>
                ) : (
                  "Update Password"
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

export default ResetPasswordModal;
