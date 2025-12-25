import "./SecondaryPages.scss";

function Roadmap() {
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

  return (
    <div className="page">
      <div className="container">
        <header className="page-header">
          <h1 className="page-header__title">Roadmap</h1>
          <p className="page-header__subtitle">
            What we're building and what's coming next.
          </p>
        </header>

        <div className="page-content">
          <div className="status-legend">
            <div className="status-legend__item">
              <span className="status-legend__dot status-legend__dot--completed"></span>
              Complete
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

          <div className="timeline">
            {roadmapItems.map((item, index) => (
              <div
                key={index}
                className={`timeline-item timeline-item--${item.status}`}
              >
                <div className="timeline-item__marker"></div>
                <div className="timeline-item__content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-block">
            <h3 className="contact-block__title">Suggest a feature</h3>
            <p className="contact-block__text">
              Email <a href="mailto:hello@nimbus.com">hello@nimbus.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;
