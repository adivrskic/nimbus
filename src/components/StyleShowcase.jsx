import React, { useState, useEffect, useRef } from 'react';
import { Feather, Zap, Sparkles, BookOpen, Palette, Shapes, Monitor, Tablet, Smartphone, Cloud, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './StyleShowcase.scss';

const styles = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean lines and thoughtful whitespace',
    icon: <Feather size={20} />,
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Bold typography and raw aesthetics',
    icon: <Zap size={20} />,
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Smooth colors and soft edges',
    icon: <Sparkles size={20} />,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and timeless',
    icon: <BookOpen size={20} />,
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    description: 'Vibrant 80s inspired design',
    icon: <Palette size={20} />,
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass and depth',
    icon: <Shapes size={20} />,
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    description: 'Soft shadows and subtle depth',
    icon: <Cloud size={20} />,
  },
];

// Comprehensive theme configurations for each style
const styleThemes = {
  minimal: {
    light: {
      bg: 'rgba(59, 130, 246, 0.03)',
      surface: 'rgba(59, 130, 246, 0.05)',
      border: 'rgba(59, 130, 246, 0.15)',
      text: '#1e40af',
      textSecondary: '#3b82f6',
      accent: '#2563eb',
    },
    dark: {
      bg: 'rgba(59, 130, 246, 0.12)',
      surface: 'rgba(59, 130, 246, 0.15)',
      border: 'rgba(59, 130, 246, 0.25)',
      text: '#93c5fd',
      textSecondary: '#60a5fa',
      accent: '#3b82f6',
    }
  },
  brutalist: {
    light: {
      bg: 'rgba(239, 68, 68, 0.04)',
      surface: 'rgba(239, 68, 68, 0.06)',
      border: 'rgba(239, 68, 68, 0.2)',
      text: '#991b1b',
      textSecondary: '#dc2626',
      accent: '#ef4444',
    },
    dark: {
      bg: 'rgba(239, 68, 68, 0.12)',
      surface: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#fca5a5',
      textSecondary: '#f87171',
      accent: '#ef4444',
    }
  },
  gradient: {
    light: {
      bg: 'rgba(147, 51, 234, 0.04)',
      surface: 'rgba(147, 51, 234, 0.06)',
      border: 'rgba(147, 51, 234, 0.2)',
      text: '#6b21a8',
      textSecondary: '#9333ea',
      accent: '#a855f7',
    },
    dark: {
      bg: 'rgba(147, 51, 234, 0.12)',
      surface: 'rgba(147, 51, 234, 0.15)',
      border: 'rgba(147, 51, 234, 0.3)',
      text: '#d8b4fe',
      textSecondary: '#c084fc',
      accent: '#a855f7',
    }
  },
  elegant: {
    light: {
      bg: 'rgba(168, 139, 95, 0.04)',
      surface: 'rgba(168, 139, 95, 0.06)',
      border: 'rgba(168, 139, 95, 0.2)',
      text: '#78350f',
      textSecondary: '#a16207',
      accent: '#ca8a04',
    },
    dark: {
      bg: 'rgba(168, 139, 95, 0.12)',
      surface: 'rgba(168, 139, 95, 0.15)',
      border: 'rgba(168, 139, 95, 0.3)',
      text: '#fde68a',
      textSecondary: '#fbbf24',
      accent: '#f59e0b',
    }
  },
  retro: {
    light: {
      bg: 'rgba(236, 72, 153, 0.05)',
      surface: 'rgba(236, 72, 153, 0.07)',
      border: 'rgba(236, 72, 153, 0.2)',
      text: '#9f1239',
      textSecondary: '#e11d48',
      accent: '#ec4899',
    },
    dark: {
      bg: 'rgba(236, 72, 153, 0.12)',
      surface: 'rgba(236, 72, 153, 0.15)',
      border: 'rgba(236, 72, 153, 0.3)',
      text: '#fbcfe8',
      textSecondary: '#f9a8d4',
      accent: '#ec4899',
    }
  },
  glassmorphism: {
    light: {
      bg: 'rgba(99, 102, 241, 0.04)',
      surface: 'rgba(99, 102, 241, 0.06)',
      border: 'rgba(99, 102, 241, 0.2)',
      text: '#3730a3',
      textSecondary: '#4f46e5',
      accent: '#6366f1',
    },
    dark: {
      bg: 'rgba(99, 102, 241, 0.12)',
      surface: 'rgba(99, 102, 241, 0.15)',
      border: 'rgba(99, 102, 241, 0.3)',
      text: '#c7d2fe',
      textSecondary: '#a5b4fc',
      accent: '#6366f1',
    }
  },
  neumorphism: {
    light: {
      bg: 'rgba(14, 165, 233, 0.03)',
      surface: 'rgba(14, 165, 233, 0.05)',
      border: 'rgba(14, 165, 233, 0.15)',
      text: '#075985',
      textSecondary: '#0284c7',
      accent: '#0ea5e9',
    },
    dark: {
      bg: 'rgba(14, 165, 233, 0.12)',
      surface: 'rgba(14, 165, 233, 0.15)',
      border: 'rgba(14, 165, 233, 0.25)',
      text: '#7dd3fc',
      textSecondary: '#38bdf8',
      accent: '#0ea5e9',
    }
  },
};

// Get the current theme colors
const getStyleTheme = (styleId, mode) => {
  return styleThemes[styleId][mode];
};
// Generate custom preview HTML for each design style
const generatePreviewHTML = (styleId, mode) => {
  const generators = {
    minimal: generateMinimalHTML,
    brutalist: generateBrutalistHTML,
    gradient: generateGradientHTML,
    elegant: generateElegantHTML,
    retro: generateRetroHTML,
    glassmorphism: generateGlassmorphismHTML,
    neumorphism: generateNeumorphismHTML,
  };

  return generators[styleId]?.(mode) || generators.minimal(mode);
};

// MINIMAL STYLE
const generateMinimalHTML = (mode) => {
  const isDark = mode === 'dark';
  const bg = isDark ? '#0a0a0a' : '#ffffff';
  const text = isDark ? '#ffffff' : '#0a0a0a';
  const textSecondary = isDark ? '#a0a0a0' : '#666666';
  const accent = isDark ? '#3b82f6' : '#2563eb';
  const border = isDark ? '#1f1f1f' : '#e5e5e5';
  const surface = isDark ? '#141414' : '#fafafa';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:${bg};color:${text};line-height:1.6}
.container{max-width:1200px;margin:0 auto;padding:0 2rem}
@media(max-width:768px){.container{padding:0 1.5rem}}

/* Header */
header{padding:1.5rem 0;border-bottom:1px solid ${border}}
.nav{display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:600;font-size:1.125rem;letter-spacing:-0.02em}
.nav-links{display:flex;gap:2rem;list-style:none}
.nav-link{color:${textSecondary};text-decoration:none;font-size:0.875rem;transition:color 0.2s}
.nav-link:hover{color:${text}}
@media(max-width:640px){.nav-links{display:none}}

/* Hero */
.hero{padding:8rem 0 6rem;text-align:center}
@media(max-width:768px){.hero{padding:5rem 0 4rem}}
h1{font-size:clamp(2.5rem,7vw,5rem);font-weight:700;line-height:1.1;letter-spacing:-0.03em;margin-bottom:1.5rem}
.hero p{font-size:1.125rem;color:${textSecondary};max-width:600px;margin:0 auto 3rem;line-height:1.8}
.cta-group{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{padding:1rem 2rem;border-radius:8px;text-decoration:none;font-weight:500;transition:all 0.2s;display:inline-block}
.btn-primary{background:${accent};color:white}
.btn-primary:hover{transform:translateY(-2px);opacity:0.9}
.btn-secondary{border:1px solid ${border};color:${text}}
.btn-secondary:hover{background:${surface}}
@media(max-width:640px){.cta-group{flex-direction:column;max-width:300px;margin:0 auto}.btn{width:100%}}

/* Stats */
.stats{padding:4rem 0;background:${surface};border-top:1px solid ${border};border-bottom:1px solid ${border}}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3rem;text-align:center}
@media(max-width:768px){.stats-grid{grid-template-columns:1fr;gap:2rem}}
.stat h3{font-size:2.5rem;font-weight:700;margin-bottom:0.5rem;color:${accent}}
.stat p{color:${textSecondary};font-size:0.875rem}

