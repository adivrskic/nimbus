import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Edit3,
  Trash2,
  Loader2,
  FileCode,
  AlertTriangle,
  FolderOpen,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProject } from "../../contexts/ProjectContext";
import { supabase } from "../../lib/supabaseClient";
import useModalAnimation from "../../hooks/useModalAnimation";
import { track } from "../../lib/analytics";

import "../../styles/modals.scss";

function ProjectsModal({
  isOpen,
  onClose,
  onEditProject,
  onDeployProject,
  onDomainSetup,
}) {
  const { user } = useAuth();
  const { projects, isLoading, fetchProjects, removeProjectFromCache } =
    useProject();
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [copied, setCopied] = useState(null);

  // Fetch projects when modal opens (uses cache if available)
  useEffect(() => {
    if (isOpen && user) {
      fetchProjects();
    }
  }, [isOpen, user, fetchProjects]);

  // Clear delete error when modal closes
  useEffect(() => {
    if (!isOpen) {
      setDeleteError(null);
      setDeletingId(null);
    }
  }, [isOpen]);

  const handleEdit = async (project) => {
    setLoadingAction({ id: project.id, type: "edit" });
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project.id)
        .single();

      if (error) throw error;

      onEditProject?.(data);
      closeModal();
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeploy = async (project) => {
    setLoadingAction({ id: project.id, type: "deploy" });
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project.id)
        .single();

      if (error) throw error;

      onDeployProject?.(data);
      closeModal();
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDomain = (project) => {
    onDomainSetup?.(project);
    closeModal();
  };

  const handleDelete = async (projectId) => {
    setDeleteError(null);
    setDeletingId(projectId);
  };

  const confirmDelete = async (projectId) => {
    setIsDeleting(true);
    setDeleteError(null);

    track("delete", {
      projectId,
    });

    try {
      const { data, error } = await supabase.functions.invoke(
        "delete-project",
        {
          body: { projectId },
        }
      );

      if (error) throw error;

      // Check for warnings (partial failures)
      if (data.warnings && data.warnings.length > 0) {
        console.warn("Delete completed with warnings:", data.warnings);
      }

      // Remove from cache
      removeProjectFromCache(projectId);
      setDeletingId(null);
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteError(err.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
    setDeleteError(null);
  };

  const toggleExpand = (projectId) => {
    track("expand-project", {
      projectId,
    });
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const copyUrl = (url, projectId) => {
    navigator.clipboard.writeText(url);
    setCopied(projectId);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getProjectName = (project) => {
    if (project.name) return project.name;
    if (project.customization?.prompt) {
      return (
        project.customization.prompt.slice(0, 40) +
        (project.customization.prompt.length > 40 ? "..." : "")
      );
    }
    return "Untitled Project";
  };

  const getDomainStatus = (project) => {
    if (project.custom_domain) {
      if (project.domain_status === "active") {
        return { text: project.custom_domain, status: "active" };
      }
      return { text: project.custom_domain, status: "pending" };
    }
    if (project.subdomain) {
      return {
        text: `nimbus-${project.subdomain}.vercel.app`,
        status: "default",
      };
    }
    return null;
  };

  const getDeployedUrl = (project) => {
    if (project.custom_domain && project.domain_status === "active") {
      return `https://${project.custom_domain}`;
    }
    if (project.deployed_url) {
      return project.deployed_url;
    }
    if (project.subdomain) {
      return `https://nimbus-${project.subdomain}.vercel.app`;
    }
    return null;
  };

  const hasSubscription = (project) => {
    return !!(project.stripe_subscription_id || project.subscription_id);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`modal-content modal-content--lg ${
          isVisible ? "active" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header section */}
        <div className="modal-header-section">
          <div className="modal-header">
            <div className="modal-title">
              <FolderOpen size={16} />
              <span>Projects</span>
            </div>
            <button className="modal-close" onClick={closeModal}>
              <X size={16} />
            </button>
          </div>

          <div className="modal-subtitle">
            Your saved projects. Click a project to continue editing.
          </div>
        </div>

        {/* Scrollable body section */}
        <div className="modal-body">
          <div className="projects-list">
            {isLoading ? (
              <div className="projects-loading">
                <Loader2 size={16} className="spinning" />
              </div>
            ) : projects.length === 0 ? (
              <div className="projects-empty">
                <span>No projects yet</span>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`project-item ${
                    deletingId === project.id ? "deleting" : ""
                  } ${expandedProject === project.id ? "expanded" : ""}`}
                >
                  {/* Delete confirmation overlay */}
                  {deletingId === project.id && (
                    <div className="project-delete-confirm">
                      {deleteError ? (
                        <>
                          <div className="delete-error">
                            <AlertTriangle size={14} />
                            <span>{deleteError}</span>
                          </div>
                          <button
                            className="delete-cancel"
                            onClick={cancelDelete}
                          >
                            Close
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="delete-actions">
                            <button
                              className="delete-cancel"
                              onClick={cancelDelete}
                              disabled={isDeleting}
                            >
                              Cancel
                            </button>
                            <button
                              className="delete-confirm"
                              onClick={() => confirmDelete(project.id)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 size={12} className="spinning" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div
                    className="project-main"
                    onClick={() => handleEdit(project)}
                  >
                    <div className="project-info">
                      <div className="project-name">
                        <FileCode size={14} />
                        <span>{getProjectName(project)}</span>
                      </div>
                      <div className="project-meta">
                        <span className="project-date">
                          <Calendar size={10} />
                          <span> {formatDate(project.updated_at)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="project-actions">
                      {/* Delete button */}
                      <button
                        className="action-btn action-btn--danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expandedProject === project.id && (
                    <div className="project-expanded">
                      {getDeployedUrl(project) && (
                        <div className="project-url">
                          <span className="url-label">URL:</span>
                          <div className="url-container">
                            <a
                              href={getDeployedUrl(project)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="url-value"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {getDeployedUrl(project)}
                            </a>
                            <button
                              className="copy-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyUrl(getDeployedUrl(project), project.id);
                              }}
                              title="Copy URL"
                            >
                              {copied === project.id ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="project-expanded-actions">
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeploy(project);
                          }}
                          disabled={loadingAction?.id === project.id}
                          title="Deploy"
                        >
                          {loadingAction?.id === project.id &&
                          loadingAction?.type === "deploy" ? (
                            <Loader2 size={14} className="spinning" />
                          ) : (
                            "Deploy"
                          )}
                        </button>
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDomain(project);
                          }}
                          title="Domain Setup"
                        >
                          Domain
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
