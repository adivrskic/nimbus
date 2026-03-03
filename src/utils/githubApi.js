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
  isStaticSite,
};
