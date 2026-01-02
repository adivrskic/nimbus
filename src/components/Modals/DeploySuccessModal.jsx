import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Copy,
  ExternalLink,
  Globe,
  FolderOpen,
  Rocket,
  PartyPopper,
} from "lucide-react";
import useModalAnimation from "../../hooks/useModalAnimation";
import "./DeploySuccessModal.scss";

function DeploySuccessModal({
  isOpen,
  onClose,
  deployedUrl,
  subdomain,
  onOpenProjects,
  onOpenCustomDomain,
  hasCustomDomain = false,
}) {
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    if (deployedUrl) {
      navigator.clipboard.writeText(deployedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenProjects = () => {
    closeModal();
    setTimeout(() => {
      onOpenProjects?.();
    }, 200);
  };

  const handleOpenCustomDomain = () => {
    closeModal();
    setTimeout(() => {
      onOpenCustomDomain?.();
    }, 200);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`deploy-success-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <motion.div
        className={`deploy-success-content ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Header */}
        <div className="deploy-success-header">
          <button className="deploy-success-close" onClick={closeModal}>
            <X size={16} />
          </button>
        </div>

        {/* Success Icon */}
        <div className="deploy-success-icon">
          <motion.div
            className="deploy-success-icon__circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            <PartyPopper size={32} />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h2
          className="deploy-success-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Your site is live!
        </motion.h2>

        {/* URL Box */}
        <motion.div
          className="deploy-success-url"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <a
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="deploy-success-url__link"
          >
            {deployedUrl?.replace("https://", "")}
          </a>
          <button
            onClick={copyUrl}
            className="deploy-success-url__copy"
            title={copied ? "Copied!" : "Copy URL"}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="deploy-success-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {/* Visit Site - Primary */}
          <a
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="deploy-success-btn deploy-success-btn--primary"
          >
            <ExternalLink size={16} />
            <span>Visit Site</span>
          </a>

          {/* Custom Domain - Secondary (if no custom domain yet) */}
          {!hasCustomDomain && (
            <button
              className="deploy-success-btn deploy-success-btn--secondary"
              onClick={handleOpenCustomDomain}
            >
              <Globe size={16} />
              <span>Add Custom Domain</span>
            </button>
          )}

          {/* View Projects */}
          <button
            className="deploy-success-btn deploy-success-btn--ghost"
            onClick={handleOpenProjects}
          >
            <FolderOpen size={16} />
            <span>View Projects</span>
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="deploy-success-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You can manage your site and add a custom domain anytime from your
          Projects.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default DeploySuccessModal;
