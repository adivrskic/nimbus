import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { getAllTemplates } from "../utils/templateSystem";
import { getAllThemes } from "../styles/themes";
import { useTheme } from "../contexts/ThemeContext";
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
  Wrench,
} from "lucide-react";
import "./TemplateGallery.scss";

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
};

// Helper to generate a random Unsplash image URL
const generateUnsplashImage = (category) => {
  const query = UNSPLASH_CATEGORY_MAP[category] || "website,minimal";
  const randomSig = Math.floor(Math.random() * 10000);

  return `https://source.unsplash.com/600x400/?${query}&sig=${randomSig}`;
};

const templates = templateData.map((template) => ({
  id: template.id,
  name: template.name,
  description: template.description,
  category: template.category,
  featured: Math.random() > 0.5,
  preview: template.image,
  supportedThemes: template.supportedThemes,
  defaultTheme: template.defaultTheme,
}));

// Categories with counts
const categories = [
  { name: "All", count: templates.length },
  { name: "Featured", count: templates.filter((t) => t.featured).length },
  {
    name: "Personal",
    count: templates.filter((t) => t.category === "Personal").length,
  },
  {
    name: "Business",
    count: templates.filter((t) => t.category === "Business").length,
  },
  {
    name: "Portfolio",
    count: templates.filter(
      (t) => t.category === "Portfolio" || t.category === "Creative"
    ).length,
  },
  {
    name: "Landing Page",
    count: templates.filter((t) => t.category === "Landing Page").length,
  },
  {
    name: "Restaurant",
    count: templates.filter((t) => t.category === "Restaurant").length,
  },
  {
    name: "Events",
    count: templates.filter((t) => t.category === "Events").length,
  },
  {
    name: "Forms",
    count: templates.filter((t) => t.category === "Forms").length,
  },
];

const getTemplateImagePath = (templateName, theme) => {
  // Convert template name to kebab-case
  const kebabName = templateName
    ?.toLowerCase()
    ?.replace(/\s+/g, "-")
    ?.replace(/[^a-z0-9-]/g, "");

  return `/templates/${kebabName}-${theme}.png`;
};

