// components/GeneratedPreview.jsx - Streaming optimized with smooth auto-scroll
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

function GeneratedPreview({
  html,
  onClose,
  isStreaming = false,
  streamingPhase = null,
}) {
  const [viewMode, setViewMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const lastHtmlRef = useRef("");
  const lastScrollHeightRef = useRef(0);
  const lastPhaseRef = useRef(null);
  const scrollRafRef = useRef(null);
  const lastScrollTimeRef = useRef(0);

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

  // Detect phase from HTML content if not provided via prop
  const detectPhase = useCallback((content) => {
    if (!content) return "head";
    if (content.includes("STYLES_START") || content.includes("<style"))
      return "styles";
    if (content.includes("<body")) return "body";
    return "head";
  }, []);

  // Throttled scroll function to prevent stuttering
  const throttledScroll = useCallback(
    (iframe, targetY, behavior = "smooth") => {
      const now = Date.now();
      const minInterval = 200; // Minimum ms between scroll calls

      if (now - lastScrollTimeRef.current < minInterval) {
        return; // Skip this scroll call
      }

      lastScrollTimeRef.current = now;

      // Cancel any pending RAF
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }

      // Delay scroll slightly to let doc.write render settle
      setTimeout(() => {
        scrollRafRef.current = requestAnimationFrame(() => {
          try {
            iframe.contentWindow?.scrollTo({
              top: targetY,
              behavior,
            });
          } catch (e) {
            // Ignore cross-origin errors
          }
        });
      }, 16); // One frame delay
    },
    []
  );

  // Track styles scroll position separately (not affected by doc.write)
  const stylesScrollPosRef = useRef(0);

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

        // Auto-scroll during streaming
        if (isStreaming) {
          const currentPhase = streamingPhase || detectPhase(html);
          const previousPhase = lastPhaseRef.current;

          // Phase transition: body → styles - scroll to top
          if (currentPhase === "styles" && previousPhase !== "styles") {
            stylesScrollPosRef.current = 0;
            lastPhaseRef.current = currentPhase;

            // Delay scroll to let document render
            setTimeout(() => {
              try {
                iframe.contentWindow?.scrollTo({ top: 0, behavior: "instant" });
              } catch (e) {}
            }, 50);
            return;
          }

          // During body phase - scroll down as content grows
          if (currentPhase === "body") {
            setTimeout(() => {
              try {
                const body = doc.body;
                if (body) {
                  const newScrollHeight = body.scrollHeight;

                  // Only scroll if content has grown significantly
                  if (newScrollHeight > lastScrollHeightRef.current + 50) {
                    lastScrollHeightRef.current = newScrollHeight;
                    throttledScroll(iframe, newScrollHeight);
                  }
                }
              } catch (e) {}
            }, 16);
          }

          // During styles phase - scroll down gradually
          if (currentPhase === "styles" && previousPhase === "styles") {
            setTimeout(() => {
              try {
                const viewportHeight = iframe.contentWindow?.innerHeight || 600;
                const scrollHeight = doc.body?.scrollHeight || 0;
                const maxScroll = Math.max(0, scrollHeight - viewportHeight);

                // Increment by 3% of viewport
                const increment = viewportHeight * 0.03;
                stylesScrollPosRef.current = Math.min(
                  stylesScrollPosRef.current + increment,
                  maxScroll
                );

                throttledScroll(iframe, stylesScrollPosRef.current);
              } catch (e) {}
            }, 50);
          }

          lastPhaseRef.current = currentPhase;
        }
      }
    } catch (e) {
      // Fallback to srcdoc if document.write fails
      iframe.srcdoc = html;
    }
  }, [html, isStreaming, streamingPhase, detectPhase, throttledScroll]);

  // Scroll to top when streaming completes
  useEffect(() => {
    if (!isStreaming && lastPhaseRef.current && iframeRef.current) {
      // Small delay to let final render complete
      const timer = setTimeout(() => {
        try {
          const iframe = iframeRef.current;
          iframe?.contentWindow?.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } catch (e) {}

        // Reset refs
        lastScrollHeightRef.current = 0;
        lastPhaseRef.current = null;
        stylesScrollPosRef.current = 0;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isStreaming]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  // Reset iframe when html becomes empty (new generation starting)
  useEffect(() => {
    if (!html && iframeRef.current) {
      lastHtmlRef.current = "";
      lastScrollHeightRef.current = 0;
      lastPhaseRef.current = null;
      stylesScrollPosRef.current = 0;
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
  }, [isFullscreen, setIsFullscreen]);

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
            <span>Rendering live...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneratedPreview;
