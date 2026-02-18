// components/Home/PreviewModal/PreviewModal.jsx - Unified single-row toolbar
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
  MessageSquareMore,
  FileText,
  ChevronDown,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Maximize2,
  Minimize2,
} from "lucide-react";
import GeneratedPreview from "../GeneratedPreview";
import FeedbackModal from "./FeedbackModal";
import "../../styles/modals.scss";

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
    if (filename && content) files[filename] = content;
  }
  return Object.keys(files).length > 0 ? files : null;
}

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
  isEnhancing = false,
  selections = {},
  originalPrompt = "",
  lastRequest = null,
}) {
  const [showCode, setShowCode] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeFile, setActiveFile] = useState("index.html");
  const [showPagePicker, setShowPagePicker] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const enhanceInputRef = useRef(null);
  const pagePickerRef = useRef(null);
  const containerRef = useRef(null);

  // Parse files
  const files = useMemo(() => {
    if (propFiles && Object.keys(propFiles).length > 0) return propFiles;
    return parseMultiPageHtml(html);
  }, [html, propFiles]);

  const isMultiPage = files && Object.keys(files).length > 1;
  const fileList = files ? Object.keys(files) : [];
  const currentFileIndex = fileList.indexOf(activeFile);

  const currentHtml = useMemo(() => {
    if (isMultiPage && files[activeFile]) return files[activeFile];
    return html;
  }, [isMultiPage, files, activeFile, html]);

  // Reset active file when files change
  useEffect(() => {
    if (isMultiPage && !files[activeFile]) {
      setActiveFile(fileList[0] || "index.html");
    }
  }, [files, activeFile, isMultiPage, fileList]);

  // Close page picker on outside click
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

  // Fullscreen handling
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!isFullscreen) {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(
        document
      );
    }
  }, [isFullscreen]);

  const openInNewTab = useCallback(() => {
    if (!currentHtml) return;
    const blob = new Blob([currentHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [currentHtml]);

  const getViewportLabel = () => {
    switch (viewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  if (!isOpen) return null;

  const hasInput = enhancePrompt.trim().length > 0;

  return (
    <div
      className={`modal-overlay modal-overlay--preview ${
        isOpen ? "active" : ""
      }`}
      onClick={() => {
        onClose();
        onMinimize();
      }}
    >
      <div
        ref={containerRef}
        className={`modal-content modal-content--preview ${
          isFullscreen ? "modal-content--fullscreen" : ""
        } ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== UNIFIED HEADER ===== */}
        <div className="pm-header">
          {/* Left: Tabs + Devices + Page pill */}
          <div className="pm-header__left">
            <div className="pm-header__tabs">
              <button
                className={`pm-header__tab ${!showCode ? "active" : ""}`}
                onClick={() => setShowCode(false)}
              >
                <Eye size={14} />
                <span>Preview</span>
              </button>
              <button
                className={`pm-header__tab ${showCode ? "active" : ""}`}
                onClick={() => setShowCode(true)}
              >
                <Code2 size={14} />
                <span>Code</span>
              </button>
            </div>

            {!showCode && (
              <>
                <div className="pm-header__sep" />

                <div className="pm-header__devices">
                  {[
                    { mode: "desktop", Icon: Monitor, label: "Desktop" },
                    { mode: "tablet", Icon: Tablet, label: "Tablet" },
                    { mode: "mobile", Icon: Smartphone, label: "Mobile" },
                  ].map(({ mode, Icon, label }) => (
                    <button
                      key={mode}
                      className={`pm-header__device ${
                        viewMode === mode ? "active" : ""
                      }`}
                      onClick={() => setViewMode(mode)}
                      title={label}
                      disabled={isStreaming}
                    >
                      <Icon size={14} />
                    </button>
                  ))}
                  <span className="pm-header__viewport">
                    {getViewportLabel()}
                  </span>
                </div>
              </>
            )}

            {isMultiPage && !isStreaming && (
              <>
                <div className="pm-header__sep" />
                <div className="pm-header__page-pill" ref={pagePickerRef}>
                  <button
                    className={`pm-header__page-btn ${
                      showPagePicker ? "open" : ""
                    }`}
                    onClick={() => setShowPagePicker(!showPagePicker)}
                  >
                    <FileText size={13} />
                    <span className="pm-header__page-name">
                      {getPageDisplayName(activeFile)}
                    </span>
                    <span className="pm-header__page-count">
                      {currentFileIndex + 1}/{fileList.length}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`pm-header__page-chevron ${
                        showPagePicker ? "open" : ""
                      }`}
                    />
                  </button>

                  {showPagePicker && (
                    <div className="pm-header__page-dropdown">
                      {fileList.map((filename, index) => (
                        <button
                          key={filename}
                          className={`pm-header__page-option ${
                            activeFile === filename ? "active" : ""
                          }`}
                          onClick={() => {
                            setActiveFile(filename);
                            setShowPagePicker(false);
                          }}
                        >
                          <span className="pm-header__page-option-idx">
                            {index + 1}
                          </span>
                          <span className="pm-header__page-option-name">
                            {getPageDisplayName(filename)}
                          </span>
                          {activeFile === filename && <Check size={13} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Center: Enhance input - always visible, fills remaining space */}
          <div
            className={`pm-header__center ${hasInput ? "has-input" : ""} ${
              isEnhancing ? "enhancing" : ""
            }`}
          >
            {currentHtml && !isGenerating && !isStreaming && !isEnhancing && (
              <button
                className="pm-header__enhance-fb"
                onClick={() => setShowFeedbackModal(true)}
                title="Give feedback"
              >
                <MessageSquareMore size={14} />
              </button>
            )}

            {isEnhancing && (
              <div className="pm-header__enhance-ind">
                <Loader2 size={13} className="spin" />
              </div>
            )}

            <input
              ref={enhanceInputRef}
              type="text"
              value={enhancePrompt}
              onChange={(e) => onEnhancePromptChange(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !isGenerating &&
                  !isEnhancing &&
                  hasInput
                )
                  onEnhance();
              }}
              placeholder={isEnhancing ? "Enhancing..." : "Describe changes..."}
              className="pm-header__enhance-input"
              disabled={isGenerating || isStreaming || isEnhancing}
            />

            <div className="pm-header__enhance-btns">
              {hasInput && !isEnhancing && (
                <button
                  className={`pm-header__enhance-cost ${
                    showEnhanceTokenOverlay ? "active" : ""
                  }`}
                  onClick={onToggleEnhanceTokenOverlay}
                >
                  <Coins size={13} />
                  <span>{enhanceTokenCost}</span>
                </button>
              )}

              <button
                className="pm-header__enhance-go"
                onClick={onEnhance}
                disabled={
                  isGenerating || isStreaming || isEnhancing || !hasInput
                }
              >
                {isEnhancing ? (
                  <Loader2 size={14} className="spin" />
                ) : (
                  <Sparkles size={14} />
                )}
              </button>
            </div>

            {/* Token overlay */}
            {showEnhanceTokenOverlay && (
              <div
                className="pm-header__token-overlay"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pm-header__token-head">
                  <Coins size={16} />
                  <span>{enhanceTokenCost} tokens</span>
                </div>
                <div className="pm-header__token-items">
                  {enhanceBreakdown.map((item, i) => (
                    <div
                      key={i}
                      className={`pm-header__token-row ${
                        item.type === "discount" ? "discount" : ""
                      }`}
                    >
                      <span>{item.label}</span>
                      <span>
                        {item.type === "discount" ? "-" : "+"}
                        {item.cost}
                      </span>
                    </div>
                  ))}
                </div>
                {isAuthenticated && (
                  <div className="pm-header__token-bal">
                    <span>Your balance</span>
                    <span
                      className={`pm-header__balance pm-header__balance--${tokenBalance.status}`}
                    >
                      {userTokens} tokens
                    </span>
                  </div>
                )}
                {!tokenBalance.sufficient && (
                  <button
                    className="pm-header__token-buy"
                    onClick={() => {
                      onToggleEnhanceTokenOverlay();
                      onBuyTokens();
                    }}
                  >
                    Get More Tokens
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Preview actions + File actions + Close */}
          <div className="pm-header__right">
            {!showCode && (
              <div className="pm-header__preview-actions">
                <button
                  className="pm-header__icon-btn"
                  onClick={openInNewTab}
                  title="Open in new tab"
                  disabled={isStreaming || !currentHtml}
                >
                  <ExternalLink size={14} />
                </button>
                <button
                  className="pm-header__icon-btn"
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 size={14} />
                  ) : (
                    <Maximize2 size={14} />
                  )}
                </button>
                <div className="pm-header__sep" />
              </div>
            )}

            <button
              className="pm-header__action-btn"
              onClick={onDownload}
              title="Download"
              disabled={isStreaming || isEnhancing || !currentHtml}
            >
              <Download size={14} />
              <span>{isMultiPage ? "Download All" : "Download"}</span>
            </button>

            <button
              className={`pm-header__action-btn ${
                saveSuccess ? "success" : ""
              }`}
              onClick={onSave}
              disabled={isSaving || isStreaming || isEnhancing || !currentHtml}
              title="Save"
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
              className="pm-header__close-btn"
              onClick={() => {
                onClose();
                onMinimize();
              }}
              title="Minimize"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Mobile enhance bar */}
        <div className="pm-mobile-enhance">
          <div
            className={`pm-mobile-enhance__bar ${hasInput ? "has-input" : ""} ${
              isEnhancing ? "enhancing" : ""
            }`}
          >
            {isEnhancing && (
              <div className="pm-header__enhance-ind">
                <Loader2 size={13} className="spin" />
              </div>
            )}
            <input
              type="text"
              value={enhancePrompt}
              onChange={(e) => onEnhancePromptChange(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !isGenerating &&
                  !isEnhancing &&
                  hasInput
                )
                  onEnhance();
              }}
              placeholder={isEnhancing ? "Enhancing..." : "Describe changes..."}
              disabled={isGenerating || isStreaming || isEnhancing}
            />
            <button
              onClick={onEnhance}
              disabled={isGenerating || isStreaming || isEnhancing || !hasInput}
            >
              {isEnhancing ? (
                <Loader2 size={14} className="spin" />
              ) : (
                <Sparkles size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Body */}
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
              } ${isEnhancing ? "preview-frame--enhancing" : ""}`}
            >
              <div className="preview-frame__content">
                <GeneratedPreview
                  html={currentHtml}
                  isStreaming={isStreaming}
                  viewMode={viewMode}
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}

export default PreviewModal;
