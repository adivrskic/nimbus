import { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Wand2,
  Send,
  Loader2,
  Palette,
  Type,
  Layout,
  Brush,
  ChevronDown,
  ChevronUp,
  Coins,
  Save,
  Download,
  Rocket,
  RefreshCw,
  Check,
  X,
  Eye,
  Code,
  Settings2,
  Info,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import GeneratedPreview from "./GeneratedPreview";
import TokenDisplay from "./TokenDisplay";
import TokenPurchaseModal from "./TokenPurchaseModal";
import DeployModal from "./DeployModal";
import {
  calculateTokenCost,
  getBreakdownDisplay,
  formatTokenCost,
} from "../utils/tokenCalculator";
import "./AIGenerator.scss";

// Template type options
const TEMPLATE_TYPES = [
  {
    id: "landing",
    label: "Landing Page",
    description: "Single page to showcase your product or service",
  },
  {
    id: "business",
    label: "Business",
    description: "Professional multi-section business website",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Showcase your work and projects",
  },
  {
    id: "blog",
    label: "Blog",
    description: "Content-focused with article layouts",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    description: "Product showcase and store layout",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    description: "Menu, hours, and reservation info",
  },
  {
    id: "event",
    label: "Event",
    description: "Event details, schedule, and registration",
  },
  {
    id: "saas",
    label: "SaaS",
    description: "Software product with features and pricing",
  },
];

// Style presets
const STYLE_PRESETS = [
  { id: "minimal", label: "Minimal", description: "Clean and simple" },
  { id: "modern", label: "Modern", description: "Contemporary and bold" },
  { id: "elegant", label: "Elegant", description: "Sophisticated and refined" },
  { id: "playful", label: "Playful", description: "Fun and colorful" },
  {
    id: "corporate",
    label: "Corporate",
    description: "Professional and trustworthy",
  },
  { id: "creative", label: "Creative", description: "Artistic and unique" },
  { id: "tech", label: "Tech", description: "Futuristic and innovative" },
  { id: "organic", label: "Organic", description: "Natural and warm" },
];

// Font pairings
const FONT_PAIRINGS = [
  {
    id: "inter-system",
    label: "Inter + System",
    fonts: ["Inter", "system-ui"],
  },
  {
    id: "playfair-lato",
    label: "Playfair + Lato",
    fonts: ["Playfair Display", "Lato"],
  },
  {
    id: "montserrat-opensans",
    label: "Montserrat + Open Sans",
    fonts: ["Montserrat", "Open Sans"],
  },
  {
    id: "poppins-roboto",
    label: "Poppins + Roboto",
    fonts: ["Poppins", "Roboto"],
  },
  { id: "dm-sans", label: "DM Sans", fonts: ["DM Sans", "DM Sans"] },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    fonts: ["Space Grotesk", "Inter"],
  },
  { id: "sora-inter", label: "Sora + Inter", fonts: ["Sora", "Inter"] },
  {
    id: "clash-satoshi",
    label: "Clash + Satoshi",
    fonts: ["Clash Display", "Satoshi"],
  },
];

// Color scheme options
const COLOR_SCHEMES = [
  { id: "custom", label: "Custom", colors: null },
  {
    id: "ocean",
    label: "Ocean",
    colors: { primary: "#0066CC", secondary: "#00A3E0", accent: "#FF6B35" },
  },
  {
    id: "forest",
    label: "Forest",
    colors: { primary: "#2D5016", secondary: "#4A7C23", accent: "#E8B923" },
  },
  {
    id: "sunset",
    label: "Sunset",
    colors: { primary: "#FF6B35", secondary: "#F7C59F", accent: "#2E294E" },
  },
  {
    id: "midnight",
    label: "Midnight",
    colors: { primary: "#1A1A2E", secondary: "#16213E", accent: "#E94560" },
  },
  {
    id: "lavender",
    label: "Lavender",
    colors: { primary: "#6B5B95", secondary: "#B8A9C9", accent: "#F67280" },
  },
  {
    id: "earth",
    label: "Earth",
    colors: { primary: "#5D4037", secondary: "#8D6E63", accent: "#FF8A65" },
  },
  {
    id: "monochrome",
    label: "Monochrome",
    colors: { primary: "#212121", secondary: "#424242", accent: "#757575" },
  },
];

