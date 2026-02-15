// components/GeneratedPreview.jsx - Stripped toolbar, viewMode controlled by parent
import { useState, useRef, useEffect, useCallback } from "react";
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
              // Ignore cross-origin errors
            }
          }, 100);
        }
      }
    } catch (e) {
      iframe.srcdoc = html;
    }
  }, [html, isStreaming]);

  // Scroll to top when streaming completes
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Reset iframe when html becomes empty
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
