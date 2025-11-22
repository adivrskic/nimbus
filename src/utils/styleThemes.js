// styleThemes.js
// Theme System - Defines visual themes that can be applied to any template

export const themes = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    fonts: {
      heading: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    colors: {
      light: {
        bg: '#ffffff',
        surface: '#f5f5f7',
        text: '#1d1d1f',
        textSecondary: '#86868b',
        border: '#e5e5e7',
        borderHover: '#d1d1d6',
        accent: '#007aff',
      },
      dark: {
        bg: '#000000',
        surface: '#1c1c1e',
        text: '#f5f5f7',
        textSecondary: '#98989d',
        border: '#38383a',
        borderHover: '#48484a',
        accent: '#0a84ff',
      },
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      xxl: '64px',
    },
    typography: {
      hero: 'clamp(48px, 7vw, 72px)',
      h1: 'clamp(32px, 5vw, 48px)',
      h2: 'clamp(24px, 3vw, 32px)',
      h3: 'clamp(20px, 2.5vw, 24px)',
      body: '16px',
      small: '14px',
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
      md: '0 4px 12px rgba(0, 0, 0, 0.12)',
      lg: '0 8px 24px rgba(0, 0, 0, 0.16)',
    },
  },

  brutalist: {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Bold and raw aesthetic',
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Space Mono', monospace",
    },
    colors: {
      light: {
        bg: '#ffffff',
        surface: '#f0f0f0',
        text: '#000000',
        textSecondary: '#666666',
        border: '#000000',
        borderHover: '#333333',
        accent: '#ff0000',
      },
      dark: {
        bg: '#0a0a0a',
        surface: '#1a1a1a',
        text: '#ffffff',
        textSecondary: '#999999',
        border: '#ffffff',
        borderHover: '#cccccc',
        accent: '#ff3333',
      },
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '40px',
      xl: '56px',
      xxl: '80px',
    },
    typography: {
      hero: 'clamp(56px, 8vw, 96px)',
      h1: 'clamp(40px, 6vw, 64px)',
      h2: 'clamp(32px, 4vw, 48px)',
      h3: 'clamp(24px, 3vw, 32px)',
      body: '18px',
      small: '14px',
    },
    radius: {
      sm: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
    },
    shadows: {
      sm: '4px 4px 0 rgba(0, 0, 0, 0.2)',
      md: '8px 8px 0 rgba(0, 0, 0, 0.25)',
      lg: '12px 12px 0 rgba(0, 0, 0, 0.3)',
    },
  },

  gradient: {
    id: 'gradient',
    name: 'Gradient',
    description: 'Vibrant gradient backgrounds',
    fonts: {
      heading: "'Outfit', sans-serif",
      body: "'Inter', sans-serif",
    },
    colors: {
      light: {
        bg: '#ffffff',
        surface: '#f8f9fa',
        text: '#1a1a1a',
        textSecondary: '#6c757d',
        border: '#dee2e6',
        borderHover: '#adb5bd',
        accent: '#6366f1',
      },
      dark: {
        bg: '#0f0f1e',
        surface: '#1a1a2e',
        text: '#f0f0f0',
        textSecondary: '#a0a0a0',
        border: '#2a2a3e',
        borderHover: '#3a3a4e',
        accent: '#818cf8',
      },
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      xxl: '64px',
    },
    typography: {
      hero: 'clamp(48px, 7vw, 72px)',
      h1: 'clamp(36px, 5vw, 56px)',
      h2: 'clamp(28px, 4vw, 40px)',
      h3: 'clamp(22px, 3vw, 28px)',
      body: '16px',
      small: '14px',
    },
    radius: {
      sm: '6px',
      md: '12px',
      lg: '16px',
      xl: '24px',
    },
    shadows: {
      sm: '0 2px 8px rgba(99, 102, 241, 0.1)',
      md: '0 4px 16px rgba(99, 102, 241, 0.15)',
      lg: '0 8px 32px rgba(99, 102, 241, 0.2)',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  },

  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined',
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Lato', sans-serif",
    },
    colors: {
      light: {
        bg: '#fafaf9',
        surface: '#ffffff',
        text: '#292524',
        textSecondary: '#78716c',
        border: '#e7e5e4',
        borderHover: '#d6d3d1',
        accent: '#b45309',
      },
      dark: {
        bg: '#1c1917',
        surface: '#292524',
        text: '#fafaf9',
        textSecondary: '#a8a29e',
        border: '#44403c',
        borderHover: '#57534e',
        accent: '#fbbf24',
      },
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      xxl: '64px',
    },
    typography: {
      hero: 'clamp(42px, 6vw, 64px)',
      h1: 'clamp(32px, 5vw, 48px)',
      h2: 'clamp(24px, 3.5vw, 36px)',
      h3: 'clamp(20px, 2.5vw, 28px)',
      body: '17px',
      small: '15px',
    },
    radius: {
      sm: '2px',
      md: '4px',
      lg: '6px',
      xl: '8px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 2px 8px rgba(0, 0, 0, 0.08)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
  },

  retro: {
    id: 'retro',
    name: 'Retro',
    description: '80s inspired vaporwave',
    fonts: {
      heading: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
    },
    colors: {
      light: {
        bg: '#fef3f8',
        surface: '#ffffff',
        text: '#2d1b4e',
        textSecondary: '#7c5295',
        border: '#e9c5e0',
        borderHover: '#d19ac4',
        accent: '#ff6ec7',
      },
      dark: {
        bg: '#120458',
        surface: '#1e0a78',
        text: '#e0d9f7',
        textSecondary: '#b19cd9',
        border: '#4b2e83',
        borderHover: '#6b4ea3',
        accent: '#ff6ec7',
      },
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
      xxl: '64px',
    },
    typography: {
      hero: 'clamp(48px, 7vw, 80px)',
      h1: 'clamp(36px, 5vw, 56px)',
      h2: 'clamp(28px, 4vw, 40px)',
      h3: 'clamp(22px, 3vw, 28px)',
      body: '16px',
      small: '14px',
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
    },
    shadows: {
      sm: '0 4px 8px rgba(255, 110, 199, 0.2)',
      md: '0 8px 16px rgba(255, 110, 199, 0.3)',
      lg: '0 12px 24px rgba(255, 110, 199, 0.4)',
      glow: '0 0 20px rgba(255, 110, 199, 0.6)',
    },
    gradients: {
      vaporwave: 'linear-gradient(135deg, #ff6ec7 0%, #7c5295 50%, #120458 100%)',
      neon: 'linear-gradient(135deg, #00f2ff 0%, #ff6ec7 100%)',
    },
  },

  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass and depth',
    fonts: {
      heading: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    colors: {
      light: {
        bg: 'linear-gradient(135deg, #e3f2ff 0%, #ffeef8 100%)',
        surface: 'rgba(255, 255, 255, 0.7)',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: 'rgba(255, 255, 255, 0.3)',
        borderHover: 'rgba(255, 255, 255, 0.5)',
        accent: '#6366f1',
      },
      dark: {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        surface: 'rgba(255, 255, 255, 0.05)',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.1)',
        borderHover: 'rgba(255, 255, 255, 0.2)',
        accent: '#818cf8',
      },
    },
    spacing: {
      xs: '12px',
      sm: '20px',
      md: '40px',
      lg: '72px',
      xl: '112px',
      xxl: '160px',
    },
    typography: {
      hero: 'clamp(56px, 8vw, 96px)',
      h1: 'clamp(44px, 6vw, 72px)',
      h2: 'clamp(36px, 5vw, 56px)',
      h3: 'clamp(28px, 4vw, 40px)',
      body: '18px',
      small: '15px',
    },
    radius: {
      sm: '12px',
      md: '20px',
      lg: '28px',
      xl: '40px',
    },
    shadows: {
      sm: '0 4px 6px rgba(0, 0, 0, 0.1)',
      md: '0 8px 16px rgba(0, 0, 0, 0.12)',
      lg: '0 16px 32px rgba(0, 0, 0, 0.15)',
    },
  },

  neumorphism: {
    id: 'neumorphism',
    name: 'Neumorphism',
    description: 'Soft, subtle depth designed with modern minimalism',
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    colors: {
      light: {
        bg: '#e5e9f0',
        surface: '#e7ebf2',
        text: '#2e2e2e',
        textSecondary: '#676767',
        border: '#d3d8e0',
        borderHover: '#c6ccd6',
        accent: '#6366f1',
      },
      dark: {
        bg: '#1d1f25',
        surface: '#1f2127',
        text: '#f2f2f2',
        textSecondary: '#b0b0b0',
        border: '#2a2d34',
        borderHover: '#3a3d44',
        accent: '#818cf8',
      },
    },
    spacing: {
      xs: '10px',
      sm: '18px',
      md: '32px',
      lg: '64px',
      xl: '104px',
      xxl: '144px',
    },
    typography: {
      hero: 'clamp(52px, 7vw, 80px)',
      h1: 'clamp(40px, 5.5vw, 64px)',
      h2: 'clamp(32px, 4.5vw, 48px)',
      h3: 'clamp(26px, 3.5vw, 35px)',
      body: '18px',
      small: '15px',
    },
    radius: {
      sm: '12px',
      md: '20px',
      lg: '28px',
      xl: '36px',
    },
    shadows: {
      sm: '3px 3px 6px rgba(0, 0, 0, 0.10), -3px -3px 6px rgba(255, 255, 255, 0.65)',
      md: '6px 6px 12px rgba(0, 0, 0, 0.12), -6px -6px 12px rgba(255, 255, 255, 0.55)',
      lg: '10px 10px 20px rgba(0, 0, 0, 0.14), -10px -10px 20px rgba(255, 255, 255, 0.50)',
      inset: 'inset 3px 3px 6px rgba(0, 0, 0, 0.15), inset -3px -3px 6px rgba(255, 255, 255, 0.55)',
    },
  },
};

// Get theme by ID
export function getTheme(themeId) {
  return themes[themeId] || themes.minimal;
}

// Generate CSS variables for a theme
export function generateThemeCSS(theme, colorMode = 'light') {
  const colors = theme.colors[colorMode];
  if (!colors) {
    console.error("Theme missing colors:", theme);
    return "";
  }
  
  return `
    :root {
      /* Colors */
      --color-bg: ${colors.bg};
      --color-surface: ${colors.surface};
      --color-text: ${colors.text};
      --color-text-secondary: ${colors.textSecondary};
      --color-border: ${colors.border};
      --color-border-hover: ${colors.borderHover};
      --color-accent: ${colors.accent};
      
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
  `;
}

// Get all available themes
export function getAllThemes() {
  return Object.values(themes).map(theme => ({
    id: theme.id,
    name: theme.name,
    description: theme.description,
  }));
}