// components/Home/PreviewModal/PreviewModal.jsx - Streaming support added
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Code as Code2,
  Download,
  Save,
  Rocket,
  X,
  Check,
  Sparkles,
  Coins,
  Loader2,
  Info,
} from "lucide-react";
import GeneratedPreview from "../../GeneratedPreview";
import {
  previewOverlayVariants,
  previewContentVariants,
  tokenContentVariants,
  tokenItemVariants,
} from "../../../configs/animations.config";
import "./PreviewModal.scss";

function PreviewModal({
  isOpen,
  html,
  onClose,
  onMinimize,
  onDownload,
  onSave,
  onDeploy,
  isSaving,
  saveSuccess,
  isGenerating,
  enhancePrompt,
  onEnhancePromptChange,
  onEnhance,
  enhanceTokenCost,
  enhanceBreakdown,
  showEnhanceTokenOverlay,
  onToggleEnhanceTokenOverlay,
  isAuthenticated,
  userTokens,
  tokenBalance,
  onBuyTokens,
  isStreaming = false,
}) {
  const [showCode, setShowCode] = useState(false);
  const [showStreamingModal, setShowStreamingModal] = useState(false);
  const enhanceInputRef = useRef(null);

  // Show streaming modal when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setShowStreamingModal(true);
    }
  }, [isStreaming]);

  // Reset modal state when streaming completes
  useEffect(() => {
    if (!isStreaming) {
      setShowStreamingModal(false);
    }
  }, [isStreaming]);

  if (!isOpen) return null;

  const enhanceSection = (
    <div className="preview-modal__enhance">
      <div className="preview-modal__enhance-wrapper">
        <input
          ref={enhanceInputRef}
          type="text"
          value={enhancePrompt}
          onChange={(e) => onEnhancePromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isGenerating) onEnhance();
          }}
          placeholder="Describe changes..."
          className="preview-modal__enhance-input"
          disabled={isGenerating || isStreaming}
        />
      </div>
      <div className="preview-modal__enhance-actions">
        <AnimatePresence>
          {enhancePrompt.trim() && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`preview-modal__token-btn ${
                showEnhanceTokenOverlay ? "active" : ""
              }`}
              onClick={onToggleEnhanceTokenOverlay}
              disabled={isStreaming}
            >
              <Coins size={14} />
              <span>-{enhanceTokenCost}</span>
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          className="preview-modal__submit-btn"
          onClick={onEnhance}
          disabled={isGenerating || isStreaming || !enhancePrompt.trim()}
        >
          {isGenerating ? (
            <Loader2 size={16} className="spin" />
          ) : (
            <Sparkles size={16} />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showEnhanceTokenOverlay && (
          <motion.div
            className="preview-modal__token-overlay"
            onClick={(e) => e.stopPropagation()}
            variants={tokenContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="preview-modal__token-header"
              variants={tokenItemVariants}
            >
              <Coins size={18} />
              <span className="preview-modal__token-total">
                {enhanceTokenCost} tokens
              </span>
            </motion.div>
            <motion.div className="preview-modal__token-breakdown">
              {enhanceBreakdown.map((item, i) => (
                <motion.div
                  key={i}
                  className={`preview-modal__token-item ${
                    item.type === "discount" ? "discount" : ""
                  }`}
                  variants={tokenItemVariants}
                >
                  <span>{item.label}</span>
                  <span>
                    {item.type === "discount" ? "-" : "+"}
                    {item.cost}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            {isAuthenticated && (
              <motion.div
                className="preview-modal__token-balance"
                variants={tokenItemVariants}
              >
                <span>Your balance</span>
                <span
                  className={`preview-modal__balance-value preview-modal__balance-value--${tokenBalance.status}`}
                >
                  {userTokens} tokens
                </span>
              </motion.div>
            )}
            {(!isAuthenticated || userTokens < enhanceTokenCost) && (
              <motion.button
                className="preview-modal__buy-btn"
                onClick={() => {
                  onToggleEnhanceTokenOverlay();
                  onBuyTokens();
                }}
                variants={tokenItemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Get More Tokens
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      className="preview-modal"
      onClick={() => {
        onClose();
        onMinimize();
      }}
      variants={previewOverlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="preview-modal__container"
        onClick={(e) => e.stopPropagation()}
        variants={previewContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="preview-modal__header">
          <div className="preview-modal__tabs">
            <button
              className={`preview-modal__tab ${!showCode ? "active" : ""}`}
              onClick={() => setShowCode(false)}
            >
              <Eye size={14} />
              <span>Preview</span>
            </button>
            <button
              className={`preview-modal__tab ${showCode ? "active" : ""}`}
              onClick={() => setShowCode(true)}
            >
              <Code2 size={14} />
              <span>Code</span>
            </button>
          </div>

          {/* Enhance section in header - desktop only */}
          <div className="preview-modal__enhance-desktop">{enhanceSection}</div>

          <div className="preview-modal__actions">
            <button
              className="preview-modal__action-btn"
              onClick={onDownload}
              title="Download HTML"
              disabled={isStreaming || !html}
            >
              <Download size={14} />
              <span>Download</span>
            </button>

            <button
              className={`preview-modal__action-btn ${
                saveSuccess ? "success" : ""
              }`}
              onClick={onSave}
              disabled={isSaving || isStreaming || !html}
              title="Save to Projects"
            >
              {isSaving ? (
                <Loader2 size={14} className="spin" />
              ) : saveSuccess ? (
                <>
                  <Check size={14} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save</span>
                </>
              )}
            </button>

            <button
              className="preview-modal__close-btn"
              onClick={() => {
                onClose();
                onMinimize();
              }}
              title="Minimize"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Enhance section below header - mobile only */}
        <div className="preview-modal__enhance-mobile">{enhanceSection}</div>

        <div className="preview-modal__body">
          {showCode ? (
            <div className="preview-modal__code">
              <pre>
                <code>{html}</code>
              </pre>
            </div>
          ) : (
            <div
              className={`preview-frame ${
                isStreaming ? "preview-frame--streaming" : ""
              }`}
            >
              <div className="preview-frame__content">
                <GeneratedPreview html={html} isStreaming={isStreaming} />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Streaming Info Modal - Outside container, fixed overlay */}
      <AnimatePresence>
        {isStreaming && showStreamingModal && (
          <motion.div
            className="preview-modal__streaming-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="preview-modal__streaming-modal-content"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", duration: 0.4, delay: 0.05 }}
            >
              <div className="preview-modal__streaming-modal-header">
                <div className="preview-modal__streaming-modal-icon">
                  <Loader2 size={20} className="spin" />
                </div>
                <span className="preview-modal__streaming-modal-title">
                  Generating Your Website
                </span>
                <button
                  className="preview-modal__streaming-modal-close"
                  onClick={() => setShowStreamingModal(false)}
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <p>
                Please be patient as your website is being generated in
                real-time. You can close this or click Watch Generation to view.
              </p>
              <div className="preview-modal__streaming-modal-tips">
                <div className="preview-modal__streaming-modal-tip warning">
                  <Info size={14} />
                  <span>Don't close the browser tab</span>
                </div>
              </div>
              <button
                className="preview-modal__streaming-modal-btn"
                onClick={() => setShowStreamingModal(false)}
              >
                Watch Generation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PreviewModal;
