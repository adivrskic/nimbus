// Centralized Style Themes System
// Each theme provides a complete design system that can be applied to any template
// Templates focus on structure and content, themes handle the visual presentation

export const styleThemes = {
  // Modern Minimal - Clean, professional, Apple-inspired
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional with plenty of whitespace',
    preview: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=300&fit=crop',
    
    fonts: {
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'SF Mono', Monaco, 'Courier New', monospace",
    },
    
    fontSizes: {
      hero: 'clamp(3rem, 8vw, 5.5rem)',
      h1: 'clamp(2.5rem, 5vw, 4rem)',
      h2: 'clamp(2rem, 4vw, 3rem)',
      h3: 'clamp(1.5rem, 3vw, 2rem)',
      body: '1.125rem',
      small: '0.875rem',
      tiny: '0.75rem',
    },
    
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '2rem',
      lg: '4rem',
      xl: '6rem',
      xxl: '8rem',
    },
    
    radius: {
      none: '0',
      sm: '0.375rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.5rem',
      full: '9999px',
    },
    
    shadows: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 12px rgba(0, 0, 0, 0.08)',
      lg: '0 8px 30px rgba(0, 0, 0, 0.12)',
      xl: '0 25px 50px rgba(0, 0, 0, 0.15)',
    },
    
    animations: {
      fadeIn: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      slideUp: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      scale: 'scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    // Light mode colors
    light: {
      background: '#ffffff',
      surface: '#f5f5f7',
      surfaceAlt: '#fafafa',
      text: {
        primary: '#1d1d1f',
        secondary: '#86868b',
        tertiary: '#d2d2d7',
      },
      border: '#e5e5e7',
      borderHover: '#c5c5c7',
    },
    
    // Dark mode colors
    dark: {
      background: '#000000',
      surface: '#1c1c1e',
      surfaceAlt: '#2c2c2e',
      text: {
        primary: '#f5f5f7',
        secondary: '#98989d',
        tertiary: '#48484a',
      },
      border: '#38383a',
      borderHover: '#48484a',
    },
  },

  // Bold Brutalist - Strong, confident, impactful
  brutalist: {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Bold typography and strong contrasts',
    preview: 'https://images.unsplash.com/photo-1617036890722-7eea0a29cfd3?w=400&h=300&fit=crop',
    
    fonts: {
      heading: "'Archivo Black', 'Arial Black', sans-serif",
      body: "'Space Grotesk', 'Helvetica', sans-serif",
      mono: "'JetBrains Mono', 'Courier New', monospace",
    },
    
    fontSizes: {
      hero: 'clamp(4rem, 12vw, 8rem)',
      h1: 'clamp(3rem, 8vw, 6rem)',
      h2: 'clamp(2.5rem, 6vw, 4rem)',
      h3: 'clamp(2rem, 4vw, 3rem)',
      body: '1.25rem',
      small: '1rem',
      tiny: '0.875rem',
    },
    
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '2.5rem',
      lg: '5rem',
      xl: '8rem',
      xxl: '12rem',
    },
    
    radius: {
      none: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      full: '0',
    },
    
    shadows: {
      none: 'none',
      sm: '4px 4px 0px rgba(0, 0, 0, 1)',
      md: '8px 8px 0px rgba(0, 0, 0, 1)',
      lg: '12px 12px 0px rgba(0, 0, 0, 1)',
      xl: '20px 20px 0px rgba(0, 0, 0, 1)',
    },
    
    animations: {
      fadeIn: 'fadeIn 0.3s ease-out',
      slideUp: 'slideUp 0.4s ease-out',
      scale: 'scale 0.2s ease-out',
      glitch: 'glitch 0.3s ease-in-out',
    },
    
    light: {
      background: '#ffffff',
      surface: '#f0f0f0',
      surfaceAlt: '#e0e0e0',
      text: {
        primary: '#000000',
        secondary: '#333333',
        tertiary: '#666666',
      },
      border: '#000000',
      borderHover: '#333333',
    },
    
    dark: {
      background: '#000000',
      surface: '#1a1a1a',
      surfaceAlt: '#2a2a2a',
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
        tertiary: '#999999',
      },
      border: '#ffffff',
      borderHover: '#cccccc',
    },
  },

  // Soft Gradient - Playful, modern, friendly
  gradient: {
    id: 'gradient',
    name: 'Gradient',
    description: 'Soft gradients and friendly rounded corners',
    preview: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=300&fit=crop',
    
    fonts: {
      heading: "'Poppins', 'Segoe UI', sans-serif",
      body: "'DM Sans', 'Segoe UI', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    
    fontSizes: {
      hero: 'clamp(3.5rem, 9vw, 6rem)',
      h1: 'clamp(2.75rem, 6vw, 4.5rem)',
      h2: 'clamp(2.25rem, 5vw, 3.5rem)',
      h3: 'clamp(1.75rem, 4vw, 2.5rem)',
      body: '1.125rem',
      small: '0.9375rem',
      tiny: '0.8125rem',
    },
    
    spacing: {
      xs: '0.625rem',
      sm: '1.25rem',
      md: '2.5rem',
      lg: '4.5rem',
      xl: '7rem',
      xxl: '10rem',
    },
    
    radius: {
      none: '0',
      sm: '0.75rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      full: '9999px',
    },
    
    shadows: {
      none: 'none',
      sm: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
      md: '0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
      lg: '0 16px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06)',
      xl: '0 32px 64px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.08)',
    },
    
    animations: {
      fadeIn: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      slideUp: 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
      scale: 'scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      float: 'float 3s ease-in-out infinite',
    },
    
    // Includes gradient overlays
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      tertiary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      cool: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    },
    
    light: {
      background: '#ffffff',
      surface: '#f8f9ff',
      surfaceAlt: '#f0f2ff',
      text: {
        primary: '#2d3561',
        secondary: '#6b7aa8',
        tertiary: '#a8b3d5',
      },
      border: '#e8ebf6',
      borderHover: '#d8dceb',
    },
    
    dark: {
      background: '#0f0f23',
      surface: '#1a1b3a',
      surfaceAlt: '#252747',
      text: {
        primary: '#e8ebff',
        secondary: '#b8c0e0',
        tertiary: '#7983ab',
      },
      border: '#2a2d54',
      borderHover: '#3a3d64',
    },
  },

  // Classic Elegant - Timeless, sophisticated, editorial
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Timeless typography with sophisticated spacing',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
    
    fonts: {
      heading: "'Playfair Display', 'Georgia', serif",
      body: "'Lora', 'Georgia', serif",
      mono: "'IBM Plex Mono', 'Courier New', monospace",
    },
    
    fontSizes: {
      hero: 'clamp(3.5rem, 8vw, 6rem)',
      h1: 'clamp(3rem, 6vw, 5rem)',
      h2: 'clamp(2.5rem, 5vw, 3.5rem)',
      h3: 'clamp(2rem, 4vw, 2.5rem)',
      body: '1.125rem',
      small: '0.9375rem',
      tiny: '0.8125rem',
    },
    
    spacing: {
      xs: '0.75rem',
      sm: '1.5rem',
      md: '3rem',
      lg: '5rem',
      xl: '8rem',
      xxl: '12rem',
    },
    
    radius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.375rem',
      xl: '0.5rem',
      full: '9999px',
    },
    
    shadows: {
      none: 'none',
      sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
      md: '0 4px 6px rgba(0, 0, 0, 0.15)',
      lg: '0 10px 20px rgba(0, 0, 0, 0.18)',
      xl: '0 20px 40px rgba(0, 0, 0, 0.22)',
    },
    
    animations: {
      fadeIn: 'fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      slideUp: 'slideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
      scale: 'scale 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    
    light: {
      background: '#fafaf8',
      surface: '#ffffff',
      surfaceAlt: '#f5f5f0',
      text: {
        primary: '#2c2c2c',
        secondary: '#5a5a5a',
        tertiary: '#8a8a8a',
      },
      border: '#e0e0d8',
      borderHover: '#d0d0c8',
    },
    
    dark: {
      background: '#1a1a18',
      surface: '#252523',
      surfaceAlt: '#2f2f2d',
      text: {
        primary: '#f0f0e8',
        secondary: '#c0c0b8',
        tertiary: '#808078',
      },
      border: '#3a3a38',
      borderHover: '#4a4a48',
    },
  },

  // Retro Wave - Nostalgic, fun, vibrant
  retro: {
    id: 'retro',
    name: 'Retro Wave',
    description: 'Vibrant colors with nostalgic vibes',
    preview: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=300&fit=crop',
    
    fonts: {
      heading: "'Righteous', 'Impact', sans-serif",
      body: "'Work Sans', 'Arial', sans-serif",
      mono: "'Source Code Pro', 'Courier New', monospace",
    },
    
    fontSizes: {
      hero: 'clamp(4rem, 10vw, 7rem)',
      h1: 'clamp(3rem, 7vw, 5rem)',
      h2: 'clamp(2.5rem, 5vw, 3.5rem)',
      h3: 'clamp(2rem, 4vw, 2.5rem)',
      body: '1.125rem',
      small: '1rem',
      tiny: '0.875rem',
    },
    
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '2rem',
      lg: '4rem',
      xl: '6rem',
      xxl: '10rem',
    },
    
    radius: {
      none: '0',
      sm: '0.5rem',
      md: '1rem',
      lg: '2rem',
      xl: '3rem',
      full: '9999px',
    },
    
    shadows: {
      none: 'none',
      sm: '0 4px 6px rgba(255, 0, 255, 0.1), 0 2px 4px rgba(0, 255, 255, 0.1)',
      md: '0 8px 12px rgba(255, 0, 255, 0.15), 0 4px 8px rgba(0, 255, 255, 0.15)',
      lg: '0 16px 24px rgba(255, 0, 255, 0.2), 0 8px 16px rgba(0, 255, 255, 0.2)',
      xl: '0 32px 48px rgba(255, 0, 255, 0.25), 0 16px 32px rgba(0, 255, 255, 0.25)',
      glow: '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
    },
    
    animations: {
      fadeIn: 'fadeIn 0.6s ease-out',
      slideUp: 'slideUp 0.8s ease-out',
      scale: 'scale 0.4s ease-out',
      pulse: 'pulse 2s infinite',
      neon: 'neon 1.5s ease-in-out infinite alternate',
    },
    
    // Special retro gradients
    gradients: {
      sunset: 'linear-gradient(135deg, #ff6b9d 0%, #feca57 50%, #48dbfb 100%)',
      vaporwave: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
      miami: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
      synthwave: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    },
    
    light: {
      background: '#fef6ff',
      surface: '#fff0fe',
      surfaceAlt: '#ffe8fc',
      text: {
        primary: '#2d0f3d',
        secondary: '#6b3d8a',
        tertiary: '#9d6dbc',
      },
      border: '#f0c0ff',
      borderHover: '#e0a0ff',
    },
    
    dark: {
      background: '#0a0014',
      surface: '#1a0a2e',
      surfaceAlt: '#2a1a3e',
      text: {
        primary: '#ff71ce',
        secondary: '#01cdfe',
        tertiary: '#b967ff',
      },
      border: '#ff006e',
      borderHover: '#ff4590',
    },
  },

  // Glassmorphism - Modern, translucent, layered
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass and depth',
    preview: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=300&fit=crop',
    
    fonts: {
      heading: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'SF Mono', Monaco, monospace",
    },
    
    fontSizes: {
      hero: 'clamp(3.5rem, 8vw, 6rem)',
      h1: 'clamp(2.75rem, 6vw, 4.5rem)',
      h2: 'clamp(2.25rem, 5vw, 3.5rem)',
      h3: 'clamp(1.75rem, 4vw, 2.5rem)',
      body: '1.125rem',
      small: '0.9375rem',
      tiny: '0.8125rem',
    },
    
    spacing: {
      xs: '0.75rem',
      sm: '1.25rem',
      md: '2.5rem',
      lg: '4.5rem',
      xl: '7rem',
      xxl: '10rem',
    },
    
    radius: {
      none: '0',
      sm: '0.75rem',
      md: '1.25rem',
      lg: '1.75rem',
      xl: '2.5rem',
      full: '9999px',
    },
    
    shadows: {
      none: 'none',
      sm: '0 4px 6px rgba(0, 0, 0, 0.1)',
      md: '0 8px 16px rgba(0, 0, 0, 0.12)',
      lg: '0 16px 32px rgba(0, 0, 0, 0.15)',
      xl: '0 24px 48px rgba(0, 0, 0, 0.18)',
    },
    
    animations: {
      fadeIn: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      slideUp: 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
      scale: 'scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    
    light: {
      background: 'linear-gradient(135deg, #e3f2ff 0%, #ffeef8 100%)',
      bgSolid: '#f0f9ff',
      surface: 'rgba(255, 255, 255, 0.7)',
      surfaceAlt: 'rgba(255, 255, 255, 0.5)',
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
        tertiary: '#94a3b8',
      },
      border: 'rgba(255, 255, 255, 0.3)',
      borderHover: 'rgba(255, 255, 255, 0.5)',
    },
    
    dark: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      bgSolid: '#0f172a',
      surface: 'rgba(255, 255, 255, 0.05)',
      surfaceAlt: 'rgba(255, 255, 255, 0.08)',
      text: {
        primary: '#f1f5f9',
        secondary: '#94a3b8',
        tertiary: '#64748b',
      },
      border: 'rgba(255, 255, 255, 0.1)',
      borderHover: 'rgba(255, 255, 255, 0.2)',
    },
  },

