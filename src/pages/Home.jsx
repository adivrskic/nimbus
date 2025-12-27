// Home.jsx - Options flow back to categories, with icons and prompt building
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "../contexts/ProjectContext";
import LegalModal from "../components/LegalModal"; // or wherever you put it
import {
  Layout,
  Paintbrush,
  ChevronLeft,
  Palette,
  Sun,
  Coins,
  Rocket,
  ChevronRight,
  Type,
  MessageSquare,
  FileText,
  Target,
  Building2,
  Users,
  Award,
  Layers,
  Grid3X3,
  Maximize as Maximize2,
  Circle,
  Image,
  BarChart,
  Workflow,
  Maximize,
  Edit,
  Code,
  X,
  Zap,
  Code as Code2,
  Accessibility,
  Pin,
  Lightbulb,
  Compass,
  Globe,
  Blend,
  AlignJustify,
  AlignLeft,
  Quote,
  Gauge,

  // Additional verified icons
  Menu,
  Smartphone,
  Monitor,
  Search,
  Share2,
  Square,
  Minus,
  Mail,
  Bell,
  Shield,
  Moon,
  ArrowDown,
  ChevronDown,
  HelpCircle,
  AlertCircle,
  Play,
  RefreshCw,
  Tag,
  User,
  Folder,
  Table,
  BarChart2,
  TrendingUp,
  DollarSign,
  GitBranch,
  Eye,
  Star,
  Heart,
  Check,
  Settings,
  List,
  Link,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Send,
  Download,
  Upload,
  Copy,
  Trash2,
  Edit as Edit3,
  Save,
  Home as Home2,
  Key,
  Lock,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Bookmark,
  Hash,
  AtSign,
  MousePointer,
  Sparkles,
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
import NoiseBlob from "../components/NoiseBlob";
import "./Home.scss";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

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
    subtitle: "Overall site structure",
    icon: Layout,
    promptKey: "template_type",
    choices: [
      {
        value: "Landing Page",
        prompt: "Use a single-page landing page optimized for conversion",
      },
      {
        value: "Marketing Site",
        prompt: "Use a multi-section marketing website",
      },
      {
        value: "Multi Page",
        prompt: "Use a traditional multi-page website with navigation",
      },
      {
        value: "Portfolio",
        prompt: "Use a portfolio-focused site showcasing work and case studies",
      },
      {
        value: "SaaS",
        prompt: "Use a SaaS marketing site with product sections and pricing",
      },
      {
        value: "Blog",
        prompt: "Use a blog-centric layout with article listings",
      },
      {
        value: "E-commerce",
        prompt: "Use an e-commerce layout with product browsing",
      },
      {
        value: "Documentation",
        prompt: "Use a documentation-style layout with side navigation",
      },
      {
        value: "Web App",
        prompt: "Use a web application-style interface layout",
      },
    ],
  },
  style: {
    label: "Design Style",
    subtitle: "Overall visual aesthetic",
    icon: Paintbrush,
    promptKey: "design_style",
    choices: [
      { value: "Minimal", prompt: "Use a minimal, whitespace-heavy design" },
      {
        value: "Modern",
        prompt: "Use a modern, contemporary design with bold typography",
      },
      { value: "Elegant", prompt: "Use an elegant and refined visual style" },
      { value: "Bold", prompt: "Use a bold, high-contrast visual style" },
      { value: "Tech", prompt: "Use a futuristic, tech-forward aesthetic" },
      { value: "Playful", prompt: "Use a playful and creative visual style" },
      { value: "Neumorphic", prompt: "Use a soft UI neumorphic style" },
      {
        value: "Brutalist",
        prompt: "Use a raw, brutalist design with minimal polish",
      },
      {
        value: "Editorial",
        prompt: "Use an editorial, magazine-inspired layout",
      },
      { value: "Luxury", prompt: "Use a premium, high-end luxury aesthetic" },
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
    subtitle: "Font style and hierarchy",
    promptKey: "typography",
    icon: Type,
    choices: [
      { value: "Sans Serif", prompt: "Use clean sans-serif typography" },
      { value: "Serif", prompt: "Use classic serif typography" },
      { value: "Display", prompt: "Use expressive display fonts for headings" },
      { value: "Mono", prompt: "Use monospaced fonts for a technical feel" },
      { value: "Variable", prompt: "Use modern variable fonts" },
    ],
  },
  tone: {
    label: "Tone of Voice",
    subtitle: "How the copy should sound",
    promptKey: "tone",
    icon: MessageSquare,
    choices: [
      {
        value: "Professional",
        prompt: "Use a professional and confident tone",
      },
      { value: "Friendly", prompt: "Use a friendly and approachable tone" },
      { value: "Authoritative", prompt: "Use an authoritative expert tone" },
      { value: "Conversational", prompt: "Use a conversational, human tone" },
      {
        value: "Inspirational",
        prompt: "Use an inspirational and motivating tone",
      },
      {
        value: "Direct",
        prompt: "Use a concise, direct tone with minimal fluff",
      },
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
    subtitle: "Primary business domain",
    icon: Building2,
    promptKey: "industry",
    choices: [
      {
        value: "Technology",
        prompt: "Build for the technology and software industry",
      },
      { value: "SaaS", prompt: "Build for a SaaS product company" },
      {
        value: "Healthcare",
        prompt: "Build for the healthcare or medical industry",
      },
      { value: "Finance", prompt: "Build for finance, banking, or fintech" },
      {
        value: "Real Estate",
        prompt: "Build for real estate, property, or rentals",
      },
      {
        value: "Education",
        prompt: "Build for education, training, or e-learning",
      },
      { value: "E-commerce", prompt: "Build for e-commerce or online retail" },
      {
        value: "Agency",
        prompt: "Build for a professional agency or consultancy",
      },
      {
        value: "Marketing",
        prompt: "Build for a marketing or growth-focused business",
      },
      {
        value: "Food & Beverage",
        prompt: "Build for restaurants, cafes, or food brands",
      },
      {
        value: "Fitness & Wellness",
        prompt: "Build for fitness, wellness, or health coaching",
      },
      {
        value: "Creative",
        prompt: "Build for creative studios, designers, or artists",
      },
      {
        value: "Nonprofit",
        prompt: "Build for nonprofit or mission-driven organizations",
      },
      { value: "Legal", prompt: "Build for legal services or law firms" },
      {
        value: "Construction",
        prompt: "Build for construction, trades, or contractors",
      },
      {
        value: "Hospitality",
        prompt: "Build for hotels, travel, or hospitality businesses",
      },
      {
        value: "Manufacturing",
        prompt: "Build for manufacturing or industrial companies",
      },
    ],
  },
  audience: {
    label: "Target Audience",
    subtitle: "Primary users or buyers",
    icon: Users,
    promptKey: "target_audience",
    choices: [
      {
        value: "General Consumers",
        prompt: "Target a broad consumer audience",
      },
      {
        value: "B2B Buyers",
        prompt: "Target business buyers and decision-makers",
      },
      { value: "Developers", prompt: "Target developers and technical users" },
      {
        value: "Founders",
        prompt: "Target startup founders and entrepreneurs",
      },
      {
        value: "Executives",
        prompt: "Target executives and senior leadership",
      },
      {
        value: "Enterprise Buyers",
        prompt: "Target enterprise procurement teams",
      },
      { value: "SMBs", prompt: "Target small and medium-sized businesses" },
      {
        value: "Creatives",
        prompt: "Target designers and creative professionals",
      },
      { value: "Students", prompt: "Target students and learners" },
      {
        value: "Educators",
        prompt: "Target teachers, instructors, or trainers",
      },
      { value: "Recruiters", prompt: "Target hiring managers and recruiters" },
      {
        value: "Agencies",
        prompt: "Target agencies purchasing tools or services",
      },
      {
        value: "Young Adults",
        prompt: "Target young adults and digital-native users",
      },
      {
        value: "Non-Technical",
        prompt: "Target non-technical users who value simplicity",
      },
    ],
  },
  sections: {
    label: "Sections",
    subtitle: "Page sections to include",
    icon: Layers,
    multi: true,
    promptKey: "sections",
    choices: [
      {
        value: "Hero",
        prompt:
          "Include a hero section with headline, subtext, and primary CTA",
      },
      {
        value: "Logos",
        prompt: "Include a trusted-by or customer logos section",
      },
      {
        value: "Problem",
        prompt: "Include a problem or pain-point framing section",
      },
      { value: "Solution", prompt: "Include a solution overview section" },
      { value: "Features", prompt: "Include a features and benefits section" },
      {
        value: "How It Works",
        prompt: "Include a step-by-step how-it-works section",
      },
      { value: "Use Cases", prompt: "Include use cases or scenarios section" },
      {
        value: "Integrations",
        prompt: "Include integrations or compatibility section",
      },
      {
        value: "Testimonials",
        prompt: "Include testimonials or customer reviews",
      },
      {
        value: "Case Studies",
        prompt: "Include case studies or success stories",
      },
      {
        value: "Stats",
        prompt: "Include metrics, KPIs, or performance statistics",
      },
      { value: "Pricing", prompt: "Include a pricing plans section" },
      {
        value: "Comparison",
        prompt: "Include a comparison versus alternatives section",
      },
      {
        value: "Security",
        prompt: "Include security, privacy, or compliance information",
      },
      { value: "FAQ", prompt: "Include a frequently asked questions section" },
      { value: "Team", prompt: "Include a team or founders section" },
      { value: "About", prompt: "Include an about the company section" },
      {
        value: "Blog Preview",
        prompt: "Include recent articles or insights preview",
      },
      { value: "Gallery", prompt: "Include an image or project gallery" },
      { value: "Contact", prompt: "Include a contact form or contact details" },
      {
        value: "Newsletter",
        prompt: "Include an email newsletter signup section",
      },
      {
        value: "CTA",
        prompt: "Include a final conversion-focused call-to-action",
      },
      {
        value: "Footer",
        prompt: "Include a comprehensive footer with links and legal info",
      },
    ],
  },
  layout: {
    label: "Layout",
    subtitle: "Content arrangement style",
    icon: Grid3X3,
    promptKey: "layout_type",
    choices: [
      {
        value: "Vertical Stack",
        prompt: "Use a vertical stacked layout with full-width sections",
      },
      {
        value: "Single Page",
        prompt: "Use a single scrolling layout with clear section separation",
      },
      { value: "Card Grid", prompt: "Use a modular card-based grid layout" },
      {
        value: "Split Screen",
        prompt: "Use a split-screen layout with content side-by-side",
      },
      {
        value: "Asymmetric",
        prompt: "Use a creative asymmetric layout with visual tension",
      },
      {
        value: "Centered",
        prompt: "Use a centered layout with narrow content columns",
      },
      {
        value: "Editorial",
        prompt: "Use an editorial layout with strong typographic hierarchy",
      },
      {
        value: "Dashboard",
        prompt: "Use a dashboard-style layout with panels and widgets",
      },
      {
        value: "Masonry",
        prompt: "Use a masonry-style grid with uneven card heights",
      },
      {
        value: "Hero-Focused",
        prompt: "Emphasize a large hero section with supporting content below",
      },
    ],
  },
  density: {
    label: "Content Density",
    subtitle: "Spacing and information density",
    promptKey: "layout_density",
    icon: Maximize,
    choices: [
      {
        value: "Spacious",
        prompt: "Use spacious layouts with generous margins",
      },
      {
        value: "Balanced",
        prompt: "Use a balanced layout with moderate spacing",
      },
      {
        value: "Compact",
        prompt: "Use a compact layout with dense information",
      },
    ],
  },
  corners: {
    label: "Corner Style",
    subtitle: "Border radius treatment",
    icon: Circle,
    promptKey: "corner_style",
    choices: [
      { value: "Sharp", prompt: "Use sharp square corners throughout" },
      {
        value: "Subtle",
        prompt: "Use subtly rounded corners for a clean look",
      },
      {
        value: "Rounded",
        prompt: "Use clearly rounded corners on cards and buttons",
      },
      { value: "Pill", prompt: "Use pill-shaped fully rounded elements" },
      {
        value: "Fluid",
        prompt: "Use fluid, organic corner radii with soft shapes",
      },
    ],
  },
  images: {
    label: "Images",
    subtitle: "Visual content approach",
    icon: Image,
    promptKey: "image_style",
    choices: [
      {
        value: "Photography",
        prompt: "Use high-quality real-world photography",
      },
      { value: "Stock", prompt: "Use polished stock photography" },
      {
        value: "Product Screenshots",
        prompt: "Use product UI screenshots and mockups",
      },
      {
        value: "Illustrations",
        prompt: "Use custom illustrations and vector graphics",
      },
      {
        value: "Abstract",
        prompt: "Use abstract shapes, gradients, and patterns",
      },
      { value: "3D Graphics", prompt: "Use 3D renders or isometric graphics" },
      { value: "AI Generated", prompt: "Use AI-generated visuals and imagery" },
      { value: "Icons Only", prompt: "Use icons instead of images" },
      { value: "Text Only", prompt: "Avoid images and focus on typography" },
    ],
  },
  animation: {
    label: "Animation",
    subtitle: "Motion and interaction level",
    icon: Zap,
    promptKey: "animation_level",
    choices: [
      { value: "None", prompt: "Do not use animations or motion effects" },
      {
        value: "Minimal",
        prompt: "Use minimal transitions for state changes only",
      },
      { value: "Subtle", prompt: "Use subtle fades and gentle motion" },
      { value: "Moderate", prompt: "Use scroll-based reveals and transitions" },
      {
        value: "Expressive",
        prompt: "Use expressive animations and micro-interactions",
      },
      {
        value: "Immersive",
        prompt: "Use immersive motion including parallax and 3D effects",
      },
      {
        value: "Performance-First",
        prompt: "Prioritize performance-friendly animations only",
      },
    ],
  },
  interaction: {
    label: "Interactivity",
    subtitle: "User interaction depth",
    promptKey: "interaction_level",
    icon: Zap,
    choices: [
      { value: "Static", prompt: "Primarily static content" },
      {
        value: "Interactive",
        prompt: "Interactive elements like tabs and accordions",
      },
      { value: "App-Like", prompt: "Highly interactive, app-like experience" },
    ],
  },
  hierarchy: {
    label: "Visual Hierarchy",
    subtitle: "Emphasis and flow",
    promptKey: "visual_hierarchy",
    icon: Layers,
    choices: [
      {
        value: "Strong",
        prompt: "Use strong visual hierarchy with clear focal points",
      },
      { value: "Balanced", prompt: "Use balanced hierarchy across sections" },
      { value: "Flat", prompt: "Use a flat hierarchy with minimal emphasis" },
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
        prompt:
          "plain HTML and CSS with CSS custom properties and a small, well-structured stylesheet",
      },
      {
        value: "Tailwind Classes",
        prompt:
          "using Tailwind CSS utility classes with sensible grouping and minimal custom CSS",
      },
      {
        value: "Tailwind + Extracted Components",
        prompt:
          "using Tailwind CSS utility classes but extracting repeated patterns into reusable component classNames",
      },
      {
        value: "CSS Modules",
        prompt:
          "using CSS Modules with locally scoped class names and a small, maintainable styles file",
      },
      {
        value: "BEM CSS",
        prompt:
          "using semantic BEM-style class names and a single stylesheet following block__element--modifier conventions",
      },
      {
        value: "Design Tokens",
        prompt:
          "using CSS custom properties as design tokens for reusable design values",
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
        prompt:
          "inspired by modern startup websites (Linear, Vercel, Notion, Superhuman)",
      },
      {
        value: "Apple",
        prompt:
          "inspired by Apple's minimal, premium aesthetic with generous whitespace, subtle motion, and large product imagery",
      },
      {
        value: "Stripe",
        prompt:
          "inspired by Stripe's developer-focused clean design, strong typography, and subtle gradients",
      },
      {
        value: "Editorial",
        prompt:
          "inspired by editorial and magazine layouts with strong typographic hierarchy and generous whitespace",
      },
      {
        value: "Brutalist",
        prompt:
          "inspired by brutalist web design with bold type, stark contrast, and intentionally raw layouts",
      },
      {
        value: "Neubrutalism",
        prompt:
          "inspired by neubrutalist UI with chunky cards, thick borders, shadows, and vivid accent colors",
      },
      {
        value: "Dashboard",
        prompt:
          "inspired by modern SaaS dashboards (Linear, Height, Asana) with cards, tables, and dense information layouts",
      },
      {
        value: "Playful",
        prompt:
          "inspired by playful, colorful product marketing sites with soft shapes and friendly illustrations",
      },
      {
        value: "Futuristic",
        prompt:
          "inspired by futuristic and sci-fi interfaces with glowing accents, dark backgrounds, and subtle glassmorphism",
      },
      {
        value: "Corporate",
        prompt:
          "inspired by traditional enterprise and corporate sites with conservative colors and straightforward layouts",
      },
      {
        value: "Monochrome",
        prompt:
          "inspired by monochrome and high-contrast designs using mostly grayscale with a single accent color",
      },
      {
        value: "Surprise Me",
        prompt:
          "choose any tasteful contemporary web aesthetic that best fits the content and target audience",
      },
      {
        value: "Notion",
        prompt:
          "inspired by Notionâ€™s calm workspace aesthetic with minimal chrome, muted colors, and document-like layouts",
      },
      {
        value: "Figma",
        prompt:
          "inspired by Figmaâ€™s product-led UI with clear panels, toolbars, and a neutral canvas feel",
      },
      {
        value: "Linear",
        prompt:
          "inspired by Linearâ€™s ultra-minimal, fast, and opinionated product design with strong typography and dark/light modes",
      },
      {
        value: "Framer",
        prompt:
          "inspired by Framerâ€™s motion-rich marketing pages with big gradients, bold sections, and smooth animations",
      },
      {
        value: "Dropbox",
        prompt:
          "inspired by Dropboxâ€™s friendly, illustration-heavy brand with lots of whitespace and approachable typography",
      },
      {
        value: "Spotify",
        prompt:
          "inspired by Spotifyâ€™s bold, music-inspired visuals with dark bases, saturated accents, and expressive imagery",
      },
      {
        value: "Figma Community",
        prompt:
          "inspired by playful, community-driven UI kits with bright colors, cards, and modular sections",
      },
      {
        value: "Dribbble Shot",
        prompt:
          "inspired by polished Dribbble-style concept UIs with strong grids, shadows, and glossy UI elements",
      },
      {
        value: "Awwwards",
        prompt:
          "inspired by award-winning experimental websites with unconventional layouts, strong motion, and immersive visuals",
      },
      {
        value: "SaaS B2B",
        prompt:
          "inspired by modern B2B SaaS marketing sites with clear value props, pricing tables, logos, and simple hero layouts",
      },
      {
        value: "Portfolio",
        prompt:
          "inspired by creative portfolio sites with large imagery, editorial typography, and project-focused layouts",
      },
      {
        value: "Ecommerce",
        prompt:
          "inspired by modern ecommerce product pages with prominent imagery, clear CTAs, and trust signals",
      },
    ],
  },
  persistent: {
    label: "Content & Assets",
    subtitle: "Branding, images, and links",
    icon: Globe,
    promptKey: "persistent_content",
    isPersistent: true,
  },
  navigation: {
    label: "Navigation Style",
    subtitle: "Header and menu design",
    icon: Menu,
    promptKey: "navigation_style",
    choices: [
      { value: "Standard", prompt: "Use a standard horizontal navigation bar" },
      {
        value: "Centered Logo",
        prompt: "Use navigation with centered logo and split menu items",
      },
      {
        value: "Hamburger",
        prompt: "Use a hamburger menu that expands to full navigation",
      },
      { value: "Sidebar", prompt: "Use a persistent sidebar navigation" },
      {
        value: "Mega Menu",
        prompt: "Use mega menu dropdowns with rich content",
      },
      {
        value: "Floating",
        prompt: "Use a floating/pill-shaped navigation bar",
      },
      {
        value: "Transparent",
        prompt: "Use a transparent navigation that becomes solid on scroll",
      },
      {
        value: "Minimal",
        prompt: "Use minimal navigation with only essential links",
      },
      { value: "Bottom Nav", prompt: "Use mobile-style bottom navigation bar" },
      {
        value: "Split",
        prompt: "Use split navigation with logo left and CTA right",
      },
      { value: "Tabbed", prompt: "Use tabbed navigation for content sections" },
      {
        value: "Breadcrumb",
        prompt: "Include breadcrumb navigation for hierarchy",
      },
      {
        value: "Vertical Dots",
        prompt: "Use vertical dot navigation for single-page scroll",
      },
      {
        value: "Command Palette",
        prompt: "Include a command palette / search modal (⌘K)",
      },
      { value: "No Navigation", prompt: "Minimal or no visible navigation" },
    ],
  },
  contentFlow: {
    label: "Content Flow",
    subtitle: "Information architecture",
    icon: Workflow,
    promptKey: "content_flow",
    choices: [
      { value: "Linear", prompt: "Use a linear, top-to-bottom content flow" },
      {
        value: "Hub & Spoke",
        prompt: "Use a hub-and-spoke navigation structure",
      },
      { value: "Z Pattern", prompt: "Use a Z-pattern visual flow" },
      { value: "F Pattern", prompt: "Use an F-pattern for text-heavy content" },
      {
        value: "Inverted Pyramid",
        prompt: "Use inverted pyramid with key info first",
      },
      { value: "Story Arc", prompt: "Use a storytelling arc structure" },
      {
        value: "Problem-Solution",
        prompt: "Use problem-solution-benefit flow",
      },
      { value: "Feature Led", prompt: "Lead with features, then benefits" },
      { value: "Benefit Led", prompt: "Lead with benefits, then features" },
    ],
  },
  gradientStyle: {
    label: "Gradient Usage",
    subtitle: "Gradient application",
    icon: Blend,
    promptKey: "gradient_style",
    choices: [
      { value: "None", prompt: "Do not use gradients" },
      { value: "Subtle", prompt: "Use subtle, barely-visible gradients" },
      { value: "Background", prompt: "Use gradients for section backgrounds" },
      { value: "Text", prompt: "Use gradient text effects" },
      { value: "Buttons", prompt: "Use gradients on buttons and CTAs" },
      { value: "Cards", prompt: "Use gradient card backgrounds" },
      { value: "Mesh", prompt: "Use mesh gradients for organic effects" },
      { value: "Radial", prompt: "Use radial gradients" },
      { value: "Conic", prompt: "Use conic/angular gradients" },
      { value: "Animated", prompt: "Use animated gradient effects" },
      { value: "Aurora", prompt: "Use aurora/northern lights style gradients" },
      { value: "Noise", prompt: "Use gradients with noise texture overlay" },
    ],
  },
  backgroundPattern: {
    label: "Background Pattern",
    subtitle: "Background textures and patterns",
    icon: Grid3X3,
    promptKey: "background_pattern",
    choices: [
      { value: "None", prompt: "Use solid color backgrounds only" },
      { value: "Dots", prompt: "Use dot pattern backgrounds" },
      { value: "Grid", prompt: "Use grid pattern backgrounds" },
      { value: "Lines", prompt: "Use line pattern backgrounds" },
      { value: "Waves", prompt: "Use wave pattern backgrounds" },
      { value: "Geometric", prompt: "Use geometric pattern backgrounds" },
      { value: "Noise", prompt: "Use noise/grain texture backgrounds" },
      { value: "Gradient Mesh", prompt: "Use gradient mesh backgrounds" },
      { value: "Blobs", prompt: "Use blob shape backgrounds" },
      { value: "Topography", prompt: "Use topographic map style backgrounds" },
      { value: "Circuit", prompt: "Use circuit board pattern backgrounds" },
      { value: "Isometric", prompt: "Use isometric pattern backgrounds" },
      { value: "Paper", prompt: "Use paper texture backgrounds" },
      { value: "Fabric", prompt: "Use fabric/canvas texture backgrounds" },
      { value: "Marble", prompt: "Use marble texture backgrounds" },
      { value: "Abstract", prompt: "Use abstract art backgrounds" },
      { value: "Photo Overlay", prompt: "Use photo backgrounds with overlays" },
    ],
  },
  shadowStyle: {
    label: "Shadow Style",
    subtitle: "Elevation and depth",
    icon: Layers,
    promptKey: "shadow_style",
    choices: [
      { value: "None", prompt: "Do not use shadows" },
      { value: "Subtle", prompt: "Use subtle, soft shadows" },
      { value: "Medium", prompt: "Use medium elevation shadows" },
      { value: "Heavy", prompt: "Use heavy, pronounced shadows" },
      { value: "Colored", prompt: "Use colored shadows matching brand colors" },
      { value: "Hard", prompt: "Use hard-edged shadows without blur" },
      { value: "Layered", prompt: "Use layered multiple shadows for depth" },
      { value: "Inset", prompt: "Use inset shadows for pressed effects" },
      { value: "Long", prompt: "Use long, directional shadows" },
      { value: "Glow", prompt: "Use glow effects instead of shadows" },
      { value: "Neumorphic", prompt: "Use neumorphic soft shadows" },
      { value: "Brutalist", prompt: "Use brutalist offset solid shadows" },
    ],
  },
  hoverEffects: {
    label: "Hover Effects",
    subtitle: "Interactive hover states",
    icon: MousePointer,
    promptKey: "hover_effects",
    choices: [
      { value: "None", prompt: "Minimal hover effects" },
      { value: "Subtle", prompt: "Use subtle color/opacity hover changes" },
      { value: "Scale", prompt: "Use scale/grow hover effects" },
      { value: "Lift", prompt: "Use lift/shadow hover effects" },
      { value: "Glow", prompt: "Use glow hover effects" },
      { value: "Color Shift", prompt: "Use color shift hover effects" },
      { value: "Underline", prompt: "Use animated underline hover effects" },
      { value: "Fill", prompt: "Use fill/wipe hover effects" },
      { value: "Tilt", prompt: "Use 3D tilt hover effects" },
      { value: "Reveal", prompt: "Use reveal/expose hover effects" },
      { value: "Magnetic", prompt: "Use magnetic cursor-following effects" },
      { value: "Morphing", prompt: "Use morphing shape hover effects" },
    ],
  },
  headingStyle: {
    label: "Heading Style",
    subtitle: "Headline treatment",
    icon: Type,
    promptKey: "heading_style",
    choices: [
      { value: "Simple", prompt: "Use simple, clean headings" },
      { value: "Bold", prompt: "Use bold, heavy headings" },
      { value: "Light", prompt: "Use light, thin headings" },
      { value: "Uppercase", prompt: "Use uppercase/all-caps headings" },
      { value: "Underlined", prompt: "Use underlined headings" },
      { value: "Highlighted", prompt: "Use highlighted/marked headings" },
      { value: "Gradient", prompt: "Use gradient text headings" },
      { value: "Outlined", prompt: "Use outlined/stroke text headings" },
    ],
  },
  // SCROLL BEHAVIOR
  scrollBehavior: {
    label: "Scroll Behavior",
    subtitle: "Scroll interactions",
    icon: ArrowDown,
    promptKey: "scroll_behavior",
    choices: [
      { value: "Standard", prompt: "Use standard scroll behavior" },
      { value: "Smooth", prompt: "Use smooth scrolling for anchor links" },
      {
        value: "Snap",
        prompt: "Use scroll snap for section-by-section viewing",
      },
      { value: "Parallax", prompt: "Use parallax scrolling effects" },
      { value: "Reveal", prompt: "Use scroll-triggered reveal animations" },
      { value: "Progress", prompt: "Show scroll progress indicator" },
      { value: "Sticky", prompt: "Use sticky sections during scroll" },
    ],
  },

  // LOADING STYLE
  loadingStyle: {
    label: "Loading States",
    subtitle: "Loading animations",
    icon: RefreshCw,
    promptKey: "loading_style",
    choices: [
      { value: "None", prompt: "No loading indicators" },
      { value: "Spinner", prompt: "Use spinner loading indicators" },
      {
        value: "Skeleton",
        prompt: "Use skeleton/shimmer loading placeholders",
      },
      { value: "Progress Bar", prompt: "Use progress bar loading indicators" },
      { value: "Dots", prompt: "Use animated dots loading indicators" },
      { value: "Pulse", prompt: "Use pulsing loading effects" },
    ],
  },

  // TESTIMONIAL STYLE
  testimonialStyle: {
    label: "Testimonial Style",
    subtitle: "Customer quote design",
    icon: MessageSquare,
    promptKey: "testimonial_style",
    choices: [
      { value: "Cards", prompt: "Display testimonials as cards" },
      { value: "Carousel", prompt: "Display testimonials in a carousel" },
      { value: "Grid", prompt: "Display testimonials in a grid" },
      {
        value: "Single Featured",
        prompt: "Display one large featured testimonial",
      },
      { value: "Masonry", prompt: "Display testimonials in masonry layout" },
      { value: "Video", prompt: "Display video testimonials" },
      { value: "Tweet Style", prompt: "Display testimonials as tweet cards" },
      {
        value: "With Logos",
        prompt: "Display testimonials with company logos",
      },
      { value: "Marquee", prompt: "Display testimonials in scrolling marquee" },
    ],
  },

  // PRICING STYLE
  pricingStyle: {
    label: "Pricing Style",
    subtitle: "Pricing table design",
    icon: DollarSign,
    promptKey: "pricing_style",
    choices: [
      { value: "Cards", prompt: "Use pricing cards side by side" },
      { value: "Table", prompt: "Use a traditional pricing table" },
      { value: "Comparison", prompt: "Use a feature comparison grid" },
      { value: "Toggle", prompt: "Use monthly/annual toggle pricing" },
      {
        value: "Tiered",
        prompt: "Use tiered pricing with feature progression",
      },
      {
        value: "Highlighted",
        prompt: "Highlight recommended plan prominently",
      },
      { value: "Minimal", prompt: "Use minimal single-price display" },
    ],
  },

  // FOOTER STYLE
  footerStyle: {
    label: "Footer Style",
    subtitle: "Footer layout design",
    icon: Layout,
    promptKey: "footer_style",
    choices: [
      { value: "Simple", prompt: "Use a simple single-line footer" },
      { value: "Minimal", prompt: "Use a minimal footer with just essentials" },
      { value: "Standard", prompt: "Use a standard multi-column footer" },
      { value: "Fat", prompt: "Use a fat footer with extensive links" },
      {
        value: "Mega",
        prompt: "Use a mega footer with newsletter and socials",
      },
      { value: "CTA", prompt: "Use a footer with prominent CTA section" },
      {
        value: "Newsletter",
        prompt: "Use a footer focused on newsletter signup",
      },
      { value: "Dark", prompt: "Use a dark-themed footer" },
    ],
  },
  faqStyle: {
    label: "FAQ Style",
    subtitle: "FAQ design",
    icon: HelpCircle,
    promptKey: "faq_style",
    choices: [
      { value: "Accordion", prompt: "Use accordion-style FAQ" },
      { value: "Cards", prompt: "Use card-style FAQ" },
      { value: "Two Column", prompt: "Use two-column FAQ layout" },
      { value: "Categorized", prompt: "Use categorized/tabbed FAQ" },
      { value: "Search", prompt: "Include FAQ search functionality" },
      { value: "Minimal", prompt: "Use minimal list-style FAQ" },
    ],
  },

  // TEAM STYLE
  teamStyle: {
    label: "Team Section",
    subtitle: "Team member display",
    icon: Users,
    promptKey: "team_style",
    choices: [
      { value: "Grid", prompt: "Use a grid of team member cards" },
      { value: "Carousel", prompt: "Use a team carousel" },
      { value: "Featured", prompt: "Feature key team members prominently" },
      { value: "Hover Reveal", prompt: "Reveal info on hover" },
      { value: "Social Links", prompt: "Include social links for team" },
      { value: "Minimal", prompt: "Use minimal avatars only" },
    ],
  },

  // STATS STYLE
  statsStyle: {
    label: "Stats Display",
    subtitle: "Metrics and numbers",
    icon: BarChart2,
    promptKey: "stats_style",
    choices: [
      { value: "Simple", prompt: "Use simple number display" },
      { value: "Cards", prompt: "Use stat cards" },
      { value: "Counters", prompt: "Use animated counter numbers" },
      { value: "Progress", prompt: "Use progress bar stats" },
      { value: "Charts", prompt: "Use chart visualizations" },
      { value: "Icons", prompt: "Use stats with icons" },
      { value: "Grid", prompt: "Use a stats grid layout" },
    ],
  },

  // CONTACT STYLE
  contactStyle: {
    label: "Contact Section",
    subtitle: "Contact area design",
    icon: Mail,
    promptKey: "contact_style",
    choices: [
      { value: "Form Only", prompt: "Use a simple contact form" },
      { value: "Form + Info", prompt: "Use form with contact information" },
      { value: "Split", prompt: "Use split layout with form and details" },
      { value: "Map + Form", prompt: "Include map with contact form" },
      { value: "Calendly", prompt: "Include calendar booking widget" },
      { value: "Cards", prompt: "Use contact method cards" },
      { value: "Minimal", prompt: "Use minimal email/phone only" },
    ],
  },

  // RESPONSIVE APPROACH
  responsiveApproach: {
    label: "Responsive Approach",
    subtitle: "Mobile/desktop strategy",
    icon: Smartphone,
    promptKey: "responsive_approach",
    choices: [
      {
        value: "Mobile First",
        prompt: "Design mobile-first with progressive enhancement",
      },
      {
        value: "Desktop First",
        prompt: "Design desktop-first with graceful degradation",
      },
      { value: "Fluid", prompt: "Use fluid layouts that scale smoothly" },
    ],
  },

  // MOBILE MENU
  mobileMenu: {
    label: "Mobile Menu",
    subtitle: "Mobile navigation style",
    icon: Smartphone,
    promptKey: "mobile_menu",
    choices: [
      { value: "Hamburger Slide", prompt: "Use a slide-out hamburger menu" },
      { value: "Full Screen", prompt: "Use a full-screen overlay menu" },
      { value: "Bottom Sheet", prompt: "Use a bottom sheet menu" },
      { value: "Bottom Nav", prompt: "Use a fixed bottom navigation bar" },
      { value: "Dropdown", prompt: "Use a dropdown menu from header" },
    ],
  },
  darkModeToggle: {
    label: "Dark Mode Toggle",
    subtitle: "Theme switching",
    icon: Moon,
    promptKey: "dark_mode_toggle",
    choices: [
      { value: "None", prompt: "No dark mode toggle" },
      { value: "Header", prompt: "Include toggle in header" },
      { value: "Footer", prompt: "Include toggle in footer" },
      { value: "System", prompt: "Auto-detect system preference" },
    ],
  },

  // COOKIE BANNER
  cookieBanner: {
    label: "Cookie Banner",
    subtitle: "GDPR/consent handling",
    icon: Shield,
    promptKey: "cookie_banner",
    choices: [
      { value: "None", prompt: "No cookie banner" },
      { value: "Simple", prompt: "Use a simple accept/decline banner" },
      { value: "Bottom Bar", prompt: "Use a bottom bar cookie notice" },
      { value: "Corner", prompt: "Use a corner popup cookie notice" },
      { value: "Minimal", prompt: "Use a minimal, unobtrusive notice" },
    ],
  },

  // SEO LEVEL
  seoLevel: {
    label: "SEO Focus",
    subtitle: "Search optimization",
    icon: Search,
    promptKey: "seo_level",
    choices: [
      { value: "Basic", prompt: "Include basic meta tags and structure" },
      { value: "Standard", prompt: "Include standard SEO with semantic HTML" },
      { value: "Advanced", prompt: "Include advanced SEO with schema markup" },
    ],
  },

  // PERFORMANCE
  performanceLevel: {
    label: "Performance",
    subtitle: "Speed optimization",
    icon: Zap,
    promptKey: "performance_level",
    choices: [
      { value: "Standard", prompt: "Use standard web performance practices" },
      {
        value: "Optimized",
        prompt: "Optimize for fast loading and Core Web Vitals",
      },
      {
        value: "Ultra Light",
        prompt: "Minimize everything for fastest possible load",
      },
    ],
  },

  // BRAND PERSONALITY
  brandPersonality: {
    label: "Brand Personality",
    subtitle: "Brand character traits",
    icon: Heart,
    promptKey: "brand_personality",
    choices: [
      {
        value: "Professional",
        prompt: "Use a professional, corporate personality",
      },
      { value: "Friendly", prompt: "Use a friendly, approachable personality" },
      { value: "Bold", prompt: "Use a bold, confident personality" },
      { value: "Playful", prompt: "Use a playful, fun personality" },
      {
        value: "Sophisticated",
        prompt: "Use a sophisticated, refined personality",
      },
      {
        value: "Innovative",
        prompt: "Use an innovative, cutting-edge personality",
      },
      {
        value: "Trustworthy",
        prompt: "Use a trustworthy, reliable personality",
      },
      { value: "Energetic", prompt: "Use an energetic, dynamic personality" },
      { value: "Calm", prompt: "Use a calm, serene personality" },
      { value: "Warm", prompt: "Use a warm, caring personality" },
    ],
  },

  // TAB STYLE
  tabStyle: {
    label: "Tab Style",
    subtitle: "Tab navigation design",
    icon: Folder,
    promptKey: "tab_style",
    choices: [
      { value: "Underline", prompt: "Use underline tab indicators" },
      { value: "Pill", prompt: "Use pill-shaped tabs" },
      { value: "Boxed", prompt: "Use boxed/bordered tabs" },
      { value: "Button", prompt: "Use button-style tabs" },
      { value: "Minimal", prompt: "Use minimal text tabs" },
      { value: "Vertical", prompt: "Use vertical tabs" },
    ],
  },

  // ACCORDION STYLE
  accordionStyle: {
    label: "Accordion Style",
    subtitle: "Expandable content",
    icon: ChevronDown,
    promptKey: "accordion_style",
    choices: [
      { value: "Simple", prompt: "Use simple accordion with chevron" },
      { value: "Bordered", prompt: "Use bordered accordion items" },
      { value: "Card", prompt: "Use card-style accordion" },
      { value: "Flush", prompt: "Use flush/edge-to-edge accordion" },
      { value: "Icon", prompt: "Use plus/minus icon accordion" },
      { value: "Animated", prompt: "Use animated accordion transitions" },
    ],
  },

  // CAROUSEL STYLE
  carouselStyle: {
    label: "Carousel Style",
    subtitle: "Slider design",
    icon: Play,
    promptKey: "carousel_style",
    choices: [
      { value: "None", prompt: "Don't use carousels" },
      { value: "Simple", prompt: "Use simple arrow navigation carousels" },
      { value: "Dots", prompt: "Use dot indicator carousels" },
      { value: "Thumbnails", prompt: "Use thumbnail navigation carousels" },
      { value: "Center Mode", prompt: "Use center-focused carousels" },
      { value: "Auto Play", prompt: "Use auto-playing carousels" },
      { value: "Fade", prompt: "Use fade transition carousels" },
      { value: "Multi Item", prompt: "Use multi-item visible carousels" },
    ],
  },

  // NOTIFICATION STYLE
  notificationStyle: {
    label: "Notification Style",
    subtitle: "Alert and toast design",
    icon: Bell,
    promptKey: "notification_style",
    choices: [
      { value: "Toast", prompt: "Use toast notifications" },
      { value: "Banner", prompt: "Use banner notifications" },
      { value: "Inline", prompt: "Use inline alert messages" },
      { value: "Modal", prompt: "Use modal alerts" },
      { value: "Slide In", prompt: "Use slide-in notifications" },
      { value: "Floating", prompt: "Use floating corner notifications" },
    ],
  },

  // BADGE STYLE
  badgeStyle: {
    label: "Badge Style",
    subtitle: "Tags and labels",
    icon: Tag,
    promptKey: "badge_style",
    choices: [
      { value: "Pill", prompt: "Use pill-shaped badges" },
      { value: "Rounded", prompt: "Use rounded corner badges" },
      { value: "Square", prompt: "Use square badges" },
      { value: "Outlined", prompt: "Use outline/ghost badges" },
      { value: "Filled", prompt: "Use solid filled badges" },
      { value: "Dot", prompt: "Use dot status indicators" },
      { value: "Gradient", prompt: "Use gradient badges" },
    ],
  },

  // AVATAR STYLE
  avatarStyle: {
    label: "Avatar Style",
    subtitle: "User avatar design",
    icon: User,
    promptKey: "avatar_style",
    choices: [
      { value: "Circle", prompt: "Use circular avatars" },
      { value: "Rounded", prompt: "Use rounded square avatars" },
      { value: "Square", prompt: "Use square avatars" },
      { value: "Initials", prompt: "Use initials as avatar fallback" },
      { value: "Bordered", prompt: "Use bordered avatars" },
      { value: "Stacked", prompt: "Use stacked avatar groups" },
      { value: "With Status", prompt: "Use avatars with status indicators" },
    ],
  },

  // PROGRESS STYLE
  progressStyle: {
    label: "Progress Style",
    subtitle: "Progress indicators",
    icon: TrendingUp,
    promptKey: "progress_style",
    choices: [
      { value: "Bar", prompt: "Use horizontal progress bars" },
      { value: "Circle", prompt: "Use circular progress indicators" },
      { value: "Steps", prompt: "Use step indicators" },
      { value: "Dots", prompt: "Use dot progress indicators" },
      { value: "Number", prompt: "Use numbered progress" },
      { value: "Percentage", prompt: "Use percentage display" },
    ],
  },

  // TABLE STYLE
  tableStyle: {
    label: "Table Style",
    subtitle: "Data table design",
    icon: Table,
    promptKey: "table_style",
    choices: [
      { value: "Simple", prompt: "Use simple, clean tables" },
      { value: "Striped", prompt: "Use zebra-striped tables" },
      { value: "Bordered", prompt: "Use bordered tables" },
      { value: "Borderless", prompt: "Use borderless tables" },
      { value: "Cards", prompt: "Convert tables to cards on mobile" },
      { value: "Compact", prompt: "Use compact, dense tables" },
      { value: "Sortable", prompt: "Use sortable column headers" },
    ],
  },
  socialSharing: {
    label: "Social Sharing",
    subtitle: "Social media integration",
    icon: Share2,
    promptKey: "social_sharing",
    choices: [
      { value: "None", prompt: "No social sharing features" },
      { value: "Buttons", prompt: "Include social share buttons" },
      { value: "Links", prompt: "Include social media links" },
      { value: "Follow", prompt: "Include follow buttons" },
      { value: "Open Graph", prompt: "Include Open Graph meta tags" },
    ],
  },

  // MEDIA HANDLING
  mediaHandling: {
    label: "Media Display",
    subtitle: "Image and video handling",
    icon: Image,
    promptKey: "media_handling",
    choices: [
      { value: "Standard", prompt: "Use standard image display" },
      { value: "Lazy Load", prompt: "Use lazy loading for images" },
      { value: "Blur Up", prompt: "Use blur-up placeholder loading" },
      { value: "Lightbox", prompt: "Use lightbox for image galleries" },
      { value: "Masonry", prompt: "Use masonry layout for images" },
      { value: "Video Modal", prompt: "Open videos in modal players" },
      { value: "Responsive Images", prompt: "Use responsive srcset images" },
    ],
  },

  // CODE BLOCK STYLE
  codeBlockStyle: {
    label: "Code Blocks",
    subtitle: "Code snippet styling",
    icon: Code,
    promptKey: "code_block_style",
    choices: [
      { value: "None", prompt: "No code blocks needed" },
      { value: "Simple", prompt: "Use simple monospace code blocks" },
      { value: "Highlighted", prompt: "Use syntax-highlighted code blocks" },
      { value: "Dark", prompt: "Use dark theme code blocks" },
      { value: "Light", prompt: "Use light theme code blocks" },
      { value: "Line Numbers", prompt: "Include line numbers in code" },
      { value: "Copy Button", prompt: "Include copy button for code" },
      { value: "Terminal", prompt: "Use terminal-style code display" },
    ],
  },

  // ERROR PAGE STYLE
  errorPageStyle: {
    label: "Error Pages",
    subtitle: "404 page design",
    icon: AlertCircle,
    promptKey: "error_page_style",
    choices: [
      { value: "Simple", prompt: "Use a simple error page" },
      { value: "Illustrated", prompt: "Use an illustrated error page" },
      { value: "Animated", prompt: "Use an animated error page" },
      { value: "Playful", prompt: "Use a playful/fun error page" },
      { value: "Minimal", prompt: "Use a minimal error page" },
      { value: "Search", prompt: "Include search on error page" },
    ],
  },

  // CTA SECTION STYLE
  ctaSectionStyle: {
    label: "CTA Section",
    subtitle: "Call-to-action block",
    icon: Target,
    promptKey: "cta_section_style",
    choices: [
      { value: "Centered", prompt: "Use a centered CTA section" },
      { value: "Split", prompt: "Use a split CTA with image" },
      { value: "Full Width", prompt: "Use a full-width CTA banner" },
      { value: "Card", prompt: "Use a card-style CTA" },
      { value: "Gradient", prompt: "Use a gradient background CTA" },
      { value: "Image Background", prompt: "Use an image background CTA" },
      { value: "Floating", prompt: "Use a floating/sticky CTA" },
      { value: "Newsletter", prompt: "Use a newsletter signup CTA" },
    ],
  },

  // LINK STYLE
  linkStyle: {
    label: "Link Style",
    subtitle: "Text link treatment",
    icon: Link,
    promptKey: "link_style",
    choices: [
      { value: "Underline", prompt: "Use underlined links" },
      { value: "No Underline", prompt: "Use links without underline" },
      { value: "Hover Underline", prompt: "Show underline only on hover" },
      { value: "Color Only", prompt: "Distinguish links by color only" },
      { value: "Bold", prompt: "Use bold text for links" },
      { value: "Arrow", prompt: "Add arrow icon to links" },
      { value: "Animated", prompt: "Use animated link effects" },
    ],
  },

  // LIST STYLE
  listStyle: {
    label: "List Style",
    subtitle: "List and bullet design",
    icon: List,
    promptKey: "list_style",
    choices: [
      { value: "Standard", prompt: "Use standard bullet lists" },
      { value: "Check", prompt: "Use checkmark lists" },
      { value: "Arrow", prompt: "Use arrow bullet lists" },
      { value: "Number", prompt: "Use numbered lists" },
      { value: "Icon", prompt: "Use custom icon bullets" },
      { value: "Card", prompt: "Use card-style list items" },
      { value: "Timeline", prompt: "Use timeline-style lists" },
    ],
  },

  // SPACING SCALE
  spacingScale: {
    label: "Spacing Scale",
    subtitle: "Whitespace system",
    icon: Maximize,
    promptKey: "spacing_scale",
    choices: [
      { value: "Tight", prompt: "Use tight spacing throughout" },
      { value: "Default", prompt: "Use standard spacing scale" },
      { value: "Relaxed", prompt: "Use relaxed, generous spacing" },
      { value: "Dramatic", prompt: "Use dramatic whitespace for impact" },
    ],
  },

  // BORDER WIDTH
  borderWidth: {
    label: "Border Width",
    subtitle: "Line thickness",
    icon: Square,
    promptKey: "border_width",
    choices: [
      { value: "None", prompt: "Avoid borders" },
      { value: "Hairline", prompt: "Use 1px hairline borders" },
      { value: "Thin", prompt: "Use thin 1-2px borders" },
      { value: "Medium", prompt: "Use medium 2-3px borders" },
      { value: "Thick", prompt: "Use thick 3-4px borders" },
      { value: "Heavy", prompt: "Use heavy 4px+ borders" },
    ],
  },

  // MICRO COPY
  microCopy: {
    label: "Micro Copy",
    subtitle: "UI text style",
    icon: FileText,
    promptKey: "micro_copy",
    choices: [
      { value: "Formal", prompt: "Use formal, professional UI text" },
      { value: "Casual", prompt: "Use casual, friendly UI text" },
      { value: "Minimal", prompt: "Use minimal, essential-only text" },
      { value: "Helpful", prompt: "Use helpful, explanatory text" },
      { value: "Playful", prompt: "Use playful, personality-filled text" },
      { value: "Technical", prompt: "Use technical, precise text" },
    ],
  },

  // EMPTY STATES
  emptyStates: {
    label: "Empty States",
    subtitle: "No-content design",
    icon: Folder,
    promptKey: "empty_states",
    choices: [
      { value: "Simple", prompt: "Use simple text empty states" },
      { value: "Illustrated", prompt: "Use illustrated empty states" },
      { value: "Actionable", prompt: "Use empty states with CTAs" },
      { value: "Minimal", prompt: "Use minimal empty states" },
      { value: "Animated", prompt: "Use animated empty states" },
    ],
  },
  heroStyle: {
    label: "Hero Style",
    subtitle: "Above-the-fold design",
    icon: Maximize2,
    promptKey: "hero_style",
    choices: [
      {
        value: "Centered",
        prompt: "Use a centered hero with headline, subtext, and CTA",
      },
      {
        value: "Split",
        prompt: "Use a split hero with content on one side, image on other",
      },
      {
        value: "Full Screen",
        prompt: "Use a full-screen hero taking up entire viewport",
      },
      { value: "Video Background", prompt: "Use a hero with video background" },
      {
        value: "Animated",
        prompt: "Use a hero with animated graphics or illustrations",
      },
      { value: "Gradient", prompt: "Use a hero with bold gradient background" },
      { value: "Minimal", prompt: "Use a minimal text-only hero" },
      {
        value: "Product Showcase",
        prompt: "Use a hero showcasing the product with mockups",
      },
      { value: "Stats", prompt: "Use a hero with key statistics and metrics" },
      {
        value: "Testimonial",
        prompt: "Use a hero featuring a prominent testimonial",
      },
      {
        value: "Interactive",
        prompt: "Use an interactive hero with demos or configurators",
      },
      { value: "Parallax", prompt: "Use a parallax scrolling hero effect" },
      { value: "3D", prompt: "Use a hero with 3D graphics or WebGL elements" },
      { value: "Carousel", prompt: "Use a hero carousel with multiple slides" },
      {
        value: "Search Focused",
        prompt: "Use a hero centered around a search input",
      },
      {
        value: "Card Stack",
        prompt: "Use a hero with stacked cards or features",
      },
      {
        value: "Asymmetric",
        prompt: "Use an asymmetric hero with unconventional layout",
      },
      {
        value: "Bento Grid",
        prompt: "Use a bento box grid hero with multiple elements",
      },
    ],
  },

  // ==================== NEW BUTTON STYLE CATEGORY ====================

  buttonStyle: {
    label: "Button Style",
    subtitle: "Button and CTA design",
    icon: MousePointer,
    promptKey: "button_style",
    choices: [
      {
        value: "Solid",
        prompt: "Use solid filled buttons with background color",
      },
      { value: "Outline", prompt: "Use outline/ghost buttons with borders" },
      { value: "Gradient", prompt: "Use buttons with gradient backgrounds" },
      { value: "Pill", prompt: "Use pill-shaped fully rounded buttons" },
      {
        value: "Sharp",
        prompt: "Use sharp rectangular buttons with no border radius",
      },
      { value: "Rounded", prompt: "Use buttons with subtle rounded corners" },
      { value: "Icon + Text", prompt: "Use buttons with icons alongside text" },
      {
        value: "Animated",
        prompt: "Use buttons with hover animations and transitions",
      },
      { value: "3D/Elevated", prompt: "Use 3D buttons with shadows and depth" },
      {
        value: "Underline",
        prompt: "Use underline-style text links as buttons",
      },
      { value: "Glow", prompt: "Use buttons with glow effects on hover" },
      {
        value: "Neubrutalist",
        prompt: "Use thick-bordered neubrutalist style buttons",
      },
      { value: "Glass", prompt: "Use glassmorphism style buttons with blur" },
      { value: "Split", prompt: "Use split buttons with multiple actions" },
      {
        value: "Loading States",
        prompt: "Include loading spinner states for buttons",
      },
    ],
  },

  // ==================== NEW CARD STYLE CATEGORY ====================

  cardStyle: {
    label: "Card Style",
    subtitle: "Card and container design",
    icon: Square,
    promptKey: "card_style",
    choices: [
      { value: "Flat", prompt: "Use flat cards with subtle borders" },
      { value: "Elevated", prompt: "Use elevated cards with shadows" },
      { value: "Bordered", prompt: "Use cards with prominent borders" },
      {
        value: "Glass",
        prompt: "Use glassmorphism cards with blur and transparency",
      },
      { value: "Gradient", prompt: "Use cards with gradient backgrounds" },
      { value: "Outlined", prompt: "Use cards with outline/stroke only" },
      { value: "Hover Lift", prompt: "Use cards that lift/scale on hover" },
      { value: "Image Heavy", prompt: "Use cards with large featured images" },
      { value: "Compact", prompt: "Use compact, dense card layouts" },
      { value: "Expanded", prompt: "Use spacious cards with generous padding" },
      {
        value: "Asymmetric",
        prompt: "Use asymmetric card layouts with varied sizes",
      },
      { value: "Stacked", prompt: "Use overlapping stacked card effects" },
      { value: "Neumorphic", prompt: "Use neumorphic soft shadow cards" },
      {
        value: "Brutalist",
        prompt: "Use brutalist cards with thick borders and bold shadows",
      },
      {
        value: "Interactive",
        prompt: "Use interactive cards with flip or expand animations",
      },
    ],
  },

  // ==================== NEW FORM STYLE CATEGORY ====================

  formStyle: {
    label: "Form Style",
    subtitle: "Input and form design",
    icon: Edit3,
    promptKey: "form_style",
    choices: [
      { value: "Standard", prompt: "Use standard form inputs with borders" },
      { value: "Underline", prompt: "Use underline-only input fields" },
      { value: "Filled", prompt: "Use filled background input fields" },
      {
        value: "Floating Label",
        prompt: "Use floating label inputs that animate",
      },
      { value: "Outlined", prompt: "Use outlined inputs with rounded corners" },
      { value: "Minimal", prompt: "Use minimal, borderless inputs" },
      { value: "Inline", prompt: "Use inline form layouts" },
      { value: "Card", prompt: "Wrap form fields in card containers" },
      {
        value: "Stepped",
        prompt: "Use multi-step form with progress indicator",
      },
      {
        value: "Conversational",
        prompt: "Use conversational, chatbot-style forms",
      },
      {
        value: "Inline Validation",
        prompt: "Include inline validation messages",
      },
      { value: "Large", prompt: "Use large, prominent input fields" },
      { value: "Compact", prompt: "Use compact, space-efficient inputs" },
      { value: "Searchable", prompt: "Use searchable dropdowns and selects" },
      { value: "Date Picker", prompt: "Include date picker with calendar UI" },
    ],
  },

  // ==================== NEW ICON STYLE CATEGORY ====================

  iconStyle: {
    label: "Icon Style",
    subtitle: "Icon design approach",
    icon: Sparkles,
    promptKey: "icon_style",
    choices: [
      { value: "Line", prompt: "Use line/stroke icons" },
      { value: "Solid", prompt: "Use solid filled icons" },
      { value: "Duo-tone", prompt: "Use duo-tone icons with two colors" },
      {
        value: "Outlined",
        prompt: "Use outlined icons with consistent stroke",
      },
      { value: "Colored", prompt: "Use colorful icons with brand colors" },
      { value: "Gradient", prompt: "Use icons with gradient fills" },
      { value: "3D", prompt: "Use 3D or isometric icons" },
      { value: "Hand-drawn", prompt: "Use hand-drawn style icons" },
      { value: "Minimal", prompt: "Use minimal, simplified icons" },
      { value: "Detailed", prompt: "Use detailed, illustrative icons" },
      {
        value: "Animated",
        prompt: "Use animated icons with micro-interactions",
      },
      { value: "Emoji", prompt: "Use emoji as icons" },
      { value: "Custom Illustrations", prompt: "Use custom illustrated icons" },
      { value: "Phosphor", prompt: "Use Phosphor icon style" },
      { value: "Heroicons", prompt: "Use Heroicons style" },
      { value: "Lucide", prompt: "Use Lucide icon style" },
      { value: "Feather", prompt: "Use Feather icon style" },
    ],
  },
  typographyScale: {
    label: "Type Scale",
    subtitle: "Typography sizing system",
    icon: Type,
    promptKey: "type_scale",
    choices: [
      {
        value: "Compact",
        prompt: "Use a compact type scale with smaller sizes",
      },
      { value: "Default", prompt: "Use a standard type scale" },
      { value: "Large", prompt: "Use a large type scale for emphasis" },
      {
        value: "Dramatic",
        prompt: "Use a dramatic type scale with huge headlines",
      },
      {
        value: "Fluid",
        prompt: "Use fluid/responsive typography that scales with viewport",
      },
      {
        value: "Modular",
        prompt: "Use a strict modular scale (e.g., 1.25 ratio)",
      },
    ],
  },

  dividerStyle: {
    label: "Section Dividers",
    subtitle: "How sections are separated",
    icon: Minus,
    promptKey: "divider_style",
    choices: [
      { value: "None", prompt: "No visible dividers between sections" },
      { value: "Line", prompt: "Use simple line dividers" },
      { value: "Wave", prompt: "Use wave-shaped dividers" },
      { value: "Angle", prompt: "Use angled/diagonal dividers" },
      { value: "Curve", prompt: "Use curved dividers" },
      { value: "Mountain", prompt: "Use mountain/peak shaped dividers" },
      { value: "Gradient Fade", prompt: "Use gradient fade transitions" },
      { value: "Color Block", prompt: "Use alternating color blocks" },
      { value: "Zigzag", prompt: "Use zigzag pattern dividers" },
      { value: "Torn Paper", prompt: "Use torn paper edge dividers" },
      { value: "Dots", prompt: "Use dot row dividers" },
      { value: "Space", prompt: "Use generous whitespace as dividers" },
    ],
  },
};

