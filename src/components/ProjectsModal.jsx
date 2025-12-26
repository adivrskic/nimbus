import { useState, useEffect } from "react";
import {
  X,
  Search,
  Calendar,
  Edit3,
  Trash2,
  ExternalLink,
  Rocket,
  Loader2,
  FileCode,
  Globe,
  AlertTriangle,
  Check,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import useModalAnimation from "../hooks/useModalAnimation";
import "./ProjectsModal.scss";

function ProjectsModal({
  isOpen,
  onClose,
  onEditProject,
  onDeployProject,
  onDomainSetup,
}) {
  const { user } = useAuth();
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); // { id, type: 'edit' | 'deploy' }

  useEffect(() => {
    if (isOpen && user) {
      fetchProjects();
    }
  }, [isOpen, user]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-projects", {
        body: {},
      });

      if (error) throw error;

      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (project) => {
    setLoadingAction({ id: project.id, type: "edit" });
    try {
      // Fetch full project with html_content
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
      // Fetch full project with html_content
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
    setDeletingId(projectId);
  };

  const confirmDelete = async (projectId) => {
    try {
      const { error } = await supabase.functions.invoke("delete-project", {
        body: { projectId },
      });

      if (error) throw error;

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
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
      return { text: `${project.subdomain}.vercel.app`, status: "default" };
    }
    return null;
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
          <span className="projects-title">Projects</span>
          <button className="projects-close" onClick={closeModal}>
            <X size={16} />
          </button>
        </div>

        <div className="projects-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                }`}
              >
                {/* Delete confirmation overlay */}
                {deletingId === project.id && (
                  <div className="project-delete-confirm">
                    <AlertTriangle size={16} />
                    <span>Delete?</span>
                    <button className="delete-cancel" onClick={cancelDelete}>
                      Cancel
                    </button>
                    <button
                      className="delete-confirm"
                      onClick={() => confirmDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}

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
                    {project.is_deployed && (
                      <span className="project-status live">Live</span>
                    )}
                    {getDomainStatus(project) && (
                      <span
                        className={`project-domain ${
                          getDomainStatus(project).status
                        }`}
                      >
                        {getDomainStatus(project).status === "active" && (
                          <Check size={10} />
                        )}
                        {getDomainStatus(project).text}
                      </span>
                    )}
                  </div>
                </div>

                <div className="project-actions">
                  {/* Edit button */}
                  <button
                    className="action-btn"
                    onClick={() => handleEdit(project)}
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

                  {/* Domain button (only for deployed projects) */}
                  {project.is_deployed && (
                    <button
                      className="action-btn"
                      onClick={() => handleDomain(project)}
                      title={
                        project.custom_domain
                          ? "Manage Domain"
                          : "Add Custom Domain"
                      }
                    >
                      <Globe size={14} />
                    </button>
                  )}

                  {/* Deploy/Visit button */}
                  {project.is_deployed ? (
                    <a
                      href={
                        project.deployed_url ||
                        `https://nimbus-${project.subdomain}.vercel.app`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn"
                      title="Visit"
                    >
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <button
                      className="action-btn action-btn--primary"
                      onClick={() => handleDeploy(project)}
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
                  )}

                  {/* Delete button */}
                  <button
                    className="action-btn action-btn--danger"
                    onClick={() => handleDelete(project.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
