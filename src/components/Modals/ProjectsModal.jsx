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
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProject } from "../../contexts/ProjectContext";
import { supabase } from "../../lib/supabaseClient";
import useModalAnimation from "../../hooks/useModalAnimation";
import "./ProjectsModal.scss";

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

  const [searchQuery, setSearchQuery] = useState("");
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
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const copyUrl = (url, projectId) => {
    navigator.clipboard.writeText(url);
    setCopied(projectId);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredProjects = projects.filter((project) => {
    const name = project.name || project.customization?.prompt || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
      className={`projects-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`projects-content ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="projects-header">
          <span className="projects-title">
            <FolderOpen size={16} />
            <span>Projects</span>
          </span>
          <button className="projects-close" onClick={closeModal}>
            <X size={16} />
          </button>
        </div>
        <div className="projects-list">
          {isLoading ? (
            <div className="projects-loading">
              <Loader2 size={16} className="spinning" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="projects-empty">
              <span>No projects yet</span>
            </div>
          ) : (
            filteredProjects.map((project) => (
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
                        <div className="delete-warning">
                          {project.is_deployed && (
                            <span className="delete-info">
                              <AlertTriangle size={12} />
                              This will remove the live site
                              {hasSubscription(project) &&
                                " and cancel the subscription"}
                            </span>
                          )}
                        </div>
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
                  onClick={() =>
                    project.is_deployed && toggleExpand(project.id)
                  }
                >
                  <div className="project-info">
                    <div className="project-name">
                      <FileCode size={14} />
                      <span>{getProjectName(project)}</span>
                    </div>
                    <div className="project-meta">
                      <span className="project-type">
                        {project.template_type || project.style_preset}
                      </span>
                      <span className="project-date">
                        <Calendar size={10} />
                        {formatDate(project.updated_at)}
                      </span>
                      {/* {project.is_deployed && (
                        <span className="project-status live">Live</span>
                      )} */}
                      {/* {hasSubscription(project) && (
                        <span className="project-status subscribed">Pro</span>
                      )} */}
                    </div>
                  </div>

                  <div className="project-actions">
                    {/* Edit button */}
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project);
                      }}
                      disabled={loadingAction?.id === project.id}
                      title="Edit"
                    >
                      {loadingAction?.id === project.id &&
                      loadingAction?.type === "edit" ? (
                        <Loader2 size={14} className="spinning" />
                      ) : (
                        <Edit3 size={14} />
                      )}
                    </button>

                    {/* Deploy/Visit button */}
                    {/* {project.is_deployed ? (
                      <>
                        <a
                          href={getDeployedUrl(project)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn"
                          title="Visit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={14} />
                        </a>
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(project.id);
                          }}
                          title="Manage"
                        >
                          <ChevronDown
                            size={14}
                            style={{
                              transform:
                                expandedProject === project.id
                                  ? "rotate(180deg)"
                                  : "rotate(0)",
                              transition: "transform 0.2s",
                            }}
                          />
                        </button>
                      </>
                    ) : (
                      <button
                        className="action-btn action-btn--primary"
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
                          <Rocket size={14} />
                        )}
                      </button>
                    )} */}

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

                {/* Expanded section for deployed projects */}
                {/* {project.is_deployed && expandedProject === project.id && (
                  <div className="project-expanded">
                    <div className="project-domains">
                      <div className="project-domain-section">
                        <label>Current URL</label>
                        <div className="project-url-row">
                          <a
                            href={getDeployedUrl(project)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {getDeployedUrl(project)?.replace("https://", "")}
                          </a>
                          <button
                            className="copy-btn"
                            onClick={() =>
                              copyUrl(getDeployedUrl(project), project.id)
                            }
                          >
                            {copied === project.id ? (
                              <Check size={12} />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>

                      {getDomainStatus(project) && (
                        <div className="project-domain-section">
                          <label>Domain Status</label>
                          <div className="project-domain-status">
                            <span
                              className={`status-badge ${
                                getDomainStatus(project).status
                              }`}
                            >
                              {getDomainStatus(project).status === "active" && (
                                <Check size={10} />
                              )}
                              {getDomainStatus(project).status ===
                                "pending" && (
                                <Loader2 size={10} className="spinning" />
                              )}
                              {getDomainStatus(project).status}
                            </span>
                          </div>
                        </div>
                      )}

                      {hasSubscription(project) && (
                        <div className="project-domain-section">
                          <label>Subscription</label>
                          <div className="project-subscription-status">
                            <span className="status-badge active">
                              <Check size={10} />
                              Active
                            </span>
                          </div>
                        </div>
                      )}
                    </div> */}
                {/* 
                    <div className="project-domain-actions">
                      {project.custom_domain ? (
                        <button
                          className="domain-action-btn"
                          onClick={() => handleDomain(project)}
                        >
                          <Settings size={14} />
                          Manage Domain
                        </button>
                      ) : (
                        <button
                          className="domain-action-btn domain-action-btn--primary"
                          onClick={() => handleDomain(project)}
                        >
                          <Globe size={14} />
                          Add Custom Domain
                        </button>
                      )}

                      <button
                        className="domain-action-btn"
                        onClick={() => handleDeploy(project)}
                        title="Redeploy with changes"
                      >
                        <RefreshCw size={14} />
                        Redeploy
                      </button>
                    </div> */}
                {/* </div>
                )} */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