neumorphism: {
  id: 'neumorphism',
  name: 'Neumorphism',
  description: 'Soft, subtle depth designed with modern minimalism.',
  preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',

  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "'SF Mono', Monaco, monospace",
  },

  fontSizes: {
    hero: 'clamp(3.25rem, 7vw, 5rem)',
    h1: 'clamp(2.5rem, 5.5vw, 4rem)',
    h2: 'clamp(2rem, 4.5vw, 3rem)',
    h3: 'clamp(1.6rem, 3.5vw, 2.2rem)',
    body: '1.125rem',
    small: '0.95rem',
    tiny: '0.8rem',
  },

  spacing: {
    xs: '0.65rem',
    sm: '1.1rem',
    md: '2rem',
    lg: '4rem',
    xl: '6.5rem',
    xxl: '9rem',
  },

  radius: {
    none: '0',
    sm: '0.75rem',
    md: '1.25rem',
    lg: '1.75rem',
    xl: '2.25rem',
    full: '9999px',
  },

  /**  
   * ✨ UPDATED SUBTLE SHADOWS  
   * - Reduced opacity  
   * - Reduced offset  
   * - Reduced blur for realism  
   * - Softer highlights  
   */
  shadows: {
    none: 'none',

    sm: `
      3px 3px 6px rgba(0, 0, 0, 0.10),
      -3px -3px 6px rgba(255, 255, 255, 0.65)
    `,

    md: `
      6px 6px 12px rgba(0, 0, 0, 0.12),
      -6px -6px 12px rgba(255, 255, 255, 0.55)
    `,

    lg: `
      10px 10px 20px rgba(0, 0, 0, 0.14),
      -10px -10px 20px rgba(255, 255, 255, 0.50)
    `,

    xl: `
      14px 14px 28px rgba(0, 0, 0, 0.16),
      -14px -14px 28px rgba(255, 255, 255, 0.45)
    `,

    inset: `
      inset 3px 3px 6px rgba(0, 0, 0, 0.15),
      inset -3px -3px 6px rgba(255, 255, 255, 0.55)
    `,
  },

  animations: {
    fadeIn: 'fadeIn 0.5s ease-out',
    slideUp: 'slideUp 0.7s ease-out',
    scale: 'scale 0.25s ease-out',
  },

  /**
   * Updated Color Palette
   * - Slightly cooler hues
   * - Lower contrast between layers
   * - More realistic neumorphic planes
   */
  colors: {
    light: {
      background: '#e5e9f0',
      surface: '#e7ebf2',
      surfaceAlt: '#f2f5fa',
      text: {
        primary: '#2e2e2e',
        secondary: '#676767',
        tertiary: '#9a9a9a',
      },
      border: '#d3d8e0',
      borderHover: '#c6ccd6',
    },

    dark: {
      background: '#1d1f25',
      surface: '#1f2127',
      surfaceAlt: '#292b33',
      text: {
        primary: '#f2f2f2',
        secondary: '#b0b0b0',
        tertiary: '#7c7c7c',
      },
      border: '#15171c',
      borderHover: '#2a2d34',
    },
  },
}

};

