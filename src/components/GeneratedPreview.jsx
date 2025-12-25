import { useState, useRef, useEffect } from "react";
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

function GeneratedPreview({ html, onClose }) {
  const [viewMode, setViewMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!html || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  const toggleFullscreen = () => {
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
  };

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

  const openInNewTab = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

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

  return (
    <div
      ref={containerRef}
      className={`preview ${isFullscreen ? "preview--fullscreen" : ""}`}
    >
      <div className="preview-toolbar">
        <div className="preview-devices">
          <button
            className={`preview-device ${
              viewMode === "desktop" ? "active" : ""
            }`}
            onClick={() => setViewMode("desktop")}
            title="Desktop"
          >
            <Monitor size={14} />
          </button>
          <button
            className={`preview-device ${
              viewMode === "tablet" ? "active" : ""
            }`}
            onClick={() => setViewMode("tablet")}
            title="Tablet"
          >
            <Tablet size={14} />
          </button>
          <button
            className={`preview-device ${
              viewMode === "mobile" ? "active" : ""
            }`}
            onClick={() => setViewMode("mobile")}
            title="Mobile"
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
            className="preview-iframe"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}

export default GeneratedPreview;
