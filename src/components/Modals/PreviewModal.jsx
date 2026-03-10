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
  Cloudy,
  Copy,
  RotateCcw,
  Globe,
  Braces,
  Hexagon,
  Rocket,
} from "lucide-react";
import GeneratedPreview from "../GeneratedPreview";
import FeedbackModal from "./FeedbackModal";
import {
  parseMultiPageHtml,
  getPageDisplayName,
} from "../../utils/parseMultiPage";
import { EXPORT_FORMATS } from "../../utils/exportScaffold";
import "../../styles/modals.scss";

function highlightHtml(code) {
  if (!code) return "";
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-comment">$1</span>')
    .replace(
      /(&lt;\/??)([a-zA-Z][a-zA-Z0-9-]*)/g,
      '$1<span class="hl-tag">$2</span>'
    )
    .replace(/\s([a-zA-Z\-:]+)(=)/g, ' <span class="hl-attr">$1</span>$2')
    .replace(
      /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
      '<span class="hl-string">$1</span>'
    );
}

const FORMAT_ICONS = {
  html: Globe,
  "vite-react": Braces,
  nextjs: Hexagon,
  astro: Rocket,
};

function PreviewModal({
  isOpen,
  html,
  files: propFiles,
  onClose,
  onMinimize,
  onDownload,
  onCodeChange,
  saveProps = {},
  enhanceProps = {},
  tokenProps = {},
  generationState = {},
  versionProps = {},
  selections = {},
  originalPrompt = "",
  lastRequest = null,
  onEnhancePromptChange = null,
}) {
  const { onSave, isSaving = false, saveSuccess = false } = saveProps;
  const {
    prompt: enhancePrompt = "",
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
    streamingPhase = null,
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
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [viewMode, setViewMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const [editedCode, setEditedCode] = useState(null);
  const [isCodeDirty, setIsCodeDirty] = useState(false);
  const debounceTimerRef = useRef(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightRef = useRef(null);

  const enhanceInputRef = useRef(null);
  const pagePickerRef = useRef(null);
  const versionPickerRef = useRef(null);
  const downloadDialogRef = useRef(null);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  const toggleSection = useCallback((section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
    setShowPagePicker(false);
    setShowVersionPicker(false);
    setShowDownloadDialog(false);
  }, []);

  const files = useMemo(() => {
    if (propFiles && Object.keys(propFiles).length > 0) return propFiles;
    return parseMultiPageHtml(html);
  }, [html, propFiles]);

  const isMultiPage = files && Object.keys(files).length > 1;
  const fileList = files ? Object.keys(files) : [];
  const currentFileIndex = fileList.indexOf(activeFile);

  const sourceHtml = useMemo(() => {
    if (isMultiPage && files[activeFile]) return files[activeFile];
    return html;
  }, [isMultiPage, files, activeFile, html]);

  const currentHtml = editedCode !== null ? editedCode : sourceHtml;

  const highlightedCode = useMemo(() => {
    if (!currentHtml) return "";
    return highlightHtml(currentHtml);
  }, [currentHtml]);

  const lineCount = useMemo(() => {
    if (!currentHtml) return 1;
    return currentHtml.split("\n").length;
  }, [currentHtml]);

  const showHeadMessage = useMemo(() => {
    return (
      isStreaming &&
      streamingPhase === "head" &&
      (!currentHtml || !currentHtml.includes("<body"))
    );
  }, [isStreaming, streamingPhase, currentHtml]);

  useEffect(() => {
    setEditedCode(null);
    setIsCodeDirty(false);
  }, [sourceHtml]);

  useEffect(() => {
    if (isMultiPage && !files[activeFile]) {
      setActiveFile(fileList[0] || "index.html");
    }
  }, [files, activeFile, isMultiPage, fileList]);

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
      if (
        downloadDialogRef.current &&
        !downloadDialogRef.current.contains(e.target)
      ) {
        setShowDownloadDialog(false);
      }
    };
    if (showPagePicker || showVersionPicker || showDownloadDialog) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPagePicker, showVersionPicker, showDownloadDialog]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const handleCodeScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const top = ta.scrollTop;
    const left = ta.scrollLeft;
    if (lineNumbersRef.current) {
      const gutter = lineNumbersRef.current.querySelector(
        ".code-editor__gutter"
      );
      if (gutter) gutter.style.transform = `translateY(-${top}px)`;
    }
    if (highlightRef.current) {
      highlightRef.current.scrollTop = top;
      highlightRef.current.scrollLeft = left;
    }
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

  const handleCodeEdit = useCallback(
    (e) => {
      const newCode = e.target.value;
      setEditedCode(newCode);
      setIsCodeDirty(true);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onCodeChange?.(newCode);
      }, 500);
    },
    [onCodeChange]
  );

  const handleResetCode = useCallback(() => {
    setEditedCode(null);
    setIsCodeDirty(false);
    onCodeChange?.(sourceHtml);
  }, [sourceHtml, onCodeChange]);

  const handleCopyCode = useCallback(async () => {
    if (!currentHtml) return;
    try {
      await navigator.clipboard.writeText(currentHtml);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = currentHtml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [currentHtml]);

  const handleCodeKeyDown = useCallback((e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const val = ta.value;
      ta.value = val.substring(0, start) + "  " + val.substring(end);
      ta.selectionStart = ta.selectionEnd = start + 2;
      const evt = new Event("input", { bubbles: true });
      ta.dispatchEvent(evt);
    }
  }, []);

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
    if (idx >= 0) return `v${idx + 1}`;
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

  const showError =
    !isGenerating && !isStreaming && generationError && !hasContent;

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
        <div className="pm-bar" ref={headerRef}>
          {(isStreaming || isEnhancing) && (
            <div
              className="pm-bar__loading-bar"
              style={{
                position: "absolute",
                top: "-8px",
                left: 0,
                right: 0,
                height: "2px",
                borderRadius: "1px",
                overflow: "hidden",
                transform: "translateY(-100%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, var(--color-accent, #6366f1), transparent)",
                  animation: "pm-loading-slide 1.5s ease-in-out infinite",
                }}
              />
            </div>
          )}
          <style>{`
            @keyframes pm-loading-slide {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
          <div className="pm-bar__brand">
            <Cloudy size={16} />
          </div>

          <div
            className={`pm-bar__section pm-bar__section--view ${
              expandedSection === "view" ? "expanded" : "collapsed"
            }`}
          >
            <button
              className={`pm-bar__trigger ${
                expandedSection === "view" ? "active" : ""
              }`}
              onClick={() => toggleSection("view")}
              title="View options"
            >
              {showCode ? <Code2 size={15} /> : <Eye size={15} />}
            </button>
            <div className="pm-bar__section-body">
              <div className="pm-bar__tabs">
                <button
                  className={`pm-bar__tab ${!showCode ? "active" : ""}`}
                  onClick={() => setShowCode(false)}
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
                <button
                  className={`pm-bar__tab ${showCode ? "active" : ""}`}
                  onClick={() => setShowCode(true)}
                >
                  <Code2 size={13} />
                  <span>Code</span>
                  {isCodeDirty && <span className="pm-bar__dot" />}
                </button>
              </div>

              <div className="pm-bar__sep" />

              {!showCode && (
                <div className="pm-bar__devices">
                  {[
                    { mode: "desktop", Icon: Monitor, label: "Desktop" },
                    { mode: "tablet", Icon: Tablet, label: "Tablet" },
                    { mode: "mobile", Icon: Smartphone, label: "Mobile" },
                  ].map(({ mode, Icon, label }) => (
                    <button
                      key={mode}
                      className={`pm-bar__device ${
                        viewMode === mode ? "active" : ""
                      }`}
                      onClick={() => setViewMode(mode)}
                      title={label}
                      disabled={isStreaming}
                    >
                      <Icon size={13} />
                    </button>
                  ))}
                </div>
              )}

              {showCode && (
                <div className="pm-bar__code-tools">
                  <button
                    className={`pm-bar__tool-btn ${
                      copySuccess ? "success" : ""
                    }`}
                    onClick={handleCopyCode}
                    title="Copy code"
                    disabled={!hasContent}
                  >
                    {copySuccess ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copySuccess ? "Copied" : "Copy"}</span>
                  </button>
                  {isCodeDirty && (
                    <button
                      className="pm-bar__tool-btn"
                      onClick={handleResetCode}
                      title="Reset"
                    >
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isMultiPage && !isStreaming && (
            <div
              className={`pm-bar__section ${
                expandedSection === "pages" ? "expanded" : "collapsed"
              }`}
              ref={pagePickerRef}
            >
              <button
                className={`pm-bar__trigger ${
                  expandedSection === "pages" ? "active" : ""
                }`}
                onClick={() => toggleSection("pages")}
                title="Pages"
              >
                <FileText size={15} />
              </button>
              <div className="pm-bar__section-body">
                <button
                  className={`pm-bar__pill-btn ${showPagePicker ? "open" : ""}`}
                  onClick={() => setShowPagePicker(!showPagePicker)}
                >
                  <span>{getPageDisplayName(activeFile)}</span>
                  <span className="pm-bar__pill-count">
                    {currentFileIndex + 1}/{fileList.length}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`pm-bar__chevron ${
                      showPagePicker ? "open" : ""
                    }`}
                  />
                </button>
              </div>
              {showPagePicker && (
                <div className="pm-bar__dropdown">
                  {fileList.map((filename, index) => (
                    <button
                      key={filename}
                      className={`pm-bar__dropdown-item ${
                        activeFile === filename ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveFile(filename);
                        setShowPagePicker(false);
                      }}
                    >
                      <span className="pm-bar__dropdown-idx">{index + 1}</span>
                      <span className="pm-bar__dropdown-label">
                        {getPageDisplayName(filename)}
                      </span>
                      {activeFile === filename && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {hasVersions && !isStreaming && !isEnhancing && (
            <div
              className={`pm-bar__section ${
                expandedSection === "version" ? "expanded" : "collapsed"
              }`}
              ref={versionPickerRef}
            >
              <button
                className={`pm-bar__trigger ${
                  expandedSection === "version" ? "active" : ""
                }`}
                onClick={() => toggleSection("version")}
                title="Version history"
              >
                <History size={15} />
              </button>
              <div className="pm-bar__section-body">
                <button
                  className={`pm-bar__pill-btn ${
                    showVersionPicker ? "open" : ""
                  }`}
                  onClick={() => setShowVersionPicker(!showVersionPicker)}
                >
                  <span>{getCurrentVersionLabel()}</span>
                  <ChevronDown
                    size={11}
                    className={`pm-bar__chevron ${
                      showVersionPicker ? "open" : ""
                    }`}
                  />
                </button>
              </div>
              {showVersionPicker && (
                <div className="pm-bar__dropdown pm-bar__dropdown--versions">
                  <div className="pm-bar__dropdown-title">Version History</div>
                  {[...versions].reverse().map((version) => {
                    const vNum =
                      versions.findIndex((v) => v.id === version.id) + 1;
                    const isActive =
                      version.id === currentVersionId ||
                      (!currentVersionId &&
                        version.id === versions[versions.length - 1]?.id);
                    return (
                      <button
                        key={version.id}
                        className={`pm-bar__dropdown-item ${
                          isActive ? "active" : ""
                        }`}
                        onClick={() => {
                          onSelectVersion?.(version);
                          setShowVersionPicker(false);
                        }}
                      >
                        <span className="pm-bar__dropdown-badge">v{vNum}</span>
                        <div className="pm-bar__dropdown-info">
                          <span className="pm-bar__dropdown-label">
                            {version.isInitial
                              ? "Initial generation"
                              : version.label ||
                                version.prompt ||
                                "Enhancement"}
                          </span>
                          <span className="pm-bar__dropdown-time">
                            <Clock size={9} />
                            {formatVersionTime(version.timestamp)}
                          </span>
                        </div>
                        {isActive && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div
            className={`pm-bar__enhance ${hasInput ? "has-input" : ""} ${
              isEnhancing ? "enhancing" : ""
            }`}
          >
            {hasContent && !isGenerating && !isStreaming && !isEnhancing && (
              <button
                className="pm-bar__enhance-fb"
                onClick={() => setShowFeedbackModal(true)}
                title="Give feedback"
              >
                <MessageSquareMore size={14} />
              </button>
            )}

            {isEnhancing && (
              <div className="pm-bar__enhance-ind">
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
              className="pm-bar__enhance-input"
              disabled={isGenerating || isStreaming || isEnhancing}
            />

            <div className="pm-bar__enhance-btns">
              {hasInput && !isEnhancing && (
                <button
                  className={`pm-bar__enhance-cost ${
                    showEnhanceTokenOverlay ? "active" : ""
                  }`}
                  onClick={onToggleEnhanceTokenOverlay}
                >
                  <Coins size={13} />
                  <span>{enhanceTokenCost}</span>
                </button>
              )}
              <button
                className="pm-bar__enhance-go"
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

            {showEnhanceTokenOverlay && (
              <div
                className="pm-bar__token-overlay"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pm-bar__token-head">
                  <Coins size={16} />
                  <span>{enhanceTokenCost} tokens</span>
                </div>
                <div className="pm-bar__token-items">
                  {enhanceBreakdown.map((item, i) => (
                    <div
                      key={i}
                      className={`pm-bar__token-row ${
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
                  <div className="pm-bar__token-bal">
                    <span>Your balance</span>
                    <span
                      className={`pm-bar__balance pm-bar__balance--${tokenBalance.status}`}
                    >
                      {userTokens} tokens
                    </span>
                  </div>
                )}
                {!tokenBalance.sufficient && (
                  <button
                    className="pm-bar__token-buy"
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

          <div
            className={`pm-bar__section pm-bar__section--actions ${
              expandedSection === "actions" ? "expanded" : "collapsed"
            }`}
            ref={downloadDialogRef}
          >
            <button
              className={`pm-bar__trigger ${
                expandedSection === "actions" ? "active" : ""
              }`}
              onClick={() => toggleSection("actions")}
              title="Actions"
            >
              <Download size={15} />
            </button>
            <div className="pm-bar__section-body">
              {!showCode && (
                <>
                  <button
                    className="pm-bar__tool-btn"
                    onClick={openInNewTab}
                    title="New tab"
                    disabled={isStreaming || !hasContent}
                  >
                    <ExternalLink size={13} />
                  </button>
                  <button
                    className="pm-bar__tool-btn"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <Minimize2 size={13} />
                    ) : (
                      <Maximize2 size={13} />
                    )}
                  </button>
                  <div className="pm-bar__sep" />
                </>
              )}
              <button
                className="pm-bar__action-btn"
                onClick={() => setShowDownloadDialog(!showDownloadDialog)}
                disabled={isStreaming || isEnhancing || !hasContent}
              >
                <Download size={13} />
                <span>Export</span>
                <ChevronDown size={10} />
              </button>
              <button
                className={`pm-bar__action-btn ${saveSuccess ? "success" : ""}`}
                onClick={onSave}
                disabled={isSaving || isStreaming || isEnhancing || !hasContent}
              >
                {isSaving ? (
                  <Loader2 size={13} className="spin" />
                ) : saveSuccess ? (
                  <>
                    <Check size={13} />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
            {showDownloadDialog && (
              <div className="pm-bar__dropdown pm-bar__dropdown--export">
                <div className="pm-bar__dropdown-title">Export as</div>
                {EXPORT_FORMATS.map((fmt) => {
                  const Icon = FORMAT_ICONS[fmt.id] || Globe;
                  return (
                    <button
                      key={fmt.id}
                      className="pm-bar__dropdown-item pm-bar__dropdown-item--export"
                      onClick={() => {
                        setShowDownloadDialog(false);
                        onDownload(fmt.id);
                      }}
                    >
                      <div className="pm-bar__dropdown-icon">
                        <Icon size={15} />
                      </div>
                      <div className="pm-bar__dropdown-info">
                        <span className="pm-bar__dropdown-label">
                          {fmt.label}
                        </span>
                        <span className="pm-bar__dropdown-desc">
                          {fmt.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            className="pm-bar__close"
            onClick={() => {
              onClose();
              onMinimize();
            }}
            title="Minimize"
          >
            <X size={15} />
          </button>
        </div>

        <div className="preview-modal__body">
          <div className="preview-modal__bottom-fade" />

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
          ) : showCode ? (
            <div className="code-editor">
              {isMultiPage && (
                <div className="code-editor__sidebar">
                  <div className="code-editor__sidebar-title">Files</div>
                  {fileList.map((filename) => (
                    <button
                      key={filename}
                      className={`code-editor__file ${
                        activeFile === filename ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveFile(filename);
                        setEditedCode(null);
                        setIsCodeDirty(false);
                      }}
                    >
                      <FileText size={12} />
                      <span>{filename}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="code-editor__wrap">
                <div className="code-editor__gutter-track" ref={lineNumbersRef}>
                  <div className="code-editor__gutter">
                    {Array.from({ length: lineCount }, (_, i) => (
                      <div key={i + 1} className="code-editor__line-num">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  className="code-editor__textarea"
                  value={currentHtml || ""}
                  onChange={handleCodeEdit}
                  onScroll={handleCodeScroll}
                  onKeyDown={handleCodeKeyDown}
                  spellCheck={false}
                  disabled={isStreaming || isEnhancing}
                />

                <div className="code-editor__highlight" ref={highlightRef}>
                  <pre>
                    <code
                      dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`preview-frame ${
                isStreaming ? "preview-frame--streaming" : ""
              } ${isEnhancing ? "preview-frame--enhancing" : ""}`}
            >
              <div className="preview-frame__content">
                {showHeadMessage && (
                  <div className="preview-head-message">
                    <Loader2 size={24} className="spin" />
                    <p>Generating site metadata and styles...</p>
                  </div>
                )}
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
