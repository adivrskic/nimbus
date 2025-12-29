// utils/demoGenerator.js - Generate demo HTML for fallback/preview
import { OPTIONS } from "../configs/options.config";

/**
 * Generate a demo HTML page based on selections
 * @param {string} prompt - User's description
 * @param {Object} selections - Current selections state
 * @returns {string} Complete HTML document
 */
export function generateDemo(prompt, selections) {
  const s = selections;

  // Get colors from palette
  const paletteOpt = OPTIONS.palette.choices.find((c) => c.value === s.palette);
  const colors = paletteOpt?.colors || ["#1e40af", "#3b82f6", "#93c5fd"];
  const primaryColor = colors[1];

  // Dark mode settings
  const isDark = s.mode === "Dark";
  const bg = isDark ? "#09090b" : "#ffffff";
  const text = isDark ? "#fafafa" : "#09090b";
  const muted = isDark ? "#a1a1aa" : "#71717a";
  const surface = isDark ? "#18181b" : "#f4f4f5";
  const border = isDark ? "#27272a" : "#e4e4e7";

  // Font family mapping
  const fontMap = {
    "Sans-serif": "'Inter', system-ui, sans-serif",
    "Sans Serif": "'Inter', system-ui, sans-serif",
    Serif: "'Playfair Display', Georgia, serif",
    Geometric: "'Space Grotesk', system-ui, sans-serif",
    Rounded: "'Poppins', system-ui, sans-serif",
    Monospace: "'JetBrains Mono', monospace",
    Mono: "'JetBrains Mono', monospace",
  };
  const fontFam = fontMap[s.font] || fontMap["Sans Serif"];

  // Corner radius mapping
  const radiusMap = {
    Sharp: "0",
    "Slightly Rounded": "6px",
    Subtle: "6px",
    Rounded: "12px",
    Pill: "9999px",
  };
  const radius = radiusMap[s.corners] || "12px";

  // Sticky elements
  const hasSticky = s.stickyElements?.includes("Header");
  const hasFloatingCta = s.stickyElements?.includes("CTA Button");
  const hasChat = s.stickyElements?.includes("Chat Widget");

  // CTA text based on style
  const ctaText =
    s.cta === "Urgent"
      ? "Get Started Now →"
      : s.cta === "Subtle"
      ? "Learn More"
      : "Get Started";

  // Copy length variants
  const heroCopy =
    s.copyLength === "Minimal"
      ? "Transform your ideas into reality."
      : s.copyLength === "Detailed"
      ? "Transform your ideas into reality with our powerful platform. We provide everything you need to create, launch, and grow your digital presence. Join thousands of satisfied customers who have already made the switch."
      : "Transform your ideas into reality with our powerful platform. Start building today and see what's possible.";

  // Animation CSS
  const animationCSS =
    s.animation !== "None"
      ? `@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.hero-content{animation:fadeUp 0.5s ease-out}.feature{animation:fadeUp 0.5s ease-out backwards}.feature:nth-child(1){animation-delay:0.1s}.feature:nth-child(2){animation-delay:0.2s}.feature:nth-child(3){animation-delay:0.3s}`
      : "";

  // Brand name from prompt
  const brandName = prompt.split(" ")[0] || "Brand";
  const pageTitle = prompt.split(" ").slice(0, 5).join(" ") || "Website";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${pageTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--primary:${primaryColor};--primary-dark:${colors[0]};--primary-light:${colors[2]};--bg:${bg};--text:${text};--muted:${muted};--surface:${surface};--border:${border};--radius:${radius};--font:${fontFam}}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
.container{max-width:1120px;margin:0 auto;padding:0 24px}
nav{position:${hasSticky ? "fixed" : "relative"};top:0;left:0;right:0;padding:16px 0;background:${isDark ? "rgba(9,9,11,0.8)" : "rgba(255,255,255,0.8)"};backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);z-index:100}
nav .container{display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:700;font-size:1.25rem;color:var(--text)}
.nav-links{display:flex;gap:32px;list-style:none}
.nav-links a{color:var(--muted);text-decoration:none;font-size:0.875rem;font-weight:500;transition:color 0.15s}
.nav-links a:hover{color:var(--text)}
.nav-cta{padding:10px 20px;background:var(--primary);color:#fff;text-decoration:none;border-radius:var(--radius);font-size:0.875rem;font-weight:600;transition:background 0.15s}
.nav-cta:hover{background:var(--primary-dark)}
.hero{min-height:100vh;display:flex;align-items:center;padding:${hasSticky ? "120px 0 80px" : "80px 0"}}
.hero-content{max-width:680px}
.hero h1{font-size:clamp(2.5rem,5vw,4rem);font-weight:700;line-height:1.1;margin-bottom:24px;letter-spacing:-0.02em}
.hero p{font-size:1.125rem;color:var(--muted);margin-bottom:32px;line-height:1.7}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;font-size:0.9375rem;font-weight:600;text-decoration:none;border-radius:var(--radius);transition:all 0.15s;border:none;cursor:pointer}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:var(--primary-dark)}
.btn-secondary{background:var(--surface);color:var(--text);border:1px solid var(--border)}
.btn-secondary:hover{border-color:var(--muted)}
section{padding:100px 0}
.section-header{text-align:center;margin-bottom:64px}
.section-header h2{font-size:2.25rem;font-weight:700;margin-bottom:16px}
.section-header p{color:var(--muted);font-size:1.125rem;max-width:600px;margin:0 auto}
.features{background:var(--surface)}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px}
.feature{padding:32px;background:var(--bg);border-radius:var(--radius);border:1px solid var(--border)}
.feature-icon{width:48px;height:48px;background:var(--primary);color:#fff;border-radius:calc(var(--radius) * 0.75);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:1.25rem}
.feature h3{font-size:1.125rem;font-weight:600;margin-bottom:12px}
.feature p{color:var(--muted);font-size:0.9375rem}
.cta-section{text-align:center;background:var(--primary);color:#fff;border-radius:var(--radius);margin:0 24px;padding:80px 40px}
.cta-section h2{font-size:2.25rem;font-weight:700;margin-bottom:16px}
.cta-section p{opacity:0.9;font-size:1.125rem;margin-bottom:32px;max-width:500px;margin-left:auto;margin-right:auto}
.cta-section .btn{background:#fff;color:var(--primary)}
.cta-section .btn:hover{background:var(--primary-light);color:var(--primary-dark)}
footer{padding:48px 0;border-top:1px solid var(--border)}
.footer-content{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px}
.footer-links{display:flex;gap:24px}
.footer-links a{color:var(--muted);text-decoration:none;font-size:0.875rem}
.footer-links a:hover{color:var(--text)}
.footer-copy{color:var(--muted);font-size:0.875rem}
${hasFloatingCta ? `.floating-cta{position:fixed;bottom:24px;right:24px;padding:14px 24px;background:var(--primary);color:#fff;border-radius:9999px;font-weight:600;text-decoration:none;box-shadow:0 4px 24px rgba(0,0,0,0.15);z-index:99}` : ""}
${hasChat ? `.chat-btn{position:fixed;bottom:24px;${hasFloatingCta ? "right:180px" : "right:24px"};width:56px;height:56px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.15);z-index:99;cursor:pointer;border:none}` : ""}
@media(max-width:768px){.nav-links{display:none}.hero h1{font-size:2rem}.features-grid{grid-template-columns:1fr}.footer-content{flex-direction:column;text-align:center}.cta-section{margin:0 16px;padding:60px 24px}}
${animationCSS}
</style>
</head>
<body>
<nav><div class="container"><div class="logo">${brandName}</div><ul class="nav-links"><li><a href="#features">Features</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul><a href="#cta" class="nav-cta">${ctaText}</a></div></nav>
<section class="hero"><div class="container"><div class="hero-content"><h1>${prompt || "Build Something Amazing"}</h1><p>${heroCopy}</p><div class="hero-btns"><a href="#cta" class="btn btn-primary">${ctaText}</a><a href="#features" class="btn btn-secondary">Learn More</a></div></div></div></section>
<section class="features" id="features"><div class="container"><div class="section-header"><h2>Why Choose Us</h2><p>Everything you need to succeed</p></div><div class="features-grid"><div class="feature"><div class="feature-icon">⚡</div><h3>Lightning Fast</h3><p>Optimized for speed and performance.</p></div><div class="feature"><div class="feature-icon">🎨</div><h3>Beautiful Design</h3><p>Stunning visuals that capture attention.</p></div><div class="feature"><div class="feature-icon">📱</div><h3>Fully Responsive</h3><p>Looks perfect on every device.</p></div></div></div></section>
<section id="cta"><div class="cta-section"><h2>Ready to Get Started?</h2><p>Join thousands of satisfied customers today.</p><a href="#" class="btn">${s.cta === "Urgent" ? "Start Free Now →" : "Get Started"}</a></div></section>
<footer><div class="container"><div class="footer-content"><div class="footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div><div class="footer-copy">© ${new Date().getFullYear()} ${brandName}</div></div></div></footer>
${hasFloatingCta ? `<a href="#cta" class="floating-cta">${s.cta === "Urgent" ? "Try Free →" : "Get Started"}</a>` : ""}
${hasChat ? `<button class="chat-btn">💬</button>` : ""}
</body>
</html>`;
}

export default generateDemo;
