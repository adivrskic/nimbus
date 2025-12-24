// Home.jsx - Options flow back to categories, with icons and prompt building
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  X,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Rocket,
  RotateCcw,
  Code2,
  Eye,
  ChevronRight,
  Settings,
  Coins,
  Layout,
  Paintbrush,
  Type,
  Sun,
  MessageSquare,
  FileText,
  Target,
  Building2,
  Users,
  Star,
  Award,
  Layers,
  Grid3X3,
  Palette,
  Maximize,
  Circle,
  Image,
  Zap,
  Code,
  Accessibility,
  Pin,
  Lightbulb,
  Compass,
  Check,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "../components/AuthModal";
import TokenPurchaseModal from "../components/TokenPurchaseModal";
import DeployModal from "../components/DeployModal";
import {
  calculateTokenCost,
  checkTokenBalance,
  getBreakdownDisplay,
} from "../utils/tokenCalculator";
import "./Home.scss";

// ==================== ANIMATION VARIANTS ====================

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 4,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const pillContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

const pillVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 6,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
  hover: {
    y: -1,
    transition: { duration: 0.15 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const activePillVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    x: -8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    x: -8,
    transition: { duration: 0.15 },
  },
  hover: {
    x: 2,
    transition: { duration: 0.15 },
  },
};

const tokenContentVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15 },
  },
};

const tokenItemVariants = {
  hidden: {
    opacity: 0,
    x: -6,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  }),
};

const previewModalVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const previewContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 12,
    transition: { duration: 0.2 },
  },
};

const fadeInOutVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// ==================== OPTIONS CONFIG ====================

