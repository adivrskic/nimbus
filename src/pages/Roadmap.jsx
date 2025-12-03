// pages/Roadmap.jsx
import { ArrowUp } from "lucide-react";
import "./SecondaryPages.scss";

function Roadmap() {
  const roadmapItems = [
    {
      status: "completed",
      title: "Core Template System",
      description:
        "Professional templates with real-time customization and export",
    },
    {
      status: "completed",
      title: "Dark Mode Support",
      description: "Light, dark, and auto themes for all templates",
    },
    {
      status: "in-progress",
      title: "Easy Deployments",
      description: "One-click deployment to popular hosting platforms",
      badge: "Paid Feature",
    },
    {
      status: "planned",
      title: "Custom Styling Editor",
      description:
        "Advanced visual editor for fine-tuning colors, fonts, and spacing",
    },
    {
      status: "planned",
      title: "Form Builder",
      description:
        "Add contact forms, signup forms, and surveys with backend integration",
    },
    {
      status: "planned",
      title: "Multi-Page Sites",
      description: "Create full websites with multiple pages and navigation",
    },
    {
      status: "planned",
      title: "Blog System",
      description:
        "Built-in blog templates with markdown support and RSS feeds",
    },
    {
      status: "planned",
      title: "Advanced Components",
      description:
        "Galleries, testimonials, pricing tables, and more pre-built sections",
    },
    {
      status: "planned",
      title: "Custom Domain Management",
      description:
        "Connect and manage your own domain names directly through Nimbus",
      badge: "Paid Feature",
    },
  ];

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-header__title">Roadmap</h1>
          <p className="page-header__subtitle">
            What we're building and what's coming next.
          </p>
        </header>

        {/* Main Content */}
        <div className="page-content">
          {/* Status Legend */}
          <div className="status-legend">
            <div className="status-legend__item">
              <span className="status-legend__dot status-legend__dot--completed"></span>
              Completed
            </div>
            <div className="status-legend__item">
              <span className="status-legend__dot status-legend__dot--in-progress"></span>
              In Progress
            </div>
            <div className="status-legend__item">
              <span className="status-legend__dot"></span>
              Planned
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`timeline-item timeline-item--${item.status}`}
              >
                <div className="timeline-item__marker"></div>
                <div className="timeline-item__content">
                  <h3>
                    {item.title}
                    {item.badge && (
                      <span className="timeline-item__badge">{item.badge}</span>
                    )}
                  </h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Request CTA */}
          <div className="contact-block">
            <h3 className="contact-block__title">Have a feature request?</h3>
            <p className="contact-block__text">
              We'd love to hear your ideas. Reach out at{" "}
              <a href="mailto:hello@nimbus.com">hello@nimbus.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;
