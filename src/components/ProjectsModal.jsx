import { useState, useEffect } from "react";
import {
  X,
  FolderOpen,
  Search,
  Calendar,
  Edit3,
  Trash2,
  ExternalLink,
  Rocket,
  MoreVertical,
  Loader2,
  FileCode,
  Globe,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./ProjectsModal.scss";

function ProjectsModal({ isOpen, onClose, onEditProject, onDeployProject }) {
  const { user } = useAuth();
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch projects on mount
  useEffect(() => {
    if (isOpen && user) {
      fetchProjects();
    }
  }, [isOpen, user]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      // Demo projects for development
      setProjects([
        {
          id: "1",
          name: "Tech Startup Landing",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deployed_url: "https://tech-startup.nimbus.site",
          template_type: "landing",
        },
        {
          id: "2",
          name: "Portfolio Site",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          deployed_url: null,
          template_type: "portfolio",
        },
        {
          id: "3",
          name: "Restaurant Menu",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
          deployed_url: "https://gourmet-eats.nimbus.site",
          template_type: "restaurant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(projectId);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete project");

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
      setActiveMenu(null);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`projects-modal ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={closeModal}>
          <X size={20} />
        </button>

        <div className="projects-modal__header">
          <div className="header-icon">
            <FolderOpen size={24} />
          </div>
          <h2>My Projects</h2>
          <p>Manage your saved website projects</p>
        </div>

        <div className="projects-modal__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="projects-modal__content">
          {isLoading ? (
            <div className="projects-loading">
              <Loader2 size={32} className="spinning" />
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="projects-empty">
              <FileCode size={48} />
              <h3>No projects yet</h3>
              <p>Create your first website to see it here</p>
            </div>
          ) : (
            <div className="projects-list">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-card__icon">
                    <FileCode size={20} />
                  </div>

                  <div className="project-card__info">
                    <h3>{project.name}</h3>
                    <div className="project-card__meta">
                      <span className="template-type">
                        {project.template_type}
                      </span>
                      <span className="date">
                        <Calendar size={12} />
                        {formatDate(project.updated_at)}
                      </span>
                    </div>
                    {project.deployed_url && (
                      <a
                        href={project.deployed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card__url"
                      >
                        <Globe size={12} />
                        {project.deployed_url.replace("https://", "")}
                      </a>
                    )}
                  </div>

                  <div className="project-card__status">
                    {project.deployed_url ? (
                      <span className="status status--live">Live</span>
                    ) : (
                      <span className="status status--draft">Draft</span>
                    )}
                  </div>

                  <div className="project-card__actions">
                    <button
                      className="action-btn"
                      onClick={() => onEditProject?.(project)}
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>

                    {!project.deployed_url && (
                      <button
                        className="action-btn action-btn--primary"
                        onClick={() => onDeployProject?.(project)}
                        title="Deploy"
                      >
                        <Rocket size={16} />
                      </button>
                    )}

                    {project.deployed_url && (
                      <a
                        href={project.deployed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn"
                        title="Visit site"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}

                    <div className="action-menu">
                      <button
                        className="action-btn"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === project.id ? null : project.id
                          )
                        }
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenu === project.id && (
                        <div className="action-dropdown">
                          <button onClick={() => onEditProject?.(project)}>
                            <Edit3 size={14} />
                            Edit Project
                          </button>
                          {!project.deployed_url && (
                            <button onClick={() => onDeployProject?.(project)}>
                              <Rocket size={14} />
                              Deploy
                            </button>
                          )}
                          <button
                            className="danger"
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                          >
                            {deletingId === project.id ? (
                              <Loader2 size={14} className="spinning" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsModal;
