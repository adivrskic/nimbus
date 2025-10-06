import { Check, Clock, Sparkles, Rocket, Palette, FileText, Globe, Zap } from 'lucide-react';
import './Roadmap.scss';

function Roadmap() {
  const roadmapItems = [
    {
      status: 'completed',
      icon: <Check size={24} />,
      title: 'Core Template System',
      description: 'Professional templates with real-time customization and export'
    },
    {
      status: 'completed',
      icon: <Check size={24} />,
      title: 'Dark Mode Support',
      description: 'Light, dark, and auto themes for all templates'
    },
    {
      status: 'in-progress',
      icon: <Clock size={24} />,
      title: 'Easy Deployments',
      description: 'One-click deployment to popular hosting platforms (Netlify, Vercel, GitHub Pages)',
      badge: 'Paid Feature'
    },
    {
      status: 'planned',
      icon: <Palette size={24} />,
      title: 'Custom Styling Editor',
      description: 'Advanced visual editor for fine-tuning colors, fonts, and spacing'
    },
    {
      status: 'planned',
      icon: <FileText size={24} />,
      title: 'Form Builder',
      description: 'Add contact forms, signup forms, and surveys with backend integration'
    },
    {
      status: 'planned',
      icon: <Globe size={24} />,
      title: 'Multi-Page Sites',
      description: 'Create full websites with multiple pages and navigation'
    },
    {
      status: 'planned',
      icon: <Sparkles size={24} />,
      title: 'Blog System',
      description: 'Built-in blog templates with markdown support and RSS feeds'
    },
    {
      status: 'planned',
      icon: <Zap size={24} />,
      title: 'Advanced Components',
      description: 'Galleries, testimonials, pricing tables, and more pre-built sections'
    },
    {
      status: 'planned',
      icon: <Rocket size={24} />,
      title: 'Custom Domain Management',
      description: 'Connect and manage your own domain names directly through SiteForge',
      badge: 'Paid Feature'
    }
  ];

  return (
    <div className="roadmap-page">
      <div className="container">
        <div className="roadmap-header">
          <h1>Roadmap</h1>
        </div>

        <div className="roadmap-legend">
          <div className="legend-item">
            <div className="status-badge status-badge--completed">
              Completed
            </div>
          </div>
          <div className="legend-item">
            <div className="status-badge status-badge--in-progress">
              In Progress
            </div>
          </div>
          <div className="legend-item">
            <div className="status-badge status-badge--planned">
              Planned
            </div>
          </div>
        </div>

        <div className="roadmap-timeline">
          {roadmapItems.map((item, index) => (
            <div key={index} className={`roadmap-item roadmap-item--${item.status}`}>
              <div className="roadmap-item__icon">
                {item.icon}
              </div>
              <div className="roadmap-item__content">
                <div className="roadmap-item__header">
                  <h3 className="roadmap-item__title">{item.title}</h3>
                  {item.badge && (
                    <span className="roadmap-badge">{item.badge}</span>
                  )}
                </div>
                <p className="roadmap-item__description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="roadmap-cta">
          <h2>Have a feature request?</h2>
          <p>We'd love to hear your ideas! Reach out to us at <a href="mailto:hello@nimbus.com">hello@nimbus.com</a></p>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;