/* Features */
.features{padding:6rem 0}
.section-title{font-size:clamp(2rem,5vw,3rem);font-weight:700;text-align:center;margin-bottom:1rem;letter-spacing:-0.02em}
.section-desc{text-align:center;color:${textSecondary};max-width:600px;margin:0 auto 4rem;font-size:1.125rem}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem}
@media(max-width:768px){.features-grid{grid-template-columns:1fr;gap:1.5rem}}
.feature-card{padding:2rem;border-radius:12px;border:1px solid ${border};transition:all 0.3s}
.feature-card:hover{border-color:${accent};transform:translateY(-4px)}
.feature-icon{width:48px;height:48px;background:${accent};border-radius:8px;margin-bottom:1.5rem;opacity:0.1}
.feature-card h3{font-size:1.25rem;font-weight:600;margin-bottom:0.75rem}
.feature-card p{color:${textSecondary};line-height:1.7;font-size:0.9375rem}

/* Testimonial */
.testimonial{padding:6rem 0;background:${surface};text-align:center}
.quote{font-size:1.5rem;line-height:1.8;max-width:800px;margin:0 auto 2rem;font-weight:500;color:${text}}
@media(max-width:768px){.quote{font-size:1.25rem}}
.author{display:flex;align-items:center;justify-content:center;gap:1rem}
.avatar{width:48px;height:48px;border-radius:50%;background:${accent};opacity:0.2}
.author-info h4{font-weight:600;margin-bottom:0.25rem}
.author-info p{color:${textSecondary};font-size:0.875rem}

/* Footer */
footer{padding:3rem 0;border-top:1px solid ${border};text-align:center;color:${textSecondary};font-size:0.875rem}
</style></head><body>
<header><div class="container"><nav class="nav">
<div class="logo">MINIMAL</div>
<ul class="nav-links">
<li><a class="nav-link" href="#">Product</a></li>
<li><a class="nav-link" href="#">Features</a></li>
<li><a class="nav-link" href="#">About</a></li>
</ul>
</nav></div></header>

<main>
<section class="hero"><div class="container">
<h1>Less is More</h1>
<p>Clean design, thoughtful whitespace, and perfect typography. Focus on what matters with minimal distractions.</p>
<div class="cta-group">
<a class="btn btn-primary" href="#">Get Started</a>
<a class="btn btn-secondary" href="#">Learn More</a>
</div>
</div></section>

<section class="stats"><div class="container">
<div class="stats-grid">
<div class="stat"><h3>99.9%</h3><p>Uptime Guarantee</p></div>
<div class="stat"><h3>50K+</h3><p>Active Users</p></div>
<div class="stat"><h3>4.9</h3><p>User Rating</p></div>
</div>
</div></section>

<section class="features"><div class="container">
<h2 class="section-title">Built for Simplicity</h2>
<p class="section-desc">Everything you need, nothing you don't</p>
<div class="features-grid">
<div class="feature-card">
<div class="feature-icon"></div>
<h3>Clean Interface</h3>
<p>Intuitive design that gets out of your way and lets you focus on your work.</p>
</div>
<div class="feature-card">
<div class="feature-icon"></div>
<h3>Fast Performance</h3>
<p>Optimized for speed with zero bloat. Every millisecond counts.</p>
</div>
<div class="feature-card">
<div class="feature-icon"></div>
<h3>Responsive Design</h3>
<p>Perfectly adapted for every screen size, from mobile to desktop.</p>
</div>
</div>
</div></section>

<section class="testimonial"><div class="container">
<p class="quote">"The most elegant solution I've found. Nothing unnecessary, everything essential."</p>
<div class="author">
<div class="avatar"></div>
<div class="author-info">
<h4>Sarah Chen</h4>
<p>Product Designer</p>
</div>
</div>
</div></section>
</main>

<footer><div class="container">
<p>© 2024 Minimal. All rights reserved.</p>
</div></footer>
</body></html>`;
};

// BRUTALIST STYLE
const generateBrutalistHTML = (mode) => {
  const isDark = mode === 'dark';
  const bg = isDark ? '#000000' : '#ffffff';
  const text = isDark ? '#ffffff' : '#000000';
  const accent = isDark ? '#00ff00' : '#ff0000';
  const accent2 = isDark ? '#00ffff' : '#0000ff';
  
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Arial Black',sans-serif;background:${bg};color:${text};line-height:1.4;overflow-x:hidden}
.container{max-width:1400px;margin:0 auto;padding:0 2rem}

/* Header */
header{padding:2rem 0;border-bottom:4px solid ${text}}
.nav{display:flex;justify-content:space-between;align-items:center}
.logo{font-size:2rem;text-transform:uppercase;letter-spacing:2px}
.nav-links{display:flex;gap:3rem;list-style:none;font-size:1.125rem}
.nav-link{color:${text};text-decoration:none;text-transform:uppercase;transition:all 0.1s}
.nav-link:hover{background:${text};color:${bg};padding:0.25rem 0.5rem}
@media(max-width:768px){.nav-links{display:none}}

/* Hero */
.hero{padding:6rem 0;position:relative}
.hero h1{font-size:clamp(3rem,10vw,8rem);line-height:0.9;text-transform:uppercase;margin-bottom:2rem;letter-spacing:-0.02em}
.highlight{background:${accent};color:${bg};padding:0 0.5rem;display:inline-block;transform:rotate(-1deg)}
.hero p{font-family:Arial,sans-serif;font-size:1.5rem;max-width:600px;margin-bottom:3rem;line-height:1.6}
.btn{display:inline-block;padding:1.5rem 3rem;background:${text};color:${bg};text-decoration:none;text-transform:uppercase;font-size:1.125rem;border:4px solid ${text};transition:all 0.1s;margin-right:1rem;margin-bottom:1rem}
.btn:hover{background:${bg};color:${text}}
.btn-outline{background:${bg};color:${text}}
.btn-outline:hover{background:${text};color:${bg}}

/* Grid Section */
.grid-section{padding:6rem 0;background:${text};color:${bg}}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
@media(max-width:1024px){.grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.grid{grid-template-columns:1fr}}
.grid-item{padding:3rem;border:3px solid ${bg};min-height:250px;display:flex;flex-direction:column;justify-content:center}
.grid-item:nth-child(2){background:${accent};color:${bg}}
.grid-item:nth-child(3){background:${accent2};color:${bg}}
.grid-item h3{font-size:2rem;margin-bottom:1rem;text-transform:uppercase}
.grid-item p{font-family:Arial,sans-serif;font-size:1.125rem;line-height:1.5}

/* Statement Section */
.statement{padding:8rem 0;text-align:center}
.statement h2{font-size:clamp(2.5rem,8vw,6rem);line-height:1.1;text-transform:uppercase;margin-bottom:2rem}
.underline{border-bottom:6px solid ${accent};display:inline-block}

/* Feature Boxes */
.features{padding:6rem 0}
.feature-boxes{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem}
.feature-box{background:${bg};border:4px solid ${text};padding:3rem;transition:all 0.2s}
.feature-box:hover{transform:translate(-4px,-4px);box-shadow:8px 8px 0 ${text}}
.feature-box h3{font-size:1.75rem;margin-bottom:1.5rem;text-transform:uppercase}
.feature-box p{font-family:Arial,sans-serif;font-size:1.125rem;line-height:1.6}

/* CTA */
.cta{padding:8rem 0;background:${accent};color:${bg};text-align:center}
.cta h2{font-size:clamp(2.5rem,7vw,5rem);text-transform:uppercase;margin-bottom:2rem}
.cta p{font-family:Arial,sans-serif;font-size:1.5rem;margin-bottom:3rem}
.cta .btn{background:${bg};color:${accent};border-color:${bg}}
.cta .btn:hover{background:transparent;color:${bg};border-color:${bg}}

/* Footer */
footer{padding:4rem 0;border-top:4px solid ${text};text-align:center}
footer p{font-family:Arial,sans-serif;font-size:1.25rem;text-transform:uppercase}
</style></head><body>
<header><div class="container"><nav class="nav">
<div class="logo">BRUTAL</div>
<ul class="nav-links">
<li><a class="nav-link" href="#">Work</a></li>
<li><a class="nav-link" href="#">About</a></li>
<li><a class="nav-link" href="#">Contact</a></li>
</ul>
</nav></div></header>

<main>
<section class="hero"><div class="container">
<h1><span class="highlight">BOLD</span><br>DESIGN<br>MATTERS</h1>
<p>Raw aesthetics. Uncompromising typography. Maximum impact. This is design stripped to its essence.</p>
<a class="btn" href="#">START NOW</a>
<a class="btn btn-outline" href="#">VIEW WORK</a>
</div></section>

<section class="grid-section">
<div class="grid">
<div class="grid-item">
<h3>01</h3>
<p>Powerful typography that commands attention</p>
</div>
<div class="grid-item">
<h3>02</h3>
<p>Contrast-driven layouts that make a statement</p>
</div>
<div class="grid-item">
<h3>03</h3>
<p>Unapologetic design choices</p>
</div>
<div class="grid-item">
<h3>04</h3>
<p>Function over form, always</p>
</div>
</div>
</section>

<section class="statement"><div class="container">
<h2>DESIGN IS<br><span class="underline">COMMUNICATION</span></h2>
</div></section>

<section class="features"><div class="container">
<div class="feature-boxes">
<div class="feature-box">
<h3>NO NONSENSE</h3>
<p>Every element serves a purpose. No decoration for decoration's sake.</p>
</div>
<div class="feature-box">
<h3>MAXIMUM IMPACT</h3>
<p>Bold choices that demand attention and refuse to be ignored.</p>
</div>
<div class="feature-box">
<h3>RAW HONESTY</h3>
<p>Transparent, authentic design that speaks truth to power.</p>
</div>
</div>
</div></section>

<section class="cta">
<div class="container">
<h2>READY TO GO BOLD?</h2>
<p>Join the revolution</p>
<a class="btn" href="#">GET STARTED</a>
</div>
</section>
</main>

<footer><div class="container">
<p>© 2024 BRUTAL DESIGN CO.</p>
</div></footer>
</body></html>`;
};