function TemplateGallery({ onTemplateSelect }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [leftArrowOpacity, setLeftArrowOpacity] = useState(0);
  const [rightArrowOpacity, setRightArrowOpacity] = useState(1);
  const scrollContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const gridRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const scrollTemplatesToTop = () => {
    const grid =
      gridRef.current || document.querySelector(".template-gallery__grid");
    if (grid) {
      const isMobile = window.innerWidth < 768;

      let offset = 170;

      if (isMobile) {
        offset = 200;
      }

      const elementPosition = grid.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleFilterClick = (categoryName) => {
    setActiveFilter(categoryName);
    setVisibleCount(12); // Reset visible count when changing filters
    // Clear search when filter is clicked
    setSearchQuery("");
    setIsSearchExpanded(false);
    // Small delay to allow state update before scrolling
    setTimeout(() => {
      scrollTemplatesToTop();
    }, 50);
  };

  const filteredTemplates = useMemo(() => {
    let filtered = [...templates];

    // Apply category filter
    if (activeFilter === "Featured") {
      filtered = filtered.filter((t) => t.featured);
    } else if (activeFilter !== "All") {
      // Handle Portfolio/Creative mapping
      if (activeFilter === "Portfolio") {
        filtered = filtered.filter(
          (t) => t.category === "Portfolio" || t.category === "Creative"
        );
      } else {
        filtered = filtered.filter((t) => t.category === activeFilter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
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
    setVisibleCount((prev) => prev + 12);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      // Focus input when expanding
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      // Clear search when collapsing
      setSearchQuery("");
    }
  };

  // Close search when clicking outside (but NOT on template cards or grid)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isSearchExpanded) return;

      // Check if click is inside search area
      const isInsideSearch =
        searchContainerRef.current?.contains(event.target) ||
        searchInputRef.current?.contains(event.target) ||
        event.target.closest(".search-toggle") ||
        event.target.closest(".search-container");

      // Check if click is on a template card or the grid
      const isOnTemplateCard =
        event.target.closest(".template-card") ||
        event.target.closest(".template-gallery__grid");

      // Check if click is on filter buttons
      const isOnFilter =
        event.target.closest(".filter-tab") ||
        event.target.closest(".mobile-filter-button");

      // Only close search if clicking outside search AND not on templates
      // Filter clicks are handled separately in handleFilterClick
      if (!isInsideSearch && !isOnTemplateCard && !isOnFilter) {
        setIsSearchExpanded(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  // Scroll handler
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Drag to scroll handlers
  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    startXRef.current = e.pageX - container.offsetLeft;
    scrollLeftRef.current = container.scrollLeft;
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
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
      container.style.cursor = "grab";
      container.style.removeProperty("user-select");
    }
  };

  const handleTemplateClick = useCallback(
    (templateId) => {
      if (onTemplateSelect) {
        onTemplateSelect(templateId);
      }
    },
    [onTemplateSelect]
  );

  return (
    <div id="templates-section" className="template-gallery">
      {/* Integrated Search & Filters for Desktop */}
      <div className="template-filters-wrapper">
        {/* Search Toggle Button - Always visible */}
        <button
          className={`search-toggle ${isSearchExpanded ? "expanded" : ""}`}
          onClick={handleSearchToggle}
          title="Search templates"
        >
          <Search size={20} />
        </button>

        {/* Search Input - Expands when active */}
        <div
          ref={searchContainerRef}
          className={`search-container ${isSearchExpanded ? "expanded" : ""}`}
        >
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              ref={searchInputRef}
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
        </div>

        {/* Sticky filters on the left (All Templates & Featured) */}
        {/* <div className="template-filters-sticky">
          {categories.slice(0, 2).map((category) => (
            <button
              key={category.name}
              className={`filter-tab ${
                activeFilter === category.name ? "active" : ""
              }`}
              onClick={() => handleFilterClick(category.name)}
            >
              {category.name === "Featured" && <Star size={16} />}
              <p>{category.name}</p>
              <span className="filter-count">{category.count}</span>
            </button>
          ))}
        </div> */}

        {/* Scrollable filters container */}
        <div className="template-filters-scroll-container">
          <button
            className="scroll-arrow scroll-arrow-left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
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
            {categories.slice(0, 2).map((category) => (
              <button
                key={category.name}
                className={`filter-tab ${
                  activeFilter === category.name ? "active" : ""
                }`}
                onClick={() => handleFilterClick(category.name)}
              >
                {category.name === "Featured" && <Star size={16} />}
                <p>{category.name}</p>
                <span className="filter-count">{category.count}</span>
              </button>
            ))}
            {categories.slice(2).map((category) => (
              <button
                key={category.name}
                className={`filter-tab ${
                  activeFilter === category.name ? "active" : ""
                }`}
                onClick={() => handleFilterClick(category.name)}
              >
                <p>{category.name}</p>
                <span className="filter-count">{category.count}</span>
              </button>
            ))}
          </div>

          <button
            className="scroll-arrow scroll-arrow-right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
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
              {i === 2 && <hr className="mobile-filter-divider" />}
              <button
                className={`mobile-filter-button ${
                  activeFilter === cat.name ? "active" : ""
                }`}
                onClick={() => handleFilterClick(cat.name)}
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
          <div className="template-gallery__grid" ref={gridRef}>
            {visibleTemplates.map((template) => {
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
                    <img
                      src={getTemplateImagePath(template?.name, theme)}
                      alt={template.name}
                      key={theme}
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
                      <span className="template-card__category">
                        {template.category}
                      </span>
                    </div>
                    <p className="template-card__description">
                      {template.description}
                    </p>
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
