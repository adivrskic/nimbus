function getStyleValue(data, key, defaultValue) {
  const userModified = data.__userModifiedStyles?.[key];
  return userModified ? data[key] : defaultValue;
}

export function generateHTML(templateId, customization, images = {}) {
  const templates = {
    'business-card': generateBusinessCard,
    'profile': generateProfile,
    'product-launch': generateProductLaunch,
    'startup-hero': generateStartupHero,
    'fine-dining': generateFineDining,
    'casual-bistro': generateCasualBistro,
    'creative-portfolio': generateCreativePortfolio,
    'agency-showcase': generateAgencyShowcase,
    'saas-product': generateSaaSProduct,
    'consulting-firm': generateConsultingFirm,
    'split-profile': generateSplitProfile,
    'photography-grid': generatePhotographyGrid,
    'photography-masonry': generatePhotographyMasonry,
    'wedding-invite': generateWeddingInvite,
    'event-landing': generateEventLanding,
    'baby-announcement': generateBabyAnnouncement,
    'teacher-profile': generateTeacherProfile,
    'student-portfolio': generateStudentPortfolio,
    'fitness-trainer': generateFitnessTrainer,
    'wellness-coach': generateWellnessCoach,
    'musician-band': generateMusicianBand,
    'cleaning-service': generateCleaningService,
    'real-estate-agent': generateRealEstateAgent,
  };

  const generator = templates[templateId];
  if (!generator) {
    return '<h1>Template not found</h1>';
  }

  return generator({ ...customization, __images: images });
}

