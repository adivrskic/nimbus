// components/Home/PreviewModal/PreviewModal.jsx - With floating page pill navigator (no arrows)
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Code as Code2,
  Download,
  Save,
  X,
  Check,
  Sparkles,
  Coins,
  Loader2,
  Info,
  MessageSquareMore,
  FileText,
  ChevronUp,
} from "lucide-react";
import GeneratedPreview from "../../GeneratedPreview";
import FeedbackModal from "../../Modals/FeedbackModal";
import {
  previewOverlayVariants,
  previewContentVariants,
  tokenContentVariants,
  tokenItemVariants,
} from "../../../configs/animations.config";
import "./PreviewModal.scss";

// Parse multi-page HTML if it contains file markers
function parseMultiPageHtml(html) {
  if (!html) return null;

  const filePattern = /<!--\s*(?:=+\s*)?FILE:\s*(\S+\.html)\s*(?:=+\s*)?-->/gi;
  const parts = html.split(filePattern);

  if (parts.length <= 1) return null;

  const files = {};
  for (let i = 1; i < parts.length; i += 2) {
    const filename = parts[i]?.trim();
    const content = parts[i + 1]?.trim();
    if (filename && content) {
      files[filename] = content;
    }
  }

  return Object.keys(files).length > 0 ? files : null;
}

// Get friendly page name from filename
function getPageDisplayName(filename) {
  const names = {
    "index.html": "Home",
    "about.html": "About",
    "services.html": "Services",
    "contact.html": "Contact",
    "products.html": "Products",
    "product-detail.html": "Product Detail",
    "cart.html": "Cart",
    "blog.html": "Blog",
    "post.html": "Blog Post",
    "dashboard.html": "Dashboard",
    "settings.html": "Settings",
    "getting-started.html": "Getting Started",
    "api-reference.html": "API Reference",
    "examples.html": "Examples",
  };
  return names[filename] || filename.replace(".html", "").replace(/-/g, " ");
}

function PreviewModal({
  isOpen,
  html,
  files: propFiles,
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
  selections = {},
  originalPrompt = "",
  lastRequest = null,
}) {
  const [showCode, setShowCode] = useState(false);
  const [showStreamingModal, setShowStreamingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeFile, setActiveFile] = useState("index.html");
  const [showPagePicker, setShowPagePicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const enhanceInputRef = useRef(null);
  const pagePickerRef = useRef(null);

  // Parse files from HTML or use provided files object
  const files = useMemo(() => {
    if (propFiles && Object.keys(propFiles).length > 0) {
      return propFiles;
    }
    return parseMultiPageHtml(html);
  }, [html, propFiles]);

  const isMultiPage = files && Object.keys(files).length > 1;
  const fileList = files ? Object.keys(files) : [];
  const currentFileIndex = fileList.indexOf(activeFile);

  // Get current file content
  const currentHtml = useMemo(() => {
    if (isMultiPage && files[activeFile]) {
      return files[activeFile];
    }
    return html;
  }, [isMultiPage, files, activeFile, html]);

  // Reset active file when files change
  useEffect(() => {
    if (isMultiPage && !files[activeFile]) {
      setActiveFile(fileList[0] || "index.html");
    }
  }, [files, activeFile, isMultiPage, fileList]);

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

  // Close page picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pagePickerRef.current && !pagePickerRef.current.contains(e.target)) {
        setShowPagePicker(false);
      }
    };

    if (showPagePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPagePicker]);

  if (!isOpen) return null;

  const hasInput = enhancePrompt.trim().length > 0;

  const enhanceSection = (
    <div className="preview-modal__enhance">
      <div
        className={`preview-modal__enhance-container ${
          isFocused ? "focused" : ""
        } ${hasInput ? "has-input" : ""}`}
      >
        {/* Feedback button - left side */}
        {currentHtml && !isGenerating && !isStreaming && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="preview-modal__enhance-feedback"
            onClick={() => setShowFeedbackModal(true)}
            title="Give feedback"
          >
            <MessageSquareMore size={16} />
          </motion.button>
        )}

        <input
          ref={enhanceInputRef}
          type="text"
          value={enhancePrompt}
          onChange={(e) => onEnhancePromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isGenerating && hasInput) onEnhance();
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe changes..."
          className="preview-modal__enhance-input"
          disabled={isGenerating || isStreaming}
        />

        {/* Actions - right side inside input */}
        <div className="preview-modal__enhance-actions">
          <AnimatePresence>
            {hasInput && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className={`preview-modal__enhance-token ${
                  showEnhanceTokenOverlay ? "active" : ""
                }`}
                onClick={onToggleEnhanceTokenOverlay}
                disabled={isStreaming}
              >
                <Coins size={14} />
                <span>{enhanceTokenCost}</span>
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            className="preview-modal__enhance-submit"
            onClick={onEnhance}
            disabled={isGenerating || isStreaming || !hasInput}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? (
              <Loader2 size={16} className="spin" />
            ) : (
              <Sparkles size={16} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Token overlay */}
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
            {!tokenBalance.sufficient && (
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
              disabled={isStreaming || !currentHtml}
            >
              <Download size={14} />
              <span>{isMultiPage ? "Download All" : "Download"}</span>
            </button>

            <button
              className={`preview-modal__action-btn ${
                saveSuccess ? "success" : ""
              }`}
              onClick={onSave}
              disabled={isSaving || isStreaming || !currentHtml}
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
                <code>{currentHtml}</code>
              </pre>
            </div>
          ) : (
            <div
              className={`preview-frame ${
                isStreaming ? "preview-frame--streaming" : ""
              }`}
            >
              <div className="preview-frame__content">
                <GeneratedPreview
                  html={currentHtml}
                  isStreaming={isStreaming}
                />
              </div>

              {/* Floating Page Pill Navigator - Bottom Center */}
              {isMultiPage && !isStreaming && (
                <div className="page-pill" ref={pagePickerRef}>
                  {/* Dropdown appears above the pill, centered */}
                  <AnimatePresence>
                    {showPagePicker && (
                      <motion.div
                        className="page-pill__dropdown"
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        {fileList.map((filename, index) => (
                          <button
                            key={filename}
                            className={`page-pill__dropdown-item ${
                              activeFile === filename ? "active" : ""
                            }`}
                            onClick={() => {
                              setActiveFile(filename);
                              setShowPagePicker(false);
                            }}
                          >
                            <span className="page-pill__dropdown-index">
                              {index + 1}
                            </span>
                            <span className="page-pill__dropdown-name">
                              {getPageDisplayName(filename)}
                            </span>
                            {activeFile === filename && <Check size={14} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* The pill button */}
                  <button
                    className={`page-pill__button ${
                      showPagePicker ? "open" : ""
                    }`}
                    onClick={() => setShowPagePicker(!showPagePicker)}
                    title="Select page"
                  >
                    <FileText size={14} />
                    <span className="page-pill__name">
                      {getPageDisplayName(activeFile)}
                    </span>
                    <span className="page-pill__count">
                      {currentFileIndex + 1}/{fileList.length}
                    </span>
                    <ChevronUp
                      size={14}
                      className={`page-pill__chevron ${
                        showPagePicker ? "open" : ""
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Streaming Info Modal */}
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
              {isMultiPage && (
                <div className="preview-modal__streaming-modal-pages">
                  <Info size={14} />
                  <span>
                    Generating{" "}
                    {fileList.length > 0 ? fileList.length : "multiple"}{" "}
                    pages...
                  </span>
                </div>
              )}
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

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            lastRequest={lastRequest}
            selections={selections}
            generatedCode={currentHtml}
            originalPrompt={originalPrompt}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PreviewModal;
