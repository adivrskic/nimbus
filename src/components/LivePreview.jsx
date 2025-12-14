import { useState, useEffect, useRef } from "react";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { renderTemplate } from "../utils/templateSystem";
import { useTheme } from "../contexts/ThemeContext";
import "./LivePreview.scss";

function LivePreview({ templateId, customization, images }) {
  const { theme: globalTheme } = useTheme();
  const [viewMode, setViewMode] = useState("desktop");

  console.log("live preview: ", customization);

  // Local color mode state
  const [localColorMode, setLocalColorMode] = useState(() => {
    if (customization?.colorMode) {
      return customization.colorMode.toLowerCase();
    }
    return "auto";
  });

  const iframeRef = useRef(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (iframeRef.current?.dataset.blobUrl) {
        URL.revokeObjectURL(iframeRef.current.dataset.blobUrl);
      }
    };
  }, []);

  // Keep local color mode synced
  useEffect(() => {
    if (customization?.colorMode) {
      const normalized = customization.colorMode.toLowerCase();
      setLocalColorMode(normalized);
    }
  }, [customization?.colorMode]);

  // -------------------------------
  //   FIX: NO-FLICKER IFRAME UPDATE
  // -------------------------------
  useEffect(() => {
    if (!templateId || !customization) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const effectiveColorMode =
      localColorMode === "auto" ? globalTheme : localColorMode;

    const html = renderTemplate(
      templateId,
      customization,
      customization.theme || "minimal",
      effectiveColorMode
    );

    const doc = iframe.contentDocument || iframe.contentWindow.document;

    // Write content WITHOUT replacing iframe element
    doc.open();
    doc.write(html);
    doc.close();
  }, [templateId, customization, images, localColorMode, globalTheme]);

  const getDisplayMode = () => {
    if (localColorMode === "auto") return globalTheme;
    return localColorMode;
  };

  return (
    <div className="live-preview">
      <div className="live-preview__toolbar">
        <div className="live-preview__controls">
          <button
            className={`live-preview__control ${
              viewMode === "desktop" ? "active" : ""
            }`}
            onClick={() => setViewMode("desktop")}
            title="Desktop view"
          >
            <Monitor size={20} />
          </button>

          <button
            className={`live-preview__control ${
              viewMode === "tablet" ? "active" : ""
            }`}
            onClick={() => setViewMode("tablet")}
            title="Tablet view"
          >
            <Tablet size={20} />
          </button>

          <button
            className={`live-preview__control ${
              viewMode === "mobile" ? "active" : ""
            }`}
            onClick={() => setViewMode("mobile")}
            title="Mobile view"
          >
            <Smartphone size={20} />
          </button>
        </div>

        <div>
          <span className="live-preview__label">Preview: </span>
          <span className="live-preview__mode">{viewMode}</span>
        </div>
      </div>

      <div className="live-preview__content">
        <div
          className={`live-preview__frame-wrapper live-preview__frame-wrapper--${viewMode}`}
        >
          <iframe
            ref={iframeRef}
            className="live-preview__iframe"
            title="Template Preview"
          />
        </div>
      </div>
    </div>
  );
}

export default LivePreview;
