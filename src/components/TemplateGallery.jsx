import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import './TemplateGallery.scss';

const templates = [
  {
    id: 'business-card',
    name: 'Modern Business Card',
    description: 'Sleek horizontal card with all your contact details',
    category: 'Personal',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop'
  },
  {
    id: 'profile',
    name: 'Personal Profile',
    description: 'Clean profile page with social links',
    category: 'Personal',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop'
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Bold, immersive landing page for product launches',
    category: 'Landing Page',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop'
  },
  {
    id: 'startup-hero',
    name: 'Startup Hero',
    description: 'Clean, conversion-focused landing page with stats',
    category: 'Landing Page',
    featured: false,
    preview: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=600&h=400&fit=crop'
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining Menu',
    description: 'Elegant menu for upscale restaurants',
    category: 'Restaurant',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop'
  },
  {
    id: 'casual-bistro',
    name: 'Casual Bistro Menu',
    description: 'Warm, inviting menu for cafes and bistros',
    category: 'Restaurant',
    featured: false,
    preview: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop'
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Full-featured portfolio with projects, about, and contact',
    category: 'Portfolio',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&h=400&fit=crop'
  },
  {
    id: 'agency-showcase',
    name: 'Agency Showcase',
    description: 'Modern agency site with portfolio and team highlights',
    category: 'Business',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
  },
  {
    id: 'saas-product',
    name: 'SaaS Product',
    description: 'Feature-rich product page with pricing and testimonials',
    category: 'Business',
    featured: false,
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
  },
  {
    id: 'consulting-firm',
    name: 'Consulting Firm',
    description: 'Professional consulting site with services and expertise',
    category: 'Business',
    featured: false,
    preview: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop'
  },
  {
    id: 'split-profile',
    name: 'Split Profile',
    description: 'Modern split-screen layout with image sidebar',
    category: 'Personal',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop'
  },
  {
    id: 'photography-grid',
    name: 'Photography Grid',
    description: 'Clean grid layout perfect for showcasing photography work',
    category: 'Portfolio',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop'
  },
  {
    id: 'photography-masonry',
    name: 'Photography Masonry',
    description: 'Dynamic masonry layout for fine art photography portfolios',
    category: 'Portfolio',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&h=400&fit=crop'
  }
];

function TemplateGallery({ onTemplateSelect }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);

  const categories = ['All', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = activeFilter === 'All' 
    ? templates 
    : activeFilter === 'Featured'
    ? templates.filter(t => t.featured)
    : templates.filter(t => t.category === activeFilter);

  const displayedTemplates = filteredTemplates.slice(0, displayCount);
  const hasMore = displayCount < filteredTemplates.length;

  const handleTemplateClick = (templateId) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    } else {
      navigate(`/customize/${templateId}`);
    }
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const featuredCount = templates.filter(t => t.featured).length;

  // Reset display count when filter changes
  const handleFilterChange = (category) => {
    setActiveFilter(category);
    setDisplayCount(6);
  };

  return (
    <div className="template-gallery">
      <div className="template-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-tab ${activeFilter === category ? 'active' : ''}`}
            onClick={() => handleFilterChange(category)}
          >
            {category}
            <span className="filter-count">
              {category === 'All' 
                ? templates.length 
                : templates.filter(t => t.category === category).length}
            </span>
          </button>
        ))}
        <button
          className={`filter-tab filter-tab--featured ${activeFilter === 'Featured' ? 'active' : ''}`}
          onClick={() => handleFilterChange('Featured')}
        >
          <Star size={16} fill={activeFilter === 'Featured' ? 'currentColor' : 'none'} />
          Featured
          <span className="filter-count">{featuredCount}</span>
        </button>
      </div>

      <div className="template-gallery__grid">
        {displayedTemplates.map((template) => (
          <div 
            key={template.id} 
            className="template-card"
            onClick={() => handleTemplateClick(template.id)}
          >
            {template.featured && (
              <div className="template-card__badge">
                <Star size={14} fill="currentColor" />
                Featured
              </div>
            )}
            
            <div className="template-card__preview">
              <img 
                src={template.preview} 
                alt={template.name}
                loading="lazy"
              />
              <div className="template-card__overlay">
                <button className="btn btn-primary">
                  Customize
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            
            <div className="template-card__content">
              <div className="template-card__header">
                <h3 className="template-card__title">{template.name}</h3>
                <span className="template-card__category">{template.category}</span>
              </div>
              <p className="template-card__description">{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="template-gallery__load-more">
          <button className="btn btn-secondary btn-lg" onClick={loadMore}>
            Load More Templates
            <span className="load-more-count">
              ({filteredTemplates.length - displayCount} remaining)
            </span>
          </button>
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="template-gallery__empty">
          <p>No templates found in this category.</p>
        </div>
      )}
    </div>
  );
}

export default TemplateGallery;