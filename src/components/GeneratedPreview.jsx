import { useRef, useEffect } from "react";
import { track } from "../lib/analytics";
import "./GeneratedPreview.scss";

function GeneratedPreview({
  html,
  onClose,
  isStreaming = false,
  viewMode = "desktop",
}) {
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

  useEffect(() => {
    if (!html || !iframeRef.current) return;

    if (html === lastHtmlRef.current) return;
    lastHtmlRef.current = html;

    const iframe = iframeRef.current;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        if (isStreaming) {
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }

          scrollTimeoutRef.current = setTimeout(() => {
            try {
              const body = doc.body;
              if (body) {
                const newScrollHeight = body.scrollHeight;
                if (newScrollHeight > lastScrollHeightRef.current + 100) {
                  lastScrollHeightRef.current = newScrollHeight;
                  iframe.contentWindow?.scrollTo({
                    top: newScrollHeight,
                    behavior: "smooth",
                  });
                }
              }
            } catch (e) {
              console.log(e);
            }
          }, 100);
        }
      }
    } catch (e) {
      iframe.srcdoc = html;
    }
  }, [html, isStreaming]);

  useEffect(() => {
    if (!isStreaming && lastHtmlRef.current && iframeRef.current) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

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

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
            "<!DOCTYPE html><html><head><style>body{margin:0;background:#fff;}</style></head><body></body></html>"
          );
          doc.close();
        }
      } catch (e) {
        iframeRef.current.srcdoc =
          "<!DOCTYPE html><html><head><style>body{margin:0;background:#fff;}</style></head><body></body></html>";
      }
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={`preview ${isStreaming ? "preview--streaming" : ""}`}
    >
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
    </div>
  );
}

export default GeneratedPreview;
