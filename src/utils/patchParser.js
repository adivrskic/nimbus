// utils/patchParser.js
//
// Patch-based refinement system. Instead of Claude regenerating the entire HTML
// document on every enhancement, it outputs a lightweight set of operations:
//
//   <!-- PATCH -->
//   <!-- REPLACE_STYLES -->
//   <style>...updated CSS...</style>
//   <!-- /REPLACE_STYLES -->
//   <!-- REPLACE #about -->
//   <section id="about" style="...">...updated content...</section>
//   <!-- /REPLACE -->
//   <!-- INSERT_AFTER #features -->
//   <section id="testimonials" style="...">...new section...</section>
//   <!-- /INSERT_AFTER -->
//   <!-- REMOVE #old-cta -->
//   <!-- /PATCH -->
//
// Benefits:
//   - 70-90% fewer output tokens for typical edits
//   - Changes appear instantly as each op completes (not after full doc)
//   - No page flash or scroll reset
//
// Backward compatible: if response doesn't start with <!-- PATCH -->, it's
// treated as full HTML and the existing flow takes over.

// ─── Detection ─────────────────────────────────────────────────────────────

/**
 * Returns true if the accumulated response text is a patch (not full HTML).
 */
export function isPatchResponse(text) {
  if (!text || text.length < 14) return false;
  return text.trimStart().startsWith("<!-- PATCH");
}

// ─── Parsing ───────────────────────────────────────────────────────────────

/**
 * Parse all *completed* patch operations from the accumulated streaming text.
 * Only fully-closed operations are returned, so it's safe to call on every
 * streaming chunk — incomplete ops are simply skipped until their closing
 * marker arrives.
 *
 * Returns: Array<{ type, selector?, content?, _end }>
 *   _end is the character index where this op's closing marker ends,
 *   used to track which ops have already been applied.
 */
