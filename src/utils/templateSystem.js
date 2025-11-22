// templateSystem.js - Quality over quantity approach
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
  }

  render(customization, theme, colorMode = 'auto') {
    const normalizedColorMode = (colorMode || 'auto').toLowerCase();
    const themeCSS = generateThemeCSS(theme, normalizedColorMode === 'auto' ? 'light' : normalizedColorMode);
    const darkModeCSS = normalizedColorMode === 'auto' ? generateThemeCSS(theme, 'dark') : '';
    const html = this.structure(customization, theme);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${customization.title || this.name}</title>
  ${this.getFontImports(theme)}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    ${themeCSS}
    
    ${normalizedColorMode === 'auto' ? `@media (prefers-color-scheme: dark) { ${darkModeCSS} }` : ''}
    ${normalizedColorMode === 'dark' ? darkModeCSS : ''}
    
    body {
      font-family: var(--font-body);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--text-body);
      line-height: 1.6;
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

  getThemeSpecificCSS(theme) {
    const base = `
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
      brutalist: `
        .btn {
          border: 3px solid var(--color-text);
          text-transform: uppercase;
        }
        .btn:hover {
          transform: translate(-4px, -4px);
          box-shadow: var(--shadow-md);
        }
        .card {
          border: 3px solid var(--color-border);
        }
        .card:hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0 var(--color-border);
        }
      `,
      gradient: `
        .btn {
          background: var(--gradient-primary);
          border: none;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-primary);
          opacity: 0.05;
          z-index: 0;
        }
      `,
      retro: `
        h1, h2 {
          text-shadow: 3px 3px 0 var(--color-accent);
        }
        .btn {
          background: var(--gradient-vaporwave);
          border: 2px solid var(--color-border);
          box-shadow: 4px 4px 0 var(--color-text);
        }
        .btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--color-text);
        }
      `,
      elegant: `
        h1, h2 {
          font-weight: 400;
          letter-spacing: -0.02em;
        }
        .btn {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text);
        }
        .btn:hover {
          background: var(--color-text);
          color: var(--color-bg);
        }
      `,
      glassmorphism: `
        .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .btn {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `,
      neumorphism: `
        .card {
          box-shadow: var(--shadow-sm);
        }
        .card:hover {
          box-shadow: var(--shadow-inset);
        }
        .btn {
          box-shadow: var(--shadow-sm);
          border: none;
        }
        .btn:hover {
          box-shadow: var(--shadow-inset);
        }
      `,
    };

    return base + (themeSpecific[theme.id] || '');
  }
}

// ============================================
// TEMPLATE 1: LANDING PAGE
// ============================================
export const templates = {
  'landing-page': new Template('landing-page', {
    name: 'Landing Page',
    description: 'Complete landing page with hero, features, and CTA',
    category: 'Landing Page',
    fields: {
      companyName: { type: 'text', default: 'ACME', label: 'Company Name', required: true },
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
    structure: (data) => `
      <header style="padding: 1.5rem 0; border-bottom: 1px solid var(--color-border);">
        <div class="container">
          <nav style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 600; font-size: 1.125rem; letter-spacing: -0.02em;">${data.companyName || 'ACME'}</div>
            <ul style="display: flex; gap: 2rem; list-style: none;">
              <li><a href="#features" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Features</a></li>
              <li><a href="#testimonial" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Reviews</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <!-- Hero -->
        <section class="hero" style="padding: 8rem 0 6rem; text-align: center; position: relative;">
          <div class="container">
            <h1 style="font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.5rem;">
              ${data.headline || 'Your Headline'}
            </h1>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 3rem; line-height: 1.8;">
              ${data.subheadline || ''}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              ${data.ctaPrimary ? `<a href="#" class="btn">${data.ctaPrimary}</a>` : ''}
              ${data.ctaSecondary ? `<a href="#" class="btn btn-outline">${data.ctaSecondary}</a>` : ''}
            </div>
          </div>
        </section>

        <!-- Stats -->
        ${data.stats && data.stats.length > 0 ? `
        <section style="padding: 4rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
          <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
              ${data.stats.map(stat => `
                <div>
                  <h3 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-accent);">${stat.number}</h3>
                  <p style="color: var(--color-text-secondary); font-size: 0.875rem;">${stat.label}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
        ` : ''}

        <!-- Features -->
        <section id="features" style="padding: 6rem 0;">
          <div class="container">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; text-align: center; margin-bottom: 1rem; letter-spacing: -0.02em;">
              ${data.featuresTitle || 'Features'}
            </h2>
            <p style="text-align: center; color: var(--color-text-secondary); max-width: 600px; margin: 0 auto 4rem; font-size: 1.125rem;">
              ${data.featuresSubtitle || ''}
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
              ${data.features && data.features.length > 0 ? data.features.map(feature => `
                <div class="card">
                  <div style="width: 48px; height: 48px; background: var(--color-accent); border-radius: var(--radius-md); margin-bottom: 1.5rem; opacity: 0.1;"></div>
                  <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">${feature.title || ''}</h3>
                  <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem;">${feature.description || ''}</p>
                </div>
              `).join('') : ''}
            </div>
          </div>
        </section>

        <!-- Testimonial -->
        ${data.testimonialQuote ? `
        <section id="testimonial" style="padding: 6rem 0; background: var(--color-surface); text-align: center;">
          <div class="container">
            <p style="font-size: 1.5rem; line-height: 1.8; max-width: 800px; margin: 0 auto 2rem; font-weight: 500;">
              ${data.testimonialQuote}
            </p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-accent); opacity: 0.2;"></div>
              <div style="text-align: left;">
                <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${data.testimonialAuthor || ''}</h4>
                <p style="color: var(--color-text-secondary); font-size: 0.875rem;">${data.testimonialRole || ''}</p>
              </div>
            </div>
          </div>
        </section>
        ` : ''}
      </main>

      <footer style="padding: 3rem 0; border-top: 1px solid var(--color-border); text-align: center; color: var(--color-text-secondary); font-size: 0.875rem;">
        <div class="container">
          <p>Â© 2024 ${data.companyName || 'Company'}. All rights reserved.</p>
        </div>
      </footer>
    `
  }),

  // ============================================
  // TEMPLATE 2: PERSONAL PROFILE
  // ============================================
  'personal-profile': new Template('personal-profile', {
    name: 'Personal Profile',
    description: 'Elegant personal introduction page',
    category: 'Personal',
    fields: {
      name: { type: 'text', default: 'Jordan Rivers', label: 'Your Name', required: true },
      tagline: { type: 'text', default: 'Product Designer & Creative', label: 'Tagline' },
      bio: { 
        type: 'textarea',
        default: 'I create meaningful digital experiences that connect people and solve real problems. With a passion for clean design and user-centered thinking.',
        label: 'Bio'
      },
      skills: {
        type: 'repeatable',
        label: 'Skills',
        itemLabel: 'Skill',
        default: ['UI Design', 'Prototyping', 'User Research', 'Design Systems'],
        max: 8
      },
      projects: {
        type: 'group',
        label: 'Featured Projects',
        itemLabel: 'Project',
        min: 0,
        max: 3,
        fields: {
          title: { type: 'text', label: 'Project Title', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          tags: { type: 'text', label: 'Tags (comma-separated)', default: '' }
        },
        default: [
          { title: 'Mobile Banking App', description: 'Redesigned the core banking experience for 2M+ users', tags: 'UI/UX, Mobile' },
          { title: 'E-commerce Platform', description: 'Built a design system that increased conversion by 40%', tags: 'Design System, Web' }
        ]
      },
      contactEmail: { type: 'email', default: 'hello@jordan.com', label: 'Contact Email' },
      socialLinks: {
        type: 'group',
        label: 'Social Links',
        itemLabel: 'Link',
        min: 0,
        max: 4,
        fields: {
          platform: { type: 'text', label: 'Platform', default: '' },
          url: { type: 'url', label: 'URL', default: '' }
        },
        default: [
          { platform: 'Twitter', url: 'https://twitter.com' },
          { platform: 'LinkedIn', url: 'https://linkedin.com' }
        ]
      }
    },
    structure: (data) => `
      <!-- Hero Section -->
      <section style="min-height: 80vh; display: flex; align-items: center; padding: var(--space-xxl) 0;">
        <div class="container" style="max-width: 900px;">
          <div style="margin-bottom: var(--space-xl);">
            <h1 style="font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; margin-bottom: var(--space-md); letter-spacing: -0.02em;">
              ${data.name || 'Your Name'}
            </h1>
            ${data.tagline ? `
            <p style="font-size: clamp(1.25rem, 3vw, 1.75rem); color: var(--color-text-secondary); margin-bottom: var(--space-lg);">
              ${data.tagline}
            </p>
            ` : ''}
            ${data.bio ? `
            <p style="font-size: 1.125rem; line-height: 1.8; color: var(--color-text-secondary); max-width: 700px; margin-bottom: var(--space-xl);">
              ${data.bio}
            </p>
            ` : ''}

            <!-- Social Links -->
            ${data.socialLinks && data.socialLinks.length > 0 ? `
            <div style="display: flex; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-xl);">
              ${data.socialLinks.map(link => `
                <a href="${link.url}" target="_blank" class="btn btn-outline" style="font-size: 0.9375rem;">
                  ${link.platform}
                </a>
              `).join('')}
            </div>
            ` : ''}
          </div>

          <!-- Skills -->
          ${data.skills && data.skills.length > 0 ? `
          <div style="margin-bottom: var(--space-xxl);">
            <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-md); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary);">
              Skills
            </h2>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
              ${data.skills.map(skill => `
                <span style="padding: var(--space-sm) var(--space-md); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-weight: 500; font-size: 0.9375rem;">
                  ${skill}
                </span>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Projects -->
          ${data.projects && data.projects.length > 0 ? `
          <div style="margin-bottom: var(--space-xxl);">
            <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: var(--space-lg); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary);">
              Featured Work
            </h2>
            <div style="display: grid; gap: var(--space-lg);">
              ${data.projects.map(project => `
                <div class="card" style="padding: var(--space-lg);">
                  <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: var(--space-sm);">
                    ${project.title || 'Project'}
                  </h3>
                  <p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: var(--space-md); font-size: 1rem;">
                    ${project.description || ''}
                  </p>
                  ${project.tags ? `
                  <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                    ${project.tags.split(',').map(tag => `
                      <span style="padding: 0.375rem 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.8125rem; color: var(--color-text-secondary);">
                        ${tag.trim()}
                      </span>
                    `).join('')}
                  </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Contact CTA -->
          ${data.contactEmail ? `
          <div style="text-align: center; padding: var(--space-xxl) var(--space-xl); background: var(--color-surface); border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
            <h2 style="font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; margin-bottom: var(--space-md);">
              Let's Work Together
            </h2>
            <p style="color: var(--color-text-secondary); margin-bottom: var(--space-lg); font-size: 1.0625rem;">
              Have a project in mind? I'd love to hear about it.
            </p>
            <a href="mailto:${data.contactEmail}" class="btn" style="font-size: 1rem; padding: var(--space-md) var(--space-xl);">
              Get in Touch
            </a>
          </div>
          ` : ''}
        </div>
      </section>

      <footer style="padding: var(--space-xl) 0; border-top: 1px solid var(--color-border); text-align: center;">
        <div class="container">
          <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
            Â© 2024 ${data.name || 'Your Name'}
          </p>
        </div>
      </footer>
    `
  }),

  // ============================================
  // TEMPLATE 3: PORTFOLIO SHOWCASE
  // ============================================
  'portfolio-showcase': new Template('portfolio-showcase', {
    name: 'Portfolio Showcase',
    description: 'Modern portfolio with project grid and detailed case studies',
    category: 'Portfolio',
    fields: {
      name: { type: 'text', default: 'Alex Morgan', label: 'Your Name', required: true },
      title: { type: 'text', default: 'Creative Developer & Designer', label: 'Professional Title' },
      bio: { 
        type: 'textarea',
        default: 'I craft digital experiences that blend aesthetics with functionality. Specializing in interactive web applications and user-centered design.',
        label: 'Bio'
      },
      heroImage: { type: 'text', default: '', label: 'Hero Image URL', optional: true },
      
      about: {
        type: 'textarea',
        default: 'With 5+ years of experience in digital design and development, I\'ve worked with startups and established brands to create compelling digital experiences. My approach combines technical expertise with creative problem-solving to deliver solutions that resonate with users.',
        label: 'About Section'
      },
      
      services: {
        type: 'group',
        label: 'Services',
        itemLabel: 'Service',
        min: 1,
        max: 6,
        fields: {
          title: { type: 'text', label: 'Service Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' }
        },
        default: [
          { title: 'Web Development', description: 'Building responsive, performant websites with modern technologies' },
          { title: 'UI/UX Design', description: 'Creating intuitive interfaces that users love' },
          { title: 'Brand Identity', description: 'Developing cohesive visual identities that tell your story' }
        ]
      },
      
      projects: {
        type: 'group',
        label: 'Featured Projects',
        itemLabel: 'Project',
        min: 1,
        max: 9,
        fields: {
          title: { type: 'text', label: 'Project Title', default: '' },
          category: { type: 'text', label: 'Category', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          tags: { type: 'text', label: 'Tags (comma-separated)', default: '' },
          year: { type: 'text', label: 'Year', default: '2024' }
        },
        default: [
          { title: 'E-Commerce Platform', category: 'Web Development', description: 'Full-stack marketplace with real-time inventory management', tags: 'React, Node.js, MongoDB', year: '2024' },
          { title: 'Brand Redesign', category: 'Design', description: 'Complete visual identity refresh for tech startup', tags: 'Branding, UI/UX', year: '2024' },
          { title: 'Mobile Banking App', category: 'App Design', description: 'Intuitive banking experience for 100K+ users', tags: 'Mobile, Fintech', year: '2023' }
        ]
      },
      
      skills: {
        type: 'group',
        label: 'Skills',
        itemLabel: 'Skill Category',
        min: 0,
        max: 4,
        fields: {
          category: { type: 'text', label: 'Category', default: '' },
          items: { type: 'text', label: 'Skills (comma-separated)', default: '' }
        },
        default: [
          { category: 'Design', items: 'Figma, Adobe XD, Sketch, Photoshop' },
          { category: 'Development', items: 'React, Vue, Node.js, TypeScript' },
          { category: 'Tools', items: 'Git, Webpack, Docker, AWS' }
        ]
      },
      
      contactEmail: { type: 'email', default: 'hello@alexmorgan.com', label: 'Contact Email' },
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
          { platform: 'GitHub', url: 'https://github.com' },
          { platform: 'LinkedIn', url: 'https://linkedin.com' },
          { platform: 'Dribbble', url: 'https://dribbble.com' }
        ]
      }
    },
    structure: (data) => `
      <!-- Navigation -->
      <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--color-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--color-border); padding: 1.25rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <a href="#" style="font-weight: 700; font-size: 1.125rem; text-decoration: none; color: var(--color-text);">${data.name || 'Portfolio'}</a>
            <div style="display: flex; gap: 2.5rem; align-items: center;">
              <a href="#work" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: color 0.2s;">Work</a>
              <a href="#about" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: color 0.2s;">About</a>
              <a href="#contact" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: color 0.2s;">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section style="min-height: 100vh; display: flex; align-items: center; padding: 8rem 0 4rem; background: var(--color-bg);">
        <div class="container" style="max-width: 1400px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center;">
            <div>
              <div style="display: inline-block; padding: 0.5rem 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.8125rem; font-weight: 600; margin-bottom: 2rem; color: var(--color-text-secondary);">
                AVAILABLE FOR WORK
              </div>
              <h1 style="font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -0.03em;">
                ${data.name || 'Your Name'}
              </h1>
              <p style="font-size: clamp(1.25rem, 2.5vw, 1.75rem); color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: 500;">
                ${data.title || 'Your Title'}
              </p>
              <p style="font-size: 1.125rem; color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 3rem; max-width: 600px;">
                ${data.bio || ''}
              </p>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="#contact" class="btn" style="padding: 1rem 2rem;">Get in Touch</a>
                <a href="#work" class="btn btn-outline" style="padding: 1rem 2rem;">View Work</a>
              </div>
            </div>
            <div style="position: relative;">
              <div style="aspect-ratio: 1; background: linear-gradient(135deg, var(--color-accent, #667eea) 0%, var(--color-text-secondary) 100%); border-radius: var(--radius-xl); opacity: 0.1;"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services -->
      ${data.services && data.services.length > 0 ? `
      <section style="padding: 6rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1400px;">
          <h2 style="font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; margin-bottom: 4rem; text-align: center; letter-spacing: -0.02em;">What I Do</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${data.services.map((service, idx) => `
              <div style="padding: 2.5rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg); transition: all 0.3s;">
                <div style="width: 48px; height: 48px; background: var(--color-surface); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700; color: var(--color-text-secondary);">
                  ${(idx + 1).toString().padStart(2, '0')}
                </div>
                <h3 style="font-size: 1.375rem; font-weight: 600; margin-bottom: 1rem;">${service.title || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8; font-size: 1rem;">${service.description || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Projects -->
      <section id="work" style="padding: 8rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Featured Work</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">A selection of projects I'm proud of</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem;">
            ${data.projects && data.projects.length > 0 ? data.projects.map(project => `
              <div class="card" style="overflow: hidden; cursor: pointer; padding: 0;">
                <div style="aspect-ratio: 16/10; background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-border) 100%); position: relative; overflow: hidden;">
                  <div style="position: absolute; top: 1rem; right: 1rem; padding: 0.375rem 0.75rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600;">
                    ${project.year || '2024'}
                  </div>
                </div>
                <div style="padding: 2rem;">
                  ${project.category ? `
                  <div style="font-size: 0.8125rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
                    ${project.category}
                  </div>
                  ` : ''}
                  <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem;">${project.title || ''}</h3>
                  <p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1rem; font-size: 0.9375rem;">${project.description || ''}</p>
                  ${project.tags ? `
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${project.tags.split(',').map(tag => `
                      <span style="padding: 0.25rem 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 500;">
                        ${tag.trim()}
                      </span>
                    `).join('')}
                  </div>
                  ` : ''}
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- About & Skills -->
      <section id="about" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start;">
            <div>
              <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 2rem; letter-spacing: -0.02em;">About Me</h2>
              <p style="font-size: 1.125rem; color: var(--color-text-secondary); line-height: 1.9; margin-bottom: 2rem;">
                ${data.about || ''}
              </p>
              ${data.contactEmail ? `
              <a href="mailto:${data.contactEmail}" class="btn" style="display: inline-flex; padding: 1rem 2rem;">
                Let's Talk
              </a>
              ` : ''}
            </div>
            
            ${data.skills && data.skills.length > 0 ? `
            <div>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Skills & Tools</h3>
              <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${data.skills.map(skill => `
                  <div>
                    <h4 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); margin-bottom: 1rem;">
                      ${skill.category || ''}
                    </h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                      ${skill.items ? skill.items.split(',').map(item => `
                        <span style="padding: 0.5rem 1rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.9375rem; font-weight: 500;">
                          ${item.trim()}
                        </span>
                      `).join('') : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Contact -->
      <section id="contact" style="padding: 8rem 0;">
        <div class="container" style="max-width: 800px; text-align: center;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 2rem; letter-spacing: -0.02em;">
            Let's Create Something Amazing
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.8;">
            Have a project in mind? I'm always interested in hearing about new opportunities and collaborations.
          </p>
          
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem;">
            ${data.contactEmail ? `
            <a href="mailto:${data.contactEmail}" class="btn" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">
              Send a Message
            </a>
            ` : ''}
          </div>

          ${data.socialLinks && data.socialLinks.length > 0 ? `
          <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
            ${data.socialLinks.map(link => `
              <a href="${link.url}" target="_blank" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='var(--color-text)'" onmouseout="this.style.color='var(--color-text-secondary)'">
                ${link.platform}
              </a>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; border-top: 1px solid var(--color-border); text-align: center;">
        <div class="container">
          <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
            © 2024 ${data.name || 'Portfolio'}. Designed & Developed with passion.
          </p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          nav > div > div:last-child { display: none; }
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { 
            grid-template-columns: 1fr !important; 
            gap: 3rem !important; 
          }
          .card { margin-bottom: 1rem; }
        }
        @media (max-width: 1024px) {
          section > div > div[style*="grid-template-columns: 1fr 1fr"] { 
            gap: 4rem !important; 
          }
        }
      </style>
    `
  }),

  // ============================================
  // TEMPLATE 4: SAAS LANDING PAGE
  // ============================================
  'saas-landing': new Template('saas-landing', {
    name: 'SaaS Landing Page',
    description: 'Complete SaaS landing with features, pricing, and testimonials',
    category: 'Landing Page',
    fields: {
      productName: { type: 'text', default: 'CloudFlow', label: 'Product Name', required: true },
      tagline: { type: 'text', default: 'Workflow Automation Made Simple', label: 'Tagline' },
      headline: { 
        type: 'text',
        default: 'Automate Your Workflow, Focus on What Matters',
        label: 'Hero Headline',
        required: true
      },
      subheadline: { 
        type: 'textarea',
        default: 'Connect your tools, automate repetitive tasks, and save hours every week. No coding required.',
        label: 'Hero Subheadline'
      },
      ctaPrimary: { type: 'text', default: 'Start Free Trial', label: 'Primary CTA' },
      ctaSecondary: { type: 'text', default: 'Watch Demo', label: 'Secondary CTA' },
      
      trustBadges: {
        type: 'repeatable',
        label: 'Trust Indicators',
        itemLabel: 'Badge',
        default: ['500K+ Users', 'SOC 2 Certified', '99.9% Uptime', '24/7 Support'],
        max: 6
      },
      
      features: {
        type: 'group',
        label: 'Key Features',
        itemLabel: 'Feature',
        min: 1,
        max: 8,
        fields: {
          title: { type: 'text', label: 'Feature Title', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          icon: { type: 'text', label: 'Icon (emoji)', default: '⚡' }
        },
        default: [
          { title: 'No-Code Automation', description: 'Build powerful workflows without writing a single line of code', icon: '🔧' },
          { title: 'Pre-built Templates', description: 'Get started instantly with 100+ ready-to-use templates', icon: '📋' },
          { title: 'Real-time Sync', description: 'Keep all your tools in perfect sync automatically', icon: '🔄' },
          { title: 'Team Collaboration', description: 'Work together seamlessly with built-in collaboration tools', icon: '👥' },
          { title: 'Advanced Analytics', description: 'Track performance and optimize your workflows with detailed insights', icon: '📊' },
          { title: 'Enterprise Security', description: 'Bank-level encryption and compliance with industry standards', icon: '🔒' }
        ]
      },
      
      pricingPlans: {
        type: 'group',
        label: 'Pricing Plans',
        itemLabel: 'Plan',
        min: 1,
        max: 4,
        fields: {
          name: { type: 'text', label: 'Plan Name', default: '' },
          price: { type: 'text', label: 'Price', default: '' },
          period: { type: 'text', label: 'Billing Period', default: '/month' },
          description: { type: 'textarea', label: 'Description', default: '' },
          features: { type: 'text', label: 'Features (comma-separated)', default: '' },
          highlighted: { type: 'select', label: 'Highlight Plan', options: ['No', 'Yes'], default: 'No' }
        },
        default: [
          { name: 'Starter', price: '$0', period: '/month', description: 'Perfect for trying out CloudFlow', features: '100 tasks/month, 5 workflows, Email support', highlighted: 'No' },
          { name: 'Professional', price: '$29', period: '/month', description: 'For growing teams and businesses', features: '10,000 tasks/month, Unlimited workflows, Priority support, Advanced analytics', highlighted: 'Yes' },
          { name: 'Enterprise', price: 'Custom', period: '', description: 'For large organizations', features: 'Unlimited everything, Dedicated account manager, Custom integrations, SLA guarantee', highlighted: 'No' }
        ]
      },
      
      testimonials: {
        type: 'group',
        label: 'Customer Testimonials',
        itemLabel: 'Testimonial',
        min: 0,
        max: 6,
        fields: {
          quote: { type: 'textarea', label: 'Quote', default: '' },
          author: { type: 'text', label: 'Author Name', default: '' },
          role: { type: 'text', label: 'Role & Company', default: '' },
          rating: { type: 'select', label: 'Rating', options: ['5', '4', '3'], default: '5' }
        },
        default: [
          { quote: 'CloudFlow saved us 15 hours per week. The ROI was immediate and the team loves how easy it is to use.', author: 'Sarah Chen', role: 'Operations Manager, TechCorp', rating: '5' },
          { quote: 'Best automation tool we\'ve used. The no-code approach means everyone on the team can create workflows.', author: 'Marcus Rodriguez', role: 'CTO, StartupXYZ', rating: '5' },
          { quote: 'The customer support is outstanding. They helped us migrate our entire workflow in just a day.', author: 'Emily Watson', role: 'Product Lead, Innovate Inc', rating: '5' }
        ]
      },
      
      faqItems: {
        type: 'group',
        label: 'FAQ Items',
        itemLabel: 'Question',
        min: 0,
        max: 8,
        fields: {
          question: { type: 'text', label: 'Question', default: '' },
          answer: { type: 'textarea', label: 'Answer', default: '' }
        },
        default: [
          { question: 'Do I need coding skills to use CloudFlow?', answer: 'Not at all! CloudFlow is designed for everyone. Our visual workflow builder makes it easy to create powerful automations without writing code.' },
          { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time. No contracts, no commitments.' },
          { question: 'What integrations do you support?', answer: 'We support 500+ integrations including Gmail, Slack, Salesforce, Google Sheets, and more. We\'re constantly adding new integrations.' }
        ]
      },
      
      contactEmail: { type: 'email', default: 'hello@cloudflow.com', label: 'Contact Email' }
    },
    structure: (data) => `
      <!-- Navigation -->
      <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--color-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--color-border); padding: 1rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 3rem;">
              <a href="#" style="font-weight: 700; font-size: 1.25rem; text-decoration: none; color: var(--color-text);">${data.productName || 'Product'}</a>
              <div style="display: flex; gap: 2rem;">
                <a href="#features" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Features</a>
                <a href="#pricing" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Pricing</a>
                <a href="#testimonials" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Reviews</a>
              </div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Sign In</a>
              <a href="#" class="btn" style="padding: 0.75rem 1.5rem; font-size: 0.9375rem;">${data.ctaPrimary || 'Get Started'}</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section style="padding: 10rem 0 6rem; background: var(--color-bg); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; opacity: 0.03; background: radial-gradient(circle at 50% 50%, var(--color-accent, #667eea) 0%, transparent 50%);"></div>
        <div class="container" style="max-width: 1200px; position: relative;">
          <div style="text-align: center; max-width: 900px; margin: 0 auto;">
            ${data.tagline ? `
            <div style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600; margin-bottom: 2rem; color: var(--color-text-secondary);">
              ${data.tagline}
            </div>
            ` : ''}
            <h1 style="font-size: clamp(2.5rem, 7vw, 5.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 2rem; letter-spacing: -0.03em;">
              ${data.headline || 'Your Headline Here'}
            </h1>
            <p style="font-size: clamp(1.125rem, 2vw, 1.375rem); color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
              ${data.subheadline || ''}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem;">
              ${data.ctaPrimary ? `<a href="#" class="btn" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">${data.ctaPrimary}</a>` : ''}
              ${data.ctaSecondary ? `<a href="#" class="btn btn-outline" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">${data.ctaSecondary}</a>` : ''}
            </div>
            
            ${data.trustBadges && data.trustBadges.length > 0 ? `
            <div style="display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; padding-top: 2rem; border-top: 1px solid var(--color-border);">
              ${data.trustBadges.map(badge => `
                <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary);">
                  ${badge}
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1400px;">
          <div style="text-align: center; margin-bottom: 5rem; max-width: 700px; margin-left: auto; margin-right: auto;">
            <h2 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Everything You Need
            </h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary); line-height: 1.7;">
              Powerful features that help you work smarter, not harder
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            ${data.features && data.features.length > 0 ? data.features.map(feature => `
              <div class="card" style="padding: 2.5rem; text-align: center;">
                <div style="width: 64px; height: 64px; background: var(--color-surface); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2rem; border: 1px solid var(--color-border);">
                  ${feature.icon || '✨'}
                </div>
                <h3 style="font-size: 1.375rem; font-weight: 600; margin-bottom: 1rem;">${feature.title || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8; font-size: 1rem;">${feature.description || ''}</p>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section id="pricing" style="padding: 8rem 0;">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Simple, Transparent Pricing
            </h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">
              Choose the perfect plan for your needs
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
            ${data.pricingPlans && data.pricingPlans.length > 0 ? data.pricingPlans.map(plan => `
              <div class="card" style="padding: 3rem 2.5rem; text-align: center; ${plan.highlighted === 'Yes' ? 'border: 2px solid var(--color-accent, #667eea); box-shadow: 0 12px 40px rgba(0,0,0,0.12);' : ''}">
                ${plan.highlighted === 'Yes' ? `
                <div style="display: inline-block; padding: 0.375rem 1rem; background: var(--color-accent, #667eea); color: white; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                  MOST POPULAR
                </div>
                ` : '<div style="height: 2.5rem;"></div>'}
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">${plan.name || ''}</h3>
                <div style="margin-bottom: 1rem;">
                  <span style="font-size: 3.5rem; font-weight: 800; letter-spacing: -0.02em;">${plan.price || ''}</span>
                  ${plan.period ? `<span style="font-size: 1.125rem; color: var(--color-text-secondary);">${plan.period}</span>` : ''}
                </div>
                <p style="color: var(--color-text-secondary); margin-bottom: 2rem; min-height: 3em; line-height: 1.6;">
                  ${plan.description || ''}
                </p>
                <a href="#" class="btn ${plan.highlighted === 'Yes' ? '' : 'btn-outline'}" style="width: 100%; padding: 1rem; margin-bottom: 2rem; font-size: 1rem;">
                  ${plan.highlighted === 'Yes' ? 'Start Free Trial' : 'Get Started'}
                </a>
                ${plan.features ? `
                <div style="text-align: left; padding-top: 2rem; border-top: 1px solid var(--color-border);">
                  ${plan.features.split(',').map(feature => `
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.9375rem;">
                      <span style="color: var(--color-accent, #667eea); font-weight: 700; flex-shrink: 0;">✓</span>
                      <span style="color: var(--color-text-secondary); line-height: 1.6;">${feature.trim()}</span>
                    </div>
                  `).join('')}
                </div>
                ` : ''}
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      ${data.testimonials && data.testimonials.length > 0 ? `
      <section id="testimonials" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Loved by Teams Worldwide
            </h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">
              See what our customers have to say
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
            ${data.testimonials.map(testimonial => `
              <div class="card" style="padding: 2.5rem;">
                <div style="display: flex; gap: 0.25rem; margin-bottom: 1.5rem;">
                  ${Array(parseInt(testimonial.rating || 5)).fill('⭐').join('')}
                </div>
                <p style="font-size: 1.0625rem; line-height: 1.8; margin-bottom: 1.5rem; color: var(--color-text);">
                  "${testimonial.quote || ''}"
                </p>
                <div style="display: flex; align-items: center; gap: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-surface); border: 1px solid var(--color-border);"></div>
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

      <!-- FAQ -->
      ${data.faqItems && data.faqItems.length > 0 ? `
      <section style="padding: 8rem 0;">
        <div class="container" style="max-width: 800px;">
          <div style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${data.faqItems.map(faq => `
              <div style="padding: 2rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg);">
                <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">${faq.question || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 1rem;">${faq.answer || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Final CTA -->
      <section style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 800px; text-align: center;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.02em;">
            Ready to Get Started?
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
            Join thousands of teams already using ${data.productName || 'our platform'} to automate their workflows
          </p>
          <a href="#" class="btn" style="padding: 1.25rem 3rem; font-size: 1.125rem;">
            ${data.ctaPrimary || 'Start Free Trial'}
          </a>
          <p style="margin-top: 1.5rem; font-size: 0.875rem; color: var(--color-text-secondary);">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 4rem 0; background: var(--color-bg);">
        <div class="container" style="max-width: 1400px;">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem; margin-bottom: 3rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.25rem; margin-bottom: 1rem;">${data.productName || 'Product'}</h3>
              <p style="color: var(--color-text-secondary); font-size: 0.9375rem; line-height: 1.7; margin-bottom: 1.5rem;">
                ${data.tagline || 'Making work simpler'}
              </p>
              ${data.contactEmail ? `
              <a href="mailto:${data.contactEmail}" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">${data.contactEmail}</a>
              ` : ''}
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 1rem; font-size: 0.875rem;">Product</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="#features" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Features</a>
                <a href="#pricing" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Pricing</a>
                <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Integrations</a>
              </div>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 1rem; font-size: 0.875rem;">Company</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">About</a>
                <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Blog</a>
                <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Careers</a>
              </div>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 1rem; font-size: 0.875rem;">Legal</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Privacy</a>
                <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Terms</a>
                <a href="#" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.875rem;">Security</a>
              </div>
            </div>
          </div>
          <div style="padding-top: 2rem; border-top: 1px solid var(--color-border); text-align: center;">
            <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
              © 2024 ${data.productName || 'Product'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          nav > div > div:first-child > div:last-child,
          nav > div > div:last-child > a:first-child { display: none; }
          footer > div > div:first-child { 
            grid-template-columns: 1fr !important; 
            gap: 2rem !important; 
          }
        }
        @media (max-width: 1024px) {
          nav > div > div:first-child > div { display: none; }
        }
      </style>
    `
  }),

  // ============================================
  // TEMPLATE 5: BUSINESS CONSULTING
  // ============================================
  'business-consulting': new Template('business-consulting', {
    name: 'Business Consulting',
    description: 'Professional business consulting and services page',
    category: 'Business',
    fields: {
      companyName: { type: 'text', default: 'Catalyst Consulting', label: 'Company Name', required: true },
      tagline: { type: 'text', default: 'Strategic Growth Partners', label: 'Tagline' },
      headline: { 
        type: 'text',
        default: 'Transform Your Business with Expert Guidance',
        label: 'Hero Headline',
        required: true
      },
      subheadline: { 
        type: 'textarea',
        default: 'We help ambitious companies unlock their full potential through strategic planning, operational excellence, and sustainable growth strategies.',
        label: 'Hero Subheadline'
      },
      yearsExperience: { type: 'text', default: '15+', label: 'Years of Experience' },
      clientsServed: { type: 'text', default: '200+', label: 'Clients Served' },
      
      services: {
        type: 'group',
        label: 'Services',
        itemLabel: 'Service',
        min: 1,
        max: 8,
        fields: {
          title: { type: 'text', label: 'Service Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          keyPoints: { type: 'text', label: 'Key Points (comma-separated)', default: '' }
        },
        default: [
          { title: 'Strategic Planning', description: 'Develop comprehensive strategies aligned with your business goals and market opportunities.', keyPoints: 'Market Analysis, Growth Strategy, Competitive Positioning' },
          { title: 'Operational Excellence', description: 'Optimize processes and systems to improve efficiency and reduce costs.', keyPoints: 'Process Optimization, Resource Management, Quality Improvement' },
          { title: 'Change Management', description: 'Guide your organization through transformation with minimal disruption.', keyPoints: 'Stakeholder Engagement, Training Programs, Implementation Support' },
          { title: 'Financial Advisory', description: 'Make informed decisions with expert financial planning and analysis.', keyPoints: 'Financial Planning, Risk Assessment, Investment Strategy' }
        ]
      },
      
      caseStudies: {
        type: 'group',
        label: 'Case Studies',
        itemLabel: 'Case Study',
        min: 0,
        max: 6,
        fields: {
          company: { type: 'text', label: 'Company Name', default: '' },
          industry: { type: 'text', label: 'Industry', default: '' },
          challenge: { type: 'textarea', label: 'Challenge', default: '' },
          result: { type: 'text', label: 'Result', default: '' }
        },
        default: [
          { company: 'TechVentures Inc', industry: 'Technology', challenge: 'Struggling with rapid growth and organizational scaling', result: '300% revenue growth in 18 months' },
          { company: 'RetailCo', industry: 'Retail', challenge: 'Needed digital transformation strategy', result: '45% increase in online sales' },
          { company: 'ManufacturePro', industry: 'Manufacturing', challenge: 'High operational costs and inefficiencies', result: '32% cost reduction achieved' }
        ]
      },
      
      team: {
        type: 'group',
        label: 'Leadership Team',
        itemLabel: 'Team Member',
        min: 0,
        max: 6,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          role: { type: 'text', label: 'Role', default: '' },
          bio: { type: 'textarea', label: 'Bio', default: '' }
        },
        default: [
          { name: 'Jennifer Martinez', role: 'Managing Partner', bio: '20+ years experience in strategic consulting with Fortune 500 companies' },
          { name: 'David Chen', role: 'Operations Director', bio: 'Expert in process optimization and organizational transformation' },
          { name: 'Sarah Thompson', role: 'Financial Advisory Lead', bio: 'Former CFO with expertise in financial planning and M&A' }
        ]
      },
      
      process: {
        type: 'group',
        label: 'Our Process',
        itemLabel: 'Step',
        min: 0,
        max: 6,
        fields: {
          title: { type: 'text', label: 'Step Title', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' }
        },
        default: [
          { title: 'Discovery', description: 'Deep dive into your business, challenges, and objectives' },
          { title: 'Analysis', description: 'Comprehensive assessment of current state and opportunities' },
          { title: 'Strategy', description: 'Custom roadmap tailored to your specific needs' },
          { title: 'Execution', description: 'Hands-on implementation support and guidance' },
          { title: 'Optimization', description: 'Continuous improvement and performance tracking' }
        ]
      },
      
      contactEmail: { type: 'email', default: 'contact@catalyst.com', label: 'Contact Email' },
      phone: { type: 'tel', default: '+1 (555) 123-4567', label: 'Phone Number' }
    },
    structure: (data) => `
      <!-- Navigation -->
      <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--color-bg); backdrop-filter: blur(20px); border-bottom: 1px solid var(--color-border); padding: 1.25rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 1.25rem; color: var(--color-text);">${data.companyName || 'Consulting'}</div>
            <div style="display: flex; gap: 2.5rem; align-items: center;">
              <a href="#services" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Services</a>
              <a href="#results" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Results</a>
              <a href="#team" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Team</a>
              <a href="#contact" class="btn" style="padding: 0.75rem 1.5rem; font-size: 0.9375rem;">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section style="padding: 10rem 0 6rem; background: var(--color-bg);">
        <div class="container" style="max-width: 1200px;">
          <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            ${data.tagline ? `
            <div style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600; margin-bottom: 2rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
              ${data.tagline}
            </div>
            ` : ''}
            <h1 style="font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 800; line-height: 1.1; margin-bottom: 2rem; letter-spacing: -0.03em;">
              ${data.headline || 'Your Headline'}
            </h1>
            <p style="font-size: clamp(1.125rem, 2vw, 1.375rem); color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
              ${data.subheadline || ''}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <a href="#contact" class="btn" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Schedule Consultation</a>
              <a href="#services" class="btn btn-outline" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Our Services</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section style="padding: 5rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 4rem; text-align: center;">
            <div>
              <div style="font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em;">${data.yearsExperience || '15+'}</div>
              <div style="color: var(--color-text-secondary); font-weight: 500;">Years Experience</div>
            </div>
            <div>
              <div style="font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em;">${data.clientsServed || '200+'}</div>
              <div style="color: var(--color-text-secondary); font-weight: 500;">Clients Served</div>
            </div>
            <div>
              <div style="font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em;">98%</div>
              <div style="color: var(--color-text-secondary); font-weight: 500;">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services -->
      <section id="services" style="padding: 8rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="text-align: center; margin-bottom: 5rem; max-width: 700px; margin-left: auto; margin-right: auto;">
            <h2 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Our Services</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary); line-height: 1.7;">Comprehensive solutions tailored to your business needs</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            ${data.services && data.services.length > 0 ? data.services.map((service, idx) => `
              <div class="card" style="padding: 2.5rem;">
                <div style="width: 56px; height: 56px; background: var(--color-surface); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700; border: 1px solid var(--color-border);">
                  ${(idx + 1).toString().padStart(2, '0')}
                </div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">${service.title || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 1.5rem; font-size: 1rem;">${service.description || ''}</p>
                ${service.keyPoints ? `
                <div style="display: flex; flex-direction: column; gap: 0.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
                  ${service.keyPoints.split(',').map(point => `
                    <div style="display: flex; gap: 0.75rem; font-size: 0.875rem;">
                      <span style="color: var(--color-accent, #667eea); font-weight: 700; flex-shrink: 0;">✓</span>
                      <span style="color: var(--color-text-secondary);">${point.trim()}</span>
                    </div>
                  `).join('')}
                </div>
                ` : ''}
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- Process -->
      ${data.process && data.process.length > 0 ? `
      <section style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Our Process</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">A proven methodology for delivering results</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem;">
            ${data.process.map((step, idx) => `
              <div style="text-align: center; position: relative;">
                <div style="width: 72px; height: 72px; background: var(--color-bg); border: 3px solid var(--color-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 1.75rem; font-weight: 800;">
                  ${idx + 1}
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem;">${step.title || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem;">${step.description || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Case Studies -->
      ${data.caseStudies && data.caseStudies.length > 0 ? `
      <section id="results" style="padding: 8rem 0;">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Proven Results</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Real success stories from our clients</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
            ${data.caseStudies.map(study => `
              <div class="card" style="padding: 2.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
                  <div>
                    <h3 style="font-size: 1.375rem; font-weight: 600; margin-bottom: 0.25rem;">${study.company || ''}</h3>
                    <div style="font-size: 0.875rem; color: var(--color-text-secondary); font-weight: 500;">${study.industry || ''}</div>
                  </div>
                </div>
                <p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-size: 0.9375rem;">${study.challenge || ''}</p>
                <div style="padding: 1.25rem; background: var(--color-surface); border-left: 3px solid var(--color-accent, #667eea); border-radius: var(--radius-sm);">
                  <div style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); margin-bottom: 0.5rem;">RESULT</div>
                  <div style="font-size: 1.125rem; font-weight: 600; color: var(--color-text);">${study.result || ''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Team -->
      ${data.team && data.team.length > 0 ? `
      <section id="team" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Leadership Team</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Expert consultants dedicated to your success</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem;">
            ${data.team.map(member => `
              <div style="text-align: center;">
                <div style="width: 120px; height: 120px; background: var(--color-bg); border: 2px solid var(--color-border); border-radius: 50%; margin: 0 auto 1.5rem;"></div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${member.name || ''}</h3>
                <div style="font-size: 0.9375rem; color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: 500;">${member.role || ''}</div>
                <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem;">${member.bio || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Contact CTA -->
      <section id="contact" style="padding: 8rem 0;">
        <div class="container" style="max-width: 800px; text-align: center;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.02em;">
            Ready to Transform Your Business?
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
            Let's discuss how we can help you achieve your goals
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3rem;">
            ${data.contactEmail ? `<a href="mailto:${data.contactEmail}" class="btn" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Email Us</a>` : ''}
            ${data.phone ? `<a href="tel:${data.phone}" class="btn btn-outline" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Call ${data.phone}</a>` : ''}
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 3rem 0; border-top: 1px solid var(--color-border); text-align: center;">
        <div class="container">
          <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
            © 2024 ${data.companyName || 'Consulting'}. All rights reserved.
          </p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          nav > div > div:last-child { gap: 1rem; }
          nav > div > div:last-child > a:not(.btn) { display: none; }
        }
      </style>
    `
  }),

  // ============================================
  // TEMPLATE 6: RESTAURANT
  // ============================================
  'restaurant': new Template('restaurant', {
    name: 'Restaurant',
    description: 'Modern restaurant with menu, gallery, and reservations',
    category: 'Restaurant',
    fields: {
      restaurantName: { type: 'text', default: 'Bella Vita', label: 'Restaurant Name', required: true },
      tagline: { type: 'text', default: 'Authentic Italian Cuisine', label: 'Tagline' },
      description: { 
        type: 'textarea',
        default: 'Experience the warmth of Italy with our handcrafted dishes, made from the finest locally-sourced ingredients and traditional family recipes.',
        label: 'Description'
      },
      
      address: { type: 'text', default: '123 Main Street, Downtown', label: 'Address' },
      phone: { type: 'tel', default: '+1 (555) 987-6543', label: 'Phone Number' },
      email: { type: 'email', default: 'hello@bellavita.com', label: 'Email' },
      
      hours: {
        type: 'group',
        label: 'Opening Hours',
        itemLabel: 'Day',
        min: 1,
        max: 7,
        fields: {
          day: { type: 'text', label: 'Day', default: '' },
          hours: { type: 'text', label: 'Hours', default: '' }
        },
        default: [
          { day: 'Monday - Thursday', hours: '5:00 PM - 10:00 PM' },
          { day: 'Friday - Saturday', hours: '5:00 PM - 11:00 PM' },
          { day: 'Sunday', hours: '12:00 PM - 9:00 PM' }
        ]
      },
      
      menuCategories: {
        type: 'group',
        label: 'Menu Categories',
        itemLabel: 'Category',
        min: 1,
        max: 8,
        fields: {
          category: { type: 'text', label: 'Category Name', default: '' },
          items: {
            type: 'group',
            label: 'Menu Items',
            itemLabel: 'Item',
            fields: {
              name: { type: 'text', label: 'Dish Name', default: '' },
              description: { type: 'textarea', label: 'Description', default: '' },
              price: { type: 'text', label: 'Price', default: '' }
            }
          }
        },
        default: [
          {
            category: 'Antipasti',
            items: [
              { name: 'Bruschetta Classica', description: 'Toasted bread with fresh tomatoes, basil, and olive oil', price: '$12' },
              { name: 'Carpaccio di Manzo', description: 'Thinly sliced beef with arugula and parmesan', price: '$16' }
            ]
          },
          {
            category: 'Pasta',
            items: [
              { name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with pancetta and pecorino', price: '$22' },
              { name: 'Pappardelle al Ragù', description: 'Wide ribbon pasta with slow-cooked meat sauce', price: '$24' }
            ]
          },
          {
            category: 'Secondi',
            items: [
              { name: 'Osso Buco', description: 'Braised veal shanks with saffron risotto', price: '$38' },
              { name: 'Branzino al Forno', description: 'Oven-roasted Mediterranean sea bass', price: '$32' }
            ]
          }
        ]
      },
      
      specialties: {
        type: 'group',
        label: 'Chef Specialties',
        itemLabel: 'Specialty',
        min: 0,
        max: 4,
        fields: {
          name: { type: 'text', label: 'Dish Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { name: 'Truffle Risotto', description: 'Creamy Arborio rice with black truffle and aged parmesan', price: '$34' },
          { name: 'Bistecca Fiorentina', description: '32oz T-bone steak grilled to perfection (serves 2)', price: '$68' }
        ]
      },
      
      testimonials: {
        type: 'group',
        label: 'Reviews',
        itemLabel: 'Review',
        min: 0,
        max: 6,
        fields: {
          quote: { type: 'textarea', label: 'Quote', default: '' },
          author: { type: 'text', label: 'Author', default: '' },
          rating: { type: 'select', label: 'Rating', options: ['5', '4'], default: '5' }
        },
        default: [
          { quote: 'The best Italian food outside of Italy! Every dish is crafted with love and authenticity.', author: 'Maria Romano', rating: '5' },
          { quote: 'Amazing atmosphere and incredible service. The osso buco melts in your mouth.', author: 'James Miller', rating: '5' },
          { quote: 'A true gem! The homemade pasta is unbelievable and the wine selection is perfect.', author: 'Sophie Laurent', rating: '5' }
        ]
      },
      
      features: {
        type: 'repeatable',
        label: 'Features',
        itemLabel: 'Feature',
        default: ['Private Dining', 'Outdoor Seating', 'Wine Cellar', 'Valet Parking'],
        max: 8
      },
      
      reservationUrl: { type: 'url', default: '', label: 'Reservation Link (Optional)', optional: true }
    },
    structure: (data) => `
      <!-- Navigation -->
      <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--color-bg); backdrop-filter: blur(20px); border-bottom: 1px solid var(--color-border); padding: 1.25rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 1.5rem; color: var(--color-text); font-family: var(--font-heading);">${data.restaurantName || 'Restaurant'}</div>
            <div style="display: flex; gap: 2.5rem; align-items: center;">
              <a href="#menu" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Menu</a>
              <a href="#about" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">About</a>
              <a href="#reviews" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Reviews</a>
              <a href="#contact" class="btn" style="padding: 0.75rem 1.5rem; font-size: 0.9375rem;">Reserve Table</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section style="min-height: 100vh; display: flex; align-items: center; padding: 8rem 0; background: var(--color-bg); position: relative;">
        <div style="position: absolute; inset: 0; opacity: 0.05; background: radial-gradient(circle at 30% 50%, var(--color-accent, #d4af76) 0%, transparent 50%);"></div>
        <div class="container" style="max-width: 1400px; position: relative;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center;">
            <div>
              ${data.tagline ? `
              <div style="font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.5rem;">
                ${data.tagline}
              </div>
              ` : ''}
              <h1 style="font-size: clamp(3rem, 7vw, 6rem); font-weight: 700; line-height: 1; margin-bottom: 2rem; letter-spacing: -0.02em; font-family: var(--font-heading);">
                ${data.restaurantName || 'Restaurant Name'}
              </h1>
              <p style="font-size: 1.25rem; color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 3rem;">
                ${data.description || ''}
              </p>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="#menu" class="btn" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">View Menu</a>
                <a href="#contact" class="btn btn-outline" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Reserve Now</a>
              </div>
            </div>
            <div style="aspect-ratio: 4/5; background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-border) 100%); border-radius: var(--radius-xl);"></div>
          </div>
        </div>
      </section>

      <!-- Features -->
      ${data.features && data.features.length > 0 ? `
      <section style="padding: 5rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: flex; justify-content: center; gap: 4rem; flex-wrap: wrap;">
            ${data.features.map(feature => `
              <div style="text-align: center;">
                <div style="font-size: 1.125rem; font-weight: 600; color: var(--color-text);">${feature}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Chef's Specialties -->
      ${data.specialties && data.specialties.length > 0 ? `
      <section style="padding: 8rem 0;">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em; font-family: var(--font-heading);">Chef's Specialties</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Signature dishes crafted with passion</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 3rem;">
            ${data.specialties.map(dish => `
              <div style="text-align: center;">
                <div style="aspect-ratio: 1; background: var(--color-surface); border-radius: var(--radius-lg); margin-bottom: 2rem; border: 1px solid var(--color-border);"></div>
                <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; font-family: var(--font-heading);">${dish.name || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 1rem; font-size: 0.9375rem;">${dish.description || ''}</p>
                <div style="font-size: 1.25rem; font-weight: 700; color: var(--color-accent, #d4af76);">${dish.price || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Menu -->
      <section id="menu" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1000px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em; font-family: var(--font-heading);">Our Menu</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Authentic recipes passed down through generations</p>
          </div>
          
          ${data.menuCategories && data.menuCategories.length > 0 ? data.menuCategories.map(category => `
            <div style="margin-bottom: 5rem;">
              <h3 style="font-size: 2rem; font-weight: 700; margin-bottom: 2.5rem; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--font-heading);">
                ${category.category || ''}
              </h3>
              <div style="display: flex; flex-direction: column; gap: 2rem;">
                ${category.items && category.items.length > 0 ? category.items.map(item => `
                  <div style="padding-bottom: 2rem; border-bottom: 1px solid var(--color-border);">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem; gap: 1rem;">
                      <h4 style="font-size: 1.25rem; font-weight: 600; flex: 1;">${item.name || ''}</h4>
                      <span style="font-size: 1.125rem; font-weight: 700; color: var(--color-accent, #d4af76); white-space: nowrap;">${item.price || ''}</span>
                    </div>
                    <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.9375rem;">${item.description || ''}</p>
                  </div>
                `).join('') : ''}
              </div>
            </div>
          `).join('') : ''}
        </div>
      </section>

      <!-- About & Hours -->
      <section id="about" style="padding: 8rem 0;">
        <div class="container" style="max-width: 1200px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start;">
            <div>
              <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 2rem; letter-spacing: -0.02em; font-family: var(--font-heading);">About Us</h2>
              <p style="font-size: 1.125rem; color: var(--color-text-secondary); line-height: 1.9; margin-bottom: 2rem;">
                ${data.description || 'Our restaurant brings together the finest ingredients and traditional cooking methods to create an unforgettable dining experience.'}
              </p>
              <p style="font-size: 1.125rem; color: var(--color-text-secondary); line-height: 1.9;">
                Every dish is prepared with care, honoring time-tested recipes while adding our own creative touch. Join us for an evening of exceptional food and warm hospitality.
              </p>
            </div>
            
            <div>
              <h3 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 2rem; font-family: var(--font-heading);">Hours & Location</h3>
              
              ${data.hours && data.hours.length > 0 ? `
              <div style="margin-bottom: 3rem;">
                <h4 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); margin-bottom: 1rem;">Opening Hours</h4>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${data.hours.map(schedule => `
                    <div style="display: flex; justify-content: space-between; padding: 1rem; background: var(--color-surface); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                      <span style="font-weight: 500;">${schedule.day || ''}</span>
                      <span style="color: var(--color-text-secondary); font-weight: 500;">${schedule.hours || ''}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}
              
              ${data.address || data.phone || data.email ? `
              <div>
                <h4 style="font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); margin-bottom: 1rem;">Contact</h4>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${data.address ? `<div style="font-size: 1rem; color: var(--color-text-secondary);">📍 ${data.address}</div>` : ''}
                  ${data.phone ? `<div style="font-size: 1rem; color: var(--color-text-secondary);">📞 ${data.phone}</div>` : ''}
                  ${data.email ? `<div style="font-size: 1rem; color: var(--color-text-secondary);">✉️ ${data.email}</div>` : ''}
                </div>
              </div>
              ` : ''}
            </div>
          </div>
        </div>
      </section>

      <!-- Reviews -->
      ${data.testimonials && data.testimonials.length > 0 ? `
      <section id="reviews" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em; font-family: var(--font-heading);">What People Say</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Reviews from our valued guests</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            ${data.testimonials.map(review => `
              <div class="card" style="padding: 2.5rem;">
                <div style="display: flex; gap: 0.25rem; margin-bottom: 1.5rem;">
                  ${Array(parseInt(review.rating || 5)).fill('⭐').join('')}
                </div>
                <p style="font-size: 1.0625rem; line-height: 1.8; margin-bottom: 1.5rem; color: var(--color-text); font-style: italic;">
                  "${review.quote || ''}"
                </p>
                <div style="font-weight: 600; color: var(--color-text);">— ${review.author || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Reservation CTA -->
      <section id="contact" style="padding: 8rem 0;">
        <div class="container" style="max-width: 800px; text-align: center;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1.5rem; letter-spacing: -0.02em; font-family: var(--font-heading);">
            Reserve Your Table
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
            Experience unforgettable dining. Book your table today.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            ${data.phone ? `<a href="tel:${data.phone}" class="btn" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Call to Reserve</a>` : ''}
            ${data.reservationUrl ? `<a href="${data.reservationUrl}" target="_blank" class="btn btn-outline" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Book Online</a>` : ''}
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 4rem 0; border-top: 1px solid var(--color-border); background: var(--color-surface);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 3rem;">
            <div>
              <h3 style="font-weight: 700; font-size: 1.5rem; margin-bottom: 1rem; font-family: var(--font-heading);">${data.restaurantName || 'Restaurant'}</h3>
              <p style="color: var(--color-text-secondary); font-size: 0.9375rem; line-height: 1.7;">
                ${data.tagline || 'Exceptional dining experience'}
              </p>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 1rem; font-size: 0.875rem;">Hours</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; color: var(--color-text-secondary); font-size: 0.875rem;">
                ${data.hours && data.hours.length > 0 ? data.hours.slice(0, 2).map(h => `<div>${h.day}: ${h.hours}</div>`).join('') : ''}
              </div>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 1rem; font-size: 0.875rem;">Contact</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; color: var(--color-text-secondary); font-size: 0.875rem;">
                ${data.phone ? `<div>${data.phone}</div>` : ''}
                ${data.email ? `<div>${data.email}</div>` : ''}
              </div>
            </div>
          </div>
          <div style="padding-top: 2rem; border-top: 1px solid var(--color-border); text-align: center;">
            <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
              © 2024 ${data.restaurantName || 'Restaurant'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          nav > div > div:last-child > a:not(.btn) { display: none; }
          section > div > div[style*="grid-template-columns: 1fr 1fr"],
          section > div > div[style*="grid-template-columns: 2fr 1fr 1fr"] { 
            grid-template-columns: 1fr !important; 
            gap: 3rem !important; 
          }
        }
      </style>
    `
  }),

  // ============================================
  // TEMPLATE 7: EVENTS & CONFERENCES
  // ============================================
  'events-conference': new Template('events-conference', {
    name: 'Events & Conferences',
    description: 'Professional event landing page with schedule and speakers',
    category: 'Events',
    fields: {
      eventName: { type: 'text', default: 'TechSummit 2024', label: 'Event Name', required: true },
      tagline: { type: 'text', default: 'The Future of Technology', label: 'Tagline' },
      date: { type: 'text', default: 'June 15-17, 2024', label: 'Event Date' },
      location: { type: 'text', default: 'San Francisco Convention Center', label: 'Location' },
      description: { 
        type: 'textarea',
        default: 'Join 5,000+ innovators, developers, and tech leaders for three days of inspiring talks, hands-on workshops, and unparalleled networking opportunities.',
        label: 'Event Description'
      },
      
      highlightStats: {
        type: 'group',
        label: 'Event Highlights',
        itemLabel: 'Stat',
        min: 0,
        max: 4,
        fields: {
          number: { type: 'text', label: 'Number', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { number: '5000+', label: 'Attendees' },
          { number: '50+', label: 'Speakers' },
          { number: '3', label: 'Days' },
          { number: '20+', label: 'Workshops' }
        ]
      },
      
      speakers: {
        type: 'group',
        label: 'Featured Speakers',
        itemLabel: 'Speaker',
        min: 0,
        max: 12,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          title: { type: 'text', label: 'Title', default: '' },
          company: { type: 'text', label: 'Company', default: '' },
          bio: { type: 'textarea', label: 'Bio', default: '' }
        },
        default: [
          { name: 'Dr. Sarah Johnson', title: 'Chief AI Officer', company: 'TechCorp', bio: 'Pioneer in machine learning with 15+ years of experience' },
          { name: 'Marcus Chen', title: 'VP of Engineering', company: 'CloudScale', bio: 'Leading expert in cloud architecture and scalability' },
          { name: 'Elena Rodriguez', title: 'Founder & CEO', company: 'StartupXYZ', bio: 'Serial entrepreneur and innovation advisor' },
          { name: 'James Wilson', title: 'Head of Design', company: 'Creative Labs', bio: 'Award-winning designer and UX strategist' }
        ]
      },
      
      schedule: {
        type: 'group',
        label: 'Event Schedule',
        itemLabel: 'Day',
        min: 0,
        max: 5,
        fields: {
          day: { type: 'text', label: 'Day', default: '' },
          date: { type: 'text', label: 'Date', default: '' },
          sessions: {
            type: 'group',
            label: 'Sessions',
            itemLabel: 'Session',
            fields: {
              time: { type: 'text', label: 'Time', default: '' },
              title: { type: 'text', label: 'Session Title', default: '' },
              speaker: { type: 'text', label: 'Speaker', default: '' },
              track: { type: 'text', label: 'Track/Category', default: '' }
            }
          }
        },
        default: [
          {
            day: 'Day 1',
            date: 'June 15',
            sessions: [
              { time: '9:00 AM', title: 'Opening Keynote: The Future of AI', speaker: 'Dr. Sarah Johnson', track: 'Keynote' },
              { time: '10:30 AM', title: 'Building Scalable Systems', speaker: 'Marcus Chen', track: 'Engineering' },
              { time: '2:00 PM', title: 'Design Thinking Workshop', speaker: 'James Wilson', track: 'Workshop' }
            ]
          },
          {
            day: 'Day 2',
            date: 'June 16',
            sessions: [
              { time: '9:00 AM', title: 'Startup Success Stories', speaker: 'Elena Rodriguez', track: 'Business' },
              { time: '11:00 AM', title: 'Cloud Architecture Patterns', speaker: 'Marcus Chen', track: 'Engineering' },
              { time: '3:00 PM', title: 'Networking Session', speaker: '', track: 'Networking' }
            ]
          }
        ]
      },
      
      tickets: {
        type: 'group',
        label: 'Ticket Tiers',
        itemLabel: 'Ticket',
        min: 1,
        max: 4,
        fields: {
          name: { type: 'text', label: 'Ticket Name', default: '' },
          price: { type: 'text', label: 'Price', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          features: { type: 'text', label: 'Features (comma-separated)', default: '' },
          available: { type: 'select', label: 'Availability', options: ['Available', 'Sold Out', 'Coming Soon'], default: 'Available' }
        },
        default: [
          { name: 'General Admission', price: '$299', description: 'Access to all sessions and workshops', features: 'All sessions, Workshop access, Networking events, Conference materials', available: 'Available' },
          { name: 'VIP Pass', price: '$599', description: 'Premium experience with exclusive perks', features: 'All sessions, VIP seating, Speaker meet & greet, Premium swag, Exclusive dinner', available: 'Available' },
          { name: 'Student', price: '$99', description: 'Special pricing for students', features: 'All sessions, Workshop access, Conference materials', available: 'Available' }
        ]
      },
      
      sponsors: {
        type: 'repeatable',
        label: 'Sponsors',
        itemLabel: 'Sponsor Name',
        default: ['TechCorp', 'CloudScale', 'InnovateLabs', 'DataStream'],
        max: 12
      },
      
      venue: {
        type: 'textarea',
        label: 'Venue Details',
        default: 'The San Francisco Convention Center is a world-class facility in the heart of downtown, featuring state-of-the-art technology and easy access to hotels and restaurants.'
      },
      
      contactEmail: { type: 'email', default: 'info@techsummit.com', label: 'Contact Email' },
      registrationUrl: { type: 'url', default: '', label: 'Registration Link (Optional)', optional: true }
    },
    structure: (data) => `
      <!-- Navigation -->
      <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--color-bg); backdrop-filter: blur(20px); border-bottom: 1px solid var(--color-border); padding: 1rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 1.25rem; color: var(--color-text);">${data.eventName || 'Event'}</div>
            <div style="display: flex; gap: 2rem; align-items: center;">
              <a href="#speakers" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Speakers</a>
              <a href="#schedule" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Schedule</a>
              <a href="#tickets" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Tickets</a>
              <a href="#tickets" class="btn" style="padding: 0.75rem 1.5rem; font-size: 0.9375rem;">Register Now</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section style="padding: 10rem 0 6rem; background: var(--color-bg); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; opacity: 0.03; background: linear-gradient(135deg, var(--color-accent, #667eea) 0%, transparent 50%);"></div>
        <div class="container" style="max-width: 1200px; position: relative;">
          <div style="text-align: center; max-width: 900px; margin: 0 auto;">
            ${data.tagline ? `
            <div style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600; margin-bottom: 2rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
              ${data.tagline}
            </div>
            ` : ''}
            <h1 style="font-size: clamp(3rem, 8vw, 6rem); font-weight: 800; line-height: 1; margin-bottom: 2rem; letter-spacing: -0.03em;">
              ${data.eventName || 'Event Name'}
            </h1>
            <div style="display: flex; gap: 2rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 2rem; font-size: 1.125rem; color: var(--color-text-secondary);">
              ${data.date ? `<div style="display: flex; align-items: center; gap: 0.5rem;">📅 ${data.date}</div>` : ''}
              ${data.location ? `<div style="display: flex; align-items: center; gap: 0.5rem;">📍 ${data.location}</div>` : ''}
            </div>
            <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
              ${data.description || ''}
            </p>
            <a href="#tickets" class="btn" style="padding: 1.25rem 3rem; font-size: 1.125rem;">Get Your Ticket</a>
          </div>
        </div>
      </section>

      <!-- Stats -->
      ${data.highlightStats && data.highlightStats.length > 0 ? `
      <section style="padding: 5rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
            ${data.highlightStats.map(stat => `
              <div>
                <div style="font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em; color: var(--color-accent, #667eea);">${stat.number}</div>
                <div style="color: var(--color-text-secondary); font-weight: 500; font-size: 1.0625rem;">${stat.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Speakers -->
      ${data.speakers && data.speakers.length > 0 ? `
      <section id="speakers" style="padding: 8rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Featured Speakers</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Industry leaders and innovators</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2.5rem;">
            ${data.speakers.map(speaker => `
              <div class="card" style="padding: 2.5rem; text-align: center;">
                <div style="width: 120px; height: 120px; background: var(--color-surface); border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid var(--color-border);"></div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${speaker.name || ''}</h3>
                <div style="font-size: 0.9375rem; color: var(--color-text-secondary); margin-bottom: 0.25rem; font-weight: 500;">${speaker.title || ''}</div>
                <div style="font-size: 0.875rem; color: var(--color-accent, #667eea); margin-bottom: 1rem; font-weight: 600;">${speaker.company || ''}</div>
                <p style="color: var(--color-text-secondary); line-height: 1.7; font-size: 0.875rem;">${speaker.bio || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Schedule -->
      ${data.schedule && data.schedule.length > 0 ? `
      <section id="schedule" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Event Schedule</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Plan your experience</p>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 4rem;">
            ${data.schedule.map(day => `
              <div>
                <div style="display: flex; gap: 1rem; align-items: baseline; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid var(--color-border);">
                  <h3 style="font-size: 2rem; font-weight: 700;">${day.day || ''}</h3>
                  <span style="font-size: 1.125rem; color: var(--color-text-secondary); font-weight: 500;">${day.date || ''}</span>
                </div>
                
                ${day.sessions && day.sessions.length > 0 ? `
                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                  ${day.sessions.map(session => `
                    <div style="display: grid; grid-template-columns: 140px 1fr auto; gap: 2rem; align-items: start; padding: 1.5rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-lg);">
                      <div style="font-size: 1.125rem; font-weight: 600; color: var(--color-accent, #667eea);">${session.time || ''}</div>
                      <div>
                        <h4 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${session.title || ''}</h4>
                        ${session.speaker ? `<div style="color: var(--color-text-secondary); font-size: 0.9375rem;">${session.speaker}</div>` : ''}
                      </div>
                      ${session.track ? `
                      <div style="padding: 0.375rem 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 600; color: var(--color-text-secondary); white-space: nowrap;">
                        ${session.track}
                      </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Tickets -->
      <section id="tickets" style="padding: 8rem 0;">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Get Your Ticket</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Choose the pass that fits your needs</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
            ${data.tickets && data.tickets.length > 0 ? data.tickets.map(ticket => `
              <div class="card" style="padding: 3rem 2.5rem; text-align: center; ${ticket.available === 'Sold Out' ? 'opacity: 0.6;' : ''}">
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">${ticket.name || ''}</h3>
                <div style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">${ticket.price || ''}</div>
                <p style="color: var(--color-text-secondary); margin-bottom: 2rem; min-height: 3em; line-height: 1.6; font-size: 0.9375rem;">
                  ${ticket.description || ''}
                </p>
                
                ${ticket.available === 'Available' ? `
                <a href="${data.registrationUrl || '#'}" class="btn" style="width: 100%; padding: 1rem; margin-bottom: 2rem; font-size: 1rem;">
                  Register Now
                </a>
                ` : ticket.available === 'Sold Out' ? `
                <div style="width: 100%; padding: 1rem; margin-bottom: 2rem; font-size: 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-weight: 600; color: var(--color-text-secondary);">
                  Sold Out
                </div>
                ` : `
                <div style="width: 100%; padding: 1rem; margin-bottom: 2rem; font-size: 1rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-weight: 600; color: var(--color-text-secondary);">
                  Coming Soon
                </div>
                `}
                
                ${ticket.features ? `
                <div style="text-align: left; padding-top: 2rem; border-top: 1px solid var(--color-border);">
                  ${ticket.features.split(',').map(feature => `
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.9375rem;">
                      <span style="color: var(--color-accent, #667eea); font-weight: 700; flex-shrink: 0;">✓</span>
                      <span style="color: var(--color-text-secondary); line-height: 1.6;">${feature.trim()}</span>
                    </div>
                  `).join('')}
                </div>
                ` : ''}
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- Venue -->
      ${data.venue || data.location ? `
      <section style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1000px;">
          <div style="text-align: center; margin-bottom: 3rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Venue</h2>
            ${data.location ? `<div style="font-size: 1.25rem; color: var(--color-accent, #667eea); font-weight: 600; margin-bottom: 1.5rem;">${data.location}</div>` : ''}
          </div>
          ${data.venue ? `<p style="font-size: 1.125rem; color: var(--color-text-secondary); line-height: 1.8; text-align: center;">${data.venue}</p>` : ''}
        </div>
      </section>
      ` : ''}

      <!-- Sponsors -->
      ${data.sponsors && data.sponsors.length > 0 ? `
      <section style="padding: 6rem 0; border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <h3 style="text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 3rem; color: var(--color-text-secondary);">Proudly Sponsored By</h3>
          <div style="display: flex; justify-content: center; align-items: center; gap: 4rem; flex-wrap: wrap;">
            ${data.sponsors.map(sponsor => `
              <div style="font-size: 1.25rem; font-weight: 600; color: var(--color-text-secondary); opacity: 0.6;">
                ${sponsor}
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Footer -->
      <footer style="padding: 4rem 0; border-top: 1px solid var(--color-border); text-align: center; background: var(--color-surface);">
        <div class="container">
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">${data.eventName || 'Event'}</h3>
            ${data.contactEmail ? `<a href="mailto:${data.contactEmail}" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem;">${data.contactEmail}</a>` : ''}
          </div>
          <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
            © 2024 ${data.eventName || 'Event'}. All rights reserved.
          </p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          nav > div > div:last-child > a:not(.btn) { display: none; }
          section div[style*="grid-template-columns: 140px 1fr auto"] {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      </style>
    `
  }),

  // ============================================
  // TEMPLATE 8: EDUCATION & ONLINE COURSES
  // ============================================
  'education-course': new Template('education-course', {
    name: 'Education & Courses',
    description: 'Online learning platform with courses and curriculum',
    category: 'Education',
    fields: {
      platformName: { type: 'text', default: 'LearnHub', label: 'Platform Name', required: true },
      tagline: { type: 'text', default: 'Learn Skills That Matter', label: 'Tagline' },
      headline: { 
        type: 'text',
        default: 'Master In-Demand Skills at Your Own Pace',
        label: 'Hero Headline',
        required: true
      },
      description: { 
        type: 'textarea',
        default: 'Join thousands of students learning from industry experts. Access high-quality courses, earn certificates, and advance your career.',
        label: 'Platform Description'
      },
      
      stats: {
        type: 'group',
        label: 'Platform Stats',
        itemLabel: 'Stat',
        min: 0,
        max: 4,
        fields: {
          number: { type: 'text', label: 'Number', default: '' },
          label: { type: 'text', label: 'Label', default: '' }
        },
        default: [
          { number: '50K+', label: 'Active Students' },
          { number: '200+', label: 'Expert Instructors' },
          { number: '500+', label: 'Courses' },
          { number: '95%', label: 'Completion Rate' }
        ]
      },
      
      courses: {
        type: 'group',
        label: 'Featured Courses',
        itemLabel: 'Course',
        min: 1,
        max: 12,
        fields: {
          title: { type: 'text', label: 'Course Title', default: '' },
          instructor: { type: 'text', label: 'Instructor Name', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          duration: { type: 'text', label: 'Duration', default: '' },
          level: { type: 'select', label: 'Level', options: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
          students: { type: 'text', label: 'Number of Students', default: '' },
          price: { type: 'text', label: 'Price', default: '' }
        },
        default: [
          { title: 'Complete Web Development Bootcamp', instructor: 'Sarah Chen', description: 'Learn HTML, CSS, JavaScript, React, and Node.js from scratch', duration: '40 hours', level: 'Beginner', students: '12,450', price: '$49' },
          { title: 'Data Science with Python', instructor: 'Dr. Marcus Lee', description: 'Master data analysis, visualization, and machine learning', duration: '35 hours', level: 'Intermediate', students: '8,320', price: '$59' },
          { title: 'UX Design Fundamentals', instructor: 'Elena Rodriguez', description: 'Create user-centered designs that delight and convert', duration: '25 hours', level: 'Beginner', students: '9,870', price: '$39' },
          { title: 'Advanced JavaScript Patterns', instructor: 'James Wilson', description: 'Deep dive into modern JavaScript and design patterns', duration: '30 hours', level: 'Advanced', students: '5,640', price: '$69' }
        ]
      },
      
      features: {
        type: 'group',
        label: 'Learning Features',
        itemLabel: 'Feature',
        min: 1,
        max: 8,
        fields: {
          title: { type: 'text', label: 'Feature Title', default: '' },
          description: { type: 'textarea', label: 'Description', default: '' },
          icon: { type: 'text', label: 'Icon (emoji)', default: '📚' }
        },
        default: [
          { title: 'Expert-Led Content', description: 'Learn from industry professionals with real-world experience', icon: '👨‍🏫' },
          { title: 'Lifetime Access', description: 'Access course materials anytime, anywhere, forever', icon: '♾️' },
          { title: 'Practical Projects', description: 'Build real projects to reinforce your learning', icon: '🛠️' },
          { title: 'Career Support', description: 'Get guidance on landing your dream job', icon: '🎯' },
          { title: 'Certificates', description: 'Earn recognized certificates upon completion', icon: '🏆' },
          { title: 'Community Access', description: 'Connect with fellow learners and get support', icon: '👥' }
        ]
      },
      
      curriculum: {
        type: 'group',
        label: 'Sample Curriculum',
        itemLabel: 'Module',
        min: 0,
        max: 10,
        fields: {
          module: { type: 'text', label: 'Module Name', default: '' },
          lessons: { type: 'text', label: 'Number of Lessons', default: '' },
          duration: { type: 'text', label: 'Duration', default: '' },
          topics: { type: 'text', label: 'Key Topics (comma-separated)', default: '' }
        },
        default: [
          { module: 'Introduction to Web Development', lessons: '8', duration: '4 hours', topics: 'HTML basics, CSS fundamentals, First website' },
          { module: 'JavaScript Essentials', lessons: '12', duration: '8 hours', topics: 'Variables, Functions, DOM manipulation, Events' },
          { module: 'Modern JavaScript', lessons: '10', duration: '6 hours', topics: 'ES6+, Async programming, APIs' },
          { module: 'React Fundamentals', lessons: '15', duration: '10 hours', topics: 'Components, State, Props, Hooks' },
          { module: 'Backend with Node.js', lessons: '12', duration: '8 hours', topics: 'Express, Databases, Authentication, APIs' }
        ]
      },
      
      testimonials: {
        type: 'group',
        label: 'Student Reviews',
        itemLabel: 'Review',
        min: 0,
        max: 6,
        fields: {
          quote: { type: 'textarea', label: 'Quote', default: '' },
          author: { type: 'text', label: 'Student Name', default: '' },
          role: { type: 'text', label: 'Achievement', default: '' },
          rating: { type: 'select', label: 'Rating', options: ['5', '4'], default: '5' }
        },
        default: [
          { quote: 'This course changed my career! I went from complete beginner to landing a developer job in 6 months.', author: 'Michael Torres', role: 'Now working at Google', rating: '5' },
          { quote: 'The instructors are amazing and the content is always up-to-date. Best investment I\'ve made in myself.', author: 'Priya Patel', role: 'Successfully transitioned to UX Design', rating: '5' },
          { quote: 'Practical, hands-on learning that actually prepares you for real work. The projects were challenging but rewarding.', author: 'David Kim', role: 'Freelancing successfully', rating: '5' }
        ]
      },
      
      pricingPlans: {
        type: 'group',
        label: 'Pricing Plans',
        itemLabel: 'Plan',
        min: 1,
        max: 3,
        fields: {
          name: { type: 'text', label: 'Plan Name', default: '' },
          price: { type: 'text', label: 'Price', default: '' },
          period: { type: 'text', label: 'Billing Period', default: '/month' },
          description: { type: 'textarea', label: 'Description', default: '' },
          features: { type: 'text', label: 'Features (comma-separated)', default: '' }
        },
        default: [
          { name: 'Free', price: '$0', period: '', description: 'Get started with basic courses', features: '10 free courses, Community access, Course certificates' },
          { name: 'Pro', price: '$29', period: '/month', description: 'Full access to all content', features: 'All 500+ courses, Download resources, Priority support, Career coaching, Exclusive workshops' },
          { name: 'Team', price: '$99', period: '/month', description: 'Perfect for teams and organizations', features: 'Everything in Pro, Up to 10 team members, Admin dashboard, Progress tracking, Custom reports' }
        ]
      },
      
      instructors: {
        type: 'group',
        label: 'Featured Instructors',
        itemLabel: 'Instructor',
        min: 0,
        max: 8,
        fields: {
          name: { type: 'text', label: 'Name', default: '' },
          title: { type: 'text', label: 'Title/Expertise', default: '' },
          bio: { type: 'textarea', label: 'Bio', default: '' },
          students: { type: 'text', label: 'Total Students', default: '' }
        },
        default: [
          { name: 'Sarah Chen', title: 'Full-Stack Developer', bio: '10+ years at Meta, teaching web development', students: '45,000+' },
          { name: 'Dr. Marcus Lee', title: 'Data Scientist', bio: 'PhD in ML, former Google AI researcher', students: '32,000+' },
          { name: 'Elena Rodriguez', title: 'UX Design Lead', bio: 'Award-winning designer, ex-Apple', students: '28,000+' }
        ]
      },
      
      contactEmail: { type: 'email', default: 'support@learnhub.com', label: 'Contact Email' }
    },
    structure: (data) => `
      <!-- Navigation -->
      <nav style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: var(--color-bg); backdrop-filter: blur(20px); border-bottom: 1px solid var(--color-border); padding: 1rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; font-size: 1.25rem; color: var(--color-text);">${data.platformName || 'LearnHub'}</div>
            <div style="display: flex; gap: 2.5rem; align-items: center;">
              <a href="#courses" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Courses</a>
              <a href="#instructors" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Instructors</a>
              <a href="#pricing" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem; font-weight: 500;">Pricing</a>
              <a href="#pricing" class="btn" style="padding: 0.75rem 1.5rem; font-size: 0.9375rem;">Start Learning</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero -->
      <section style="padding: 10rem 0 6rem; background: var(--color-bg); position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; opacity: 0.03; background: radial-gradient(circle at 70% 30%, var(--color-accent, #667eea) 0%, transparent 50%);"></div>
        <div class="container" style="max-width: 1200px; position: relative;">
          <div style="max-width: 900px; margin: 0 auto; text-align: center;">
            ${data.tagline ? `
            <div style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-full); font-size: 0.875rem; font-weight: 600; margin-bottom: 2rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
              ${data.tagline}
            </div>
            ` : ''}
            <h1 style="font-size: clamp(2.5rem, 7vw, 5.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 2rem; letter-spacing: -0.03em;">
              ${data.headline || 'Your Headline'}
            </h1>
            <p style="font-size: clamp(1.125rem, 2vw, 1.375rem); color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
              ${data.description || ''}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <a href="#courses" class="btn" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">Explore Courses</a>
              <a href="#pricing" class="btn btn-outline" style="padding: 1.25rem 2.5rem; font-size: 1.0625rem;">View Pricing</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      ${data.stats && data.stats.length > 0 ? `
      <section style="padding: 5rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 4rem; text-align: center;">
            ${data.stats.map(stat => `
              <div>
                <div style="font-size: 3.5rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.02em; color: var(--color-accent, #667eea);">${stat.number}</div>
                <div style="color: var(--color-text-secondary); font-weight: 500; font-size: 1.0625rem;">${stat.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Features -->
      ${data.features && data.features.length > 0 ? `
      <section style="padding: 8rem 0;">
        <div class="container" style="max-width: 1400px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Why Choose ${data.platformName || 'Us'}</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Everything you need to succeed</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem;">
            ${data.features.map(feature => `
              <div class="card" style="padding: 2.5rem; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1.5rem;">${feature.icon || '📚'}</div>
                <h3 style="font-size: 1.375rem; font-weight: 600; margin-bottom: 1rem;">${feature.title || ''}</h3>
                <p style="color: var(--color-text-secondary); line-height: 1.8; font-size: 1rem;">${feature.description || ''}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Courses -->
      <section id="courses" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1400px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Featured Courses</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Start learning today with our expert-led courses</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;">
            ${data.courses && data.courses.length > 0 ? data.courses.map(course => `
              <div class="card" style="padding: 0; overflow: hidden;">
                <div style="aspect-ratio: 16/9; background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-border) 100%);"></div>
                <div style="padding: 2rem;">
                  <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
                    <span style="padding: 0.25rem 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary);">
                      ${course.level || 'Beginner'}
                    </span>
                    ${course.duration ? `
                    <span style="padding: 0.25rem 0.75rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary);">
                      ${course.duration}
                    </span>
                    ` : ''}
                  </div>
                  <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; line-height: 1.3;">${course.title || ''}</h3>
                  <p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1rem; font-size: 0.9375rem;">${course.description || ''}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--color-border);">
                    <div>
                      <div style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.25rem;">by ${course.instructor || ''}</div>
                      ${course.students ? `<div style="font-size: 0.8125rem; color: var(--color-text-secondary);">${course.students} students</div>` : ''}
                    </div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-accent, #667eea);">${course.price || ''}</div>
                  </div>
                </div>
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- Curriculum Sample -->
      ${data.curriculum && data.curriculum.length > 0 ? `
      <section style="padding: 8rem 0;">
        <div class="container" style="max-width: 1000px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Course Curriculum</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">A glimpse into what you'll learn</p>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${data.curriculum.map((module, idx) => `
              <div style="padding: 2rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; gap: 2rem;">
                  <div style="display: flex; gap: 1.5rem; align-items: start; flex: 1;">
                    <div style="width: 48px; height: 48px; background: var(--color-bg); border: 2px solid var(--color-border); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.125rem; flex-shrink: 0;">
                      ${idx + 1}
                    </div>
                    <div style="flex: 1;">
                      <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${module.module || ''}</h3>
                      <div style="display: flex; gap: 2rem; color: var(--color-text-secondary); font-size: 0.875rem; margin-bottom: 1rem;">
                        ${module.lessons ? `<div>${module.lessons} lessons</div>` : ''}
                        ${module.duration ? `<div>${module.duration}</div>` : ''}
                      </div>
                      ${module.topics ? `
                      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${module.topics.split(',').map(topic => `
                          <span style="padding: 0.25rem 0.75rem; background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 0.8125rem; color: var(--color-text-secondary);">
                            ${topic.trim()}
                          </span>
                        `).join('')}
                      </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Instructors -->
      ${data.instructors && data.instructors.length > 0 ? `
      <section id="instructors" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Learn From The Best</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Industry experts with real-world experience</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem;">
            ${data.instructors.map(instructor => `
              <div class="card" style="padding: 2.5rem; text-align: center;">
                <div style="width: 120px; height: 120px; background: var(--color-bg); border: 3px solid var(--color-border); border-radius: 50%; margin: 0 auto 1.5rem;"></div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${instructor.name || ''}</h3>
                <div style="font-size: 0.9375rem; color: var(--color-accent, #667eea); margin-bottom: 1rem; font-weight: 600;">${instructor.title || ''}</div>
                <p style="color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1rem; font-size: 0.9375rem;">${instructor.bio || ''}</p>
                ${instructor.students ? `
                <div style="padding-top: 1rem; border-top: 1px solid var(--color-border); font-size: 0.875rem; color: var(--color-text-secondary);">
                  <strong>${instructor.students}</strong> students taught
                </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Testimonials -->
      ${data.testimonials && data.testimonials.length > 0 ? `
      <section style="padding: 8rem 0;">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Student Success Stories</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Real results from real students</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
            ${data.testimonials.map(review => `
              <div class="card" style="padding: 2.5rem;">
                <div style="display: flex; gap: 0.25rem; margin-bottom: 1.5rem;">
                  ${Array(parseInt(review.rating || 5)).fill('⭐').join('')}
                </div>
                <p style="font-size: 1.0625rem; line-height: 1.8; margin-bottom: 1.5rem; color: var(--color-text);">
                  "${review.quote || ''}"
                </p>
                <div style="padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
                  <h4 style="font-weight: 600; margin-bottom: 0.25rem; font-size: 0.9375rem;">${review.author || ''}</h4>
                  <p style="color: var(--color-text-secondary); font-size: 0.875rem;">${review.role || ''}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Pricing -->
      <section id="pricing" style="padding: 8rem 0; background: var(--color-surface); border-top: 1px solid var(--color-border);">
        <div class="container" style="max-width: 1200px;">
          <div style="text-align: center; margin-bottom: 5rem;">
            <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em;">Choose Your Plan</h2>
            <p style="font-size: 1.125rem; color: var(--color-text-secondary);">Start learning today</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
            ${data.pricingPlans && data.pricingPlans.length > 0 ? data.pricingPlans.map(plan => `
              <div class="card" style="padding: 3rem 2.5rem; text-align: center;">
                <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">${plan.name || ''}</h3>
                <div style="margin-bottom: 1rem;">
                  <span style="font-size: 3.5rem; font-weight: 800; letter-spacing: -0.02em;">${plan.price || ''}</span>
                  ${plan.period ? `<span style="font-size: 1.125rem; color: var(--color-text-secondary);">${plan.period}</span>` : ''}
                </div>
                <p style="color: var(--color-text-secondary); margin-bottom: 2rem; min-height: 3em; line-height: 1.6; font-size: 0.9375rem;">
                  ${plan.description || ''}
                </p>
                <a href="#" class="btn" style="width: 100%; padding: 1rem; margin-bottom: 2rem; font-size: 1rem;">
                  Get Started
                </a>
                ${plan.features ? `
                <div style="text-align: left; padding-top: 2rem; border-top: 1px solid var(--color-border);">
                  ${plan.features.split(',').map(feature => `
                    <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; font-size: 0.9375rem;">
                      <span style="color: var(--color-accent, #667eea); font-weight: 700; flex-shrink: 0;">✓</span>
                      <span style="color: var(--color-text-secondary); line-height: 1.6;">${feature.trim()}</span>
                    </div>
                  `).join('')}
                </div>
                ` : ''}
              </div>
            `).join('') : ''}
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section style="padding: 8rem 0;">
        <div class="container" style="max-width: 800px; text-align: center;">
          <h2 style="font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-bottom: 1.5rem; letter-spacing: -0.02em;">
            Ready to Start Learning?
          </h2>
          <p style="font-size: 1.25rem; color: var(--color-text-secondary); margin-bottom: 3rem; line-height: 1.7;">
            Join thousands of students transforming their careers
          </p>
          <a href="#pricing" class="btn" style="padding: 1.25rem 3rem; font-size: 1.125rem;">
            Start Your Journey Today
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 4rem 0; border-top: 1px solid var(--color-border); text-align: center; background: var(--color-surface);">
        <div class="container">
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">${data.platformName || 'LearnHub'}</h3>
            ${data.contactEmail ? `<a href="mailto:${data.contactEmail}" style="color: var(--color-text-secondary); text-decoration: none; font-size: 0.9375rem;">${data.contactEmail}</a>` : ''}
          </div>
          <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
            © 2024 ${data.platformName || 'LearnHub'}. Empowering learners worldwide.
          </p>
        </div>
      </footer>

      <style>
        @media (max-width: 768px) {
          nav > div > div:last-child > a:not(.btn) { display: none; }
        }
      </style>
    `
  })
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