// ==================== EXPANDED CATEGORIES ====================
// Grouped by function for easier organization

const CATEGORIES = [
  // Structure & Layout
  "template",
  "navigation",
  "layout",
  "sections",
  "contentFlow",
  "hierarchy",
  "density",

  // Visual Style
  "style",
  "inspiration",
  "palette",
  "customColors",
  "mode",
  "gradientStyle",
  "backgroundPattern",
  "corners",
  "shadowStyle",
  "hoverEffects",

  // Typography
  "font",
  "typographyScale",
  "headingStyle",

  // Components
  "heroStyle",
  "buttonStyle",
  "cardStyle",
  "formStyle",
  "iconStyle",
  "badgeStyle",
  "avatarStyle",
  "tabStyle",
  "accordionStyle",
  "carouselStyle",
  "notificationStyle",
  "progressStyle",
  "tableStyle",
  "linkStyle",
  "listStyle",
  "emptyStates",

  // Content Blocks
  "testimonialStyle",
  "pricingStyle",
  "statsStyle",
  "teamStyle",
  "faqStyle",
  "contactStyle",
  "footerStyle",
  "ctaSectionStyle",
  "socialProof",

  // Content & Copy
  "tone",
  "copyLength",
  "brandPersonality",
  "microCopy",
  "cta",
  "goal",
  "industry",
  "audience",

  // Effects & Motion
  "animation",
  "interaction",
  "scrollBehavior",
  "loadingStyle",

  // Spacing & Borders
  "spacingScale",
  "dividerStyle",
  "borderWidth",

  // Media
  "images",
  "mediaHandling",
  "codeBlockStyle",

  // Technical
  "framework",
  "accessibility",
  "seoLevel",
  "performanceLevel",
  "responsiveApproach",
  "mobileMenu",

  // Features
  "darkModeToggle",
  "cookieBanner",
  "socialSharing",
  "stickyElements",
  "errorPageStyle",

  // AI Controls
  "creativity",

  // Persistent / Brand Assets
  "persistent",
];

