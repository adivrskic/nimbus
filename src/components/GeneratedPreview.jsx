import { useState, useRef, useEffect } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import "./GeneratedPreview.scss";

function GeneratedPreview({ html }) {
  const [viewMode, setViewMode] = useState("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  // Update iframe content when HTML changes
  useEffect(() => {
    if (!html || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  // Handle fullscreen toggle
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

  // Listen for fullscreen changes
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

  // Open in new tab
  const openInNewTab = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // Cleanup after a delay
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

  return (
    <div
      ref={containerRef}
      className={`generated-preview ${
        isFullscreen ? "generated-preview--fullscreen" : ""
      }`}
    >
      <div className="generated-preview__toolbar">
        <div className="generated-preview__device-selector">
          <button
            className={`device-btn ${viewMode === "desktop" ? "active" : ""}`}
            onClick={() => setViewMode("desktop")}
            title="Desktop view"
          >
            <Monitor size={18} />
          </button>
          <button
            className={`device-btn ${viewMode === "tablet" ? "active" : ""}`}
            onClick={() => setViewMode("tablet")}
            title="Tablet view"
          >
            <Tablet size={18} />
          </button>
          <button
            className={`device-btn ${viewMode === "mobile" ? "active" : ""}`}
            onClick={() => setViewMode("mobile")}
            title="Mobile view"
          >
            <Smartphone size={18} />
          </button>
        </div>

        <div className="generated-preview__info">
          <span className="viewport-label">
            {viewMode === "desktop" && "Desktop"}
            {viewMode === "tablet" && "Tablet (768px)"}
            {viewMode === "mobile" && "Mobile (375px)"}
          </span>
        </div>

        <div className="generated-preview__actions">
          <button
            className="action-btn"
            onClick={openInNewTab}
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </button>
          <button
            className="action-btn"
            onClick={toggleFullscreen}
            title="Toggle fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div className="generated-preview__content">
        <div
          className={`generated-preview__frame-wrapper generated-preview__frame-wrapper--${viewMode}`}
          style={{ maxWidth: getFrameWidth() }}
        >
          {/* Device frame for mobile/tablet */}
          {viewMode !== "desktop" && (
            <div className="device-frame">
              <div className="device-frame__notch"></div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            className="generated-preview__iframe"
            title="Generated Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}

export default GeneratedPreview;
