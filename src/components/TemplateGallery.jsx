import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Search, X } from 'lucide-react';
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
  },
  {
    id: 'event-landing',
    name: 'Event Landing Page',
    description: 'Professional event page with speakers, schedule, and tickets',
    category: 'Events',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'
  },
  {
    id: 'baby-announcement',
    name: 'Baby Announcement',
    description: 'Beautiful announcement page for your new arrival',
    category: 'Events',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=400&fit=crop'
  },
  {
    id: 'teacher-profile',
    name: 'Teacher Profile',
    description: 'Professional profile page for educators',
    category: 'Education',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop'
  },
  {
    id: 'student-portfolio',
    name: 'Student Portfolio',
    description: 'Showcase your academic achievements and projects',
    category: 'Education',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1523050854057-8df90110c9f1?w=600&h=400&fit=crop'
  },
  {
    id: 'fitness-trainer',
    name: 'Fitness Trainer Profile',
    description: 'Bold, energetic profile for personal trainers',
    category: 'Health & Wellness',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop'
  },
  {
    id: 'wellness-coach',
    name: 'Wellness Coach',
    description: 'Calm, holistic coaching page with zen aesthetic',
    category: 'Health & Wellness',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop'
  },
  {
    id: 'musician-band',
    name: 'Musician/Band Page',
    description: 'Edgy, bold page for musicians and bands',
    category: 'Creative',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop'
  },
  {
    id: 'cleaning-service',
    name: 'Cleaning Service',
    description: 'Professional service page for cleaning businesses',
    category: 'Business',
    featured: true,
    preview: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop'
  },
  {
  id: 'real-estate-agent',
  name: 'Real Estate Agent',
  description: 'Professional real estate agent profile with listings',
  category: 'Business',
  featured: true,
  preview: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'
}
];

function TemplateGallery({ onTemplateSelect }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(templates.map(t => t.category))];

  // Memoize filtered templates - filters by category AND search
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Filter by category
    if (activeFilter === 'Featured') {
      filtered = filtered.filter(t => t.featured);
    } else if (activeFilter !== 'All') {
      filtered = filtered.filter(t => t.category === activeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const displayedTemplates = useMemo(() => 
    filteredTemplates.slice(0, displayCount),
    [filteredTemplates, displayCount]
  );

  const hasMore = displayCount < filteredTemplates.length;
  const featuredCount = useMemo(() => 
    templates.filter(t => t.featured).length,
    []
  );

  const handleTemplateClick = useCallback((templateId) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    } else {
      navigate(`/customize/${templateId}`);
    }
  }, [onTemplateSelect, navigate]);

  const loadMore = useCallback(() => {
    setDisplayCount(prev => prev + 6);
  }, []);

  const handleFilterChange = useCallback((category) => {
    setActiveFilter(category);
    setDisplayCount(6);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <div className="template-gallery">
      {/* Horizontal Scrolling Filters */}
      <div className="template-filters-wrapper">
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
      </div>

      {/* Search Bar */}
      <div className="template-search">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="search-results-text">
            Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Template Grid */}
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

      {/* Load More Button */}
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

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="template-gallery__empty">
          <Search size={48} />
          <p>No templates found matching "{searchQuery}"</p>
          <button className="btn btn-secondary" onClick={clearSearch}>
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

export default TemplateGallery;