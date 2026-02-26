import { useRef, useEffect, useCallback } from "react";
import "./GeneratedPreview.scss";

// ─── Constants ─────────────────────────────────────────────────────────────
const STREAM_THROTTLE_MS = 200;

// ─── DOM Patching ──────────────────────────────────────────────────────────
// Once the iframe has a live document, we patch it in-place rather than
// tearing it down. This avoids the white flash caused by srcdoc writes.

function patchIframeDOM(iframe, newHtml) {
  try {
    const doc = iframe.contentDocument;
    if (!doc?.body || !doc?.head) return false;

    const parser = new DOMParser();
    const newDoc = parser.parseFromString(newHtml, "text/html");
    if (!newDoc?.body) return false;

    // ── 1. Patch <head> entirely ─────────────────────────────────────
    // Replace the full head content so styles, links, meta, title all sync.
    // This is simpler than diffing individual tags and handles streaming
    // chunks where the head is still being built up.
    if (doc.head.innerHTML !== newDoc.head.innerHTML) {
      doc.head.innerHTML = newDoc.head.innerHTML;
    }

    // ── 2. Sync <html> attributes (lang, data-theme, etc.) ──────────
    syncAttributes(doc.documentElement, newDoc.documentElement);

    // ── 3. Sync <body> attributes (class, style, data-*) ────────────
    syncAttributes(doc.body, newDoc.body);

    // ── 4. Patch <body> content ──────────────────────────────────────
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

// ─── Component ─────────────────────────────────────────────────────────────

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

  // Once true, the iframe has a live document we can patch into.
  const readyRef = useRef(false);

  // ─── Write the initial document into the iframe ──────────────────────
  // Uses document.open/write/close which is synchronous — the document is
  // immediately available for DOM patching on the very next call.
  // This replaces srcdoc which is async and causes teardown flashes.
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
      // Fallback: srcdoc (shouldn't happen with same-origin sandbox)
      iframe.srcdoc = newHtml;
      appliedHtmlRef.current = newHtml;
      // srcdoc is async so we can't mark ready immediately
      readyRef.current = false;
    }
  }, []);

  // ─── Apply HTML: write if first time, patch if already have content ──
  const applyHtml = useCallback(
    (newHtml) => {
      if (!newHtml) return;
      if (newHtml === appliedHtmlRef.current) return;

      if (!readyRef.current) {
        // First write — seed the iframe document
        writeDocument(newHtml);
      } else {
        // Subsequent writes — patch in place, no flash
        const patched = patchIframeDOM(iframeRef.current, newHtml);
        if (patched) {
          appliedHtmlRef.current = newHtml;
        } else {
          // Patching failed (shouldn't happen normally) — re-seed
          writeDocument(newHtml);
        }
      }
    },
    [writeDocument]
  );

  // ─── Scroll to bottom during initial generation ──────────────────────
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

  // ─── Flush: apply pending HTML ───────────────────────────────────────
  const flush = useCallback(() => {
    rafIdRef.current = null;
    const pending = pendingHtmlRef.current;
    if (!pending) return;

    pendingHtmlRef.current = null;
    lastFlushRef.current = performance.now();

    applyHtml(pending);
  }, [applyHtml]);

  // ─── Schedule a throttled flush ──────────────────────────────────────
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

  // ─── Main effect: react to html changes ──────────────────────────────
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

  // ─── When streaming ends, scroll to top ──────────────────────────────
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

  // ─── Clear iframe when html becomes falsy ────────────────────────────
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

  // ─── Cleanup ─────────────────────────────────────────────────────────
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

  // ─── Render ──────────────────────────────────────────────────────────
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
