import { useState, useEffect } from "react";
import {
  X,
  AlertCircle,
  CheckCircle,
  Trash2,
  Loader,
  Save,
} from "lucide-react";
import "./ConfirmModal.scss";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'info'
  confirmButtonId, // Optional ID for the confirm button
  confirmButtonClass = "", // Optional additional class for confirm button
  inputProps = null, // Add this prop for form input
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen && inputProps?.defaultValue) {
      setInputValue(inputProps.defaultValue);
    } else if (!isOpen) {
      setInputValue("");
    }
  }, [isOpen, inputProps?.defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isProcessing) return;

    // If there's an input, pass the value to onConfirm
    if (inputProps) {
      await onConfirm(inputValue.trim());
    } else {
      await onConfirm();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <>
      <div
        className="modal-backdrop modal-backdrop--visible"
        onClick={isProcessing ? undefined : onClose}
      />
      <div className="confirm-modal">
        <div className="confirm-modal__icon">
          {type === "danger" && <Trash2 size={32} />}
          {type === "warning" && <AlertCircle size={32} />}
          {type === "info" && <CheckCircle size={32} />}
          {type === "save" && <Save size={32} />}
          {type === "edit" && <Edit size={32} />}
        </div>

        <h3 className="confirm-modal__title">{title}</h3>

        <div className="confirm-modal__message">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>

        {/* Input field for draft name */}
        {inputProps && (
          <div className="confirm-modal__input">
            <div className="form-group">
              <label htmlFor="confirm-modal-input">
                <strong>
                  {inputProps.label || "Name"}
                  {inputProps.isEditing && (
                    <span className="edit-badge">Editing</span>
                  )}
                </strong>
              </label>
              <input
                id="confirm-modal-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputProps.placeholder || "Enter a name"}
                autoFocus
                disabled={isProcessing}
                required
                onKeyPress={handleKeyPress}
              />
              {inputProps.hint && (
                <p className="form-hint">{inputProps.hint}</p>
              )}
            </div>
          </div>
        )}

        <div className="confirm-modal__actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isProcessing}
          >
            {cancelText}
          </button>
          <button
            id={confirmButtonId}
            className={`btn btn-${
              type === "danger"
                ? "danger"
                : type === "warning"
                ? "warning"
                : "primary"
            } ${confirmButtonClass}`}
            onClick={handleConfirm}
            disabled={isProcessing || (inputProps && !inputValue.trim())}
          >
            {isProcessing ? (
              <>
                <Loader size={16} className="spinning" />
                {inputProps?.isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                {inputProps?.isEditing ? (
                  <Edit size={18} />
                ) : (
                  <Save size={18} />
                )}
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
