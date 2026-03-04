import {
  Cloudy,
  Zap,
  Palette,
  Download,
  Globe,
  BarChart3,
  FileText,
  Database,
  Mail,
  Sparkles,
  Settings,
  MousePointerClick,
  ArrowRight,
  Coins,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useModals } from "../contexts/ModalContext";
import "./Footer.scss";

const EMOJIS = [
  "🌽",
  "🍇",
  "🍌",
  "🍒",
  "🍕",
  "🍷",
  "🍭",
  "💖",
  "💩",
  "🐷",
  "🐸",
  "🐳",
  "🎃",
  "🎾",
  "🌈",
  "🍦",
  "💁",
  "🔥",
  "😁",
  "😱",
  "🌴",
  "👏",
  "💃",
  "🎉",
  "✨",
  "🌟",
  "🦄",
  "🎈",
  "🎨",
  "🚀",
];

const ADD_ONS = [
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Track visitors, page views, and engagement with a lightweight analytics dashboard — no third-party scripts required.",
    tag: "5 tokens",
    visual: "analytics",
  },
  {
    icon: FileText,
    title: "Blog Engine",
    description:
      "Add a fully styled blog with article listings, post pages, tags, and reading time — generated from your site's design language.",
    tag: "10 tokens",
    visual: "blog",
  },
  {
    icon: Database,
    title: "CMS Integration",
    description:
      "Connect your content to Sanity, Contentful, or a simple JSON-based CMS so anyone on your team can edit without touching code.",
    tag: "10 tokens",
    visual: "cms",
  },
  {
    icon: Mail,
    title: "Contact Form",
    description:
      "A working contact form wired to Formspree, Netlify Forms, or a serverless endpoint — with validation and success states baked in.",
    tag: "6 tokens",
    visual: "form",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Sparkles,
    step: "01",
    title: "Describe & Generate",
    description:
      "Write a plain-English prompt describing your site — industry, audience, vibe. Get a fully built, responsive website in seconds.",
  },
  {
    icon: Settings,
    step: "02",
    title: "Customize Everything",
    description:
      "Fine-tune with 60+ design controls — layout, typography, colors, animations, and more. Every option adjusts the output.",
  },
  {
    icon: MousePointerClick,
    step: "03",
    title: "Enhance & Iterate",
    description:
      "Not perfect? Describe what to enhance. The AI modifies only what you ask — keeping the rest intact.",
  },
];

