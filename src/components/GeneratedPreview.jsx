import { useRef, useEffect, useCallback } from "react";
import "./GeneratedPreview.scss";

// ─── Constants ─────────────────────────────────────────────────────────────
const BLANK_DOC =
  "<!DOCTYPE html><html><head><style>body{margin:0;background:#fff;}</style></head><body></body></html>";

const STREAM_THROTTLE_MS = 200; // Max ~5 updates/sec during streaming

// ─── DOM Patching ──────────────────────────────────────────────────────────
// During enhancement we already have a rendered page in the iframe. Instead of
// replacing srcdoc (which tears down the entire document, causes a white flash,
// resets scroll, and re-fetches every resource), we parse the incoming HTML and
// surgically patch the live DOM:
//   • <style> tags are updated in-place → color/font changes appear instantly
//   • <body> innerHTML is swapped → structural changes apply without reload
//   • Body/html attributes are synced → class/theme changes carry over
//
// Falls back to srcdoc if patching fails (e.g. iframe not ready yet).

function patchIframeDOM(iframe, newHtml) {
  try {
    const doc = iframe.contentDocument;
    if (!doc?.body || !doc?.head) return false;

    const parser = new DOMParser();
    const newDoc = parser.parseFromString(newHtml, "text/html");
    if (!newDoc?.body) return false;

    // ── 1. Patch <style> tags in <head> ──────────────────────────────
    const oldStyles = Array.from(doc.head.querySelectorAll("style"));
    const newStyles = Array.from(newDoc.head.querySelectorAll("style"));

    // Update existing styles in-place (no FOUC)
    oldStyles.forEach((oldStyle, i) => {
      if (newStyles[i]) {
        if (oldStyle.textContent !== newStyles[i].textContent) {
          oldStyle.textContent = newStyles[i].textContent;
        }
      } else {
        oldStyle.remove(); // Removed in new version
      }
    });

    // Append any new <style> tags
    for (let i = oldStyles.length; i < newStyles.length; i++) {
      doc.head.appendChild(doc.importNode(newStyles[i], true));
    }

    // ── 2. Sync <link> stylesheets ───────────────────────────────────
    const oldLinks = Array.from(
      doc.head.querySelectorAll('link[rel="stylesheet"]')
    );
    const newLinks = Array.from(
      newDoc.head.querySelectorAll('link[rel="stylesheet"]')
    );
    const oldHrefs = new Set(oldLinks.map((l) => l.href));
    const newHrefs = new Set(newLinks.map((l) => l.href));

    // Remove links no longer present
    oldLinks.forEach((link) => {
      if (!newHrefs.has(link.href)) link.remove();
    });
    // Add new links
    newLinks.forEach((link) => {
      if (!oldHrefs.has(link.href)) {
        doc.head.appendChild(doc.importNode(link, true));
      }
    });

    // ── 3. Sync <html> attributes (e.g. lang, data-theme) ───────────
    syncAttributes(doc.documentElement, newDoc.documentElement);

    // ── 4. Sync <body> attributes (class, style, data-*) ────────────
    syncAttributes(doc.body, newDoc.body);

    // ── 5. Patch <body> content ──────────────────────────────────────
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
  // Remove attributes not in source
  Array.from(target.attributes).forEach((attr) => {
    if (!source.hasAttribute(attr.name)) {
      target.removeAttribute(attr.name);
    }
  });
  // Set/update attributes from source
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

  // Batching refs
  const pendingHtmlRef = useRef(null);
  const appliedHtmlRef = useRef("");
  const rafIdRef = useRef(null);
  const lastFlushRef = useRef(0);
  const scrollTimeoutRef = useRef(null);
  const lastScrollHeightRef = useRef(0);

  // ─── Apply HTML to iframe (full replace via srcdoc) ──────────────────
  const applyFull = useCallback((newHtml) => {
    const iframe = iframeRef.current;
    if (!iframe || !newHtml) return;
    if (newHtml === appliedHtmlRef.current) return;

    appliedHtmlRef.current = newHtml;
    iframe.srcdoc = newHtml;
  }, []);

  // ─── Apply HTML via DOM patch (enhancement path) ─────────────────────
  const applyPatch = useCallback((newHtml) => {
    const iframe = iframeRef.current;
    if (!iframe || !newHtml) return;
    if (newHtml === appliedHtmlRef.current) return;

    appliedHtmlRef.current = newHtml;

    // Try DOM patching first; fall back to srcdoc if it fails
    const patched = patchIframeDOM(iframe, newHtml);
    if (!patched) {
      iframe.srcdoc = newHtml;
    }
  }, []);

  // ─── Scroll to bottom during initial generation streaming ────────────
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

    // Pick strategy based on whether we're enhancing
    if (isEnhancing) {
      applyPatch(pending);
    } else {
      applyFull(pending);
    }
  }, [applyFull, applyPatch, isEnhancing]);

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
      pendingHtmlRef.current = html;
      scheduleFlush();

      // Only auto-scroll during initial generation, not enhancement
      if (!isEnhancing) {
        scrollToBottom();
      }
    } else {
      // Final render — apply immediately
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        clearTimeout(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingHtmlRef.current = null;
      applyFull(html);
    }
  }, [
    html,
    isStreaming,
    isEnhancing,
    applyFull,
    scheduleFlush,
    scrollToBottom,
  ]);

  // ─── When streaming ends, scroll to top (initial gen only) ───────────
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
      iframeRef.current.srcdoc = BLANK_DOC;
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
