import { useState } from "react";
import {
  CheckCircle,
  Clock,
  Circle,
  X,
  Calendar,
  ChevronDown,
} from "lucide-react";

import "../../styles/modals.scss";

function RoadmapModal({ isOpen, onClose }) {
  const [openSections, setOpenSections] = useState(["in-progress", "planned"]);

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
    {
      status: "completed",
      title: "AI Revisions",
      description: "Refine your site with follow-up prompts",
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
    {
      status: "in-progress",
      title: "Multi-Page Sites",
      description: "Generate full websites with navigation",
    },
    // Planned
    {
      status: "planned",
      title: "CMS Integration",
      description: "Connect to Sanity, Contentful, or Strapi",
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

  const sections = [
    {
      key: "completed",
      label: "Completed",
      icon: <CheckCircle size={14} />,
      items: roadmapItems.filter((i) => i.status === "completed"),
    },
    {
      key: "in-progress",
      label: "In Progress",
      icon: <Clock size={14} />,
      items: roadmapItems.filter((i) => i.status === "in-progress"),
    },
    {
      key: "planned",
      label: "Planned",
      icon: <Circle size={14} />,
      items: roadmapItems.filter((i) => i.status === "planned"),
    },
  ];

  const toggleSection = (key) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-content modal-content--lg ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header section */}
        <div className="modal-header-section">
          <div className="modal-header">
            <div className="modal-title">
              <Calendar size={16} />
              <span>Roadmap</span>
            </div>
            <button className="modal-close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          <div className="modal-subtitle">
            What we're building and what's coming next.
          </div>
        </div>

        {/* Scrollable body section */}
        <div className="modal-body">
          <div className="roadmap-accordion">
            {sections.map((section) => {
              const isExpanded = openSections.includes(section.key);
              return (
                <div
                  key={section.key}
                  className={`roadmap-accordion__section roadmap-accordion__section--${section.key}`}
                >
                  <button
                    className="roadmap-accordion__trigger"
                    onClick={() => toggleSection(section.key)}
                    aria-expanded={isExpanded}
                  >
                    <div className="roadmap-accordion__trigger-left">
                      <span
                        className={`roadmap-accordion__status-icon roadmap-accordion__status-icon--${section.key}`}
                      >
                        {section.icon}
                      </span>
                      <span className="roadmap-accordion__label">
                        {section.label}
                      </span>
                      <span className="roadmap-accordion__count">
                        {section.items.length}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`roadmap-accordion__chevron ${
                        isExpanded ? "roadmap-accordion__chevron--open" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`roadmap-accordion__content ${
                      isExpanded ? "roadmap-accordion__content--open" : ""
                    }`}
                    aria-hidden={!isExpanded}
                  >
                    <div className="roadmap-accordion__items">
                      {section.items.map((item, index) => (
                        <div
                          key={index}
                          className={`roadmap-item roadmap-item--${item.status}`}
                        >
                          <div className="roadmap-item__icon">
                            {item.status === "completed" && (
                              <CheckCircle size={14} />
                            )}
                            {item.status === "in-progress" && (
                              <Clock size={14} />
                            )}
                            {item.status === "planned" && <Circle size={14} />}
                          </div>
                          <div className="roadmap-item__content">
                            <h4 className="roadmap-item__title">
                              {item.title}
                            </h4>
                            <p className="roadmap-item__description">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="modal-contact">
            <h5 className="modal-contact__title">Suggest a feature</h5>
            <p className="modal-contact__text">
              Email{" "}
              <a
                href="mailto:hello@nimbuswebsites.com"
                className="modal-contact__link"
              >
                hello@nimbuswebsites.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapModal;
