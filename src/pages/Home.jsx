// Home.jsx - Options flow back to categories, with icons and prompt building
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  X,
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
  Award,
  Layers,
  Grid3X3,
  Palette,
  Maximize,
  Maximize2,
  Circle,
  Image,
  Zap,
  Code,
  Accessibility,
  Pin,
  Lightbulb,
  Compass,
  Globe,
  Trash2,
  HelpCircle,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";
import AuthModal from "../components/AuthModal";
import TokenPurchaseModal from "../components/TokenPurchaseModal";
import DeployModal from "../components/DeployModal";
import GeneratedPreview from "../components/GeneratedPreview";
import {
  calculateTokenCost,
  checkTokenBalance,
  getBreakdownDisplay,
} from "../utils/tokenCalculator";
import MetallicBlob from "../components/MetallicBlob";
import "./Home.scss";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// ==================== ANIMATION VARIANTS ====================

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const pillContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  hover: { y: -1, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

const activePillVariants = {
  hidden: { opacity: 0, scale: 0.9, x: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, scale: 0.9, x: -8, transition: { duration: 0.15 } },
  hover: { x: 2, transition: { duration: 0.15 } },
};

const tokenContentVariants = {
  hidden: { opacity: 0, y: 8 },
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
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};

const tokenItemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 24 : -24, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: (direction) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  }),
};

const previewOverlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const previewContentVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.2 } },
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
      { value: "Multi Page", prompt: "multi-page website" },
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
      { value: "Neumorphism", prompt: "soft ui" },
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
  const [showHelp, setShowHelp] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("generatedHtml") || null;
    }
    return null;
  });
  const [localTokens, setLocalTokens] = useState(null);

  // Use ref to track if we just completed generation (prevents race conditions)
  const justGeneratedRef = useRef(false);

  // Persist generated HTML to sessionStorage
  useEffect(() => {
    if (generatedHtml) {
      sessionStorage.setItem("generatedHtml", generatedHtml);
    }
  }, [generatedHtml]);

  // Debug: log when key states change
  useEffect(() => {
    console.log(
      "[DEBUG] generatedHtml changed:",
      generatedHtml ? "has HTML" : "null"
    );
  }, [generatedHtml]);

  const [selections, setSelections] = useState(() => {
    const initial = {};
    Object.entries(OPTIONS).forEach(([key, opt]) => {
      if (opt.multi) {
        initial[key] = [];
      } else if (opt.isColorPicker) {
        initial[key] = {};
        opt.fields.forEach((field) => {
          initial[key][field.key] = field.default;
        });
      } else {
        initial[key] = null;
      }
    });
    return initial;
  });

  // UI State
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1);
  const [showTokenOverlay, setShowTokenOverlay] = useState(false);
  const [showPreview, setShowPreviewInternal] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("showPreview") === "true";
    }
    return false;
  });
  const [isPreviewMinimized, setIsPreviewMinimizedInternal] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("isPreviewMinimized") === "true";
    }
    return false;
  });
  const [showCode, setShowCode] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);

  // Wrapper functions to persist to sessionStorage
  const setShowPreview = (val) => {
    const newVal = typeof val === "function" ? val(showPreview) : val;
    console.log("[DEBUG] setShowPreview called with:", newVal);
    sessionStorage.setItem("showPreview", newVal.toString());
    setShowPreviewInternal(newVal);
  };

  const setIsPreviewMinimized = (val) => {
    const newVal = typeof val === "function" ? val(isPreviewMinimized) : val;
    sessionStorage.setItem("isPreviewMinimized", newVal.toString());
    setIsPreviewMinimizedInternal(newVal);
  };

  // Modals
  const [showAuth, setShowAuth] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const inputRef = useRef(null);
  const enhanceInputRef = useRef(null);
  const generationTimerRef = useRef(null);

  // Typewriter placeholder animation
  const examplePrompts = [
    "A modern portfolio site for a photographer with a dark theme...",
    "Landing page for an AI startup with gradient backgrounds...",
    "Restaurant website with online menu and reservation form...",
    "Personal blog with minimalist design and reading progress...",
    "SaaS dashboard landing page with pricing comparison...",
    "Creative agency site with bold typography and animations...",
  ];

  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const placeholderTimeoutRef = useRef(null);
  // Check if user has made any customizations
  const hasCustomizations = useMemo(() => {
    return Object.entries(selections).some(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length > 0;
      }
      return value !== null;
    });
  }, [selections]);

  const showPlaceholderAnimation = !prompt && !isGenerating;

  // Update the useEffect for typewriter timing:

  useEffect(() => {
    if (!showPlaceholderAnimation) {
      setPlaceholderText("");
      return;
    }

    const currentPrompt = examplePrompts[placeholderIndex];

    const typeCharacter = () => {
      if (isTyping) {
        // Typing forward
        if (charIndex < currentPrompt.length) {
          setPlaceholderText(currentPrompt.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
          placeholderTimeoutRef.current = setTimeout(
            typeCharacter,
            10 + Math.random() * 20 // Typing speed
          );
        } else {
          // Finished typing, wait 1 second then start erasing
          placeholderTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            typeCharacter();
          }, 1000); // Wait 1 second before erasing
        }
      } else {
        // Erasing
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
          setPlaceholderText(currentPrompt.slice(0, charIndex - 1));
          placeholderTimeoutRef.current = setTimeout(typeCharacter, 20); // Erasing speed
        } else {
          // Finished erasing, wait 1 second then start typing next prompt
          placeholderTimeoutRef.current = setTimeout(() => {
            setPlaceholderIndex((prev) => (prev + 1) % examplePrompts.length);
            setIsTyping(true);
            placeholderTimeoutRef.current = setTimeout(typeCharacter, 1000); // Wait 1 second before typing next
          }, 1000); // Wait 1 second after erasing before moving to next prompt
        }
      }
    };

    placeholderTimeoutRef.current = setTimeout(typeCharacter, 100); // Initial delay

    return () => {
      if (placeholderTimeoutRef.current) {
        clearTimeout(placeholderTimeoutRef.current);
      }
    };
  }, [showPlaceholderAnimation, placeholderIndex, charIndex, isTyping]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (placeholderTimeoutRef.current) {
        clearTimeout(placeholderTimeoutRef.current);
      }
    };
  }, []);

  // Reset typewriter when user starts typing
  useEffect(() => {
    if (prompt.trim()) {
      setPlaceholderText("");
      if (placeholderTimeoutRef.current) {
        clearTimeout(placeholderTimeoutRef.current);
      }
    } else if (!hasCustomizations && !isGenerating) {
      // Restart the typewriter effect
      setPlaceholderIndex(0);
      setCharIndex(0);
      setIsTyping(true);
    }
  }, [prompt, hasCustomizations, isGenerating]);

  // Generation timer
  useEffect(() => {
    if (isGenerating) {
      setGenerationTime(0);
      generationTimerRef.current = setInterval(() => {
        setGenerationTime((t) => t + 1);
      }, 1000);
    } else {
      if (generationTimerRef.current) {
        clearInterval(generationTimerRef.current);
        generationTimerRef.current = null;
      }
    }
    return () => {
      if (generationTimerRef.current) {
        clearInterval(generationTimerRef.current);
      }
    };
  }, [isGenerating]);

  const getEstimatedTime = () => {
    const avgTime = 20; // Average generation time in seconds
    const remaining = Math.max(0, avgTime - generationTime);
    if (generationTime < 5) return "Initializing...";
    if (remaining > 0) return `~${remaining}s remaining`;
    return "Almost done...";
  };

  const hasSelection = (key) => {
    const opt = OPTIONS[key];
    if (!opt) return false;
    if (opt.multi) return selections[key]?.length > 0;
    if (opt.isColorPicker) return selections.palette === "Custom";
    return selections[key] !== null && selections[key] !== undefined;
  };

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

  const buildFullPrompt = () => {
    const s = selections;

    const getPromptText = (key) => {
      const opt = OPTIONS[key];
      if (!opt) return null;
      if (opt.multi) {
        if (!selections[key] || selections[key].length === 0) return null;
        return selections[key]
          .map((val) => {
            const choice = opt.choices.find((c) => c.value === val);
            return choice?.prompt || val;
          })
          .join(", ");
      }
      if (selections[key] === null || selections[key] === undefined)
        return null;
      const choice = opt.choices.find((c) => c.value === selections[key]);
      return choice?.prompt || selections[key];
    };

    const addLine = (label, key) => {
      const text = getPromptText(key);
      return text ? `- ${label}: ${text}` : null;
    };

    const templateText = getPromptText("template");
    const templateLine = templateText ? `a ${templateText}` : "a";

    const designSpecs = [
      addLine("Style", "style"),
      addLine("Colors", "palette"),
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

    const contentSpecs = [
      addLine("Brand Voice", "tone"),
      addLine("Copy Length", "copyLength"),
      addLine("CTA Style", "cta"),
      addLine("Primary Goal", "goal"),
      addLine("Industry", "industry"),
      addLine("Target Audience", "audience"),
    ].filter(Boolean);

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

    const visualSpecs = [
      addLine("Images", "images"),
      addLine("Animations", "animation"),
      addLine("Social Proof", "socialProof"),
    ].filter(Boolean);

    const techSpecs = [
      addLine("CSS", "framework"),
      addLine("Accessibility", "accessibility"),
    ].filter(Boolean);

    const creativityText = getPromptText("creativity");

    let promptParts = [
      `Create ${templateLine} website.`,
      "",
      `USER DESCRIPTION: ${prompt}`,
    ];

    if (designSpecs.length > 0)
      promptParts.push("", "DESIGN SPECIFICATIONS:", ...designSpecs);
    if (contentSpecs.length > 0)
      promptParts.push("", "CONTENT & BRAND:", ...contentSpecs);
    if (sectionsText)
      promptParts.push("", "PAGE SECTIONS (in this order):", sectionsText);
    if (visualSpecs.length > 0)
      promptParts.push("", "VISUAL ELEMENTS:", ...visualSpecs);
    if (stickyText) promptParts.push("", "UI ELEMENTS:", stickyText);
    if (techSpecs.length > 0) promptParts.push("", "TECHNICAL:", ...techSpecs);
    if (creativityText)
      promptParts.push(
        "",
        "CREATIVE DIRECTION:",
        `- Creativity Level: ${creativityText}`
      );

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

  const tokenCost = useMemo(() => {
    return calculateTokenCost(prompt, selections, false);
  }, [prompt, selections]);

  const userTokens = localTokens ?? profile?.tokens ?? 0;
  const tokenBalance = checkTokenBalance(userTokens, tokenCost.cost);

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
      if (e.key === "Escape") {
        if (showPreview) {
          setShowPreview(false);
          setIsPreviewMinimized(true);
        } else {
          closeAllOverlays();
        }
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showPreview]);

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

      // Only close overlay automatically for non-Custom selections
      // Keep it open for Custom colors so user can pick colors
      if (!(optionKey === "palette" && value === "Custom")) {
        setTimeout(() => {
          setSlideDirection(-1);
          setActiveOption(null);
        }, 120);
      }
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

    try {
      // Get session without triggering listeners
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        console.error("No access token");
        setIsGenerating(false);
        setShowAuth(true);
        return;
      }

      // Call the Supabase edge function
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/generate-website`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            customization: selections,
            isRefinement: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setShowTokens(true);
          setIsGenerating(false);
          return;
        }

        if (response.status === 401) {
          setShowAuth(true);
          setIsGenerating(false);
          return;
        }

        throw new Error(data.error || "Generation failed");
      }

      if (data.success && data.html) {
        console.log("[DEBUG] Generation successful, setting state...");

        // Update local token balance immediately
        if (typeof data.tokensRemaining === "number") {
          setLocalTokens(data.tokensRemaining);
        }

        // Mark that we just generated - prevents any race conditions
        justGeneratedRef.current = true;

        // Set the HTML and show preview
        setGeneratedHtml(data.html);
        setIsGenerating(false);
        setIsPreviewMinimized(false);
        setShowPreview(true);

        console.log(
          "[DEBUG] State set - showPreview: true, html length:",
          data.html.length
        );

        // Clear the flag after a short delay
        setTimeout(() => {
          justGeneratedRef.current = false;
          console.log("[DEBUG] Generation lock released");
        }, 1000);
      } else {
        throw new Error("No HTML returned");
      }
    } catch (error) {
      console.error("Generation error:", error);
      // Fallback to demo
      const demoHtml = generateDemo();
      setGeneratedHtml(demoHtml);
      setIsGenerating(false);
      setIsPreviewMinimized(false);
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
:root{--primary:${primaryColor};--primary-dark:${colors[0]};--primary-light:${
      colors[2]
    };--bg:${bg};--text:${text};--muted:${muted};--surface:${surface};--border:${border};--radius:${radius};--font:${fontFam}}
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
@media(max-width:768px){.nav-links{display:none}.hero h1{font-size:2rem}.features-grid{grid-template-columns:1fr}.footer-content{flex-direction:column;text-align:center}.cta-section{margin:0 16px;padding:60px 24px}}
${
  s.animation !== "None"
    ? `@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.hero-content{animation:fadeUp 0.5s ease-out}.feature{animation:fadeUp 0.5s ease-out backwards}.feature:nth-child(1){animation-delay:0.1s}.feature:nth-child(2){animation-delay:0.2s}.feature:nth-child(3){animation-delay:0.3s}`
    : ""
}
</style>
</head>
<body>
<nav><div class="container"><div class="logo">${
      prompt.split(" ")[0] || "Brand"
    }</div><ul class="nav-links"><li><a href="#features">Features</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul><a href="#cta" class="nav-cta">${ctaText}</a></div></nav>
<section class="hero"><div class="container"><div class="hero-content"><h1>${
      prompt || "Build Something Amazing"
    }</h1><p>${
      s.copyLength === "Minimal"
        ? "Transform your ideas into reality."
        : s.copyLength === "Detailed"
        ? "Transform your ideas into reality with our powerful platform. We provide everything you need to create, launch, and grow your digital presence. Join thousands of satisfied customers who have already made the switch."
        : "Transform your ideas into reality with our powerful platform. Start building today and see what's possible."
    }</p><div class="hero-btns"><a href="#cta" class="btn btn-primary">${ctaText}</a><a href="#features" class="btn btn-secondary">Learn More</a></div></div></div></section>
<section class="features" id="features"><div class="container"><div class="section-header"><h2>Why Choose Us</h2><p>Everything you need to succeed</p></div><div class="features-grid"><div class="feature"><div class="feature-icon">⚡</div><h3>Lightning Fast</h3><p>Optimized for speed and performance.</p></div><div class="feature"><div class="feature-icon">🎨</div><h3>Beautiful Design</h3><p>Stunning visuals that capture attention.</p></div><div class="feature"><div class="feature-icon">📱</div><h3>Fully Responsive</h3><p>Looks perfect on every device.</p></div></div></div></section>
<section id="cta"><div class="cta-section"><h2>Ready to Get Started?</h2><p>Join thousands of satisfied customers today.</p><a href="#" class="btn">${
      s.cta === "Urgent" ? "Start Free Now →" : "Get Started"
    }</a></div></section>
<footer><div class="container"><div class="footer-content"><div class="footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div><div class="footer-copy">© ${new Date().getFullYear()} ${
      prompt.split(" ")[0] || "Brand"
    }</div></div></div></footer>
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

  const handleEnhance = async () => {
    const value = enhanceInputRef.current?.value?.trim();
    if (!value || !generatedHtml) return;

    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }

    setIsGenerating(true);

    try {
      // Get session without triggering listeners
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        setShowAuth(true);
        setIsGenerating(false);
        return;
      }

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/generate-website`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            prompt: value,
            customization: selections,
            isRefinement: true,
            previousHtml: generatedHtml,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setShowTokens(true);
          setIsGenerating(false);
          return;
        }
        throw new Error(data.error || "Refinement failed");
      }

      if (data.success && data.html) {
        // Update local token balance
        if (typeof data.tokensRemaining === "number") {
          setLocalTokens(data.tokensRemaining);
        }

        setGeneratedHtml(data.html);
        if (enhanceInputRef.current) {
          enhanceInputRef.current.value = "";
        }

        console.log(
          `Refinement complete. Tokens used: ${data.tokensUsed}, Remaining: ${data.tokensRemaining}`
        );
      }
    } catch (error) {
      console.error("Refinement error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const breakdown = getBreakdownDisplay(tokenCost.breakdown);

  console.log(showPlaceholderAnimation);

  return (
    <div className="home">
      <MetallicBlob />
      <div className="home__center">
        {/* Search Bar */}
        <motion.div
          className="home__search"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="home__input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                showPlaceholderAnimation ? "" : "Describe your website..."
              }
              className="home__input"
              style={{
                background: "transparent",
                position: "relative",
                zIndex: 2,
              }}
            />
            {showPlaceholderAnimation && (
              <div className="home__typewriter-overlay">
                <span className="home__typewriter-text">
                  {placeholderText}
                  <span className="home__typewriter-cursor">|</span>
                </span>
              </div>
            )}
          </div>
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
                  <span>-{tokenCost.cost}</span>
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              className="home__help-btn"
              onClick={() => setShowHelp(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Get Help"
            >
              <HelpCircle size={18} />
            </motion.button>
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

        {/* Generation Progress */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              className="home__generating"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 size={14} className="spin" />
              <span>Generating your website... {getEstimatedTime()}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Preview Pill */}
        <AnimatePresence>
          {generatedHtml && isPreviewMinimized && !isGenerating && (
            <motion.div
              className="home__preview-pill"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="home__preview-pill-main"
                onClick={() => {
                  setIsPreviewMinimized(false);
                  setShowPreview(true);
                }}
              >
                <span>Generated Site</span>
                <Maximize2 size={12} />
              </button>
              <button
                className="home__preview-pill-discard"
                onClick={() => {
                  setGeneratedHtml(null);
                  setIsPreviewMinimized(false);
                }}
                title="Discard"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
                    {activeOption === "palette" &&
                      selections.palette === "Custom" && (
                        <motion.div
                          className="home__color-pills-wrapper"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="home__color-pills">
                            {OPTIONS.customColors.fields.map((field) => (
                              <div key={field.key} className="home__color-pill">
                                <label className="home__color-pill-label">
                                  {field.label}
                                </label>
                                <div className="home__color-pill-input-group">
                                  <button
                                    className="home__color-pill-btn"
                                    style={{
                                      backgroundColor:
                                        selections.customColors?.[field.key] ||
                                        field.default,
                                      borderColor: `rgba(255, 255, 255, ${
                                        selections.customColors?.[field.key]
                                          ? "0.2"
                                          : "0.1"
                                      })`,
                                    }}
                                    onClick={() => {
                                      // Create a hidden color input and trigger it
                                      const input =
                                        document.createElement("input");
                                      input.type = "color";
                                      input.value =
                                        selections.customColors?.[field.key] ||
                                        field.default;
                                      input.onchange = (e) => {
                                        setSelections((prev) => ({
                                          ...prev,
                                          customColors: {
                                            ...prev.customColors,
                                            [field.key]: e.target.value,
                                          },
                                        }));
                                      };
                                      input.click();
                                    }}
                                  >
                                    <span className="home__color-pill-value">
                                      {selections.customColors?.[field.key] ||
                                        field.default}
                                    </span>
                                  </button>
                                  <input
                                    type="color"
                                    className="home__color-pill-input-hidden"
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
                                </div>
                              </div>
                            ))}
                          </div>

                          <motion.button
                            className="home__done-btn"
                            onClick={goToCategories}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Done
                          </motion.button>
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

      {/* Preview Modal with GeneratedPreview */}
      <AnimatePresence>
        {showPreview && generatedHtml && (
          <motion.div
            className="preview-overlay"
            onClick={() => {
              setShowPreview(false);
              setIsPreviewMinimized(true);
            }}
            variants={previewOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="preview-container"
              onClick={(e) => e.stopPropagation()}
              variants={previewContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Extra controls header */}
              <div className="preview-header">
                <div className="preview-tabs">
                  <button
                    className={`preview-tab ${!showCode ? "active" : ""}`}
                    onClick={() => setShowCode(false)}
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                  <button
                    className={`preview-tab ${showCode ? "active" : ""}`}
                    onClick={() => setShowCode(true)}
                  >
                    <Code2 size={14} />
                    Code
                  </button>
                </div>

                <div className="preview-actions">
                  <button
                    className="preview-action-btn"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    title="Regenerate"
                  >
                    <RotateCcw
                      size={14}
                      className={isGenerating ? "spin" : ""}
                    />
                  </button>
                  <button
                    className="preview-action-btn"
                    onClick={handleDownload}
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    className="preview-deploy-btn"
                    onClick={() => setShowDeploy(true)}
                  >
                    <Rocket size={14} />
                    Deploy
                  </button>
                  <button
                    className="preview-close-btn"
                    onClick={() => {
                      setShowPreview(false);
                      setIsPreviewMinimized(true);
                    }}
                    title="Minimize"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="preview-body">
                {showCode ? (
                  <div className="preview-code">
                    <pre>
                      <code>{generatedHtml}</code>
                    </pre>
                  </div>
                ) : (
                  <GeneratedPreview html={generatedHtml} />
                )}
              </div>

              {/* Enhance input */}
              <div className="preview-enhance">
                <input
                  ref={enhanceInputRef}
                  type="text"
                  placeholder="Describe changes..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEnhance();
                  }}
                />
                <button onClick={handleEnhance}>
                  <ChevronRight size={16} />
                </button>
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
      {/* Help Modal */}
      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="help-overlay"
            onClick={() => setShowHelp(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="help-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.98, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="help-header">
                <div className="help-title">
                  <HelpCircle size={18} />
                  <span>How to Use Website AI</span>
                </div>
                <button
                  className="help-close"
                  onClick={() => setShowHelp(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="help-section">
                <div className="help-section__title">
                  <Sparkles size={14} />
                  <span>AI Generation</span>
                </div>
                <div className="help-section__content">
                  <p>
                    Describe your website in natural language. The AI will
                    understand your vision and generate a complete,
                    production-ready website.
                  </p>
                  <ul>
                    <li>Be specific about your business or purpose</li>
                    <li>Mention any special features you need</li>
                    <li>Include your target audience</li>
                    <li>Describe the look and feel you want</li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <div className="help-section__title">
                  <Settings size={14} />
                  <span>Customization Options</span>
                </div>
                <div className="help-section__content">
                  <p>
                    Click the gear button to access detailed customization
                    options:
                  </p>
                  <ul>
                    <li>Choose from 20+ design categories</li>
                    <li>Select templates, colors, fonts, and layouts</li>
                    <li>Pick your industry and target audience</li>
                    <li>Configure page sections and features</li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <div className="help-section__title">
                  <Coins size={14} />
                  <span>Token System</span>
                </div>
                <div className="help-section__content">
                  <p>
                    Every generation uses tokens. Our system is transparent and
                    cost-effective:
                  </p>
                  <ul>
                    <li>
                      <strong>25 FREE tokens</strong> when you sign up
                    </li>
                    <li>Token cost shown before generation</li>
                    <li>Complex websites use more tokens</li>
                    <li>Simple sites use fewer tokens</li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <div className="help-section__title">
                  <Rocket size={14} />
                  <span>Deploy with Nimbus</span>
                </div>
                <div className="help-section__content">
                  <p>One-click deployment to Nimbus platform:</p>
                  <ul>
                    <li>Deploy your generated site in seconds</li>
                    <li>Automatic SSL certificates included</li>
                    <li>Global CDN for fast loading worldwide</li>
                    <li>Custom domain support</li>
                    <li>Continuous deployment from your projects</li>
                    <li>Free tier available with basic features</li>
                  </ul>
                </div>
              </div>

              <div className="help-section">
                <div className="help-section__title">
                  <Shield size={14} />
                  <span>Security & Privacy</span>
                </div>
                <div className="help-section__content">
                  <p>Your security and privacy are our top priorities:</p>
                  <ul>
                    <li>All data is encrypted and secure</li>
                    <li>Payments processed securely through Stripe</li>
                    <li>We never store your payment details</li>
                    <li>Your generated websites are private to you</li>
                    <li>No usage of your content for training models</li>
                  </ul>
                </div>
              </div>

              <div className="help-tip">
                <Lightbulb size={14} />
                <span>
                  <strong>Tip:</strong> Start with a simple description, then
                  refine using the customization options for better results.
                </span>
              </div>

              {/* Example Prompts Section */}
              <div className="help-examples">
                <div className="help-examples__title">Try these examples:</div>
                <div className="help-examples__grid">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      className="help-example-pill"
                      onClick={() => {
                        setPrompt(example);
                        setShowHelp(false);
                        inputRef.current?.focus();
                      }}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