function InfinitePillRow({ children, reverse, duration = 35 }) {
  return (
    <div className="pill-row">
      <motion.div
        className="pill-row__track"
        animate={{
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

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
  const { pendingProject, pendingAction, clearPendingProject } = useProject();
  const [showLegal, setShowLegal] = useState(false);

  useEffect(() => {
    if (!pendingProject || !pendingAction) return;

    console.log(
      "Home: Processing pending project action:",
      pendingAction,
      pendingProject.id
    );

    if (pendingAction === "edit") {
      // Load project into preview for editing
      setGeneratedHtml(pendingProject.html_content);

      // Restore prompt from customization
      const savedPrompt =
        pendingProject.customization?.prompt || pendingProject.name || "";
      setPrompt(savedPrompt);

      // Restore selections/customization if available
      if (pendingProject.customization) {
        const { prompt: _, ...savedSelections } = pendingProject.customization;
        setSelections((prev) => ({ ...prev, ...savedSelections }));
      }

      // Show preview
      setShowPreview(true);
      setIsPreviewMinimized(false);

      // Clear the pending project
      clearPendingProject();
    } else if (pendingAction === "deploy") {
      // Load project and open deploy modal
      setGeneratedHtml(pendingProject.html_content);

      // You might want to store the project ID for the deploy process
      // setCurrentProjectId(pendingProject.id);

      // Open deploy modal
      setShowDeploy(true);

      // Clear the pending project
      clearPendingProject();
    }
  }, [pendingProject, pendingAction, clearPendingProject]);

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
        // Initialize with default values
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

  const [persistentOptions, setPersistentOptions] = useState({
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedIn: "",
      github: "",
      dribbble: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      address: "",
      contactFormEndpoint: "",
    },
    branding: {
      logoUrl: "",
      faviconUrl: "",
      brandName: "",
      tagline: "",
    },
    images: [], // Array of image URLs or objects
    links: {
      termsOfService: "",
      privacyPolicy: "",
      pricingPage: "",
      blog: "",
    },
  });

  const [isInputExpanded, setIsInputExpanded] = useState(false);
  // New overlay tab state
  const [overlayTab, setOverlayTab] = useState("design"); // 'design' | 'content'

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
  const [_, setPendingAction] = useState(null);

  // Enhance input state
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [showEnhanceTokenOverlay, setShowEnhanceTokenOverlay] = useState(false);

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

  // Handle input focus
  const handleInputFocus = () => {
    setIsInputExpanded(true);
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Only collapse if input is empty
    if (!prompt.trim()) {
      setIsInputExpanded(false);
    }
  };

  // Update expanded state when prompt changes
  useEffect(() => {
    if (prompt.trim()) {
      setIsInputExpanded(true);
    }
  }, [prompt]);

  const showPlaceholderAnimation = !prompt && !isGenerating && !isInputExpanded;

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
    } else if (!hasCustomizations && !isGenerating && !isInputExpanded) {
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

    if (opt.isColorPicker) {
      // Only show as selected if palette is set to "Custom"
      return selections.palette === "Custom";
    }

    return selections[key] !== null && selections[key] !== undefined;
  };

  const getDisplayValue = (key) => {
    const opt = OPTIONS[key];
    if (!opt) return null;

    if (opt.multi) {
      const count = selections[key]?.length || 0;
      if (count === 0) return null;
      if (count === 1) return selections[key][0];
      return `${count} selected`;
    }

    // Handle custom colors specially
    if (key === "palette" && selections[key] === "Custom") {
      return "Custom Colors";
    }

    // Handle customColors object - return null since it's not a displayable value
    if (key === "customColors") {
      return null; // Don't display this as an active pill
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

    // Add persistent content first
    const hasPersistentContent = Object.values(persistentOptions).some(
      (section) =>
        typeof section === "object"
          ? Object.values(section).some(
              (value) =>
                value &&
                (Array.isArray(value)
                  ? value.length > 0
                  : typeof value === "string"
                  ? value.trim().length > 0
                  : false)
            )
          : Array.isArray(section)
          ? section.length > 0
          : section
    );

    if (hasPersistentContent) {
      const persistentParts = [];

      // Branding
      if (
        persistentOptions.branding.brandName ||
        persistentOptions.branding.tagline ||
        persistentOptions.branding.logoUrl
      ) {
        persistentParts.push("", "BRANDING:");
        if (persistentOptions.branding.brandName)
          persistentParts.push(
            `- Brand Name: ${persistentOptions.branding.brandName}`
          );
        if (persistentOptions.branding.tagline)
          persistentParts.push(
            `- Tagline: ${persistentOptions.branding.tagline}`
          );
        if (persistentOptions.branding.logoUrl)
          persistentParts.push(
            `- Logo URL: ${persistentOptions.branding.logoUrl}`
          );
      }

      // Social Media
      const socialLinks = Object.entries(persistentOptions.socialMedia)
        .filter(([_, url]) => url && url.trim())
        .map(([platform, url]) => `- ${platform}: ${url}`);

      if (socialLinks.length > 0) {
        persistentParts.push("", "SOCIAL MEDIA LINKS:", ...socialLinks);
      }

      // Contact Info
      const contactInfo = [];
      if (
        persistentOptions.contactInfo.email &&
        persistentOptions.contactInfo.email.trim()
      )
        contactInfo.push(`- Email: ${persistentOptions.contactInfo.email}`);
      if (
        persistentOptions.contactInfo.phone &&
        persistentOptions.contactInfo.phone.trim()
      )
        contactInfo.push(`- Phone: ${persistentOptions.contactInfo.phone}`);
      if (
        persistentOptions.contactInfo.contactFormEndpoint &&
        persistentOptions.contactInfo.contactFormEndpoint.trim()
      )
        contactInfo.push(
          `- Form Endpoint: ${persistentOptions.contactInfo.contactFormEndpoint}`
        );

      if (contactInfo.length > 0) {
        persistentParts.push("", "CONTACT INFORMATION:", ...contactInfo);
      }

      // Important Links
      const links = Object.entries(persistentOptions.links)
        .filter(([_, url]) => url && url.trim())
        .map(([linkType, url]) => `- ${linkType}: ${url}`);

      if (links.length > 0) {
        persistentParts.push("", "IMPORTANT LINKS:", ...links);
      }

      // Images
      if (persistentOptions.images.length > 0) {
        persistentParts.push("", "IMAGES:");
        persistentOptions.images.forEach((img, i) => {
          persistentParts.push(
            `- Image ${i + 1}: ${img.alt || "Uploaded image"}`
          );
        });
      }

      if (persistentParts.length > 0) {
        promptParts.push("", "PERSISTENT CONTENT:", ...persistentParts);
      }
    }

    // Continue with existing specs
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

  // Token cost for enhance/refinement
  const enhanceTokenCost = useMemo(() => {
    return calculateTokenCost(enhancePrompt, selections, true);
  }, [enhancePrompt, selections]);
  const enhanceBreakdown = getBreakdownDisplay(enhanceTokenCost.breakdown);

  const getActiveCategories = () => {
    return CATEGORIES.filter((key) => {
      if (!hasSelection(key)) return false;
      const displayValue = getDisplayValue(key);
      return displayValue !== null && displayValue !== undefined;
    }).map((key) => ({
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

      // Special handling for palette selection
      if (optionKey === "palette" && value === "Custom") {
        // Don't close the overlay, stay in the palette section
        // The custom colors editor will be shown automatically
        return;
      }

      if (optionKey === "persistent") {
        setOverlayTab("content");
        return;
      }

      // Close overlay after selection
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

  const handleSaveProject = async () => {
    // Debug: Check what we're sending
    console.log("Save project called");
    console.log("generatedHtml exists:", !!generatedHtml);
    console.log("generatedHtml length:", generatedHtml?.length || 0);
    console.log("prompt:", prompt);

    if (!generatedHtml) {
      alert("No generated HTML to save");
      return;
    }

    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const requestBody = {
        name: prompt ? prompt.slice(0, 50) : "Untitled Project",
        htmlContent: generatedHtml,
        prompt: prompt || "",
        templateType: selections.template || null,
        designStyle: selections.style || null,
        customization: selections,
      };

      // Debug: Log what we're sending
      console.log("Sending to save-project:", {
        name: requestBody.name,
        htmlContentLength: requestBody.htmlContent?.length,
        prompt: requestBody.prompt,
      });

      const { data, error } = await supabase.functions.invoke("save-project", {
        body: requestBody,
      });

      console.log("Response:", { data, error });

      if (error) throw error;

      if (data?.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        console.log("Project saved:", data.project?.id);
      } else {
        throw new Error(data?.error || "Failed to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(`Failed to save project: ${error.message || error}`);
    } finally {
      setIsSaving(false);
    }
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
        ? "Get Started Now â†’"
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
<section class="features" id="features"><div class="container"><div class="section-header"><h2>Why Choose Us</h2><p>Everything you need to succeed</p></div><div class="features-grid"><div class="feature"><div class="feature-icon">âš¡</div><h3>Lightning Fast</h3><p>Optimized for speed and performance.</p></div><div class="feature"><div class="feature-icon">ðŸŽ¨</div><h3>Beautiful Design</h3><p>Stunning visuals that capture attention.</p></div><div class="feature"><div class="feature-icon">ðŸ“±</div><h3>Fully Responsive</h3><p>Looks perfect on every device.</p></div></div></div></section>
<section id="cta"><div class="cta-section"><h2>Ready to Get Started?</h2><p>Join thousands of satisfied customers today.</p><a href="#" class="btn">${
      s.cta === "Urgent" ? "Start Free Now â†’" : "Get Started"
    }</a></div></section>
<footer><div class="container"><div class="footer-content"><div class="footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div><div class="footer-copy">Â© ${new Date().getFullYear()} ${
      prompt.split(" ")[0] || "Brand"
    }</div></div></div></footer>
${
  hasFloatingCta
    ? `<a href="#cta" class="floating-cta">${
        s.cta === "Urgent" ? "Try Free â†’" : "Get Started"
      }</a>`
    : ""
}
${hasChat ? `<button class="chat-btn">ðŸ’¬</button>` : ""}
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
    const value = enhancePrompt.trim();
    if (!value || !generatedHtml) return;

    setShowEnhanceTokenOverlay(false);

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
        setEnhancePrompt("");

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

  const categoryItems = CATEGORIES.filter(
    (cat) => cat !== "persistent" && cat !== "customColors"
  );

  const categoryRows = chunk(categoryItems, 9);

  return (
    <div className="home">
      <div className="home__center">
        {/* Search Bar */}
        {/* Search Bar */}
        <motion.div
          className={`home__search ${
            isInputExpanded ? "home__search--expanded" : ""
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="home__input-wrapper">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={
                showPlaceholderAnimation ? "" : "Describe your website..."
              }
              className="home__input"
              rows={1}
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
              {(prompt.trim() || isInputExpanded) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto" }}
                  exit={{ opacity: 0, scale: 0.8, width: 0 }}
                  transition={{ duration: 0.2 }}
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
                  <span className="home__btn-text">-{tokenCost.cost}</span>
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              className={`home__help-btn ${
                isInputExpanded ? "home__help-btn--expanded" : ""
              }`}
              onClick={() => setShowHelp(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Get Help"
            >
              <HelpCircle size={18} />
              <span className="home__btn-text">Help</span>
            </motion.button>
            <motion.button
              className={`home__gear-btn ${showOverlay ? "active" : ""} ${
                isInputExpanded ? "home__gear-btn--expanded" : ""
              }`}
              onClick={() => {
                setShowOverlay(!showOverlay);
                setShowTokenOverlay(false);
                if (showOverlay) setActiveOption(null);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={18} />
              <span className="home__btn-text">Options</span>
            </motion.button>
            <motion.button
              className={`home__submit ${
                isInputExpanded ? "home__submit--expanded" : ""
              }`}
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
              <span className="home__btn-text">Generate</span>
            </motion.button>
          </div>
        </motion.div>

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
              className="home__overlay-content home__overlay-content--split"
              onClick={(e) => e.stopPropagation()}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Top Section: Design Options */}
              <div className="overlay-section overlay-section--top">
                <motion.div
                  className="persistent-options-grid"
                  variants={pillContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div>
                    {/* Brand Name */}
                    <motion.div
                      className="persistent-field"
                      variants={pillVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <label>Brand Name</label>
                      <input
                        type="text"
                        value={persistentOptions.branding.brandName}
                        onChange={(e) =>
                          setPersistentOptions((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              brandName: e.target.value,
                            },
                          }))
                        }
                        placeholder="Your Company"
                      />
                    </motion.div>

                    {/* Tagline */}
                    <motion.div
                      className="persistent-field"
                      variants={pillVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <label>Tagline</label>
                      <input
                        type="text"
                        value={persistentOptions.branding.tagline}
                        onChange={(e) =>
                          setPersistentOptions((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              tagline: e.target.value,
                            },
                          }))
                        }
                        placeholder="Your tagline here"
                      />
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      className="persistent-field"
                      variants={pillVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <label>Email</label>
                      <input
                        type="email"
                        value={persistentOptions.contactInfo.email}
                        onChange={(e) =>
                          setPersistentOptions((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              email: e.target.value,
                            },
                          }))
                        }
                        placeholder="contact@example.com"
                      />
                    </motion.div>
                  </div>

                  <div>
                    {/* Social fields */}
                    {Object.entries(persistentOptions.socialMedia)
                      .slice(0, 4)
                      .map(([platform, url]) => (
                        <motion.div
                          key={platform}
                          className="persistent-field persistent-field--small"
                          variants={pillVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <label>
                            {platform.charAt(0).toUpperCase() +
                              platform.slice(1)}
                          </label>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) =>
                              setPersistentOptions((prev) => ({
                                ...prev,
                                socialMedia: {
                                  ...prev.socialMedia,
                                  [platform]: e.target.value,
                                },
                              }))
                            }
                            placeholder={`${platform}.com/...`}
                          />
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Section: Content & Assets */}
              {/* Bottom Section: Content & Assets */}
              <div className="overlay-section overlay-section--bottom">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  {!activeOption ? (
                    <motion.div
                      key="categories"
                      className="categories-section"
                      variants={pillContainerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="home__pills-rows">
                        {categoryRows.map((row, rowIndex) => (
                          <InfinitePillRow
                            key={rowIndex}
                            reverse={rowIndex % 2 === 1}
                            duration={40 - rowIndex * 2}
                          >
                            <div className="pill-row__content">
                              {row.map((catKey) => {
                                const opt = OPTIONS[catKey];
                                const Icon = opt?.icon;
                                const isSelected = hasSelection(catKey);

                                return (
                                  <motion.button
                                    key={catKey}
                                    className={`home__category-pill ${
                                      isSelected
                                        ? "home__category-pill--active"
                                        : ""
                                    }`}
                                    onClick={() => selectCategory(catKey)}
                                    variants={pillVariants}
                                  >
                                    {Icon && <Icon size={14} />}
                                    <span>{opt?.label}</span>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </InfinitePillRow>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="choices"
                      className="choices-section"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      custom={slideDirection}
                    >
                      <div className="home__option-header">
                        <button
                          className="home__back-btn"
                          onClick={goToCategories}
                        >
                          <ChevronLeft />
                        </button>
                        <div className="home__option-header-text">
                          <span className="home__option-header-label">
                            {OPTIONS[activeOption]?.label}
                          </span>
                          <span className="home__option-header-subtitle">
                            {OPTIONS[activeOption]?.subtitle}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        className="home__choice-pills"
                        variants={pillContainerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {OPTIONS[activeOption]?.choices?.map((choice) => {
                          const isMulti = OPTIONS[activeOption].multi;
                          const isActive = isMulti
                            ? selections[activeOption]?.includes(choice.value)
                            : selections[activeOption] === choice.value;

                          return (
                            <motion.button
                              key={choice.value}
                              className={`home__choice-pill ${
                                isActive ? "active" : ""
                              } ${
                                choice.colors ? "home__choice-pill--color" : ""
                              }`}
                              onClick={() =>
                                handleSelect(activeOption, choice.value)
                              }
                              variants={pillVariants}
                              whileHover="hover"
                              whileTap="tap"
                            >
                              {choice.colors && (
                                <div className="home__color-dots">
                                  {choice.colors.map((color, i) => (
                                    <span
                                      key={i}
                                      style={{ background: color }}
                                    />
                                  ))}
                                </div>
                              )}
                              <span>{choice.value}</span>
                            </motion.button>
                          );
                        })}
                      </motion.div>

                      {/* Custom Colors Section */}
                      {activeOption === "palette" &&
                        selections.palette === "Custom" && (
                          <motion.div
                            className="home__custom-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
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
                                    <span>
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
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Done
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                  {/* Download Button */}
                  <button
                    className="preview-save-btn"
                    onClick={handleDownload}
                    title="Download HTML"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                  {/* Save to Projects Button */}
                  <button
                    className={`preview-save-btn ${
                      saveSuccess ? "success" : ""
                    }`}
                    onClick={handleSaveProject}
                    disabled={isSaving}
                    title="Save to Projects"
                  >
                    {isSaving ? (
                      <Loader2 size={14} className="spin" />
                    ) : saveSuccess ? (
                      <>
                        <Check size={14} />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>Save</span>
                      </>
                    )}
                  </button>

                  {/* Deploy Button */}
                  <button
                    className="preview-deploy-btn"
                    onClick={() => setShowDeploy(true)}
                  >
                    <Rocket size={14} />
                    <span>Deploy</span>
                  </button>

                  {/* Close/Minimize Button */}
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
              <div className="preview-enhance home__search">
                <div className="home__input-wrapper">
                  <input
                    ref={enhanceInputRef}
                    type="text"
                    value={enhancePrompt}
                    onChange={(e) => setEnhancePrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isGenerating) handleEnhance();
                    }}
                    placeholder="Describe changes..."
                    className="home__input"
                    style={{
                      background: "transparent",
                      position: "relative",
                      zIndex: 2,
                    }}
                    disabled={isGenerating}
                  />
                </div>
                <div className="home__search-right">
                  <AnimatePresence>
                    {enhancePrompt.trim() && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className={`home__token-btn ${
                          showEnhanceTokenOverlay ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowEnhanceTokenOverlay(!showEnhanceTokenOverlay)
                        }
                      >
                        <Coins size={14} />
                        <span>-{enhanceTokenCost.cost}</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <motion.button
                    className="home__submit"
                    onClick={handleEnhance}
                    disabled={isGenerating || !enhancePrompt.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isGenerating ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Enhance Token Overlay */}
              <AnimatePresence>
                {showEnhanceTokenOverlay && (
                  <motion.div
                    className="home__overlay-content home__overlay-content--token preview-enhance__token-overlay"
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
                        {enhanceTokenCost.cost} tokens
                      </span>
                    </motion.div>
                    <motion.div className="home__token-breakdown">
                      {enhanceBreakdown.map((item, i) => (
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
                    {(!isAuthenticated ||
                      userTokens < enhanceTokenCost.cost) && (
                      <motion.button
                        className="home__buy-btn"
                        onClick={() => {
                          setShowEnhanceTokenOverlay(false);
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
                )}
              </AnimatePresence>
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
          html={generatedHtml}
          projectName={
            prompt.split(" ").slice(0, 3).join("-").toLowerCase() || "my-site"
          }
          prompt={prompt}
          customization={selections}
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
      <LegalModal isOpen={showLegal} onClose={() => setShowLegal(false)} />
    </div>
  );
}

export default Home;
