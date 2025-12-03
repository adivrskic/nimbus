import React from "react";
import { X, Upload, AlertCircle, CheckCircle } from "lucide-react";
import "./RedeployModal.scss";

function RedeployModal({
  isOpen,
  onClose,
  onConfirm,
  siteName,
  isRedeploying,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop modal-backdrop--visible"
        onClick={onClose}
      />
      <div className="redeploy-modal redeploy-modal--visible">
        <div className="redeploy-modal__header">
          <button className="redeploy-modal__close" onClick={onClose}>
            <X size={24} />
          </button>
          <h2>Redeploy Site</h2>
        </div>

        <div className="redeploy-modal__content">
          <div className="redeploy-icon">
            <Upload size={48} />
          </div>

          <h3>Save changes and redeploy "{siteName}"?</h3>

          <div className="redeploy-info">
            <div className="info-item">
              <CheckCircle size={20} />
              <span>Free redeployment for active sites</span>
            </div>
            <div className="info-item">
              <CheckCircle size={20} />
              <span>No additional charges</span>
            </div>
            <div className="info-item">
              <CheckCircle size={20} />
              <span>Live site updates in seconds</span>
            </div>
            <div className="info-item">
              <CheckCircle size={20} />
              <span>Previous version remains accessible during deployment</span>
            </div>
          </div>

          <div className="redeploy-warning">
            <AlertCircle size={20} />
            <p>
              Your site will be temporarily unavailable during redeployment
              (typically less than 30 seconds).
            </p>
          </div>
        </div>

        <div className="redeploy-modal__actions">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isRedeploying}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={onConfirm}
            disabled={isRedeploying}
          >
            {isRedeploying ? (
              <>
                <span className="spinner" />
                Redeploying...
              </>
            ) : (
              <>
                <Upload size={20} />
                Yes, Redeploy Now
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default RedeployModal;
