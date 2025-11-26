// styleThemes.js
// Theme System - Defines visual themes that can be applied to any template

// Enhanced theme definitions with proper variables
export const themes = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional with plenty of whitespace',
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    colors: {
      light: {
        bg: '#ffffff',
        surface: '#fafafa',
        text: '#0a0a0a',
        textSecondary: '#666666',
        border: '#e5e5e5',
        borderHover: '#cccccc',
        accent: '#2563eb',
        switch: '#fafafa'
      },
      dark: {
        bg: '#0a0a0a',
        surface: '#141414',
        text: '#ffffff',
        textSecondary: '#a0a0a0',
        border: '#1f1f1f',
        borderHover: '#333333',
        accent: '#3b82f6',
        switch: '#141414',
      }
    },
    typography: {
      hero: 'clamp(2.5rem, 7vw, 5rem)',
      h1: 'clamp(2rem, 5vw, 3rem)',
      h2: 'clamp(1.5rem, 4vw, 2.25rem)',
      h3: '1.25rem',
      body: '1rem',
      small: '0.875rem'
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      xxl: '4rem'
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px'
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)'
    }
  },

  brutalist: {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Bold typography and strong contrasts',
    fonts: {
      heading: "'Arial Black', 'Arial Bold', sans-serif",
      body: "Arial, sans-serif"
    },
    colors: {
      light: {
        bg: '#ffffff',
        surface: '#000000',
        text: '#000000',
        textSecondary: '#000000',
        border: '#000000',
        borderHover: '#000000',
        accent: '#ff0000',
        switch: '#fff'
      },
      dark: {
        bg: '#000000',
        surface: '#ffffff',
        text: '#ffffff',
        textSecondary: '#ffffff',
        border: '#ffffff',
        borderHover: '#ffffff',
        accent: '#00ff00',
        switch: '#ffffff'
      }
    },
    typography: {
      hero: 'clamp(3rem, 10vw, 8rem)',
      h1: 'clamp(2.5rem, 8vw, 6rem)',
      h2: 'clamp(2rem, 6vw, 4rem)',
      h3: '2rem',
      body: '1.125rem',
      small: '1rem'
    },
    spacing: {
      xs: '1rem',
      sm: '1.5rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem',
      xxl: '6rem'
    },
    radius: {
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0'
    },
    shadows: {
      sm: 'none',
      md: '8px 8px 0 currentColor',
      lg: '12px 12px 0 currentColor'
    }
  },

  gradient: {
    id: 'gradient',
    name: 'Gradient',
    description: 'Soft gradients and friendly rounded corners',
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    colors: {
      light: {
        bg: '#ffffff',
        surface: '#fafafa',
        text: '#1a1a2e',
        textSecondary: '#6b7280',
        border: 'rgba(0, 0, 0, 0.05)',
        borderHover: 'rgba(102, 126, 234, 0.3)',
        accent: '#667eea',
        switch: '#fafafa',
      },
      dark: {
        bg: '#0a0a1f',
        surface: '#12122f',
        text: '#ffffff',
        textSecondary: '#a0a0c0',
        border: 'rgba(255, 255, 255, 0.05)',
        borderHover: 'rgba(102, 126, 234, 0.5)',
        accent: '#764ba2',
        switch: '#12122f',
      }
    },
    typography: {
      hero: 'clamp(2.5rem, 8vw, 5.5rem)',
      h1: 'clamp(2rem, 5vw, 3.5rem)',
      h2: 'clamp(1.5rem, 4vw, 2.5rem)',
      h3: '1.375rem',
      body: '1rem',
      small: '0.875rem'
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2.5rem',
      xl: '3rem',
      xxl: '5rem'
    },
    radius: {
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    shadows: {
      sm: '0 10px 30px rgba(102, 126, 234, 0.3)',
      md: '0 15px 40px rgba(102, 126, 234, 0.4)',
      lg: '0 20px 60px rgba(102, 126, 234, 0.2)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea, #764ba2)',
      secondary: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
      accent: 'linear-gradient(135deg, #f093fb, #f5576c)'
    }
  },

  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Timeless typography with sophisticated spacing',
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Lato', sans-serif"
    },
    colors: {
      light: {
        bg: '#faf9f7',
        surface: '#ffffff',
        text: '#2a2a2a',
        textSecondary: '#6b6b6b',
        border: '#e8e6e3',
        borderHover: '#a78b5f',
        accent: '#a78b5f',
        switch: '#ffffff',
      },
      dark: {
        bg: '#1a1a1a',
        surface: '#242424',
        text: '#f5f5f5',
        textSecondary: '#a0a0a0',
        border: '#333333',
        borderHover: '#d4af76',
        accent: '#d4af76',
        switch: '#242424'
      }
    },
    typography: {
      hero: 'clamp(2.5rem, 7vw, 5rem)',
      h1: 'clamp(2rem, 5vw, 3rem)',
      h2: 'clamp(1.5rem, 4vw, 2.25rem)',
      h3: '1.5rem',
      body: '1rem',
      small: '0.9375rem'
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      xxl: '4rem'
    },
    radius: {
      sm: '2px',
      md: '4px',
      lg: '8px',
      xl: '12px'
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 2px 4px rgba(0, 0, 0, 0.08)',
      lg: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }
  },

  // RETRO THEME - Updated with better spacing and borders
  retro: {
    id: 'retro',
    name: 'Retro Wave',
    description: 'Vibrant colors with nostalgic vibes',
    fonts: {
      heading: "'Space Mono', 'Courier New', monospace",
      body: "'Space Mono', monospace"
    },
    colors: {
      light: {
        bg: '#fff5fd',
        surface: '#ffe6f9',
        text: '#2a0040',
        textSecondary: '#5a1070',
        border: '#e91e8c',
        borderHover: '#00d9ff',
        accent: '#e91e8c',
        switch: '#ffe6f9',
      },
      dark: {
        bg: '#0d001a',
        surface: '#1a0028',
        text: '#ffffff',
        textSecondary: '#e0b3ff',
        border: '#ff2fb5',
        borderHover: '#00f5ff',
        accent: '#ff2fb5',
        switch: '#1a0028'
      }
    },
    typography: {
      hero: 'clamp(2.5rem, 10vw, 6rem)',
      h1: 'clamp(2rem, 6vw, 3.5rem)',
      h2: 'clamp(1.75rem, 5vw, 2.5rem)',
      h3: '1.25rem',
      body: '1rem',
      small: '0.875rem'
    },
    spacing: {
      xs: '0.75rem',
      sm: '1rem',
      md: '2rem',
      lg: '3rem',
      xl: '4rem',
      xxl: '8rem'
    },
    radius: {
      sm: '0',
      md: '0',
      lg: '0',
      xl: '20px'
    },
    shadows: {
      sm: '0 0 20px rgba(255, 47, 181, 0.3)',
      md: '0 0 40px rgba(255, 47, 181, 0.4)',
      lg: '0 10px 40px rgba(255, 47, 181, 0.3)',
      glow: '0 0 30px currentColor'
    },
    gradients: {
      primary: 'linear-gradient(90deg, #ff2fb5, #b537f2)',
      secondary: 'linear-gradient(90deg, #ff2fb5, #00f5ff)',
      accent: 'linear-gradient(45deg, #ff2fb5, #00f5ff, #b537f2)'
    }
  },

  // GLASSMORPHISM THEME - Updated with lighter background and proper glass effect
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass and depth',
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    colors: {
      light: {
        bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',  // ✅ Soft cyan to pink
        surface: 'rgba(255, 255, 255, 0.3)',                       // ✅ More opaque glass
        text: '#f8fafc',                                            // ✅ Dark slate
        textSecondary: '#d7d7d7',                                   // ✅ Medium slate
        border: 'rgba(255, 255, 255, 0.5)',                        // ✅ More visible borders
        borderHover: 'rgba(255, 255, 255, 0.8)',                   // ✅ Brighter on hover
        accent: '#f8fafc',
        switch:  '#f8fafc'                                     // ✅ Sky blue
      },
      dark: {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',  // ✅ Dark blue gradient
        surface: 'rgba(255, 255, 255, 0.05)',                      // ✅ Keep existing
        text: '#f8fafc',                                            // ✅ Keep existing
        textSecondary: '#cbd5e1',                                   // ✅ Keep existing
        border: 'rgba(255, 255, 255, 0.1)',                        // ✅ Keep existing
        borderHover: 'rgba(255, 255, 255, 0.2)',                   // ✅ Keep existing
        accent: '#38bdf8', 
        switch: '#1e1b4b'                                       // ✅ Lighter sky blue
      }
    },
    typography: {
      hero: 'clamp(2.5rem, 8vw, 6rem)',
      h1: 'clamp(2rem, 6vw, 4rem)',
      h2: 'clamp(1.5rem, 4vw, 2.5rem)',
      h3: '1.5rem',
      body: '1rem',
      small: '0.9375rem'
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      xxl: '6rem'
    },
    radius: {
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    shadows: {
      sm: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      md: '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
      lg: '0 20px 60px 0 rgba(31, 38, 135, 0.25)'
    }
  },

  // NEUMORPHISM THEME - Updated with softer dark mode colors and no borders
  neumorphism: {
    id: 'neumorphism',
    name: 'Neumorphism',
    description: 'Soft, subtle depth designed with modern minimalism.',
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    colors: {
      light: {
        bg: '#e8ecf2',                    // ✅ Keep existing (good)
        surface: '#e8ecf2',               // ✅ Keep existing
        text: '#2d3142',                  // ✅ Keep existing
        textSecondary: '#6b7280',         // ✅ Keep existing
        border: 'transparent',             // ✅ Keep existing
        borderHover: 'transparent',        // ✅ Keep existing
        accent: '#4c6ef5',
        switch: '#6b7280', 
      },
      dark: {
        bg: '#31353d',                     // ✅ Warmer gray (was #2a2d35)
        surface: '#31353d',                // ✅ Same as bg
        text: '#f0f3f7',                   // ✅ Softer white (was #e8eaed)
        textSecondary: '#a8adb8',          // ✅ Warmer gray (was #9ca3af)
        border: 'transparent',              // ✅ Keep existing
        borderHover: 'transparent',         // ✅ Keep existing
        accent: '#7c8aff',
        switch: '#31353d'
      }
    },
    typography: {
      hero: 'clamp(2.5rem, 7vw, 5rem)',
      h1: 'clamp(2rem, 5vw, 3rem)',
      h2: 'clamp(1.5rem, 4vw, 2.25rem)',
      h3: '1.375rem',
      body: '1rem',
      small: '0.9375rem'
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2.5rem',
      xl: '3rem',
      xxl: '4rem'
    },
    radius: {
      sm: '12px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    },
    shadows: {
      // Light mode shadows
      sm: '6px 6px 12px rgba(0, 0, 0, 0.12), -6px -6px 12px rgba(255, 255, 255, 0.9)',
      md: '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.95)',
      lg: '10px 10px 20px rgba(0, 0, 0, 0.18), -10px -10px 20px rgba(255, 255, 255, 1)',
      inset: 'inset 4px 4px 8px rgba(0, 0, 0, 0.12), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
      
      // Dark mode shadows - IMPROVED ✅
      smDark: '6px 6px 12px #262930, -6px -6px 12px #3c414a',
      mdDark: '8px 8px 16px #262930, -8px -8px 16px #3c414a',
      lgDark: '10px 10px 20px #262930, -10px -10px 20px #3c414a',
      insetDark: 'inset 4px 4px 8px #262930, inset -4px -4px 8px #3c414a'
    }
  }
};