function AIGenerator({ onAuthRequired }) {
  const { user, isAuthenticated, profile } = useAuth();

  // Main state
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);

  // Customization state
  const [showCustomization, setShowCustomization] = useState(true);
  const [templateType, setTemplateType] = useState("landing");
  const [stylePreset, setStylePreset] = useState("modern");
  const [fontPairing, setFontPairing] = useState("inter-system");
  const [colorScheme, setColorScheme] = useState("custom");
  const [customColors, setCustomColors] = useState({
    primary: "#0066CC",
    secondary: "#F5F5F5",
    accent: "#FF6B35",
    background: "#FFFFFF",
    text: "#1A1A1A",
  });
  const [colorMode, setColorMode] = useState("light");

  // Quick edit state (for post-generation tweaks)
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(null);

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);

  // Project state
  const [projectName, setProjectName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const textareaRef = useRef(null);

  // Get user tokens (placeholder - should come from profile)
  const userTokens = profile?.tokens || 0;

  // Calculate dynamic token cost based on prompt and customization
  const tokenCostInfo = useMemo(() => {
    return calculateTokenCost(
      prompt || "",
      {
        templateType,
        stylePreset,
        colorScheme,
        customColors: colorScheme === "custom",
        fontPairing,
        darkMode: colorMode === "dark",
      },
      false
    );
  }, [prompt, templateType, stylePreset, colorScheme, fontPairing, colorMode]);

  // Safe token cost with NaN fallback
  const displayTokenCost = isNaN(tokenCostInfo.cost) ? 8 : tokenCostInfo.cost;

  // Get breakdown for display
  const costBreakdown = useMemo(() => {
    return getBreakdownDisplay(tokenCostInfo.breakdown);
  }, [tokenCostInfo.breakdown]);

  // State for showing cost breakdown tooltip
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [prompt]);

  // Build the full prompt for AI
  const buildFullPrompt = () => {
    const templateInfo = TEMPLATE_TYPES.find((t) => t.id === templateType);
    const styleInfo = STYLE_PRESETS.find((s) => s.id === stylePreset);
    const fontInfo = FONT_PAIRINGS.find((f) => f.id === fontPairing);
    const colorInfo =
      colorScheme !== "custom"
        ? COLOR_SCHEMES.find((c) => c.id === colorScheme)?.colors
        : customColors;

    return `
Create a professional, fully responsive ${
      templateInfo?.label || "landing page"
    } website with the following specifications:

USER DESCRIPTION:
${prompt}

TEMPLATE TYPE: ${templateInfo?.label} - ${templateInfo?.description}

STYLE: ${styleInfo?.label} - ${styleInfo?.description}

FONTS:
- Heading Font: ${fontInfo?.fonts[0]}
- Body Font: ${fontInfo?.fonts[1]}

COLOR SCHEME:
- Primary Color: ${colorInfo?.primary || customColors.primary}
- Secondary Color: ${colorInfo?.secondary || customColors.secondary}
- Accent Color: ${colorInfo?.accent || customColors.accent}
- Background: ${customColors.background}
- Text Color: ${customColors.text}

COLOR MODE: ${colorMode}

REQUIREMENTS:
1. Create a complete, production-ready HTML file with embedded CSS and JavaScript
2. Must be fully responsive (mobile, tablet, desktop)
3. Include smooth scrolling and subtle animations
4. Use semantic HTML5 elements
5. Include proper meta tags for SEO
6. Add appropriate sections based on the template type
7. Use the specified fonts (import from Google Fonts if needed)
8. Apply the color scheme consistently throughout
9. Include hover states and transitions
10. Make it visually stunning and professional
11. If ${
      colorMode === "dark"
    }, use dark background with light text as the default
12. Include a navigation header and footer
13. Add placeholder content that matches the user's description

Return ONLY the complete HTML code, no explanations.
`.trim();
  };

  // State for showing prompt modal (TESTING MODE)
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Generate website
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe what kind of website you want to create.");
      return;
    }

    // TESTING MODE: Show the prompt instead of calling API
    const fullPrompt = buildFullPrompt();
    setGeneratedPrompt(fullPrompt);
    setShowPromptModal(true);

    // Also generate a demo page for preview
    const demoHtml = generateDemoWebsite();
    setGeneratedCode(demoHtml);
    setEditedCode(demoHtml);
    setShowPreview(true);

    return; // Skip the API call for testing

    /* Original API call code - commented out for testing
    if (!isAuthenticated) {
      onAuthRequired?.(() => handleGenerate());
      return;
    }

    if (userTokens < tokenCostInfo.cost) {
      setShowPaymentModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedCode(null);

    try {
      const fullPrompt = buildFullPrompt();

      // Call Claude API (this would be your backend endpoint)
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          userId: user?.id,
          tokenCost: tokenCostInfo.cost,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate website");
      }

      const data = await response.json();
      setGeneratedCode(data.html);
      setEditedCode(data.html);
      setShowPreview(true);

      // Deduct tokens would happen on backend
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate website. Please try again.");

      // For demo purposes, generate a placeholder
      const demoHtml = generateDemoWebsite();
      setGeneratedCode(demoHtml);
      setEditedCode(demoHtml);
      setShowPreview(true);
    } finally {
      setIsGenerating(false);
    }
    */
  };

  // Demo website generator (placeholder for when API isn't available)
  const generateDemoWebsite = () => {
    const templateInfo = TEMPLATE_TYPES.find((t) => t.id === templateType);
    const styleInfo = STYLE_PRESETS.find((s) => s.id === stylePreset);
    const fontInfo = FONT_PAIRINGS.find((f) => f.id === fontPairing);
    const colors =
      colorScheme !== "custom"
        ? COLOR_SCHEMES.find((c) => c.id === colorScheme)?.colors
        : customColors;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt.slice(0, 50) || "My Website"}</title>
    <link href="https://fonts.googleapis.com/css2?family=${fontInfo?.fonts[0].replace(
      " ",
      "+"
    )}:wght@400;500;600;700&family=${fontInfo?.fonts[1].replace(
      " ",
      "+"
    )}:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary: ${colors?.primary || "#0066CC"};
            --secondary: ${colors?.secondary || "#F5F5F5"};
            --accent: ${colors?.accent || "#FF6B35"};
            --background: ${colorMode === "dark" ? "#1a1a1a" : "#ffffff"};
            --text: ${colorMode === "dark" ? "#f5f5f5" : "#1a1a1a"};
            --text-muted: ${colorMode === "dark" ? "#a0a0a0" : "#666666"};
            --font-heading: '${fontInfo?.fonts[0]}', sans-serif;
            --font-body: '${fontInfo?.fonts[1]}', sans-serif;
        }
        
        html {
            scroll-behavior: smooth;
        }
        
        body {
            font-family: var(--font-body);
            background: var(--background);
            color: var(--text);
            line-height: 1.6;
        }
        
        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 1rem 2rem;
            background: ${
              colorMode === "dark"
                ? "rgba(26,26,26,0.95)"
                : "rgba(255,255,255,0.95)"
            };
            backdrop-filter: blur(10px);
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid ${
              colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
            };
        }
        
        .logo {
            font-family: var(--font-heading);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-links a {
            color: var(--text);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: var(--primary);
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 6rem 2rem 4rem;
            background: linear-gradient(135deg, var(--background) 0%, var(--secondary) 100%);
        }
        
        .hero-content {
            max-width: 800px;
        }
        
        .hero h1 {
            font-family: var(--font-heading);
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: var(--text-muted);
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
            cursor: pointer;
            border: none;
            font-size: 1rem;
        }
        
        .btn-primary {
            background: var(--primary);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .btn-secondary {
            background: transparent;
            color: var(--primary);
            border: 2px solid var(--primary);
        }
        
        /* Features Section */
        .features {
            padding: 6rem 2rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }
        
        .section-header h2 {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            padding: 2rem;
            background: ${
              colorMode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.02)"
            };
            border-radius: 16px;
            border: 1px solid ${
              colorMode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)"
            };
            transition: all 0.3s;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: var(--primary);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            font-size: 1.5rem;
        }
        
        .feature-card h3 {
            font-family: var(--font-heading);
            font-size: 1.25rem;
            margin-bottom: 0.75rem;
        }
        
        .feature-card p {
            color: var(--text-muted);
        }
        
        /* CTA Section */
        .cta {
            padding: 6rem 2rem;
            background: var(--primary);
            color: white;
            text-align: center;
        }
        
        .cta h2 {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .cta p {
            font-size: 1.25rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        
        .cta .btn {
            background: white;
            color: var(--primary);
        }
        
        /* Footer */
        footer {
            padding: 4rem 2rem 2rem;
            background: ${colorMode === "dark" ? "#0a0a0a" : "#1a1a1a"};
            color: white;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
        }
        
        .footer-section h4 {
            font-family: var(--font-heading);
            margin-bottom: 1rem;
        }
        
        .footer-section ul {
            list-style: none;
        }
        
        .footer-section a {
            color: rgba(255,255,255,0.7);
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-section a:hover {
            color: white;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            margin-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.5);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="logo">${
          prompt.split(" ").slice(0, 2).join(" ") || "MyBrand"
        }</div>
        <ul class="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    
    <section class="hero">
        <div class="hero-content">
            <h1>${prompt || "Build Something Amazing Today"}</h1>
            <p>Transform your ideas into reality with our powerful platform. Start your journey today and see what's possible.</p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="#features" class="btn btn-primary">Get Started</a>
                <a href="#about" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
    </section>
    
    <section class="features" id="features">
        <div class="container">
            <div class="section-header">
                <h2>Why Choose Us</h2>
                <p style="color: var(--text-muted);">Everything you need to succeed</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">âš¡</div>
                    <h3>Lightning Fast</h3>
                    <p>Optimized for speed and performance. Your users will love the experience.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">ðŸŽ¨</div>
                    <h3>Beautiful Design</h3>
                    <p>Stunning visuals that capture attention and keep visitors engaged.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">ðŸ“±</div>
                    <h3>Fully Responsive</h3>
                    <p>Looks perfect on every device, from mobile to desktop.</p>
                </div>
            </div>
        </div>
    </section>
    
    <section class="cta">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers today.</p>
            <a href="#" class="btn">Start Free Trial</a>
        </div>
    </section>
    
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Blog</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Product</h4>
                <ul>
                    <li><a href="#">Features</a></li>
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">Documentation</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">Status</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Legal</h4>
                <ul>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
        </div>
    </footer>
    
    <script>
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                nav.style.boxShadow = 'none';
            }
        });
    </script>
