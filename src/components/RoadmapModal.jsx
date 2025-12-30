import { CheckCircle, Clock, Circle, X, Calendar } from "lucide-react";
import "./RoadmapModal.scss";

function RoadmapModal({ isOpen, onClose }) {
  const roadmapItems = [
    // Completed
    {
      status: "completed",
      title: "AI Site Generation",
      description: "Generate complete sites from text prompts",
    },
    {
      status: "completed",
      title: "Dark Mode",
      description: "Light, dark, and auto themes",
    },
    {
      status: "completed",
      title: "Real-Time Preview",
      description: "Instant preview as you customize",
    },
    {
      status: "completed",
      title: "Code Export",
      description: "Download clean, production-ready code",
    },
    // In Progress
    {
      status: "in-progress",
      title: "One-Click Deploy",
      description: "Automatic deployment to Vercel, Netlify & more",
    },
    {
      status: "in-progress",
      title: "Advanced Customization",
      description: "Fine-tune colors, fonts, spacing & layouts",
    },
    // Planned
    {
      status: "planned",
      title: "CMS Integration",
      description: "Connect to Sanity, Contentful, or Strapi",
    },
    {
      status: "planned",
      title: "AI Revisions",
      description: "Refine your site with follow-up prompts",
    },
    {
      status: "planned",
      title: "Multi-Page Sites",
      description: "Generate full websites with navigation",
    },
    {
      status: "planned",
      title: "Form Builder",
      description: "Contact forms with backend integration",
    },
    {
      status: "planned",
      title: "Custom Domains",
      description: "Connect your own domain with SSL",
    },
    {
      status: "planned",
      title: "Analytics Dashboard",
      description: "Track visitors and engagement",
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