const OPTIONS = {
  template: {
    label: "Template",
    subtitle: "Choose your page structure",
    icon: Layout,
    promptKey: "template_type",
    choices: [
      { value: "Landing Page", prompt: "single-page landing page" },
      { value: "Business Site", prompt: "multi-section business website" },
      { value: "Portfolio", prompt: "portfolio showcasing projects" },
      {
        value: "SaaS Product",
        prompt: "SaaS product marketing site with pricing",
      },
      { value: "Blog", prompt: "blog with article layouts" },
      { value: "E-commerce", prompt: "e-commerce product showcase" },
    ],
  },
  style: {
    label: "Design Style",
    subtitle: "Overall visual aesthetic",
    icon: Paintbrush,
    promptKey: "design_style",
    choices: [
      { value: "Minimal", prompt: "minimal and clean with lots of whitespace" },
      {
        value: "Modern",
        prompt: "modern and contemporary with bold typography",
      },
      { value: "Elegant", prompt: "elegant and sophisticated" },
      { value: "Bold", prompt: "bold with strong colors and high contrast" },
      { value: "Tech", prompt: "futuristic and tech-forward" },
      { value: "Playful", prompt: "playful and creative with unique elements" },
    ],
  },
  palette: {
    label: "Color Theme",
    subtitle: "Primary color palette",
    icon: Palette,
    promptKey: "color_palette",
    choices: [
      {
        value: "Ocean",
        prompt: "ocean blue color scheme - calming and professional",
        colors: ["#0c4a6e", "#0ea5e9", "#bae6fd"],
      },
      {
        value: "Forest",
        prompt: "forest green color scheme - natural and fresh",
        colors: ["#14532d", "#22c55e", "#bbf7d0"],
      },
      {
        value: "Sunset",
        prompt: "warm sunset orange color scheme - energetic and inviting",
        colors: ["#9a3412", "#f97316", "#fed7aa"],
      },
      {
        value: "Berry",
        prompt: "rich berry purple color scheme - creative and bold",
        colors: ["#581c87", "#a855f7", "#e9d5ff"],
      },
      {
        value: "Rose",
        prompt: "soft rose pink color scheme - warm and approachable",
        colors: ["#9f1239", "#f43f5e", "#fecdd3"],
      },
      {
        value: "Slate",
        prompt: "sophisticated slate gray color scheme - neutral and timeless",
        colors: ["#1e293b", "#64748b", "#cbd5e1"],
      },
      {
        value: "Mint",
        prompt: "fresh mint teal color scheme - modern and clean",
        colors: ["#115e59", "#14b8a6", "#99f6e4"],
      },
      {
        value: "Amber",
        prompt: "warm amber gold color scheme - premium and luxurious",
        colors: ["#78350f", "#f59e0b", "#fde68a"],
      },
      {
        value: "Indigo",
        prompt: "deep indigo color scheme - trustworthy and premium",
        colors: ["#312e81", "#6366f1", "#c7d2fe"],
      },
      {
        value: "Coral",
        prompt: "vibrant coral color scheme - friendly and engaging",
        colors: ["#be123c", "#fb7185", "#fecdd3"],
      },
      { value: "Custom", prompt: "custom color scheme", isCustom: true },
    ],
  },
  customColors: {
    label: "Custom Colors",
    subtitle: "Define your exact brand colors",
    icon: Palette,
    promptKey: "custom_colors",
    isColorPicker: true,
    fields: [
      { key: "primary", label: "Primary", default: "#3b82f6" },
      { key: "secondary", label: "Secondary", default: "#8b5cf6" },
      { key: "accent", label: "Accent", default: "#f59e0b" },
      { key: "background", label: "Background", default: "#ffffff" },
      { key: "text", label: "Text", default: "#1a1a1a" },
    ],
  },
  mode: {
    label: "Appearance",
    subtitle: "Light or dark background",
    icon: Sun,
    promptKey: "color_mode",
    choices: [
      { value: "Light", prompt: "light mode with white/light background" },
      {
        value: "Dark",
        prompt: "dark mode with dark background and light text",
      },
    ],
  },
  font: {
    label: "Typography",
    subtitle: "Font style and personality",
    icon: Type,
    promptKey: "typography",
    choices: [
      {
        value: "Sans-serif",
        prompt: "clean sans-serif typography (Inter or similar)",
      },
      {
        value: "Serif",
        prompt: "elegant serif typography (Playfair Display or similar)",
      },
      {
        value: "Geometric",
        prompt: "geometric sans-serif (Space Grotesk or similar)",
      },
      {
        value: "Rounded",
        prompt: "friendly rounded typography (Poppins or similar)",
      },
      {
        value: "Monospace",
        prompt: "technical monospace accents for headings",
      },
    ],
  },
  tone: {
    label: "Brand Voice",
    subtitle: "How your copy should sound",
    icon: MessageSquare,
    promptKey: "brand_tone",
    choices: [
      { value: "Professional", prompt: "professional and trustworthy tone" },
      { value: "Friendly", prompt: "warm and friendly tone" },
      { value: "Luxury", prompt: "premium and luxurious tone" },
      { value: "Casual", prompt: "casual and conversational tone" },
      { value: "Bold", prompt: "confident and bold tone" },
      { value: "Technical", prompt: "technical and precise tone" },
    ],
  },
  copyLength: {
    label: "Copy Length",
    subtitle: "Amount of text content",
    icon: FileText,
    promptKey: "copy_length",
    choices: [
      {
        value: "Minimal",
        prompt: "very short, punchy copy with just headlines",
      },
      {
        value: "Medium",
        prompt: "balanced copy with headlines and brief descriptions",
      },
      {
        value: "Detailed",
        prompt: "longer, detailed copy with full explanations",
      },
    ],
  },
  cta: {
    label: "CTA Style",
    subtitle: "Call-to-action button approach",
    icon: Target,
    promptKey: "cta_style",
    choices: [
      { value: "Subtle", prompt: "subtle, low-pressure calls to action" },
      { value: "Standard", prompt: "clear, standard calls to action" },
      {
        value: "Urgent",
        prompt: "urgent, high-conversion CTAs with action words",
      },
    ],
  },
  goal: {
    label: "Primary Goal",
    subtitle: "What should visitors do?",
    icon: Target,
    promptKey: "primary_goal",
    choices: [
      {
        value: "Lead Generation",
        prompt: "optimized for capturing leads and contact info",
      },
      { value: "Sales", prompt: "optimized for driving product sales" },
      {
        value: "Bookings",
        prompt: "optimized for booking appointments or demos",
      },
      { value: "Email Signup", prompt: "optimized for growing email list" },
      {
        value: "Brand Awareness",
        prompt: "optimized for showcasing brand and building awareness",
      },
      {
        value: "Information",
        prompt: "optimized for providing information and educating visitors",
      },
    ],
  },
  industry: {
    label: "Industry",
    subtitle: "Your business category",
    icon: Building2,
    promptKey: "industry",
    choices: [
      { value: "Technology", prompt: "technology/software industry" },
      { value: "Healthcare", prompt: "healthcare/medical industry" },
      { value: "Finance", prompt: "finance/fintech industry" },
      { value: "Real Estate", prompt: "real estate industry" },
      { value: "Education", prompt: "education/e-learning industry" },
      { value: "E-commerce", prompt: "e-commerce/retail industry" },
      { value: "Agency", prompt: "agency/consulting industry" },
      { value: "Food & Restaurant", prompt: "food/restaurant industry" },
      { value: "Fitness", prompt: "fitness/wellness industry" },
      { value: "Creative", prompt: "creative/design industry" },
    ],
  },
  audience: {
    label: "Target Audience",
    subtitle: "Who are you building for?",
    icon: Users,
    promptKey: "target_audience",
    choices: [
      { value: "General", prompt: "general consumer audience" },
      { value: "B2B", prompt: "business professionals and decision makers" },
      {
        value: "Developers",
        prompt: "software developers and technical users",
      },
      { value: "Creatives", prompt: "designers and creative professionals" },
      {
        value: "Enterprise",
        prompt: "enterprise and large organization buyers",
      },
      { value: "Startups", prompt: "startup founders and entrepreneurs" },
      { value: "Young Adults", prompt: "young adults and millennials" },
    ],
  },
  sections: {
    label: "Sections",
    subtitle: "Page sections to include",
    icon: Layers,
    multi: true,
    promptKey: "sections",
    choices: [
      { value: "Hero", prompt: "hero section with headline and CTA" },
      { value: "Features", prompt: "features/benefits section" },
      { value: "How It Works", prompt: "how it works/process section" },
      { value: "Testimonials", prompt: "testimonials/reviews section" },
      { value: "Pricing", prompt: "pricing table section" },
      { value: "FAQ", prompt: "FAQ section" },
      { value: "Team", prompt: "team members section" },
      { value: "Gallery", prompt: "image gallery/portfolio section" },
      { value: "Stats", prompt: "statistics/metrics section" },
      { value: "Contact", prompt: "contact form section" },
      { value: "CTA", prompt: "final call-to-action section" },
    ],
  },
  layout: {
    label: "Layout",
    subtitle: "Content arrangement style",
    icon: Grid3X3,
    promptKey: "layout_type",
    choices: [
      { value: "Single Page", prompt: "single scrolling page" },
      { value: "Card Grid", prompt: "card-based grid layout" },
      { value: "Asymmetric", prompt: "creative asymmetric layout" },
      { value: "Centered", prompt: "centered content layout" },
    ],
  },
  density: {
    label: "Spacing",
    subtitle: "Whitespace and breathing room",
    icon: Maximize,
    promptKey: "visual_density",
    choices: [
      { value: "Spacious", prompt: "very spacious with lots of whitespace" },
      { value: "Balanced", prompt: "balanced spacing" },
      { value: "Compact", prompt: "compact with denser content" },
    ],
  },
  corners: {
    label: "Corner Style",
    subtitle: "Border radius for elements",
    icon: Circle,
    promptKey: "corner_style",
    choices: [
      { value: "Sharp", prompt: "sharp square corners" },
      { value: "Slightly Rounded", prompt: "slightly rounded corners (4-8px)" },
      { value: "Rounded", prompt: "rounded corners (12-16px)" },
      { value: "Pill", prompt: "fully rounded pill-shaped elements" },
    ],
  },
  images: {
    label: "Images",
    subtitle: "Visual content approach",
    icon: Image,
    promptKey: "image_style",
    choices: [
      {
        value: "Placeholders",
        prompt: "placeholder images from Unsplash or similar",
      },
      { value: "Abstract", prompt: "abstract geometric shapes and patterns" },
      { value: "Illustrations", prompt: "illustrated graphics" },
      { value: "Icons Only", prompt: "icon-based with minimal images" },
      { value: "None", prompt: "no images, text-focused" },
    ],
  },
  animation: {
    label: "Animation",
    subtitle: "Motion and transitions",
    icon: Zap,
    promptKey: "animation_level",
    choices: [
      { value: "None", prompt: "no animations" },
      { value: "Subtle", prompt: "subtle fade and slide animations" },
      { value: "Moderate", prompt: "moderate animations with scroll effects" },
      { value: "Rich", prompt: "rich animations and micro-interactions" },
    ],
  },
  socialProof: {
    label: "Social Proof",
    subtitle: "Trust-building elements",
    icon: Award,
    promptKey: "social_proof",
    choices: [
      { value: "None", prompt: "no social proof elements" },
      { value: "Testimonials", prompt: "customer testimonial quotes" },
      { value: "Logos", prompt: "client/partner logo grid" },
      {
        value: "Stats",
        prompt: "statistics and metrics (e.g., '10,000+ users')",
      },
      { value: "Reviews", prompt: "star ratings and review snippets" },
    ],
  },
  stickyElements: {
    label: "Sticky UI",
    subtitle: "Fixed interface elements",
    icon: Pin,
    multi: true,
    promptKey: "sticky_elements",
    choices: [
      { value: "Header", prompt: "sticky navigation header" },
      { value: "CTA Button", prompt: "floating CTA button" },
      { value: "Chat Widget", prompt: "chat widget button" },
      { value: "Back to Top", prompt: "back to top button" },
    ],
  },
  framework: {
    label: "CSS Output",
    subtitle: "Styling approach",
    icon: Code,
    promptKey: "css_framework",
    choices: [
      {
        value: "Vanilla CSS",
        prompt: "plain HTML and CSS with CSS custom properties",
      },
      {
        value: "Tailwind Classes",
        prompt: "using Tailwind CSS utility classes",
      },
    ],
  },
  accessibility: {
    label: "Accessibility",
    subtitle: "WCAG compliance level",
    icon: Accessibility,
    promptKey: "accessibility_level",
    choices: [
      { value: "Basic", prompt: "basic accessibility" },
      { value: "Standard", prompt: "WCAG AA compliant accessibility" },
      {
        value: "Enhanced",
        prompt: "enhanced WCAG AAA accessibility with ARIA labels",
      },
    ],
  },
  creativity: {
    label: "AI Creativity",
    subtitle: "How experimental to be",
    icon: Lightbulb,
    promptKey: "creativity_level",
    choices: [
      {
        value: "Conservative",
        prompt: "conservative, using proven design patterns",
      },
      {
        value: "Balanced",
        prompt: "balanced mix of classic and creative elements",
      },
      {
        value: "Experimental",
        prompt: "experimental and unique design choices",
      },
    ],
  },
  inspiration: {
    label: "Inspiration",
    subtitle: "Design reference style",
    icon: Compass,
    promptKey: "design_inspiration",
    choices: [
      {
        value: "Modern Startup",
        prompt: "inspired by modern startup websites (Linear, Vercel)",
      },
      {
        value: "Apple",
        prompt: "inspired by Apple's minimal, premium aesthetic",
      },
      {
        value: "Stripe",
        prompt: "inspired by Stripe's developer-focused clean design",
      },
      { value: "Editorial", prompt: "inspired by editorial/magazine layouts" },
      { value: "Brutalist", prompt: "inspired by brutalist web design" },
    ],
  },
};

