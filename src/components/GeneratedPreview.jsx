// components/GeneratedPreview.jsx - Streaming with inline styles (simple scroll down)
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import "./GeneratedPreview.scss";

function GeneratedPreview({ html, onClose, isStreaming = false }) {
  const [viewMode, setViewMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const lastHtmlRef = useRef("");
  const lastScrollHeightRef = useRef(0);
  const scrollTimeoutRef = useRef(null);

  const getFrameWidth = () => {
    switch (viewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

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

  // Update iframe content using document.write - no flash!
  useEffect(() => {
    if (!html || !iframeRef.current) return;

    // Skip if content hasn't changed
    if (html === lastHtmlRef.current) return;
    lastHtmlRef.current = html;

    const iframe = iframeRef.current;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // Auto-scroll during streaming - content is already styled with inline styles
        if (isStreaming) {
          // Clear any pending scroll
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }

          // Delay scroll slightly to let render complete
          scrollTimeoutRef.current = setTimeout(() => {
            try {
              const body = doc.body;
              if (body) {
                const newScrollHeight = body.scrollHeight;

                // Only scroll if content has grown (100px threshold to reduce scroll frequency)
                if (newScrollHeight > lastScrollHeightRef.current + 100) {
                  lastScrollHeightRef.current = newScrollHeight;

                  iframe.contentWindow?.scrollTo({
                    top: newScrollHeight,
                    behavior: "smooth",
                  });
                }
              }
            } catch (e) {
              // Ignore cross-origin errors
            }
          }, 100);
        }
      }
    } catch (e) {
      // Fallback to srcdoc if document.write fails
      iframe.srcdoc = html;
    }
  }, [html, isStreaming]);

  // Scroll to top when streaming completes
  useEffect(() => {
    if (!isStreaming && lastHtmlRef.current && iframeRef.current) {
      // Clear any pending scroll
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Delay to let final render complete
      const timer = setTimeout(() => {
        try {
          iframeRef.current?.contentWindow?.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } catch (e) {}

        lastScrollHeightRef.current = 0;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Reset iframe when html becomes empty (new generation starting)
  useEffect(() => {
    if (!html && iframeRef.current) {
      lastHtmlRef.current = "";
      lastScrollHeightRef.current = 0;
      try {
        const doc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(
            "<!DOCTYPE html><html><head><style>body{background:#1a1a2e;}</style></head><body></body></html>"
          );
          doc.close();
        }
      } catch (e) {
        iframeRef.current.srcdoc =
          "<!DOCTYPE html><html><head><style>body{background:#1a1a2e;}</style></head><body></body></html>";
      }
    }
  }, [html]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const openInNewTab = useCallback(() => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={`preview ${isFullscreen ? "preview--fullscreen" : ""} ${
        isStreaming ? "preview--streaming" : ""
      }`}
    >
      <div className="preview-toolbar">
        <div className="preview-devices">
          <button
            className={`preview-device ${
              viewMode === "desktop" ? "active" : ""
            }`}
            onClick={() => setViewMode("desktop")}
            title="Desktop"
            disabled={isStreaming}
          >
            <Monitor size={14} />
          </button>
          <button
            className={`preview-device ${
              viewMode === "tablet" ? "active" : ""
            }`}
            onClick={() => setViewMode("tablet")}
            title="Tablet"
            disabled={isStreaming}
          >
            <Tablet size={14} />
          </button>
          <button
            className={`preview-device ${
              viewMode === "mobile" ? "active" : ""
            }`}
            onClick={() => setViewMode("mobile")}
            title="Mobile"
            disabled={isStreaming}
          >
            <Smartphone size={14} />
          </button>
          <span className="preview-viewport">{getViewportLabel()}</span>
        </div>

        <div className="preview-actions">
          <button
            className="preview-action"
            onClick={openInNewTab}
            title="Open in new tab"
            disabled={isStreaming || !html}
          >
            <ExternalLink size={14} />
          </button>
          <button
            className="preview-action"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          {onClose && (
            <button className="preview-close" onClick={onClose} title="Close">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="preview-content">
        <div
          className={`preview-frame preview-frame--${viewMode}`}
          style={{ maxWidth: getFrameWidth() }}
        >
          {viewMode !== "desktop" && <div className="preview-notch" />}
          <iframe
            ref={iframeRef}
            className={`preview-iframe ${
              isStreaming ? "preview-iframe--streaming" : ""
            }`}
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>

      {/* Streaming overlay */}
      {isStreaming && (
        <div className="preview-streaming-overlay">
          <div className="preview-streaming-indicator">
            <div className="streaming-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Generating...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratedPreview;