export function parsePatchOps(text) {
  if (!isPatchResponse(text)) return [];

  const ops = [];
  let m;

  // REPLACE_VARS — swap just the :root custom properties (fastest for color changes)
  const varsRe = /<!-- REPLACE_VARS -->([\s\S]*?)<!-- \/REPLACE_VARS -->/g;
  while ((m = varsRe.exec(text)) !== null) {
    ops.push({
      type: "REPLACE_VARS",
      content: m[1].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

  // REPLACE_STYLES — replaces ALL <style> blocks in <head>
  const stylesRe =
    /<!-- REPLACE_STYLES -->([\s\S]*?)<!-- \/REPLACE_STYLES -->/g;
  while ((m = stylesRe.exec(text)) !== null) {
    ops.push({
      type: "REPLACE_STYLES",
      content: m[1].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

  // REPLACE <selector> — replaces element matching CSS selector
  const replaceRe =
    /<!-- REPLACE ([^\s>]+(?:\s[^\s>]+)*?) -->([\s\S]*?)<!-- \/REPLACE -->/g;
  while ((m = replaceRe.exec(text)) !== null) {
    ops.push({
      type: "REPLACE",
      selector: m[1].trim(),
      content: m[2].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

  // INSERT_AFTER <selector>
  const insertAfterRe =
    /<!-- INSERT_AFTER ([^\s>]+(?:\s[^\s>]+)*?) -->([\s\S]*?)<!-- \/INSERT_AFTER -->/g;
  while ((m = insertAfterRe.exec(text)) !== null) {
    ops.push({
      type: "INSERT_AFTER",
      selector: m[1].trim(),
      content: m[2].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

  // INSERT_BEFORE <selector>
  const insertBeforeRe =
    /<!-- INSERT_BEFORE ([^\s>]+(?:\s[^\s>]+)*?) -->([\s\S]*?)<!-- \/INSERT_BEFORE -->/g;
  while ((m = insertBeforeRe.exec(text)) !== null) {
    ops.push({
      type: "INSERT_BEFORE",
      selector: m[1].trim(),
      content: m[2].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

  // REMOVE <selector> — self-closing, no content
  const removeRe = /<!-- REMOVE ([^\s>]+(?:\s[^\s>]+)*?) -->/g;
  while ((m = removeRe.exec(text)) !== null) {
    // Skip if this is actually a closing tag like <!-- /REMOVE -->
    if (m[0].includes("/REMOVE")) continue;
    ops.push({
      type: "REMOVE",
      selector: m[1].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

  // Sort by document order
  ops.sort((a, b) => a._idx - b._idx);

  return ops;
}

// ─── Application ───────────────────────────────────────────────────────────

/**
 * Apply an array of patch operations to a base HTML string.
 * Returns the new complete HTML string.
 */
export function applyPatchOps(baseHtml, ops) {
  if (!ops || ops.length === 0) return baseHtml;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(baseHtml, "text/html");

    for (const op of ops) {
      switch (op.type) {
        case "REPLACE_VARS": {
          // Swap just the :root { ... } block inside the first <style> tag.
          // This is the fastest possible color change — no elements touched.
          const style = doc.head.querySelector("style");
          if (style) {
            const rootBlockRe = /:root\s*\{[^}]*\}/s;
            let newVars = op.content;
            // If the content doesn't include :root wrapper, it's just the inner block
            if (!newVars.includes(":root")) {
              newVars = `:root {\n${newVars}\n}`;
            }
            if (rootBlockRe.test(style.textContent)) {
              style.textContent = style.textContent.replace(
                rootBlockRe,
                newVars
              );
            } else {
              // No existing :root — prepend it
              style.textContent = newVars + "\n" + style.textContent;
            }
          }
          break;
        }

        case "REPLACE_STYLES": {
          // Replace all <style> blocks in <head> with the new one(s)
          const oldStyles = doc.head.querySelectorAll("style");
          // Remove all existing (except the very first responsive one we'll replace)
          oldStyles.forEach((s) => s.remove());

          // Parse the new style content and append
          const tempDiv = doc.createElement("div");
          tempDiv.innerHTML = op.content;
          const newStyles = tempDiv.querySelectorAll("style");
          if (newStyles.length > 0) {
            newStyles.forEach((s) => doc.head.appendChild(s));
          } else {
            // If content is raw CSS without <style> tags, wrap it
            const styleEl = doc.createElement("style");
            styleEl.textContent = op.content;
            doc.head.appendChild(styleEl);
          }
          break;
        }

        case "REPLACE": {
          const el = doc.querySelector(op.selector);
          if (el && op.content) {
            const frag = doc.createRange().createContextualFragment(op.content);
            el.replaceWith(frag);
          }
          break;
        }

        case "INSERT_AFTER": {
          const el = doc.querySelector(op.selector);
          if (el && op.content) {
            const frag = doc.createRange().createContextualFragment(op.content);
            el.after(frag);
          }
          break;
        }

        case "INSERT_BEFORE": {
          const el = doc.querySelector(op.selector);
          if (el && op.content) {
            const frag = doc.createRange().createContextualFragment(op.content);
            el.before(frag);
          }
          break;
        }

        case "REMOVE": {
          const el = doc.querySelector(op.selector);
          if (el) el.remove();
          break;
        }
      }
    }

    // Serialize back to full HTML string
    const doctype = doc.doctype
      ? new XMLSerializer().serializeToString(doc.doctype) + "\n"
      : "<!DOCTYPE html>\n";

    return doctype + doc.documentElement.outerHTML;
  } catch (e) {
    console.error("[patchParser] Failed to apply ops:", e);
    return baseHtml;
  }
}

// ─── Incremental streaming helper ──────────────────────────────────────────

/**
 * Creates a stateful patch applier for use during streaming.
 *
 * Usage:
 *   const applier = createIncrementalApplier(baseHtml);
 *   // On each streaming chunk:
 *   const { html, newOpsApplied } = applier.update(accumulatedRawText);
 *   // html is always the latest patched result
 *   // newOpsApplied is true if new operations were applied this update
 *
 *   // When streaming ends:
 *   const finalHtml = applier.finalize(accumulatedRawText);
 */
export function createIncrementalApplier(baseHtml) {
  let appliedCount = 0; // How many ops we've already applied
  let currentHtml = baseHtml;

  return {
    /**
     * Called on each streaming update with the full accumulated raw text.
     * Parses any newly-completed ops and applies them incrementally.
     */
    update(rawText) {
      const allOps = parsePatchOps(rawText);

      if (allOps.length > appliedCount) {
        // New ops completed — apply only the new ones
        const newOps = allOps.slice(appliedCount);
        currentHtml = applyPatchOps(currentHtml, newOps);
        appliedCount = allOps.length;
        return { html: currentHtml, newOpsApplied: true };
      }

      return { html: currentHtml, newOpsApplied: false };
    },

    /**
     * Called when streaming is complete. Does a final parse to catch any
     * ops that might have completed in the last chunk.
     */
    finalize(rawText) {
      const allOps = parsePatchOps(rawText);
      if (allOps.length > appliedCount) {
        const newOps = allOps.slice(appliedCount);
        currentHtml = applyPatchOps(currentHtml, newOps);
        appliedCount = allOps.length;
      }
      return currentHtml;
    },

    /** Get the current patched HTML without applying new ops */
    getCurrentHtml() {
      return currentHtml;
    },
  };
}