// Category order for display (customColors shown only when palette is "Custom")
const CATEGORIES = [
  "template",
  "style",
  "palette",
  "mode",
  "font",
  "tone",
  "copyLength",
  "cta",
  "goal",
  "industry",
  "audience",
  "sections",
  "layout",
  "density",
  "corners",
  "images",
  "animation",
  "socialProof",
  "stickyElements",
  "framework",
  "accessibility",
  "creativity",
  "inspiration",
];

function Home() {
  const { user, isAuthenticated, profile } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState(null);

  // Initialize selections as empty (no defaults)
  const [selections, setSelections] = useState(() => {
    const initial = {};
    Object.entries(OPTIONS).forEach(([key, opt]) => {
      if (opt.multi) {
        initial[key] = []; // Empty array for multi-select
      } else if (opt.isColorPicker) {
        // Initialize custom colors with their defaults
        initial[key] = {};
        opt.fields.forEach((field) => {
          initial[key][field.key] = field.default;
        });
      } else {
        initial[key] = null; // Null for single-select (nothing selected)
      }
    });
    return initial;
  });

  // UI State
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1);
  const [showTokenOverlay, setShowTokenOverlay] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [showCode, setShowCode] = useState(false);

  // Modals
  const [showAuth, setShowAuth] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const inputRef = useRef(null);

  // Check if a category has a selection (not null/empty)
  const hasSelection = (key) => {
    const opt = OPTIONS[key];
    if (!opt) return false;
    if (opt.multi) {
      return selections[key]?.length > 0;
    }
    if (opt.isColorPicker) {
      return selections.palette === "Custom";
    }
    return selections[key] !== null && selections[key] !== undefined;
  };

  // Get display value for a selection
  const getDisplayValue = (key) => {
    const opt = OPTIONS[key];
    if (opt.multi) {
      const count = selections[key]?.length || 0;
      if (count === 0) return null;
      if (count === 1) return selections[key][0];
      return `${count} selected`;
    }
    return selections[key];
  };

  // Build the full prompt for AI - only includes selected options
  const buildFullPrompt = () => {
    const s = selections;

    // Get prompt text for a selection, returns null if not selected
    const getPromptText = (key) => {
      const opt = OPTIONS[key];
      if (!opt) return null;

      if (opt.multi) {
        if (!selections[key] || selections[key].length === 0) return null;
        const items = selections[key].map((val) => {
          const choice = opt.choices.find((c) => c.value === val);
          return choice?.prompt || val;
        });
        return items.join(", ");
      }

      if (selections[key] === null || selections[key] === undefined)
        return null;
      const choice = opt.choices.find((c) => c.value === selections[key]);
      return choice?.prompt || selections[key];
    };

    // Build conditional line - only add if selection exists
    const addLine = (label, key) => {
      const text = getPromptText(key);
      return text ? `- ${label}: ${text}` : null;
    };

    // Template line (required for basic structure)
    const templateText = getPromptText("template");
    const templateLine = templateText ? `a ${templateText}` : "a";

    // Build design specs - only include selected ones
    const designSpecs = [
      addLine("Style", "style"),
      addLine("Colors", "palette"),
      // Add custom colors if palette is "Custom"
      s.palette === "Custom" && s.customColors
        ? `- Custom Colors: primary ${s.customColors.primary}, secondary ${s.customColors.secondary}, accent ${s.customColors.accent}, background ${s.customColors.background}, text ${s.customColors.text}`
        : null,
      addLine("Mode", "mode"),
      addLine("Typography", "font"),
      addLine("Corners", "corners"),
      addLine("Spacing", "density"),
      addLine("Layout", "layout"),
      addLine("Inspiration", "inspiration"),
    ].filter(Boolean);

    // Build content specs
    const contentSpecs = [
      addLine("Brand Voice", "tone"),
      addLine("Copy Length", "copyLength"),
      addLine("CTA Style", "cta"),
      addLine("Primary Goal", "goal"),
      addLine("Industry", "industry"),
      addLine("Target Audience", "audience"),
    ].filter(Boolean);

    // Build sections list
    const sectionsText =
      s.sections && s.sections.length > 0
        ? s.sections
            .map(
              (sec) =>
                `- ${
                  OPTIONS.sections.choices.find((c) => c.value === sec)
                    ?.prompt || sec
                }`
            )
            .join("\n")
        : null;

    // Build sticky elements
    const stickyText =
      s.stickyElements && s.stickyElements.length > 0
        ? s.stickyElements
            .map(
              (el) =>
                `- ${
                  OPTIONS.stickyElements.choices.find((c) => c.value === el)
                    ?.prompt || el
                }`
            )
            .join("\n")
        : null;

    // Build visual specs
    const visualSpecs = [
      addLine("Images", "images"),
      addLine("Animations", "animation"),
      addLine("Social Proof", "socialProof"),
    ].filter(Boolean);

    // Build technical specs
    const techSpecs = [
      addLine("CSS", "framework"),
      addLine("Accessibility", "accessibility"),
    ].filter(Boolean);

    // Creative direction
    const creativityText = getPromptText("creativity");

    // Assemble the prompt - only include sections that have content
    let promptParts = [
      `Create ${templateLine} website.`,
      "",
      `USER DESCRIPTION: ${prompt}`,
    ];

    if (designSpecs.length > 0) {
      promptParts.push("", "DESIGN SPECIFICATIONS:", ...designSpecs);
    }

    if (contentSpecs.length > 0) {
      promptParts.push("", "CONTENT & BRAND:", ...contentSpecs);
    }

    if (sectionsText) {
      promptParts.push("", "PAGE SECTIONS (in this order):", sectionsText);
    }

    if (visualSpecs.length > 0) {
      promptParts.push("", "VISUAL ELEMENTS:", ...visualSpecs);
    }

    if (stickyText) {
      promptParts.push("", "UI ELEMENTS:", stickyText);
    }

    if (techSpecs.length > 0) {
      promptParts.push("", "TECHNICAL:", ...techSpecs);
    }

    if (creativityText) {
      promptParts.push(
        "",
        "CREATIVE DIRECTION:",
        `- Creativity Level: ${creativityText}`
      );
    }

    promptParts.push(
      "",
      `REQUIREMENTS:
1. Return a complete, production-ready HTML file with embedded CSS and JavaScript
2. Must be fully responsive (mobile, tablet, desktop)
3. Use semantic HTML5 elements
4. Include proper meta tags
5. Apply the design specifications consistently
6. Make it visually polished and professional

Return ONLY the HTML code, no explanations.`
    );

    return promptParts.join("\n");
  };

  // Token calculation
  const tokenCost = useMemo(() => {
    return calculateTokenCost(prompt, {
      templateType: selections.template?.toLowerCase(),
      stylePreset: selections.style?.toLowerCase(),
      darkMode: selections.mode === "Dark",
      selectedSections: selections.sections,
      layoutType: selections.layout?.toLowerCase(),
      imageStyle: selections.images?.toLowerCase(),
      framework: selections.framework?.toLowerCase(),
      colorPalette: selections.palette?.toLowerCase(),
      advancedOptions: [],
    });
  }, [prompt, selections]);

  const userTokens = profile?.tokens || 0;
  const tokenBalance = checkTokenBalance(userTokens, tokenCost.cost);

  // Get categories with selections for pills display
  const getActiveCategories = () => {
    return CATEGORIES.filter((key) => hasSelection(key)).map((key) => ({
      key,
      label: OPTIONS[key].label,
      value: getDisplayValue(key),
    }));
  };

  const activeCategories = getActiveCategories();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeAllOverlays();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const closeAllOverlays = () => {
    setShowOverlay(false);
    setActiveOption(null);
    setShowTokenOverlay(false);
  };

  const handleSelect = (optionKey, value) => {
    const opt = OPTIONS[optionKey];
    if (opt.multi) {
      setSelections((prev) => ({
        ...prev,
        [optionKey]: prev[optionKey].includes(value)
          ? prev[optionKey].filter((v) => v !== value)
          : [...prev[optionKey], value],
      }));
    } else {
      setSelections((prev) => ({ ...prev, [optionKey]: value }));
      // Go back to categories after single selection
      setTimeout(() => {
        setSlideDirection(-1);
        setActiveOption(null);
      }, 120);
    }
  };

  const resetSelection = (key) => {
    const opt = OPTIONS[key];
    if (opt.multi) {
      setSelections((prev) => ({ ...prev, [key]: [] }));
    } else {
      setSelections((prev) => ({ ...prev, [key]: null }));
    }
  };

  const openOptionFromPill = (key) => {
    setSlideDirection(1);
    setActiveOption(key);
    setShowOverlay(true);
    setShowTokenOverlay(false);
  };

  const goToCategories = () => {
    setSlideDirection(-1);
    setActiveOption(null);
  };

  const selectCategory = (id) => {
    setSlideDirection(1);
    setActiveOption(id);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!isAuthenticated) {
      setPendingAction(() => handleGenerate);
      setShowAuth(true);
      return;
    }

    if (userTokens < tokenCost.cost) {
      setShowTokens(true);
      return;
    }

    setIsGenerating(true);
    closeAllOverlays();

    const fullPrompt = buildFullPrompt();
    console.log("Full prompt:", fullPrompt);

    try {
      const response = await fetch("/api/generate-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          customization: selections,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedHtml(data.html);
      } else {
        setGeneratedHtml(generateDemo());
      }
    } catch {
      setGeneratedHtml(generateDemo());
    } finally {
      setIsGenerating(false);
      setShowPreview(true);
    }
  };

  const generateDemo = () => {
    const s = selections;
    const paletteOpt = OPTIONS.palette.choices.find(
      (c) => c.value === s.palette
    );
    const colors = paletteOpt?.colors || ["#1e40af", "#3b82f6", "#93c5fd"];
    const primaryColor = colors[1];
    const isDark = s.mode === "Dark";
    const bg = isDark ? "#09090b" : "#ffffff";
    const text = isDark ? "#fafafa" : "#09090b";
    const muted = isDark ? "#a1a1aa" : "#71717a";
    const surface = isDark ? "#18181b" : "#f4f4f5";
    const border = isDark ? "#27272a" : "#e4e4e7";

    const fontMap = {
      "Sans-serif": "'Inter', system-ui, sans-serif",
      Serif: "'Playfair Display', Georgia, serif",
      Geometric: "'Space Grotesk', system-ui, sans-serif",
      Rounded: "'Poppins', system-ui, sans-serif",
      Monospace: "'JetBrains Mono', monospace",
    };
    const fontFam = fontMap[s.font] || fontMap["Sans-serif"];

    const radiusMap = {
      Sharp: "0",
      "Slightly Rounded": "6px",
      Rounded: "12px",
      Pill: "9999px",
    };
    const radius = radiusMap[s.corners] || "12px";

    const hasSticky = s.stickyElements.includes("Header");
    const hasFloatingCta = s.stickyElements.includes("CTA Button");
    const hasChat = s.stickyElements.includes("Chat Widget");

    const ctaText =
      s.cta === "Urgent"
        ? "Get Started Now →"
        : s.cta === "Subtle"
        ? "Learn More"
        : "Get Started";

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${prompt.split(" ").slice(0, 5).join(" ") || "Website"}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --primary:${primaryColor};
  --primary-dark:${colors[0]};
  --primary-light:${colors[2]};
  --bg:${bg};
  --text:${text};
  --muted:${muted};
  --surface:${surface};
  --border:${border};
  --radius:${radius};
  --font:${fontFam};
}
html{scroll-behavior:smooth}
body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
.container{max-width:1120px;margin:0 auto;padding:0 24px}

