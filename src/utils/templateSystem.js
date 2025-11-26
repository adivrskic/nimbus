// MVP Template System - Landing Page, Personal Profile, Restaurant
import { generateThemeCSS, getTheme } from './styleThemes';

class Template {
  constructor(id, config) {
    this.id = id;
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.supportedThemes = ['minimal', 'brutalist', 'gradient', 'elegant', 'retro', 'glassmorphism', 'neumorphism'];
    this.defaultTheme = config.defaultTheme || 'minimal';
    this.fields = config.fields;
    this.structure = config.structure;
    this.image = config.image;
  }

  render(customization, theme, colorMode = 'auto') {
    const normalizedColorMode = (colorMode || 'auto').toLowerCase();
    const html = this.structure(customization, theme);
    
    // Generate CSS variables for light and dark modes
    const lightColors = theme.colors.light;
    const darkColors = theme.colors.dark;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${customization.title || this.name}</title>
  ${this.getFontImports(theme)}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    /* Light mode (default) */
    :root {
      /* Colors */
      --color-bg: ${lightColors.bg};
      --color-surface: ${lightColors.surface};
      --color-text: ${lightColors.text};
      --color-text-secondary: ${lightColors.textSecondary};
      --color-border: ${lightColors.border};
      --color-border-hover: ${lightColors.borderHover};
      --color-accent: ${lightColors.accent};
      --color-switch: ${lightColors.switch};
      
      /* Typography */
      --font-heading: ${theme.fonts?.heading};
      --font-body: ${theme.fonts?.body};
      --text-hero: ${theme.typography?.hero};
      --text-h1: ${theme.typography?.h1};
      --text-h2: ${theme.typography?.h2};
      --text-h3: ${theme.typography?.h3};
      --text-body: ${theme.typography?.body};
      --text-small: ${theme.typography?.small};
      
      /* Spacing */
      --space-xs: ${theme.spacing?.xs};
      --space-sm: ${theme.spacing?.sm};
      --space-md: ${theme.spacing?.md};
      --space-lg: ${theme.spacing?.lg};
      --space-xl: ${theme.spacing?.xl};
      --space-xxl: ${theme.spacing?.xxl};
      
      /* Border Radius */
      --radius-sm: ${theme.radius?.sm};
      --radius-md: ${theme.radius?.md};
      --radius-lg: ${theme.radius?.lg};
      --radius-xl: ${theme.radius?.xl};
      --radius-full: 9999px;
      
      /* Shadows */
      --shadow-sm: ${theme.shadows?.sm};
      --shadow-md: ${theme.shadows?.md};
      --shadow-lg: ${theme.shadows?.lg};
      ${theme.shadows?.glow ? `--shadow-glow: ${theme.shadows?.glow};` : ''}
      ${theme.shadows?.inset ? `--shadow-inset: ${theme.shadows?.inset};` : ''}
      
      /* Gradients */
      ${theme.gradients ? Object.entries(theme.gradients).map(([key, value]) => 
        `--gradient-${key}: ${value};`
      ).join('\n      ') : ''}
    }
    
    /* Dark mode */
    [data-theme="dark"] {
      --color-bg: ${darkColors.bg};
      --color-surface: ${darkColors.surface};
      --color-text: ${darkColors.text};
      --color-text-secondary: ${darkColors.textSecondary};
      --color-border: ${darkColors.border};
      --color-border-hover: ${darkColors.borderHover};
      --color-accent: ${darkColors.accent};
      --color-switch: ${darkColors.switch};
    }
    
    body {
      font-family: var(--font-body);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--text-body);
      line-height: 1.6;
      transition: background 0.3s ease, color 0.3s ease;
    }
    
    h1, h2, h3 {
      font-family: var(--font-heading);
      line-height: 1.2;
      font-weight: 700;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-md);
    }
    
    @media (max-width: 768px) {
      .container { padding: 0 var(--space-sm); }
    }
    
    ${this.getThemeSpecificCSS(theme)}
  </style>
</head>
<body>
  ${html}
  
  <script>
    // Theme management
    function getStoredTheme() {
      return localStorage.getItem('theme') || 'light';
    }
    
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update all theme toggle switches
      const switches = document.querySelectorAll('.theme-toggle-switch');
      switches.forEach(switchEl => {
        switchEl.checked = theme === 'dark';
      });
    }
    
    function toggleTheme() {
      const currentTheme = getStoredTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    }
    
    // Initialize theme on load
    window.addEventListener('DOMContentLoaded', () => {
      const savedTheme = getStoredTheme();
      setTheme(savedTheme);
    });
  </script>
