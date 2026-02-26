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
  AlertCircle,
  History,
  Clock,
} from "lucide-react";
import GeneratedPreview from "../GeneratedPreview";
import FeedbackModal from "./FeedbackModal";
import {
  parseMultiPageHtml,
  getPageDisplayName,
} from "../../utils/parseMultiPage";
import "../../styles/modals.scss";

// ─── Fix #17: Lightweight HTML syntax highlighter ───────────────────────────
// Produces spans with class names for CSS coloring. No external dependency.
function highlightHtml(code) {
  if (!code) return "";
  return (
    code
      // HTML comments
      .replace(
        /(&lt;!--[\s\S]*?--&gt;|<!--[\s\S]*?-->)/g,
        '<span class="hl-comment">$1</span>'
      )
      // Tags (opening + closing)
      .replace(
        /(&lt;\/?|<\/?)([a-zA-Z][a-zA-Z0-9-]*)/g,
        '$1<span class="hl-tag">$2</span>'
      )
      // Attribute names
      .replace(/\s([a-zA-Z-]+)(=)/g, ' <span class="hl-attr">$1</span>$2')
      // Strings (double and single quoted)
      .replace(
        /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
        '<span class="hl-string">$1</span>'
      )
  );
}

/**
 * Props shape:
 *
 *   isOpen, html, files, onClose, onMinimize, onDownload
 *
 *   saveProps:       { onSave, isSaving, saveSuccess }
 *   enhanceProps:    { prompt, onChange, onEnhance, tokenCost, breakdown,
 *                      showTokenOverlay, onToggleTokenOverlay }
 *   tokenProps:      { isAuthenticated, userTokens, balance, onBuyTokens }
 *   generationState: { isGenerating, isStreaming, isEnhancing, streamingPhase, error }
 *
 *   versionProps:    { versions, currentVersionId, onSelectVersion }
 *
 *   selections, originalPrompt, lastRequest   (for feedback modal)
 */
