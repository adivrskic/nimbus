import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTemplates } from '../utils/templateSystem';
import { getAllThemes } from '../styles/themes';
import { useTheme } from '../contexts/ThemeContext';
import {
  ArrowRight,
  Star,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  List,
  User,
  Building2,
  Briefcase,
  Monitor,
  UtensilsCrossed,
  CalendarDays,
  GraduationCap,
  HeartPulse,
  Wrench
} from 'lucide-react';
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
  // Education: "education,school,students",
  // "Health & Wellness": "wellness,health,spa",
  // Services: "services,agency,workplace",
};

const FILTER_ICONS = {
  All: List,
  Featured: Star,
  Personal: User,
  Business: Building2,
  Portfolio: Briefcase,
  "Landing Page": Monitor,
  Restaurant: UtensilsCrossed,
  Events: CalendarDays,
  // Forms: GraduationCap,
  // "Health & Wellness": HeartPulse,
  // Services: Wrench,
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
  preview: template.image,
  supportedThemes: template.supportedThemes,
  defaultTheme: template.defaultTheme
}));


// Categories with counts
const categories = [
  { name: 'All', count: templates.length },
  { name: 'Featured', count: templates.filter(t => t.featured).length },
  { name: 'Personal', count: templates.filter(t => t.category === 'Personal').length },
  { name: 'Business', count: templates.filter(t => t.category === 'Business').length },
  { name: 'Portfolio', count: templates.filter(t => t.category === 'Portfolio' || t.category === 'Creative').length },
  { name: 'Landing Page', count: templates.filter(t => t.category === 'Landing Page').length },
  { name: 'Restaurant', count: templates.filter(t => t.category === 'Restaurant').length },
  { name: 'Events', count: templates.filter(t => t.category === 'Events').length },
  // { name: 'Education', count: templates.filter(t => t.category === 'Education').length },
  // { name: 'Health & Wellness', count: templates.filter(t => t.category === 'Health & Wellness').length },
  // { name: 'Services', count: templates.filter(t => t.category === 'Services').length },
  { name: 'Forms', count: templates.filter(t => t.category === 'Forms').length },
];

const getTemplateImagePath = (templateName, theme) => {
  // Convert template name to kebab-case
  console.log(templateName, theme);
  const kebabName = templateName
    ?.toLowerCase()
    ?.replace(/\s+/g, '-')
    ?.replace(/[^a-z0-9-]/g, '');
  
  return `/templates/${kebabName}-${theme}.png`;
};

function TemplateGallery({ onTemplateSelect }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [leftArrowOpacity, setLeftArrowOpacity] = useState(0);
  const [rightArrowOpacity, setRightArrowOpacity] = useState(1);
  const scrollContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const filteredTemplates = useMemo(() => {
    let filtered = [...templates];

    // Apply category filter
    if (activeFilter === 'Featured') {
      filtered = filtered.filter(t => t.featured);
    } else if (activeFilter !== 'All') {
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

  // Check scroll position to update arrow opacity
  // const checkScrollPosition = useCallback(() => {
  //   const container = scrollContainerRef.current;
  //   if (!container) return;

  //   const { scrollLeft, scrollWidth, clientWidth } = container;
  //   const maxScroll = scrollWidth - clientWidth;
    
  //   // Calculate opacity based on scroll position
  //   // Fade in over the first/last 50px of scroll
  //   const fadeDistance = 50;
    
  //   // Left arrow: 0 opacity at start, 1 opacity after fadeDistance
  //   const leftOpacity = Math.min(scrollLeft / fadeDistance, 1);
    
  //   // Right arrow: 1 opacity at start, 0 opacity at end
  //   const rightOpacity = Math.min((maxScroll - scrollLeft) / fadeDistance, 1);
    
  //   setLeftArrowOpacity(leftOpacity);
  //   setRightArrowOpacity(rightOpacity);
  // }, []);

  // Scroll handler
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Drag to scroll handlers
  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startXRef.current) * 2; // Multiply for faster scroll
    container.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    const container = scrollContainerRef.current;
    if (container) {
      isDraggingRef.current = false;
      container.style.cursor = 'grab';
      container.style.removeProperty('user-select');
    }
  };

  // Setup scroll listener
  // useEffect(() => {
  //   const container = scrollContainerRef.current;
  //   if (!container) return;

  //   checkScrollPosition();
  //   container.addEventListener('scroll', checkScrollPosition);
  //   window.addEventListener('resize', checkScrollPosition);

  //   return () => {
  //     container.removeEventListener('scroll', checkScrollPosition);
  //     window.removeEventListener('resize', checkScrollPosition);
  //   };
  // }, [checkScrollPosition]);

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
        {/* {searchQuery && (
          <p className="search-results-text">
            Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} 
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )} */}
      </div>

      {/* Filters */}
      <div className="template-filters-wrapper">
        {/* Sticky filters on the left */}
        <div className="template-filters-sticky">
          {categories.slice(0, 2).map(category => (
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

        {/* Scrollable filters container */}
        <div className="template-filters-scroll-container">
          <button 
            className="scroll-arrow scroll-arrow-left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            // style={{ 
            //   opacity: leftArrowOpacity,
            //   pointerEvents: leftArrowOpacity < 0.1 ? 'none' : 'auto'
            // }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div 
            className="template-filters-scrollable"
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
          >
            {categories.slice(2).map(category => (
              <button
                key={category.name}
                className={`filter-tab ${activeFilter === category.name ? 'active' : ''}`}
                onClick={() => setActiveFilter(category.name)}
              >
                <span>{category.name}</span>
                <span className="filter-count">{category.count}</span>
              </button>
            ))}
          </div>

          <button 
            className="scroll-arrow scroll-arrow-right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            // style={{ 
            //   opacity: rightArrowOpacity,
            //   pointerEvents: rightArrowOpacity < 0.1 ? 'none' : 'auto'
            // }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Floating Filter Buttons */}
      <div className="mobile-filter-fab">
        {categories.map((cat, i) => {
          const Icon = FILTER_ICONS[cat.name] || List;

          return (
            <React.Fragment key={cat.name}>
              {i === 2 && <hr className='mobile-filter-divider' />}
              <button
                className={`mobile-filter-button ${activeFilter === cat.name ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat.name)}
                title={cat.name}
              >
                <Icon size={18} />
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Grid */}
      {visibleTemplates.length > 0 ? (
        <>
          <div className="template-gallery__grid">
            {visibleTemplates.map(template => {
              console.log('Template image path:', template.preview);// Add this
              return (
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
                  <img src={getTemplateImagePath(template?.name, theme)} alt={template.name} key={theme} />

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
                  
                  {/* Theme badges */}
                  {/* <div className="template-card__themes">
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
                  </div> */}
                </div>
              </div>
              );
            })}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="template-gallery__load-more">
              <button className="btn btn-secondary" onClick={handleLoadMore}>
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