// Helper function to generate CSS variables from a theme
export function generateThemeCSS(theme, colorMode = 'light') {
  const colors = theme[colorMode];
  
  return `
    :root {
      /* Typography */
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};
      --font-mono: ${theme.fonts.mono};
      
      /* Font Sizes */
      --text-hero: ${theme.fontSizes.hero};
      --text-h1: ${theme.fontSizes.h1};
      --text-h2: ${theme.fontSizes.h2};
      --text-h3: ${theme.fontSizes.h3};
      --text-body: ${theme.fontSizes.body};
      --text-small: ${theme.fontSizes.small};
      --text-tiny: ${theme.fontSizes.tiny};
      
      /* Spacing */
      --space-xs: ${theme.spacing.xs};
      --space-sm: ${theme.spacing.sm};
      --space-md: ${theme.spacing.md};
      --space-lg: ${theme.spacing.lg};
      --space-xl: ${theme.spacing.xl};
      --space-xxl: ${theme.spacing.xxl};
      
      /* Border Radius */
      --radius-none: ${theme.radius.none};
      --radius-sm: ${theme.radius.sm};
      --radius-md: ${theme.radius.md};
      --radius-lg: ${theme.radius.lg};
      --radius-xl: ${theme.radius.xl};
      --radius-full: ${theme.radius.full};
      
      /* Shadows */
      --shadow-none: ${theme.shadows.none};
      --shadow-sm: ${theme.shadows.sm};
      --shadow-md: ${theme.shadows.md};
      --shadow-lg: ${theme.shadows.lg};
      --shadow-xl: ${theme.shadows.xl};
      ${theme.shadows.glow ? `--shadow-glow: ${theme.shadows.glow};` : ''}
      ${theme.shadows.inset ? `--shadow-inset: ${theme.shadows.inset};` : ''}
      
      /* Colors */
      --color-bg: ${colors.background};
      --color-surface: ${colors.surface};
      --color-surface-alt: ${colors.surfaceAlt};
      --color-text: ${colors.text.primary};
      --color-text-secondary: ${colors.text.secondary};
      --color-text-tertiary: ${colors.text.tertiary};
      --color-border: ${colors.border};
      --color-border-hover: ${colors.borderHover};
      
      /* Gradients (if available) */
      ${theme.gradients ? Object.entries(theme.gradients).map(([key, value]) => 
        `--gradient-${key}: ${value};`
      ).join('\n      ') : ''}
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
    ` : ''}
    
    ${theme.id === 'gradient' ? `
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

// Export theme IDs for easy reference
export const THEME_IDS = {
  MINIMAL: 'minimal',
  BRUTALIST: 'brutalist',
  GRADIENT: 'gradient',
  ELEGANT: 'elegant',
  RETRO: 'retro',
  GLASSMORPHISM: 'glassmorphism',
  NEUMORPHISM: 'neumorphism',
};

// Get theme by ID
export function getTheme(themeId) {
  return styleThemes[themeId] || styleThemes.minimal;
}

// Get all theme options for display
export function getAllThemes() {
  return Object.values(styleThemes).map(theme => ({
    id: theme.id,
    name: theme.name,
    description: theme.description,
    preview: theme.preview,
  }));
}