nav{position:${
      hasSticky ? "fixed" : "relative"
    };top:0;left:0;right:0;padding:16px 0;background:${
      isDark ? "rgba(9,9,11,0.8)" : "rgba(255,255,255,0.8)"
    };backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid var(--border);z-index:100}
nav .container{display:flex;justify-content:space-between;align-items:center}
.logo{font-weight:700;font-size:1.25rem;color:var(--text)}
.nav-links{display:flex;gap:32px;list-style:none}
.nav-links a{color:var(--muted);text-decoration:none;font-size:0.875rem;font-weight:500;transition:color 0.15s}
.nav-links a:hover{color:var(--text)}
.nav-cta{padding:10px 20px;background:var(--primary);color:#fff;text-decoration:none;border-radius:var(--radius);font-size:0.875rem;font-weight:600;transition:background 0.15s}
.nav-cta:hover{background:var(--primary-dark)}

.hero{min-height:100vh;display:flex;align-items:center;padding:${
      hasSticky ? "120px 0 80px" : "80px 0"
    }}
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

${
  hasFloatingCta
    ? `.floating-cta{position:fixed;bottom:24px;right:24px;padding:14px 24px;background:var(--primary);color:#fff;border-radius:9999px;font-weight:600;text-decoration:none;box-shadow:0 4px 24px rgba(0,0,0,0.15);z-index:99}`
    : ""
}
${
  hasChat
    ? `.chat-btn{position:fixed;bottom:24px;${
        hasFloatingCta ? "right:180px" : "right:24px"
      };width:56px;height:56px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;box-shadow:0 4px 24px rgba(0,0,0,0.15);z-index:99;cursor:pointer;border:none}`
    : ""
}

@media(max-width:768px){
  .nav-links{display:none}
  .hero h1{font-size:2rem}
  .features-grid{grid-template-columns:1fr}
  .footer-content{flex-direction:column;text-align:center}
  .cta-section{margin:0 16px;padding:60px 24px}
}

${
  s.animation !== "None"
    ? `
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.hero-content{animation:fadeUp 0.5s ease-out}
.feature{animation:fadeUp 0.5s ease-out backwards}
.feature:nth-child(1){animation-delay:0.1s}
.feature:nth-child(2){animation-delay:0.2s}
.feature:nth-child(3){animation-delay:0.3s}
`
    : ""
}
</style>
</head>
<body>

<nav>
  <div class="container">
    <div class="logo">${prompt.split(" ")[0] || "Brand"}</div>
    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <a href="#cta" class="nav-cta">${ctaText}</a>
  </div>
</nav>

<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h1>${prompt || "Build Something Amazing"}</h1>
      <p>${
        s.copyLength === "Minimal"
          ? "Transform your ideas into reality."
          : s.copyLength === "Detailed"
          ? "Transform your ideas into reality with our powerful platform. We provide everything you need to create, launch, and grow your digital presence. Join thousands of satisfied customers who have already made the switch."
          : "Transform your ideas into reality with our powerful platform. Start building today and see what's possible."
      }</p>
      <div class="hero-btns">
        <a href="#cta" class="btn btn-primary">${ctaText}</a>
        <a href="#features" class="btn btn-secondary">Learn More</a>
      </div>
    </div>
  </div>
</section>

<section class="features" id="features">
  <div class="container">
    <div class="section-header">
      <h2>Why Choose Us</h2>
      <p>Everything you need to succeed</p>
    </div>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Lightning Fast</h3>
        <p>Optimized for speed and performance.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🎨</div>
        <h3>Beautiful Design</h3>
        <p>Stunning visuals that capture attention.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Fully Responsive</h3>
        <p>Looks perfect on every device.</p>
      </div>
    </div>
  </div>
</section>

<section id="cta">
  <div class="cta-section">
    <h2>Ready to Get Started?</h2>
    <p>Join thousands of satisfied customers today.</p>
    <a href="#" class="btn">${
      s.cta === "Urgent" ? "Start Free Now →" : "Get Started"
    }</a>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-content">
      <div class="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>
      <div class="footer-copy">© ${new Date().getFullYear()} ${
      prompt.split(" ")[0] || "Brand"
    }</div>
    </div>
  </div>
</footer>

${
  hasFloatingCta
    ? `<a href="#cta" class="floating-cta">${
        s.cta === "Urgent" ? "Try Free →" : "Get Started"
      }</a>`
    : ""
}
${hasChat ? `<button class="chat-btn">💬</button>` : ""}

</body>
</html>`;
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const breakdown = getBreakdownDisplay(tokenCost.breakdown);

  return (
    <div className="home">
      <div className="home__center">
        {/* Search Bar */}
        <motion.div
          className="home__search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your website..."
            className="home__input"
          />
          <div className="home__search-right">
            <AnimatePresence>
              {prompt.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className={`home__token-btn ${
                    showTokenOverlay ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowTokenOverlay(!showTokenOverlay);
                    setShowOverlay(false);
                    setActiveOption(null);
                  }}
                >
                  <Coins size={14} />
                  <span>{tokenCost.cost}</span>
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              className={`home__gear-btn ${showOverlay ? "active" : ""}`}
              onClick={() => {
                setShowOverlay(!showOverlay);
                setShowTokenOverlay(false);
                if (showOverlay) setActiveOption(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={18} />
            </motion.button>
            <motion.button
              className="home__submit"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isGenerating ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <Sparkles size={16} />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Active Selection Pills */}
        <AnimatePresence mode="popLayout">
          {activeCategories.length > 0 && (
            <motion.div
              className="home__active-pills"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="popLayout">
                {activeCategories.map((cat) => (
                  <motion.button
                    key={cat.key}
                    className="home__active-pill"
                    onClick={() => openOptionFromPill(cat.key)}
                    variants={activePillVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover="hover"
                    layout
                  >
                    <span className="home__active-pill-label">{cat.label}</span>
                    <span className="home__active-pill-value">{cat.value}</span>
                    <span
                      className="home__active-pill-x"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetSelection(cat.key);
                      }}
                    >
                      <X size={12} />
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Options Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="home__overlay"
            onClick={closeAllOverlays}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="home__overlay-content"
              onClick={(e) => e.stopPropagation()}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <AnimatePresence mode="wait" custom={slideDirection}>
                {!activeOption ? (
                  <motion.div
                    key="categories"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="home__category-pills"
                  >
                    <motion.div
                      className="home__pills-grid"
                      variants={pillContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {CATEGORIES.map((catKey) => {
                        const opt = OPTIONS[catKey];
                        const Icon = opt.icon;
                        const isSelected = hasSelection(catKey);

                        return (
                          <motion.button
                            key={catKey}
                            className={`home__category-pill ${
                              isSelected ? "home__category-pill--active" : ""
                            }`}
                            onClick={() => selectCategory(catKey)}
                            variants={pillVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Icon size={15} />
                            <span>{opt.label}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                    <motion.button
                      className="home__close-overlay"
                      onClick={closeAllOverlays}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Done
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="choices"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="home__option-choices"
                  >
                    <motion.div
                      className="home__option-header"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 }}
                    >
                      <motion.button
                        className="home__back-btn"
                        onClick={goToCategories}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ←
                      </motion.button>
                      <div className="home__option-header-text">
                        <span className="home__option-header-label">
                          {OPTIONS[activeOption]?.label}
                        </span>
                        {OPTIONS[activeOption]?.subtitle && (
                          <span className="home__option-header-subtitle">
                            {OPTIONS[activeOption]?.subtitle}
                          </span>
                        )}
                      </div>
                    </motion.div>
                    <motion.div
                      className="home__choice-pills"
                      variants={pillContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {OPTIONS[activeOption]?.choices.map((choice) => {
                        const isMulti = OPTIONS[activeOption].multi;
                        const isSelected = isMulti
                          ? selections[activeOption]?.includes(choice.value)
                          : selections[activeOption] === choice.value;

                        // Color palette with swatches
                        if (activeOption === "palette" && choice.colors) {
                          return (
                            <motion.button
                              key={choice.value}
                              className={`home__choice-pill home__choice-pill--color ${
                                isSelected ? "active" : ""
                              }`}
                              onClick={() =>
                                handleSelect(activeOption, choice.value)
                              }
                              variants={pillVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <div className="home__color-dots">
                                {choice.colors.map((c, i) => (
                                  <span key={i} style={{ background: c }} />
                                ))}
                              </div>
                              <span>{choice.value}</span>
                            </motion.button>
                          );
                        }

                        // Custom color option
                        if (activeOption === "palette" && choice.isCustom) {
                          return (
                            <motion.button
                              key={choice.value}
                              className={`home__choice-pill home__choice-pill--color ${
                                isSelected ? "active" : ""
                              }`}
                              onClick={() =>
                                handleSelect(activeOption, choice.value)
                              }
                              variants={pillVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              <div className="home__color-dots home__color-dots--custom">
                                <span
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)",
                                  }}
                                />
                              </div>
                              <span>{choice.value}</span>
                            </motion.button>
                          );
                        }

                        return (
                          <motion.button
                            key={choice.value}
                            className={`home__choice-pill ${
                              isSelected ? "active" : ""
                            }`}
                            onClick={() =>
                              handleSelect(activeOption, choice.value)
                            }
                            variants={pillVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            {choice.value}
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    {/* Custom Color Picker - shows when Custom palette is selected */}
                    {activeOption === "palette" &&
                      selections.palette === "Custom" && (
                        <motion.div
                          className="home__custom-colors"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="home__custom-colors-grid">
                            {OPTIONS.customColors.fields.map((field) => (
                              <div
                                key={field.key}
                                className="home__color-field"
                              >
                                <label>{field.label}</label>
                                <div className="home__color-input-wrapper">
                                  <input
                                    type="color"
                                    value={
                                      selections.customColors?.[field.key] ||
                                      field.default
                                    }
                                    onChange={(e) => {
                                      setSelections((prev) => ({
                                        ...prev,
                                        customColors: {
                                          ...prev.customColors,
                                          [field.key]: e.target.value,
                                        },
                                      }));
                                    }}
                                  />
                                  <span className="home__color-value">
                                    {selections.customColors?.[field.key] ||
                                      field.default}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                    {OPTIONS[activeOption]?.multi && (
                      <motion.button
                        className="home__done-btn"
                        onClick={goToCategories}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Done
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token Overlay */}
      <AnimatePresence>
        {showTokenOverlay && (
          <motion.div
            className="home__overlay"
            onClick={closeAllOverlays}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="home__overlay-content home__overlay-content--token"
              onClick={(e) => e.stopPropagation()}
              variants={tokenContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="home__token-header"
                variants={tokenItemVariants}
              >
                <Coins size={18} />
                <span className="home__token-total">
                  {tokenCost.cost} tokens
                </span>
              </motion.div>
              <motion.div className="home__token-breakdown">
                {breakdown.map((item, i) => (
                  <motion.div
                    key={i}
                    className={`home__token-item ${
                      item.type === "discount" ? "discount" : ""
                    }`}
                    variants={tokenItemVariants}
                  >
                    <span>{item.label}</span>
                    <span>
                      {item.type === "discount" ? "-" : "+"}
                      {item.cost}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
              {isAuthenticated && (
                <motion.div
                  className="home__token-balance"
                  variants={tokenItemVariants}
                >
                  <span>Your balance</span>
                  <span
                    className={`home__balance-value home__balance-value--${tokenBalance.status}`}
                  >
                    {userTokens} tokens
                  </span>
                </motion.div>
              )}
              {(!isAuthenticated || userTokens < tokenCost.cost) && (
                <motion.button
                  className="home__buy-btn"
                  onClick={() => {
                    closeAllOverlays();
                    setShowTokens(true);
                  }}
                  variants={tokenItemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Get More Tokens
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && generatedHtml && (
          <motion.div
            className="preview-modal"
            onClick={() => setShowPreview(false)}
            variants={previewModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="preview-modal__content"
              onClick={(e) => e.stopPropagation()}
              variants={previewContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="preview-modal__header">
                <div className="preview-modal__tabs">
                  <button
                    className={!showCode ? "active" : ""}
                    onClick={() => setShowCode(false)}
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    className={showCode ? "active" : ""}
                    onClick={() => setShowCode(true)}
                  >
                    <Code2 size={14} /> Code
                  </button>
                </div>
                <div className="preview-modal__devices">
                  <button
                    className={previewDevice === "desktop" ? "active" : ""}
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor size={15} />
                  </button>
                  <button
                    className={previewDevice === "tablet" ? "active" : ""}
                    onClick={() => setPreviewDevice("tablet")}
                  >
                    <Tablet size={15} />
                  </button>
                  <button
                    className={previewDevice === "mobile" ? "active" : ""}
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone size={15} />
                  </button>
                </div>
                <div className="preview-modal__actions">
                  <button onClick={handleGenerate} disabled={isGenerating}>
                    <RotateCcw size={15} />
                  </button>
                  <button onClick={handleDownload}>
                    <Download size={15} />
                  </button>
                  <button
                    className="preview-modal__deploy"
                    onClick={() => setShowDeploy(true)}
                  >
                    <Rocket size={14} /> Deploy
                  </button>
                  <button
                    className="preview-modal__close"
                    onClick={() => setShowPreview(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="preview-modal__body">
                <AnimatePresence mode="wait">
                  {showCode ? (
                    <motion.div
                      key="code"
                      className="preview-modal__code"
                      variants={fadeInOutVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <pre>
                        <code>{generatedHtml}</code>
                      </pre>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      className={`preview-modal__frame preview-modal__frame--${previewDevice}`}
                      variants={fadeInOutVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <iframe
                        srcDoc={generatedHtml}
                        title="Preview"
                        sandbox="allow-scripts"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="preview-modal__enhance">
                <input
                  type="text"
                  placeholder="Describe changes..."
                  className="preview-modal__enhance-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      setPrompt((prev) => prev + ". " + e.target.value);
                      e.target.value = "";
                      handleGenerate();
                    }
                  }}
                />
                <ChevronRight size={16} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => {
          setShowAuth(false);
          setPendingAction(null);
        }}
        onAuthSuccess={() => {
          setShowAuth(false);
          pendingAction?.();
          setPendingAction(null);
        }}
      />
      {showTokens && (
        <TokenPurchaseModal
          isOpen={showTokens}
          onClose={() => setShowTokens(false)}
        />
      )}
      {showDeploy && (
        <DeployModal
          isOpen={showDeploy}
          onClose={() => setShowDeploy(false)}
          htmlContent={generatedHtml}
          projectName={
            prompt.split(" ").slice(0, 3).join("-").toLowerCase() || "my-site"
          }
        />
      )}
    </div>
  );
}

export default Home;