</body>
</html>`;
  };

  // Apply quick color changes
  const applyColorChange = (colorType, newColor) => {
    setCustomColors((prev) => ({ ...prev, [colorType]: newColor }));

    if (editedCode) {
      // Simple find/replace for demo - in production, use proper parsing
      let updatedCode = editedCode;

      if (colorType === "primary") {
        updatedCode = updatedCode.replace(
          /--primary: #[a-fA-F0-9]{6}/g,
          `--primary: ${newColor}`
        );
      } else if (colorType === "accent") {
        updatedCode = updatedCode.replace(
          /--accent: #[a-fA-F0-9]{6}/g,
          `--accent: ${newColor}`
        );
      } else if (colorType === "background") {
        updatedCode = updatedCode.replace(
          /--background: #[a-fA-F0-9]{6}/g,
          `--background: ${newColor}`
        );
      }

      setEditedCode(updatedCode);
    }
  };

  // Save project
  const handleSaveProject = async () => {
    if (!isAuthenticated) {
      onAuthRequired?.(() => handleSaveProject());
      return;
    }

    if (!projectName.trim()) {
      setError("Please enter a project name.");
      return;
    }

    setIsSaving(true);
    try {
      // Save to Supabase
      const response = await fetch("/api/projects/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          name: projectName,
          html: editedCode,
          prompt,
          customization: {
            templateType,
            stylePreset,
            fontPairing,
            colorScheme,
            customColors,
            colorMode,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to save project");

      const data = await response.json();
      setCurrentProject(data.project);
      // Show success notification
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Download HTML
  const handleDownload = () => {
    if (!editedCode) return;

    const blob = new Blob([editedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName || "website"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ai-generator">
      {/* Token Display */}
      {isAuthenticated && (
        <TokenDisplay
          tokens={userTokens}
          onBuyTokens={() => setShowPaymentModal(true)}
        />
      )}

      {/* Main Input Area */}
      <div className="ai-generator__input-section">
        <div className="ai-generator__prompt-container">
          <div className="ai-generator__prompt-header">
            <Wand2 size={20} />
            <span>Describe your website</span>
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A modern SaaS landing page for a project management tool with dark theme, featuring hero section, pricing tiers, testimonials, and a free trial CTA..."
            className="ai-generator__textarea"
            rows={3}
          />
          <div className="ai-generator__prompt-footer">
            <div
              className="ai-generator__token-cost"
              onMouseEnter={() => setShowCostBreakdown(true)}
              onMouseLeave={() => setShowCostBreakdown(false)}
            >
              <Coins size={14} />
              <span>{displayTokenCost} tokens</span>
              <span className="ai-generator__cost-estimate">
                ({tokenCostInfo.estimate || "Simple"})
              </span>
              <Info size={12} className="ai-generator__cost-info" />

              {showCostBreakdown && costBreakdown.length > 0 && (
                <div className="ai-generator__cost-breakdown">
                  <div className="ai-generator__cost-breakdown-title">
                    Token breakdown
                  </div>
                  {costBreakdown.map((item, index) => (
                    <div
                      key={index}
                      className="ai-generator__cost-breakdown-item"
                    >
                      <span>{item.label}</span>
                      <span>+{item.cost}</span>
                    </div>
                  ))}
                  <div className="ai-generator__cost-breakdown-total">
                    <span>Total</span>
                    <span>{displayTokenCost} tokens</span>
                  </div>
                </div>
              )}
            </div>
            <button
              className="btn btn-primary ai-generator__generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="spinning" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Website
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="ai-generator__error">
            <X size={16} />
            {error}
          </div>
        )}

        {/* Customization Panel */}
        <div className="ai-generator__customization">
          <button
            className="ai-generator__customization-toggle"
            onClick={() => setShowCustomization(!showCustomization)}
          >
            <Settings2 size={18} />
            <span>Customization Options</span>
            {showCustomization ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {showCustomization && (
            <div className="ai-generator__customization-panel">
              {/* Template Type */}
              <div className="customization-group">
                <label>
                  <Layout size={16} />
                  Template Type
                </label>
                <div className="customization-options customization-options--grid">
                  {TEMPLATE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      className={`customization-option ${
                        templateType === type.id ? "active" : ""
                      }`}
                      onClick={() => setTemplateType(type.id)}
                      title={type.description}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Preset */}
              <div className="customization-group">
                <label>
                  <Brush size={16} />
                  Style
                </label>
                <div className="customization-options">
                  {STYLE_PRESETS.map((style) => (
                    <button
                      key={style.id}
                      className={`customization-option ${
                        stylePreset === style.id ? "active" : ""
                      }`}
                      onClick={() => setStylePreset(style.id)}
                      title={style.description}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Pairing */}
              <div className="customization-group">
                <label>
                  <Type size={16} />
                  Fonts
                </label>
                <div className="customization-options">
                  {FONT_PAIRINGS.map((font) => (
                    <button
                      key={font.id}
                      className={`customization-option ${
                        fontPairing === font.id ? "active" : ""
                      }`}
                      onClick={() => setFontPairing(font.id)}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Scheme */}
              <div className="customization-group">
                <label>
                  <Palette size={16} />
                  Color Scheme
                </label>
                <div className="customization-options customization-options--colors">
                  {COLOR_SCHEMES.map((scheme) => (
                    <button
                      key={scheme.id}
                      className={`customization-option customization-option--color ${
                        colorScheme === scheme.id ? "active" : ""
                      }`}
                      onClick={() => setColorScheme(scheme.id)}
                      style={
                        scheme.colors
                          ? {
                              "--swatch-primary": scheme.colors.primary,
                              "--swatch-secondary": scheme.colors.secondary,
                              "--swatch-accent": scheme.colors.accent,
                            }
                          : {}
                      }
                    >
                      {scheme.colors && (
                        <div className="color-swatch">
                          <span
                            style={{ background: scheme.colors.primary }}
                          ></span>
                          <span
                            style={{ background: scheme.colors.secondary }}
                          ></span>
                          <span
                            style={{ background: scheme.colors.accent }}
                          ></span>
                        </div>
                      )}
                      {scheme.label}
                    </button>
                  ))}
                </div>

                {/* Custom Colors */}
                {colorScheme === "custom" && (
                  <div className="custom-colors">
                    <div className="color-input">
                      <label>Primary</label>
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            primary: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="color-input">
                      <label>Secondary</label>
                      <input
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            secondary: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="color-input">
                      <label>Accent</label>
                      <input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            accent: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="color-input">
                      <label>Background</label>
                      <input
                        type="color"
                        value={customColors.background}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            background: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="color-input">
                      <label>Text</label>
                      <input
                        type="color"
                        value={customColors.text}
                        onChange={(e) =>
                          setCustomColors((prev) => ({
                            ...prev,
                            text: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Color Mode */}
              <div className="customization-group">
                <label>Default Mode</label>
                <div className="customization-options">
                  <button
                    className={`customization-option ${
                      colorMode === "light" ? "active" : ""
                    }`}
                    onClick={() => setColorMode("light")}
                  >
                    â˜€ï¸ Light
                  </button>
                  <button
                    className={`customization-option ${
                      colorMode === "dark" ? "active" : ""
                    }`}
                    onClick={() => setColorMode("dark")}
                  >
                    ðŸŒ™ Dark
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {showPreview && editedCode && (
        <div className="ai-generator__preview-section">
          <div className="ai-generator__preview-header">
            <div className="ai-generator__preview-tabs">
              <button
                className={`preview-tab ${!showCodeView ? "active" : ""}`}
                onClick={() => setShowCodeView(false)}
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                className={`preview-tab ${showCodeView ? "active" : ""}`}
                onClick={() => setShowCodeView(true)}
              >
                <Code size={16} />
                Code
              </button>
            </div>

            <div className="ai-generator__preview-actions">
              {/* Quick Color Edit */}
              <div className="quick-edit">
                <label>Quick Edit:</label>
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => applyColorChange("primary", e.target.value)}
                  title="Primary Color"
                />
                <input
                  type="color"
                  value={customColors.accent}
                  onChange={(e) => applyColorChange("accent", e.target.value)}
                  title="Accent Color"
                />
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-ghost"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  title="Regenerate"
                >
                  <RefreshCw size={16} />
                </button>

                <div className="save-group">
                  <input
                    type="text"
                    placeholder="Project name..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="project-name-input"
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={handleSaveProject}
                    disabled={isSaving || !projectName.trim()}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="spinning" />
                    ) : (
                      <Save size={16} />
                    )}
                    Save
                  </button>
                </div>

                <button className="btn btn-secondary" onClick={handleDownload}>
                  <Download size={16} />
                  Download
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => setShowDeployModal(true)}
                >
                  <Rocket size={16} />
                  Deploy
                </button>
              </div>
            </div>
          </div>

          <div className="ai-generator__preview-content">
            {showCodeView ? (
              <div className="code-view">
                <pre>
                  <code>{editedCode}</code>
                </pre>
              </div>
            ) : (
              <GeneratedPreview html={editedCode} />
            )}
          </div>
        </div>
      )}

      {/* Token Purchase Modal */}
      {showPaymentModal && (
        <TokenPurchaseModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          currentTokens={userTokens}
        />
      )}

      {/* Deploy Modal */}
      {showDeployModal && (
        <DeployModal
          isOpen={showDeployModal}
          onClose={() => setShowDeployModal(false)}
          projectName={projectName}
          html={editedCode}
        />
      )}

      {/* Prompt Modal (TESTING MODE) */}
      {showPromptModal && (
        <div
          className="prompt-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "2rem",
          }}
        >
          <div
            className="prompt-modal"
            style={{
              backgroundColor: "#1a1a2e",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ color: "#fff", margin: 0, fontSize: "1.5rem" }}>
                🧪 Testing Mode - LLM Prompt
              </h2>
              <button
                onClick={() => setShowPromptModal(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1rem" }}>
              Copy this prompt and paste it to Claude to generate the website:
            </p>
            <textarea
              readOnly
              value={generatedPrompt}
              style={{
                flex: 1,
                minHeight: "400px",
                backgroundColor: "#0d0d1a",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                padding: "1rem",
                color: "#e0e0e0",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                resize: "none",
                lineHeight: "1.6",
              }}
              onClick={(e) => e.target.select()}
            />
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPrompt);
                  alert("Prompt copied to clipboard!");
                }}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                📋 Copy Prompt
              </button>
              <button
                onClick={() => setShowPromptModal(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIGenerator;
