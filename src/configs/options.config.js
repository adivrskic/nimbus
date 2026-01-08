import {
  Layout,
  Paintbrush,
  Palette,
  Sun,
  Type,
  MessageSquare,
  FileText,
  Target,
  Building2,
  Users,
  Award,
  Layers,
  Grid3X3,
  Maximize,
  Circle,
  Image,
  Zap,
  Code,
  Accessibility,
  Pin,
  Lightbulb,
  Compass,
  Globe,
  Blend,
  Menu,
  Smartphone,
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
  Heart,
  Link,
  List,
  Workflow,
  MousePointer,
  Sparkles,
  Smile,
} from "lucide-react";

export const OPTIONS = {
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
  emojis: {
    label: "Emojis",
    subtitle: "Use of emojis",
    icon: Smile,
    multi: false,
    promptKey: "emojis",
    choices: [
      { value: "Use", prompt: "include emojis in the website" },
      { value: "Don't Use", prompt: "don't include emojis in the website" },
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
          "inspired by Notion's calm workspace aesthetic with minimal chrome, muted colors, and document-like layouts",
      },
      {
        value: "Figma",
        prompt:
          "inspired by Figma's product-led UI with clear panels, toolbars, and a neutral canvas feel",
      },
      {
        value: "Linear",
        prompt:
          "inspired by Linear's ultra-minimal, fast, and opinionated product design with strong typography and dark/light modes",
      },
      {
        value: "Framer",
        prompt:
          "inspired by Framer's motion-rich marketing pages with big gradients, bold sections, and smooth animations",
      },
      {
        value: "Dropbox",
        prompt:
          "inspired by Dropbox's friendly, illustration-heavy brand with lots of whitespace and approachable typography",
      },
      {
        value: "Spotify",
        prompt:
          "inspired by Spotify's bold, music-inspired visuals with dark bases, saturated accents, and expressive imagery",
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
    icon: Maximize,
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
  formStyle: {
    label: "Form Style",
    subtitle: "Input and form design",
    icon: FileText,
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

export default OPTIONS;
