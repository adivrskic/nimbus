import { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Github,
  Loader2,
  Search,
  FileCode,
  AlertTriangle,
  ChevronRight,
  Globe,
  Lock,
  ArrowLeft,
  Download,
  Eye,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import useModalAnimation from "../../hooks/useModalAnimation";
import { track } from "../../lib/analytics";
import {
  fetchUserRepos,
  fetchRepoTree,
  fetchFileContent,
  filterHtmlFiles,
  isStaticSite,
} from "../../utils/githubApi";
import "../../styles/modals.scss";

const STEPS = { REPOS: "repos", FILES: "files", PREVIEW: "preview" };

function GithubImportModal({ isOpen, onClose, onImport }) {
  const { user, supabase, signInWithGitHub } = useAuth();
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [step, setStep] = useState(STEPS.REPOS);
  const [ghToken, setGhToken] = useState(null);
  const [tokenError, setTokenError] = useState(false);

  // Repos
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Selected repo + files
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [htmlFiles, setHtmlFiles] = useState([]);
  const [siteInfo, setSiteInfo] = useState(null);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState(null);

  // Preview + import
  const [previewFile, setPreviewFile] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  // Grab provider token from session
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.provider_token) {
          setGhToken(session.provider_token);
          setTokenError(false);
        } else if (session?.user?.app_metadata?.provider === "github") {
          // Token expired or not available — need re-auth
          setTokenError(true);
        } else {
          setTokenError(true);
        }
      } catch {
        setTokenError(true);
      }
    })();
  }, [isOpen, supabase]);

  // Load repos when token is available
  useEffect(() => {
    if (ghToken && isOpen) loadRepos(1);
  }, [ghToken, isOpen]);

  const loadRepos = useCallback(
    async (pageNum = 1) => {
      if (!ghToken) return;
      setReposLoading(true);
      setReposError(null);
      try {
        const data = await fetchUserRepos(ghToken, {
          page: pageNum,
          perPage: 30,
        });
        if (pageNum === 1) {
          setRepos(data);
        } else {
          setRepos((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === 30);
        setPage(pageNum);
      } catch (err) {
        if (err.status === 401) {
          setTokenError(true);
        } else {
          setReposError("Failed to load repositories. Please try again.");
        }
      } finally {
        setReposLoading(false);
      }
    },
    [ghToken]
  );

  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repos;
    const q = searchQuery.toLowerCase();
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
    );
  }, [repos, searchQuery]);

  const handleSelectRepo = useCallback(
    async (repo) => {
      setSelectedRepo(repo);
      setStep(STEPS.FILES);
      setFilesLoading(true);
      setFilesError(null);
      setSelectedFiles(new Set());

      try {
        const tree = await fetchRepoTree(
          ghToken,
          repo.owner.login,
          repo.name,
          repo.default_branch || "main"
        );
        const htmlList = filterHtmlFiles(tree.tree || []);
        const info = isStaticSite(tree.tree || []);
        setHtmlFiles(htmlList);
        setSiteInfo(info);

        // Auto-select all HTML files
        setSelectedFiles(new Set(htmlList.map((f) => f.path)));

        if (htmlList.length === 0) {
          setFilesError(
            info.hasPackageJson
              ? "This looks like a framework project (has package.json). Only static HTML sites can be imported for now."
              : "No HTML files found in this repository."
          );
        }
      } catch (err) {
        if (err.status === 401) {
          setTokenError(true);
        } else {
          setFilesError("Failed to load repository files.");
        }
      } finally {
        setFilesLoading(false);
      }
    },
    [ghToken]
  );

  const handlePreview = useCallback(
    async (file) => {
      setPreviewFile(file);
      setStep(STEPS.PREVIEW);
      setPreviewLoading(true);
      try {
        const content = await fetchFileContent(
          ghToken,
          selectedRepo.owner.login,
          selectedRepo.name,
          file.path
        );
        setPreviewHtml(content);
      } catch {
        setPreviewHtml("<!-- Failed to load preview -->");
      } finally {
        setPreviewLoading(false);
      }
    },
    [ghToken, selectedRepo]
  );

  const toggleFileSelection = useCallback((path) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const handleImport = useCallback(async () => {
    if (!selectedRepo || selectedFiles.size === 0) return;
    setImporting(true);
    track("github-import", {
      repo: selectedRepo.full_name,
      fileCount: selectedFiles.size,
    });

    try {
      const filesToImport = htmlFiles.filter((f) => selectedFiles.has(f.path));
      const fileContents = {};

      for (const file of filesToImport) {
        const content = await fetchFileContent(
          ghToken,
          selectedRepo.owner.login,
          selectedRepo.name,
          file.path
        );
        // Use just the filename, not full path
        const filename = file.path.includes("/")
          ? file.path.split("/").pop()
          : file.path;
        fileContents[filename] = content;
      }

      onImport?.({
        repoName: selectedRepo.name,
        repoFullName: selectedRepo.full_name,
        files: fileContents,
        primaryFile: fileContents["index.html"]
          ? "index.html"
          : Object.keys(fileContents)[0],
      });

      closeModal();
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setImporting(false);
    }
  }, [selectedRepo, selectedFiles, htmlFiles, ghToken, onImport, closeModal]);

  const handleReconnect = useCallback(async () => {
    try {
      await signInWithGitHub();
    } catch (err) {
      console.error("GitHub reconnect failed:", err);
    }
  }, [signInWithGitHub]);

  const goBack = useCallback(() => {
    if (step === STEPS.PREVIEW) {
      setStep(STEPS.FILES);
      setPreviewFile(null);
      setPreviewHtml("");
    } else if (step === STEPS.FILES) {
      setStep(STEPS.REPOS);
      setSelectedRepo(null);
      setHtmlFiles([]);
      setSiteInfo(null);
    }
  }, [step]);

  const handleClose = () => {
    setStep(STEPS.REPOS);
    setSelectedRepo(null);
    setHtmlFiles([]);
    setSearchQuery("");
    setPreviewFile(null);
    setPreviewHtml("");
    setSelectedFiles(new Set());
    closeModal();
  };

  if (!shouldRender) return null;

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return "today";
    if (diff < 172800000) return "yesterday";
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      className={`modal-overlay ${isVisible ? "active" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`modal-content modal-content--lg ${
          isVisible ? "active" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header-section">
          <div className="modal-header">
            <div className="modal-title">
              {step !== STEPS.REPOS && (
                <button
                  className="gh-import__back"
                  onClick={goBack}
                  aria-label="Go back"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <Github size={16} />
              <span>
                {step === STEPS.REPOS && "Import from GitHub"}
                {step === STEPS.FILES && selectedRepo?.name}
                {step === STEPS.PREVIEW && (previewFile?.path || "Preview")}
              </span>
            </div>
            <button
              className="modal-close"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <div className="modal-subtitle">
            {step === STEPS.REPOS &&
              "Select a repository to import HTML files from."}
            {step === STEPS.FILES &&
              `${htmlFiles.length} HTML file${
                htmlFiles.length !== 1 ? "s" : ""
              } found`}
            {step === STEPS.PREVIEW && "Preview the file before importing."}
          </div>
        </div>

        <div className="modal-body">
          {/* Token error state */}
          {tokenError && (
            <div className="gh-import__token-error">
              <AlertTriangle size={20} />
              <div className="gh-import__token-error-text">
                <strong>GitHub access required</strong>
                <p>
                  {user?.app_metadata?.provider === "github"
                    ? "Your GitHub token has expired. Please sign in again to reconnect."
                    : "Sign in with GitHub to import repositories."}
                </p>
              </div>
              <button
                className="gh-import__reconnect-btn"
                onClick={handleReconnect}
              >
                <Github size={14} />
                <span>
                  {user?.app_metadata?.provider === "github"
                    ? "Reconnect"
                    : "Sign in with GitHub"}
                </span>
              </button>
            </div>
          )}

          {/* STEP: Repos */}
          {!tokenError && step === STEPS.REPOS && (
            <>
              <div className="gh-import__search">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Filter repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              {reposError && <div className="modal-error">{reposError}</div>}

              <div className="gh-import__repo-list">
                {reposLoading && repos.length === 0 ? (
                  <div className="gh-import__loading">
                    <Loader2 size={18} className="spinning" />
                    <span>Loading repositories...</span>
                  </div>
                ) : filteredRepos.length === 0 ? (
                  <div className="gh-import__empty">
                    <FolderOpen size={20} />
                    <span>No repositories found</span>
                  </div>
                ) : (
                  <>
                    {filteredRepos.map((repo) => (
                      <button
                        key={repo.id}
                        className="gh-import__repo-item"
                        onClick={() => handleSelectRepo(repo)}
                      >
                        <div className="gh-import__repo-icon">
                          {repo.private ? (
                            <Lock size={14} />
                          ) : (
                            <Globe size={14} />
                          )}
                        </div>
                        <div className="gh-import__repo-info">
                          <div className="gh-import__repo-name">
                            {repo.name}
                          </div>
                          {repo.description && (
                            <div className="gh-import__repo-desc">
                              {repo.description}
                            </div>
                          )}
                        </div>
                        <div className="gh-import__repo-meta">
                          <span className="gh-import__repo-date">
                            {formatDate(repo.updated_at)}
                          </span>
                          <ChevronRight size={14} />
                        </div>
                      </button>
                    ))}
                    {hasMore && !searchQuery && (
                      <button
                        className="gh-import__load-more"
                        onClick={() => loadRepos(page + 1)}
                        disabled={reposLoading}
                      >
                        {reposLoading ? (
                          <Loader2 size={14} className="spinning" />
                        ) : (
                          "Load more"
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* STEP: Files */}
          {!tokenError && step === STEPS.FILES && (
            <>
              {filesLoading ? (
                <div className="gh-import__loading">
                  <Loader2 size={18} className="spinning" />
                  <span>Scanning repository...</span>
                </div>
              ) : filesError ? (
                <div className="gh-import__files-error">
                  <AlertTriangle size={18} />
                  <span>{filesError}</span>
                </div>
              ) : (
                <>
                  {siteInfo &&
                    !siteInfo.isStatic &&
                    siteInfo.hasPackageJson && (
                      <div className="gh-import__warning">
                        <AlertTriangle size={14} />
                        <span>
                          This repo has a package.json. Importing raw HTML may
                          not capture the full site. Best results come from
                          static HTML repos.
                        </span>
                      </div>
                    )}

                  <div className="gh-import__file-list">
                    {htmlFiles.map((file) => (
                      <div key={file.path} className="gh-import__file-item">
                        <label className="gh-import__file-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file.path)}
                            onChange={() => toggleFileSelection(file.path)}
                          />
                          <span className="gh-import__file-check-visual" />
                        </label>
                        <FileCode size={14} className="gh-import__file-icon" />
                        <div className="gh-import__file-info">
                          <span className="gh-import__file-path">
                            {file.path}
                          </span>
                          <span className="gh-import__file-size">
                            {formatSize(file.size)}
                          </span>
                        </div>
                        <button
                          className="gh-import__file-preview-btn"
                          onClick={() => handlePreview(file)}
                          title="Preview"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="gh-import__actions">
                    <span className="gh-import__actions-count">
                      {selectedFiles.size} of {htmlFiles.length} selected
                    </span>
                    <button
                      className="gh-import__import-btn"
                      onClick={handleImport}
                      disabled={selectedFiles.size === 0 || importing}
                    >
                      {importing ? (
                        <>
                          <Loader2 size={14} className="spinning" />{" "}
                          Importing...
                        </>
                      ) : (
                        <>
                          <Download size={14} /> Import {selectedFiles.size}{" "}
                          file{selectedFiles.size !== 1 ? "s" : ""}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* STEP: Preview */}
          {!tokenError && step === STEPS.PREVIEW && (
            <div className="gh-import__preview">
              {previewLoading ? (
                <div className="gh-import__loading">
                  <Loader2 size={18} className="spinning" />
                  <span>Loading preview...</span>
                </div>
              ) : (
                <div className="gh-import__preview-frame-wrapper">
                  <iframe
                    className="gh-import__preview-frame"
                    srcDoc={previewHtml}
                    sandbox="allow-scripts"
                    title="File preview"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GithubImportModal;
