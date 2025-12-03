import { useState } from "react";
import { X, AlertCircle, CheckCircle, Trash2, Loader } from "lucide-react";
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
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirm action error:", error);
    } finally {
      setIsProcessing(false);
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
        </div>

        <h3 className="confirm-modal__title">{title}</h3>

        {/* Render message as either string or JSX */}
        <div className="confirm-modal__message">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>

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
              type === "danger" ? "danger" : "primary"
            } ${confirmButtonClass}`}
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader size={16} className="spinning" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
