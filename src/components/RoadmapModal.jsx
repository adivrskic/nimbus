import { useState } from "react";
import { CheckCircle, Clock, Circle, X, Mail, Calendar } from "lucide-react";

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
    <div className="roadmap-overlay" onClick={onClose}>
      <div className="roadmap-content" onClick={(e) => e.stopPropagation()}>
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
            <span className="legend-text">Complete</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--in-progress"></span>
            <span className="legend-text">In Progress</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--planned"></span>
            <span className="legend-text">Planned</span>
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

      <style jsx>{`
        .roadmap-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          opacity: 0;
          animation: fadeIn 0.2s ease forwards;
        }

        .roadmap-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 90%;
          max-width: 440px;
          max-height: 80vh;
          padding: 24px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          opacity: 0;
          transform: translateY(8px);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          overflow-y: auto;
        }

        .roadmap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        .roadmap-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.125rem;
          font-weight: 700;
          color: #2b2b2b;
        }

        .roadmap-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(0, 0, 0, 0.04);
          border: none;
          border-radius: 50%;
          color: #666;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .roadmap-close:hover {
          background: rgba(0, 0, 0, 0.08);
          color: #2b2b2b;
        }

        .roadmap-subtitle {
          font-size: 0.875rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .roadmap-legend {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          margin-bottom: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #b3b3b3;
        }

        .legend-dot--completed {
          background: #10b981;
        }

        .legend-dot--in-progress {
          background: #f59e0b;
        }

        .legend-dot--planned {
          background: #6b7280;
        }

        .legend-text {
          font-size: 0.75rem;
          color: #666;
        }

        .roadmap-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .roadmap-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
          transition: all 0.15s ease;
        }

        .roadmap-item:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .roadmap-item__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
        }

        .roadmap-item--completed .roadmap-item__icon {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .roadmap-item--in-progress .roadmap-item__icon {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .roadmap-item--planned .roadmap-item__icon {
          color: #6b7280;
          background: rgba(107, 114, 128, 0.1);
        }

        .roadmap-item__content {
          flex: 1;
          min-width: 0;
        }

        .roadmap-item__title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2b2b2b;
          margin: 0 0 4px 0;
        }

        .roadmap-item__description {
          font-size: 0.8125rem;
          line-height: 1.5;
          color: #666;
          margin: 0;
        }

        .roadmap-contact {
          padding: 16px;
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
          margin-top: 8px;
        }

        .roadmap-contact__title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #2b2b2b;
          margin: 0 0 8px 0;
        }

        .roadmap-contact__text {
          font-size: 0.8125rem;
          line-height: 1.5;
          color: #666;
          margin: 0;
        }

        .roadmap-contact__link {
          color: #2b2b2b;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .roadmap-contact__link:hover {
          color: #10b981;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .roadmap-content {
            width: 95%;
            max-height: 85vh;
            padding: 20px;
          }

          .roadmap-legend {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default RoadmapModal;
