import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Search, X } from 'lucide-react';
import { getAllTemplates } from '../utils/templateSystem';
import { getAllThemes } from '../styles/themes';
import './TemplateGallery.scss';

// Get templates from the new system
const templateData = getAllTemplates();
const themes = getAllThemes();

// Mapping categories to Unsplash topics
const UNSPLASH_CATEGORY_MAP = {
  Personal: "portrait,person,profile",
  Business: "business,office,teamwork",
  Portfolio: "creative,design,portfolio",
  Creative: "creative,art,design",
  "Landing Page": "website,landing page,ui",
  Restaurant: "restaurant,food,dining",
  Events: "events,concert,party",
  Education: "education,school,students",
  "Health & Wellness": "wellness,health,spa",
  Services: "services,agency,workplace",
};

// Helper to generate a random Unsplash image URL
const generateUnsplashImage = (category) => {
  const query = UNSPLASH_CATEGORY_MAP[category] || "website,minimal";
  const randomSig = Math.floor(Math.random() * 10000);

  return `https://source.unsplash.com/600x400/?${query}&sig=${randomSig}`;
};


const templates = templateData.map(template => ({
  id: template.id,
  name: template.name,
  description: template.description,
  category: template.category,
  featured: Math.random() > 0.5,
  preview: generateUnsplashImage(template.category),
  supportedThemes: template.supportedThemes,
  defaultTheme: template.defaultTheme
}));


// Categories with counts
const categories = [
  { name: 'All Templates', count: templates.length },
  { name: 'Featured', count: templates.filter(t => t.featured).length },
  { name: 'Personal', count: templates.filter(t => t.category === 'Personal').length },
  { name: 'Business', count: templates.filter(t => t.category === 'Business').length },
  { name: 'Portfolio', count: templates.filter(t => t.category === 'Portfolio' || t.category === 'Creative').length },
  { name: 'Landing Page', count: templates.filter(t => t.category === 'Landing Page').length },
  { name: 'Restaurant', count: templates.filter(t => t.category === 'Restaurant').length },
  { name: 'Events', count: templates.filter(t => t.category === 'Events').length },
  { name: 'Education', count: templates.filter(t => t.category === 'Education').length },
  { name: 'Health & Wellness', count: templates.filter(t => t.category === 'Health & Wellness').length },
  { name: 'Services', count: templates.filter(t => t.category === 'Services').length },
];

function TemplateGallery({ onTemplateSelect }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredTemplates = useMemo(() => {
    let filtered = [...templates];

    // Apply category filter
    if (activeFilter === 'Featured') {
      filtered = filtered.filter(t => t.featured);
    } else if (activeFilter !== 'All Templates') {
      // Handle Portfolio/Creative mapping
      if (activeFilter === 'Portfolio') {
        filtered = filtered.filter(t => t.category === 'Portfolio' || t.category === 'Creative');
      } else {
        filtered = filtered.filter(t => t.category === activeFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const visibleTemplates = filteredTemplates.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTemplates.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleTemplateClick = useCallback((templateId) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
  }, [onTemplateSelect]);

  return (
    <div className="template-gallery">
      {/* Search */}
      <div className="template-search">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={clearSearch}>
              <X size={16} />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="search-results-text">
            Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} 
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="template-filters-wrapper">
        <div className="template-filters">
          {categories.map(category => (
            <button
              key={category.name}
              className={`filter-tab ${activeFilter === category.name ? 'active' : ''} ${
                category.name === 'Featured' ? 'filter-tab--featured' : ''
              }`}
              onClick={() => setActiveFilter(category.name)}
            >
              {category.name === 'Featured' && <Star size={16} />}
              <span>{category.name}</span>
              <span className="filter-count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {visibleTemplates.length > 0 ? (
        <>
          <div className="template-gallery__grid">
            {visibleTemplates.map(template => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleTemplateClick(template.id)}
              >
                {template.featured && (
                  <div className="template-card__badge">
                    <Star size={14} />
                    <span>Featured</span>
                  </div>
                )}
                
                <div className="template-card__preview">
                  <img src={template.preview} alt={template.name} />
                  <div className="template-card__overlay">
                    <button className="btn btn--primary">
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
                  
                  {/* Theme badges */}
                  <div className="template-card__themes">
                    {template.supportedThemes && template.supportedThemes.slice(0, 3).map(themeId => {
                      const theme = themes.find(t => t.id === themeId);
                      return (
                        <span key={themeId} className="theme-badge" title={theme?.name}>
                          {theme?.name.charAt(0)}
                        </span>
                      );
                    })}
                    {template.supportedThemes && template.supportedThemes.length > 3 && (
                      <span className="theme-badge">+{template.supportedThemes.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="template-gallery__load-more">
              <button className="btn btn--secondary" onClick={handleLoadMore}>
                Load More Templates
                <span className="load-more-count">
                  ({filteredTemplates.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="template-gallery__empty">
          <Search size={48} />
          <p>No templates found</p>
        </div>
      )}
    </div>
  );
}

export default TemplateGallery;