function PreviewModal({
  isOpen,
  html,
  files: propFiles,
  onClose,
  onMinimize,
  onDownload,
  saveProps = {},
  enhanceProps = {},
  tokenProps = {},
  generationState = {},
  versionProps = {},
  selections = {},
  originalPrompt = "",
  lastRequest = null,
}) {
  // Destructure grouped props
  const { onSave, isSaving = false, saveSuccess = false } = saveProps;
  const {
    prompt: enhancePrompt = "",
    onChange: onEnhancePromptChange,
    onEnhance,
    tokenCost: enhanceTokenCost = 0,
    breakdown: enhanceBreakdown = [],
    showTokenOverlay: showEnhanceTokenOverlay = false,
    onToggleTokenOverlay: onToggleEnhanceTokenOverlay,
  } = enhanceProps;
  const {
    isAuthenticated = false,
    userTokens = 0,
    balance: tokenBalance = {},
    onBuyTokens,
  } = tokenProps;
  const {
    isGenerating = false,
    isStreaming = false,
    isEnhancing = false,
    error: generationError = null,
  } = generationState;
  const {
    versions = [],
    currentVersionId = null,
    onSelectVersion,
  } = versionProps;

  const [showCode, setShowCode] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeFile, setActiveFile] = useState("index.html");
  const [showPagePicker, setShowPagePicker] = useState(false);
  const [showVersionPicker, setShowVersionPicker] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const enhanceInputRef = useRef(null);
  const pagePickerRef = useRef(null);
  const versionPickerRef = useRef(null);
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

  // Fix #17: Memoised highlighted code
  const highlightedCode = useMemo(() => {
    if (!currentHtml) return "";
    // Escape HTML entities first, then apply highlighting
    const escaped = currentHtml
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return highlightHtml(escaped);
  }, [currentHtml]);

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
      if (
        versionPickerRef.current &&
        !versionPickerRef.current.contains(e.target)
      ) {
        setShowVersionPicker(false);
      }
    };
    if (showPagePicker || showVersionPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPagePicker, showVersionPicker]);

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

  const hasVersions = versions.length > 1;

  const getCurrentVersionLabel = () => {
    if (!hasVersions) return null;
    if (!currentVersionId) return `v${versions.length}`;
    const idx = versions.findIndex((v) => v.id === currentVersionId);
    if (idx >= 0) return `v${versions.length - idx}`;
    return `v${versions.length}`;
  };

  const formatVersionTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  const hasInput = enhancePrompt.trim().length > 0;
  const hasContent = !!currentHtml;

  // Fix #15/#16: Determine body state
  const showError =
    !isGenerating && !isStreaming && generationError && !hasContent;
  const showLoading = isGenerating && !hasContent && !generationError;

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
      {/* Fix #20: Override mobile CSS to show single enhance bar instead of duplicate */}
      <style>{`
        /* Fix #17: Syntax highlight colors */
        .hl-tag { color: #22863a; }
        .hl-attr { color: #6f42c1; }
        .hl-string { color: #032f62; }
        .hl-comment { color: #6a737d; font-style: italic; }
        [data-theme="dark"] .hl-tag { color: #7ee787; }
        [data-theme="dark"] .hl-attr { color: #d2a8ff; }
        [data-theme="dark"] .hl-string { color: #a5d6ff; }
        [data-theme="dark"] .hl-comment { color: #8b949e; }
      `}</style>

      <div
        ref={containerRef}
        className={`modal-content modal-content--preview ${
          isFullscreen ? "modal-content--fullscreen" : ""
        } ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===== UNIFIED HEADER ===== */}
        <div className="pm-header" style={{ position: "relative" }}>
          {/* Left: Tabs + Devices + Page pill + Version pill */}
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

            {/* Version picker pill */}
            {hasVersions && !isStreaming && !isEnhancing && (
              <>
                <div className="pm-header__sep" />
                <div className="pm-header__version-pill" ref={versionPickerRef}>
                  <button
                    className={`pm-header__version-btn ${
                      showVersionPicker ? "open" : ""
                    }`}
                    onClick={() => setShowVersionPicker(!showVersionPicker)}
                  >
                    <History size={13} />
                    <span className="pm-header__version-label">
                      {getCurrentVersionLabel()}
                    </span>
                    <ChevronDown
                      size={12}
                      className={`pm-header__page-chevron ${
                        showVersionPicker ? "open" : ""
                      }`}
                    />
                  </button>

                  {showVersionPicker && (
                    <div className="pm-header__version-dropdown">
                      <div className="pm-header__version-dropdown-title">
                        Version History
                      </div>
                      {versions.map((version, index) => {
                        const vNum = versions.length - index;
                        const isActive =
                          version.id === currentVersionId ||
                          (!currentVersionId && index === 0);
                        return (
                          <button
                            key={version.id}
                            className={`pm-header__version-option ${
                              isActive ? "active" : ""
                            }`}
                            onClick={() => {
                              onSelectVersion?.(version);
                              setShowVersionPicker(false);
                            }}
                          >
                            <span className="pm-header__version-option-badge">
                              v{vNum}
                            </span>
                            <div className="pm-header__version-option-info">
                              <span className="pm-header__version-option-name">
                                {version.isInitial
                                  ? "Initial generation"
                                  : version.label ||
                                    version.prompt ||
                                    "Enhancement"}
                              </span>
                              <span className="pm-header__version-option-time">
                                <Clock size={9} />
                                {formatVersionTime(version.timestamp)}
                              </span>
                            </div>
                            {isActive && <Check size={13} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/*
            Fix #20: Single enhance bar — visible on all breakpoints.
            The "pm-header__center--unified" class overrides the default
            mobile `display:none` on pm-header__center and repositions
            the bar below the header on small screens.
          */}
          <div
            className={`pm-header__center pm-header__center--unified ${
              hasInput ? "has-input" : ""
            } ${isEnhancing ? "enhancing" : ""}`}
          >
            {hasContent && !isGenerating && !isStreaming && !isEnhancing && (
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
                  disabled={isStreaming || !hasContent}
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
              disabled={isStreaming || isEnhancing || !hasContent}
            >
              <Download size={14} />
              <span>{isMultiPage ? "Download All" : "Download"}</span>
            </button>

            <button
              className={`pm-header__action-btn ${
                saveSuccess ? "success" : ""
              }`}
              onClick={onSave}
              disabled={isSaving || isStreaming || isEnhancing || !hasContent}
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

        {/* Fix #20: Removed duplicate pm-mobile-enhance section.
            The single enhance bar above (pm-header__center--unified) now
            repositions itself below the header on mobile via CSS. */}

        {/* Body */}
        <div className="preview-modal__body">
          {/* Fix #15: Error state */}
          {showError ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "48px 24px",
                color: "var(--color-text-secondary)",
                textAlign: "center",
              }}
            >
              <AlertCircle
                size={32}
                style={{ color: "var(--color-error, #ef4444)", opacity: 0.8 }}
              />
              <p
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                Generation failed
              </p>
              <p style={{ fontSize: "0.8125rem", maxWidth: "360px" }}>
                {generationError}
              </p>
            </div>
          ) : /* Fix #16: Loading / skeleton state */
          showLoading ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                padding: "48px 24px",
                color: "var(--color-text-secondary)",
              }}
            >
              <Loader2
                size={28}
                className="spin"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <p style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                Generating your website&hellip;
              </p>
              {/* Skeleton lines */}
              <div
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >
                {[100, 85, 92, 60].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: "12px",
                      width: `${w}%`,
                      borderRadius: "6px",
                      background: "var(--color-surface-elevated)",
                      animation: "pulse 1.5s ease-in-out infinite",
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 0.4; }
                  50% { opacity: 1; }
                }
              `}</style>
            </div>
          ) : showCode ? (
            /* Fix #17: Syntax-highlighted code view */
            <div className="preview-modal__code">
              <pre>
                <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
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
                  isEnhancing={isEnhancing}
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
