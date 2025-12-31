// components/GeneratedPreview.jsx - Streaming optimized with Blob URLs
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
  const blobUrlRef = useRef(null);

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

  // Optimized streaming-friendly iframe updates using Blob URLs
  useEffect(() => {
    if (!html || !iframeRef.current) return;

    const iframe = iframeRef.current;

    // Clean up previous blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    // Create new blob from current HTML (handles partial HTML gracefully)
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;

    // Set iframe src - smooth updates even with partial HTML
    iframe.src = url;

    // Cleanup function
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
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
