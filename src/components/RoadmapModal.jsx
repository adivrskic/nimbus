import { CheckCircle, Clock, Circle, X, Calendar } from "lucide-react";
import "./RoadmapModal.scss";

function RoadmapModal({ isOpen, onClose }) {
  const roadmapItems = [
    {
      status: "completed",
      title: "Core Templates",
      description: "Professional templates with customization",
    },
    {
      status: "completed",
      title: "Dark Mode",
      description: "Light, dark, and auto themes",
    },
    {
      status: "in-progress",
      title: "Easy Deployments",
      description: "One-click to hosting platforms",
    },
    {
      status: "planned",
      title: "Visual Editor",
      description: "Advanced styling and layout controls",
    },
    {
      status: "planned",
      title: "Form Builder",
      description: "Contact forms with backend integration",
    },
    {
      status: "planned",
      title: "Multi-Page Sites",
      description: "Full websites with navigation",
    },
    {
      status: "planned",
      title: "Blog System",
      description: "Built-in blog with markdown support",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className={`roadmap-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className={`roadmap-content ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="roadmap-header">
          <div className="roadmap-title">
            <Calendar size={16} />
            <span>Roadmap</span>
          </div>
          <button className="roadmap-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="roadmap-subtitle">
          What we're building and what's coming next.
        </div>

        <div className="roadmap-legend">
          <div className="legend-item">
            <span className="legend-dot legend-dot--completed"></span>
            <span>Complete</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--in-progress"></span>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--planned"></span>
            <span>Planned</span>
          </div>
        </div>

        <div className="roadmap-items">
          {roadmapItems.map((item, index) => (
            <div
              key={index}
              className={`roadmap-item roadmap-item--${item.status}`}
            >
              <div className="roadmap-item__icon">
                {item.status === "completed" && <CheckCircle size={14} />}
                {item.status === "in-progress" && <Clock size={14} />}
                {item.status === "planned" && <Circle size={14} />}
              </div>
              <div className="roadmap-item__content">
                <h4 className="roadmap-item__title">{item.title}</h4>
                <p className="roadmap-item__description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="roadmap-contact">
          <h5 className="roadmap-contact__title">Suggest a feature</h5>
          <p className="roadmap-contact__text">
            Email{" "}
            <a href="mailto:hello@nimbus.com" className="roadmap-contact__link">
              hello@nimbus.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RoadmapModal;
