// MVP Template System - Landing Page, Personal Profile, Restaurant
import { generateThemeCSS, getTheme } from "../styles/themes";

class Template {
  constructor(id, config) {
    this.id = id;
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.supportedThemes = [
      "minimal",
      "brutalist",
      "gradient",
      "elegant",
      "retro",
      "glassmorphism",
      "neumorphism",
    ];
    this.defaultTheme = config.defaultTheme || "minimal";
    this.fields = config.fields;
    this.structure = config.structure;
    this.image = config.image;
  }

  render(customization, theme, colorMode = "auto") {
    const normalizedColorMode = (colorMode || "auto").toLowerCase();
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
      ${theme.shadows?.glow ? `--shadow-glow: ${theme.shadows?.glow};` : ""}
      ${theme.shadows?.inset ? `--shadow-inset: ${theme.shadows?.inset};` : ""}
      
      /* Gradients */
      ${
        theme.gradients
          ? Object.entries(theme.gradients)
              .map(([key, value]) => `--gradient-${key}: ${value};`)
              .join("\n      ")
          : ""
      }
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
    Object.values(theme.fonts).forEach((font) => {
      const fontName = font.split(",")[0].replace(/['"]/g, "").trim();
      if (!fontName.includes("-apple-system") && !fontName.includes("system")) {
        fonts.add(fontName);
      }
    });

    return Array.from(fonts)
      .map((font) => {
        const formattedFont = font.replace(/ /g, "+");
        return `<link href="https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">`;
      })
      .join("\n  ");
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

    return base + (themeSpecific[theme.id] || "");
  }
}

export const templates = {
  // ============================================
  // TEMPLATE 1: LANDING PAGE
  // ============================================
  "landing-page": new Template("landing-page", {
    name: "Landing Page",
    description: "Complete landing page with hero, features, and CTA",
    category: "Landing Page",
    image: "landing-page",
    fields: {
      companyName: {
        type: "text",
        default: "MINIMAL",
        label: "Company Name",
        required: true,
      },
      headline: {
        type: "text",
        default: "Less is More",
        label: "Headline",
        required: true,
      },
      subheadline: {
        type: "textarea",
        default:
          "Clean design, thoughtful whitespace, and perfect typography. Focus on what matters with minimal distractions.",
        label: "Subheadline",
      },
      ctaPrimary: {
        type: "text",
        default: "Get Started",
        label: "Primary CTA",
      },
      ctaSecondary: {
        type: "text",
        default: "Learn More",
        label: "Secondary CTA",
      },
      stats: {
        type: "group",
        label: "Statistics",
        itemLabel: "Stat",
        min: 0,
        max: 4,
        fields: {
          number: { type: "text", label: "Number", default: "" },
          label: { type: "text", label: "Label", default: "" },
        },
        default: [
          { number: "99.9%", label: "Uptime Guarantee" },
          { number: "50K+", label: "Active Users" },
          { number: "4.9", label: "User Rating" },
        ],
      },
      featuresTitle: {
        type: "text",
        default: "Built for Simplicity",
        label: "Features Section Title",
      },
      featuresSubtitle: {
        type: "text",
        default: "Everything you need, nothing you don't",
        label: "Features Subtitle",
      },
      features: {
        type: "group",
        label: "Features",
        itemLabel: "Feature",
        min: 1,
        max: 6,
        fields: {
          title: { type: "text", label: "Title", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            title: "Clean Interface",
            description:
              "Intuitive design that gets out of your way and lets you focus on your work.",
          },
          {
            title: "Fast Performance",
            description:
              "Optimized for speed with zero bloat. Every millisecond counts.",
          },
          {
            title: "Responsive Design",
            description:
              "Perfectly adapted for every screen size, from mobile to desktop.",
          },
        ],
      },
      testimonialQuote: {
        type: "textarea",
        default:
          '"The most elegant solution I\'ve found. Nothing unnecessary, everything essential."',
        label: "Testimonial Quote",
      },
      testimonialAuthor: {
        type: "text",
        default: "Sarah Chen",
        label: "Testimonial Author",
      },
      testimonialRole: {
        type: "text",
        default: "Product Designer",
        label: "Author Role",
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Determine if we're in dark mode
      const isDark = colorMode === "dark";

      // Neumorphism box-shadow helpers - use CSS custom properties
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
      <!-- Sticky Header with Theme-Specific Styling -->
      <header style="padding: ${
        isBrutalist
          ? "2rem 0"
          : isElegant
          ? "2rem 0"
          : isNeumorphism
          ? "2rem 0"
          : "1.5rem 0"
      }; ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-accent);"
          : isRetro
          ? "border-bottom: 3px solid var(--color-accent);"
          : isNeumorphism
          ? ""
          : isGlassmorphism
          ? ""
          : "border-bottom: 1px solid var(--color-border);"
      } position: sticky; top: 0; ${
        isGlassmorphism
          ? "background: rgba(255, 255, 255, 0.1);"
          : "background: var(--color-bg);"
      } z-index: 100; backdrop-filter: blur(${
        isGlassmorphism ? "20px" : "10px"
      }); ${
        isGlassmorphism ? "box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);" : ""
      } ${isNeumorphism && "background: none"}">
        <div class="container">
          <nav style="${
            isNeumorphism
              ? `display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem; border-radius: 20px; ${getNeumorphismShadow(
                  false
                )}`
              : "display: flex; justify-content: space-between; align-items: center;"
          }">
            <div class="logo" style="font-weight: ${
              isBrutalist ? "900" : isNeumorphism || isElegant ? "700" : "600"
            }; font-size: ${
        isBrutalist
          ? "2rem"
          : isRetro
          ? "1.5rem"
          : isElegant
          ? "1.5rem"
          : isNeumorphism
          ? "1.25rem"
          : "1.125rem"
      }; letter-spacing: ${
        isBrutalist ? "2px" : isRetro ? "0" : isElegant ? "0" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isElegant
          ? "font-family: Playfair Display, serif; color: var(--color-accent);"
          : isNeumorphism || isGlassmorphism
          ? "color: var(--color-accent);"
          : ""
      }">${data.companyName || "MINIMAL"}</div>
            
            <!-- Desktop Navigation -->
            <ul class="nav-links" style="display: flex; gap: ${
              isBrutalist || isElegant
                ? "3rem"
                : isNeumorphism
                ? "2rem"
                : "2rem"
            }; list-style: none; align-items: center;">
              <li><a href="#features" style="color: ${
                isGlassmorphism
                  ? "var(--color-text)"
                  : isNeumorphism
                  ? "var(--color-text-secondary)"
                  : "var(--color-text-secondary)"
              }; text-decoration: none; font-size: ${
        isBrutalist
          ? "1.125rem"
          : isRetro
          ? "0.875rem"
          : isNeumorphism
          ? "0.9375rem"
          : "0.875rem"
      }; transition: ${isBrutalist ? "all 0.1s" : "color 0.2s"}; font-weight: ${
        isBrutalist ? "700" : isElegant ? "400" : isNeumorphism ? "500" : "500"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isRetro
          ? "letter-spacing: 1px;"
          : isElegant
          ? "letter-spacing: 0.5px;"
          : ""
      }" ${
        isBrutalist
          ? `onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'; this.style.padding='0.25rem 0.5rem'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text-secondary)'; this.style.padding='0'"`
          : isRetro
          ? `onmouseover="this.style.color='var(--color-accent)'; this.style.textShadow='0 0 10px var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'; this.style.textShadow='none'"`
          : isElegant
          ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'"`
          : isGlassmorphism
          ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'"`
          : isNeumorphism
          ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'"`
          : `onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'"`
      }>Features</a></li>
              <li><a href="#testimonial" style="color: ${
                isGlassmorphism
                  ? "var(--color-text)"
                  : isNeumorphism
                  ? "var(--color-text-secondary)"
                  : "var(--color-text-secondary)"
              }; text-decoration: none; font-size: ${
        isBrutalist
          ? "1.125rem"
          : isRetro
          ? "0.875rem"
          : isNeumorphism
          ? "0.9375rem"
          : "0.875rem"
      }; transition: ${isBrutalist ? "all 0.1s" : "color 0.2s"}; font-weight: ${
        isBrutalist ? "700" : isElegant ? "400" : isNeumorphism ? "500" : "500"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isRetro
          ? "letter-spacing: 1px;"
          : isElegant
          ? "letter-spacing: 0.5px;"
          : ""
      }" ${
        isBrutalist
          ? `onmouseover="this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'; this.style.padding='0.25rem 0.5rem'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text-secondary)'; this.style.padding='0'"`
          : isRetro
          ? `onmouseover="this.style.color='var(--color-accent)'; this.style.textShadow='0 0 10px var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'; this.style.textShadow='none'"`
          : isElegant
          ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'"`
          : isGlassmorphism
          ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'"`
          : isNeumorphism
          ? `onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'"`
          : `onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'"`
      }>Reviews</a></li>
              <li>
                <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
                  isNeumorphism
                    ? `padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: var(--neomorph-shadow-out);`
                    : ""
                }">
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
          <div class="mobile-menu" style="display: none; padding: 2rem 0 1rem; ${
            isNeumorphism || isGlassmorphism
              ? ""
              : "border-top: 1px solid var(--color-border);"
          } margin-top: 1rem;">
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 1.5rem;">
              <li><a href="#features" onclick="toggleMobileMenu()" style="color: var(--color-text); text-decoration: none; font-size: 1.125rem; font-weight: 500; display: block;">Features</a></li>
              <li><a href="#testimonial" onclick="toggleMobileMenu()" style="color: var(--color-text); text-decoration: none; font-size: 1.125rem; font-weight: 500; display: block;">Reviews</a></li>
              <li>
                <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
                  isNeumorphism
                    ? `padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: var(--neomorph-shadow-out);`
                    : ""
                }">
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
        <section style="padding: ${
          isBrutalist
            ? "6rem 0"
            : isElegant
            ? "8rem 0"
            : isNeumorphism
            ? "2rem 0 0 0"
            : "8rem 0 6rem"
        }; text-align: center; position: relative;">
          <div class="container">
            ${
              isNeumorphism
                ? `<div class="hero-content" style="padding: 4rem 3rem; border-radius: 32px; ${getNeumorphismShadow(
                    false
                  )} max-width: 900px; margin: 4rem auto;">`
                : ""
            }
            ${
              isGradient
                ? `<div style="display: inline-block; padding: 0.5rem 1.25rem; background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1)); border-radius: 999px; margin-bottom: 2rem; font-size: 0.875rem; font-weight: 600;">New Features Available</div>`
                : ""
            }
            ${
              isElegant
                ? `<div style="color: var(--color-accent); font-size: 0.875rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 1.5rem; font-weight: 400;">Timeless Design</div>`
                : ""
            }
            
            <h1 ${
              isRetro ? `class="glitch" data-text="${data.headline}"` : ""
            } style="font-family: ${
        isElegant ? "Playfair Display, serif" : "inherit"
      }; font-size: clamp(${isBrutalist || isRetro ? "3rem" : "2.5rem"}, ${
        isBrutalist || isRetro ? "10vw" : "7vw"
      }, ${
        isBrutalist || isRetro ? "8rem" : isGlassmorphism ? "6rem" : "5rem"
      }); font-weight: ${
        isBrutalist || isNeumorphism || isGlassmorphism
          ? "800"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "700"
      }; line-height: ${
        isBrutalist || isRetro ? "0.9" : isElegant ? "1.2" : "1.1"
      }; letter-spacing: ${isRetro ? "2px" : "-0.03em"}; margin-bottom: ${
        isElegant ? "2rem" : "1.5rem"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isRetro ? "position: relative;" : ""
      }">
              ${
                isBrutalist
                  ? data.headline
                      .split(" ")
                      .map((word, i) =>
                        i === 0
                          ? `<span style="background: var(--color-accent); color: var(--color-bg); padding: 0 0.5rem; display: inline-block; transform: rotate(-1deg);">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${
                isGradient
                  ? data.headline
                      .split(" ")
                      .map((word, i) =>
                        i === data.headline.split(" ").length - 1
                          ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${
                isRetro
                  ? `<span class="gradient-text" style="background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: glow 2s ease-in-out infinite alternate;">${data.headline}</span>`
                  : ""
              }
              ${
                !isBrutalist && !isGradient && !isRetro
                  ? data.headline || "Less is More"
                  : ""
              }
            </h1>
            
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist || isRetro
          ? "1.5rem"
          : isElegant || isGlassmorphism
          ? "1.125rem"
          : "1.125rem"
      }; font-weight: ${
        isElegant ? "300" : "normal"
      }; color: var(--color-text-secondary); max-width: ${
        isElegant ? "680px" : isGlassmorphism ? "700px" : "600px"
      }; margin: 0 auto 3rem; line-height: ${
        isBrutalist || isRetro
          ? "1.6"
          : isElegant || isGlassmorphism
          ? "1.9"
          : "1.8"
      };">
              ${
                data.subheadline ||
                "Clean design, thoughtful whitespace, and perfect typography."
              }
            </p>
            
            <div class="cta-group" style="display: flex; gap: ${
              isElegant ? "1.5rem" : isRetro ? "1.5rem" : "1rem"
            }; justify-content: center; flex-wrap: wrap;">
              ${
                data.ctaPrimary
                  ? `
              <a href="#" style="padding: ${
                isBrutalist
                  ? "1.5rem 3rem"
                  : isGradient || isNeumorphism
                  ? "1.125rem 2.5rem"
                  : isElegant
                  ? "1rem 2.5rem"
                  : isRetro
                  ? "1rem 2.5rem"
                  : "1rem 2rem"
              }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist
                        ? "0"
                        : isGlassmorphism || isNeumorphism
                        ? "16px"
                        : isElegant
                        ? "0"
                        : "8px"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist || isRetro
                        ? "700"
                        : isNeumorphism
                        ? "600"
                        : "500"
                    }; transition: all ${
                      isBrutalist || isRetro ? "0.1s" : "0.2s"
                    }; display: inline-block; background: ${
                      isGradient
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.15)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                        : isElegant
                        ? "var(--color-accent)"
                        : "var(--color-accent)"
                    }; color: ${
                      isElegant
                        ? "white"
                        : isGlassmorphism
                        ? "var(--color-text)"
                        : isNeumorphism
                        ? "var(--color-text)"
                        : "white"
                    }; ${
                      isBrutalist
                        ? "text-transform: uppercase; border: 4px solid var(--color-text); background: var(--color-text); color: var(--color-bg); font-size: 1.125rem;"
                        : isRetro
                        ? "text-transform: uppercase; letter-spacing: 1px; font-size: 0.9375rem; box-shadow: 0 0 30px var(--color-accent); border: 2px solid var(--color-accent);"
                        : isElegant
                        ? "font-size: 0.9375rem; letter-spacing: 0.5px; border: 1px solid var(--color-accent);"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    } ${
                      isGradient
                        ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);"
                        : ""
                    }" 
                onmouseover="this.style.transform='translateY(-2px)'; ${
                  isBrutalist
                    ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                    : isGradient
                    ? `this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'`
                    : isRetro
                    ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 0 50px var(--color-accent)'`
                    : isElegant
                    ? `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                    : isGlassmorphism
                    ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.opacity='0.9'`
                }" 
                onmouseout="this.style.transform='translateY(0)'; ${
                  isBrutalist
                    ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                    : isGradient
                    ? `this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'`
                    : isRetro
                    ? `this.style.boxShadow='0 0 30px var(--color-accent)'`
                    : isElegant
                    ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                    : isGlassmorphism
                    ? `this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.opacity='1'`
                }">
                ${data.ctaPrimary}
              </a>
              `
                  : ""
              }
              ${
                data.ctaSecondary
                  ? `
              <a href="#" style="padding: ${
                isBrutalist
                  ? "1.5rem 3rem"
                  : isGradient || isNeumorphism
                  ? "1.125rem 2.5rem"
                  : isElegant
                  ? "1rem 2.5rem"
                  : isRetro
                  ? "1rem 2.5rem"
                  : "1rem 2rem"
              }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist
                        ? "0"
                        : isGlassmorphism || isNeumorphism
                        ? "16px"
                        : isElegant
                        ? "0"
                        : "8px"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist || isRetro
                        ? "700"
                        : isNeumorphism
                        ? "600"
                        : "500"
                    }; transition: all 0.2s; display: inline-block; border: ${
                      isBrutalist
                        ? "4px"
                        : isRetro
                        ? "2px"
                        : isElegant
                        ? "1px"
                        : isGlassmorphism
                        ? "1px"
                        : "2px"
                    } solid ${
                      isBrutalist
                        ? "var(--color-text)"
                        : isRetro
                        ? "#00f5ff"
                        : isElegant
                        ? "var(--color-border)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; color: var(--color-text); background: ${
                      isBrutalist
                        ? "var(--color-bg)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : "transparent"
                    }; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; font-size: 1.125rem;"
                        : isElegant
                        ? "font-size: 0.9375rem; letter-spacing: 0.5px;"
                        : isRetro
                        ? "font-size: 0.9375rem; letter-spacing: 1px; box-shadow: 0 0 20px #00f5ff;"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                    : isRetro
                    ? `this.style.background='#00f5ff'; this.style.color='#0d001a'; this.style.boxShadow='0 0 40px #00f5ff'`
                    : isElegant
                    ? `this.style.background='var(--color-surface)'; this.style.borderColor='var(--color-accent)'`
                    : isGlassmorphism
                    ? `this.style.background='rgba(255,255,255,0.1)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.background='var(--color-surface)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                    : isRetro
                    ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='0 0 20px #00f5ff'`
                    : isElegant
                    ? `this.style.background='transparent'; this.style.borderColor='var(--color-border)'`
                    : isGlassmorphism
                    ? `this.style.background='rgba(255,255,255,0.05)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.background='transparent'`
                }">
                ${data.ctaSecondary}
              </a>
              `
                  : ""
              }
            </div>
            ${isNeumorphism ? `</div>` : ""}
          </div>
        </section>

        <!-- Stats Section with Theme-Specific Styling -->
        ${
          data.stats && data.stats.length > 0
            ? `
        <section class="stats-section" style="padding: ${
          isBrutalist ? "0" : isNeumorphism ? "0" : "4rem 0"
        }; background: ${
                isBrutalist
                  ? "var(--color-text)"
                  : isGradient
                  ? "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(240,147,251,0.1))"
                  : isRetro
                  ? "var(--color-surface)"
                  : isElegant
                  ? "var(--color-surface)"
                  : isGlassmorphism
                  ? "rgba(255,255,255,0.02)"
                  : "var(--color-surface)"
              }; ${
                !isBrutalist && !isRetro
                  ? "border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);"
                  : isRetro
                  ? "margin: 4rem 0; border-top: 3px solid var(--color-accent); border-bottom: 3px solid #00f5ff;"
                  : ""
              } ${
                isGradient
                  ? "border-radius: 32px; margin: 0 2rem;"
                  : isGlassmorphism
                  ? "backdrop-filter: blur(20px);"
                  : ""
              }">
          <div class="container">
            <div class="stats-grid" style="display: grid; grid-template-columns: repeat(${
              isBrutalist ? "4" : "3"
            }, 1fr); gap: ${
                isBrutalist
                  ? "0"
                  : isRetro
                  ? "3rem"
                  : isNeumorphism
                  ? "2.5rem"
                  : "3rem"
              }; text-align: center;">
              ${data.stats
                .map(
                  (stat, index) => `
                <div class="stat" style="${
                  isBrutalist
                    ? `padding: 3rem; border: 3px solid var(--color-bg); min-height: 250px; display: flex; flex-direction: column; justify-content: center; ${
                        index === 1
                          ? "background: var(--color-accent); color: var(--color-bg);"
                          : index === 2
                          ? "background: #0000ff; color: var(--color-bg);"
                          : "color: var(--color-bg);"
                      }`
                    : isRetro
                    ? `border: 3px solid #00f5ff; padding: 2rem; background: rgba(0,245,255,0.03); transition: all 0.3s;`
                    : isNeumorphism
                    ? `padding: 3rem 2rem; border-radius: 24px; ${getNeumorphismShadow(
                        false
                      )} transition: all 0.3s;`
                    : isGlassmorphism
                    ? `padding: 2rem; border-radius: 20px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);`
                    : ""
                }" ${
                    isRetro
                      ? `onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 40px #00f5ff'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"`
                      : isNeumorphism
                      ? `onmouseover="this.style.boxShadow='${getNeumorphismHoverShadow()}'" onmouseout="this.style.boxShadow='${getNeumorphismNormalShadow()}'"`
                      : ""
                  }>
                  <h3 style="font-size: ${
                    isBrutalist
                      ? "2rem"
                      : isGradient
                      ? "3.5rem"
                      : isRetro
                      ? "3rem"
                      : isNeumorphism || isGlassmorphism
                      ? "3rem"
                      : "2.5rem"
                  }; font-weight: ${
                    isBrutalist
                      ? "900"
                      : isRetro || isNeumorphism || isGlassmorphism
                      ? "800"
                      : "700"
                  }; margin-bottom: 0.5rem; ${
                    isBrutalist
                      ? "text-transform: uppercase;"
                      : isGradient
                      ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                      : isRetro
                      ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                      : isNeumorphism || isGlassmorphism
                      ? "color: var(--color-accent);"
                      : "color: var(--color-accent);"
                  }">
                    ${stat.number}
                  </h3>
                  <p style="color: ${
                    isBrutalist ? "inherit" : "var(--color-text-secondary)"
                  }; font-size: ${
                    isBrutalist
                      ? "1.125rem"
                      : isRetro
                      ? "0.875rem"
                      : isNeumorphism || isGlassmorphism
                      ? "1rem"
                      : "0.875rem"
                  }; ${
                    isBrutalist
                      ? "line-height: 1.5;"
                      : isRetro
                      ? "text-transform: uppercase; letter-spacing: 2px;"
                      : isNeumorphism || isGlassmorphism
                      ? "font-weight: 500;"
                      : ""
                  }">
                    ${stat.label}
                  </p>
                </div>
              `
                )
                .join("")}
              ${
                isBrutalist && data.stats.length === 3
                  ? `
              <div class="stat" style="padding: 3rem; border: 3px solid var(--color-bg); min-height: 250px; display: flex; flex-direction: column; justify-content: center; color: var(--color-bg);">
                <h3 style="font-size: 2rem; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase;">READY?</h3>
                <p style="font-size: 1.125rem; line-height: 1.5;">Join thousands</p>
              </div>
              `
                  : ""
              }
            </div>
          </div>
        </section>
        `
            : ""
        }

        <!-- Features Section with Theme-Specific Cards -->
        <section id="features" class="features" style="padding: ${
          isRetro || isElegant ? "8rem 0" : "6rem 0"
        };">
          <div class="container">
            ${
              isBrutalist
                ? `
            <div style="text-align: center; margin-bottom: 6rem;">
              <h2 style="font-size: clamp(2.5rem, 8vw, 6rem); line-height: 1.1; text-transform: uppercase; margin-bottom: 2rem; font-weight: 900;">
                ${data.featuresTitle || "DESIGN IS"}<br>
                <span style="border-bottom: 6px solid var(--color-accent); display: inline-block;">COMMUNITY</span>
              </h2>
            </div>
            `
                : isElegant
                ? `
            <div style="text-align: center; margin-bottom: 6rem;">
              <h2 style="font-family: Playfair Display, serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 600; margin-bottom: 1rem; letter-spacing: -0.01em;">
                ${data.featuresTitle || "Our Philosophy"}
              </h2>
              <p style="color: var(--color-text-secondary); font-size: 1.125rem; font-weight: 300; max-width: 600px; margin: 0 auto;">
                ${
                  data.featuresSubtitle ||
                  "Crafted with care, designed for longevity"
                }
              </p>
            </div>
            `
                : isRetro
                ? `
            <h2 style="font-size: clamp(2rem, 6vw, 3.5rem); text-align: center; margin-bottom: 4rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 700; background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ${data.featuresTitle || "Power Features"}
            </h2>
            `
                : isNeumorphism
                ? `
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); text-align: center; margin-bottom: 4rem; font-weight: 800;">
              ${data.featuresTitle || "Soft & Subtle"}
            </h2>
            `
                : `
            <h2 class="section-title" style="font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isGradient || isGlassmorphism ? "800" : "700"
            }; text-align: center; margin-bottom: 1rem; letter-spacing: -0.02em;">
              ${data.featuresTitle || "Built for Simplicity"}
            </h2>
            <p class="section-desc" style="text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 4rem; font-size: 1.125rem;">
              ${
                data.featuresSubtitle ||
                "Everything you need, nothing you don't"
              }
            </p>
            `
            }
            
            <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
              isBrutalist || isElegant ? "320px" : "280px"
            }, 1fr)); gap: ${
        isElegant ? "4rem 3rem" : isNeumorphism ? "2.5rem" : "2rem"
      };">
              ${
                data.features && data.features.length > 0
                  ? data.features
                      .map(
                        (feature, index) => `
                <div class="feature-card" style="padding: 2rem; ${
                  isBrutalist && "max-width: calc(100% - 3rem)"
                } ${isElegant ? "text-align: center;" : ""} padding: ${
                          isBrutalist || isElegant
                            ? "3rem"
                            : isGradient
                            ? "2.5rem"
                            : isRetro
                            ? "2rem"
                            : isNeumorphism
                            ? "2.5rem"
                            : "2rem"
                        }; border-radius: ${
                          isGradient
                            ? "24px"
                            : isBrutalist || isElegant
                            ? "0"
                            : isRetro
                            ? "0"
                            : isNeumorphism
                            ? "24px"
                            : isGlassmorphism
                            ? "24px"
                            : "12px"
                        }; border: ${
                          isBrutalist
                            ? "4px"
                            : isRetro
                            ? "2px"
                            : isElegant
                            ? "0"
                            : "1px"
                        } solid ${
                          isBrutalist
                            ? "var(--color-text)"
                            : isRetro
                            ? "var(--color-accent)"
                            : isElegant
                            ? "transparent"
                            : "var(--color-border)"
                        }; transition: all ${
                          isBrutalist || isRetro ? "0.2s" : "0.3s"
                        }; background: ${
                          isGradient
                            ? "linear-gradient(135deg, rgba(102,126,234,0.03), rgba(118,75,162,0.03))"
                            : isRetro
                            ? "rgba(255,47,181,0.05)"
                            : isGlassmorphism
                            ? "rgba(255,255,255,0.05)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-bg)"
                        }; ${
                          isGlassmorphism
                            ? "backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1);"
                            : isNeumorphism
                            ? getNeumorphismShadow(false)
                            : ""
                        } ${isRetro ? "position: relative;" : ""}" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                      : isGradient
                      ? `this.style.transform='translateY(-8px)'; this.style.boxShadow='0 20px 60px rgba(102,126,234,0.15)'`
                      : isRetro
                      ? `this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 40px rgba(255,47,181,0.3)'`
                      : isGlassmorphism
                      ? `this.style.transform='translateY(-8px)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                      : isGradient
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isRetro
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isGlassmorphism
                      ? `this.style.transform='translateY(0)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                  }">
                  ${
                    isGradient
                      ? `
                  <div style="width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #667eea, #764ba2); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700;">
                    ${index + 1}
                  </div>
                  `
                      : `<div class="feature-icon" style="${
                          isGlassmorphism
                            ? "background-color: rgba(255,255,255,.1)!important;"
                            : ""
                        } display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: 700; text-align:center; width: 48px; height: 48px; background: var(--color-accent); border-radius: 8px; margin-bottom: 1.5rem;">${
                          index + 1
                        }</div>`
                  }
                  <h3 style="font-family: ${
                    isElegant ? "Playfair Display, serif" : "inherit"
                  }; font-size: ${
                          isBrutalist || isElegant
                            ? "1.75rem"
                            : isGradient
                            ? "1.375rem"
                            : isRetro
                            ? "1.25rem"
                            : isNeumorphism || isGlassmorphism
                            ? "1.5rem"
                            : "1.25rem"
                        }; font-weight: ${
                          isBrutalist
                            ? "900"
                            : isElegant
                            ? "600"
                            : isRetro
                            ? "700"
                            : isNeumorphism || isGlassmorphism
                            ? "700"
                            : "700"
                        }; margin-bottom: ${
                          isBrutalist || isElegant
                            ? "1.5rem"
                            : isRetro
                            ? "1rem"
                            : isNeumorphism || isGlassmorphism
                            ? "1rem"
                            : "0.75rem"
                        }; ${
                          isBrutalist || isRetro
                            ? "text-transform: uppercase;"
                            : ""
                        } ${
                          isRetro
                            ? "letter-spacing: 2px; color: var(--color-accent);"
                            : isNeumorphism || isGlassmorphism
                            ? "color: var(--color-accent);"
                            : ""
                        }">
                    ${feature.title || ""}
                  </h3>
                  <p style="font-family: ${
                    isElegant
                      ? "Lato, sans-serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-weight: ${
                          isElegant ? "300" : "normal"
                        }; color: var(--color-text-secondary); line-height: ${
                          isElegant ? "1.9" : "1.7"
                        }; font-size: ${
                          isBrutalist || isRetro
                            ? "1.125rem"
                            : isElegant || isNeumorphism || isGlassmorphism
                            ? "1rem"
                            : "0.9375rem"
                        };">
                    ${feature.description || ""}
                  </p>
                </div>
              `
                      )
                      .join("")
                  : ""
              }
            </div>
          </div>
        </section>

        <!-- Testimonial/CTA Section with Theme-Specific Styling -->
        ${
          data.testimonialQuote
            ? `
        <section id="testimonial" class="testimonial" style="padding: ${
          isBrutalist || isRetro || isElegant ? "8rem 0" : "6rem 0"
        }; background: ${
                isBrutalist
                  ? "var(--color-accent)"
                  : isGradient
                  ? "linear-gradient(135deg, #667eea, #764ba2)"
                  : isRetro
                  ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
                  : isElegant
                  ? "var(--color-surface)"
                  : isGlassmorphism
                  ? "transparent"
                  : "var(--color-surface)"
              }; text-align: center; ${
                isBrutalist || isGradient || isRetro ? "color: white;" : ""
              } ${
                isElegant
                  ? "border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);"
                  : isRetro
                  ? "border-radius: 20px; margin: 0 2rem; box-shadow: 0 20px 60px rgba(255,47,181,0.4);"
                  : ""
              }">
          <div class="container" style="${
            isGlassmorphism || isNeumorphism
              ? `padding: 5rem 3rem!important; border-radius: 32px; max-width: 90%; ${
                  isGlassmorphism
                    ? "background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1);"
                    : getNeumorphismShadow(false)
                }`
              : ""
          }">
            ${
              isBrutalist
                ? `
            <h2 style="font-size: clamp(2.5rem, 7vw, 5rem); text-transform: uppercase; margin-bottom: 2rem; font-weight: 900; color: var(--color-bg);">
              READY TO GO BOLD?
            </h2>
            <p style="font-size: 1.5rem; margin-bottom: 3rem; color: var(--color-bg);">
              ${data.testimonialQuote.replace(/"/g, "")}
            </p>
            <a href="#" style="display: inline-block; padding: 1.5rem 3rem; background: var(--color-bg); color: var(--color-accent); text-decoration: none; text-transform: uppercase; font-size: 1.125rem; border: 4px solid var(--color-bg); transition: all 0.1s; font-weight: 900;" onmouseover="this.style.background='transparent'; this.style.color='var(--color-bg)'" onmouseout="this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'">
              GET STARTED
            </a>
            `
                : isElegant
                ? `
            <p style="font-family: Playfair Display, serif; font-size: clamp(1.5rem, 3vw, 2.25rem); line-height: 1.6; max-width: 800px; margin: 0 auto 2rem; font-style: italic; color: var(--color-text);">
              ${data.testimonialQuote}
            </p>
            <p style="margin-top: 2rem; text-align: center; color: var(--color-text-secondary); font-size: 1rem; letter-spacing: 1px;">
              — ${
                data.testimonialAuthor || ""
              }<span style="display: inline-block; margin: 0 0.5rem;">|</span>${
                    data.testimonialRole || ""
                  }
            </p>
            `
                : isRetro
                ? `
            <h2 style="font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
              ${data.testimonialQuote.split('"').join("").substring(0, 30)}...
            </h2>
            <p style="font-size: 1.25rem; margin-bottom: 2.5rem;">
              Step into the future of design
            </p>
            <a href="#" style="display: inline-block; padding: 1rem 2.5rem; background: white; color: var(--color-accent); text-decoration: none; font-weight: 700; font-size: 1rem; border-radius: 999px; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; border: 2px solid white;" onmouseover="this.style.background='transparent'; this.style.color='white'; this.style.borderColor='white'" onmouseout="this.style.background='white'; this.style.color='var(--color-accent)'">
              Get Started Now
            </a>
            `
                : `
            <p class="quote" style="font-size: ${
              isGradient
                ? "1.25rem"
                : isGlassmorphism || isNeumorphism
                ? "1.125rem"
                : "1.5rem"
            }; line-height: 1.8; max-width: 800px; margin: 0 auto 2rem; font-weight: 500; color: ${
                    isGradient || isRetro
                      ? "white"
                      : isGlassmorphism
                      ? "var(--color-text)"
                      : "var(--color-text)"
                  }; ${isGradient ? "opacity: 0.9;" : ""}">
              ${data.testimonialQuote}
            </p>
            <div class="author" style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
              <div class="avatar" style="width: 48px; height: 48px; border-radius: 50%; background: ${
                isGradient || isRetro ? "white" : "var(--color-accent)"
              }; opacity: 0.2;"></div>
              <div class="author-info" style="text-align: left;">
                <h4 style="font-weight: 600; margin-bottom: 0.25rem; color: ${
                  isGradient || isRetro ? "white" : "var(--color-text)"
                };">
                  ${data.testimonialAuthor || ""}
                </h4>
                <p style="color: ${
                  isGradient || isRetro
                    ? "rgba(255,255,255,0.8)"
                    : "var(--color-text-secondary)"
                }; font-size: 0.875rem;">
                  ${data.testimonialRole || ""}
                </p>
              </div>
            </div>
            ${
              isGradient
                ? `
            <a href="#" style="display: inline-block; padding: 1.125rem 2.5rem; background: white; color: #667eea; text-decoration: none; font-weight: 600; font-size: 1rem; border-radius: 999px; transition: all 0.3s; margin-top: 2rem;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              Start Free Trial
            </a>
            `
                : ""
            }
            ${
              isGlassmorphism || isNeumorphism
                ? `
            <a href="#" style="display: inline-block; padding: 1.125rem 2.5rem; background: ${
              isGlassmorphism ? "rgba(255,255,255,0.15)" : "var(--color-bg)"
            }; color: var(--color-text); text-decoration: none; font-weight: 600; font-size: 1rem; border-radius: 16px; transition: all 0.3s; margin-top: 2rem; ${
                    isGlassmorphism
                      ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);"
                      : getNeumorphismShadow(false)
                  }" 
              onmouseover="${
                isGlassmorphism
                  ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'`
                  : `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
              }" 
              onmouseout="${
                isGlassmorphism
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'`
                  : `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
              }">
              Start Your Journey
            </a>
            `
                : ""
            }
            `
            }
          </div>
        </section>
        `
            : ""
        }
      </main>

      <!-- Footer -->
      <footer style="padding: ${
        isBrutalist ? "4rem 0" : isRetro ? "3rem 0" : "3rem 0"
      }; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-text);"
          : isRetro
          ? "margin-top: 3rem; border-top: 3px solid var(--color-accent);"
          : isElegant
          ? "border-top: 1px solid var(--color-border);"
          : "border-top: 1px solid var(--color-border);"
      } text-align: center; color: var(--color-text-secondary); font-size: ${
        isRetro ? "0.875rem" : "0.875rem"
      }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); background: rgba(255,255,255,0.02);"
          : ""
      } ${isElegant ? "padding: 4rem 0;" : ""}">
        <div class="container">
          <p style="${
            isBrutalist
              ? "font-size: 1.25rem; text-transform: uppercase; font-weight: 700;"
              : isRetro
              ? "text-transform: uppercase; letter-spacing: 2px;"
              : ""
          }">
            © 2024 ${data.companyName || "Minimal"}. All rights reserved.
          </p>
        </div>
      </footer>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables - Dynamically adapt to color mode */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 20px 20px 60px #c5c9ce, inset -20px -20px 60px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 32px 32px 64px #2a2d34, inset -32px -32px 64px #383d46;
        }
        `
            : ""
        }
        
        /* Mobile Hamburger Menu Styles */
        @media (max-width: 768px) {
          .container { padding: 0 1.5rem !important; }
          section[style*="padding: 8rem"] { padding: 5rem 0 !important; }
          section[style*="padding: 6rem"] { padding: 4rem 0 !important; }
          ${
            isNeumorphism
              ? `
          .hero-content { padding: 3rem 2rem !important; }
          nav[style*="padding: 1.25rem"] { padding: 1rem 1.5rem !important; }
          `
              : ""
          }
          .nav-links { display: none !important; }
          .mobile-controls { display: flex !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: ${
            isBrutalist ? "0 !important" : "2rem !important"
          }; }
          .features-grid { grid-template-columns: 1fr !important; gap: ${
            isElegant ? "3rem !important" : "1.5rem !important"
          }; }
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
        ${
          isGradient || isRetro
            ? `
        @keyframes gradient {
          0%, 100% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
        /* Retro glitch effect */
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch::before {
          animation: glitch1 2s infinite;
          color: var(--color-accent);
          z-index: -1;
        }
        
        .glitch::after {
          animation: glitch2 3s infinite;
          color: #00f5ff;
          z-index: -2;
        }
        
        @keyframes glitch1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        @keyframes glow {
          from { filter: drop-shadow(0 0 10px var(--color-accent)); }
          to { filter: drop-shadow(0 0 30px #00f5ff); }
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
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
        `
            : ""
        }
      </style>
      
      <script>
        // All interactions are disabled via CSS pointer-events: none
        // These functions are kept for structure but won't execute from user clicks
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
    },
  }),
  // ============================================
  // TEMPLATE 2: ENHANCED PERSONAL PROFILE
  // ============================================
  "personal-profile": new Template("personal-profile", {
    name: "Personal Profile",
    description:
      "Enhanced personal page with timeline, stats, and testimonials",
    image: "personal-profile",
    category: "Personal",
    fields: {
      name: {
        type: "text",
        default: "Jordan Rivers",
        label: "Your Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "Product Designer & Creative",
        label: "Tagline",
      },
      bio: {
        type: "textarea",
        default:
          "I create meaningful digital experiences that connect people and solve real problems. With a passion for clean design and user-centered thinking.",
        label: "Bio",
      },
      location: {
        type: "text",
        default: "San Francisco, CA",
        label: "Location",
      },
      availability: {
        type: "text",
        default: "Available for freelance",
        label: "Availability Status",
      },
      stats: {
        type: "group",
        label: "Statistics",
        itemLabel: "Stat",
        min: 0,
        max: 4,
        fields: {
          number: { type: "text", label: "Number", default: "" },
          label: { type: "text", label: "Label", default: "" },
        },
        default: [
          { number: "8+", label: "Years Experience" },
          { number: "50+", label: "Projects Completed" },
          { number: "20+", label: "Happy Clients" },
        ],
      },
      skills: {
        type: "repeatable",
        label: "Skills",
        itemLabel: "Skill",
        default: [
          "UI Design",
          "Prototyping",
          "User Research",
          "Design Systems",
          "Figma",
          "React",
        ],
        max: 12,
      },
      experience: {
        type: "group",
        label: "Work Experience",
        itemLabel: "Position",
        min: 0,
        max: 5,
        fields: {
          role: { type: "text", label: "Role", default: "" },
          company: { type: "text", label: "Company", default: "" },
          period: { type: "text", label: "Period", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            role: "Senior Product Designer",
            company: "TechCorp",
            period: "2020 - Present",
            description:
              "Leading design for core product features used by millions",
          },
          {
            role: "Product Designer",
            company: "StartupXYZ",
            period: "2018 - 2020",
            description:
              "Designed and launched the company's mobile app from 0 to 1",
          },
        ],
      },
      projects: {
        type: "group",
        label: "Featured Projects",
        itemLabel: "Project",
        min: 0,
        max: 4,
        fields: {
          title: { type: "text", label: "Project Title", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
          tags: { type: "text", label: "Tags (comma-separated)", default: "" },
          link: { type: "url", label: "Project Link (optional)", default: "" },
        },
        default: [
          {
            title: "Mobile Banking App",
            description:
              "Redesigned the core banking experience for 2M+ users, resulting in 45% increase in user satisfaction",
            tags: "UI/UX, Mobile, Finance",
            link: "",
          },
          {
            title: "E-commerce Platform",
            description:
              "Built a comprehensive design system that increased conversion by 40% and reduced development time by 60%",
            tags: "Design System, Web, E-commerce",
            link: "",
          },
        ],
      },
      testimonials: {
        type: "group",
        label: "Testimonials",
        itemLabel: "Testimonial",
        min: 0,
        max: 3,
        fields: {
          quote: { type: "textarea", label: "Quote", default: "" },
          author: { type: "text", label: "Author", default: "" },
          role: { type: "text", label: "Author Role", default: "" },
        },
        default: [
          {
            quote:
              "Jordan is an exceptional designer who brings both creativity and strategic thinking to every project.",
            author: "Sarah Johnson",
            role: "CEO, TechCorp",
          },
        ],
      },
      contactEmail: {
        type: "email",
        default: "hello@jordan.com",
        label: "Contact Email",
      },
      socialLinks: {
        type: "group",
        label: "Social Links",
        itemLabel: "Link",
        min: 0,
        max: 5,
        fields: {
          platform: { type: "text", label: "Platform", default: "" },
          url: { type: "url", label: "URL", default: "" },
        },
        default: [
          { platform: "Twitter", url: "https://twitter.com" },
          { platform: "LinkedIn", url: "https://linkedin.com" },
          { platform: "Dribbble", url: "https://dribbble.com" },
        ],
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Determine if we're in dark mode
      const isDark = colorMode === "dark";

      // Neumorphism box-shadow helpers
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
<!-- Header with Theme Toggle and Theme-Specific Styling -->
      <header style="padding: ${
        isBrutalist
          ? "2rem 0"
          : isElegant
          ? "1.5rem 0"
          : isNeumorphism
          ? "2rem 0"
          : "1.5rem 0"
      }; position: ${
        isBrutalist ? "relative" : "fixed"
      }; top: 0; left: 0; right: 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "none"
          : "var(--color-bg)"
      }; border-bottom: ${
        isBrutalist ? "4px" : isRetro ? "3px" : "1px"
      } solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isNeumorphism || isGlassmorphism
          ? "transparent"
          : "var(--color-border)"
      }; z-index: 1000; backdrop-filter: blur(${
        isGlassmorphism ? "20px" : isNeumorphism ? "0px" : "10px"
      }); ${
        isGlassmorphism ? "box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);" : ""
      }">
        <div class="container">
          <div style="${
            isNeumorphism
              ? `background: var(--color-bg); display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-radius: 16px; ${getNeumorphismShadow(
                  false
                )}`
              : "display: flex; justify-content: space-between; align-items: center;"
          }">
            <div style="font-weight: ${
              isBrutalist ? "900" : isNeumorphism || isElegant ? "700" : "600"
            }; font-size: ${
        isBrutalist
          ? "1.75rem"
          : isRetro
          ? "1.5rem"
          : isElegant
          ? "1.25rem"
          : "1.125rem"
      }; letter-spacing: ${isBrutalist || isRetro ? "2px" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isElegant
          ? "font-family: Playfair Display, serif; color: var(--color-accent);"
          : isNeumorphism || isGlassmorphism
          ? "color: var(--color-accent);"
          : ""
      }">
              ${data.name || "Portfolio"}
            </div>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? `padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: var(--neomorph-shadow-out);`
                : ""
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </div>
        </div>
      </header>

      <!-- Hero Section with Theme-Specific Styling -->
      <section class="hero" style="min-height: 100vh; display: flex; align-items: center; padding: ${
        isBrutalist ? "10rem 0 6rem" : "8rem 0 6rem"
      }; position: relative;">
        <div class="container" style="max-width: 1000px;">
          ${
            isNeumorphism
              ? `<div class="hero-content" style="padding: 4rem 3rem; border-radius: 32px; ${getNeumorphismShadow(
                  false
                )} max-width: 1000px; margin: 0 auto;">`
              : ""
          }
          
          <!-- Availability Badge -->
          ${
            data.availability
              ? `
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: ${
            isGradient
              ? "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))"
              : isGlassmorphism
              ? "rgba(255,255,255,0.1)"
              : isNeumorphism
              ? "var(--color-bg)"
              : isBrutalist
              ? "var(--color-bg)"
              : "var(--color-surface)"
          }; border: ${isBrutalist ? "3px" : isRetro ? "2px" : "1px"} solid ${
                  isBrutalist || isRetro
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.2)"
                    : isNeumorphism
                    ? "transparent"
                    : "var(--color-border)"
                }; border-radius: ${
                  isGradient || isRetro
                    ? "999px"
                    : isBrutalist
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "16px"
                    : "9999px"
                }; margin-bottom: 2rem; font-size: ${
                  isBrutalist || isRetro ? "1rem" : "0.875rem"
                }; font-weight: ${isBrutalist ? "700" : "500"}; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 1px;"
                    : ""
                } ${
                  isGlassmorphism
                    ? "backdrop-filter: blur(10px);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : ""
                }">
            <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
            ${data.availability}
          </div>
          `
              : ""
          }
          
          <div style="margin-bottom: 3rem;">
            <h1 ${
              isRetro ? `class="glitch" data-text="${data.name}"` : ""
            } style="font-family: ${
        isElegant ? "Playfair Display, serif" : "inherit"
      }; font-size: clamp(${isBrutalist || isRetro ? "3rem" : "3rem"}, 8vw, ${
        isBrutalist || isRetro ? "8rem" : isGlassmorphism ? "6rem" : "5.5rem"
      }); font-weight: ${
        isBrutalist || isNeumorphism || isGlassmorphism
          ? "800"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "800"
      }; margin-bottom: 1.5rem; letter-spacing: ${
        isRetro ? "2px" : "-0.03em"
      }; line-height: 1; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${isRetro ? "position: relative;" : ""}">
              ${
                isBrutalist
                  ? (data.name || "Your Name")
                      .split(" ")
                      .map((word, i) =>
                        i === 0
                          ? `<span style="background: var(--color-accent); color: var(--color-bg); padding: 0 0.5rem; display: inline-block; transform: rotate(-1deg);">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${
                isGradient
                  ? (data.name || "Your Name")
                      .split(" ")
                      .map((word, i) =>
                        i === (data.name || "Your Name").split(" ").length - 1
                          ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${
                isRetro
                  ? `<span class="gradient-text" style="background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: glow 2s ease-in-out infinite alternate;">${
                      data.name || "Your Name"
                    }</span>`
                  : ""
              }
              ${
                !isBrutalist && !isGradient && !isRetro
                  ? data.name || "Your Name"
                  : ""
              }
            </h1>
            
            ${
              data.tagline
                ? `
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(${
                    isBrutalist || isRetro ? "1.5rem" : "1.5rem"
                  }, 4vw, ${
                    isBrutalist || isRetro ? "2.5rem" : "2.25rem"
                  }); color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: ${
                    isElegant ? "300" : isBrutalist ? "700" : "500"
                  }; ${
                    isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                  }">
              ${data.tagline}
            </p>
            `
                : ""
            }
            
            ${
              data.location
                ? `
            <p style="font-family: ${
              isRetro ? "Space Mono, monospace" : "inherit"
            }; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; color: var(--color-text-secondary); margin-bottom: 2rem; display: flex; align-items: center; gap: 0.5rem; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  }">
              ${data.location}
            </p>
            `
                : ""
            }
            
            ${
              data.bio
                ? `
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
                    isBrutalist || isRetro ? "1.375rem" : "1.25rem"
                  }; line-height: ${
                    isElegant ? "1.9" : "1.8"
                  }; color: var(--color-text-secondary); max-width: 700px; margin-bottom: 3rem; font-weight: ${
                    isElegant ? "300" : "normal"
                  };">
              ${data.bio}
            </p>
            `
                : ""
            }

            <!-- CTA Buttons with Theme-Specific Styling -->
            <div class="cta-group" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3rem;">
              ${
                data.contactEmail
                  ? `
              <a href="mailto:${
                data.contactEmail
              }" class="btn btn-primary" style="padding: ${
                      isBrutalist
                        ? "1.5rem 3rem"
                        : isGradient || isNeumorphism
                        ? "1.125rem 2rem"
                        : isElegant
                        ? "1rem 2rem"
                        : isRetro
                        ? "1rem 2rem"
                        : "1rem 2rem"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist
                        ? "0"
                        : isGlassmorphism || isNeumorphism
                        ? "16px"
                        : isElegant
                        ? "0"
                        : "8px"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist || isRetro
                        ? "700"
                        : isNeumorphism
                        ? "600"
                        : "500"
                    }; transition: all ${
                      isBrutalist || isRetro ? "0.1s" : "0.2s"
                    }; display: inline-block; background: ${
                      isGradient
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.15)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                        : isElegant
                        ? "var(--color-accent)"
                        : "var(--color-accent)"
                    }; color: ${
                      isElegant
                        ? "white"
                        : isGlassmorphism
                        ? "var(--color-text)"
                        : isNeumorphism
                        ? "var(--color-text)"
                        : "white"
                    }; ${
                      isBrutalist
                        ? "text-transform: uppercase; border: 4px solid var(--color-text); background: var(--color-text); color: var(--color-bg); font-size: 1.125rem;"
                        : isRetro
                        ? "text-transform: uppercase; letter-spacing: 1px; font-size: 0.9375rem; box-shadow: 0 0 30px var(--color-accent); border: 2px solid var(--color-accent);"
                        : isElegant
                        ? "font-size: 0.9375rem; letter-spacing: 0.5px; border: 1px solid var(--color-accent);"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    } ${
                      isGradient
                        ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);"
                        : ""
                    }" 
                onmouseover="this.style.transform='translateY(-2px)'; ${
                  isBrutalist
                    ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                    : isGradient
                    ? `this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'`
                    : isRetro
                    ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 0 50px var(--color-accent)'`
                    : isElegant
                    ? `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                    : isGlassmorphism
                    ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.opacity='0.9'`
                }" 
                onmouseout="this.style.transform='translateY(0)'; ${
                  isBrutalist
                    ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                    : isGradient
                    ? `this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'`
                    : isRetro
                    ? `this.style.boxShadow='0 0 30px var(--color-accent)'`
                    : isElegant
                    ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                    : isGlassmorphism
                    ? `this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.opacity='1'`
                }">
                Get in Touch
              </a>
              `
                  : ""
              }
              
              ${
                data.socialLinks && data.socialLinks.length > 0
                  ? data.socialLinks
                      .slice(0, 1)
                      .map(
                        (link) => `
                <a href="${
                  link.url
                }" target="_blank" class="btn btn-secondary" style="padding: ${
                          isBrutalist
                            ? "1.5rem 3rem"
                            : isGradient || isNeumorphism
                            ? "1.125rem 2rem"
                            : isElegant
                            ? "1rem 2rem"
                            : isRetro
                            ? "1rem 2rem"
                            : "1rem 2rem"
                        }; border-radius: ${
                          isGradient || isRetro
                            ? "999px"
                            : isBrutalist
                            ? "0"
                            : isGlassmorphism || isNeumorphism
                            ? "16px"
                            : isElegant
                            ? "0"
                            : "8px"
                        }; text-decoration: none; font-weight: ${
                          isBrutalist || isRetro
                            ? "700"
                            : isNeumorphism
                            ? "600"
                            : "500"
                        }; transition: all 0.2s; display: inline-block; border: ${
                          isBrutalist
                            ? "4px"
                            : isRetro
                            ? "2px"
                            : isElegant
                            ? "1px"
                            : isGlassmorphism
                            ? "1px"
                            : "1px"
                        } solid ${
                          isBrutalist
                            ? "var(--color-text)"
                            : isRetro
                            ? "#00f5ff"
                            : isElegant
                            ? "var(--color-border)"
                            : isGlassmorphism
                            ? "rgba(255,255,255,0.1)"
                            : "var(--color-border)"
                        }; color: var(--color-text); background: ${
                          isBrutalist
                            ? "var(--color-bg)"
                            : isGlassmorphism
                            ? "rgba(255,255,255,0.05)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "transparent"
                        }; ${
                          isBrutalist || isRetro
                            ? "text-transform: uppercase; font-size: 1.125rem;"
                            : isElegant
                            ? "font-size: 0.9375rem; letter-spacing: 0.5px;"
                            : isRetro
                            ? "font-size: 0.9375rem; letter-spacing: 1px; box-shadow: 0 0 20px #00f5ff;"
                            : isGlassmorphism
                            ? "backdrop-filter: blur(10px);"
                            : isNeumorphism
                            ? getNeumorphismShadow(false)
                            : ""
                        }" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                      : isRetro
                      ? `this.style.background='#00f5ff'; this.style.color='#0d001a'; this.style.boxShadow='0 0 40px #00f5ff'`
                      : isElegant
                      ? `this.style.background='var(--color-surface)'; this.style.borderColor='var(--color-accent)'`
                      : isGlassmorphism
                      ? `this.style.background='rgba(255,255,255,0.1)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.background='var(--color-surface)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                      : isRetro
                      ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='0 0 20px #00f5ff'`
                      : isElegant
                      ? `this.style.background='transparent'; this.style.borderColor='var(--color-border)'`
                      : isGlassmorphism
                      ? `this.style.background='rgba(255,255,255,0.05)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.background='transparent'`
                  }">
                  View ${link.platform}
                </a>
              `
                      )
                      .join("")
                  : ""
              }
            </div>

            <!-- Social Links with Theme-Specific Styling -->
            ${
              data.socialLinks && data.socialLinks.length > 0
                ? `
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${data.socialLinks
                .map(
                  (link) => `
                <a href="${link.url}" target="_blank" style="padding: ${
                    isBrutalist
                      ? "1rem 1.5rem"
                      : isNeumorphism
                      ? "0.75rem 1.25rem"
                      : "0.5rem 1rem"
                  }; background: ${
                    isGradient
                      ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.05)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : isRetro
                      ? "rgba(255,47,181,0.05)"
                      : isBrutalist
                      ? "var(--color-bg)"
                      : "var(--color-surface)"
                  }; border: ${
                    isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                  } solid ${
                    isBrutalist || isRetro
                      ? "var(--color-accent)"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.1)"
                      : "var(--color-border)"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "12px"
                      : "8px"
                  }; color: var(--color-text-secondary); text-decoration: none; font-size: ${
                    isBrutalist || isRetro ? "1rem" : "0.875rem"
                  }; transition: all 0.2s; font-weight: ${
                    isBrutalist ? "700" : "500"
                  }; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  } ${
                    isGlassmorphism
                      ? "backdrop-filter: blur(10px);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                      : isRetro
                      ? `this.style.borderColor='var(--color-accent)'; this.style.color='var(--color-accent)'; this.style.boxShadow='0 0 20px var(--color-accent)'`
                      : isGlassmorphism
                      ? `this.style.borderColor='var(--color-accent)'; this.style.color='var(--color-text)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'; this.style.color='var(--color-accent)'`
                      : `this.style.borderColor='var(--color-accent)'; this.style.color='var(--color-text)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text-secondary)'`
                      : isRetro
                      ? `this.style.borderColor='var(--color-accent)'; this.style.color='var(--color-text-secondary)'; this.style.boxShadow='none'`
                      : isGlassmorphism
                      ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.color='var(--color-text-secondary)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'; this.style.color='var(--color-text-secondary)'`
                      : `this.style.borderColor='var(--color-border)'; this.style.color='var(--color-text-secondary)'`
                  }">
                  ${link.platform}
                </a>
              `
                )
                .join("")}
            </div>
            `
                : ""
            }
          </div>

          <!-- Stats with Theme-Specific Styling -->
          ${
            data.stats && data.stats.length > 0
              ? `
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; padding-top: 3rem; border-top: ${
            isBrutalist ? "4px" : isRetro ? "3px" : "1px"
          } solid ${
                  isBrutalist || isRetro
                    ? "var(--color-accent)"
                    : isNeumorphism || isGlassmorphism
                    ? "transparent"
                    : "var(--color-border)"
                };">
            ${data.stats
              .map(
                (stat, index) => `
              <div style="text-align: center; ${
                isNeumorphism
                  ? `padding: 2rem 1.5rem; border-radius: 20px; ${getNeumorphismShadow(
                      false
                    )}`
                  : isGlassmorphism
                  ? "padding: 2rem 1.5rem; border-radius: 20px; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);"
                  : isRetro
                  ? "padding: 2rem 1.5rem; border: 2px solid var(--color-accent); background: rgba(255,47,181,0.05);"
                  : ""
              } ${isNeumorphism ? "transition: all 0.3s;" : ""}" ${
                  isNeumorphism
                    ? `onmouseover="this.style.boxShadow='${getNeumorphismHoverShadow()}'" onmouseout="this.style.boxShadow='${getNeumorphismNormalShadow()}'"`
                    : isRetro
                    ? `onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 0 30px var(--color-accent)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"`
                    : ""
                }>
                <div style="font-size: ${
                  isBrutalist
                    ? "3rem"
                    : isRetro
                    ? "3rem"
                    : isNeumorphism || isGlassmorphism
                    ? "2.75rem"
                    : "2.5rem"
                }; font-weight: ${
                  isBrutalist
                    ? "900"
                    : isRetro || isNeumorphism || isGlassmorphism
                    ? "800"
                    : "800"
                }; margin-bottom: 0.5rem; ${
                  isGradient
                    ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                    : isRetro
                    ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                    : "color: var(--color-accent);"
                } ${isBrutalist ? "text-transform: uppercase;" : ""}">
                  ${stat.number}
                </div>
                <div style="font-size: ${
                  isBrutalist || isRetro ? "1rem" : "0.875rem"
                }; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; ${
                  isBrutalist || isRetro ? "font-weight: 700;" : ""
                }">
                  ${stat.label}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          `
              : ""
          }
          
          ${isNeumorphism ? `</div>` : ""}
        </div>
      </section>

      <!-- Experience Timeline with Theme-Specific Styling -->
      ${
        data.experience && data.experience.length > 0
          ? `
      <section class="experience" style="padding: ${
        isRetro || isElegant ? "8rem 0" : "6rem 0"
      }; background: ${
              isBrutalist
                ? "var(--color-text)"
                : isGradient
                ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
                : isRetro
                ? "var(--color-surface)"
                : isElegant
                ? "var(--color-surface)"
                : isGlassmorphism
                ? "rgba(255,255,255,0.02)"
                : "var(--color-surface)"
            }; ${
              isRetro
                ? "border-top: 3px solid var(--color-accent); border-bottom: 3px solid #00f5ff;"
                : isGlassmorphism
                ? "backdrop-filter: blur(20px);"
                : ""
            }">
        <div class="container" style="max-width: 900px;">
          <h2 style="font-family: ${
            isElegant ? "Playfair Display, serif" : "inherit"
          }; font-size: clamp(${
              isBrutalist || isRetro ? "2.5rem" : "2rem"
            }, 5vw, ${
              isBrutalist || isRetro ? "4rem" : "3rem"
            }); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : isElegant ? "600" : "700"
            }; margin-bottom: 3rem; letter-spacing: ${
              isRetro ? "3px" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
              isBrutalist
                ? "color: var(--color-bg);"
                : isGradient
                ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : isRetro
                ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : ""
            }">
            Experience
          </h2>
          <div class="timeline" style="display: flex; flex-direction: column; gap: 3rem; position: relative; padding-left: 2rem;">
            <!-- Timeline Line -->
            <div class="timeline-line" style="position: absolute; left: 0; top: 0; bottom: 0; width: ${
              isBrutalist ? "4px" : isRetro ? "3px" : "2px"
            }; background: ${
              isBrutalist || isRetro
                ? "var(--color-accent)"
                : isNeumorphism || isGlassmorphism
                ? "transparent"
                : "var(--color-border)"
            };"></div>
            
            ${data.experience
              .map(
                (job, index) => `
              <div style="position: relative;">
                <!-- Timeline Dot -->
                <div style="position: absolute; left: ${
                  isBrutalist ? "-2.5rem" : "-2.375rem"
                }; top: 0.25rem; width: ${
                  isBrutalist ? "18px" : "14px"
                }; height: ${
                  isBrutalist ? "18px" : "14px"
                }; background: var(--color-accent); border: ${
                  isBrutalist ? "4px" : "3px"
                } solid ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; ${
                  isBrutalist ? "" : "border-radius: 50%;"
                } z-index: 1;"></div>
                
                <div class="card" style="padding: ${
                  isBrutalist || isElegant
                    ? "2.5rem"
                    : isNeumorphism
                    ? "2.5rem"
                    : "2rem"
                }; border-radius: ${
                  isGradient
                    ? "20px"
                    : isBrutalist || isElegant
                    ? "0"
                    : isRetro
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "20px"
                    : "12px"
                }; border: ${
                  isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                } solid ${
                  isBrutalist
                    ? "var(--color-bg)"
                    : isRetro
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.1)"
                    : "var(--color-border)"
                }; background: ${
                  isBrutalist
                    ? "var(--color-bg)"
                    : isGradient
                    ? "linear-gradient(135deg, rgba(102,126,234,0.02), rgba(118,75,162,0.02))"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.05)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isRetro
                    ? "rgba(255,47,181,0.03)"
                    : "var(--color-bg)"
                }; transition: all ${
                  isBrutalist || isRetro ? "0.2s" : "0.3s"
                }; ${
                  isGlassmorphism
                    ? "backdrop-filter: blur(20px);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : ""
                }" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-bg)'`
                      : isGradient
                      ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.1)'`
                      : isRetro
                      ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.2)'`
                      : isGlassmorphism
                      ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                      : isGradient
                      ? `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isRetro
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isGlassmorphism
                      ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                  }">
                  <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;">
                    <div>
                      <h3 style="font-family: ${
                        isElegant ? "Playfair Display, serif" : "inherit"
                      }; font-size: ${
                  isBrutalist || isElegant
                    ? "1.625rem"
                    : isRetro
                    ? "1.375rem"
                    : "1.375rem"
                }; font-weight: ${
                  isBrutalist
                    ? "900"
                    : isRetro
                    ? "700"
                    : isElegant
                    ? "600"
                    : "600"
                }; margin-bottom: 0.25rem; ${
                  isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                }">
                        ${job.role || "Position"}
                      </h3>
                      <p style="font-size: ${
                        isBrutalist || isRetro ? "1.125rem" : "1rem"
                      }; color: var(--color-accent); font-weight: ${
                  isBrutalist ? "700" : "500"
                }; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 1px;"
                    : ""
                }">
                        ${job.company || "Company"}
                      </p>
                    </div>
                    <span style="font-size: ${
                      isBrutalist || isRetro ? "1rem" : "0.875rem"
                    }; color: var(--color-text-secondary); font-weight: ${
                  isBrutalist ? "700" : "500"
                }; white-space: nowrap; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 1px;"
                    : ""
                }">
                      ${job.period || ""}
                    </span>
                  </div>
                  ${
                    job.description
                      ? `
                  <p style="font-family: ${
                    isElegant
                      ? "Lato, sans-serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; color: ${
                          isBrutalist
                            ? "var(--color-text)"
                            : "var(--color-text-secondary)"
                        }; line-height: ${
                          isElegant ? "1.9" : "1.7"
                        }; font-size: ${
                          isBrutalist || isRetro
                            ? "1.125rem"
                            : isElegant
                            ? "1rem"
                            : "0.9375rem"
                        }; font-weight: ${isElegant ? "300" : "normal"};">
                    ${job.description}
                  </p>
                  `
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Skills with Theme-Specific Styling -->
      ${
        data.skills && data.skills.length > 0
          ? `
      <section class="skills" style="padding: ${
        isRetro || isElegant ? "8rem 0" : "6rem 0"
      };">
        <div class="container" style="max-width: 900px;">
          <h2 style="font-family: ${
            isElegant ? "Playfair Display, serif" : "inherit"
          }; font-size: clamp(${
              isBrutalist || isRetro ? "2.5rem" : "2rem"
            }, 5vw, ${
              isBrutalist || isRetro ? "4rem" : "3rem"
            }); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : isElegant ? "600" : "700"
            }; margin-bottom: 3rem; letter-spacing: ${
              isRetro ? "3px" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
              isGradient
                ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : isRetro
                ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : ""
            }">
            Skills & Expertise
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${data.skills
              .map(
                (skill) => `
              <span style="padding: ${
                isBrutalist
                  ? "1.25rem 2rem"
                  : isNeumorphism
                  ? "1rem 1.5rem"
                  : "0.75rem 1.25rem"
              }; background: ${
                  isGradient
                    ? "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.05)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isRetro
                    ? "rgba(255,47,181,0.05)"
                    : isBrutalist
                    ? "var(--color-bg)"
                    : "var(--color-surface)"
                }; border: ${
                  isBrutalist ? "3px" : isRetro ? "2px" : "2px"
                } solid ${
                  isBrutalist || isRetro
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.1)"
                    : "var(--color-border)"
                }; border-radius: ${
                  isGradient || isRetro
                    ? "999px"
                    : isBrutalist
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "16px"
                    : "8px"
                }; font-weight: ${
                  isBrutalist ? "900" : isRetro ? "700" : "600"
                }; font-size: ${
                  isBrutalist || isRetro ? "1.125rem" : "0.9375rem"
                }; transition: all ${
                  isBrutalist || isRetro ? "0.1s" : "0.2s"
                }; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 1px;"
                    : ""
                } ${
                  isGlassmorphism
                    ? "backdrop-filter: blur(10px);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : ""
                }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                    : isGradient
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.15)'`
                    : isRetro
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-3px)'; this.style.boxShadow='0 0 20px var(--color-accent)'`
                    : isGlassmorphism
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'; this.style.transform='translateY(-2px)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                    : isGradient
                    ? `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                    : isRetro
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                    : isGlassmorphism
                    ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'; this.style.transform='translateY(0)'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                }">
                ${skill}
              </span>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Projects with Theme-Specific Styling -->
      ${
        data.projects && data.projects.length > 0
          ? `
      <section class="projects" style="padding: ${
        isRetro || isElegant ? "8rem 0" : "6rem 0"
      }; background: ${
              isBrutalist
                ? "var(--color-text)"
                : isGradient
                ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
                : isRetro
                ? "var(--color-surface)"
                : isElegant
                ? "var(--color-surface)"
                : isGlassmorphism
                ? "rgba(255,255,255,0.02)"
                : "var(--color-surface)"
            }; ${
              isRetro
                ? "border-top: 3px solid var(--color-accent); border-bottom: 3px solid #00f5ff;"
                : isGlassmorphism
                ? "backdrop-filter: blur(20px);"
                : ""
            }">
        <div class="container" style="max-width: 1100px;">
          <h2 style="font-family: ${
            isElegant ? "Playfair Display, serif" : "inherit"
          }; font-size: clamp(${
              isBrutalist || isRetro ? "2.5rem" : "2rem"
            }, 5vw, ${
              isBrutalist || isRetro ? "4rem" : "3rem"
            }); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : isElegant ? "600" : "700"
            }; margin-bottom: 3rem; letter-spacing: ${
              isRetro ? "3px" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
              isBrutalist
                ? "color: var(--color-bg);"
                : isGradient
                ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : isRetro
                ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : ""
            }">
            Featured Work
          </h2>
          <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
            isBrutalist || isElegant ? "320px" : "300px"
          }, 1fr)); gap: ${isElegant ? "3rem" : "2rem"};">
            ${data.projects
              .map(
                (project) => `
              <div class="card" style="padding: ${
                isBrutalist || isElegant ? "2.5rem" : "2rem"
              }; display: flex; flex-direction: column; height: 100%; border-radius: ${
                  isGradient
                    ? "20px"
                    : isBrutalist || isElegant
                    ? "0"
                    : isRetro
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "20px"
                    : "12px"
                }; border: ${
                  isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                } solid ${
                  isBrutalist
                    ? "var(--color-bg)"
                    : isRetro
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.1)"
                    : "var(--color-border)"
                }; transition: all ${
                  isBrutalist || isRetro ? "0.2s" : "0.3s"
                }; background: ${
                  isBrutalist
                    ? "var(--color-bg)"
                    : isGradient
                    ? "linear-gradient(135deg, rgba(102,126,234,0.02), rgba(118,75,162,0.02))"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.05)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isRetro
                    ? "rgba(255,47,181,0.03)"
                    : "var(--color-bg)"
                }; ${
                  isGlassmorphism
                    ? "backdrop-filter: blur(20px);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : ""
                }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-bg)'`
                    : isGradient
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.1)'`
                    : isRetro
                    ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.2)'`
                    : isGlassmorphism
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isGradient
                    ? `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                    : isRetro
                    ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                    : isGlassmorphism
                    ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                }">
                <h3 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: ${
                  isBrutalist || isElegant
                    ? "1.875rem"
                    : isRetro
                    ? "1.5rem"
                    : "1.625rem"
                }; font-weight: ${
                  isBrutalist
                    ? "900"
                    : isRetro
                    ? "700"
                    : isElegant
                    ? "600"
                    : "700"
                }; margin-bottom: 1rem; letter-spacing: ${
                  isRetro ? "1px" : "-0.01em"
                }; ${
                  isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                } ${isBrutalist ? "color: var(--color-text);" : ""}">
                  ${project.title || "Project"}
                </h3>
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; color: ${
                  isBrutalist
                    ? "var(--color-text)"
                    : "var(--color-text-secondary)"
                }; line-height: ${
                  isElegant ? "1.9" : "1.8"
                }; margin-bottom: 1.5rem; font-size: ${
                  isBrutalist || isRetro
                    ? "1.125rem"
                    : isElegant
                    ? "1rem"
                    : "1rem"
                }; flex-grow: 1; font-weight: ${isElegant ? "300" : "normal"};">
                  ${project.description || ""}
                </p>
                ${
                  project.tags
                    ? `
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                  ${project.tags
                    .split(",")
                    .map(
                      (tag) => `
                    <span style="padding: ${
                      isBrutalist ? "0.5rem 0.75rem" : "0.375rem 0.75rem"
                    }; background: ${
                        isBrutalist
                          ? "var(--color-text)"
                          : isGradient
                          ? "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.05)"
                          : isNeumorphism
                          ? "var(--color-surface)"
                          : isRetro
                          ? "rgba(255,47,181,0.05)"
                          : "var(--color-bg)"
                      }; border: 1px solid ${
                        isBrutalist
                          ? "var(--color-text)"
                          : isRetro
                          ? "var(--color-accent)"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.1)"
                          : "var(--color-border)"
                      }; border-radius: ${
                        isGradient || isRetro
                          ? "999px"
                          : isBrutalist
                          ? "0"
                          : isNeumorphism || isGlassmorphism
                          ? "8px"
                          : "6px"
                      }; font-size: ${
                        isBrutalist || isRetro ? "0.875rem" : "0.75rem"
                      }; color: ${
                        isBrutalist
                          ? "var(--color-bg)"
                          : "var(--color-text-secondary)"
                      }; font-weight: ${
                        isBrutalist ? "900" : isRetro ? "700" : "600"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      } ${
                        isGlassmorphism ? "backdrop-filter: blur(10px);" : ""
                      }">
                      ${tag.trim()}
                    </span>
                  `
                    )
                    .join("")}
                </div>
                `
                    : ""
                }
                ${
                  project.link
                    ? `
                <a href="${
                  project.link
                }" target="_blank" style="align-self: flex-start; padding: ${
                        isBrutalist ? "1rem 1.5rem" : "0.75rem 1.5rem"
                      }; border-radius: ${
                        isGradient || isRetro
                          ? "999px"
                          : isBrutalist
                          ? "0"
                          : isNeumorphism || isGlassmorphism
                          ? "12px"
                          : "8px"
                      }; text-decoration: none; font-weight: ${
                        isBrutalist || isRetro ? "700" : "500"
                      }; transition: all 0.2s; border: ${
                        isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                      } solid ${
                        isBrutalist
                          ? "var(--color-text)"
                          : isRetro
                          ? "var(--color-accent)"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.1)"
                          : "var(--color-border)"
                      }; color: ${
                        isBrutalist ? "var(--color-bg)" : "var(--color-text)"
                      }; font-size: ${
                        isBrutalist || isRetro ? "1rem" : "0.875rem"
                      }; background: ${
                        isBrutalist
                          ? "var(--color-text)"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "transparent"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      } ${
                        isGlassmorphism
                          ? "backdrop-filter: blur(10px);"
                          : isNeumorphism
                          ? getNeumorphismShadow(false)
                          : ""
                      }" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                      : isRetro
                      ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'; this.style.boxShadow='0 0 20px var(--color-accent)'`
                      : isGlassmorphism
                      ? `this.style.background='rgba(255,255,255,0.1)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.background='var(--color-surface)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                      : isRetro
                      ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='none'`
                      : isGlassmorphism
                      ? `this.style.background='rgba(255,255,255,0.05)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.background='transparent'`
                  }">
                  View Project →
                </a>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Testimonials with Theme-Specific Styling -->
      ${
        data.testimonials && data.testimonials.length > 0
          ? `
      <section class="testimonials" style="padding: ${
        isRetro || isElegant ? "8rem 0" : "6rem 0"
      };">
        <div class="container" style="max-width: 1100px;">
          <h2 style="font-family: ${
            isElegant ? "Playfair Display, serif" : "inherit"
          }; font-size: clamp(${
              isBrutalist || isRetro ? "2.5rem" : "2rem"
            }, 5vw, ${
              isBrutalist || isRetro ? "4rem" : "3rem"
            }); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : isElegant ? "600" : "700"
            }; margin-bottom: 3rem; letter-spacing: ${
              isRetro ? "3px" : "-0.02em"
            }; text-align: center; ${
              isBrutalist || isRetro ? "text-transform: uppercase;" : ""
            } ${
              isGradient
                ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : isRetro
                ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : ""
            }">
            What People Say
          </h2>
          <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
            isBrutalist || isElegant ? "320px" : "300px"
          }, 1fr)); gap: ${isElegant ? "3rem" : "2rem"};">
            ${data.testimonials
              .map(
                (testimonial) => `
              <div class="card" style="padding: ${
                isBrutalist || isElegant ? "2.5rem" : "2rem"
              }; border-radius: ${
                  isGradient
                    ? "20px"
                    : isBrutalist || isElegant
                    ? "0"
                    : isRetro
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "20px"
                    : "12px"
                }; border: ${
                  isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                } solid ${
                  isBrutalist || isRetro
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.1)"
                    : "var(--color-border)"
                }; transition: all ${
                  isBrutalist || isRetro ? "0.2s" : "0.3s"
                }; background: ${
                  isGradient
                    ? "linear-gradient(135deg, rgba(102,126,234,0.02), rgba(118,75,162,0.02))"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.05)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isRetro
                    ? "rgba(255,47,181,0.03)"
                    : "var(--color-bg)"
                }; ${
                  isGlassmorphism
                    ? "backdrop-filter: blur(20px);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : ""
                }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-accent)'`
                    : isGradient
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.1)'`
                    : isRetro
                    ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.2)'`
                    : isGlassmorphism
                    ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isGradient
                    ? `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                    : isRetro
                    ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                    : isGlassmorphism
                    ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                }">
                <p style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: ${
                  isBrutalist || isRetro
                    ? "1.375rem"
                    : isElegant
                    ? "1.25rem"
                    : "1.125rem"
                }; line-height: ${
                  isElegant ? "1.9" : "1.8"
                }; margin-bottom: 2rem; font-style: ${
                  isElegant ? "italic" : "normal"
                }; color: var(--color-text); font-weight: ${
                  isBrutalist ? "700" : "normal"
                };">
                  "${testimonial.quote || ""}"
                </p>
                <div style="display: flex; align-items: center; gap: 1rem; padding-top: 1.5rem; border-top: ${
                  isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                } solid ${
                  isBrutalist || isRetro
                    ? "var(--color-accent)"
                    : isNeumorphism || isGlassmorphism
                    ? "transparent"
                    : "var(--color-border)"
                };">
                  <div style="width: 48px; height: 48px; ${
                    isBrutalist ? "" : "border-radius: 50%;"
                  } background: var(--color-accent); opacity: 0.2;"></div>
                  <div>
                    <h4 style="font-weight: ${
                      isBrutalist ? "900" : isRetro ? "700" : "600"
                    }; margin-bottom: 0.25rem; font-size: ${
                  isBrutalist || isRetro ? "1.125rem" : "0.9375rem"
                }; ${
                  isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                }">
                      ${testimonial.author || ""}
                    </h4>
                    <p style="color: var(--color-text-secondary); font-size: ${
                      isBrutalist || isRetro ? "1rem" : "0.875rem"
                    }; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 1px; font-weight: 700;"
                    : ""
                }">
                      ${testimonial.role || ""}
                    </p>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Contact CTA with Theme-Specific Styling -->
      <section id="contact" class="contact" style="padding: 8rem 0 6rem; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
          : isElegant
          ? "var(--color-surface)"
          : isGlassmorphism
          ? "transparent"
          : "var(--color-surface)"
      }; text-align: center; ${
        isBrutalist || isGradient || isRetro ? "color: white;" : ""
      } ${
        isElegant
          ? "border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);"
          : isRetro
          ? "border-radius: 20px; margin: 0 2rem; box-shadow: 0 20px 60px rgba(255,47,181,0.4);"
          : ""
      }">
        <div class="container" style="max-width: ${
          isNeumorphism || isGlassmorphism ? "800px" : "700px"
        }; ${
        isGlassmorphism || isNeumorphism
          ? `padding: 5rem 3rem!important; border-radius: 32px; ${
              isGlassmorphism
                ? "background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1);"
                : getNeumorphismShadow(false)
            }`
          : ""
      }">
          ${
            isBrutalist
              ? `
          <h2 style="font-size: clamp(2.5rem, 6vw, 5rem); text-transform: uppercase; font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -0.03em; color: var(--color-bg);">
            WORK TOGETHER
          </h2>
          `
              : isElegant
              ? `
          <h2 style="font-family: Playfair Display, serif; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 600; margin-bottom: 1.5rem; letter-spacing: -0.03em; color: var(--color-text);">
            Let's Work Together
          </h2>
          `
              : isRetro
              ? `
          <h2 style="font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
            JOIN THE TEAM
          </h2>
          `
              : `
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: ${
            isNeumorphism || isGlassmorphism ? "800" : "800"
          }; margin-bottom: 1.5rem; letter-spacing: -0.03em; color: ${
                  isGradient || isRetro ? "white" : "var(--color-text)"
                };">
            Let's Work Together
          </h2>
          `
          }
          
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist || isRetro ? "1.5rem" : isElegant ? "1.125rem" : "1.25rem"
      }; color: ${
        isBrutalist
          ? "var(--color-bg)"
          : isGradient || isRetro
          ? "rgba(255,255,255,0.9)"
          : "var(--color-text-secondary)"
      }; margin-bottom: 3rem; line-height: 1.7; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Have a project in mind? Let's create something amazing together.
          </p>
          
          ${
            data.contactEmail
              ? `
          <a href="mailto:${
            data.contactEmail
          }" class="btn btn-primary" style="padding: ${
                  isBrutalist ? "1.5rem 3rem" : "1.25rem 3rem"
                }; font-size: ${
                  isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                }; border-radius: ${
                  isGradient || isRetro
                    ? "999px"
                    : isBrutalist
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "16px"
                    : isElegant
                    ? "0"
                    : "8px"
                }; text-decoration: none; font-weight: ${
                  isBrutalist || isRetro ? "700" : "500"
                }; transition: all 0.2s; display: inline-block; background: ${
                  isBrutalist || isGradient || isRetro
                    ? "white"
                    : isGlassmorphism
                    ? "rgba(255,255,255,0.15)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isElegant
                    ? "var(--color-accent)"
                    : "var(--color-accent)"
                }; color: ${
                  isBrutalist
                    ? "var(--color-accent)"
                    : isGradient
                    ? "#667eea"
                    : isRetro
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "var(--color-text)"
                    : isNeumorphism
                    ? "var(--color-text)"
                    : isElegant
                    ? "white"
                    : "white"
                }; ${
                  isBrutalist
                    ? "text-transform: uppercase; border: 4px solid white;"
                    : isRetro
                    ? "text-transform: uppercase; letter-spacing: 1px; border: 2px solid white;"
                    : isElegant
                    ? "letter-spacing: 0.5px; border: 1px solid var(--color-accent);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : ""
                }" 
            onmouseover="this.style.transform='translateY(-2px)'; ${
              isBrutalist
                ? `this.style.background='transparent'; this.style.color='white'`
                : isRetro
                ? `this.style.background='transparent'; this.style.color='white'; this.style.borderColor='white'`
                : isElegant
                ? `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                : isGradient
                ? `this.style.transform='scale(1.05)'`
                : isGlassmorphism
                ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'`
                : isNeumorphism
                ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                : `this.style.opacity='0.9'`
            }" 
            onmouseout="this.style.transform='translateY(0)'; ${
              isBrutalist
                ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                : isRetro
                ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                : isElegant
                ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                : isGradient
                ? `this.style.transform='scale(1)'`
                : isGlassmorphism
                ? `this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'`
                : isNeumorphism
                ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                : `this.style.opacity='1'`
            }">
            Get in Touch
          </a>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer with Theme-Specific Styling -->
      <footer style="padding: ${
        isBrutalist ? "4rem 0" : isRetro ? "3rem 0" : "3rem 0"
      }; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-text);"
          : isRetro
          ? "margin-top: 3rem; border-top: 3px solid var(--color-accent);"
          : isElegant
          ? "border-top: 1px solid var(--color-border);"
          : "border-top: 1px solid var(--color-border);"
      } text-align: center; color: var(--color-text-secondary); font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.875rem"
      }; font-weight: ${isBrutalist ? "900" : isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 2px;"
          : ""
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); background: rgba(255,255,255,0.02);"
          : ""
      }">
        <div class="container">
          <p>© 2024 ${data.name || "Your Name"}. ${
        isBrutalist
          ? "DESIGNED WITH POWER."
          : isRetro
          ? "DESIGNED WITH VIBES."
          : "Designed with care."
      }</p>
        </div>
      </footer>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 20px 20px 60px #c5c9ce, inset -20px -20px 60px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 32px 32px 64px #2a2d34, inset -32px -32px 64px #383d46;
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
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
        
        /* Retro glitch effect */
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch::before {
          animation: glitch1 2s infinite;
          color: var(--color-accent);
          z-index: -1;
        }
        
        .glitch::after {
          animation: glitch2 3s infinite;
          color: #00f5ff;
          z-index: -2;
        }
        
        @keyframes glitch1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        @keyframes glow {
          from { filter: drop-shadow(0 0 10px var(--color-accent)); }
          to { filter: drop-shadow(0 0 30px #00f5ff); }
        }
        `
            : ""
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          header { position: ${
            isBrutalist ? "relative" : "relative"
          } !important; }
          .container { padding: 0 1.5rem !important; }
          .hero { padding: 5rem 0 4rem !important; min-height: auto !important; }
          ${
            isNeumorphism
              ? `.hero-content { padding: 3rem 2rem !important; }`
              : ""
          }
          ${
            isNeumorphism
              ? `nav > div { padding: 1rem 1.5rem !important; }`
              : ""
          }
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
    `;
    },
  }),

  // ============================================
  // TEMPLATE 3: RESTAURANT
  // ============================================
  restaurant: new Template("restaurant", {
    name: "Restaurant",
    description: "Beautiful restaurant website with menu and reservation",
    image: "restaurant",
    category: "Restaurant",
    fields: {
      restaurantName: {
        type: "text",
        default: "Bella Cucina",
        label: "Restaurant Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "Authentic Italian Cuisine",
        label: "Tagline",
      },
      description: {
        type: "textarea",
        default:
          "Experience the heart of Italy in every bite. Our chefs bring generations of tradition to your table.",
        label: "Restaurant Description",
      },
      address: {
        type: "text",
        default: "123 Main Street, Downtown",
        label: "Address",
      },
      phone: { type: "tel", default: "(555) 123-4567", label: "Phone" },
      email: { type: "email", default: "info@bellacucina.com", label: "Email" },
      hours: {
        type: "group",
        label: "Hours",
        itemLabel: "Day",
        min: 0,
        max: 7,
        fields: {
          day: { type: "text", label: "Day", default: "" },
          hours: { type: "text", label: "Hours", default: "" },
        },
        default: [
          { day: "Mon-Thu", hours: "11:00 AM - 10:00 PM" },
          { day: "Fri-Sat", hours: "11:00 AM - 11:00 PM" },
          { day: "Sunday", hours: "12:00 PM - 9:00 PM" },
        ],
      },
      menuCategories: {
        type: "group",
        label: "Menu Categories",
        itemLabel: "Category",
        min: 1,
        max: 6,
        fields: {
          category: { type: "text", label: "Category Name", default: "" },
          items: {
            type: "group",
            label: "Items",
            itemLabel: "Item",
            fields: {
              name: { type: "text", label: "Item Name", default: "" },
              description: {
                type: "textarea",
                label: "Description",
                default: "",
              },
              price: { type: "text", label: "Price", default: "" },
            },
          },
        },
        default: [
          {
            category: "Appetizers",
            items: [
              {
                name: "Bruschetta",
                description:
                  "Toasted bread with tomatoes, basil, and olive oil",
                price: "$12",
              },
              {
                name: "Caprese Salad",
                description: "Fresh mozzarella, tomatoes, and basil",
                price: "$14",
              },
            ],
          },
          {
            category: "Main Courses",
            items: [
              {
                name: "Spaghetti Carbonara",
                description:
                  "Classic Roman pasta with eggs, cheese, and pancetta",
                price: "$22",
              },
              {
                name: "Margherita Pizza",
                description:
                  "San Marzano tomatoes, mozzarella, and fresh basil",
                price: "$18",
              },
            ],
          },
        ],
      },
      specialties: {
        type: "group",
        label: "Chef Specialties",
        itemLabel: "Specialty",
        min: 0,
        max: 3,
        fields: {
          name: { type: "text", label: "Dish Name", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
          price: { type: "text", label: "Price", default: "" },
        },
        default: [
          {
            name: "Osso Buco",
            description: "Slow-braised veal shanks with saffron risotto",
            price: "$38",
          },
        ],
      },
      reservationUrl: {
        type: "url",
        default: "",
        label: "Reservation URL (optional)",
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Neumorphism box-shadow helpers
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
      <!-- Header with Theme-Specific Styling -->
      <header style="padding: ${
        isBrutalist
          ? "2rem 0"
          : isElegant
          ? "1.5rem 0"
          : isNeumorphism
          ? "2rem 0"
          : "1.5rem 0"
      }; border-bottom: ${
        isBrutalist ? "4px" : isRetro ? "3px" : "1px"
      } solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isNeumorphism || isGlassmorphism
          ? "transparent"
          : "var(--color-border)"
      }; position: sticky; top: 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "none"
          : "var(--color-bg)"
      }; z-index: 100; backdrop-filter: blur(${
        isGlassmorphism ? "20px" : isNeumorphism ? "0px" : "10px"
      }); ${
        isGlassmorphism ? "box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);" : ""
      }">
        <div class="container">
          <nav style="${
            isNeumorphism
              ? `background: var(--color-bg); padding: 1rem 1.5rem; border-radius: 16px; ${getNeumorphismShadow(
                  false
                )} display: flex; justify-content: space-between; align-items: center;`
              : "display: flex; justify-content: space-between; align-items: center;"
          }">
            <div style="font-weight: ${
              isBrutalist ? "900" : isElegant ? "700" : "700"
            }; font-size: ${
        isBrutalist
          ? "1.75rem"
          : isRetro
          ? "1.5rem"
          : isElegant
          ? "1.5rem"
          : "1.375rem"
      }; letter-spacing: ${isBrutalist || isRetro ? "2px" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isElegant
          ? "font-family: Playfair Display, serif; color: var(--color-accent);"
          : ""
      }">
              ${data.restaurantName || "Restaurant"}
            </div>
            <div style="display: flex; align-items: center; gap: 2rem;">
              <ul class="nav-links" style="display: flex; gap: ${
                isBrutalist || isRetro ? "2.5rem" : "2rem"
              }; list-style: none; margin: 0;">
                <li><a href="#menu" style="color: var(--color-text-secondary); text-decoration: none; font-size: ${
                  isBrutalist || isRetro ? "1rem" : "0.9375rem"
                }; font-weight: ${
        isBrutalist ? "700" : isRetro ? "600" : "500"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">Menu</a></li>
                <li><a href="#about" style="color: var(--color-text-secondary); text-decoration: none; font-size: ${
                  isBrutalist || isRetro ? "1rem" : "0.9375rem"
                }; font-weight: ${
        isBrutalist ? "700" : isRetro ? "600" : "500"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">About</a></li>
                <li><a href="#contact" style="color: var(--color-text-secondary); text-decoration: none; font-size: ${
                  isBrutalist || isRetro ? "1rem" : "0.9375rem"
                }; font-weight: ${
        isBrutalist ? "700" : isRetro ? "600" : "500"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">Contact</a></li>
              </ul>
              <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
                isNeumorphism
                  ? `padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: var(--neomorph-shadow-out);`
                  : ""
              }">
                <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
                <span class="theme-toggle-slider"></span>
              </label>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <!-- Hero with Theme-Specific Styling -->
        <section class="hero" style="padding: ${
          isBrutalist || isRetro ? "10rem 0 8rem" : "8rem 0 6rem"
        }; text-align: center; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
          : isRetro
          ? "var(--color-surface)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.02)"
          : "var(--color-surface)"
      }; border-bottom: ${
        isBrutalist ? "4px" : isRetro ? "3px" : "1px"
      } solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isNeumorphism || isGlassmorphism
          ? "transparent"
          : "var(--color-border)"
      }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px);"
          : isRetro
          ? "border-top: 3px solid #00f5ff;"
          : ""
      }">
          <div class="container" style="max-width: 900px; ${
            isNeumorphism
              ? `padding: 4rem 3rem; border-radius: 32px; ${getNeumorphismShadow(
                  false
                )}`
              : ""
          }">
            <h1 ${
              isRetro
                ? `class="glitch" data-text="${
                    data.restaurantName || "Restaurant"
                  }"`
                : ""
            } style="font-family: ${
        isElegant ? "Playfair Display, serif" : "inherit"
      }; font-size: clamp(${isBrutalist || isRetro ? "3.5rem" : "3rem"}, 8vw, ${
        isBrutalist || isRetro ? "7rem" : "5.5rem"
      }); font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "800"
      }; line-height: 1; letter-spacing: ${
        isRetro ? "3px" : "-0.03em"
      }; margin-bottom: 1.5rem; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isBrutalist
          ? "color: var(--color-bg);"
          : isRetro
          ? "position: relative;"
          : ""
      }">
              ${
                isBrutalist
                  ? (data.restaurantName || "Restaurant")
                      .split(" ")
                      .map((word, i) =>
                        i === 0
                          ? `<span style="background: var(--color-accent); color: var(--color-bg); padding: 0 0.5rem; display: inline-block; transform: rotate(-1deg);">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${
                isGradient
                  ? (data.restaurantName || "Restaurant")
                      .split(" ")
                      .map((word, i) =>
                        i ===
                        (data.restaurantName || "Restaurant").split(" ")
                          .length -
                          1
                          ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${
                isRetro
                  ? `<span style="background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: glow 2s ease-in-out infinite alternate;">${
                      data.restaurantName || "Restaurant"
                    }</span>`
                  : ""
              }
              ${
                !isBrutalist && !isGradient && !isRetro
                  ? data.restaurantName || "Restaurant"
                  : ""
              }
            </h1>
            ${
              data.tagline
                ? `
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(${
                    isBrutalist || isRetro ? "1.5rem" : "1.25rem"
                  }, 3vw, ${
                    isBrutalist || isRetro ? "2.25rem" : "1.75rem"
                  }); color: ${
                    isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
                  }; margin-bottom: 2rem; font-weight: ${
                    isBrutalist ? "800" : isElegant ? "400" : "600"
                  }; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 2px;"
                      : ""
                  }">
              ${data.tagline}
            </p>
            `
                : ""
            }
            ${
              data.description
                ? `
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
                    isBrutalist || isRetro ? "1.375rem" : "1.25rem"
                  }; color: ${
                    isBrutalist
                      ? "var(--color-bg)"
                      : "var(--color-text-secondary)"
                  }; max-width: 700px; margin: 0 auto 3rem; line-height: ${
                    isElegant ? "1.9" : "1.8"
                  }; font-weight: ${isElegant ? "300" : "normal"};">
              ${data.description}
            </p>
            `
                : ""
            }
            <div class="cta-group" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              ${
                data.reservationUrl
                  ? `
              <a href="${
                data.reservationUrl
              }" target="_blank" class="btn btn-primary" style="padding: ${
                      isBrutalist
                        ? "1.5rem 3rem"
                        : isGradient || isNeumorphism
                        ? "1.125rem 2.5rem"
                        : "1rem 2.5rem"
                    }; font-size: ${
                      isBrutalist || isRetro ? "1.125rem" : "1rem"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "16px"
                        : isElegant
                        ? "0"
                        : "8px"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist || isRetro ? "700" : "500"
                    }; transition: all ${
                      isBrutalist || isRetro ? "0.1s" : "0.2s"
                    }; display: inline-block; background: ${
                      isGradient
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.15)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                        : isElegant || isBrutalist
                        ? "var(--color-accent)"
                        : "var(--color-accent)"
                    }; color: ${
                      isElegant || isBrutalist
                        ? "white"
                        : isGlassmorphism
                        ? "var(--color-text)"
                        : isNeumorphism
                        ? "var(--color-text)"
                        : "white"
                    }; ${
                      isBrutalist
                        ? "text-transform: uppercase; border: 4px solid var(--color-accent);"
                        : isRetro
                        ? "text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 30px var(--color-accent); border: 2px solid var(--color-accent);"
                        : isElegant
                        ? "letter-spacing: 0.5px; border: 1px solid var(--color-accent);"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    } ${
                      isGradient
                        ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);"
                        : ""
                    }" 
                onmouseover="this.style.transform='translateY(-2px)'; ${
                  isBrutalist
                    ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                    : isGradient
                    ? `this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'`
                    : isRetro
                    ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 0 50px var(--color-accent)'`
                    : isElegant
                    ? `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                    : isGlassmorphism
                    ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.opacity='0.9'`
                }" 
                onmouseout="this.style.transform='translateY(0)'; ${
                  isBrutalist
                    ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                    : isGradient
                    ? `this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'`
                    : isRetro
                    ? `this.style.boxShadow='0 0 30px var(--color-accent)'`
                    : isElegant
                    ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                    : isGlassmorphism
                    ? `this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.opacity='1'`
                }">
                Reserve a Table
              </a>
              `
                  : ""
              }
              <a href="#menu" class="btn btn-secondary" style="padding: ${
                isBrutalist
                  ? "1.5rem 3rem"
                  : isGradient || isNeumorphism
                  ? "1.125rem 2.5rem"
                  : "1rem 2.5rem"
              }; font-size: ${
        isBrutalist || isRetro ? "1.125rem" : "1rem"
      }; border-radius: ${
        isGradient || isRetro
          ? "999px"
          : isBrutalist
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "16px"
          : isElegant
          ? "0"
          : "8px"
      }; text-decoration: none; font-weight: ${
        isBrutalist || isRetro ? "700" : "500"
      }; transition: all 0.2s; display: inline-block; border: ${
        isBrutalist ? "4px" : isRetro ? "2px" : "1px"
      } solid ${
        isBrutalist
          ? "var(--color-bg)"
          : isRetro
          ? "#00f5ff"
          : isElegant
          ? "var(--color-border)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.1)"
          : "var(--color-border)"
      }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text)"
      }; background: ${
        isBrutalist
          ? "transparent"
          : isGlassmorphism
          ? "rgba(255,255,255,0.05)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "transparent"
      }; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase;"
          : isElegant
          ? "letter-spacing: 0.5px;"
          : isRetro
          ? "letter-spacing: 1px; box-shadow: 0 0 20px #00f5ff;"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : ""
      }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                    : isRetro
                    ? `this.style.background='#00f5ff'; this.style.color='#0d001a'; this.style.boxShadow='0 0 40px #00f5ff'`
                    : isElegant
                    ? `this.style.background='var(--color-surface)'; this.style.borderColor='var(--color-accent)'`
                    : isGlassmorphism
                    ? `this.style.background='rgba(255,255,255,0.1)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.background='var(--color-surface)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                    : isRetro
                    ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='0 0 20px #00f5ff'`
                    : isElegant
                    ? `this.style.background='transparent'; this.style.borderColor='var(--color-border)'`
                    : isGlassmorphism
                    ? `this.style.background='rgba(255,255,255,0.05)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.background='transparent'`
                }">
                View Menu
              </a>
            </div>
          </div>
        </section>

        <!-- Chef's Specialties with Theme-Specific Styling -->
        ${
          data.specialties && data.specialties.length > 0
            ? `
        <section class="specialties" style="padding: ${
          isRetro || isElegant ? "8rem 0" : "6rem 0"
        };">
          <div class="container" style="max-width: 1100px;">
            <h2 style="font-family: ${
              isElegant ? "Playfair Display, serif" : "inherit"
            }; font-size: clamp(${
                isBrutalist || isRetro ? "2.5rem" : "2.5rem"
              }, 6vw, ${
                isBrutalist || isRetro ? "4rem" : "3.5rem"
              }); font-weight: ${
                isBrutalist ? "900" : isRetro ? "700" : "700"
              }; text-align: center; margin-bottom: 1rem; letter-spacing: ${
                isRetro ? "3px" : "-0.02em"
              }; ${
                isBrutalist || isRetro ? "text-transform: uppercase;" : ""
              } ${
                isGradient
                  ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                  : isRetro
                  ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                  : ""
              }">
              Chef's Specialties
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 4rem; font-size: ${
                isBrutalist || isRetro ? "1.25rem" : "1.125rem"
              }; font-weight: ${isElegant ? "300" : "normal"};">
              Our signature dishes, crafted with passion
            </p>
            <div class="specialties-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
              isBrutalist || isElegant ? "300px" : "280px"
            }, 1fr)); gap: ${isElegant ? "3rem" : "2rem"};">
              ${data.specialties
                .map(
                  (dish) => `
                <div class="card" style="padding: ${
                  isBrutalist || isElegant ? "2.5rem" : "2rem"
                }; text-align: center; border-radius: ${
                    isGradient
                      ? "20px"
                      : isBrutalist || isElegant
                      ? "0"
                      : isRetro
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "20px"
                      : "12px"
                  }; border: ${
                    isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                  } solid ${
                    isBrutalist || isRetro
                      ? "var(--color-accent)"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.1)"
                      : "var(--color-border)"
                  }; background: ${
                    isGradient
                      ? "linear-gradient(135deg, rgba(102,126,234,0.02), rgba(118,75,162,0.02))"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.05)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : isRetro
                      ? "rgba(255,47,181,0.03)"
                      : "var(--color-bg)"
                  }; transition: all ${
                    isBrutalist || isRetro ? "0.2s" : "0.3s"
                  }; ${
                    isGlassmorphism
                      ? "backdrop-filter: blur(20px);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-accent)'`
                      : isGradient
                      ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.1)'`
                      : isRetro
                      ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.2)'`
                      : isGlassmorphism
                      ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                      : isGradient
                      ? `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isRetro
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isGlassmorphism
                      ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                  }">
                  <div style="width: 80px; height: 80px; background: var(--color-accent); ${
                    isBrutalist ? "" : "border-radius: 50%;"
                  } margin: 0 auto 1.5rem; opacity: 0.1;"></div>
                  <h3 style="font-family: ${
                    isElegant ? "Playfair Display, serif" : "inherit"
                  }; font-size: ${
                    isBrutalist ? "1.75rem" : isRetro ? "1.375rem" : "1.5rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : isRetro ? "700" : "700"
                  }; margin-bottom: 1rem; ${
                    isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                  }">${dish.name || ""}</h3>
                  <p style="font-family: ${
                    isElegant
                      ? "Lato, sans-serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; color: var(--color-text-secondary); line-height: ${
                    isElegant ? "1.9" : "1.7"
                  }; margin-bottom: 1.5rem; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; font-weight: ${isElegant ? "300" : "normal"};">
                    ${dish.description || ""}
                  </p>
                  <div style="font-size: ${
                    isBrutalist ? "2rem" : "1.5rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; color: var(--color-accent); ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }">${dish.price || ""}</div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
        `
            : ""
        }

        <!-- Menu with Theme-Specific Styling -->
        <section id="menu" class="menu" style="padding: ${
          isRetro || isElegant ? "8rem 0" : "6rem 0"
        }; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
          : isRetro
          ? "var(--color-surface)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.02)"
          : "var(--color-surface)"
      }; ${
        isRetro
          ? "border-top: 3px solid var(--color-accent); border-bottom: 3px solid #00f5ff;"
          : isGlassmorphism
          ? "backdrop-filter: blur(20px);"
          : ""
      }">
          <div class="container" style="max-width: 1000px;">
            <h2 style="font-family: ${
              isElegant ? "Playfair Display, serif" : "inherit"
            }; font-size: clamp(${
        isBrutalist || isRetro ? "2.5rem" : "2.5rem"
      }, 6vw, ${isBrutalist || isRetro ? "4rem" : "3.5rem"}); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "700"
      }; text-align: center; margin-bottom: 4rem; letter-spacing: ${
        isRetro ? "3px" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isBrutalist
          ? "color: var(--color-bg);"
          : isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }">
              Our Menu
            </h2>
            ${
              data.menuCategories && data.menuCategories.length > 0
                ? data.menuCategories
                    .map(
                      (category) => `
              <div class="menu-category" style="margin-bottom: 5rem;">
                <h3 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: ${
                        isBrutalist ? "2.5rem" : isRetro ? "2rem" : "2rem"
                      }; font-weight: ${
                        isBrutalist ? "900" : isRetro ? "700" : "700"
                      }; margin-bottom: 2.5rem; padding-bottom: 1rem; border-bottom: ${
                        isBrutalist ? "4px" : isRetro ? "3px" : "2px"
                      } solid ${
                        isBrutalist
                          ? "var(--color-bg)"
                          : isRetro
                          ? "var(--color-accent)"
                          : "var(--color-border)"
                      }; letter-spacing: ${isRetro ? "2px" : "-0.01em"}; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase;"
                          : ""
                      } ${isBrutalist ? "color: var(--color-bg);" : ""}">
                  ${category.category || "Category"}
                </h3>
                <div style="display: grid; gap: 2rem;">
                  ${
                    category.items && category.items.length > 0
                      ? category.items
                          .map(
                            (item) => `
                    <div class="menu-item" style="display: flex; justify-content: space-between; align-items: start; gap: 2rem; padding-bottom: 2rem; border-bottom: ${
                      isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                    } solid ${
                              isBrutalist
                                ? "var(--color-bg)"
                                : isRetro
                                ? "var(--color-accent)"
                                : "var(--color-border)"
                            };">
                      <div style="flex: 1;">
                        <h4 style="font-family: ${
                          isElegant
                            ? "Lato, sans-serif"
                            : isRetro
                            ? "Space Mono, monospace"
                            : "inherit"
                        }; font-size: ${
                              isBrutalist || isRetro ? "1.375rem" : "1.25rem"
                            }; font-weight: ${
                              isBrutalist ? "900" : isRetro ? "700" : "600"
                            }; margin-bottom: 0.5rem; ${
                              isBrutalist || isRetro
                                ? "text-transform: uppercase; letter-spacing: 1px;"
                                : ""
                            } ${
                              isBrutalist ? "color: var(--color-bg);" : ""
                            }">${item.name || ""}</h4>
                        <p style="font-family: ${
                          isElegant
                            ? "Lato, sans-serif"
                            : isRetro
                            ? "Space Mono, monospace"
                            : "inherit"
                        }; color: ${
                              isBrutalist
                                ? "var(--color-bg)"
                                : "var(--color-text-secondary)"
                            }; line-height: ${
                              isElegant ? "1.9" : "1.7"
                            }; font-size: ${
                              isBrutalist || isRetro ? "1.125rem" : "0.9375rem"
                            }; font-weight: ${isElegant ? "300" : "normal"};">
                          ${item.description || ""}
                        </p>
                      </div>
                      <div style="font-size: ${
                        isBrutalist ? "1.75rem" : "1.25rem"
                      }; font-weight: ${isBrutalist ? "900" : "700"}; color: ${
                              isBrutalist
                                ? "var(--color-bg)"
                                : "var(--color-accent)"
                            }; white-space: nowrap; ${
                              isBrutalist || isRetro
                                ? "text-transform: uppercase;"
                                : ""
                            }">
                        ${item.price || ""}
                      </div>
                    </div>
                  `
                          )
                          .join("")
                      : ""
                  }
                </div>
              </div>
            `
                    )
                    .join("")
                : ""
            }
          </div>
        </section>

        <!-- About & Hours with Theme-Specific Styling -->
        <section id="about" class="about" style="padding: ${
          isRetro || isElegant ? "8rem 0" : "6rem 0"
        };">
          <div class="container" style="max-width: 1000px;">
            <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
              isBrutalist || isElegant ? "320px" : "300px"
            }, 1fr)); gap: ${isElegant ? "4rem" : "3rem"};">
              <!-- Hours -->
              ${
                data.hours && data.hours.length > 0
                  ? `
              <div class="card" style="padding: ${
                isBrutalist || isElegant ? "2.5rem" : "2rem"
              }; border-radius: ${
                      isGradient
                        ? "20px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isRetro
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "20px"
                        : "12px"
                    }; border: ${
                      isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist || isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; background: ${
                      isGradient
                        ? "linear-gradient(135deg, rgba(102,126,234,0.02), rgba(118,75,162,0.02))"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "rgba(255,47,181,0.03)"
                        : "var(--color-bg)"
                    }; ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(20px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }">
                <h3 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: ${
                      isBrutalist ? "2rem" : "1.5rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: 2rem; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 2px;"
                        : ""
                    }">${isBrutalist ? "⏰ " : ""}Hours</h3>
                <div style="display: grid; gap: 0.75rem;">
                  ${data.hours
                    .map(
                      (day) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: ${
                      isBrutalist ? "1rem 0" : "0.75rem 0"
                    }; ${
                        isBrutalist
                          ? "border-bottom: 2px solid var(--color-border);"
                          : ""
                      }">
                      <span style="font-weight: ${
                        isBrutalist ? "900" : "600"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      }">${day.day || ""}</span>
                      <span style="color: var(--color-text-secondary); ${
                        isBrutalist || isRetro ? "font-weight: 700;" : ""
                      }">${day.hours || ""}</span>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }

              <!-- Contact -->
              <div class="card" id="contact" style="padding: ${
                isBrutalist || isElegant ? "2.5rem" : "2rem"
              }; border-radius: ${
        isGradient
          ? "20px"
          : isBrutalist || isElegant
          ? "0"
          : isRetro
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "20px"
          : "12px"
      }; border: ${isBrutalist ? "3px" : isRetro ? "2px" : "1px"} solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.1)"
          : "var(--color-border)"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.02), rgba(118,75,162,0.02))"
          : isGlassmorphism
          ? "rgba(255,255,255,0.05)"
          : isNeumorphism
          ? "var(--color-bg)"
          : isRetro
          ? "rgba(255,47,181,0.03)"
          : "var(--color-bg)"
      }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : ""
      }">
                <h3 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: ${
        isBrutalist ? "2rem" : "1.5rem"
      }; font-weight: ${isBrutalist ? "900" : "700"}; margin-bottom: 2rem; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 2px;"
          : ""
      }">${isBrutalist ? "📍 " : ""}Visit Us</h3>
                <div style="display: grid; gap: 1.5rem; font-size: ${
                  isBrutalist || isRetro ? "1.125rem" : "0.9375rem"
                };">
                  ${
                    data.address
                      ? `
                  <div>
                    <div style="font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; margin-bottom: 0.25rem; color: var(--color-text-secondary); font-size: ${
                          isBrutalist || isRetro ? "1rem" : "0.875rem"
                        }; ${
                          isBrutalist || isRetro
                            ? "text-transform: uppercase; letter-spacing: 1px;"
                            : ""
                        }">Address</div>
                    <div style="${
                      isBrutalist || isRetro ? "font-weight: 700;" : ""
                    }">${data.address}</div>
                  </div>
                  `
                      : ""
                  }
                  ${
                    data.phone
                      ? `
                  <div>
                    <div style="font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; margin-bottom: 0.25rem; color: var(--color-text-secondary); font-size: ${
                          isBrutalist || isRetro ? "1rem" : "0.875rem"
                        }; ${
                          isBrutalist || isRetro
                            ? "text-transform: uppercase; letter-spacing: 1px;"
                            : ""
                        }">Phone</div>
                    <a href="tel:${
                      data.phone
                    }" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
                          isBrutalist || isRetro ? "font-weight: 700;" : ""
                        }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${
                          data.phone
                        }</a>
                  </div>
                  `
                      : ""
                  }
                  ${
                    data.email
                      ? `
                  <div>
                    <div style="font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; margin-bottom: 0.25rem; color: var(--color-text-secondary); font-size: ${
                          isBrutalist || isRetro ? "1rem" : "0.875rem"
                        }; ${
                          isBrutalist || isRetro
                            ? "text-transform: uppercase; letter-spacing: 1px;"
                            : ""
                        }">Email</div>
                    <a href="mailto:${
                      data.email
                    }" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
                          isBrutalist || isRetro ? "font-weight: 700;" : ""
                        }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${
                          data.email
                        }</a>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Reservation CTA with Theme-Specific Styling -->
        <section class="cta" style="padding: ${
          isBrutalist || isRetro ? "10rem 0 8rem" : "8rem 0 6rem"
        }; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
          : isElegant
          ? "var(--color-surface)"
          : isGlassmorphism
          ? "transparent"
          : "var(--color-surface)"
      }; text-align: center; border-top: ${
        isBrutalist ? "4px" : isRetro ? "3px" : "1px"
      } solid ${
        isBrutalist || isRetro
          ? isBrutalist
            ? "var(--color-accent)"
            : "#00f5ff"
          : isElegant
          ? "var(--color-border)"
          : isNeumorphism || isGlassmorphism
          ? "transparent"
          : "var(--color-border)"
      }; ${isBrutalist || isGradient || isRetro ? "color: white;" : ""} ${
        isRetro
          ? "border-radius: 20px; margin: 0 2rem; box-shadow: 0 20px 60px rgba(255,47,181,0.4);"
          : ""
      }">
          <div class="container" style="max-width: ${
            isNeumorphism || isGlassmorphism ? "800px" : "700px"
          }; ${
        isGlassmorphism || isNeumorphism
          ? `padding: 5rem 3rem; border-radius: 32px; ${
              isGlassmorphism
                ? "background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1);"
                : getNeumorphismShadow(false)
            }`
          : ""
      }">
            ${
              isBrutalist
                ? `
            <h2 style="font-size: clamp(2.5rem, 6vw, 5rem); text-transform: uppercase; font-weight: 900; margin-bottom: 1.5rem; letter-spacing: -0.03em; color: var(--color-bg);">
              READY TO DINE?
            </h2>
            `
                : isElegant
                ? `
            <h2 style="font-family: Playfair Display, serif; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 600; margin-bottom: 1.5rem; letter-spacing: -0.03em;">
              Ready to Dine?
            </h2>
            `
                : isRetro
                ? `
            <h2 style="font-size: clamp(2rem, 6vw, 4rem); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
              TASTE THE FUTURE
            </h2>
            `
                : `
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: ${
              isNeumorphism || isGlassmorphism ? "800" : "800"
            }; margin-bottom: 1.5rem; letter-spacing: -0.03em; color: ${
                    isGradient || isRetro ? "white" : "var(--color-text)"
                  };">
              Ready to Dine?
            </h2>
            `
            }
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist || isRetro ? "1.5rem" : "1.25rem"
      }; color: ${
        isBrutalist
          ? "var(--color-bg)"
          : isGradient || isRetro
          ? "rgba(255,255,255,0.9)"
          : "var(--color-text-secondary)"
      }; margin-bottom: 2.5rem; line-height: 1.7; font-weight: ${
        isElegant ? "300" : "normal"
      };">
              Reserve your table today and experience authentic cuisine
            </p>
            ${
              data.reservationUrl
                ? `
            <a href="${
              data.reservationUrl
            }" target="_blank" class="btn btn-primary" style="padding: ${
                    isBrutalist ? "1.5rem 3rem" : "1.25rem 3rem"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : isElegant
                      ? "0"
                      : "8px"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "700" : "500"
                  }; transition: all 0.2s; display: inline-block; background: ${
                    isBrutalist || isGradient || isRetro
                      ? "white"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.15)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : isElegant
                      ? "var(--color-accent)"
                      : "var(--color-accent)"
                  }; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : isGradient
                      ? "#667eea"
                      : isRetro
                      ? "var(--color-accent)"
                      : isGlassmorphism
                      ? "var(--color-text)"
                      : isNeumorphism
                      ? "var(--color-text)"
                      : isElegant
                      ? "white"
                      : "white"
                  }; ${
                    isBrutalist
                      ? "text-transform: uppercase; border: 4px solid white;"
                      : isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px; border: 2px solid white;"
                      : isElegant
                      ? "letter-spacing: 0.5px; border: 1px solid var(--color-accent);"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
              onmouseover="this.style.transform='translateY(-2px)'; ${
                isBrutalist
                  ? `this.style.background='transparent'; this.style.color='white'`
                  : isRetro
                  ? `this.style.background='transparent'; this.style.color='white'`
                  : isElegant
                  ? `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                  : isGradient
                  ? `this.style.transform='scale(1.05)'`
                  : isGlassmorphism
                  ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.opacity='0.9'`
              }" 
              onmouseout="this.style.transform='translateY(0)'; ${
                isBrutalist
                  ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                  : isRetro
                  ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                  : isElegant
                  ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                  : isGradient
                  ? `this.style.transform='scale(1)'`
                  : isGlassmorphism
                  ? `this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.opacity='1'`
              }">
              Make a Reservation
            </a>
            `
                : data.phone
                ? `
            <a href="tel:${
              data.phone
            }" class="btn btn-primary" style="padding: ${
                    isBrutalist ? "1.5rem 3rem" : "1.25rem 3rem"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : isElegant
                      ? "0"
                      : "8px"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "700" : "500"
                  }; transition: all 0.2s; display: inline-block; background: ${
                    isBrutalist || isGradient || isRetro
                      ? "white"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.15)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : isElegant
                      ? "var(--color-accent)"
                      : "var(--color-accent)"
                  }; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : isGradient
                      ? "#667eea"
                      : isRetro
                      ? "var(--color-accent)"
                      : isGlassmorphism
                      ? "var(--color-text)"
                      : isNeumorphism
                      ? "var(--color-text)"
                      : isElegant
                      ? "white"
                      : "white"
                  }; ${
                    isBrutalist
                      ? "text-transform: uppercase; border: 4px solid white;"
                      : isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px; border: 2px solid white;"
                      : isElegant
                      ? "letter-spacing: 0.5px; border: 1px solid var(--color-accent);"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.3);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
              onmouseover="this.style.transform='translateY(-2px)'; ${
                isBrutalist
                  ? `this.style.background='transparent'; this.style.color='white'`
                  : isRetro
                  ? `this.style.background='transparent'; this.style.color='white'`
                  : isElegant
                  ? `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                  : isGradient
                  ? `this.style.transform='scale(1.05)'`
                  : isGlassmorphism
                  ? `this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(0,0,0,0.4)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.opacity='0.9'`
              }" 
              onmouseout="this.style.transform='translateY(0)'; ${
                isBrutalist
                  ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                  : isRetro
                  ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                  : isElegant
                  ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                  : isGradient
                  ? `this.style.transform='scale(1)'`
                  : isGlassmorphism
                  ? `this.style.boxShadow='0 8px 20px rgba(0,0,0,0.3)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.opacity='1'`
              }">
              Call to Reserve
            </a>
            `
                : ""
            }
          </div>
        </section>
      </main>

      <footer style="padding: ${
        isBrutalist ? "4rem 0" : "3rem 0"
      }; border-top: ${isBrutalist ? "4px" : isRetro ? "3px" : "1px"} solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; text-align: center; color: var(--color-text-secondary); font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.875rem"
      }; font-weight: ${isBrutalist ? "900" : isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 2px;"
          : ""
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); background: rgba(255,255,255,0.02);"
          : ""
      }">
        <div class="container">
          <p>© 2024 ${data.restaurantName || "Restaurant"}. ${
        isBrutalist
          ? "CRAFTED WITH PASSION."
          : isRetro
          ? "DESIGNED WITH TASTE."
          : "All rights reserved."
      }</p>
        </div>
      </footer>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 20px 20px 60px #c5c9ce, inset -20px -20px 60px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 32px 32px 64px #2a2d34, inset -32px -32px 64px #383d46;
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
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
        
        /* Retro glitch effect */
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch::before {
          animation: glitch1 2s infinite;
          color: var(--color-accent);
          z-index: -1;
        }
        
        .glitch::after {
          animation: glitch2 3s infinite;
          color: #00f5ff;
          z-index: -2;
        }
        
        @keyframes glitch1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        @keyframes glow {
          from { filter: drop-shadow(0 0 10px var(--color-accent)); }
          to { filter: drop-shadow(0 0 30px #00f5ff); }
        }
        `
            : ""
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .container { padding: 0 1.5rem !important; }
          .nav-links { display: none !important; }
          .hero { padding: 5rem 0 4rem !important; }
          ${
            isNeumorphism
              ? `.hero > .container { padding: 3rem 2rem !important; }`
              : ""
          }
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
    `;
    },
  }),

  // ============================================
  // TEMPLATE 4: DIGITAL BUSINESS CARD
  // ============================================
  "digital-card": new Template("digital-card", {
    name: "Digital Business Card",
    description:
      "Modern digital business card with QR code and instant contact sharing",
    image: "digital-business-card",
    category: "Personal",
    fields: {
      name: {
        type: "text",
        default: "Alex Morgan",
        label: "Full Name",
        required: true,
      },
      title: {
        type: "text",
        default: "Senior Product Manager",
        label: "Job Title",
      },
      company: { type: "text", default: "TechCorp Inc.", label: "Company" },
      tagline: {
        type: "text",
        default: "Building products people love",
        label: "Tagline",
      },
      email: {
        type: "email",
        default: "alex@techcorp.com",
        label: "Email",
        required: true,
      },
      phone: { type: "tel", default: "+1 (555) 123-4567", label: "Phone" },
      website: {
        type: "url",
        default: "https://alexmorgan.com",
        label: "Website",
      },
      location: {
        type: "text",
        default: "San Francisco, CA",
        label: "Location",
      },
      bio: {
        type: "textarea",
        default:
          "Passionate about creating user-centered products that make a difference. 10+ years in tech.",
        label: "Short Bio",
      },
      socialLinks: {
        type: "group",
        label: "Social Links",
        itemLabel: "Link",
        min: 0,
        max: 6,
        fields: {
          platform: { type: "text", label: "Platform", default: "" },
          username: { type: "text", label: "Username", default: "" },
          url: { type: "url", label: "URL", default: "" },
        },
        default: [
          {
            platform: "LinkedIn",
            username: "@alexmorgan",
            url: "https://linkedin.com/in/alexmorgan",
          },
          {
            platform: "Twitter",
            username: "@alexmorgan",
            url: "https://twitter.com/alexmorgan",
          },
          {
            platform: "GitHub",
            username: "@alexmorgan",
            url: "https://github.com/alexmorgan",
          },
        ],
      },
      skills: {
        type: "repeatable",
        label: "Key Skills",
        itemLabel: "Skill",
        default: [
          "Product Strategy",
          "User Research",
          "Agile",
          "Data Analysis",
        ],
        max: 6,
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Neumorphism box-shadow helpers
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
      <!-- Minimal Header with Theme Toggle -->
      <header style="padding: 1rem; position: fixed; top: 1rem; right: 1rem; z-index: 100;">
        <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
          isNeumorphism
            ? `padding: 0.5rem; border-radius: 12px; display: inline-block; background: var(--color-bg); ${getNeumorphismShadow(
                false
              )}`
            : isGlassmorphism
            ? "padding: 0.5rem; border-radius: 12px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
            : isBrutalist
            ? "padding: 0.5rem; border: 3px solid var(--color-accent);"
            : "padding: 0.5rem; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border);"
        }">
          <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="theme-toggle-slider"></span>
        </label>
      </header>

      <!-- Card Container with Theme-Specific Background -->
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(240,147,251,0.08))"
          : isRetro
          ? "var(--color-bg)"
          : "var(--color-bg)"
      }; ${isRetro ? "position: relative;" : ""}">
        <div style="max-width: ${
          isBrutalist ? "550px" : isElegant ? "520px" : "500px"
        }; width: 100%; position: relative;">
          
          <!-- Main Card with Theme-Specific Styling -->
          <div class="business-card" style="padding: ${
            isBrutalist
              ? "3rem"
              : isElegant
              ? "3.5rem"
              : isNeumorphism
              ? "3rem"
              : "3rem"
          }; position: relative; overflow: visible; border-radius: ${
        isGradient
          ? "32px"
          : isBrutalist || isElegant
          ? "0"
          : isRetro
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "24px"
          : "16px"
      }; border: ${isBrutalist ? "4px" : isRetro ? "3px" : "1px"} solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.15)"
          : "var(--color-border)"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.03), rgba(118,75,162,0.03))"
          : isGlassmorphism
          ? "rgba(255,255,255,0.08)"
          : isNeumorphism
          ? "var(--color-bg)"
          : isRetro
          ? "var(--color-bg)"
          : isBrutalist
          ? "var(--color-bg)"
          : "var(--color-bg)"
      }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); box-shadow: 0 20px 60px rgba(0,0,0,0.15);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : isGradient
          ? "box-shadow: 0 20px 60px rgba(102,126,234,0.12);"
          : isBrutalist
          ? "box-shadow: 12px 12px 0 var(--color-accent);"
          : isRetro
          ? "box-shadow: 0 0 0 3px var(--color-bg), 0 0 0 6px var(--color-accent);"
          : "box-shadow: 0 10px 40px rgba(0,0,0,0.08);"
      }">
            
            <!-- QR Code in Corner (Top Right) -->
            <div id="qr-corner" style="position: absolute; top: ${
              isBrutalist ? "1.5rem" : isElegant ? "2rem" : "1.5rem"
            }; right: ${
        isBrutalist ? "1.5rem" : isElegant ? "2rem" : "1.5rem"
      }; width: ${isBrutalist ? "90px" : "80px"}; height: ${
        isBrutalist ? "90px" : "80px"
      }; background: var(--color-surface); border: ${
        isBrutalist ? "3px" : isRetro ? "2px" : "2px"
      } solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; border-radius: ${
        isGradient ? "16px" : isBrutalist || isElegant || isRetro ? "0" : "12px"
      }; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; color: var(--color-text-secondary); overflow: hidden; ${
        isGlassmorphism
          ? "backdrop-filter: blur(10px); background: rgba(255,255,255,0.1);"
          : isNeumorphism
          ? getNeumorphismShadow(true)
          : ""
      } ${isBrutalist ? "transform: rotate(3deg);" : ""}">
              <span style="text-align: center; padding: 0.5rem;">QR</span>
            </div>
            
            <!-- Decorative Background Elements -->
            ${
              isBrutalist
                ? `
            <div style="position: absolute; top: -10px; left: -10px; width: 100px; height: 100px; background: var(--color-accent); opacity: 0.1; z-index: 0; transform: rotate(45deg);"></div>
            `
                : ""
            }
            
            ${
              isGradient
                ? `
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 150px; background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(240,147,251,0.08)); opacity: 0.6; z-index: 0; border-radius: ${
              isGradient ? "32px 32px 0 0" : "0"
            };"></div>
            `
                : ""
            }
            
            ${
              isRetro
                ? `
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); z-index: 0;"></div>
            `
                : ""
            }
            
            ${
              !isBrutalist && !isGradient && !isRetro
                ? `
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 120px; background: var(--color-surface); opacity: ${
              isElegant ? "0.3" : "0.5"
            }; z-index: 0; ${
                    isGlassmorphism ? "backdrop-filter: blur(10px);" : ""
                  }"></div>
            `
                : ""
            }
            
            <!-- Profile Section -->
            <div style="position: relative; z-index: 1; margin-bottom: 2rem; padding-right: ${
              isBrutalist ? "110px" : "100px"
            };">
              <!-- Avatar Placeholder with Theme Styling -->
              <div style="width: ${
                isBrutalist ? "130px" : isElegant ? "110px" : "120px"
              }; height: ${
        isBrutalist ? "130px" : isElegant ? "110px" : "120px"
      }; margin: 0 auto 2rem; background: ${
        isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
          : "var(--color-accent)"
      }; ${
        isBrutalist || isElegant || isRetro
          ? "border-radius: 0;"
          : "border-radius: 50%;"
      } border: ${isBrutalist ? "4px" : "4px"} solid ${
        isBrutalist ? "var(--color-accent)" : "var(--color-bg)"
      }; opacity: 0.2; ${
        isBrutalist
          ? "transform: rotate(-5deg);"
          : isRetro
          ? "clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);"
          : ""
      } ${
        isNeumorphism
          ? getNeumorphismShadow(false)
          : isGradient
          ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);"
          : ""
      }"></div>
              
              <h1 ${
                isRetro
                  ? `class="glitch-card" data-text="${
                      data.name || "Your Name"
                    }"`
                  : ""
              } style="font-family: ${
        isElegant
          ? "Playfair Display, serif"
          : isRetro
          ? "Space Mono, monospace"
          : "inherit"
      }; font-size: ${
        isBrutalist
          ? "2.5rem"
          : isRetro
          ? "2.25rem"
          : isElegant
          ? "2.25rem"
          : "2rem"
      }; font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : isElegant ? "600" : "800"
      }; margin-bottom: 0.5rem; letter-spacing: ${
        isBrutalist || isRetro ? "1px" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isBrutalist
          ? "color: var(--color-accent);"
          : isRetro
          ? "position: relative; background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }>
                ${
                  isBrutalist
                    ? `<span style="background: var(--color-accent); color: var(--color-bg); padding: 0 0.5rem; display: inline-block; transform: rotate(-2deg);">${
                        (data.name || "Your Name").split(" ")[0]
                      }</span> ${(data.name || "Your Name")
                        .split(" ")
                        .slice(1)
                        .join(" ")}`
                    : ""
                }
                ${
                  isGradient
                    ? (data.name || "Your Name")
                        .split(" ")
                        .map((word, i) =>
                          i === (data.name || "Your Name").split(" ").length - 1
                            ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>`
                            : word
                        )
                        .join(" ")
                    : ""
                }
                ${!isBrutalist && !isGradient ? data.name || "Your Name" : ""}
              </h1>
              
              ${
                data.title
                  ? `
              <p style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: ${
                      isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                    }; color: var(--color-accent); font-weight: ${
                      isBrutalist ? "800" : "600"
                    }; margin-bottom: 0.25rem; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 1px;"
                        : ""
                    }">
                ${data.title}
              </p>
              `
                  : ""
              }
              
              ${
                data.company
                  ? `
              <p style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: ${
                      isBrutalist || isRetro ? "1.125rem" : "1rem"
                    }; color: var(--color-text-secondary); margin-bottom: ${
                      data.tagline ? "1rem" : "0"
                    }; font-weight: ${isElegant ? "300" : "normal"};">
                ${data.company}
              </p>
              `
                  : ""
              }
              
              ${
                data.tagline
                  ? `
              <p style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: ${
                      isBrutalist ? "1rem" : "0.9375rem"
                    }; color: var(--color-text-secondary); font-style: ${
                      isElegant ? "italic" : "normal"
                    }; margin-bottom: 1.5rem; font-weight: ${
                      isElegant ? "300" : "normal"
                    }; ${isBrutalist ? "font-weight: 700;" : ""}">
                ${isBrutalist ? "" : '"'}${data.tagline}${
                      isBrutalist ? "" : '"'
                    }
              </p>
              `
                  : ""
              }
              
              ${
                data.location
                  ? `
              <p style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; color: var(--color-text-secondary); display: flex; align-items: center; gap: 0.5rem; ${
                      isBrutalist
                        ? "font-weight: 700; text-transform: uppercase;"
                        : ""
                    }">
                ${isBrutalist ? "📍" : "📍"} ${data.location}
              </p>
              `
                  : ""
              }
            </div>

            <!-- Bio with Theme-Specific Styling -->
            ${
              data.bio
                ? `
            <div style="padding: ${
              isBrutalist ? "1.75rem" : "1.5rem"
            } 0; border-top: ${
                    isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                  } solid ${
                    isBrutalist || isRetro
                      ? "var(--color-accent)"
                      : "var(--color-border)"
                  }; border-bottom: ${
                    isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                  } solid ${
                    isBrutalist || isRetro
                      ? "var(--color-accent)"
                      : "var(--color-border)"
                  }; margin-bottom: 1.5rem; ${
                    isGlassmorphism
                      ? "background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); padding-left: 1rem; padding-right: 1rem; border-radius: 12px;"
                      : isNeumorphism
                      ? `background: var(--color-surface); padding-left: 1.5rem; padding-right: 1.5rem; border-radius: 16px; ${getNeumorphismShadow(
                          true
                        )}`
                      : ""
                  }">
              <p style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "1.0625rem" : "0.9375rem"
                  }; line-height: ${
                    isElegant ? "1.9" : "1.7"
                  }; color: var(--color-text-secondary); font-weight: ${
                    isElegant ? "300" : "normal"
                  };">
                ${data.bio}
              </p>
            </div>
            `
                : ""
            }

            <!-- Contact Info with Theme-Specific Cards -->
            <div style="display: grid; gap: ${
              isBrutalist ? "1rem" : "0.75rem"
            }; margin-bottom: 2rem;">
              ${
                data.email
                  ? `
              <a href="mailto:${
                data.email
              }" style="display: flex; align-items: center; gap: ${
                      isBrutalist ? "1rem" : "0.75rem"
                    }; padding: ${
                      isBrutalist ? "1.125rem" : isElegant ? "1rem" : "0.875rem"
                    }; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "rgba(255,47,181,0.03)"
                        : "var(--color-surface)"
                    }; border: ${
                      isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist || isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "12px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; text-decoration: none; color: var(--color-text); transition: all 0.2s; ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-3px, -3px)'; this.style.boxShadow='6px 6px 0 var(--color-accent)'`
                    : isRetro
                    ? `this.style.boxShadow='0 0 20px rgba(255,47,181,0.3)'`
                    : isGlassmorphism
                    ? `this.style.borderColor='var(--color-accent)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.borderColor='var(--color-accent)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isRetro
                    ? `this.style.boxShadow='none'`
                    : isGlassmorphism
                    ? `this.style.borderColor='rgba(255,255,255,0.1)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.borderColor='var(--color-border)'`
                }">
                <span style="font-size: ${
                  isBrutalist ? "1.5rem" : "1.25rem"
                };">✉️</span>
                <span style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; font-weight: ${
                      isBrutalist ? "700" : isRetro ? "600" : "500"
                    }; ${isBrutalist ? "text-transform: uppercase;" : ""}">${
                      data.email
                    }</span>
              </a>
              `
                  : ""
              }
              
              ${
                data.phone
                  ? `
              <a href="tel:${data.phone.replace(
                /\s/g,
                ""
              )}" style="display: flex; align-items: center; gap: ${
                      isBrutalist ? "1rem" : "0.75rem"
                    }; padding: ${
                      isBrutalist ? "1.125rem" : isElegant ? "1rem" : "0.875rem"
                    }; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "rgba(255,47,181,0.03)"
                        : "var(--color-surface)"
                    }; border: ${
                      isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist || isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "12px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; text-decoration: none; color: var(--color-text); transition: all 0.2s; ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-3px, -3px)'; this.style.boxShadow='6px 6px 0 var(--color-accent)'`
                    : isRetro
                    ? `this.style.boxShadow='0 0 20px rgba(255,47,181,0.3)'`
                    : isGlassmorphism
                    ? `this.style.borderColor='var(--color-accent)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.borderColor='var(--color-accent)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isRetro
                    ? `this.style.boxShadow='none'`
                    : isGlassmorphism
                    ? `this.style.borderColor='rgba(255,255,255,0.1)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.borderColor='var(--color-border)'`
                }">
                <span style="font-size: ${
                  isBrutalist ? "1.5rem" : "1.25rem"
                };">📞</span>
                <span style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; font-weight: ${
                      isBrutalist ? "700" : isRetro ? "600" : "500"
                    }; ${isBrutalist ? "text-transform: uppercase;" : ""}">${
                      data.phone
                    }</span>
              </a>
              `
                  : ""
              }
              
              ${
                data.website
                  ? `
              <a href="${
                data.website
              }" target="_blank" style="display: flex; align-items: center; gap: ${
                      isBrutalist ? "1rem" : "0.75rem"
                    }; padding: ${
                      isBrutalist ? "1.125rem" : isElegant ? "1rem" : "0.875rem"
                    }; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "rgba(255,47,181,0.03)"
                        : "var(--color-surface)"
                    }; border: ${
                      isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist || isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "12px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; text-decoration: none; color: var(--color-text); transition: all 0.2s; ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-3px, -3px)'; this.style.boxShadow='6px 6px 0 var(--color-accent)'`
                    : isRetro
                    ? `this.style.boxShadow='0 0 20px rgba(255,47,181,0.3)'`
                    : isGlassmorphism
                    ? `this.style.borderColor='var(--color-accent)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.borderColor='var(--color-accent)'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isRetro
                    ? `this.style.boxShadow='none'`
                    : isGlassmorphism
                    ? `this.style.borderColor='rgba(255,255,255,0.1)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.borderColor='var(--color-border)'`
                }">
                <span style="font-size: ${
                  isBrutalist ? "1.5rem" : "1.25rem"
                };">🌐</span>
                <span style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; font-weight: ${
                      isBrutalist ? "700" : isRetro ? "600" : "500"
                    }; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }">${data.website
                      .replace("https://", "")
                      .replace("http://", "")}</span>
              </a>
              `
                  : ""
              }
            </div>

            <!-- Skills with Theme-Specific Badges -->
            ${
              data.skills && data.skills.length > 0
                ? `
            <div style="margin-bottom: 2rem;">
              <h3 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist ? "0.875rem" : "0.75rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; text-transform: uppercase; letter-spacing: ${
                    isBrutalist || isRetro ? "2px" : "0.1em"
                  }; color: var(--color-text-secondary); margin-bottom: 1rem;">
                ${isBrutalist ? "⚡ " : ""}Expertise
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: ${
                isBrutalist ? "0.75rem" : "0.5rem"
              };">
                ${data.skills
                  .map(
                    (skill) => `
                  <span style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                      isBrutalist ? "0.625rem 1.125rem" : "0.375rem 0.875rem"
                    }; background: ${
                      isGradient
                        ? "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.08)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "rgba(255,47,181,0.05)"
                        : "var(--color-surface)"
                    }; border: ${
                      isBrutalist ? "2px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist || isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.15)"
                        : "var(--color-border)"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "999px"
                    }; font-size: ${
                      isBrutalist || isRetro ? "0.875rem" : "0.8125rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : isRetro ? "700" : "600"
                    }; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 0.5px;"
                        : ""
                    } ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }">
                    ${skill}
                  </span>
                `
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }

            <!-- Social Links with Theme-Specific Styling -->
            ${
              data.socialLinks && data.socialLinks.length > 0
                ? `
            <div style="padding-top: 2rem; border-top: ${
              isBrutalist ? "3px" : isRetro ? "2px" : "1px"
            } solid ${
                    isBrutalist || isRetro
                      ? "var(--color-accent)"
                      : "var(--color-border)"
                  };">
              <h3 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist ? "0.875rem" : "0.75rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; text-transform: uppercase; letter-spacing: ${
                    isBrutalist || isRetro ? "2px" : "0.1em"
                  }; color: var(--color-text-secondary); margin-bottom: 1rem;">
                ${isBrutalist ? "🔗 " : ""}Connect
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: ${
                isBrutalist ? "0.75rem" : "0.5rem"
              };">
                ${data.socialLinks
                  .map(
                    (link) => `
                  <a href="${link.url}" target="_blank" style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; font-size: ${
                      isBrutalist || isRetro ? "0.875rem" : "0.8125rem"
                    }; padding: ${
                      isBrutalist ? "0.75rem 1.25rem" : "0.625rem 1rem"
                    }; display: flex; align-items: center; gap: 0.5rem; border-radius: ${
                      isGradient || isRetro
                        ? "12px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; text-decoration: none; border: ${
                      isBrutalist ? "2px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist || isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; color: var(--color-text); transition: all 0.2s; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isRetro
                        ? "rgba(255,47,181,0.03)"
                        : "transparent"
                    }; font-weight: ${
                      isBrutalist ? "900" : isRetro ? "700" : "600"
                    }; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 0.5px;"
                        : ""
                    } ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" 
                    onmouseover="${
                      isBrutalist
                        ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                        : isRetro
                        ? `this.style.background='rgba(255,47,181,0.1)'; this.style.boxShadow='0 0 15px rgba(255,47,181,0.2)'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.1)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                        : `this.style.background='var(--color-surface)'`
                    }" 
                    onmouseout="${
                      isBrutalist
                        ? `this.style.background='transparent'; this.style.color='var(--color-text)'`
                        : isRetro
                        ? `this.style.background='rgba(255,47,181,0.03)'; this.style.boxShadow='none'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.05)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                        : `this.style.background='transparent'`
                    }">
                    <span>${link.platform}</span>
                    ${
                      link.username
                        ? `<span style="opacity: 0.6; font-size: ${
                            isBrutalist ? "0.75rem" : "0.75rem"
                          };">${link.username}</span>`
                        : ""
                    }
                  </a>
                `
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }

            <!-- Save Contact Button with Theme-Specific Styling -->
            <div style="margin-top: 2rem;">
              <button onclick="saveContact()" style="width: 100%; padding: ${
                isBrutalist ? "1.25rem" : "1rem"
              }; font-size: ${
        isBrutalist || isRetro ? "1.125rem" : "1rem"
      }; cursor: pointer; background: ${
        isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
          : isBrutalist
          ? "var(--color-accent)"
          : "var(--color-accent)"
      }; color: white; border: ${
        isBrutalist
          ? "3px solid var(--color-accent)"
          : isRetro
          ? "2px solid var(--color-accent)"
          : "none"
      }; border-radius: ${
        isGradient || isRetro
          ? "999px"
          : isBrutalist || isElegant
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "16px"
          : "8px"
      }; font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "500"
      }; transition: all 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      } ${
        isGradient
          ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);"
          : isRetro
          ? "box-shadow: 0 0 30px rgba(255,47,181,0.3);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : ""
      }" 
                onmouseover="${
                  isBrutalist
                    ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                    : isGradient
                    ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'`
                    : isRetro
                    ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 50px rgba(255,47,181,0.5)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.transform='translateY(-2px)'; this.style.opacity='0.9'`
                }" 
                onmouseout="${
                  isBrutalist
                    ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                    : isGradient
                    ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'`
                    : isRetro
                    ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(255,47,181,0.3)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.transform='translateY(0)'; this.style.opacity='1'`
                }">
                ${isBrutalist ? "💾 " : "💾 "}Save Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <script>
        function saveContact() {
          const vcard = \`BEGIN:VCARD
VERSION:3.0
FN:${data.name || ""}
TITLE:${data.title || ""}
ORG:${data.company || ""}
EMAIL:${data.email || ""}
TEL:${data.phone || ""}
URL:${data.website || ""}
NOTE:${data.bio || ""}
END:VCARD\`;
          
          const blob = new Blob([vcard], { type: 'text/vcard' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = '${(data.name || "contact").replace(/\s/g, "_")}.vcf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }

        window.addEventListener('DOMContentLoaded', () => {
          const qrData = encodeURIComponent(window.location.href);
          const qrUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${qrData}\`;
          const qrCorner = document.getElementById('qr-corner');
          if (qrCorner) {
            qrCorner.innerHTML = \`<img src="\${qrUrl}" alt="QR Code" style="width: 100%; height: 100%; object-fit: cover;">\`;
          }
        });
      </script>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 8px 8px 16px #c5c9ce, inset -8px -8px 16px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 16px 16px 32px #2a2d34, inset -16px -16px 32px #383d46;
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
        /* Retro grid background */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,47,181,0.02) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,47,181,0.02) 2px, transparent 2px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        
        /* Retro glitch effect for card */
        .glitch-card::before,
        .glitch-card::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-card::before {
          animation: glitch-card1 3s infinite;
          color: var(--color-accent);
          z-index: -1;
        }
        
        .glitch-card::after {
          animation: glitch-card2 4s infinite;
          color: #00f5ff;
          z-index: -2;
        }
        
        @keyframes glitch-card1 {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(-1px, -1px); }
          75% { transform: translate(1px, 1px); }
        }
        
        @keyframes glitch-card2 {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(1px, -1px); }
          50% { transform: translate(1px, 1px); }
          75% { transform: translate(-1px, -1px); }
        }
        `
            : ""
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .business-card {
            padding: 2.5rem 2rem !important;
          }
          
          #qr-corner {
            width: 70px !important;
            height: 70px !important;
            top: 1rem !important;
            right: 1rem !important;
          }
          
          .business-card > div:first-of-type {
            padding-right: 85px !important;
          }
        }
        
        @media (max-width: 480px) {
          .business-card {
            padding: 2rem 1.5rem !important;
          }
          
          #qr-corner {
            width: 60px !important;
            height: 60px !important;
          }
          
          .business-card > div:first-of-type {
            padding-right: 75px !important;
          }
          
          h1 {
            font-size: 1.75rem !important;
          }
        }
      </style>
    `;
    },
  }),
  // ============================================
  // TEMPLATE 5: RESUME/CV
  // ============================================
  resume: new Template("resume", {
    name: "Resume/CV",
    description:
      "Professional resume with work experience, education, and skills",
    image: "resume",
    category: "Personal",
    fields: {
      name: {
        type: "text",
        default: "Sarah Johnson",
        label: "Full Name",
        required: true,
      },
      title: {
        type: "text",
        default: "Software Engineer",
        label: "Professional Title",
      },
      email: {
        type: "email",
        default: "sarah.johnson@email.com",
        label: "Email",
        required: true,
      },
      phone: { type: "tel", default: "+1 (555) 987-6543", label: "Phone" },
      location: { type: "text", default: "Seattle, WA", label: "Location" },
      website: {
        type: "url",
        default: "https://sarahjohnson.dev",
        label: "Website/Portfolio",
      },
      linkedin: {
        type: "url",
        default: "https://linkedin.com/in/sarahjohnson",
        label: "LinkedIn",
      },
      github: {
        type: "url",
        default: "https://github.com/sarahjohnson",
        label: "GitHub/Portfolio Link",
      },
      summary: {
        type: "textarea",
        default:
          "Experienced software engineer with 7+ years building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Proven track record of delivering high-impact features used by millions.",
        label: "Professional Summary",
      },
      experience: {
        type: "group",
        label: "Work Experience",
        itemLabel: "Position",
        min: 1,
        max: 8,
        fields: {
          role: { type: "text", label: "Job Title", default: "" },
          company: { type: "text", label: "Company", default: "" },
          location: { type: "text", label: "Location", default: "" },
          period: {
            type: "text",
            label: "Period (e.g., Jan 2020 - Present)",
            default: "",
          },
          achievements: {
            type: "repeatable",
            label: "Key Achievements",
            itemLabel: "Achievement",
            default: [],
            max: 5,
          },
        },
        default: [
          {
            role: "Senior Software Engineer",
            company: "TechCorp",
            location: "Seattle, WA",
            period: "Jan 2021 - Present",
            achievements: [
              "Led development of core platform features serving 5M+ users",
              "Reduced page load time by 40% through optimization",
              "Mentored 3 junior engineers to mid-level positions",
            ],
          },
          {
            role: "Software Engineer",
            company: "StartupXYZ",
            location: "San Francisco, CA",
            period: "Jun 2018 - Dec 2020",
            achievements: [
              "Built real-time collaboration features from scratch",
              "Improved test coverage from 40% to 85%",
              "Contributed to open-source projects used by the team",
            ],
          },
        ],
      },
      education: {
        type: "group",
        label: "Education",
        itemLabel: "Degree",
        min: 0,
        max: 4,
        fields: {
          degree: { type: "text", label: "Degree", default: "" },
          school: { type: "text", label: "School/University", default: "" },
          location: { type: "text", label: "Location", default: "" },
          year: { type: "text", label: "Graduation Year", default: "" },
          details: {
            type: "text",
            label: "Additional Details (optional)",
            default: "",
          },
        },
        default: [
          {
            degree: "Bachelor of Science in Computer Science",
            school: "University of Washington",
            location: "Seattle, WA",
            year: "2018",
            details: "GPA: 3.8/4.0, Dean's List",
          },
        ],
      },
      skills: {
        type: "group",
        label: "Skills",
        itemLabel: "Category",
        min: 1,
        max: 6,
        fields: {
          category: { type: "text", label: "Category Name", default: "" },
          items: {
            type: "repeatable",
            label: "Skills",
            itemLabel: "Skill",
            default: [],
          },
        },
        default: [
          {
            category: "Languages",
            items: ["JavaScript", "TypeScript", "Python", "Go"],
          },
          {
            category: "Frontend",
            items: ["React", "Next.js", "Vue", "Tailwind CSS"],
          },
          {
            category: "Backend",
            items: ["Node.js", "PostgreSQL", "Redis", "GraphQL"],
          },
          {
            category: "Tools",
            items: ["Git", "Docker", "AWS", "CI/CD"],
          },
        ],
      },
      certifications: {
        type: "group",
        label: "Certifications",
        itemLabel: "Certification",
        min: 0,
        max: 5,
        fields: {
          name: { type: "text", label: "Certification Name", default: "" },
          issuer: { type: "text", label: "Issuing Organization", default: "" },
          year: { type: "text", label: "Year", default: "" },
        },
        default: [
          {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            year: "2023",
          },
        ],
      },
      languages: {
        type: "group",
        label: "Languages",
        itemLabel: "Language",
        min: 0,
        max: 5,
        fields: {
          language: { type: "text", label: "Language", default: "" },
          proficiency: { type: "text", label: "Proficiency", default: "" },
        },
        default: [
          { language: "English", proficiency: "Native" },
          { language: "Spanish", proficiency: "Intermediate" },
        ],
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Neumorphism box-shadow helpers
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
      <!-- Header with Theme Toggle -->
      <header style="padding: 1.5rem 0; border-bottom: ${
        isBrutalist ? "3px" : isRetro ? "2px" : "1px"
      } solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; margin-bottom: 2rem;">
        <div class="container" style="max-width: 900px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-weight: ${isBrutalist ? "900" : "600"}; font-size: ${
        isBrutalist || isRetro ? "1.25rem" : "1.125rem"
      }; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      } ${
        isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }">Resume</div>
          <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
            isNeumorphism
              ? `padding: 0.5rem; border-radius: 12px; background: var(--color-bg); ${getNeumorphismShadow(
                  false
                )}`
              : ""
          }">
            <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
            <span class="theme-toggle-slider"></span>
          </label>
        </div>
      </header>

      <div style="min-height: 100vh; padding: 2rem 1rem; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.03), rgba(240,147,251,0.03))"
          : "var(--color-bg)"
      };">
        <div class="resume-container" style="max-width: 900px; margin: 0 auto; background: ${
          isGlassmorphism ? "rgba(255,255,255,0.05)" : "var(--color-surface)"
        }; border: ${isBrutalist ? "4px" : isRetro ? "3px" : "1px"} solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.1)"
          : "var(--color-border)"
      }; border-radius: ${
        isGradient
          ? "20px"
          : isBrutalist || isElegant || isRetro
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "24px"
          : "12px"
      }; ${
        isBrutalist
          ? "box-shadow: 12px 12px 0 var(--color-accent);"
          : isGradient
          ? "box-shadow: 0 20px 60px rgba(102,126,234,0.1);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : isGlassmorphism
          ? "backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1);"
          : "box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
      }">
          
          <!-- Header Section with Theme-Specific Styling -->
          <header class="resume-header" style="padding: ${
            isBrutalist
              ? "3.5rem 2.5rem"
              : isElegant
              ? "4rem 3rem"
              : "3rem 2rem"
          }; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(240,147,251,0.08))"
          : isRetro
          ? "var(--color-bg)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.03)"
          : "var(--color-bg)"
      }; border-bottom: ${
        isBrutalist ? "4px" : isRetro ? "3px" : "3px"
      } solid var(--color-accent); border-radius: ${
        isGradient
          ? "20px 20px 0 0"
          : isBrutalist || isElegant || isRetro
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "24px 24px 0 0"
          : "12px 12px 0 0"
      }; ${isRetro ? "border-top: 3px solid #00f5ff;" : ""} ${
        isGlassmorphism ? "backdrop-filter: blur(10px);" : ""
      }">
            <h1 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist || isRetro ? "3rem" : isElegant ? "2.75rem" : "2.5rem"
      }; font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "800"
      }; margin-bottom: 0.5rem; letter-spacing: ${
        isBrutalist || isRetro ? "2px" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isBrutalist ? "color: var(--color-bg);" : ""
      }">
              ${
                isBrutalist
                  ? (data.name || "Your Name")
                      .split(" ")
                      .map((word, i) =>
                        i === 0
                          ? `<span style="background: var(--color-bg); color: var(--color-accent); padding: 0 0.5rem; display: inline-block; transform: rotate(-1deg);">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${
                isGradient
                  ? (data.name || "Your Name")
                      .split(" ")
                      .map((word, i) =>
                        i === (data.name || "Your Name").split(" ").length - 1
                          ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>`
                          : word
                      )
                      .join(" ")
                  : ""
              }
              ${!isBrutalist && !isGradient ? data.name || "Your Name" : ""}
            </h1>
            ${
              data.title
                ? `
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
                    isBrutalist || isRetro ? "1.5rem" : "1.25rem"
                  }; color: ${
                    isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
                  }; font-weight: ${
                    isBrutalist ? "800" : "600"
                  }; margin-bottom: 2rem; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  }">
              ${data.title}
            </p>
            `
                : ""
            }
            
            <!-- Contact Info -->
            <div style="display: flex; flex-wrap: wrap; gap: ${
              isBrutalist ? "1.5rem" : "1rem"
            }; font-size: ${
        isBrutalist || isRetro ? "1.0625rem" : "0.9375rem"
      }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; font-weight: ${isBrutalist || isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              ${
                data.email
                  ? `<span>${isBrutalist ? "✉️ " : "✉️ "}${data.email}</span>`
                  : ""
              }
              ${
                data.phone
                  ? `<span>${isBrutalist ? "📞 " : "📞 "}${data.phone}</span>`
                  : ""
              }
              ${
                data.location
                  ? `<span>${isBrutalist ? "📍 " : "📍 "}${
                      data.location
                    }</span>`
                  : ""
              }
            </div>
            
            <!-- Links -->
            ${
              data.website || data.linkedin || data.github
                ? `
            <div style="display: flex; flex-wrap: wrap; gap: ${
              isBrutalist ? "1rem" : "0.75rem"
            }; margin-top: ${isBrutalist ? "1.5rem" : "1rem"};">
              ${
                data.website
                  ? `<a href="${
                      data.website
                    }" target="_blank" style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; padding: ${
                      isBrutalist ? "0.75rem 1.25rem" : "0.5rem 1rem"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; text-decoration: none; border: ${
                      isBrutalist ? "2px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist
                        ? "var(--color-bg)"
                        : isRetro
                        ? "#00f5ff"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.2)"
                        : "var(--color-border)"
                    }; color: ${
                      isBrutalist ? "var(--color-bg)" : "var(--color-text)"
                    }; transition: all 0.2s; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : "transparent"
                    }; font-weight: ${
                      isBrutalist || isRetro ? "700" : "normal"
                    }; ${
                      isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                    } ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                        : isRetro
                        ? `this.style.background='#00f5ff'; this.style.color='#0d001a'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.1)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                        : `this.style.background='var(--color-surface)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                        : isRetro
                        ? `this.style.background='transparent'; this.style.color='var(--color-text)'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.05)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                        : `this.style.background='transparent'`
                    }">🌐 Website</a>`
                  : ""
              }
              ${
                data.linkedin
                  ? `<a href="${
                      data.linkedin
                    }" target="_blank" style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; padding: ${
                      isBrutalist ? "0.75rem 1.25rem" : "0.5rem 1rem"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; text-decoration: none; border: ${
                      isBrutalist ? "2px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist
                        ? "var(--color-bg)"
                        : isRetro
                        ? "#00f5ff"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.2)"
                        : "var(--color-border)"
                    }; color: ${
                      isBrutalist ? "var(--color-bg)" : "var(--color-text)"
                    }; transition: all 0.2s; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : "transparent"
                    }; font-weight: ${
                      isBrutalist || isRetro ? "700" : "normal"
                    }; ${
                      isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                    } ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                        : isRetro
                        ? `this.style.background='#00f5ff'; this.style.color='#0d001a'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.1)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                        : `this.style.background='var(--color-surface)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                        : isRetro
                        ? `this.style.background='transparent'; this.style.color='var(--color-text)'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.05)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                        : `this.style.background='transparent'`
                    }">💼 LinkedIn</a>`
                  : ""
              }
              ${
                data.github
                  ? `<a href="${
                      data.github
                    }" target="_blank" style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; padding: ${
                      isBrutalist ? "0.75rem 1.25rem" : "0.5rem 1rem"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; text-decoration: none; border: ${
                      isBrutalist ? "2px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist
                        ? "var(--color-bg)"
                        : isRetro
                        ? "#00f5ff"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.2)"
                        : "var(--color-border)"
                    }; color: ${
                      isBrutalist ? "var(--color-bg)" : "var(--color-text)"
                    }; transition: all 0.2s; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : "transparent"
                    }; font-weight: ${
                      isBrutalist || isRetro ? "700" : "normal"
                    }; ${
                      isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                    } ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                        : isRetro
                        ? `this.style.background='#00f5ff'; this.style.color='#0d001a'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.1)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                        : `this.style.background='var(--color-surface)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                        : isRetro
                        ? `this.style.background='transparent'; this.style.color='var(--color-text)'`
                        : isGlassmorphism
                        ? `this.style.background='rgba(255,255,255,0.05)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                        : `this.style.background='transparent'`
                    }">💻 GitHub</a>`
                  : ""
              }
            </div>
            `
                : ""
            }
          </header>

          <!-- Main Content -->
          <div style="padding: ${
            isBrutalist || isElegant ? "2.5rem" : "2rem"
          };">
            
            <!-- Summary -->
            ${
              data.summary
                ? `
            <section style="margin-bottom: ${
              isBrutalist || isElegant ? "3.5rem" : "3rem"
            };">
              <h2 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; margin-bottom: ${
                    isBrutalist ? "1.5rem" : "1rem"
                  }; color: var(--color-accent); text-transform: uppercase; letter-spacing: ${
                    isBrutalist || isRetro ? "2px" : "0.05em"
                  }; ${
                    isBrutalist
                      ? "border-bottom: 3px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : isRetro
                      ? "border-bottom: 2px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : ""
                  }">
                ${isBrutalist ? "⚡ " : ""}Professional Summary
              </h2>
              <p style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "1.0625rem" : "1rem"
                  }; line-height: ${
                    isElegant ? "1.9" : "1.8"
                  }; color: var(--color-text-secondary); font-weight: ${
                    isElegant ? "300" : "normal"
                  };">
                ${data.summary}
              </p>
            </section>
            `
                : ""
            }

            <!-- Experience -->
            ${
              data.experience && data.experience.length > 0
                ? `
            <section style="margin-bottom: ${
              isBrutalist || isElegant ? "3.5rem" : "3rem"
            };">
              <h2 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; margin-bottom: ${
                    isBrutalist ? "2rem" : "2rem"
                  }; color: var(--color-accent); text-transform: uppercase; letter-spacing: ${
                    isBrutalist || isRetro ? "2px" : "0.05em"
                  }; ${
                    isBrutalist
                      ? "border-bottom: 3px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : isRetro
                      ? "border-bottom: 2px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : ""
                  }">
                ${isBrutalist ? "💼 " : ""}Work Experience
              </h2>
              <div style="display: flex; flex-direction: column; gap: ${
                isBrutalist || isElegant ? "2.5rem" : "2rem"
              };">
                ${data.experience
                  .map(
                    (job) => `
                  <div style="${
                    isNeumorphism
                      ? `padding: 1.5rem; border-radius: 16px; ${getNeumorphismShadow(
                          false
                        )}`
                      : isGlassmorphism
                      ? "padding: 1.5rem; border-radius: 16px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);"
                      : isBrutalist
                      ? "padding-left: 1rem; border-left: 4px solid var(--color-accent);"
                      : isRetro
                      ? "padding-left: 1rem; border-left: 3px solid var(--color-accent);"
                      : ""
                  }">
                    <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
                      <div style="flex: 1;">
                        <h3 style="font-family: ${
                          isElegant
                            ? "Playfair Display, serif"
                            : isRetro
                            ? "Space Mono, monospace"
                            : "inherit"
                        }; font-size: ${
                      isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: 0.25rem; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 0.5px;"
                        : ""
                    }">
                          ${job.role || ""}
                        </h3>
                        <p style="font-family: ${
                          isRetro ? "Space Mono, monospace" : "inherit"
                        }; font-size: ${
                      isBrutalist || isRetro ? "1.0625rem" : "1rem"
                    }; color: var(--color-text-secondary); font-weight: ${
                      isBrutalist || isRetro ? "700" : "600"
                    };">
                          ${job.company || ""} ${
                      job.location ? `• ${job.location}` : ""
                    }
                        </p>
                      </div>
                      <span style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; color: var(--color-text-secondary); font-weight: ${
                      isBrutalist || isRetro ? "700" : "600"
                    }; white-space: nowrap; ${
                      isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                    }">
                        ${job.period || ""}
                      </span>
                    </div>
                    ${
                      job.achievements && job.achievements.length > 0
                        ? `
                    <ul style="margin: 0; padding-left: ${
                      isBrutalist ? "1.5rem" : "1.25rem"
                    }; display: flex; flex-direction: column; gap: ${
                            isBrutalist ? "0.75rem" : "0.5rem"
                          };">
                      ${job.achievements
                        .map(
                          (achievement) => `
                        <li style="font-family: ${
                          isRetro ? "Space Mono, monospace" : "inherit"
                        }; font-size: ${
                            isBrutalist || isRetro ? "1rem" : "0.9375rem"
                          }; line-height: ${
                            isElegant ? "1.9" : "1.7"
                          }; color: var(--color-text-secondary); ${
                            isBrutalist ? "font-weight: 600;" : ""
                          }">
                          ${achievement}
                        </li>
                      `
                        )
                        .join("")}
                    </ul>
                    `
                        : ""
                    }
                  </div>
                `
                  )
                  .join("")}
              </div>
            </section>
            `
                : ""
            }

            <!-- Education -->
            ${
              data.education && data.education.length > 0
                ? `
            <section style="margin-bottom: ${
              isBrutalist || isElegant ? "3.5rem" : "3rem"
            };">
              <h2 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; margin-bottom: ${
                    isBrutalist ? "2rem" : "2rem"
                  }; color: var(--color-accent); text-transform: uppercase; letter-spacing: ${
                    isBrutalist || isRetro ? "2px" : "0.05em"
                  }; ${
                    isBrutalist
                      ? "border-bottom: 3px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : isRetro
                      ? "border-bottom: 2px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : ""
                  }">
                ${isBrutalist ? "🎓 " : ""}Education
              </h2>
              <div style="display: flex; flex-direction: column; gap: ${
                isBrutalist || isElegant ? "2.5rem" : "2rem"
              };">
                ${data.education
                  .map(
                    (edu) => `
                  <div style="${
                    isNeumorphism
                      ? `padding: 1.5rem; border-radius: 16px; ${getNeumorphismShadow(
                          false
                        )}`
                      : isGlassmorphism
                      ? "padding: 1.5rem; border-radius: 16px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);"
                      : isBrutalist
                      ? "padding-left: 1rem; border-left: 4px solid var(--color-accent);"
                      : isRetro
                      ? "padding-left: 1rem; border-left: 3px solid var(--color-accent);"
                      : ""
                  }">
                    <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 0.75rem;">
                      <div style="flex: 1;">
                        <h3 style="font-family: ${
                          isElegant
                            ? "Playfair Display, serif"
                            : isRetro
                            ? "Space Mono, monospace"
                            : "inherit"
                        }; font-size: ${
                      isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: 0.25rem; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 0.5px;"
                        : ""
                    }">
                          ${edu.degree || ""}
                        </h3>
                        <p style="font-family: ${
                          isRetro ? "Space Mono, monospace" : "inherit"
                        }; font-size: ${
                      isBrutalist || isRetro ? "1.0625rem" : "1rem"
                    }; color: var(--color-text-secondary); font-weight: ${
                      isBrutalist || isRetro ? "700" : "600"
                    };">
                          ${edu.school || ""} ${
                      edu.location ? `• ${edu.location}` : ""
                    }
                        </p>
                        ${
                          edu.details
                            ? `
                        <p style="font-family: ${
                          isRetro ? "Space Mono, monospace" : "inherit"
                        }; font-size: ${
                                isBrutalist || isRetro
                                  ? "0.9375rem"
                                  : "0.875rem"
                              }; color: var(--color-text-secondary); margin-top: 0.25rem; ${
                                isBrutalist ? "font-weight: 600;" : ""
                              }">
                          ${edu.details}
                        </p>
                        `
                            : ""
                        }
                      </div>
                      <span style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; color: var(--color-text-secondary); font-weight: ${
                      isBrutalist || isRetro ? "700" : "600"
                    }; ${
                      isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                    }">
                        ${edu.year || ""}
                      </span>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </section>
            `
                : ""
            }

            <!-- Skills -->
            ${
              data.skills && data.skills.length > 0
                ? `
            <section style="margin-bottom: ${
              isBrutalist || isElegant ? "3.5rem" : "3rem"
            };">
              <h2 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; margin-bottom: ${
                    isBrutalist ? "2rem" : "2rem"
                  }; color: var(--color-accent); text-transform: uppercase; letter-spacing: ${
                    isBrutalist || isRetro ? "2px" : "0.05em"
                  }; ${
                    isBrutalist
                      ? "border-bottom: 3px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : isRetro
                      ? "border-bottom: 2px solid var(--color-accent); padding-bottom: 0.5rem;"
                      : ""
                  }">
                ${isBrutalist ? "⚡ " : ""}Skills
              </h2>
              <div style="display: grid; gap: ${
                isBrutalist || isElegant ? "1.5rem" : "1rem"
              };">
                ${data.skills
                  .map(
                    (skillGroup) => `
                  <div>
                    <h3 style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; font-size: ${
                      isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: ${
                      isBrutalist ? "1rem" : "0.75rem"
                    }; text-transform: uppercase; letter-spacing: ${
                      isBrutalist || isRetro ? "1px" : "0.05em"
                    }; color: var(--color-text-secondary);">
                      ${skillGroup.category || ""}
                    </h3>
                    <div style="display: flex; flex-wrap: wrap; gap: ${
                      isBrutalist ? "0.75rem" : "0.5rem"
                    };">
                      ${
                        skillGroup.items && skillGroup.items.length > 0
                          ? skillGroup.items
                              .map(
                                (skill) => `
                        <span style="font-family: ${
                          isRetro ? "Space Mono, monospace" : "inherit"
                        }; padding: ${
                                  isBrutalist
                                    ? "0.625rem 1.125rem"
                                    : "0.375rem 0.875rem"
                                }; background: ${
                                  isGradient
                                    ? "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))"
                                    : isGlassmorphism
                                    ? "rgba(255,255,255,0.05)"
                                    : isNeumorphism
                                    ? "var(--color-bg)"
                                    : isRetro
                                    ? "rgba(255,47,181,0.05)"
                                    : "var(--color-bg)"
                                }; border: ${
                                  isBrutalist ? "2px" : isRetro ? "2px" : "1px"
                                } solid ${
                                  isBrutalist || isRetro
                                    ? "var(--color-accent)"
                                    : isGlassmorphism
                                    ? "rgba(255,255,255,0.1)"
                                    : "var(--color-border)"
                                }; border-radius: ${
                                  isGradient || isRetro
                                    ? "999px"
                                    : isBrutalist || isElegant
                                    ? "0"
                                    : isNeumorphism || isGlassmorphism
                                    ? "12px"
                                    : "8px"
                                }; font-size: ${
                                  isBrutalist || isRetro
                                    ? "0.9375rem"
                                    : "0.875rem"
                                }; font-weight: ${
                                  isBrutalist ? "900" : isRetro ? "700" : "600"
                                }; ${
                                  isBrutalist || isRetro
                                    ? "text-transform: uppercase; letter-spacing: 0.5px;"
                                    : ""
                                } ${
                                  isGlassmorphism
                                    ? "backdrop-filter: blur(10px);"
                                    : isNeumorphism
                                    ? getNeumorphismShadow(false)
                                    : ""
                                }">
                          ${skill}
                        </span>
                      `
                              )
                              .join("")
                          : ""
                      }
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </section>
            `
                : ""
            }

            <!-- Two Column Layout for Certifications and Languages -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
              isBrutalist || isElegant ? "300px" : "280px"
            }, 1fr)); gap: ${isBrutalist || isElegant ? "3rem" : "2rem"};">
              
              <!-- Certifications -->
              ${
                data.certifications && data.certifications.length > 0
                  ? `
              <section>
                <h2 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: ${
                      isBrutalist || isRetro ? "1.125rem" : "1rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: ${
                      isBrutalist ? "2rem" : "2rem"
                    }; color: var(--color-accent); text-transform: uppercase; letter-spacing: ${
                      isBrutalist || isRetro ? "2px" : "0.05em"
                    }; ${
                      isBrutalist
                        ? "border-bottom: 3px solid var(--color-accent); padding-bottom: 0.5rem;"
                        : isRetro
                        ? "border-bottom: 2px solid var(--color-accent); padding-bottom: 0.5rem;"
                        : ""
                    }">
                  ${isBrutalist ? "🏆 " : ""}Certifications
                </h2>
                <div style="display: flex; flex-direction: column; gap: ${
                  isBrutalist ? "1.5rem" : "1rem"
                };">
                  ${data.certifications
                    .map(
                      (cert) => `
                    <div style="${
                      isNeumorphism
                        ? `padding: 1rem; border-radius: 12px; ${getNeumorphismShadow(
                            false
                          )}`
                        : isGlassmorphism
                        ? "padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05);"
                        : ""
                    }">
                      <h3 style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; font-size: ${
                        isBrutalist || isRetro ? "1rem" : "0.9375rem"
                      }; font-weight: ${
                        isBrutalist ? "900" : "700"
                      }; margin-bottom: 0.25rem; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase;"
                          : ""
                      }">
                        ${cert.name || ""}
                      </h3>
                      <p style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; font-size: ${
                        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                      }; color: var(--color-text-secondary); ${
                        isBrutalist || isRetro ? "font-weight: 700;" : ""
                      }">
                        ${cert.issuer || ""} ${
                        cert.year ? `• ${cert.year}` : ""
                      }
                      </p>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </section>
              `
                  : ""
              }

              <!-- Languages -->
              ${
                data.languages && data.languages.length > 0
                  ? `
              <section>
                <h2 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: ${
                      isBrutalist || isRetro ? "1.125rem" : "1rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: ${
                      isBrutalist ? "2rem" : "2rem"
                    }; color: var(--color-accent); text-transform: uppercase; letter-spacing: ${
                      isBrutalist || isRetro ? "2px" : "0.05em"
                    }; ${
                      isBrutalist
                        ? "border-bottom: 3px solid var(--color-accent); padding-bottom: 0.5rem;"
                        : isRetro
                        ? "border-bottom: 2px solid var(--color-accent); padding-bottom: 0.5rem;"
                        : ""
                    }">
                  ${isBrutalist ? "🌍 " : ""}Languages
                </h2>
                <div style="display: flex; flex-direction: column; gap: ${
                  isBrutalist ? "1.5rem" : "1rem"
                };">
                  ${data.languages
                    .map(
                      (lang) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; ${
                      isNeumorphism
                        ? `padding: 1rem; border-radius: 12px; ${getNeumorphismShadow(
                            false
                          )}`
                        : isGlassmorphism
                        ? "padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05);"
                        : ""
                    }">
                      <span style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; font-size: ${
                        isBrutalist || isRetro ? "1rem" : "0.9375rem"
                      }; font-weight: ${
                        isBrutalist || isRetro ? "900" : "600"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase;"
                          : ""
                      }">
                        ${lang.language || ""}
                      </span>
                      <span style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; font-size: ${
                        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                      }; color: var(--color-text-secondary); ${
                        isBrutalist || isRetro ? "font-weight: 700;" : ""
                      }">
                        ${lang.proficiency || ""}
                      </span>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </section>
              `
                  : ""
              }
            </div>

          </div>

          <!-- Footer -->
          <footer style="padding: ${
            isBrutalist ? "2.5rem" : "2rem"
          }; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
          : isRetro
          ? "var(--color-bg)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.03)"
          : "var(--color-bg)"
      }; border-top: ${isBrutalist ? "4px" : isRetro ? "3px" : "1px"} solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; border-radius: ${
        isGradient
          ? "0 0 20px 20px"
          : isBrutalist || isElegant || isRetro
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "0 0 24px 24px"
          : "0 0 12px 12px"
      }; text-align: center; ${
        isRetro ? "border-bottom: 3px solid #00f5ff;" : ""
      } ${isGlassmorphism ? "backdrop-filter: blur(10px);" : ""}">
            <button onclick="window.print()" style="font-family: ${
              isRetro ? "Space Mono, monospace" : "inherit"
            }; padding: ${
        isBrutalist ? "1rem 2.5rem" : "0.75rem 2rem"
      }; cursor: pointer; background: ${
        isBrutalist
          ? "var(--color-bg)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.15)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "var(--color-accent)"
      }; color: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient || isRetro
          ? "white"
          : isGlassmorphism || isNeumorphism
          ? "var(--color-text)"
          : "white"
      }; border: ${
        isBrutalist
          ? "3px solid var(--color-bg)"
          : isRetro
          ? "2px solid var(--color-accent)"
          : "none"
      }; border-radius: ${
        isGradient || isRetro
          ? "999px"
          : isBrutalist || isElegant
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "16px"
          : "8px"
      }; font-weight: ${
        isBrutalist || isRetro ? "700" : "500"
      }; transition: all 0.2s; font-size: ${
        isBrutalist || isRetro ? "1.125rem" : "1rem"
      }; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : isGradient
          ? "box-shadow: 0 8px 20px rgba(102,126,234,0.3);"
          : ""
      }" 
              onmouseover="${
                isBrutalist
                  ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                  : isGradient
                  ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 30px rgba(102,126,234,0.4)'`
                  : isRetro
                  ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 30px rgba(255,47,181,0.5)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.transform='translateY(-2px)'; this.style.opacity='0.9'`
              }" 
              onmouseout="${
                isBrutalist
                  ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                  : isGradient
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.3)'`
                  : isRetro
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.transform='translateY(0)'; this.style.opacity='1'`
              }">
              ${isBrutalist ? "🖨️ " : "🖨️ "}Print / Save as PDF
            </button>
          </footer>

        </div>
      </div>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 8px 8px 16px #c5c9ce, inset -8px -8px 16px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 16px 16px 32px #2a2d34, inset -16px -16px 32px #383d46;
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
        /* Retro grid background */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,47,181,0.02) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,47,181,0.02) 2px, transparent 2px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        `
            : ""
        }
        
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
          }
          header:first-of-type {
            display: none !important;
          }
          footer button {
            display: none !important;
          }
          .resume-container {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
            max-width: 100% !important;
          }
          ${
            isBrutalist
              ? `
          .resume-header {
            background: white !important;
            color: black !important;
          }
          .resume-header h1, .resume-header p, .resume-header div, .resume-header span {
            color: black !important;
          }
          `
              : ""
          }
        }
        
        @media (max-width: 768px) {
          .container { padding: 0 1.5rem !important; }
          .resume-header { padding: 2.5rem 1.5rem !important; }
          .resume-container > div { padding: 1.5rem !important; }
        }
        
        @media (max-width: 640px) {
          .resume-header { padding: 2rem 1.25rem !important; }
          .resume-container > div { padding: 1.25rem !important; }
          
          /* Stack flex layouts */
          div[style*="display: flex"][style*="justify-content: space-between"] {
            flex-direction: column !important;
            align-items: start !important;
            gap: 0.5rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .resume-header h1 {
            font-size: 2rem !important;
          }
        }
      </style>
    `;
    },
  }),

  // ============================================
  // TEMPLATE 6: PHOTOGRAPHY PORTFOLIO (MASONRY)
  // ============================================
  "photo-masonry": new Template("photo-masonry", {
    name: "Photography Portfolio (Masonry)",
    description: "Dynamic masonry grid photography portfolio",
    category: "Portfolio",
    image: "photography-masonry",

    fields: {
      photographerName: {
        type: "text",
        default: "Emma Wilson",
        label: "Photographer Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "Fine Art & Portrait Photography",
        label: "Tagline",
      },
      bio: {
        type: "textarea",
        default:
          "Capturing moments that tell stories. Based in NYC, available worldwide for commissions.",
        label: "Bio",
      },
      email: { type: "email", default: "hello@emmawilson.com", label: "Email" },
      instagram: {
        type: "text",
        default: "@emmawilsonphoto",
        label: "Instagram Handle",
      },
      categories: {
        type: "repeatable",
        label: "Gallery Categories",
        itemLabel: "Category",
        default: ["All", "Portraits", "Landscapes", "Street", "Editorial"],
        max: 8,
      },
      photos: {
        type: "group",
        label: "Portfolio Photos",
        itemLabel: "Photo",
        min: 4,
        max: 50,
        fields: {
          title: { type: "text", label: "Title", default: "" },
          category: { type: "text", label: "Category", default: "" },
          description: {
            type: "textarea",
            label: "Description (optional)",
            default: "",
          },
          imageUrl: {
            type: "url",
            label: "Image URL",
            default:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
          },
        },
        default: [
          {
            title: "Golden Hour",
            category: "Landscapes",
            description: "Sunset over the mountains",
            imageUrl:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
          },
          {
            title: "Urban Life",
            category: "Street",
            description: "City streets at night",
            imageUrl:
              "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600",
          },
          {
            title: "Portrait Study",
            category: "Portraits",
            description: "Natural light portrait",
            imageUrl:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
          },
          {
            title: "Architecture",
            category: "Editorial",
            description: "Modern design",
            imageUrl:
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700",
          },
          {
            title: "Nature",
            category: "Landscapes",
            description: "Forest path",
            imageUrl:
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
          },
          {
            title: "City Lights",
            category: "Street",
            description: "Urban exploration",
            imageUrl:
              "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
          },
        ],
      },
      services: {
        type: "group",
        label: "Services",
        itemLabel: "Service",
        min: 0,
        max: 4,
        fields: {
          name: { type: "text", label: "Service Name", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            name: "Portrait Sessions",
            description: "Professional portraits for individuals and families",
          },
          {
            name: "Event Photography",
            description: "Coverage for weddings, parties, and corporate events",
          },
          {
            name: "Commercial Work",
            description: "Product and editorial photography for brands",
          },
        ],
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Neumorphism box-shadow helpers
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
      <!-- Minimal Floating Header with Theme Toggle -->
      <header style="position: fixed; top: ${
        isBrutalist ? "1.5rem" : "2rem"
      }; left: ${isBrutalist ? "1.5rem" : "2rem"}; right: ${
        isBrutalist ? "1.5rem" : "2rem"
      }; z-index: 1000; display: flex; justify-content: space-between; align-items: center;">
        <div style="background: ${
          isGlassmorphism ? "rgba(255,255,255,0.1)" : "var(--color-bg)"
        }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px);"
          : "backdrop-filter: blur(10px);"
      } padding: ${
        isBrutalist ? "1.25rem 2rem" : "1rem 1.5rem"
      }; border-radius: ${
        isGradient || isRetro
          ? "999px"
          : isBrutalist || isElegant
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "24px"
          : "50px"
      }; border: ${isBrutalist ? "3px" : isRetro ? "2px" : "1px"} solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.2)"
          : "var(--color-border)"
      }; ${
        isBrutalist
          ? "box-shadow: 6px 6px 0 var(--color-accent);"
          : isGradient
          ? "box-shadow: 0 8px 24px rgba(102,126,234,0.15);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : "box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
      }">
          <h1 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist || isRetro ? "1.25rem" : "1.125rem"
      }; font-weight: ${isBrutalist ? "900" : "700"}; letter-spacing: ${
        isBrutalist || isRetro ? "1px" : "-0.01em"
      }; margin: 0; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }">${data.photographerName || "Photographer"}</h1>
        </div>
        <label class="theme-toggle-switch-wrapper" style="cursor: pointer; background: ${
          isGlassmorphism ? "rgba(255,255,255,0.1)" : "var(--color-bg)"
        }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px);"
          : "backdrop-filter: blur(10px);"
      } padding: ${isBrutalist ? "1rem" : "0.75rem"}; border-radius: ${
        isBrutalist || isElegant ? "0" : "50%"
      }; border: ${isBrutalist ? "3px" : isRetro ? "2px" : "1px"} solid ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.2)"
          : "var(--color-border)"
      }; ${
        isBrutalist
          ? "box-shadow: 6px 6px 0 var(--color-accent);"
          : isGradient
          ? "box-shadow: 0 8px 24px rgba(102,126,234,0.15);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : "box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
      }">
          <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="theme-toggle-slider"></span>
        </label>
      </header>

      <!-- Compact Hero Section -->
      <section style="min-height: ${
        isBrutalist || isRetro ? "85vh" : "75vh"
      }; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
          : isRetro
          ? "var(--color-bg)"
          : "var(--color-bg)"
      }; padding: 8rem 2rem 4rem;">
        <div style="max-width: ${isElegant ? "650px" : "700px"}; z-index: 1;">
          <h2 ${
            isRetro
              ? `class="glitch-photo" data-text="${
                  data.photographerName || "Photographer"
                }"`
              : ""
          } style="font-family: ${
        isElegant
          ? "Playfair Display, serif"
          : isRetro
          ? "Space Mono, monospace"
          : "inherit"
      }; font-size: clamp(${isBrutalist || isRetro ? "3.5rem" : "3rem"}, 8vw, ${
        isBrutalist || isRetro ? "7rem" : "6rem"
      }); font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "900"
      }; margin-bottom: 1rem; letter-spacing: ${
        isRetro ? "3px" : "-0.04em"
      }; line-height: 0.95; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isBrutalist
          ? "color: var(--color-bg);"
          : isRetro
          ? "position: relative;"
          : ""
      }">
            ${
              isBrutalist
                ? (data.photographerName || "Photographer")
                    .split(" ")
                    .map((word, i) =>
                      i === 0
                        ? `<span style="background: var(--color-accent); color: var(--color-bg); padding: 0 0.5rem; display: inline-block; transform: rotate(-2deg);">${word}</span>`
                        : word
                    )
                    .join(" ")
                : ""
            }
            ${
              isGradient
                ? (data.photographerName || "Photographer")
                    .split(" ")
                    .map((word, i) =>
                      i ===
                      (data.photographerName || "Photographer").split(" ")
                        .length -
                        1
                        ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>`
                        : word
                    )
                    .join(" ")
                : ""
            }
            ${
              isRetro
                ? `<span style="background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${
                    data.photographerName || "Photographer"
                  }</span>`
                : ""
            }
            ${
              !isBrutalist && !isGradient && !isRetro
                ? data.photographerName || "Photographer"
                : ""
            }
          </h2>
          ${
            data.tagline
              ? `
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${
                  isBrutalist || isRetro ? "1.5rem" : "1.25rem"
                }, 3vw, ${
                  isBrutalist || isRetro ? "2rem" : "1.75rem"
                }); color: ${
                  isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
                }; margin-bottom: 2rem; font-weight: ${
                  isBrutalist ? "800" : isElegant ? "400" : "600"
                }; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 2px;"
                    : ""
                }">
            ${data.tagline}
          </p>
          `
              : ""
          }
          ${
            data.bio
              ? `
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
                  isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                }; color: ${
                  isBrutalist
                    ? "var(--color-bg)"
                    : "var(--color-text-secondary)"
                }; margin-bottom: 3rem; line-height: ${
                  isElegant ? "1.9" : "1.8"
                }; font-weight: ${isElegant ? "300" : "normal"};">
            ${data.bio}
          </p>
          `
              : ""
          }
          <a href="#gallery" style="display: inline-block; padding: ${
            isBrutalist ? "1.25rem 3rem" : "1rem 2.5rem"
          }; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.15)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "var(--color-text)"
      }; color: ${
        isBrutalist || isGradient || isRetro
          ? "white"
          : isGlassmorphism || isNeumorphism
          ? "var(--color-text)"
          : "var(--color-bg)"
      }; text-decoration: none; border-radius: ${
        isGradient || isRetro
          ? "999px"
          : isBrutalist || isElegant
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "16px"
          : "50px"
      }; font-weight: ${
        isBrutalist || isRetro ? "700" : "600"
      }; transition: all 0.3s; ${
        isBrutalist
          ? "border: 3px solid var(--color-accent); text-transform: uppercase; letter-spacing: 1px;"
          : isRetro
          ? "border: 2px solid var(--color-accent); text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 30px rgba(255,47,181,0.3);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : ""
      } ${isGradient ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);" : ""}" 
            onmouseover="${
              isBrutalist
                ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-accent)'`
                : isGradient
                ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'`
                : isRetro
                ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 0 50px rgba(255,47,181,0.5)'`
                : isNeumorphism
                ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                : `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'`
            }" 
            onmouseout="${
              isBrutalist
                ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                : isGradient
                ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'`
                : isRetro
                ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(255,47,181,0.3)'`
                : isNeumorphism
                ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                : `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
            }">
            View Gallery ${isBrutalist ? "↓" : "↓"}
          </a>
        </div>
      </section>

      <!-- Filter Pills -->
      <section id="gallery" style="padding: ${
        isBrutalist || isRetro ? "5rem 0 2rem" : "4rem 0 2rem"
      }; background: ${isBrutalist ? "var(--color-text)" : "var(--color-bg)"};">
        <div class="container">
          <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: ${
            isBrutalist ? "1rem" : "0.75rem"
          }; margin-bottom: ${isBrutalist ? "4rem" : "3rem"};">
            ${
              data.categories && data.categories.length > 0
                ? data.categories
                    .map(
                      (cat, index) => `
              <button 
                class="filter-btn ${index === 0 ? "active" : ""}" 
                onclick="filterGallery('${cat.toLowerCase()}')"
                style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; padding: ${
                        isBrutalist ? "1rem 2rem" : "0.75rem 1.75rem"
                      }; background: ${
                        index === 0
                          ? isBrutalist
                            ? "var(--color-accent)"
                            : isGradient
                            ? "linear-gradient(135deg, #667eea, #764ba2)"
                            : isRetro
                            ? "var(--color-accent)"
                            : isGlassmorphism
                            ? "rgba(255,255,255,0.15)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-text)"
                          : "transparent"
                      }; color: ${
                        index === 0
                          ? isBrutalist || isGradient || isRetro
                            ? "white"
                            : isGlassmorphism || isNeumorphism
                            ? "var(--color-text)"
                            : "var(--color-bg)"
                          : isBrutalist
                          ? "var(--color-bg)"
                          : "var(--color-text)"
                      }; border: ${
                        isBrutalist ? "3px" : isRetro ? "2px" : "2px"
                      } solid ${
                        index === 0
                          ? isBrutalist
                            ? "var(--color-accent)"
                            : isRetro
                            ? "var(--color-accent)"
                            : isGlassmorphism
                            ? "rgba(255,255,255,0.2)"
                            : "var(--color-text)"
                          : isBrutalist || isRetro
                          ? "var(--color-accent)"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.1)"
                          : "var(--color-border)"
                      }; border-radius: ${
                        isGradient || isRetro
                          ? "999px"
                          : isBrutalist || isElegant
                          ? "0"
                          : isNeumorphism || isGlassmorphism
                          ? "16px"
                          : "50px"
                      }; font-weight: ${
                        isBrutalist || isRetro ? "700" : "600"
                      }; cursor: pointer; transition: all 0.2s; font-size: ${
                        isBrutalist || isRetro ? "1rem" : "0.9375rem"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      } ${
                        isGlassmorphism && index === 0
                          ? "backdrop-filter: blur(10px);"
                          : ""
                      } ${
                        isNeumorphism && index === 0
                          ? getNeumorphismShadow(false)
                          : ""
                      }"
              >
                ${cat}
              </button>
            `
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Masonry Gallery with Theme-Specific Styling -->
      <section style="padding: 0 0 ${
        isBrutalist || isRetro ? "8rem" : "6rem"
      }; background: ${isBrutalist ? "var(--color-text)" : "var(--color-bg)"};">
        <div class="container">
          <div id="masonry-grid" style="column-count: 3; column-gap: ${
            isBrutalist ? "2rem" : isElegant ? "2rem" : "1.5rem"
          };">
            ${
              data.photos && data.photos.length > 0
                ? data.photos
                    .map(
                      (photo, index) => `
              <div class="gallery-item" data-category="${(
                photo.category || ""
              ).toLowerCase()}" style="break-inside: avoid; margin-bottom: ${
                        isBrutalist ? "2rem" : isElegant ? "2rem" : "1.5rem"
                      }; cursor: pointer; position: relative; overflow: hidden; border-radius: ${
                        isGradient
                          ? "24px"
                          : isBrutalist || isElegant || isRetro
                          ? "0"
                          : isNeumorphism || isGlassmorphism
                          ? "20px"
                          : "16px"
                      }; ${
                        isBrutalist
                          ? "border: 3px solid var(--color-accent);"
                          : isRetro
                          ? "border: 2px solid var(--color-accent);"
                          : ""
                      }" onclick="openLightbox(${index})">
                <div style="position: relative; overflow: hidden; border-radius: ${
                  isGradient
                    ? "24px"
                    : isBrutalist || isElegant || isRetro
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "20px"
                    : "16px"
                }; transition: all 0.3s; ${
                        isNeumorphism
                          ? getNeumorphismShadow(false)
                          : isGradient
                          ? "box-shadow: 0 10px 30px rgba(0,0,0,0.08);"
                          : isGlassmorphism
                          ? "box-shadow: 0 10px 30px rgba(0,0,0,0.1);"
                          : ""
                      }">
                  <img 
                    src="${photo.imageUrl || ""}" 
                    alt="${photo.title || "Photo"}"
                    style="width: 100%; height: auto; display: block; transition: transform ${
                      isBrutalist || isRetro ? "0.2s" : "0.5s"
                    } ease; ${
                        isGlassmorphism ? "filter: brightness(0.95);" : ""
                      }"
                    onmouseover="this.style.transform='scale(${
                      isBrutalist ? "1.05" : isRetro ? "1.08" : "1.08"
                    })'"
                    onmouseout="this.style.transform='scale(1)'"
                  />
                  <div style="position: absolute; inset: 0; background: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : isRetro
                      ? "linear-gradient(to top, var(--color-accent) 0%, rgba(255,47,181,0.6) 50%, transparent 100%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
                  }; display: flex; align-items: flex-end; padding: ${
                        isBrutalist ? "2.5rem" : "2rem"
                      }; opacity: 0; transition: opacity 0.3s; ${
                        isGlassmorphism ? "backdrop-filter: blur(10px);" : ""
                      }" class="photo-overlay">
                    <div>
                      <h3 style="font-family: ${
                        isElegant
                          ? "Playfair Display, serif"
                          : isRetro
                          ? "Space Mono, monospace"
                          : "inherit"
                      }; font-size: ${
                        isBrutalist ? "1.5rem" : isRetro ? "1.25rem" : "1.25rem"
                      }; font-weight: ${
                        isBrutalist ? "900" : "700"
                      }; margin-bottom: 0.5rem; color: ${
                        isBrutalist ? "var(--color-bg)" : "white"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      }">${photo.title || ""}</h3>
                      ${
                        photo.description
                          ? `<p style="font-family: ${
                              isRetro ? "Space Mono, monospace" : "inherit"
                            }; font-size: ${
                              isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                            }; color: ${
                              isBrutalist
                                ? "var(--color-bg)"
                                : "rgba(255,255,255,0.9)"
                            }; ${isBrutalist ? "font-weight: 700;" : ""}">${
                              photo.description
                            }</p>`
                          : ""
                      }
                    </div>
                  </div>
                </div>
              </div>
            `
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Simplified Contact CTA -->
      <section style="padding: ${
        isBrutalist || isRetro ? "10rem 0 8rem" : "8rem 0 6rem"
      }; text-align: center; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
          : isElegant
          ? "var(--color-surface)"
          : isGlassmorphism
          ? "transparent"
          : "var(--color-bg)"
      }; ${isRetro ? "border-top: 3px solid #00f5ff;" : ""} ${
        isBrutalist || isGradient || isRetro ? "color: white;" : ""
      }">
        <div class="container" style="max-width: ${
          isElegant ? "650px" : "700px"
        }; ${
        isGlassmorphism
          ? "padding: 5rem 3rem; border-radius: 32px; background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1);"
          : isNeumorphism
          ? `padding: 5rem 3rem; border-radius: 32px; ${getNeumorphismShadow(
              false
            )}`
          : ""
      }">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${
        isBrutalist || isRetro ? "2.5rem" : "2.5rem"
      }, 7vw, ${isBrutalist || isRetro ? "6rem" : "5rem"}); font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "900"
      }; margin-bottom: 1.5rem; letter-spacing: ${
        isRetro ? "3px" : "-0.04em"
      }; line-height: 1; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isBrutalist
          ? "color: var(--color-bg);"
          : isGradient || isRetro
          ? "color: white;"
          : ""
      }">
            ${
              isBrutalist
                ? "GET IN TOUCH"
                : isRetro
                ? "LETS SHOOT"
                : "Let's Create Together"
            }
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist || isRetro ? "1.375rem" : "1.25rem"
      }; color: ${
        isBrutalist
          ? "var(--color-bg)"
          : isGradient || isRetro
          ? "rgba(255,255,255,0.9)"
          : "var(--color-text-secondary)"
      }; margin-bottom: 3rem; line-height: 1.7; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Available for commissions and collaborations worldwide
          </p>
          <div style="display: flex; gap: ${
            isBrutalist ? "1.5rem" : "1rem"
          }; justify-content: center; flex-wrap: wrap;">
            ${
              data.email
                ? `
            <a href="mailto:${data.email}" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                    isBrutalist ? "1.5rem 3rem" : "1.25rem 2.5rem"
                  }; background: ${
                    isBrutalist || isGradient || isRetro
                      ? "white"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.15)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : "var(--color-accent)"
                  }; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : isGradient
                      ? "#667eea"
                      : isRetro
                      ? "var(--color-accent)"
                      : isGlassmorphism || isNeumorphism
                      ? "var(--color-text)"
                      : "white"
                  }; text-decoration: none; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : "50px"
                  }; font-weight: ${
                    isBrutalist || isRetro ? "700" : "600"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; transition: all 0.2s; ${
                    isBrutalist
                      ? "border: 3px solid white; text-transform: uppercase; letter-spacing: 1px;"
                      : isRetro
                      ? "border: 2px solid white; text-transform: uppercase; letter-spacing: 1px;"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
              onmouseover="${
                isBrutalist
                  ? `this.style.background='transparent'; this.style.color='white'`
                  : isRetro
                  ? `this.style.background='transparent'; this.style.color='white'`
                  : isGradient
                  ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.2)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'`
              }" 
              onmouseout="${
                isBrutalist
                  ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                  : isRetro
                  ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                  : isGradient
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
              }">
              Get in Touch
            </a>
            `
                : ""
            }
            ${
              data.instagram
                ? `
            <a href="https://instagram.com/${data.instagram.replace(
              "@",
              ""
            )}" target="_blank" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                    isBrutalist ? "1.5rem 3rem" : "1.25rem 2.5rem"
                  }; background: transparent; color: ${
                    isBrutalist || isGradient || isRetro
                      ? "white"
                      : "var(--color-text)"
                  }; text-decoration: none; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : "50px"
                  }; border: ${
                    isBrutalist ? "3px" : isRetro ? "2px" : "2px"
                  } solid ${
                    isBrutalist || isGradient || isRetro
                      ? "white"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.2)"
                      : "var(--color-border)"
                  }; font-weight: ${
                    isBrutalist || isRetro ? "700" : "600"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; transition: all 0.2s; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  } ${
                    isGlassmorphism
                      ? "backdrop-filter: blur(10px);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
              onmouseover="${
                isBrutalist || isRetro
                  ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                  : isGradient
                  ? `this.style.borderColor='white'`
                  : `this.style.borderColor='var(--color-text)'`
              }" 
              onmouseout="${
                isBrutalist || isRetro
                  ? `this.style.background='transparent'; this.style.color='white'`
                  : isGradient
                  ? `this.style.borderColor='white'`
                  : `this.style.borderColor='var(--color-border)'`
              }">
              ${data.instagram}
            </a>
            `
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Minimal Footer -->
      <footer style="padding: ${
        isBrutalist ? "3rem 0" : "2rem 0"
      }; text-align: center; color: var(--color-text-secondary); font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.875rem"
      }; border-top: ${isBrutalist ? "3px" : isRetro ? "2px" : "1px"} solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; font-weight: ${isBrutalist ? "900" : isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 2px;"
          : ""
      }">
        <div class="container">
          <p>© 2024 ${data.photographerName || "Photographer"}</p>
        </div>
      </footer>

      <!-- Fullscreen Lightbox with Theme-Specific Styling -->
      <div id="lightbox" style="display: none; position: fixed; inset: 0; background: ${
        isBrutalist ? "var(--color-accent)" : "rgba(0,0,0,0.97)"
      }; z-index: 10000; align-items: center; justify-content: center; padding: 2rem;" onclick="closeLightbox()">
        <button onclick="closeLightbox()" style="position: absolute; top: 2rem; right: 2rem; background: ${
          isGlassmorphism
            ? "rgba(255,255,255,0.1)"
            : isBrutalist
            ? "var(--color-bg)"
            : "rgba(255,255,255,0.1)"
        }; border: ${
        isBrutalist ? "3px solid var(--color-bg)" : "none"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "white"
      }; width: 56px; height: 56px; border-radius: ${
        isBrutalist || isElegant ? "0" : "50%"
      }; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; font-weight: ${
        isBrutalist ? "900" : "normal"
      };" onmouseover="this.style.background='${
        isBrutalist
          ? "var(--color-text)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.2)"
          : "rgba(255,255,255,0.2)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-bg)'" : ""
      }" onmouseout="this.style.background='${
        isBrutalist
          ? "var(--color-bg)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0.1)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-text)'" : ""
      }">×</button>
        <button onclick="event.stopPropagation(); prevPhoto()" style="position: absolute; left: 2rem; background: ${
          isGlassmorphism
            ? "rgba(255,255,255,0.1)"
            : isBrutalist
            ? "var(--color-bg)"
            : "rgba(255,255,255,0.1)"
        }; border: ${
        isBrutalist ? "3px solid var(--color-bg)" : "none"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "white"
      }; width: 56px; height: 56px; border-radius: ${
        isBrutalist || isElegant ? "0" : "50%"
      }; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; font-weight: ${
        isBrutalist ? "900" : "normal"
      };" onmouseover="this.style.background='${
        isBrutalist
          ? "var(--color-text)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.2)"
          : "rgba(255,255,255,0.2)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-bg)'" : ""
      }" onmouseout="this.style.background='${
        isBrutalist
          ? "var(--color-bg)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0.1)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-text)'" : ""
      }">←</button>
        <button onclick="event.stopPropagation(); nextPhoto()" style="position: absolute; right: 2rem; background: ${
          isGlassmorphism
            ? "rgba(255,255,255,0.1)"
            : isBrutalist
            ? "var(--color-bg)"
            : "rgba(255,255,255,0.1)"
        }; border: ${
        isBrutalist ? "3px solid var(--color-bg)" : "none"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "white"
      }; width: 56px; height: 56px; border-radius: ${
        isBrutalist || isElegant ? "0" : "50%"
      }; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; font-weight: ${
        isBrutalist ? "900" : "normal"
      };" onmouseover="this.style.background='${
        isBrutalist
          ? "var(--color-text)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.2)"
          : "rgba(255,255,255,0.2)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-bg)'" : ""
      }" onmouseout="this.style.background='${
        isBrutalist
          ? "var(--color-bg)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.1)"
          : "rgba(255,255,255,0.1)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-text)'" : ""
      }">→</button>
        <div style="max-width: 90vw; max-height: 90vh; text-align: center;">
          <img id="lightbox-img" src="" alt="" style="max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: ${
            isGradient
              ? "24px"
              : isBrutalist || isElegant || isRetro
              ? "0"
              : "12px"
          }; ${
        isBrutalist
          ? "border: 4px solid var(--color-bg);"
          : isRetro
          ? "border: 3px solid var(--color-accent);"
          : ""
      } box-shadow: ${
        isBrutalist
          ? "16px 16px 0 var(--color-bg)"
          : "0 20px 60px rgba(0,0,0,0.5)"
      };" onclick="event.stopPropagation()">
          <div id="lightbox-info" style="color: ${
            isBrutalist ? "var(--color-bg)" : "white"
          }; margin-top: 2rem; padding: 1rem;"></div>
        </div>
      </div>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 8px 8px 16px #c5c9ce, inset -8px -8px 16px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 16px 16px 32px #2a2d34, inset -16px -16px 32px #383d46;
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
        /* Retro grid background */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,47,181,0.02) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,47,181,0.02) 2px, transparent 2px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        
        /* Retro glitch effect for photos */
        .glitch-photo::before,
        .glitch-photo::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-photo::before {
          animation: glitch-photo1 3s infinite;
          color: var(--color-accent);
          z-index: -1;
        }
        
        .glitch-photo::after {
          animation: glitch-photo2 4s infinite;
          color: #00f5ff;
          z-index: -2;
        }
        
        @keyframes glitch-photo1 {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(-2px, -2px); }
          75% { transform: translate(2px, 2px); }
        }
        
        @keyframes glitch-photo2 {
          0%, 100% { transform: translate(0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(2px, 2px); }
          75% { transform: translate(-2px, -2px); }
        }
        `
            : ""
        }
        
        .photo-overlay { pointer-events: none; }
        .gallery-item:hover .photo-overlay { opacity: 1; }
        
        .filter-btn:hover {
          transform: translateY(-2px);
        }
        
        .filter-btn.active {
          background: ${
            isBrutalist
              ? "var(--color-accent)"
              : isGradient
              ? "linear-gradient(135deg, #667eea, #764ba2)"
              : isRetro
              ? "var(--color-accent)"
              : isGlassmorphism
              ? "rgba(255,255,255,0.15)"
              : isNeumorphism
              ? "var(--color-bg)"
              : "var(--color-text)"
          } !important;
          color: ${
            isBrutalist || isGradient || isRetro
              ? "white"
              : isGlassmorphism || isNeumorphism
              ? "var(--color-text)"
              : "var(--color-bg)"
          } !important;
          border-color: ${
            isBrutalist
              ? "var(--color-accent)"
              : isRetro
              ? "var(--color-accent)"
              : "var(--color-text)"
          } !important;
        }
        
        @media (max-width: 1024px) {
          #masonry-grid { column-count: 2; column-gap: 1.5rem; }
          header { top: 1rem; left: 1rem; right: 1rem; }
        }
        
        @media (max-width: 768px) {
          #masonry-grid { column-count: 1; column-gap: 0; }
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
          });
          
          event.target.classList.add('active');
          
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
    `;
    },
  }),

  // ============================================
  // TEMPLATE 7: PHOTOGRAPHY PORTFOLIO (GRID)
  // ============================================
  "photo-grid": new Template("photo-grid", {
    name: "Photography Portfolio (Grid)",
    description: "Clean uniform grid photography portfolio",
    image: "photography-grid",
    category: "Portfolio",
    fields: {
      photographerName: {
        type: "text",
        default: "Alex Chen",
        label: "Photographer Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "Commercial & Lifestyle Photography",
        label: "Tagline",
      },
      bio: {
        type: "textarea",
        default:
          "Award-winning photographer specializing in commercial and lifestyle photography. Creating compelling visual stories for brands and editorial.",
        label: "Bio",
      },
      email: { type: "email", default: "hello@alexchen.com", label: "Email" },
      phone: {
        type: "tel",
        default: "+1 (555) 123-4567",
        label: "Phone (optional)",
      },
      instagram: {
        type: "text",
        default: "@alexchenphoto",
        label: "Instagram Handle",
      },
      categories: {
        type: "repeatable",
        label: "Gallery Categories",
        itemLabel: "Category",
        default: ["All", "Commercial", "Lifestyle", "Fashion", "Travel"],
        max: 8,
      },
      photos: {
        type: "group",
        label: "Portfolio Photos",
        itemLabel: "Photo",
        min: 4,
        max: 50,
        fields: {
          title: { type: "text", label: "Title", default: "" },
          category: { type: "text", label: "Category", default: "" },
          description: {
            type: "textarea",
            label: "Description (optional)",
            default: "",
          },
          imageUrl: {
            type: "url",
            label: "Image URL",
            default:
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
          },
        },
        default: [
          {
            title: "Brand Campaign",
            category: "Commercial",
            description: "Product photography for luxury brand",
            imageUrl:
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
          },
          {
            title: "Urban Style",
            category: "Lifestyle",
            description: "Editorial lifestyle shoot",
            imageUrl:
              "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800",
          },
          {
            title: "Fashion Week",
            category: "Fashion",
            description: "Backstage moments",
            imageUrl:
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800",
          },
          {
            title: "Wanderlust",
            category: "Travel",
            description: "Travel photography series",
            imageUrl:
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
          },
          {
            title: "Product Line",
            category: "Commercial",
            description: "E-commerce photography",
            imageUrl:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
          },
          {
            title: "Daily Life",
            category: "Lifestyle",
            description: "Authentic moments",
            imageUrl:
              "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
          },
          {
            title: "Runway",
            category: "Fashion",
            description: "Fashion show coverage",
            imageUrl:
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
          },
          {
            title: "Destinations",
            category: "Travel",
            description: "Global adventures",
            imageUrl:
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
          },
        ],
      },
      awards: {
        type: "group",
        label: "Awards & Recognition",
        itemLabel: "Award",
        min: 0,
        max: 5,
        fields: {
          title: { type: "text", label: "Award Title", default: "" },
          year: { type: "text", label: "Year", default: "" },
        },
        default: [
          { title: "International Photography Awards - Gold", year: "2023" },
          { title: "Best Commercial Photographer", year: "2022" },
        ],
      },
      clients: {
        type: "repeatable",
        label: "Notable Clients",
        itemLabel: "Client",
        default: ["Nike", "Apple", "Vogue", "National Geographic"],
        max: 10,
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Neumorphism box-shadow helpers
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
      <!-- Sticky Header with Theme-Specific Styling -->
      <header style="padding: ${
        isBrutalist ? "2rem 0" : "1.5rem 0"
      }; border-bottom: ${
        isBrutalist ? "4px" : isRetro ? "3px" : "1px"
      } solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; position: sticky; top: 0; background: ${
        isGlassmorphism ? "rgba(255,255,255,0.1)" : "var(--color-bg)"
      }; z-index: 100; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px);"
          : "backdrop-filter: blur(10px);"
      }">
        <div class="container">
          <nav style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-weight: ${isBrutalist ? "900" : "600"}; font-size: ${
        isBrutalist || isRetro ? "1.375rem" : "1.125rem"
      }; letter-spacing: ${isBrutalist || isRetro ? "2px" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }">
              ${data.photographerName || "PHOTOGRAPHER"}
            </div>
            <ul class="nav-links" style="display: flex; gap: ${
              isBrutalist || isRetro ? "2.5rem" : "2rem"
            }; list-style: none; align-items: center;">
              <li><a href="#gallery" style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: var(--color-text-secondary); text-decoration: none; font-size: ${
        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
      }; font-weight: ${
        isBrutalist || isRetro ? "700" : "normal"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">Work</a></li>
              <li><a href="#about" style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: var(--color-text-secondary); text-decoration: none; font-size: ${
        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
      }; font-weight: ${
        isBrutalist || isRetro ? "700" : "normal"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">About</a></li>
              <li><a href="#contact" style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: var(--color-text-secondary); text-decoration: none; font-size: ${
        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
      }; font-weight: ${
        isBrutalist || isRetro ? "700" : "normal"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">Contact</a></li>
              <li>
                <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
                  isNeumorphism
                    ? `padding: 0.5rem; border-radius: 12px; display: inline-block; background: var(--color-bg); ${getNeumorphismShadow(
                        false
                      )}`
                    : ""
                }">
                  <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
                  <span class="theme-toggle-slider"></span>
                </label>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <!-- Hero Section with Theme-Specific Styling -->
      <section style="padding: ${
        isBrutalist || isRetro ? "10rem 0 8rem" : "8rem 0 6rem"
      }; text-align: center; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
          : "var(--color-bg)"
      };">
        <div class="container">
          <h1 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${
        isBrutalist || isRetro ? "3rem" : "2.5rem"
      }, 7vw, ${isBrutalist || isRetro ? "6rem" : "5rem"}); font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "700"
      }; line-height: 1.1; letter-spacing: ${
        isRetro ? "3px" : "-0.03em"
      }; margin-bottom: 1.5rem; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${isBrutalist ? "color: var(--color-bg);" : ""}">
            ${
              isBrutalist
                ? (data.photographerName || "Photographer")
                    .split(" ")
                    .map((word, i) =>
                      i === 0
                        ? `<span style="background: var(--color-accent); color: var(--color-bg); padding: 0 0.5rem; display: inline-block; transform: rotate(-2deg);">${word}</span>`
                        : word
                    )
                    .join(" ")
                : ""
            }
            ${
              isGradient
                ? (data.photographerName || "Photographer")
                    .split(" ")
                    .map((word, i) =>
                      i ===
                      (data.photographerName || "Photographer").split(" ")
                        .length -
                        1
                        ? `<span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${word}</span>`
                        : word
                    )
                    .join(" ")
                : ""
            }
            ${
              isRetro
                ? `<span style="background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${
                    data.photographerName || "Photographer"
                  }</span>`
                : ""
            }
            ${
              !isBrutalist && !isGradient && !isRetro
                ? data.photographerName || "Photographer"
                : ""
            }
          </h1>
          ${
            data.bio
              ? `
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
                  isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                }; color: ${
                  isBrutalist
                    ? "var(--color-bg)"
                    : "var(--color-text-secondary)"
                }; max-width: 600px; margin: 0 auto 3rem; line-height: ${
                  isElegant ? "1.9" : "1.8"
                }; font-weight: ${isElegant ? "300" : "normal"};">
            ${data.bio}
          </p>
          `
              : ""
          }
          <div style="display: flex; gap: ${
            isBrutalist ? "1.5rem" : "1rem"
          }; justify-content: center; flex-wrap: wrap;">
            ${
              data.email
                ? `
            <a href="mailto:${data.email}" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                    isBrutalist ? "1.25rem 2.5rem" : "1rem 2rem"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : "8px"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "700" : "500"
                  }; transition: all 0.2s; display: inline-block; background: ${
                    isGradient
                      ? "linear-gradient(135deg, #667eea, #764ba2)"
                      : isRetro
                      ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.15)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : "var(--color-accent)"
                  }; color: ${
                    isGradient || isRetro
                      ? "white"
                      : isGlassmorphism || isNeumorphism
                      ? "var(--color-text)"
                      : "white"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.0625rem" : "1rem"
                  }; ${
                    isBrutalist
                      ? "border: 3px solid var(--color-accent); text-transform: uppercase; letter-spacing: 1px;"
                      : isRetro
                      ? "border: 2px solid var(--color-accent); text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 30px rgba(255,47,181,0.3);"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  } ${
                    isGradient
                      ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);"
                      : ""
                  }" 
              onmouseover="${
                isBrutalist
                  ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                  : isGradient
                  ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'`
                  : isRetro
                  ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 50px rgba(255,47,181,0.5)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.transform='translateY(-2px)'; this.style.opacity='0.9'`
              }" 
              onmouseout="${
                isBrutalist
                  ? `this.style.background='var(--color-accent)'; this.style.color='white'`
                  : isGradient
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'`
                  : isRetro
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(255,47,181,0.3)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.transform='translateY(0)'; this.style.opacity='1'`
              }">
              Get Started
            </a>
            `
                : ""
            }
            ${
              data.phone
                ? `
            <a href="tel:${data.phone.replace(
              /\s/g,
              ""
            )}" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                    isBrutalist ? "1.25rem 2.5rem" : "1rem 2rem"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : "8px"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "700" : "500"
                  }; transition: all 0.2s; display: inline-block; border: ${
                    isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                  } solid ${
                    isBrutalist
                      ? "var(--color-bg)"
                      : isRetro
                      ? "#00f5ff"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.2)"
                      : "var(--color-border)"
                  }; color: ${
                    isBrutalist ? "var(--color-bg)" : "var(--color-text)"
                  }; background: ${
                    isGlassmorphism
                      ? "rgba(255,255,255,0.05)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : "transparent"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.0625rem" : "1rem"
                  }; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  } ${isRetro ? "box-shadow: 0 0 20px #00f5ff;" : ""} ${
                    isGlassmorphism
                      ? "backdrop-filter: blur(10px);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
              onmouseover="${
                isBrutalist
                  ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                  : isRetro
                  ? `this.style.background='#00f5ff'; this.style.color='#0d001a'; this.style.boxShadow='0 0 40px #00f5ff'`
                  : isGlassmorphism
                  ? `this.style.background='rgba(255,255,255,0.1)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.background='var(--color-surface)'`
              }" 
              onmouseout="${
                isBrutalist
                  ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                  : isRetro
                  ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='0 0 20px #00f5ff'`
                  : isGlassmorphism
                  ? `this.style.background='rgba(255,255,255,0.05)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.background='transparent'`
              }">
              Learn More
            </a>
            `
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Stats Section (Simplified for Grid) -->
      <section style="padding: ${
        isBrutalist || isRetro ? "6rem 0" : "4rem 0"
      }; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(240,147,251,0.08))"
          : isRetro
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; border-top: ${isBrutalist ? "4px" : isRetro ? "3px" : "1px"} solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; border-bottom: ${
        isBrutalist ? "4px" : isRetro ? "3px" : "1px"
      } solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; ${
        isRetro
          ? "border-top-color: var(--color-accent); border-bottom-color: #00f5ff;"
          : ""
      }">
        <div class="container">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: ${
            isBrutalist || isElegant ? "4rem" : "3rem"
          }; text-align: center;">
            <div>
              <h3 style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: ${
        isBrutalist || isRetro ? "3rem" : "2.5rem"
      }; font-weight: ${
        isBrutalist ? "900" : "700"
      }; margin-bottom: 0.5rem; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
      }; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">99.9%</h3>
              <p style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; font-size: ${
        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
      }; font-weight: ${isBrutalist || isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">Client Satisfaction</p>
            </div>
            <div>
              <h3 style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: ${
        isBrutalist || isRetro ? "3rem" : "2.5rem"
      }; font-weight: ${
        isBrutalist ? "900" : "700"
      }; margin-bottom: 0.5rem; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
      }; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">50K+</h3>
              <p style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; font-size: ${
        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
      }; font-weight: ${isBrutalist || isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">Photos Delivered</p>
            </div>
            <div>
              <h3 style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: ${
        isBrutalist || isRetro ? "3rem" : "2.5rem"
      }; font-weight: ${
        isBrutalist ? "900" : "700"
      }; margin-bottom: 0.5rem; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">4.9</h3>
              <p style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; font-size: ${
        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
      }; font-weight: ${isBrutalist || isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery Section with Uniform Grid -->
      <section id="gallery" style="padding: ${
        isBrutalist || isRetro ? "8rem 0" : "6rem 0"
      }; background: ${isBrutalist ? "var(--color-text)" : "var(--color-bg)"};">
        <div class="container">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${
        isBrutalist || isRetro ? "2.5rem" : "2rem"
      }, 5vw, ${isBrutalist || isRetro ? "3.5rem" : "3rem"}); font-weight: ${
        isBrutalist ? "900" : "700"
      }; text-align: center; margin-bottom: 1rem; letter-spacing: ${
        isRetro ? "3px" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isBrutalist
          ? "color: var(--color-bg);"
          : isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }">
            Portfolio
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; text-align: center; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; max-width: 600px; margin: 0 auto 4rem; font-size: ${
        isBrutalist || isRetro ? "1.25rem" : "1.125rem"
      }; font-weight: ${isElegant ? "300" : "normal"};">
            ${
              isBrutalist
                ? "EVERYTHING YOU NEED"
                : "Everything you need, nothing you don't"
            }
          </p>
          
          <!-- Category Filters -->
          <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: ${
            isBrutalist ? "1.25rem" : "1rem"
          }; margin-bottom: ${isBrutalist ? "4rem" : "3rem"};">
            ${
              data.categories && data.categories.length > 0
                ? data.categories
                    .map(
                      (cat, index) => `
              <button 
                class="filter-btn ${index === 0 ? "active" : ""}" 
                onclick="filterGallery('${cat.toLowerCase()}')"
                style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; padding: ${
                        isBrutalist ? "1rem 2rem" : "0.75rem 1.5rem"
                      }; background: ${
                        index === 0
                          ? isGradient
                            ? "linear-gradient(135deg, #667eea, #764ba2)"
                            : isRetro
                            ? "var(--color-accent)"
                            : isGlassmorphism
                            ? "rgba(255,255,255,0.15)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-accent)"
                          : "transparent"
                      }; color: ${
                        index === 0
                          ? isGradient || isRetro
                            ? "white"
                            : isGlassmorphism || isNeumorphism
                            ? "var(--color-text)"
                            : "white"
                          : isBrutalist
                          ? "var(--color-bg)"
                          : "var(--color-text)"
                      }; border: ${
                        isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                      } solid ${
                        index === 0
                          ? isBrutalist || isRetro
                            ? "var(--color-accent)"
                            : isGlassmorphism
                            ? "rgba(255,255,255,0.2)"
                            : "var(--color-accent)"
                          : isBrutalist
                          ? "var(--color-bg)"
                          : isRetro
                          ? "var(--color-accent)"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.1)"
                          : "var(--color-border)"
                      }; border-radius: ${
                        isGradient || isRetro
                          ? "999px"
                          : isBrutalist || isElegant
                          ? "0"
                          : isNeumorphism || isGlassmorphism
                          ? "16px"
                          : "8px"
                      }; font-weight: ${
                        isBrutalist || isRetro ? "700" : "500"
                      }; cursor: pointer; transition: all 0.2s; font-size: ${
                        isBrutalist || isRetro ? "1rem" : "0.875rem"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      } ${
                        isGlassmorphism && index === 0
                          ? "backdrop-filter: blur(10px);"
                          : ""
                      } ${
                        isNeumorphism && index === 0
                          ? getNeumorphismShadow(false)
                          : ""
                      }"
              >
                ${cat}
              </button>
            `
                    )
                    .join("")
                : ""
            }
          </div>
          
          <!-- Uniform Photo Grid (Square aspect ratio, equal sizes) -->
          <div id="grid-gallery" class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
            isBrutalist ? "300px" : isElegant ? "320px" : "280px"
          }, 1fr)); gap: ${
        isBrutalist ? "2.5rem" : isElegant ? "2.5rem" : "2rem"
      };">
            ${
              data.photos && data.photos.length > 0
                ? data.photos
                    .map(
                      (photo, index) => `
              <div class="gallery-item feature-card" data-category="${(
                photo.category || ""
              ).toLowerCase()}" style="cursor: pointer; padding: 0; overflow: hidden; border-radius: ${
                        isGradient
                          ? "24px"
                          : isBrutalist || isElegant || isRetro
                          ? "0"
                          : isNeumorphism || isGlassmorphism
                          ? "20px"
                          : "12px"
                      }; border: ${
                        isBrutalist ? "4px" : isRetro ? "3px" : "1px"
                      } solid ${
                        isBrutalist || isRetro
                          ? "var(--color-accent)"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.1)"
                          : "var(--color-border)"
                      }; position: relative; transition: all ${
                        isBrutalist || isRetro ? "0.2s" : "0.3s"
                      }; aspect-ratio: 1; ${
                        isNeumorphism
                          ? getNeumorphismShadow(false)
                          : isGradient
                          ? "box-shadow: 0 10px 30px rgba(0,0,0,0.05);"
                          : ""
                      }" onclick="openLightbox(${index})">
                <img 
                  src="${photo.imageUrl || ""}" 
                  alt="${photo.title || "Photo"}"
                  style="width: 100%; height: 100%; object-fit: cover; transition: transform ${
                    isBrutalist || isRetro ? "0.2s" : "0.3s"
                  }; ${isGlassmorphism ? "filter: brightness(0.95);" : ""}"
                />
                <div style="position: absolute; inset: 0; padding: ${
                  isBrutalist ? "2.5rem" : "2rem"
                }; background: ${
                        isBrutalist
                          ? "var(--color-accent)"
                          : isRetro
                          ? "linear-gradient(to top, var(--color-accent) 0%, rgba(255,47,181,0.8) 60%, transparent 100%)"
                          : "linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)"
                      }; color: white; opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; justify-content: flex-end; ${
                        isGlassmorphism ? "backdrop-filter: blur(10px);" : ""
                      }" class="photo-overlay">
                  <h3 style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: ${
                        isBrutalist ? "1.5rem" : "1.25rem"
                      }; font-weight: ${
                        isBrutalist ? "900" : "600"
                      }; margin-bottom: 0.75rem; color: ${
                        isBrutalist ? "var(--color-bg)" : "white"
                      }; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      }">${photo.title || ""}</h3>
                  ${
                    photo.description
                      ? `<p style="font-family: ${
                          isRetro ? "Space Mono, monospace" : "inherit"
                        }; color: ${
                          isBrutalist ? "var(--color-bg)" : "white"
                        }; line-height: 1.7; font-size: ${
                          isBrutalist || isRetro ? "0.9375rem" : "0.9375rem"
                        }; opacity: 0.9; ${
                          isBrutalist ? "font-weight: 700;" : ""
                        }">${photo.description}</p>`
                      : ""
                  }
                </div>
              </div>
            `
                    )
                    .join("")
                : ""
            }
          </div>
        </div>
      </section>

      <!-- About Section - Notable Clients & Awards -->
      <section id="about" style="padding: ${
        isBrutalist || isRetro ? "8rem 0" : "6rem 0"
      }; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
          : isRetro
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; ${
        isRetro
          ? "border-top: 3px solid var(--color-accent); border-bottom: 3px solid #00f5ff;"
          : ""
      }">
        <div class="container" style="max-width: 1100px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
            isBrutalist || isElegant ? "350px" : "300px"
          }, 1fr)); gap: ${isBrutalist || isElegant ? "5rem" : "4rem"};">
            
            ${
              data.clients && data.clients.length > 0
                ? `
            <div>
              <h2 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "2rem" : "1.5rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; margin-bottom: ${
                    isBrutalist ? "2rem" : "1.5rem"
                  }; letter-spacing: ${isRetro ? "2px" : "-0.02em"}; ${
                    isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                  } ${isBrutalist ? "color: var(--color-bg);" : ""}">
                ${isBrutalist ? "⭐ " : ""}Notable Clients
              </h2>
              <div style="display: flex; flex-wrap: wrap; gap: ${
                isBrutalist ? "1.25rem" : "1rem"
              };">
                ${data.clients
                  .map(
                    (client) => `
                  <span style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                      isBrutalist ? "1rem 1.5rem" : "0.75rem 1.25rem"
                    }; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isBrutalist
                        ? "var(--color-bg)"
                        : "var(--color-bg)"
                    }; border: ${
                      isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist
                        ? "var(--color-bg)"
                        : isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; border-radius: ${
                      isGradient || isRetro
                        ? "999px"
                        : isBrutalist || isElegant
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "12px"
                        : "8px"
                    }; font-weight: ${
                      isBrutalist || isRetro ? "900" : "500"
                    }; font-size: ${
                      isBrutalist || isRetro ? "1rem" : "0.9375rem"
                    }; transition: all 0.3s; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 1px;"
                        : ""
                    } ${isBrutalist ? "color: var(--color-accent);" : ""} ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" 
                    onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-3px, -3px)'; this.style.boxShadow='6px 6px 0 var(--color-bg)'`
                        : isRetro
                        ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 20px rgba(255,47,181,0.3)'`
                        : isGlassmorphism
                        ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                        : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'`
                    }" 
                    onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                        : isRetro
                        ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                        : isGlassmorphism
                        ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                        : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                    }">
                    ${client}
                  </span>
                `
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }
            
            ${
              data.awards && data.awards.length > 0
                ? `
            <div>
              <h2 style="font-family: ${
                isElegant ? "Playfair Display, serif" : "inherit"
              }; font-size: ${
                    isBrutalist || isRetro ? "2rem" : "1.5rem"
                  }; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; margin-bottom: ${
                    isBrutalist ? "2rem" : "1.5rem"
                  }; letter-spacing: ${isRetro ? "2px" : "-0.02em"}; ${
                    isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                  } ${isBrutalist ? "color: var(--color-bg);" : ""}">
                ${isBrutalist ? "🏆 " : ""}Awards & Recognition
              </h2>
              <div style="display: flex; flex-direction: column; gap: ${
                isBrutalist ? "1.5rem" : "1rem"
              };">
                ${data.awards
                  .map(
                    (award) => `
                  <div style="padding: ${
                    isBrutalist || isElegant ? "2.5rem" : "2rem"
                  }; background: ${
                      isGlassmorphism
                        ? "rgba(255,255,255,0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : isBrutalist
                        ? "var(--color-bg)"
                        : "var(--color-bg)"
                    }; border-radius: ${
                      isGradient
                        ? "20px"
                        : isBrutalist || isElegant || isRetro
                        ? "0"
                        : isNeumorphism || isGlassmorphism
                        ? "20px"
                        : "12px"
                    }; border: ${
                      isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                    } solid ${
                      isBrutalist
                        ? "var(--color-bg)"
                        : isRetro
                        ? "var(--color-accent)"
                        : isGlassmorphism
                        ? "rgba(255,255,255,0.1)"
                        : "var(--color-border)"
                    }; transition: all 0.3s; ${
                      isGlassmorphism
                        ? "backdrop-filter: blur(10px);"
                        : isNeumorphism
                        ? getNeumorphismShadow(false)
                        : ""
                    }" 
                    onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-bg)'`
                        : isRetro
                        ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 0 30px rgba(255,47,181,0.2)'`
                        : isGlassmorphism
                        ? `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                        : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                    }" 
                    onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                        : isRetro
                        ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                        : isGlassmorphism
                        ? `this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'`
                        : isNeumorphism
                        ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                        : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                    }">
                    <div style="width: 48px; height: 48px; background: var(--color-accent); ${
                      isBrutalist || isElegant || isRetro
                        ? "border-radius: 0;"
                        : "border-radius: 8px;"
                    } margin-bottom: 1.5rem; opacity: 0.1;"></div>
                    <h3 style="font-family: ${
                      isElegant
                        ? "Playfair Display, serif"
                        : isRetro
                        ? "Space Mono, monospace"
                        : "inherit"
                    }; font-size: ${
                      isBrutalist ? "1.5rem" : "1.25rem"
                    }; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; margin-bottom: 0.75rem; ${
                      isBrutalist || isRetro
                        ? "text-transform: uppercase; letter-spacing: 1px;"
                        : ""
                    } ${isBrutalist ? "color: var(--color-accent);" : ""}">${
                      award.title || ""
                    }</h3>
                    <p style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; color: ${
                      isBrutalist
                        ? "var(--color-accent)"
                        : "var(--color-text-secondary)"
                    }; line-height: 1.7; font-size: ${
                      isBrutalist || isRetro ? "1rem" : "0.9375rem"
                    }; ${isBrutalist || isRetro ? "font-weight: 700;" : ""}">${
                      award.year || ""
                    }</p>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" style="padding: ${
        isBrutalist || isRetro ? "10rem 0 8rem" : "8rem 0 6rem"
      }; text-align: center; background: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      };">
        <div class="container" style="max-width: 700px;">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${
        isBrutalist || isRetro ? "2.5rem" : "2.5rem"
      }, 6vw, ${isBrutalist || isRetro ? "5rem" : "4rem"}); font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "700"
      }; margin-bottom: 1.5rem; letter-spacing: ${
        isRetro ? "3px" : "-0.03em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isBrutalist ? "color: var(--color-bg);" : ""
      }">
            ${isBrutalist ? "LETS CREATE" : "Let's Create Together"}
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist || isRetro ? "1.375rem" : "1.25rem"
      }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; margin-bottom: 2.5rem; line-height: 1.7; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Available for commissions and collaborations
          </p>
          <div style="display: flex; gap: ${
            isBrutalist ? "1.5rem" : "1rem"
          }; justify-content: center; flex-wrap: wrap;">
            ${
              data.email
                ? `
            <a href="mailto:${data.email}" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                    isBrutalist ? "1.25rem 2.5rem" : "1rem 2rem"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : "8px"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "700" : "500"
                  }; transition: all 0.2s; display: inline-block; background: ${
                    isGradient
                      ? "linear-gradient(135deg, #667eea, #764ba2)"
                      : isRetro
                      ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.15)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : isBrutalist
                      ? "var(--color-bg)"
                      : "var(--color-accent)"
                  }; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : isGradient || isRetro
                      ? "white"
                      : isGlassmorphism || isNeumorphism
                      ? "var(--color-text)"
                      : "white"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; ${
                    isBrutalist
                      ? "border: 3px solid var(--color-bg); text-transform: uppercase; letter-spacing: 1px;"
                      : isRetro
                      ? "border: 2px solid var(--color-accent); text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 30px rgba(255,47,181,0.3);"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  } ${
                    isGradient
                      ? "box-shadow: 0 10px 30px rgba(102,126,234,0.3);"
                      : ""
                  }" 
              onmouseover="${
                isBrutalist
                  ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                  : isGradient
                  ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 15px 40px rgba(102,126,234,0.4)'`
                  : isRetro
                  ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 50px rgba(255,47,181,0.5)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.transform='translateY(-2px)'; this.style.opacity='0.9'`
              }" 
              onmouseout="${
                isBrutalist
                  ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                  : isGradient
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(102,126,234,0.3)'`
                  : isRetro
                  ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(255,47,181,0.3)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.transform='translateY(0)'; this.style.opacity='1'`
              }">
              Get in Touch
            </a>
            `
                : ""
            }
            ${
              data.instagram
                ? `
            <a href="https://instagram.com/${data.instagram.replace(
              "@",
              ""
            )}" target="_blank" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; padding: ${
                    isBrutalist ? "1.25rem 2.5rem" : "1rem 2rem"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "16px"
                      : "8px"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "700" : "500"
                  }; transition: all 0.2s; display: inline-block; border: ${
                    isBrutalist ? "3px" : isRetro ? "2px" : "1px"
                  } solid ${
                    isBrutalist
                      ? "var(--color-bg)"
                      : isRetro
                      ? "#00f5ff"
                      : isGlassmorphism
                      ? "rgba(255,255,255,0.2)"
                      : "var(--color-border)"
                  }; color: ${
                    isBrutalist ? "var(--color-bg)" : "var(--color-text)"
                  }; background: ${
                    isGlassmorphism
                      ? "rgba(255,255,255,0.05)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : "transparent"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.125rem" : "1rem"
                  }; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  } ${isRetro ? "box-shadow: 0 0 20px #00f5ff;" : ""} ${
                    isGlassmorphism
                      ? "backdrop-filter: blur(10px);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : ""
                  }" 
              onmouseover="${
                isBrutalist
                  ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                  : isRetro
                  ? `this.style.background='#00f5ff'; this.style.color='#0d001a'; this.style.boxShadow='0 0 40px #00f5ff'`
                  : isGlassmorphism
                  ? `this.style.background='rgba(255,255,255,0.1)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                  : `this.style.background='var(--color-surface)'`
              }" 
              onmouseout="${
                isBrutalist
                  ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                  : isRetro
                  ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='0 0 20px #00f5ff'`
                  : isGlassmorphism
                  ? `this.style.background='rgba(255,255,255,0.05)'`
                  : isNeumorphism
                  ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                  : `this.style.background='transparent'`
              }">
              ${data.instagram}
            </a>
            `
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: ${
        isBrutalist ? "4rem 0" : "3rem 0"
      }; border-top: ${isBrutalist ? "4px" : isRetro ? "3px" : "1px"} solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; text-align: center; color: var(--color-text-secondary); font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.875rem"
      }; font-weight: ${isBrutalist ? "900" : isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 2px;"
          : ""
      }">
        <div class="container">
          <p>© 2024 ${data.photographerName || "Photographer"}. ${
        isBrutalist ? "ALL RIGHTS RESERVED." : "All rights reserved."
      }</p>
        </div>
      </footer>

      <!-- Lightbox Modal -->
      <div id="lightbox" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: ${
        isBrutalist ? "var(--color-accent)" : "rgba(0,0,0,0.95)"
      }; z-index: 10000; align-items: center; justify-content: center; padding: 2rem;" onclick="closeLightbox()">
        <button onclick="closeLightbox()" style="position: absolute; top: 2rem; right: 2rem; background: ${
          isGlassmorphism
            ? "rgba(255,255,255,0.1)"
            : isBrutalist
            ? "var(--color-bg)"
            : "rgba(255,255,255,0.1)"
        }; border: ${
        isBrutalist
          ? "3px solid var(--color-bg)"
          : isRetro
          ? "2px solid rgba(255,255,255,0.3)"
          : "2px solid rgba(255,255,255,0.3)"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "white"
      }; width: 48px; height: 48px; border-radius: ${
        isBrutalist || isElegant ? "0" : "50%"
      }; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; font-weight: ${
        isBrutalist ? "900" : "normal"
      };" onmouseover="this.style.background='${
        isBrutalist ? "var(--color-text)" : "rgba(255,255,255,0.2)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-bg)'" : ""
      }" onmouseout="this.style.background='${
        isBrutalist ? "var(--color-bg)" : "rgba(255,255,255,0.1)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-text)'" : ""
      }">×</button>
        <button onclick="event.stopPropagation(); prevPhoto()" style="position: absolute; left: 2rem; background: ${
          isGlassmorphism
            ? "rgba(255,255,255,0.1)"
            : isBrutalist
            ? "var(--color-bg)"
            : "rgba(255,255,255,0.1)"
        }; border: ${
        isBrutalist
          ? "3px solid var(--color-bg)"
          : isRetro
          ? "2px solid rgba(255,255,255,0.3)"
          : "2px solid rgba(255,255,255,0.3)"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "white"
      }; width: 48px; height: 48px; border-radius: ${
        isBrutalist || isElegant ? "0" : "50%"
      }; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; font-weight: ${
        isBrutalist ? "900" : "normal"
      };" onmouseover="this.style.background='${
        isBrutalist ? "var(--color-text)" : "rgba(255,255,255,0.2)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-bg)'" : ""
      }" onmouseout="this.style.background='${
        isBrutalist ? "var(--color-bg)" : "rgba(255,255,255,0.1)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-text)'" : ""
      }">‹</button>
        <button onclick="event.stopPropagation(); nextPhoto()" style="position: absolute; right: 2rem; background: ${
          isGlassmorphism
            ? "rgba(255,255,255,0.1)"
            : isBrutalist
            ? "var(--color-bg)"
            : "rgba(255,255,255,0.1)"
        }; border: ${
        isBrutalist
          ? "3px solid var(--color-bg)"
          : isRetro
          ? "2px solid rgba(255,255,255,0.3)"
          : "2px solid rgba(255,255,255,0.3)"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "white"
      }; width: 48px; height: 48px; border-radius: ${
        isBrutalist || isElegant ? "0" : "50%"
      }; font-size: 1.5rem; cursor: pointer; backdrop-filter: blur(10px); transition: all 0.2s; font-weight: ${
        isBrutalist ? "900" : "normal"
      };" onmouseover="this.style.background='${
        isBrutalist ? "var(--color-text)" : "rgba(255,255,255,0.2)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-bg)'" : ""
      }" onmouseout="this.style.background='${
        isBrutalist ? "var(--color-bg)" : "rgba(255,255,255,0.1)"
      }'; ${
        isBrutalist ? "this.style.color='var(--color-text)'" : ""
      }">›</button>
        <div style="max-width: 90vw; max-height: 90vh; text-align: center;">
          <img id="lightbox-img" src="" alt="" style="max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: ${
            isGradient
              ? "24px"
              : isBrutalist || isElegant || isRetro
              ? "0"
              : "8px"
          }; ${
        isBrutalist
          ? "border: 4px solid var(--color-bg);"
          : isRetro
          ? "border: 3px solid var(--color-accent);"
          : ""
      }" onclick="event.stopPropagation()">
          <div id="lightbox-info" style="color: ${
            isBrutalist ? "var(--color-bg)" : "white"
          }; margin-top: 1.5rem; padding: 1rem;"></div>
        </div>
      </div>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 8px 8px 16px #c5c9ce, inset -8px -8px 16px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 16px 16px 32px #2a2d34, inset -16px -16px 32px #383d46;
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
        /* Retro grid background */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,47,181,0.02) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,47,181,0.02) 2px, transparent 2px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        `
            : ""
        }
        
        /* Hover Effects */
        .photo-overlay { pointer-events: none; }
        .gallery-item:hover .photo-overlay { opacity: 1; }
        .gallery-item:hover { 
          ${
            isBrutalist
              ? "transform: translate(-4px, -4px); box-shadow: 8px 8px 0 var(--color-accent);"
              : isRetro
              ? "transform: translateY(-4px); box-shadow: 0 10px 30px rgba(255,47,181,0.2);"
              : isGlassmorphism
              ? "border-color: var(--color-accent); transform: translateY(-4px);"
              : isNeumorphism
              ? "box-shadow: var(--neomorph-shadow-in);"
              : "border-color: var(--color-accent); transform: translateY(-4px);"
          } 
        }
        .gallery-item:hover img {
          transform: scale(${isBrutalist || isRetro ? "1.05" : "1.08"});
        }
        
        /* Filter Button States */
        .filter-btn:hover {
          transform: translateY(-2px);
        }
        
        .filter-btn.active {
          background: ${
            isGradient
              ? "linear-gradient(135deg, #667eea, #764ba2)"
              : isRetro
              ? "var(--color-accent)"
              : isGlassmorphism
              ? "rgba(255,255,255,0.15)"
              : isNeumorphism
              ? "var(--color-bg)"
              : "var(--color-accent)"
          } !important;
          color: ${
            isGradient || isRetro
              ? "white"
              : isGlassmorphism || isNeumorphism
              ? "var(--color-text)"
              : "white"
          } !important;
          border-color: ${
            isBrutalist || isRetro
              ? "var(--color-accent)"
              : isGlassmorphism
              ? "rgba(255,255,255,0.2)"
              : "var(--color-accent)"
          } !important;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .features-grid { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important; gap: 1.5rem !important; }
          section { padding: 5rem 0 4rem !important; }
        }
        
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
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
          });
          
          event.target.classList.add('active');
          
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
    `;
    },
  }),
  "local-business": new Template("local-business", {
    name: "Local Small Business",
    description: "Perfect for local shops, services, and small businesses",
    category: "Landing Page",
    image: "local-business",
    defaultTheme: "minimal",
    fields: {
      businessName: {
        type: "text",
        label: "Business Name",
        required: true,
        default: "Your Business Name",
      },
      tagline: {
        type: "text",
        label: "Tagline",
        required: true,
        default: "Quality Service You Can Trust",
      },
      description: {
        type: "textarea",
        label: "About Your Business",
        required: true,
        default:
          "Serving our community with dedication and excellence for years.",
      },
      address: {
        type: "text",
        label: "Street Address",
        required: false,
        default: "",
      },
      city: {
        type: "text",
        label: "City, State ZIP",
        required: false,
        default: "",
      },
      phone: {
        type: "tel",
        label: "Phone Number",
        required: true,
        default: "(555) 123-4567",
      },
      email: {
        type: "email",
        label: "Email Address",
        required: true,
        default: "hello@yourbusiness.com",
      },
      hours: {
        type: "textarea",
        label: "Business Hours",
        placeholder: "Mon-Fri: 9am-6pm\nSat: 10am-4pm\nSun: Closed",
        required: false,
        default: "",
      },
      services: {
        type: "textarea",
        label: "Services/Products (one per line)",
        required: true,
        default:
          "Professional Consultation\nQuality Products\nExpert Installation\nCustomer Support",
      },
      ctaText: {
        type: "text",
        label: "Call-to-Action Button Text",
        required: false,
        default: "Get Started Today",
      },
      ctaLink: {
        type: "url",
        label: "Call-to-Action Link",
        required: false,
        default: "",
      },
      facebook: {
        type: "url",
        label: "Facebook URL",
        required: false,
        default: "",
      },
      instagram: {
        type: "text",
        label: "Instagram Handle",
        placeholder: "@yourbusiness",
        required: false,
        default: "",
      },
      testimonials: {
        type: "group",
        label: "Customer Testimonials",
        itemLabel: "Testimonial",
        min: 0,
        max: 6,
        fields: {
          name: {
            type: "text",
            label: "Customer Name",
            required: true,
            default: "John Doe",
          },
          text: {
            type: "textarea",
            label: "Testimonial Text",
            required: true,
            default: "Great service and excellent results!",
          },
          rating: {
            type: "select",
            label: "Rating",
            options: ["5", "4", "3", "2", "1"],
            default: "5",
          },
        },
        default: [
          {
            name: "Sarah Johnson",
            text: "Outstanding service! They went above and beyond to help us.",
            rating: "5",
          },
          {
            name: "Mike Chen",
            text: "Professional, reliable, and great quality work. Highly recommend!",
            rating: "5",
          },
        ],
      },
    },
    structure: (data, theme, colorMode) => {
      // Detect theme style for dynamic elements
      const themeId = theme?.id || "minimal";
      const isBrutalist = themeId === "brutalist";
      const isGradient = themeId === "gradient";
      const isElegant = themeId === "elegant";
      const isRetro = themeId === "retro";
      const isGlassmorphism = themeId === "glassmorphism";
      const isNeumorphism = themeId === "neumorphism";

      // Neumorphism box-shadow helpers
      const getNeumorphismShadow = (inset = false) => {
        if (!isNeumorphism) return "";
        return inset
          ? "box-shadow: var(--neomorph-shadow-in);"
          : "box-shadow: var(--neomorph-shadow-out);";
      };

      const getNeumorphismHoverShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-in)";
      };

      const getNeumorphismNormalShadow = () => {
        if (!isNeumorphism) return "";
        return "var(--neomorph-shadow-out)";
      };

      return `
      <!-- Top Bar with Quick Contact - Theme Aware -->
      <div style="background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
          : "var(--color-accent)"
      }; color: ${isBrutalist ? "var(--color-bg)" : "white"}; padding: ${
        isBrutalist ? "1rem 0" : "0.75rem 0"
      }; text-align: center; font-size: ${
        isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
      }; font-weight: ${isBrutalist ? "900" : "600"}; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }">
        <div class="container" style="display: flex; justify-content: center; align-items: center; gap: ${
          isBrutalist ? "3rem" : "2rem"
        }; flex-wrap: wrap;">
          ${
            data.phone
              ? `<span style="display: flex; align-items: center; gap: 0.5rem;">${
                  isBrutalist ? "☎" : "📞"
                } ${data.phone}</span>`
              : ""
          }
          ${
            data.email
              ? `<span style="display: flex; align-items: center; gap: 0.5rem;">${
                  isBrutalist ? "✉" : "📧"
                } ${data.email}</span>`
              : ""
          }
        </div>
      </div>
      
      <!-- Sticky Header -->
      <header style="padding: ${
        isBrutalist ? "1.75rem 0" : "1.25rem 0"
      }; background: ${
        isGlassmorphism ? "rgba(255,255,255,0.1)" : "var(--color-bg)"
      }; position: sticky; top: 0; z-index: 100; ${
        isBrutalist
          ? "box-shadow: 8px 8px 0 var(--color-accent); border-bottom: 4px solid var(--color-accent);"
          : isGradient
          ? "box-shadow: 0 2px 20px rgba(102,126,234,0.15);"
          : isRetro
          ? "border-bottom: 3px solid var(--color-accent);"
          : isGlassmorphism
          ? "backdrop-filter: blur(20px); box-shadow: 0 2px 12px rgba(0,0,0,0.08);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : "box-shadow: 0 2px 12px rgba(0,0,0,0.08); backdrop-filter: blur(10px);"
      }">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
            <div style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist || isRetro ? "1.75rem" : "1.5rem"
      }; font-weight: ${isBrutalist ? "900" : "900"}; color: ${
        isGradient ? "transparent" : "var(--color-accent)"
      }; letter-spacing: ${isBrutalist || isRetro ? "2px" : "-0.01em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }">
              ${data.businessName || "Business Name"}
            </div>
            <div style="display: flex; gap: 2rem; align-items: center;">
              <nav class="nav-links" style="display: flex; gap: ${
                isBrutalist ? "2.5rem" : "2rem"
              };">
                <a href="#services" style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; text-decoration: none; color: var(--color-text-secondary); font-weight: ${
        isBrutalist || isRetro ? "700" : "600"
      }; font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.9375rem"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">Services</a>
                <a href="#reviews" style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; text-decoration: none; color: var(--color-text-secondary); font-weight: ${
        isBrutalist || isRetro ? "700" : "600"
      }; font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.9375rem"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">Reviews</a>
                <a href="#contact" style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; text-decoration: none; color: var(--color-text-secondary); font-weight: ${
        isBrutalist || isRetro ? "700" : "600"
      }; font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.9375rem"
      }; transition: color 0.2s; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 1px;"
          : ""
      }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text-secondary)'">Contact</a>
              </nav>
              <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
                isNeumorphism
                  ? `padding: 0.5rem; border-radius: 12px; display: inline-block; background: var(--color-bg); ${getNeumorphismShadow(
                      false
                    )}`
                  : ""
              }">
                <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
                <span class="theme-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero Section - Simplified for Small Business -->
      <section class="hero-section" style="background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
          : isRetro
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; padding: 0; overflow: hidden; ${
        isRetro ? "border-bottom: 3px solid var(--color-accent);" : ""
      }">
        <div class="container" style="max-width: 1400px;">
          <div class="hero-grid" style="display: grid; grid-template-columns: 1.2fr 1fr; min-height: ${
            isBrutalist || isRetro ? "550px" : "500px"
          }; align-items: center; gap: ${
        isBrutalist || isElegant ? "5rem" : "4rem"
      };">
            <div style="padding: ${
              isBrutalist || isElegant ? "6rem 0" : "5rem 0"
            };">
              <div style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; display: inline-block; background: ${
        isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "var(--color-accent)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.15)"
          : isNeumorphism
          ? "var(--color-bg)"
          : isBrutalist
          ? "var(--color-bg)"
          : "var(--color-accent)"
      }; color: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient || isRetro
          ? "white"
          : isGlassmorphism || isNeumorphism
          ? "var(--color-text)"
          : "white"
      }; padding: ${
        isBrutalist ? "0.875rem 2rem" : "0.625rem 1.5rem"
      }; border-radius: ${
        isGradient || isRetro
          ? "999px"
          : isBrutalist || isElegant
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "16px"
          : "50px"
      }; font-weight: ${isBrutalist || isRetro ? "900" : "700"}; font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.875rem"
      }; margin-bottom: ${isBrutalist ? "2rem" : "1.5rem"}; letter-spacing: ${
        isBrutalist || isRetro ? "2px" : "0.05em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isBrutalist
          ? "border: 3px solid var(--color-accent);"
          : isRetro
          ? "border: 2px solid var(--color-accent);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : ""
      }">
                ${isBrutalist ? "LOCAL & TRUSTED" : "LOCAL & TRUSTED"}
              </div>
              <h1 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: clamp(${
        isBrutalist || isRetro ? "3rem" : "2.5rem"
      }, 5vw, ${isBrutalist || isRetro ? "4.5rem" : "4rem"}); font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "900"
      }; margin-bottom: 1.5rem; line-height: 1.1; letter-spacing: ${
        isRetro ? "2px" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
        isBrutalist ? "color: var(--color-bg);" : ""
      }">
                ${data.tagline || "Your Trusted Local Partner"}
              </h1>
              <p style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: ${
        isBrutalist || isRetro ? "1.25rem" : "1.125rem"
      }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; margin-bottom: 2.5rem; line-height: ${
        isElegant ? "1.9" : "1.7"
      }; max-width: 600px; font-weight: ${isElegant ? "300" : "normal"};">
                ${
                  data.description ||
                  "Serving our community with quality service and dedication"
                }
              </p>
              <div class="cta-buttons" style="display: flex; gap: ${
                isBrutalist ? "1.5rem" : "1rem"
              }; flex-wrap: wrap;">
                <a href="#contact" style="font-family: ${
                  isRetro ? "Space Mono, monospace" : "inherit"
                }; padding: ${
        isBrutalist ? "1.375rem 3rem" : "1.125rem 2.5rem"
      }; font-size: ${
        isBrutalist || isRetro ? "1.125rem" : "1rem"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
          : isGlassmorphism
          ? "rgba(255,255,255,0.15)"
          : isNeumorphism
          ? "var(--color-bg)"
          : isBrutalist
          ? "var(--color-bg)"
          : "var(--color-accent)"
      }; color: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient || isRetro
          ? "white"
          : isGlassmorphism || isNeumorphism
          ? "var(--color-text)"
          : "white"
      }; border-radius: ${
        isGradient || isRetro
          ? "999px"
          : isBrutalist || isElegant
          ? "0"
          : isNeumorphism || isGlassmorphism
          ? "16px"
          : "8px"
      }; text-decoration: none; font-weight: ${
        isBrutalist || isRetro ? "700" : "600"
      }; transition: all 0.2s; display: inline-block; ${
        isBrutalist
          ? "border: 3px solid var(--color-accent); text-transform: uppercase; letter-spacing: 1px;"
          : isRetro
          ? "border: 2px solid var(--color-accent); text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 30px rgba(255,47,181,0.3);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);"
          : isNeumorphism
          ? getNeumorphismShadow(false)
          : ""
      } ${isGradient ? "box-shadow: 0 8px 20px rgba(102,126,234,0.3);" : ""}" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                      : isGradient
                      ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 30px rgba(102,126,234,0.4)'`
                      : isRetro
                      ? `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 0 50px rgba(255,47,181,0.5)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                      : isGradient
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 20px rgba(102,126,234,0.3)'`
                      : isRetro
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='0 0 30px rgba(255,47,181,0.3)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                  }">
                  ${data.ctaText || "Get Started"}
                </a>
                ${
                  data.phone
                    ? `
                <a href="tel:${data.phone.replace(
                  /\s/g,
                  ""
                )}" style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; padding: ${
                        isBrutalist ? "1.375rem 3rem" : "1.125rem 2.5rem"
                      }; font-size: ${
                        isBrutalist || isRetro ? "1.125rem" : "1rem"
                      }; background: ${
                        isGlassmorphism
                          ? "rgba(255,255,255,0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "transparent"
                      }; color: ${
                        isBrutalist ? "var(--color-bg)" : "var(--color-text)"
                      }; border: ${
                        isBrutalist ? "3px" : isRetro ? "2px" : "2px"
                      } solid ${
                        isBrutalist
                          ? "var(--color-bg)"
                          : isRetro
                          ? "#00f5ff"
                          : isGlassmorphism
                          ? "rgba(255,255,255,0.2)"
                          : "var(--color-border)"
                      }; border-radius: ${
                        isGradient || isRetro
                          ? "999px"
                          : isBrutalist || isElegant
                          ? "0"
                          : isNeumorphism || isGlassmorphism
                          ? "16px"
                          : "8px"
                      }; text-decoration: none; font-weight: ${
                        isBrutalist || isRetro ? "700" : "600"
                      }; transition: all 0.2s; display: inline-block; ${
                        isBrutalist || isRetro
                          ? "text-transform: uppercase; letter-spacing: 1px;"
                          : ""
                      } ${isRetro ? "box-shadow: 0 0 20px #00f5ff;" : ""} ${
                        isGlassmorphism
                          ? "backdrop-filter: blur(10px);"
                          : isNeumorphism
                          ? getNeumorphismShadow(false)
                          : ""
                      }" 
                  onmouseover="${
                    isBrutalist
                      ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-text)'`
                      : isRetro
                      ? `this.style.background='#00f5ff'; this.style.color='#0d001a'; this.style.boxShadow='0 0 40px #00f5ff'`
                      : isGlassmorphism
                      ? `this.style.background='rgba(255,255,255,0.1)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.background='var(--color-bg)'; this.style.borderColor='var(--color-accent)'; this.style.color='var(--color-accent)'`
                  }" 
                  onmouseout="${
                    isBrutalist
                      ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                      : isRetro
                      ? `this.style.background='transparent'; this.style.color='var(--color-text)'; this.style.boxShadow='0 0 20px #00f5ff'`
                      : isGlassmorphism
                      ? `this.style.background='rgba(255,255,255,0.05)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.background='transparent'; this.style.borderColor='var(--color-border)'; this.style.color='var(--color-text)'`
                  }">
                  Call Now
                </a>
                `
                    : ""
                }
              </div>
            </div>
            <div class="hero-image" style="background: ${
              isGradient
                ? "linear-gradient(135deg, #667eea, #764ba2)"
                : isBrutalist
                ? "var(--color-accent)"
                : isRetro
                ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
                : "linear-gradient(135deg, var(--color-accent), var(--color-text))"
            }; height: 100%; min-height: ${
        isBrutalist || isRetro ? "550px" : "500px"
      }; display: flex; align-items: center; justify-content: center; color: white; font-size: ${
        isBrutalist ? "5rem" : "4rem"
      }; opacity: ${isBrutalist ? "0.15" : "0.1"}; border-radius: ${
        isGradient
          ? "0 0 0 100px"
          : isBrutalist || isElegant || isRetro
          ? "0"
          : "0 0 0 80px"
      };">
              🏪
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Info Cards -->
      <section style="padding: ${
        isBrutalist || isRetro ? "4rem 0" : "3rem 0"
      }; margin-top: ${
        isBrutalist || isRetro ? "-4rem" : "-3rem"
      }; position: relative; z-index: 10;">
        <div class="container">
          <div class="info-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: ${
            isBrutalist || isElegant ? "2rem" : "1.5rem"
          }; max-width: 1000px; margin: 0 auto;">
            ${
              data.address || data.city
                ? `
            <div style="background: ${
              isGlassmorphism ? "rgba(255,255,255,0.05)" : "var(--color-bg)"
            }; padding: ${
                    isBrutalist || isElegant ? "2.5rem" : "2rem"
                  }; border-radius: ${
                    isGradient
                      ? "20px"
                      : isBrutalist || isElegant || isRetro
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "20px"
                      : "12px"
                  }; ${
                    isBrutalist
                      ? "box-shadow: 8px 8px 0 var(--color-accent); border: 4px solid var(--color-accent);"
                      : isGradient
                      ? "box-shadow: 0 4px 20px rgba(102,126,234,0.1);"
                      : isRetro
                      ? "border: 3px solid var(--color-accent);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : isGlassmorphism
                      ? "backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.1);"
                      : "box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
                  } text-align: center; border: ${
                    isBrutalist || isRetro
                      ? ""
                      : "1px solid var(--color-border)"
                  }; transition: all ${
                    isBrutalist || isRetro ? "0.2s" : "0.3s"
                  };" onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='12px 12px 0 var(--color-accent)'`
                      : isRetro
                      ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.2)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'`
                  }" onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='8px 8px 0 var(--color-accent)'`
                      : isRetro
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'`
                  }">
              <div style="font-size: ${
                isBrutalist ? "3rem" : "2.5rem"
              }; margin-bottom: 1rem;">${isBrutalist ? "📍" : "📍"}</div>
              <div style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-weight: ${isBrutalist ? "900" : "700"}; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; margin-bottom: 0.5rem; color: var(--color-text); ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  }">Visit Us</div>
              <div style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: var(--color-text-secondary); font-size: ${
                    isBrutalist || isRetro ? "1rem" : "0.9375rem"
                  }; line-height: 1.6; ${
                    isBrutalist || isRetro ? "font-weight: 700;" : ""
                  }">
                ${data.address ? data.address + "<br>" : ""}${data.city || ""}
              </div>
            </div>
            `
                : ""
            }
            ${
              data.hours
                ? `
            <div style="background: ${
              isGlassmorphism ? "rgba(255,255,255,0.05)" : "var(--color-bg)"
            }; padding: ${
                    isBrutalist || isElegant ? "2.5rem" : "2rem"
                  }; border-radius: ${
                    isGradient
                      ? "20px"
                      : isBrutalist || isElegant || isRetro
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "20px"
                      : "12px"
                  }; ${
                    isBrutalist
                      ? "box-shadow: 8px 8px 0 var(--color-accent); border: 4px solid var(--color-accent);"
                      : isGradient
                      ? "box-shadow: 0 4px 20px rgba(102,126,234,0.1);"
                      : isRetro
                      ? "border: 3px solid var(--color-accent);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : isGlassmorphism
                      ? "backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.1);"
                      : "box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
                  } text-align: center; border: ${
                    isBrutalist || isRetro
                      ? ""
                      : "1px solid var(--color-border)"
                  }; transition: all ${
                    isBrutalist || isRetro ? "0.2s" : "0.3s"
                  };" onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='12px 12px 0 var(--color-accent)'`
                      : isRetro
                      ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.2)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'`
                  }" onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='8px 8px 0 var(--color-accent)'`
                      : isRetro
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'`
                  }">
              <div style="font-size: ${
                isBrutalist ? "3rem" : "2.5rem"
              }; margin-bottom: 1rem;">${isBrutalist ? "⏰" : "🕒"}</div>
              <div style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-weight: ${isBrutalist ? "900" : "700"}; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; margin-bottom: 0.5rem; color: var(--color-text); ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  }">Hours</div>
              <div style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; color: var(--color-text-secondary); font-size: ${
                    isBrutalist || isRetro ? "1rem" : "0.9375rem"
                  }; line-height: 1.6; white-space: pre-line; ${
                    isBrutalist || isRetro ? "font-weight: 700;" : ""
                  }">
                ${data.hours.split("\n").slice(0, 2).join("\n")}
              </div>
            </div>
            `
                : ""
            }
            ${
              data.phone
                ? `
            <div style="background: ${
              isGlassmorphism ? "rgba(255,255,255,0.05)" : "var(--color-bg)"
            }; padding: ${
                    isBrutalist || isElegant ? "2.5rem" : "2rem"
                  }; border-radius: ${
                    isGradient
                      ? "20px"
                      : isBrutalist || isElegant || isRetro
                      ? "0"
                      : isNeumorphism || isGlassmorphism
                      ? "20px"
                      : "12px"
                  }; ${
                    isBrutalist
                      ? "box-shadow: 8px 8px 0 var(--color-accent); border: 4px solid var(--color-accent);"
                      : isGradient
                      ? "box-shadow: 0 4px 20px rgba(102,126,234,0.1);"
                      : isRetro
                      ? "border: 3px solid var(--color-accent);"
                      : isNeumorphism
                      ? getNeumorphismShadow(false)
                      : isGlassmorphism
                      ? "backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.1);"
                      : "box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
                  } text-align: center; border: ${
                    isBrutalist || isRetro
                      ? ""
                      : "1px solid var(--color-border)"
                  }; transition: all ${
                    isBrutalist || isRetro ? "0.2s" : "0.3s"
                  };" onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='12px 12px 0 var(--color-accent)'`
                      : isRetro
                      ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.2)'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                      : `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'`
                  }" onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='8px 8px 0 var(--color-accent)'`
                      : isRetro
                      ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                      : isNeumorphism
                      ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                      : `this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'`
                  }">
              <div style="font-size: ${
                isBrutalist ? "3rem" : "2.5rem"
              }; margin-bottom: 1rem;">${isBrutalist ? "☎" : "📞"}</div>
              <div style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-weight: ${isBrutalist ? "900" : "700"}; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; margin-bottom: 0.5rem; color: var(--color-text); ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  }">Call Us</div>
              <a href="tel:${data.phone.replace(
                /\s/g,
                ""
              )}" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; color: var(--color-accent); font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; transition: opacity 0.2s; ${
                    isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                  }" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                ${data.phone}
              </a>
            </div>
            `
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section id="services" style="padding: ${
        isBrutalist || isRetro ? "8rem 0" : "6rem 0"
      }; background: ${isBrutalist ? "var(--color-text)" : "var(--color-bg)"};">
        <div class="container">
          <div style="text-align: center; margin-bottom: ${
            isBrutalist ? "5rem" : "4rem"
          }; max-width: 700px; margin-left: auto; margin-right: auto;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(${
        isBrutalist || isRetro ? "2.5rem" : "2rem"
      }, 5vw, ${isBrutalist || isRetro ? "3.5rem" : "3rem"}); font-weight: ${
        isBrutalist ? "900" : "900"
      }; margin-bottom: 1rem; letter-spacing: ${isRetro ? "3px" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      } ${
        isBrutalist
          ? "color: var(--color-bg);"
          : isGradient
          ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : isRetro
          ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
          : ""
      }">
              Our Services
            </h2>
            <div style="width: ${isBrutalist ? "80px" : "60px"}; height: ${
        isBrutalist ? "6px" : "4px"
      }; background: var(--color-accent); margin: 0 auto 1rem; border-radius: ${
        isBrutalist || isElegant || isRetro ? "0" : "2px"
      };"></div>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; color: ${
        isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
      }; font-size: ${
        isBrutalist || isRetro ? "1.25rem" : "1.125rem"
      }; line-height: 1.6; font-weight: ${isElegant ? "300" : "normal"};">
              Quality services tailored to your needs
            </p>
          </div>
          <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
            isBrutalist || isElegant ? "320px" : "280px"
          }, 1fr)); gap: ${isBrutalist || isElegant ? "2rem" : "1.5rem"};">
            ${(data.services || "")
              .split("\n")
              .filter((s) => s.trim())
              .map(
                (service, i) => `
              <div class="service-card" style="background: ${
                isGlassmorphism
                  ? "rgba(255,255,255,0.05)"
                  : isBrutalist
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; padding: ${
                  isBrutalist || isElegant ? "2.5rem" : "2rem"
                }; border-radius: ${
                  isGradient
                    ? "20px"
                    : isBrutalist || isElegant || isRetro
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "20px"
                    : "12px"
                }; border-left: ${
                  isBrutalist ? "6px" : isRetro ? "4px" : "4px"
                } solid var(--color-accent); transition: all ${
                  isBrutalist || isRetro ? "0.2s" : "0.3s"
                }; cursor: pointer; ${
                  isGlassmorphism
                    ? "backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-8px, -4px)'; this.style.boxShadow='12px 12px 0 var(--color-accent)'`
                    : isRetro
                    ? `this.style.transform='translateX(8px)'; this.style.boxShadow='0 4px 20px rgba(255,47,181,0.15)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.transform='translateX(8px)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.1)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isRetro
                    ? `this.style.transform='translateX(0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.transform='translateX(0)'; this.style.boxShadow='none'`
                }">
                <div style="display: flex; align-items: start; gap: ${
                  isBrutalist ? "1.5rem" : "1rem"
                };">
                  <div style="width: ${
                    isBrutalist ? "56px" : "48px"
                  }; height: ${isBrutalist ? "56px" : "48px"}; background: ${
                  isGradient
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : isRetro
                    ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                    : "var(--color-accent)"
                }; border-radius: ${
                  isBrutalist || isElegant || isRetro ? "0" : "50%"
                }; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: ${
                  isBrutalist ? "1.375rem" : "1.125rem"
                }; flex-shrink: 0; ${
                  isBrutalist ? "border: 3px solid var(--color-accent);" : ""
                }">
                    ${i + 1}
                  </div>
                  <h3 style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: ${
                  isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                }; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; line-height: 1.4; color: ${
                  isBrutalist ? "var(--color-accent)" : "var(--color-text)"
                }; margin-top: 0.5rem; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 0.5px;"
                    : ""
                }">
                    ${service.trim()}
                  </h3>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      ${
        data.testimonials && data.testimonials.length > 0
          ? `
      <!-- Customer Reviews -->
      <section id="reviews" style="padding: ${
        isBrutalist || isRetro ? "8rem 0" : "6rem 0"
      }; background: ${
              isBrutalist
                ? "var(--color-accent)"
                : isGradient
                ? "linear-gradient(135deg, rgba(102,126,234,0.05), rgba(240,147,251,0.05))"
                : isRetro
                ? "var(--color-surface)"
                : "var(--color-surface)"
            }; ${
              isRetro
                ? "border-top: 3px solid var(--color-accent); border-bottom: 3px solid #00f5ff;"
                : ""
            }">
        <div class="container">
          <div style="text-align: center; margin-bottom: ${
            isBrutalist ? "5rem" : "4rem"
          }; max-width: 700px; margin-left: auto; margin-right: auto;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(${
              isBrutalist || isRetro ? "2.5rem" : "2rem"
            }, 5vw, ${
              isBrutalist || isRetro ? "3.5rem" : "3rem"
            }); font-weight: ${
              isBrutalist ? "900" : "900"
            }; margin-bottom: 1rem; letter-spacing: ${
              isRetro ? "3px" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""} ${
              isBrutalist
                ? "color: var(--color-bg);"
                : isGradient
                ? "background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : isRetro
                ? "background: linear-gradient(90deg, var(--color-accent), #00f5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
                : ""
            }">
              Customer Reviews
            </h2>
            <div style="width: ${isBrutalist ? "80px" : "60px"}; height: ${
              isBrutalist ? "6px" : "4px"
            }; background: ${
              isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
            }; margin: 0 auto 1rem; border-radius: ${
              isBrutalist || isElegant || isRetro ? "0" : "2px"
            };"></div>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; color: ${
              isBrutalist ? "var(--color-bg)" : "var(--color-text-secondary)"
            }; font-size: ${
              isBrutalist || isRetro ? "1.25rem" : "1.125rem"
            }; line-height: 1.6; font-weight: ${isElegant ? "300" : "normal"};">
              What our customers say about us
            </p>
          </div>
          <div class="reviews-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(${
            isBrutalist || isElegant ? "340px" : "300px"
          }, 1fr)); gap: ${
              isBrutalist || isElegant ? "2.5rem" : "2rem"
            }; max-width: 1200px; margin: 0 auto;">
            ${data.testimonials
              .map(
                (t) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255,255,255,0.05)"
                  : isBrutalist
                  ? "var(--color-bg)"
                  : "var(--color-bg)"
              }; padding: ${
                  isBrutalist || isElegant ? "3rem" : "2.5rem"
                }; border-radius: ${
                  isGradient
                    ? "20px"
                    : isBrutalist || isElegant || isRetro
                    ? "0"
                    : isNeumorphism || isGlassmorphism
                    ? "20px"
                    : "12px"
                }; ${
                  isBrutalist
                    ? "box-shadow: 8px 8px 0 var(--color-bg); border: 4px solid var(--color-bg);"
                    : isGradient
                    ? "box-shadow: 0 4px 20px rgba(102,126,234,0.1);"
                    : isRetro
                    ? "border: 3px solid var(--color-accent);"
                    : isNeumorphism
                    ? getNeumorphismShadow(false)
                    : isGlassmorphism
                    ? "backdrop-filter: blur(20px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.1);"
                    : "box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
                } border-top: ${isBrutalist ? "6px" : "4px"} solid ${
                  isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
                }; transition: all ${
                  isBrutalist || isRetro ? "0.2s" : "0.3s"
                };" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='12px 12px 0 var(--color-bg)'`
                    : isRetro
                    ? `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(255,47,181,0.15)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismHoverShadow()}'`
                    : `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='8px 8px 0 var(--color-bg)'`
                    : isRetro
                    ? `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='${getNeumorphismNormalShadow()}'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'`
                }">
                ${
                  t.rating
                    ? `
                <div style="color: #FFB800; font-size: ${
                  isBrutalist ? "1.5rem" : "1.25rem"
                }; margin-bottom: 1.25rem; letter-spacing: 0.25rem;">
                  ${"★".repeat(parseInt(t.rating))}${"☆".repeat(
                        5 - parseInt(t.rating)
                      )}
                </div>
                `
                    : ""
                }
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: ${
                  isBrutalist || isRetro ? "1.0625rem" : "1rem"
                }; line-height: ${
                  isElegant ? "1.9" : "1.7"
                }; margin-bottom: 1.5rem; font-style: ${
                  isElegant ? "italic" : "normal"
                }; color: ${
                  isBrutalist ? "var(--color-accent)" : "var(--color-text)"
                }; ${isBrutalist ? "font-weight: 700;" : ""}">
                  "${t.text}"
                </p>
                <div style="display: flex; align-items: center; gap: ${
                  isBrutalist ? "1.5rem" : "1rem"
                };">
                  <div style="width: ${
                    isBrutalist ? "56px" : "48px"
                  }; height: ${isBrutalist ? "56px" : "48px"}; background: ${
                  isGradient
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : isRetro
                    ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                    : isBrutalist
                    ? "var(--color-bg)"
                    : "var(--color-accent)"
                }; border-radius: ${
                  isBrutalist || isElegant || isRetro ? "0" : "50%"
                }; display: flex; align-items: center; justify-content: center; color: ${
                  isBrutalist ? "var(--color-accent)" : "white"
                }; font-weight: 900; font-size: ${
                  isBrutalist ? "1.5rem" : "1.25rem"
                }; flex-shrink: 0; ${
                  isBrutalist ? "border: 3px solid var(--color-accent);" : ""
                }">
                    ${t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; font-size: ${
                  isBrutalist || isRetro ? "1.125rem" : "1rem"
                }; color: ${
                  isBrutalist ? "var(--color-accent)" : "var(--color-text)"
                }; ${
                  isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                }">${t.name}</div>
                    <div style="font-family: ${
                      isRetro ? "Space Mono, monospace" : "inherit"
                    }; font-size: ${
                  isBrutalist || isRetro ? "0.9375rem" : "0.875rem"
                }; color: var(--color-text-secondary); ${
                  isBrutalist || isRetro ? "font-weight: 700;" : ""
                }">Verified Customer</div>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Contact CTA Section -->
      <section id="contact" style="padding: ${
        isBrutalist || isRetro ? "8rem 0" : "6rem 0"
      }; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
          : "var(--color-accent)"
      }; color: ${
        isBrutalist ? "var(--color-bg)" : "white"
      }; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; background: ${
          isBrutalist
            ? "none"
            : "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1), transparent)"
        }; pointer-events: none;"></div>
        <div class="container" style="max-width: 800px; position: relative;">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${
        isBrutalist || isRetro ? "2.5rem" : "2.5rem"
      }, 6vw, ${isBrutalist || isRetro ? "5rem" : "4rem"}); font-weight: ${
        isBrutalist || isNeumorphism
          ? "900"
          : isRetro
          ? "700"
          : isElegant
          ? "600"
          : "900"
      }; margin-bottom: 1.5rem; color: ${
        isBrutalist ? "var(--color-bg)" : "white"
      }; letter-spacing: ${isRetro ? "3px" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            ${isBrutalist ? "READY TO START?" : "Ready to Get Started?"}
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist || isRetro ? "1.375rem" : "1.25rem"
      }; margin-bottom: 3rem; opacity: ${
        isBrutalist ? "1" : "0.95"
      }; line-height: 1.6; max-width: 600px; margin-left: auto; margin-right: auto; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Contact us today and experience the difference of working with a local business that cares
          </p>
          <div style="display: flex; gap: ${
            isBrutalist ? "2rem" : "1.5rem"
          }; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem;">
            ${
              data.phone
                ? `
            <a href="tel:${data.phone.replace(
              /\s/g,
              ""
            )}" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; display: inline-flex; align-items: center; gap: 0.75rem; padding: ${
                    isBrutalist ? "1.5rem 3rem" : "1.25rem 2.5rem"
                  }; background: ${
                    isBrutalist ? "var(--color-bg)" : "white"
                  }; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : isGradient
                      ? "#667eea"
                      : isRetro
                      ? "var(--color-accent)"
                      : "var(--color-accent)"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "900" : "700"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : "8px"
                  }; transition: all 0.2s; ${
                    isBrutalist
                      ? "border: 3px solid var(--color-bg); text-transform: uppercase; letter-spacing: 1px;"
                      : isRetro
                      ? "border: 2px solid white; text-transform: uppercase; letter-spacing: 1px;"
                      : "box-shadow: 0 4px 15px rgba(0,0,0,0.1);"
                  }" onmouseover="${
                    isBrutalist
                      ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                      : isRetro
                      ? `this.style.background='transparent'; this.style.color='white'`
                      : `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)'`
                  }" onmouseout="${
                    isBrutalist
                      ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                      : isRetro
                      ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                      : `this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'`
                  }">
              <span style="font-size: 1.5rem;">${
                isBrutalist ? "☎" : "📞"
              }</span> Call ${data.phone}
            </a>
            `
                : ""
            }
            ${
              data.email
                ? `
            <a href="mailto:${data.email}" style="font-family: ${
                    isRetro ? "Space Mono, monospace" : "inherit"
                  }; display: inline-flex; align-items: center; gap: 0.75rem; padding: ${
                    isBrutalist ? "1.5rem 3rem" : "1.25rem 2.5rem"
                  }; background: transparent; color: ${
                    isBrutalist ? "var(--color-bg)" : "white"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist || isRetro ? "900" : "700"
                  }; font-size: ${
                    isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                  }; border: ${isBrutalist ? "3px" : "3px"} solid ${
                    isBrutalist ? "var(--color-bg)" : "white"
                  }; border-radius: ${
                    isGradient || isRetro
                      ? "999px"
                      : isBrutalist || isElegant
                      ? "0"
                      : "8px"
                  }; transition: all 0.2s; ${
                    isBrutalist || isRetro
                      ? "text-transform: uppercase; letter-spacing: 1px;"
                      : ""
                  }" onmouseover="${
                    isBrutalist
                      ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                      : isRetro
                      ? `this.style.background='white'; this.style.color='var(--color-accent)'`
                      : `this.style.background='white'; this.style.color='var(--color-accent)'`
                  }" onmouseout="${
                    isBrutalist
                      ? `this.style.background='transparent'; this.style.color='var(--color-bg)'`
                      : isRetro
                      ? `this.style.background='transparent'; this.style.color='white'`
                      : `this.style.background='transparent'; this.style.color='white'`
                  }">
              <span style="font-size: 1.5rem;">${
                isBrutalist ? "✉" : "📧"
              }</span> Email Us
            </a>
            `
                : ""
            }
          </div>
          ${
            data.facebook || data.instagram
              ? `
          <div style="padding-top: ${
            isBrutalist ? "4rem" : "3rem"
          }; border-top: ${isBrutalist ? "3px" : "2px"} solid ${
                  isBrutalist ? "var(--color-bg)" : "rgba(255,255,255,0.2)"
                };">
            <div style="font-family: ${
              isRetro ? "Space Mono, monospace" : "inherit"
            }; font-weight: ${
                  isBrutalist || isRetro ? "900" : "700"
                }; margin-bottom: 1.5rem; font-size: ${
                  isBrutalist || isRetro ? "1.25rem" : "1.125rem"
                }; ${
                  isBrutalist || isRetro
                    ? "text-transform: uppercase; letter-spacing: 1px;"
                    : ""
                }">Follow Us</div>
            <div style="display: flex; gap: ${
              isBrutalist ? "1.5rem" : "1rem"
            }; justify-content: center;">
              ${
                data.facebook
                  ? `
              <a href="${data.facebook}" target="_blank" style="width: ${
                      isBrutalist ? "64px" : "56px"
                    }; height: ${isBrutalist ? "64px" : "56px"}; background: ${
                      isBrutalist ? "var(--color-bg)" : "rgba(255,255,255,0.2)"
                    }; border-radius: ${
                      isBrutalist || isElegant || isRetro ? "0" : "50%"
                    }; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: ${
                      isBrutalist ? "2rem" : "1.5rem"
                    }; transition: all 0.2s; ${
                      isBrutalist
                        ? "border: 3px solid var(--color-bg);"
                        : "backdrop-filter: blur(10px);"
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                        : `this.style.background='rgba(255,255,255,0.3)'; this.style.transform='scale(1.1)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                        : `this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)'`
                    }">
                <span style="color: ${
                  isBrutalist ? "var(--color-accent)" : "white"
                };">f</span>
              </a>
              `
                  : ""
              }
              ${
                data.instagram
                  ? `
              <a href="https://instagram.com/${data.instagram.replace(
                "@",
                ""
              )}" target="_blank" style="width: ${
                      isBrutalist ? "64px" : "56px"
                    }; height: ${isBrutalist ? "64px" : "56px"}; background: ${
                      isBrutalist ? "var(--color-bg)" : "rgba(255,255,255,0.2)"
                    }; border-radius: ${
                      isBrutalist || isElegant || isRetro ? "0" : "50%"
                    }; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: ${
                      isBrutalist ? "2rem" : "1.5rem"
                    }; transition: all 0.2s; ${
                      isBrutalist
                        ? "border: 3px solid var(--color-bg);"
                        : "backdrop-filter: blur(10px);"
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                        : `this.style.background='rgba(255,255,255,0.3)'; this.style.transform='scale(1.1)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.background='var(--color-bg)'; this.style.color='var(--color-accent)'`
                        : `this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)'`
                    }">
                <span style="color: ${
                  isBrutalist ? "var(--color-accent)" : "white"
                };">📷</span>
              </a>
              `
                  : ""
              }
            </div>
          </div>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: ${
        isBrutalist ? "4rem 0" : "3rem 0"
      }; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: ${
        isBrutalist || isRetro ? "1rem" : "0.875rem"
      }; border-top: ${isBrutalist ? "4px" : isRetro ? "3px" : "1px"} solid ${
        isBrutalist || isRetro ? "var(--color-accent)" : "var(--color-border)"
      }; font-weight: ${isBrutalist ? "900" : isRetro ? "700" : "normal"}; ${
        isBrutalist || isRetro
          ? "text-transform: uppercase; letter-spacing: 2px;"
          : ""
      }">
        <div class="container">
          <p>© 2024 ${data.businessName || "Business"}. ${
        isBrutalist
          ? "PROUDLY SERVING OUR LOCAL COMMUNITY."
          : "Proudly serving our local community."
      }</p>
        </div>
      </footer>

      <style>
        ${
          isNeumorphism
            ? `
        /* Neumorphism CSS Variables */
        :root {
          --neomorph-shadow-out: 20px 20px 60px #c5c9ce, -20px -20px 60px #ffffff;
          --neomorph-shadow-in: inset 8px 8px 16px #c5c9ce, inset -8px -8px 16px #ffffff;
        }
        
        [data-theme="dark"] {
          --neomorph-shadow-out: 32px 32px 64px #2a2d34, -32px -32px 64px #383d46;
          --neomorph-shadow-in: inset 16px 16px 32px #2a2d34, inset -16px -16px 32px #383d46;
        }
        `
            : ""
        }
        
        ${
          isRetro
            ? `
        /* Retro grid background */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255,47,181,0.02) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,47,181,0.02) 2px, transparent 2px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 0;
        }
        `
            : ""
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
    `;
    },
  }),
  "designer-portfolio": new Template("designer-portfolio", {
    name: "Designer Portfolio",
    description: "Showcase your design work with style",
    category: "Portfolio",
    image: "designer-portfolio",
    defaultTheme: "brutalist",
    fields: {
      designerName: {
        type: "text",
        default: "Alex Jordan",
        label: "Your Name",
        required: true,
      },
      title: {
        type: "text",
        default: "UI/UX Designer",
        label: "Professional Title",
        required: true,
      },
      bio: {
        type: "textarea",
        default:
          "Creating exceptional digital experiences through thoughtful design. I believe in the power of simplicity and intentional design decisions.",
        label: "Bio",
        required: true,
      },
      email: {
        type: "email",
        default: "hello@designer.com",
        label: "Email",
        required: true,
      },
      phone: {
        type: "text",
        default: "",
        label: "Phone Number",
        required: false,
      },
      portfolio: {
        type: "url",
        default: "",
        label: "Portfolio Website",
        required: false,
      },
      linkedin: {
        type: "url",
        default: "",
        label: "LinkedIn URL",
        required: false,
      },
      behance: {
        type: "url",
        default: "",
        label: "Behance URL",
        required: false,
      },
      dribbble: {
        type: "url",
        default: "",
        label: "Dribbble URL",
        required: false,
      },
      projects: {
        type: "group",
        label: "Projects",
        itemLabel: "Project",
        min: 1,
        max: 12,
        fields: {
          title: { type: "text", label: "Project Title", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
          imageUrl: { type: "url", label: "Image URL", default: "" },
          link: { type: "url", label: "Project Link", default: "" },
          tags: { type: "text", label: "Tags (comma separated)", default: "" },
        },
        default: [
          {
            title: "Brand Identity System",
            description:
              "Complete visual identity for a modern tech startup, including logo design, color palette, and brand guidelines.",
            imageUrl: "",
            link: "",
            tags: "Branding, Identity, Logo Design",
          },
          {
            title: "E-Commerce Platform",
            description:
              "User-centered design for a seamless shopping experience with focus on conversion optimization.",
            imageUrl: "",
            link: "",
            tags: "UI Design, UX Research, Web Design",
          },
          {
            title: "Mobile App Interface",
            description:
              "Intuitive mobile app design with modern interactions and delightful micro-animations.",
            imageUrl: "",
            link: "",
            tags: "Mobile Design, Prototyping, iOS",
          },
        ],
      },
      skills: {
        type: "text",
        default:
          "Figma, Sketch, Adobe Creative Suite, Prototyping, User Research, Wireframing",
        label: "Skills (comma separated)",
        required: true,
      },
      experience: {
        type: "text",
        default: "8+ Years",
        label: "Years of Experience",
        required: false,
      },
      availability: {
        type: "text",
        default: "Available for freelance projects",
        label: "Current Availability",
        required: false,
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Fixed Side Navigation -->
      <nav style="position: fixed; left: 0; top: 0; bottom: 0; width: 80px; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "var(--color-bg)"
          : isGradient
          ? "linear-gradient(180deg, #667eea 0%, #764ba2 100%)"
          : isRetro
          ? "var(--color-text)"
          : "var(--color-text)"
      }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-right: 1px solid rgba(255, 255, 255, 0.2);"
          : isBrutalist
          ? "border-right: 4px solid var(--color-text);"
          : ""
      } color: ${
        isNeumorphism ? "var(--color-text)" : "var(--color-bg)"
      }; z-index: 1000; display: flex; flex-direction: column; align-items: center; padding: 2rem 0; ${
        isNeumorphism
          ? "box-shadow: 6px 0 12px rgba(163, 177, 198, 0.6), -6px 0 12px rgba(255, 255, 255, 0.9);"
          : ""
      }">
        <div style="writing-mode: vertical-rl; font-weight: ${
          isBrutalist || isRetro
            ? "900"
            : isMinimal || isElegant
            ? "300"
            : "700"
        }; font-size: 1.125rem; letter-spacing: ${
        isBrutalist || isRetro ? "0.1em" : "0.05em"
      }; margin-bottom: auto; transform: rotate(180deg); ${
        isRetro ? "text-shadow: 0 0 10px currentColor;" : ""
      }">
          ${data.designerName?.split(" ")[0]?.toUpperCase() || "DESIGNER"}
        </div>
        <label class="theme-toggle-switch-wrapper" style="cursor: pointer; margin-top: auto; ${
          isNeumorphism
            ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
            : ""
        }">
          <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
          <span class="theme-toggle-slider"></span>
        </label>
      </nav>

      <!-- Main Content with Left Margin -->
      <div style="margin-left: 80px;">
        
        <!-- Hero Section -->
        <section style="min-height: 100vh; display: flex; align-items: center; padding: 4rem 0; background: ${
          isGradient
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : isGlassmorphism
            ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
            : isRetro
            ? "var(--color-text)"
            : "var(--color-bg)"
        };">
          <div class="container" style="max-width: 1400px; margin: 0 auto; padding: 0 2rem;">
            <div class="hero-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 4rem; align-items: start;">
              <div>
                <div style="overflow: hidden; margin-bottom: 2rem;">
                  <div style="display: inline-block; background: ${
                    isBrutalist
                      ? "var(--color-text)"
                      : isGlassmorphism
                      ? "rgba(255, 255, 255, 0.2)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : isGradient
                      ? "rgba(255, 255, 255, 0.2)"
                      : isRetro
                      ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                      : isElegant
                      ? "transparent"
                      : "var(--color-text)"
                  }; color: ${
        isNeumorphism
          ? "var(--color-text)"
          : isElegant
          ? "var(--color-accent)"
          : isGradient
          ? "white"
          : "var(--color-bg)"
      }; padding: 0.75rem 2rem; font-weight: ${
        isBrutalist || isRetro ? "900" : isElegant ? "400" : "700"
      }; font-size: 0.875rem; letter-spacing: ${
        isElegant ? "2px" : "0.15em"
      }; text-transform: uppercase; ${
        isBrutalist
          ? "transform: skew(-5deg); border: 3px solid var(--color-text);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50px;"
          : isNeumorphism
          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 50px;"
          : isRetro
          ? "border: 2px solid var(--color-accent); box-shadow: 0 0 20px var(--color-accent); border-radius: 0;"
          : isElegant
          ? "border-bottom: 2px solid var(--color-accent);"
          : "border-radius: 4px;"
      }">
                    <span style="display: inline-block; ${
                      isBrutalist ? "transform: skew(5deg);" : ""
                    }">${data.title?.toUpperCase() || "DESIGNER"}</span>
                  </div>
                </div>
                <h1 ${
                  isRetro
                    ? `class="glitch" data-text="${
                        data.designerName?.toUpperCase() || "YOUR NAME"
                      }"`
                    : ""
                } style="font-family: ${
        isElegant ? "Playfair Display, serif" : "inherit"
      }; font-size: clamp(4rem, 12vw, 8rem); font-weight: ${
        isBrutalist || isRetro ? "900" : isMinimal || isElegant ? "300" : "800"
      }; line-height: 0.9; margin-bottom: 2rem; letter-spacing: ${
        isMinimal || isElegant ? "0" : "-0.05em"
      }; color: ${
        isGradient || isRetro ? "var(--color-bg)" : "var(--color-text)"
      }; ${
        isNeumorphism
          ? "text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8), -2px -2px 4px rgba(163, 177, 198, 0.5);"
          : isRetro
          ? "position: relative; text-transform: uppercase; letter-spacing: 2px;"
          : ""
      }">
                  ${
                    isRetro
                      ? `<span class="gradient-text" style="background: linear-gradient(90deg, var(--color-accent), #00f5ff, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: glow 2s ease-in-out infinite alternate;">${
                          data.designerName?.toUpperCase() || "YOUR NAME"
                        }</span>`
                      : data.designerName?.toUpperCase() || "YOUR NAME"
                  }
                </h1>
                <div style="width: 200px; height: ${
                  isBrutalist || isRetro ? "8px" : "4px"
                }; background: ${
        isBrutalist
          ? "var(--color-text)"
          : isGlassmorphism
          ? "linear-gradient(90deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))"
          : isNeumorphism
          ? "linear-gradient(90deg, #cbd5e0, #a0aec0)"
          : isGradient || isRetro
          ? "var(--color-bg)"
          : "var(--color-accent)"
      }; margin-bottom: 3rem; ${
        isBrutalist
          ? "border: 2px solid var(--color-text);"
          : isRetro
          ? "box-shadow: 0 0 20px currentColor;"
          : ""
      }"></div>
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.5rem; line-height: 1.6; max-width: 600px; font-weight: ${
        isMinimal || isElegant ? "300" : "500"
      }; color: ${
        isGradient || isRetro
          ? "rgba(255, 255, 255, 0.95)"
          : "var(--color-text-secondary)"
      };">
                  ${
                    data.bio ||
                    "Creating exceptional digital experiences through thoughtful design"
                  }
                </p>
              </div>
              <div class="contact-sidebar" style="position: sticky; top: 2rem;">
                ${
                  data.availability
                    ? `
                <div style="background: ${
                  isBrutalist
                    ? "#ffeb3b"
                    : isGlassmorphism
                    ? "rgba(255, 255, 255, 0.1)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isGradient
                    ? "rgba(255, 255, 255, 0.2)"
                    : isRetro
                    ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                    : "var(--color-accent)"
                }; color: ${
                        isNeumorphism
                          ? "var(--color-text)"
                          : isBrutalist
                          ? "var(--color-text)"
                          : "var(--color-bg)"
                      }; padding: 2rem; margin-bottom: 2rem; ${
                        isBrutalist
                          ? "transform: rotate(2deg); border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px;"
                          : isNeumorphism
                          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
                          : isRetro
                          ? "border: 2px solid var(--color-accent); box-shadow: 0 0 30px var(--color-accent);"
                          : isElegant
                          ? "border: 1px solid var(--color-accent); border-radius: 0;"
                          : "border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);"
                      } ${
                        isGradient
                          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"
                          : ""
                      }">
                  <div style="font-weight: ${
                    isBrutalist || isRetro ? "900" : "700"
                  }; font-size: 0.875rem; letter-spacing: 0.1em; margin-bottom: 0.5rem; opacity: ${
                        isGradient || isGlassmorphism ? "0.9" : "1"
                      };">STATUS</div>
                  <div style="font-size: 1.25rem; font-weight: ${
                    isMinimal || isElegant ? "400" : "700"
                  };">${data.availability}</div>
                </div>
                `
                    : ""
                }
                <div style="background: ${
                  isBrutalist || isRetro
                    ? "var(--color-text)"
                    : isGlassmorphism
                    ? "rgba(0, 0, 0, 0.2)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isGradient
                    ? "rgba(0, 0, 0, 0.3)"
                    : isElegant
                    ? "transparent"
                    : "var(--color-text)"
                }; color: ${
        isNeumorphism
          ? "var(--color-text)"
          : isElegant
          ? "var(--color-text)"
          : "var(--color-bg)"
      }; padding: 2rem; ${
        isBrutalist
          ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px;"
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
          : isRetro
          ? "border: 2px solid var(--color-accent); box-shadow: 0 0 30px var(--color-accent);"
          : isElegant
          ? "border: 1px solid var(--color-border);"
          : "border-radius: 12px;"
      } ${
        isGradient
          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"
          : ""
      }">
                  <div style="font-weight: ${
                    isBrutalist || isRetro ? "900" : "700"
                  }; font-size: 0.875rem; letter-spacing: 0.1em; margin-bottom: 1.5rem; opacity: 0.9;">CONTACT</div>
                  ${
                    data.email
                      ? `
                  <a href="mailto:${
                    data.email
                  }" style="display: block; color: ${
                          isNeumorphism || isElegant
                            ? "var(--color-accent)"
                            : "var(--color-bg)"
                        }; text-decoration: none; font-weight: ${
                          isMinimal || isElegant ? "400" : "700"
                        }; font-size: 1.125rem; margin-bottom: 1rem; transition: all 0.3s; ${
                          isRetro ? "text-shadow: 0 0 10px currentColor;" : ""
                        }" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                    ${data.email}
                  </a>
                  `
                      : ""
                  }
                  ${
                    data.phone
                      ? `
                  <a href="tel:${data.phone}" style="display: block; color: ${
                          isNeumorphism || isElegant
                            ? "var(--color-accent)"
                            : "var(--color-bg)"
                        }; text-decoration: none; font-weight: ${
                          isMinimal || isElegant ? "400" : "700"
                        }; font-size: 1.125rem; margin-bottom: 1rem; transition: all 0.3s; ${
                          isRetro ? "text-shadow: 0 0 10px currentColor;" : ""
                        }" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                    ${data.phone}
                  </a>
                  `
                      : ""
                  }
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem;">
                    ${
                      data.linkedin
                        ? `<a href="${
                            data.linkedin
                          }" target="_blank" style="color: ${
                            isNeumorphism || isElegant
                              ? "var(--color-accent)"
                              : "var(--color-bg)"
                          }; text-decoration: ${
                            isMinimal || isElegant ? "none" : "underline"
                          }; font-size: 0.875rem; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">LinkedIn</a>`
                        : ""
                    }
                    ${
                      data.behance
                        ? `<a href="${
                            data.behance
                          }" target="_blank" style="color: ${
                            isNeumorphism || isElegant
                              ? "var(--color-accent)"
                              : "var(--color-bg)"
                          }; text-decoration: ${
                            isMinimal || isElegant ? "none" : "underline"
                          }; font-size: 0.875rem; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Behance</a>`
                        : ""
                    }
                    ${
                      data.dribbble
                        ? `<a href="${
                            data.dribbble
                          }" target="_blank" style="color: ${
                            isNeumorphism || isElegant
                              ? "var(--color-accent)"
                              : "var(--color-bg)"
                          }; text-decoration: ${
                            isMinimal || isElegant ? "none" : "underline"
                          }; font-size: 0.875rem; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Dribbble</a>`
                        : ""
                    }
                    ${
                      data.portfolio
                        ? `<a href="${
                            data.portfolio
                          }" target="_blank" style="color: ${
                            isNeumorphism || isElegant
                              ? "var(--color-accent)"
                              : "var(--color-bg)"
                          }; text-decoration: ${
                            isMinimal || isElegant ? "none" : "underline"
                          }; font-size: 0.875rem; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">Portfolio</a>`
                        : ""
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Projects Masonry Grid -->
        ${
          data.projects && data.projects.length > 0
            ? `
        <section style="background: ${
          isGlassmorphism
            ? "rgba(255, 255, 255, 0.05)"
            : isNeumorphism
            ? "var(--color-surface)"
            : isGradient
            ? "linear-gradient(180deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
            : isRetro
            ? "var(--color-bg)"
            : "var(--color-surface)"
        }; padding: 6rem 0;">
          <div class="container" style="max-width: 1400px; margin: 0 auto; padding: 0 2rem;">
            <div style="margin-bottom: 4rem;">
              <div style="display: inline-block; background: ${
                isBrutalist || isRetro
                  ? "var(--color-text)"
                  : isGlassmorphism
                  ? "rgba(255, 255, 255, 0.1)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : isGradient
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : isElegant
                  ? "transparent"
                  : "var(--color-text)"
              }; color: ${
                isNeumorphism
                  ? "var(--color-text)"
                  : isElegant
                  ? "var(--color-text)"
                  : "var(--color-bg)"
              }; padding: 1rem 3rem; font-weight: ${
                isBrutalist || isRetro
                  ? "900"
                  : isMinimal || isElegant
                  ? "300"
                  : "800"
              }; font-size: 3rem; letter-spacing: ${
                isMinimal || isElegant ? "0" : "-0.03em"
              }; ${
                isBrutalist
                  ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                  : isGlassmorphism
                  ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px;"
                  : isNeumorphism
                  ? "box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.9); border-radius: 12px;"
                  : isRetro
                  ? "border: 2px solid var(--color-accent); box-shadow: 0 0 30px var(--color-accent); text-shadow: 0 0 20px currentColor;"
                  : isElegant
                  ? "border-bottom: 3px solid var(--color-text);"
                  : "border-radius: 8px;"
              }">
                SELECTED WORK
              </div>
            </div>
            
            <div class="masonry-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 2rem;">
              ${data.projects
                .map(
                  (project, i) => `
                <div class="project-item" style="break-inside: avoid; position: relative; overflow: hidden; background: ${
                  isGlassmorphism
                    ? "rgba(255, 255, 255, 0.1)"
                    : "var(--color-bg)"
                }; ${
                    isBrutalist
                      ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px;"
                      : isNeumorphism
                      ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
                      : isRetro
                      ? "border: 2px solid var(--color-accent); box-shadow: 0 0 20px var(--color-accent);"
                      : isElegant
                      ? "border: 1px solid var(--color-border);"
                      : "border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);"
                  } transition: all 0.3s;">
                  ${
                    project.imageUrl
                      ? `
                  <div style="position: relative; overflow: hidden; aspect-ratio: ${
                    i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "16/9"
                  }; ${
                          isBrutalist || isRetro
                            ? ""
                            : isGlassmorphism || isNeumorphism
                            ? "border-radius: 20px 20px 0 0;"
                            : isElegant
                            ? ""
                            : "border-radius: 12px 12px 0 0;"
                        }">
                    <img src="${project.imageUrl}" alt="${
                          project.title
                        }" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
                  </div>
                  `
                      : `
                  <div style="aspect-ratio: ${
                    i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "16/9"
                  }; background: ${
                          isBrutalist || isRetro
                            ? "var(--color-text)"
                            : isGradient
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "var(--color-text)"
                        }; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: ${
                          isNeumorphism ? "#cbd5e0" : "var(--color-bg)"
                        }; opacity: 0.3; ${
                          isBrutalist || isRetro
                            ? ""
                            : isGlassmorphism || isNeumorphism
                            ? "border-radius: 20px 20px 0 0;"
                            : "border-radius: 12px 12px 0 0;"
                        }">
                    ${["▭", "▬", "▰"][i % 3]}
                  </div>
                  `
                  }
                  <div style="padding: 2rem; ${
                    isBrutalist
                      ? "border: 4px solid var(--color-text); border-top: none;"
                      : ""
                  }">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                      <h3 style="font-family: ${
                        isElegant ? "Playfair Display, serif" : "inherit"
                      }; font-size: 1.75rem; font-weight: ${
                    isBrutalist || isRetro
                      ? "900"
                      : isMinimal || isElegant
                      ? "400"
                      : "800"
                  }; letter-spacing: ${
                    isMinimal || isElegant ? "0" : "-0.02em"
                  }; line-height: 1.2; color: var(--color-text);">
                        ${project.title || "Project"}
                      </h3>
                      ${
                        project.link
                          ? `
                      <a href="${
                        project.link
                      }" target="_blank" style="width: 40px; height: 40px; background: ${
                              isBrutalist || isRetro
                                ? "var(--color-text)"
                                : isGlassmorphism
                                ? "rgba(255, 255, 255, 0.2)"
                                : isNeumorphism
                                ? "var(--color-bg)"
                                : isGradient
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "var(--color-text)"
                            }; color: ${
                              isNeumorphism
                                ? "var(--color-text)"
                                : "var(--color-bg)"
                            }; display: flex; align-items: center; justify-content: center; text-decoration: none; font-weight: ${
                              isBrutalist || isRetro ? "900" : "700"
                            }; font-size: 1.25rem; flex-shrink: 0; ${
                              isBrutalist
                                ? "border: 3px solid var(--color-text);"
                                : isGlassmorphism
                                ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50%;"
                                : isNeumorphism
                                ? "box-shadow: 5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.9); border-radius: 50%;"
                                : isRetro
                                ? "border: 2px solid var(--color-accent); box-shadow: 0 0 20px var(--color-accent);"
                                : "border-radius: 8px;"
                            } transition: all 0.3s;">→</a>
                      `
                          : ""
                      }
                    </div>
                    <p style="font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--color-text-secondary);">
                      ${project.description || ""}
                    </p>
                    ${
                      project.tags
                        ? `
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                      ${project.tags
                        .split(",")
                        .map(
                          (tag) => `
                        <span style="background: ${
                          isBrutalist || isRetro
                            ? "var(--color-text)"
                            : isGlassmorphism
                            ? "rgba(255, 255, 255, 0.1)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : isGradient
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "var(--color-text)"
                        }; color: ${
                            isNeumorphism
                              ? "var(--color-text)"
                              : "var(--color-bg)"
                          }; padding: 0.375rem 1rem; font-size: 0.75rem; font-weight: ${
                            isBrutalist || isRetro ? "900" : "700"
                          }; letter-spacing: 0.05em; text-transform: uppercase; ${
                            isBrutalist
                              ? "border: 2px solid var(--color-text);"
                              : isGlassmorphism
                              ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px;"
                              : isNeumorphism
                              ? "box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.6), -3px -3px 6px rgba(255, 255, 255, 0.9); border-radius: 20px;"
                              : isRetro
                              ? "border: 1px solid var(--color-accent); box-shadow: 0 0 10px var(--color-accent);"
                              : "border-radius: 4px;"
                          }">
                          ${tag.trim()}
                        </span>
                      `
                        )
                        .join("")}
                    </div>
                    `
                        : ""
                    }
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
        `
            : ""
        }

        <!-- Skills & Experience -->
        ${
          data.skills || data.experience
            ? `
        <section style="background: ${
          isGradient
            ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
            : isGlassmorphism
            ? "rgba(0, 0, 0, 0.02)"
            : isRetro
            ? "var(--color-text)"
            : "var(--color-bg)"
        }; padding: 6rem 0;">
          <div class="container" style="max-width: 1400px; margin: 0 auto; padding: 0 2rem;">
            <div class="skills-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6rem;">
              ${
                data.skills
                  ? `
              <div>
                <h2 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: 3.5rem; font-weight: ${
                      isBrutalist || isRetro
                        ? "900"
                        : isMinimal || isElegant
                        ? "300"
                        : "800"
                    }; margin-bottom: 3rem; letter-spacing: ${
                      isMinimal || isElegant ? "0" : "-0.03em"
                    }; line-height: 1; color: ${
                      isRetro ? "var(--color-bg)" : "var(--color-text)"
                    }; ${isRetro ? "text-shadow: 0 0 30px currentColor;" : ""}">
                  CAPABILITIES
                </h2>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                  ${data.skills
                    .split(",")
                    .map(
                      (skill) => `
                    <div style="background: ${
                      isBrutalist
                        ? "var(--color-bg)"
                        : isGlassmorphism
                        ? "rgba(255, 255, 255, 0.1)"
                        : isRetro
                        ? "var(--color-bg)"
                        : "var(--color-surface)"
                    }; padding: 1.5rem; ${
                        isBrutalist
                          ? "border: 3px solid var(--color-text); border-left: 8px solid var(--color-text);"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-left: 4px solid rgba(102, 126, 234, 0.8); border-radius: 12px;"
                          : isNeumorphism
                          ? "box-shadow: 5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.9); border-left: 4px solid var(--color-accent); border-radius: 12px;"
                          : isRetro
                          ? "border: 2px solid var(--color-accent); border-left: 4px solid var(--color-accent); box-shadow: 0 0 20px var(--color-accent);"
                          : isElegant
                          ? "border-left: 2px solid var(--color-accent);"
                          : "border-left: 4px solid var(--color-accent); border-radius: 8px;"
                      } transition: all 0.3s;">
                      <div style="font-weight: ${
                        isBrutalist || isRetro
                          ? "900"
                          : isMinimal || isElegant
                          ? "400"
                          : "700"
                      }; font-size: 1.125rem; color: var(--color-text);">
                        ${skill.trim()}
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }
              
              <div>
                <h2 style="font-family: ${
                  isElegant ? "Playfair Display, serif" : "inherit"
                }; font-size: 3.5rem; font-weight: ${
                isBrutalist || isRetro
                  ? "900"
                  : isMinimal || isElegant
                  ? "300"
                  : "800"
              }; margin-bottom: 3rem; letter-spacing: ${
                isMinimal || isElegant ? "0" : "-0.03em"
              }; line-height: 1; color: ${
                isRetro ? "var(--color-bg)" : "var(--color-text)"
              }; ${isRetro ? "text-shadow: 0 0 30px currentColor;" : ""}">
                  ABOUT
                </h2>
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.25rem; line-height: 1.8; margin-bottom: 2rem; font-weight: ${
                isMinimal || isElegant ? "300" : "500"
              }; color: var(--color-text-secondary);">
                  ${
                    data.bio ||
                    "Passionate designer focused on creating impactful experiences."
                  }
                </p>
                ${
                  data.experience
                    ? `
                <div style="background: ${
                  isBrutalist
                    ? "#ffeb3b"
                    : isGlassmorphism
                    ? "rgba(102, 126, 234, 0.2)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : isGradient
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : isRetro
                    ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                    : "var(--color-accent)"
                }; color: ${
                        isNeumorphism
                          ? "var(--color-text)"
                          : isBrutalist
                          ? "var(--color-text)"
                          : "var(--color-bg)"
                      }; padding: 2rem; margin-top: 3rem; ${
                        isBrutalist
                          ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px;"
                          : isNeumorphism
                          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
                          : isRetro
                          ? "border: 2px solid var(--color-accent); box-shadow: 0 0 30px var(--color-accent);"
                          : isElegant
                          ? "border: 1px solid var(--color-accent);"
                          : "border-radius: 12px;"
                      }">
                  <div style="font-size: 0.875rem; font-weight: ${
                    isBrutalist || isRetro ? "900" : "700"
                  }; letter-spacing: 0.1em; margin-bottom: 0.5rem; opacity: ${
                        isBrutalist ? "1" : "0.9"
                      };">EXPERIENCE</div>
                  <div style="font-size: 2.5rem; font-weight: ${
                    isBrutalist || isRetro
                      ? "900"
                      : isMinimal || isElegant
                      ? "300"
                      : "800"
                  }; letter-spacing: ${
                        isMinimal || isElegant ? "0" : "-0.02em"
                      };">${data.experience}</div>
                </div>
                `
                    : ""
                }
              </div>
            </div>
          </div>
        </section>
        `
            : ""
        }

        <!-- Footer CTA -->
        <section style="background: ${
          isBrutalist || isRetro
            ? "var(--color-text)"
            : isGlassmorphism
            ? "rgba(0, 0, 0, 0.8)"
            : isNeumorphism
            ? "var(--color-surface)"
            : isGradient
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "var(--color-text)"
        }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : ""
      } color: ${
        isNeumorphism ? "var(--color-text)" : "var(--color-bg)"
      }; padding: 8rem 0; text-align: center;">
          <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 2rem;">
            <h2 style="font-family: ${
              isElegant ? "Playfair Display, serif" : "inherit"
            }; font-size: clamp(3rem, 8vw, 6rem); font-weight: ${
        isBrutalist || isRetro ? "900" : isMinimal || isElegant ? "300" : "800"
      }; line-height: 1; margin-bottom: 2rem; letter-spacing: ${
        isMinimal || isElegant ? "0" : "-0.04em"
      }; ${isRetro ? "text-shadow: 0 0 40px currentColor;" : ""}">
              LET'S CREATE<br>TOGETHER
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.5rem; margin-bottom: 3rem; opacity: 0.9; font-weight: ${
        isMinimal || isElegant ? "300" : "500"
      };">
              Available for new projects and collaborations
            </p>
            ${
              data.email
                ? `
            <a href="mailto:${
              data.email
            }" style="display: inline-block; background: ${
                    isBrutalist
                      ? "#ffeb3b"
                      : isGlassmorphism
                      ? "rgba(255, 255, 255, 0.2)"
                      : isNeumorphism
                      ? "var(--color-bg)"
                      : isGradient
                      ? "var(--color-bg)"
                      : isRetro
                      ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                      : "var(--color-bg)"
                  }; color: ${
                    isBrutalist
                      ? "var(--color-text)"
                      : isNeumorphism
                      ? "var(--color-text)"
                      : isGradient
                      ? "#667eea"
                      : isRetro
                      ? "var(--color-bg)"
                      : "var(--color-text)"
                  }; padding: 1.5rem 4rem; font-weight: ${
                    isBrutalist || isRetro ? "900" : "700"
                  }; font-size: 1.25rem; text-decoration: none; ${
                    isBrutalist
                      ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50px;"
                      : isNeumorphism
                      ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 50px;"
                      : isRetro
                      ? "border: 2px solid var(--color-accent); box-shadow: 0 0 30px var(--color-accent); text-transform: uppercase; letter-spacing: 1px;"
                      : isElegant
                      ? "border: 1px solid var(--color-text); border-radius: 0;"
                      : "border-radius: 50px;"
                  } transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; ${
                    isRetro
                      ? "this.style.boxShadow='0 0 50px var(--color-accent)'"
                      : ""
                  }" onmouseout="this.style.transform='translateY(0)'; ${
                    isRetro
                      ? "this.style.boxShadow='0 0 30px var(--color-accent)'"
                      : ""
                  }">
              GET IN TOUCH →
            </a>
            `
                : ""
            }
          </div>
        </section>

        <!-- Footer -->
        <footer style="background: ${
          isGlassmorphism
            ? "rgba(255, 255, 255, 0.05)"
            : isRetro
            ? "var(--color-bg)"
            : "var(--color-bg)"
        }; padding: 2rem 0; text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-text);"
          : isRetro
          ? "border-top: 2px solid var(--color-accent);"
          : "border-top: 1px solid var(--color-border);"
      }">
          <div class="container">
            <p style="font-weight: ${
              isMinimal || isElegant ? "300" : "700"
            };">© 2024 ${data.designerName || "Designer"}</p>
          </div>
        </footer>
      </div>

      <style>
        .project-item:hover img {
          transform: scale(1.05);
        }
        
        ${
          isBrutalist
            ? `
          .project-item:hover {
            transform: translate(-4px, -4px);
            box-shadow: 12px 12px 0 var(--color-text) !important;
          }
        `
            : isGlassmorphism
            ? `
          .project-item:hover {
            transform: translateY(-4px);
            background: rgba(255, 255, 255, 0.15) !important;
          }
        `
            : isNeumorphism
            ? `
          .project-item:hover {
            box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9) !important;
          }
        `
            : isRetro
            ? `
          .project-item:hover {
            box-shadow: 0 0 40px var(--color-accent) !important;
          }
        `
            : `
          .project-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
          }
        `
        }
        
        ${
          isRetro
            ? `
        /* Retro glitch effect */
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch::before {
          animation: glitch1 2s infinite;
          color: var(--color-accent);
          z-index: -1;
        }
        
        .glitch::after {
          animation: glitch2 3s infinite;
          color: #00f5ff;
          z-index: -2;
        }
        
        @keyframes glitch1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        @keyframes glow {
          from { filter: drop-shadow(0 0 10px var(--color-accent)); }
          to { filter: drop-shadow(0 0 30px #00f5ff); }
        }
        `
            : ""
        }
        
        @media (max-width: 1024px) {
          nav { width: 60px; padding: 1.5rem 0; }
          nav > div:first-child { font-size: 0.875rem; }
          div[style*="margin-left: 80px"] { margin-left: 60px !important; }
          .masonry-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .contact-sidebar { position: static !important; }
        }
        
        @media (max-width: 768px) {
          nav { display: none; }
          div[style*="margin-left: 80px"], div[style*="margin-left: 60px"] { margin-left: 0 !important; }
          .masonry-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          section > div, .container { padding: 0 1.5rem !important; }
          section[style*="padding: 8rem"] { padding: 5rem 0 !important; }
          section[style*="padding: 6rem"] { padding: 4rem 0 !important; }
          h1 { font-size: clamp(2.5rem, 10vw, 4rem) !important; }
          h2 { font-size: clamp(2rem, 8vw, 3rem) !important; }
          div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
        
        @media (max-width: 480px) {
          .masonry-grid { grid-template-columns: 1fr !important; }
          section > div, .container { padding: 0 1rem !important; }
        }
      </style>
    `;
    },
  }),
  "writer-portfolio": new Template("writer-portfolio", {
    name: "Writer Portfolio",
    description: "Perfect for authors, journalists, and content creators",
    category: "Portfolio",
    image: "writer-portfolio",
    defaultTheme: "elegant",
    fields: {
      writerName: {
        type: "text",
        default: "Jordan Blake",
        label: "Your Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "Freelance Writer & Storyteller",
        label: "Tagline",
        required: true,
      },
      bio: {
        type: "textarea",
        default:
          "Crafting stories and sharing insights through the written word. I explore the intersection of technology, culture, and human experience.",
        label: "Bio",
        required: true,
      },
      email: {
        type: "email",
        default: "hello@writer.com",
        label: "Email",
        required: true,
      },
      website: {
        type: "url",
        default: "",
        label: "Personal Website",
        required: false,
      },
      twitter: {
        type: "text",
        default: "",
        label: "Twitter/X Handle",
        placeholder: "@username",
        required: false,
      },
      medium: {
        type: "url",
        default: "",
        label: "Medium URL",
        required: false,
      },
      linkedin: {
        type: "url",
        default: "",
        label: "LinkedIn URL",
        required: false,
      },
      articles: {
        type: "group",
        label: "Published Work",
        itemLabel: "Article",
        min: 1,
        max: 12,
        fields: {
          title: { type: "text", label: "Article Title", default: "" },
          publication: { type: "text", label: "Publication Name", default: "" },
          date: { type: "text", label: "Date", default: "" },
          excerpt: { type: "textarea", label: "Brief Excerpt", default: "" },
          link: { type: "url", label: "Article Link", default: "" },
        },
        default: [
          {
            title: "The Future of Digital Storytelling",
            publication: "The Atlantic",
            date: "2024",
            excerpt:
              "As technology evolves, so do the ways we tell and consume stories. This exploration examines how digital platforms are reshaping narrative structures.",
            link: "",
          },
          {
            title: "Finding Voice in the Digital Age",
            publication: "Medium",
            date: "2024",
            excerpt:
              "In an era of constant connectivity, authentic voice has become both more important and more elusive.",
            link: "",
          },
          {
            title: "The Art of the Long Read",
            publication: "Longform",
            date: "2023",
            excerpt:
              "Why deep, immersive journalism still matters in our fast-paced media landscape.",
            link: "",
          },
        ],
      },
      specialties: {
        type: "text",
        default: "Technology, Culture, Longreads, Essays",
        label: "Writing Specialties (comma separated)",
        required: true,
      },
      publications: {
        type: "text",
        default: "The Atlantic, Wired, Medium, The New Yorker",
        label: "Notable Publications (comma separated)",
        required: false,
      },
      books: {
        type: "group",
        label: "Books",
        itemLabel: "Book",
        min: 0,
        max: 6,
        fields: {
          title: { type: "text", label: "Book Title", default: "" },
          year: { type: "text", label: "Year", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
          link: { type: "url", label: "Book Link", default: "" },
        },
        default: [],
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Minimal Header -->
      <header style="padding: 2rem 0; background: var(--color-bg); ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-text);"
          : isRetro
          ? "border-bottom: 3px solid var(--color-accent);"
          : "border-bottom: 1px solid var(--color-border);"
      }">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: ${isBrutalist ? "2rem" : "1.75rem"}; font-weight: ${
        isBrutalist ? "900" : "400"
      }; ${isElegant ? "font-style: italic;" : ""} ${
        isBrutalist ? "text-transform: uppercase;" : ""
      }">
              ${data.writerName || "Writer Name"}
            </div>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                : ""
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </div>
        </div>
      </header>

      <!-- Hero Masthead -->
      <section style="padding: ${
        isBrutalist ? "6rem 0 4rem" : "8rem 0 6rem"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
          : "var(--color-bg)"
      }; text-align: center;">
        <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 2rem;">
          <div style="font-size: ${
            isBrutalist ? "0.875rem" : "1rem"
          }; text-transform: uppercase; letter-spacing: ${
        isBrutalist ? "0.15em" : "0.2em"
      }; margin-bottom: 2rem; color: ${
        isBrutalist || isRetro
          ? "var(--color-accent)"
          : "var(--color-text-secondary)"
      }; font-weight: ${isBrutalist ? "900" : "600"};">
            ${data.tagline || "Writer & Storyteller"}
          </div>
          <h1 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: clamp(${isBrutalist ? "3rem" : "4rem"}, 10vw, ${
        isBrutalist ? "6rem" : "7rem"
      }); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "400"
      }; margin-bottom: 3rem; line-height: 1.1; ${
        isBrutalist
          ? "text-transform: uppercase; letter-spacing: -0.02em;"
          : isRetro
          ? "text-transform: uppercase;"
          : ""
      }">
            ${data.writerName || "Your Name"}
          </h1>
          <div style="max-width: ${isBrutalist ? "80px" : "2px"}; height: ${
        isBrutalist ? "8px" : "60px"
      }; background: var(--color-accent); margin: 0 auto 3rem; ${
        isBrutalist ? "border: 2px solid var(--color-text);" : ""
      }"></div>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist ? "1.25rem" : "1.375rem"
      }; line-height: 1.8; color: var(--color-text-secondary); max-width: 700px; margin: 0 auto; font-weight: ${
        isElegant ? "300" : "400"
      };">
            ${
              data.bio ||
              "Crafting stories and sharing insights through the written word"
            }
          </p>
        </div>
      </section>

      ${
        data.publications
          ? `
      <!-- Publications Ribbon -->
      <section style="background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "var(--color-accent)"
          : "var(--color-text)"
      }; color: ${
              isBrutalist ? "var(--color-text)" : "var(--color-bg)"
            }; padding: ${
              isBrutalist ? "2rem 0" : "1.5rem 0"
            }; text-align: center; ${
              isBrutalist
                ? "border-top: 4px solid var(--color-text); border-bottom: 4px solid var(--color-text);"
                : isRetro
                ? "border-top: 2px solid var(--color-accent); border-bottom: 2px solid var(--color-accent);"
                : "border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);"
            }">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="font-size: ${
            isBrutalist ? "0.875rem" : "0.75rem"
          }; text-transform: uppercase; letter-spacing: ${
              isBrutalist ? "0.2em" : "0.15em"
            }; margin-bottom: ${isBrutalist ? "1rem" : "0.75rem"}; opacity: ${
              isBrutalist ? "1" : "0.7"
            }; font-weight: ${isBrutalist ? "900" : "600"};">
            Featured In
          </div>
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: ${isBrutalist ? "1.125rem" : "1rem"}; ${
              isElegant ? "font-style: italic;" : ""
            } opacity: 0.95; font-weight: ${isBrutalist ? "700" : "normal"};">
            ${data.publications
              .split(",")
              .map((pub) => pub.trim())
              .join(" · ")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Featured Article (First Article Large) -->
      ${
        data.articles && data.articles.length > 0
          ? `
      <section style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 2rem;">
          <div style="font-size: ${
            isBrutalist ? "0.875rem" : "0.75rem"
          }; text-transform: uppercase; letter-spacing: ${
              isBrutalist ? "0.2em" : "0.15em"
            }; color: var(--color-accent); margin-bottom: ${
              isBrutalist ? "2rem" : "1rem"
            }; font-weight: ${isBrutalist ? "900" : "700"};">
            Featured Story
          </div>
          <article>
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isBrutalist
                ? "inherit"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: clamp(${isBrutalist ? "2rem" : "2.5rem"}, 6vw, ${
              isBrutalist ? "3.5rem" : "4.5rem"
            }); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "400"
            }; line-height: 1.2; margin-bottom: 2rem; ${
              isBrutalist
                ? "text-transform: uppercase; letter-spacing: -0.02em;"
                : isRetro
                ? "text-transform: uppercase;"
                : ""
            }">
              ${
                data.articles[0].link
                  ? `<a href="${data.articles[0].link}" target="_blank" style="color: var(--color-text); text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${data.articles[0].title}</a>`
                  : data.articles[0].title
              }
            </h2>
            <div style="display: flex; gap: 2rem; align-items: center; margin-bottom: 2.5rem; font-size: ${
              isBrutalist ? "1rem" : "0.9375rem"
            }; color: var(--color-text-secondary);">
              <span style="font-weight: ${
                isBrutalist ? "900" : "600"
              }; color: var(--color-accent); ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }">${data.articles[0].publication || "Publication"}</span>
              ${
                data.articles[0].date
                  ? `<span>${data.articles[0].date}</span>`
                  : ""
              }
            </div>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
              isBrutalist ? "1.25rem" : "1.375rem"
            }; line-height: 1.9; color: var(--color-text); margin-bottom: 2.5rem; font-weight: ${
              isElegant ? "300" : "400"
            };">
              ${data.articles[0].excerpt || ""}
            </p>
            ${
              data.articles[0].link
                ? `
            <a href="${
              data.articles[0].link
            }" target="_blank" style="display: inline-block; padding: ${
                    isBrutalist ? "1.25rem 3rem" : "1rem 2.5rem"
                  }; border: ${
                    isBrutalist ? "4px" : "2px"
                  } solid var(--color-text); color: var(--color-text); text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: ${
                    isBrutalist ? "1rem" : "0.9375rem"
                  }; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.3s; ${
                    isBrutalist
                      ? "box-shadow: 4px 4px 0 var(--color-text);"
                      : isNeumorphism
                      ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                      : isGlassmorphism
                      ? "backdrop-filter: blur(10px); border-radius: 8px;"
                      : ""
                  }" onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                      : `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                  }" onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='4px 4px 0 var(--color-text)'`
                      : `this.style.background='transparent'; this.style.color='var(--color-text)'`
                  }">
              Read Full Article →
            </a>
            `
                : ""
            }
          </article>
        </div>
      </section>
      `
          : ""
      }

      <!-- Recent Articles Grid -->
      ${
        data.articles && data.articles.length > 1
          ? `
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isBrutalist
                ? "inherit"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "400"
            }; margin-bottom: 1.5rem; ${
              isBrutalist
                ? "text-transform: uppercase;"
                : isRetro
                ? "text-transform: uppercase;"
                : ""
            }">
              Recent Work
            </h2>
            <div style="width: ${isBrutalist ? "80px" : "60px"}; height: ${
              isBrutalist ? "6px" : "2px"
            }; background: var(--color-accent); margin: 0 auto; ${
              isBrutalist ? "border: 2px solid var(--color-text);" : ""
            }"></div>
          </div>
          
          <div class="articles-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4rem;">
            ${data.articles
              .slice(1)
              .map(
                (article) => `
              <article style="padding-bottom: 3rem; border-bottom: ${
                isBrutalist ? "3px" : "1px"
              } solid var(--color-border);">
                <div style="font-size: ${
                  isBrutalist ? "0.875rem" : "0.75rem"
                }; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent); margin-bottom: 1rem; font-weight: ${
                  isBrutalist ? "900" : "700"
                };">
                  ${article.publication || "Publication"}
                </div>
                <h3 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isBrutalist
                    ? "inherit"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "serif"
                }; font-size: ${
                  isBrutalist ? "1.5rem" : "1.875rem"
                }; font-weight: ${
                  isBrutalist ? "900" : isRetro ? "700" : "400"
                }; line-height: 1.3; margin-bottom: 1rem; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                  ${
                    article.link
                      ? `<a href="${article.link}" target="_blank" style="color: var(--color-text); text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">${article.title}</a>`
                      : article.title
                  }
                </h3>
                ${
                  article.date
                    ? `
                <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                  ${article.date}
                </div>
                `
                    : ""
                }
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: ${
                  isBrutalist ? "1rem" : "1.0625rem"
                }; line-height: 1.75; color: var(--color-text-secondary); margin-bottom: 1.5rem; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
                  ${article.excerpt || ""}
                </p>
                ${
                  article.link
                    ? `
                <a href="${article.link}" target="_blank" style="font-size: ${
                        isBrutalist ? "0.875rem" : "0.875rem"
                      }; font-weight: ${
                        isBrutalist ? "900" : "600"
                      }; color: var(--color-text); text-decoration: none; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--color-text); padding-bottom: 2px; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'; this.style.borderColor='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'; this.style.borderColor='var(--color-text)'">
                  Read More
                </a>
                `
                    : ""
                }
              </article>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.books && data.books.length > 0
          ? `
      <!-- Books Section -->
      <section style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isBrutalist
                ? "inherit"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "400"
            }; margin-bottom: 1.5rem; ${
              isBrutalist
                ? "text-transform: uppercase;"
                : isRetro
                ? "text-transform: uppercase;"
                : ""
            }">
              Books
            </h2>
            <div style="width: ${isBrutalist ? "80px" : "60px"}; height: ${
              isBrutalist ? "6px" : "2px"
            }; background: var(--color-accent); margin: 0 auto; ${
              isBrutalist ? "border: 2px solid var(--color-text);" : ""
            }"></div>
          </div>
          
          <div class="books-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 4rem;">
            ${data.books
              .map(
                (book) => `
              <div style="text-align: center;">
                <div style="width: 200px; height: 300px; background: ${
                  isGradient
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isRetro
                    ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
                    : "linear-gradient(135deg, var(--color-text), var(--color-accent))"
                }; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                    : "box-shadow: var(--shadow-lg);"
                } position: relative;">
                  <div style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isBrutalist
                      ? "inherit"
                      : "serif"
                  }; font-size: ${isBrutalist ? "1.25rem" : "1.5rem"}; color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; font-weight: ${
                  isBrutalist ? "900" : "400"
                }; padding: 2rem; text-align: center; line-height: 1.3; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                    ${book.title}
                  </div>
                </div>
                <h3 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isBrutalist
                    ? "inherit"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "serif"
                }; font-size: ${
                  isBrutalist ? "1.5rem" : "1.875rem"
                }; font-weight: ${
                  isBrutalist ? "900" : isRetro ? "700" : "400"
                }; margin-bottom: 0.5rem; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                  ${book.title}
                </h3>
                ${
                  book.year
                    ? `
                <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                  ${book.year}
                </div>
                `
                    : ""
                }
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1rem; line-height: 1.7; color: var(--color-text-secondary); margin-bottom: 2rem; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
                  ${book.description || ""}
                </p>
                ${
                  book.link
                    ? `
                <a href="${
                  book.link
                }" target="_blank" style="display: inline-block; padding: ${
                        isBrutalist ? "1rem 2.5rem" : "0.875rem 2rem"
                      }; border: ${
                        isBrutalist ? "4px" : "2px"
                      } solid var(--color-text); color: var(--color-text); text-decoration: none; font-weight: ${
                        isBrutalist ? "900" : "600"
                      }; font-size: 0.875rem; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.3s; ${
                        isBrutalist
                          ? "box-shadow: 4px 4px 0 var(--color-text);"
                          : isNeumorphism
                          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : ""
                      }" onmouseover="${
                        isBrutalist
                          ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                          : `this.style.background='var(--color-text)'; this.style.color='var(--color-bg)'`
                      }" onmouseout="${
                        isBrutalist
                          ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='4px 4px 0 var(--color-text)'`
                          : `this.style.background='transparent'; this.style.color='var(--color-text)'`
                      }">
                  Learn More
                </a>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- About Section with Pull Quote Style -->
      <section style="padding: 8rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 2rem;">
          <div style="border-left: ${
            isBrutalist ? "8px" : "4px"
          } solid var(--color-accent); padding-left: ${
        isBrutalist ? "2rem" : "3rem"
      }; margin-bottom: 4rem;">
            <p style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isBrutalist
                ? "inherit"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: ${
        isBrutalist ? "1.75rem" : "2rem"
      }; line-height: 1.5; ${
        isElegant ? "font-style: italic;" : ""
      } color: var(--color-text); font-weight: ${
        isBrutalist ? "700" : "normal"
      };">
              "${
                data.bio ||
                "Passionate about telling stories and sharing ideas through writing."
              }"
            </p>
          </div>
          
          ${
            data.specialties
              ? `
          <div style="margin-top: 4rem;">
            <h3 style="font-size: ${
              isBrutalist ? "1rem" : "0.875rem"
            }; text-transform: uppercase; letter-spacing: ${
                  isBrutalist ? "0.2em" : "0.15em"
                }; margin-bottom: 2rem; color: var(--color-text-secondary); font-weight: ${
                  isBrutalist ? "900" : "700"
                }; text-align: center;">
              Areas of Expertise
            </h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: center;">
              ${data.specialties
                .split(",")
                .map(
                  (specialty) => `
                <div style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isBrutalist
                    ? "inherit"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "serif"
                }; font-size: ${
                    isBrutalist ? "1rem" : "1.25rem"
                  }; color: var(--color-text); ${
                    isElegant ? "font-style: italic;" : ""
                  } font-weight: ${isBrutalist ? "700" : "normal"};">
                  ${specialty.trim()}
                </div>
              `
                )
                .join(
                  '<div style="color: var(--color-text-secondary);">·</div>'
                )}
            </div>
          </div>
          `
              : ""
          }
        </div>
      </section>

      <!-- Contact Section -->
      <section style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; text-align: center; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-border);"
          : "border-top: 1px solid var(--color-border);"
      }">
        <div class="container" style="max-width: 700px; margin: 0 auto; padding: 0 2rem;">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "400"
      }; margin-bottom: 2rem; ${
        isBrutalist
          ? "text-transform: uppercase;"
          : isRetro
          ? "text-transform: uppercase;"
          : ""
      }">
            Get in Touch
          </h2>
          <div style="width: ${isBrutalist ? "80px" : "60px"}; height: ${
        isBrutalist ? "6px" : "2px"
      }; background: var(--color-accent); margin: 0 auto 3rem; ${
        isBrutalist ? "border: 2px solid var(--color-text);" : ""
      }"></div>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Available for commissions, collaborations, and editorial projects
          </p>
          ${
            data.email
              ? `
          <a href="mailto:${
            data.email
          }" style="display: inline-block; padding: ${
                  isBrutalist ? "1.5rem 3.5rem" : "1.25rem 3rem"
                }; background: ${
                  isBrutalist
                    ? "var(--color-accent)"
                    : isGradient
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : isRetro
                    ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                    : "var(--color-text)"
                }; color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; text-decoration: none; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; font-size: 1rem; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 3rem; transition: ${
                  isBrutalist ? "all 0.2s" : "transform 0.2s"
                }; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                    : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-2px)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0)'`
                }">
            ${data.email}
          </a>
          `
              : ""
          }
          
          <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; margin-top: 3rem; padding-top: 3rem; border-top: 1px solid var(--color-border);">
            ${
              data.twitter
                ? `
            <a href="https://twitter.com/${data.twitter.replace(
              "@",
              ""
            )}" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.9375rem; transition: color 0.2s; ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              Twitter
            </a>
            `
                : ""
            }
            ${
              data.medium
                ? `
            <a href="${
              data.medium
            }" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.9375rem; transition: color 0.2s; ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              Medium
            </a>
            `
                : ""
            }
            ${
              data.linkedin
                ? `
            <a href="${
              data.linkedin
            }" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.9375rem; transition: color 0.2s; ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              LinkedIn
            </a>
            `
                : ""
            }
            ${
              data.website
                ? `
            <a href="${
              data.website
            }" target="_blank" style="color: var(--color-text); text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.9375rem; transition: color 0.2s; ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              Website
            </a>
            `
                : ""
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-border);"
          : "border-top: 1px solid var(--color-border);"
      }">
        <div class="container">
          <p style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : "serif"
          }; ${isElegant ? "font-style: italic;" : ""} font-weight: ${
        isBrutalist ? "700" : "normal"
      };">© 2024 ${data.writerName || "Writer"}. All rights reserved.</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          .articles-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .books-grid {
            grid-template-columns: 1fr !important;
          }
          section[style*="padding: 8rem"] {
            padding: 5rem 0 !important;
          }
          section[style*="padding: 6rem"] {
            padding: 4rem 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
        }
      </style>
    `;
    },
  }),
  wedding: new Template("wedding", {
    name: "Wedding",
    description: "Elegant wedding invitation and details",
    category: "Events",
    image: "wedding",
    defaultTheme: "elegant",
    fields: {
      coupleName: {
        type: "text",
        default: "Sarah & Michael",
        label: "Couple Names",
        required: true,
      },
      weddingDate: {
        type: "text",
        default: "June 15, 2025",
        label: "Wedding Date",
        required: true,
      },
      ceremony: {
        type: "textarea",
        default: "4:00 PM\nGarden Terrace\n123 Elm Street, Beverly Hills",
        label: "Ceremony Details",
        required: true,
      },
      reception: {
        type: "textarea",
        default: "6:00 PM\nGrand Ballroom\nThe Plaza Hotel",
        label: "Reception Details",
        required: true,
      },
      story: {
        type: "textarea",
        default: "",
        label: "Your Story",
        required: false,
      },
      rsvpLink: {
        type: "url",
        default: "",
        label: "RSVP Link",
        required: false,
      },
      registryLink: {
        type: "url",
        default: "",
        label: "Registry Link",
        required: false,
      },
      hotelInfo: {
        type: "textarea",
        default: "",
        label: "Hotel Information",
        required: false,
      },
      dressCode: {
        type: "text",
        default: "Formal Attire",
        label: "Dress Code",
        required: false,
      },
      schedule: {
        type: "group",
        label: "Schedule",
        itemLabel: "Event",
        min: 0,
        max: 10,
        fields: {
          time: { type: "text", label: "Time", default: "" },
          event: { type: "text", label: "Event Name", default: "" },
          location: { type: "text", label: "Location", default: "" },
        },
        default: [
          { time: "4:00 PM", event: "Ceremony", location: "Garden Terrace" },
          { time: "5:00 PM", event: "Cocktail Hour", location: "Courtyard" },
          { time: "6:00 PM", event: "Reception", location: "Grand Ballroom" },
          { time: "7:00 PM", event: "Dinner", location: "Grand Ballroom" },
          { time: "9:00 PM", event: "Dancing", location: "Grand Ballroom" },
        ],
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Decorative Header -->
      ${
        !isBrutalist
          ? `<div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--color-border), transparent);"></div>`
          : ""
      }
      
      <header style="padding: 2rem 0; background: var(--color-bg); text-align: center; ${
        isBrutalist ? "border-bottom: 4px solid var(--color-text);" : ""
      }">
        <div class="container">
          <div style="display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
            <div style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isBrutalist
                ? "inherit"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: ${
        isBrutalist ? "1.25rem" : "1rem"
      }; letter-spacing: ${
        isBrutalist ? "0.15em" : "0.3em"
      }; text-transform: uppercase; color: ${
        isBrutalist ? "var(--color-accent)" : "var(--color-text-secondary)"
      }; font-weight: ${isBrutalist ? "900" : "normal"};">
              Wedding Celebration
            </div>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                : ""
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </div>
        </div>
      </header>

      <!-- Hero Invitation -->
      <section style="padding: ${
        isBrutalist ? "6rem 0" : "8rem 0"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
          : "var(--color-bg)"
      }; text-align: center; position: relative;">
        <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 2rem;">
          <!-- Decorative flourish -->
          ${
            !isBrutalist && !isRetro
              ? `<div style="font-size: 3rem; color: var(--color-accent); margin-bottom: 2rem; opacity: 0.6;">❦</div>`
              : ""
          }
          
          <div style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: ${isBrutalist ? "0.875rem" : "1rem"}; letter-spacing: ${
        isBrutalist ? "0.15em" : "0.2em"
      }; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 2rem; font-weight: ${
        isBrutalist ? "900" : "normal"
      };">
            Together with their families
          </div>
          
          <h1 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: clamp(${isBrutalist ? "2.5rem" : "3.5rem"}, 9vw, ${
        isBrutalist ? "5rem" : "6rem"
      }); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "400"
      }; margin-bottom: 2rem; line-height: 1.2; ${
        isElegant ? "font-style: italic;" : ""
      } ${
        isBrutalist
          ? "text-transform: uppercase; letter-spacing: -0.02em;"
          : isRetro
          ? "text-transform: uppercase;"
          : ""
      }">
            ${data.coupleName || "Sarah & Michael"}
          </h1>
          
          <div style="width: ${isBrutalist ? "120px" : "80px"}; height: ${
        isBrutalist ? "6px" : "1px"
      }; background: var(--color-accent); margin: 3rem auto; ${
        isBrutalist ? "border: 2px solid var(--color-text);" : ""
      }"></div>
          
          <div style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: ${isBrutalist ? "0.875rem" : "1rem"}; letter-spacing: ${
        isBrutalist ? "0.1em" : "0.15em"
      }; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: ${
        isBrutalist ? "900" : "normal"
      };">
            Request the honor of your presence
          </div>
          
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: ${isBrutalist ? "2rem" : "2.5rem"}; font-weight: ${
        isBrutalist ? "900" : "400"
      }; color: var(--color-accent); margin-bottom: 3rem; ${
        isBrutalist ? "text-transform: uppercase;" : ""
      }">
            ${data.weddingDate || "June 15, 2025"}
          </div>
          
          ${
            data.rsvpLink
              ? `
          <a href="${
            data.rsvpLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "1.5rem 4rem" : "1.25rem 3.5rem"
                }; border: ${
                  isBrutalist ? "4px" : "2px"
                } solid var(--color-accent); color: var(--color-accent); text-decoration: none; font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isBrutalist
                    ? "inherit"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "serif"
                }; font-size: ${
                  isBrutalist ? "1.125rem" : "1rem"
                }; letter-spacing: ${
                  isBrutalist ? "0.1em" : "0.15em"
                }; text-transform: uppercase; transition: all 0.3s; margin-top: 1rem; font-weight: ${
                  isBrutalist ? "900" : "normal"
                }; ${
                  isBrutalist
                    ? "box-shadow: 6px 6px 0 var(--color-accent);"
                    : isNeumorphism
                    ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: 8px;"
                    : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-accent)'`
                    : `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-accent)'`
                    : `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                }">
            RSVP
          </a>
          `
              : ""
          }
          
          ${
            !isBrutalist && !isRetro
              ? `<div style="font-size: 2rem; color: var(--color-accent); margin-top: 3rem; opacity: 0.6;">❦</div>`
              : ""
          }
        </div>
      </section>

      <!-- Event Details -->
      <section style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 5rem;">
            ${
              !isBrutalist && !isRetro
                ? `<div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1rem; opacity: 0.6;">✦</div>`
                : ""
            }
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isBrutalist
                ? "inherit"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "400"
      }; margin-bottom: 1rem; ${
        isBrutalist
          ? "text-transform: uppercase;"
          : isRetro
          ? "text-transform: uppercase;"
          : ""
      }">
              Celebration Details
            </h2>
            <div style="width: ${isBrutalist ? "80px" : "60px"}; height: ${
        isBrutalist ? "6px" : "1px"
      }; background: var(--color-accent); margin: 0 auto; ${
        isBrutalist ? "border: 2px solid var(--color-text);" : ""
      }"></div>
          </div>
          
          <div class="event-details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 4rem;">
            <!-- Ceremony -->
            <div style="text-align: center; padding: 3rem; background: ${
              isGlassmorphism ? "rgba(255, 255, 255, 0.05)" : "var(--color-bg)"
            }; ${
        isBrutalist
          ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px;"
          : "border: 1px solid var(--color-border);"
      }">
              ${
                !isBrutalist
                  ? `<div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1.5rem;">💍</div>`
                  : ""
              }
              <h3 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: ${
        isBrutalist ? "1.25rem" : "1.125rem"
      }; text-transform: uppercase; letter-spacing: 0.1em; color: ${
        isBrutalist ? "var(--color-accent)" : "var(--color-text-secondary)"
      }; margin-bottom: 1.5rem; font-weight: ${
        isBrutalist ? "900" : "normal"
      };">
                Ceremony
              </h3>
              <div style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: 1.125rem; line-height: 1.8; color: var(--color-text); white-space: pre-line; font-weight: ${
        isBrutalist ? "600" : "normal"
      };">
                ${data.ceremony || "4:00 PM\nGarden Terrace"}
              </div>
            </div>
            
            <!-- Reception -->
            <div style="text-align: center; padding: 3rem; background: ${
              isGlassmorphism ? "rgba(255, 255, 255, 0.05)" : "var(--color-bg)"
            }; ${
        isBrutalist
          ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px;"
          : "border: 1px solid var(--color-border);"
      }">
              ${
                !isBrutalist
                  ? `<div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1.5rem;">🥂</div>`
                  : ""
              }
              <h3 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: ${
        isBrutalist ? "1.25rem" : "1.125rem"
      }; text-transform: uppercase; letter-spacing: 0.1em; color: ${
        isBrutalist ? "var(--color-accent)" : "var(--color-text-secondary)"
      }; margin-bottom: 1.5rem; font-weight: ${
        isBrutalist ? "900" : "normal"
      };">
                Reception
              </h3>
              <div style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: 1.125rem; line-height: 1.8; color: var(--color-text); white-space: pre-line; font-weight: ${
        isBrutalist ? "600" : "normal"
      };">
                ${data.reception || "6:00 PM\nGrand Ballroom"}
              </div>
            </div>
          </div>
        </div>
      </section>

      ${
        data.schedule && data.schedule.length > 0
          ? `
      <!-- Schedule -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isBrutalist
                ? "inherit"
                : isRetro
                ? "Space Mono, monospace"
                : "serif"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "400"
            }; margin-bottom: 1rem; ${
              isBrutalist
                ? "text-transform: uppercase;"
                : isRetro
                ? "text-transform: uppercase;"
                : ""
            }">
              Schedule of Events
            </h2>
            <div style="width: ${isBrutalist ? "80px" : "60px"}; height: ${
              isBrutalist ? "6px" : "1px"
            }; background: var(--color-accent); margin: 0 auto; ${
              isBrutalist ? "border: 2px solid var(--color-text);" : ""
            }"></div>
          </div>
          
          <div class="schedule-timeline" style="position: relative;">
            ${
              !isBrutalist
                ? `<div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--color-border);"></div>`
                : ""
            }
            
            ${data.schedule
              .map(
                (item, i) => `
              <div style="position: relative; padding: 2rem 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div style="text-align: ${i % 2 === 0 ? "right" : "left"}; ${
                  i % 2 === 0 ? "order: 1;" : "order: 2;"
                }">
                  <div style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isBrutalist
                      ? "inherit"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "serif"
                  }; font-size: ${
                  isBrutalist ? "1.25rem" : "1.5rem"
                }; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; color: var(--color-accent); margin-bottom: 0.5rem;">
                    ${item.time || ""}
                  </div>
                  <div style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isBrutalist
                      ? "inherit"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "serif"
                  }; font-size: ${
                  isBrutalist ? "1.125rem" : "1.25rem"
                }; font-weight: ${
                  isBrutalist ? "700" : "400"
                }; margin-bottom: 0.5rem; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                    ${item.event || ""}
                  </div>
                  <div style="font-family: ${
                    isElegant
                      ? "Lato, sans-serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 0.9375rem; color: var(--color-text-secondary); ${
                  isElegant ? "font-style: italic;" : ""
                }">
                    ${item.location || ""}
                  </div>
                </div>
                <div style="${i % 2 === 0 ? "order: 2;" : "order: 1;"}"></div>
                ${
                  !isBrutalist
                    ? `<div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: var(--color-accent); border: 3px solid var(--color-bg); border-radius: 50%;"></div>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.story
          ? `
      <!-- Our Story -->
      <section style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="max-width: 700px; text-align: center; margin: 0 auto; padding: 0 2rem;">
          ${
            !isBrutalist && !isRetro
              ? `<div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1.5rem; opacity: 0.6;">♥</div>`
              : ""
          }
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "400"
            }; margin-bottom: 3rem; ${
              isBrutalist
                ? "text-transform: uppercase;"
                : isRetro
                ? "text-transform: uppercase;"
                : ""
            }">
            Our Story
          </h2>
          <div style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: ${
              isBrutalist ? "1.125rem" : "1.1875rem"
            }; line-height: 1.9; color: var(--color-text); ${
              isElegant ? "font-style: italic;" : ""
            } white-space: pre-line; font-weight: ${
              isElegant ? "300" : "normal"
            };">
            ${data.story}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Additional Information -->
      ${
        data.dressCode || data.hotelInfo || data.registryLink
          ? `
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 2rem;">
          <div class="info-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
            
            ${
              data.dressCode
                ? `
            <div style="text-align: center; padding: 2.5rem; ${
              isBrutalist
                ? "border: 3px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                : isNeumorphism
                ? "box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.9); border-radius: 16px;"
                : isGlassmorphism
                ? "backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;"
                : "border: 1px solid var(--color-border);"
            }">
              ${
                !isBrutalist
                  ? `<div style="font-size: 1.75rem; margin-bottom: 1rem;">👔</div>`
                  : ""
              }
              <h3 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: ${
                    isBrutalist ? "1rem" : "1.125rem"
                  }; text-transform: uppercase; letter-spacing: 0.1em; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)"
                  }; margin-bottom: 1rem; font-weight: ${
                    isBrutalist ? "900" : "normal"
                  };">
                Dress Code
              </h3>
              <div style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: 1.125rem; color: var(--color-text); font-weight: ${
                    isBrutalist ? "700" : "normal"
                  };">
                ${data.dressCode}
              </div>
            </div>
            `
                : ""
            }
            
            ${
              data.hotelInfo
                ? `
            <div style="text-align: center; padding: 2.5rem; ${
              isBrutalist
                ? "border: 3px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                : isNeumorphism
                ? "box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.9); border-radius: 16px;"
                : isGlassmorphism
                ? "backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;"
                : "border: 1px solid var(--color-border);"
            }">
              ${
                !isBrutalist
                  ? `<div style="font-size: 1.75rem; margin-bottom: 1rem;">🏨</div>`
                  : ""
              }
              <h3 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: ${
                    isBrutalist ? "1rem" : "1.125rem"
                  }; text-transform: uppercase; letter-spacing: 0.1em; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)"
                  }; margin-bottom: 1rem; font-weight: ${
                    isBrutalist ? "900" : "normal"
                  };">
                Accommodations
              </h3>
              <div style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: 1rem; line-height: 1.7; color: var(--color-text); white-space: pre-line; font-weight: ${
                    isElegant ? "300" : "normal"
                  };">
                ${data.hotelInfo}
              </div>
            </div>
            `
                : ""
            }
            
            ${
              data.registryLink
                ? `
            <div style="text-align: center; padding: 2.5rem; ${
              isBrutalist
                ? "border: 3px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                : isNeumorphism
                ? "box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.9); border-radius: 16px;"
                : isGlassmorphism
                ? "backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px;"
                : "border: 1px solid var(--color-border);"
            }">
              ${
                !isBrutalist
                  ? `<div style="font-size: 1.75rem; margin-bottom: 1rem;">🎁</div>`
                  : ""
              }
              <h3 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isBrutalist
                  ? "inherit"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "serif"
              }; font-size: ${
                    isBrutalist ? "1rem" : "1.125rem"
                  }; text-transform: uppercase; letter-spacing: 0.1em; color: ${
                    isBrutalist
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)"
                  }; margin-bottom: 1.5rem; font-weight: ${
                    isBrutalist ? "900" : "normal"
                  };">
                Registry
              </h3>
              <a href="${
                data.registryLink
              }" target="_blank" style="display: inline-block; padding: ${
                    isBrutalist ? "1rem 2.5rem" : "0.875rem 2rem"
                  }; border: ${
                    isBrutalist ? "3px" : "2px"
                  } solid var(--color-accent); color: var(--color-accent); text-decoration: none; font-family: ${
                    isElegant
                      ? "Lato, sans-serif"
                      : isBrutalist
                      ? "inherit"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "serif"
                  }; font-size: ${
                    isBrutalist ? "1rem" : "0.9375rem"
                  }; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.3s; font-weight: ${
                    isBrutalist ? "900" : "normal"
                  }; ${
                    isBrutalist
                      ? "box-shadow: 4px 4px 0 var(--color-accent);"
                      : isNeumorphism
                      ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                      : ""
                  }" onmouseover="${
                    isBrutalist
                      ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-accent)'`
                      : `this.style.background='var(--color-accent)'; this.style.color='var(--color-bg)'`
                  }" onmouseout="${
                    isBrutalist
                      ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='4px 4px 0 var(--color-accent)'`
                      : `this.style.background='transparent'; this.style.color='var(--color-accent)'`
                  }">
                View Registry
              </a>
            </div>
            `
                : ""
            }
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Final CTA -->
      <section style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; text-align: center;">
        <div class="container" style="max-width: 600px; margin: 0 auto; padding: 0 2rem;">
          ${
            !isBrutalist && !isRetro
              ? `<div style="font-size: 2.5rem; color: var(--color-accent); margin-bottom: 2rem; opacity: 0.6;">❦</div>`
              : ""
          }
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "400"
      }; margin-bottom: 2rem; line-height: 1.4; ${
        isBrutalist
          ? "text-transform: uppercase;"
          : isRetro
          ? "text-transform: uppercase;"
          : ""
      }">
            We can't wait to celebrate with you
          </h2>
          ${
            data.rsvpLink
              ? `
          <a href="${
            data.rsvpLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "1.5rem 4rem" : "1.25rem 3.5rem"
                }; background: ${
                  isBrutalist
                    ? "var(--color-accent)"
                    : isGradient
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : isRetro
                    ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
                    : "var(--color-accent)"
                }; color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; text-decoration: none; font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isBrutalist
                    ? "inherit"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "serif"
                }; font-size: ${
                  isBrutalist ? "1.125rem" : "1rem"
                }; letter-spacing: 0.15em; text-transform: uppercase; transition: all 0.3s; margin-top: 2rem; font-weight: ${
                  isBrutalist ? "900" : "normal"
                }; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                    : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.15)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                }">
            RSVP Now
          </a>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-border);"
          : "border-top: 1px solid var(--color-border);"
      }">
        <div class="container">
          <p style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isBrutalist
              ? "inherit"
              : isRetro
              ? "Space Mono, monospace"
              : "serif"
          }; ${isElegant ? "font-style: italic;" : ""} font-weight: ${
        isBrutalist ? "700" : "normal"
      };">#${
        data.coupleName?.replace(/\s/g, "").replace(/&/g, "") || "Wedding2025"
      }</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          .schedule-timeline > div > div {
            order: 1 !important;
            text-align: center !important;
            grid-column: 1 / -1;
          }
          .schedule-timeline > div > div[style*="position: absolute"] {
            display: none;
          }
          .schedule-timeline {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .event-details-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .info-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          section[style*="padding: 8rem"] {
            padding: 5rem 0 !important;
          }
          section[style*="padding: 6rem"] {
            padding: 4rem 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
        }
      </style>
    `;
    },
  }),
  conference: new Template("conference", {
    name: "Conference",
    description: "Professional conference or event website",
    category: "Events",
    defaultTheme: "minimal",
    image: "conference",
    fields: {
      conferenceName: {
        type: "text",
        default: "INNOVATE 2025",
        label: "Conference Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "The Future of Innovation",
        label: "Tagline",
        required: true,
      },
      date: {
        type: "text",
        default: "March 15-17, 2025",
        label: "Date",
        required: true,
      },
      location: {
        type: "text",
        default: "San Francisco, CA",
        label: "Location",
        required: true,
      },
      description: {
        type: "textarea",
        default:
          "Join industry leaders and innovators for three days of inspiring talks, networking, and hands-on workshops.",
        label: "Event Description",
        required: true,
      },
      registerLink: {
        type: "url",
        default: "",
        label: "Registration Link",
        required: true,
      },
      speakers: {
        type: "group",
        label: "Speakers",
        itemLabel: "Speaker",
        min: 0,
        max: 20,
        fields: {
          name: { type: "text", label: "Name", default: "" },
          title: { type: "text", label: "Title", default: "" },
          bio: { type: "textarea", label: "Bio", default: "" },
          imageUrl: { type: "url", label: "Image URL", default: "" },
        },
        default: [
          {
            name: "Sarah Chen",
            title: "CEO, TechCorp",
            bio: "Leading innovation in AI and machine learning for over a decade.",
            imageUrl: "",
          },
          {
            name: "Marcus Johnson",
            title: "CTO, StartupLab",
            bio: "Building the future of cloud infrastructure and distributed systems.",
            imageUrl: "",
          },
          {
            name: "Emily Rodriguez",
            title: "Head of Design, Creative Inc",
            bio: "Pioneering user-centered design approaches for modern applications.",
            imageUrl: "",
          },
        ],
      },
      schedule: {
        type: "group",
        label: "Schedule",
        itemLabel: "Day",
        min: 0,
        max: 10,
        fields: {
          day: { type: "text", label: "Day Name", default: "" },
          date: { type: "text", label: "Date", default: "" },
          sessions: {
            type: "group",
            label: "Sessions",
            itemLabel: "Session",
            min: 0,
            max: 20,
            fields: {
              time: { type: "text", label: "Time", default: "" },
              title: { type: "text", label: "Session Title", default: "" },
              speaker: { type: "text", label: "Speaker", default: "" },
              description: {
                type: "textarea",
                label: "Description",
                default: "",
              },
            },
            default: [],
          },
        },
        default: [
          {
            day: "Day 1",
            date: "March 15",
            sessions: [
              {
                time: "9:00 AM",
                title: "Opening Keynote",
                speaker: "Sarah Chen",
                description:
                  "The future of artificial intelligence and its impact on business",
              },
              {
                time: "11:00 AM",
                title: "Workshop: Cloud Architecture",
                speaker: "Marcus Johnson",
                description:
                  "Hands-on session building scalable cloud solutions",
              },
              {
                time: "2:00 PM",
                title: "Panel Discussion",
                speaker: "Industry Leaders",
                description: "Navigating the changing technology landscape",
              },
            ],
          },
        ],
      },
      sponsors: {
        type: "text",
        default: "Google, Microsoft, Amazon, Meta",
        label: "Sponsors (comma separated)",
        required: false,
      },
      venue: {
        type: "text",
        default: "Moscone Center",
        label: "Venue Name",
        required: false,
      },
      venueAddress: {
        type: "textarea",
        default: "747 Howard Street\nSan Francisco, CA 94103",
        label: "Venue Address",
        required: false,
      },
      price: {
        type: "text",
        default: "$299",
        label: "Ticket Price",
        required: false,
      },
      contact: {
        type: "email",
        default: "",
        label: "Contact Email",
        required: false,
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Header with CTA -->
      <header style="background: ${
        isGlassmorphism ? "rgba(255, 255, 255, 0.1)" : "var(--color-bg)"
      }; ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-accent);"
          : isRetro
          ? "border-bottom: 3px solid var(--color-accent);"
          : "border-bottom: 3px solid var(--color-accent);"
      } position: sticky; top: 0; z-index: 100; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : "box-shadow: var(--shadow-sm);"
      }">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 0;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: ${isBrutalist ? "2rem" : "1.75rem"}; font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; letter-spacing: ${isBrutalist ? "-0.03em" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
                ${data.conferenceName || "CONFERENCE 2025"}
              </div>
              <div style="padding: ${
                isBrutalist ? "0.5rem 1rem" : "0.375rem 0.875rem"
              }; background: var(--color-accent); color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; font-weight: ${isBrutalist ? "900" : "700"}; font-size: ${
        isBrutalist ? "0.875rem" : "0.75rem"
      }; letter-spacing: 0.05em; ${
        isBrutalist
          ? "border: 3px solid var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm);"
          : "border-radius: var(--radius-sm);"
      }">
                ${data.date?.split(",")[0] || "2025"}
              </div>
            </div>
            <div style="display: flex; gap: 2rem; align-items: center;">
              <nav class="desktop-nav" style="display: flex; gap: 2rem;">
                <a href="#speakers" style="text-decoration: none; color: var(--color-text); font-weight: ${
                  isBrutalist ? "900" : "600"
                }; font-size: 0.9375rem; ${
        isBrutalist ? "text-transform: uppercase;" : ""
      } transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Speakers</a>
                <a href="#schedule" style="text-decoration: none; color: var(--color-text); font-weight: ${
                  isBrutalist ? "900" : "600"
                }; font-size: 0.9375rem; ${
        isBrutalist ? "text-transform: uppercase;" : ""
      } transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Schedule</a>
                <a href="#venue" style="text-decoration: none; color: var(--color-text); font-weight: ${
                  isBrutalist ? "900" : "600"
                }; font-size: 0.9375rem; ${
        isBrutalist ? "text-transform: uppercase;" : ""
      } transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Venue</a>
              </nav>
              ${
                data.registerLink
                  ? `
              <a href="${data.registerLink}" target="_blank" style="padding: ${
                      isBrutalist ? "1rem 2.5rem" : "0.875rem 2rem"
                    }; background: var(--color-accent); color: ${
                      isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; font-size: 0.9375rem; ${
                      isBrutalist
                        ? "border: 3px solid var(--color-text); box-shadow: 4px 4px 0 var(--color-text);"
                        : isNeumorphism
                        ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm);"
                        : "border-radius: var(--radius-sm);"
                    } transition: ${
                      isBrutalist ? "all 0.2s" : "transform 0.2s"
                    }; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-2px, -2px)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                        : `this.style.transform='translateY(-2px)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='4px 4px 0 var(--color-text)'`
                        : `this.style.transform='translateY(0)'`
                    }">
                Register Now
              </a>
              `
                  : ""
              }
              <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
                isNeumorphism
                  ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                  : ""
              }">
                <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
                <span class="theme-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: ${
        isBrutalist ? "6rem 0 4rem" : "8rem 0 6rem"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))"
          : isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : "linear-gradient(135deg, var(--color-surface), var(--color-bg))"
      }; position: relative; overflow: hidden;">
        ${
          !isBrutalist && !isRetro
            ? `<div style="position: absolute; top: 0; right: 0; width: 50%; height: 100%; background: var(--color-accent); opacity: 0.03; transform: skewX(-10deg) translateX(30%);"></div>`
            : ""
        }
        <div class="container" style="max-width: 1200px; position: relative; margin: 0 auto; padding: 0 2rem;">
          <div style="max-width: 800px;">
            <div style="display: inline-flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: ${
              isBrutalist ? "1rem 2rem" : "0.75rem 1.5rem"
            }; background: ${
        isGlassmorphism ? "rgba(255, 255, 255, 0.1)" : "var(--color-bg)"
      }; border: ${isBrutalist ? "3px" : "2px"} solid var(--color-accent); ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-full);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border-radius: var(--radius-full);"
          : "border-radius: var(--radius-full);"
      }">
              <div style="width: 8px; height: 8px; background: var(--color-accent); border-radius: 50%; animation: pulse 2s infinite;"></div>
              <span style="font-weight: ${
                isBrutalist ? "900" : "700"
              }; font-size: 0.9375rem; text-transform: uppercase; letter-spacing: 0.05em;">
                ${data.date || "Coming Soon"} • ${
        data.location || "Location TBA"
      }
              </span>
            </div>
            
            <h1 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(${isBrutalist ? "2.5rem" : "3rem"}, 8vw, ${
        isBrutalist ? "4.5rem" : "5.5rem"
      }); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 2rem; letter-spacing: ${
        isBrutalist ? "-0.05em" : "-0.04em"
      }; line-height: 1.05; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              ${data.conferenceName || "Conference 2025"}
            </h1>
            
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist ? "1.5rem" : "1.75rem"
      }; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.5; font-weight: ${
        isBrutalist ? "700" : "600"
      };">
              ${data.tagline || "The Future of Innovation"}
            </p>
            
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist ? "1.125rem" : "1.125rem"
      }; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7; max-width: 650px; font-weight: ${
        isElegant ? "300" : "normal"
      };">
              ${
                data.description ||
                "Join industry leaders and innovators for three days of inspiring talks, networking, and hands-on workshops."
              }
            </p>
            
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${
                data.registerLink
                  ? `
              <a href="${data.registerLink}" target="_blank" style="padding: ${
                      isBrutalist ? "1.5rem 3.5rem" : "1.25rem 3rem"
                    }; background: var(--color-accent); color: ${
                      isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; font-size: 1.125rem; ${
                      isBrutalist
                        ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                        : isNeumorphism
                        ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm);"
                        : "border-radius: var(--radius-sm); box-shadow: var(--shadow-md);"
                    } transition: all 0.2s; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                        : `this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                        : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'`
                    }">
                Register Now ${data.price ? `• ${data.price}` : ""}
              </a>
              `
                  : ""
              }
              ${
                data.contact
                  ? `
              <a href="mailto:${data.contact}" style="padding: ${
                      isBrutalist ? "1.5rem 3.5rem" : "1.25rem 3rem"
                    }; background: ${
                      isGlassmorphism
                        ? "rgba(255, 255, 255, 0.05)"
                        : "var(--color-bg)"
                    }; color: var(--color-text); border: ${
                      isBrutalist ? "4px" : "2px"
                    } solid var(--color-border); text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; font-size: 1.125rem; ${
                      isBrutalist
                        ? ""
                        : isNeumorphism
                        ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm);"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px); border-radius: var(--radius-sm);"
                        : "border-radius: var(--radius-sm);"
                    } transition: all 0.2s; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }" onmouseover="this.style.borderColor='var(--color-text)'" onmouseout="this.style.borderColor='var(--color-border)'">
                Contact Us
              </a>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Bar -->
      <section style="background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "var(--color-accent)"
          : "var(--color-text)"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; padding: 3rem 0;">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
            <div>
              <div style="font-size: ${
                isBrutalist ? "4rem" : "3.5rem"
              }; font-weight: 900; margin-bottom: 0.5rem;">3</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; font-weight: ${
                isBrutalist ? "900" : "normal"
              };">Days</div>
            </div>
            <div>
              <div style="font-size: ${
                isBrutalist ? "4rem" : "3.5rem"
              }; font-weight: 900; margin-bottom: 0.5rem;">50+</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; font-weight: ${
                isBrutalist ? "900" : "normal"
              };">Speakers</div>
            </div>
            <div>
              <div style="font-size: ${
                isBrutalist ? "4rem" : "3.5rem"
              }; font-weight: 900; margin-bottom: 0.5rem;">100+</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; font-weight: ${
                isBrutalist ? "900" : "normal"
              };">Sessions</div>
            </div>
            <div>
              <div style="font-size: ${
                isBrutalist ? "4rem" : "3.5rem"
              }; font-weight: 900; margin-bottom: 0.5rem;">2000+</div>
              <div style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.9; font-weight: ${
                isBrutalist ? "900" : "normal"
              };">Attendees</div>
            </div>
          </div>
        </div>
      </section>

      ${
        data.speakers && data.speakers.length > 0
          ? `
      <!-- Speakers -->
      <section id="speakers" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <div style="display: inline-block; padding: ${
              isBrutalist ? "0.75rem 1.5rem" : "0.5rem 1.25rem"
            }; background: var(--color-accent); color: ${
              isBrutalist ? "var(--color-text)" : "var(--color-bg)"
            }; font-weight: ${
              isBrutalist ? "900" : "700"
            }; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; ${
              isBrutalist
                ? "border: 3px solid var(--color-text);"
                : isNeumorphism
                ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-full);"
                : "border-radius: var(--radius-full);"
            } margin-bottom: 1.5rem;">
              Featured Speakers
            </div>
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "900"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.03em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Learn from the Best
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.25rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto; font-weight: ${
              isElegant ? "300" : "normal"
            };">
              Industry leaders and innovators sharing their insights
            </p>
          </div>
          
          <div class="speakers-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
            ${data.speakers
              .map(
                (speaker) => `
              <div class="speaker-card" style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; border: ${
                  isBrutalist ? "4px" : "2px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } overflow: hidden; transition: all 0.3s;">
                ${
                  speaker.imageUrl
                    ? `
                <div style="aspect-ratio: 1/1; overflow: hidden; background: var(--color-border);">
                  <img src="${speaker.imageUrl}" alt="${speaker.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                `
                    : `
                <div style="aspect-ratio: 1/1; background: ${
                  isGradient
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isRetro
                    ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
                    : "linear-gradient(135deg, var(--color-accent), var(--color-text))"
                }; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: ${
                        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                      }; opacity: 0.8; font-weight: 900;">
                  ${speaker.name?.charAt(0) || "?"}
                </div>
                `
                }
                <div style="padding: 2rem;">
                  <h3 style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 1.5rem; font-weight: ${
                  isBrutalist ? "900" : "800"
                }; margin-bottom: 0.5rem; letter-spacing: -0.01em; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                    ${speaker.name || "Speaker Name"}
                  </h3>
                  <div style="font-size: 0.9375rem; color: var(--color-accent); font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; margin-bottom: 1rem;">
                    ${speaker.title || "Title"}
                  </div>
                  <p style="font-family: ${
                    isElegant
                      ? "Lato, sans-serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 0.9375rem; line-height: 1.6; color: var(--color-text-secondary); font-weight: ${
                  isElegant ? "300" : "normal"
                };">
                    ${speaker.bio || ""}
                  </p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.schedule && data.schedule.length > 0
          ? `
      <!-- Schedule -->
      <section id="schedule" style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <div style="display: inline-block; padding: ${
              isBrutalist ? "0.75rem 1.5rem" : "0.5rem 1.25rem"
            }; background: var(--color-accent); color: ${
              isBrutalist ? "var(--color-text)" : "var(--color-bg)"
            }; font-weight: ${
              isBrutalist ? "900" : "700"
            }; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; ${
              isBrutalist
                ? "border: 3px solid var(--color-text);"
                : isNeumorphism
                ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-full);"
                : "border-radius: var(--radius-full);"
            } margin-bottom: 1.5rem;">
              Event Schedule
            </div>
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "900"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.03em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Three Days of Innovation
            </h2>
          </div>
          
          ${data.schedule
            .map(
              (day, i) => `
            <div style="margin-bottom: 4rem;">
              <div style="background: var(--color-accent); color: ${
                isBrutalist ? "var(--color-text)" : "var(--color-bg)"
              }; padding: ${isBrutalist ? "2rem 2.5rem" : "1.5rem 2rem"}; ${
                isBrutalist
                  ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                  : isNeumorphism
                  ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                  : "border-radius: var(--radius-md);"
              } margin-bottom: 2rem;">
                <div style="font-size: ${
                  isBrutalist ? "2rem" : "1.75rem"
                }; font-weight: 900; margin-bottom: 0.25rem; ${
                isBrutalist ? "text-transform: uppercase;" : ""
              }">
                  ${day.day || `Day ${i + 1}`}
                </div>
                <div style="font-size: 1.125rem; opacity: 0.95; font-weight: ${
                  isBrutalist ? "900" : "600"
                };">
                  ${day.date || ""}
                </div>
              </div>
              
              <div style="display: grid; gap: 1rem;">
                ${(day.sessions || [])
                  .map(
                    (session) => `
                  <div style="background: ${
                    isGlassmorphism
                      ? "rgba(255, 255, 255, 0.05)"
                      : "var(--color-bg)"
                  }; border: ${
                      isBrutalist ? "3px" : "2px"
                    } solid var(--color-border); ${
                      isBrutalist
                        ? ""
                        : isNeumorphism
                        ? "box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px); border-radius: var(--radius-md);"
                        : "border-radius: var(--radius-md);"
                    } padding: 2rem; display: flex; gap: 2rem; align-items: start; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)'">
                    <div style="min-width: 120px;">
                      <div style="font-size: 1.5rem; font-weight: 900; color: var(--color-accent);">
                        ${session.time || ""}
                      </div>
                    </div>
                    <div style="flex: 1;">
                      <h3 style="font-family: ${
                        isElegant
                          ? "Playfair Display, serif"
                          : isRetro
                          ? "Space Mono, monospace"
                          : "inherit"
                      }; font-size: 1.375rem; font-weight: ${
                      isBrutalist ? "900" : "800"
                    }; margin-bottom: 0.5rem; letter-spacing: -0.01em; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }">
                        ${session.title || ""}
                      </h3>
                      ${
                        session.speaker
                          ? `
                      <div style="font-family: ${
                        isElegant
                          ? "Lato, sans-serif"
                          : isRetro
                          ? "Space Mono, monospace"
                          : "inherit"
                      }; font-size: 1rem; color: var(--color-text-secondary); font-weight: ${
                              isBrutalist ? "700" : "600"
                            };">
                        ${session.speaker}
                      </div>
                      `
                          : ""
                      }
                      ${
                        session.description
                          ? `
                      <p style="font-family: ${
                        isElegant
                          ? "Lato, sans-serif"
                          : isRetro
                          ? "Space Mono, monospace"
                          : "inherit"
                      }; font-size: 0.9375rem; line-height: 1.6; color: var(--color-text-secondary); margin-top: 1rem; font-weight: ${
                              isElegant ? "300" : "normal"
                            };">
                        ${session.description}
                      </p>
                      `
                          : ""
                      }
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
      `
          : ""
      }

      <!-- Venue -->
      <section id="venue" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div class="venue-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div>
              <div style="display: inline-block; padding: ${
                isBrutalist ? "0.75rem 1.5rem" : "0.5rem 1.25rem"
              }; background: var(--color-accent); color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; font-weight: ${
        isBrutalist ? "900" : "700"
      }; font-size: 0.875rem; letter-spacing: 0.1em; text-transform: uppercase; ${
        isBrutalist
          ? "border: 3px solid var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-full);"
          : "border-radius: var(--radius-full);"
      } margin-bottom: 2rem;">
                Venue
              </div>
              <h2 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 2rem; letter-spacing: ${
        isBrutalist ? "-0.04em" : "-0.03em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
                ${data.venue || data.location || "Conference Center"}
              </h2>
              ${
                data.venueAddress
                  ? `
              <div style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: 1.125rem; line-height: 1.8; color: var(--color-text-secondary); margin-bottom: 2rem; white-space: pre-line; font-weight: ${
                      isElegant ? "300" : "normal"
                    };">
                ${data.venueAddress}
              </div>
              `
                  : ""
              }
              <div style="font-size: 1rem; color: var(--color-text-secondary); line-height: 1.7;">
                ${data.location || ""}
              </div>
            </div>
            <div style="aspect-ratio: 4/3; background: ${
              isGradient
                ? "linear-gradient(135deg, #667eea, #764ba2)"
                : isBrutalist
                ? "var(--color-accent)"
                : isRetro
                ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
                : "linear-gradient(135deg, var(--color-accent), var(--color-text))"
            }; ${
        isBrutalist
          ? "border: 4px solid var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
          : "border-radius: var(--radius-lg);"
      } display: flex; align-items: center; justify-content: center; font-size: 5rem; color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; opacity: 0.8;">
              📍
            </div>
          </div>
        </div>
      </section>

      ${
        data.sponsors
          ? `
      <!-- Sponsors -->
      <section style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; text-align: center;">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <h2 style="font-size: ${
            isBrutalist ? "1.75rem" : "1.5rem"
          }; font-weight: ${
              isBrutalist ? "900" : "800"
            }; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 3rem; color: var(--color-text-secondary);">
            Our Sponsors
          </h2>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3rem; align-items: center;">
            ${data.sponsors
              .split(",")
              .map(
                (sponsor) => `
              <div style="font-size: ${
                isBrutalist ? "2rem" : "1.75rem"
              }; font-weight: 900; color: var(--color-text); opacity: 0.6; transition: opacity 0.2s; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">
                ${sponsor.trim()}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Final CTA -->
      <section style="padding: 8rem 0; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
          : "var(--color-accent)"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; text-align: center;">
        <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 2rem;">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 2rem; letter-spacing: ${
        isBrutalist ? "-0.05em" : "-0.03em"
      }; line-height: 1.1; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            Don't Miss Out
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.375rem; margin-bottom: 3rem; opacity: 0.95; line-height: 1.6; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Join us for ${
              data.conferenceName || "the conference"
            } and connect with industry leaders
          </p>
          ${
            data.registerLink
              ? `
          <a href="${
            data.registerLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "2rem 4.5rem" : "1.5rem 4rem"
                }; background: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; color: ${
                  isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
                }; text-decoration: none; font-weight: ${
                  isBrutalist ? "900" : "900"
                }; font-size: 1.25rem; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm);"
                    : "border-radius: var(--radius-sm); box-shadow: 0 8px 24px rgba(0,0,0,0.2);"
                } transition: all 0.2s; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-6px, -6px)'; this.style.boxShadow='14px 14px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.3)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)'`
                }">
            Register Today ${data.price ? `• ${data.price}` : ""}
          </a>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-border);"
          : "border-top: 3px solid var(--color-border);"
      }">
        <div class="container">
          <p style="font-weight: ${isBrutalist ? "900" : "700"};">© 2024 ${
        data.conferenceName || "Conference"
      }. ${data.contact ? `Contact: ${data.contact}` : ""}</p>
        </div>
      </footer>

      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .speaker-card:hover {
          transform: ${
            isBrutalist ? "translate(-4px, -4px)" : "translateY(-4px)"
          };
          border-color: var(--color-accent);
          ${
            isBrutalist
              ? "box-shadow: 8px 8px 0 var(--color-text);"
              : "box-shadow: var(--shadow-lg);"
          }
        }
        
        @media (max-width: 968px) {
          .desktop-nav { display: none !important; }
          .venue-grid {
            grid-template-columns: 1fr !important;
          }
          .speakers-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section[style*="padding: 8rem"] {
            padding: 5rem 0 !important;
          }
          section[style*="padding: 6rem"] {
            padding: 4rem 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      </style>
    `;
    },
  }),
  tutoring: new Template("tutoring", {
    name: "Tutoring Services",
    description: "Professional tutoring and education services website",
    category: "Business",
    defaultTheme: "elegant",
    image: "tutoring",
    fields: {
      businessName: {
        type: "text",
        default: "Elite Tutoring",
        label: "Business Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "Empowering Students to Achieve Excellence",
        label: "Tagline",
        required: true,
      },
      about: {
        type: "textarea",
        default:
          "We provide personalized, one-on-one tutoring services designed to help students build confidence, master challenging concepts, and achieve their academic goals. Our approach combines proven teaching methods with individualized attention to ensure every student succeeds.",
        label: "About",
        required: true,
      },
      subjects: {
        type: "group",
        label: "Subjects Offered",
        itemLabel: "Subject",
        min: 1,
        max: 15,
        fields: {
          name: { type: "text", label: "Subject Name", default: "" },
          grades: { type: "text", label: "Grade Levels", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            name: "Mathematics",
            grades: "K-12, College",
            description: "Algebra, Geometry, Calculus, Statistics, and more",
          },
          {
            name: "English & Writing",
            grades: "K-12",
            description:
              "Reading comprehension, essay writing, grammar, literature analysis",
          },
          {
            name: "Science",
            grades: "6-12, College",
            description: "Biology, Chemistry, Physics, Environmental Science",
          },
        ],
      },
      qualifications: {
        type: "textarea",
        default:
          "Master's Degree in Education\nCertified Teacher with 10+ years experience\nSpecialized training in learning strategies\nExperience with students of all learning styles",
        label: "Qualifications",
        required: false,
      },
      testimonials: {
        type: "group",
        label: "Testimonials",
        itemLabel: "Testimonial",
        min: 0,
        max: 10,
        fields: {
          name: { type: "text", label: "Name", default: "" },
          student: { type: "text", label: "Student Name", default: "" },
          text: { type: "textarea", label: "Testimonial Text", default: "" },
          rating: { type: "text", label: "Rating (1-5)", default: "5" },
        },
        default: [
          {
            name: "Jennifer M.",
            student: "Sarah (10th grade)",
            text: "Our daughter's math grade improved from a C to an A in just one semester. The personalized attention made all the difference.",
            rating: "5",
          },
          {
            name: "Michael R.",
            student: "David (8th grade)",
            text: "Excellent tutor who really knows how to explain complex concepts in ways that make sense. Highly recommend!",
            rating: "5",
          },
        ],
      },
      pricing: {
        type: "text",
        default: "Starting at $60/hour • Package deals available",
        label: "Pricing Info",
        required: false,
      },
      contact: {
        type: "email",
        default: "hello@elitetutoring.com",
        label: "Contact Email",
        required: true,
      },
      phone: {
        type: "tel",
        default: "",
        label: "Phone Number",
        required: false,
      },
      bookingLink: {
        type: "url",
        default: "",
        label: "Booking/Scheduling Link",
        required: false,
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: ${
        isGlassmorphism ? "rgba(255, 255, 255, 0.1)" : "var(--color-bg)"
      }; ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-border);"
          : "border-bottom: 2px solid var(--color-border);"
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : ""
      }">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem;">
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${isBrutalist ? "1.75rem" : "1.5rem"}; font-weight: ${
        isBrutalist ? "900" : "900"
      }; color: var(--color-accent); ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            ${data.businessName || "Tutoring Services"}
          </div>
          <nav class="desktop-nav" style="display: flex; gap: 2rem; align-items: center; font-weight: ${
            isBrutalist ? "900" : "600"
          };">
            <a href="#subjects" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Subjects</a>
            <a href="#about" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">About</a>
            <a href="#testimonials" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Reviews</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                : ""
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: ${
        isBrutalist ? "6rem 0 4rem" : "8rem 0 6rem"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))"
          : isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : "linear-gradient(135deg, var(--color-surface), var(--color-bg))"
      }};">
        <div class="container" style="text-align: center; max-width: 900px; margin: 0 auto; padding: 0 2rem;">
          <h1 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${isBrutalist ? "2rem" : "2.5rem"}, 6vw, ${
        isBrutalist ? "3.5rem" : "4.5rem"
      }); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 1.5rem; letter-spacing: ${
        isBrutalist ? "-0.04em" : "-0.02em"
      }; line-height: 1.1; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            ${data.businessName || "Professional Tutoring Services"}
          </h1>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist ? "1.25rem" : "1.5rem"
      }; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.5; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            ${data.tagline || "Personalized Learning for Academic Excellence"}
          </p>
          ${
            data.bookingLink
              ? `
          <a href="${
            data.bookingLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "1.5rem 3.5rem" : "1.25rem 3rem"
                }; background: var(--color-accent); color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; text-decoration: none; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; font-size: 1.125rem; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                } transition: all 0.2s; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'`
                }">
            Book a Session
          </a>
          `
              : ""
          }
          ${
            data.pricing
              ? `
          <div style="margin-top: 2rem; font-size: 1.125rem; color: var(--color-text-secondary); font-weight: ${
            isBrutalist ? "700" : "600"
          };">
            ${data.pricing}
          </div>
          `
              : ""
          }
        </div>
      </section>

      ${
        data.subjects && data.subjects.length > 0
          ? `
      <!-- Subjects -->
      <section id="subjects" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "900"
            }; margin-bottom: 1rem; ${
              isBrutalist || isRetro ? "text-transform: uppercase;" : ""
            }">
              Subjects We Teach
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.125rem; color: var(--color-text-secondary); font-weight: ${
              isElegant ? "300" : "normal"
            };">
              Expert instruction across multiple subjects and grade levels
            </p>
          </div>
          
          <div class="subjects-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${data.subjects
              .map(
                (subject) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; border: ${
                  isBrutalist ? "4px" : "2px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } padding: 2rem; transition: all 0.2s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                }">
                <h3 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.5rem; font-weight: ${
                  isBrutalist ? "900" : "800"
                }; margin-bottom: 0.5rem; color: var(--color-accent); ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                  ${subject.name || "Subject"}
                </h3>
                ${
                  subject.grades
                    ? `
                <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: ${
                  isBrutalist ? "900" : "600"
                }; margin-bottom: 1rem; ${
                        isBrutalist ? "text-transform: uppercase;" : ""
                      }">
                  Grades: ${subject.grades}
                </div>
                `
                    : ""
                }
                ${
                  subject.description
                    ? `
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; color: var(--color-text-secondary); line-height: 1.6; font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                  ${subject.description}
                </p>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- About -->
      <section id="about" style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 1rem; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              About Our Tutoring
            </h2>
          </div>
          
          ${
            data.about
              ? `
          <div style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.125rem; line-height: 1.8; color: var(--color-text); margin-bottom: 3rem; white-space: pre-line; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
            ${data.about}
          </div>
          `
              : ""
          }
          
          ${
            data.qualifications
              ? `
          <div style="background: ${
            isGlassmorphism
              ? "rgba(255, 255, 255, 0.05)"
              : isNeumorphism
              ? "var(--color-bg)"
              : "var(--color-bg)"
          }; border-left: ${
                  isBrutalist ? "8px" : "4px"
                } solid var(--color-accent); ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); border-left: 8px solid var(--color-accent);"
                    : isNeumorphism
                    ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md);"
                } padding: 2rem;">
            <h3 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.25rem; font-weight: ${
                  isBrutalist ? "900" : "800"
                }; margin-bottom: 1rem; color: var(--color-accent); ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
              Qualifications & Experience
            </h3>
            <div style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; color: var(--color-text-secondary); line-height: 1.8; white-space: pre-line; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
              ${data.qualifications}
            </div>
          </div>
          `
              : ""
          }
        </div>
      </section>

      ${
        data.testimonials && data.testimonials.length > 0
          ? `
      <!-- Testimonials -->
      <section id="testimonials" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "900"
            }; margin-bottom: 1rem; ${
              isBrutalist || isRetro ? "text-transform: uppercase;" : ""
            }">
              What Parents & Students Say
            </h2>
          </div>
          
          <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${data.testimonials
              .map(
                (testimonial) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; border: ${
                  isBrutalist ? "4px" : "2px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } padding: 2rem;">
                ${
                  testimonial.rating
                    ? `
                <div style="font-size: 1.25rem; margin-bottom: 1rem; color: var(--color-accent);">
                  ${"★".repeat(parseInt(testimonial.rating) || 5)}
                </div>
                `
                    : ""
                }
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1rem; line-height: 1.6; color: var(--color-text); margin-bottom: 1.5rem; ${
                  isElegant ? "font-style: italic;" : ""
                } font-weight: ${isElegant ? "300" : "normal"};">
                  "${testimonial.text || ""}"
                </p>
                <div style="font-weight: ${
                  isBrutalist ? "900" : "700"
                }; color: var(--color-text);">
                  ${testimonial.name || "Parent"}
                </div>
                ${
                  testimonial.student
                    ? `
                <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
                  Parent of ${testimonial.student}
                </div>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Contact -->
      <section id="contact" style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="max-width: 700px; text-align: center; margin: 0 auto; padding: 0 2rem;">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 1rem; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            Ready to Get Started?
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Contact us today to schedule your first tutoring session
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; margin-bottom: 3rem;">
            ${
              data.contact
                ? `
            <a href="mailto:${
              data.contact
            }" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: var(--color-text); text-decoration: none; transition: color 0.2s; font-weight: ${
                    isBrutalist ? "900" : "600"
                  };" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">✉</span>
              ${data.contact}
            </a>
            `
                : ""
            }
            ${
              data.phone
                ? `
            <a href="tel:${
              data.phone
            }" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: var(--color-text); text-decoration: none; transition: color 0.2s; font-weight: ${
                    isBrutalist ? "900" : "600"
                  };" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">☎</span>
              ${data.phone}
            </a>
            `
                : ""
            }
          </div>
          
          ${
            data.bookingLink
              ? `
          <a href="${
            data.bookingLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "1.5rem 3.5rem" : "1.25rem 3rem"
                }; background: var(--color-accent); color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; text-decoration: none; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; font-size: 1.125rem; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                } transition: all 0.2s; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'`
                }">
            Schedule a Free Consultation
          </a>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-border);"
          : "border-top: 2px solid var(--color-border);"
      }">
        <div class="container">
          <p style="font-weight: ${isBrutalist ? "900" : "normal"};">© 2024 ${
        data.businessName || "Tutoring Services"
      }. All rights reserved.</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .subjects-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          section[style*="padding: 8rem"] {
            padding: 5rem 0 !important;
          }
          section[style*="padding: 6rem"] {
            padding: 4rem 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
        }
      </style>
    `;
    },
  }),
  realestate: new Template("realestate", {
    name: "Real Estate Agent",
    description: "Professional real estate agent and property listings website",
    category: "Business",
    defaultTheme: "glassmorphism",
    image: "real-estate",
    fields: {
      agentName: {
        type: "text",
        default: "Sarah Mitchell",
        label: "Agent Name",
        required: true,
      },
      title: {
        type: "text",
        default: "Luxury Real Estate Specialist",
        label: "Professional Title",
        required: false,
      },
      tagline: {
        type: "text",
        default: "Finding Your Dream Home in Los Angeles",
        label: "Tagline",
        required: true,
      },
      bio: {
        type: "textarea",
        default:
          "With over 15 years of experience in luxury real estate, I specialize in helping clients find their perfect property. My deep knowledge of the local market, combined with personalized service, ensures a smooth and successful transaction every time.",
        label: "About",
        required: true,
      },
      serviceArea: {
        type: "text",
        default: "Greater Los Angeles Area",
        label: "Service Area",
        required: false,
      },
      featuredListings: {
        type: "group",
        label: "Featured Properties",
        itemLabel: "Property",
        min: 0,
        max: 20,
        fields: {
          address: { type: "text", label: "Address", default: "" },
          price: { type: "text", label: "Price", default: "" },
          beds: { type: "text", label: "Bedrooms", default: "" },
          baths: { type: "text", label: "Bathrooms", default: "" },
          sqft: { type: "text", label: "Square Feet", default: "" },
          type: { type: "text", label: "Property Type", default: "" },
          status: { type: "text", label: "Status", default: "For Sale" },
          imageUrl: { type: "url", label: "Image URL", default: "" },
        },
        default: [
          {
            address: "123 Ocean Avenue",
            price: "$1,250,000",
            beds: "4",
            baths: "3",
            sqft: "2,800",
            type: "Single Family Home",
            status: "For Sale",
            imageUrl: "",
          },
          {
            address: "456 Sunset Boulevard",
            price: "$895,000",
            beds: "3",
            baths: "2",
            sqft: "2,100",
            type: "Condo",
            status: "For Sale",
            imageUrl: "",
          },
        ],
      },
      services: {
        type: "group",
        label: "Services",
        itemLabel: "Service",
        min: 0,
        max: 10,
        fields: {
          name: { type: "text", label: "Service Name", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            name: "Buyer Representation",
            description:
              "Expert guidance through every step of the home buying process",
          },
          {
            name: "Seller Representation",
            description:
              "Strategic marketing and negotiation to get top dollar for your home",
          },
          {
            name: "Market Analysis",
            description:
              "Comprehensive market insights and property valuations",
          },
        ],
      },
      testimonials: {
        type: "group",
        label: "Client Testimonials",
        itemLabel: "Testimonial",
        min: 0,
        max: 15,
        fields: {
          name: { type: "text", label: "Client Name", default: "" },
          text: { type: "textarea", label: "Testimonial", default: "" },
          property: { type: "text", label: "Property Details", default: "" },
          rating: { type: "text", label: "Rating (1-5)", default: "5" },
        },
        default: [
          {
            name: "John & Mary Smith",
            text: "Sarah helped us find our dream home! Her expertise and dedication made the entire process smooth and stress-free.",
            property: "Bought 4BR Single Family Home",
            rating: "5",
          },
          {
            name: "Michael Chen",
            text: "Professional, knowledgeable, and always responsive. Sarah sold our condo in just 10 days!",
            property: "Sold 2BR Condo",
            rating: "5",
          },
        ],
      },
      stats: {
        type: "group",
        label: "Statistics",
        itemLabel: "Stat",
        min: 0,
        max: 6,
        fields: {
          number: { type: "text", label: "Number", default: "" },
          label: { type: "text", label: "Label", default: "" },
        },
        default: [
          { number: "150+", label: "Homes Sold" },
          { number: "$50M+", label: "Sales Volume" },
          { number: "15", label: "Years Experience" },
          { number: "98%", label: "Client Satisfaction" },
        ],
      },
      license: {
        type: "text",
        default: "DRE #01234567",
        label: "License Number",
        required: false,
      },
      brokerage: {
        type: "text",
        default: "Luxury Realty Group",
        label: "Brokerage",
        required: false,
      },
      contact: {
        type: "email",
        default: "sarah@luxuryrealty.com",
        label: "Email",
        required: true,
      },
      phone: {
        type: "tel",
        default: "(555) 123-4567",
        label: "Phone",
        required: false,
      },
      calendlyLink: {
        type: "url",
        default: "",
        label: "Consultation/Booking Link",
        required: false,
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "rgba(var(--color-bg-rgb, 255, 255, 255), 0.85)"
      }; ${
        isGlassmorphism || (!isBrutalist && !isNeumorphism)
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : ""
      } ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-border);"
          : "border-bottom: 1px solid var(--color-border);"
      } ${
        isNeumorphism
          ? "box-shadow: 0 4px 6px rgba(163, 177, 198, 0.3), 0 -1px 3px rgba(255, 255, 255, 0.5);"
          : ""
      }">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem;">
          <div>
            <div style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${isBrutalist ? "1.75rem" : "1.5rem"}; font-weight: ${
        isBrutalist ? "900" : "900"
      }; color: var(--color-accent); letter-spacing: -0.02em; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              ${data.agentName || "Real Estate Agent"}
            </div>
            ${
              data.brokerage
                ? `
            <div style="font-size: 0.75rem; color: var(--color-text-secondary); font-weight: ${
              isBrutalist ? "900" : "600"
            }; margin-top: 0.25rem; ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }">
              ${data.brokerage}
            </div>
            `
                : ""
            }
          </div>
          <nav class="desktop-nav" style="display: flex; gap: 2rem; align-items: center; font-weight: ${
            isBrutalist ? "900" : "600"
          }; font-size: 0.9375rem;">
            <a href="#listings" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Listings</a>
            <a href="#services" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Services</a>
            <a href="#testimonials" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Testimonials</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                : ""
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: ${
        isBrutalist ? "6rem 0 4rem" : "8rem 0 6rem"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))"
          : "linear-gradient(135deg, var(--color-surface), var(--color-bg))"
      }; position: relative; overflow: hidden;">
        ${
          !isBrutalist && !isRetro
            ? `<div style="position: absolute; inset: 0; opacity: 0.03; background-image: radial-gradient(circle, var(--color-text) 1px, transparent 1px); background-size: 30px 30px;"></div>`
            : ""
        }
        <div class="container" style="position: relative; z-index: 1; margin: 0 auto; padding: 0 2rem;">
          <div style="max-width: 800px;">
            ${
              data.title
                ? `
            <div style="display: inline-block; padding: ${
              isBrutalist ? "0.75rem 1.25rem" : "0.5rem 1rem"
            }; background: var(--color-accent); color: ${
                    isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                  }; font-weight: ${isBrutalist ? "900" : "700"}; font-size: ${
                    isBrutalist ? "1rem" : "0.875rem"
                  }; ${
                    isBrutalist
                      ? "border: 3px solid var(--color-text);"
                      : isNeumorphism
                      ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-full);"
                      : "border-radius: var(--radius-full);"
                  } margin-bottom: 1.5rem; ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }">
              ${data.title}
            </div>
            `
                : ""
            }
            <h1 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(${isBrutalist ? "2.5rem" : "3rem"}, 7vw, ${
        isBrutalist ? "4rem" : "5rem"
      }); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 1.5rem; letter-spacing: ${
        isBrutalist ? "-0.04em" : "-0.03em"
      }; line-height: 1.1; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              ${data.agentName || "Your Real Estate Expert"}
            </h1>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist ? "1.25rem" : "1.5rem"
      }; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.4; font-weight: ${
        isElegant ? "300" : "normal"
      };">
              ${data.tagline || "Helping You Find the Perfect Property"}
            </p>
            ${
              data.serviceArea
                ? `
            <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; font-weight: ${
              isBrutalist ? "900" : "600"
            };">
              <span style="font-size: 1.5rem;">📍</span>
              <span>Serving ${data.serviceArea}</span>
            </div>
            `
                : ""
            }
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${
                data.calendlyLink
                  ? `
              <a href="${
                data.calendlyLink
              }" target="_blank" style="display: inline-block; padding: ${
                      isBrutalist ? "1.5rem 3rem" : "1.25rem 2.5rem"
                    }; background: var(--color-accent); color: ${
                      isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; font-size: 1.0625rem; ${
                      isBrutalist
                        ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                        : isNeumorphism
                        ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                        : "border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                    } transition: all 0.2s; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                        : `this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                        : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'`
                    }">
                Schedule Consultation
              </a>
              `
                  : ""
              }
              ${
                data.phone
                  ? `
              <a href="tel:${
                data.phone
              }" style="display: inline-block; padding: ${
                      isBrutalist ? "1.5rem 3rem" : "1.25rem 2.5rem"
                    }; background: ${
                      isGlassmorphism
                        ? "rgba(255, 255, 255, 0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : "var(--color-surface)"
                    }; color: var(--color-text); text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; font-size: 1.0625rem; ${
                      isBrutalist
                        ? "border: 4px solid var(--color-border);"
                        : isNeumorphism
                        ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px); border: 2px solid var(--color-border); border-radius: var(--radius-md);"
                        : "border-radius: var(--radius-md); border: 2px solid var(--color-border);"
                    } transition: all 0.2s; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-2px, -2px)'; this.style.boxShadow='4px 4px 0 var(--color-border)'`
                        : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                        : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                    }">
                📞 ${data.phone}
              </a>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      </section>

      ${
        data.stats && data.stats.length > 0
          ? `
      <!-- Stats -->
      <section style="padding: 4rem 0; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(90deg, var(--color-accent), #b537f2)"
          : "var(--color-accent)"
      }; color: ${isBrutalist ? "var(--color-text)" : "var(--color-bg)"};">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
            ${data.stats
              .map(
                (stat) => `
              <div>
                <div style="font-size: ${
                  isBrutalist ? "3.5rem" : "3rem"
                }; font-weight: 900; margin-bottom: 0.5rem; opacity: 0.95;">
                  ${stat.number || "0"}
                </div>
                <div style="font-size: 1rem; opacity: 0.9; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${stat.label || ""}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.featuredListings && data.featuredListings.length > 0
          ? `
      <!-- Featured Listings -->
      <section id="listings" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "900"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Featured Properties
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.125rem; color: var(--color-text-secondary); font-weight: ${
              isElegant ? "300" : "normal"
            };">
              Explore my current listings and recent sales
            </p>
          </div>
          
          <div class="listings-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem;">
            ${data.featuredListings
              .map(
                (property) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; border: ${
                  isBrutalist ? "4px" : "1px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);"
                } overflow: hidden; transition: all 0.3s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-6px, -6px)'; this.style.boxShadow='12px 12px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.transform='translateY(-8px)'; this.style.boxShadow='var(--shadow-lg)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'`
                }">
                ${
                  property.imageUrl
                    ? `
                <div style="aspect-ratio: 4/3; overflow: hidden;">
                  <img src="${property.imageUrl}" alt="${property.address}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                `
                    : `
                <div style="aspect-ratio: 4/3; background: ${
                  isGradient
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isRetro
                    ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
                    : "linear-gradient(135deg, var(--color-accent), var(--color-text))"
                }; display: flex; align-items: center; justify-content: center; font-size: 5rem; position: relative; color: ${
                        isBrutalist ? "var(--color-text)" : "white"
                      };">
                  🏡
                  ${
                    property.status
                      ? `
                  <div style="position: absolute; top: 1rem; right: 1rem; background: ${
                    property.status.toLowerCase().includes("sold")
                      ? "#22c55e"
                      : "var(--color-accent)"
                  }; color: white; padding: ${
                          isBrutalist ? "0.75rem 1.25rem" : "0.5rem 1rem"
                        }; font-size: ${
                          isBrutalist ? "0.875rem" : "0.75rem"
                        }; font-weight: ${isBrutalist ? "900" : "800"}; ${
                          isBrutalist
                            ? "border: 2px solid white;"
                            : "border-radius: var(--radius-sm);"
                        } text-transform: uppercase; letter-spacing: 0.05em;">
                    ${property.status}
                  </div>
                  `
                      : ""
                  }
                </div>
                `
                }
                <div style="padding: 1.5rem;">
                  ${
                    property.price
                      ? `
                  <div style="font-size: ${
                    isBrutalist ? "2rem" : "1.75rem"
                  }; font-weight: 900; color: var(--color-accent); margin-bottom: 0.75rem;">
                    ${property.price}
                  </div>
                  `
                      : ""
                  }
                  ${
                    property.address
                      ? `
                  <div style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 1.125rem; font-weight: ${
                          isBrutalist ? "900" : "700"
                        }; margin-bottom: 1rem; color: var(--color-text); ${
                          isBrutalist ? "text-transform: uppercase;" : ""
                        }">
                    ${property.address}
                  </div>
                  `
                      : ""
                  }
                  ${
                    property.type
                      ? `
                  <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; margin-bottom: 1rem; ${
                          isBrutalist ? "text-transform: uppercase;" : ""
                        }">
                    ${property.type}
                  </div>
                  `
                      : ""
                  }
                  <div style="display: flex; gap: 1.5rem; padding-top: 1rem; border-top: ${
                    isBrutalist ? "2px" : "1px"
                  } solid var(--color-border); font-size: 0.9375rem; color: var(--color-text-secondary); font-weight: ${
                  isBrutalist ? "900" : "600"
                }; flex-wrap: wrap;">
                    ${
                      property.beds
                        ? `<span>🛏 ${property.beds} beds</span>`
                        : ""
                    }
                    ${
                      property.baths
                        ? `<span>🚿 ${property.baths} baths</span>`
                        : ""
                    }
                    ${
                      property.sqft
                        ? `<span>📐 ${property.sqft} sqft</span>`
                        : ""
                    }
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.services && data.services.length > 0
          ? `
      <!-- Services -->
      <section id="services" style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "900"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              How I Can Help
            </h2>
          </div>
          
          <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
            ${data.services
              .map(
                (service) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-bg)"
              }; border: ${
                  isBrutalist ? "4px" : "1px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } padding: 2rem; text-align: center; transition: all 0.2s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                }">
                <h3 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.375rem; font-weight: ${
                  isBrutalist ? "900" : "800"
                }; margin-bottom: 1rem; letter-spacing: -0.01em; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                  ${service.name || "Service"}
                </h3>
                ${
                  service.description
                    ? `
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; color: var(--color-text-secondary); line-height: 1.6; font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                  ${service.description}
                </p>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- About -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; letter-spacing: ${isBrutalist ? "-0.04em" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              About Me
            </h2>
          </div>
          
          ${
            data.bio
              ? `
          <div style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.125rem; line-height: 1.8; color: var(--color-text); margin-bottom: 2rem; white-space: pre-line; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
            ${data.bio}
          </div>
          `
              : ""
          }
          
          ${
            data.license || data.brokerage
              ? `
          <div style="display: flex; gap: 2rem; justify-content: center; padding: 1.5rem; background: ${
            isGlassmorphism
              ? "rgba(255, 255, 255, 0.05)"
              : isNeumorphism
              ? "var(--color-bg)"
              : "var(--color-surface)"
          }; ${
                  isBrutalist
                    ? "border: 3px solid var(--color-border);"
                    : isNeumorphism
                    ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md);"
                } font-size: 0.9375rem; color: var(--color-text-secondary); font-weight: ${
                  isBrutalist ? "900" : "600"
                }; flex-wrap: wrap;">
            ${data.license ? `<span>📄 ${data.license}</span>` : ""}
            ${data.brokerage ? `<span>🏢 ${data.brokerage}</span>` : ""}
          </div>
          `
              : ""
          }
        </div>
      </section>

      ${
        data.testimonials && data.testimonials.length > 0
          ? `
      <!-- Testimonials -->
      <section id="testimonials" style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "900"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Client Success Stories
            </h2>
          </div>
          
          <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            ${data.testimonials
              .map(
                (testimonial) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-bg)"
              }; border: ${
                  isBrutalist ? "4px" : "1px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } padding: 2rem;">
                ${
                  testimonial.rating
                    ? `
                <div style="font-size: 1.25rem; margin-bottom: 1rem; color: #fbbf24;">
                  ${"★".repeat(parseInt(testimonial.rating) || 5)}
                </div>
                `
                    : ""
                }
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.0625rem; line-height: 1.7; color: var(--color-text); margin-bottom: 1.5rem; ${
                  isElegant ? "font-style: italic;" : ""
                } font-weight: ${isElegant ? "300" : "normal"};">
                  "${testimonial.text || ""}"
                </p>
                <div style="border-top: ${
                  isBrutalist ? "2px" : "1px"
                } solid var(--color-border); padding-top: 1rem;">
                  <div style="font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; color: var(--color-text);">
                    ${testimonial.name || "Client"}
                  </div>
                  ${
                    testimonial.property
                      ? `
                  <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem;">
                    ${testimonial.property}
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Contact -->
      <section id="contact" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 700px; text-align: center; margin: 0 auto; padding: 0 2rem;">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; margin-bottom: 1rem; letter-spacing: ${
        isBrutalist ? "-0.04em" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
            Let's Find Your Dream Home
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.125rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.6; font-weight: ${
        isElegant ? "300" : "normal"
      };">
            Ready to buy or sell? Get in touch for a free consultation
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center; margin-bottom: 2.5rem;">
            ${
              data.contact
                ? `
            <a href="mailto:${
              data.contact
            }" style="display: flex; align-items: center; gap: 1rem; font-size: 1.0625rem; color: var(--color-text); text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">✉</span>
              ${data.contact}
            </a>
            `
                : ""
            }
            ${
              data.phone
                ? `
            <a href="tel:${
              data.phone
            }" style="display: flex; align-items: center; gap: 1rem; font-size: 1.0625rem; color: var(--color-text); text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
              <span style="font-size: 1.5rem;">☎</span>
              ${data.phone}
            </a>
            `
                : ""
            }
          </div>
          
          ${
            data.calendlyLink
              ? `
          <a href="${
            data.calendlyLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "1.5rem 3rem" : "1.25rem 2.5rem"
                }; background: var(--color-accent); color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; text-decoration: none; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; font-size: 1.0625rem; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                } transition: all 0.2s; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-lg)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)'`
                }">
            Schedule Free Consultation
          </a>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-border);"
          : "border-top: 1px solid var(--color-border);"
      }">
        <div class="container">
          <p style="font-weight: ${isBrutalist ? "900" : "normal"};">© 2024 ${
        data.agentName || "Real Estate Agent"
      }. ${data.license ? data.license : ""}</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .listings-grid {
            grid-template-columns: 1fr !important;
          }
          .services-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section[style*="padding: 8rem"] {
            padding: 5rem 0 !important;
          }
          section[style*="padding: 6rem"] {
            padding: 4rem 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .listings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      </style>
    `;
    },
  }),

  financialadvisor: new Template("financialadvisor", {
    name: "Financial Advisor",
    description:
      "Professional financial planning and wealth management website",
    category: "Business",
    defaultTheme: "elegant",
    image: "financial-advisor",
    fields: {
      advisorName: {
        type: "text",
        default: "Michael Chen, CFP®",
        label: "Advisor Name",
        required: true,
      },
      firmName: {
        type: "text",
        default: "Horizon Wealth Management",
        label: "Firm Name",
        required: false,
      },
      tagline: {
        type: "text",
        default: "Building Your Financial Future with Confidence",
        label: "Tagline",
        required: true,
      },
      bio: {
        type: "textarea",
        default:
          "With over 20 years of experience in financial planning, I help individuals and families achieve their financial goals through personalized strategies and dedicated service. My approach combines comprehensive analysis with ongoing support to ensure your financial plan evolves with your life.",
        label: "About",
        required: true,
      },
      specializations: {
        type: "group",
        label: "Specializations",
        itemLabel: "Specialization",
        min: 0,
        max: 8,
        fields: {
          name: { type: "text", label: "Name", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            name: "Retirement Planning",
            description:
              "Strategic planning to ensure a comfortable and secure retirement",
          },
          {
            name: "Investment Management",
            description:
              "Portfolio construction and management aligned with your goals",
          },
          {
            name: "Tax Planning",
            description: "Tax-efficient strategies to maximize your wealth",
          },
          {
            name: "Estate Planning",
            description:
              "Comprehensive planning for wealth transfer and legacy",
          },
        ],
      },
      services: {
        type: "group",
        label: "Services Offered",
        itemLabel: "Service",
        min: 0,
        max: 10,
        fields: {
          name: { type: "text", label: "Service Name", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
          features: {
            type: "text",
            label: "Features (comma separated)",
            default: "",
          },
        },
        default: [
          {
            name: "Comprehensive Financial Planning",
            description:
              "Complete analysis of your financial situation with actionable recommendations",
            features:
              "Cash flow analysis, Goal setting, Risk assessment, Action plan development",
          },
          {
            name: "Wealth Management",
            description: "Ongoing portfolio management and financial guidance",
            features:
              "Investment selection, Rebalancing, Performance monitoring, Quarterly reviews",
          },
        ],
      },
      process: {
        type: "group",
        label: "Planning Process",
        itemLabel: "Step",
        min: 0,
        max: 8,
        fields: {
          step: { type: "text", label: "Step Number", default: "" },
          title: { type: "text", label: "Title", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            step: "1",
            title: "Discovery",
            description:
              "We begin by understanding your goals, concerns, and current financial situation",
          },
          {
            step: "2",
            title: "Analysis",
            description:
              "Comprehensive review of your finances, investments, and risk profile",
          },
          {
            step: "3",
            title: "Strategy",
            description:
              "Development of a personalized financial plan tailored to your objectives",
          },
          {
            step: "4",
            title: "Implementation",
            description:
              "Execution of your financial plan with ongoing support and guidance",
          },
          {
            step: "5",
            title: "Monitoring",
            description:
              "Regular reviews and adjustments to keep you on track toward your goals",
          },
        ],
      },
      credentials: {
        type: "textarea",
        default:
          "CFP® (Certified Financial Planner)\nCFA® (Chartered Financial Analyst)\nMBA, Finance - Wharton School of Business\n20+ years of experience in wealth management",
        label: "Credentials & Certifications",
        required: false,
      },
      testimonials: {
        type: "group",
        label: "Client Testimonials",
        itemLabel: "Testimonial",
        min: 0,
        max: 10,
        fields: {
          name: { type: "text", label: "Client Name", default: "" },
          text: { type: "textarea", label: "Testimonial", default: "" },
          title: { type: "text", label: "Title/Description", default: "" },
        },
        default: [
          {
            name: "Robert & Linda K.",
            text: "Michael helped us navigate a complex retirement transition with confidence. His guidance was invaluable.",
            title: "Retired Executives",
          },
          {
            name: "Jennifer M.",
            text: "Professional, knowledgeable, and always accessible. Our financial plan has given us peace of mind.",
            title: "Business Owner",
          },
        ],
      },
      disclosure: {
        type: "text",
        default: "Securities offered through XYZ Financial, Member FINRA/SIPC",
        label: "Disclosure",
        required: false,
      },
      contact: {
        type: "email",
        default: "michael@horizonwealth.com",
        label: "Email",
        required: true,
      },
      phone: {
        type: "tel",
        default: "(555) 123-4567",
        label: "Phone",
        required: false,
      },
      address: {
        type: "textarea",
        default: "123 Financial Plaza, Suite 500\nNew York, NY 10001",
        label: "Office Address",
        required: false,
      },
      calendlyLink: {
        type: "url",
        default: "",
        label: "Consultation/Booking Link",
        required: false,
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "var(--color-bg)"
      }; ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-border);"
          : "border-bottom: 1px solid var(--color-border);"
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : ""
      } ${
        isNeumorphism
          ? "box-shadow: 0 4px 6px rgba(163, 177, 198, 0.3), 0 -1px 3px rgba(255, 255, 255, 0.5);"
          : "box-shadow: 0 1px 3px rgba(0,0,0,0.05);"
      }">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 2rem;">
          <div>
            <div style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist ? "1.5rem" : "1.375rem"
      }; font-weight: ${
        isBrutalist ? "900" : "900"
      }; color: var(--color-text); letter-spacing: -0.01em; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              ${data.advisorName || "Financial Advisor"}
            </div>
            ${
              data.firmName
                ? `
            <div style="font-size: 0.8125rem; color: var(--color-text-secondary); font-weight: ${
              isBrutalist ? "900" : "600"
            }; margin-top: 0.25rem; ${
                    isBrutalist ? "text-transform: uppercase;" : ""
                  }">
              ${data.firmName}
            </div>
            `
                : ""
            }
          </div>
          <nav class="desktop-nav" style="display: flex; gap: 2rem; align-items: center; font-weight: ${
            isBrutalist ? "900" : "600"
          }; font-size: 0.9375rem;">
            <a href="#services" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Services</a>
            <a href="#process" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Process</a>
            <a href="#about" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">About</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s; ${
              isBrutalist ? "text-transform: uppercase;" : ""
            }" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                : ""
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: ${
        isBrutalist ? "5rem 0 4rem" : "7rem 0 6rem"
      }; background: var(--color-bg); ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-border);"
          : "border-bottom: 1px solid var(--color-border);"
      }">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 0.75rem; padding: ${
              isBrutalist ? "0.875rem 1.5rem" : "0.625rem 1.25rem"
            }; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.05)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "var(--color-surface)"
      }; border: ${isBrutalist ? "3px" : "1px"} solid var(--color-border); ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-full);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border-radius: var(--radius-full);"
          : "border-radius: var(--radius-full);"
      } margin-bottom: 2rem; font-size: 0.9375rem; font-weight: ${
        isBrutalist ? "900" : "600"
      }; color: var(--color-text-secondary); ${
        isBrutalist ? "text-transform: uppercase;" : ""
      }">
              Professional Financial Planning
            </div>
            <h1 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(${isBrutalist ? "2.25rem" : "2.75rem"}, 6vw, ${
        isBrutalist ? "3.5rem" : "4.5rem"
      }); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "800"
      }; margin-bottom: 1.5rem; letter-spacing: ${
        isBrutalist ? "-0.04em" : "-0.03em"
      }; line-height: 1.1; color: var(--color-text); ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              ${data.tagline || "Strategic Financial Planning for Your Future"}
            </h1>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
        isBrutalist ? "1.125rem" : "1.25rem"
      }; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.6; font-weight: ${
        isElegant ? "300" : "500"
      };">
              ${
                data.firmName ? `${data.firmName} • ` : ""
              }Personalized wealth management strategies tailored to your goals
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              ${
                data.calendlyLink
                  ? `
              <a href="${
                data.calendlyLink
              }" target="_blank" style="display: inline-block; padding: ${
                      isBrutalist ? "1.375rem 3rem" : "1.125rem 2.5rem"
                    }; background: var(--color-accent); color: ${
                      isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                    }; text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; font-size: 1rem; ${
                      isBrutalist
                        ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                        : isNeumorphism
                        ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                        : "border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"
                    } transition: all 0.2s; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                        : `this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                        : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'`
                    }">
                Schedule Consultation
              </a>
              `
                  : ""
              }
              ${
                data.phone
                  ? `
              <a href="tel:${
                data.phone
              }" style="display: inline-block; padding: ${
                      isBrutalist ? "1.375rem 3rem" : "1.125rem 2.5rem"
                    }; background: ${
                      isGlassmorphism
                        ? "rgba(255, 255, 255, 0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : "var(--color-bg)"
                    }; color: var(--color-text); text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; font-size: 1rem; ${
                      isBrutalist
                        ? "border: 4px solid var(--color-border);"
                        : isNeumorphism
                        ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                        : isGlassmorphism
                        ? "backdrop-filter: blur(10px); border: 2px solid var(--color-border); border-radius: var(--radius-md);"
                        : "border-radius: var(--radius-md); border: 2px solid var(--color-border);"
                    } transition: all 0.2s; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }" onmouseover="${
                      isBrutalist
                        ? `this.style.transform='translate(-2px, -2px)'; this.style.boxShadow='4px 4px 0 var(--color-border)'`
                        : `this.style.borderColor='var(--color-text)'; this.style.transform='translateY(-2px)'`
                    }" onmouseout="${
                      isBrutalist
                        ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                        : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                    }">
                ${data.phone}
              </a>
              `
                  : ""
              }
            </div>
          </div>
        </div>
      </section>

      ${
        data.specializations && data.specializations.length > 0
          ? `
      <!-- Specializations -->
      <section style="padding: 5rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "800"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Areas of Expertise
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.0625rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto; font-weight: ${
              isElegant ? "300" : "normal"
            };">
              Comprehensive financial solutions across multiple areas
            </p>
          </div>
          
          <div class="specializations-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
            ${data.specializations
              .map(
                (spec) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-bg)"
              }; border: ${
                  isBrutalist ? "4px" : "1px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } padding: 2rem; transition: all 0.2s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='var(--shadow-md)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'`
                }">
                <h3 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.25rem; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; margin-bottom: 0.75rem; letter-spacing: -0.01em; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                  ${spec.name || "Specialization"}
                </h3>
                ${
                  spec.description
                    ? `
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; color: var(--color-text-secondary); line-height: 1.6; font-size: 0.9375rem; font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                  ${spec.description}
                </p>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.services && data.services.length > 0
          ? `
      <!-- Services -->
      <section id="services" style="padding: 5rem 0; background: var(--color-bg);">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "800"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Comprehensive Services
            </h2>
          </div>
          
          <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
            ${data.services
              .map(
                (service, i) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; border: ${
                  isBrutalist ? "4px" : "1px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } padding: 2.5rem; transition: all 0.2s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.boxShadow='var(--shadow-md)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-border)'; this.style.boxShadow='none'`
                }">
                <div class="service-content" style="display: flex; align-items: start; gap: 1.5rem;">
                  <div style="flex-shrink: 0; width: 3rem; height: 3rem; background: var(--color-accent); color: ${
                    isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                  }; ${
                  isBrutalist
                    ? "border: 3px solid var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md);"
                } display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.25rem;">
                    ${i + 1}
                  </div>
                  <div style="flex: 1;">
                    <h3 style="font-family: ${
                      isElegant
                        ? "Playfair Display, serif"
                        : isRetro
                        ? "Space Mono, monospace"
                        : "inherit"
                    }; font-size: 1.5rem; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; margin-bottom: 1rem; letter-spacing: -0.01em; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                      ${service.name || "Service"}
                    </h3>
                    ${
                      service.description
                        ? `
                    <p style="font-family: ${
                      isElegant
                        ? "Lato, sans-serif"
                        : isRetro
                        ? "Space Mono, monospace"
                        : "inherit"
                    }; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-weight: ${
                            isElegant ? "300" : "normal"
                          };">
                      ${service.description}
                    </p>
                    `
                        : ""
                    }
                    ${
                      service.features
                        ? `
                    <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
                      ${service.features
                        .split(",")
                        .map(
                          (feature) => `
                        <li style="display: flex; align-items: center; gap: 0.5rem; color: var(--color-text); font-size: 0.9375rem;">
                          <span style="color: var(--color-accent); font-weight: 900;">✓</span>
                          <span>${feature.trim()}</span>
                        </li>
                      `
                        )
                        .join("")}
                    </ul>
                    `
                        : ""
                    }
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.process && data.process.length > 0
          ? `
      <!-- Process -->
      <section id="process" style="padding: 5rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "800"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              My Planning Process
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.0625rem; color: var(--color-text-secondary); max-width: 650px; margin: 0 auto; font-weight: ${
              isElegant ? "300" : "normal"
            };">
              A systematic approach to building your financial future
            </p>
          </div>
          
          <div class="process-steps" style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem;">
            ${data.process
              .map(
                (step, i) => `
              <div style="display: flex; gap: 2rem; align-items: start;">
                <div style="flex-shrink: 0; width: 4rem; height: 4rem; background: var(--color-accent); color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.9); border-radius: 50%;"
                    : "border-radius: 50%;"
                } display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.5rem; position: relative;">
                  ${step.step || i + 1}
                  ${
                    i < data.process.length - 1
                      ? `
                  <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: ${
                    isBrutalist ? "4px" : "2px"
                  }; height: 2rem; background: var(--color-border);"></div>
                  `
                      : ""
                  }
                </div>
                <div style="flex: 1; padding-top: 0.5rem;">
                  <h3 style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 1.375rem; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; margin-bottom: 0.75rem; letter-spacing: -0.01em; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }">
                    ${step.title || "Step"}
                  </h3>
                  ${
                    step.description
                      ? `
                  <p style="font-family: ${
                    isElegant
                      ? "Lato, sans-serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; color: var(--color-text-secondary); line-height: 1.7; font-weight: ${
                          isElegant ? "300" : "normal"
                        };">
                    ${step.description}
                  </p>
                  `
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- About -->
      <section id="about" style="padding: 5rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "800"
      }; letter-spacing: ${isBrutalist ? "-0.04em" : "-0.02em"}; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              About ${data.advisorName ? data.advisorName.split(",")[0] : "Me"}
            </h2>
          </div>
          
          ${
            data.bio
              ? `
          <div style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.0625rem; line-height: 1.8; color: var(--color-text); margin-bottom: 2.5rem; white-space: pre-line; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
            ${data.bio}
          </div>
          `
              : ""
          }
          
          ${
            data.credentials
              ? `
          <div style="background: ${
            isGlassmorphism
              ? "rgba(255, 255, 255, 0.05)"
              : isNeumorphism
              ? "var(--color-bg)"
              : "var(--color-surface)"
          }; border-left: ${
                  isBrutalist ? "8px" : "4px"
                } solid var(--color-accent); ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); border-left: 8px solid var(--color-accent);"
                    : isNeumorphism
                    ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md);"
                } padding: 2rem; margin-top: 2.5rem;">
            <h3 style="font-size: ${
              isBrutalist ? "1rem" : "0.875rem"
            }; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; margin-bottom: 1rem; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
              Credentials & Experience
            </h3>
            <div style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; color: var(--color-text); line-height: 1.8; white-space: pre-line; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
              ${data.credentials}
            </div>
          </div>
          `
              : ""
          }
        </div>
      </section>

      ${
        data.testimonials && data.testimonials.length > 0
          ? `
      <!-- Testimonials -->
      <section style="padding: 5rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
              isBrutalist ? "900" : isRetro ? "700" : "800"
            }; margin-bottom: 1rem; letter-spacing: ${
              isBrutalist ? "-0.04em" : "-0.02em"
            }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Client Testimonials
            </h2>
          </div>
          
          <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
            ${data.testimonials
              .map(
                (testimonial) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-bg)"
              }; border: ${
                  isBrutalist ? "4px" : "1px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
                    : "border-radius: var(--radius-lg);"
                } padding: 2rem;">
                <div style="font-size: 2rem; color: var(--color-accent); margin-bottom: 1rem; line-height: 1;">"</div>
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1rem; line-height: 1.7; color: var(--color-text); margin-bottom: 1.5rem; ${
                  isElegant ? "font-style: italic;" : ""
                } font-weight: ${isElegant ? "300" : "normal"};">
                  ${testimonial.text || ""}
                </p>
                <div style="border-top: ${
                  isBrutalist ? "2px" : "1px"
                } solid var(--color-border); padding-top: 1rem;">
                  <div style="font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; color: var(--color-text); margin-bottom: 0.25rem;">
                    ${testimonial.name || "Client"}
                  </div>
                  ${
                    testimonial.title
                      ? `
                  <div style="font-size: 0.875rem; color: var(--color-text-secondary);">
                    ${testimonial.title}
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Contact -->
      <section id="contact" style="padding: 5rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 700px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2rem, 5vw, 3rem); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "800"
      }; margin-bottom: 1rem; letter-spacing: ${
        isBrutalist ? "-0.04em" : "-0.02em"
      }; ${isBrutalist || isRetro ? "text-transform: uppercase;" : ""}">
              Start Your Financial Journey
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.0625rem; color: var(--color-text-secondary); line-height: 1.6; font-weight: ${
        isElegant ? "300" : "normal"
      };">
              Schedule a complimentary consultation to discuss your financial goals
            </p>
          </div>
          
          <div style="background: ${
            isGlassmorphism
              ? "rgba(255, 255, 255, 0.05)"
              : isNeumorphism
              ? "var(--color-bg)"
              : "var(--color-surface)"
          }; border: ${
        isBrutalist ? "4px" : "1px"
      } solid var(--color-border); ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg);"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border-radius: var(--radius-lg);"
          : "border-radius: var(--radius-lg);"
      } padding: 2.5rem; margin-bottom: 2rem;">
            <div style="display: grid; gap: 1.5rem;">
              ${
                data.phone
                  ? `
              <a href="tel:${
                data.phone
              }" style="display: flex; align-items: center; gap: 1rem; color: var(--color-text); text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
                <span style="font-size: 1.5rem;">☎</span>
                <span>${data.phone}</span>
              </a>
              `
                  : ""
              }
              ${
                data.contact
                  ? `
              <a href="mailto:${
                data.contact
              }" style="display: flex; align-items: center; gap: 1rem; color: var(--color-text); text-decoration: none; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
                <span style="font-size: 1.5rem;">✉</span>
                <span>${data.contact}</span>
              </a>
              `
                  : ""
              }
              ${
                data.address
                  ? `
              <div style="display: flex; align-items: start; gap: 1rem; color: var(--color-text-secondary);">
                <span style="font-size: 1.5rem;">📍</span>
                <span style="line-height: 1.6; white-space: pre-line;">${data.address}</span>
              </div>
              `
                  : ""
              }
            </div>
          </div>
          
          ${
            data.calendlyLink
              ? `
          <div style="text-align: center;">
            <a href="${
              data.calendlyLink
            }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "1.375rem 3rem" : "1.125rem 2.5rem"
                }; background: var(--color-accent); color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; text-decoration: none; font-weight: ${
                  isBrutalist ? "900" : "700"
                }; font-size: 1rem; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 6px 6px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-md);"
                    : "border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"
                } transition: all 0.2s; ${
                  isBrutalist ? "text-transform: uppercase;" : ""
                }" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='10px 10px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-2px)'; this.style.boxShadow='var(--shadow-md)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='6px 6px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'`
                }">
              Schedule Free Consultation
            </a>
          </div>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2.5rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      }; text-align: center; color: var(--color-text-secondary); font-size: 0.8125rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-border);"
          : "border-top: 1px solid var(--color-border);"
      }">
        <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 2rem;">
          <p style="margin-bottom: 0.75rem; font-weight: ${
            isBrutalist ? "900" : "600"
          };">© 2024 ${data.advisorName || "Financial Advisor"}${
        data.firmName ? ` • ${data.firmName}` : ""
      }</p>
          ${
            data.disclosure
              ? `
          <p style="line-height: 1.6; opacity: 0.8;">${data.disclosure}</p>
          `
              : ""
          }
          <p style="margin-top: 1rem; opacity: 0.7; font-size: 0.75rem;">
            Investment advisory services offered through a registered investment advisor. Past performance does not guarantee future results.
          </p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .specializations-grid {
            grid-template-columns: 1fr !important;
          }
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }
          .process-steps > div {
            flex-direction: column;
            gap: 1rem !important;
          }
          .service-content {
            flex-direction: column !important;
          }
          section[style*="padding: 7rem"] {
            padding: 5rem 0 !important;
          }
          section[style*="padding: 5rem"] {
            padding: 4rem 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
        }
      </style>
    `;
    },
  }),
  fitness: new Template("fitness", {
    name: "Fitness Trainer",
    description: "Personal training and fitness coaching website",
    category: "Business",
    defaultTheme: "brutalist",
    image: "fitness",
    fields: {
      trainerName: {
        type: "text",
        default: "Alex Johnson",
        label: "Trainer Name",
        required: true,
      },
      tagline: {
        type: "text",
        default: "Transform Your Body, Transform Your Life",
        label: "Tagline",
        required: true,
      },
      bio: {
        type: "textarea",
        default:
          "As a certified personal trainer with over 10 years of experience, I've helped hundreds of clients achieve their fitness goals. My training philosophy focuses on sustainable habits, proper form, and progressive overload to build strength and confidence that lasts.",
        label: "Bio",
        required: true,
      },
      specialties: {
        type: "group",
        label: "Specialties",
        itemLabel: "Specialty",
        min: 0,
        max: 8,
        fields: {
          name: { type: "text", label: "Name", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
        },
        default: [
          {
            name: "Strength Training",
            description:
              "Build muscle and power with progressive resistance training",
          },
          {
            name: "Weight Loss",
            description: "Sustainable fat loss through nutrition and exercise",
          },
          {
            name: "Athletic Performance",
            description: "Enhance speed, agility, and sport-specific skills",
          },
          {
            name: "Injury Prevention",
            description: "Mobility work and corrective exercises for longevity",
          },
        ],
      },
      programs: {
        type: "group",
        label: "Training Programs",
        itemLabel: "Program",
        min: 0,
        max: 10,
        fields: {
          name: { type: "text", label: "Program Name", default: "" },
          duration: { type: "text", label: "Duration", default: "" },
          price: { type: "text", label: "Price", default: "" },
          description: { type: "textarea", label: "Description", default: "" },
          features: {
            type: "text",
            label: "Features (comma separated)",
            default: "",
          },
        },
        default: [
          {
            name: "1-on-1 Training",
            duration: "60 min",
            price: "$80/session",
            description:
              "Personalized training sessions designed specifically for your goals",
            features:
              "Custom workout plan, Form coaching, Progress tracking, Nutrition guidance",
          },
          {
            name: "Small Group Training",
            duration: "45 min",
            price: "$40/session",
            description:
              "Train with 2-4 people in a motivating group environment",
            features:
              "Group accountability, Cost-effective, Social atmosphere, Expert coaching",
          },
          {
            name: "Online Coaching",
            duration: "Monthly",
            price: "$200/month",
            description:
              "Remote training with personalized programming and weekly check-ins",
            features:
              "Custom programs, Video form checks, Weekly calls, App access",
          },
        ],
      },
      transformations: {
        type: "group",
        label: "Client Transformations",
        itemLabel: "Transformation",
        min: 0,
        max: 15,
        fields: {
          name: { type: "text", label: "Client Name", default: "" },
          result: { type: "text", label: "Result", default: "" },
          time: { type: "text", label: "Timeframe", default: "" },
          testimonial: { type: "textarea", label: "Testimonial", default: "" },
        },
        default: [
          {
            name: "John D.",
            result: "Lost 30 lbs",
            time: "3 months",
            testimonial:
              "Alex helped me completely transform my relationship with fitness. The results speak for themselves!",
          },
          {
            name: "Sarah M.",
            result: "Gained 15 lbs muscle",
            time: "6 months",
            testimonial:
              "I never thought I could get this strong. Alex pushed me beyond what I thought was possible.",
          },
        ],
      },
      certifications: {
        type: "textarea",
        default:
          "NASM Certified Personal Trainer (CPT)\nACE Fitness Nutrition Specialist\nCrossFit Level 1 Trainer\nFirst Aid & CPR Certified",
        label: "Certifications",
        required: false,
      },
      contact: {
        type: "email",
        default: "alex@fitness.com",
        label: "Contact Email",
        required: true,
      },
      phone: {
        type: "tel",
        default: "(555) 123-4567",
        label: "Phone Number",
        required: false,
      },
      instagram: {
        type: "url",
        default: "",
        label: "Instagram URL",
        required: false,
      },
      bookingLink: {
        type: "url",
        default: "",
        label: "Booking/Scheduling Link",
        required: false,
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      return `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "var(--color-bg)"
      }; ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-accent);"
          : isRetro
          ? "border-bottom: 3px solid var(--color-accent);"
          : "border-bottom: 3px solid var(--color-accent);"
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : "backdrop-filter: blur(10px);"
      } ${
        isNeumorphism
          ? "box-shadow: 0 4px 6px rgba(163, 177, 198, 0.3), 0 -1px 3px rgba(255, 255, 255, 0.5);"
          : ""
      }">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem;">
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist ? "1.75rem" : "1.5rem"
      }; font-weight: 900; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">
            ${data.trainerName || "Fitness Coach"}
          </div>
          <nav class="desktop-nav" style="display: flex; gap: 2rem; align-items: center; font-weight: ${
            isBrutalist ? "900" : "700"
          }; text-transform: uppercase; font-size: 0.875rem;">
            <a href="#programs" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Programs</a>
            <a href="#about" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">About</a>
            <a href="#results" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Results</a>
            <a href="#contact" style="color: var(--color-text); text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">Contact</a>
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                : ""
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
              <span class="theme-toggle-slider"></span>
            </label>
          </nav>
        </div>
      </header>

      <!-- Hero -->
      <section style="padding: 10rem 0 8rem; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
          : "linear-gradient(135deg, var(--color-accent), var(--color-text))"
      }; color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; position: relative; overflow: hidden;">
        ${
          isBrutalist || isRetro
            ? `<div style="position: absolute; inset: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px);"></div>`
            : ""
        }
        <div class="container" style="text-align: center; position: relative; z-index: 1; margin: 0 auto; padding: 0 2rem;">
          <h1 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${isBrutalist ? "2.5rem" : "3rem"}, 8vw, ${
        isBrutalist ? "4.5rem" : "5.5rem"
      }); font-weight: 900; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1;">
            ${data.trainerName || "Elite Personal Training"}
          </h1>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
        isBrutalist ? "1.5rem" : "1.75rem"
      }; margin-bottom: 3rem; font-weight: 700; opacity: 0.95; text-transform: uppercase; letter-spacing: 0.05em;">
            ${data.tagline || "Transform Your Body. Transform Your Life."}
          </p>
          ${
            data.bookingLink
              ? `
          <a href="${
            data.bookingLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "2rem 4rem" : "1.5rem 3.5rem"
                }; background: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; color: ${
                  isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
                }; text-decoration: none; font-weight: 900; font-size: 1.25rem; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm);"
                    : "border-radius: var(--radius-sm); box-shadow: 0 8px 24px rgba(0,0,0,0.3);"
                } transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.05em;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-6px, -6px)'; this.style.boxShadow='14px 14px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-4px) scale(1.02)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.4)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.3)'`
                }">
            Start Your Transformation
          </a>
          `
              : ""
          }
        </div>
      </section>

      ${
        data.specialties && data.specialties.length > 0
          ? `
      <!-- Specialties -->
      <section style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; text-transform: uppercase; ${
              isBrutalist || isRetro ? "letter-spacing: -0.02em;" : ""
            }">
              My Specialties
            </h2>
          </div>
          
          <div class="specialties-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            ${data.specialties
              .map(
                (specialty) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; border: ${
                  isBrutalist ? "4px" : "3px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px);"
                    : ""
                } padding: 2.5rem; text-align: center; transition: all 0.2s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-6px)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                }">
                <h3 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.375rem; font-weight: 900; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${specialty.name || "Specialty"}
                </h3>
                ${
                  specialty.description
                    ? `
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; color: var(--color-text-secondary); line-height: 1.6; font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                  ${specialty.description}
                </p>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      ${
        data.programs && data.programs.length > 0
          ? `
      <!-- Programs -->
      <section id="programs" style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; margin-bottom: 1rem; text-transform: uppercase;">
              Training Programs
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.125rem; color: var(--color-text-secondary); font-weight: ${
              isBrutalist ? "900" : "600"
            }; font-weight: ${isElegant ? "300" : "normal"};">
              Customized programs designed for your goals
            </p>
          </div>
          
          <div class="programs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
            ${data.programs
              .map(
                (program, i) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-bg)"
              }; border: ${isBrutalist ? "4px" : "3px"} solid ${
                  i === 1 ? "var(--color-accent)" : "var(--color-border)"
                }; ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px);"
                    : ""
                } padding: 2.5rem; position: relative; transition: all 0.2s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='${
                        i === 1 ? "var(--color-accent)" : "var(--color-border)"
                      }'; this.style.transform='translateY(0)'`
                }">
                ${
                  i === 1
                    ? `<div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: var(--color-accent); color: ${
                        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                      }; padding: 0.5rem 1.5rem; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; ${
                        isBrutalist
                          ? "border: 3px solid var(--color-text);"
                          : ""
                      }">Most Popular</div>`
                    : ""
                }
                <h3 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.75rem; font-weight: 900; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${program.name || "Program"}
                </h3>
                ${
                  program.duration
                    ? `
                <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: ${
                  isBrutalist ? "900" : "700"
                }; margin-bottom: 1rem; text-transform: uppercase;">
                  ${program.duration}
                </div>
                `
                    : ""
                }
                ${
                  program.price
                    ? `
                <div style="font-size: ${
                  isBrutalist ? "3rem" : "2.5rem"
                }; font-weight: 900; color: var(--color-accent); margin-bottom: 1.5rem;">
                  ${program.price}
                </div>
                `
                    : ""
                }
                ${
                  program.description
                    ? `
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 2rem; font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                  ${program.description}
                </p>
                `
                    : ""
                }
                ${
                  program.features
                    ? `
                <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                  ${program.features
                    .split(",")
                    .map(
                      (feature) => `
                    <li style="padding: 0.5rem 0; color: var(--color-text); display: flex; align-items: start; gap: 0.75rem;">
                      <span style="color: var(--color-accent); font-weight: 900; font-size: 1.125rem;">✓</span>
                      <span>${feature.trim()}</span>
                    </li>
                  `
                    )
                    .join("")}
                </ul>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- About -->
      <section id="about" style="padding: 6rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; text-transform: uppercase;">
              About Me
            </h2>
          </div>
          
          ${
            data.bio
              ? `
          <div style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.125rem; line-height: 1.8; color: var(--color-text); margin-bottom: 3rem; white-space: pre-line; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
            ${data.bio}
          </div>
          `
              : ""
          }
          
          ${
            data.certifications
              ? `
          <div style="background: ${
            isGlassmorphism
              ? "rgba(255, 255, 255, 0.05)"
              : isNeumorphism
              ? "var(--color-bg)"
              : "var(--color-surface)"
          }; border-left: ${
                  isBrutalist ? "8px" : "5px"
                } solid var(--color-accent); ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); border-left: 8px solid var(--color-accent);"
                    : isNeumorphism
                    ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px);"
                    : ""
                } padding: 2rem; margin-top: 3rem;">
            <h3 style="font-size: 1.25rem; font-weight: 900; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">
              Certifications & Credentials
            </h3>
            <div style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; color: var(--color-text-secondary); line-height: 1.8; white-space: pre-line; font-weight: ${
                  isBrutalist ? "700" : "600"
                }; font-weight: ${isElegant ? "300" : "normal"};">
              ${data.certifications}
            </div>
          </div>
          `
              : ""
          }
        </div>
      </section>

      ${
        data.transformations && data.transformations.length > 0
          ? `
      <!-- Transformations -->
      <section id="results" style="padding: 6rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.02)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "var(--color-surface)"
      };">
        <div class="container" style="margin: 0 auto; padding: 0 2rem;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; text-transform: uppercase;">
              Real Results
            </h2>
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: 1.125rem; color: var(--color-text-secondary); font-weight: ${
              isBrutalist ? "900" : "600"
            }; font-weight: ${isElegant ? "300" : "normal"};">
              Success stories from clients who transformed their lives
            </p>
          </div>
          
          <div class="transformations-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${data.transformations
              .map(
                (story) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-bg)"
              }; border: ${
                  isBrutalist ? "4px" : "3px"
                } solid var(--color-border); ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9);"
                    : isGlassmorphism
                    ? "backdrop-filter: blur(10px);"
                    : ""
                } padding: 2rem; transition: all 0.2s;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : isNeumorphism
                    ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-4px)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                    : isNeumorphism
                    ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
                    : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                }">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                  <div style="width: 60px; height: 60px; background: var(--color-accent); ${
                    isBrutalist
                      ? "border: 3px solid var(--color-text);"
                      : isNeumorphism
                      ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 50%;"
                      : "border-radius: 50%;"
                  } display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; color: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                };">
                    ${(story.name || "C").charAt(0)}
                  </div>
                  <div>
                    <div style="font-weight: 900; font-size: 1.125rem;">${
                      story.name || "Client"
                    }</div>
                    ${
                      story.result
                        ? `
                    <div style="font-size: 0.875rem; color: var(--color-accent); font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; text-transform: uppercase;">
                      ${story.result}
                    </div>
                    `
                        : ""
                    }
                  </div>
                </div>
                ${
                  story.time
                    ? `
                <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: ${
                  isBrutalist ? "900" : "700"
                }; margin-bottom: 1rem; text-transform: uppercase;">
                  In ${story.time}
                </div>
                `
                    : ""
                }
                ${
                  story.testimonial
                    ? `
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; ${
                        isElegant ? "font-style: italic;" : ""
                      } color: var(--color-text-secondary); line-height: 1.6; font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                  "${story.testimonial}"
                </p>
                `
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
      `
          : ""
      }

      <!-- Contact -->
      <section id="contact" style="padding: 8rem 0; background: ${
        isBrutalist
          ? "var(--color-accent)"
          : isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isRetro
          ? "linear-gradient(135deg, var(--color-accent), #b537f2)"
          : "var(--color-accent)"
      }; color: ${isBrutalist ? "var(--color-text)" : "var(--color-bg)"};">
        <div class="container" style="max-width: 700px; text-align: center; margin: 0 auto; padding: 0 2rem;">
          <h2 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: -0.02em;">
            Ready to Start?
          </h2>
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.375rem; margin-bottom: 3rem; opacity: 0.95; font-weight: ${
        isBrutalist ? "900" : "600"
      }; font-weight: ${isElegant ? "300" : "normal"};">
            Let's build your dream physique together
          </p>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center; margin-bottom: 3rem;">
            ${
              data.contact
                ? `
            <a href="mailto:${
              data.contact
            }" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: ${
                    isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              <span style="font-size: 1.5rem;">✉</span>
              ${data.contact}
            </a>
            `
                : ""
            }
            ${
              data.phone
                ? `
            <a href="tel:${
              data.phone
            }" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: ${
                    isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              <span style="font-size: 1.5rem;">☎</span>
              ${data.phone}
            </a>
            `
                : ""
            }
            ${
              data.instagram
                ? `
            <a href="${
              data.instagram
            }" target="_blank" style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem; color: ${
                    isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                  }; text-decoration: none; font-weight: ${
                    isBrutalist ? "900" : "700"
                  }; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              <span style="font-size: 1.5rem;">📸</span>
              Follow on Instagram
            </a>
            `
                : ""
            }
          </div>
          
          ${
            data.bookingLink
              ? `
          <a href="${
            data.bookingLink
          }" target="_blank" style="display: inline-block; padding: ${
                  isBrutalist ? "2rem 4rem" : "1.5rem 3.5rem"
                }; background: ${
                  isBrutalist ? "var(--color-text)" : "var(--color-bg)"
                }; color: ${
                  isBrutalist ? "var(--color-bg)" : "var(--color-accent)"
                }; text-decoration: none; font-weight: 900; font-size: 1.25rem; ${
                  isBrutalist
                    ? "border: 4px solid var(--color-text); box-shadow: 8px 8px 0 var(--color-text);"
                    : isNeumorphism
                    ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: var(--radius-sm);"
                    : "border-radius: var(--radius-sm); box-shadow: 0 8px 24px rgba(0,0,0,0.3);"
                } transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.05em;" onmouseover="${
                  isBrutalist
                    ? `this.style.transform='translate(-6px, -6px)'; this.style.boxShadow='14px 14px 0 var(--color-text)'`
                    : `this.style.transform='translateY(-4px) scale(1.02)'`
                }" onmouseout="${
                  isBrutalist
                    ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
                    : `this.style.transform='translateY(0) scale(1)'`
                }">
            Book Free Consultation
          </a>
          `
              : ""
          }
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2rem 0; background: var(--color-bg); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem; ${
        isBrutalist
          ? "border-top: 4px solid var(--color-accent);"
          : "border-top: 3px solid var(--color-accent);"
      } font-weight: ${isBrutalist ? "900" : "700"};">
        <div class="container">
          <p style="text-transform: uppercase; letter-spacing: 0.05em;">© 2024 ${
            data.trainerName || "Fitness Training"
          }. All rights reserved.</p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .specialties-grid {
            grid-template-columns: 1fr !important;
          }
          .programs-grid {
            grid-template-columns: 1fr !important;
          }
          .transformations-grid {
            grid-template-columns: 1fr !important;
          }
          section[style*="padding: 10rem"] {
            padding: 6rem 0 !important;
          }
          section[style*="padding: 8rem"] {
            padding: 5rem 0 !important;
          }
          section[style*="padding: 6rem"] {
            padding: 4rem 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
        }
      </style>
    `;
    },
  }),
  "contact-form": new Template("contact-form", {
    name: "Contact Form",
    description: "Professional contact form with customizable fields",
    category: "Forms",
    defaultTheme: "minimal",
    image: "contact-form",
    fields: {
      formTitle: {
        type: "text",
        default: "Get in Touch",
        label: "Form Title",
        required: true,
      },
      formSubtitle: {
        type: "textarea",
        default:
          "Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.",
        label: "Form Subtitle",
        required: false,
      },
      submitText: {
        type: "text",
        default: "Send Message",
        label: "Submit Button Text",
        required: true,
      },
      successMessage: {
        type: "text",
        default: "Thank you! Your message has been sent successfully.",
        label: "Success Message",
        required: true,
      },
      recipientEmail: {
        type: "email",
        default: "your@email.com",
        label: "Your Email (where form submissions go)",
        required: true,
      },
      showName: {
        type: "text",
        default: "true",
        label: "Show Name Field (true/false)",
        required: false,
      },
      showEmail: {
        type: "text",
        default: "true",
        label: "Show Email Field (true/false)",
        required: false,
      },
      showPhone: {
        type: "text",
        default: "false",
        label: "Show Phone Field (true/false)",
        required: false,
      },
      showCompany: {
        type: "text",
        default: "false",
        label: "Show Company Field (true/false)",
        required: false,
      },
      showSubject: {
        type: "text",
        default: "false",
        label: "Show Subject Field (true/false)",
        required: false,
      },
      showMessage: {
        type: "text",
        default: "true",
        label: "Show Message Field (true/false)",
        required: false,
      },
      contactInfo: {
        type: "group",
        label: "Contact Information",
        itemLabel: "Contact Item",
        min: 0,
        max: 6,
        fields: {
          label: { type: "text", label: "Label", default: "" },
          value: { type: "text", label: "Value", default: "" },
          link: { type: "url", label: "Link (optional)", default: "" },
        },
        default: [
          {
            label: "Email",
            value: "hello@example.com",
            link: "mailto:hello@example.com",
          },
          {
            label: "Phone",
            value: "+1 (555) 123-4567",
            link: "tel:+15551234567",
          },
          {
            label: "Address",
            value: "123 Main Street, City, State 12345",
            link: "",
          },
        ],
      },
      socialLinks: {
        type: "group",
        label: "Social Links",
        itemLabel: "Social Link",
        min: 0,
        max: 8,
        fields: {
          platform: { type: "text", label: "Platform Name", default: "" },
          url: { type: "url", label: "URL", default: "" },
        },
        default: [
          { platform: "LinkedIn", url: "" },
          { platform: "Twitter", url: "" },
        ],
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      const showName = data.showName !== "false";
      const showEmail = data.showEmail !== "false";
      const showPhone = data.showPhone === "true";
      const showCompany = data.showCompany === "true";
      const showSubject = data.showSubject === "true";
      const showMessage = data.showMessage !== "false";

      return `
      <!-- Header -->
      <header style="padding: 2rem 0; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "var(--color-bg)"
      }; ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-border);"
          : "border-bottom: 1px solid var(--color-border);"
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : ""
      } ${
        isNeumorphism
          ? "box-shadow: 0 4px 6px rgba(163, 177, 198, 0.3), 0 -1px 3px rgba(255, 255, 255, 0.5);"
          : ""
      }">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${isBrutalist ? "1.75rem" : "1.5rem"}; font-weight: ${
        isBrutalist ? "900" : "800"
      }; color: var(--color-accent); ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            Contact
          </div>
          <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
            isNeumorphism
              ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
              : ""
          }">
            <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
            <span class="theme-toggle-slider"></span>
          </label>
        </div>
      </header>

      <!-- Contact Form Section -->
      <section style="min-height: calc(100vh - 120px); padding: ${
        isBrutalist ? "4rem 0" : "6rem 0"
      }; background: ${
        isGradient
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))"
          : "var(--color-bg)"
      };">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start;">
            
            <!-- Left Column - Form Header & Contact Info -->
            <div>
              <div style="margin-bottom: 3rem;">
                <h1 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: clamp(${
        isBrutalist ? "2.5rem" : "2.75rem"
      }, 6vw, ${isBrutalist ? "4rem" : "4.5rem"}); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "800"
      }; margin-bottom: 1.5rem; letter-spacing: ${
        isBrutalist ? "-0.04em" : "-0.03em"
      }; line-height: 1.1; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
                  ${data.formTitle || "Get in Touch"}
                </h1>
                ${
                  data.formSubtitle
                    ? `
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.125rem; line-height: 1.7; color: var(--color-text-secondary); font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                  ${data.formSubtitle}
                </p>
                `
                    : ""
                }
              </div>

              ${
                data.contactInfo && data.contactInfo.length > 0
                  ? `
              <!-- Contact Information -->
              <div style="margin-bottom: 3rem;">
                <h2 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.25rem; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: 1.5rem; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }">
                  Contact Information
                </h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  ${data.contactInfo
                    .map(
                      (info) => `
                    ${
                      info.link
                        ? `
                    <a href="${
                      info.link
                    }" style="display: flex; flex-direction: column; gap: 0.25rem; text-decoration: none; color: var(--color-text); transition: color 0.2s;" onmouseover="this.style.color='var(--color-accent)'" onmouseout="this.style.color='var(--color-text)'">
                      <div style="font-size: 0.875rem; font-weight: ${
                        isBrutalist ? "900" : "600"
                      }; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                        ${info.label}
                      </div>
                      <div style="font-size: 1.0625rem; font-weight: ${
                        isBrutalist ? "700" : "500"
                      };">
                        ${info.value}
                      </div>
                    </a>
                    `
                        : `
                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                      <div style="font-size: 0.875rem; font-weight: ${
                        isBrutalist ? "900" : "600"
                      }; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                        ${info.label}
                      </div>
                      <div style="font-size: 1.0625rem; font-weight: ${
                        isBrutalist ? "700" : "500"
                      }; color: var(--color-text);">
                        ${info.value}
                      </div>
                    </div>
                    `
                    }
                  `
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }

              ${
                data.socialLinks &&
                data.socialLinks.length > 0 &&
                data.socialLinks.some((link) => link.url)
                  ? `
              <!-- Social Links -->
              <div>
                <h2 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.25rem; font-weight: ${
                      isBrutalist ? "900" : "700"
                    }; margin-bottom: 1.5rem; ${
                      isBrutalist ? "text-transform: uppercase;" : ""
                    }">
                  Follow Me
                </h2>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                  ${data.socialLinks
                    .filter((link) => link.url)
                    .map(
                      (link) => `
                    <a href="${link.url}" target="_blank" style="padding: ${
                        isBrutalist ? "0.875rem 1.5rem" : "0.75rem 1.25rem"
                      }; background: ${
                        isGlassmorphism
                          ? "rgba(255, 255, 255, 0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "var(--color-surface)"
                      }; border: ${
                        isBrutalist ? "3px" : "1px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 8px;"
                          : "border-radius: 8px;"
                      } text-decoration: none; color: var(--color-text); font-weight: ${
                        isBrutalist ? "900" : "600"
                      }; font-size: 0.9375rem; transition: all 0.2s; ${
                        isBrutalist ? "text-transform: uppercase;" : ""
                      }" onmouseover="${
                        isBrutalist
                          ? `this.style.transform='translate(-2px, -2px)'; this.style.boxShadow='4px 4px 0 var(--color-text)'`
                          : isNeumorphism
                          ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
                          : `this.style.borderColor='var(--color-accent)'; this.style.transform='translateY(-2px)'`
                      }" onmouseout="${
                        isBrutalist
                          ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
                          : isNeumorphism
                          ? `this.style.boxShadow='6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9)'`
                          : `this.style.borderColor='var(--color-border)'; this.style.transform='translateY(0)'`
                      }">
                      ${link.platform}
                    </a>
                  `
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Right Column - Form -->
            <div style="background: ${
              isGlassmorphism
                ? "rgba(255, 255, 255, 0.05)"
                : isNeumorphism
                ? "var(--color-bg)"
                : "var(--color-surface)"
            }; border: ${
        isBrutalist ? "4px" : "1px"
      } solid var(--color-border); ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border-radius: 20px;"
          : "border-radius: 12px;"
      } padding: ${isBrutalist ? "3rem" : "2.5rem"};">
              <form id="contactForm" onsubmit="handleFormSubmit(event)" style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                ${
                  showName
                    ? `
                <div>
                  <label for="name" style="display: block; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                    Name *
                  </label>
                  <input type="text" id="name" name="name" required style="width: 100%; padding: ${
                    isBrutalist ? "1rem" : "0.875rem"
                  }; background: ${
                        isGlassmorphism
                          ? "rgba(255, 255, 255, 0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "var(--color-bg)"
                      }; border: ${
                        isBrutalist ? "3px" : "2px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 8px;"
                          : "border-radius: 8px;"
                      } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 2px 2px 4px rgba(163, 177, 198, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }" onblur="this.style.borderColor='var(--color-border)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }">
                </div>
                `
                    : ""
                }

                ${
                  showEmail
                    ? `
                <div>
                  <label for="email" style="display: block; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                    Email *
                  </label>
                  <input type="email" id="email" name="email" required style="width: 100%; padding: ${
                    isBrutalist ? "1rem" : "0.875rem"
                  }; background: ${
                        isGlassmorphism
                          ? "rgba(255, 255, 255, 0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "var(--color-bg)"
                      }; border: ${
                        isBrutalist ? "3px" : "2px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 8px;"
                          : "border-radius: 8px;"
                      } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 2px 2px 4px rgba(163, 177, 198, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }" onblur="this.style.borderColor='var(--color-border)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }">
                </div>
                `
                    : ""
                }

                ${
                  showPhone
                    ? `
                <div>
                  <label for="phone" style="display: block; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                    Phone
                  </label>
                  <input type="tel" id="phone" name="phone" style="width: 100%; padding: ${
                    isBrutalist ? "1rem" : "0.875rem"
                  }; background: ${
                        isGlassmorphism
                          ? "rgba(255, 255, 255, 0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "var(--color-bg)"
                      }; border: ${
                        isBrutalist ? "3px" : "2px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 8px;"
                          : "border-radius: 8px;"
                      } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 2px 2px 4px rgba(163, 177, 198, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }" onblur="this.style.borderColor='var(--color-border)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }">
                </div>
                `
                    : ""
                }

                ${
                  showCompany
                    ? `
                <div>
                  <label for="company" style="display: block; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                    Company
                  </label>
                  <input type="text" id="company" name="company" style="width: 100%; padding: ${
                    isBrutalist ? "1rem" : "0.875rem"
                  }; background: ${
                        isGlassmorphism
                          ? "rgba(255, 255, 255, 0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "var(--color-bg)"
                      }; border: ${
                        isBrutalist ? "3px" : "2px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 8px;"
                          : "border-radius: 8px;"
                      } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 2px 2px 4px rgba(163, 177, 198, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }" onblur="this.style.borderColor='var(--color-border)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }">
                </div>
                `
                    : ""
                }

                ${
                  showSubject
                    ? `
                <div>
                  <label for="subject" style="display: block; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                    Subject
                  </label>
                  <input type="text" id="subject" name="subject" style="width: 100%; padding: ${
                    isBrutalist ? "1rem" : "0.875rem"
                  }; background: ${
                        isGlassmorphism
                          ? "rgba(255, 255, 255, 0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "var(--color-bg)"
                      }; border: ${
                        isBrutalist ? "3px" : "2px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 8px;"
                          : "border-radius: 8px;"
                      } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 2px 2px 4px rgba(163, 177, 198, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }" onblur="this.style.borderColor='var(--color-border)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }">
                </div>
                `
                    : ""
                }

                ${
                  showMessage
                    ? `
                <div>
                  <label for="message" style="display: block; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                    Message *
                  </label>
                  <textarea id="message" name="message" required rows="6" style="width: 100%; padding: ${
                    isBrutalist ? "1rem" : "0.875rem"
                  }; background: ${
                        isGlassmorphism
                          ? "rgba(255, 255, 255, 0.05)"
                          : isNeumorphism
                          ? "var(--color-bg)"
                          : "var(--color-bg)"
                      }; border: ${
                        isBrutalist ? "3px" : "2px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 8px;"
                          : "border-radius: 8px;"
                      } color: var(--color-text); font-size: 1rem; font-family: inherit; resize: vertical; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 2px 2px 4px rgba(163, 177, 198, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }" onblur="this.style.borderColor='var(--color-border)'; ${
                        isNeumorphism
                          ? "this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'"
                          : ""
                      }"></textarea>
                </div>
                `
                    : ""
                }

                <button type="submit" style="width: 100%; padding: ${
                  isBrutalist ? "1.25rem" : "1rem"
                }; background: var(--color-accent); color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; border: ${isBrutalist ? "4px solid var(--color-text)" : "none"}; ${
        isBrutalist
          ? "box-shadow: 4px 4px 0 var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 8px;"
          : "border-radius: 8px;"
      } font-weight: ${
        isBrutalist ? "900" : "700"
      }; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s;" onmouseover="${
        isBrutalist
          ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
          : `this.style.transform='translateY(-2px)'; ${
              isNeumorphism
                ? "this.style.boxShadow='12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.9)'"
                : "this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
            }`
      }" onmouseout="${
        isBrutalist
          ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='4px 4px 0 var(--color-text)'`
          : `this.style.transform='translateY(0)'; ${
              isNeumorphism
                ? "this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'"
                : "this.style.boxShadow='none'"
            }`
      }">
                  ${data.submitText || "Send Message"}
                </button>

                <div id="formMessage" style="display: none; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 600;"></div>
              </form>
            </div>

          </div>
        </div>
      </section>

      <style>
        /* Form input placeholders */
        input::placeholder,
        textarea::placeholder {
          color: var(--color-text-secondary);
          opacity: 0.6;
        }

        /* Mobile Responsive */
        @media (max-width: 968px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          
          section[style*="padding: 6rem"] {
            padding: 4rem 0 !important;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }
          
          section > div > div > div[style*="padding: 3rem"],
          section > div > div > div[style*="padding: 2.5rem"] {
            padding: 1.5rem !important;
          }
        }
      </style>

      <script>
        function handleFormSubmit(event) {
          event.preventDefault();
          
          const form = event.target;
          const formData = new FormData(form);
          const messageDiv = document.getElementById('formMessage');
          const submitButton = form.querySelector('button[type="submit"]');
          
          // Disable submit button
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          
          // Create mailto link (fallback method)
          const emailBody = Array.from(formData.entries())
            .map(([key, value]) => \`\${key.charAt(0).toUpperCase() + key.slice(1)}: \${value}\`)
            .join('%0D%0A%0D%0A');
          
          const subject = formData.get('subject') || 'New Contact Form Submission';
          const mailtoLink = \`mailto:${
            data.recipientEmail
          }?subject=\${encodeURIComponent(subject)}&body=\${emailBody}\`;
          
          // Show success message
          messageDiv.style.display = 'block';
          messageDiv.style.background = 'var(--color-accent)';
          messageDiv.style.color = '${
            isBrutalist ? "var(--color-text)" : "var(--color-bg)"
          }';
          messageDiv.textContent = '${
            data.successMessage || "Thank you! Your message has been sent."
          }';
          
          // Open mailto link
          window.location.href = mailtoLink;
          
          // Reset form
          setTimeout(() => {
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = '${data.submitText || "Send Message"}';
            
            setTimeout(() => {
              messageDiv.style.display = 'none';
            }, 5000);
          }, 1000);
        }
      </script>
    `;
    },
  }),
  "slideshow-gallery": new Template("slideshow-gallery", {
    name: "Slideshow Gallery",
    description: "Full-screen image slideshow gallery with controls",
    category: "Portfolio",
    defaultTheme: "minimal",
    image: "slideshow-gallery",
    fields: {
      galleryTitle: {
        type: "text",
        default: "Gallery",
        label: "Gallery Title",
        required: false,
      },
      autoplay: {
        type: "text",
        default: "true",
        label: "Autoplay (true/false)",
        required: false,
      },
      autoplaySpeed: {
        type: "text",
        default: "5000",
        label: "Autoplay Speed (milliseconds)",
        required: false,
      },
      showCaptions: {
        type: "text",
        default: "true",
        label: "Show Captions (true/false)",
        required: false,
      },
      slides: {
        type: "group",
        label: "Slides",
        itemLabel: "Slide",
        min: 1,
        max: 50,
        fields: {
          imageUrl: { type: "url", label: "Image URL", default: "" },
          caption: { type: "text", label: "Caption", default: "" },
        },
        default: [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
            caption: "Mountain Landscape",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
            caption: "Ocean Waves",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=1920&q=80",
            caption: "Desert Dunes",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80",
            caption: "Forest Path",
          },
          {
            imageUrl:
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
            caption: "Northern Lights",
          },
        ],
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      const autoplay = data.autoplay !== "false";
      const autoplaySpeed = parseInt(data.autoplaySpeed) || 5000;
      const showCaptions = data.showCaptions !== "false";

      return `
      <!-- Slideshow Container -->
      <div id="slideshowContainer" style="position: relative; width: 100%; height: 100vh; overflow: hidden; background: #000;">
        
        <!-- Slides -->
        <div id="slidesWrapper" style="position: relative; width: 100%; height: 100%;">
          ${data.slides
            .map(
              (slide, index) => `
            <div class="slide" data-index="${index}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: ${
                index === 0 ? "1" : "0"
              }; transition: opacity 1s ease-in-out;">
              ${
                slide.imageUrl
                  ? `
              <img src="${slide.imageUrl}" alt="${
                      slide.caption || `Slide ${index + 1}`
                    }" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
              <div style="display: none; width: 100%; height: 100%; background: ${
                isGradient
                  ? "linear-gradient(135deg, #667eea, #764ba2)"
                  : isBrutalist
                  ? "#000"
                  : isRetro
                  ? "linear-gradient(135deg, #ff6ec4, #7873f5)"
                  : "#1a1a1a"
              }; align-items: center; justify-content: center; font-size: 6rem; color: white; font-weight: 900;">
                ${index + 1}
              </div>
              `
                  : `
              <div style="width: 100%; height: 100%; background: ${
                isGradient
                  ? "linear-gradient(135deg, #667eea, #764ba2)"
                  : isBrutalist
                  ? "#000"
                  : isRetro
                  ? "linear-gradient(135deg, #ff6ec4, #7873f5)"
                  : "#1a1a1a"
              }; display: flex; align-items: center; justify-content: center; font-size: 6rem; color: white; font-weight: 900;">
                ${index + 1}
              </div>
              `
              }
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Controls Container - Bottom Right -->
        <div style="position: fixed; bottom: 2rem; right: 2rem; z-index: 1000; display: flex; flex-direction: column; align-items: flex-end; gap: 1rem;">
          
          ${
            data.galleryTitle
              ? `
          <!-- Title -->
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
                  isBrutalist ? "0.75rem" : "0.6875rem"
                }; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; color: white; text-transform: uppercase; letter-spacing: 0.1em; ${
                  isGlassmorphism
                    ? "text-shadow: 0 2px 8px rgba(0,0,0,0.5);"
                    : "text-shadow: 0 1px 4px rgba(0,0,0,0.8);"
                }">
            ${data.galleryTitle}
          </div>
          `
              : ""
          }

          ${
            showCaptions
              ? `
          <!-- Caption -->
          <div id="slideCaption" style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${
                  isBrutalist ? "0.875rem" : "0.8125rem"
                }; font-weight: ${
                  isElegant ? "300" : isBrutalist ? "700" : "400"
                }; color: white; max-width: 300px; text-align: right; ${
                  isGlassmorphism
                    ? "text-shadow: 0 2px 8px rgba(0,0,0,0.5);"
                    : "text-shadow: 0 1px 4px rgba(0,0,0,0.8);"
                }">
            ${data.slides[0]?.caption || ""}
          </div>
          `
              : ""
          }

          <!-- Control Bar -->
          <div style="display: flex; align-items: center; gap: ${
            isBrutalist ? "0.75rem" : "0.5rem"
          }; padding: ${
        isBrutalist ? "0.75rem 1rem" : "0.625rem 0.875rem"
      }; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.15)"
          : isNeumorphism
          ? "rgba(255, 255, 255, 0.95)"
          : isBrutalist
          ? "#000"
          : "rgba(0, 0, 0, 0.7)"
      }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : ""
      } ${
        isBrutalist
          ? "border: 2px solid white;"
          : isNeumorphism
          ? "box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 50px;"
          : "border-radius: 50px;"
      }">
            
            <!-- Previous -->
            <button onclick="changeSlide(-1)" style="background: transparent; border: none; color: ${
              isNeumorphism ? "var(--color-text)" : "white"
            }; font-size: ${
        isBrutalist ? "1.25rem" : "1.125rem"
      }; font-weight: 900; cursor: pointer; padding: 0.25rem 0.5rem; transition: all 0.2s; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.opacity='0.6'" onmouseout="this.style.opacity='1'">
              ‹
            </button>

            <!-- Counter -->
            <div id="slideCounter" style="font-family: ${
              isRetro ? "Space Mono, monospace" : "inherit"
            }; font-size: ${
        isBrutalist ? "0.8125rem" : "0.75rem"
      }; font-weight: ${isBrutalist ? "900" : "600"}; color: ${
        isNeumorphism ? "var(--color-text)" : "white"
      }; min-width: ${isBrutalist ? "3.5rem" : "3rem"}; text-align: center; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
              1/${data.slides.length}
            </div>

            <!-- Next -->
            <button onclick="changeSlide(1)" style="background: transparent; border: none; color: ${
              isNeumorphism ? "var(--color-text)" : "white"
            }; font-size: ${
        isBrutalist ? "1.25rem" : "1.125rem"
      }; font-weight: 900; cursor: pointer; padding: 0.25rem 0.5rem; transition: all 0.2s; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.opacity='0.6'" onmouseout="this.style.opacity='1'">
              ›
            </button>

            <!-- Divider -->
            <div style="width: 1px; height: 1.25rem; background: ${
              isNeumorphism ? "var(--color-border)" : "rgba(255, 255, 255, 0.3)"
            }; margin: 0 0.25rem;"></div>

            <!-- Play/Pause -->
            <button id="playPauseBtn" onclick="toggleAutoplay()" style="background: transparent; border: none; color: ${
              isNeumorphism ? "var(--color-text)" : "white"
            }; font-size: ${
        isBrutalist ? "0.875rem" : "0.75rem"
      }; font-weight: 900; cursor: pointer; padding: 0.25rem 0.5rem; transition: all 0.2s; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.opacity='0.6'" onmouseout="this.style.opacity='1'">
              <span id="playPauseIcon">${autoplay ? "❚❚" : "▶"}</span>
            </button>

            <!-- Fullscreen -->
            <button onclick="toggleFullscreen()" style="background: transparent; border: none; color: ${
              isNeumorphism ? "var(--color-text)" : "white"
            }; font-size: ${
        isBrutalist ? "0.875rem" : "0.75rem"
      }; font-weight: 900; cursor: pointer; padding: 0.25rem 0.5rem; transition: all 0.2s; display: flex; align-items: center; justify-content: center;" onmouseover="this.style.opacity='0.6'" onmouseout="this.style.opacity='1'">
              ⛶
            </button>

            <!-- Theme Toggle -->
            <div style="width: 1px; height: 1.25rem; background: ${
              isNeumorphism ? "var(--color-border)" : "rgba(255, 255, 255, 0.3)"
            }; margin: 0 0.25rem;"></div>
            
            <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
              isNeumorphism
                ? "padding: 0.375rem; border-radius: 50%; display: inline-flex;"
                : "display: inline-flex;"
            }">
              <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme" style="position: absolute; opacity: 0;">
              <span class="theme-toggle-slider" style="width: 1.25rem; height: 1.25rem;"></span>
            </label>
          </div>

        </div>

      </div>

      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          overflow: hidden;
        }

        /* Keyboard Navigation Focus */
        button:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          div[style*="bottom: 2rem; right: 2rem"] {
            bottom: 1rem !important;
            right: 1rem !important;
            gap: 0.75rem !important;
          }

          div[style*="bottom: 2rem; right: 2rem"] > div:first-child {
            font-size: 0.625rem !important;
          }

          #slideCaption {
            font-size: 0.75rem !important;
            max-width: 200px !important;
          }

          div[style*="bottom: 2rem; right: 2rem"] > div:last-child {
            padding: 0.5rem 0.75rem !important;
            gap: 0.375rem !important;
          }

          button[onclick*="changeSlide"] {
            font-size: 1rem !important;
            padding: 0.125rem 0.375rem !important;
          }

          #slideCounter {
            font-size: 0.6875rem !important;
            min-width: 2.5rem !important;
          }

          #playPauseBtn,
          button[onclick="toggleFullscreen()"] {
            font-size: 0.6875rem !important;
            padding: 0.125rem 0.375rem !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="bottom: 2rem; right: 2rem"] {
            bottom: 0.75rem !important;
            right: 0.75rem !important;
          }

          #slideCaption {
            max-width: 150px !important;
            font-size: 0.6875rem !important;
          }

          div[style*="bottom: 2rem; right: 2rem"] > div:last-child {
            padding: 0.375rem 0.625rem !important;
          }
        }

        /* Slide transitions */
        .slide {
          will-change: opacity;
        }
      </style>

      <script>
        let currentSlide = 0;
        let autoplayEnabled = ${autoplay ? "true" : "false"};
        let autoplayInterval = null;
        const autoplaySpeed = ${autoplaySpeed};
        const totalSlides = ${data.slides.length};
        const captions = ${JSON.stringify(
          data.slides.map((s) => s.caption || "")
        )};
        const showCaptions = ${showCaptions};

        function showSlide(index) {
          const slides = document.querySelectorAll('.slide');
          
          // Wrap around
          if (index >= totalSlides) currentSlide = 0;
          else if (index < 0) currentSlide = totalSlides - 1;
          else currentSlide = index;

          // Update slides
          slides.forEach((slide, i) => {
            slide.style.opacity = i === currentSlide ? '1' : '0';
            slide.style.zIndex = i === currentSlide ? '1' : '0';
          });

          // Update counter
          document.getElementById('slideCounter').textContent = \`\${currentSlide + 1}/\${totalSlides}\`;

          // Update caption
          if (showCaptions) {
            const captionEl = document.getElementById('slideCaption');
            if (captionEl) {
              captionEl.textContent = captions[currentSlide] || '';
            }
          }
        }

        function changeSlide(direction) {
          showSlide(currentSlide + direction);
          if (autoplayEnabled) {
            resetAutoplay();
          }
        }

        function toggleAutoplay() {
          autoplayEnabled = !autoplayEnabled;
          const icon = document.getElementById('playPauseIcon');
          icon.textContent = autoplayEnabled ? '❚❚' : '▶';

          if (autoplayEnabled) {
            startAutoplay();
          } else {
            stopAutoplay();
          }
        }

        function startAutoplay() {
          if (autoplayInterval) clearInterval(autoplayInterval);
          autoplayInterval = setInterval(() => {
            changeSlide(1);
          }, autoplaySpeed);
        }

        function stopAutoplay() {
          if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
          }
        }

        function resetAutoplay() {
          stopAutoplay();
          startAutoplay();
        }

        function toggleFullscreen() {
          const elem = document.getElementById('slideshowContainer');
          
          if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
              elem.msRequestFullscreen();
            }
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          }
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') changeSlide(-1);
          if (e.key === 'ArrowRight') changeSlide(1);
          if (e.key === ' ') {
            e.preventDefault();
            toggleAutoplay();
          }
          if (e.key === 'f' || e.key === 'F') toggleFullscreen();
          if (e.key === 'Escape' && document.fullscreenElement) toggleFullscreen();
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        document.getElementById('slideshowContainer').addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.getElementById('slideshowContainer').addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
        }, { passive: true });

        function handleSwipe() {
          const swipeThreshold = 50;
          if (touchEndX < touchStartX - swipeThreshold) changeSlide(1);
          if (touchEndX > touchStartX + swipeThreshold) changeSlide(-1);
        }

        // Initialize
        if (autoplayEnabled) {
          startAutoplay();
        }

        // Pause autoplay when page is not visible
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            stopAutoplay();
          } else if (autoplayEnabled) {
            startAutoplay();
          }
        });

        // Preload next/prev images
        function preloadImages() {
          const slides = document.querySelectorAll('.slide img');
          slides.forEach(img => {
            if (img.complete) return;
            const preload = new Image();
            preload.src = img.src;
          });
        }

        window.addEventListener('load', preloadImages);
      </script>
    `;
    },
  }),
  "event-signup": new Template("event-signup", {
    name: "Event Signup",
    description: "Event registration and signup page with details",
    category: "Forms",
    defaultTheme: "gradient",
    image: "event-signup",
    fields: {
      eventName: {
        type: "text",
        default: "Tech Conference 2024",
        label: "Event Name",
        required: true,
      },
      eventTagline: {
        type: "text",
        default: "Join us for an inspiring day of innovation and networking",
        label: "Event Tagline",
        required: false,
      },
      eventDate: {
        type: "text",
        default: "June 15, 2024",
        label: "Event Date",
        required: true,
      },
      eventTime: {
        type: "text",
        default: "9:00 AM - 5:00 PM",
        label: "Event Time",
        required: true,
      },
      eventLocation: {
        type: "textarea",
        default: "Convention Center\n123 Main Street\nSan Francisco, CA 94102",
        label: "Event Location",
        required: true,
      },
      eventDescription: {
        type: "textarea",
        default:
          "Experience a full day of cutting-edge presentations, interactive workshops, and networking opportunities with industry leaders. This conference brings together innovators, entrepreneurs, and tech enthusiasts to explore the latest trends and technologies shaping our future.",
        label: "Event Description",
        required: true,
      },
      eventImage: {
        type: "url",
        default:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
        label: "Event Image URL",
        required: false,
      },
      price: {
        type: "text",
        default: "$99",
        label: "Ticket Price",
        required: false,
      },
      capacity: {
        type: "text",
        default: "500",
        label: "Event Capacity",
        required: false,
      },
      organizerName: {
        type: "text",
        default: "Tech Events Inc.",
        label: "Organizer Name",
        required: false,
      },
      organizerEmail: {
        type: "email",
        default: "events@techconference.com",
        label: "Organizer Email (where signups go)",
        required: true,
      },
      highlights: {
        type: "group",
        label: "Event Highlights",
        itemLabel: "Highlight",
        min: 0,
        max: 10,
        fields: {
          title: { type: "text", label: "Title", default: "" },
          description: { type: "text", label: "Description", default: "" },
        },
        default: [
          {
            title: "10+ Speakers",
            description: "Industry experts and thought leaders",
          },
          { title: "Networking", description: "Connect with 500+ attendees" },
          { title: "Workshops", description: "Hands-on learning sessions" },
          {
            title: "Lunch Included",
            description: "Catered meals and refreshments",
          },
        ],
      },
      schedule: {
        type: "group",
        label: "Event Schedule",
        itemLabel: "Schedule Item",
        min: 0,
        max: 20,
        fields: {
          time: { type: "text", label: "Time", default: "" },
          title: { type: "text", label: "Title", default: "" },
          speaker: { type: "text", label: "Speaker (optional)", default: "" },
        },
        default: [
          { time: "9:00 AM", title: "Registration & Coffee", speaker: "" },
          {
            time: "10:00 AM",
            title: "Opening Keynote",
            speaker: "Dr. Sarah Chen",
          },
          {
            time: "11:30 AM",
            title: "Panel Discussion: The Future of AI",
            speaker: "",
          },
          { time: "1:00 PM", title: "Lunch & Networking", speaker: "" },
          { time: "2:30 PM", title: "Breakout Sessions", speaker: "" },
          { time: "4:30 PM", title: "Closing Remarks", speaker: "" },
        ],
      },
      showNameField: {
        type: "text",
        default: "true",
        label: "Show Name Field (true/false)",
        required: false,
      },
      showEmailField: {
        type: "text",
        default: "true",
        label: "Show Email Field (true/false)",
        required: false,
      },
      showPhoneField: {
        type: "text",
        default: "false",
        label: "Show Phone Field (true/false)",
        required: false,
      },
      showCompanyField: {
        type: "text",
        default: "false",
        label: "Show Company Field (true/false)",
        required: false,
      },
      showTicketType: {
        type: "text",
        default: "false",
        label: "Show Ticket Type Selector (true/false)",
        required: false,
      },
      successMessage: {
        type: "text",
        default: "Registration successful! Check your email for confirmation.",
        label: "Success Message",
        required: true,
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      const showName = data.showNameField !== "false";
      const showEmail = data.showEmailField !== "false";
      const showPhone = data.showPhoneField === "true";
      const showCompany = data.showCompanyField === "true";
      const showTicketType = data.showTicketType === "true";

      return `
      <!-- Header -->
      <header style="position: sticky; top: 0; z-index: 1000; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.1)"
          : isNeumorphism
          ? "var(--color-bg)"
          : "var(--color-bg)"
      }; ${
        isBrutalist
          ? "border-bottom: 4px solid var(--color-border);"
          : "border-bottom: 1px solid var(--color-border);"
      } ${
        isGlassmorphism
          ? "backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
          : ""
      } ${
        isNeumorphism
          ? "box-shadow: 0 4px 6px rgba(163, 177, 198, 0.3), 0 -1px 3px rgba(255, 255, 255, 0.5);"
          : ""
      }">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: ${isBrutalist ? "1.5rem" : "1.25rem"}; font-weight: ${
        isBrutalist ? "900" : "800"
      }; color: var(--color-accent); ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            ${data.eventName || "Event"}
          </div>
          <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
            isNeumorphism
              ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
              : ""
          }">
            <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
            <span class="theme-toggle-slider"></span>
          </label>
        </div>
      </header>

      <!-- Hero Section -->
      <section style="position: relative; padding: 0; background: var(--color-bg); overflow: hidden;">
        ${
          data.eventImage
            ? `
        <div style="position: relative; height: 400px; overflow: hidden;">
          <img src="${data.eventImage}" alt="${
                data.eventName
              }" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
          <div style="position: absolute; inset: 0; background: ${
            isGradient
              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.85), rgba(118, 75, 162, 0.85))"
              : isBrutalist
              ? "rgba(0, 0, 0, 0.7)"
              : isRetro
              ? "linear-gradient(135deg, rgba(255, 110, 196, 0.85), rgba(120, 115, 245, 0.85))"
              : "linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4))"
          }; display: flex; align-items: center; justify-content: center;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; text-align: center; color: white;">
              <h1 style="font-family: ${
                isElegant
                  ? "Playfair Display, serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: ${
                isBrutalist ? "900" : isRetro ? "700" : "800"
              }; margin-bottom: 1rem; ${
                isBrutalist || isRetro ? "text-transform: uppercase;" : ""
              }">
                ${data.eventName || "Event Registration"}
              </h1>
              ${
                data.eventTagline
                  ? `
              <p style="font-family: ${
                isElegant
                  ? "Lato, sans-serif"
                  : isRetro
                  ? "Space Mono, monospace"
                  : "inherit"
              }; font-size: clamp(1.125rem, 3vw, 1.5rem); opacity: 0.95; font-weight: ${
                      isElegant ? "300" : "normal"
                    };">
                ${data.eventTagline}
              </p>
              `
                  : ""
              }
            </div>
          </div>
        </div>
        `
            : `
        <div style="padding: 5rem 0; background: ${
          isGradient
            ? "linear-gradient(135deg, #667eea, #764ba2)"
            : isBrutalist
            ? "var(--color-accent)"
            : isRetro
            ? "linear-gradient(135deg, #ff6ec4, #7873f5)"
            : "var(--color-accent)"
        }; text-align: center; color: ${
                isBrutalist ? "var(--color-text)" : "white"
              };">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
            <h1 style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(2.5rem, 6vw, 4rem); font-weight: ${
                isBrutalist ? "900" : isRetro ? "700" : "800"
              }; margin-bottom: 1rem; ${
                isBrutalist || isRetro ? "text-transform: uppercase;" : ""
              }">
              ${data.eventName || "Event Registration"}
            </h1>
            ${
              data.eventTagline
                ? `
            <p style="font-family: ${
              isElegant
                ? "Lato, sans-serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: clamp(1.125rem, 3vw, 1.5rem); opacity: 0.95; font-weight: ${
                    isElegant ? "300" : "normal"
                  };">
              ${data.eventTagline}
            </p>
            `
                : ""
            }
          </div>
        </div>
        `
        }
      </section>

      <!-- Main Content -->
      <section style="padding: 4rem 0;">
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
          <div class="main-grid" style="display: grid; grid-template-columns: 1fr 500px; gap: 4rem; align-items: start;">
            
            <!-- Left Column - Event Details -->
            <div>
              <!-- Event Info Cards -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                <div style="background: ${
                  isGlassmorphism
                    ? "rgba(255, 255, 255, 0.05)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : "var(--color-surface)"
                }; border: ${
        isBrutalist ? "3px" : "1px"
      } solid var(--color-border); ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 12px;"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border-radius: 12px;"
          : "border-radius: 12px;"
      } padding: 1.5rem;">
                  <div style="font-size: 0.75rem; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                    Date
                  </div>
                  <div style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 1.125rem; font-weight: ${
        isBrutalist ? "900" : "700"
      }; color: var(--color-text);">
                    ${data.eventDate}
                  </div>
                </div>

                <div style="background: ${
                  isGlassmorphism
                    ? "rgba(255, 255, 255, 0.05)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : "var(--color-surface)"
                }; border: ${
        isBrutalist ? "3px" : "1px"
      } solid var(--color-border); ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 12px;"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border-radius: 12px;"
          : "border-radius: 12px;"
      } padding: 1.5rem;">
                  <div style="font-size: 0.75rem; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                    Time
                  </div>
                  <div style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 1.125rem; font-weight: ${
        isBrutalist ? "900" : "700"
      }; color: var(--color-text);">
                    ${data.eventTime}
                  </div>
                </div>

                ${
                  data.price
                    ? `
                <div style="background: ${
                  isGlassmorphism
                    ? "rgba(255, 255, 255, 0.05)"
                    : isNeumorphism
                    ? "var(--color-bg)"
                    : "var(--color-surface)"
                }; border: ${
                        isBrutalist ? "3px" : "1px"
                      } solid var(--color-accent); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 12px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 12px;"
                          : "border-radius: 12px;"
                      } padding: 1.5rem;">
                  <div style="font-size: 0.75rem; font-weight: ${
                    isBrutalist ? "900" : "600"
                  }; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                    Price
                  </div>
                  <div style="font-family: ${
                    isElegant
                      ? "Playfair Display, serif"
                      : isRetro
                      ? "Space Mono, monospace"
                      : "inherit"
                  }; font-size: 1.5rem; font-weight: 900; color: var(--color-accent);">
                    ${data.price}
                  </div>
                </div>
                `
                    : ""
                }
              </div>

              <!-- Description -->
              <div style="margin-bottom: 3rem;">
                <h2 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.75rem; font-weight: ${
        isBrutalist ? "900" : "800"
      }; margin-bottom: 1rem; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
                  About This Event
                </h2>
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.0625rem; line-height: 1.7; color: var(--color-text); white-space: pre-line; font-weight: ${
        isElegant ? "300" : "normal"
      };">
                  ${data.eventDescription}
                </p>
              </div>

              <!-- Location -->
              <div style="margin-bottom: 3rem;">
                <h2 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.75rem; font-weight: ${
        isBrutalist ? "900" : "800"
      }; margin-bottom: 1rem; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
                  Location
                </h2>
                <p style="font-family: ${
                  isElegant
                    ? "Lato, sans-serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.0625rem; line-height: 1.7; color: var(--color-text); white-space: pre-line; font-weight: ${
        isElegant ? "300" : "normal"
      };">
                  ${data.eventLocation}
                </p>
              </div>

              ${
                data.highlights && data.highlights.length > 0
                  ? `
              <!-- Highlights -->
              <div style="margin-bottom: 3rem;">
                <h2 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.75rem; font-weight: ${
                      isBrutalist ? "900" : "800"
                    }; margin-bottom: 1.5rem; ${
                      isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                    }">
                  Event Highlights
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem;">
                  ${data.highlights
                    .map(
                      (highlight) => `
                    <div style="background: ${
                      isGlassmorphism
                        ? "rgba(255, 255, 255, 0.05)"
                        : isNeumorphism
                        ? "var(--color-bg)"
                        : "var(--color-surface)"
                    }; border: ${
                        isBrutalist ? "3px" : "1px"
                      } solid var(--color-border); ${
                        isBrutalist
                          ? ""
                          : isNeumorphism
                          ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 12px;"
                          : isGlassmorphism
                          ? "backdrop-filter: blur(10px); border-radius: 12px;"
                          : "border-radius: 12px;"
                      } padding: 1.5rem;">
                      <div style="font-weight: ${
                        isBrutalist ? "900" : "700"
                      }; font-size: 1.125rem; margin-bottom: 0.5rem; color: var(--color-accent);">
                        ${highlight.title}
                      </div>
                      <div style="font-size: 0.9375rem; color: var(--color-text-secondary); font-weight: ${
                        isElegant ? "300" : "normal"
                      };">
                        ${highlight.description}
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }

              ${
                data.schedule && data.schedule.length > 0
                  ? `
              <!-- Schedule -->
              <div>
                <h2 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.75rem; font-weight: ${
                      isBrutalist ? "900" : "800"
                    }; margin-bottom: 1.5rem; ${
                      isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                    }">
                  Schedule
                </h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  ${data.schedule
                    .map(
                      (item, index) => `
                    <div style="display: flex; gap: 1.5rem; padding-bottom: 1rem; ${
                      index < data.schedule.length - 1
                        ? `border-bottom: ${
                            isBrutalist ? "2px" : "1px"
                          } solid var(--color-border);`
                        : ""
                    }">
                      <div style="font-family: ${
                        isRetro ? "Space Mono, monospace" : "inherit"
                      }; font-weight: ${
                        isBrutalist ? "900" : "700"
                      }; color: var(--color-accent); min-width: 100px; ${
                        isBrutalist ? "text-transform: uppercase;" : ""
                      }">
                        ${item.time}
                      </div>
                      <div style="flex: 1;">
                        <div style="font-weight: ${
                          isBrutalist ? "900" : "600"
                        }; margin-bottom: 0.25rem;">
                          ${item.title}
                        </div>
                        ${
                          item.speaker
                            ? `
                        <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-style: italic;">
                          ${item.speaker}
                        </div>
                        `
                            : ""
                        }
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Right Column - Registration Form -->
            <div class="signup-form" style="position: sticky; top: 6rem;">
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.05)"
                  : isNeumorphism
                  ? "var(--color-bg)"
                  : "var(--color-surface)"
              }; border: ${
        isBrutalist ? "4px" : "2px"
      } solid var(--color-border); ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 20px;"
          : isGlassmorphism
          ? "backdrop-filter: blur(10px); border-radius: 20px;"
          : "border-radius: 16px;"
      } padding: 2.5rem;">
                <h2 style="font-family: ${
                  isElegant
                    ? "Playfair Display, serif"
                    : isRetro
                    ? "Space Mono, monospace"
                    : "inherit"
                }; font-size: 1.75rem; font-weight: ${
        isBrutalist ? "900" : "800"
      }; margin-bottom: 0.5rem; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
                  Register Now
                </h2>
                ${
                  data.capacity
                    ? `
                <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 2rem; font-weight: ${
                  isBrutalist ? "700" : "500"
                };">
                  Limited to ${data.capacity} attendees
                </p>
                `
                    : ""
                }

                <form id="signupForm" onsubmit="handleSignup(event)" style="display: flex; flex-direction: column; gap: 1.25rem;">
                  
                  ${
                    showName
                      ? `
                  <div>
                    <label for="name" style="display: block; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                      Full Name *
                    </label>
                    <input type="text" id="name" name="name" required style="width: 100%; padding: ${
                      isBrutalist ? "1rem" : "0.875rem"
                    }; background: ${
                          isGlassmorphism
                            ? "rgba(255, 255, 255, 0.05)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-bg)"
                        }; border: ${
                          isBrutalist ? "3px" : "2px"
                        } solid var(--color-border); ${
                          isBrutalist
                            ? ""
                            : isNeumorphism
                            ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                            : isGlassmorphism
                            ? "backdrop-filter: blur(10px); border-radius: 8px;"
                            : "border-radius: 8px;"
                        } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'" onblur="this.style.borderColor='var(--color-border)'">
                  </div>
                  `
                      : ""
                  }

                  ${
                    showEmail
                      ? `
                  <div>
                    <label for="email" style="display: block; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                      Email *
                    </label>
                    <input type="email" id="email" name="email" required style="width: 100%; padding: ${
                      isBrutalist ? "1rem" : "0.875rem"
                    }; background: ${
                          isGlassmorphism
                            ? "rgba(255, 255, 255, 0.05)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-bg)"
                        }; border: ${
                          isBrutalist ? "3px" : "2px"
                        } solid var(--color-border); ${
                          isBrutalist
                            ? ""
                            : isNeumorphism
                            ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                            : isGlassmorphism
                            ? "backdrop-filter: blur(10px); border-radius: 8px;"
                            : "border-radius: 8px;"
                        } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'" onblur="this.style.borderColor='var(--color-border)'">
                  </div>
                  `
                      : ""
                  }

                  ${
                    showPhone
                      ? `
                  <div>
                    <label for="phone" style="display: block; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                      Phone
                    </label>
                    <input type="tel" id="phone" name="phone" style="width: 100%; padding: ${
                      isBrutalist ? "1rem" : "0.875rem"
                    }; background: ${
                          isGlassmorphism
                            ? "rgba(255, 255, 255, 0.05)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-bg)"
                        }; border: ${
                          isBrutalist ? "3px" : "2px"
                        } solid var(--color-border); ${
                          isBrutalist
                            ? ""
                            : isNeumorphism
                            ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                            : isGlassmorphism
                            ? "backdrop-filter: blur(10px); border-radius: 8px;"
                            : "border-radius: 8px;"
                        } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'" onblur="this.style.borderColor='var(--color-border)'">
                  </div>
                  `
                      : ""
                  }

                  ${
                    showCompany
                      ? `
                  <div>
                    <label for="company" style="display: block; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                      Company
                    </label>
                    <input type="text" id="company" name="company" style="width: 100%; padding: ${
                      isBrutalist ? "1rem" : "0.875rem"
                    }; background: ${
                          isGlassmorphism
                            ? "rgba(255, 255, 255, 0.05)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-bg)"
                        }; border: ${
                          isBrutalist ? "3px" : "2px"
                        } solid var(--color-border); ${
                          isBrutalist
                            ? ""
                            : isNeumorphism
                            ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                            : isGlassmorphism
                            ? "backdrop-filter: blur(10px); border-radius: 8px;"
                            : "border-radius: 8px;"
                        } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'" onblur="this.style.borderColor='var(--color-border)'">
                  </div>
                  `
                      : ""
                  }

                  ${
                    showTicketType
                      ? `
                  <div>
                    <label for="ticketType" style="display: block; font-weight: ${
                      isBrutalist ? "900" : "600"
                    }; font-size: 0.875rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text);">
                      Ticket Type *
                    </label>
                    <select id="ticketType" name="ticketType" required style="width: 100%; padding: ${
                      isBrutalist ? "1rem" : "0.875rem"
                    }; background: ${
                          isGlassmorphism
                            ? "rgba(255, 255, 255, 0.05)"
                            : isNeumorphism
                            ? "var(--color-bg)"
                            : "var(--color-bg)"
                        }; border: ${
                          isBrutalist ? "3px" : "2px"
                        } solid var(--color-border); ${
                          isBrutalist
                            ? ""
                            : isNeumorphism
                            ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 8px;"
                            : isGlassmorphism
                            ? "backdrop-filter: blur(10px); border-radius: 8px;"
                            : "border-radius: 8px;"
                        } color: var(--color-text); font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="this.style.borderColor='var(--color-accent)'" onblur="this.style.borderColor='var(--color-border)'">
                      <option value="general">General Admission</option>
                      <option value="vip">VIP Pass</option>
                      <option value="student">Student Ticket</option>
                    </select>
                  </div>
                  `
                      : ""
                  }

                  <button type="submit" style="width: 100%; padding: ${
                    isBrutalist ? "1.25rem" : "1rem"
                  }; background: var(--color-accent); color: ${
        isBrutalist ? "var(--color-text)" : "var(--color-bg)"
      }; border: ${isBrutalist ? "4px solid var(--color-text)" : "none"}; ${
        isBrutalist
          ? "box-shadow: 4px 4px 0 var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 8px;"
          : "border-radius: 8px;"
      } font-weight: ${
        isBrutalist ? "900" : "700"
      }; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s;" onmouseover="${
        isBrutalist
          ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
          : `this.style.transform='translateY(-2px)'; ${
              isNeumorphism
                ? "this.style.boxShadow='12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.9)'"
                : "this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
            }`
      }" onmouseout="${
        isBrutalist
          ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='4px 4px 0 var(--color-text)'`
          : `this.style.transform='translateY(0)'; ${
              isNeumorphism
                ? "this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'"
                : "this.style.boxShadow='none'"
            }`
      }">
                    Secure Your Spot
                  </button>

                  <div id="formMessage" style="display: none; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 600;"></div>
                </form>

                ${
                  data.organizerName
                    ? `
                <p style="margin-top: 2rem; padding-top: 1.5rem; border-top: ${
                  isBrutalist ? "2px" : "1px"
                } solid var(--color-border); font-size: 0.875rem; color: var(--color-text-secondary); text-align: center;">
                  Organized by ${data.organizerName}
                </p>
                `
                    : ""
                }
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>
        input::placeholder,
        select::placeholder {
          color: var(--color-text-secondary);
          opacity: 0.6;
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }

        @media (max-width: 968px) {
          .main-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }

          .signup-form {
            position: static !important;
          }

          section[style*="padding: 4rem"] {
            padding: 3rem 0 !important;
          }

          div[style*="height: 400px"] {
            height: 300px !important;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 1rem !important;
          }

          div[style*="padding: 2.5rem"] {
            padding: 1.5rem !important;
          }

          div[style*="height: 400px"] {
            height: 250px !important;
          }
        }
      </style>

      <script>
        function handleSignup(event) {
          event.preventDefault();
          
          const form = event.target;
          const formData = new FormData(form);
          const messageDiv = document.getElementById('formMessage');
          const submitButton = form.querySelector('button[type="submit"]');
          
          // Disable submit button
          submitButton.disabled = true;
          submitButton.textContent = 'Registering...';
          
          // Create mailto link
          const emailBody = Array.from(formData.entries())
            .map(([key, value]) => \`\${key.charAt(0).toUpperCase() + key.slice(1)}: \${value}\`)
            .join('%0D%0A%0D%0A');
          
          const subject = 'Event Registration: ${data.eventName}';
          const mailtoLink = \`mailto:${
            data.organizerEmail
          }?subject=\${encodeURIComponent(subject)}&body=\${emailBody}\`;
          
          // Show success message
          messageDiv.style.display = 'block';
          messageDiv.style.background = 'var(--color-accent)';
          messageDiv.style.color = '${
            isBrutalist ? "var(--color-text)" : "var(--color-bg)"
          }';
          messageDiv.textContent = '${data.successMessage}';
          
          // Open mailto link
          window.location.href = mailtoLink;
          
          // Reset form
          setTimeout(() => {
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Secure Your Spot';
            
            setTimeout(() => {
              messageDiv.style.display = 'none';
            }, 5000);
          }, 1000);
        }
      </script>
    `;
    },
  }),
  "coming-soon": new Template("coming-soon", {
    name: "Coming Soon",
    description: "Countdown landing page for upcoming launches",
    category: "Landing Page",
    defaultTheme: "gradient",
    image: "coming-soon",
    fields: {
      title: {
        type: "text",
        default: "Something Big Is Coming",
        label: "Main Title",
        required: true,
      },
      subtitle: {
        type: "text",
        default: "Stay tuned for the reveal",
        label: "Subtitle",
        required: false,
      },
      description: {
        type: "textarea",
        default:
          "Get ready for an experience like no other. Sign up to be the first to know when we launch.",
        label: "Description",
        required: false,
      },
      launchDate: {
        type: "text",
        default: "2024-12-31",
        label: "Launch Date (YYYY-MM-DD)",
        required: true,
      },
      showCountdown: {
        type: "text",
        default: "true",
        label: "Show Countdown Timer (true/false)",
        required: false,
      },
      logoText: {
        type: "text",
        default: "BRAND",
        label: "Logo/Brand Name",
        required: false,
      },
      notifyEmail: {
        type: "email",
        default: "notify@brand.com",
        label: "Notification Email (where signups go)",
        required: true,
      },
      socialLinks: {
        type: "group",
        label: "Social Links",
        itemLabel: "Social Link",
        min: 0,
        max: 6,
        fields: {
          platform: { type: "text", label: "Platform Name", default: "" },
          url: { type: "url", label: "URL", default: "" },
        },
        default: [
          { platform: "Twitter", url: "" },
          { platform: "Instagram", url: "" },
          { platform: "YouTube", url: "" },
        ],
      },
      features: {
        type: "group",
        label: "Key Features/Teasers",
        itemLabel: "Feature",
        min: 0,
        max: 6,
        fields: {
          title: { type: "text", label: "Title", default: "" },
          description: { type: "text", label: "Description", default: "" },
        },
        default: [
          {
            title: "Revolutionary",
            description: "A completely new experience",
          },
          { title: "Innovative", description: "Pushing boundaries" },
          {
            title: "Unforgettable",
            description: "Something you've never seen before",
          },
        ],
      },
    },
    structure: (data, theme) => {
      const isBrutalist = theme.id === "brutalist";
      const isMinimal = theme.id === "minimal";
      const isGradient = theme.id === "gradient";
      const isElegant = theme.id === "elegant";
      const isRetro = theme.id === "retro";
      const isGlassmorphism = theme.id === "glassmorphism";
      const isNeumorphism = theme.id === "neumorphism";

      const showCountdown = data.showCountdown !== "false";

      return `
      <!-- Full Screen Container -->
      <div style="position: relative; width: 100%; min-height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; background: ${
        isGradient
          ? "linear-gradient(135deg, #667eea, #764ba2)"
          : isBrutalist
          ? "linear-gradient(135deg, var(--color-bg), var(--color-surface))"
          : isRetro
          ? "linear-gradient(135deg, #ff6ec4, #7873f5)"
          : isGlassmorphism
          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))"
          : isNeumorphism
          ? "var(--color-bg)"
          : "linear-gradient(135deg, var(--color-accent), var(--color-text))"
      }; ${isGlassmorphism ? "background-color: var(--color-bg);" : ""}">
        
        <!-- Pattern Overlay -->
        ${
          isBrutalist || isRetro
            ? `
        <div style="position: absolute; inset: 0; opacity: 0.05; background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px); color: var(--color-text);"></div>
        `
            : ""
        }

        <!-- Content -->
        <div style="position: relative; z-index: 1; width: 100%; max-width: 1200px; padding: 2rem; text-align: center;">
          
          <!-- Logo/Brand -->
          ${
            data.logoText
              ? `
          <div style="margin-bottom: 3rem;">
            <div style="font-family: ${
              isElegant
                ? "Playfair Display, serif"
                : isRetro
                ? "Space Mono, monospace"
                : "inherit"
            }; font-size: ${
                  isBrutalist ? "1.5rem" : "1.25rem"
                }; font-weight: 900; color: ${
                  isNeumorphism
                    ? "var(--color-accent)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.95)"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "var(--color-text)"
                    : "white"
                }; letter-spacing: 0.2em; ${
                  isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                }">
              ${data.logoText}
            </div>
          </div>
          `
              : ""
          }

          <!-- Main Title -->
          <h1 style="font-family: ${
            isElegant
              ? "Playfair Display, serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(${isBrutalist ? "2.5rem" : "3rem"}, 8vw, ${
        isBrutalist ? "5rem" : "6rem"
      }); font-weight: ${
        isBrutalist ? "900" : isRetro ? "700" : "900"
      }; color: ${
        isNeumorphism
          ? "var(--color-text)"
          : isGradient || isRetro
          ? "white"
          : isBrutalist
          ? "var(--color-text)"
          : isGlassmorphism
          ? "var(--color-text)"
          : "white"
      }; margin-bottom: 1.5rem; line-height: 1.1; ${
        isBrutalist || isRetro ? "text-transform: uppercase;" : ""
      }">
            ${data.title || "Coming Soon"}
          </h1>

          <!-- Subtitle -->
          ${
            data.subtitle
              ? `
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: clamp(1.125rem, 3vw, 1.75rem); color: ${
                  isNeumorphism
                    ? "var(--color-text-secondary)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.9)"
                    : isBrutalist
                    ? "var(--color-text-secondary)"
                    : isGlassmorphism
                    ? "var(--color-text-secondary)"
                    : "rgba(255, 255, 255, 0.9)"
                }; margin-bottom: 3rem; font-weight: ${
                  isElegant ? "300" : isBrutalist ? "700" : "500"
                };">
            ${data.subtitle}
          </p>
          `
              : ""
          }

          ${
            showCountdown
              ? `
          <!-- Countdown Timer -->
          <div id="countdown" style="display: flex; justify-content: center; gap: ${
            isBrutalist ? "2rem" : "1.5rem"
          }; margin-bottom: 4rem; flex-wrap: wrap;">
            <div class="countdown-item" style="min-width: ${
              isBrutalist ? "100px" : "90px"
            };">
              <div id="days" style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; color: ${
                  isNeumorphism
                    ? "var(--color-accent)"
                    : isGradient || isRetro
                    ? "white"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "var(--color-accent)"
                    : "white"
                }; line-height: 1; margin-bottom: 0.5rem;">00</div>
              <div style="font-size: ${
                isBrutalist ? "0.875rem" : "0.8125rem"
              }; color: ${
                  isNeumorphism
                    ? "var(--color-text-secondary)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.75)"
                    : isBrutalist
                    ? "var(--color-text-secondary)"
                    : isGlassmorphism
                    ? "var(--color-text-secondary)"
                    : "rgba(255, 255, 255, 0.75)"
                }; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; text-transform: uppercase; letter-spacing: 0.1em;">Days</div>
            </div>
            <div class="countdown-item" style="min-width: ${
              isBrutalist ? "100px" : "90px"
            };">
              <div id="hours" style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; color: ${
                  isNeumorphism
                    ? "var(--color-accent)"
                    : isGradient || isRetro
                    ? "white"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "var(--color-accent)"
                    : "white"
                }; line-height: 1; margin-bottom: 0.5rem;">00</div>
              <div style="font-size: ${
                isBrutalist ? "0.875rem" : "0.8125rem"
              }; color: ${
                  isNeumorphism
                    ? "var(--color-text-secondary)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.75)"
                    : isBrutalist
                    ? "var(--color-text-secondary)"
                    : isGlassmorphism
                    ? "var(--color-text-secondary)"
                    : "rgba(255, 255, 255, 0.75)"
                }; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; text-transform: uppercase; letter-spacing: 0.1em;">Hours</div>
            </div>
            <div class="countdown-item" style="min-width: ${
              isBrutalist ? "100px" : "90px"
            };">
              <div id="minutes" style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; color: ${
                  isNeumorphism
                    ? "var(--color-accent)"
                    : isGradient || isRetro
                    ? "white"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "var(--color-accent)"
                    : "white"
                }; line-height: 1; margin-bottom: 0.5rem;">00</div>
              <div style="font-size: ${
                isBrutalist ? "0.875rem" : "0.8125rem"
              }; color: ${
                  isNeumorphism
                    ? "var(--color-text-secondary)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.75)"
                    : isBrutalist
                    ? "var(--color-text-secondary)"
                    : isGlassmorphism
                    ? "var(--color-text-secondary)"
                    : "rgba(255, 255, 255, 0.75)"
                }; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; text-transform: uppercase; letter-spacing: 0.1em;">Minutes</div>
            </div>
            <div class="countdown-item" style="min-width: ${
              isBrutalist ? "100px" : "90px"
            };">
              <div id="seconds" style="font-family: ${
                isRetro ? "Space Mono, monospace" : "inherit"
              }; font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; color: ${
                  isNeumorphism
                    ? "var(--color-accent)"
                    : isGradient || isRetro
                    ? "white"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "var(--color-accent)"
                    : "white"
                }; line-height: 1; margin-bottom: 0.5rem;">00</div>
              <div style="font-size: ${
                isBrutalist ? "0.875rem" : "0.8125rem"
              }; color: ${
                  isNeumorphism
                    ? "var(--color-text-secondary)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.75)"
                    : isBrutalist
                    ? "var(--color-text-secondary)"
                    : isGlassmorphism
                    ? "var(--color-text-secondary)"
                    : "rgba(255, 255, 255, 0.75)"
                }; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; text-transform: uppercase; letter-spacing: 0.1em;">Seconds</div>
            </div>
          </div>
          `
              : ""
          }

          <!-- Description -->
          ${
            data.description
              ? `
          <p style="font-family: ${
            isElegant
              ? "Lato, sans-serif"
              : isRetro
              ? "Space Mono, monospace"
              : "inherit"
          }; font-size: 1.125rem; color: ${
                  isNeumorphism
                    ? "var(--color-text)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.85)"
                    : isBrutalist
                    ? "var(--color-text)"
                    : isGlassmorphism
                    ? "var(--color-text)"
                    : "rgba(255, 255, 255, 0.85)"
                }; max-width: 600px; margin: 0 auto 3rem; line-height: 1.7; font-weight: ${
                  isElegant ? "300" : "normal"
                };">
            ${data.description}
          </p>
          `
              : ""
          }

          <!-- Email Signup -->
          <div style="max-width: 500px; margin: 0 auto 4rem;">
            <form id="notifyForm" onsubmit="handleNotify(event)" style="display: flex; gap: ${
              isBrutalist ? "1rem" : "0.75rem"
            }; flex-direction: column; align-items: stretch;">
              <div style="display: flex; gap: ${
                isBrutalist ? "1rem" : "0.75rem"
              }; flex-wrap: wrap;">
                <input type="email" id="email" name="email" placeholder="Enter your email" required style="flex: 1; min-width: 250px; padding: ${
                  isBrutalist ? "1.25rem 1.5rem" : "1rem 1.25rem"
                }; background: ${
        isGlassmorphism
          ? "rgba(255, 255, 255, 0.15)"
          : isNeumorphism
          ? "var(--color-surface)"
          : "rgba(255, 255, 255, 0.95)"
      }; ${
        isGlassmorphism
          ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"
          : ""
      } border: ${
        isBrutalist
          ? "3px solid var(--color-border)"
          : isNeumorphism
          ? "2px solid var(--color-border)"
          : "2px solid transparent"
      }; ${
        isBrutalist
          ? ""
          : isNeumorphism
          ? "box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9); border-radius: 50px;"
          : "border-radius: 50px;"
      } color: ${
        isGlassmorphism ? "white" : "var(--color-text)"
      }; font-size: 1rem; font-family: inherit; transition: all 0.2s;" onfocus="${
        isNeumorphism
          ? `this.style.boxShadow='inset 2px 2px 4px rgba(163, 177, 198, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'`
          : isBrutalist
          ? `this.style.transform='translate(-2px, -2px)'; this.style.boxShadow='4px 4px 0 var(--color-border)'`
          : `this.style.borderColor='rgba(255, 255, 255, 0.8)'`
      }" onblur="${
        isNeumorphism
          ? `this.style.boxShadow='inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.9)'`
          : isBrutalist
          ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='none'`
          : `this.style.borderColor='transparent'`
      }">
                <button type="submit" style="padding: ${
                  isBrutalist ? "1.25rem 2.5rem" : "1rem 2rem"
                }; background: ${
        isNeumorphism
          ? "var(--color-accent)"
          : isGradient || isRetro
          ? "white"
          : isBrutalist
          ? "var(--color-accent)"
          : isGlassmorphism
          ? "var(--color-accent)"
          : "white"
      }; color: ${
        isNeumorphism
          ? "var(--color-bg)"
          : isGradient || isRetro
          ? "#333"
          : isBrutalist
          ? "var(--color-bg)"
          : isGlassmorphism
          ? "var(--color-bg)"
          : "#333"
      }; border: ${isBrutalist ? "3px solid var(--color-text)" : "none"}; ${
        isBrutalist
          ? "box-shadow: 4px 4px 0 var(--color-text);"
          : isNeumorphism
          ? "box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9); border-radius: 50px;"
          : "border-radius: 50px;"
      } font-weight: ${
        isBrutalist ? "900" : "700"
      }; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; white-space: nowrap;" onmouseover="${
        isBrutalist
          ? `this.style.transform='translate(-4px, -4px)'; this.style.boxShadow='8px 8px 0 var(--color-text)'`
          : isNeumorphism
          ? `this.style.boxShadow='12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.9)'`
          : `this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 20px rgba(0, 0, 0, 0.15)'`
      }" onmouseout="${
        isBrutalist
          ? `this.style.transform='translate(0, 0)'; this.style.boxShadow='4px 4px 0 var(--color-text)'`
          : isNeumorphism
          ? `this.style.boxShadow='10px 10px 20px rgba(163, 177, 198, 0.6), -10px -10px 20px rgba(255, 255, 255, 0.9)'`
          : `this.style.transform='translateY(0)'; this.style.boxShadow='none'`
      }">
                  Notify Me
                </button>
              </div>
              <div id="notifyMessage" style="display: none; padding: 0.875rem; border-radius: 8px; text-align: center; font-weight: 600; font-size: 0.9375rem;"></div>
            </form>
          </div>

          ${
            data.features && data.features.length > 0
              ? `
          <!-- Features/Teasers -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; max-width: 900px; margin: 0 auto 4rem;">
            ${data.features
              .map(
                (feature) => `
              <div style="background: ${
                isGlassmorphism
                  ? "rgba(255, 255, 255, 0.1)"
                  : isNeumorphism
                  ? "var(--color-surface)"
                  : "rgba(255, 255, 255, 0.1)"
              }; ${
                  isGlassmorphism
                    ? "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);"
                    : ""
                } border: ${
                  isBrutalist
                    ? "3px solid var(--color-border)"
                    : isNeumorphism
                    ? "1px solid var(--color-border)"
                    : "1px solid rgba(255, 255, 255, 0.2)"
                }; ${
                  isBrutalist
                    ? ""
                    : isNeumorphism
                    ? "box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9); border-radius: 12px;"
                    : "border-radius: 12px;"
                } padding: 2rem; text-align: center;">
                <div style="font-weight: ${
                  isBrutalist ? "900" : "700"
                }; font-size: 1.125rem; color: ${
                  isNeumorphism
                    ? "var(--color-accent)"
                    : isGradient || isRetro
                    ? "white"
                    : isBrutalist
                    ? "var(--color-accent)"
                    : isGlassmorphism
                    ? "var(--color-accent)"
                    : "white"
                }; margin-bottom: 0.5rem; ${
                  isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                }">
                  ${feature.title}
                </div>
                <div style="font-size: 0.9375rem; color: ${
                  isNeumorphism
                    ? "var(--color-text-secondary)"
                    : isGradient || isRetro
                    ? "rgba(255, 255, 255, 0.75)"
                    : isBrutalist
                    ? "var(--color-text-secondary)"
                    : isGlassmorphism
                    ? "var(--color-text-secondary)"
                    : "rgba(255, 255, 255, 0.75)"
                }; font-weight: ${isElegant ? "300" : "normal"};">
                  ${feature.description}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            data.socialLinks &&
            data.socialLinks.length > 0 &&
            data.socialLinks.some((link) => link.url)
              ? `
          <!-- Social Links -->
          <div style="display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
            ${data.socialLinks
              .filter((link) => link.url)
              .map(
                (link) => `
              <a href="${link.url}" target="_blank" style="color: ${
                  isNeumorphism
                    ? "var(--color-text)"
                    : isGradient || isRetro
                    ? "white"
                    : isBrutalist
                    ? "var(--color-text)"
                    : isGlassmorphism
                    ? "var(--color-text)"
                    : "white"
                }; text-decoration: none; font-weight: ${
                  isBrutalist ? "900" : "600"
                }; font-size: 0.9375rem; transition: all 0.2s; ${
                  isBrutalist || isRetro ? "text-transform: uppercase;" : ""
                }" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                ${link.platform}
              </a>
            `
              )
              .join("")}
          </div>
          `
              : ""
          }

        </div>

        <!-- Theme Toggle - Bottom Right -->
        <div style="position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;">
          <label class="theme-toggle-switch-wrapper" style="cursor: pointer; ${
            isNeumorphism
              ? "padding: 0.5rem; border-radius: 12px; display: inline-block; box-shadow: 6px 6px 12px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.9);"
              : isGlassmorphism
              ? "padding: 0.625rem; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 50%; display: inline-flex;"
              : isBrutalist
              ? "padding: 0.625rem; background: var(--color-surface); border: 3px solid var(--color-border); display: inline-flex;"
              : "padding: 0.625rem; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 50%; display: inline-flex;"
          }">
            <input type="checkbox" class="theme-toggle-switch" onclick="toggleTheme()" aria-label="Toggle theme">
            <span class="theme-toggle-slider"></span>
          </label>
        </div>

      </div>

      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          overflow-x: hidden;
        }

        input::placeholder {
          color: ${
            isGlassmorphism ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)"
          };
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          #countdown {
            gap: 1rem !important;
          }

          .countdown-item {
            min-width: 70px !important;
          }

          form[id="notifyForm"] > div {
            flex-direction: column !important;
          }

          input[type="email"] {
            min-width: 100% !important;
          }

          button[type="submit"] {
            width: 100%;
          }

          div[style*="grid-template-columns: repeat(auto-fit"] {
            grid-template-columns: 1fr !important;
          }

          div[style*="position: fixed; bottom: 2rem"] {
            bottom: 1rem !important;
            right: 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .countdown-item > div:first-child {
            font-size: 2rem !important;
          }

          div[style*="padding: 2rem"] {
            padding: 0 1rem !important;
          }
        }
      </style>

      <script>
        ${
          showCountdown
            ? `
        // Countdown Timer
        const launchDate = new Date('${data.launchDate}T00:00:00').getTime();

        function updateCountdown() {
          const now = new Date().getTime();
          const distance = launchDate - now;

          if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
          }

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          document.getElementById('days').textContent = String(days).padStart(2, '0');
          document.getElementById('hours').textContent = String(hours).padStart(2, '0');
          document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
          document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
        `
            : ""
        }

        // Email Notification
        function handleNotify(event) {
          event.preventDefault();
          
          const form = event.target;
          const formData = new FormData(form);
          const messageDiv = document.getElementById('notifyMessage');
          const submitButton = form.querySelector('button[type="submit"]');
          
          // Disable submit button
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          
          // Create mailto link
          const email = formData.get('email');
          const subject = 'Notify Me - ${data.title}';
          const body = \`Email: \${email}%0D%0A%0D%0APlease notify me when ${
            data.title
          } launches.\`;
          const mailtoLink = \`mailto:${
            data.notifyEmail
          }?subject=\${encodeURIComponent(subject)}&body=\${body}\`;
          
          // Show success message
          messageDiv.style.display = 'block';
          messageDiv.style.background = 'rgba(255, 255, 255, 0.95)';
          messageDiv.style.color = '#333';
          messageDiv.textContent = 'Thanks! We\\'ll notify you when we launch.';
          
          // Open mailto link
          window.location.href = mailtoLink;
          
          // Reset form
          setTimeout(() => {
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Notify Me';
            
            setTimeout(() => {
              messageDiv.style.display = 'none';
            }, 5000);
          }, 1000);
        }
      </script>
    `;
    },
  }),
};

// Helper functions
export function getAllTemplates() {
  return Object.values(templates).map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    supportedThemes: template.supportedThemes,
    defaultTheme: template.defaultTheme,
    image: template.image,
  }));
}

export function getTemplate(templateId) {
  return templates[templateId];
}

export function renderTemplate(
  templateId,
  customization,
  themeId,
  colorMode = "auto"
) {
  const template = getTemplate(templateId);
  const theme = getTheme(themeId);

  if (!template || !theme) {
    throw new Error("Invalid template or theme ID");
  }

  return template.render(customization, theme, colorMode);
}
