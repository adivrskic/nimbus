// utils/githubApi.js
// Lightweight GitHub API client using the OAuth provider token from Supabase

const GITHUB_API = "https://api.github.com";

const headers = (token) => ({
  Authorization: `token ${token}`,
  Accept: "application/vnd.github.v3+json",
});

export async function fetchUserRepos(
  token,
  { page = 1, perPage = 30, sort = "updated" } = {}
) {
  const res = await fetch(
    `${GITHUB_API}/user/repos?sort=${sort}&per_page=${perPage}&page=${page}&type=all`,
    { headers: headers(token) }
  );
  if (!res.ok) throw new GitHubApiError(res.status, await res.text());
  return res.json();
}

export async function fetchRepoContents(token, owner, repo, path = "") {
  const url = path
    ? `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`
    : `${GITHUB_API}/repos/${owner}/${repo}/contents`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) throw new GitHubApiError(res.status, await res.text());
  return res.json();
}

export async function fetchFileContent(token, owner, repo, path) {
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    { headers: headers(token) }
  );
  if (!res.ok) throw new GitHubApiError(res.status, await res.text());
  const data = await res.json();
  if (data.encoding === "base64" && data.content) {
    return atob(data.content.replace(/\n/g, ""));
  }
  return data.content || "";
}

export async function fetchRepoTree(token, owner, repo, branch = "main") {
  // Try the given branch first, fall back to master
  let res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers: headers(token) }
  );
  if (!res.ok && branch === "main") {
    res = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees/master?recursive=1`,
      { headers: headers(token) }
    );
  }
  if (!res.ok) throw new GitHubApiError(res.status, await res.text());
  return res.json();
}

export function filterHtmlFiles(tree) {
  return tree.filter(
    (item) =>
      item.type === "blob" &&
      item.path.endsWith(".html") &&
      !item.path.includes("node_modules/") &&
      !item.path.includes(".next/") &&
      !item.path.includes("dist/") &&
      !item.path.includes("build/") &&
      item.size < 500000 // skip files over 500KB
  );
}

/**
 * Count CSS/JS assets referenced in the repo tree
 */
export function countAssetFiles(tree) {
  const assets = { css: 0, js: 0 };
  for (const item of tree) {
    if (item.type !== "blob") continue;
    if (item.path.includes("node_modules/")) continue;
    if (item.path.endsWith(".css")) assets.css++;
    if (item.path.endsWith(".js") && !item.path.endsWith(".min.js"))
      assets.js++;
  }
  return assets;
}

/**
 * Resolve a relative path from an HTML file's directory
 * e.g. resolveAssetPath("pages/index.html", "../css/style.css") → "css/style.css"
 */
function resolveAssetPath(htmlFilePath, assetHref) {
  // Skip absolute URLs, data URIs, protocol-relative, and hash/query-only refs
  if (
    !assetHref ||
    assetHref.startsWith("http://") ||
    assetHref.startsWith("https://") ||
    assetHref.startsWith("//") ||
    assetHref.startsWith("data:") ||
    assetHref.startsWith("#")
  ) {
    return null;
  }

  const htmlDir = htmlFilePath.includes("/")
    ? htmlFilePath.substring(0, htmlFilePath.lastIndexOf("/"))
    : "";

  const parts = (htmlDir ? htmlDir + "/" + assetHref : assetHref).split("/");
  const resolved = [];
  for (const p of parts) {
    if (p === "." || p === "") continue;
    if (p === "..") resolved.pop();
    else resolved.push(p);
  }
  return resolved.join("/");
}

/**
 * Fetch all external CSS and JS referenced in an HTML file and inline them.
 * Also rewrites relative image src attributes to raw GitHub URLs.
 *
 * @param {string} html - The raw HTML content
 * @param {string} token - GitHub OAuth token
 * @param {string} owner - Repo owner
 * @param {string} repo - Repo name
 * @param {string} branch - Branch name
 * @param {string} htmlFilePath - Path of the HTML file in the repo (e.g. "pages/index.html")
 * @param {string[]} treePaths - List of all file paths in the repo tree
 * @returns {Promise<{html: string, inlinedCount: {css: number, js: number}}>}
 */
export async function inlineExternalAssets(
  html,
  token,
  owner,
  repo,
  branch,
  htmlFilePath,
  treePaths
) {
  const treeSet = new Set(treePaths);
  const inlinedCount = { css: 0, js: 0 };
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;

  let result = html;

  // --- Inline <link rel="stylesheet" href="..."> ---
  const linkRegex =
    /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\/?\s*>|<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*\/?\s*>/gi;

  const cssMatches = [];
  let match;
  while ((match = linkRegex.exec(result)) !== null) {
    const href = match[1] || match[2];
    const resolved = resolveAssetPath(htmlFilePath, href);
    if (resolved && treeSet.has(resolved)) {
      cssMatches.push({ fullMatch: match[0], resolved });
    }
  }

  for (const { fullMatch, resolved } of cssMatches) {
    try {
      const cssContent = await fetchFileContent(token, owner, repo, resolved);
      // Rewrite url() references inside the CSS to absolute GitHub raw URLs
      const cssDir = resolved.includes("/")
        ? resolved.substring(0, resolved.lastIndexOf("/")) + "/"
        : "";
      const patchedCss = cssContent.replace(
        /url\(\s*["']?(?!data:|https?:|\/\/)([^"')]+)["']?\s*\)/gi,
        (_, relPath) => `url("${rawBase}${cssDir}${relPath}")`
      );
      result = result.replace(
        fullMatch,
        `<style>\n/* Inlined from: ${resolved} */\n${patchedCss}\n</style>`
      );
      inlinedCount.css++;
    } catch (e) {
      console.warn(`Failed to inline CSS: ${resolved}`, e);
    }
  }

  // --- Inline <script src="..."></script> ---
  const scriptRegex =
    /<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi;

  const jsMatches = [];
  while ((match = scriptRegex.exec(result)) !== null) {
    const src = match[1];
    const resolved = resolveAssetPath(htmlFilePath, src);
    if (resolved && treeSet.has(resolved)) {
      jsMatches.push({ fullMatch: match[0], resolved });
    }
  }

  for (const { fullMatch, resolved } of jsMatches) {
    try {
      const jsContent = await fetchFileContent(token, owner, repo, resolved);
      result = result.replace(
        fullMatch,
        `<script>\n// Inlined from: ${resolved}\n${jsContent}\n</script>`
      );
      inlinedCount.js++;
    } catch (e) {
      console.warn(`Failed to inline JS: ${resolved}`, e);
    }
  }

  // --- Rewrite relative image src to absolute GitHub raw URLs ---
  result = result.replace(
    /(<img\s+[^>]*src=["'])(?!data:|https?:|\/\/)([^"']+)(["'])/gi,
    (full, prefix, relPath, suffix) => {
      const resolved = resolveAssetPath(htmlFilePath, relPath);
      if (resolved && treeSet.has(resolved)) {
        return `${prefix}${rawBase}${resolved}${suffix}`;
      }
      return full;
    }
  );

  // --- Rewrite relative background-image in inline styles ---
  result = result.replace(
    /style=["'][^"']*url\(\s*["']?(?!data:|https?:|\/\/)([^"')]+)["']?\s*\)/gi,
    (full, relPath) => {
      const resolved = resolveAssetPath(htmlFilePath, relPath);
      if (resolved && treeSet.has(resolved)) {
        return full.replace(relPath, `${rawBase}${resolved}`);
      }
      return full;
    }
  );

  return { html: result, inlinedCount };
}

export function isStaticSite(tree) {
  const hasHtml = tree.some(
    (f) => f.type === "blob" && f.path === "index.html"
  );
  const hasPackageJson = tree.some(
    (f) => f.type === "blob" && f.path === "package.json"
  );
  return { hasHtml, hasPackageJson, isStatic: hasHtml && !hasPackageJson };
}

class GitHubApiError extends Error {
  constructor(status, body) {
    super(`GitHub API error ${status}`);
    this.status = status;
    this.body = body;
    this.name = "GitHubApiError";
  }
}

export default {
  fetchUserRepos,
  fetchRepoContents,
  fetchFileContent,
  fetchRepoTree,
  filterHtmlFiles,
  countAssetFiles,
  inlineExternalAssets,
  isStaticSite,
};