// GRADIENT STYLE
const generateGradientHTML = (mode) => {
  const isDark = mode === 'dark';
  const bg = isDark ? '#0a0a1f' : '#ffffff';
  const text = isDark ? '#ffffff' : '#1a1a2e';
  const textSecondary = isDark ? '#a0a0c0' : '#6b7280';
  
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:${bg};color:${text};line-height:1.6;overflow-x:hidden}
.container{max-width:1200px;margin:0 auto;padding:0 2rem}
@media(max-width:768px){.container{padding:0 1.5rem}}

/* Header */
header{padding:1.5rem 0;backdrop-filter:blur(10px);position:sticky;top:0;z-index:100;background:${isDark ? 'rgba(10,10,31,0.8)' : 'rgba(255,255,255,0.8)'}}
.nav{display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:700;font-size:1.25rem;background:linear-gradient(135deg,#667eea,#764ba2,#f093fb);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:2rem;list-style:none}
.nav-link{color:${textSecondary};text-decoration:none;font-size:0.9375rem;transition:all 0.3s;font-weight:500}
.nav-link:hover{color:${text}}
@media(max-width:640px){.nav-links{display:none}}

/* Hero */
.hero{padding:8rem 0;text-align:center;position:relative}
@media(max-width:768px){.hero{padding:5rem 0}}
.badge{display:inline-block;padding:0.5rem 1.25rem;background:linear-gradient(135deg,rgba(102,126,234,0.1),rgba(118,75,162,0.1));border-radius:999px;margin-bottom:2rem;font-size:0.875rem;font-weight:600;color:${text}}
h1{font-size:clamp(2.5rem,8vw,5.5rem);font-weight:800;line-height:1.1;margin-bottom:1.5rem;letter-spacing:-0.02em}
.gradient-text{background:linear-gradient(135deg,#667eea,#764ba2,#f093fb);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradient 8s ease infinite;background-size:200% 200%}
@keyframes gradient{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}
.hero p{font-size:1.25rem;color:${textSecondary};max-width:650px;margin:0 auto 3rem;line-height:1.8}
.cta-group{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{padding:1.125rem 2.5rem;border-radius:999px;text-decoration:none;font-weight:600;transition:all 0.3s;display:inline-block;font-size:1rem}
.btn-primary{background:linear-gradient(135deg,#667eea,#764ba2);color:white;box-shadow:0 10px 30px rgba(102,126,234,0.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 15px 40px rgba(102,126,234,0.4)}
.btn-secondary{background:${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};color:${text};border:2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}}
.btn-secondary:hover{background:${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}
@media(max-width:640px){.cta-group{flex-direction:column;max-width:300px;margin:0 auto}}

/* Features */
.features{padding:8rem 0}
@media(max-width:768px){.features{padding:5rem 0}}
.section-title{font-size:clamp(2rem,5vw,3.5rem);font-weight:800;text-align:center;margin-bottom:1rem;letter-spacing:-0.02em}
.section-desc{text-align:center;color:${textSecondary};max-width:600px;margin:0 auto 5rem;font-size:1.125rem}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem}
@media(max-width:768px){.features-grid{grid-template-columns:1fr}}
.feature-card{padding:2.5rem;border-radius:24px;background:${isDark ? 'linear-gradient(135deg,rgba(102,126,234,0.05),rgba(118,75,162,0.05))' : 'linear-gradient(135deg,rgba(102,126,234,0.03),rgba(118,75,162,0.03))'};border:1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};transition:all 0.3s}
.feature-card:hover{transform:translateY(-8px);box-shadow:0 20px 60px ${isDark ? 'rgba(102,126,234,0.2)' : 'rgba(102,126,234,0.15)'}}
.feature-icon{width:56px;height:56px;border-radius:16px;background:linear-gradient(135deg,#667eea,#764ba2);margin-bottom:1.5rem;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:700}
.feature-card h3{font-size:1.375rem;font-weight:700;margin-bottom:1rem}
.feature-card p{color:${textSecondary};line-height:1.7;font-size:1rem}

/* Stats */
.stats{padding:6rem 0;background:linear-gradient(135deg,rgba(102,126,234,0.1),rgba(240,147,251,0.1));border-radius:32px;margin:4rem 0}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3rem;text-align:center}
@media(max-width:768px){.stats-grid{grid-template-columns:1fr;gap:2rem}}
.stat-number{font-size:3.5rem;font-weight:800;margin-bottom:0.5rem;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat-label{color:${textSecondary};font-size:1rem;font-weight:500}

/* CTA */
.cta{padding:8rem 0;text-align:center}
@media(max-width:768px){.cta{padding:5rem 0}}
.cta-box{background:linear-gradient(135deg,#667eea,#764ba2);border-radius:32px;padding:5rem 2rem;color:white}
.cta h2{font-size:clamp(2rem,6vw,4rem);font-weight:800;margin-bottom:1rem}
.cta p{font-size:1.25rem;margin-bottom:2.5rem;opacity:0.9}
.cta .btn{background:white;color:#667eea}
.cta .btn:hover{transform:scale(1.05)}

/* Footer */
footer{padding:3rem 0;text-align:center;color:${textSecondary};font-size:0.9375rem}
</style></head><body>
<header><div class="container"><nav class="nav">
<div class="logo">GRADIENT</div>
<ul class="nav-links">
<li><a class="nav-link" href="#">Features</a></li>
<li><a class="nav-link" href="#">Pricing</a></li>
<li><a class="nav-link" href="#">About</a></li>
</ul>
</nav></div></header>

<main>
<section class="hero"><div class="container">
<div class="badge">✨ New Features Available</div>
<h1>Design with <span class="gradient-text">Beautiful Gradients</span></h1>
<p>Experience the power of smooth color transitions and modern aesthetics that bring your content to life.</p>
<div class="cta-group">
<a class="btn btn-primary" href="#">Start Free Trial</a>
<a class="btn btn-secondary" href="#">Watch Demo</a>
</div>
</div></section>

<section class="features"><div class="container">
<h2 class="section-title">Everything You Need</h2>
<p class="section-desc">Powerful features wrapped in beautiful design</p>
<div class="features-grid">
<div class="feature-card">
<div class="feature-icon">⚡</div>
<h3>Lightning Fast</h3>
<p>Optimized performance with smooth animations and instant interactions.</p>
</div>
<div class="feature-card">
<div class="feature-icon">🎨</div>
<h3>Modern Design</h3>
<p>Beautiful gradients and smooth transitions that delight users.</p>
</div>
<div class="feature-card">
<div class="feature-icon">📱</div>
<h3>Fully Responsive</h3>
<p>Perfect experience on every device, from mobile to desktop.</p>
</div>
</div>

<div class="stats">
<div class="stats-grid">
<div class="stat">
<div class="stat-number">98%</div>
<div class="stat-label">Customer Satisfaction</div>
</div>
<div class="stat">
<div class="stat-number">100K+</div>
<div class="stat-label">Active Users</div>
</div>
<div class="stat">
<div class="stat-number">4.9</div>
<div class="stat-label">Average Rating</div>
</div>
</div>
</div>

</div></section>

<section class="cta"><div class="container">
<div class="cta-box">
<h2>Ready to Get Started?</h2>
<p>Join thousands of satisfied customers today</p>
<a class="btn" href="#">Start Your Journey</a>
</div>
</div></section>
</main>

<footer><div class="container">
<p>© 2024 Gradient. Designed with passion.</p>
</div></footer>
</body></html>`;
};

// ELEGANT STYLE
const generateElegantHTML = (mode) => {
  const isDark = mode === 'dark';
  const bg = isDark ? '#1a1a1a' : '#faf9f7';
  const text = isDark ? '#f5f5f5' : '#2a2a2a';
  const textSecondary = isDark ? '#a0a0a0' : '#6b6b6b';
  const accent = isDark ? '#d4af76' : '#a78b5f';
  const surface = isDark ? '#242424' : '#ffffff';
  const border = isDark ? '#333333' : '#e8e6e3';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Lato',sans-serif;background:${bg};color:${text};line-height:1.8;font-weight:300}
.container{max-width:1100px;margin:0 auto;padding:0 2rem}
h1,h2,h3{font-family:'Playfair Display',serif;font-weight:600;letter-spacing:-0.01em}

/* Header */
header{padding:2rem 0;border-bottom:1px solid ${border}}
.nav{display:flex;justify-content:space-between;align-items:center}
.logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:600;color:${accent}}
.nav-links{display:flex;gap:3rem;list-style:none}
.nav-link{color:${textSecondary};text-decoration:none;font-size:0.9375rem;letter-spacing:0.5px;transition:color 0.3s}
.nav-link:hover{color:${accent}}
@media(max-width:768px){.nav-links{display:none}}

/* Hero */
.hero{padding:8rem 0;text-align:center}
@media(max-width:768px){.hero{padding:5rem 0}}
.eyebrow{color:${accent};font-size:0.875rem;letter-spacing:2px;text-transform:uppercase;margin-bottom:1.5rem;font-weight:400}
h1{font-size:clamp(2.5rem,7vw,5rem);line-height:1.2;margin-bottom:2rem;color:${text}}
.hero p{font-size:1.125rem;color:${textSecondary};max-width:680px;margin:0 auto 3rem;line-height:1.9}
.cta-group{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap}
.btn{padding:1rem 2.5rem;text-decoration:none;font-size:0.9375rem;letter-spacing:0.5px;transition:all 0.3s;display:inline-block;border:1px solid ${border}}
.btn-primary{background:${accent};color:${isDark ? '#1a1a1a' : '#ffffff'};border-color:${accent}}
.btn-primary:hover{background:transparent;color:${accent}}
.btn-secondary{background:transparent;color:${text}}
.btn-secondary:hover{background:${surface};border-color:${accent}}
@media(max-width:640px){.cta-group{flex-direction:column;max-width:300px;margin:0 auto}.btn{width:100%}}

/* Quote */
.quote-section{padding:6rem 0;background:${surface};border-top:1px solid ${border};border-bottom:1px solid ${border}}
.quote{font-family:'Playfair Display',serif;font-size:clamp(1.5rem,3vw,2.25rem);line-height:1.6;max-width:800px;margin:0 auto;text-align:center;font-style:italic;color:${text}}
.quote-author{margin-top:2rem;text-align:center;color:${textSecondary};font-size:1rem;letter-spacing:1px}

/* Features */
.features{padding:8rem 0}
@media(max-width:768px){.features{padding:5rem 0}}
.section-header{text-align:center;margin-bottom:6rem}
.section-header h2{font-size:clamp(2rem,5vw,3rem);margin-bottom:1rem}
.section-header p{color:${textSecondary};font-size:1.125rem;max-width:600px;margin:0 auto}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:4rem 3rem}
@media(max-width:768px){.features-grid{grid-template-columns:1fr;gap:3rem}}
.feature{text-align:center}
.feature-number{color:${accent};font-family:'Playfair Display',serif;font-size:3rem;margin-bottom:1.5rem;font-weight:400}
.feature h3{font-size:1.5rem;margin-bottom:1rem}
.feature p{color:${textSecondary};line-height:1.9;font-size:1rem}

/* Gallery */
.gallery{padding:8rem 0;background:${surface}}
@media(max-width:768px){.gallery{padding:5rem 0}}
.gallery h2{text-align:center;font-size:clamp(2rem,5vw,3rem);margin-bottom:4rem}
.gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
@media(max-width:768px){.gallery-grid{grid-template-columns:1fr}}
.gallery-item{aspect-ratio:4/3;background:${accent};opacity:0.15;transition:opacity 0.3s}
.gallery-item:hover{opacity:0.3}

/* CTA */
.cta{padding:8rem 0;text-align:center}
@media(max-width:768px){.cta{padding:5rem 0}}
.cta h2{font-size:clamp(2rem,6vw,3.5rem);margin-bottom:1.5rem}
.cta p{font-size:1.125rem;color:${textSecondary};margin-bottom:3rem;max-width:600px;margin-left:auto;margin-right:auto}

/* Footer */
footer{padding:4rem 0;border-top:1px solid ${border};text-align:center}
.footer-content{color:${textSecondary};font-size:0.9375rem;letter-spacing:0.5px}
.footer-links{display:flex;gap:2rem;justify-content:center;margin-bottom:2rem;list-style:none}
.footer-link{color:${textSecondary};text-decoration:none;transition:color 0.3s}
.footer-link:hover{color:${accent}}
</style></head><body>
<header><div class="container"><nav class="nav">
<div class="logo">MAISON</div>
<ul class="nav-links">
<li><a class="nav-link" href="#">Collections</a></li>
<li><a class="nav-link" href="#">About</a></li>
<li><a class="nav-link" href="#">Contact</a></li>
</ul>
</nav></div></header>

<main>
<section class="hero"><div class="container">
<div class="eyebrow">Timeless Design</div>
<h1>Sophisticated Elegance</h1>
<p>Where classic refinement meets contemporary sensibility. Experience design that transcends trends and embraces timeless beauty.</p>
<div class="cta-group">
<a class="btn btn-primary" href="#">Explore Collection</a>
<a class="btn btn-secondary" href="#">Learn More</a>
</div>
</div></section>

<section class="quote-section"><div class="container">
<p class="quote">"Elegance is not standing out, but being remembered."</p>
<p class="quote-author">— Giorgio Armani</p>
</div></section>

<section class="features"><div class="container">
<div class="section-header">
<h2>Our Philosophy</h2>
<p>Crafted with care, designed for longevity</p>
</div>
<div class="features-grid">
<div class="feature">
<div class="feature-number">01</div>
<h3>Timeless Quality</h3>
<p>Every element carefully considered and refined to stand the test of time.</p>
</div>
<div class="feature">
<div class="feature-number">02</div>
<h3>Refined Details</h3>
<p>Attention to subtlety and nuance that elevates the entire experience.</p>
</div>
<div class="feature">
<div class="feature-number">03</div>
<h3>Classic Appeal</h3>
<p>Sophisticated aesthetics that never go out of style.</p>
</div>
</div>
</div></section>

<section class="gallery"><div class="container">
<h2>Featured Works</h2>
<div class="gallery-grid">
<div class="gallery-item"></div>
<div class="gallery-item"></div>
<div class="gallery-item"></div>
<div class="gallery-item"></div>
</div>
</div></section>

<section class="cta"><div class="container">
<h2>Begin Your Journey</h2>
<p>Discover a world of timeless elegance and sophisticated design</p>
<a class="btn btn-primary" href="#">Get Started</a>
</div></section>
</main>

<footer><div class="container">
<ul class="footer-links">
<li><a class="footer-link" href="#">Privacy</a></li>
<li><a class="footer-link" href="#">Terms</a></li>
<li><a class="footer-link" href="#">Contact</a></li>
</ul>
<p class="footer-content">© 2024 Maison. All rights reserved.</p>
</div></footer>
</body></html>`;
};

// RETRO STYLE  
const generateRetroHTML = (mode) => {
  const isDark = mode === 'dark';
  const bg = isDark ? '#0d001a' : '#fff5fd';
  const text = isDark ? '#ffffff' : '#1a0033';
  const accent1 = isDark ? '#ff2fb5' : '#e91e8c';
  const accent2 = isDark ? '#00f5ff' : '#00d9ff';
  const accent3 = isDark ? '#b537f2' : '#9d28d9';
  const surface = isDark ? '#1a0028' : '#ffe6f9';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Space Mono',monospace;background:${bg};color:${text};line-height:1.6;overflow-x:hidden}
.container{max-width:1200px;margin:0 auto;padding:0 2rem}

/* Retro Grid Background */
body::before{content:'';position:fixed;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(${isDark ? 'rgba(255,47,181,0.03)' : 'rgba(233,30,140,0.05)'} 2px,transparent 2px),linear-gradient(90deg,${isDark ? 'rgba(255,47,181,0.03)' : 'rgba(233,30,140,0.05)'} 2px,transparent 2px);background-size:50px 50px;pointer-events:none;z-index:0}
main{position:relative;z-index:1}

/* Header */
header{padding:1.5rem 0;backdrop-filter:blur(10px);border-bottom:3px solid ${accent1};position:sticky;top:0;z-index:100}
.nav{display:flex;justify-content:space-between;align-items:center}
.logo{font-size:1.5rem;font-weight:700;background:linear-gradient(90deg,${accent1},${accent2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 30px ${accent1}}
.nav-links{display:flex;gap:2rem;list-style:none}
.nav-link{color:${text};text-decoration:none;font-size:0.875rem;transition:all 0.3s;text-transform:uppercase;letter-spacing:1px}
.nav-link:hover{color:${accent1};text-shadow:0 0 10px ${accent1}}
@media(max-width:768px){.nav-links{display:none}}

/* Hero */
.hero{padding:8rem 0;text-align:center;position:relative}
@media(max-width:768px){.hero{padding:5rem 0}}
.glitch{font-size:clamp(2.5rem,10vw,6rem);font-weight:700;line-height:1;margin-bottom:2rem;position:relative;text-transform:uppercase;letter-spacing:2px}
.glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%}
.glitch::before{animation:glitch1 2s infinite;color:${accent1};z-index:-1}
.glitch::after{animation:glitch2 3s infinite;color:${accent2};z-index:-2}
@keyframes glitch1{0%,100%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(-2px,-2px)}60%{transform:translate(2px,2px)}80%{transform:translate(2px,-2px)}}
@keyframes glitch2{0%,100%{transform:translate(0)}20%{transform:translate(2px,-2px)}40%{transform:translate(2px,2px)}60%{transform:translate(-2px,-2px)}80%{transform:translate(-2px,2px)}}
.gradient-text{background:linear-gradient(90deg,${accent1},${accent2},${accent3});-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glow 2s ease-in-out infinite alternate}
@keyframes glow{from{filter:drop-shadow(0 0 10px ${accent1})}to{filter:drop-shadow(0 0 30px ${accent2})}}
.hero p{font-size:1.125rem;max-width:650px;margin:0 auto 3rem;line-height:1.8;color:${text}}
.cta-group{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap}
.btn{padding:1rem 2.5rem;text-decoration:none;font-weight:700;transition:all 0.3s;display:inline-block;text-transform:uppercase;letter-spacing:1px;border-radius:999px;font-size:0.9375rem}
.btn-primary{background:linear-gradient(90deg,${accent1},${accent3});color:white;box-shadow:0 0 30px ${accent1};border:2px solid ${accent1}}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 0 50px ${accent1}}
.btn-secondary{background:transparent;color:${text};border:2px solid ${accent2};box-shadow:0 0 20px ${accent2}}
.btn-secondary:hover{background:${accent2};color:${isDark ? '#0d001a' : '#fff'};box-shadow:0 0 40px ${accent2}}
@media(max-width:640px){.cta-group{flex-direction:column;max-width:300px;margin:0 auto}}

/* Features */
.features{padding:8rem 0;background:${surface};margin:4rem 0;border-top:3px solid ${accent1};border-bottom:3px solid ${accent2}}
@media(max-width:768px){.features{padding:5rem 0}}
.features h2{font-size:clamp(2rem,6vw,3.5rem);text-align:center;margin-bottom:4rem;text-transform:uppercase;letter-spacing:3px;background:linear-gradient(90deg,${accent1},${accent2});-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2rem}
@media(max-width:768px){.features-grid{grid-template-columns:1fr}}
.feature-card{padding:2rem;background:${isDark ? 'rgba(255,47,181,0.05)' : 'rgba(233,30,140,0.05)'};border:2px solid ${accent1};position:relative;transition:all 0.3s}
.feature-card::before{content:'';position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;background:linear-gradient(45deg,${accent1},${accent2},${accent3});opacity:0;transition:opacity 0.3s;z-index:-1}
.feature-card:hover{transform:translateY(-5px);box-shadow:0 10px 40px ${isDark ? 'rgba(255,47,181,0.3)' : 'rgba(233,30,140,0.2)'}}
.feature-card:hover::before{opacity:0.2}
.feature-icon{font-size:2.5rem;margin-bottom:1rem}
.feature-card h3{font-size:1.25rem;margin-bottom:1rem;text-transform:uppercase;letter-spacing:2px;color:${accent1}}
.feature-card p{line-height:1.7;font-size:0.9375rem}

/* Stats */
.stats{padding:6rem 0;text-align:center}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3rem}
@media(max-width:768px){.stats-grid{grid-template-columns:1fr;gap:2rem}}
.stat{border:3px solid ${accent2};padding:2rem;background:${isDark ? 'rgba(0,245,255,0.03)' : 'rgba(0,217,255,0.05)'};transition:all 0.3s}
.stat:hover{transform:scale(1.05);box-shadow:0 0 40px ${accent2}}
.stat-number{font-size:3rem;font-weight:700;margin-bottom:0.5rem;background:linear-gradient(90deg,${accent1},${accent2});-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat-label{text-transform:uppercase;letter-spacing:2px;font-size:0.875rem}

/* CTA */
.cta{padding:8rem 0;text-align:center;position:relative}
@media(max-width:768px){.cta{padding:5rem 0}}
.cta-box{background:linear-gradient(135deg,${accent1},${accent3});padding:5rem 2rem;border-radius:20px;box-shadow:0 20px 60px ${isDark ? 'rgba(255,47,181,0.4)' : 'rgba(233,30,140,0.3)'};color:white}
.cta h2{font-size:clamp(2rem,6vw,4rem);margin-bottom:1rem;text-transform:uppercase;letter-spacing:3px}
.cta p{font-size:1.25rem;margin-bottom:2.5rem}
.cta .btn{background:white;color:${accent1};border-color:white}
.cta .btn:hover{background:transparent;color:white;border-color:white}

/* Footer */
footer{padding:3rem 0;border-top:3px solid ${accent1};text-align:center}
footer p{font-size:0.875rem;text-transform:uppercase;letter-spacing:2px}
</style></head><body>
<header><div class="container"><nav class="nav">
<div class="logo">RETROWAVE</div>
<ul class="nav-links">
<li><a class="nav-link" href="#">Home</a></li>
<li><a class="nav-link" href="#">Gallery</a></li>
<li><a class="nav-link" href="#">Contact</a></li>
</ul>
</nav></div></header>

<main>
<section class="hero"><div class="container">
<h1 class="glitch" data-text="FUTURE"><span class="gradient-text">FUTURE</span></h1>
<h1 class="glitch" data-text="NOSTALGIA" style="margin-bottom:2rem"><span class="gradient-text">NOSTALGIA</span></h1>
<p>Where neon dreams meet digital realities. Experience the vibrant aesthetics of the 80s reimagined for tomorrow.</p>
<div class="cta-group">
<a class="btn btn-primary" href="#">Enter the Grid</a>
<a class="btn btn-secondary" href="#">Explore More</a>
</div>
</div></section>

<section class="features"><div class="container">
<h2>Power Features</h2>
<div class="features-grid">
<div class="feature-card">
<div class="feature-icon">⚡</div>
<h3>Ultra Fast</h3>
<p>Lightning speed performance that never slows down</p>
</div>
<div class="feature-card">
<div class="feature-icon">🎮</div>
<h3>Game Ready</h3>
<p>Built for the modern digital experience</p>
</div>
<div class="feature-card">
<div class="feature-icon">🌈</div>
<h3>Neon Vibes</h3>
<p>Vibrant colors that pop off the screen</p>
</div>
</div>
</div></section>

<section class="stats"><div class="container">
<div class="stats-grid">
<div class="stat">
<div class="stat-number">1985</div>
<div class="stat-label">Retro Inspired</div>
</div>
<div class="stat">
<div class="stat-number">100K</div>
<div class="stat-label">Active Users</div>
</div>
<div class="stat">
<div class="stat-number">∞</div>
<div class="stat-label">Possibilities</div>
</div>
</div>
</div></section>

<section class="cta"><div class="container">
<div class="cta-box">
<h2>Join the Wave</h2>
<p>Step into the future of retro design</p>
<a class="btn" href="#">Get Started Now</a>
</div>
</div></section>
</main>

<footer><div class="container">
<p>© 2024 Retrowave Studios</p>
</div></footer>
</body></html>`;
};

// GLASSMORPHISM STYLE
const generateGlassmorphismHTML = (mode) => {
  const isDark = mode === 'dark';
  const bgGradient = isDark 
    ? 'linear-gradient(135deg, #0f1729 0%, #1a0f2e 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';
  const text = isDark ? '#f8fafc' : '#1e293b';
  const textSecondary = isDark ? '#cbd5e1' : '#475569';

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:${bgGradient};background-attachment:fixed;color:${text};line-height:1.6;min-height:100vh}
.container{max-width:1200px;margin:0 auto;padding:0 2rem}
.glass{background:${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.25)'};backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.4)'};box-shadow:0 8px 32px 0 ${isDark ? 'rgba(0,0,0,0.37)' : 'rgba(31,38,135,0.15)'}}

/* Header */
header{padding:1.5rem 0;position:sticky;top:0;z-index:100;backdrop-filter:blur(20px);background:${isDark ? 'rgba(15,23,41,0.7)' : 'rgba(255,255,255,0.1)'}}
.nav{display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:700;font-size:1.25rem;color:${isDark ? '#fff' : '#1e293b'}}
.nav-links{display:flex;gap:2rem;list-style:none}
.nav-link{color:${textSecondary};text-decoration:none;font-size:0.9375rem;transition:all 0.3s;font-weight:500}
.nav-link:hover{color:${isDark ? '#fff' : '#1e293b'}}
@media(max-width:768px){.nav-links{display:none}}

/* Hero */
.hero{padding:8rem 0;text-align:center}
@media(max-width:768px){.hero{padding:5rem 0}}
h1{font-size:clamp(2.5rem,8vw,6rem);font-weight:800;line-height:1.1;margin-bottom:1.5rem;letter-spacing:-0.02em;color:${isDark ? '#fff' : '#1e293b'}}
.hero p{font-size:1.25rem;color:${textSecondary};max-width:700px;margin:0 auto 3rem;line-height:1.8}
.cta-group{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn{padding:1.125rem 2.5rem;border-radius:16px;text-decoration:none;font-weight:600;transition:all 0.3s;display:inline-block;font-size:1rem}
.btn-primary{background:${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)'};backdrop-filter:blur(10px);color:${isDark ? '#fff' : '#1e293b'};border:1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)'};box-shadow:0 8px 20px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(31,38,135,0.2)'}}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 12px 30px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(31,38,135,0.3)'}}
.btn-secondary{background:${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)'};backdrop-filter:blur(10px);color:${isDark ? '#fff' : '#1e293b'};border:1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}}
.btn-secondary:hover{background:${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)'}}
@media(max-width:640px){.cta-group{flex-direction:column;max-width:300px;margin:0 auto}.btn{width:100%}}

/* Cards Section */
.cards{padding:6rem 0}
@media(max-width:768px){.cards{padding:4rem 0}}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem}
@media(max-width:768px){.cards-grid{grid-template-columns:1fr}}
.card{padding:2.5rem;border-radius:24px;transition:all 0.3s}
.card:hover{transform:translateY(-8px)}
.card-icon{width:64px;height:64px;border-radius:16px;background:${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'};backdrop-filter:blur(10px);margin-bottom:1.5rem;display:flex;align-items:center;justify-content:center;font-size:1.75rem;border:1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)'}}
.card h3{font-size:1.5rem;font-weight:700;margin-bottom:1rem;color:${isDark ? '#fff' : '#1e293b'}}
.card p{color:${textSecondary};line-height:1.7;font-size:1rem}

/* Feature Section */
.feature{padding:8rem 0;text-align:center}
@media(max-width:768px){.feature{padding:5rem 0}}
.feature-box{padding:5rem 3rem;border-radius:32px;max-width:900px;margin:0 auto}
.feature h2{font-size:clamp(2rem,6vw,4rem);font-weight:800;margin-bottom:1.5rem;color:${isDark ? '#fff' : '#1e293b'}}
.feature p{font-size:1.25rem;color:${textSecondary};margin-bottom:2.5rem;line-height:1.8}

/* Stats */
.stats{padding:6rem 0;backdrop-filter:blur(20px);background:${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.1)'}}
@media(max-width:768px){.stats{padding:4rem 0}}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3rem;text-align:center}
@media(max-width:768px){.stats-grid{grid-template-columns:1fr;gap:2rem}}
.stat{padding:2rem;border-radius:20px;background:${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)'};backdrop-filter:blur(10px);border:1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)'}}
.stat-number{font-size:3rem;font-weight:800;margin-bottom:0.5rem;color:${isDark ? '#fff' : '#1e293b'}}
.stat-label{color:${textSecondary};font-size:1rem;font-weight:500}

/* Footer */
footer{padding:4rem 0;text-align:center;backdrop-filter:blur(20px);background:${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.1)'};margin-top:6rem}
footer p{color:${textSecondary};font-size:0.9375rem}
</style></head><body>
<header><div class="container"><nav class="nav">
<div class="logo">GLASS</div>
<ul class="nav-links">
<li><a class="nav-link" href="#">Features</a></li>
<li><a class="nav-link" href="#">About</a></li>
<li><a class="nav-link" href="#">Contact</a></li>
</ul>
</nav></div></header>

<main>
<section class="hero"><div class="container">
<h1>Frosted Glass Design</h1>
<p>Experience the beauty of depth and transparency with modern glassmorphism aesthetics that bring your interface to life.</p>
<div class="cta-group">
<a class="btn btn-primary" href="#">Get Started</a>
<a class="btn btn-secondary" href="#">Learn More</a>
</div>
</div></section>

<section class="cards"><div class="container">
<div class="cards-grid">
<div class="card glass">
<div class="card-icon">✨</div>
<h3>Beautiful Depth</h3>
<p>Layered transparency creates stunning visual depth that draws users in.</p>
</div>
<div class="card glass">
<div class="card-icon">🎨</div>
<h3>Modern Aesthetic</h3>
<p>Contemporary design language that feels fresh and sophisticated.</p>
</div>
<div class="card glass">
<div class="card-icon">⚡</div>
<h3>Smooth Interactions</h3>
<p>Fluid animations and transitions that delight at every touchpoint.</p>
</div>
</div>
</div></section>

<section class="stats"><div class="container">
<div class="stats-grid">
<div class="stat">
<div class="stat-number">100K+</div>
<div class="stat-label">Happy Users</div>
</div>
<div class="stat">
<div class="stat-number">4.9</div>
<div class="stat-label">Rating</div>
</div>
<div class="stat">
<div class="stat-number">99%</div>
<div class="stat-label">Satisfaction</div>
</div>
</div>
</div></section>

<section class="feature"><div class="container">
<div class="feature-box glass">
<h2>Ready to Transform?</h2>
<p>Join thousands who have elevated their design with glassmorphism</p>
<a class="btn btn-primary" href="#">Start Your Journey</a>
</div>
</div></section>
</main>

<footer><div class="container">
<p>© 2024 Glass Design System. Built with transparency.</p>
</div></footer>
</body></html>`;
};

// NEUMORPHISM STYLE
const generateNeumorphismHTML = (mode) => {
  const isDark = mode === 'dark';
  const bg = isDark ? '#1e2128' : '#e8ecf2';
  const text = isDark ? '#f0f0f0' : '#2d3142';
  const textSecondary = isDark ? '#a0a0a0' : '#6b7280';
  const accent = isDark ? '#6b8afd' : '#4c6ef5';
  
  const shadowLight = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.9)';
  const shadowDark = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.12)';
  
  const shadowOut = `${isDark ? '3px 3px 8px' : '6px 6px 12px'} ${shadowDark}, ${isDark ? '-3px -3px 8px' : '-6px -6px 12px'} ${shadowLight}`;
  const shadowIn = `inset ${isDark ? '3px 3px 8px' : '4px 4px 8px'} ${shadowDark}, inset ${isDark ? '-3px -3px 8px' : '-4px -4px 8px'} ${shadowLight}`;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:${bg};color:${text};line-height:1.6}
.container{max-width:1200px;margin:0 auto;padding:0 2rem}
@media(max-width:768px){.container{padding:0 1.5rem}}

/* Header */
header{padding:2rem 0}
.nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;border-radius:20px;box-shadow:${shadowOut}}
.logo{font-weight:700;font-size:1.25rem;color:${accent}}
.nav-links{display:flex;gap:2rem;list-style:none}
.nav-link{color:${textSecondary};text-decoration:none;font-size:0.9375rem;transition:color 0.3s;font-weight:500}
.nav-link:hover{color:${accent}}
@media(max-width:768px){.nav-links{display:none}}

/* Hero */
.hero{padding:8rem 0;text-align:center}
@media(max-width:768px){.hero{padding:5rem 0}}
.hero-content{padding:4rem 3rem;border-radius:32px;box-shadow:${shadowOut};max-width:900px;margin:0 auto}
@media(max-width:768px){.hero-content{padding:3rem 2rem}}
h1{font-size:clamp(2.5rem,7vw,5rem);font-weight:800;line-height:1.1;margin-bottom:1.5rem;letter-spacing:-0.02em}
.hero p{font-size:1.125rem;color:${textSecondary};max-width:650px;margin:0 auto 3rem;line-height:1.8}
.cta-group{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap}
.btn{padding:1.125rem 2.5rem;border-radius:16px;text-decoration:none;font-weight:600;transition:all 0.2s;display:inline-block;font-size:1rem;background:${bg};box-shadow:${shadowOut};color:${text}}
.btn:hover{box-shadow:${shadowIn}}
.btn:active{box-shadow:${shadowIn};transform:scale(0.98)}
@media(max-width:640px){.cta-group{flex-direction:column;max-width:300px;margin:0 auto}.btn{width:100%}}

/* Features */
.features{padding:8rem 0}
@media(max-width:768px){.features{padding:5rem 0}}
.features h2{font-size:clamp(2rem,5vw,3rem);text-align:center;margin-bottom:4rem;font-weight:800}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2.5rem}
@media(max-width:768px){.features-grid{grid-template-columns:1fr;gap:2rem}}
.feature-card{padding:2.5rem;border-radius:24px;box-shadow:${shadowOut};transition:all 0.3s;background:${bg}}
.feature-card:hover{box-shadow:${shadowIn}}
.feature-icon{width:64px;height:64px;border-radius:16px;background:${bg};box-shadow:${shadowOut};margin-bottom:1.5rem;display:flex;align-items:center;justify-content:center;font-size:1.75rem}
.feature-card h3{font-size:1.375rem;font-weight:700;margin-bottom:1rem;color:${accent}}
.feature-card p{color:${textSecondary};line-height:1.7;font-size:1rem}

/* Stats */
.stats{padding:6rem 0}
@media(max-width:768px){.stats{padding:4rem 0}}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5rem;text-align:center}
@media(max-width:768px){.stats-grid{grid-template-columns:1fr;gap:2rem}}
.stat{padding:3rem 2rem;border-radius:24px;box-shadow:${shadowOut};transition:all 0.3s}
.stat:hover{box-shadow:${shadowIn}}
.stat-number{font-size:3rem;font-weight:800;margin-bottom:0.5rem;color:${accent}}
.stat-label{color:${textSecondary};font-size:1rem;font-weight:500}

/* CTA */
.cta{padding:8rem 0;text-align:center}
@media(max-width:768px){.cta{padding:5rem 0}}
.cta-box{padding:5rem 3rem;border-radius:32px;box-shadow:${shadowOut};max-width:800px;margin:0 auto}
@media(max-width:768px){.cta-box{padding:3rem 2rem}}
.cta h2{font-size:clamp(2rem,6vw,3.5rem);font-weight:800;margin-bottom:1.5rem}
.cta p{font-size:1.125rem;color:${textSecondary};margin-bottom:2.5rem;line-height:1.8}

/* Footer */
footer{padding:4rem 0;text-align:center}
footer p{color:${textSecondary};font-size:0.9375rem}
</style></head><body>
<header><div class="container"><nav class="nav">
<div class="logo">NEOMORPH</div>
<ul class="nav-links">
<li><a class="nav-link" href="#">Home</a></li>
<li><a class="nav-link" href="#">Features</a></li>
<li><a class="nav-link" href="#">About</a></li>
</ul>
</nav></div></header>

<main>
<section class="hero"><div class="container">
<div class="hero-content">
<h1>Soft UI Design</h1>
<p>Experience the subtle depth and tactile feel of neumorphism. Where shadows create dimension and interfaces feel touchable.</p>
<div class="cta-group">
<a class="btn" href="#">Get Started</a>
<a class="btn" href="#">Learn More</a>
</div>
</div>
</div></section>

<section class="features"><div class="container">
<h2>Soft & Subtle</h2>
<div class="features-grid">
<div class="feature-card">
<div class="feature-icon">💎</div>
<h3>Tactile Design</h3>
<p>Elements appear to rise from the surface with soft shadows and highlights.</p>
</div>
<div class="feature-card">
<div class="feature-icon">🎯</div>
<h3>Focused Experience</h3>
<p>Minimalist approach that keeps users engaged with subtle interactions.</p>
</div>
<div class="feature-card">
<div class="feature-icon">✨</div>
<h3>Modern Aesthetic</h3>
<p>Contemporary design that feels both familiar and innovative.</p>
</div>
</div>
</div></section>

<section class="stats"><div class="container">
<div class="stats-grid">
<div class="stat">
<div class="stat-number">2.5M</div>
<div class="stat-label">Downloads</div>
</div>
<div class="stat">
<div class="stat-number">4.8</div>
<div class="stat-label">Rating</div>
</div>
<div class="stat">
<div class="stat-number">95%</div>
<div class="stat-label">Satisfaction</div>
</div>
</div>
</div></section>

<section class="cta"><div class="container">
<div class="cta-box">
<h2>Experience the Softness</h2>
<p>Join designers who appreciate subtle, tactile interfaces that delight users</p>
<a class="btn" href="#">Start Creating</a>
</div>
</div></section>
</main>

<footer><div class="container">
<p>© 2024 Neomorph UI. Designed with care.</p>
</div></footer>
</body></html>`;
};

function StyleShowcase() {
  const { theme, selectedStyleTheme, setStyleTheme } = useTheme();
  const [activeStyle, setActiveStyle] = useState(selectedStyleTheme);
  const [previewMode, setPreviewMode] = useState(theme);
  const [viewMode, setViewMode] = useState("desktop"); // desktop, tablet, mobile
  const iframeRef = useRef(null);

  // pinned = controls stuck to bottom; default true
  const [isPinned, setIsPinned] = useState(true);

  // Ensure previewMode follows global theme
  useEffect(() => {
    setPreviewMode(theme);
  }, [theme]);

  const handleStyleChange = (styleId) => {
    setActiveStyle(styleId);
    setStyleTheme(styleId);
  };

  // Write preview HTML into iframe
  useEffect(() => {
    if (!iframeRef.current) return;
    const html = generatePreviewHTML(activeStyle, previewMode);
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [activeStyle, previewMode]);

  // IntersectionObserver: observe the sentinel just after the preview.
  // When the sentinel becomes visible, the preview was scrolled past -> unpin controls.
  useEffect(() => {
    const sentinel = document.querySelector("#preview-sentinel");
    if (!sentinel) {
      // fallback: keep pinned
      setIsPinned(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        // if sentinel is intersecting => we've reached/past the bottom of preview => unpin
        setIsPinned(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        // slight offset so panel unpins just a bit before/after the sentinel is fully in view
        rootMargin: "0px 0px -8% 0px",
      }
    );

    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="style-showcase"
      id="styles"
      style={{
        '--style-bg': styleThemes[activeStyle][theme].bg,
        '--style-surface': styleThemes[activeStyle][theme].surface,
        '--style-border': styleThemes[activeStyle][theme].border,
        '--style-text': styleThemes[activeStyle][theme].text,
        '--style-text-secondary': styleThemes[activeStyle][theme].textSecondary,
        '--style-accent': styleThemes[activeStyle][theme].accent,
      }}
    >
      <div className="container">
        <div className="style-showcase__header">
          <h2 className="style-showcase__title">Choose Your Style</h2>
          <p className="style-showcase__subtitle">
            Every template adapts to your chosen design style — fully responsive across all devices
          </p>
        </div>

        <div className="style-showcase__content">

          {/* ----------------------------
             MOBILE / TABLET: bottom stacked control panel (mobile-only)
             This panel is pinned/unpinned based on the preview sentinel.
          ----------------------------- */}
          <div
            className={`style-control-panel mobile-only ${isPinned ? "pinned" : "unpinned"}`}
            aria-hidden={!isPinned && true}
          >
            {/* Style selector (icons + small label) */}
            <div className="panel-section style-select">
              {styles.map((style) => (
                <button
                  key={style.id}
                  className={`style-item ${activeStyle === style.id ? "active" : ""}`}
                  onClick={() => handleStyleChange(style.id)}
                  aria-pressed={activeStyle === style.id}
                >
                  <div className="style-icon" aria-hidden>{style.icon}</div>
                  {/* <span className="style-label">{style.name}</span> */}
                </button>
              ))}
            </div>

            {/* Color mode */}
            <div className="panel-section mode-select" role="radiogroup" aria-label="Color mode">
              <button
                onClick={() => setPreviewMode("light")}
                className={`mode-btn ${previewMode === "light" ? "active" : ""}`}
                aria-pressed={previewMode === "light"}
              >
                <Sun size={16} />
              </button>
              <button
                onClick={() => setPreviewMode("dark")}
                className={`mode-btn ${previewMode === "dark" ? "active" : ""}`}
                aria-pressed={previewMode === "dark"}
              >
                <Moon size={16} />
              </button>
            </div>
          </div>

          {/* ----------------------------
             DESKTOP: side selector (desktop-only)
             Desktop layout is intentionally unchanged.
          ----------------------------- */}
          <div className="style-selector desktop-only">
            {styles.map((style) => (
              <button
                key={style.id}
                className={`style-selector__item ${activeStyle === style.id ? "active" : ""}`}
                onClick={() => handleStyleChange(style.id)}
              >
                <div className="style-selector__icon">{style.icon}</div>
                <div className="style-selector__info">
                  <h3>{style.name}</h3>
                  <p>{style.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* ----------------------------
             PREVIEW: visible on all breakpoints
             Note: id="live-preview" is always present; sentinel follows it.
          ----------------------------- */}
          <div className="style-preview">
            <div className="style-preview__controls desktop-only-controls">
              <div className="style-preview__title-group">
                <h3>{styles.find((s) => s.id === activeStyle)?.name}</h3>
                <span className="style-preview__device-label">{viewMode}</span>
              </div>

              <div className="style-preview__control-group desktop-only-controls">
                <div className="style-preview__view-modes">
                  <button
                    className={`view-toggle ${viewMode === "desktop" ? "active" : ""}`}
                    onClick={() => setViewMode("desktop")}
                    aria-label="Desktop view"
                  >
                    <Monitor size={18} />
                  </button>
                  <button
                    className={`view-toggle ${viewMode === "tablet" ? "active" : ""}`}
                    onClick={() => setViewMode("tablet")}
                    aria-label="Tablet view"
                  >
                    <Tablet size={18} />
                  </button>
                  <button
                    className={`view-toggle ${viewMode === "mobile" ? "active" : ""}`}
                    onClick={() => setViewMode("mobile")}
                    aria-label="Mobile view"
                  >
                    <Smartphone size={18} />
                  </button>
                </div>

                <div className="style-preview__modes">
                  <button
                    className={`mode-toggle ${previewMode === "light" ? "active" : ""}`}
                    onClick={() => setPreviewMode("light")}
                  >
                    Light
                  </button>
                  <button
                    className={`mode-toggle ${previewMode === "dark" ? "active" : ""}`}
                    onClick={() => setPreviewMode("dark")}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            <div className={`style-preview__frame style-preview__frame--${viewMode}`} id="live-preview">
              <iframe
                ref={iframeRef}
                className="style-preview__iframe"
                title="Style Preview"
                sandbox="allow-same-origin"
              />
            </div>

            {/* sentinel used by IntersectionObserver (small, invisible) */}
            <div id="preview-sentinel" style={{ width: "1px", height: "1px", opacity: 0 }} />
          </div>
        </div>
      </div>
    </section>
  );
}


export default StyleShowcase;