</body>
</html>`;
  }

  getFontImports(theme) {
    const fonts = new Set();
    Object.values(theme.fonts).forEach(font => {
      const fontName = font.split(',')[0].replace(/['"]/g, '').trim();
      if (!fontName.includes('-apple-system') && !fontName.includes('system')) {
        fonts.add(fontName);
      }
    });
    
    return Array.from(fonts).map(font => {
      const formattedFont = font.replace(/ /g, '+');
      return `<link href="https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">`;
    }).join('\n  ');
  }

  // Update the getThemeSpecificCSS method in the Template class
  getThemeSpecificCSS(theme) {
    const base = `
      /* Header Styles */
      header {
        background: var(--color-bg);
        transition: background 0.3s ease;
      }
      
      .theme-toggle-btn {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Toggle Switch */
      .theme-toggle-switch-wrapper {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
      }
      
      .theme-toggle-switch {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .theme-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-border);
        transition: 0.3s;
        border-radius: 26px;
        border: 2px solid var(--color-border);
      }
      
      .theme-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background-color: var(--color-switch);
        transition: 0.3s;
        border-radius: 50%;
      }
      
      .theme-toggle-switch:checked + .theme-toggle-slider {
        background-color: var(--color-accent);
        border-color: var(--color-accent);
      }
      
      .theme-toggle-switch:checked + .theme-toggle-slider:before {
        transform: translateX(22px);
      }
      
      .theme-toggle-slider:hover {
        opacity: 0.8;
      }
      
      .btn {
        display: inline-block;
        padding: var(--space-sm) var(--space-md);
        border-radius: var(--radius-md);
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s;
        border: 2px solid var(--color-text);
        background: var(--color-text);
        color: var(--color-bg);
      }
      
      .btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
      
      .btn-outline {
        background: transparent;
        color: var(--color-text);
        border: 2px solid var(--color-border);
      }
      
      .btn-outline:hover {
        border-color: var(--color-text);
      }
      
      .card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: var(--space-md);
        box-shadow: var(--shadow-sm);
        transition: all 0.3s;
      }
      
      .card:hover {
        box-shadow: var(--shadow-md);
        border-color: var(--color-border-hover);
        transform: translateY(-4px);
      }
    `;

    const themeSpecific = {
      minimal: `
        /* Minimal - Clean and simple */
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        h1, h2, h3 {
          letter-spacing: -0.02em;
          font-weight: 700;
        }
        .btn {
          border-radius: 8px;
        }
        .card {
          border-radius: 12px;
        }
      `,
      brutalist: `
        /* Brutalist - Bold and raw */
        body {
          font-family: 'Arial Black', 'Arial Bold', sans-serif;
        }
        h1, h2, h3 {
          text-transform: uppercase;
          letter-spacing: 0.02em;
          font-weight: 900;
        }
        .btn {
          border: 4px solid var(--color-text);
          text-transform: uppercase;
          font-weight: 900;
          letter-spacing: 0.05em;
          border-radius: 0;
        }
        .btn:hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0 var(--color-border);
        }
        .card {
          border: 4px solid var(--color-border);
          border-radius: 0;
        }
        .card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0 var(--color-border);
        }
        header {
          border-bottom: 4px solid var(--color-text);
        }
      `,
      gradient: `
        /* Gradient - Smooth transitions */
        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }
        h1, h2, h3 {
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .gradient-text {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn {
          background: var(--gradient-primary);
          border: none;
          border-radius: 999px;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        .btn:hover {
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }
        .btn-outline {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .card {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
        }
        .card:hover {
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
        }
        header {
          backdrop-filter: blur(10px);
        }
      `,
      retro: `
        /* Retro - 80s vibes */
        body {
          font-family: 'Space Mono', 'Courier New', monospace;
          position: relative;
        }
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255, 47, 181, 0.03) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 47, 181, 0.03) 2px, transparent 2px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        main {
          position: relative;
          z-index: 1;
        }
        h1, h2 {
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 700;
          text-shadow: 3px 3px 0 var(--color-accent);
        }
        .btn {
          text-transform: uppercase;
          letter-spacing: 1px;
          border: 2px solid var(--color-accent);
          border-radius: 999px;
          box-shadow: 0 0 30px var(--color-accent);
          font-weight: 700;
        }
        .btn:hover {
          box-shadow: 0 0 50px var(--color-accent);
        }
        .card {
          border: 2px solid var(--color-accent);
          position: relative;
          background: rgba(255, 47, 181, 0.05);
        }
        .card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: var(--gradient-primary);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: -1;
        }
        .card:hover::before {
          opacity: 0.2;
        }
        header {
          border-bottom: 3px solid var(--color-accent);
        }
      `,
      elegant: `
        /* Elegant - Sophisticated serif */
        body {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
        }
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        .btn {
          letter-spacing: 0.5px;
          border: 1px solid var(--color-border);
        }
        .btn-primary {
          background: var(--color-accent);
          border-color: var(--color-accent);
        }
        .card {
          border: 1px solid var(--color-border);
        }
        header {
          border-bottom: 1px solid var(--color-border);
        }
      `,
      glassmorphism: `
        /* Glassmorphism - Frosted glass effect */
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          background-attachment: fixed;
        }
        [data-theme="dark"] body {
          background: linear-gradient(135deg, #0f1729 0%, #1a0f2e 100%);
        }
        .card, .btn, header {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        [data-theme="dark"] .card,
        [data-theme="dark"] .btn,
        [data-theme="dark"] header {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .card {
          border-radius: 24px;
        }
        .btn {
          border-radius: 16px;
        }
        .card:hover {
          transform: translateY(-8px);
        }
      `,
      neumorphism: `
        /* Neumorphism - Soft UI with shadows */
        .card, .btn {
          background: var(--color-bg);
          box-shadow: var(--shadow-sm);
          border: none;
        }
        .card:hover, .btn:hover {
          box-shadow: var(--shadow-inset);
        }
        .btn:active {
          box-shadow: var(--shadow-inset);
          transform: scale(0.98);
        }
        .card {
          border-radius: 24px;
        }
        .btn {
          border-radius: 16px;
        }
        header {
          border: none;
        }
      `,
    };

    return base + (themeSpecific[theme.id] || '');
  }
}

export const templates = {
  // ============================================
  // TEMPLATE 1: LANDING PAGE
  // ============================================
  'landing-page': new Template('landing-page', {
    name: 'Landing Page',
    description: 'Complete landing page with hero, features, and CTA',
    category: 'Landing Page',
    image: '/templates/landing-page.png',
    fields: {
      companyName: { type: 'text', default: 'MINIMAL', label: 'Company Name', required: true },
      headline: { type: 'text', default: 'Less is More', label: 'Headline', required: true },
      subheadline: { 
        type: 'textarea',
        default: 'Clean design, thoughtful whitespace, and perfect typography. Focus on what matters with minimal distractions.',
        label: 'Subheadline'
      },
      ctaPrimary: { type: 'text', default: 'Get Started', label: 'Primary CTA' },
      ctaSecondary: { type: 'text', default: 'Learn More', label: 'Secondary CTA' },
      stats: {
        type: 'group',
        label: 'Statistics',
        itemLabel: 'Stat',
        min: 0,
        max: 4,
        fields: {
          number: { type: 'text', label: 'Number', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { number: '99.9%', label: 'Uptime Guarantee' },
          { number: '50K+', label: 'Active Users' },
          { number: '4.9', label: 'User Rating' }
        ]
      },
      featuresTitle: { type: 'text', default: 'Built for Simplicity', label: 'Features Section Title' },
      featuresSubtitle: { type: 'text', default: 'Everything you need, nothing you don\'t', label: 'Features Subtitle' },
      features: {
        type: 'group',
        label: 'Features',
        itemLabel: 'Feature',
        min: 1,
        max: 6,
        fields: {
          title: { type: 'text', label: 'Title', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' }
        },
        default: [
          { title: 'Clean Interface', description: 'Intuitive design that gets out of your way and lets you focus on your work.' },
          { title: 'Fast Performance', description: 'Optimized for speed with zero bloat. Every millisecond counts.' },
          { title: 'Responsive Design', description: 'Perfectly adapted for every screen size, from mobile to desktop.' }
        ]
      },
      testimonialQuote: { 
        type: 'textarea',
        default: '"The most elegant solution I\'ve found. Nothing unnecessary, everything essential."',
        label: 'Testimonial Quote'
      },
      testimonialAuthor: { type: 'text', default: 'Sarah Chen', label: 'Testimonial Author' },
      testimonialRole: { type: 'text', default: 'Product Designer', label: 'Author Role' }
    },
    structure: (data, theme) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || 'minimal';
      const isBrutalist = themeId === 'brutalist';
      const isGradient = themeId === 'gradient';
      const isElegant = themeId === 'elegant';
      const isRetro = themeId === 'retro';
      const isGlassmorphism = themeId === 'glassmorphism';
      const isNeumorphism = themeId === 'neumorphism';
      
      return `
      <!-- Sticky Header with Theme-Specific Styling -->
      <header style="padding: ${isBrutalist ? '2rem 0' : isElegant ? '2rem 0' : isNeumorphism ? '2rem 0' : '1.5rem 0'}; border-bottom: ${isBrutalist ? '4px' : isRetro ? '3px' : isNeumorphism ? 'none' : '1px'} solid ${isBrutalist || isRetro ? 'var(--color-accent)' : isNeumorphism || isGlassmorphism ? 'transparent' : 'var(--color-border)'}; position: sticky; top: 0; ${isGlassmorphism ? 'background: rgba(255, 255, 255, 0.1);' : 'background: var(--color-bg);'} z-index: 100; backdrop-filter: blur(${isGlassmorphism ? '20px' : '10px'}); ${isGlassmorphism ? 'box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);' : ''}">
        <div class="container">
          <nav style="display: flex; justify-content: space-between; align-items: center;">
            <div class="logo" style="font-weight: ${isBrutalist ? '900' : isNeumorphism || isElegant ? '700' : '600'}; font-size: ${isBrutalist ? '2rem' : isRetro ? '1.5rem' : isElegant ? '1.5rem' : isNeumorphism ? '1.25rem' : '1.125rem'}; letter-spacing: ${isBrutalist ? '2px' : isRetro ? '0' : isElegant ? '0' : '-0.02em'}; ${isBrutalist || isRetro ? 'text-transform: uppercase;' : ''} ${isGradient ? 'background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : isRetro ? 'background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : isElegant ? 'font-family: Playfair Display, serif; color: var(--color-accent);' : isNeumorphism || isGlassmorphism ? 'color: var(--color-accent);' : ''}">${data.companyName || 'MINIMAL'}</div>
            
            <!-- Desktop Navigation -->
            <ul class="nav-links" style="display: flex; gap: ${isBrutalist || isElegant ? '3rem' : '2rem'}; list-style: none; align-items: center;">
              <li><a href="#features" style="color: ${isGlassmorphism ? 'var(--color-text)' : 'var(--color-text-secondary)'}; text-decoration: none; font-size: ${isBrutalist ? '1.125rem' : isRetro ? '0.875rem' : '0.875rem'}; transition: ${isBrutalist ? 'all 0.1s' : 'color 0.2s'}; font-weight: ${isBrutalist ? '700' : isElegant ? '400' : '500'}; ${isBrutalist || isRetro ? 'text-transform: uppercase;' : ''} ${isRetro ? 'letter-spacing: 1px;' : isElegant ? 'letter-spacing: 0.5px;' : ''}" ${isBrutalist ? `onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'; this.style.padding='0.25rem 0.5rem'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text-secondary)'; this.style.padding='0'"` : isRetro ? `onmouseover="this.style.color='var(--color-accent)'; this.style.textShadow='0 0 10px var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'; this.style.textShadow='none'"` : isElegant ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'"` : isGlassmorphism ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'"` : `onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'"`}>Features</a></li>
              <li><a href="#testimonial" style="color: ${isGlassmorphism ? 'var(--color-text)' : 'var(--color-text-secondary)'}; text-decoration: none; font-size: ${isBrutalist ? '1.125rem' : isRetro ? '0.875rem' : '0.875rem'}; transition: ${isBrutalist ? 'all 0.1s' : 'color 0.2s'}; font-weight: ${isBrutalist ? '700' : isElegant ? '400' : '500'}; ${isBrutalist || isRetro ? 'text-transform: uppercase;' : ''} ${isRetro ? 'letter-spacing: 1px;' : isElegant ? 'letter-spacing: 0.5px;' : ''}" ${isBrutalist ? `onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'; this.style.padding='0.25rem 0.5rem'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text-secondary)'; this.style.padding='0'"` : isRetro ? `onmouseover="this.style.color='var(--color-accent)'; this.style.textShadow='0 0 10px var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'; this.style.textShadow='none'"` : isElegant ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'"` : isGlassmorphism ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'"` : `onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'"`}>Reviews</a></li>
              <li>
                <label class="theme-toggle-switch-wrapper" style="cursor: pointer;">
                  <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
                  <span class="theme-toggle-slider"></span>
                </label>
              </li>
            </ul>
            
            <!-- Mobile Menu Button & Theme Toggle -->
            <div class="mobile-controls" style="display: none; align-items: center; gap: 1rem;">
              <button class="theme-toggle-btn mobile-theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
                <span class="theme-icon"></span>
              </button>
              <button class="hamburger-btn" onclick="toggleMobileMenu()" aria-label="Menu" style="background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--color-text);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>
          </nav>
          
          <!-- Mobile Menu Dropdown -->
          <div class="mobile-menu" style="display: none; padding: 2rem 0 1rem; border-top: 1px solid ${isNeumorphism || isGlassmorphism ? 'transparent' : 'var(--color-border)'}; margin-top: 1rem;">
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 1.5rem;">
              <li><a href="#features" onclick="toggleMobileMenu()" style="color: var(--color-text); text-decoration: none; font-size: 1.125rem; font-weight: 500; display: block;">Features</a></li>
              <li><a href="#testimonial" onclick="toggleMobileMenu()" style="color: var(--color-text); text-decoration: none; font-size: 1.125rem; font-weight: 500; display: block;">Reviews</a></li>
              <li>
                <label class="theme-toggle-switch-wrapper" style="cursor: pointer;">
                  <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
                  <span class="theme-toggle-slider"></span>
                </label>
              </li>
              </ul>
          </div>
        </div>
      </header>

      <main>
        <!-- Hero Section with Theme-Specific Styling -->
        <section style="padding: ${isBrutalist ? '6rem 0' : isElegant ? '8rem 0' : '8rem 0 6rem'}; text-align: center; position: relative;">
          <div class="container">
            ${isGradient ? `<div style="display: inline-block; padding: 0.5rem 1.25rem; background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1)); border-radius: 999px; margin-bottom: 2rem; font-size: 0.875rem; font-weight: 600;">New Features Available</div>` : ''}
            ${isElegant ? `<div style="color: var(--color-accent); font-size: 0.875rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5rem; font-weight: 400;">Timeless Design</div>` : ''}
            
            <h1 style="font-family: ${isElegant ? 'Playfair Display, serif' : 'inherit'}; font-size: clamp(${isBrutalist || isRetro ? '3rem' : '2.5rem'}, ${isBrutalist || isRetro ? '10vw' : '7vw'}, ${isBrutalist || isRetro ? '8rem' : isGlassmorphism ? '6rem' : '5rem'}); font-weight: ${isBrutalist || isNeumorphism || isGlassmorphism ? '800' : isRetro ? '700' : isElegant ? '600' : '700'}; line-height: ${isBrutalist || isRetro ? '0.9' : isElegant ? '1.2' : '1.1'}; letter-spacing: ${isRetro ? '2px' : '-0.03em'}; margin-bottom: ${isElegant ? '2rem' : '1.5rem'}; ${isBrutalist || isRetro ? 'text-transform: uppercase;' : ''}">
              ${isBrutalist ? data.headline.split(' ').map((word, i) => i === 0 ? `<span style="background: var(--color-accent); color: var(--color-bg); padding: 0 0.5rem; display: inline-block; transform: rotate(-1deg);">${word}</span>` : word).join(' ') : ''}
              ${isGradient ? data.headline.split(' ').map((word, i) => i === data.headline.split(' ').length - 1 ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>` : word).join(' ') : ''}
              ${isRetro ? `<span data-text="${data.headline}" style="position: relative; background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${data.headline}</span>` : ''}
              ${!isBrutalist && !isGradient && !isRetro ? data.headline || 'Less is More' : ''}
            </h1>
            
            <p style="font-family: ${isElegant ? 'Lato, sans-serif' : isRetro ? 'Space Mono, monospace' : 'inherit'}; font-size: ${isBrutalist || isRetro ? '1.5rem' : isElegant || isGlassmorphism ? '1.125rem' : '1.125rem'}; font-weight: ${isElegant ? '300' : 'normal'}; color: var(--color-text-secondary); max-width: ${isElegant ? '680px' : isGlassmorphism ? '700px' : '600px'}; margin: 0 auto 3rem; line-height: ${isBrutalist || isRetro ? '1.6' : isElegant || isGlassmorphism ? '1.9' : '1.8'};">
              ${data.subheadline || 'Clean design, thoughtful whitespace, and perfect typography.'}
            </p>
            
            <div class="cta-group" style="display: flex; gap: ${isElegant ? '1.5rem' : isRetro ? '1.5rem' : '1rem'}; justify-content: center; flex-wrap: wrap;">
              ${data.ctaPrimary ? `
              <a href="#" style="padding: ${isBrutalist ? '1.5rem 3rem' : isGradient || isNeumorphism ? '1.125rem 2.5rem' : isElegant ? '1rem 2.5rem' : isRetro ? '1rem 2.5rem' : '1rem 2rem'}; border-radius: ${isGradient || isRetro ? '999px' : isBrutalist ? '0' : isGlassmorphism || isNeumorphism ? '16px' : isElegant ? '0' : '8px'}; text-decoration: none; font-weight: ${isBrutalist || isRetro ? '700' : isNeumorphism ? '600' : '500'}; transition: all ${isBrutalist || isRetro ? '0.1s' : '0.2s'}; display: inline-block; background: ${isGradient ? 'linear-gradient(135deg, #667eea, #764ba2)' : isGlassmorphism ? 'rgba(255,255,255,0.15)' : isNeumorphism ? 'var(--color-bg)' : isRetro ? 'linear-gradient(90deg, var(--color-accent), #b537f2)' : isElegant ? 'var(--color-accent)' : 'var(--color-accent)'}; color: ${isElegant ? 'white' : isGlassmorphism ? 'var(--color-text)' : isNeumorphism ? 'var(--color-text)' : 'white'}; ${isBrutalist ? 'text-transform: uppercase; border: 4px solid var(--color-text); background: var(--color-text); color: var(--color-bg); font-size: 1.125rem;' : isRetro ? 'text-transform: uppercase; letter-spacing: 1px; font-size: 0.9375rem; box-shadow: 0 0 30px var(--color-accent); border: 2px solid var(--color-accent);' : isElegant ? 'font-size: 0.9375rem; letter-spacing: 0.5px; border: 1px solid var(--color-accent);' : isGlassmorphism ? 'backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);' : isNeumorphism ? 'box-shadow: 6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9);' : ''} ${isGradient ? 'box-shadow: 0 10px 30px rgba(102,126,234,0.3);' : ''}" 
                onmouseover="this.style.transform='translateY(-2px)'; ${isBrutalist ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'` : isGradient ? `this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'` : isRetro ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 0 50px var(--color-accent)'` : isElegant ? `this.style.background='transparent'; this.style.color='var(--color-accent)'` : isGlassmorphism ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'` : isNeumorphism ? `this.style.boxShadow='inset 4px 4px 8px rgba(0,0,0,0.12), inset -4px -4px 8px rgba(255,255,255,0.9)'` : `this.style.opacity='0.9'`}" 
                onmouseout="this.style.transform='translateY(0)'; ${isBrutalist ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'` : isGradient ? `this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'` : isRetro ? `this.style.boxShadow='0 0 30px var(--color-accent)'` : isElegant ? `this.style.background='var(--color-accent)'; this.style.color='white'` : isGlassmorphism ? `this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'` : isNeumorphism ? `this.style.boxShadow='6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9)'` : `this.style.opacity='1'`}">
                ${data.ctaPrimary}
              </a>
              ` : ''}
              ${data.ctaSecondary ? `
              <a href="#" style="padding: ${isBrutalist ? '1.5rem 3rem' : isGradient || isNeumorphism ? '1.125rem 2.5rem' : isElegant ? '1rem 2.5rem' : isRetro ? '1rem 2.5rem' : '1rem 2rem'}; border-radius: ${isGradient || isRetro ? '999px' : isBrutalist ? '0' : isGlassmorphism || isNeumorphism ? '16px' : isElegant ? '0' : '8px'}; text-decoration: none; font-weight: ${isBrutalist || isRetro ? '700' : isNeumorphism ? '600' : '500'}; transition: all 0.2s; display: inline-block; border: ${isBrutalist ? '4px' : isRetro ? '2px' : isElegant ? '1px' : isGlassmorphism ? '1px' : '2px'} solid ${isBrutalist ? 'var(--color-text)' : isRetro ? '#00f5ff' : isElegant ? 'var(--color-border)' : isGlassmorphism ? 'rgba(255,255,255,0.1)' : 'var(--color-border)'}; color: var(--color-text); background: ${isBrutalist ? 'var(--color-bg)' : isGlassmorphism ? 'rgba(255,255,255,0.05)' : isNeumorphism ? 'var(--color-bg)' : 'transparent'}; ${isBrutalist || isRetro ? 'text-transform: uppercase; font-size: 1.125rem;' : isElegant ? 'font-size: 0.9375rem; letter-spacing: 0.5px;' : isRetro ? 'font-size: 0.9375rem; letter-spacing: 1px; box-shadow: 0 0 20px #00f5ff;' : isGlassmorphism ? 'backdrop-filter: blur(10px);' : isNeumorphism ? 'box-shadow: 6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9);' : ''}" 
                onmouseover="${isBrutalist ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'` : isRetro ? `this.style.background='#00f5ff'; this.style.color='#0d001a'; this.style.boxShadow='0 0 40px #00f5ff'` : isElegant ? `this.style.background='var(--color-surface)'; this.style.borderColor='var(--color-accent)'` : isGlassmorphism ? `this.style.background='rgba(255,255,255,0.1)'` : isNeumorphism ? `this.style.boxShadow='inset 4px 4px 8px rgba(0,0,0,0.12), inset -4px -4px 8px rgba(255,255,255,0.9)'` : `this.style.background='var(--color-surface)'`}" 
                onmouseout="${isBrutalist ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'` : isRetro ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='0 0 20px #00f5ff'` : isElegant ? `this.style.background='transparent'; this.style.borderColor='var(--color-border)'` : isGlassmorphism ? `this.style.background='rgba(255,255,255,0.05)'` : isNeumorphism ? `this.style.boxShadow='6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9)'` : `this.style.background='transparent'`}">
                ${data.ctaSecondary}
              </a>
              ` : ''}
            </div>
          </div>
        </section>

        <!-- Stats Section with Theme-Specific Styling -->
        ${data.stats && data.stats.length > 0 ? `
        <section class="stats-section" style="padding: ${isBrutalist ? '0' : isNeumorphism ? '0' : '4rem 0'}; background: ${isBrutalist ? 'var(--color-text)' : isGradient ? 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(240,147,251,0.1))' : isRetro ? 'var(--color-surface)' : isElegant ? 'var(--color-surface)' : isGlassmorphism ? 'rgba(255,255,255,0.02)' : 'var(--color-surface)'}; ${!isBrutalist && !isRetro ? 'border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);' : isRetro ? 'margin: 4rem 0; border-top: 3px solid var(--color-accent); border-bottom: 3px solid #00f5ff;' : ''} ${isGradient ? 'border-radius: 32px; margin: 0 2rem;' : isGlassmorphism ? 'backdrop-filter: blur(20px);' : ''}">
          <div class="container">
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(${isBrutalist ? '4' : '3'}, 1fr); gap: ${isBrutalist ? '0' : isRetro ? '3rem' : isNeumorphism ? '2.5rem' : '3rem'}; text-align: center;">
              ${data.stats.map((stat, index) => `
                <div class="stat" style="${isBrutalist ? `padding: 3rem; border: 3px solid var(--color-bg); min-height: 250px; display: flex; flex-direction: column; justify-content: center; ${index === 1 ? 'background: var(--color-accent); color: var(--color-bg);' : index === 2 ? 'background: #0000ff; color: var(--color-bg);' : 'color: var(--color-bg);'}` : isRetro ? `border: 3px solid #00f5ff; padding: 2rem; background: rgba(0,245,255,0.03); transition: all 0.3s;` : isNeumorphism ? `padding: 3rem 2rem; border-radius: 24px; box-shadow: 6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9); transition: all 0.3s;` : isGlassmorphism ? `padding: 2rem; border-radius: 20px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);` : ''}" ${isRetro ? `onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 40px #00f5ff'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"` : isNeumorphism ? `onmouseover="this.style.boxShadow='inset 4px 4px 8px rgba(0,0,0,0.12), inset -4px -4px 8px rgba(255,255,255,0.9)'" onmouseout="this.style.boxShadow='6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9)'"` : ''}>
                  <h3 style="font-size: ${isBrutalist ? '2rem' : isGradient ? '3.5rem' : isRetro ? '3rem' : isNeumorphism || isGlassmorphism ? '3rem' : '2.5rem'}; font-weight: ${isBrutalist ? '900' : isRetro || isNeumorphism || isGlassmorphism ? '800' : '700'}; margin-bottom: 0.5rem; ${isBrutalist ? 'text-transform: uppercase;' : isGradient ? 'background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : isRetro ? 'background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : isNeumorphism || isGlassmorphism ? 'color: var(--color-accent);' : 'color: var(--color-accent);'}">
                    ${stat.number}
                  </h3>
                  <p style="color: ${isBrutalist ? 'inherit' : 'var(--color-text-secondary)'}; font-size: ${isBrutalist ? '1.125rem' : isRetro ? '0.875rem' : isNeumorphism || isGlassmorphism ? '1rem' : '0.875rem'}; ${isBrutalist ? 'line-height: 1.5;' : isRetro ? 'text-transform: uppercase; letter-spacing: 2px;' : isNeumorphism || isGlassmorphism ? 'font-weight: 500;' : ''}">
                    ${stat.label}
                  </p>
                </div>
              `).join('')}
              ${isBrutalist && data.stats.length === 3 ? `
              <div class="stat" style="padding: 3rem; border: 3px solid var(--color-bg); min-height: 250px; display: flex; flex-direction: column; justify-content: center; color: var(--color-bg);">
                <h3 style="font-size: 2rem; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase;">READY?</h3>
                <p style="font-size: 1.125rem; line-height: 1.5;">Join thousands</p>
              </div>
              ` : ''}
            </div>
          </div>
        </section>
        ` : ''}

        <!-- Features Section with Theme-Specific Cards -->
        <section id="features" class="features" style="padding: ${isRetro || isElegant ? '8rem 0' : '6rem 0'};">
          <div class="container">
            ${isBrutalist ? `
            <div style="text-align: center; margin-bottom: 6rem;">
              <h2 style="font-size: clamp(2.5rem, 8vw, 6rem); line-height: 1.1; text-transform: uppercase; margin-bottom: 2rem; font-weight: 900;">
                ${data.featuresTitle || 'DESIGN IS'}<br>
                <span style="border-bottom: 6px solid var(--color-accent); display: inline-block;">COMMUNITY</span>
              </h2>
            </div>
            ` : isElegant ? `
            <div style="text-align: center; margin-bottom: 6rem;">
              <h2 style="font-family: Playfair Display, serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; margin-bottom: 1rem; letter-spacing: -0.01em;">
                ${data.featuresTitle || 'Our Philosophy'}
              </h2>
              <p style="color: var(--color-text-secondary); font-size: 1.125rem; font-weight: 300; max-width: 600px; margin: 0 auto;">
                ${data.featuresSubtitle || 'Crafted with care, designed for longevity'}
              </p>
            </div>
            ` : isRetro ? `
            <h2 style="font-size: clamp(2rem, 6vw, 3.5rem); text-align: center; margin-bottom: 4rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 700; background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${data.featuresTitle || 'Power Features'}
            </h2>
            ` : isNeumorphism ? `
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); text-align: center; margin-bottom: 4rem; font-weight: 800;">
              ${data.featuresTitle || 'Soft & Subtle'}
            </h2>
            ` : `
            <h2 class="section-title" style="font-size: clamp(2rem, 5vw, 3rem); font-weight: ${isGradient || isGlassmorphism ? '800' : '700'}; text-align: center; margin-bottom: 1rem; letter-spacing: -0.02em;">
              ${data.featuresTitle || 'Built for Simplicity'}
            </h2>
            <p class="section-desc" style="text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 4rem; font-size: 1.125rem;">
              ${data.featuresSubtitle || 'Everything you need, nothing you don\'t'}
            </p>
            `}
            
            <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${isBrutalist || isElegant ? '320px' : '280px'}, 1fr)); gap: ${isElegant ? '4rem 3rem' : isNeumorphism ? '2.5rem' : '2rem'};">
              ${data.features && data.features.length > 0 ? data.features.map((feature, index) => `
                <div class="feature-card" style="${isElegant ? 'text-align: center;' : ''} padding: ${isBrutalist || isElegant ? '3rem' : isGradient ? '2.5rem' : isRetro ? '2rem' : isNeumorphism ? '2.5rem' : '2rem'}; border-radius: ${isGradient ? '24px' : isBrutalist || isElegant ? '0' : isRetro ? '0' : isNeumorphism ? '24px' : isGlassmorphism ? '24px' : '12px'}; border: ${isBrutalist ? '4px' : isRetro ? '2px' : isElegant ? '0' : '1px'} solid ${isBrutalist ? 'var(--color-text)' : isRetro ? 'var(--color-accent)' : isElegant ? 'transparent' : 'var(--color-border)'}; transition: all ${isBrutalist || isRetro ? '0.2s' : '0.3s'}; background: ${isGradient ? 'linear-gradient(135deg, rgba(102,126,234,0.03), rgba(118,75,162,0.03))' : isRetro ? 'rgba(255,47,181,0.05)' : isGlassmorphism ? 'rgba(255,255,255,0.05)' : isNeumorphism ? 'var(--color-bg)' : 'var(--color-bg)'}; ${isGlassmorphism ? 'backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1);' : isNeumorphism ? 'box-shadow: 6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9);' : ''} ${isRetro ? 'position: relative;' : ''}" 
                  onmouseover="${isBrutalist ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'` : isGradient ? `this.style.transform='translateY(-8px)'; this.style.boxShadow='0 20px 60px rgba(102,126,234,0.15)'` : isRetro ? `this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 40px rgba(255,47,181,0.3)'` : isGlassmorphism ? `this.style.transform='translateY(-8px)'` : isNeumorphism ? `this.style.boxShadow='inset 4px 4px 8px rgba(0,0,0,0.12), inset -4px -4px 8px rgba(255,255,255,0.9)'` : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`}" 
                  onmouseout="${isBrutalist ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'` : isGradient ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'` : isRetro ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'` : isGlassmorphism ? `this.style.transform='translateY(0)'` : isNeumorphism ? `this.style.boxShadow='6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9)'` : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`}">
                  ${isGradient ? `
                  <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #667eea, #764ba2); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">
                    ${index + 1}
                  </div>
                  ` : 
                    `<div class="feature-icon" style="flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700; text-align:center; width: 48px; height: 48px; background: var(--color-accent); border-radius: 8px; margin-bottom: 1.5rem; opacity: 0.1;">${index + 1}</div>`
                  }
                  <h3 style="font-family: ${isElegant ? 'Playfair Display, serif' : 'inherit'}; font-size: ${isBrutalist || isElegant ? '1.75rem' : isGradient ? '1.375rem' : isRetro ? '1.25rem' : isNeumorphism || isGlassmorphism ? '1.5rem' : '1.25rem'}; font-weight: ${isBrutalist ? '900' : isElegant ? '600' : isRetro ? '700' : isNeumorphism || isGlassmorphism ? '700' : '700'}; margin-bottom: ${isBrutalist || isElegant ? '1.5rem' : isRetro ? '1rem' : isNeumorphism || isGlassmorphism ? '1rem' : '0.75rem'}; ${isBrutalist || isRetro ? 'text-transform: uppercase;' : ''} ${isRetro ? 'letter-spacing: 2px; color: var(--color-accent);' : isNeumorphism || isGlassmorphism ? 'color: var(--color-accent);' : ''}">
                    ${feature.title || ''}
                  </h3>
                  <p style="font-family: ${isElegant ? 'Lato, sans-serif' : isRetro ? 'Space Mono, monospace' : 'inherit'}; font-weight: ${isElegant ? '300' : 'normal'}; color: var(--color-text-secondary); line-height: ${isElegant ? '1.9' : '1.7'}; font-size: ${isBrutalist || isRetro ? '1.125rem' : isElegant || isNeumorphism || isGlassmorphism ? '1rem' : '0.9375rem'};">
                    ${feature.description || ''}
                  </p>
                </div>
              `).join('') : ''}
            </div>
          </div>
        </section>

        <!-- Testimonial/CTA Section with Theme-Specific Styling -->
        ${data.testimonialQuote ? `
        <section id="testimonial" class="testimonial" style="padding: ${isBrutalist || isRetro || isElegant ? '8rem 0' : '6rem 0'}; background: ${isBrutalist ? 'var(--color-accent)' : isGradient ? 'linear-gradient(135deg, #667eea, #764ba2)' : isRetro ? 'linear-gradient(135deg, var(--color-accent), #b537f2)' : isElegant ? 'var(--color-surface)' : isGlassmorphism ? 'transparent' : 'var(--color-surface)'}; text-align: center; ${isBrutalist || isGradient || isRetro ? 'color: white;' : ''} ${isElegant ? 'border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);' : isRetro ? 'border-radius: 20px; margin: 0 2rem; box-shadow: 0 20px 60px rgba(255,47,181,0.4);' : ''}">
          <div class="container" style="${isGlassmorphism || isNeumorphism ? `padding: 5rem 3rem; border-radius: 32px; max-width: 900px; ${isGlassmorphism ? 'background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1);' : 'box-shadow: 6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9);'}` : ''}">
            ${isBrutalist ? `
            <h2 style="font-size: clamp(2.5rem, 7vw, 5rem); text-transform: uppercase; margin-bottom: 2rem; font-weight: 900; color: var(--color-bg);">
              READY TO GO BOLD?
            </h2>
            <p style="font-size: 1.5rem; margin-bottom: 3rem; color: var(--color-bg);">
              ${data.testimonialQuote.replace(/"/g, '')}
            </p>
            <a href="#" style="display: inline-block; padding: 1.5rem 3rem; background: var(--color-bg); color: var(--color-accent); text-decoration: none; text-transform: uppercase; font-size: 1.125rem; border: 4px solid var(--color-bg); transition: all 0.1s; font-weight: 900;" onmouseover="this.style.background='transparent'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'">
              GET STARTED
            </a>
            ` : isElegant ? `
            <p style="font-family: Playfair Display, serif; font-size: clamp(1.5rem, 3vw, 2.25rem); line-height: 1.6; max-width: 800px; margin: 0 auto 2rem; font-style: italic; color: var(--color-text);">
              ${data.testimonialQuote}
            </p>
            <p style="margin-top: 2rem; text-align: center; color: var(--color-text-secondary); font-size: 1rem; letter-spacing: 1px;">
              — ${data.testimonialAuthor || ''}<span style="display: inline-block; margin: 0 0.5rem;">|</span>${data.testimonialRole || ''}
            </p>
            ` : isRetro ? `
            <h2 style="font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
              ${data.testimonialQuote.split('"').join('').substring(0, 30)}...
            </h2>
            <p style="font-size: 1.25rem; margin-bottom: 2.5rem;">
              Step into the future of design
            </p>
            <a href="#" style="display: inline-block; padding: 1rem 2.5rem; background: white; color: var(--color-accent); text-decoration: none; font-weight: 700; font-size: 1rem; border-radius: 999px; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; border: 2px solid white;" onmouseover="this.style.background='transparent'; this.style.color='white'; this.style.borderColor='white'" onmouseout="this.style.background='white'; this.style.color='var(--color-accent)'">
              Get Started Now
            </a>
            ` : `
            <p class="quote" style="font-size: ${isGradient ? '1.25rem' : isGlassmorphism || isNeumorphism ? '1.125rem' : '1.5rem'}; line-height: 1.8; max-width: 800px; margin: 0 auto 2rem; font-weight: 500; color: ${isGradient || isRetro ? 'white' : isGlassmorphism ? 'var(--color-text)' : 'var(--color-text)'}; ${isGradient ? 'opacity: 0.9;' : ''}">
              ${data.testimonialQuote}
            </p>
            <div class="author" style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
              <div class="avatar" style="width: 48px; height: 48px; border-radius: 50%; background: ${isGradient || isRetro ? 'white' : 'var(--color-accent)'}; opacity: 0.2;"></div>
              <div class="author-info" style="text-align: left;">
                <h4 style="font-weight: 600; margin-bottom: 0.25rem; color: ${isGradient || isRetro ? 'white' : 'var(--color-text)'};">
                  ${data.testimonialAuthor || ''}
                </h4>
                <p style="color: ${isGradient || isRetro ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)'}; font-size: 0.875rem;">
                  ${data.testimonialRole || ''}
                </p>
              </div>
            </div>
            ${isGradient ? `
            <a href="#" style="display: inline-block; padding: 1.125rem 2.5rem; background: white; color: #667eea; text-decoration: none; font-weight: 600; font-size: 1rem; border-radius: 999px; transition: all 0.3s; margin-top: 2rem;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              Start Free Trial
            </a>
            ` : ''}
            ${isGlassmorphism || isNeumorphism ? `
            <a href="#" style="display: inline-block; padding: 1.125rem 2.5rem; background: ${isGlassmorphism ? 'rgba(255,255,255,0.15)' : 'var(--color-bg)'}; color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 1rem; border-radius: 16px; transition: all 0.3s; margin-top: 2rem; ${isGlassmorphism ? 'backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);' : 'box-shadow: 6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9);'}" 
              onmouseover="${isGlassmorphism ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'` : `this.style.boxShadow='inset 4px 4px 8px rgba(0,0,0,0.12), inset -4px -4px 8px rgba(255,255,255,0.9)'`}" 
              onmouseout="${isGlassmorphism ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'` : `this.style.boxShadow='6px 6px 12px rgba(0,0,0,0.12), -6px -6px 12px rgba(255,255,255,0.9)'`}">
              Start Your Journey
            </a>
            ` : ''}
            `}
          </div>
        </section>
        ` : ''}
      </main>

      <!-- Footer -->
      <footer style="padding: ${isBrutalist ? '4rem 0' : isRetro ? '3rem 0' : '3rem 0'}; ${isBrutalist ? 'border-top: 4px solid var(--color-text);' : isRetro ? 'margin-top: 3rem; border-top: 3px solid var(--color-accent);' : isElegant ? 'border-top: 1px solid var(--color-border);' : 'border-top: 1px solid var(--color-border);'} text-align: center; color: var(--color-text-secondary); font-size: ${isRetro ? '0.875rem' : '0.875rem'}; ${isGlassmorphism ? 'backdrop-filter: blur(20px); background: rgba(255,255,255,0.02);' : ''} ${isElegant ? 'padding: 4rem 0;' : ''}">
        <div class="container">
          <p style="${isBrutalist ? 'font-size: 1.25rem; text-transform: uppercase; font-weight: 700;' : isRetro ? 'text-transform: uppercase; letter-spacing: 2px;' : ''}">
            © 2024 ${data.companyName || 'Minimal'}. All rights reserved.
          </p>
        </div>
      </footer>

      <style>
        /* Mobile Hamburger Menu Styles */
        @media (max-width: 768px) {
          .container { padding: 0 1.5rem !important; }
          section[style*="padding: 8rem"] { padding: 5rem 0 !important; }
          section[style*="padding: 6rem"] { padding: 4rem 0 !important; }
          .nav-links { display: none !important; }
          .mobile-controls { display: flex !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: ${isBrutalist ? '0 !important' : '2rem !important'}; }
          .features-grid { grid-template-columns: 1fr !important; gap: ${isElegant ? '3rem !important' : '1.5rem !important'}; }
          .quote { font-size: 1.25rem !important; }
        }
        
        @media (max-width: 640px) {
          .cta-group {
            flex-direction: column !important;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
          }
          .cta-group a {
            width: 100%;
            text-align: center;
          }
        }
        
        /* Gradient animation */
        ${isGradient || isRetro ? `
        @keyframes gradient {
          0%, 100% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
        }
        ` : ''}
        
        ${isRetro ? `
        /* Retro grid background */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,47,181,0.03) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,47,181,0.03) 2px, transparent 2px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        main { position: relative; z-index: 1; }
        ` : ''}
      </style>
      
      <script>
        function toggleMobileMenu() {
          const mobileMenu = document.querySelector('.mobile-menu');
          if (mobileMenu.style.display === 'none' || mobileMenu.style.display === '') {
            mobileMenu.style.display = 'block';
          } else {
            mobileMenu.style.display = 'none';
          }
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
          const mobileMenu = document.querySelector('.mobile-menu');
          const hamburger = document.querySelector('.hamburger-btn');
          const nav = document.querySelector('nav');
          
          if (!nav.contains(event.target) && mobileMenu.style.display === 'block') {
            mobileMenu.style.display = 'none';
          }
        });
      </script>
    `;
    }
  }),


  // ============================================
  // TEMPLATE 2: ENHANCED PERSONAL PROFILE
  // ============================================
  'personal-profile': new Template('personal-profile', {
    name: 'Personal Profile',
    description: 'Enhanced personal page with timeline, stats, and testimonials',
    image: '/templates/personal-profile.png',
    category: 'Personal',
    fields: {
      name: { type: 'text', default: 'Jordan Rivers', label: 'Your Name', required: true },
      tagline: { type: 'text', default: 'Product Designer & Creative', label: 'Tagline' },
      bio: { 
        type: 'textarea',
        default: 'I create meaningful digital experiences that connect people and solve real problems. With a passion for clean design and user-centered thinking.',
        label: 'Bio'
      },
      location: { type: 'text', default: 'San Francisco, CA', label: 'Location' },
      availability: { type: 'text', default: 'Available for freelance', label: 'Availability Status' },
      stats: {
        type: 'group',
        label: 'Statistics',
        itemLabel: 'Stat',
        min: 0,
        max: 4,
        fields: {
          number: { type: 'text', label: 'Number', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { number: '8+', label: 'Years Experience' },
          { number: '50+', label: 'Projects Completed' },
          { number: '20+', label: 'Happy Clients' }
        ]
      },
      skills: {
        type: 'repeatable',
        label: 'Skills',
        itemLabel: 'Skill',
        default: ['UI Design', 'Prototyping', 'User Research', 'Design Systems', 'Figma', 'React'],
        max: 12
      },
      experience: {
        type: 'group',
        label: 'Work Experience',
        itemLabel: 'Position',
        min: 0,
        max: 5,
        fields: {
          role: { type: 'text', label: 'Role', default: '' },
          company: { type: 'text', label: 'Company', default: '' },
          period: { type: 'text', label: 'Period', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' }
        },
        default: [
          { 
            role: 'Senior Product Designer', 
            company: 'TechCorp', 
            period: '2020 - Present',
            description: 'Leading design for core product features used by millions'
          },
          { 
            role: 'Product Designer', 
            company: 'StartupXYZ', 
            period: '2018 - 2020',
            description: 'Designed and launched the company\'s mobile app from 0 to 1'
          }
        ]
      },
      projects: {
        type: 'group',
        label: 'Featured Projects',
        itemLabel: 'Project',
        min: 0,
        max: 4,
        fields: {
          title: { type: 'text', label: 'Project Title', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          tags: { type: 'text', label: 'Tags (comma-separated)', default: '' },
          link: { type: 'url', label: 'Project Link (optional)', default: '' }
        },
        default: [
          { 
            title: 'Mobile Banking App', 
            description: 'Redesigned the core banking experience for 2M+ users, resulting in 45% increase in user satisfaction',
            tags: 'UI/UX, Mobile, Finance',
            link: ''
          },
          { 
            title: 'E-commerce Platform', 
            description: 'Built a comprehensive design system that increased conversion by 40% and reduced development time by 60%',
            tags: 'Design System, Web, E-commerce',
            link: ''
          }
        ]
      },
      testimonials: {
        type: 'group',
        label: 'Testimonials',
        itemLabel: 'Testimonial',
        min: 0,
        max: 3,
        fields: {
          quote: { type: 'textarea', label: 'Quote', default: '' },
          author: { type: 'text', label: 'Author', default: '' },
          role: { type: 'text', label: 'Author Role', default: '' }
        },
        default: [
          {
            quote: 'Jordan is an exceptional designer who brings both creativity and strategic thinking to every project.',
            author: 'Sarah Johnson',
            role: 'CEO, TechCorp'
          }
        ]
      },
      contactEmail: { type: 'email', default: 'hello@jordan.com', label: 'Contact Email' },
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Link',
        min: 0,
        max: 5,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'url', label: 'URL', default: '' }
        },
        default: [
          { platform: 'Twitter', url: 'https://twitter.com' },
          { platform: 'LinkedIn', url: 'https://linkedin.com' },
          { platform: 'Dribbble', url: 'https://dribbble.com' }
        ]
      }
    },
    structure: (data) => `
      <!-- Header with Theme Toggle -->
      <header style="padding: 1.5rem 0; position: fixed; top: 0; left: 0; right: 0; background: var(--color-bg); border-bottom: 1px solid var(--color-border); z-index: 1000; backdrop-filter: blur(10px);">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 600; font-size: 1.125rem; letter-spacing: -0.02em;">${data.name || 'Portfolio'}</div>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer;">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero" style="min-height: 100vh; display: flex; align-items: center; padding: 8rem 0 6rem; position: relative;">
        <div class="container" style="max-width: 1000px;">
          <!-- Availability Badge -->
          ${data.availability ? `
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 9999px; margin-bottom: 2rem; font-size: 0.875rem;">
            <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
            ${data.availability}
          </div>
          ` : ''}
          
          <div style="margin-bottom: 3rem;">
            <h1 style="font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.03em; line-height: 1;">
              ${data.name || 'Your Name'}
            </h1>
            ${data.tagline ? `
            <p style="font-size: clamp(1.5rem, 4vw, 2.25rem); color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: 500;">
              ${data.tagline}
            </p>
            ` : ''}
            ${data.location ? `
            <p style="font-size: 1rem; color: var(--color-text-secondary); margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem;">
              📍 ${data.location}
            </p>
            ` : ''}
            ${data.bio ? `
            <p style="font-size: 1.25rem; line-height: 1.8; color: var(--color-text-secondary); max-width: 700px; margin-bottom: 3rem;">
              ${data.bio}
            </p>
            ` : ''}

            <!-- CTA Buttons -->
            <div class="cta-group" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem;">
              ${data.contactEmail ? `
              <a href="mailto:${data.contactEmail}" class="btn btn-primary" style="padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; background: var(--color-accent); color: white;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
                Get in Touch
              </a>
              ` : ''}
              ${data.socialLinks && data.socialLinks.length > 0 ? data.socialLinks.slice(0, 1).map(link => `
                <a href="${link.url}" target="_blank" class="btn btn-secondary" style="padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; border: 1px solid var(--color-border); color: var(--color-text);" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
                  View ${link.platform}
                </a>
              `).join('') : ''}
            </div>

            <!-- Social Links -->
            ${data.socialLinks && data.socialLinks.length > 0 ? `
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${data.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" style="padding: 0.5rem 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem; transition: all 0.2s; font-weight: 500;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.color='var(--color-text)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.color='var(--color-text-secondary)'">
                  ${link.platform}
                </a>
              `).join('')}
            </div>
            ` : ''}
          </div>

          <!-- Stats -->
          ${data.stats && data.stats.length > 0 ? `
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; padding-top: 3rem; border-top: 1px solid var(--color-border);">
            ${data.stats.map(stat => `
              <div style="text-align: center;">
                <div style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--color-accent);">${stat.number}</div>
                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">${stat.label}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </section>

      <!-- Experience Timeline -->
      ${data.experience && data.experience.length > 0 ? `
      <section class="experience" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 900px;">
          <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 3rem; letter-spacing: -0.02em;">
            Experience
          </h2>
          <div class="timeline" style="display: flex; flex-direction: column; gap: 3rem; position: relative; padding-left: 2rem;">
            <!-- Timeline Line -->
            <div class="timeline-line" style="position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: var(--color-border);"></div>
            
            ${data.experience.map((job, index) => `
              <div style="position: relative;">
                <!-- Timeline Dot -->
                <div style="position: absolute; left: -2.375rem; top: 0.25rem; width: 14px; height: 14px; background: var(--color-accent); border: 3px solid var(--color-bg); border-radius: 50%; z-index: 1;"></div>
                
                <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid var(--color-border); background: var(--color-bg); transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                  <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;">
                    <div>
                      <h3 style="font-size: 1.375rem; font-weight: 600; margin-bottom: 0.25rem;">
                        ${job.role || 'Position'}
                      </h3>
                      <p style="font-size: 1rem; color: var(--color-accent); font-weight: 500;">
                        ${job.company || 'Company'}
                      </p>
                    </div>
                    <span style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 500; white-space: nowrap;">
                      ${job.period || ''}
                    </span>
                  </div>
                  ${job.description ? `
                  <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem;">
                    ${job.description}
                  </p>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Skills -->
      ${data.skills && data.skills.length > 0 ? `
      <section class="skills" style="padding: 6rem 0;">
        <div class="container" style="max-width: 900px;">
          <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 3rem; letter-spacing: -0.02em;">
            Skills & Expertise
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${data.skills.map(skill => `
              <span style="padding: 0.75rem 1.25rem; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: 8px; font-weight: 600; font-size: 0.9375rem; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                ${skill}
              </span>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Projects -->
      ${data.projects && data.projects.length > 0 ? `
      <section class="projects" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 1100px;">
          <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 3rem; letter-spacing: -0.02em;">
            Featured Work
          </h2>
          <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${data.projects.map(project => `
              <div class="card" style="padding: 2rem; display: flex; flex-direction: column; height: 100%; border-radius: 12px; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                <h3 style="font-size: 1.625rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.01em;">
                  ${project.title || 'Project'}
                </h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1rem; flex-grow: 1;">
                  ${project.description || ''}
                </p>
                ${project.tags ? `
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                  ${project.tags.split(',').map(tag => `
                    <span style="padding: 0.375rem 0.75rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 6px; font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600;">
                      ${tag.trim()}
                    </span>
                  `).join('')}
                </div>
                ` : ''}
                ${project.link ? `
                <a href="${project.link}" target="_blank" style="align-self: flex-start; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; border: 1px solid var(--color-border); color: var(--color-text); font-size: 0.875rem;" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
                  View Project →
                </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Testimonials -->
      ${data.testimonials && data.testimonials.length > 0 ? `
      <section class="testimonials" style="padding: 6rem 0;">
        <div class="container" style="max-width: 1100px;">
          <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 3rem; letter-spacing: -0.02em; text-align: center;">
            What People Say
          </h2>
          <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${data.testimonials.map(testimonial => `
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                <p style="font-size: 1.125rem; line-height: 1.8; margin-bottom: 2rem; font-style: italic; color: var(--color-text);">
                  "${testimonial.quote || ''}"
                </p>
                <div style="display: flex; align-items: center; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-accent); opacity: 0.2;"></div>
                  <div>
                    <h4 style="font-weight: 600; margin-bottom: 0.25rem; font-size: 0.9375rem;">${testimonial.author || ''}</h4>
                    <p style="color: var(--color-text-secondary); font-size: 0.875rem;">${testimonial.role || ''}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact CTA -->
      <section id="contact" class="contact" style="padding: 8rem 0 6rem; background: var(--color-surface); text-align: center;">
        <div class="container" style="max-width: 700px;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.03em;">
            Let's Work Together
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
            Have a project in mind? Let's create something amazing together.
          </p>
          ${data.contactEmail ? `
          <a href="mailto:${data.contactEmail}" class="btn btn-primary" style="padding: 1.25rem 3rem; font-size: 1.125rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; background: var(--color-accent); color: white;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
            Get in Touch
          </a>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem;">
        <div class="container">
          <p>© 2024 ${data.name || 'Your Name'}. Designed with care.</p>
        </div>
      </footer>

      <style>
        /* Responsive Design */
        @media (max-width: 768px) {
          header { position: relative !important; }
          .container { padding: 0 1.5rem !important; }
          .hero { padding: 5rem 0 4rem !important; min-height: auto !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .timeline { padding-left: 1.5rem !important; }
          .timeline-line { display: none; }
          .timeline > div > div:first-child { display: none; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          section[style*="padding: 6rem"] { padding: 4rem 0 !important; }
          section[style*="padding: 8rem"] { padding: 5rem 0 !important; }
        }
        
        @media (max-width: 640px) {
          .cta-group {
            flex-direction: column !important;
            width: 100%;
          }
          .cta-group a {
            width: 100%;
            text-align: center;
          }
        }
        
        @media (max-width: 480px) {
          .stats-grid > div {
            padding: 1rem;
            background: var(--color-bg);
            border-radius: 8px;
          }
        }
      </style>
    `
  }),

// ============================================
  // TEMPLATE 3: RESTAURANT
  // ============================================
  'restaurant': new Template('restaurant', {
    name: 'Restaurant',
    description: 'Beautiful restaurant website with menu and reservation',
    image: '/templates/restaurant.png',
    category: 'Restaurant',
    fields: {
      restaurantName: { type: 'text', default: 'Bella Cucina', label: 'Restaurant Name', required: true },
      tagline: { type: 'text', default: 'Authentic Italian Cuisine', label: 'Tagline' },
      description: {
        type: 'textarea',
        default: 'Experience the heart of Italy in every bite. Our chefs bring generations of tradition to your table.',
        label: 'Restaurant Description'
      },
      address: { type: 'text', default: '123 Main Street, Downtown', label: 'Address' },
      phone: { type: 'tel', default: '(555) 123-4567', label: 'Phone' },
      email: { type: 'email', default: 'info@bellacucina.com', label: 'Email' },
      hours: {
        type: 'group',
        label: 'Hours',
        itemLabel: 'Day',
        min: 0,
        max: 7,
        fields: {
          day: { type: 'text', label: 'Day', default: '' },
          hours: { type: 'text', label: 'Hours', default: '' }
        },
        default: [
          { day: 'Mon-Thu', hours: '11:00 AM - 10:00 PM' },
          { day: 'Fri-Sat', hours: '11:00 AM - 11:00 PM' },
          { day: 'Sunday', hours: '12:00 PM - 9:00 PM' }
        ]
      },
      menuCategories: {
        type: 'group',
        label: 'Menu Categories',
        itemLabel: 'Category',
        min: 1,
        max: 6,
        fields: {
          category: { type: 'text', label: 'Category Name', default: '' },
          items: {
            type: 'group',
            label: 'Items',
            itemLabel: 'Item',
            fields: {
              name: { type: 'text', label: 'Item Name', default: '' },
              description: { type: 'textarea', label: 'Description', default: '' },
              price: { type: 'text', label: 'Price', default: '' }
            }
          }
        },
        default: [
          {
            category: 'Appetizers',
            items: [
              { name: 'Bruschetta', description: 'Toasted bread with tomatoes, basil, and olive oil', price: '$12' },
              { name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil', price: '$14' }
            ]
          },
          {
            category: 'Main Courses',
            items: [
              { name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with eggs, cheese, and pancetta', price: '$22' },
              { name: 'Margherita Pizza', description: 'San Marzano tomatoes, mozzarella, and fresh basil', price: '$18' }
            ]
          }
        ]
      },
      specialties: {
        type: 'group',
        label: 'Chef Specialties',
        itemLabel: 'Specialty',
        min: 0,
        max: 3,
        fields: {
          name: { type: 'text', label: 'Dish Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          {
            name: 'Osso Buco',
            description: 'Slow-braised veal shanks with saffron risotto',
            price: '$38'
          }
        ]
      },
      reservationUrl: { type: 'url', default: '', label: 'Reservation URL (optional)' }
    },
    structure: (data) => `
      <!-- Header -->
      <header style="padding: 1.5rem 0; border-bottom: 1px solid var(--color-border); position: sticky; top: 0; background: var(--color-bg); z-index: 100; backdrop-filter: blur(10px);">
        <div class="container">
          <nav style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 1.375rem; letter-spacing: -0.02em;">${data.restaurantName || 'Restaurant'}</div>
            <div style="display: flex; align-items: center; gap: 2rem;">
              <ul class="nav-links" style="display: flex; gap: 2rem; list-style: none; margin: 0;">
                <li><a href="#menu" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">Menu</a></li>
                <li><a href="#about" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">About</a></li>
                <li><a href="#contact" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">Contact</a></li>
              </ul>
              <label class="theme-toggle-switch-wrapper" style="cursor: pointer;">
                <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
                <span class="theme-toggle-slider"></span>
              </label>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <!-- Hero -->
        <section class="hero" style="padding: 8rem 0 6rem; text-align: center; background: var(--color-surface); border-bottom: 1px solid var(--color-border);">
          <div class="container" style="max-width: 900px;">
            <h1 style="font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 800; line-height: 1; letter-spacing: -0.03em; margin-bottom: 1.5rem;">
              ${data.restaurantName || 'Restaurant'}
            </h1>
            ${data.tagline ? `
            <p style="font-size: clamp(1.25rem, 3vw, 1.75rem); color: var(--color-accent); margin-bottom: 2rem; font-weight: 600;">
              ${data.tagline}
            </p>
            ` : ''}
            ${data.description ? `
            <p style="font-size: 1.25rem; color: var(--color-text-secondary); max-width: 700px; margin: 0 auto 3rem; line-height: 1.8;">
              ${data.description}
            </p>
            ` : ''}
            <div class="cta-group" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              ${data.reservationUrl ? `
              <a href="${data.reservationUrl}" target="_blank" class="btn btn-primary" style="padding: 1rem 2.5rem; font-size: 1rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; background: var(--color-accent); color: white;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">Reserve a Table</a>
              ` : ''}
              <a href="#menu" class="btn btn-secondary" style="padding: 1rem 2.5rem; font-size: 1rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; border: 1px solid var(--color-border); color: var(--color-text);" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">View Menu</a>
            </div>
          </div>
        </section>

        <!-- Chef's Specialties -->
        ${data.specialties && data.specialties.length > 0 ? `
        <section class="specialties" style="padding: 6rem 0; background: var(--color-bg);">
          <div class="container" style="max-width: 1100px;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 700; text-align: center; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Chef's Specialties
            </h2>
            <p style="text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 4rem; font-size: 1.125rem;">
              Our signature dishes, crafted with passion
            </p>
            <div class="specialties-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
              ${data.specialties.map(dish => `
                <div class="card" style="padding: 2rem; text-align: center; border-radius: 12px; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                  <div style="width: 80px; height: 80px; background: var(--color-accent); border-radius: 50%; margin: 0 auto 1.5rem; opacity: 0.1;"></div>
                  <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">${dish.name || ''}</h3>
                  <p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-size: 1rem;">
                    ${dish.description || ''}
                  </p>
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent);">${dish.price || ''}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        ` : ''}

        <!-- Menu -->
        <section id="menu" class="menu" style="padding: 6rem 0; background: var(--color-surface);">
          <div class="container" style="max-width: 1000px;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 700; text-align: center; margin-bottom: 4rem; letter-spacing: -0.02em;">
              Our Menu
            </h2>
            ${data.menuCategories && data.menuCategories.length > 0 ? data.menuCategories.map(category => `
              <div class="menu-category" style="margin-bottom: 5rem;">
                <h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 2.5rem; padding-bottom: 1rem; border-bottom: 2px solid var(--color-border); letter-spacing: -0.01em;">
                  ${category.category || 'Category'}
                </h3>
                <div style="display: grid; gap: 2rem;">
                  ${category.items && category.items.length > 0 ? category.items.map(item => `
                    <div class="menu-item" style="display: flex; justify-content: space-between; align-items: start; gap: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--color-border);">
                      <div style="flex: 1;">
                        <h4 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${item.name || ''}</h4>
                        <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem;">
                          ${item.description || ''}
                        </p>
                      </div>
                      <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-accent); white-space: nowrap;">
                        ${item.price || ''}
                      </div>
                    </div>
                  `).join('') : ''}
                </div>
              </div>
            `).join('') : ''}
          </div>
        </section>

        <!-- About & Hours -->
        <section id="about" class="about" style="padding: 6rem 0;">
          <div class="container" style="max-width: 1000px;">
            <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
              <!-- Hours -->
              ${data.hours && data.hours.length > 0 ? `
              <div class="card" style="padding: 2rem; border-radius: 12px; border: 1px solid var(--color-border);">
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Hours</h3>
                <div style="display: grid; gap: 0.75rem;">
                  ${data.hours.map(day => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0;">
                      <span style="font-weight: 600;">${day.day || ''}</span>
                      <span style="color: var(--color-text-secondary);">${day.hours || ''}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}

              <!-- Contact -->
              <div class="card" id="contact" style="padding: 2rem; border-radius: 12px; border: 1px solid var(--color-border);">
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Visit Us</h3>
                <div style="display: grid; gap: 1.5rem; font-size: 0.9375rem;">
                  ${data.address ? `
                  <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--color-text-secondary); font-size: 0.875rem;">Address</div>
                    <div>${data.address}</div>
                  </div>
                  ` : ''}
                  ${data.phone ? `
                  <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--color-text-secondary); font-size: 0.875rem;">Phone</div>
                    <a href="tel:${data.phone}" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${data.phone}</a>
                  </div>
                  ` : ''}
                  ${data.email ? `
                  <div>
                    <div style="font-weight: 600; margin-bottom: 0.25rem; color: var(--color-text-secondary); font-size: 0.875rem;">Email</div>
                    <a href="mailto:${data.email}" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${data.email}</a>
                  </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Reservation CTA -->
        <section class="cta" style="padding: 8rem 0 6rem; background: var(--color-surface); text-align: center; border-top: 1px solid var(--color-border);">
          <div class="container" style="max-width: 700px;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.03em;">
              Ready to Dine?
            </h2>
            <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 2.5rem; line-height: 1.7;">
              Reserve your table today and experience authentic cuisine
            </p>
            ${data.reservationUrl ? `
            <a href="${data.reservationUrl}" target="_blank" class="btn btn-primary" style="padding: 1.25rem 3rem; font-size: 1.125rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; background: var(--color-accent); color: white;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
              Make a Reservation
            </a>
            ` : data.phone ? `
            <a href="tel:${data.phone}" class="btn btn-primary" style="padding: 1.25rem 3rem; font-size: 1.125rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; background: var(--color-accent); color: white;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
              Call to Reserve
            </a>
            ` : ''}
          </div>
        </section>
      </main>

      <footer style="padding: 3rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem;">
        <div class="container">
          <p>© 2024 ${data.restaurantName || 'Restaurant'}. All rights reserved.</p>
        </div>
      </footer>

      <style>
        /* Responsive Design */
        @media (max-width: 768px) {
          .container { padding: 0 1.5rem !important; }
          .nav-links { display: none !important; }
          .hero { padding: 5rem 0 4rem !important; }
          .specialties { padding: 4rem 0 !important; }
          .specialties-grid { grid-template-columns: 1fr !important; }
          .menu { padding: 4rem 0 !important; }
          .menu-category { margin-bottom: 3rem !important; }
          .menu-item { flex-direction: column !important; align-items: start !important; gap: 0.5rem !important; }
          .info-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .about { padding: 4rem 0 !important; }
          .cta { padding: 5rem 0 4rem !important; }
        }
        
        @media (max-width: 640px) {
          .cta-group {
            flex-direction: column !important;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
          }
          .cta-group a {
            width: 100%;
            text-align: center;
          }
        }
        
        @media (max-width: 480px) {
          .menu-item > div:last-child {
            align-self: start;
          }
        }
      </style>
    `
  }),

// ============================================
  // TEMPLATE 4: DIGITAL BUSINESS CARD
  // ============================================
  'digital-card': new Template('digital-card', {
    name: 'Digital Business Card',
    description: 'Modern digital business card with QR code and instant contact sharing',
    image: '/templates/digital-card.png',
    category: 'Personal',
    fields: {
      name: { type: 'text', default: 'Alex Morgan', label: 'Full Name', required: true },
      title: { type: 'text', default: 'Senior Product Manager', label: 'Job Title' },
      company: { type: 'text', default: 'TechCorp Inc.', label: 'Company' },
      tagline: { 
        type: 'text',
        default: 'Building products people love',
        label: 'Tagline'
      },
      email: { type: 'email', default: 'alex@techcorp.com', label: 'Email', required: true },
      phone: { type: 'tel', default: '+1 (555) 123-4567', label: 'Phone' },
      website: { type: 'url', default: 'https://alexmorgan.com', label: 'Website' },
      location: { type: 'text', default: 'San Francisco, CA', label: 'Location' },
      bio: {
        type: 'textarea',
        default: 'Passionate about creating user-centered products that make a difference. 10+ years in tech.',
        label: 'Short Bio'
      },
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Link',
        min: 0,
        max: 6,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          username: { type: 'text', label: 'Username', default: '' },
          url: { type: 'url', label: 'URL', default: '' }
        },
        default: [
          { platform: 'LinkedIn', username: '@alexmorgan', url: 'https://linkedin.com/in/alexmorgan' },
          { platform: 'Twitter', username: '@alexmorgan', url: 'https://twitter.com/alexmorgan' },
          { platform: 'GitHub', username: '@alexmorgan', url: 'https://github.com/alexmorgan' }
        ]
      },
      skills: {
        type: 'repeatable',
        label: 'Key Skills',
        itemLabel: 'Skill',
        default: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis'],
        max: 6
      }
    },
    structure: (data) => `
      <!-- Header with Theme Toggle -->
      <header style="padding: 1.5rem 0; border-bottom: 1px solid var(--color-border);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 600; font-size: 1.125rem;">Digital Card</div>
          <label class="theme-toggle-switch-wrapper" style="cursor: pointer;">
            <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
            <span class="theme-toggle-slider"></span>
          </label>
        </div>
      </header>

      <!-- Card Container -->
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: var(--color-bg);">
        <div style="max-width: 500px; width: 100%;">
          <!-- Main Card -->
          <div class="card" style="padding: 3rem; text-align: center; position: relative; overflow: hidden; border-radius: 16px; border: 1px solid var(--color-border);">
            <!-- Decorative Background -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 120px; background: var(--color-surface); opacity: 0.5; z-index: 0;"></div>
            
            <!-- Profile Section -->
            <div style="position: relative; z-index: 1; margin-bottom: 2rem;">
              <!-- Avatar Placeholder -->
              <div style="width: 120px; height: 120px; margin: 0 auto 2rem; background: var(--color-accent); border-radius: 50%; border: 4px solid var(--color-bg); opacity: 0.2;"></div>
              
              <h1 style="font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em;">
                ${data.name || 'Your Name'}
              </h1>
              
              ${data.title ? `
              <p style="font-size: 1.125rem; color: var(--color-accent); font-weight: 600; margin-bottom: 0.25rem;">
                ${data.title}
              </p>
              ` : ''}
              
              ${data.company ? `
              <p style="font-size: 1rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                ${data.company}
              </p>
              ` : ''}
              
              ${data.tagline ? `
              <p style="font-size: 0.9375rem; color: var(--color-text-secondary); font-style: italic; margin-bottom: 2rem;">
                "${data.tagline}"
              </p>
              ` : ''}
              
              ${data.location ? `
              <p style="font-size: 0.875rem; color: var(--color-text-secondary); display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                📍 ${data.location}
              </p>
              ` : ''}
            </div>

            <!-- Bio -->
            ${data.bio ? `
            <div style="padding: 2rem 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); margin-bottom: 2rem;">
              <p style="font-size: 0.9375rem; line-height: 1.7; color: var(--color-text-secondary);">
                ${data.bio}
              </p>
            </div>
            ` : ''}

            <!-- Contact Info -->
            <div style="display: grid; gap: 0.75rem; margin-bottom: 2rem; text-align: left;">
              ${data.email ? `
              <a href="mailto:${data.email}" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; text-decoration: none; color: var(--color-text); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)'">
                <span style="font-size: 1.25rem;">✉️</span>
                <span style="font-size: 0.875rem; font-weight: 500;">${data.email}</span>
              </a>
              ` : ''}
              
              ${data.phone ? `
              <a href="tel:${data.phone.replace(/\s/g, '')}" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; text-decoration: none; color: var(--color-text); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)'">
                <span style="font-size: 1.25rem;">📞</span>
                <span style="font-size: 0.875rem; font-weight: 500;">${data.phone}</span>
              </a>
              ` : ''}
              
              ${data.website ? `
              <a href="${data.website}" target="_blank" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; text-decoration: none; color: var(--color-text); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)'">
                <span style="font-size: 1.25rem;">🌐</span>
                <span style="font-size: 0.875rem; font-weight: 500;">${data.website.replace('https://', '').replace('http://', '')}</span>
              </a>
              ` : ''}
            </div>

            <!-- Skills -->
            ${data.skills && data.skills.length > 0 ? `
            <div style="margin-bottom: 2rem;">
              <h3 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); margin-bottom: 1rem;">
                Expertise
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                ${data.skills.map(skill => `
                  <span style="padding: 0.375rem 0.875rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 9999px; font-size: 0.8125rem; font-weight: 600;">
                    ${skill}
                  </span>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <!-- Social Links -->
            ${data.socialLinks && data.socialLinks.length > 0 ? `
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--color-border);">
              <h3 style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); margin-bottom: 1rem;">
                Connect
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                ${data.socialLinks.map(link => `
                  <a href="${link.url}" target="_blank" style="font-size: 0.8125rem; padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.5rem; border-radius: 8px; text-decoration: none; border: 1px solid var(--color-border); color: var(--color-text); transition: all 0.2s;" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
                    <span>${link.platform}</span>
                    ${link.username ? `<span style="opacity: 0.6; font-size: 0.75rem;">${link.username}</span>` : ''}
                  </a>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <!-- Save Contact Button -->
            <div style="margin-top: 2rem;">
              <button onclick="saveContact()" style="width: 100%; padding: 1rem; font-size: 1rem; cursor: pointer; background: var(--color-accent); color: white; border: none; border-radius: 8px; font-weight: 500; transition: all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
                💾 Save Contact
              </button>
            </div>
          </div>

          <!-- QR Code Section -->
          <div class="card" style="margin-top: 1rem; padding: 2rem; text-align: center; border-radius: 16px; border: 1px solid var(--color-border);">
            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
              Scan to save contact
            </p>
            <div id="qr-code" style="width: 200px; height: 200px; margin: 0 auto; background: var(--color-surface); border: 2px solid var(--color-border); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--color-text-secondary);">
              QR Code
            </div>
          </div>
        </div>
      </div>

      <script>
        function saveContact() {
          const vcard = \`BEGIN:VCARD
VERSION:3.0
FN:${data.name || ''}
TITLE:${data.title || ''}
ORG:${data.company || ''}
EMAIL:${data.email || ''}
TEL:${data.phone || ''}
URL:${data.website || ''}
NOTE:${data.bio || ''}
END:VCARD\`;
          
          const blob = new Blob([vcard], { type: 'text/vcard' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '${(data.name || 'contact').replace(/\s/g, '_')}.vcf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }

        window.addEventListener('DOMContentLoaded', () => {
          const qrData = encodeURIComponent(window.location.href);
          const qrUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${qrData}\`;
          document.getElementById('qr-code').innerHTML = \`<img src="\${qrUrl}" alt="QR Code" style="width: 100%; height: 100%; border-radius: 8px;">\`;
        });
      </script>

      <style>
        @media (max-width: 768px) {
          .container { padding: 0 1.5rem !important; }
          .card { padding: 2rem !important; }
        }
        
        @media (max-width: 480px) {
          .card { padding: 1.5rem !important; }
        }
      </style>
    `
  }),
// ============================================
  // TEMPLATE 5: RESUME/CV
  // ============================================
  'resume': new Template('resume', {
    name: 'Resume/CV',
    description: 'Professional resume with work experience, education, and skills',
    image: '/templates/resume.png',
    category: 'Personal',
    fields: {
      name: { type: 'text', default: 'Sarah Johnson', label: 'Full Name', required: true },
      title: { type: 'text', default: 'Software Engineer', label: 'Professional Title' },
      email: { type: 'email', default: 'sarah.johnson@email.com', label: 'Email', required: true },
      phone: { type: 'tel', default: '+1 (555) 987-6543', label: 'Phone' },
      location: { type: 'text', default: 'Seattle, WA', label: 'Location' },
      website: { type: 'url', default: 'https://sarahjohnson.dev', label: 'Website/Portfolio' },
      linkedin: { type: 'url', default: 'https://linkedin.com/in/sarahjohnson', label: 'LinkedIn' },
      github: { type: 'url', default: 'https://github.com/sarahjohnson', label: 'GitHub/Portfolio Link' },
      summary: {
        type: 'textarea',
        default: 'Experienced software engineer with 7+ years building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Proven track record of delivering high-impact features used by millions.',
        label: 'Professional Summary'
      },
      experience: {
        type: 'group',
        label: 'Work Experience',
        itemLabel: 'Position',
        min: 1,
        max: 8,
        fields: {
          role: { type: 'text', label: 'Job Title', default: '' },
          company: { type: 'text', label: 'Company', default: '' },
          location: { type: 'text', label: 'Location', default: '' },
          period: { type: 'text', label: 'Period (e.g., Jan 2020 - Present)', default: '' },
          achievements: {
            type: 'repeatable',
            label: 'Key Achievements',
            itemLabel: 'Achievement',
            default: [],
            max: 5
          }
        },
        default: [
          {
            role: 'Senior Software Engineer',
            company: 'TechCorp',
            location: 'Seattle, WA',
            period: 'Jan 2021 - Present',
            achievements: [
              'Led development of core platform features serving 5M+ users',
              'Reduced page load time by 40% through optimization',
              'Mentored 3 junior engineers to mid-level positions'
            ]
          },
          {
            role: 'Software Engineer',
            company: 'StartupXYZ',
            location: 'San Francisco, CA',
            period: 'Jun 2018 - Dec 2020',
            achievements: [
              'Built real-time collaboration features from scratch',
              'Improved test coverage from 40% to 85%',
              'Contributed to open-source projects used by the team'
            ]
          }
        ]
      },
      education: {
        type: 'group',
        label: 'Education',
        itemLabel: 'Degree',
        min: 0,
        max: 4,
        fields: {
          degree: { type: 'text', label: 'Degree', default: '' },
          school: { type: 'text', label: 'School/University', default: '' },
          location: { type: 'text', label: 'Location', default: '' },
          year: { type: 'text', label: 'Graduation Year', default: '' },
          details: { type: 'text', label: 'Additional Details (optional)', default: '' }
        },
        default: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'University of Washington',
            location: 'Seattle, WA',
            year: '2018',
            details: 'GPA: 3.8/4.0, Dean\'s List'
          }
        ]
      },
      skills: {
        type: 'group',
        label: 'Skills',
        itemLabel: 'Category',
        min: 1,
        max: 6,
        fields: {
          category: { type: 'text', label: 'Category Name', default: '' },
          items: {
            type: 'repeatable',
            label: 'Skills',
            itemLabel: 'Skill',
            default: []
          }
        },
        default: [
          {
            category: 'Languages',
            items: ['JavaScript', 'TypeScript', 'Python', 'Go']
          },
          {
            category: 'Frontend',
            items: ['React', 'Next.js', 'Vue', 'Tailwind CSS']
          },
          {
            category: 'Backend',
            items: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL']
          },
          {
            category: 'Tools',
            items: ['Git', 'Docker', 'AWS', 'CI/CD']
          }
        ]
      },
      certifications: {
        type: 'group',
        label: 'Certifications',
        itemLabel: 'Certification',
        min: 0,
        max: 5,
        fields: {
          name: { type: 'text', label: 'Certification Name', default: '' },
          issuer: { type: 'text', label: 'Issuing Organization', default: '' },
          year: { type: 'text', label: 'Year', default: '' }
        },
        default: [
          {
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            year: '2023'
          }
        ]
      },
      languages: {
        type: 'group',
        label: 'Languages',
        itemLabel: 'Language',
        min: 0,
        max: 5,
        fields: {
          language: { type: 'text', label: 'Language', default: '' },
          proficiency: { type: 'text', label: 'Proficiency', default: '' }
        },
        default: [
          { language: 'English', proficiency: 'Native' },
          { language: 'Spanish', proficiency: 'Intermediate' }
        ]
      }
    },
    structure: (data) => `
      <!-- Header with Theme Toggle -->
      <header style="padding: 1.5rem 0; border-bottom: 1px solid var(--color-border); margin-bottom: 2rem;">
        <div class="container" style="max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 600; font-size: 1.125rem;">Resume</div>
          <label class="theme-toggle-switch-wrapper" style="cursor: pointer;">
            <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
            <span class="theme-toggle-slider"></span>
          </label>
        </div>
      </header>

      <div style="min-height: 100vh; padding: 2rem 1rem; background: var(--color-bg);">
        <div style="max-width: 900px; margin: 0 auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header Section -->
          <header style="padding: 3rem 2rem; background: var(--color-bg); border-bottom: 3px solid var(--color-accent); border-radius: 12px 12px 0 0;">
            <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em;">
              ${data.name || 'Your Name'}
            </h1>
            ${data.title ? `
            <p style="font-size: 1.25rem; color: var(--color-accent); font-weight: 600; margin-bottom: 2rem;">
              ${data.title}
            </p>
            ` : ''}
            
            <!-- Contact Info -->
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.9375rem; color: var(--color-text-secondary);">
              ${data.email ? `<span>✉️ ${data.email}</span>` : ''}
              ${data.phone ? `<span>📞 ${data.phone}</span>` : ''}
              ${data.location ? `<span>📍 ${data.location}</span>` : ''}
            </div>
            
            <!-- Links -->
            ${(data.website || data.linkedin || data.github) ? `
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;">
              ${data.website ? `<a href="${data.website}" target="_blank" style="font-size: 0.875rem; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; border: 1px solid var(--color-border); color: var(--color-text); transition: all 0.2s;" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">🌐 Website</a>` : ''}
              ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" style="font-size: 0.875rem; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; border: 1px solid var(--color-border); color: var(--color-text); transition: all 0.2s;" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">💼 LinkedIn</a>` : ''}
              ${data.github ? `<a href="${data.github}" target="_blank" style="font-size: 0.875rem; padding: 0.5rem 1rem; border-radius: 8px; text-decoration: none; border: 1px solid var(--color-border); color: var(--color-text); transition: all 0.2s;" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">💻 GitHub</a>` : ''}
            </div>
            ` : ''}
          </header>

          <!-- Main Content -->
          <div style="padding: 2rem;">
            
            <!-- Summary -->
            ${data.summary ? `
            <section style="margin-bottom: 3rem;">
              <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
                Professional Summary
              </h2>
              <p style="font-size: 1rem; line-height: 1.8; color: var(--color-text-secondary);">
                ${data.summary}
              </p>
            </section>
            ` : ''}

            <!-- Experience -->
            ${data.experience && data.experience.length > 0 ? `
            <section style="margin-bottom: 3rem;">
              <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 2rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
                Work Experience
              </h2>
              <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${data.experience.map(job => `
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
                      <div style="flex: 1;">
                        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem;">
                          ${job.role || ''}
                        </h3>
                        <p style="font-size: 1rem; color: var(--color-text-secondary); font-weight: 600;">
                          ${job.company || ''} ${job.location ? `• ${job.location}` : ''}
                        </p>
                      </div>
                      <span style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 600; white-space: nowrap;">
                        ${job.period || ''}
                      </span>
                    </div>
                    ${job.achievements && job.achievements.length > 0 ? `
                    <ul style="margin: 0; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
                      ${job.achievements.map(achievement => `
                        <li style="font-size: 0.9375rem; line-height: 1.7; color: var(--color-text-secondary);">
                          ${achievement}
                        </li>
                      `).join('')}
                    </ul>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
            ` : ''}

            <!-- Education -->
            ${data.education && data.education.length > 0 ? `
            <section style="margin-bottom: 3rem;">
              <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 2rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
                Education
              </h2>
              <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${data.education.map(edu => `
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 0.75rem;">
                      <div style="flex: 1;">
                        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.25rem;">
                          ${edu.degree || ''}
                        </h3>
                        <p style="font-size: 1rem; color: var(--color-text-secondary); font-weight: 600;">
                          ${edu.school || ''} ${edu.location ? `• ${edu.location}` : ''}
                        </p>
                        ${edu.details ? `
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem;">
                          ${edu.details}
                        </p>
                        ` : ''}
                      </div>
                      <span style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 600;">
                        ${edu.year || ''}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
            ` : ''}

            <!-- Skills -->
            ${data.skills && data.skills.length > 0 ? `
            <section style="margin-bottom: 3rem;">
              <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 2rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
                Skills
              </h2>
              <div style="display: grid; gap: 1rem;">
                ${data.skills.map(skillGroup => `
                  <div>
                    <h3 style="font-size: 0.875rem; font-weight: 700; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary);">
                      ${skillGroup.category || ''}
                    </h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                      ${skillGroup.items && skillGroup.items.length > 0 ? skillGroup.items.map(skill => `
                        <span style="padding: 0.375rem 0.875rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 8px; font-size: 0.875rem; font-weight: 600;">
                          ${skill}
                        </span>
                      `).join('') : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
            ` : ''}

            <!-- Two Column Layout for Certifications and Languages -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
              
              <!-- Certifications -->
              ${data.certifications && data.certifications.length > 0 ? `
              <section>
                <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 2rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
                  Certifications
                </h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  ${data.certifications.map(cert => `
                    <div>
                      <h3 style="font-size: 0.9375rem; font-weight: 700; margin-bottom: 0.25rem;">
                        ${cert.name || ''}
                      </h3>
                      <p style="font-size: 0.875rem; color: var(--color-text-secondary);">
                        ${cert.issuer || ''} ${cert.year ? `• ${cert.year}` : ''}
                      </p>
                    </div>
                  `).join('')}
                </div>
              </section>
              ` : ''}

              <!-- Languages -->
              ${data.languages && data.languages.length > 0 ? `
              <section>
                <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 2rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
                  Languages
                </h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  ${data.languages.map(lang => `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 0.9375rem; font-weight: 600;">
                        ${lang.language || ''}
                      </span>
                      <span style="font-size: 0.875rem; color: var(--color-text-secondary);">
                        ${lang.proficiency || ''}
                      </span>
                    </div>
                  `).join('')}
                </div>
              </section>
              ` : ''}
            </div>

          </div>

          <!-- Footer -->
          <footer style="padding: 2rem; background: var(--color-bg); border-top: 1px solid var(--color-border); border-radius: 0 0 12px 12px; text-align: center;">
            <button onclick="window.print()" style="padding: 0.75rem 2rem; cursor: pointer; background: var(--color-accent); color: white; border: none; border-radius: 8px; font-weight: 500; transition: all 0.2s; font-size: 1rem;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
              🖨️ Print / Save as PDF
            </button>
          </footer>

        </div>
      </div>

      <style>
        @media print {
          body {
            background: white;
            padding: 0;
          }
          header:first-of-type {
            display: none !important;
          }
          footer button {
            display: none !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
        }
        
        @media (max-width: 768px) {
          .container { padding: 0 1.5rem !important; }
          header:nth-of-type(2) { padding: 2rem 1.5rem !important; }
          div[style*="padding: 2rem"] { padding: 1.5rem !important; }
        }
        
        @media (max-width: 640px) {
          div[style*="display: flex"][style*="gap: 1rem"] {
            flex-direction: column;
            align-items: start !important;
          }
        }
      </style>
    `
  }),

// ============================================
  // TEMPLATE 6: PHOTOGRAPHY PORTFOLIO (MASONRY)
  // ============================================
  'photo-masonry': new Template('photo-masonry', {
    name: 'Photography Portfolio (Masonry)',
    description: 'Dynamic masonry grid photography portfolio',
    category: 'Portfolio',
    image: '/templates/photography-masonry.png',

    fields: {
      photographerName: { type: 'text', default: 'Emma Wilson', label: 'Photographer Name', required: true },
      tagline: { type: 'text', default: 'Fine Art & Portrait Photography', label: 'Tagline' },
      bio: {
        type: 'textarea',
        default: 'Capturing moments that tell stories. Based in NYC, available worldwide for commissions.',
        label: 'Bio'
      },
      email: { type: 'email', default: 'hello@emmawilson.com', label: 'Email' },
      instagram: { type: 'text', default: '@emmawilsonphoto', label: 'Instagram Handle' },
      categories: {
        type: 'repeatable',
        label: 'Gallery Categories',
        itemLabel: 'Category',
        default: ['All', 'Portraits', 'Landscapes', 'Street', 'Editorial'],
        max: 8
      },
      photos: {
        type: 'group',
        label: 'Portfolio Photos',
        itemLabel: 'Photo',
        min: 4,
        max: 50,
        fields: {
          title: { type: 'text', label: 'Title', default: '' },
          category: { type: 'text', label: 'Category', default: '' },
          description: { type: 'textarea', label: 'Description (optional)', default: '' },
          imageUrl: { type: 'url', label: 'Image URL', default: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' }
        },
        default: [
          { title: 'Golden Hour', category: 'Landscapes', description: 'Sunset over the mountains', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' },
          { title: 'Urban Life', category: 'Street', description: 'City streets at night', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600' },
          { title: 'Portrait Study', category: 'Portraits', description: 'Natural light portrait', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500' },
          { title: 'Architecture', category: 'Editorial', description: 'Modern design', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700' },
          { title: 'Nature', category: 'Landscapes', description: 'Forest path', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600' },
          { title: 'City Lights', category: 'Street', description: 'Urban exploration', imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800' }
        ]
      },
      services: {
        type: 'group',
        label: 'Services',
        itemLabel: 'Service',
        min: 0,
        max: 4,
        fields: {
          name: { type: 'text', label: 'Service Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' }
        },
        default: [
          { name: 'Portrait Sessions', description: 'Professional portraits for individuals and families' },
          { name: 'Event Photography', description: 'Coverage for weddings, parties, and corporate events' },
          { name: 'Commercial Work', description: 'Product and editorial photography for brands' }
        ]
      }
    },
    structure: (data) => `
      <!-- Floating Header -->
      <header style="position: fixed; top: 2rem; left: 2rem; right: 2rem; z-index: 1000; display: flex; justify-content: space-between; align-items: center;">
        <div style="background: var(--color-bg); backdrop-filter: blur(10px); padding: 1rem 1.5rem; border-radius: 50px; border: 1px solid var(--color-border); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h1 style="font-size: 1.125rem; font-weight: 700; letter-spacing: -0.01em; margin: 0;">${data.photographerName || 'Photographer'}</h1>
        </div>
        <label class="theme-toggle-switch-wrapper" style="cursor: pointer; background: var(--color-bg); backdrop-filter: blur(10px); padding: 0.75rem; border-radius: 50%; border: 1px solid var(--color-border); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="theme-toggle-slider"></span>
        </label>
      </header>

      <!-- Full Screen Hero with Overlay -->
      <section style="min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; background: var(--color-bg); padding: 6rem 2rem 4rem;">
        <div style="max-width: 700px; z-index: 1;">
          <h2 style="font-size: clamp(3rem, 8vw, 6rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.04em; line-height: 0.95;">
            ${data.photographerName || 'Photographer'}
          </h2>
          ${data.tagline ? `
          <p style="font-size: clamp(1.25rem, 3vw, 1.75rem); color: var(--color-accent); margin-bottom: 2rem; font-weight: 600;">
            ${data.tagline}
          </p>
          ` : ''}
          ${data.bio ? `
          <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.8;">
            ${data.bio}
          </p>
          ` : ''}
          <a href="#gallery" style="display: inline-block; padding: 1rem 2.5rem; background: var(--color-text); color: var(--color-bg); text-decoration: none; border-radius: 50px; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            View Gallery ↓
          </a>
        </div>
      </section>

      <!-- Floating Filter Pills -->
      <section id="gallery" style="padding: 4rem 0 2rem; background: var(--color-bg);">
        <div class="container">
          <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 3rem;">
            ${data.categories && data.categories.length > 0 ? data.categories.map((cat, index) => `
              <button 
                class="filter-btn ${index === 0 ? 'active' : ''}" 
                onclick="filterGallery('${cat.toLowerCase()}')"
                style="padding: 0.75rem 1.75rem; background: ${index === 0 ? 'var(--color-text)' : 'transparent'}; color: ${index === 0 ? 'var(--color-bg)' : 'var(--color-text)'}; border: 2px solid ${index === 0 ? 'var(--color-text)' : 'var(--color-border)'}; border-radius: 50px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9375rem;"
              >
                ${cat}
              </button>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- Masonry Gallery -->
      <section style="padding: 0 0 6rem; background: var(--color-bg);">
        <div class="container">
          <div id="masonry-grid" style="column-count: 3; column-gap: 1.5rem;">
            ${data.photos && data.photos.length > 0 ? data.photos.map((photo, index) => `
              <div class="gallery-item" data-category="${(photo.category || '').toLowerCase()}" style="break-inside: avoid; margin-bottom: 1.5rem; cursor: pointer; position: relative; overflow: hidden; border-radius: 16px;" onclick="openLightbox(${index})">
                <div style="position: relative; overflow: hidden; border-radius: 16px; transition: all 0.3s;">
                  <img 
                    src="${photo.imageUrl || ''}" 
                    alt="${photo.title || 'Photo'}"
                    style="width: 100%; height: auto; display: block; transition: transform 0.5s ease;"
                    onmouseover="this.style.transform='scale(1.08)'"
                    onmouseout="this.style.transform='scale(1)'"
                  />
                  <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%); display: flex; align-items: flex-end; padding: 2rem; opacity: 0; transition: opacity 0.3s;" class="photo-overlay">
                    <div>
                      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: white;">${photo.title || ''}</h3>
                      ${photo.description ? `<p style="font-size: 0.875rem; color: rgba(255,255,255,0.9);">${photo.description}</p>` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- Services with Cards -->
      ${data.services && data.services.length > 0 ? `
      <section style="padding: 8rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 1100px;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; margin-bottom: 1rem; text-align: center; letter-spacing: -0.03em;">
            Services
          </h2>
          <p style="text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 4rem; font-size: 1.125rem;">
            Professional photography for every occasion
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${data.services.map((service, i) => `
              <div style="padding: 2.5rem; background: var(--color-bg); border-radius: 20px; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-8px)'; this.style.borderColor='var(--color-accent)'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--color-border)'">
                <div style="width: 56px; height: 56px; background: var(--color-accent); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; opacity: 0.15; font-size: 1.75rem;">📸</div>
                <h3 style="font-size: 1.375rem; font-weight: 700; margin-bottom: 1rem;">${service.name || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 1rem;">${service.description || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact CTA -->
      <section style="padding: 8rem 0 6rem; text-align: center; background: var(--color-bg);">
        <div class="container" style="max-width: 700px;">
          <h2 style="font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -0.04em; line-height: 1;">
            Let's Create Together
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
            Available for commissions and collaborations worldwide
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            ${data.email ? `
            <a href="mailto:${data.email}" style="padding: 1.25rem 2.5rem; background: var(--color-accent); color: white; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 1.125rem; transition: all 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              Get in Touch
            </a>
            ` : ''}
            ${data.instagram ? `
            <a href="https://instagram.com/${data.instagram.replace('@', '')}" target="_blank" style="padding: 1.25rem 2.5rem; background: transparent; color: var(--color-text); text-decoration: none; border-radius: 50px; border: 2px solid var(--color-border); font-weight: 600; font-size: 1.125rem; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-text)'" onmouseout="this.style.borderColor='var(--color-border)'">
              ${data.instagram}
            </a>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Minimal Footer -->
      <footer style="padding: 2rem 0; text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 1px solid var(--color-border);">
        <div class="container">
          <p>© 2024 ${data.photographerName || 'Photographer'}</p>
        </div>
      </footer>

      <!-- Fullscreen Lightbox -->
      <div id="lightbox" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.97); z-index: 10000; align-items: center; justify-content: center; padding: 2rem;" onclick="closeLightbox()">
        <button onclick="closeLightbox()" style="position: absolute; top: 2rem; right: 2rem; background: rgba(255,255,255,0.1); border: none; color: white; width: 56px; height: 56px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">×</button>
        <button onclick="event.stopPropagation(); prevPhoto()" style="position: absolute; left: 2rem; background: rgba(255,255,255,0.1); border: none; color: white; width: 56px; height: 56px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">←</button>
        <button onclick="event.stopPropagation(); nextPhoto()" style="position: absolute; right: 2rem; background: rgba(255,255,255,0.1); border: none; color: white; width: 56px; height: 56px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">→</button>
        <div style="max-width: 90vw; max-height: 90vh; text-align: center;">
          <img id="lightbox-img" src="" alt="" style="max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);" onclick="event.stopPropagation()">
          <div id="lightbox-info" style="color: white; margin-top: 2rem; padding: 1rem;"></div>
        </div>
      </div>

      <style>
        .photo-overlay { pointer-events: none; }
        .gallery-item:hover .photo-overlay { opacity: 1; }
        
        .filter-btn:hover {
          transform: translateY(-2px);
          border-color: var(--color-text) !important;
        }
        
        .filter-btn.active {
          background: var(--color-text) !important;
          color: var(--color-bg) !important;
          border-color: var(--color-text) !important;
        }
        
        @media (max-width: 1024px) {
          #masonry-grid { column-count: 2; }
          header { top: 1rem; left: 1rem; right: 1rem; }
        }
        
        @media (max-width: 768px) {
          #masonry-grid { column-count: 1; }
          header { flex-direction: column; gap: 1rem; align-items: stretch; }
          header > div { text-align: center; }
        }
        
        @media (max-width: 640px) {
          .container { padding: 0 1.5rem !important; }
        }
      </style>

      <script>
        const photos = ${JSON.stringify(data.photos || [])};
        let currentPhotoIndex = 0;
        
        function filterGallery(category) {
          const items = document.querySelectorAll('.gallery-item');
          const buttons = document.querySelectorAll('.filter-btn');
          
          buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = 'var(--color-text)';
            btn.style.borderColor = 'var(--color-border)';
          });
          
          event.target.classList.add('active');
          event.target.style.background = 'var(--color-text)';
          event.target.style.color = 'var(--color-bg)';
          event.target.style.borderColor = 'var(--color-text)';
          
          items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        }
        
        function openLightbox(index) {
          currentPhotoIndex = index;
          showPhoto(index);
          document.getElementById('lightbox').style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
        
        function closeLightbox() {
          document.getElementById('lightbox').style.display = 'none';
          document.body.style.overflow = 'auto';
        }
        
        function showPhoto(index) {
          const photo = photos[index];
          document.getElementById('lightbox-img').src = photo.imageUrl;
          document.getElementById('lightbox-info').innerHTML = \`
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">\${photo.title || ''}</h3>
            \${photo.description ? \`<p style="font-size: 1rem; opacity: 0.8;">\${photo.description}</p>\` : ''}
          \`;
        }
        
        function prevPhoto() {
          currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
          showPhoto(currentPhotoIndex);
        }
        
        function nextPhoto() {
          currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
          showPhoto(currentPhotoIndex);
        }
        
        document.addEventListener('keydown', (e) => {
          if (document.getElementById('lightbox').style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
          }
        });
      </script>
    `
  }),

  // ============================================
  // TEMPLATE 7: PHOTOGRAPHY PORTFOLIO (GRID)
  // ============================================
'photo-grid': new Template('photo-grid', {
    name: 'Photography Portfolio (Grid)',
    description: 'Clean uniform grid photography portfolio',
    image: '/templates/photography-grid.png',
    category: 'Portfolio',
    fields: {
      photographerName: { type: 'text', default: 'Alex Chen', label: 'Photographer Name', required: true },
      tagline: { type: 'text', default: 'Commercial & Lifestyle Photography', label: 'Tagline' },
      bio: {
        type: 'textarea',
        default: 'Award-winning photographer specializing in commercial and lifestyle photography. Creating compelling visual stories for brands and editorial.',
        label: 'Bio'
      },
      email: { type: 'email', default: 'hello@alexchen.com', label: 'Email' },
      phone: { type: 'tel', default: '+1 (555) 123-4567', label: 'Phone (optional)' },
      instagram: { type: 'text', default: '@alexchenphoto', label: 'Instagram Handle' },
      categories: {
        type: 'repeatable',
        label: 'Gallery Categories',
        itemLabel: 'Category',
        default: ['All', 'Commercial', 'Lifestyle', 'Fashion', 'Travel'],
        max: 8
      },
      photos: {
        type: 'group',
        label: 'Portfolio Photos',
        itemLabel: 'Photo',
        min: 4,
        max: 50,
        fields: {
          title: { type: 'text', label: 'Title', default: '' },
          category: { type: 'text', label: 'Category', default: '' },
          description: { type: 'textarea', label: 'Description (optional)', default: '' },
          imageUrl: { type: 'url', label: 'Image URL', default: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' }
        },
        default: [
          { title: 'Brand Campaign', category: 'Commercial', description: 'Product photography for luxury brand', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' },
          { title: 'Urban Style', category: 'Lifestyle', description: 'Editorial lifestyle shoot', imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800' },
          { title: 'Fashion Week', category: 'Fashion', description: 'Backstage moments', imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' },
          { title: 'Wanderlust', category: 'Travel', description: 'Travel photography series', imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800' },
          { title: 'Product Line', category: 'Commercial', description: 'E-commerce photography', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
          { title: 'Daily Life', category: 'Lifestyle', description: 'Authentic moments', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800' },
          { title: 'Runway', category: 'Fashion', description: 'Fashion show coverage', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800' },
          { title: 'Destinations', category: 'Travel', description: 'Global adventures', imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800' }
        ]
      },
      awards: {
        type: 'group',
        label: 'Awards & Recognition',
        itemLabel: 'Award',
        min: 0,
        max: 5,
        fields: {
          title: { type: 'text', label: 'Award Title', default: '' },
          year: { type: 'text', label: 'Year', default: '' }
        },
        default: [
          { title: 'International Photography Awards - Gold', year: '2023' },
          { title: 'Best Commercial Photographer', year: '2022' }
        ]
      },
      clients: {
        type: 'repeatable',
        label: 'Notable Clients',
        itemLabel: 'Client',
        default: ['Nike', 'Apple', 'Vogue', 'National Geographic'],
        max: 10
      }
    },
    structure: (data) => `
      <!-- Sticky Header with Theme Toggle - Minimal Style -->
      <header style="padding: 1.5rem 0; border-bottom: 1px solid var(--color-border); position: sticky; top: 0; background: var(--color-bg); z-index: 100; backdrop-filter: blur(10px);">
        <div class="container">
          <nav style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 600; font-size: 1.125rem; letter-spacing: -0.02em;">${data.photographerName || 'PHOTOGRAPHER'}</div>
            <ul class="nav-links" style="display: flex; gap: 2rem; list-style: none; align-items: center;">
              <li><a href="#gallery" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">Work</a></li>
              <li><a href="#about" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">About</a></li>
              <li><a href="#contact" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">Contact</a></li>
              <li>
                <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme" style="background: transparent; border: none; padding: 0.5rem; cursor: pointer; color: var(--color-text); font-size: 1.125rem;">
                  <span class="theme-icon">☀️</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <!-- Hero Section - Minimal Style -->
      <section style="padding: 8rem 0 6rem; text-align: center;">
        <div class="container">
          <h1 style="font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.5rem;">
            ${data.photographerName || 'Less is More'}
          </h1>
          ${data.bio ? `
          <p style="font-size: 1.125rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 3rem; line-height: 1.8;">
            ${data.bio}
          </p>
          ` : ''}
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            ${data.email ? `
            <a href="mailto:${data.email}" style="padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; background: var(--color-accent); color: white;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
              Get Started
            </a>
            ` : ''}
            ${data.phone ? `
            <a href="tel:${data.phone.replace(/\s/g, '')}" style="padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; border: 1px solid var(--color-border); color: var(--color-text);" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
              Learn More
            </a>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Stats Section - Minimal Style -->
      <section style="padding: 4rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem; text-align: center;">
            <div>
              <h3 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-accent);">99.9%</h3>
              <p style="color: var(--color-text-secondary); font-size: 0.875rem;">Client Satisfaction</p>
            </div>
            <div>
              <h3 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-accent);">50K+</h3>
              <p style="color: var(--color-text-secondary); font-size: 0.875rem;">Photos Delivered</p>
            </div>
            <div>
              <h3 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-accent);">4.9</h3>
              <p style="color: var(--color-text-secondary); font-size: 0.875rem;">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery Section - Minimal Style with Categories -->
      <section id="gallery" style="padding: 6rem 0;">
        <div class="container">
          <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; text-align: center; margin-bottom: 1rem; letter-spacing: -0.02em;">
            Portfolio
          </h2>
          <p style="text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 4rem; font-size: 1.125rem;">
            Everything you need, nothing you don't
          </p>
          
          <!-- Category Filters -->
          <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem;">
            ${data.categories && data.categories.length > 0 ? data.categories.map((cat, index) => `
              <button 
                class="filter-btn ${index === 0 ? 'active' : ''}" 
                onclick="filterGallery('${cat.toLowerCase()}')"
                style="padding: 0.75rem 1.5rem; background: ${index === 0 ? 'var(--color-accent)' : 'transparent'}; color: ${index === 0 ? 'white' : 'var(--color-text)'}; border: 1px solid var(--color-border); border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 0.875rem;"
              >
                ${cat}
              </button>
            `).join('') : ''}
          </div>
          
          <!-- Photo Grid -->
          <div id="grid-gallery" class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
            ${data.photos && data.photos.length > 0 ? data.photos.map((photo, index) => `
              <div class="gallery-item feature-card" data-category="${(photo.category || '').toLowerCase()}" style="cursor: pointer; padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid var(--color-border); position: relative; transition: all 0.3s; aspect-ratio: 1;" onclick="openLightbox(${index})">
                <img 
                  src="${photo.imageUrl || ''}" 
                  alt="${photo.title || 'Photo'}"
                  style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;"
                />
                <div style="position: absolute; inset: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%); color: white; opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; justify-content: flex-end;" class="photo-overlay">
                  <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; color: white;">${photo.title || ''}</h3>
                  ${photo.description ? `<p style="color: white; line-height: 1.7; font-size: 0.9375rem; opacity: 0.9;">${photo.description}</p>` : ''}
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- About Section - Minimal Style -->
      <section id="about" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 1100px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4rem;">
            
            ${data.clients && data.clients.length > 0 ? `
            <div>
              <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -0.02em;">
                Notable Clients
              </h2>
              <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
                ${data.clients.map(client => `
                  <span style="padding: 0.75rem 1.25rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: 8px; font-weight: 500; font-size: 0.9375rem; transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                    ${client}
                  </span>
                `).join('')}
              </div>
            </div>
            ` : ''}
            
            ${data.awards && data.awards.length > 0 ? `
            <div>
              <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -0.02em;">
                Awards & Recognition
              </h2>
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${data.awards.map(award => `
                  <div style="padding: 2rem; background: var(--color-bg); border-radius: 12px; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                    <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 8px; margin-bottom: 1.5rem; opacity: 0.1;"></div>
                    <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">${award.title || ''}</h3>
                    <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem;">${award.year || ''}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Testimonial Section - Minimal Style -->
      <section style="padding: 6rem 0; text-align: center;">
        <div class="container">
          <p style="font-size: 1.5rem; line-height: 1.8; max-width: 800px; margin: 0 auto 2rem; font-weight: 500; color: var(--color-text);">
            "The most elegant solution I've found. Nothing unnecessary, everything essential."
          </p>
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-accent); opacity: 0.2;"></div>
            <div style="text-align: left;">
              <h4 style="font-weight: 600; margin-bottom: 0.25rem;">Sarah Chen</h4>
              <p style="color: var(--color-text-secondary); font-size: 0.875rem;">Brand Director</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section - Minimal Style -->
      <section id="contact" style="padding: 6rem 0; text-align: center;">
        <div class="container" style="max-width: 700px;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -0.03em;">
            Let's Create Together
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 2.5rem; line-height: 1.7;">
            Available for commissions and collaborations
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            ${data.email ? `
            <a href="mailto:${data.email}" style="padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; background: var(--color-accent); color: white;" onmouseover="this.style.transform='translateY(-2px)'; this.style.opacity='0.9'" onmouseout="this.style.transform='translateY(0)'; this.style.opacity='1'">
              Get in Touch
            </a>
            ` : ''}
            ${data.phone ? `
            <a href="tel:${data.phone.replace(/\s/g, '')}" style="padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; border: 1px solid var(--color-border); color: var(--color-text);" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
              ${data.phone}
            </a>
            ` : ''}
            ${data.instagram ? `
            <a href="https://instagram.com/${data.instagram.replace('@', '')}" target="_blank" style="padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s; display: inline-block; border: 1px solid var(--color-border); color: var(--color-text);" onmouseover="this.style.background='var(--color-surface)'" onmouseout="this.style.background='transparent'">
              ${data.instagram}
            </a>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Footer - Minimal Style -->
      <footer style="padding: 3rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem;">
        <div class="container">
          <p>© 2024 ${data.photographerName || 'Photographer'}. All rights reserved.</p>
        </div>
      </footer>

      <!-- Lightbox Modal -->
      <div id="lightbox" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); z-index: 10000; align-items: center; justify-content: center; padding: 2rem;" onclick="closeLightbox()">
        <button onclick="closeLightbox()" style="position: absolute; top: 2rem; right: 2rem; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); color: white; width: 48px; height: 48px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">×</button>
        <button onclick="event.stopPropagation(); prevPhoto()" style="position: absolute; left: 2rem; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); color: white; width: 48px; height: 48px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">‹</button>
        <button onclick="event.stopPropagation(); nextPhoto()" style="position: absolute; right: 2rem; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.3); color: white; width: 48px; height: 48px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">›</button>
        <div style="max-width: 90vw; max-height: 90vh; text-align: center;">
          <img id="lightbox-img" src="" alt="" style="max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: 8px;" onclick="event.stopPropagation()">
          <div id="lightbox-info" style="color: white; margin-top: 1.5rem; padding: 1rem;"></div>
        </div>
      </div>

      <style>
        /* Hover Effects */
        .photo-overlay { pointer-events: none; }
        .gallery-item:hover .photo-overlay { opacity: 1; }
        .gallery-item:hover { border-color: var(--color-accent) !important; transform: translateY(-4px); }
        
        /* Filter Button States */
        .filter-btn:hover {
          border-color: var(--color-accent) !important;
          transform: translateY(-2px);
        }
        
        .filter-btn.active {
          background: var(--color-accent) !important;
          color: white !important;
          border-color: var(--color-accent) !important;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .features-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          section { padding: 5rem 0 4rem !important; }
        }
        
        @media (max-width: 640px) {
          .cta-group { flex-direction: column; max-width: 300px; margin: 0 auto; }
          .cta-group a { width: 100%; }
          section { padding: 4rem 0 3rem !important; }
        }
      </style>

      <script>
        const photos = ${JSON.stringify(data.photos || [])};
        let currentPhotoIndex = 0;
        
        function filterGallery(category) {
          const items = document.querySelectorAll('.gallery-item');
          const buttons = document.querySelectorAll('.filter-btn');
          
          buttons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = 'var(--color-text)';
            btn.style.borderColor = 'var(--color-border)';
          });
          
          event.target.classList.add('active');
          event.target.style.background = 'var(--color-accent)';
          event.target.style.color = 'white';
          event.target.style.borderColor = 'var(--color-accent)';
          
          items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        }
        
        function openLightbox(index) {
          currentPhotoIndex = index;
          showPhoto(index);
          document.getElementById('lightbox').style.display = 'flex';
          document.body.style.overflow = 'hidden';
        }
        
        function closeLightbox() {
          document.getElementById('lightbox').style.display = 'none';
          document.body.style.overflow = 'auto';
        }
        
        function showPhoto(index) {
          const photo = photos[index];
          document.getElementById('lightbox-img').src = photo.imageUrl;
          document.getElementById('lightbox-info').innerHTML = \`
            <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">\${photo.title || ''}</h3>
            \${photo.description ? \`<p style="font-size: 1rem; opacity: 0.8;">\${photo.description}</p>\` : ''}
          \`;
        }
        
        function prevPhoto() {
          currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
          showPhoto(currentPhotoIndex);
        }
        
        function nextPhoto() {
          currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
          showPhoto(currentPhotoIndex);
        }
        
        document.addEventListener('keydown', (e) => {
          if (document.getElementById('lightbox').style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
          }
        });
      </script>
    `
  }),
'local-business': new Template('local-business', {
    name: 'Local Small Business',
    description: 'Perfect for local shops, services, and small businesses',
    category: 'business',
    defaultTheme: 'minimal',
    fields: [
      { name: 'businessName', label: 'Business Name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text', required: true },
      { name: 'description', label: 'About Your Business', type: 'textarea', required: true },
      { name: 'address', label: 'Street Address', type: 'text', required: false },
      { name: 'city', label: 'City, State ZIP', type: 'text', required: false },
      { name: 'phone', label: 'Phone Number', type: 'text', required: true },
      { name: 'email', label: 'Email Address', type: 'email', required: true },
      { name: 'hours', label: 'Business Hours', type: 'textarea', placeholder: 'Mon-Fri: 9am-6pm\nSat: 10am-4pm\nSun: Closed', required: false },
      { name: 'services', label: 'Services/Products (one per line)', type: 'textarea', required: true },
      { name: 'ctaText', label: 'Call-to-Action Button Text', type: 'text', required: false },
      { name: 'ctaLink', label: 'Call-to-Action Link', type: 'url', required: false },
      { name: 'facebook', label: 'Facebook URL', type: 'url', required: false },
      { name: 'instagram', label: 'Instagram Handle', type: 'text', placeholder: '@yourbusiness', required: false },
      { name: 'testimonials', label: 'Customer Testimonials (JSON format)', type: 'textarea', placeholder: '[{"name": "John Doe", "text": "Great service!", "rating": 5}]', required: false }
    ],
    structure: (data, theme) => `
      <!-- Top Bar with Quick Contact -->
      <div style="background: var(--color-accent); color: white; padding: 0.75rem 0; text-align: center; font-size: 0.875rem; font-weight: 600;">
        <div class="container" style="display: flex; justify-content: center; align-items: center; gap: 2rem; flex-wrap: wrap;">
          ${data.phone ? `<span style="display: flex; align-items: center; gap: 0.5rem;">📞 ${data.phone}</span>` : ''}
          ${data.email ? `<span style="display: flex; align-items: center; gap: 0.5rem;">📧 ${data.email}</span>` : ''}
        </div>
      </div>
      
      <!-- Sticky Header -->
      <header style="padding: 1.25rem 0; background: var(--color-bg); position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 12px rgba(0,0,0,0.08); backdrop-filter: blur(10px);">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-accent); letter-spacing: -0.01em;">
              ${data.businessName || 'Business Name'}
            </div>
            <div style="display: flex; gap: 2rem; align-items: center;">
              <nav class="nav-links" style="display: flex; gap: 2rem;">
                <a href="#services" style="text-decoration: none; color: var(--color-text-secondary); font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">Services</a>
                <a href="#reviews" style="text-decoration: none; color: var(--color-text-secondary); font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">Reviews</a>
                <a href="#contact" style="text-decoration: none; color: var(--color-text-secondary); font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">Contact</a>
              </nav>
              <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme" style="background: transparent; border: none; padding: 0.5rem; cursor: pointer; color: var(--color-text); font-size: 1.125rem;">
                <span class="theme-icon">☀️</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section with Modern Split Layout -->
      <section class="hero-section" style="background: var(--color-surface); padding: 0; overflow: hidden;">
        <div class="container" style="max-width: 1400px;">
          <div class="hero-grid" style="display: grid; grid-template-columns: 1.2fr 1fr; min-height: 500px; align-items: center; gap: 4rem;">
            <div style="padding: 5rem 0;">
              <div style="display: inline-block; background: var(--color-accent); color: white; padding: 0.625rem 1.5rem; border-radius: 50px; font-weight: 700; font-size: 0.875rem; margin-bottom: 1.5rem; letter-spacing: 0.05em;">
                LOCAL & TRUSTED
              </div>
              <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; margin-bottom: 1.5rem; line-height: 1.1; letter-spacing: -0.02em;">
                ${data.tagline || 'Your Trusted Local Partner'}
              </h1>
              <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 2.5rem; line-height: 1.7; max-width: 600px;">
                ${data.description || 'Serving our community with quality service and dedication'}
              </p>
              <div class="cta-buttons" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="#contact" style="padding: 1.125rem 2.5rem; font-size: 1rem; background: var(--color-accent); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; display: inline-block;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                  ${data.ctaText || 'Get Started'}
                </a>
                ${data.phone ? `
                <a href="tel:${data.phone.replace(/\s/g, '')}" style="padding: 1.125rem 2.5rem; font-size: 1rem; background: transparent; color: var(--color-text); border: 2px solid var(--color-border); border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; display: inline-block;" onmouseover="this.style.background='var(--color-bg)'; this.style.borderColor='var(--color-accent)'; this.style.color='var(--color-accent)'" onmouseout="this.style.background='transparent'; this.style.borderColor='var(--color-border)'; this.style.color='var(--color-text)'">
                  Call Now
                </a>
                ` : ''}
              </div>
            </div>
            <div class="hero-image" style="background: linear-gradient(135deg, var(--color-accent), var(--color-text)); height: 100%; min-height: 500px; display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem; opacity: 0.1; border-radius: 0 0 0 80px;">
              🏪
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Info Cards with Modern Design -->
      <section style="padding: 3rem 0; margin-top: -3rem; position: relative; z-index: 10;">
        <div class="container">
          <div class="info-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; max-width: 1000px; margin: 0 auto;">
            ${data.address || data.city ? `
            <div style="background: var(--color-bg); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">📍</div>
              <div style="font-weight: 700; font-size: 1.125rem; margin-bottom: 0.5rem; color: var(--color-text);">Visit Us</div>
              <div style="color: var(--color-text-secondary); font-size: 0.9375rem; line-height: 1.6;">
                ${data.address ? data.address + '<br>' : ''}${data.city || ''}
              </div>
            </div>
            ` : ''}
            ${data.hours ? `
            <div style="background: var(--color-bg); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">🕒</div>
              <div style="font-weight: 700; font-size: 1.125rem; margin-bottom: 0.5rem; color: var(--color-text);">Hours</div>
              <div style="color: var(--color-text-secondary); font-size: 0.9375rem; line-height: 1.6; white-space: pre-line;">
                ${data.hours.split('\n').slice(0, 2).join('\n')}
              </div>
            </div>
            ` : ''}
            ${data.phone ? `
            <div style="background: var(--color-bg); padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; border: 1px solid var(--color-border); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'">
              <div style="font-size: 2.5rem; margin-bottom: 1rem;">📞</div>
              <div style="font-weight: 700; font-size: 1.125rem; margin-bottom: 0.5rem; color: var(--color-text);">Call Us</div>
              <a href="tel:${data.phone.replace(/\s/g, '')}" style="color: var(--color-accent); font-size: 1.125rem; text-decoration: none; font-weight: 700; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                ${data.phone}
              </a>
            </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Services Section with Modern Grid -->
      <section id="services" style="padding: 6rem 0;">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem; max-width: 700px; margin-left: auto; margin-right: auto;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Our Services
            </h2>
            <div style="width: 60px; height: 4px; background: var(--color-accent); margin: 0 auto 1rem; border-radius: 2px;"></div>
            <p style="color: var(--color-text-secondary); font-size: 1.125rem; line-height: 1.6;">
              Quality services tailored to your needs
            </p>
          </div>
          <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${(data.services || '').split('\n').filter(s => s.trim()).map((service, i) => `
              <div class="service-card" style="background: var(--color-surface); padding: 2rem; border-radius: 12px; border-left: 4px solid var(--color-accent); transition: all 0.3s; cursor: pointer;" onmouseover="this.style.transform='translateX(8px)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='none'">
                <div style="display: flex; align-items: start; gap: 1rem;">
                  <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.125rem; flex-shrink: 0;">
                    ${i + 1}
                  </div>
                  <h3 style="font-size: 1.125rem; font-weight: 700; line-height: 1.4; color: var(--color-text); margin-top: 0.5rem;">
                    ${service.trim()}
                  </h3>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      ${data.testimonials && data.testimonials.trim() !== '' ? `
      <!-- Customer Reviews with Modern Cards -->
      <section id="reviews" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem; max-width: 700px; margin-left: auto; margin-right: auto;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Customer Reviews
            </h2>
            <div style="width: 60px; height: 4px; background: var(--color-accent); margin: 0 auto 1rem; border-radius: 2px;"></div>
            <p style="color: var(--color-text-secondary); font-size: 1.125rem; line-height: 1.6;">
              What our customers say about us
            </p>
          </div>
          <div class="reviews-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
            ${(() => {
              try {
                const testimonials = JSON.parse(data.testimonials);
                return testimonials.map(t => `
                  <div style="background: var(--color-bg); padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-top: 4px solid var(--color-accent); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'">
                    ${t.rating ? `
                    <div style="color: #FFB800; font-size: 1.25rem; margin-bottom: 1.25rem; letter-spacing: 0.25rem;">
                      ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}
                    </div>
                    ` : ''}
                    <p style="font-size: 1rem; line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; color: var(--color-text);">
                      "${t.text}"
                    </p>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.25rem; flex-shrink: 0;">
                        ${t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style="font-weight: 700; font-size: 1rem; color: var(--color-text);">${t.name}</div>
                        <div style="font-size: 0.875rem; color: var(--color-text-secondary);">Verified Customer</div>
                      </div>
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact CTA Section with Modern Design -->
      <section id="contact" style="padding: 6rem 0; background: var(--color-accent); color: white; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1), transparent); pointer-events: none;"></div>
        <div class="container" style="max-width: 800px; position: relative;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; margin-bottom: 1.5rem; color: white; letter-spacing: -0.02em;">
            Ready to Get Started?
          </h2>
          <p style="font-size: 1.25rem; margin-bottom: 3rem; opacity: 0.95; line-height: 1.6; max-width: 600px; margin-left: auto; margin-right: auto;">
            Contact us today and experience the difference of working with a local business that cares
          </p>
          <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem;">
            ${data.phone ? `
            <a href="tel:${data.phone.replace(/\s/g, '')}" style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 1.25rem 2.5rem; background: white; color: var(--color-accent); text-decoration: none; font-weight: 700; font-size: 1.125rem; border-radius: 8px; transition: all 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
              <span style="font-size: 1.5rem;">📞</span> Call ${data.phone}
            </a>
            ` : ''}
            ${data.email ? `
            <a href="mailto:${data.email}" style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 1.25rem 2.5rem; background: transparent; color: white; text-decoration: none; font-weight: 700; font-size: 1.125rem; border: 3px solid white; border-radius: 8px; transition: all 0.2s;" onmouseover="this.style.background='white'; this.style.color='var(--color-accent)'" onmouseout="this.style.background='transparent'; this.style.color='white'">
              <span style="font-size: 1.5rem;">📧</span> Email Us
            </a>
            ` : ''}
          </div>
          ${data.facebook || data.instagram ? `
          <div style="padding-top: 3rem; border-top: 2px solid rgba(255,255,255,0.2);">
            <div style="font-weight: 700; margin-bottom: 1.5rem; font-size: 1.125rem;">Follow Us</div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
              ${data.facebook ? `
              <a href="${data.facebook}" target="_blank" style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 1.5rem; transition: all 0.2s; backdrop-filter: blur(10px);" onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)'">
                <span style="color: white;">f</span>
              </a>
              ` : ''}
              ${data.instagram ? `
              <a href="https://instagram.com/${data.instagram.replace('@', '')}" target="_blank" style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 1.5rem; transition: all 0.2s; backdrop-filter: blur(10px);" onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)'">
                <span style="color: white;">📷</span>
              </a>
              ` : ''}
            </div>
          </div>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 1px solid var(--color-border);">
        <div class="container">
          <p>© 2024 ${data.businessName || 'Business'}. Proudly serving our local community.</p>
        </div>
      </footer>

      <style>
        /* Smooth hover transitions */
        .service-card:hover {
          transform: translateX(8px);
        }
        
        /* Responsive Grid Adjustments */
        @media (max-width: 968px) {
          .nav-links {
            display: none !important;
          }
          
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          
          .hero-image {
            display: none !important;
          }
          
          .hero-section {
            padding: 4rem 0 !important;
          }
          
          .info-cards {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .services-grid {
            grid-template-columns: 1fr !important;
          }
          
          .reviews-grid {
            grid-template-columns: 1fr !important;
          }
          
          .cta-buttons {
            flex-direction: column;
          }
          
          .cta-buttons a {
            width: 100%;
            text-align: center;
          }
        }
        
        @media (max-width: 640px) {
          section {
            padding: 4rem 0 !important;
          }
          
          .container {
            padding: 0 1.25rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
          }
          
          h2 {
            font-size: 1.75rem !important;
          }
        }
      </style>
    `
  }),

  'designer-portfolio': new Template('designer-portfolio', {
    name: 'Designer Portfolio',
    description: 'Showcase your design work with style',
    category: 'portfolio',
    defaultTheme: 'brutalist',
    fields: [
      { name: 'designerName', label: 'Your Name', type: 'text', required: true },
      { name: 'title', label: 'Professional Title', type: 'text', placeholder: 'UI/UX Designer, Graphic Designer, etc.', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'portfolio', label: 'Portfolio Website', type: 'url', required: false },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url', required: false },
      { name: 'behance', label: 'Behance URL', type: 'url', required: false },
      { name: 'dribbble', label: 'Dribbble URL', type: 'url', required: false },
      { name: 'projects', label: 'Projects (JSON format)', type: 'textarea', placeholder: '[{"title": "Project Name", "description": "Brief description", "imageUrl": "https://...", "tags": ["UI", "Branding"], "link": "https://..."}]', required: true },
      { name: 'skills', label: 'Skills (comma separated)', type: 'text', placeholder: 'Figma, Photoshop, Illustrator, Sketch', required: true },
      { name: 'experience', label: 'Years of Experience', type: 'text', required: false },
      { name: 'availability', label: 'Current Availability', type: 'text', placeholder: 'Available for freelance, Open to opportunities, etc.', required: false }
    ],
    structure: (data, theme) => `
      <!-- Fixed Side Navigation -->
      <nav style="position: fixed; left: 0; top: 0; bottom: 0; width: 80px; background: var(--color-text); color: var(--color-bg); z-index: 1000; display: flex; flex-direction: column; align-items: center; padding: 2rem 0;">
        <div style="writing-mode: vertical-rl; font-weight: 900; font-size: 1.125rem; letter-spacing: 0.1em; margin-bottom: auto; transform: rotate(180deg);">
          ${data.designerName?.split(' ')[0]?.toUpperCase() || 'DESIGNER'}
        </div>
        <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme" style="background: transparent; border: 2px solid var(--color-bg); color: var(--color-bg); margin-top: auto;">
          <span class="theme-icon">Ã°Å¸Å’â„¢</span>
        </button>
      </nav>

      <!-- Main Content with Left Margin -->
      <div style="margin-left: 80px;">
        
        <!-- Hero Section with Large Type -->
        <section style="min-height: 100vh; display: flex; align-items: center; padding: 4rem 0; background: var(--color-bg);">
          <div class="container" style="max-width: 1400px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 4rem; align-items: start;">
              <div>
                <div style="overflow: hidden; margin-bottom: 2rem;">
                  <div style="display: inline-block; background: var(--color-text); color: var(--color-bg); padding: 0.75rem 2rem; font-weight: 900; font-size: 0.875rem; letter-spacing: 0.15em; transform: skew(-5deg);">
                    <span style="display: inline-block; transform: skew(5deg);">${data.title?.toUpperCase() || 'DESIGNER'}</span>
                  </div>
                </div>
                <h1 style="font-size: clamp(4rem, 12vw, 8rem); font-weight: 900; line-height: 0.9; margin-bottom: 2rem; letter-spacing: -0.05em;">
                  ${data.designerName?.toUpperCase() || 'YOUR NAME'}
                </h1>
                <div style="width: 200px; height: 8px; background: var(--color-accent); margin-bottom: 3rem;"></div>
                <p style="font-size: 1.5rem; line-height: 1.6; max-width: 600px; font-weight: 500;">
                  ${data.bio || 'Creating exceptional digital experiences through thoughtful design'}
                </p>
              </div>
              <div style="position: sticky; top: 2rem;">
                ${data.availability ? `
                <div style="background: var(--color-accent); color: var(--color-bg); padding: 2rem; margin-bottom: 2rem; transform: rotate(2deg);">
                  <div style="font-weight: 900; font-size: 0.875rem; letter-spacing: 0.1em; margin-bottom: 0.5rem;">STATUS</div>
                  <div style="font-size: 1.25rem; font-weight: 700;">${data.availability}</div>
                </div>
                ` : ''}
                <div style="background: var(--color-text); color: var(--color-bg); padding: 2rem;">
                  <div style="font-weight: 900; font-size: 0.875rem; letter-spacing: 0.1em; margin-bottom: 1.5rem;">CONTACT</div>
                  ${data.email ? `
                  <a href="mailto:${data.email}" style="display: block; color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1.125rem; margin-bottom: 1rem; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                    Ã¢Å“â€° ${data.email}
                  </a>
                  ` : ''}
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem;">
                    ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" style="color: var(--color-bg); text-decoration: underline; font-size: 0.875rem; font-weight: 600;">LinkedIn</a>` : ''}
                    ${data.behance ? `<a href="${data.behance}" target="_blank" style="color: var(--color-bg); text-decoration: underline; font-size: 0.875rem; font-weight: 600;">Behance</a>` : ''}
                    ${data.dribbble ? `<a href="${data.dribbble}" target="_blank" style="color: var(--color-bg); text-decoration: underline; font-size: 0.875rem; font-weight: 600;">Dribbble</a>` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Projects Masonry Grid -->
        <section style="background: var(--color-surface); padding: 6rem 0;">
          <div class="container" style="max-width: 1400px;">
            <div style="margin-bottom: 4rem;">
              <div style="display: inline-block; background: var(--color-text); color: var(--color-bg); padding: 1rem 3rem; font-weight: 900; font-size: 3rem; letter-spacing: -0.03em;">
                SELECTED WORK
              </div>
            </div>
            
            <div class="masonry-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 2rem;">
              ${(() => {
                try {
                  const projects = JSON.parse(data.projects || '[]');
                  return projects.map((project, i) => `
                    <div class="project-item" style="break-inside: avoid; position: relative; overflow: hidden; background: var(--color-bg);">
                      ${project.imageUrl ? `
                      <div style="position: relative; overflow: hidden; aspect-ratio: ${i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '16/9'};">
                        <img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
                      </div>
                      ` : `
                      <div style="aspect-ratio: ${i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '16/9'}; background: var(--color-text); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--color-bg); opacity: 0.3;">
                        ${['Ã¢â€”â€ ', 'Ã¢â€”Â', 'Ã¢â€“Â '][i % 3]}
                      </div>
                      `}
                      <div style="padding: 2rem; border: 4px solid var(--color-border); border-top: none;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                          <h3 style="font-size: 1.75rem; font-weight: 900; letter-spacing: -0.02em; line-height: 1.2;">
                            ${project.title || 'Project'}
                          </h3>
                          ${project.link ? `
                          <a href="${project.link}" target="_blank" style="width: 40px; height: 40px; background: var(--color-text); color: var(--color-bg); display: flex; align-items: center; justify-content: center; text-decoration: none; font-weight: 900; font-size: 1.25rem; flex-shrink: 0;">Ã¢â€ â€™</a>
                          ` : ''}
                        </div>
                        <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--color-text-secondary);">
                          ${project.description || ''}
                        </p>
                        ${project.tags && project.tags.length > 0 ? `
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                          ${project.tags.map(tag => `
                            <span style="background: var(--color-text); color: var(--color-bg); padding: 0.375rem 1rem; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.05em; text-transform: uppercase;">
                              ${tag}
                            </span>
                          `).join('')}
                        </div>
                        ` : ''}
                      </div>
                    </div>
                  `).join('');
                } catch (e) {
                  return '<p style="text-align: center; color: var(--color-text-secondary); grid-column: 1/-1;">No projects to display</p>';
                }
              })()}
            </div>
          </div>
        </section>

        <!-- Skills & Experience -->
        <section style="background: var(--color-bg); padding: 6rem 0;">
          <div class="container" style="max-width: 1400px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6rem;">
              <div>
                <h2 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 3rem; letter-spacing: -0.03em; line-height: 1;">
                  CAPABILITIES
                </h2>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                  ${(data.skills || '').split(',').map(skill => `
                    <div style="background: var(--color-surface); padding: 1.5rem; border-left: 4px solid var(--color-accent);">
                      <div style="font-weight: 900; font-size: 1.125rem;">
                        ${skill.trim()}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <div>
                <h2 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 3rem; letter-spacing: -0.03em; line-height: 1;">
                  ABOUT
                </h2>
                <p style="font-size: 1.25rem; line-height: 1.8; margin-bottom: 2rem; font-weight: 500;">
                  ${data.bio || 'Passionate designer focused on creating impactful experiences.'}
                </p>
                ${data.experience ? `
                <div style="background: var(--color-accent); color: var(--color-bg); padding: 2rem; margin-top: 3rem;">
                  <div style="font-size: 0.875rem; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 0.5rem;">EXPERIENCE</div>
                  <div style="font-size: 2.5rem; font-weight: 900; letter-spacing: -0.02em;">${data.experience}</div>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
        </section>

        <!-- Footer CTA -->
        <section style="background: var(--color-text); color: var(--color-bg); padding: 8rem 0; text-align: center;">
          <div class="container" style="max-width: 1000px;">
            <h2 style="font-size: clamp(3rem, 8vw, 6rem); font-weight: 900; line-height: 1; margin-bottom: 2rem; letter-spacing: -0.04em;">
              LET'S CREATE<br>TOGETHER
            </h2>
            <p style="font-size: 1.5rem; margin-bottom: 3rem; opacity: 0.9; font-weight: 500;">
              Available for new projects and collaborations
            </p>
            ${data.email ? `
            <a href="mailto:${data.email}" style="display: inline-block; background: var(--color-bg); color: var(--color-text); padding: 1.5rem 4rem; font-weight: 900; font-size: 1.25rem; text-decoration: none; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              GET IN TOUCH Ã¢â€ â€™
            </a>
            ` : ''}
          </div>
        </section>

        <!-- Footer -->
        <footer style="background: var(--color-bg); padding: 2rem 0; text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 4px solid var(--color-border);">
          <div class="container">
            <p style="font-weight: 700;">Ã‚Â© 2024 ${data.designerName || 'Designer'}</p>
          </div>
        </footer>
      </div>

      <style>
        .project-item:hover img {
          transform: scale(1.05);
        }
        
        @media (max-width: 1024px) {
          nav { width: 60px; padding: 1.5rem 0; }
          nav > div:first-child { font-size: 0.875rem; }
          div[style*="margin-left: 80px"] { margin-left: 60px !important; }
          .masonry-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; }
          section > div > div[style*="grid-template-columns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          nav { display: none; }
          div[style*="margin-left: 80px"] { margin-left: 0 !important; }
          .masonry-grid { grid-template-columns: 1fr !important; }
        }
      </style>
    `
  }),

  'writer-portfolio': new Template('writer-portfolio', {
    name: 'Writer Portfolio',
    description: 'Perfect for authors, journalists, and content creators',
    category: 'portfolio',
    defaultTheme: 'elegant',
    fields: [
      { name: 'writerName', label: 'Your Name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Freelance Writer, Author, Journalist, etc.', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'website', label: 'Personal Website', type: 'url', required: false },
      { name: 'twitter', label: 'Twitter/X Handle', type: 'text', placeholder: '@username', required: false },
      { name: 'medium', label: 'Medium URL', type: 'url', required: false },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'url', required: false },
      { name: 'articles', label: 'Published Work (JSON format)', type: 'textarea', placeholder: '[{"title": "Article Title", "publication": "Publication Name", "date": "2024", "excerpt": "Brief excerpt...", "link": "https://..."}]', required: true },
      { name: 'specialties', label: 'Writing Specialties (comma separated)', type: 'text', placeholder: 'Technology, Culture, Business, Travel', required: true },
      { name: 'publications', label: 'Notable Publications (comma separated)', type: 'text', placeholder: 'The New York Times, Wired, Medium', required: false },
      { name: 'books', label: 'Books (JSON format)', type: 'textarea', placeholder: '[{"title": "Book Title", "year": "2024", "description": "Brief description", "link": "https://..."}]', required: false }
    ],
    structure: (data, theme) => `
      <!-- Minimal Header -->
      <header style="padding: 2rem 0; background: var(--color-bg); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-family: serif; font-size: 1.75rem; font-weight: 400; font-style: italic;">
              ${data.writerName || 'Writer Name'}
            </div>
            <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-icon">Ã°Å¸Å’â„¢</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Masthead -->
      <section style="padding: 8rem 0 6rem; background: var(--color-bg); text-align: center;">
        <div class="container" style="max-width: 900px;">
          <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 2rem; color: var(--color-text-secondary); font-weight: 600;">
            ${data.tagline || 'Writer & Storyteller'}
          </div>
          <h1 style="font-family: serif; font-size: clamp(4rem, 10vw, 7rem); font-weight: 400; margin-bottom: 3rem; line-height: 1.1;">
            ${data.writerName || 'Your Name'}
          </h1>
          <div style="max-width: 2px; height: 60px; background: var(--color-accent); margin: 0 auto 3rem;"></div>
          <p style="font-size: 1.375rem; line-height: 1.8; color: var(--color-text-secondary); max-width: 700px; margin: 0 auto; font-weight: 400;">
            ${data.bio || 'Crafting stories and sharing insights through the written word'}
          </p>
        </div>
      </section>

      ${data.publications ? `
      <!-- Publications Ribbon -->
      <section style="background: var(--color-text); color: var(--color-bg); padding: 1.5rem 0; text-align: center; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem; opacity: 0.7; font-weight: 600;">
            Featured In
          </div>
          <div style="font-family: serif; font-size: 1rem; font-style: italic; opacity: 0.95;">
            ${data.publications.split(',').map(pub => pub.trim()).join(' Ã‚Â· ')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Featured Article (First Article Large) -->
      ${(() => {
        try {
          const articles = JSON.parse(data.articles || '[]');
          const featured = articles[0];
          if (!featured) return '';
          
          return `
          <section style="padding: 6rem 0; background: var(--color-surface);">
            <div class="container" style="max-width: 1000px;">
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-accent); margin-bottom: 1rem; font-weight: 700;">
                Featured Story
              </div>
              <article>
                <h2 style="font-family: serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 400; line-height: 1.2; margin-bottom: 2rem;">
                  ${featured.link ? `<a href="${featured.link}" target="_blank" style="color: var(--color-text); text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${featured.title}</a>` : featured.title}
                </h2>
                <div style="display: flex; gap: 2rem; align-items: center; margin-bottom: 2.5rem; font-size: 0.9375rem; color: var(--color-text-secondary);">
                  <span style="font-weight: 600; color: var(--color-accent);">${featured.publication || 'Publication'}</span>
                  ${featured.date ? `<span>${featured.date}</span>` : ''}
                </div>
                <p style="font-size: 1.375rem; line-height: 1.9; color: var(--color-text); margin-bottom: 2.5rem; font-weight: 400;">
                  ${featured.excerpt || ''}
                </p>
                ${featured.link ? `
                <a href="${featured.link}" target="_blank" style="display: inline-block; padding: 1rem 2.5rem; border: 2px solid var(--color-text); color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.3s;" onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
                  Read Full Article Ã¢â€ â€™
                </a>
                ` : ''}
              </article>
            </div>
          </section>
          `;
        } catch (e) {
          return '';
        }
      })()}

      <!-- Recent Articles Grid -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-family: serif; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 400; margin-bottom: 1.5rem;">
              Recent Work
            </h2>
            <div style="width: 60px; height: 2px; background: var(--color-accent); margin: 0 auto;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4rem;">
            ${(() => {
              try {
                const articles = JSON.parse(data.articles || '[]');
                return articles.slice(1).map(article => `
                  <article style="padding-bottom: 3rem; border-bottom: 1px solid var(--color-border);">
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent); margin-bottom: 1rem; font-weight: 700;">
                      ${article.publication || 'Publication'}
                    </div>
                    <h3 style="font-family: serif; font-size: 1.875rem; font-weight: 400; line-height: 1.3; margin-bottom: 1rem;">
                      ${article.link ? `<a href="${article.link}" target="_blank" style="color: var(--color-text); text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${article.title}</a>` : article.title}
                    </h3>
                    ${article.date ? `
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                      ${article.date}
                    </div>
                    ` : ''}
                    <p style="font-size: 1.0625rem; line-height: 1.75; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                      ${article.excerpt || ''}
                    </p>
                    ${article.link ? `
                    <a href="${article.link}" target="_blank" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text); text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--color-text); padding-bottom: 2px; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'; this.style.borderColor='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'; this.style.borderColor='var(--color-text)'">
                      Read More
                    </a>
                    ` : ''}
                  </article>
                `).join('');
              } catch (e) {
                return '<p style="text-align: center; color: var(--color-text-secondary); grid-column: 1/-1;">No articles to display</p>';
              }
            })()}
          </div>
        </div>
      </section>

      ${data.books && data.books.trim() !== '[]' && data.books.trim() !== '' ? `
      <!-- Books Section -->
      <section style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-family: serif; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 400; margin-bottom: 1.5rem;">
              Books
            </h2>
            <div style="width: 60px; height: 2px; background: var(--color-accent); margin: 0 auto;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 4rem;">
            ${(() => {
              try {
                const books = JSON.parse(data.books || '[]');
                return books.map(book => `
                  <div style="text-align: center;">
                    <div style="width: 200px; height: 300px; background: linear-gradient(135deg, var(--color-text), var(--color-accent)); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-lg); position: relative;">
                      <div style="font-family: serif; font-size: 1.5rem; color: var(--color-bg); font-weight: 400; padding: 2rem; text-align: center; line-height: 1.3;">
                        ${book.title}
                      </div>
                    </div>
                    <h3 style="font-family: serif; font-size: 1.875rem; font-weight: 400; margin-bottom: 0.5rem;">
                      ${book.title}
                    </h3>
                    ${book.year ? `
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                      ${book.year}
                    </div>
                    ` : ''}
                    <p style="font-size: 1rem; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 2rem;">
                      ${book.description || ''}
                    </p>
                    ${book.link ? `
                    <a href="${book.link}" target="_blank" style="display: inline-block; padding: 0.875rem 2rem; border: 2px solid var(--color-text); color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.875rem; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.3s;" onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
                      Learn More
                    </a>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- About Section with Pull Quote Style -->
      <section style="padding: 8rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 800px;">
          <div style="border-left: 4px solid var(--color-accent); padding-left: 3rem; margin-bottom: 4rem;">
            <p style="font-family: serif; font-size: 2rem; line-height: 1.5; font-style: italic; color: var(--color-text);">
              "${data.bio || 'Passionate about telling stories and sharing ideas through writing.'}"
            </p>
          </div>
          
          ${data.specialties ? `
          <div style="margin-top: 4rem;">
            <h3 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 2rem; color: var(--color-text-secondary); font-weight: 700; text-align: center;">
              Areas of Expertise
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center;">
              ${data.specialties.split(',').map(specialty => `
                <div style="font-family: serif; font-size: 1.25rem; color: var(--color-text); font-style: italic;">
                  ${specialty.trim()}
                </div>
              `).join('<div style="color: var(--color-text-secondary);">Ã‚Â·</div>')}
            </div>
          </div>
          ` : ''}
        </div>
      </section>

      <!-- Contact Section -->
      <section style="padding: 6rem 0; background: var(--color-surface); text-align: center; border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 700px;">
          <h2 style="font-family: serif; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 400; margin-bottom: 2rem;">
            Get in Touch
          </h2>
          <div style="width: 60px; height: 2px; background: var(--color-accent); margin: 0 auto 3rem;"></div>
          <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
            Available for commissions, collaborations, and editorial projects
          </p>
          ${data.email ? `
          <a href="mailto:${data.email}" style="display: inline-block; padding: 1.25rem 3rem; background: var(--color-text); color: var(--color-bg); text-decoration: none; font-weight: 600; font-size: 1rem; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 3rem; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            ${data.email}
          </a>
          ` : ''}
          
          <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin-top: 3rem; padding-top: 3rem; border-top: 1px solid var(--color-border);">
            ${data.twitter ? `
            <a href="https://twitter.com/${data.twitter.replace('@', '')}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              Twitter
            </a>
            ` : ''}
            ${data.medium ? `
            <a href="${data.medium}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              Medium
            </a>
            ` : ''}
            ${data.linkedin ? `
            <a href="${data.linkedin}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              LinkedIn
            </a>
            ` : ''}
            ${data.website ? `
            <a href="${data.website}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              Website
            </a>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 1px solid var(--color-border);">
        <div class="container">
          <p style="font-family: serif; font-style: italic;">Ã‚Â© 2024 ${data.writerName || 'Writer'}. All rights reserved.</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      </style>
    `
  }),
  // 'writer-portfolio': new Template('writer-portfolio', {
  //   name: 'Writer Portfolio',
  //   description: 'Perfect for authors, journalists, and content creators',
  //   category: 'portfolio',
  //   defaultTheme: 'elegant',
  //   fields: [
  //     { name: 'writerName', label: 'Your Name', type: 'text', required: true },
  //     { name: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Freelance Writer, Author, Journalist, etc.', required: true },
  //     { name: 'bio', label: 'Bio', type: 'textarea', required: true },
  //     { name: 'email', label: 'Email', type: 'email', required: true },
  //     { name: 'website', label: 'Personal Website', type: 'url', required: false },
  //     { name: 'twitter', label: 'Twitter/X Handle', type: 'text', placeholder: '@username', required: false },
  //     { name: 'medium', label: 'Medium URL', type: 'url', required: false },
  //     { name: 'linkedin', label: 'LinkedIn URL', type: 'url', required: false },
  //     { name: 'articles', label: 'Published Work (JSON format)', type: 'textarea', placeholder: '[{"title": "Article Title", "publication": "Publication Name", "date": "2024", "excerpt": "Brief excerpt...", "link": "https://..."}]', required: true },
  //     { name: 'specialties', label: 'Writing Specialties (comma separated)', type: 'text', placeholder: 'Technology, Culture, Business, Travel', required: true },
  //     { name: 'publications', label: 'Notable Publications (comma separated)', type: 'text', placeholder: 'The New York Times, Wired, Medium', required: false },
  //     { name: 'books', label: 'Books (JSON format)', type: 'textarea', placeholder: '[{"title": "Book Title", "year": "2024", "description": "Brief description", "link": "https://..."}]', required: false }
  //   ],
  //   structure: (data, theme) => `
  //     <!-- Minimal Header -->
  //     <header style="padding: 2rem 0; background: var(--color-bg); border-bottom: 1px solid var(--color-border);">
  //       <div class="container" style="max-width: 1200px;">
  //         <div style="display: flex; justify-content: space-between; align-items: center;">
  //           <div style="font-family: serif; font-size: 1.75rem; font-weight: 400; font-style: italic;">
  //             ${data.writerName || 'Writer Name'}
  //           </div>
  //           <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">
  //             <span class="theme-icon">Ã°Å¸Å’â„¢</span>
  //           </button>
  //         </div>
  //       </div>
  //     </header>

  //     <!-- Hero Masthead -->
  //     <section style="padding: 8rem 0 6rem; background: var(--color-bg); text-align: center;">
  //       <div class="container" style="max-width: 900px;">
  //         <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 2rem; color: var(--color-text-secondary); font-weight: 600;">
  //           ${data.tagline || 'Writer & Storyteller'}
  //         </div>
  //         <h1 style="font-family: serif; font-size: clamp(4rem, 10vw, 7rem); font-weight: 400; margin-bottom: 3rem; line-height: 1.1;">
  //           ${data.writerName || 'Your Name'}
  //         </h1>
  //         <div style="max-width: 2px; height: 60px; background: var(--color-accent); margin: 0 auto 3rem;"></div>
  //         <p style="font-size: 1.375rem; line-height: 1.8; color: var(--color-text-secondary); max-width: 700px; margin: 0 auto; font-weight: 400;">
  //           ${data.bio || 'Crafting stories and sharing insights through the written word'}
  //         </p>
  //       </div>
  //     </section>

  //     ${data.publications ? `
  //     <!-- Publications Ribbon -->
  //     <section style="background: var(--color-text); color: var(--color-bg); padding: 1.5rem 0; text-align: center; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
  //       <div class="container">
  //         <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.75rem; opacity: 0.7; font-weight: 600;">
  //           Featured In
  //         </div>
  //         <div style="font-family: serif; font-size: 1rem; font-style: italic; opacity: 0.95;">
  //           ${data.publications.split(',').map(pub => pub.trim()).join(' Ã‚Â· ')}
  //         </div>
  //       </div>
  //     </section>
  //     ` : ''}

  //     <!-- Featured Article (First Article Large) -->
  //     ${(() => {
  //       try {
  //         const articles = JSON.parse(data.articles || '[]');
  //         const featured = articles[0];
  //         if (!featured) return '';
          
  //         return `
  //         <section style="padding: 6rem 0; background: var(--color-surface);">
  //           <div class="container" style="max-width: 1000px;">
  //             <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-accent); margin-bottom: 1rem; font-weight: 700;">
  //               Featured Story
  //             </div>
  //             <article>
  //               <h2 style="font-family: serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 400; line-height: 1.2; margin-bottom: 2rem;">
  //                 ${featured.link ? `<a href="${featured.link}" target="_blank" style="color: var(--color-text); text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${featured.title}</a>` : featured.title}
  //               </h2>
  //               <div style="display: flex; gap: 2rem; align-items: center; margin-bottom: 2.5rem; font-size: 0.9375rem; color: var(--color-text-secondary);">
  //                 <span style="font-weight: 600; color: var(--color-accent);">${featured.publication || 'Publication'}</span>
  //                 ${featured.date ? `<span>${featured.date}</span>` : ''}
  //               </div>
  //               <p style="font-size: 1.375rem; line-height: 1.9; color: var(--color-text); margin-bottom: 2.5rem; font-weight: 400;">
  //                 ${featured.excerpt || ''}
  //               </p>
  //               ${featured.link ? `
  //               <a href="${featured.link}" target="_blank" style="display: inline-block; padding: 1rem 2.5rem; border: 2px solid var(--color-text); color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.3s;" onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
  //                 Read Full Article Ã¢â€ â€™
  //               </a>
  //               ` : ''}
  //             </article>
  //           </div>
  //         </section>
  //         `;
  //       } catch (e) {
  //         return '';
  //       }
  //     })()}

  //     <!-- Recent Articles Grid -->
  //     <section style="padding: 6rem 0; background: var(--color-bg);">
  //       <div class="container" style="max-width: 1200px;">
  //         <div style="text-align: center; margin-bottom: 5rem;">
  //           <h2 style="font-family: serif; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 400; margin-bottom: 1.5rem;">
  //             Recent Work
  //           </h2>
  //           <div style="width: 60px; height: 2px; background: var(--color-accent); margin: 0 auto;"></div>
  //         </div>
          
  //         <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4rem;">
  //           ${(() => {
  //             try {
  //               const articles = JSON.parse(data.articles || '[]');
  //               return articles.slice(1).map(article => `
  //                 <article style="padding-bottom: 3rem; border-bottom: 1px solid var(--color-border);">
  //                   <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent); margin-bottom: 1rem; font-weight: 700;">
  //                     ${article.publication || 'Publication'}
  //                   </div>
  //                   <h3 style="font-family: serif; font-size: 1.875rem; font-weight: 400; line-height: 1.3; margin-bottom: 1rem;">
  //                     ${article.link ? `<a href="${article.link}" target="_blank" style="color: var(--color-text); text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${article.title}</a>` : article.title}
  //                   </h3>
  //                   ${article.date ? `
  //                   <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
  //                     ${article.date}
  //                   </div>
  //                   ` : ''}
  //                   <p style="font-size: 1.0625rem; line-height: 1.75; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
  //                     ${article.excerpt || ''}
  //                   </p>
  //                   ${article.link ? `
  //                   <a href="${article.link}" target="_blank" style="font-size: 0.875rem; font-weight: 600; color: var(--color-text); text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--color-text); padding-bottom: 2px; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'; this.style.borderColor='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'; this.style.borderColor='var(--color-text)'">
  //                     Read More
  //                   </a>
  //                   ` : ''}
  //                 </article>
  //               `).join('');
  //             } catch (e) {
  //               return '<p style="text-align: center; color: var(--color-text-secondary); grid-column: 1/-1;">No articles to display</p>';
  //             }
  //           })()}
  //         </div>
  //       </div>
  //     </section>

  //     ${data.books && data.books.trim() !== '[]' && data.books.trim() !== '' ? `
  //     <!-- Books Section -->
  //     <section style="padding: 6rem 0; background: var(--color-surface);">
  //       <div class="container" style="max-width: 1200px;">
  //         <div style="text-align: center; margin-bottom: 5rem;">
  //           <h2 style="font-family: serif; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 400; margin-bottom: 1.5rem;">
  //             Books
  //           </h2>
  //           <div style="width: 60px; height: 2px; background: var(--color-accent); margin: 0 auto;"></div>
  //         </div>
          
  //         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 4rem;">
  //           ${(() => {
  //             try {
  //               const books = JSON.parse(data.books || '[]');
  //               return books.map(book => `
  //                 <div style="text-align: center;">
  //                   <div style="width: 200px; height: 300px; background: linear-gradient(135deg, var(--color-text), var(--color-accent)); margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-lg); position: relative;">
  //                     <div style="font-family: serif; font-size: 1.5rem; color: var(--color-bg); font-weight: 400; padding: 2rem; text-align: center; line-height: 1.3;">
  //                       ${book.title}
  //                     </div>
  //                   </div>
  //                   <h3 style="font-family: serif; font-size: 1.875rem; font-weight: 400; margin-bottom: 0.5rem;">
  //                     ${book.title}
  //                   </h3>
  //                   ${book.year ? `
  //                   <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
  //                     ${book.year}
  //                   </div>
  //                   ` : ''}
  //                   <p style="font-size: 1rem; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 2rem;">
  //                     ${book.description || ''}
  //                   </p>
  //                   ${book.link ? `
  //                   <a href="${book.link}" target="_blank" style="display: inline-block; padding: 0.875rem 2rem; border: 2px solid var(--color-text); color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.875rem; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.3s;" onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
  //                     Learn More
  //                   </a>
  //                   ` : ''}
  //                 </div>
  //               `).join('');
  //             } catch (e) {
  //               return '';
  //             }
  //           })()}
  //         </div>
  //       </div>
  //     </section>
  //     ` : ''}

  //     <!-- About Section with Pull Quote Style -->
  //     <section style="padding: 8rem 0; background: var(--color-bg);">
  //       <div class="container" style="max-width: 800px;">
  //         <div style="border-left: 4px solid var(--color-accent); padding-left: 3rem; margin-bottom: 4rem;">
  //           <p style="font-family: serif; font-size: 2rem; line-height: 1.5; font-style: italic; color: var(--color-text);">
  //             "${data.bio || 'Passionate about telling stories and sharing ideas through writing.'}"
  //           </p>
  //         </div>
          
  //         ${data.specialties ? `
  //         <div style="margin-top: 4rem;">
  //           <h3 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 2rem; color: var(--color-text-secondary); font-weight: 700; text-align: center;">
  //             Areas of Expertise
  //           </h3>
  //           <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center;">
  //             ${data.specialties.split(',').map(specialty => `
  //               <div style="font-family: serif; font-size: 1.25rem; color: var(--color-text); font-style: italic;">
  //                 ${specialty.trim()}
  //               </div>
  //             `).join('<div style="color: var(--color-text-secondary);">Ã‚Â·</div>')}
  //           </div>
  //         </div>
  //         ` : ''}
  //       </div>
  //     </section>

  //     <!-- Contact Section -->
  //     <section style="padding: 6rem 0; background: var(--color-surface); text-align: center; border-top: 1px solid var(--color-border);">
  //       <div class="container" style="max-width: 700px;">
  //         <h2 style="font-family: serif; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 400; margin-bottom: 2rem;">
  //           Get in Touch
  //         </h2>
  //         <div style="width: 60px; height: 2px; background: var(--color-accent); margin: 0 auto 3rem;"></div>
  //         <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
  //           Available for commissions, collaborations, and editorial projects
  //         </p>
  //         ${data.email ? `
  //         <a href="mailto:${data.email}" style="display: inline-block; padding: 1.25rem 3rem; background: var(--color-text); color: var(--color-bg); text-decoration: none; font-weight: 600; font-size: 1rem; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 3rem; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
  //           ${data.email}
  //         </a>
  //         ` : ''}
          
  //         <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin-top: 3rem; padding-top: 3rem; border-top: 1px solid var(--color-border);">
  //           ${data.twitter ? `
  //           <a href="https://twitter.com/${data.twitter.replace('@', '')}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
  //             Twitter
  //           </a>
  //           ` : ''}
  //           ${data.medium ? `
  //           <a href="${data.medium}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
  //             Medium
  //           </a>
  //           ` : ''}
  //           ${data.linkedin ? `
  //           <a href="${data.linkedin}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
  //             LinkedIn
  //           </a>
  //           ` : ''}
  //           ${data.website ? `
  //           <a href="${data.website}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 0.9375rem; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
  //             Website
  //           </a>
  //           ` : ''}
  //         </div>
  //       </div>
  //     </section>

  //     <!-- Footer -->
  //     <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 1px solid var(--color-border);">
  //       <div class="container">
  //         <p style="font-family: serif; font-style: italic;">Ã‚Â© 2024 ${data.writerName || 'Writer'}. All rights reserved.</p>
  //       </div>
  //     </footer>

  //     <style>
  //       @media (max-width: 768px) {
  //         section > div > div[style*="grid-template-columns: repeat(2, 1fr)"] {
  //           grid-template-columns: 1fr !important;
  //         }
  //       }
  //     </style>
  //   `
  // }),

  'wedding': new Template('wedding', {
    name: 'Wedding',
    description: 'Elegant wedding invitation and details',
    category: 'event',
    defaultTheme: 'elegant',
    fields: [
      { name: 'coupleName', label: 'Couple Names', type: 'text', placeholder: 'Sarah & Michael', required: true },
      { name: 'weddingDate', label: 'Wedding Date', type: 'text', placeholder: 'June 15, 2025', required: true },
      { name: 'ceremony', label: 'Ceremony Details', type: 'textarea', placeholder: 'Time and location', required: true },
      { name: 'reception', label: 'Reception Details', type: 'textarea', placeholder: 'Time and location', required: true },
      { name: 'story', label: 'Your Story', type: 'textarea', required: false },
      { name: 'rsvpLink', label: 'RSVP Link', type: 'url', required: false },
      { name: 'registryLink', label: 'Registry Link', type: 'url', required: false },
      { name: 'hotelInfo', label: 'Hotel Information', type: 'textarea', required: false },
      { name: 'dressCode', label: 'Dress Code', type: 'text', placeholder: 'Formal Attire', required: false },
      { name: 'schedule', label: 'Schedule (JSON format)', type: 'textarea', placeholder: '[{"time": "4:00 PM", "event": "Ceremony", "location": "Garden Terrace"}]', required: false }
    ],
    structure: (data, theme) => `
      <!-- Decorative Header -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--color-border), transparent);"></div>
      
      <header style="padding: 2rem 0; background: var(--color-bg); text-align: center;">
        <div class="container">
          <div style="font-family: serif; font-size: 1rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-text-secondary);">
            Wedding Celebration
          </div>
        </div>
      </header>

      <!-- Hero Invitation -->
      <section style="padding: 8rem 0; background: var(--color-bg); text-align: center; position: relative;">
        <div class="container" style="max-width: 800px;">
          <!-- Decorative flourish -->
          <div style="font-size: 3rem; color: var(--color-accent); margin-bottom: 2rem; opacity: 0.6;">Ã¢ÂÂ¦</div>
          
          <div style="font-family: serif; font-size: 1rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 2rem;">
            Together with their families
          </div>
          
          <h1 style="font-family: serif; font-size: clamp(3.5rem, 9vw, 6rem); font-weight: 400; margin-bottom: 2rem; line-height: 1.2; font-style: italic;">
            ${data.coupleName || 'Sarah & Michael'}
          </h1>
          
          <div style="width: 80px; height: 1px; background: var(--color-accent); margin: 3rem auto;"></div>
          
          <div style="font-family: serif; font-size: 1rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 1rem;">
            Request the honor of your presence
          </div>
          
          <div style="font-family: serif; font-size: 2.5rem; font-weight: 400; color: var(--color-accent); margin-bottom: 3rem;">
            ${data.weddingDate || 'June 15, 2025'}
          </div>
          
          ${data.rsvpLink ? `
          <a href="${data.rsvpLink}" target="_blank" style="display: inline-block; padding: 1.25rem 3.5rem; border: 2px solid var(--color-accent); color: var(--color-accent); text-decoration: none; font-family: serif; font-size: 1rem; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s; margin-top: 1rem;" onmouseover="this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-accent)'">
            RSVP
          </a>
          ` : ''}
          
          <div style="font-size: 2rem; color: var(--color-accent); margin-top: 3rem; opacity: 0.6;">Ã¢ÂÂ¦</div>
        </div>
      </section>

      <!-- Event Details -->
      <section style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 1000px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1rem; opacity: 0.6;">Ã¢Å“Â¦</div>
            <h2 style="font-family: serif; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 400; margin-bottom: 1rem;">
              Celebration Details
            </h2>
            <div style="width: 60px; height: 1px; background: var(--color-accent); margin: 0 auto;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 4rem;">
            <!-- Ceremony -->
            <div style="text-align: center; padding: 3rem; background: var(--color-bg); border: 1px solid var(--color-border);">
              <div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1.5rem;">Ã°Å¸â€™â€™</div>
              <h3 style="font-family: serif; font-size: 1.75rem; font-weight: 400; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; font-size: 1.125rem; color: var(--color-text-secondary);">
                Ceremony
              </h3>
              <div style="font-family: serif; font-size: 1.125rem; line-height: 1.8; color: var(--color-text); white-space: pre-line;">
                ${data.ceremony || '4:00 PM\nGarden Terrace'}
              </div>
            </div>
            
            <!-- Reception -->
            <div style="text-align: center; padding: 3rem; background: var(--color-bg); border: 1px solid var(--color-border);">
              <div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1.5rem;">Ã°Å¸Â¥â€š</div>
              <h3 style="font-family: serif; font-size: 1.75rem; font-weight: 400; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; font-size: 1.125rem; color: var(--color-text-secondary);">
                Reception
              </h3>
              <div style="font-family: serif; font-size: 1.125rem; line-height: 1.8; color: var(--color-text); white-space: pre-line;">
                ${data.reception || '6:00 PM\nGrand Ballroom'}
              </div>
            </div>
          </div>
        </div>
      </section>

      ${data.schedule && data.schedule.trim() !== '' && data.schedule !== '[]' ? `
      <!-- Schedule -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 800px;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 400; margin-bottom: 1rem;">
              Schedule of Events
            </h2>
            <div style="width: 60px; height: 1px; background: var(--color-accent); margin: 0 auto;"></div>
          </div>
          
          <div style="position: relative;">
            <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--color-border);"></div>
            
            ${(() => {
              try {
                const schedule = JSON.parse(data.schedule || '[]');
                return schedule.map((item, i) => `
                  <div style="position: relative; padding: 2rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div style="text-align: ${i % 2 === 0 ? 'right' : 'left'}; ${i % 2 === 0 ? 'order: 1;' : 'order: 2;'}">
                      <div style="font-family: serif; font-size: 1.5rem; font-weight: 600; color: var(--color-accent); margin-bottom: 0.5rem;">
                        ${item.time || ''}
                      </div>
                      <div style="font-family: serif; font-size: 1.25rem; font-weight: 400; margin-bottom: 0.5rem;">
                        ${item.event || ''}
                      </div>
                      <div style="font-size: 0.9375rem; color: var(--color-text-secondary); font-style: italic;">
                        ${item.location || ''}
                      </div>
                    </div>
                    <div style="${i % 2 === 0 ? 'order: 2;' : 'order: 1;'}"></div>
                    <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: var(--color-accent); border: 3px solid var(--color-bg); border-radius: 50%;"></div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      ${data.story ? `
      <!-- Our Story -->
      <section style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 700px; text-align: center;">
          <div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1.5rem; opacity: 0.6;">Ã¢â„¢Â¥</div>
          <h2 style="font-family: serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 400; margin-bottom: 3rem;">
            Our Story
          </h2>
          <div style="font-family: serif; font-size: 1.1875rem; line-height: 1.9; color: var(--color-text); font-style: italic; white-space: pre-line;">
            ${data.story}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Additional Information -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 1000px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
            
            ${data.dressCode ? `
            <div style="text-align: center; padding: 2.5rem; border: 1px solid var(--color-border);">
              <div style="font-size: 1.75rem; margin-bottom: 1rem;">Ã°Å¸â€˜â€</div>
              <h3 style="font-family: serif; font-size: 1.125rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); margin-bottom: 1rem;">
                Dress Code
              </h3>
              <div style="font-family: serif; font-size: 1.125rem; color: var(--color-text);">
                ${data.dressCode}
              </div>
            </div>
            ` : ''}
            
            ${data.hotelInfo ? `
            <div style="text-align: center; padding: 2.5rem; border: 1px solid var(--color-border);">
              <div style="font-size: 1.75rem; margin-bottom: 1rem;">Ã°Å¸ÂÂ¨</div>
              <h3 style="font-family: serif; font-size: 1.125rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); margin-bottom: 1rem;">
                Accommodations
              </h3>
              <div style="font-size: 1rem; line-height: 1.7; color: var(--color-text); white-space: pre-line;">
                ${data.hotelInfo}
              </div>
            </div>
            ` : ''}
            
            ${data.registryLink ? `
            <div style="text-align: center; padding: 2.5rem; border: 1px solid var(--color-border);">
              <div style="font-size: 1.75rem; margin-bottom: 1rem;">Ã°Å¸Å½Â</div>
              <h3 style="font-family: serif; font-size: 1.125rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                Registry
              </h3>
              <a href="${data.registryLink}" target="_blank" style="display: inline-block; padding: 0.875rem 2rem; border: 2px solid var(--color-accent); color: var(--color-accent); text-decoration: none; font-family: serif; font-size: 0.9375rem; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s;" onmouseover="this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-accent)'">
                View Registry
              </a>
            </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section style="padding: 6rem 0; background: var(--color-surface); text-align: center;">
        <div class="container" style="max-width: 600px;">
          <div style="font-size: 2.5rem; color: var(--color-accent); margin-bottom: 2rem; opacity: 0.6;">Ã¢ÂÂ¦</div>
          <h2 style="font-family: serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 400; margin-bottom: 2rem; line-height: 1.4;">
            We can't wait to celebrate with you
          </h2>
          ${data.rsvpLink ? `
          <a href="${data.rsvpLink}" target="_blank" style="display: inline-block; padding: 1.25rem 3.5rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-family: serif; font-size: 1rem; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s; margin-top: 2rem;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            RSVP Now
          </a>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 1px solid var(--color-border);">
        <div class="container">
          <p style="font-family: serif; font-style: italic;">#${data.coupleName?.replace(/\s/g, '') || 'Wedding2025'}</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] > div {
            order: 1 !important;
            text-align: center !important;
            grid-column: 1 / -1;
          }
          section > div > div[style*="position: absolute; left: 50%"] {
            display: none;
          }
        }
      </style>
    `
  }),

  'conference': new Template('conference', {
    name: 'Conference',
    description: 'Professional conference or event website',
    category: 'event',
    defaultTheme: 'minimal',
    fields: [
      { name: 'conferenceName', label: 'Conference Name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text', required: true },
      { name: 'date', label: 'Date', type: 'text', placeholder: 'March 15-17, 2025', required: true },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'San Francisco, CA', required: true },
      { name: 'description', label: 'Event Description', type: 'textarea', required: true },
      { name: 'registerLink', label: 'Registration Link', type: 'url', required: true },
      { name: 'speakers', label: 'Speakers (JSON format)', type: 'textarea', placeholder: '[{"name": "Jane Doe", "title": "CEO, Company", "bio": "Brief bio", "imageUrl": "https://..."}]', required: false },
      { name: 'schedule', label: 'Schedule (JSON format)', type: 'textarea', placeholder: '[{"day": "Day 1", "date": "March 15", "sessions": [{"time": "9:00 AM", "title": "Keynote", "speaker": "John Smith"}]}]', required: false },
      { name: 'sponsors', label: 'Sponsors (comma separated)', type: 'text', placeholder: 'Company A, Company B, Company C', required: false },
      { name: 'venue', label: 'Venue Name', type: 'text', required: false },
      { name: 'venueAddress', label: 'Venue Address', type: 'textarea', required: false },
      { name: 'price', label: 'Ticket Price', type: 'text', placeholder: '$299', required: false },
      { name: 'contact', label: 'Contact Email', type: 'email', required: false }
    ],
    structure: (data, theme) => `
      <!-- Header with CTA -->
      <header style="background: var(--color-bg); border-bottom: 3px solid var(--color-accent); position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm);">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-size: 1.75rem; font-weight: 900; letter-spacing: -0.02em;">
                ${data.conferenceName || 'CONFERENCE 2025'}
              </div>
              <div style="padding: 0.375rem 0.875rem; background: var(--color-accent); color: var(--color-bg); font-weight: 700; font-size: 0.75rem; letter-spacing: 0.05em; border-radius: var(--radius-sm);">
                ${data.date || '2025'}
              </div>
            </div>
            <div style="display: flex; gap: 2rem; align-items: center;">
              <nav style="display: flex; gap: 2rem;">
                <a href="#speakers" style="text-decoration: none; color: var(--color-text); font-weight: 600; font-size: 0.9375rem;">Speakers</a>
                <a href="#schedule" style="text-decoration: none; color: var(--color-text); font-weight: 600; font-size: 0.9375rem;">Schedule</a>
                <a href="#venue" style="text-decoration: none; color: var(--color-text); font-weight: 600; font-size: 0.9375rem;">Venue</a>
              </nav>
              ${data.registerLink ? `
              <a href="${data.registerLink}" target="_blank" style="padding: 0.875rem 2rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 0.9375rem; border-radius: var(--radius-sm); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                Register Now
              </a>
              ` : ''}
              <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">
                <span class="theme-icon">Ã°Å¸Å’â„¢</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: 8rem 0 6rem; background: linear-gradient(135deg, var(--color-surface), var(--color-bg)); position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; right: 0; width: 50%; height: 100%; background: var(--color-accent); opacity: 0.03; transform: skewX(-10deg) translateX(30%);"></div>
        <div class="container" style="max-width: 1200px; position: relative;">
          <div style="max-width: 800px;">
            <div style="display: inline-flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: 0.75rem 1.5rem; background: var(--color-bg); border: 2px solid var(--color-accent); border-radius: var(--radius-full);">
              <div style="width: 8px; height: 8px; background: var(--color-accent); border-radius: 50%; animation: pulse 2s infinite;"></div>
              <span style="font-weight: 700; font-size: 0.9375rem; text-transform: uppercase; letter-spacing: 0.05em;">
                ${data.date || 'Coming Soon'} Ã¢â‚¬Â¢ ${data.location || 'Location TBA'}
              </span>
            </div>
            
            <h1 style="font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900; margin-bottom: 2rem; letter-spacing: -0.04em; line-height: 1.05;">
              ${data.conferenceName || 'Conference 2025'}
            </h1>
            
            <p style="font-size: 1.75rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.5; font-weight: 600;">
              ${data.tagline || 'The Future of Innovation'}
            </p>
            
            <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7; max-width: 650px;">
              ${data.description || 'Join industry leaders and innovators for three days of inspiring talks, networking, and hands-on workshops.'}
            </p>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${data.registerLink ? `
              <a href="${data.registerLink}" target="_blank" style="padding: 1.25rem 3rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1.125rem; border-radius: var(--radius-sm); transition: all 0.2s; box-shadow: var(--shadow-md);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
                Register Now ${data.price ? `Ã¢â‚¬Â¢ ${data.price}` : ''}
              </a>
              ` : ''}
              ${data.contact ? `
              <a href="mailto:${data.contact}" style="padding: 1.25rem 3rem; background: var(--color-bg); color: var(--color-text); border: 2px solid var(--color-border); text-decoration: none; font-weight: 700; font-size: 1.125rem; border-radius: var(--radius-sm); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-text)'" onmouseout="this.style.borderColor='var(--color-border)'">
                Contact Us
              </a>
              ` : ''}
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section style="background: var(--color-text); color: var(--color-bg); padding: 3rem 0;">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
            <div>
              <div style="font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem;">3</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9;">Days</div>
            </div>
            <div>
              <div style="font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem;">50+</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9;">Speakers</div>
            </div>
            <div>
              <div style="font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem;">100+</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9;">Sessions</div>
            </div>
            <div>
              <div style="font-size: 3.5rem; font-weight: 900; margin-bottom: 0.5rem;">2000+</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9;">Attendees</div>
            </div>
          </div>
        </div>
      </section>

      ${data.speakers && data.speakers.trim() !== '' && data.speakers !== '[]' ? `
      <!-- Speakers -->
      <section id="speakers" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 5rem;">
            <div style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--color-accent); color: var(--color-bg); font-weight: 700; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; border-radius: var(--radius-full); margin-bottom: 1.5rem;">
              Featured Speakers
            </div>
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.03em;">
              Learn from the Best
            </h2>
            <p style="font-size: 1.25rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto;">
              Industry leaders and innovators sharing their insights
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const speakers = JSON.parse(data.speakers || '[]');
                return speakers.map(speaker => `
                  <div style="background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.3s;" class="speaker-card">
                    ${speaker.imageUrl ? `
                    <div style="aspect-ratio: 1/1; overflow: hidden; background: var(--color-border);">
                      <img src="${speaker.imageUrl}" alt="${speaker.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    ` : `
                    <div style="aspect-ratio: 1/1; background: linear-gradient(135deg, var(--color-accent), var(--color-text)); display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--color-bg); opacity: 0.8;">
                      ${speaker.name?.charAt(0) || '?'}
                    </div>
                    `}
                    <div style="padding: 2rem;">
                      <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.01em;">
                        ${speaker.name || 'Speaker Name'}
                      </h3>
                      <div style="font-size: 0.9375rem; color: var(--color-accent); font-weight: 700; margin-bottom: 1rem;">
                        ${speaker.title || 'Title'}
                      </div>
                      <p style="font-size: 0.9375rem; line-height: 1.6; color: var(--color-text-secondary);">
                        ${speaker.bio || ''}
                      </p>
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      ${data.schedule && data.schedule.trim() !== '' && data.schedule !== '[]' ? `
      <!-- Schedule -->
      <section id="schedule" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <div style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--color-accent); color: var(--color-bg); font-weight: 700; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; border-radius: var(--radius-full); margin-bottom: 1.5rem;">
              Event Schedule
            </div>
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.03em;">
              Three Days of Innovation
            </h2>
          </div>
          
          ${(() => {
            try {
              const schedule = JSON.parse(data.schedule || '[]');
              return schedule.map((day, i) => `
                <div style="margin-bottom: 4rem;">
                  <div style="background: var(--color-accent); color: var(--color-bg); padding: 1.5rem 2rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                    <div style="font-size: 1.75rem; font-weight: 900; margin-bottom: 0.25rem;">
                      ${day.day || `Day ${i + 1}`}
                    </div>
                    <div style="font-size: 1.125rem; opacity: 0.95; font-weight: 600;">
                      ${day.date || ''}
                    </div>
                  </div>
                  
                  <div style="display: grid; gap: 1rem;">
                    ${(day.sessions || []).map(session => `
                      <div style="background: var(--color-bg); border: 2px solid var(--color-border); border-radius: var(--radius-md); padding: 2rem; display: flex; gap: 2rem; align-items: start; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)'">
                        <div style="min-width: 120px;">
                          <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-accent);">
                            ${session.time || ''}
                          </div>
                        </div>
                        <div style="flex: 1;">
                          <h3 style="font-size: 1.375rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.01em;">
                            ${session.title || ''}
                          </h3>
                          ${session.speaker ? `
                          <div style="font-size: 1rem; color: var(--color-text-secondary); font-weight: 600;">
                            ${session.speaker}
                          </div>
                          ` : ''}
                          ${session.description ? `
                          <p style="font-size: 0.9375rem; line-height: 1.6; color: var(--color-text-secondary); margin-top: 1rem;">
                            ${session.description}
                          </p>
                          ` : ''}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('');
            } catch (e) {
              return '';
            }
          })()}
        </div>
      </section>
      ` : ''}

      <!-- Venue -->
      <section id="venue" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div>
              <div style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--color-accent); color: var(--color-bg); font-weight: 700; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; border-radius: var(--radius-full); margin-bottom: 2rem;">
                Venue
              </div>
              <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 2rem; letter-spacing: -0.03em;">
                ${data.venue || data.location || 'Conference Center'}
              </h2>
              ${data.venueAddress ? `
              <div style="font-size: 1.125rem; line-height: 1.8; color: var(--color-text-secondary); margin-bottom: 2rem; white-space: pre-line;">
                ${data.venueAddress}
              </div>
              ` : ''}
              <div style="font-size: 1rem; color: var(--color-text-secondary); line-height: 1.7;">
                ${data.location || ''}
              </div>
            </div>
            <div style="aspect-ratio: 4/3; background: linear-gradient(135deg, var(--color-accent), var(--color-text)); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 5rem; color: var(--color-bg); opacity: 0.8;">
              Ã°Å¸â€œÂ
            </div>
          </div>
        </div>
      </section>

      ${data.sponsors ? `
      <!-- Sponsors -->
      <section style="padding: 6rem 0; background: var(--color-surface); text-align: center;">
        <div class="container">
          <h2 style="font-size: 1.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 3rem; color: var(--color-text-secondary);">
            Our Sponsors
          </h2>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem; align-items: center;">
            ${data.sponsors.split(',').map(sponsor => `
              <div style="font-size: 1.75rem; font-weight: 900; color: var(--color-text); opacity: 0.6; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">
                ${sponsor.trim()}
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Final CTA -->
      <section style="padding: 8rem 0; background: var(--color-accent); color: var(--color-bg); text-align: center;">
        <div class="container" style="max-width: 800px;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; margin-bottom: 2rem; letter-spacing: -0.03em; line-height: 1.1;">
            Don't Miss Out
          </h2>
          <p style="font-size: 1.375rem; margin-bottom: 3rem; opacity: 0.95; line-height: 1.6;">
            Join us for ${data.conferenceName || 'the conference'} and connect with industry leaders
          </p>
          ${data.registerLink ? `
          <a href="${data.registerLink}" target="_blank" style="display: inline-block; padding: 1.5rem 4rem; background: var(--color-bg); color: var(--color-accent); text-decoration: none; font-weight: 900; font-size: 1.25rem; border-radius: var(--radius-sm); transition: all 0.2s; box-shadow: 0 8px 24px rgba(0,0,0,0.2);" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)'">
            Register Today ${data.price ? `Ã¢â‚¬Â¢ ${data.price}` : ''}
          </a>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 3px solid var(--color-border);">
        <div class="container">
          <p style="font-weight: 700;">Ã‚Â© 2024 ${data.conferenceName || 'Conference'}. ${data.contact ? `Contact: ${data.contact}` : ''}</p>
        </div>
      </footer>

      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .speaker-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-accent);
          box-shadow: var(--shadow-lg);
        }
        
        @media (max-width: 968px) {
          header nav { display: none !important; }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      </style>
    `
  }),
    tutoring: new Template('tutoring', {
    name: 'Tutoring Services',
    description: 'Professional tutoring and education services website',
    category: 'Business',
    defaultTheme: 'elegant',
    fields: [
      { id: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Elite Tutoring Services', required: true },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Empowering Students to Achieve Excellence' },
      { id: 'about', label: 'About', type: 'textarea', placeholder: 'Tell students and parents about your tutoring approach and philosophy...' },
      { id: 'subjects', label: 'Subjects Offered', type: 'textarea', placeholder: 'Enter subjects as JSON array: [{"name": "Mathematics", "grades": "K-12", "description": "Algebra, Calculus, Geometry"}, ...]' },
      { id: 'qualifications', label: 'Qualifications', type: 'textarea', placeholder: 'Your credentials, degrees, certifications...' },
      { id: 'testimonials', label: 'Testimonials', type: 'textarea', placeholder: 'Enter testimonials as JSON: [{"name": "Parent Name", "student": "Student Name", "text": "...", "rating": 5}, ...]' },
      { id: 'pricing', label: 'Pricing Info', type: 'textarea', placeholder: 'Starting at $50/hour â€¢ Package deals available' },
      { id: 'contact', label: 'Contact Email', type: 'email', placeholder: 'hello@tutoring.com' },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
      { id: 'bookingLink', label: 'Booking Link', type: 'url', placeholder: 'https://calendly.com/yourlink' },
    ],
    structure: (data, theme) => `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: var(--color-bg); border-bottom: 2px solid var(--color-border); backdrop-filter: blur(10px);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; padding-bottom: 1.5rem;">
          <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-accent);">
            ðŸ“š ${data.businessName || 'Tutoring Services'}
          </div>
          <nav style="display: flex; gap: 2rem; align-items: center; font-weight: 600;">
            <a href="#subjects" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Subjects</a>
            <a href="#about" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">About</a>
            <a href="#testimonials" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Reviews</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-icon">ðŸŒ™</span>
            </button>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: 8rem 0 6rem; background: linear-gradient(135deg, var(--color-surface), var(--color-bg));">
        <div class="container" style="text-align: center; max-width: 900px;">
          <div style="font-size: 5rem; margin-bottom: 2rem;">ðŸŽ“</div>
          <h1 style="font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -0.02em; line-height: 1.1;">
            ${data.businessName || 'Professional Tutoring Services'}
          </h1>
          <p style="font-size: 1.5rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.5;">
            ${data.tagline || 'Personalized Learning for Academic Excellence'}
          </p>
          ${data.bookingLink ? `
          <a href="${data.bookingLink}" target="_blank" style="display: inline-block; padding: 1.25rem 3rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1.125rem; border-radius: var(--radius-md); transition: all 0.2s; box-shadow: var(--shadow-md);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
            Book a Session
          </a>
          ` : ''}
          ${data.pricing ? `
          <div style="margin-top: 2rem; font-size: 1.125rem; color: var(--color-text-secondary);">
            ${data.pricing}
          </div>
          ` : ''}
        </div>
      </section>

      ${data.subjects && data.subjects.trim() !== '' && data.subjects !== '[]' ? `
      <!-- Subjects -->
      <section id="subjects" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin-bottom: 1rem;">
              Subjects We Teach
            </h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">
              Expert instruction across multiple subjects and grade levels
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const subjects = JSON.parse(data.subjects || '[]');
                return subjects.map(subject => `
                  <div style="background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                    <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--color-accent);">
                      ${subject.name || 'Subject'}
                    </h3>
                    ${subject.grades ? `
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 600; margin-bottom: 1rem;">
                      Grades: ${subject.grades}
                    </div>
                    ` : ''}
                    ${subject.description ? `
                    <p style="color: var(--color-text-secondary); line-height: 1.6;">
                      ${subject.description}
                    </p>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '<p style="text-align: center; color: var(--color-text-secondary);">Subjects information will appear here</p>';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- About -->
      <section id="about" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 900px;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin-bottom: 1rem;">
              About Our Tutoring
            </h2>
          </div>
          
          ${data.about ? `
          <div style="font-size: 1.125rem; line-height: 1.8; color: var(--color-text); margin-bottom: 3rem; white-space: pre-line;">
            ${data.about}
          </div>
          ` : ''}
          
          ${data.qualifications ? `
          <div style="background: var(--color-bg); border-left: 4px solid var(--color-accent); border-radius: var(--radius-md); padding: 2rem;">
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; color: var(--color-accent);">
              Qualifications & Experience
            </h3>
            <div style="color: var(--color-text-secondary); line-height: 1.8; white-space: pre-line;">
              ${data.qualifications}
            </div>
          </div>
          ` : ''}
        </div>
      </section>

      ${data.testimonials && data.testimonials.trim() !== '' && data.testimonials !== '[]' ? `
      <!-- Testimonials -->
      <section id="testimonials" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin-bottom: 1rem;">
              What Parents & Students Say
            </h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const testimonials = JSON.parse(data.testimonials || '[]');
                return testimonials.map(testimonial => `
                  <div style="background: var(--color-surface); border: 2px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem;">
                    ${testimonial.rating ? `
                    <div style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-accent);">
                      ${'â­'.repeat(testimonial.rating)}
                    </div>
                    ` : ''}
                    <p style="font-size: 1rem; line-height: 1.6; color: var(--color-text); margin-bottom: 1.5rem; font-style: italic;">
                      "${testimonial.text || ''}"
                    </p>
                    <div style="font-weight: 700; color: var(--color-text);">
                      ${testimonial.name || 'Parent'}
                    </div>
                    ${testimonial.student ? `
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
                      Parent of ${testimonial.student}
                    </div>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact -->
      <section id="contact" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container" style="max-width: 700px; text-align: center;">
          <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; margin-bottom: 1rem;">
            Ready to Get Started?
          </h2>
          <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem;">
            Contact us today to schedule your first tutoring session
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; margin-bottom: 3rem;">
            ${data.contact ? `
            <a href="mailto:${data.contact}" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">âœ‰ï¸</span>
              ${data.contact}
            </a>
            ` : ''}
            ${data.phone ? `
            <a href="tel:${data.phone}" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">ðŸ“ž</span>
              ${data.phone}
            </a>
            ` : ''}
          </div>
          
          ${data.bookingLink ? `
          <a href="${data.bookingLink}" target="_blank" style="display: inline-block; padding: 1.25rem 3rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1.125rem; border-radius: var(--radius-md); transition: all 0.2s; box-shadow: var(--shadow-md);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
            Schedule a Free Consultation
          </a>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 2px solid var(--color-border);">
        <div class="container">
          <p>Â© 2024 ${data.businessName || 'Tutoring Services'}. All rights reserved.</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          header nav { display: none !important; }
        }
      </style>
    `
  }),

  realestate: new Template('realestate', {
    name: 'Real Estate Agent',
    description: 'Professional real estate agent and property listings website',
    category: 'Business',
    defaultTheme: 'glassmorphism',
    fields: [
      { id: 'agentName', label: 'Agent Name', type: 'text', placeholder: 'Sarah Mitchell', required: true },
      { id: 'title', label: 'Professional Title', type: 'text', placeholder: 'Luxury Real Estate Specialist' },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Finding Your Dream Home in [City]' },
      { id: 'bio', label: 'About', type: 'textarea', placeholder: 'Share your experience, market expertise, and what makes you unique...' },
      { id: 'serviceArea', label: 'Service Area', type: 'text', placeholder: 'Greater Los Angeles Area' },
      { id: 'featuredListings', label: 'Featured Properties', type: 'textarea', placeholder: 'Enter properties as JSON: [{"address": "123 Oak St", "price": "$1,250,000", "beds": 4, "baths": 3, "sqft": "2,800", "type": "Single Family", "status": "For Sale", "image": "ðŸ¡"}, ...]' },
      { id: 'services', label: 'Services', type: 'textarea', placeholder: 'Enter services as JSON: [{"name": "Buyer Representation", "icon": "ðŸ”", "description": "..."}, ...]' },
      { id: 'testimonials', label: 'Client Testimonials', type: 'textarea', placeholder: 'Enter testimonials as JSON: [{"name": "John & Mary Smith", "text": "Sarah helped us find our dream home!", "property": "Bought 2BR Condo", "rating": 5}, ...]' },
      { id: 'stats', label: 'Statistics', type: 'textarea', placeholder: 'Enter stats as JSON: [{"number": "150+", "label": "Homes Sold"}, {"number": "$50M+", "label": "Sales Volume"}, ...]' },
      { id: 'license', label: 'License Number', type: 'text', placeholder: 'DRE #01234567' },
      { id: 'brokerage', label: 'Brokerage', type: 'text', placeholder: 'Luxury Realty Group' },
      { id: 'contact', label: 'Email', type: 'email', placeholder: 'sarah@luxuryrealty.com' },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
      { id: 'calendlyLink', label: 'Consultation Link', type: 'url', placeholder: 'https://calendly.com/yourlink' },
    ],
    structure: (data, theme) => `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: rgba(var(--color-bg-rgb, 255, 255, 255), 0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; padding-bottom: 1.25rem;">
          <div>
            <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-accent); letter-spacing: -0.02em;">
              ${data.agentName || 'Real Estate Agent'}
            </div>
            ${data.brokerage ? `
            <div style="font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 600; margin-top: 0.25rem;">
              ${data.brokerage}
            </div>
            ` : ''}
          </div>
          <nav style="display: flex; gap: 2rem; align-items: center; font-weight: 600; font-size: 0.9375rem;">
            <a href="#listings" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Listings</a>
            <a href="#services" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Services</a>
            <a href="#testimonials" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Testimonials</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-icon">ðŸŒ™</span>
            </button>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: 8rem 0 6rem; background: linear-gradient(135deg, var(--color-surface), var(--color-bg)); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; opacity: 0.03; background-image: radial-gradient(circle, var(--color-text) 1px, transparent 1px); background-size: 30px 30px;"></div>
        <div class="container" style="position: relative; z-index: 1;">
          <div style="max-width: 800px;">
            ${data.title ? `
            <div style="display: inline-block; padding: 0.5rem 1rem; background: var(--color-accent); color: var(--color-bg); font-weight: 700; font-size: 0.875rem; border-radius: var(--radius-full); margin-bottom: 1.5rem;">
              ${data.title}
            </div>
            ` : ''}
            <h1 style="font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -0.03em; line-height: 1.1;">
              ${data.agentName || 'Your Real Estate Expert'}
            </h1>
            <p style="font-size: 1.5rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.4;">
              ${data.tagline || 'Helping You Find the Perfect Property'}
            </p>
            ${data.serviceArea ? `
            <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem;">
              <span style="font-size: 1.5rem;">ðŸ“</span>
              <span style="font-weight: 600;">Serving ${data.serviceArea}</span>
            </div>
            ` : ''}
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${data.calendlyLink ? `
              <a href="${data.calendlyLink}" target="_blank" style="display: inline-block; padding: 1.25rem 2.5rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1.0625rem; border-radius: var(--radius-md); transition: all 0.2s; box-shadow: var(--shadow-md);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
                Schedule Consultation
              </a>
              ` : ''}
              ${data.phone ? `
              <a href="tel:${data.phone}" style="display: inline-block; padding: 1.25rem 2.5rem; background: var(--color-surface); color: var(--color-text); text-decoration: none; font-weight: 700; font-size: 1.0625rem; border-radius: var(--radius-md); border: 2px solid var(--color-border); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                ðŸ“ž ${data.phone}
              </a>
              ` : ''}
            </div>
          </div>
        </div>
      </section>

      ${data.stats && data.stats.trim() !== '' && data.stats !== '[]' ? `
      <!-- Stats -->
      <section style="padding: 4rem 0; background: var(--color-accent); color: var(--color-bg);">
        <div class="container">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
            ${(() => {
              try {
                const stats = JSON.parse(data.stats || '[]');
                return stats.map(stat => `
                  <div>
                    <div style="font-size: 3rem; font-weight: 900; margin-bottom: 0.5rem; opacity: 0.95;">
                      ${stat.number || '0'}
                    </div>
                    <div style="font-size: 1rem; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                      ${stat.label || ''}
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      ${data.featuredListings && data.featuredListings.trim() !== '' && data.featuredListings !== '[]' ? `
      <!-- Featured Listings -->
      <section id="listings" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Featured Properties
            </h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">
              Explore my current listings and recent sales
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const listings = JSON.parse(data.featuredListings || '[]');
                return listings.map(property => `
                  <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.3s; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'">
                    <div style="aspect-ratio: 4/3; background: linear-gradient(135deg, var(--color-accent), var(--color-text)); display: flex; align-items: center; justify-content: center; font-size: 5rem; position: relative;">
                      ${property.image || 'ðŸ '}
                      ${property.status ? `
                      <div style="position: absolute; top: 1rem; right: 1rem; background: ${property.status.toLowerCase().includes('sold') ? '#22c55e' : 'var(--color-accent)'}; color: white; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 800; border-radius: var(--radius-sm); text-transform: uppercase; letter-spacing: 0.05em;">
                        ${property.status}
                      </div>
                      ` : ''}
                    </div>
                    <div style="padding: 1.5rem;">
                      ${property.price ? `
                      <div style="font-size: 1.75rem; font-weight: 900; color: var(--color-accent); margin-bottom: 0.75rem;">
                        ${property.price}
                      </div>
                      ` : ''}
                      ${property.address ? `
                      <div style="font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-text);">
                        ${property.address}
                      </div>
                      ` : ''}
                      ${property.type ? `
                      <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 600; margin-bottom: 1rem;">
                        ${property.type}
                      </div>
                      ` : ''}
                      <div style="display: flex; gap: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-border); font-size: 0.9375rem; color: var(--color-text-secondary); font-weight: 600;">
                        ${property.beds ? `<span>ðŸ›ï¸ ${property.beds} beds</span>` : ''}
                        ${property.baths ? `<span>ðŸš¿ ${property.baths} baths</span>` : ''}
                        ${property.sqft ? `<span>ðŸ“ ${property.sqft} sqft</span>` : ''}
                      </div>
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      ${data.services && data.services.trim() !== '' && data.services !== '[]' ? `
      <!-- Services -->
      <section id="services" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em;">
              How I Can Help
            </h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
            ${(() => {
              try {
                const services = JSON.parse(data.services || '[]');
                return services.map(service => `
                  <div style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem; text-align: center; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${service.icon || 'ðŸ¡'}</div>
                    <h3 style="font-size: 1.375rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.01em;">
                      ${service.name || 'Service'}
                    </h3>
                    ${service.description ? `
                    <p style="color: var(--color-text-secondary); line-height: 1.6;">
                      ${service.description}
                    </p>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- About -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 900px;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: -0.02em;">
              About Me
            </h2>
          </div>
          
          ${data.bio ? `
          <div style="font-size: 1.125rem; line-height: 1.8; color: var(--color-text); margin-bottom: 2rem; white-space: pre-line;">
            ${data.bio}
          </div>
          ` : ''}
          
          ${data.license || data.brokerage ? `
          <div style="display: flex; gap: 2rem; justify-content: center; padding: 1.5rem; background: var(--color-surface); border-radius: var(--radius-md); font-size: 0.9375rem; color: var(--color-text-secondary); font-weight: 600; flex-wrap: wrap;">
            ${data.license ? `<span>ðŸ“„ ${data.license}</span>` : ''}
            ${data.brokerage ? `<span>ðŸ¢ ${data.brokerage}</span>` : ''}
          </div>
          ` : ''}
        </div>
      </section>

      ${data.testimonials && data.testimonials.trim() !== '' && data.testimonials !== '[]' ? `
      <!-- Testimonials -->
      <section id="testimonials" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Client Success Stories
            </h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const testimonials = JSON.parse(data.testimonials || '[]');
                return testimonials.map(testimonial => `
                  <div style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem;">
                    ${testimonial.rating ? `
                    <div style="font-size: 1.25rem; margin-bottom: 1rem; color: #fbbf24;">
                      ${'â­'.repeat(testimonial.rating)}
                    </div>
                    ` : ''}
                    <p style="font-size: 1.0625rem; line-height: 1.7; color: var(--color-text); margin-bottom: 1.5rem; font-style: italic;">
                      "${testimonial.text || ''}"
                    </p>
                    <div style="border-top: 1px solid var(--color-border); padding-top: 1rem;">
                      <div style="font-weight: 700; color: var(--color-text);">
                        ${testimonial.name || 'Client'}
                      </div>
                      ${testimonial.property ? `
                      <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem;">
                        ${testimonial.property}
                      </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact -->
      <section id="contact" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 700px; text-align: center;">
          <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; letter-spacing: -0.02em;">
            Let's Find Your Dream Home
          </h2>
          <p style="font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.6;">
            Ready to buy or sell? Get in touch for a free consultation
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center; margin-bottom: 2.5rem;">
            ${data.contact ? `
            <a href="mailto:${data.contact}" style="display: flex; align-items: center; gap: 1rem; font-size: 1.0625rem; color: var(--color-text); text-decoration: none; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">âœ‰ï¸</span>
              ${data.contact}
            </a>
            ` : ''}
            ${data.phone ? `
            <a href="tel:${data.phone}" style="display: flex; align-items: center; gap: 1rem; font-size: 1.0625rem; color: var(--color-text); text-decoration: none; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">ðŸ“ž</span>
              ${data.phone}
            </a>
            ` : ''}
          </div>
          
          ${data.calendlyLink ? `
          <a href="${data.calendlyLink}" target="_blank" style="display: inline-block; padding: 1.25rem 2.5rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1.0625rem; border-radius: var(--radius-md); transition: all 0.2s; box-shadow: var(--shadow-md);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'">
            Schedule Free Consultation
          </a>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2rem 0; background: var(--color-surface); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 1px solid var(--color-border);">
        <div class="container">
          <p>Â© 2024 ${data.agentName || 'Real Estate Agent'}. ${data.license ? data.license : ''}</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          header nav { display: none !important; }
        }
      </style>
    `
  }),

  financialadvisor: new Template('financialadvisor', {
    name: 'Financial Advisor',
    description: 'Professional financial planning and wealth management website',
    category: 'Business',
    defaultTheme: 'elegant',
    fields: [
      { id: 'advisorName', label: 'Advisor Name', type: 'text', placeholder: 'Michael Chen, CFPÂ®', required: true },
      { id: 'firmName', label: 'Firm Name', type: 'text', placeholder: 'Horizon Wealth Management' },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Building Your Financial Future with Confidence' },
      { id: 'bio', label: 'About', type: 'textarea', placeholder: 'Share your background, philosophy, and approach to financial planning...' },
      { id: 'specializations', label: 'Specializations', type: 'textarea', placeholder: 'Enter specializations as JSON: [{"name": "Retirement Planning", "icon": "ðŸ–ï¸", "description": "..."}, ...]' },
      { id: 'services', label: 'Services Offered', type: 'textarea', placeholder: 'Enter services as JSON: [{"name": "Wealth Management", "description": "...", "features": ["Feature 1", "Feature 2"]}, ...]' },
      { id: 'process', label: 'Planning Process', type: 'textarea', placeholder: 'Enter process steps as JSON: [{"step": "1", "title": "Discovery", "description": "..."}, ...]' },
      { id: 'credentials', label: 'Credentials & Certifications', type: 'textarea', placeholder: 'CFPÂ®, CFA, MBA, 15+ years experience...' },
      { id: 'testimonials', label: 'Client Testimonials', type: 'textarea', placeholder: 'Enter testimonials as JSON: [{"name": "Robert & Linda K.", "text": "...", "title": "Retired Executives"}, ...]' },
      { id: 'disclosure', label: 'Disclosure', type: 'text', placeholder: 'Securities offered through XYZ Financial, Member FINRA/SIPC' },
      { id: 'contact', label: 'Email', type: 'email', placeholder: 'michael@horizonwealth.com' },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
      { id: 'address', label: 'Office Address', type: 'textarea', placeholder: '123 Financial Plaza, Suite 500\nNew York, NY 10001' },
      { id: 'calendlyLink', label: 'Consultation Link', type: 'url', placeholder: 'https://calendly.com/yourlink' },
    ],
    structure: (data, theme) => `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: var(--color-bg); border-bottom: 1px solid var(--color-border); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.25rem; padding-bottom: 1.25rem;">
          <div>
            <div style="font-size: 1.375rem; font-weight: 900; color: var(--color-text); letter-spacing: -0.01em;">
              ${data.advisorName || 'Financial Advisor'}
            </div>
            ${data.firmName ? `
            <div style="font-size: 0.8125rem; color: var(--color-text-secondary); font-weight: 600; margin-top: 0.25rem;">
              ${data.firmName}
            </div>
            ` : ''}
          </div>
          <nav style="display: flex; gap: 2rem; align-items: center; font-weight: 600; font-size: 0.9375rem;">
            <a href="#services" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Services</a>
            <a href="#process" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Process</a>
            <a href="#about" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">About</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-icon">ðŸŒ™</span>
            </button>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: 7rem 0 6rem; background: var(--color-bg); border-bottom: 1px solid var(--color-border);">
        <div class="container">
          <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.625rem 1.25rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); margin-bottom: 2rem; font-size: 0.9375rem; font-weight: 600; color: var(--color-text-secondary);">
              <span style="font-size: 1.25rem;">ðŸ“Š</span>
              Professional Financial Planning
            </div>
            <h1 style="font-size: clamp(2.75rem, 6vw, 4.5rem); font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.03em; line-height: 1.1; color: var(--color-text);">
              ${data.tagline || 'Strategic Financial Planning for Your Future'}
            </h1>
            <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.6; font-weight: 500;">
              ${data.firmName ? `${data.firmName} â€¢ ` : ''}Personalized wealth management strategies tailored to your goals
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              ${data.calendlyLink ? `
              <a href="${data.calendlyLink}" target="_blank" style="display: inline-block; padding: 1.125rem 2.5rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1rem; border-radius: var(--radius-md); transition: all 0.2s; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'">
                Schedule Consultation
              </a>
              ` : ''}
              ${data.phone ? `
              <a href="tel:${data.phone}" style="display: inline-block; padding: 1.125rem 2.5rem; background: var(--color-bg); color: var(--color-text); text-decoration: none; font-weight: 700; font-size: 1rem; border-radius: var(--radius-md); border: 2px solid var(--color-border); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-text)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                ${data.phone}
              </a>
              ` : ''}
            </div>
          </div>
        </div>
      </section>

      ${data.specializations && data.specializations.trim() !== '' && data.specializations !== '[]' ? `
      <!-- Specializations -->
      <section style="padding: 5rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Areas of Expertise
            </h2>
            <p style="font-size: 1.0625rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto;">
              Comprehensive financial solutions across multiple areas
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const specializations = JSON.parse(data.specializations || '[]');
                return specializations.map(spec => `
                  <div style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">${spec.icon || 'ðŸ’¼'}</div>
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; letter-spacing: -0.01em;">
                      ${spec.name || 'Specialization'}
                    </h3>
                    ${spec.description ? `
                    <p style="color: var(--color-text-secondary); line-height: 1.6; font-size: 0.9375rem;">
                      ${spec.description}
                    </p>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      ${data.services && data.services.trim() !== '' && data.services !== '[]' ? `
      <!-- Services -->
      <section id="services" style="padding: 5rem 0; background: var(--color-bg);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Comprehensive Services
            </h2>
          </div>
          
          <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
            ${(() => {
              try {
                const services = JSON.parse(data.services || '[]');
                return services.map((service, i) => `
                  <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.5rem; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.boxShadow='none'">
                    <div style="display: flex; align-items: start; gap: 1.5rem;">
                      <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: var(--color-accent); color: var(--color-bg); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.25rem;">
                        ${i + 1}
                      </div>
                      <div style="flex: 1;">
                        <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.01em;">
                          ${service.name || 'Service'}
                        </h3>
                        ${service.description ? `
                        <p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
                          ${service.description}
                        </p>
                        ` : ''}
                        ${service.features && service.features.length > 0 ? `
                        <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
                          ${service.features.map(feature => `
                            <li style="display: flex; align-items: center; gap: 0.5rem; color: var(--color-text); font-size: 0.9375rem;">
                              <span style="color: var(--color-accent); font-weight: 900;">âœ“</span>
                              <span>${feature}</span>
                            </li>
                          `).join('')}
                        </ul>
                        ` : ''}
                      </div>
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      ${data.process && data.process.trim() !== '' && data.process !== '[]' ? `
      <!-- Process -->
      <section id="process" style="padding: 5rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
              My Planning Process
            </h2>
            <p style="font-size: 1.0625rem; color: var(--color-text-secondary); max-width: 650px; margin: 0 auto;">
              A systematic approach to building your financial future
            </p>
          </div>
          
          <div style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
            ${(() => {
              try {
                const process = JSON.parse(data.process || '[]');
                return process.map((step, i) => `
                  <div style="display: flex; gap: 2rem; align-items: start;">
                    <div style="flex-shrink: 0; width: 4rem; height: 4rem; background: var(--color-accent); color: var(--color-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; position: relative;">
                      ${step.step || i + 1}
                      ${i < process.length - 1 ? `
                      <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 2px; height: 2rem; background: var(--color-border);"></div>
                      ` : ''}
                    </div>
                    <div style="flex: 1; padding-top: 0.5rem;">
                      <h3 style="font-size: 1.375rem; font-weight: 700; margin-bottom: 0.75rem; letter-spacing: -0.01em;">
                        ${step.title || 'Step'}
                      </h3>
                      ${step.description ? `
                      <p style="color: var(--color-text-secondary); line-height: 1.7;">
                        ${step.description}
                      </p>
                      ` : ''}
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- About -->
      <section id="about" style="padding: 5rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 900px;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.02em;">
              About ${data.advisorName ? data.advisorName.split(',')[0] : 'Me'}
            </h2>
          </div>
          
          ${data.bio ? `
          <div style="font-size: 1.0625rem; line-height: 1.8; color: var(--color-text); margin-bottom: 2.5rem; white-space: pre-line;">
            ${data.bio}
          </div>
          ` : ''}
          
          ${data.credentials ? `
          <div style="background: var(--color-surface); border-left: 4px solid var(--color-accent); border-radius: var(--radius-md); padding: 2rem; margin-top: 2.5rem;">
            <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.875rem;">
              Credentials & Experience
            </h3>
            <div style="color: var(--color-text); line-height: 1.8; white-space: pre-line;">
              ${data.credentials}
            </div>
          </div>
          ` : ''}
        </div>
      </section>

      ${data.testimonials && data.testimonials.trim() !== '' && data.testimonials !== '[]' ? `
      <!-- Testimonials -->
      <section style="padding: 5rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Client Testimonials
            </h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
            ${(() => {
              try {
                const testimonials = JSON.parse(data.testimonials || '[]');
                return testimonials.map(testimonial => `
                  <div style="background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2rem;">
                    <div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1rem; line-height: 1;">"</div>
                    <p style="font-size: 1rem; line-height: 1.7; color: var(--color-text); margin-bottom: 1.5rem; font-style: italic;">
                      ${testimonial.text || ''}
                    </p>
                    <div style="border-top: 1px solid var(--color-border); padding-top: 1rem;">
                      <div style="font-weight: 700; color: var(--color-text); margin-bottom: 0.25rem;">
                        ${testimonial.name || 'Client'}
                      </div>
                      ${testimonial.title ? `
                      <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
                        ${testimonial.title}
                      </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact -->
      <section id="contact" style="padding: 5rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 700px;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Start Your Financial Journey
            </h2>
            <p style="font-size: 1.0625rem; color: var(--color-text-secondary); line-height: 1.6;">
              Schedule a complimentary consultation to discuss your financial goals
            </p>
          </div>
          
          <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 2.5rem; margin-bottom: 2rem;">
            <div style="display: grid; gap: 1.5rem;">
              ${data.phone ? `
              <a href="tel:${data.phone}" style="display: flex; align-items: center; gap: 1rem; color: var(--color-text); text-decoration: none; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
                <span style="font-size: 1.5rem;">ðŸ“ž</span>
                <span>${data.phone}</span>
              </a>
              ` : ''}
              ${data.contact ? `
              <a href="mailto:${data.contact}" style="display: flex; align-items: center; gap: 1rem; color: var(--color-text); text-decoration: none; font-weight: 600; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
                <span style="font-size: 1.5rem;">âœ‰ï¸</span>
                <span>${data.contact}</span>
              </a>
              ` : ''}
              ${data.address ? `
              <div style="display: flex; align-items: start; gap: 1rem; color: var(--color-text-secondary);">
                <span style="font-size: 1.5rem;">ðŸ“</span>
                <span style="line-height: 1.6; white-space: pre-line;">${data.address}</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          ${data.calendlyLink ? `
          <div style="text-align: center;">
            <a href="${data.calendlyLink}" target="_blank" style="display: inline-block; padding: 1.125rem 2.5rem; background: var(--color-accent); color: var(--color-bg); text-decoration: none; font-weight: 700; font-size: 1rem; border-radius: var(--radius-md); transition: all 0.2s; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'">
              Schedule Free Consultation
            </a>
          </div>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2.5rem 0; background: var(--color-surface); text-align: center; color: var(--color-text-secondary); font-size: 0.8125rem; border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 900px;">
          <p style="margin-bottom: 0.75rem; font-weight: 600;">Â© 2024 ${data.advisorName || 'Financial Advisor'}${data.firmName ? ` â€¢ ${data.firmName}` : ''}</p>
          ${data.disclosure ? `
          <p style="line-height: 1.6; opacity: 0.8;">${data.disclosure}</p>
          ` : ''}
          <p style="margin-top: 1rem; opacity: 0.7; font-size: 0.75rem;">
            Investment advisory services offered through a registered investment advisor. Past performance does not guarantee future results.
          </p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          header nav { display: none !important; }
        }
      </style>
    `
  }),

  fitness: new Template('fitness', {
    name: 'Fitness Trainer',
    description: 'Personal training and fitness coaching website',
    category: 'Business',
    defaultTheme: 'brutalist',
    fields: [
      { id: 'trainerName', label: 'Trainer Name', type: 'text', placeholder: 'Alex Johnson', required: true },
      { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'Transform Your Body, Transform Your Life' },
      { id: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Share your fitness journey, certifications, and training philosophy...' },
      { id: 'specialties', label: 'Specialties', type: 'textarea', placeholder: 'Enter specialties as JSON array: [{"name": "Strength Training", "icon": "ðŸ’ª", "description": "Build muscle and power"}, ...]' },
      { id: 'programs', label: 'Training Programs', type: 'textarea', placeholder: 'Enter programs as JSON: [{"name": "1-on-1 Training", "duration": "60 min", "price": "$80/session", "description": "..."}, ...]' },
      { id: 'transformations', label: 'Client Transformations', type: 'textarea', placeholder: 'Enter success stories as JSON: [{"name": "John D.", "result": "Lost 30 lbs", "time": "3 months", "testimonial": "..."}, ...]' },
      { id: 'certifications', label: 'Certifications', type: 'textarea', placeholder: 'NASM CPT, ACE, CrossFit Level 1, etc.' },
      { id: 'contact', label: 'Contact Email', type: 'email', placeholder: 'trainer@fitness.com' },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
      { id: 'instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/yourhandle' },
      { id: 'bookingLink', label: 'Booking Link', type: 'url', placeholder: 'https://calendly.com/yourlink' },
    ],
    structure: (data, theme) => `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: var(--color-bg); border-bottom: 3px solid var(--color-accent); backdrop-filter: blur(10px);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; padding-bottom: 1.5rem;">
          <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
            ðŸ’ª ${data.trainerName || 'Fitness Coach'}
          </div>
          <nav style="display: flex; gap: 2rem; align-items: center; font-weight: 700; text-transform: uppercase; font-size: 0.875rem;">
            <a href="#programs" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Programs</a>
            <a href="#about" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">About</a>
            <a href="#results" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Results</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <button class="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-icon">ðŸŒ™</span>
            </button>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: 10rem 0 8rem; background: linear-gradient(135deg, var(--color-accent), var(--color-text)); color: var(--color-bg); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px);"></div>
        <div class="container" style="text-align: center; position: relative; z-index: 1;">
          <div style="font-size: 6rem; margin-bottom: 2rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">ðŸ‹ï¸</div>
          <h1 style="font-size: clamp(3rem, 8vw, 5.5rem); font-weight: 900; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1;">
            ${data.trainerName || 'Elite Personal Training'}
          </h1>
          <p style="font-size: 1.75rem; margin-bottom: 3rem; font-weight: 700; opacity: 0.95; text-transform: uppercase; letter-spacing: 0.05em;">
            ${data.tagline || 'Transform Your Body. Transform Your Life.'}
          </p>
          ${data.bookingLink ? `
          <a href="${data.bookingLink}" target="_blank" style="display: inline-block; padding: 1.5rem 3.5rem; background: var(--color-bg); color: var(--color-accent); text-decoration: none; font-weight: 900; font-size: 1.25rem; border-radius: var(--radius-sm); transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 8px 24px rgba(0,0,0,0.3);" onmouseover="this.style.transform='translateY(-4px) scale(1.02)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.4)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)'">
            Start Your Transformation
          </a>
          ` : ''}
        </div>
      </section>

      ${data.specialties && data.specialties.trim() !== '' && data.specialties !== '[]' ? `
      <!-- Specialties -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; text-transform: uppercase;">
              My Specialties
            </h2>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const specialties = JSON.parse(data.specialties || '[]');
                return specialties.map(specialty => `
                  <div style="background: var(--color-surface); border: 3px solid var(--color-border); padding: 2.5rem; text-align: center; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-6px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${specialty.icon || 'âš¡'}</div>
                    <h3 style="font-size: 1.375rem; font-weight: 900; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                      ${specialty.name || 'Specialty'}
                    </h3>
                    ${specialty.description ? `
                    <p style="color: var(--color-text-secondary); line-height: 1.6;">
                      ${specialty.description}
                    </p>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      ${data.programs && data.programs.trim() !== '' && data.programs !== '[]' ? `
      <!-- Programs -->
      <section id="programs" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; text-transform: uppercase;">
              Training Programs
            </h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary); font-weight: 600;">
              Customized programs designed for your goals
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
            ${(() => {
              try {
                const programs = JSON.parse(data.programs || '[]');
                return programs.map((program, i) => `
                  <div style="background: var(--color-bg); border: 3px solid ${i === 1 ? 'var(--color-accent)' : 'var(--color-border)'}; padding: 2.5rem; position: relative; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='${i === 1 ? 'var(--color-accent)' : 'var(--color-border)'}'; this.style.transform='translateY(0)'">
                    ${i === 1 ? '<div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--color-accent); color: var(--color-bg); padding: 0.5rem 1.5rem; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;">Most Popular</div>' : ''}
                    <h3 style="font-size: 1.75rem; font-weight: 900; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                      ${program.name || 'Program'}
                    </h3>
                    ${program.duration ? `
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 700; margin-bottom: 1rem; text-transform: uppercase;">
                      ${program.duration}
                    </div>
                    ` : ''}
                    ${program.price ? `
                    <div style="font-size: 2.5rem; font-weight: 900; color: var(--color-accent); margin-bottom: 1.5rem;">
                      ${program.price}
                    </div>
                    ` : ''}
                    ${program.description ? `
                    <p style="color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 2rem;">
                      ${program.description}
                    </p>
                    ` : ''}
                    ${program.features ? `
                    <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                      ${program.features.split('\n').map(feature => `
                        <li style="padding: 0.5rem 0; color: var(--color-text); display: flex; align-items: start; gap: 0.75rem;">
                          <span style="color: var(--color-accent); font-weight: 900; font-size: 1.125rem;">âœ“</span>
                          <span>${feature.trim()}</span>
                        </li>
                      `).join('')}
                    </ul>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- About -->
      <section id="about" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 900px;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; text-transform: uppercase;">
              About Me
            </h2>
          </div>
          
          ${data.bio ? `
          <div style="font-size: 1.125rem; line-height: 1.8; color: var(--color-text); margin-bottom: 3rem; white-space: pre-line;">
            ${data.bio}
          </div>
          ` : ''}
          
          ${data.certifications ? `
          <div style="background: var(--color-surface); border-left: 5px solid var(--color-accent); padding: 2rem; margin-top: 3rem;">
            <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">
              Certifications & Credentials
            </h3>
            <div style="color: var(--color-text-secondary); line-height: 1.8; white-space: pre-line; font-weight: 600;">
              ${data.certifications}
            </div>
          </div>
          ` : ''}
        </div>
      </section>

      ${data.transformations && data.transformations.trim() !== '' && data.transformations !== '[]' ? `
      <!-- Transformations -->
      <section id="results" style="padding: 6rem 0; background: var(--color-surface);">
        <div class="container">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; text-transform: uppercase;">
              Real Results
            </h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary); font-weight: 600;">
              Success stories from clients who transformed their lives
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${(() => {
              try {
                const transformations = JSON.parse(data.transformations || '[]');
                return transformations.map(story => `
                  <div style="background: var(--color-bg); border: 3px solid var(--color-border); padding: 2rem; transition: all 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                      <div style="width: 60px; height: 60px; background: var(--color-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: var(--color-bg);">
                        ${(story.name || 'C').charAt(0)}
                      </div>
                      <div>
                        <div style="font-weight: 900; font-size: 1.125rem;">${story.name || 'Client'}</div>
                        ${story.result ? `
                        <div style="font-size: 0.875rem; color: var(--color-accent); font-weight: 700; text-transform: uppercase;">
                          ${story.result}
                        </div>
                        ` : ''}
                      </div>
                    </div>
                    ${story.time ? `
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 700; margin-bottom: 1rem; text-transform: uppercase;">
                      In ${story.time}
                    </div>
                    ` : ''}
                    ${story.testimonial ? `
                    <p style="font-style: italic; color: var(--color-text-secondary); line-height: 1.6;">
                      "${story.testimonial}"
                    </p>
                    ` : ''}
                  </div>
                `).join('');
              } catch (e) {
                return '';
              }
            })()}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact -->
      <section id="contact" style="padding: 8rem 0; background: var(--color-accent); color: var(--color-bg);">
        <div class="container" style="max-width: 700px; text-align: center;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em;">
            Ready to Start?
          </h2>
          <p style="font-size: 1.375rem; margin-bottom: 3rem; opacity: 0.95; font-weight: 600;">
            Let's build your dream physique together
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; margin-bottom: 3rem;">
            ${data.contact ? `
            <a href="mailto:${data.contact}" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: var(--color-bg); text-decoration: none; font-weight: 700; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              <span style="font-size: 1.5rem;">âœ‰ï¸</span>
              ${data.contact}
            </a>
            ` : ''}
            ${data.phone ? `
            <a href="tel:${data.phone}" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: var(--color-bg); text-decoration: none; font-weight: 700; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              <span style="font-size: 1.5rem;">ðŸ“ž</span>
              ${data.phone}
            </a>
            ` : ''}
            ${data.instagram ? `
            <a href="${data.instagram}" target="_blank" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: var(--color-bg); text-decoration: none; font-weight: 700; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              <span style="font-size: 1.5rem;">ðŸ“¸</span>
              Follow on Instagram
            </a>
            ` : ''}
          </div>
          
          ${data.bookingLink ? `
          <a href="${data.bookingLink}" target="_blank" style="display: inline-block; padding: 1.5rem 3.5rem; background: var(--color-bg); color: var(--color-accent); text-decoration: none; font-weight: 900; font-size: 1.25rem; border-radius: var(--radius-sm); transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 8px 24px rgba(0,0,0,0.3);" onmouseover="this.style.transform='translateY(-4px) scale(1.02)'" onmouseout="this.style.transform='translateY(0) scale(1)'">
            Book Free Consultation
          </a>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; border-top: 3px solid var(--color-accent); font-weight: 700;">
        <div class="container">
          <p style="text-transform: uppercase; letter-spacing: 0.05em;">Â© 2024 ${data.trainerName || 'Fitness Training'}. All rights reserved.</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          header nav { display: none !important; }
        }
      </style>
    `
  }),
};

// Helper functions
export function getAllTemplates() {
  return Object.values(templates).map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    supportedThemes: template.supportedThemes,
    defaultTheme: template.defaultTheme,
    image: template.image
  }));
}

export function getTemplate(templateId) {
  return templates[templateId];
}

export function renderTemplate(templateId, customization, themeId, colorMode = 'auto') {
  const template = getTemplate(templateId);
  const theme = getTheme(themeId);
  
  if (!template || !theme) {
    throw new Error('Invalid template or theme ID');
  }
  
  return template.render(customization, theme, colorMode);
}