function generateBusinessCard(data) {
  const { 
    name = 'Alex Morgan',
    title = 'Product Designer',
    company = 'Creative Studio',
    location = 'San Francisco, CA',
    contactInfo = [],
  } = data;

  const accentColor = getStyleValue(data, 'accentColor', '#eb1736');
  const darkMode = getStyleValue(data, 'darkMode', 'Auto');

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const contactHTML = contactInfo.map((contact, index) => {
    const href = contact.type === 'Email' ? `mailto:${contact.value}` 
      : contact.type === 'Phone' ? `tel:${contact.value.replace(/\s/g, '')}` 
      : `https://${contact.value}`;
    
    const icon = contact.type === 'Email' ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>`
      : contact.type === 'Phone' ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>`;

    return `
      <a href="${href}" class="contact-item" data-editable="contactInfo.${index}">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${icon}
        </svg>
        <span data-editable="contactInfo.${index}.value">${contact.value}</span>
      </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f5f5f7;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --border: #e5e5e7;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #000000;
        --surface: #1c1c1e;
        --text-primary: #f5f5f7;
        --text-secondary: #98989d;
        --border: #38383a;
      }
    }
    
    html.dark {
      --bg: #000000;
      --surface: #1c1c1e;
      --text-primary: #f5f5f7;
      --text-secondary: #98989d;
      --border: #38383a;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      transition: background 0.3s, color 0.3s;
    }
    
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 48px;
      max-width: 900px;
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1px 1fr;
      gap: 48px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: background 0.3s, border 0.3s;
    }
    
    @media (max-width: 768px) {
      .card {
        grid-template-columns: 1fr;
        gap: 32px;
        padding: 32px;
      }
      
      .divider {
        display: none;
      }
    }
    
    .divider {
      width: 1px;
      background: var(--border);
    }
    
    .left-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: white;
      font-weight: 700;
      box-shadow: 0 4px 16px ${accentColor}30;
    }
    
    .name-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }
    
    .title {
      font-size: 16px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .company {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      width: fit-content;
      margin-top: 8px;
    }
    
    .company::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }
    
    .right-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .section-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .contact-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      text-decoration: none;
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .contact-item:hover {
      border-color: var(--accent);
      transform: translateX(2px);
    }
    
    .contact-item svg {
      width: 18px;
      height: 18px;
      color: var(--text-secondary);
      flex-shrink: 0;
    }
    
    .contact-item:hover svg {
      color: var(--accent);
    }
    
    .location-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 14px;
      color: var(--text-secondary);
      width: fit-content;
    }
    
    .location-tag svg {
      width: 16px;
      height: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="left-section">
      <div class="avatar" data-editable="name">${name.charAt(0).toUpperCase()}</div>
      
      <div class="name-section">
        <h1 data-editable="name">${name}</h1>
        <p class="title" data-editable="title">${title}</p>
      </div>
      
      <div class="company" data-editable="company">${company}</div>
      
      <div class="location-tag" data-editable="location">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        ${location}
      </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="right-section">
      ${contactInfo.length > 0 ? `
      <div>
        <div class="section-label">Contact</div>
        <div class="contact-group">
          ${contactHTML}
        </div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}
function generateSplitProfile(data) {
  const {
    name = 'Marcus Thompson',
    role = 'Digital Creator',
    location = 'Los Angeles, CA',
    bio = 'I create compelling content that bridges creativity and technology. Specializing in visual storytelling, brand development, and digital experiences that leave lasting impressions.',
    availability = 'Available for Projects',
    skills = [],
    contactInfo = [],
    socialLinks = [],
    accentColor = '#eb1736',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const skillsHTML = skills.map((skill, index) => `
    <div class="skill-tag" data-editable="skills.${index}">${skill}</div>
  `).join('');

  const contactHTML = contactInfo.map((contact, index) => {
    const href = contact.type === 'Email' ? `mailto:${contact.value}` 
      : contact.type === 'Phone' ? `tel:${contact.value.replace(/\s/g, '')}` 
      : `https://${contact.value}`;
    
    return `
    <div class="contact-item">
      <div class="contact-label" data-editable="contactInfo.${index}.type">${contact.type}</div>
      <div class="contact-value">
        <a href="${href}" data-editable="contactInfo.${index}.value">${contact.value}</a>
      </div>
    </div>
    `;
  }).join('');

  const socialLinksHTML = socialLinks.map((social, index) => {
    const url = social.url.startsWith('@') ? social.url.substring(1) : social.url;
    const href = social.url.startsWith('http') ? social.url : `https://${url}`;
    
    return `
    <a href="${href}" target="_blank" class="social-item" data-editable="socialLinks.${index}">
      <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </svg>
      <span data-editable="socialLinks.${index}.platform">${social.platform}</span>
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${role}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f8f9fa;
      --text-primary: #0a0a0a;
      --text-secondary: #6b6b6b;
      --border: #e5e5e5;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #000000;
        --surface: #0f0f0f;
        --text-primary: #ffffff;
        --text-secondary: #a3a3a3;
        --border: #262626;
      }
    }
    
    html.dark {
      --bg: #000000;
      --surface: #0f0f0f;
      --text-primary: #ffffff;
      --text-secondary: #a3a3a3;
      --border: #262626;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      min-height: 100vh;
    }
    
    @media (max-width: 1024px) {
      .container {
        grid-template-columns: 1fr;
      }
    }
    
    .image-side {
      position: relative;
      background: linear-gradient(135deg, ${accentColor}20, ${accentColor}05);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    @media (max-width: 1024px) {
      .image-side {
        min-height: 50vh;
      }
    }
    
    .image-side::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 30% 50%, ${accentColor}15 0%, transparent 60%),
        radial-gradient(circle at 70% 80%, ${accentColor}10 0%, transparent 50%);
    }
    
    .image-placeholder {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 40px;
    }
    
    .profile-image {
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 96px;
      color: white;
      font-weight: 900;
      margin: 0 auto 24px;
      box-shadow: 0 20px 60px ${accentColor}40;
      position: relative;
    }
    
    @media (max-width: 1024px) {
      .profile-image {
        width: 200px;
        height: 200px;
        font-size: 72px;
      }
    }
    
    .profile-image::after {
      content: '';
      position: absolute;
      inset: -8px;
      border-radius: 50%;
      border: 2px solid var(--accent);
      opacity: 0.3;
    }
    
    .content-side {
      padding: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }
    
    @media (max-width: 1024px) {
      .content-side {
        padding: 60px 40px;
      }
    }
    
    @media (max-width: 768px) {
      .content-side {
        padding: 40px 24px;
      }
    }
    
    .availability-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 32px;
      width: fit-content;
    }
    
    .availability-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    h1 {
      font-size: clamp(40px, 6vw, 56px);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 12px;
    }
    
    .role {
      font-size: clamp(18px, 2.5vw, 24px);
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .location {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .bio {
      font-size: 17px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 48px;
      max-width: 600px;
    }
    
    .section {
      margin-bottom: 48px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      max-width: 500px;
    }
    
    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .skill-tag {
      padding: 12px 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      transition: all 0.2s;
    }
    
    .skill-tag:hover {
      border-color: var(--accent);
      background: var(--bg);
      transform: translateY(-2px);
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      max-width: 600px;
    }
    
    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .contact-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .contact-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }
    
    .contact-value {
      font-size: 14px;
      font-weight: 500;
    }
    
    .contact-value a {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .contact-value a:hover {
      color: var(--accent);
    }
    
    .social-list {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .social-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .social-item:hover {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
      transform: translateY(-2px);
    }
    
    .social-item svg {
      width: 18px;
      height: 18px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="image-side">
      <div class="image-placeholder">
        <div class="profile-image">${name.charAt(0).toUpperCase()}</div>
      </div>
    </div>

    <div class="content-side">
      <div class="availability-badge">
        <span class="availability-dot"></span>
        <span data-editable="availability">${availability}</span>
      </div>

      <h1 data-editable="name">${name}</h1>
      <div class="role" data-editable="role">${role}</div>
      <div class="location">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span data-editable="location">${location}</span>
      </div>

      <p class="bio" data-editable="bio">${bio}</p>

      ${skills.length > 0 ? `
      <div class="section">
        <div class="section-title">Expertise</div>
        <div class="skills-grid">
          ${skillsHTML}
        </div>
      </div>
      ` : ''}

      ${contactInfo.length > 0 ? `
      <div class="section">
        <div class="section-title">Contact</div>
        <div class="contact-grid">
          ${contactHTML}
        </div>
      </div>
      ` : ''}

      ${socialLinks.length > 0 ? `
      <div class="section">
        <div class="section-title">Connect</div>
        <div class="social-list">
          ${socialLinksHTML}
        </div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}
function generateProfile(data) {
  const {
    name = 'Jordan Chen',
    tagline = 'Creative Developer & Designer',
    bio = 'I craft beautiful digital experiences that merge creativity with functionality. Passionate about clean code and elegant design.',
    socialLinks = [],
    accentColor = '#eb1736',
    darkMode = 'Auto'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const getSocialIcon = (platform) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('email')) {
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>`;
    } else if (platformLower.includes('twitter') || platformLower.includes('x')) {
      return `<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`;
    } else if (platformLower.includes('github')) {
      return `<path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>`;
    } else if (platformLower.includes('linkedin')) {
      return `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`;
    }
    return `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>`;
  };

  const linksHTML = socialLinks.map((link, index) => {
    const href = link.url.includes('@') ? `mailto:${link.url}` 
      : link.url.startsWith('http') ? link.url 
      : `https://${link.url}`;
    
    return `
    <a href="${href}" ${link.url.includes('@') ? '' : 'target="_blank"'} class="link-item" data-editable="socialLinks.${index}">
      <div class="link-icon">
        <svg fill="currentColor" viewBox="0 0 24 24">
          ${getSocialIcon(link.platform)}
        </svg>
      </div>
      <div class="link-content">
        <div class="link-label" data-editable="socialLinks.${index}.platform">${link.platform}</div>
        <div class="link-value" data-editable="socialLinks.${index}.url">${link.url}</div>
      </div>
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f5f5f7;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --border: #e5e5e7;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #000000;
        --surface: #1c1c1e;
        --text-primary: #f5f5f7;
        --text-secondary: #98989d;
        --border: #38383a;
      }
    }
    
    html.dark {
      --bg: #000000;
      --surface: #1c1c1e;
      --text-primary: #f5f5f7;
      --text-secondary: #98989d;
      --border: #38383a;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      transition: background 0.3s, color 0.3s;
    }
    
    .profile {
      max-width: 600px;
      width: 100%;
    }
    
    .profile-header {
      text-align: center;
      margin-bottom: 48px;
    }
    
    .avatar-large {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: white;
      font-weight: 700;
      margin: 0 auto 24px;
      box-shadow: 0 8px 32px ${accentColor}40;
      position: relative;
    }
    
    .avatar-large::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid var(--border);
      pointer-events: none;
    }
    
    h1 {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    
    .tagline {
      font-size: 18px;
      color: var(--text-secondary);
      font-weight: 500;
      margin-bottom: 24px;
    }
    
    .bio {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-secondary);
      max-width: 480px;
      margin: 0 auto;
    }
    
    .divider {
      height: 1px;
      background: var(--border);
      margin: 48px 0;
    }
    
    .section {
      margin-bottom: 32px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .links-grid {
      display: grid;
      gap: 12px;
    }
    
    .link-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      text-decoration: none;
      color: var(--text-primary);
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .link-item:hover {
      border-color: var(--accent);
      background: var(--bg);
      transform: translateY(-2px);
    }
    
    .link-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--bg);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .link-item:hover .link-icon {
      background: var(--accent);
      border-color: var(--accent);
    }
    
    .link-icon svg {
      width: 20px;
      height: 20px;
      color: var(--text-secondary);
    }
    
    .link-item:hover .link-icon svg {
      color: white;
    }
    
    .link-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .link-label {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .link-value {
      font-size: 15px;
      color: var(--text-primary);
    }
  </style>
</head>
<body>
  <div class="profile">
    <div class="profile-header">
      <div class="avatar-large" data-editable="name">${name.charAt(0).toUpperCase()}</div>
      <h1 data-editable="name">${name}</h1>
      <p class="tagline" data-editable="tagline">${tagline}</p>
      <p class="bio" data-editable="bio">${bio}</p>
    </div>
    
    <div class="divider"></div>
    
    ${socialLinks.length > 0 ? `
    <div class="section">
      <div class="section-title">Connect</div>
      <div class="links-grid">
        ${linksHTML}
      </div>
    </div>
    ` : ''}
  </div>
</body>
</html>`;
}
function generateStartupHero(data) {
  const {
    companyName = 'Velocity',
    headline = 'Ship Faster. Build Better.',
    subheadline = 'The all-in-one platform for modern development teams. Deploy in seconds, scale effortlessly, and focus on what matters—building great products.',
    ctaPrimary = 'Get Started Free',
    ctaSecondary = 'View Demo',
    email = 'hello@velocity.com',
    stats = [],
    accentColor = '#eb1736',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const statsHTML = stats.map((stat, index) => `
    <div class="stat">
      <div class="stat-value" data-editable="stats.${index}.value">${stat.value}</div>
      <div class="stat-label" data-editable="stats.${index}.label">${stat.label}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${companyName} - ${headline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f5f5f7;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --border: #e5e5e7;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #000000;
        --surface: #1c1c1e;
        --text-primary: #f5f5f7;
        --text-secondary: #98989d;
        --border: #38383a;
      }
    }
    
    html.dark {
      --bg: #000000;
      --surface: #1c1c1e;
      --text-primary: #f5f5f7;
      --text-secondary: #98989d;
      --border: #38383a;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      transition: background 0.3s, color 0.3s;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 48px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 24px;
      }
    }
    
    .header {
      padding: 24px 0;
      border-bottom: 1px solid var(--border);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }
    
    .logo-accent {
      color: var(--accent);
    }
    
    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    
    @media (max-width: 768px) {
      .header-actions .btn-secondary {
        display: none;
      }
    }
    
    .btn {
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-primary {
      background: var(--accent);
      color: white;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px ${accentColor}40;
    }
    
    .btn-secondary {
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--border);
    }
    
    .btn-secondary:hover {
      background: var(--surface);
    }
    
    .hero {
      padding: 120px 0 80px;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 80px 0 60px;
      }
    }
    
    .hero-content {
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }
    
    .announcement {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 32px;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .announcement:hover {
      border-color: var(--accent);
    }
    
    .announcement-badge {
      padding: 4px 10px;
      background: var(--accent);
      color: white;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 700;
    }
    
    h1 {
      font-size: clamp(48px, 7vw, 72px);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
    }
    
    .hero-subheadline {
      font-size: clamp(18px, 2vw, 20px);
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 40px;
    }
    
    .hero-cta {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 80px;
    }
    
    .btn-lg {
      padding: 18px 36px;
      font-size: 16px;
      border-radius: 12px;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(${Math.min(stats.length, 3)}, 1fr);
      gap: 48px;
      max-width: 800px;
      margin: 0 auto;
      padding: 48px 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .stats {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-value {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <span data-editable="companyName">${companyName}</span><span class="logo-accent">.</span>
        </div>
        <div class="header-actions">
          <a href="#pricing" class="btn btn-secondary">Pricing</a>
          <a href="#signup" class="btn btn-primary">Sign Up</a>
        </div>
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <a href="#" class="announcement">
          <span class="announcement-badge">NEW</span>
          Introducing <span data-editable="companyName">${companyName}</span> 2.0
        </a>
        
        <h1 data-editable="headline">${headline}</h1>
        <p class="hero-subheadline" data-editable="subheadline">${subheadline}</p>
        
        <div class="hero-cta">
          <a href="#signup" class="btn btn-primary btn-lg" data-editable="ctaPrimary">
            ${ctaPrimary}
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
          <a href="#demo" class="btn btn-secondary btn-lg" data-editable="ctaSecondary">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            ${ctaSecondary}
          </a>
        </div>
        
        ${stats.length > 0 ? `
        <div class="stats">
          ${statsHTML}
        </div>
        ` : ''}
      </div>
    </div>
  </section>
</body>
</html>`;
}
function generateProductLaunch(data) {
  const {
    productName = 'Nexus',
    tagline = 'The Future of Productivity',
    description = 'Transform the way you work with AI-powered tools that adapt to your workflow. Experience seamless collaboration and unprecedented efficiency.',
    ctaText = 'Start Free Trial',
    ctaUrl = '#signup',
    features = [],
    socialLinks = [],
    accentColor = '#eb1736',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const featuresHTML = features.slice(0, 3).map((feature, index) => {
    const icons = ['⚡', '🤝', '🔒', '🎯', '🚀', '⭐'];
    return `
    <div class="feature-card">
      <div class="feature-icon">${icons[index] || '✨'}</div>
      <div class="feature-title" data-editable="features.${index}.name">${feature.name}</div>
    </div>
    `;
  }).join('');

  const socialHTML = socialLinks.slice(0, 2).map((social, index) => {
    const href = social.url.startsWith('http') ? social.url : `https://${social.url}`;
    const icon = social.platform.toLowerCase().includes('twitter') || social.platform.toLowerCase().includes('x')
      ? `<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>`
      : `<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`;
    
    return `
    <a href="${href}" target="_blank" class="social-link" data-editable="socialLinks.${index}">
      <svg fill="currentColor" viewBox="0 0 24 24">
        ${icon}
      </svg>
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f5f5f7;
      --text-primary: #1d1d1f;
      --text-secondary: #86868b;
      --border: #e5e5e7;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #000000;
        --surface: #1c1c1e;
        --text-primary: #f5f5f7;
        --text-secondary: #98989d;
        --border: #38383a;
      }
    }
    
    html.dark {
      --bg: #000000;
      --surface: #1c1c1e;
      --text-primary: #f5f5f7;
      --text-secondary: #98989d;
      --border: #38383a;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      overflow-x: hidden;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    
    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 48px;
      position: relative;
      z-index: 10;
    }
    
    @media (max-width: 768px) {
      .nav {
        padding: 20px 24px;
      }
    }
    
    .logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--accent), var(--text-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .nav-links {
      display: flex;
      gap: 32px;
      align-items: center;
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }
    
    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
      transition: color 0.2s;
    }
    
    .nav-link:hover {
      color: var(--text-primary);
    }
    
    .hero-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 80px 48px;
      position: relative;
      z-index: 2;
    }
    
    @media (max-width: 768px) {
      .hero-content {
        padding: 60px 24px;
      }
    }
    
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }
    
    .hero-gradient {
      position: absolute;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, ${accentColor}20 0%, transparent 70%);
      filter: blur(80px);
      animation: float 25s infinite ease-in-out;
    }
    
    .gradient-1 {
      top: -400px;
      left: -200px;
    }
    
    .gradient-2 {
      bottom: -400px;
      right: -200px;
      animation-delay: -12s;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(100px, -100px) scale(1.1); }
      66% { transform: translate(-50px, 50px) scale(0.9); }
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
    
    h1 {
      font-size: clamp(48px, 8vw, 96px);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
      max-width: 900px;
    }
    
    .gradient-text {
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-description {
      font-size: clamp(18px, 2vw, 22px);
      line-height: 1.6;
      color: var(--text-secondary);
      max-width: 700px;
      margin-bottom: 48px;
    }
    
    .cta-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 64px;
    }
    
    .btn {
      padding: 18px 36px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    
    .btn-primary {
      background: var(--accent);
      color: white;
      box-shadow: 0 4px 16px ${accentColor}40;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${accentColor}50;
    }
    
    .btn-secondary {
      background: var(--surface);
      color: var(--text-primary);
      border: 1px solid var(--border);
    }
    
    .btn-secondary:hover {
      background: var(--bg);
      border-color: var(--text-secondary);
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(${Math.min(features.length, 3)}, 1fr);
      gap: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      .features {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
    
    .feature-card {
      padding: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s;
    }
    
    .feature-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
      box-shadow: 0 8px 32px ${accentColor}15;
    }
    
    .feature-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }
    
    .feature-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .footer {
      padding: 48px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    @media (max-width: 768px) {
      .footer {
        flex-direction: column;
        gap: 24px;
        text-align: center;
        padding: 32px 24px;
      }
    }
    
    .footer-text {
      color: var(--text-secondary);
      font-size: 14px;
    }
    
    .social-links {
      display: flex;
      gap: 16px;
    }
    
    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--surface);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .social-link:hover {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
      transform: translateY(-2px);
    }
    
    .social-link svg {
      width: 20px;
      height: 20px;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-bg">
      <div class="hero-gradient gradient-1"></div>
      <div class="hero-gradient gradient-2"></div>
    </div>
    
    <nav class="nav">
      <div class="logo" data-editable="productName">${productName}</div>
      <div class="nav-links">
        <a href="#features" class="nav-link">Features</a>
        <a href="#pricing" class="nav-link">Pricing</a>
        <a href="#docs" class="nav-link">Docs</a>
      </div>
    </nav>
    
    <div class="hero-content">
      <div class="badge">
        <span class="badge-dot"></span>
        Now in Beta
      </div>
      
      <h1>
        <span data-editable="productName">${productName}</span><br>
        <span class="gradient-text" data-editable="tagline">${tagline}</span>
      </h1>
      
      <p class="hero-description" data-editable="description">${description}</p>
      
      <div class="cta-group">
        <a href="${ctaUrl}" class="btn btn-primary" data-editable="ctaText">
          ${ctaText}
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </a>
        <a href="#demo" class="btn btn-secondary">Watch Demo</a>
      </div>
      
      ${features.length > 0 ? `
      <div class="features">
        ${featuresHTML}
      </div>
      ` : ''}
    </div>
    
    <footer class="footer">
      <div class="footer-text">© 2024 <span data-editable="productName">${productName}</span>. All rights reserved.</div>
      ${socialLinks.length > 0 ? `
      <div class="social-links">
        ${socialHTML}
      </div>
      ` : ''}
    </footer>
  </div>
</body>
</html>`;
}
function generateCasualBistro(data) {
  const {
    restaurantName = 'The Daily Grind',
    tagline = 'Fresh. Local. Delicious.',
    location = 'Downtown Portland',
    phone = '(555) 987-6543',
    instagram = '@thedailygrind',
    specialText = "Chef's Special: Wild Mushroom Risotto",
    breakfastItems = [],
    lunchItems = [],
    drinks = [],
    accentColor = '#eb1736',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const generateMenuCategory = (items, category, icon) => {
    if (items.length === 0) return '';
    
    const itemsHTML = items.map((item, index) => `
      <div class="menu-item">
        <div class="item-details">
          <h3 class="item-name" data-editable="${category}.${index}.name">${item.name}</h3>
          <p class="item-description" data-editable="${category}.${index}.description">${item.description}</p>
        </div>
        <div class="item-price" data-editable="${category}.${index}.price">$${item.price}</div>
      </div>
    `).join('');

    const categoryTitle = category === 'breakfastItems' ? 'Breakfast' 
      : category === 'lunchItems' ? 'Lunch' 
      : 'Drinks';

    return `
      <div class="menu-category">
        <div class="category-header">
          <span class="category-icon">${icon}</span>
          <h2 class="category-title">${categoryTitle}</h2>
        </div>
        <div class="menu-items">
          ${itemsHTML}
        </div>
      </div>
    `;
  };

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${restaurantName} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #fef9f5;
      --text-primary: #2d2d2d;
      --text-secondary: #666666;
      --border: #e8e5e0;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #1a1614;
        --surface: #2a2421;
        --text-primary: #f5f5f5;
        --text-secondary: #b8b8b8;
        --border: #3a3431;
      }
    }
    
    html.dark {
      --bg: #1a1614;
      --surface: #2a2421;
      --text-primary: #f5f5f5;
      --text-secondary: #b8b8b8;
      --border: #3a3431;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      transition: background 0.3s, color 0.3s;
    }
    
    .page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      background: var(--surface);
      border-bottom: 3px solid var(--accent);
      padding: 40px 32px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 32px 24px;
      }
    }
    
    .restaurant-name {
      font-size: clamp(36px, 6vw, 56px);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
      color: var(--text-primary);
    }
    
    .tagline {
      font-family: 'Caveat', cursive;
      font-size: clamp(24px, 4vw, 32px);
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 24px;
    }
    
    .header-info {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .header-info-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .header-info-item svg {
      width: 18px;
      height: 18px;
      color: var(--accent);
    }
    
    .special-banner {
      background: var(--accent);
      color: white;
      padding: 16px 32px;
      text-align: center;
      font-weight: 600;
      font-size: 16px;
    }
    
    @media (max-width: 768px) {
      .special-banner {
        padding: 14px 24px;
        font-size: 14px;
      }
    }
    
    .content {
      flex: 1;
      max-width: 1000px;
      width: 100%;
      margin: 0 auto;
      padding: 48px 32px;
    }
    
    @media (max-width: 768px) {
      .content {
        padding: 32px 24px;
      }
    }
    
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
    }
    
    @media (max-width: 768px) {
      .menu-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
    
    .menu-category {
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: all 0.3s;
    }
    
    .menu-category:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
    
    .category-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--accent);
    }
    
    .category-icon {
      font-size: 32px;
    }
    
    .category-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    
    .menu-items {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .menu-item {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }
    
    .item-details {
      flex: 1;
    }
    
    .item-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text-primary);
    }
    
    .item-description {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    
    .item-price {
      font-size: 20px;
      font-weight: 700;
      color: var(--accent);
      white-space: nowrap;
    }
    
    .footer {
      background: var(--surface);
      border-top: 2px solid var(--border);
      padding: 40px 32px;
      text-align: center;
    }
    
    .footer-content {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .footer-logo {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 16px;
    }
    
    .social-links {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 24px;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 100px;
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .social-link:hover {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
      transform: translateY(-2px);
    }
    
    .social-link svg {
      width: 18px;
      height: 18px;
    }
    
    .footer-note {
      margin-top: 32px;
      font-size: 14px;
      color: var(--text-secondary);
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="header">
      <h1 class="restaurant-name" data-editable="restaurantName">${restaurantName}</h1>
      <p class="tagline" data-editable="tagline">${tagline}</p>
      <div class="header-info">
        <div class="header-info-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span data-editable="location">${location}</span>
        </div>
        <div class="header-info-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span data-editable="phone">${phone}</span>
        </div>
      </div>
    </header>
    
    <div class="special-banner" data-editable="specialText">
      ${specialText}
    </div>
    
    <main class="content">
      <div class="menu-grid">
        ${generateMenuCategory(breakfastItems, 'breakfastItems', '🍳')}
        ${generateMenuCategory(lunchItems, 'lunchItems', '🥪')}
        ${generateMenuCategory(drinks, 'drinks', '☕')}
      </div>
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo" data-editable="restaurantName">${restaurantName}</div>
        <div class="social-links">
          <a href="tel:${phone.replace(/\s/g, '')}" class="social-link" data-editable="phone">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            Call Us
          </a>
          <a href="https://instagram.com/${instagram.replace('@', '')}" target="_blank" class="social-link" data-editable="instagram">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            ${instagram}
          </a>
        </div>
        <p class="footer-note">Made with ❤️ and locally sourced ingredients</p>
      </div>
    </footer>
  </div>
</body>
</html>`;
}
function generateFineDining(data) {
  const {
    restaurantName = 'Élégance',
    tagline = 'Contemporary French Cuisine',
    chefName = 'Chef Laurent Dubois',
    address = '123 Gourmet Avenue, New York, NY',
    phone = '+1 (555) 123-4567',
    hours = 'Tue-Sat: 5:30 PM - 10:30 PM',
    appetizers = [],
    entrees = [],
    desserts = [],
    accentColor = '#d4af37',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const generateMenuItems = (items, section) => items.map((item, index) => `
    <div class="menu-item">
      <div class="item-info">
        <h3 class="item-name" data-editable="${section}.${index}.name">${item.name}</h3>
        <p class="item-description" data-editable="${section}.${index}.description">${item.description}</p>
      </div>
      <div class="item-price" data-editable="${section}.${index}.price">$${item.price}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${restaurantName} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #fafafa;
      --surface: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --border: #e0e0e0;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0a0a0a;
        --surface: #1a1a1a;
        --text-primary: #f5f5f5;
        --text-secondary: #a0a0a0;
        --border: #2a2a2a;
      }
    }
    
    html.dark {
      --bg: #0a0a0a;
      --surface: #1a1a1a;
      --text-primary: #f5f5f5;
      --text-secondary: #a0a0a0;
      --border: #2a2a2a;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 40px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 40px 24px;
      }
    }
    
    .header {
      text-align: center;
      padding-bottom: 48px;
      border-bottom: 2px solid var(--accent);
      margin-bottom: 48px;
    }
    
    .restaurant-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(48px, 8vw, 72px);
      font-weight: 300;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
      color: var(--accent);
    }
    
    .tagline {
      font-size: 16px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-secondary);
      font-weight: 400;
      margin-bottom: 32px;
    }
    
    .chef-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 20px;
      font-style: italic;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }
    
    .divider {
      width: 60px;
      height: 1px;
      background: var(--accent);
      margin: 24px auto;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      padding: 32px 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 48px;
    }
    
    @media (max-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    @media (max-width: 768px) {
      .info-item {
        align-items: center;
      }
    }
    
    .info-label {
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-secondary);
      font-weight: 600;
    }
    
    .info-value {
      font-size: 14px;
      color: var(--text-primary);
    }
    
    .menu-section {
      margin-bottom: 64px;
    }
    
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 36px;
      font-weight: 400;
      text-align: center;
      margin-bottom: 40px;
      color: var(--accent);
      position: relative;
    }
    
    .section-title::after {
      content: '';
      display: block;
      width: 40px;
      height: 1px;
      background: var(--accent);
      margin: 16px auto 0;
    }
    
    .menu-items {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    
    .menu-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }
    
    .menu-item:last-child {
      border-bottom: none;
    }
    
    .item-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .item-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-weight: 500;
      color: var(--text-primary);
    }
    
    .item-description {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      font-weight: 300;
    }
    
    .item-price {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-weight: 400;
      color: var(--accent);
      white-space: nowrap;
    }
    
    .footer {
      margin-top: 80px;
      padding-top: 48px;
      border-top: 2px solid var(--accent);
      text-align: center;
    }
    
    .footer-text {
      font-size: 12px;
      color: var(--text-secondary);
      letter-spacing: 0.05em;
    }
    
    .ornament {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      color: var(--accent);
      margin: 16px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="ornament">✦</div>
      <h1 class="restaurant-name" data-editable="restaurantName">${restaurantName}</h1>
      <p class="tagline" data-editable="tagline">${tagline}</p>
      <div class="divider"></div>
      <p class="chef-name" data-editable="chefName">${chefName}</p>
    </header>
    
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Location</div>
        <div class="info-value" data-editable="address">${address}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Reservations</div>
        <div class="info-value" data-editable="phone">${phone}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Hours</div>
        <div class="info-value" data-editable="hours">${hours}</div>
      </div>
    </div>
    
    ${appetizers.length > 0 ? `
    <section class="menu-section">
      <h2 class="section-title">Appetizers</h2>
      <div class="menu-items">
        ${generateMenuItems(appetizers, 'appetizers')}
      </div>
    </section>
    ` : ''}
    
    ${entrees.length > 0 ? `
    <section class="menu-section">
      <h2 class="section-title">Entrées</h2>
      <div class="menu-items">
        ${generateMenuItems(entrees, 'entrees')}
      </div>
    </section>
    ` : ''}
    
    ${desserts.length > 0 ? `
    <section class="menu-section">
      <h2 class="section-title">Desserts</h2>
      <div class="menu-items">
        ${generateMenuItems(desserts, 'desserts')}
      </div>
    </section>
    ` : ''}
    
    <footer class="footer">
      <div class="ornament">✦</div>
      <p class="footer-text">
        Thank you for dining with us<br>
        <span data-editable="restaurantName">${restaurantName}</span>
      </p>
    </footer>
  </div>
</body>
</html>`;
}
function generateCreativePortfolio(data) {
  const {
    name = 'Alex Rivera',
    headline = 'Creative Director & Designer',
    heroSubtitle = 'I craft digital experiences that blend artistry with functionality.',
    aboutTitle = 'About Me',
    aboutText = "With over 8 years of experience in design and creative direction...",
    stats = [],
    projects = [],
    services = [],
    contactInfo = [],
    socialLinks = [],
    accentColor = '#eb1736',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const statsHTML = stats.map((stat, index) => `
    <div class="stat">
      <div class="stat-value" data-editable="stats.${index}.value">${stat.value}</div>
      <div class="stat-label" data-editable="stats.${index}.label">${stat.label}</div>
    </div>
  `).join('');

  const projectsHTML = projects.map((project, index) => {
    // Get the project image from the images object
    const imageKey = `projects.${index}.image`;
    const projectImage = data.__images?.[imageKey];
    
    const imageHTML = projectImage
      ? `<img src="${projectImage.url}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">`
      : `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${accentColor}15, ${accentColor}05);"></div>`;
    
    return `
    <div class="project-card">
      <div class="project-image">${imageHTML}</div>
      <div class="project-content">
        <span class="project-category" data-editable="projects.${index}.category">${project.category}</span>
        <h3 class="project-title" data-editable="projects.${index}.title">${project.title}</h3>
        <p class="project-description" data-editable="projects.${index}.description">${project.description}</p>
      </div>
    </div>
    `;
  }).join('');

  const servicesHTML = services.map((service, index) => `
    <div class="service-card">
      <div class="service-icon">✨</div>
      <h3 class="service-title" data-editable="services.${index}.name">${service.name}</h3>
      <p class="service-description" data-editable="services.${index}.description">${service.description}</p>
    </div>
  `).join('');

  const contactHTML = contactInfo.map((contact, index) => `
    <div class="contact-item">
      <div class="contact-label" data-editable="contactInfo.${index}.type">${contact.type}</div>
      <div class="contact-value">
        <a href="${contact.type === 'Email' ? `mailto:${contact.value}` : contact.type === 'Phone' ? `tel:${contact.value}` : '#'}" 
           data-editable="contactInfo.${index}.value">${contact.value}</a>
      </div>
    </div>
  `).join('');

  const socialHTML = socialLinks.map((social, index) => {
    const href = social.url.startsWith('http') ? social.url : `https://${social.url}`;
    return `
    <a href="${href}" target="_blank" class="social-link" data-editable="socialLinks.${index}">
      <svg class="social-icon" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      </svg>
      <span data-editable="socialLinks.${index}.platform">${social.platform}</span>
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${headline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f8f9fa;
      --text-primary: #0a0a0a;
      --text-secondary: #6b6b6b;
      --text-tertiary: #9b9b9b;
      --border: #e5e5e5;
      --nav-bg: rgba(255, 255, 255, 0.8);
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #000000;
        --surface: #0f0f0f;
        --text-primary: #ffffff;
        --text-secondary: #a3a3a3;
        --text-tertiary: #737373;
        --border: #262626;
        --nav-bg: rgba(0, 0, 0, 0.8);
      }
    }
    
    html.dark {
      --bg: #000000;
      --surface: #0f0f0f;
      --text-primary: #ffffff;
      --text-secondary: #a3a3a3;
      --text-tertiary: #737373;
      --border: #262626;
      --nav-bg: rgba(0, 0, 0, 0.8);
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--nav-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      transition: all 0.3s;
    }
    
    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 72px;
    }
    
    @media (max-width: 768px) {
      .nav-container {
        padding: 0 24px;
        height: 64px;
      }
    }
    
    .nav-logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 40px;
      align-items: center;
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }
    
    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 15px;
      transition: color 0.2s;
    }
    
    .nav-link:hover {
      color: var(--text-primary);
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 120px 48px 80px;
      position: relative;
      overflow: hidden;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 100px 24px 60px;
        min-height: 90vh;
      }
    }
    
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .hero h1 {
      font-size: clamp(56px, 8vw, 96px);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
    }
    
    .hero h2 {
      font-size: clamp(24px, 4vw, 36px);
      font-weight: 400;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .hero-subtitle {
      font-size: clamp(16px, 2vw, 20px);
      line-height: 1.7;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 48px;
    }
    
    section {
      padding: 120px 48px;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 80px 24px;
      }
    }
    
    .section-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .about {
      background: var(--surface);
    }
    
    .about-stats {
      display: grid;
      grid-template-columns: repeat(${Math.min(stats.length, 3)}, 1fr);
      gap: 40px;
      margin-top: 40px;
    }
    
    @media (max-width: 768px) {
      .about-stats {
        gap: 32px;
      }
    }
    
    .stat {
      text-align: left;
    }
    
    .stat-value {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 40px;
    }
    
    @media (max-width: 480px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s;
      cursor: pointer;
    }
    
    .project-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
      border-color: var(--accent);
    }
    
    .project-image {
      width: 100%;
      aspect-ratio: 16/10;
      background: linear-gradient(135deg, ${accentColor}15, ${accentColor}05);
      overflow: hidden;
    }
    
    .project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .project-content {
      padding: 32px;
    }
    
    .project-category {
      display: inline-block;
      padding: 4px 12px;
      background: var(--accent);
      color: white;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    
    .project-title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .project-description {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-secondary);
    }
    
    .services {
      background: var(--surface);
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(${Math.min(services.length, 3)}, 1fr);
      gap: 40px;
    }
    
    @media (max-width: 1024px) {
      .services-grid {
        grid-template-columns: 1fr;
        max-width: 600px;
        margin: 0 auto;
      }
    }
    
    .service-card {
      padding: 48px 40px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      transition: all 0.3s;
    }
    
    .service-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
    }
    
    .service-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px ${accentColor}30;
    }
    
    .service-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .service-description {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-secondary);
    }
    
    .contact-content {
      max-width: 900px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
    }
    
    @media (max-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr;
        gap: 60px;
      }
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    
    .contact-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .contact-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .contact-value {
      font-size: 18px;
      font-weight: 500;
    }
    
    .contact-value a {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .contact-value a:hover {
      color: var(--accent);
    }
    
    .social-links {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .social-link:hover {
      border-color: var(--accent);
      background: var(--bg);
      transform: translateX(4px);
    }
    
    .social-icon {
      width: 24px;
      height: 24px;
      color: var(--text-secondary);
    }
    
    .social-link:hover .social-icon {
      color: var(--accent);
    }
  </style>
</head>
<body>
  <nav class="nav" id="nav">
    <div class="nav-container">
      <a href="#home" class="nav-logo" data-editable="name">${name}</a>
      <div class="nav-links">
        <a href="#about" class="nav-link">About</a>
        <a href="#work" class="nav-link">Work</a>
        <a href="#services" class="nav-link">Services</a>
        <a href="#contact" class="nav-link">Contact</a>
      </div>
    </div>
  </nav>

  <section class="hero" id="home">
    <div class="hero-content">
      <div class="hero-badge">Available for new projects</div>
      <h1 data-editable="name">${name}</h1>
      <h2 data-editable="headline">${headline}</h2>
      <p class="hero-subtitle" data-editable="heroSubtitle">${heroSubtitle}</p>
    </div>
  </section>

  ${stats.length > 0 || aboutText ? `
  <section class="about" id="about">
    <div class="section-container">
      <h2 data-editable="aboutTitle">${aboutTitle}</h2>
      <p data-editable="aboutText">${aboutText}</p>
      ${stats.length > 0 ? `
      <div class="about-stats">
        ${statsHTML}
      </div>
      ` : ''}
    </div>
  </section>
  ` : ''}

  ${projects.length > 0 ? `
  <section id="work">
    <div class="section-container">
      <div class="projects-grid">
        ${projectsHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${services.length > 0 ? `
  <section class="services" id="services">
    <div class="section-container">
      <div class="services-grid">
        ${servicesHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${contactInfo.length > 0 || socialLinks.length > 0 ? `
  <section id="contact">
    <div class="section-container">
      <div class="contact-content">
        ${contactInfo.length > 0 ? `
        <div class="contact-info">
          ${contactHTML}
        </div>
        ` : ''}
        ${socialLinks.length > 0 ? `
        <div class="social-links">
          ${socialHTML}
        </div>
        ` : ''}
      </div>
    </div>
  </section>
  ` : ''}
</body>
</html>`;
}
function generateAgencyShowcase(data) {
  const {
    agencyName = 'Momentum',
    tagline = 'We Build Brands That Matter',
    heroDescription = 'Award-winning creative agency specializing in brand strategy, digital design, and innovative campaigns that drive results.',
    email = 'hello@momentum.agency',
    phone = '+1 (555) 987-6543',
    location = 'New York, NY',
    projects = [],
    stats = [],
    accentColor = '#eb1736',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const projectsHTML = projects.map((project, index) => {
    // Get the project image from the images object
    const imageKey = `projects.${index}.image`;
    const projectImage = data.__images?.[imageKey];
    
    const backgroundStyle = projectImage
      ? `background-image: url('${projectImage.url}'); background-size: cover; background-position: center;`
      : `background: linear-gradient(135deg, ${accentColor}15, ${accentColor}05);`;
    
    return `
    <div class="project-card" style="${backgroundStyle}">
      <span class="project-year" data-editable="projects.${index}.year">${project.year}</span>
      <h3 class="project-name" data-editable="projects.${index}.name">${project.name}</h3>
      <p class="project-client" data-editable="projects.${index}.client">${project.client}</p>
    </div>
    `;
  }).join('');

  const statsHTML = stats.map((stat, index) => `
    <div class="stat">
      <div class="stat-value" data-editable="stats.${index}.value">${stat.value}</div>
      <div class="stat-label" data-editable="stats.${index}.label">${stat.label}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${agencyName} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #fafafa;
      --text-primary: #0a0a0a;
      --text-secondary: #737373;
      --border: #e5e5e5;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0a0a0a;
        --surface: #171717;
        --text-primary: #fafafa;
        --text-secondary: #a3a3a3;
        --border: #262626;
      }
    }
    
    html.dark {
      --bg: #0a0a0a;
      --surface: #171717;
      --text-primary: #fafafa;
      --text-secondary: #a3a3a3;
      --border: #262626;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .header {
      padding: 24px 48px;
      border-bottom: 1px solid var(--border);
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-primary);
    }
    
    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    
    .hero {
      padding: 120px 48px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 80px 24px;
      }
    }
    
    .hero-content {
      max-width: 900px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: clamp(48px, 8vw, 80px);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
    }
    
    .hero-tagline {
      font-size: clamp(20px, 3vw, 28px);
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 24px;
    }
    
    .hero-description {
      font-size: clamp(16px, 2vw, 20px);
      color: var(--text-secondary);
      line-height: 1.7;
      margin-bottom: 48px;
    }
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 36px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${accentColor}40;
    }
    
    .stats {
      padding: 80px 48px;
      background: var(--surface);
    }
    
    @media (max-width: 768px) {
      .stats {
        padding: 60px 24px;
      }
    }
    
    .stats-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(${Math.min(stats.length, 3)}, 1fr);
      gap: 60px;
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-value {
      font-size: 56px;
      font-weight: 900;
      color: var(--accent);
      margin-bottom: 12px;
    }
    
    .stat-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .projects {
      padding: 120px 48px;
    }
    
    @media (max-width: 768px) {
      .projects {
        padding: 80px 24px;
      }
    }
    
    .section-title {
      text-align: center;
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 800;
      margin-bottom: 80px;
    }
    
    .projects-grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }
    
    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .project-card {
      aspect-ratio: 16/10;
      background: linear-gradient(135deg, ${accentColor}15, ${accentColor}05);
      border-radius: 16px;
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      border: 1px solid var(--border);
    }
    
    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }
    
    .project-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
      z-index: 1;
    }
    
    .project-year {
      position: absolute;
      top: 24px;
      right: 24px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      z-index: 2;
      background: rgba(255,255,255,0.2);
      padding: 6px 12px;
      border-radius: 6px;
      backdrop-filter: blur(10px);
    }
    
    .project-name {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      color: white;
      position: relative;
      z-index: 2;
    }
    
    .project-client {
      font-size: 16px;
      color: rgba(255,255,255,0.8);
      position: relative;
      z-index: 2;
    }
    
    .contact {
      padding: 120px 48px;
      background: var(--surface);
    }
    
    @media (max-width: 768px) {
      .contact {
        padding: 80px 24px;
      }
    }
    
    .contact-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .contact-title {
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 800;
      margin-bottom: 48px;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      margin-bottom: 60px;
    }
    
    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
    
    .contact-item {
      text-align: center;
    }
    
    .contact-label {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    
    .contact-value {
      font-size: 16px;
      font-weight: 500;
    }
    
    .contact-value a {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .contact-value a:hover {
      color: var(--accent);
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-content">
      <div class="logo" data-editable="agencyName">${agencyName}</div>
    </div>
  </header>

  <section class="hero">
    <div class="hero-content">
      <h1 data-editable="agencyName">${agencyName}</h1>
      <p class="hero-tagline" data-editable="tagline">${tagline}</p>
      <p class="hero-description" data-editable="heroDescription">${heroDescription}</p>
      <button class="cta-button">View Our Work</button>
    </div>
  </section>

  ${stats.length > 0 ? `
  <section class="stats">
    <div class="stats-grid">
      ${statsHTML}
    </div>
  </section>
  ` : ''}

  ${projects.length > 0 ? `
  <section class="projects" id="work">
    <h2 class="section-title">Featured Work</h2>
    <div class="projects-grid">
      ${projectsHTML}
    </div>
  </section>
  ` : ''}

  <section class="contact" id="contact">
    <div class="contact-content">
      <h2 class="contact-title">Let's Create Something Great</h2>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-label">Email</div>
          <div class="contact-value">
            <a href="mailto:${email}" data-editable="email">${email}</a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Phone</div>
          <div class="contact-value">
            <a href="tel:${phone.replace(/\s/g, '')}" data-editable="phone">${phone}</a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Location</div>
          <div class="contact-value" data-editable="location">${location}</div>
        </div>
      </div>
      <button class="cta-button">Start a Project</button>
    </div>
  </section>
</body>
</html>`;
}
function generateSaaSProduct(data) {
  const {
    productName = 'CloudSync',
    headline = 'Collaboration Made Simple',
    subheadline = 'The all-in-one workspace for teams. Sync files, manage projects, and communicate seamlessly—all in one place.',
    ctaText = 'Start Free Trial',
    features = [],
    pricingPlans = [],
    testimonials = [],
    accentColor = '#0ea5e9',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const featuresHTML = features.map((feature, index) => {
    const icons = ['⚡', '👥', '🔒', '📊', '🔄', '🌍'];
    return `
    <div class="feature-card">
      <div class="feature-icon">${icons[index] || '✨'}</div>
      <h3 class="feature-title" data-editable="features.${index}.title">${feature.title}</h3>
      <p class="feature-desc" data-editable="features.${index}.description">${feature.description}</p>
    </div>
    `;
  }).join('');

  const pricingHTML = pricingPlans.map((plan, index) => {
    const isFeatured = index === 1;
    return `
    <div class="pricing-card ${isFeatured ? 'featured' : ''}">
      <div class="pricing-plan" data-editable="pricingPlans.${index}.name">${plan.name}</div>
      <div class="pricing-price">$<span data-editable="pricingPlans.${index}.price">${plan.price}</span></div>
      <div class="pricing-period">per user/month</div>
      <button class="pricing-button">Get Started</button>
    </div>
    `;
  }).join('');

  const testimonialsHTML = testimonials.map((testimonial, index) => `
    <div class="testimonial-content">
      <p class="testimonial-text" data-editable="testimonials.${index}.text">"${testimonial.text}"</p>
      <div class="testimonial-author" data-editable="testimonials.${index}.author">${testimonial.author}</div>
      <div class="testimonial-role" data-editable="testimonials.${index}.role">${testimonial.role}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} - ${headline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f8fafc;
      --text-primary: #0f172a;
      --text-secondary: #64748b;
      --border: #e2e8f0;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0f172a;
        --surface: #1e293b;
        --text-primary: #f1f5f9;
        --text-secondary: #94a3b8;
        --border: #334155;
      }
    }
    
    html.dark {
      --bg: #0f172a;
      --surface: #1e293b;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --border: #334155;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .nav {
      padding: 20px 48px;
      border-bottom: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .nav {
        padding: 16px 24px;
      }
    }
    
    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: var(--accent);
    }
    
    .nav-cta {
      padding: 10px 24px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .nav-cta:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${accentColor}40;
    }
    
    .hero {
      padding: 120px 48px 80px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 80px 24px 60px;
      }
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: clamp(48px, 7vw, 64px);
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 24px;
    }
    
    .hero-subheadline {
      font-size: clamp(18px, 2.5vw, 22px);
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 40px;
    }
    
    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 36px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .hero-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${accentColor}50;
    }
    
    .features {
      padding: 120px 48px;
      background: var(--surface);
    }
    
    @media (max-width: 768px) {
      .features {
        padding: 80px 24px;
      }
    }
    
    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(${Math.min(features.length, 3)}, 1fr);
      gap: 48px;
    }
    
    @media (max-width: 1024px) {
      .features-grid {
        grid-template-columns: 1fr;
        max-width: 600px;
      }
    }
    
    .feature-card {
      text-align: center;
      padding: 40px 24px;
    }
    
    .feature-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      box-shadow: 0 8px 24px ${accentColor}30;
    }
    
    .feature-title {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .feature-desc {
      color: var(--text-secondary);
      line-height: 1.6;
    }
    
    .pricing {
      padding: 120px 48px;
    }
    
    @media (max-width: 768px) {
      .pricing {
        padding: 80px 24px;
      }
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }
    
    .section-title {
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 800;
      margin-bottom: 16px;
    }
    
    .section-subtitle {
      font-size: 18px;
      color: var(--text-secondary);
    }
    
    .pricing-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(${Math.min(pricingPlans.length, 3)}, 1fr);
      gap: 32px;
    }
    
    @media (max-width: 1024px) {
      .pricing-grid {
        grid-template-columns: 1fr;
        max-width: 400px;
      }
    }
    
    .pricing-card {
      padding: 40px 32px;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s;
    }
    
    .pricing-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
    }
    
    .pricing-card.featured {
      border-color: var(--accent);
      background: linear-gradient(135deg, ${accentColor}05, ${accentColor}02);
    }
    
    .pricing-plan {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 16px;
    }
    
    .pricing-price {
      font-size: 56px;
      font-weight: 900;
      margin-bottom: 8px;
    }
    
    .pricing-period {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .pricing-button {
      width: 100%;
      padding: 14px 24px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .pricing-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${accentColor}40;
    }
    
    .pricing-card:not(.featured) .pricing-button {
      background: transparent;
      color: var(--text-primary);
      border: 2px solid var(--border);
    }
    
    .pricing-card:not(.featured) .pricing-button:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    .testimonial {
      padding: 120px 48px;
      background: var(--surface);
    }
    
    @media (max-width: 768px) {
      .testimonial {
        padding: 80px 24px;
      }
    }
    
    .testimonial-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .testimonial-text {
      font-size: clamp(20px, 3vw, 28px);
      font-weight: 500;
      line-height: 1.6;
      margin-bottom: 32px;
      color: var(--text-primary);
    }
    
    .testimonial-author {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .testimonial-role {
      font-size: 14px;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <nav class="nav">
    <div class="nav-content">
      <div class="logo" data-editable="productName">${productName}</div>
      <button class="nav-cta">Sign In</button>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-content">
      <h1 data-editable="headline">${headline}</h1>
      <p class="hero-subheadline" data-editable="subheadline">${subheadline}</p>
      <button class="hero-cta" data-editable="ctaText">
        ${ctaText}
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </button>
    </div>
  </section>

  ${features.length > 0 ? `
  <section class="features">
    <div class="features-grid">
      ${featuresHTML}
    </div>
  </section>
  ` : ''}

  ${pricingPlans.length > 0 ? `
  <section class="pricing">
    <div class="section-header">
      <h2 class="section-title">Simple, Transparent Pricing</h2>
      <p class="section-subtitle">Choose the plan that fits your team</p>
    </div>
    <div class="pricing-grid">
      ${pricingHTML}
    </div>
  </section>
  ` : ''}

  ${testimonials.length > 0 ? `
  <section class="testimonial">
    ${testimonialsHTML}
  </section>
  ` : ''}
</body>
</html>`;
}
function generateConsultingFirm(data) {
  const {
    firmName = 'Sterling Advisory',
    tagline = 'Strategic Consulting for Growth',
    introText = 'We partner with ambitious companies to solve complex challenges and unlock sustainable growth through strategic insights and operational excellence.',
    phoneNumber = '+1 (555) 234-5678',
    emailAddress = 'contact@sterling.com',
    officeLocation = 'Chicago, IL',
    services = [],
    expertise = [],
    stats = [],
    accentColor = '#1e40af',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const servicesHTML = services.map((service, index) => `
    <div class="service-card">
      <div class="service-number">${String(index + 1).padStart(2, '0')}</div>
      <h3 class="service-name" data-editable="services.${index}.name">${service.name}</h3>
      <p class="service-description" data-editable="services.${index}.description">${service.description}</p>
    </div>
  `).join('');

  const expertiseHTML = expertise.map((item, index) => `
    <div class="expertise-tag" data-editable="expertise.${index}">${item}</div>
  `).join('');

  const statsHTML = stats.map((stat, index) => `
    <div class="stat-item">
      <div class="stat-value" data-editable="stats.${index}.value">${stat.value}</div>
      <div class="stat-label" data-editable="stats.${index}.label">${stat.label}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${firmName} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f9fafb;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --border: #e5e7eb;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #111827;
        --surface: #1f2937;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --border: #374151;
      }
    }
    
    html.dark {
      --bg: #111827;
      --surface: #1f2937;
      --text-primary: #f9fafb;
      --text-secondary: #9ca3af;
      --border: #374151;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .header {
      padding: 32px 48px;
      border-bottom: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 24px 24px;
      }
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: -0.01em;
    }
    
    .contact-button {
      padding: 12px 28px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .contact-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px ${accentColor}40;
    }
    
    .hero {
      padding: 120px 48px 80px;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 80px 24px 60px;
      }
    }
    
    .hero-content {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(48px, 7vw, 72px);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
    }
    
    .hero-tagline {
      font-size: clamp(20px, 3vw, 24px);
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 24px;
    }
    
    .hero-intro {
      font-size: clamp(16px, 2vw, 20px);
      color: var(--text-secondary);
      line-height: 1.7;
      max-width: 800px;
    }
    
    .stats {
      padding: 80px 48px;
      background: var(--surface);
    }
    
    @media (max-width: 768px) {
      .stats {
        padding: 60px 24px;
      }
    }
    
    .stats-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(${Math.min(stats.length, 2)}, 1fr);
      gap: 60px;
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }
    
    .stat-item {
      text-align: center;
      padding: 40px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 12px;
    }
    
    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: 56px;
      font-weight: 800;
      color: var(--accent);
      margin-bottom: 12px;
    }
    
    .stat-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .services {
      padding: 120px 48px;
    }
    
    @media (max-width: 768px) {
      .services {
        padding: 80px 24px;
      }
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }
    
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .services-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 40px;
    }
    
    @media (max-width: 480px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .service-card {
      padding: 48px 40px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 0.3s;
    }
    
    .service-card:hover {
      transform: translateY(-4px);
      border-color: var(--accent);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
    }
    
    .service-number {
      display: inline-block;
      padding: 8px 16px;
      background: var(--accent);
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    
    .service-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .service-description {
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-secondary);
    }
    
    .expertise {
      padding: 120px 48px;
      background: var(--surface);
    }
    
    @media (max-width: 768px) {
      .expertise {
        padding: 80px 24px;
      }
    }
    
    .expertise-content {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .expertise-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 48px;
    }
    
    .expertise-tag {
      padding: 12px 24px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 100px;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.2s;
      cursor: default;
    }
    
    .expertise-tag:hover {
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-2px);
    }
    
    .contact {
      padding: 120px 48px;
    }
    
    @media (max-width: 768px) {
      .contact {
        padding: 80px 24px;
      }
    }
    
    .contact-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .contact-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 700;
      margin-bottom: 48px;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
      margin-bottom: 48px;
    }
    
    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
    
    .contact-item {
      text-align: center;
    }
    
    .contact-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    
    .contact-value {
      font-size: 16px;
      font-weight: 600;
    }
    
    .contact-value a {
      color: var(--text-primary);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .contact-value a:hover {
      color: var(--accent);
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-content">
      <div class="logo" data-editable="firmName">${firmName}</div>
      <button class="contact-button">Get in Touch</button>
    </div>
  </header>

  <section class="hero">
    <div class="hero-content">
      <h1 data-editable="firmName">${firmName}</h1>
      <p class="hero-tagline" data-editable="tagline">${tagline}</p>
      <p class="hero-intro" data-editable="introText">${introText}</p>
    </div>
  </section>

  ${stats.length > 0 ? `
  <section class="stats">
    <div class="stats-grid">
      ${statsHTML}
    </div>
  </section>
  ` : ''}

  ${services.length > 0 ? `
  <section class="services">
    <div class="section-header">
      <h2 class="section-title">Our Services</h2>
    </div>
    <div class="services-grid">
      ${servicesHTML}
    </div>
  </section>
  ` : ''}

  ${expertise.length > 0 ? `
  <section class="expertise">
    <div class="expertise-content">
      <div class="section-header">
        <h2 class="section-title">Industry Expertise</h2>
      </div>
      <div class="expertise-grid">
        ${expertiseHTML}
      </div>
    </div>
  </section>
  ` : ''}

  <section class="contact">
    <div class="contact-content">
      <h2 class="contact-title">Let's Discuss Your Growth</h2>
      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-label">Phone</div>
          <div class="contact-value">
            <a href="tel:${phoneNumber.replace(/\s/g, '')}" data-editable="phoneNumber">${phoneNumber}</a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Email</div>
          <div class="contact-value">
            <a href="mailto:${emailAddress}" data-editable="emailAddress">${emailAddress}</a>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-label">Office</div>
          <div class="contact-value" data-editable="officeLocation">${officeLocation}</div>
        </div>
      </div>
      <button class="contact-button">Schedule Consultation</button>
    </div>
  </section>
</body>
</html>`;
}
function generatePhotographyGrid(data) {
  const {
    name = 'Elena Rodriguez',
    tagline = 'Visual Storyteller',
    bio = 'Capturing moments that matter. Specializing in portrait, lifestyle, and documentary photography with a focus on authentic human connection.',
    galleryTitle = 'Recent Work',
    contactInfo = [],
    socialLinks = [],
    accentColor = '#000000',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const galleryImages = data.__images?.galleryImages || [];

  const galleryHTML = galleryImages.length > 0
    ? galleryImages.map((img, index) => `
        <div class="gallery-item">
          <img src="${img.url}" alt="Gallery image ${index + 1}" loading="lazy">
        </div>
      `).join('')
    : // Fallback to placeholder boxes if no images uploaded
      Array(9).fill().map((_, index) => `
        <div class="gallery-item"></div>
      `).join('');

  const contactHTML = contactInfo.map((contact, index) => {
    const href = contact.type === 'Email' ? `mailto:${contact.value}` 
      : contact.type === 'Phone' ? `tel:${contact.value}` 
      : contact.type === 'Instagram' ? `https://instagram.com/${contact.value.replace('@', '')}` 
      : `https://${contact.value}`;
    
    return `
    <a href="${href}" ${contact.type !== 'Email' && contact.type !== 'Phone' ? 'target="_blank"' : ''} 
       class="contact-link" data-editable="contactInfo.${index}.value">${contact.value}</a>
    `;
  }).join(' · ');

  const socialHTML = socialLinks.map((social, index) => {
    const href = social.url.startsWith('http') ? social.url : `https://${social.url}`;
    return `
    <a href="${href}" target="_blank" class="social-link" data-editable="socialLinks.${index}.platform">${social.platform}</a>
    `;
  }).join(' · ');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --text-primary: #0a0a0a;
      --text-secondary: #666666;
      --border: #e0e0e0;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0a0a0a;
        --text-primary: #f5f5f5;
        --text-secondary: #a0a0a0;
        --border: #2a2a2a;
      }
    }
    
    html.dark {
      --bg: #0a0a0a;
      --text-primary: #f5f5f5;
      --text-secondary: #a0a0a0;
      --border: #2a2a2a;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .header {
      padding: 80px 48px 60px;
      text-align: center;
      border-bottom: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 60px 24px 40px;
      }
    }
    
    h1 {
      font-size: clamp(36px, 6vw, 56px);
      font-weight: 300;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    
    .tagline {
      font-size: clamp(16px, 2vw, 20px);
      color: var(--text-secondary);
      font-weight: 400;
      margin-bottom: 32px;
    }
    
    .bio {
      max-width: 600px;
      margin: 0 auto 40px;
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-secondary);
    }
    
    .contact-links {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .contact-link {
      color: var(--text-primary);
      text-decoration: none;
      transition: opacity 0.2s;
    }
    
    .contact-link:hover {
      opacity: 0.6;
    }
    
    .gallery {
      padding: 80px 48px;
    }
    
    @media (max-width: 768px) {
      .gallery {
        padding: 60px 24px;
      }
    }
    
    .gallery-title {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 48px;
      letter-spacing: -0.01em;
    }
    
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 1024px) {
      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }
    
    @media (max-width: 640px) {
      .gallery-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .gallery-item {
      aspect-ratio: 1;
      background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
      border-radius: 4px;
      transition: transform 0.3s;
      cursor: pointer;
    }
    
    html.dark .gallery-item {
      background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
    }
    
    .gallery-item:hover {
      transform: scale(1.02);
    }
    
    .footer {
      padding: 60px 48px;
      text-align: center;
      border-top: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .footer {
        padding: 40px 24px;
      }
    }
    
    .social-links {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }
    
    .social-link {
      color: var(--text-primary);
      text-decoration: none;
      transition: opacity 0.2s;
    }
    
    .social-link:hover {
      opacity: 0.6;
    }
    
    .copyright {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <header class="header">
    <h1 data-editable="name">${name}</h1>
    <p class="tagline" data-editable="tagline">${tagline}</p>
    <p class="bio" data-editable="bio">${bio}</p>
    ${contactInfo.length > 0 ? `
    <div class="contact-links">
      ${contactHTML}
    </div>
    ` : ''}
  </header>

  <section class="gallery">
    <h2 class="gallery-title" data-editable="galleryTitle">${galleryTitle}</h2>
    <div class="gallery-grid">
      ${Array(9).fill().map(() => '<div class="gallery-item"></div>').join('')}
    </div>
  </section>

  <footer class="footer">
    ${socialLinks.length > 0 ? `
    <div class="social-links">
      ${socialHTML}
    </div>
    ` : ''}
    <p class="copyright">© ${new Date().getFullYear()} <span data-editable="name">${name}</span></p>
  </footer>
</body>
</html>`;
}
function generatePhotographyMasonry(data) {
  const {
    name = 'Noah Martinez',
    specialty = 'Fine Art & Landscape Photography',
    statement = 'Through my lens, I explore the intersection of natural beauty and human emotion. Each photograph is a meditation on light, form, and the fleeting moments that define our experience.',
    location = 'Pacific Northwest',
    email = 'noah@example.com',
    prints = 'Available for purchase',
    socialLinks = [],
    accentColor = '#2d3748',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const socialHTML = socialLinks.map((social, index) => {
    const href = social.url.startsWith('http') ? social.url : `https://${social.url}`;
    return `
    <a href="${href}" target="_blank" class="social-link">
      <span data-editable="socialLinks.${index}.platform">${social.platform}</span>
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${specialty}</title>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #fafafa;
      --text-primary: #1a1a1a;
      --text-secondary: #666666;
      --border: #e0e0e0;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0f0f0f;
        --text-primary: #f0f0f0;
        --text-secondary: #a0a0a0;
        --border: #2a2a2a;
      }
    }
    
    html.dark {
      --bg: #0f0f0f;
      --text-primary: #f0f0f0;
      --text-secondary: #a0a0a0;
      --border: #2a2a2a;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .intro {
      max-width: 1000px;
      margin: 0 auto;
      padding: 100px 48px 80px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .intro {
        padding: 80px 24px 60px;
      }
    }
    
    h1 {
      font-family: 'Crimson Pro', serif;
      font-size: clamp(48px, 7vw, 72px);
      font-weight: 400;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    
    .specialty {
      font-size: clamp(18px, 2.5vw, 24px);
      color: var(--text-secondary);
      margin-bottom: 48px;
      font-weight: 300;
    }
    
    .statement {
      font-family: 'Crimson Pro', serif;
      font-size: clamp(18px, 2vw, 22px);
      line-height: 1.8;
      color: var(--text-secondary);
      max-width: 800px;
      margin: 0 auto 48px;
      font-weight: 300;
    }
    
    .meta-info {
      display: flex;
      justify-content: center;
      gap: 32px;
      flex-wrap: wrap;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .meta-item svg {
      width: 16px;
      height: 16px;
    }
    
    .gallery {
      padding: 0 48px 100px;
    }
    
    @media (max-width: 768px) {
      .gallery {
        padding: 0 24px 80px;
      }
    }
    
    .masonry-grid {
      column-count: 3;
      column-gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 1024px) {
      .masonry-grid {
        column-count: 2;
        column-gap: 16px;
      }
    }
    
    @media (max-width: 640px) {
      .masonry-grid {
        column-count: 1;
      }
    }
    
    .masonry-item {
      break-inside: avoid;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #e0e0e0, #d0d0d0);
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.3s;
    }
    
    @media (max-width: 1024px) {
      .masonry-item {
        margin-bottom: 16px;
      }
    }
    
    html.dark .masonry-item {
      background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
    }
    
    .masonry-item:hover {
      transform: scale(1.02);
    }
    
    .masonry-item.tall {
      aspect-ratio: 2/3;
    }
    
    .masonry-item.square {
      aspect-ratio: 1;
    }
    
    .masonry-item.wide {
      aspect-ratio: 3/2;
    }
    
    .footer {
      padding: 60px 48px;
      border-top: 1px solid var(--border);
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .footer {
        padding: 40px 24px;
      }
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }
    
    .social-link {
      color: var(--text-primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    
    .social-link:hover {
      opacity: 0.6;
    }
    
    .footer-note {
      font-size: 13px;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <section class="intro">
    <h1 data-editable="name">${name}</h1>
    <p class="specialty" data-editable="<p class="specialty" data-editable="specialty">${specialty}</p>
    <p class="statement" data-editable="statement">${statement}</p>
    
    <div class="meta-info">
      <div class="meta-item">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span data-editable="location">${location}</span>
      </div>
      <div class="meta-item">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        <a href="mailto:${email}" data-editable="email" style="color: var(--text-secondary); text-decoration: none;">${email}</a>
      </div>
      <div class="meta-item">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
        </svg>
        <span data-editable="prints">${prints}</span>
      </div>
    </div>
  </section>

  <section class="gallery">
    <div class="masonry-grid">
      <div class="masonry-item tall"></div>
      <div class="masonry-item square"></div>
      <div class="masonry-item wide"></div>
      <div class="masonry-item square"></div>
      <div class="masonry-item tall"></div>
      <div class="masonry-item wide"></div>
      <div class="masonry-item square"></div>
      <div class="masonry-item tall"></div>
      <div class="masonry-item wide"></div>
      <div class="masonry-item square"></div>
      <div class="masonry-item tall"></div>
      <div class="masonry-item square"></div>
    </div>
  </section>

  <footer class="footer">
    ${socialLinks.length > 0 ? `
    <div class="social-links">
      ${socialHTML}
    </div>
    ` : ''}
    <p class="footer-note">© ${new Date().getFullYear()} <span data-editable="name">${name}</span>. All photographs are available as limited edition prints.</p>
  </footer>
</body>
</html>`;
}
function generateWeddingInvite(data) {
  const {
    brideName = 'Sarah',
    groomName = 'Michael',
    weddingDate = 'June 15, 2025',
    weddingTime = '4:00 PM',
    venueName = 'The Grand Estate',
    venueAddress = '123 Garden Lane\nNapa Valley, CA 94558',
    ceremonyTitle = 'Ceremony',
    ceremonyTime = '4:00 PM',
    ceremonyLocation = 'Garden Terrace',
    receptionTitle = 'Reception',
    receptionTime = '6:00 PM',
    receptionLocation = 'Grand Ballroom',
    story = '',
    rsvpDeadline = 'May 1, 2025',
    rsvpEmail = 'rsvp@sarahandmichael.com',
    rsvpPhone = '',
    additionalInfo = '',
    registryLinks = [],
    accentColor = '#d4af37',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const heroImage = data.__images?.heroImage;

  const registryHTML = registryLinks.map((registry, index) => {
    const url = registry.url.startsWith('http') ? registry.url : `https://${registry.url}`;
    return `
    <a href="${url}" target="_blank" class="registry-link" data-editable="registryLinks.${index}">
      <span data-editable="registryLinks.${index}.store">${registry.store}</span>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
      </svg>
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brideName} & ${groomName} - Wedding</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #fefefe;
      --surface: #fafafa;
      --text-primary: #2d2d2d;
      --text-secondary: #666666;
      --border: #e8e8e8;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #1a1a1a;
        --surface: #2a2a2a;
        --text-primary: #f5f5f5;
        --text-secondary: #a8a8a8;
        --border: #3a3a3a;
      }
    }
    
    html.dark {
      --bg: #1a1a1a;
      --surface: #2a2a2a;
      --text-primary: #f5f5f5;
      --text-secondary: #a8a8a8;
      --border: #3a3a3a;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 80px 40px;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 30% 50%, ${accentColor}08 0%, transparent 60%),
        radial-gradient(circle at 70% 50%, ${accentColor}05 0%, transparent 60%);
      pointer-events: none;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
    }
    
    .ornament {
      font-family: 'Cormorant Garamond', serif;
      font-size: 48px;
      color: var(--accent);
      margin-bottom: 24px;
    }
    
    .names {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(48px, 8vw, 80px);
      font-weight: 300;
      letter-spacing: 0.05em;
      margin-bottom: 32px;
      line-height: 1.2;
    }
    
    .ampersand {
      font-size: clamp(36px, 6vw, 60px);
      color: var(--accent);
      font-style: italic;
      margin: 0 16px;
    }
    
    .date {
      font-size: clamp(20px, 3vw, 28px);
      font-weight: 300;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .venue {
      font-size: clamp(16px, 2vw, 20px);
      color: var(--text-secondary);
      font-weight: 400;
    }
    
    .divider {
      width: 80px;
      height: 1px;
      background: var(--accent);
      margin: 48px auto;
    }
    
    .hero-image {
      width: 300px;
      height: 300px;
      margin: 48px auto 0;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid var(--accent);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }
    
    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .hero-image-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}15, ${accentColor}05);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: 64px;
      color: var(--accent);
    }
    
    section {
      padding: 80px 40px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 60px 24px;
      }
    }
    
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 400;
      text-align: center;
      margin-bottom: 48px;
      color: var(--accent);
      position: relative;
    }
    
    .section-title::after {
      content: '';
      display: block;
      width: 60px;
      height: 1px;
      background: var(--accent);
      margin: 24px auto 0;
    }
    
    .schedule {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 48px;
      margin-bottom: 80px;
    }
    
    @media (max-width: 768px) {
      .schedule {
        padding: 32px 24px;
      }
    }
    
    .schedule-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 48px;
    }
    
    @media (max-width: 768px) {
      .schedule-items {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }
    
    .schedule-item {
      text-align: center;
    }
    
    .schedule-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      background: var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-weight: 600;
    }
    
    .schedule-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .schedule-time {
      font-size: 18px;
      color: var(--accent);
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .schedule-location {
      font-size: 16px;
      color: var(--text-secondary);
    }
    
    .story {
      max-width: 700px;
      margin: 0 auto;
    }
    
    .story-text {
      font-size: 18px;
      line-height: 1.8;
      color: var(--text-secondary);
      text-align: center;
      font-style: italic;
    }
    
    .rsvp {
      background: var(--surface);
      border: 2px solid var(--accent);
      border-radius: 16px;
      padding: 48px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .rsvp {
        padding: 32px 24px;
      }
    }
    
    .rsvp-deadline {
      font-size: 16px;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 32px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .rsvp-contacts {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      margin-bottom: 32px;
    }
    
    .rsvp-contact {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      color: var(--text-primary);
    }
    
    .rsvp-contact a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 500;
    }
    
    .rsvp-contact a:hover {
      text-decoration: underline;
    }
    
    .info-text {
      font-size: 15px;
      line-height: 1.8;
      color: var(--text-secondary);
      white-space: pre-line;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .registry {
      text-align: center;
    }
    
    .registry-links {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .registry-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 10px;
      color: var(--text-primary);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .registry-link:hover {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
      transform: translateY(-2px);
    }
    
    .footer {
      padding: 48px 40px;
      text-align: center;
      border-top: 1px solid var(--border);
    }
    
    .footer-ornament {
      font-family: 'Cormorant Garamond', serif;
      font-size: 32px;
      color: var(--accent);
      margin-bottom: 16px;
    }
    
    .footer-text {
      font-size: 14px;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="ornament">❦</div>
      
      <h1 class="names">
        <span data-editable="brideName">${brideName}</span>
        <span class="ampersand">&</span>
        <span data-editable="groomName">${groomName}</span>
      </h1>
      
      <p class="date" data-editable="weddingDate">${weddingDate}</p>
      <p class="venue">
        <span data-editable="venueName">${venueName}</span><br>
        <span data-editable="venueAddress">${venueAddress.replace(/\n/g, '<br>')}</span>
      </p>
      
      ${heroImage ? `
      <div class="hero-image">
        <img src="${heroImage.url}" alt="${brideName} & ${groomName}" />
      </div>
      ` : `
      <div class="hero-image">
        <div class="hero-image-placeholder">♥</div>
      </div>
      `}
    </div>
  </div>

  <section class="schedule">
    <div class="schedule-items">
      <div class="schedule-item">
        <div class="schedule-icon">🌸</div>
        <h2 class="schedule-title" data-editable="ceremonyTitle">${ceremonyTitle}</h2>
        <p class="schedule-time" data-editable="ceremonyTime">${ceremonyTime}</p>
        <p class="schedule-location" data-editable="ceremonyLocation">${ceremonyLocation}</p>
      </div>
      
      <div class="schedule-item">
        <div class="schedule-icon">🥂</div>
        <h2 class="schedule-title" data-editable="receptionTitle">${receptionTitle}</h2>
        <p class="schedule-time" data-editable="receptionTime">${receptionTime}</p>
        <p class="schedule-location" data-editable="receptionLocation">${receptionLocation}</p>
      </div>
    </div>
  </section>

  ${story ? `
  <section class="story">
    <h2 class="section-title">Our Story</h2>
    <p class="story-text" data-editable="story">${story}</p>
  </section>
  ` : ''}

  <section>
    <h2 class="section-title">RSVP</h2>
    <div class="rsvp">
      <p class="rsvp-deadline">Please respond by <span data-editable="rsvpDeadline">${rsvpDeadline}</span></p>
      
      <div class="rsvp-contacts">
        <div class="rsvp-contact">
          Email: <a href="mailto:${rsvpEmail}" data-editable="rsvpEmail">${rsvpEmail}</a>
        </div>
        ${rsvpPhone ? `
        <div class="rsvp-contact">
          Phone: <a href="tel:${rsvpPhone.replace(/\s/g, '')}" data-editable="rsvpPhone">${rsvpPhone}</a>
        </div>
        ` : ''}
      </div>
    </div>
  </section>

  ${additionalInfo ? `
  <section>
    <h2 class="section-title">Details</h2>
    <p class="info-text" data-editable="additionalInfo">${additionalInfo}</p>
  </section>
  ` : ''}

  ${registryLinks.length > 0 ? `
  <section class="registry">
    <h2 class="section-title">Registry</h2>
    <div class="registry-links">
      ${registryHTML}
    </div>
  </section>
  ` : ''}

  <footer class="footer">
    <div class="footer-ornament">❦</div>
    <p class="footer-text">
      We can't wait to celebrate with you!<br>
      <span data-editable="brideName">${brideName}</span> & <span data-editable="groomName">${groomName}</span>
    </p>
  </footer>
</body>
</html>`;
}
function generateEventLanding(data) {
  const {
    eventName = 'Tech Summit 2025',
    tagline = 'The Future of Innovation',
    eventDate = 'September 20-22, 2025',
    eventLocation = 'San Francisco Convention Center',
    description = '',
    ctaPrimary = 'Get Tickets',
    ctaSecondary = 'View Schedule',
    ticketUrl = '#tickets',
    speakers = [],
    schedule = [],
    tickets = [],
    venue = [],
    contactEmail = 'info@techsummit.com',
    accentColor = '#eb1736',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const speakersHTML = speakers.map((speaker, index) => {
    const imageKey = `speakers.${index}.image`;
    const speakerImage = data.__images?.[imageKey];
    
    return `
    <div class="speaker-card">
      <div class="speaker-image">
        ${speakerImage ? `
          <img src="${speakerImage.url}" alt="${speaker.name}" />
        ` : `
          <div class="speaker-placeholder">${speaker.name.charAt(0)}</div>
        `}
      </div>
      <h3 class="speaker-name" data-editable="speakers.${index}.name">${speaker.name}</h3>
      <p class="speaker-title" data-editable="speakers.${index}.title">${speaker.title}</p>
      <p class="speaker-company" data-editable="speakers.${index}.company">${speaker.company}</p>
    </div>
    `;
  }).join('');

  const scheduleHTML = schedule.map((session, index) => `
    <div class="schedule-item">
      <div class="schedule-time" data-editable="schedule.${index}.time">${session.time}</div>
      <div class="schedule-content">
        <h3 class="schedule-title" data-editable="schedule.${index}.title">${session.title}</h3>
        <p class="schedule-speaker" data-editable="schedule.${index}.speaker">${session.speaker}</p>
        <p class="schedule-location" data-editable="schedule.${index}.location">${session.location}</p>
      </div>
    </div>
  `).join('');

  const ticketsHTML = tickets.map((ticket, index) => {
    const features = ticket.features.split('\n').filter(f => f.trim());
    const featuresHTML = features.map(feature => `<li>${feature}</li>`).join('');
    
    return `
    <div class="ticket-card">
      <h3 class="ticket-name" data-editable="tickets.${index}.name">${ticket.name}</h3>
      <div class="ticket-price">
        <span class="price-symbol">$</span>
        <span class="price-amount" data-editable="tickets.${index}.price">${ticket.price}</span>
      </div>
      <ul class="ticket-features" data-editable="tickets.${index}.features">
        ${featuresHTML}
      </ul>
      <a href="${ticketUrl}" class="btn btn-ticket">Buy Ticket</a>
    </div>
    `;
  }).join('');

  const venueHTML = venue.map((detail, index) => `
    <div class="venue-detail">
      <strong data-editable="venue.${index}.label">${detail.label}:</strong>
      <span data-editable="venue.${index}.value">${detail.value}</span>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${eventName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #fafafa;
      --text-primary: #0a0a0a;
      --text-secondary: #666666;
      --border: #e5e5e5;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0a0a0a;
        --surface: #1a1a1a;
        --text-primary: #fafafa;
        --text-secondary: #a3a3a3;
        --border: #2a2a2a;
      }
    }
    
    html.dark {
      --bg: #0a0a0a;
      --surface: #1a1a1a;
      --text-primary: #fafafa;
      --text-secondary: #a3a3a3;
      --border: #2a2a2a;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 120px 40px 80px;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 50%, ${accentColor}15 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, ${accentColor}10 0%, transparent 50%);
      pointer-events: none;
    }
    
    .hero-content {
      max-width: 900px;
      position: relative;
      z-index: 1;
    }
    
    .event-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .event-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
    
    h1 {
      font-size: clamp(48px, 8vw, 80px);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
    }
    
    .hero-tagline {
      font-size: clamp(24px, 4vw, 36px);
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 24px;
    }
    
    .hero-meta {
      display: flex;
      gap: 32px;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 18px;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .hero-meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .hero-description {
      font-size: clamp(16px, 2vw, 20px);
      line-height: 1.7;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 48px;
    }
    
    .hero-cta {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 36px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    
    .btn-primary {
      background: var(--accent);
      color: white;
      box-shadow: 0 4px 16px ${accentColor}40;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${accentColor}50;
    }
    
    .btn-secondary {
      background: var(--surface);
      color: var(--text-primary);
      border: 1px solid var(--border);
    }
    
    .btn-secondary:hover {
      background: var(--bg);
      border-color: var(--text-secondary);
    }
    
    section {
      padding: 100px 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 80px 24px;
      }
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }
    
    .section-title {
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 800;
      margin-bottom: 16px;
    }
    
    .section-subtitle {
      font-size: 18px;
      color: var(--text-secondary);
    }
    
    .speakers {
      background: var(--surface);
    }
    
    .speakers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }
    
    @media (max-width: 768px) {
      .speakers-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 32px;
      }
    }
    
    .speaker-card {
      text-align: center;
    }
    
    .speaker-image {
      width: 180px;
      height: 180px;
      margin: 0 auto 24px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid var(--border);
      transition: transform 0.3s;
    }
    
    .speaker-card:hover .speaker-image {
      transform: scale(1.05);
    }
    
    .speaker-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .speaker-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}20, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
      font-weight: 900;
      color: var(--accent);
    }
    
    .speaker-name {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .speaker-title {
      font-size: 15px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    
    .speaker-company {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
    }
    
    .schedule-list {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .schedule-item {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 32px;
      padding: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 0.2s;
    }
    
    @media (max-width: 768px) {
      .schedule-item {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
    
    .schedule-item:hover {
      border-color: var(--accent);
      transform: translateX(4px);
    }
    
    .schedule-time {
      font-size: 18px;
      font-weight: 700;
      color: var(--accent);
    }
    
    .schedule-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .schedule-speaker {
      font-size: 15px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    
    .schedule-location {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .tickets {
      background: var(--surface);
    }
    
    .tickets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      .tickets-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .ticket-card {
      padding: 40px 32px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s;
    }
    
    .ticket-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
    }
    
    .ticket-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    
    .ticket-price {
      margin-bottom: 32px;
    }
    
    .price-symbol {
      font-size: 24px;
      color: var(--text-secondary);
      vertical-align: super;
    }
    
    .price-amount {
      font-size: 56px;
      font-weight: 900;
      color: var(--accent);
    }
    
    .ticket-features {
      list-style: none;
      text-align: left;
      margin-bottom: 32px;
    }
    
    .ticket-features li {
      padding: 12px 0;
      border-bottom: 1px solid var(--border);
      color: var(--text-secondary);
    }
    
    .ticket-features li:last-child {
      border-bottom: none;
    }
    
    .btn-ticket {
      width: 100%;
      justify-content: center;
    }
    
    .venue-info {
      max-width: 700px;
      margin: 0 auto;
      padding: 40px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
    }
    
    .venue-detail {
      padding: 16px 0;
      border-bottom: 1px solid var(--border);
      display: flex;
      gap: 16px;
      font-size: 16px;
    }
    
    .venue-detail:last-child {
      border-bottom: none;
    }
    
    .venue-detail strong {
      min-width: 100px;
      color: var(--text-primary);
    }
    
    .venue-detail span {
      color: var(--text-secondary);
    }
    
    .footer {
      padding: 48px 40px;
      text-align: center;
      border-top: 1px solid var(--border);
    }
    
    .footer-text {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .footer-email {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }
    
    .footer-email:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="event-badge">
        <span class="event-badge-dot"></span>
        <span>Register Now</span>
      </div>
      
      <h1 data-editable="eventName">${eventName}</h1>
      <p class="hero-tagline" data-editable="tagline">${tagline}</p>
      
      <div class="hero-meta">
        <div class="hero-meta-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span data-editable="eventDate">${eventDate}</span>
        </div>
        <div class="hero-meta-item">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span data-editable="eventLocation">${eventLocation}</span>
        </div>
      </div>
      
      ${description ? `
      <p class="hero-description" data-editable="description">${description}</p>
      ` : ''}
      
      <div class="hero-cta">
        <a href="${ticketUrl}" class="btn btn-primary" data-editable="ctaPrimary">${ctaPrimary}</a>
        <a href="#schedule" class="btn btn-secondary" data-editable="ctaSecondary">${ctaSecondary}</a>
      </div>
    </div>
  </div>

  ${speakers.length > 0 ? `
  <section class="speakers">
    <div class="section-header">
      <h2 class="section-title">Featured Speakers</h2>
      <p class="section-subtitle">Learn from industry experts and thought leaders</p>
    </div>
    <div class="speakers-grid">
      ${speakersHTML}
    </div>
  </section>
  ` : ''}

  ${schedule.length > 0 ? `
  <section id="schedule">
    <div class="section-header">
      <h2 class="section-title">Schedule</h2>
    </div>
    <div class="schedule-list">
      ${scheduleHTML}
    </div>
  </section>
  ` : ''}

  ${tickets.length > 0 ? `
  <section class="tickets">
    <div class="section-header">
      <h2 class="section-title">Get Your Tickets</h2>
      <p class="section-subtitle">Choose the pass that's right for you</p>
    </div>
    <div class="tickets-grid">
      ${ticketsHTML}
    </div>
  </section>
  ` : ''}

  ${venue.length > 0 ? `
  <section>
    <div class="section-header">
      <h2 class="section-title">Venue</h2>
    </div>
    <div class="venue-info">
      ${venueHTML}
    </div>
  </section>
  ` : ''}

  <footer class="footer">
    <p class="footer-text">
      Questions? Contact us at <a href="mailto:${contactEmail}" class="footer-email" data-editable="contactEmail">${contactEmail}</a>
    </p>
  </footer>
</body>
</html>`;
}
function generateBabyAnnouncement(data) {
  const {
    babyName = 'Olivia Grace',
    parentNames = 'Emma & James Peterson',
    birthDate = 'March 15, 2025',
    birthTime = '8:42 AM',
    weight = '7 lbs 8 oz',
    length = '20 inches',
    announcement = '',
    meaningOfName = '',
    thankYouMessage = '',
    accentColor = '#ffc0cb',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const babyPhoto = data.__images?.babyPhoto;
  const galleryImages = data.__images?.gallery || [];

  const galleryHTML = galleryImages.length > 0 ? galleryImages.map((img, index) => `
    <div class="gallery-item">
      <img src="${img.url}" alt="Baby photo ${index + 1}" />
    </div>
  `).join('') : '';

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${babyName} - Baby Announcement</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #fdfcfc;
      --surface: #f9f7f7;
      --text-primary: #3d3d3d;
      --text-secondary: #7a7a7a;
      --border: #ede9e9;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #1a1818;
        --surface: #2a2626;
        --text-primary: #f5f5f5;
        --text-secondary: #b0b0b0;
        --border: #3a3636;
      }
    }
    
    html.dark {
      --bg: #1a1818;
      --surface: #2a2626;
      --text-primary: #f5f5f5;
      --text-secondary: #b0b0b0;
      --border: #3a3636;
    }
    
    body {
      font-family: 'Lato', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 80px 40px;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 30% 50%, ${accentColor}12 0%, transparent 60%),
        radial-gradient(circle at 70% 50%, ${accentColor}08 0%, transparent 60%);
      pointer-events: none;
    }
    
    .hero-content {
      max-width: 800px;
      position: relative;
      z-index: 1;
    }
    
    .announcement-label {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--accent);
      margin-bottom: 24px;
    }
    
    .baby-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(56px, 10vw, 96px);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 16px;
      color: var(--text-primary);
    }
    
    .parent-names {
      font-size: clamp(18px, 3vw, 24px);
      color: var(--text-secondary);
      font-weight: 300;
      margin-bottom: 48px;
    }
    
    .baby-photo-container {
      margin: 48px auto;
      max-width: 400px;
    }
    
    .baby-photo {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      overflow: hidden;
      border: 8px solid var(--accent);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
      margin-bottom: 32px;
    }
    
    .baby-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .baby-photo-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}20, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80px;
    }
    
    .birth-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      max-width: 500px;
      margin: 0 auto;
    }
    
    @media (max-width: 480px) {
      .birth-stats {
        grid-template-columns: 1fr;
      }
    }
    
    .stat-item {
      padding: 24px;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 16px;
    }
    
    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 600;
      color: var(--accent);
    }
    
    section {
      padding: 80px 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 60px 24px;
      }
    }
    
    .announcement-section {
      text-align: center;
    }
    
    .section-icon {
      font-size: 48px;
      margin-bottom: 24px;
    }
    
    .announcement-text {
      font-size: clamp(18px, 2.5vw, 22px);
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 48px;
      font-style: italic;
    }
    
    .name-meaning {
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      margin-bottom: 48px;
    }
    
    .name-meaning-title {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 24px;
      color: var(--accent);
    }
    
    .name-meaning-text {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-secondary);
      text-align: center;
    }
    
    .gallery {
      background: var(--surface);
    }
    
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 5vw, 42px);
      font-weight: 600;
      text-align: center;
      margin-bottom: 48px;
      color: var(--accent);
    }
    
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }
    
    @media (max-width: 768px) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }
    }
    
    .gallery-item {
      aspect-ratio: 1;
      border-radius: 16px;
      overflow: hidden;
      border: 3px solid var(--border);
      transition: transform 0.3s;
    }
    
    .gallery-item:hover {
      transform: scale(1.02);
    }
    
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .thank-you {
      text-align: center;
    }
    
    .thank-you-text {
      font-size: 18px;
      line-height: 1.8;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto;
    }
    
    .footer {
      padding: 48px 40px;
      text-align: center;
      border-top: 2px solid var(--border);
    }
    
    .footer-hearts {
      font-size: 32px;
      margin-bottom: 16px;
    }
    
    .footer-text {
      font-size: 14px;
      color: var(--text-secondary);
      font-style: italic;
    }
    
    .divider {
      width: 80px;
      height: 2px;
      background: var(--accent);
      margin: 48px auto;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <p class="announcement-label">Introducing</p>
      
      <h1 class="baby-name" data-editable="babyName">${babyName}</h1>
      
      <p class="parent-names">
        Welcomed with love by<br>
        <span data-editable="parentNames">${parentNames}</span>
      </p>
      
      <div class="baby-photo-container">
        <div class="baby-photo">
          ${babyPhoto ? `
            <img src="${babyPhoto.url}" alt="${babyName}" />
          ` : `
            <div class="baby-photo-placeholder">👶</div>
          `}
        </div>
      </div>
      
      <div class="birth-stats">
        <div class="stat-item">
          <div class="stat-label">Born</div>
          <div class="stat-value" data-editable="birthDate">${birthDate}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Time</div>
          <div class="stat-value" data-editable="birthTime">${birthTime}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Weight</div>
          <div class="stat-value" data-editable="weight">${weight}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Length</div>
          <div class="stat-value" data-editable="length">${length}</div>
        </div>
      </div>
    </div>
  </div>

  ${announcement ? `
  <section class="announcement-section">
    <div class="section-icon">💕</div>
    <p class="announcement-text" data-editable="announcement">${announcement}</p>
  </section>
  ` : ''}

  ${meaningOfName ? `
  <section>
    <div class="name-meaning">
      <h2 class="name-meaning-title">Meaning of the Name</h2>
      <p class="name-meaning-text" data-editable="meaningOfName">${meaningOfName}</p>
    </div>
  </section>
  ` : ''}

  ${galleryImages.length > 0 ? `
  <section class="gallery">
    <h2 class="section-title">First Moments</h2>
    <div class="gallery-grid">
      ${galleryHTML}
    </div>
  </section>
  ` : ''}

  ${thankYouMessage ? `
  <section class="thank-you">
    <div class="divider"></div>
    <p class="thank-you-text" data-editable="thankYouMessage">${thankYouMessage}</p>
  </section>
  ` : ''}

  <footer class="footer">
    <div class="footer-hearts">💗</div>
    <p class="footer-text">
      With love, <span data-editable="parentNames">${parentNames}</span>
    </p>
  </footer>
</body>
</html>`;
}
function generateTeacherProfile(data) {
  const {
    name = 'Ms. Jennifer Martinez',
    title = 'High School English Teacher',
    school = 'Lincoln High School',
    yearsExperience = '12',
    bio = '',
    subjects = [],
    education = [],
    teachingPhilosophy = '',
    classInfo = [],
    officeHours = '',
    contactEmail = 'jmartinez@lincolnhs.edu',
    contactPhone = '',
    accentColor = '#2563eb',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const profilePhoto = data.__images?.profilePhoto;

  const subjectsHTML = subjects.map((subject, index) => `
    <div class="subject-tag" data-editable="subjects.${index}">${subject}</div>
  `).join('');

  const educationHTML = education.map((edu, index) => `
    <div class="education-item">
      <h3 class="education-degree" data-editable="education.${index}.degree">${edu.degree}</h3>
      <p class="education-school" data-editable="education.${index}.institution">${edu.institution}</p>
      <p class="education-year" data-editable="education.${index}.year">${edu.year}</p>
    </div>
  `).join('');

  const classInfoHTML = classInfo.map((cls, index) => `
    <div class="class-item">
      <h3 class="class-name" data-editable="classInfo.${index}.className">${cls.className}</h3>
      <div class="class-details">
        <span data-editable="classInfo.${index}.period">${cls.period}</span>
        <span class="class-divider">•</span>
        <span data-editable="classInfo.${index}.room">${cls.room}</span>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f8fafc;
      --text-primary: #0f172a;
      --text-secondary: #64748b;
      --border: #e2e8f0;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0f172a;
        --surface: #1e293b;
        --text-primary: #f1f5f9;
        --text-secondary: #94a3b8;
        --border: #334155;
      }
    }
    
    html.dark {
      --bg: #0f172a;
      --surface: #1e293b;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --border: #334155;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 60px 40px;
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 40px 24px;
      }
    }
    
    .header-content {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 48px;
      align-items: start;
    }
    
    @media (max-width: 768px) {
      .header-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 32px;
      }
    }
    
    .profile-photo {
      width: 200px;
      height: 200px;
      border-radius: 16px;
      overflow: hidden;
      border: 4px solid var(--accent);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
    
    @media (max-width: 768px) {
      .profile-photo {
        margin: 0 auto;
      }
    }
    
    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .profile-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}20, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 72px;
      font-weight: 900;
      color: var(--accent);
    }
    
    .header-info h1 {
      font-size: clamp(32px, 5vw, 42px);
      font-weight: 800;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    
    .header-title {
      font-size: 20px;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .header-school {
      font-size: 18px;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .experience-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }
    
    .contact-links {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    @media (max-width: 768px) {
      .contact-links {
        justify-content: center;
      }
    }
    
    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--accent);
      color: white;
      border-radius: 8px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .contact-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${accentColor}40;
    }
    
    .contact-link svg {
      width: 16px;
      height: 16px;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 40px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 24px;
      }
    }
    
    section {
      padding: 60px 0;
      border-bottom: 1px solid var(--border);
    }
    
    section:last-of-type {
      border-bottom: none;
    }
    
    .section-title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 24px;
      color: var(--text-primary);
    }
    
    .bio-text {
      font-size: 18px;
      line-height: 1.8;
      color: var(--text-secondary);
    }
    
    .subjects-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .subject-tag {
      padding: 10px 20px;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
      cursor: default;
    }
    
    .subject-tag:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    
    .education-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .education-item {
      padding: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
    }
    
    .education-degree {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .education-school {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    
    .education-year {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
    }
    
    .philosophy-text {
      font-size: 18px;
      line-height: 1.8;
      color: var(--text-secondary);
      font-style: italic;
      padding: 32px;
      background: var(--surface);
      border-left: 4px solid var(--accent);
      border-radius: 8px;
    }
    
    .classes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }
    
    @media (max-width: 768px) {
      .classes-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .class-item {
      padding: 24px;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 12px;
      transition: all 0.2s;
    }
    
    .class-item:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    
    .class-name {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .class-details {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .class-divider {
      margin: 0 8px;
    }
    
    .office-hours-box {
      padding: 32px;
      background: var(--surface);
      border: 2px solid var(--accent);
      border-radius: 12px;
      max-width: 500px;
    }
    
    .office-hours-text {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-secondary);
      white-space: pre-line;
    }
    
    .footer {
      padding: 48px 40px;
      text-align: center;
      background: var(--surface);
      border-top: 1px solid var(--border);
    }
    
    .footer-text {
      font-size: 14px;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-content">
      <div class="profile-photo">
        ${profilePhoto ? `
          <img src="${profilePhoto.url}" alt="${name}" />
        ` : `
          <div class="profile-placeholder">${name.charAt(0)}</div>
        `}
      </div>
      
      <div class="header-info">
        <h1 data-editable="name">${name}</h1>
        <p class="header-title" data-editable="title">${title}</p>
        <p class="header-school" data-editable="school">${school}</p>
        
        <div class="experience-badge">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
          </svg>
          <span data-editable="yearsExperience">${yearsExperience}</span> Years Experience
        </div>
        
        <div class="contact-links">
          <a href="mailto:${contactEmail}" class="contact-link" data-editable="contactEmail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Email
          </a>
          ${contactPhone ? `
          <a href="tel:${contactPhone.replace(/\s/g, '')}" class="contact-link" data-editable="contactPhone">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            Phone
          </a>
          ` : ''}
        </div>
      </div>
    </div>
  </header>

  <div class="container">
    ${bio ? `
    <section>
      <h2 class="section-title">About Me</h2>
      <p class="bio-text" data-editable="bio">${bio}</p>
    </section>
    ` : ''}

    ${subjects.length > 0 ? `
    <section>
      <h2 class="section-title">Subjects I Teach</h2>
      <div class="subjects-grid">
        ${subjectsHTML}
      </div>
    </section>
    ` : ''}

    ${education.length > 0 ? `
    <section>
      <h2 class="section-title">Education</h2>
      <div class="education-list">
        ${educationHTML}
      </div>
    </section>
    ` : ''}

    ${teachingPhilosophy ? `
    <section>
      <h2 class="section-title">Teaching Philosophy</h2>
      <blockquote class="philosophy-text" data-editable="teachingPhilosophy">${teachingPhilosophy}</blockquote>
    </section>
    ` : ''}

    ${classInfo.length > 0 ? `
    <section>
      <h2 class="section-title">My Classes</h2>
      <div class="classes-grid">
        ${classInfoHTML}
      </div>
    </section>
    ` : ''}

    ${officeHours ? `
    <section>
      <h2 class="section-title">Office Hours</h2>
      <div class="office-hours-box">
        <p class="office-hours-text" data-editable="officeHours">${officeHours}</p>
      </div>
    </section>
    ` : ''}
  </div>

  <footer class="footer">
    <p class="footer-text">
      Questions? Feel free to reach out at <a href="mailto:${contactEmail}" style="color: var(--accent); text-decoration: none;" data-editable="contactEmail">${contactEmail}</a>
    </p>
  </footer>
</body>
</html>`;
}
function generateStudentPortfolio(data) {
  const {
    studentName = 'Alex Johnson',
    grade = 'Junior',
    school = 'Riverside High School',
    gradYear = '2026',
    about = '',
    interests = [],
    projects = [],
    achievements = [],
    academics = [],
    contactEmail = 'alex.johnson@email.com',
    accentColor = '#8b5cf6',
    darkMode = 'Auto'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const profilePhoto = data.__images?.profilePhoto;

  const interestsHTML = interests.map((interest, index) => `
    <div class="interest-tag" data-editable="interests.${index}">${interest}</div>
  `).join('');

  const projectsHTML = projects.map((project, index) => {
    const imageKey = `projects.${index}.image`;
    const projectImage = data.__images?.[imageKey];
    
    return `
    <div class="project-card">
      <div class="project-image">
        ${projectImage ? `
          <img src="${projectImage.url}" alt="${project.title}" />
        ` : `
          <div class="project-placeholder">
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        `}
      </div>
      <div class="project-content">
        <h3 class="project-title" data-editable="projects.${index}.title">${project.title}</h3>
        <p class="project-description" data-editable="projects.${index}.description">${project.description}</p>
        ${project.skills ? `
        <div class="project-skills" data-editable="projects.${index}.skills">${project.skills}</div>
        ` : ''}
      </div>
    </div>
    `;
  }).join('');

  const achievementsHTML = achievements.map((achievement, index) => `
    <div class="achievement-item">
      <div class="achievement-year" data-editable="achievements.${index}.year">${achievement.year}</div>
      <div class="achievement-content">
        <h3 class="achievement-title" data-editable="achievements.${index}.title">${achievement.title}</h3>
        ${achievement.description ? `
        <p class="achievement-description" data-editable="achievements.${index}.description">${achievement.description}</p>
        ` : ''}
      </div>
    </div>
  `).join('');

  const academicsHTML = academics.map((academic, index) => `
    <div class="academic-stat">
      <div class="stat-label" data-editable="academics.${index}.label">${academic.label}</div>
      <div class="stat-value" data-editable="academics.${index}.value">${academic.value}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${studentName} - Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #fafafa;
      --text-primary: #0a0a0a;
      --text-secondary: #666666;
      --border: #e5e5e5;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0a0a0a;
        --surface: #1a1a1a;
        --text-primary: #fafafa;
        --text-secondary: #a3a3a3;
        --border: #2a2a2a;
      }
    }
    
    html.dark {
      --bg: #0a0a0a;
      --surface: #1a1a1a;
      --text-primary: #fafafa;
      --text-secondary: #a3a3a3;
      --border: #2a2a2a;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 100px 40px;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 50%, ${accentColor}12 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, ${accentColor}08 0%, transparent 50%);
      pointer-events: none;
    }
    
    .hero-content {
      max-width: 1000px;
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 40px;
      }
    }
    
    .profile-photo-large {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      overflow: hidden;
      border: 6px solid var(--accent);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }
    
    @media (max-width: 768px) {
      .profile-photo-large {
        margin: 0 auto;
      }
    }
    
    .profile-photo-large img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .profile-placeholder-large {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}20, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 96px;
      font-weight: 900;
      color: var(--accent);
    }
    
    .hero-text {
      min-width: 0;
    }
    
    .hero-label {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 8px;
    }
    
    h1 {
      font-size: clamp(40px, 6vw, 56px);
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    
    .hero-subtitle {
      font-size: clamp(18px, 2.5vw, 22px);
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .hero-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }
    
    @media (max-width: 768px) {
      .hero-meta {
        justify-content: center;
      }
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .hero-about {
      font-size: 16px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .contact-button {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: var(--accent);
      color: white;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .contact-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${accentColor}40;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 40px;
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 0 24px;
      }
    }
    
    section {
      padding: 80px 0;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 60px 0;
      }
    }
    
    .section-title {
      font-size: clamp(32px, 5vw, 42px);
      font-weight: 800;
      margin-bottom: 48px;
      text-align: center;
    }
    
    .interests-section {
      background: var(--surface);
      margin: 0 -40px;
      padding: 80px 40px;
    }
    
    @media (max-width: 768px) {
      .interests-section {
        margin: 0 -24px;
        padding: 60px 24px;
      }
    }
    
    .interests-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .interest-tag {
      padding: 12px 24px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 100px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .interest-tag:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }
    
    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s;
    }
    
    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
      border-color: var(--accent);
    }
    
    .project-image {
      aspect-ratio: 16/9;
      background: linear-gradient(135deg, ${accentColor}10, ${accentColor}05);
      overflow: hidden;
    }
    
    .project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .project-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
    }
    
    .project-content {
      padding: 24px;
    }
    
    .project-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .project-description {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    
    .project-skills {
      font-size: 13px;
      color: var(--accent);
      font-weight: 600;
    }
    
    .achievements-list {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .achievement-item {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 24px;
      padding: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 0.2s;
    }
    
    @media (max-width: 768px) {
      .achievement-item {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }
    
    .achievement-item:hover {
      border-color: var(--accent);
      transform: translateX(4px);
    }
    
    .achievement-year {
      font-size: 18px;
      font-weight: 700;
      color: var(--accent);
    }
    
    .achievement-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .achievement-description {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .academics-section {
      background: var(--surface);
      margin: 0 -40px;
      padding: 80px 40px;
    }
    
    @media (max-width: 768px) {
      .academics-section {
        margin: 0 -24px;
        padding: 60px 24px;
      }
    }
    
    .academics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .academic-stat {
      text-align: center;
      padding: 32px 24px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 12px;
    }
    
    .stat-label {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .stat-value {
      font-size: 32px;
      font-weight: 900;
      color: var(--accent);
    }
    
    .footer {
      padding: 60px 40px;
      text-align: center;
      border-top: 1px solid var(--border);
    }
    
    .footer-text {
      font-size: 14px;
      color: var(--text-secondary);
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="profile-photo-large">
        ${profilePhoto ? `
          <img src="${profilePhoto.url}" alt="${studentName}" />
        ` : `
          <div class="profile-placeholder-large">${studentName.charAt(0)}</div>
        `}
      </div>
      
      <div class="hero-text">
        <p class="hero-label">Student Portfolio</p>
        <h1 data-editable="studentName">${studentName}</h1>
        <p class="hero-subtitle">
          <span data-editable="grade">${grade}</span> at <span data-editable="school">${school}</span>
        </p>
        
        <div class="hero-meta">
          <div class="meta-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
            </svg>
            Class of <span data-editable="gradYear">${gradYear}</span>
          </div>
        </div>
        
        ${about ? `
        <p class="hero-about" data-editable="about">${about}</p>
        ` : ''}
        
        <a href="mailto:${contactEmail}" class="contact-button" data-editable="contactEmail">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Get in Touch
        </a>
      </div>
    </div>
  </div>

  ${interests.length > 0 ? `
  <div class="interests-section">
    <div class="container">
      <h2 class="section-title">Interests & Hobbies</h2>
      <div class="interests-grid">
        ${interestsHTML}
      </div>
    </div>
  </div>
  ` : ''}

  ${projects.length > 0 ? `
  <section>
    <div class="container">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        ${projectsHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${achievements.length > 0 ? `
  <section>
    <div class="container">
      <h2 class="section-title">Achievements & Awards</h2>
      <div class="achievements-list">
        ${achievementsHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${academics.length > 0 ? `
  <div class="academics-section">
    <div class="container">
      <h2 class="section-title">Academics</h2>
      <div class="academics-grid">
        ${academicsHTML}
      </div>
    </div>
  </div>
  ` : ''}

  <footer class="footer">
    <p class="footer-text">
      © ${new Date().getFullYear()} <span data-editable="studentName">${studentName}</span>
    </p>
  </footer>
</body>
</html>`;
}
function generateFitnessTrainer(data) {
  const {
    trainerName = 'Marcus Thompson',
    tagline = 'Certified Personal Trainer & Nutrition Coach',
    yearsExperience = '8+',
    heroStatement = '',
    bio = '',
    specialties = [],
    certifications = [],
    trainingPackages = [],
    testimonials = [],
    schedule = '',
    location = '',
    phone = '',
    email = '',
    instagramHandle = '',
    accentColor = '#f97316',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const trainerPhoto = data.__images?.trainerPhoto;

  const specialtiesHTML = specialties.map((specialty, index) => `
    <div class="specialty-card" data-editable="specialties.${index}">
      <div class="specialty-icon">💪</div>
      <div class="specialty-name">${specialty}</div>
    </div>
  `).join('');

  const certificationsHTML = certifications.map((cert, index) => `
    <div class="cert-item">
      <div class="cert-badge">✓</div>
      <div class="cert-content">
        <h3 class="cert-title" data-editable="certifications.${index}.title">${cert.title}</h3>
        <p class="cert-org" data-editable="certifications.${index}.organization">${cert.organization}</p>
        <p class="cert-year" data-editable="certifications.${index}.year">${cert.year}</p>
      </div>
    </div>
  `).join('');

  const packagesHTML = trainingPackages.map((pkg, index) => {
    const features = pkg.features.split('\n').filter(f => f.trim());
    const featuresHTML = features.map(feature => `<li>${feature}</li>`).join('');
    
    return `
    <div class="package-card">
      <div class="package-header">
        <h3 class="package-name" data-editable="trainingPackages.${index}.name">${pkg.name}</h3>
        <div class="package-sessions" data-editable="trainingPackages.${index}.sessions">${pkg.sessions}</div>
      </div>
      <div class="package-price">
        <span class="price-symbol">$</span>
        <span class="price-amount" data-editable="trainingPackages.${index}.price">${pkg.price}</span>
        <span class="price-period">/month</span>
      </div>
      <ul class="package-features" data-editable="trainingPackages.${index}.features">
        ${featuresHTML}
      </ul>
      <a href="mailto:${email}?subject=Interested in ${pkg.name} Package" class="package-button">Get Started</a>
    </div>
    `;
  }).join('');

  const testimonialsHTML = testimonials.map((testimonial, index) => `
    <div class="testimonial-card">
      <div class="testimonial-result" data-editable="testimonials.${index}.result">${testimonial.result}</div>
      <p class="testimonial-quote" data-editable="testimonials.${index}.quote">"${testimonial.quote}"</p>
      <p class="testimonial-author" data-editable="testimonials.${index}.name">— ${testimonial.name}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${trainerName} - Personal Trainer</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #fafafa;
      --surface: #ffffff;
      --text-primary: #0f0f0f;
      --text-secondary: #666666;
      --border: #e5e5e5;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0a0a0a;
        --surface: #151515;
        --text-primary: #f5f5f5;
        --text-secondary: #a0a0a0;
        --border: #2a2a2a;
      }
    }
    
    html.dark {
      --bg: #0a0a0a;
      --surface: #151515;
      --text-primary: #f5f5f5;
      --text-secondary: #a0a0a0;
      --border: #2a2a2a;
    }
    
    body {
      font-family: 'Outfit', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 100vh;
      background: linear-gradient(135deg, ${accentColor}20 0%, var(--bg) 50%);
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, ${accentColor}15 0%, transparent 70%);
      border-radius: 50%;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 100px 40px;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 80px;
      align-items: center;
    }
    
    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr;
        padding: 80px 40px;
        gap: 60px;
      }
    }
    
    @media (max-width: 768px) {
      .hero-content {
        padding: 60px 24px;
      }
    }
    
    .hero-text {
      max-width: 700px;
    }
    
    .experience-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      background: var(--accent);
      color: white;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 24px;
    }
    
    .hero h1 {
      font-size: clamp(48px, 8vw, 72px);
      font-weight: 900;
      line-height: 1;
      margin-bottom: 16px;
      letter-spacing: -0.03em;
    }
    
    .hero-tagline {
      font-size: clamp(18px, 2.5vw, 24px);
      color: var(--accent);
      font-weight: 700;
      margin-bottom: 32px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    
    .hero-statement {
      font-size: clamp(18px, 2vw, 22px);
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 40px;
      font-weight: 500;
    }
    
    .hero-cta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 36px;
      background: var(--accent);
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.3s;
      border: 2px solid var(--accent);
    }
    
    .cta-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px ${accentColor}50;
    }
    
    .cta-button.secondary {
      background: transparent;
      color: var(--text-primary);
      border-color: var(--border);
    }
    
    .cta-button.secondary:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    .hero-photo {
      position: relative;
    }
    
    .trainer-photo {
      width: 400px;
      height: 500px;
      border-radius: 24px;
      overflow: hidden;
      border: 6px solid var(--accent);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.15);
      transform: rotate(3deg);
      transition: transform 0.3s;
    }
    
    @media (max-width: 1024px) {
      .trainer-photo {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
    }
    
    .trainer-photo:hover {
      transform: rotate(0deg);
    }
    
    .trainer-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}30, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 120px;
    }
    
    section {
      padding: 100px 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 80px 24px;
      }
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }
    
    .section-label {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin-bottom: 12px;
    }
    
    .section-title {
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 900;
      letter-spacing: -0.02em;
    }
    
    .about-section {
      background: var(--surface);
      border-top: 3px solid var(--accent);
      border-bottom: 3px solid var(--accent);
    }
    
    .about-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .about-text {
      font-size: 20px;
      line-height: 1.8;
      color: var(--text-secondary);
    }
    
    .specialties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 24px;
    }
    
    @media (max-width: 768px) {
      .specialties-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }
    }
    
    .specialty-card {
      padding: 32px 24px;
      background: var(--surface);
      border: 3px solid var(--border);
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s;
      cursor: default;
    }
    
    .specialty-card:hover {
      border-color: var(--accent);
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    }
    
    .specialty-icon {
      font-size: 40px;
      margin-bottom: 16px;
    }
    
    .specialty-name {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .certs-section {
      background: var(--surface);
    }
    
    .certs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .cert-item {
      display: flex;
      gap: 20px;
      padding: 24px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 12px;
    }
    
    .cert-badge {
      width: 48px;
      height: 48px;
      background: var(--accent);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 900;
      flex-shrink: 0;
    }
    
    .cert-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .cert-org {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    
    .cert-year {
      font-size: 13px;
      color: var(--accent);
      font-weight: 700;
    }
    
    .packages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
      max-width: 1100px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      .packages-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .package-card {
      padding: 40px 32px;
      background: var(--surface);
      border: 3px solid var(--border);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      transition: all 0.3s;
    }
    
    .package-card:hover {
      border-color: var(--accent);
      transform: translateY(-8px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
    }
    
    .package-header {
      margin-bottom: 24px;
    }
    
    .package-name {
      font-size: 28px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      margin-bottom: 8px;
    }
    
    .package-sessions {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 600;
    }
    
    .package-price {
      margin-bottom: 32px;
    }
    
    .price-symbol {
      font-size: 24px;
      color: var(--text-secondary);
      vertical-align: super;
    }
    
    .price-amount {
      font-size: 64px;
      font-weight: 900;
      color: var(--accent);
      line-height: 1;
    }
    
    .price-period {
      font-size: 16px;
      color: var(--text-secondary);
    }
    
    .package-features {
      list-style: none;
      margin-bottom: 32px;
      flex: 1;
    }
    
    .package-features li {
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
      font-weight: 500;
    }
    
    .package-features li:last-child {
      border-bottom: none;
    }
    
    .package-button {
      display: block;
      padding: 16px;
      background: var(--accent);
      color: white;
      text-align: center;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s;
    }
    
    .package-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${accentColor}50;
    }
    
    .testimonials-section {
      background: var(--surface);
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }
    
    @media (max-width: 768px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .testimonial-card {
      padding: 40px;
      background: var(--bg);
      border-left: 5px solid var(--accent);
      border-radius: 12px;
    }
    
    .testimonial-result {
      font-size: 20px;
      font-weight: 900;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      margin-bottom: 20px;
    }
    
    .testimonial-quote {
      font-size: 16px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 20px;
      font-style: italic;
    }
    
    .testimonial-author {
      font-size: 14px;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .contact-section {
      text-align: center;
    }
    
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      max-width: 900px;
      margin: 0 auto 48px;
    }
    
    .contact-item {
      padding: 32px;
      background: var(--surface);
      border: 3px solid var(--border);
      border-radius: 16px;
    }
    
    .contact-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 16px;
      background: var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
    }
    
    .contact-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .contact-value {
      font-size: 16px;
      font-weight: 700;
    }
    
    .contact-value a {
      color: var(--text-primary);
      text-decoration: none;
    }
    
    .contact-value a:hover {
      color: var(--accent);
    }
    
    .schedule-box {
      max-width: 500px;
      margin: 0 auto;
      padding: 40px;
      background: var(--surface);
      border: 3px solid var(--accent);
      border-radius: 16px;
    }
    
    .schedule-text {
      font-size: 18px;
      line-height: 1.8;
      white-space: pre-line;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <div class="experience-badge">
          <span data-editable="yearsExperience">${yearsExperience}</span> YEARS EXPERIENCE
        </div>
        
        <h1 data-editable="trainerName">${trainerName}</h1>
        <p class="hero-tagline" data-editable="tagline">${tagline}</p>
        
        ${heroStatement ? `
        <p class="hero-statement" data-editable="heroStatement">${heroStatement}</p>
        ` : ''}
        
        <div class="hero-cta">
          <a href="mailto:${email}" class="cta-button">
            Book Free Consultation
          </a>
          <a href="#packages" class="cta-button secondary">
            View Packages
          </a>
        </div>
      </div>
      
      <div class="hero-photo">
        <div class="trainer-photo">
          ${trainerPhoto ? `
            <img src="${trainerPhoto.url}" alt="${trainerName}" />
          ` : `
            <div class="photo-placeholder">🏋️</div>
          `}
        </div>
      </div>
    </div>
  </div>

  ${bio ? `
  <section class="about-section">
    <div class="section-header">
      <div class="section-label">About</div>
      <h2 class="section-title">My Story</h2>
    </div>
    <div class="about-content">
      <p class="about-text" data-editable="bio">${bio}</p>
    </div>
  </section>
  ` : ''}

  ${specialties.length > 0 ? `
  <section>
    <div class="section-header">
      <div class="section-label">What I Do</div>
      <h2 class="section-title">Specialties</h2>
    </div>
    <div class="specialties-grid">
      ${specialtiesHTML}
    </div>
  </section>
  ` : ''}

  ${certifications.length > 0 ? `
  <section class="certs-section">
    <div class="section-header">
      <div class="section-label">Credentials</div>
      <h2 class="section-title">Certifications</h2>
    </div>
    <div class="certs-grid">
      ${certificationsHTML}
    </div>
  </section>
  ` : ''}

  ${trainingPackages.length > 0 ? `
  <section id="packages">
    <div class="section-header">
      <div class="section-label">Pricing</div>
      <h2 class="section-title">Training Packages</h2>
    </div>
    <div class="packages-grid">
      ${packagesHTML}
    </div>
  </section>
  ` : ''}

  ${testimonials.length > 0 ? `
  <section class="testimonials-section">
    <div class="section-header">
      <div class="section-label">Success Stories</div>
      <h2 class="section-title">Client Results</h2>
    </div>
    <div class="testimonials-grid">
      ${testimonialsHTML}
    </div>
  </section>
  ` : ''}

  <section class="contact-section">
    <div class="section-header">
      <div class="section-label">Get Started</div>
      <h2 class="section-title">Contact Me</h2>
    </div>
    
    <div class="contact-grid">
      ${location ? `
      <div class="contact-item">
        <div class="contact-icon">📍</div>
        <div class="contact-label">Location</div>
        <div class="contact-value" data-editable="location">${location}</div>
      </div>
      ` : ''}
      
      <div class="contact-item">
        <div class="contact-icon">📧</div>
        <div class="contact-label">Email</div>
        <div class="contact-value">
          <a href="mailto:${email}" data-editable="email">${email}</a>
        </div>
      </div>
      
      ${phone ? `
      <div class="contact-item">
        <div class="contact-icon">📱</div>
        <div class="contact-label">Phone</div>
        <div class="contact-value">
          <a href="tel:${phone.replace(/\s/g, '')}" data-editable="phone">${phone}</a>
        </div>
      </div>
      ` : ''}
      
      ${instagramHandle ? `
      <div class="contact-item">
        <div class="contact-icon">📸</div>
        <div class="contact-label">Instagram</div>
        <div class="contact-value">
          <a href="https://instagram.com/instagramHandle.replace(′@′,′′)"target="blank"data−editable="instagramHandle">{instagramHandle.replace('@', '')}" target="_blank" data-editable="instagramHandle">
instagramHandle.replace(′@′,′′)"target="b​lank"data−editable="instagramHandle">{instagramHandle}
</a>
</div>
</div>
` : ''}
</div>
${schedule ? `
<div class="schedule-box">
  <h3 style="font-size: 24px; font-weight: 900; text-transform: uppercase; margin-bottom: 24px;">Availability</h3>
  <p class="schedule-text" data-editable="schedule">${schedule}</p>
</div>
` : ''}
</section>
</body>
</html>`;
}
function generateWellnessCoach(data) {
  const {
    coachName = 'Dr. Lisa Chen',
    credentials = 'PhD, Certified Holistic Health Coach',
    tagline = 'Find Balance. Nurture Wellness. Transform Your Life.',
    welcomeMessage = '',
    philosophy = '',
    services = [],
    approach = [],
    backgrounds = [],
    areasOfFocus = [],
    sessionInfo = '',
    bookingUrl = '#book',
    email = '',
    phone = '',
    accentColor = '#10b981',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const coachPhoto = data.__images?.coachPhoto;

  const servicesHTML = services.map((service, index) => `
    <div class="service-card">
      <div class="service-icon">✦</div>
      <h3 class="service-name" data-editable="services.${index}.name">${service.name}</h3>
      <p class="service-description" data-editable="services.${index}.description">${service.description}</p>
      <p class="service-duration" data-editable="services.${index}.duration">${service.duration}</p>
    </div>
  `).join('');

  const approachHTML = approach.map((item, index) => `
    <div class="approach-item">
      <div class="approach-dot"></div>
      <span data-editable="approach.${index}">${item}</span>
    </div>
  `).join('');

  const backgroundsHTML = backgrounds.map((bg, index) => `
    <div class="background-item">
      <h4 class="background-title" data-editable="backgrounds.${index}.title">${bg.title}</h4>
      <p class="background-institution" data-editable="backgrounds.${index}.institution">${bg.institution}</p>
      <p class="background-year" data-editable="backgrounds.${index}.year">${bg.year}</p>
    </div>
  `).join('');

  const areasHTML = areasOfFocus.map((area, index) => `
    <div class="area-tag" data-editable="areasOfFocus.${index}">${area}</div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${coachName} - Wellness Coach</title>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&family=Lato:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #fefefe;
      --surface: #f9faf9;
      --text-primary: #2d3436;
      --text-secondary: #636e72;
      --border: #dfe6e9;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #1a1d1a;
        --surface: #242724;
        --text-primary: #f0f4f0;
        --text-secondary: #a8b2a8;
        --border: #364036;
      }
    }
    
    html.dark {
      --bg: #1a1d1a;
      --surface: #242724;
      --text-primary: #f0f4f0;
      --text-secondary: #a8b2a8;
      --border: #364036;
    }
    
    body {
      font-family: 'Lato', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.8;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 120px 60px;
      position: relative;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 80px 24px;
        min-height: auto;
      }
    }
    
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, ${accentColor}03, transparent);
      pointer-events: none;
    }
    
    .hero-content {
      max-width: 1100px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 100px;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    
    @media (max-width: 968px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 60px;
        text-align: center;
      }
    }
    
    .hero-text h1 {
      font-family: 'Crimson Text', serif;
      font-size: clamp(42px, 6vw, 64px);
      font-weight: 400;
      line-height: 1.2;
      margin-bottom: 16px;
      letter-spacing: -0.01em;
    }
    
    .credentials {
      font-size: 16px;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 40px;
      letter-spacing: 0.02em;
    }
    
    .tagline {
      font-family: 'Crimson Text', serif;
      font-size: clamp(22px, 3vw, 28px);
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 48px;
      font-style: italic;
    }
    
    .welcome-message {
      font-size: 18px;
      line-height: 1.9;
      color: var(--text-secondary);
      margin-bottom: 40px;
    }
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 40px;
      background: var(--accent);
      color: white;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.02em;
      transition: all 0.3s;
      border: 2px solid var(--accent);
    }
    
    .cta-button:hover {
      background: transparent;
      color: var(--accent);
      transform: translateY(-2px);
    }
    
    .hero-photo {
      position: relative;
    }
    
    @media (max-width: 968px) {
      .hero-photo {
        order: -1;
      }
    }
    
    .photo-frame {
      width: 400px;
      height: 480px;
      border-radius: 200px 200px 20px 20px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
      margin: 0 auto;
    }
    
    @media (max-width: 968px) {
      .photo-frame {
        width: 300px;
        height: 360px;
      }
    }
    
    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}10, ${accentColor}05);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80px;
    }
    
    .photo-ornament {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.1;
    }
    
    section {
      padding: 100px 60px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 80px 24px;
      }
    }
    
    .section-divider {
      width: 60px;
      height: 1px;
      background: var(--accent);
      margin: 0 auto 32px;
    }
    
    .section-title {
      font-family: 'Crimson Text', serif;
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 600;
      text-align: center;
      margin-bottom: 24px;
      letter-spacing: -0.01em;
    }
    
    .section-subtitle {
      text-align: center;
      font-size: 18px;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 64px;
      line-height: 1.8;
    }
    
    .philosophy-section {
      background: var(--surface);
      border-radius: 32px;
      padding: 80px 60px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .philosophy-section {
        padding: 60px 32px;
      }
    }
    
    .philosophy-text {
      font-size: 20px;
      line-height: 2;
      color: var(--text-secondary);
      max-width: 900px;
      margin: 0 auto;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 40px;
    }
    
    @media (max-width: 768px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .service-card {
      padding: 48px 40px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 24px;
      text-align: center;
      transition: all 0.4s;
    }
    
    .service-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.06);
      border-color: var(--accent);
    }
    
    .service-icon {
      font-size: 32px;
      color: var(--accent);
      margin-bottom: 24px;
    }
    
    .service-name {
      font-family: 'Crimson Text', serif;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .service-description {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 20px;
    }
    
    .service-duration {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
    }
    
    .approach-section {
      background: var(--surface);
    }
    
    .approach-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .approach-item {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 18px;
      font-weight: 400;
    }
    
    .approach-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
    }
    
    .backgrounds-list {
      max-width: 800px;
      margin: 0 auto;
      display: grid;
      gap: 32px;
    }
    
    .background-item {
      padding: 32px 40px;
      background: var(--surface);
      border-left: 4px solid var(--accent);
      border-radius: 12px;
    }
    
    .background-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .background-institution {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }
    
    .background-year {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
    }
    
    .areas-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .area-tag {
      padding: 12px 28px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      transition: all 0.3s;
    }
    
    .area-tag:hover {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    
    .booking-section {
      background: linear-gradient(135deg, ${accentColor}08, transparent);
      border-radius: 32px;
      padding: 80px 60px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .booking-section {
        padding: 60px 32px;
      }
    }
    
    .session-info {
      max-width: 500px;
      margin: 0 auto 48px;
      padding: 40px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 20px;
    }
    
    .session-info-text {
      font-size: 16px;
      line-height: 2;
      white-space: pre-line;
    }
    
    .contact-links {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 32px;
    }
    
    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--border);
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .contact-link:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    .footer {
      padding: 60px;
      text-align: center;
      border-top: 1px solid var(--border);
    }
    
    .footer-text {
      font-size: 14px;
      color: var(--text-secondary);
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1 data-editable="coachName">${coachName}</h1>
        <p class="credentials" data-editable="credentials">${credentials}</p>
        <p class="tagline" data-editable="tagline">${tagline}</p>
        
        ${welcomeMessage ? `
        <p class="welcome-message" data-editable="welcomeMessage">${welcomeMessage}</p>
        ` : ''}
        
        <a href="${bookingUrl}" class="cta-button">
          Schedule Consultation
        </a>
      </div>
      
      <div class="hero-photo">
        <div class="photo-ornament"></div>
        <div class="photo-frame">
          ${coachPhoto ? `
            <img src="${coachPhoto.url}" alt="${coachName}" />
          ` : `
            <div class="photo-placeholder">🌿</div>
          `}
        </div>
      </div>
    </div>
  </div>

  ${philosophy ? `
  <section>
    <div class="philosophy-section">
      <div class="section-divider"></div>
      <h2 class="section-title">Philosophy</h2>
      <p class="philosophy-text" data-editable="philosophy">${philosophy}</p>
    </div>
  </section>
  ` : ''}

  ${services.length > 0 ? `
  <section>
    <div class="section-divider"></div>
    <h2 class="section-title">Services</h2>
    <p class="section-subtitle">Personalized support for your wellness journey</p>
    <div class="services-grid">
      ${servicesHTML}
    </div>
  </section>
  ` : ''}

  ${approach.length > 0 ? `
  <section class="approach-section">
    <div class="section-divider"></div>
    <h2 class="section-title">My Approach</h2>
    <div class="approach-grid">
      ${approachHTML}
    </div>
  </section>
  ` : ''}

  ${backgrounds.length > 0 ? `
  <section>
    <div class="section-divider"></div>
    <h2 class="section-title">Background & Training</h2>
    <div class="backgrounds-list">
      ${backgroundsHTML}
    </div>
  </section>
  ` : ''}

  ${areasOfFocus.length > 0 ? `
  <section>
    <div class="section-divider"></div>
    <h2 class="section-title">Areas of Focus</h2>
    <div class="areas-cloud">
      ${areasHTML}
    </div>
  </section>
  ` : ''}

  <section>
    <div class="booking-section">
      <div class="section-divider"></div>
      <h2 class="section-title">Begin Your Journey</h2>
      
      ${sessionInfo ? `
      <div class="session-info">
        <p class="session-info-text" data-editable="sessionInfo">${sessionInfo}</p>
      </div>
      ` : ''}
      
      <a href="${bookingUrl}" class="cta-button">Book a Session</a>
      
      <div class="contact-links">
        <a href="mailto:${email}" class="contact-link" data-editable="email">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          ${email}
        </a>
        ${phone ? `
        <a href="tel:${phone.replace(/\s/g, '')}" class="contact-link" data-editable="phone">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          ${phone}
        </a>
        ` : ''}
      </div>
    </div>
  </section>

  <footer class="footer">
    <p class="footer-text">Nurturing wellness, one step at a time</p>
  </footer>
</body>
</html>`;
}
function generateMusicianBand(data) {
  const {
    artistName = 'The Midnight Collective',
    genre = 'Indie Rock • Alternative',
    location = 'Brooklyn, NY',
    bio = '',
    featuredVideo = '',
    latestRelease = [],
    upcomingShows = [],
    bandMembers = [],
    pressQuotes = [],
    socialLinks = [],
    contactEmail = '',
    accentColor = '#dc2626',
    darkMode = 'Dark'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const bandPhoto = data.__images?.bandPhoto;

  const release = latestRelease[0];
  let releaseHTML = '';
  
  if (release) {
    const imageKey = 'latestRelease.0.coverArt';
    const coverArt = data.__images?.[imageKey];
    const streamingLinks = release.streamingLinks ? release.streamingLinks.split('\n').filter(l => l.trim()) : [];
    const linksHTML = streamingLinks.map(link => `<span class="streaming-link">${link}</span>`).join('');
    
    releaseHTML = `
    <section class="release-section">
      <div class="release-content">
        <div class="release-cover">
          ${coverArt ? `
            <img src="${coverArt.url}" alt="${release.title}" />
          ` : `
            <div class="cover-placeholder">
              <svg width="80" height="80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
            </div>
          `}
        </div>
        <div class="release-info">
          <div class="release-label">Latest Release</div>
          <h2 class="release-title" data-editable="latestRelease.0.title">${release.title}</h2>
          <p class="release-date" data-editable="latestRelease.0.releaseDate">${release.releaseDate}</p>
          ${release.description ? `
          <p class="release-description" data-editable="latestRelease.0.description">${release.description}</p>
          ` : ''}
          ${streamingLinks.length > 0 ? `
          <div class="streaming-links" data-editable="latestRelease.0.streamingLinks">
            <div class="streaming-label">Stream Now:</div>
            ${linksHTML}
          </div>
          ` : ''}
        </div>
      </div>
    </section>
    `;
  }

  const showsHTML = upcomingShows.map((show, index) => `
    <div class="show-item">
      <div class="show-date" data-editable="upcomingShows.${index}.date">${show.date}</div>
      <div class="show-details">
        <h3 class="show-venue" data-editable="upcomingShows.${index}.venue">${show.venue}</h3>
        <p class="show-city" data-editable="upcomingShows.${index}.city">${show.city}</p>
      </div>
      <a href="${show.ticketUrl}" class="show-tickets" data-editable="upcomingShows.${index}.ticketUrl">Tickets</a>
    </div>
  `).join('');

  const membersHTML = bandMembers.map((member, index) => {
    const imageKey = `bandMembers.${index}.photo`;
    const memberPhoto = data.__images?.[imageKey];
    
    return `
    <div class="member-card">
      <div class="member-photo">
        ${memberPhoto ? `
          <img src="${memberPhoto.url}" alt="${member.name}" />
        ` : `
          <div class="member-placeholder">🎸</div>
        `}
      </div>
      <h3 class="member-name" data-editable="bandMembers.${index}.name">${member.name}</h3>
      <p class="member-role" data-editable="bandMembers.${index}.role">${member.role}</p>
    </div>
    `;
  }).join('');

  const quotesHTML = pressQuotes.map((quote, index) => `
    <div class="press-quote">
      <p class="quote-text" data-editable="pressQuotes.${index}.quote">"${quote.quote}"</p>
      <p class="quote-source" data-editable="pressQuotes.${index}.source">— ${quote.source}</p>
    </div>
  `).join('');

  const socialHTML = socialLinks.map((social, index) => {
    const url = social.url.startsWith('http') ? social.url : social.url.startsWith('@') ? `#${social.url}` : `https://${social.url}`;
    return `
    <a href="${url}" target="_blank" class="social-button" data-editable="socialLinks.${index}.platform">
      ${social.platform}
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artistName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #0a0a0a;
      --surface: #1a1a1a;
      --text-primary: #ffffff;
      --text-secondary: #a0a0a0;
      --border: #2a2a2a;
    }
    
    html.light {
      --bg: #ffffff;
      --surface: #f5f5f5;
      --text-primary: #0a0a0a;
      --text-secondary: #666666;
      --border: #e0e0e0;
    }
    
    @media (prefers-color-scheme: light) {
      html.auto {
        --bg: #ffffff;
        --surface: #f5f5f5;
        --text-primary: #0a0a0a;
        --text-secondary: #666666;
        --border: #e0e0e0;
      }
    }
    
    body {
      font-family: 'Space Grotesk', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 40px;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(45deg, ${accentColor}20 0%, transparent 50%),
        repeating-linear-gradient(90deg, ${accentColor}05 0px, transparent 2px, transparent 40px);
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 1200px;
    }
    
    .band-photo-hero {
      width: 600px;
      height: 400px;
      margin: 0 auto 60px;
      border-radius: 0;
      overflow: hidden;
      border: 4px solid var(--accent);
      box-shadow: 
        20px 20px 0 ${accentColor}20,
        -20px -20px 0 ${accentColor}10;
      transform: rotate(-2deg);
    }
    
    @media (max-width: 768px) {
      .band-photo-hero {
        width: 100%;
        max-width: 400px;
        height: 300px;
      }
    }
    
    .band-photo-hero img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .hero-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}30, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 120px;
    }
    
    h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(56px, 10vw, 120px);
      font-weight: 400;
      letter-spacing: 0.05em;
      line-height: 0.9;
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    
    .hero-meta {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 40px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .hero-meta span {
      color: var(--accent);
    }
    
    .hero-meta-divider {
      color: var(--text-secondary);
    }
    
    .hero-bio {
      font-size: 20px;
      line-height: 1.7;
      color: var(--text-secondary);
      max-width: 800px;
      margin: 0 auto 48px;
    }
    
    .hero-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .action-button {
      padding: 16px 32px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border: 2px solid var(--accent);
      transition: all 0.2s;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
    }
    
    .action-button:hover {
      background: transparent;
      color: var(--accent);
    }
    
    .action-button.secondary {
      background: transparent;
      color: var(--text-primary);
      border-color: var(--border);
    }
    
    .action-button.secondary:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    section {
      padding: 100px 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 80px 24px;
      }
    }
    
    .section-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(48px, 8vw, 72px);
      font-weight: 400;
      text-align: center;
      margin-bottom: 64px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      position: relative;
    }
    
    .section-title::after {
      content: '';
      display: block;
      width: 100px;
      height: 4px;
      background: var(--accent);
      margin: 24px auto 0;
    }
    
    .release-section {
      background: var(--surface);
      padding: 100px 40px;
      border-top: 4px solid var(--accent);
      border-bottom: 4px solid var(--accent);
    }
    
    @media (max-width: 768px) {
      .release-section {
        padding: 80px 24px;
      }
    }
    
    .release-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 80px;
      align-items: center;
    }
    
    @media (max-width: 968px) {
      .release-content {
        grid-template-columns: 1fr;
        gap: 48px;
        text-align: center;
      }
    }
    
    .release-cover {
      width: 400px;
      height: 400px;
      border: 4px solid var(--accent);
      overflow: hidden;
      box-shadow: 20px 20px 0 ${accentColor}15;
    }
    
    @media (max-width: 968px) {
      .release-cover {
        margin: 0 auto;
        width: 100%;
        max-width: 400px;
        height: auto;
        aspect-ratio: 1;
      }
    }
    
    .release-cover img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .cover-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}30, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
    }
    
    .release-label {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--accent);
      margin-bottom: 16px;
    }
    
    .release-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(36px, 6vw, 56px);
      font-weight: 400;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
      text-transform: uppercase;
    }
    
    .release-date {
      font-size: 16px;
      color: var(--text-secondary);
      font-weight: 600;
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    
    .release-description {
      font-size: 18px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .streaming-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }
    
    @media (max-width: 968px) {
      .streaming-links {
        justify-content: center;
      }
    }
    
    .streaming-label {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-right: 8px;
    }
    
    .streaming-link {
      padding: 8px 16px;
      background: var(--bg);
      border: 2px solid var(--border);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.2s;
    }
    
    .streaming-link:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    .shows-list {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    
    .show-item {
      display: grid;
      grid-template-columns: 100px 1fr auto;
      gap: 32px;
      padding: 32px;
      background: var(--surface);
      align-items: center;
      transition: all 0.2s;
    }
    
    @media (max-width: 768px) {
      .show-item {
        grid-template-columns: 1fr;
        gap: 16px;
        text-align: center;
      }
    }
    
    .show-item:hover {
      background: ${accentColor}10;
      transform: translateX(8px);
    }
    
    .show-date {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 36px;
      color: var(--accent);
      text-transform: uppercase;
    }
    
    .show-venue {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .show-city {
      font-size: 14px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .show-tickets {
      padding: 12px 24px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      transition: all 0.2s;
    }
    
    .show-tickets:hover {
      background: var(--text-primary);
      color: var(--bg);
    }
    
    .members-section {
      background: var(--surface);
    }
    
    .members-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 40px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .member-card {
      text-align: center;
    }
    
    .member-photo {
      width: 220px;
      height: 220px;
      margin: 0 auto 24px;
      overflow: hidden;
      border: 3px solid var(--accent);
      clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
    }
    
    .member-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .member-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}30, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
    }
    
    .member-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      font-weight: 400;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .member-role {
      font-size: 14px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .press-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .press-quote {
      padding: 40px;
      background: var(--surface);
      border-left: 4px solid var(--accent);
    }
    
    .quote-text {
      font-size: 20px;
      line-height: 1.6;
      margin-bottom: 20px;
      font-style: italic;
    }
    
    .quote-source {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent);
    }
    
    .contact-section {
      text-align: center;
      background: var(--surface);
    }
    
    .social-grid {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }
    
    .social-button {
      padding: 14px 28px;
      background: transparent;
      color: var(--text-primary);
      border: 2px solid var(--border);
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      transition: all 0.2s;
    }
    
    .social-button:hover {
      border-color: var(--accent);
      background: var(--accent);
      color: white;
    }
    
    .contact-email {
      font-size: 16px;
      color: var(--text-secondary);
    }
    
    .contact-email a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 700;
    }
    
    .contact-email a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      ${bandPhoto ? `
      <div class="band-photo-hero">
        <img src="${bandPhoto.url}" alt="${artistName}" />
      </div>
      ` : ''}
      
      <h1 data-editable="artistName">${artistName}</h1>
      
      <div class="hero-meta">
        <span data-editable="genre">${genre}</span>
        <span class="hero-meta-divider">•</span>
        <span data-editable="location">${location}</span>
      </div>
      
      ${bio ? `
      <p class="hero-bio" data-editable="bio">${bio}</p>
      ` : ''}
      
      <div class="hero-actions">
        <a href="#shows" class="action-button">Upcoming Shows</a>
        <a href="mailto:${contactEmail}" class="action-button secondary">Booking</a>
      </div>
    </div>
  </div>

  ${releaseHTML}

  ${upcomingShows.length > 0 ? `
  <section id="shows">
    <h2 class="section-title">Live Shows</h2>
    <div class="shows-list">
      ${showsHTML}
    </div>
  </section>
  ` : ''}

  ${bandMembers.length > 0 ? `
  <section class="members-section">
    <h2 class="section-title">The Band</h2>
    <div class="members-grid">
      ${membersHTML}
    </div>
  </section>
  ` : ''}

  ${pressQuotes.length > 0 ? `
  <section>
    <h2 class="section-title">Press</h2>
    <div class="press-grid">
      ${quotesHTML}
    </div>
  </section>
  ` : ''}

  <section class="contact-section">
    <h2 class="section-title">Connect</h2>
    
    ${socialLinks.length > 0 ? `
    <div class="social-grid">
      ${socialHTML}
    </div>
    ` : ''}
    
    <p class="contact-email">
      Booking & Press: <a href="mailto:${contactEmail}" data-editable="contactEmail">${contactEmail}</a>
    </p>
  </section>
</body>
</html>`;
}
function generateCleaningService(data) {
  const {
    businessName = 'Sparkle & Shine Cleaning',
    tagline = 'Professional Cleaning You Can Trust',
    yearsInBusiness = '15+',
    heroText = '',
    services = [],
    whyChooseUs = [],
    serviceAreas = [],
    testimonials = [],
    phone = '',
    email = '',
    hours = '',
    bookingUrl = '#book',
    accentColor = '#06b6d4',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';

  const servicesHTML = services.map((service, index) => `
    <div class="service-box">
      <div class="service-icon">✨</div>
      <h3 class="service-name" data-editable="services.${index}.name">${service.name}</h3>
      <p class="service-description" data-editable="services.${index}.description">${service.description}</p>
      <div class="service-price">
        <span class="price-label">Starting at</span>
        <span class="price-amount" data-editable="services.${index}.price">${service.price}</span>
      </div>
    </div>
  `).join('');

  const whyHTML = whyChooseUs.map((reason, index) => `
    <div class="why-item">
      <div class="why-check">✓</div>
      <span data-editable="whyChooseUs.${index}">${reason}</span>
    </div>
  `).join('');

  const areasHTML = serviceAreas.map((area, index) => `
    <div class="area-badge" data-editable="serviceAreas.${index}">${area}</div>
  `).join('');

  const testimonialsHTML = testimonials.map((testimonial, index) => {
    const stars = '★'.repeat(parseInt(testimonial.rating)) + '☆'.repeat(5 - parseInt(testimonial.rating));
    
    return `
    <div class="testimonial-box">
      <div class="testimonial-stars">${stars}</div>
      <p class="testimonial-text" data-editable="testimonials.${index}.review">"${testimonial.review}"</p>
      <div class="testimonial-author">
        <strong data-editable="testimonials.${index}.name">${testimonial.name}</strong>
        <span data-editable="testimonials.${index}.location">${testimonial.location}</span>
      </div>
    </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f8feff;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --border: #e2e8f0;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #0f172a;
        --surface: #1e293b;
        --text-primary: #f1f5f9;
        --text-secondary: #94a3b8;
        --border: #334155;
      }
    }
    
    html.dark {
      --bg: #0f172a;
      --surface: #1e293b;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --border: #334155;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .header {
      padding: 24px 40px;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    
    html.dark .header {
      background: rgba(15, 23, 42, 0.95);
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 16px 24px;
      }
    }
    
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    
    .header-phone {
      font-weight: 600;
      color: var(--text-primary);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    @media (max-width: 768px) {
      .header-phone span {
        display: none;
      }
    }
    
    .hero {
      padding: 100px 40px;
      background: linear-gradient(135deg, ${accentColor}10 0%, var(--bg) 100%);
      position: relative;
      overflow: hidden;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 80px 24px;
      }
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, ${accentColor}08 0%, transparent 70%);
      border-radius: 50%;
    }
    
    .hero-content {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      text-align: center;
    }
    
    .years-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--accent);
      color: white;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 24px;
    }
    
    h1 {
      font-size: clamp(40px, 7vw, 64px);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    
    .tagline {
      font-size: clamp(18px, 3vw, 24px);
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 32px;
    }
    
    .hero-text {
      font-size: clamp(16px, 2vw, 20px);
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 48px;
      line-height: 1.8;
    }
    
    .hero-cta {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-decoration: none;
      transition: all 0.3s;
      border: 2px solid transparent;
    }
    
    .btn-primary {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    
    .btn-primary:hover {
      background: transparent;
      color: var(--accent);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${accentColor}30;
    }
    
    .btn-secondary {
      background: transparent;
      color: var(--text-primary);
      border-color: var(--border);
    }
    
    .btn-secondary:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    section {
      padding: 100px 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 80px 24px;
      }
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }
    
    .section-label {
      display: inline-block;
      padding: 8px 16px;
      background: ${accentColor}15;
      color: var(--accent);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 16px;
    }
    
    .section-title {
      font-size: clamp(32px, 5vw, 48px);
      font-weight: 800;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    
    .section-subtitle {
      font-size: 18px;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .services-section {
      background: var(--surface);
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }
    
    @media (max-width: 768px) {
      .services-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .service-box {
      padding: 40px 32px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 20px;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
    }
    
    .service-box:hover {
      transform: translateY(-8px);
      border-color: var(--accent);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.08);
    }
    
    .service-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--accent), ${accentColor}cc);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 24px;
      box-shadow: 0 8px 24px ${accentColor}30;
    }
    
    .service-name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .service-description {
      font-size: 15px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 24px;
      flex: 1;
    }
    
    .service-price {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }
    
    .price-label {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .price-amount {
      font-size: 32px;
      font-weight: 800;
      color: var(--accent);
    }
    
    .why-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .why-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      font-weight: 500;
    }
    
    .why-check {
      width: 32px;
      height: 32px;
      background: var(--accent);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .areas-section {
      background: var(--surface);
    }
    
    .areas-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .area-badge {
      padding: 12px 24px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 100px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.2s;
    }
    
    .area-badge:hover {
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-2px);
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 32px;
    }
    
    @media (max-width: 768px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .testimonial-box {
      padding: 40px;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .testimonial-stars {
      font-size: 24px;
      color: #fbbf24;
      letter-spacing: 4px;
    }
    
    .testimonial-text {
      font-size: 16px;
      line-height: 1.7;
      color: var(--text-secondary);
      font-style: italic;
      flex: 1;
    }
    
    .testimonial-author {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .testimonial-author strong {
      font-size: 16px;
      font-weight: 700;
    }
    
    .testimonial-author span {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .cta-section {
      background: linear-gradient(135deg, var(--accent), ${accentColor}dd);
      color: white;
      text-align: center;
      border-radius: 24px;
      padding: 80px 40px;
    }
    
    @media (max-width: 768px) {
      .cta-section {
        padding: 60px 24px;
      }
    }
    
    .cta-section h2 {
      color: white;
      margin-bottom: 16px;
    }
    
    .cta-section p {
      font-size: 18px;
      margin-bottom: 32px;
      opacity: 0.95;
    }
    
    .cta-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-white {
      background: white;
      color: var(--accent);
      border-color: white;
    }
    
    .btn-white:hover {
      background: transparent;
      color: white;
      border-color: white;
    }
    
    .footer {
      padding: 60px 40px;
      background: var(--surface);
      border-top: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .footer {
        padding: 48px 24px;
      }
    }
    
    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 60px;
    }
    
    @media (max-width: 968px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }
    }
    
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    @media (max-width: 968px) {
      .footer-brand {
        align-items: center;
      }
    }
    
    .footer-logo {
      font-size: 24px;
      font-weight: 800;
      color: var(--accent);
    }
    
    .footer-tagline {
      color: var(--text-secondary);
    }
    
    .footer-column h4 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 15px;
      transition: color 0.2s;
    }
    
    .footer-link:hover {
      color: var(--accent);
    }
    
    .footer-bottom {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--text-secondary);
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-content">
      <div class="logo" data-editable="businessName">✨ ${businessName}</div>
      <div class="header-actions">
        <a href="tel:${phone.replace(/\s/g, '')}" class="header-phone">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          <span data-editable="phone">${phone}</span>
        </a>
        <a href="${bookingUrl}" class="btn btn-primary">Book Now</a>
      </div>
    </div>
  </header>

  <div class="hero">
    <div class="hero-content">
      <div class="years-badge">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span data-editable="yearsInBusiness">${yearsInBusiness}</span> Years of Excellence
      </div>
      
      <h1 data-editable="businessName">${businessName}</h1>
      <p class="tagline" data-editable="tagline">${tagline}</p>
      
      ${heroText ? `
      <p class="hero-text" data-editable="heroText">${heroText}</p>
      ` : ''}
      
      <div class="hero-cta">
        <a href="${bookingUrl}" class="btn btn-primary">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Schedule Cleaning
        </a>
        <a href="tel:${phone.replace(/\s/g, '')}" class="btn btn-secondary">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
          </svg>
          Call Now
        </a>
      </div>
    </div>
  </div>

  ${services.length > 0 ? `
  <section class="services-section">
    <div class="section-header">
      <span class="section-label">Our Services</span>
      <h2 class="section-title">What We Offer</h2>
      <p class="section-subtitle">Professional cleaning services tailored to your needs</p>
    </div>
    <div class="services-grid">
      ${servicesHTML}
    </div>
  </section>
  ` : ''}

  ${whyChooseUs.length > 0 ? `
  <section>
    <div class="section-header">
      <span class="section-label">Why Choose Us</span>
      <h2 class="section-title">The Sparkle Difference</h2>
    </div>
    <div class="why-grid">
      ${whyHTML}
    </div>
  </section>
  ` : ''}

  ${serviceAreas.length > 0 ? `
  <section class="areas-section">
    <div class="section-header">
      <span class="section-label">Coverage</span>
      <h2 class="section-title">Areas We Serve</h2>
    </div>
    <div class="areas-cloud">
      ${areasHTML}
    </div>
  </section>
  ` : ''}

  ${testimonials.length > 0 ? `
  <section>
    <div class="section-header">
      <span class="section-label">Testimonials</span>
      <h2 class="section-title">What Our Customers Say</h2>
    </div><div class="testimonials-grid">
      ${testimonialsHTML}
    </div>
  </section>
  ` : ''}
  <section>
    <div class="cta-section">
      <h2 class="section-title">Ready for a Sparkling Clean Home?</h2>
      <p>Book your cleaning service today and experience the difference</p>
      <div class="cta-actions">
        <a href="${bookingUrl}" class="btn btn-white">
          Book Now
        </a>
        <a href="tel:${phone.replace(/\s/g, '')}" class="btn btn-white">
          Call ${phone}
        </a>
      </div>
    </div>
  </section>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="footer-logo" data-editable="businessName">${businessName}</div>
        <p class="footer-tagline" data-editable="tagline">${tagline}</p>
      </div><div class="footer-column">
    <h4>Contact</h4>
    <div class="footer-links">
      <a href="tel:${phone.replace(/\s/g, '')}" class="footer-link" data-editable="phone">${phone}</a>
      <a href="mailto:${email}" class="footer-link" data-editable="email">${email}</a>
      <span class="footer-link" data-editable="hours">${hours}</span>
    </div>
  </div>
  
  <div class="footer-column">
    <h4>Quick Links</h4>
    <div class="footer-links">
      <a href="#services" class="footer-link">Services</a>
      <a href="#about" class="footer-link">About Us</a>
      <a href="${bookingUrl}" class="footer-link">Book Now</a>
    </div>
  </div>
</div>

<div class="footer-bottom">
  <p>© ${new Date().getFullYear()} <span data-editable="businessName">${businessName}</span>. All rights reserved.</p>
</div></footer>
</body>
</html>`;
}
function generateRealEstateAgent(data) {
  const {
    agentName = 'Sarah Mitchell',
    title = 'Licensed Real Estate Agent',
    brokerage = 'Prestige Realty Group',
    tagline = 'Helping You Find Your Dream Home',
    bio = '',
    yearsExperience = '10+',
    homesSold = '500+',
    specializations = [],
    featuredListings = [],
    serviceAreas = [],
    testimonials = [],
    certifications = [],
    phone = '',
    email = '',
    officeAddress = '',
    licenseNumber = '',
    socialLinks = [],
    accentColor = '#2563eb',
    darkMode = 'Light'
  } = data;

  const themeClass = darkMode === 'Dark' ? 'dark' : darkMode === 'Light' ? 'light' : 'auto';
  const agentPhoto = data.__images?.agentPhoto;

  const specializationsHTML = specializations.map((spec, index) => `
    <div class="spec-badge" data-editable="specializations.${index}">${spec}</div>
  `).join('');

  const listingsHTML = featuredListings.map((listing, index) => {
    const imageKey = `featuredListings.${index}.image`;
    const listingImage = data.__images?.[imageKey];
    
    const statusColors = {
      'For Sale': '#10b981',
      'Sold': '#ef4444',
      'Pending': '#f59e0b',
      'Coming Soon': '#6366f1'
    };
    
    return `
    <div class="listing-card">
      <div class="listing-image">
        ${listingImage ? `
          <img src="${listingImage.url}" alt="${listing.address}" />
        ` : `
          <div class="listing-placeholder">
            <svg width="60" height="60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
        `}
        <div class="listing-status" style="background: ${statusColors[listing.status] || '#10b981'};" data-editable="featuredListings.${index}.status">
          ${listing.status}
        </div>
      </div>
      <div class="listing-details">
        <div class="listing-price" data-editable="featuredListings.${index}.price">${listing.price}</div>
        <div class="listing-address" data-editable="featuredListings.${index}.address">${listing.address}</div>
        <div class="listing-specs">
          <div class="listing-spec">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span data-editable="featuredListings.${index}.beds">${listing.beds}</span> beds
          </div>
          <div class="listing-spec">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
            </svg>
            <span data-editable="featuredListings.${index}.baths">${listing.baths}</span> baths
          </div>
          <div class="listing-spec">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
            <span data-editable="featuredListings.${index}.sqft">${listing.sqft}</span> sqft
          </div>
        </div>
      </div>
    </div>
    `;
  }).join('');

  const areasHTML = serviceAreas.map((area, index) => `
    <div class="area-chip" data-editable="serviceAreas.${index}">${area}</div>
  `).join('');

  const testimonialsHTML = testimonials.map((testimonial, index) => `
    <div class="testimonial-card">
      <div class="testimonial-quote">
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </div>
      <p class="testimonial-text" data-editable="testimonials.${index}.review">"${testimonial.review}"</p>
      <div class="testimonial-author">
        <strong data-editable="testimonials.${index}.name">${testimonial.name}</strong>
        <span data-editable="testimonials.${index}.propertyType">${testimonial.propertyType}</span>
      </div>
    </div>
  `).join('');

  const certificationsHTML = certifications.map((cert, index) => `
    <div class="cert-badge">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
      </svg>
      <span data-editable="certifications.${index}">${cert}</span>
    </div>
  `).join('');

  const socialHTML = socialLinks.map((social, index) => {
    const href = social.url.startsWith('http') ? social.url : social.url.startsWith('@') ? `#${social.url}` : `https://${social.url}`;
    return `
    <a href="${href}" target="_blank" class="social-icon" title="${social.platform}" data-editable="socialLinks.${index}.platform">
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      </svg>
    </a>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en" class="${themeClass}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${agentName} - ${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --accent: ${accentColor};
      --bg: #ffffff;
      --surface: #f9fafb;
      --text-primary: #111827;
      --text-secondary: #6b7280;
      --border: #e5e7eb;
    }
    
    @media (prefers-color-scheme: dark) {
      html.auto {
        --bg: #111827;
        --surface: #1f2937;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --border: #374151;
      }
    }
    
    html.dark {
      --bg: #111827;
      --surface: #1f2937;
      --text-primary: #f9fafb;
      --text-secondary: #9ca3af;
      --border: #374151;
    }
    
    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--bg);
      color: var(--text-primary);
      line-height: 1.6;
      transition: background 0.3s, color 0.3s;
    }
    
    .hero {
      background: linear-gradient(135deg, ${accentColor}08, transparent);
      padding: 100px 40px 80px;
      border-bottom: 1px solid var(--border);
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 80px 24px 60px;
      }
    }
    
    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 60px;
      align-items: center;
    }
    
    @media (max-width: 968px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
    }
    
    .agent-photo {
      width: 300px;
      height: 300px;
      border-radius: 20px;
      overflow: hidden;
      border: 4px solid var(--accent);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 968px) {
      .agent-photo {
        margin: 0 auto;
        width: 250px;
        height: 250px;
      }
    }
    
    .agent-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, ${accentColor}20, ${accentColor}10);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80px;
    }
    
    .agent-info h1 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 5vw, 48px);
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    
    .agent-title {
      font-size: 18px;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .agent-brokerage {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }
    
    .agent-tagline {
      font-size: 20px;
      font-style: italic;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }
    
    .agent-bio {
      font-size: 16px;
      line-height: 1.7;
      color: var(--text-secondary);
      margin-bottom: 32px;
    }
    
    .agent-stats {
      display: flex;
      gap: 32px;
      margin-bottom: 32px;
    }
    
    @media (max-width: 968px) {
      .agent-stats {
        justify-content: center;
      }
    }
    
    .stat-box {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: var(--accent);
    }
    
    .stat-label {
      font-size: 14px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .agent-contact {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    @media (max-width: 968px) {
      .agent-contact {
        justify-content: center;
      }
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      transition: all 0.2s;
      border: 2px solid;
    }
    
    .btn-primary {
      background: var(--accent);
      border-color: var(--accent);
      color: white;
    }
    
    .btn-primary:hover {
      background: transparent;
      color: var(--accent);
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background: transparent;
      border-color: var(--border);
      color: var(--text-primary);
    }
    
    .btn-secondary:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    section {
      padding: 80px 40px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      section {
        padding: 60px 24px;
      }
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    
    .section-label {
      display: inline-block;
      padding: 6px 16px;
      background: ${accentColor}10;
      color: var(--accent);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 16px;
    }
    
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 5vw, 42px);
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .section-subtitle {
      font-size: 18px;
      color: var(--text-secondary);
    }
    
    .spec-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .spec-badge {
      padding: 14px 20px;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 12px;
      text-align: center;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.2s;
    }
    
    .spec-badge:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    
    .listings-section {
      background: var(--surface);
    }
    
    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 32px;
    }
    
    @media (max-width: 768px) {
      .listings-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .listing-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s;
    }
    
    .listing-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }
    
    .listing-image {
      position: relative;
      height: 240px;
      background: var(--surface);
    }
    
    .listing-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .listing-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }
    
    .listing-status {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 8px 16px;
      background: #10b981;
      color: white;
      font-size: 13px;
      font-weight: 700;
      border-radius: 100px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .listing-details {
      padding: 24px;
    }
    
    .listing-price {
      font-size: 28px;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 8px;
    }
    
    .listing-address {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .listing-specs {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .listing-spec {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .listing-spec svg {
      flex-shrink: 0;
    }
    
    .areas-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .area-chip {
      padding: 10px 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .area-chip:hover {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 32px;
    }
    
    @media (max-width: 768px) {
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
    }
    
    .testimonial-card {
      padding: 40px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .testimonial-quote {
      color: var(--accent);
      opacity: 0.3;
    }
    
    .testimonial-text {
      font-size: 16px;
      line-height: 1.7;
      color: var(--text-secondary);
      font-style: italic;
    }
    
    .testimonial-author strong {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    
    .testimonial-author span {
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    .certs-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .cert-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-weight: 600;
      font-size: 14px;
    }
    
    .cert-badge svg {
      color: var(--accent);
    }
    
    .contact-section {
      background: linear-gradient(135deg, var(--accent), ${accentColor}dd);
      color: white;
      text-align: center;
      border-radius: 24px;
      padding: 80px 40px;
    }
    
    @media (max-width: 768px) {
      .contact-section {
        padding: 60px 24px;
      }
    }
    
    .contact-section .section-title {
      color: white;
    }
    
    .contact-section .section-subtitle {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 40px;
    }
    
    .contact-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      margin-bottom: 40px;
    }
    
    .contact-info-item {
display: flex;
flex-direction: column;
gap: 8px;
color: white;
}
.contact-info-item svg {
  margin: 0 auto;
  opacity: 0.9;
}

.contact-info-item strong {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.contact-info-item a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
}

.contact-info-item span {
  font-size: 18px;
  font-weight: 600;
}

.social-links {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
}

.social-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.2s;
}

.social-icon:hover {
  background: white;
  color: var(--accent);
  transform: translateY(-2px);
}

.footer {
  padding: 40px;
  text-align: center;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 14px;
}

.footer a {
  color: var(--accent);
  text-decoration: none;
}

    </style>
</head>
<body>
  <div class="hero">
    <div class="hero-content">
      <div class="agent-photo">
        ${agentPhoto ? `
          <img src="${agentPhoto.url}" alt="${agentName}" />
        ` : `
          <div class="photo-placeholder">🏡</div>
        `}
      </div>
  <div class="agent-info">
    <h1 data-editable="agentName">${agentName}</h1>
    <div class="agent-title" data-editable="title">${title}</div>
    <div class="agent-brokerage" data-editable="brokerage">${brokerage}</div>
    <p class="agent-tagline" data-editable="tagline">"${tagline}"</p>
    
    ${bio ? `
    <p class="agent-bio" data-editable="bio">${bio}</p>
    ` : ''}
    
    <div class="agent-stats">
      <div class="stat-box">
        <div class="stat-value" data-editable="yearsExperience">${yearsExperience}</div>
        <div class="stat-label">Years Experience</div>
      </div>
      <div class="stat-box">
        <div class="stat-value" data-editable="homesSold">${homesSold}</div>
        <div class="stat-label">Homes Sold</div>
      </div>
    </div>
    
    <div class="agent-contact">
      <a href="tel:${phone.replace(/\s/g, '')}" class="btn btn-primary" data-editable="phone">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
        </svg>
        Call Me
      </a>
      <a href="mailto:${email}" class="btn btn-secondary" data-editable="email">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        Email Me
      </a>
    </div>
  </div>
</div>
  </div>
${specializations.length > 0 ? `
  <section>
    <div class="section-header">
      <span class="section-label">Expertise</span>
      <h2 class="section-title">Specializations</h2>
    </div>
    <div class="spec-grid">
      ${specializationsHTML}
    </div>
  </section>
  ` : ''}
${featuredListings.length > 0 ? `
  <section class="listings-section">
    <div class="section-header">
      <span class="section-label">Properties</span>
      <h2 class="section-title">Featured Listings</h2>
    </div>
    <div class="listings-grid">
      ${listingsHTML}
    </div>
  </section>
  ` : ''}
${serviceAreas.length > 0 ? `
  <section>
    <div class="section-header">
      <span class="section-label">Coverage</span>
      <h2 class="section-title">Service Areas</h2>
    </div>
    <div class="areas-cloud">
      ${areasHTML}
    </div>
  </section>
  ` : ''}
${testimonials.length > 0 ? `
  <section>
    <div class="section-header">
      <span class="section-label">Reviews</span>
      <h2 class="section-title">What Clients Say</h2>
    </div>
    <div class="testimonials-grid">
      ${testimonialsHTML}
    </div>
  </section>
  ` : ''}
${certifications.length > 0 ? `
  <section>
    <div class="section-header">
      <span class="section-label">Credentials</span>
      <h2 class="section-title">Certifications & Memberships</h2>
    </div>
    <div class="certs-grid">
      ${certificationsHTML}
    </div>
  </section>
  ` : ''}
  <section>
    <div class="contact-section">
      <h2 class="section-title">Ready to Find Your Dream Home?</h2>
      <p class="section-subtitle">Let's discuss your real estate needs</p>
  <div class="contact-info-grid">
    <div class="contact-info-item">
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
      </svg>
      <strong>Phone</strong>
      <a href="tel:${phone.replace(/\s/g, '')}" data-editable="phone">${phone}</a>
    </div>
    
    <div class="contact-info-item">
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      <strong>Email</strong>
      <a href="mailto:${email}" data-editable="email">${email}</a>
    </div>
    
    <div class="contact-info-item">
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
      <strong>Office</strong>
      <span data-editable="officeAddress">${officeAddress}</span>
    </div>
  </div>
  
  ${socialLinks.length > 0 ? `
  <div class="social-links">
    ${socialHTML}
  </div>
  ` : ''}
</div>
  </section>
  <footer class="footer">
    <p>
      <span data-editable="agentName">${agentName}</span> • 
      <span data-editable="licenseNumber">${licenseNumber}</span> • 
      <span data-editable="brokerage">${brokerage}</span>
    </p>
    <p style="margin-top: 8px; font-size: 12px;">
      © ${new Date().getFullYear()} All rights reserved
    </p>
  </footer>
</body>
</html>`;
}
