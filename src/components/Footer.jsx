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
  "👽",
  "🐙",
  "🦄",
  "🐈",
  "🐇",
  "🐷",
  "🐭",
  "🐍",
  "👩",
  "👷",
  "👸",
  "👳",
  "🎅",
  "👾",
  "👻",
  "🐦",
  "🌸",
  "🌥",
  "🌞",
  "🌱",
  "🌴",
  "🍀",
  "🍄",
  "🔥",
  "⭐",
  "🌙",
  "🦄",
  "🐚",
  "🎨",
  "🎭",
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
      </svg>
    );
  }

  return null;
}

function Footer() {
  const { openAddons } = useModals();
  const [selectedEmoji, setSelectedEmoji] = useState("👽");
  const [animatingEmoji, setAnimatingEmoji] = useState(false);
  const timeoutRef = useRef(null);

  const handleCloudClick = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setAnimatingEmoji(true);
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setSelectedEmoji(randomEmoji);
    timeoutRef.current = setTimeout(() => setAnimatingEmoji(false), 600);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer__cloud-wrapper">
        <button
          className="footer__cloud-container"
          onClick={handleCloudClick}
          tabIndex="0"
          aria-label="Randomize emoji"
        >
          <div className="footer__cloud-background">
            <Cloudy size={120} strokeWidth={1} />
          </div>
          <div
            className={`footer__cloud-emoji ${
              animatingEmoji ? "footer__cloud-emoji--animating" : ""
            }`}
          >
            {selectedEmoji}
          </div>
        </button>
      </div>

      <main className="footer__content">
        <section className="footer__section">
          <h1 className="footer__title">How It Works</h1>
          <div className="footer__grid footer__grid--how">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
              <div key={step} className="footer__how-card">
                <div className="footer__how-icon">
                  <Icon size={24} />
                </div>
                <div className="footer__how-content">
                  <div className="footer__how-step">{step}</div>
                  <h3 className="footer__how-title">{title}</h3>
                  <p className="footer__how-description">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="footer__section">
          <div className="footer__addons-header">
            <div>
              <h2 className="footer__title">Add-ons</h2>
              <p className="footer__subtitle">
                Extend your generated site with extra functionality
              </p>
            </div>
            <button className="footer__addons-cta" onClick={openAddons}>
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="footer__grid footer__grid--addons">
            {ADD_ONS.map((addon, index) => {
              const Icon = addon.icon;
              return (
                <div key={index} className="footer__addon-card">
                  <div className="footer__addon-visual">
                    <AddOnVisual type={addon.visual} />
                  </div>
                  <div className="footer__addon-content">
                    <div className="footer__addon-header">
                      <div className="footer__addon-icon">
                        <Icon size={18} />
                      </div>
                      <div className="footer__addon-tag">{addon.tag}</div>
                    </div>
                    <h3 className="footer__addon-title">{addon.title}</h3>
                    <p className="footer__addon-description">
                      {addon.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </footer>
  );
}

export default Footer;