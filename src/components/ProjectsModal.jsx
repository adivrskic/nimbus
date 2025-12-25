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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
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
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchProjects();
    }
  }, [isOpen, user]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-projects");

      if (error) throw error;

      setProjects(data?.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(projectId);
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

  const handleEdit = async (project) => {
    // Fetch full project with HTML content
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project.id)
        .single();

      if (error) throw error;

      if (data) {
        onEditProject?.(data);
        closeModal();
      }
    } catch (err) {
      console.error("Error loading project:", err);
    }
  };

  const handleDeploy = async (project) => {
    // Fetch full project with HTML content
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", project.id)
        .single();

      if (error) throw error;

      if (data) {
        onDeployProject?.(data);
        closeModal();
      }
    } catch (err) {
      console.error("Error loading project:", err);
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
    });
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
              <span>{searchQuery ? "No matches" : "No projects yet"}</span>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-info">
                  <div className="project-name">
                    <FileCode size={14} />
                    <span>{project.name}</span>
                  </div>
                  <div className="project-meta">
                    {project.template_type && (
                      <span className="project-type">
                        {project.template_type}
                      </span>
                    )}
                    <span className="project-date">
                      <Calendar size={10} />
                      {formatDate(project.updated_at)}
                    </span>
                    {project.is_deployed && project.deployed_url && (
                      <span className="project-status">Live</span>
                    )}
                  </div>
                </div>
                <div className="project-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleEdit(project)}
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  {project.is_deployed && project.deployed_url ? (
                    <a
                      href={project.deployed_url}
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
                      title="Deploy"
                    >
                      <Rocket size={14} />
                    </button>
                  )}
                  <button
                    className="action-btn action-btn--danger"
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    title="Delete"
                  >
                    {deletingId === project.id ? (
                      <Loader2 size={14} className="spinning" />
                    ) : (
                      <Trash2 size={14} />
                    )}
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