// Get theme by ID
export function getTheme(themeId) {
  return themes[themeId] || themes.minimal;
}

// Generate CSS variables for a theme
// Helper function to generate CSS variables from a theme
export function generateThemeCSS(theme, colorMode = 'light') {
  const colors = colorMode === 'dark' ? theme.colors.dark : theme.colors.light;
  
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
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};
      --text-hero: ${theme.typography.hero};
      --text-h1: ${theme.typography.h1};
      --text-h2: ${theme.typography.h2};
      --text-h3: ${theme.typography.h3};
      --text-body: ${theme.typography.body};
      --text-small: ${theme.typography.small};
      
      /* Spacing */
      --space-xs: ${theme.spacing.xs};
      --space-sm: ${theme.spacing.sm};
      --space-md: ${theme.spacing.md};
      --space-lg: ${theme.spacing.lg};
      --space-xl: ${theme.spacing.xl};
      --space-xxl: ${theme.spacing.xxl};
      
      /* Border Radius */
      --radius-sm: ${theme.radius.sm};
      --radius-md: ${theme.radius.md};
      --radius-lg: ${theme.radius.lg};
      --radius-xl: ${theme.radius.xl};
      --radius-full: 9999px;
      
      /* Shadows */
      --shadow-sm: ${theme.shadows.sm};
      --shadow-md: ${theme.shadows.md};
      --shadow-lg: ${theme.shadows.lg};
      ${theme.shadows.glow ? `--shadow-glow: ${theme.shadows.glow};` : ''}
      ${theme.shadows.inset ? `--shadow-inset: ${theme.shadows.inset};` : ''}
      
      /* Gradients */
      ${theme.gradients ? Object.entries(theme.gradients).map(([key, value]) => 
        `--gradient-${key}: ${value};`
      ).join('\n      ') : ''}
    }
    
    /* Dark mode */
    [data-theme="dark"] {
      --color-bg: ${theme.colors.dark.bg};
      --color-surface: ${theme.colors.dark.surface};
      --color-text: ${theme.colors.dark.text};
      --color-text-secondary: ${theme.colors.dark.textSecondary};
      --color-border: ${theme.colors.dark.border};
      --color-border-hover: ${theme.colors.dark.borderHover};
      --color-accent: ${theme.colors.dark.accent};
    }
    
    /* Base Styles */
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
    
    /* Animation Keyframes */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes scale {
      from { transform: scale(0.95); }
      to { transform: scale(1); }
    }
    
    ${theme.id === 'retro' ? `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    
    @keyframes neon {
      from { text-shadow: 0 0 10px rgba(255, 0, 255, 0.8); }
      to { text-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
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
    ` : ''}
    
    ${theme.id === 'gradient' ? `
    @keyframes gradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    ` : ''}
    
    ${theme.id === 'brutalist' ? `
    @keyframes glitch {
      0% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(-2px, -2px); }
      60% { transform: translate(2px, 2px); }
      80% { transform: translate(2px, -2px); }
      100% { transform: translate(0); }
    }
    ` : ''}
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