function AddOnVisual({ type }) {
  const sharedStyles = {
    width: "100%",
    height: "100%",
    borderRadius: "var(--radius-md)",
  };

  if (type === "analytics") {
    return (
      <svg viewBox="0 0 280 180" fill="none" style={sharedStyles}>
        <rect width="280" height="180" rx="8" fill="var(--color-background)" />
        <rect
          x="32"
          y="120"
          width="24"
          height="40"
          rx="4"
          fill="var(--color-border-hover)"
          opacity="0.5"
        />
        <rect
          x="64"
          y="95"
          width="24"
          height="65"
          rx="4"
          fill="var(--color-border-hover)"
          opacity="0.6"
        />
        <rect
          x="96"
          y="105"
          width="24"
          height="55"
          rx="4"
          fill="var(--color-border-hover)"
          opacity="0.5"
        />
        <rect
          x="128"
          y="75"
          width="24"
          height="85"
          rx="4"
          fill="var(--color-border-hover)"
          opacity="0.7"
        />
        <rect
          x="160"
          y="55"
          width="24"
          height="105"
          rx="4"
          fill="var(--color-text-tertiary)"
          opacity="0.8"
        />
        <rect
          x="192"
          y="68"
          width="24"
          height="92"
          rx="4"
          fill="var(--color-border-hover)"
          opacity="0.6"
        />
        <rect
          x="224"
          y="45"
          width="24"
          height="115"
          rx="4"
          fill="var(--color-text-secondary)"
          opacity="0.7"
        />
        {/* Stat cards */}
        <rect
          x="32"
          y="20"
          width="72"
          height="32"
          rx="6"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="40"
          y="28"
          width="40"
          height="6"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.5"
        />
        <rect
          x="40"
          y="38"
          width="24"
          height="8"
          rx="2"
          fill="var(--color-text-primary)"
          opacity="0.6"
        />
        <rect
          x="116"
          y="20"
          width="72"
          height="32"
          rx="6"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="124"
          y="28"
          width="36"
          height="6"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.5"
        />
        <rect
          x="124"
          y="38"
          width="28"
          height="8"
          rx="2"
          fill="var(--color-text-primary)"
          opacity="0.6"
        />
        <rect
          x="200"
          y="20"
          width="48"
          height="32"
          rx="6"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="208"
          y="28"
          width="32"
          height="6"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.5"
        />
        <rect
          x="208"
          y="38"
          width="20"
          height="8"
          rx="2"
          fill="var(--color-text-primary)"
          opacity="0.6"
        />
      </svg>
    );
  }

  if (type === "blog") {
    return (
      <svg viewBox="0 0 280 180" fill="none" style={sharedStyles}>
        <rect width="280" height="180" rx="8" fill="var(--color-background)" />
        {/* Blog post card 1 */}
        <rect
          x="20"
          y="16"
          width="116"
          height="148"
          rx="6"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="28"
          y="24"
          width="100"
          height="56"
          rx="4"
          fill="var(--color-border-hover)"
          opacity="0.4"
        />
        <rect
          x="28"
          y="88"
          width="80"
          height="6"
          rx="2"
          fill="var(--color-text-primary)"
          opacity="0.6"
        />
        <rect
          x="28"
          y="100"
          width="96"
          height="4"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="28"
          y="108"
          width="72"
          height="4"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="28"
          y="124"
          width="40"
          height="14"
          rx="7"
          fill="var(--color-border-hover)"
          opacity="0.5"
        />
        <rect
          x="74"
          y="124"
          width="32"
          height="14"
          rx="7"
          fill="var(--color-border-hover)"
          opacity="0.3"
        />
        <rect
          x="28"
          y="146"
          width="52"
          height="4"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.3"
        />
        {/* Blog post card 2 */}
        <rect
          x="144"
          y="16"
          width="116"
          height="148"
          rx="6"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="152"
          y="24"
          width="100"
          height="56"
          rx="4"
          fill="var(--color-border-hover)"
          opacity="0.3"
        />
        <rect
          x="152"
          y="88"
          width="72"
          height="6"
          rx="2"
          fill="var(--color-text-primary)"
          opacity="0.6"
        />
        <rect
          x="152"
          y="100"
          width="88"
          height="4"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="152"
          y="108"
          width="64"
          height="4"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="152"
          y="124"
          width="44"
          height="14"
          rx="7"
          fill="var(--color-border-hover)"
          opacity="0.5"
        />
        <rect
          x="152"
          y="146"
          width="48"
          height="4"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.3"
        />
      </svg>
    );
  }

  if (type === "cms") {
    return (
      <svg viewBox="0 0 280 180" fill="none" style={sharedStyles}>
        <rect width="280" height="180" rx="8" fill="var(--color-background)" />
        {/* Sidebar */}
        <rect
          x="12"
          y="12"
          width="64"
          height="156"
          rx="6"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="20"
          y="24"
          width="48"
          height="6"
          rx="2"
          fill="var(--color-text-primary)"
          opacity="0.5"
        />
        <rect
          x="20"
          y="40"
          width="40"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="20"
          y="52"
          width="44"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.6"
        />
        <rect
          x="20"
          y="64"
          width="36"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="20"
          y="76"
          width="40"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        {/* Content editor area */}
        <rect
          x="84"
          y="12"
          width="184"
          height="36"
          rx="6"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="92"
          y="22"
          width="120"
          height="8"
          rx="3"
          fill="var(--color-text-primary)"
          opacity="0.5"
        />
        <rect
          x="92"
          y="34"
          width="60"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.3"
        />
        {/* Field rows */}
        <rect
          x="84"
          y="56"
          width="184"
          height="28"
          rx="5"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="92"
          y="64"
          width="48"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="150"
          y="62"
          width="108"
          height="14"
          rx="4"
          fill="var(--color-background)"
        />
        <rect
          x="84"
          y="92"
          width="184"
          height="28"
          rx="5"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="92"
          y="100"
          width="36"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="150"
          y="98"
          width="108"
          height="14"
          rx="4"
          fill="var(--color-background)"
        />
        <rect
          x="84"
          y="128"
          width="184"
          height="40"
          rx="5"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="92"
          y="136"
          width="44"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.4"
        />
        <rect
          x="150"
          y="132"
          width="108"
          height="28"
          rx="4"
          fill="var(--color-background)"
        />
      </svg>
    );
  }

  if (type === "form") {
    return (
      <svg viewBox="0 0 280 180" fill="none" style={sharedStyles}>
        <rect width="280" height="180" rx="8" fill="var(--color-background)" />
        {/* Form card */}
        <rect
          x="40"
          y="16"
          width="200"
          height="148"
          rx="8"
          fill="var(--color-surface-elevated)"
        />
        <rect
          x="56"
          y="28"
          width="100"
          height="8"
          rx="3"
          fill="var(--color-text-primary)"
          opacity="0.6"
        />
        <rect
          x="56"
          y="42"
          width="140"
          height="4"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.3"
        />
        {/* Name field */}
        <rect
          x="56"
          y="58"
          width="60"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.5"
        />
        <rect
          x="56"
          y="67"
          width="168"
          height="16"
          rx="4"
          fill="var(--color-background)"
        />
        {/* Email field */}
        <rect
          x="56"
          y="92"
          width="40"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.5"
        />
        <rect
          x="56"
          y="101"
          width="168"
          height="16"
          rx="4"
          fill="var(--color-background)"
        />
        {/* Message field */}
        <rect
          x="56"
          y="126"
          width="56"
          height="5"
          rx="2"
          fill="var(--color-text-tertiary)"
          opacity="0.5"
        />
        {/* Submit button */}
        <rect
          x="56"
          y="138"
          width="72"
          height="18"
          rx="9"
          fill="var(--color-text-primary)"
          opacity="0.7"
        />
        <rect
          x="68"
          y="144"
          width="48"
          height="5"
          rx="2"
          fill="var(--color-background)"
          opacity="0.8"
        />
      </svg>
    );
  }

  return null;
}

