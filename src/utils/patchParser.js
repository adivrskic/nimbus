export function isPatchResponse(text) {
  if (!text || text.length < 14) return false;
  return text.trimStart().startsWith("<!-- PATCH");
}

const FILE_MARKER_RE = /<!--\s*(?:=+\s*)?FILE:\s*(\S+\.html)\s*(?:=+\s*)?-->/gi;

function isMultiPageHtml(html) {
  if (!html) return false;
  FILE_MARKER_RE.lastIndex = 0;
  return FILE_MARKER_RE.test(html);
}

function splitPages(html) {
  if (!html) return null;
  FILE_MARKER_RE.lastIndex = 0;
  const parts = html.split(FILE_MARKER_RE);
  if (parts.length <= 1) return null;

  const files = {};
  for (let i = 1; i < parts.length; i += 2) {
    const filename = parts[i]?.trim();
    const content = parts[i + 1]?.trim();
    if (filename && content) {
      files[filename] = content;
    }
  }
  return Object.keys(files).length > 0 ? files : null;
}

function joinPages(files) {
  return Object.entries(files)
    .map(([filename, html]) => `<!-- FILE: ${filename} -->\n${html}`)
    .join("\n\n");
}

export function parsePatchOps(text) {
  if (!isPatchResponse(text)) return [];

  const ops = [];
  let m;

  const varsRe = /<!-- REPLACE_VARS -->([\s\S]*?)<!-- \/REPLACE_VARS -->/g;
  while ((m = varsRe.exec(text)) !== null) {
    ops.push({
      type: "REPLACE_VARS",
      content: m[1].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

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

  const removeRe = /<!-- REMOVE ([^\s>]+(?:\s[^\s>]+)*?) -->/g;
  while ((m = removeRe.exec(text)) !== null) {
    if (m[0].includes("/REMOVE")) continue;
    ops.push({
      type: "REMOVE",
      selector: m[1].trim(),
      _idx: m.index,
      _end: m.index + m[0].length,
    });
  }

  ops.sort((a, b) => a._idx - b._idx);

  return ops;
}

export function applySinglePageOps(pageHtml, ops) {
  if (!ops || ops.length === 0) return pageHtml;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(pageHtml, "text/html");

    for (const op of ops) {
      switch (op.type) {
        case "REPLACE_VARS": {
          const style = doc.head.querySelector("style");
          if (style) {
            const rootBlockRe = /:root\s*\{[^}]*\}/s;
            let newVars = op.content;
            if (!newVars.includes(":root")) {
              newVars = `:root {\n${newVars}\n}`;
            }
            if (rootBlockRe.test(style.textContent)) {
              style.textContent = style.textContent.replace(
                rootBlockRe,
                newVars
              );
            } else {
              style.textContent = newVars + "\n" + style.textContent;
            }
          }
          break;
        }

        case "REPLACE_STYLES": {
          const oldStyles = doc.head.querySelectorAll("style");
          oldStyles.forEach((s) => s.remove());

          const tempDiv = doc.createElement("div");
          tempDiv.innerHTML = op.content;
          const newStyles = tempDiv.querySelectorAll("style");
          if (newStyles.length > 0) {
            newStyles.forEach((s) => doc.head.appendChild(s));
          } else {
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

    const doctype = doc.doctype
      ? new XMLSerializer().serializeToString(doc.doctype) + "\n"
      : "<!DOCTYPE html>\n";

    return doctype + doc.documentElement.outerHTML;
  } catch (e) {
    console.error("[patchParser] Failed to apply ops:", e);
    return pageHtml;
  }
}

export function applyPatchOps(baseHtml, ops) {
  if (!ops || ops.length === 0) return baseHtml;

  const pages = splitPages(baseHtml);
  if (!pages) {
    return applySinglePageOps(baseHtml, ops);
  }

  const globalOps = ops.filter(
    (op) => op.type === "REPLACE_VARS" || op.type === "REPLACE_STYLES"
  );
  const targetedOps = ops.filter(
    (op) => op.type !== "REPLACE_VARS" && op.type !== "REPLACE_STYLES"
  );

  const patchedPages = {};
  for (const [filename, pageHtml] of Object.entries(pages)) {
    let patched = applySinglePageOps(pageHtml, globalOps);

    if (targetedOps.length > 0) {
      patched = applySinglePageOps(patched, targetedOps);
    }

    patchedPages[filename] = patched;
  }

  return joinPages(patchedPages);
}

export function createIncrementalApplier(baseHtml) {
  let appliedCount = 0;
  let currentHtml = baseHtml;

  return {
    update(rawText) {
      const allOps = parsePatchOps(rawText);

      if (allOps.length > appliedCount) {
        const newOps = allOps.slice(appliedCount);
        currentHtml = applyPatchOps(currentHtml, newOps);
        appliedCount = allOps.length;
        return { html: currentHtml, newOpsApplied: true };
      }

      return { html: currentHtml, newOpsApplied: false };
    },

    finalize(rawText) {
      const allOps = parsePatchOps(rawText);
      if (allOps.length > appliedCount) {
        const newOps = allOps.slice(appliedCount);
        currentHtml = applyPatchOps(currentHtml, newOps);
        appliedCount = allOps.length;
      }
      return currentHtml;
    },

    getCurrentHtml() {
      return currentHtml;
    },
  };
}
