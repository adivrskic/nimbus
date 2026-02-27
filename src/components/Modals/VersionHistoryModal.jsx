import { useState, useEffect, useRef } from "react";
import {
  X,
  Clock,
  Sparkles,
  ChevronRight,
  Loader2,
  History,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import useModalAnimation from "../../hooks/useModalAnimation";
import "../../styles/modals.scss";

function VersionHistoryModal({ isOpen, onClose, project, onSelectVersion }) {
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );
  const [versions, setVersions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && project) {
      loadVersions();
    }
  }, [isOpen, project]);

  const loadVersions = () => {
    setIsLoading(true);
    try {
      const history = project.customization?.versionHistory || [];
      // Sort newest first
      const sorted = [...history].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Always include the current/initial version as v1
      const allVersions = [
        ...sorted,
        {
          id: "initial",
          label: "Initial generation",
          prompt: project.prompt || project.customization?.prompt || "",
          timestamp: project.created_at,
          isInitial: true,
        },
      ];

      setVersions(allVersions);
    } catch (err) {
      console.error("Error loading versions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleSelect = (version, index) => {
    const versionNumber = versions.length - index;
    onSelectVersion?.({
      ...version,
      versionNumber,
    });
    closeModal();
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
      style={{ zIndex: 1100 }}
    >
      <div
        className={`modal-content ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-section">
          <div className="modal-header">
            <div className="modal-title">
              <History size={16} />
              <span>Version History</span>
            </div>
            <button className="modal-close" onClick={closeModal}>
              <X size={16} />
            </button>
          </div>
          <div className="modal-subtitle">
            Browse previous iterations of this project.
          </div>
        </div>

        <div className="modal-body">
          <div className="version-list">
            {isLoading ? (
              <div className="version-loading">
                <Loader2 size={16} className="spinning" />
              </div>
            ) : versions.length === 0 ? (
              <div className="version-empty">
                <span>No version history yet</span>
              </div>
            ) : (
              versions.map((version, index) => {
                const versionNumber = versions.length - index;
                return (
                  <button
                    key={version.id}
                    className="version-item"
                    onClick={() => handleSelect(version, index)}
                  >
                    <div className="version-item__badge">v{versionNumber}</div>
                    <div className="version-item__info">
                      <span className="version-item__label">
                        {version.isInitial
                          ? "Initial generation"
                          : version.label || version.prompt || "Enhancement"}
                      </span>
                      <span className="version-item__time">
                        <Clock size={10} />
                        {formatDate(version.timestamp)}
                      </span>
                    </div>
                    <ChevronRight size={14} className="version-item__chevron" />
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VersionHistoryModal;