const EXAMPLES = [
  {
    title: "Minimal Portfolio",
    subtitle: "Clean design for a photographer",
    image: "portfolio",
  },
  {
    title: "SaaS Landing",
    subtitle: "Modern gradient with floating elements",
    image: "saas",
  },
  {
    title: "E‑commerce Store",
    subtitle: "Product grid with hover effects",
    image: "ecommerce",
  },
];

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { openLegal, openRoadmap, openSupport } = useModals();
  const [isRaining, setIsRaining] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [drops, setDrops] = useState([]);
  const intervalRef = useRef(null);
  const dropIdRef = useRef(0);

  // Glow effect based on scroll position
  const previewRef = useRef(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  const [previewAnimate, setPreviewAnimate] = useState(true);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    const startCycle = () => {
      setPreviewAnimate(true);
      animationTimeoutRef.current = setTimeout(() => {
        setPreviewAnimate(false);
        animationTimeoutRef.current = setTimeout(() => {
          startCycle();
        }, 500); // off duration (fade-out)
      }, 5000); // on duration (pop-in + pause)
    };
    startCycle();
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateGlow = () => {
      if (!previewRef.current) return;

      const rect = previewRef.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;

      // Distance from viewport center (in pixels)
      const distance = Math.abs(elementCenter - viewportCenter);
      const maxDistance = Math.max(window.innerHeight, rect.height) * 0.8; // falloff distance

      // Intensity: 1 at center, 0 when far away
      let intensity = 1 - Math.min(distance / maxDistance, 1);
      // Ease the curve for a smoother feel
      intensity = Math.pow(intensity, 1.5);

      setGlowIntensity(intensity);
    };

    window.addEventListener("scroll", updateGlow);
    window.addEventListener("resize", updateGlow);
    updateGlow(); // initial

    return () => {
      window.removeEventListener("scroll", updateGlow);
      window.removeEventListener("resize", updateGlow);
    };
  }, []);

  const getRandomEmoji = () =>
    EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const startRain = () => {
    if (isRaining) return;

    setIsRaining(true);
    const newEmoji = getRandomEmoji();
    setCurrentEmoji(newEmoji);

    createDrops(newEmoji);

    intervalRef.current = setInterval(() => {
      createDrops(newEmoji);
    }, 150);
  };

  const createDrops = (emoji) => {
    const newDrops = [];
    const ranges = [
      { start: 5, width: 20 },
      { start: 5, width: 20 },
      { start: 10, width: 20 },
      { start: -12, width: 20 },
      { start: 10, width: 20 },
      { start: -12, width: 20 },
      { start: 10, width: 20 },
    ];

    ranges.forEach((range, i) => {
      dropIdRef.current += 1;
      const x = range.start + Math.random() * range.width;
      const duration = 1 + Math.random() * 0.2;
      const delay = i * 5 + Math.random() * 0.25;

      newDrops.push({
        id: dropIdRef.current,
        emoji,
        x,
        duration,
        delay,
      });
    });

    setDrops((prev) => [...prev, ...newDrops]);

    setTimeout(() => {
      setDrops((prev) =>
        prev.filter((d) => !newDrops.some((nd) => nd.id === d.id))
      );
    }, 1000);
  };

  const stopRain = () => {
    setIsRaining(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeout(() => {
      if (!isRaining) {
        setCurrentEmoji("");
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => startRain();
  const handleMouseLeave = () => stopRain();

  const handleTouchStart = (e) => {
    e.preventDefault();
    if (isRaining) {
      stopRain();
    } else {
      startRain();
    }
  };

  return (
    <>
      <div className="showcase-addons-wrapper">
        <section className="showcase">
          <div className="footer__container container">
            <div className="showcase__header">
              <span className="showcase__label">How it works</span>
              <h2 className="showcase__heading">
                From idea to website in three steps
              </h2>
              <p className="showcase__subheading">
                No wireframes. No mockups. No back-and-forth with designers.
                Just describe, customize, and ship.
              </p>
            </div>

            <div className="showcase__steps">
              {HOW_IT_WORKS.map((step, i) => (
                <div className="showcase__step" key={i}>
                  <div className="showcase__step-number">{step.step}</div>
                  <div className="showcase__step-icon">
                    <step.icon size={20} />
                  </div>
                  <h3 className="showcase__step-title">{step.title}</h3>
                  <p className="showcase__step-desc">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="showcase__preview" ref={previewRef}>
              {/* Glow element */}
              <div
                className="showcase__preview-glow"
                style={{ opacity: glowIntensity }}
              />

              <div className="showcase__preview-window">
                <div className="showcase__preview-toolbar">
                  <div className="showcase__preview-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="showcase__preview-tab">
                    <Globe size={10} />
                    <span>preview</span>
                  </div>
                </div>
                <div className="showcase__preview-body">
                  <svg
                    viewBox="0 0 560 320"
                    fill="none"
                    className={`showcase__preview-svg ${
                      previewAnimate ? "animate-preview" : ""
                    }`}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="560"
                      height="36"
                      fill="var(--color-surface-elevated)"
                    />
                    <rect
                      x="16"
                      y="12"
                      width="60"
                      height="10"
                      rx="3"
                      fill="var(--color-text-primary)"
                      opacity="0.5"
                    />
                    <rect
                      x="380"
                      y="14"
                      width="32"
                      height="6"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.4"
                    />
                    <rect
                      x="422"
                      y="14"
                      width="28"
                      height="6"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.4"
                    />
                    <rect
                      x="460"
                      y="14"
                      width="36"
                      height="6"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.4"
                    />
                    <rect
                      x="506"
                      y="10"
                      width="40"
                      height="16"
                      rx="8"
                      fill="var(--color-text-primary)"
                      opacity="0.6"
                    />

                    {/* Hero */}
                    <rect
                      x="32"
                      y="60"
                      width="240"
                      height="14"
                      rx="4"
                      fill="var(--color-text-primary)"
                      opacity="0.6"
                    />
                    <rect
                      x="32"
                      y="82"
                      width="180"
                      height="10"
                      rx="3"
                      fill="var(--color-text-primary)"
                      opacity="0.35"
                    />
                    <rect
                      x="32"
                      y="98"
                      width="220"
                      height="6"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />
                    <rect
                      x="32"
                      y="108"
                      width="180"
                      height="6"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />
                    <rect
                      x="32"
                      y="128"
                      width="80"
                      height="24"
                      rx="12"
                      fill="var(--color-text-primary)"
                      opacity="0.55"
                    />
                    <rect
                      x="120"
                      y="128"
                      width="64"
                      height="24"
                      rx="12"
                      fill="var(--color-border-hover)"
                      opacity="0.5"
                    />

                    {/* Hero image placeholder */}
                    <rect
                      x="340"
                      y="48"
                      width="200"
                      height="120"
                      rx="8"
                      fill="var(--color-border-hover)"
                      opacity="0.3"
                    />
                    <circle
                      cx="440"
                      cy="100"
                      r="20"
                      fill="var(--color-text-tertiary)"
                      opacity="0.15"
                    />

                    {/* Feature cards */}
                    <rect
                      x="32"
                      y="188"
                      width="156"
                      height="80"
                      rx="6"
                      fill="var(--color-surface-elevated)"
                    />
                    <rect
                      x="44"
                      y="200"
                      width="20"
                      height="20"
                      rx="4"
                      fill="var(--color-border-hover)"
                      opacity="0.5"
                    />
                    <rect
                      x="44"
                      y="228"
                      width="80"
                      height="6"
                      rx="2"
                      fill="var(--color-text-primary)"
                      opacity="0.5"
                    />
                    <rect
                      x="44"
                      y="240"
                      width="120"
                      height="4"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />
                    <rect
                      x="44"
                      y="248"
                      width="100"
                      height="4"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />

                    <rect
                      x="202"
                      y="188"
                      width="156"
                      height="80"
                      rx="6"
                      fill="var(--color-surface-elevated)"
                    />
                    <rect
                      x="214"
                      y="200"
                      width="20"
                      height="20"
                      rx="4"
                      fill="var(--color-border-hover)"
                      opacity="0.5"
                    />
                    <rect
                      x="214"
                      y="228"
                      width="72"
                      height="6"
                      rx="2"
                      fill="var(--color-text-primary)"
                      opacity="0.5"
                    />
                    <rect
                      x="214"
                      y="240"
                      width="110"
                      height="4"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />
                    <rect
                      x="214"
                      y="248"
                      width="88"
                      height="4"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />

                    <rect
                      x="372"
                      y="188"
                      width="156"
                      height="80"
                      rx="6"
                      fill="var(--color-surface-elevated)"
                    />
                    <rect
                      x="384"
                      y="200"
                      width="20"
                      height="20"
                      rx="4"
                      fill="var(--color-border-hover)"
                      opacity="0.5"
                    />
                    <rect
                      x="384"
                      y="228"
                      width="88"
                      height="6"
                      rx="2"
                      fill="var(--color-text-primary)"
                      opacity="0.5"
                    />
                    <rect
                      x="384"
                      y="240"
                      width="116"
                      height="4"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />
                    <rect
                      x="384"
                      y="248"
                      width="96"
                      height="4"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />

                    <rect
                      x="0"
                      y="290"
                      width="560"
                      height="30"
                      fill="var(--color-surface-elevated)"
                    />
                    <rect
                      x="32"
                      y="302"
                      width="60"
                      height="5"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />
                    <rect
                      x="460"
                      y="302"
                      width="72"
                      height="5"
                      rx="2"
                      fill="var(--color-text-tertiary)"
                      opacity="0.3"
                    />
                  </svg>
                </div>
              </div>
              <p className="showcase__preview-caption">
                Real-time preview with desktop, tablet, and mobile viewports —
                what you see is what you ship.
              </p>
            </div>
          </div>
        </section>

        <section className="addons">
          <div className="footer__container container">
            <div className="addons__header">
              <span className="addons__label">Add-ons</span>
              <h2 className="addons__heading">Supercharge your website</h2>
              <p className="addons__subheading">
                Bolt on analytics, a blog, CMS, or contact forms — each add-on
                is a one-click token purchase that integrates directly into your
                generated code.
              </p>
            </div>

            <div className="addons__grid">
              {ADD_ONS.map((addon, i) => (
                <div className="addons__card" key={i}>
                  <div className="addons__card-visual">
                    <AddOnVisual type={addon.visual} />
                  </div>
                  <div className="addons__card-body">
                    <div className="addons__card-top">
                      <div className="addons__card-icon">
                        <addon.icon size={16} />
                      </div>
                      <span className="addons__card-tag">
                        <Coins size={10} />
                        {addon.tag}
                      </span>
                    </div>
                    <h3 className="addons__card-title">{addon.title}</h3>
                    <p className="addons__card-desc">{addon.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="addons__note">
              More add-ons coming soon — custom domains, auth scaffolding, PWA
              support, e-commerce, and i18n.
            </p>
          </div>
        </section>
        <section className="showcase-gallery">
          <div className="footer__container container">
            <div className="showcase-gallery__header">
              <h2 className="showcase-gallery__heading">
                Real sites built with Nimbus
              </h2>
            </div>
            <div className="showcase-gallery__grid">
              {EXAMPLES.map((item, index) => (
                <div className="showcase-gallery__card" key={index}>
                  <div
                    className={`showcase-gallery__image showcase-gallery__image--${item.image}`}
                  >
                    <svg
                      viewBox="0 0 400 225"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background */}
                      <rect
                        width="400"
                        height="225"
                        fill="var(--color-surface-elevated)"
                      />
                      {/* Decorative elements based on type */}
                      {item.image === "portfolio" && (
                        <>
                          <rect
                            x="50"
                            y="40"
                            width="80"
                            height="20"
                            rx="4"
                            fill="var(--color-text-primary)"
                            fillOpacity="0.5"
                          />
                          <rect
                            x="50"
                            y="70"
                            width="180"
                            height="10"
                            rx="4"
                            fill="var(--color-text-tertiary)"
                            fillOpacity="0.3"
                          />
                          <rect
                            x="50"
                            y="90"
                            width="150"
                            height="10"
                            rx="4"
                            fill="var(--color-text-tertiary)"
                            fillOpacity="0.3"
                          />
                          <circle
                            cx="300"
                            cy="80"
                            r="40"
                            fill="var(--color-accent-light)"
                          />
                        </>
                      )}
                      {item.image === "saas" && (
                        <>
                          <rect
                            x="30"
                            y="30"
                            width="100"
                            height="30"
                            rx="6"
                            fill="var(--color-accent-light)"
                          />
                          <rect
                            x="150"
                            y="30"
                            width="80"
                            height="30"
                            rx="6"
                            fill="var(--color-accent-light)"
                            fillOpacity="0.7"
                          />
                          <rect
                            x="250"
                            y="30"
                            width="60"
                            height="30"
                            rx="6"
                            fill="var(--color-accent-light)"
                            fillOpacity="0.5"
                          />
                          <rect
                            x="30"
                            y="80"
                            width="340"
                            height="80"
                            rx="8"
                            fill="var(--color-accent-light)"
                            fillOpacity="0.4"
                          />
                        </>
                      )}
                      {item.image === "ecommerce" && (
                        <>
                          <rect
                            x="30"
                            y="30"
                            width="100"
                            height="100"
                            rx="6"
                            fill="var(--color-accent-light)"
                            fillOpacity="0.5"
                          />
                          <rect
                            x="150"
                            y="30"
                            width="100"
                            height="100"
                            rx="6"
                            fill="var(--color-accent-light)"
                            fillOpacity="0.5"
                          />
                          <rect
                            x="270"
                            y="30"
                            width="100"
                            height="100"
                            rx="6"
                            fill="var(--color-accent-light)"
                            fillOpacity="0.5"
                          />
                          <rect
                            x="30"
                            y="150"
                            width="340"
                            height="20"
                            rx="4"
                            fill="var(--color-text-primary)"
                            fillOpacity="0.3"
                          />
                        </>
                      )}
                    </svg>
                  </div>
                  <div className="showcase-gallery__content">
                    <h3 className="showcase-gallery__title">{item.title}</h3>
                    <p className="showcase-gallery__subtitle">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer__container container">
          <div className="footer__content">
            <div
              className="footer__cloud-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              role="button"
              tabIndex={0}
            >
              <Cloudy
                size={64}
                className="footer__icon"
                strokeWidth={1.5}
                style={{
                  transform: isRaining ? "translateY(-12px)" : "none",
                  transition: "transform 0.4s ease",
                }}
              />

              <div className="footer__emoji-rain">
                {drops.map((drop) => (
                  <span
                    key={drop.id}
                    className="footer__emoji-drop"
                    style={{
                      left: `${drop.x}px`,
                      animation: `emojiRain ${drop.duration}s ease-out ${drop.delay}s forwards`,
                      color: `hsl(${(Math.random() * 360) | 0}, 80%, 60%)`,
                    }}
                  >
                    {drop.emoji}
                  </span>
                ))}
              </div>

              <style>{`
                @keyframes emojiRain {
                  0% {
                    opacity: 0.5;
                    transform: translate3d(0, 0, 0) scale(0.5);
                  }
                  90% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 0;
                    transform: translate3d(0, 200px, 0) scale(1);
                  }
                }
              `}</style>
            </div>

            <nav className="footer__links">
              {isHomePage ? (
                <button
                  className="footer__link footer__link--btn"
                  onClick={openRoadmap}
                >
                  Roadmap
                </button>
              ) : (
                <Link to="/roadmap" className="footer__link">
                  Roadmap
                </Link>
              )}

              {isHomePage ? (
                <button
                  className="footer__link footer__link--btn"
                  onClick={openSupport}
                >
                  Support
                </button>
              ) : (
                <Link to="/support" className="footer__link">
                  Support
                </Link>
              )}

              {isHomePage ? (
                <button
                  className="footer__link footer__link--btn"
                  onClick={() => openLegal()}
                >
                  Terms & Legal
                </button>
              ) : (
                <Link to="/legal" className="footer__link">
                  Terms & Legal
                </Link>
              )}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
