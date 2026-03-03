import { useRef, useEffect, useCallback } from "react";
import "./GeneratedPreview.scss";

const STREAM_THROTTLE_MS = 200;

function patchIframeDOM(iframe, newHtml) {
  try {
    const doc = iframe.contentDocument;
    if (!doc?.body || !doc?.head) return false;

    const parser = new DOMParser();
    const newDoc = parser.parseFromString(newHtml, "text/html");
    if (!newDoc?.body) return false;

    if (doc.head.innerHTML !== newDoc.head.innerHTML) {
      doc.head.innerHTML = newDoc.head.innerHTML;
    }

    syncAttributes(doc.documentElement, newDoc.documentElement);

    syncAttributes(doc.body, newDoc.body);

    const newBodyHtml = newDoc.body.innerHTML;
    if (doc.body.innerHTML !== newBodyHtml) {
      doc.body.innerHTML = newBodyHtml;
    }

    return true;
  } catch (e) {
    return false;
  }
}

function syncAttributes(target, source) {
  Array.from(target.attributes).forEach((attr) => {
    if (!source.hasAttribute(attr.name)) {
      target.removeAttribute(attr.name);
    }
  });
  Array.from(source.attributes).forEach((attr) => {
    if (target.getAttribute(attr.name) !== attr.value) {
      target.setAttribute(attr.name, attr.value);
    }
  });
}

function GeneratedPreview({
  html,
  onClose,
  isStreaming = false,
  isEnhancing = false,
  viewMode = "desktop",
}) {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const pendingHtmlRef = useRef(null);
  const appliedHtmlRef = useRef("");
  const rafIdRef = useRef(null);
  const lastFlushRef = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const lastScrollHeightRef = useRef(0);

  const readyRef = useRef(false);

  const writeDocument = useCallback((newHtml) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      doc.open();
      doc.write(newHtml);
      doc.close();
      appliedHtmlRef.current = newHtml;
      readyRef.current = true;
    } catch (e) {
      iframe.srcdoc = newHtml;
      appliedHtmlRef.current = newHtml;
      readyRef.current = false;
    }
  }, []);

  const applyHtml = useCallback(
    (newHtml) => {
      if (!newHtml) return;
      if (newHtml === appliedHtmlRef.current) return;

      if (!readyRef.current) {
        writeDocument(newHtml);
      } else {
        const patched = patchIframeDOM(iframeRef.current, newHtml);
        if (patched) {
          appliedHtmlRef.current = newHtml;
        } else {
          writeDocument(newHtml);
        }
      }
    },
    [writeDocument]
  );

  const scrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      try {
        const iframe = iframeRef.current;
        const body = iframe?.contentDocument?.body;
        if (body) {
          const newHeight = body.scrollHeight;
          if (newHeight > lastScrollHeightRef.current + 100) {
            lastScrollHeightRef.current = newHeight;
            iframe.contentWindow?.scrollTo({
              top: newHeight,
              behavior: "smooth",
            });
          }
        }
      } catch (e) {}
    }, 120);
  }, []);

  const flush = useCallback(() => {
    rafIdRef.current = null;
    const pending = pendingHtmlRef.current;
    if (!pending) return;

    pendingHtmlRef.current = null;
    lastFlushRef.current = performance.now();

    applyHtml(pending);
  }, [applyHtml]);

  const scheduleFlush = useCallback(() => {
    if (rafIdRef.current) return;

    const elapsed = performance.now() - lastFlushRef.current;
    if (elapsed >= STREAM_THROTTLE_MS) {
      rafIdRef.current = requestAnimationFrame(flush);
    } else {
      const delay = STREAM_THROTTLE_MS - elapsed;
      rafIdRef.current = setTimeout(() => {
        rafIdRef.current = null;
        flush();
      }, delay);
    }
  }, [flush]);

  useEffect(() => {
    if (!html) return;
    if (html === appliedHtmlRef.current) return;

    const streaming = isStreaming || isEnhancing;

    if (streaming) {
      // --- First chunk? Apply immediately, bypass throttle ---
      if (appliedHtmlRef.current === "") {
        applyHtml(html);
      } else {
        pendingHtmlRef.current = html;
        scheduleFlush();
      }

      if (!isEnhancing) {
        scrollToBottom();
      }
    } else {
      // Not streaming — version switch, loading saved project, etc.
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        clearTimeout(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingHtmlRef.current = null;
      applyHtml(html);
    }
  }, [
    html,
    isStreaming,
    isEnhancing,
    applyHtml,
    scheduleFlush,
    scrollToBottom,
  ]);

  useEffect(() => {
    if (!isStreaming && !isEnhancing && appliedHtmlRef.current) {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

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
  }, [isStreaming, isEnhancing]);

  useEffect(() => {
    if (!html && iframeRef.current) {
      appliedHtmlRef.current = "";
      lastScrollHeightRef.current = 0;
      readyRef.current = false;
      try {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(
            "<!DOCTYPE html><html><head><style>body{margin:0;background:#fff;}</style></head><body></body></html>"
          );
          doc.close();
        }
      } catch (e) {}
    }
  }, [html]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        clearTimeout(rafIdRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
