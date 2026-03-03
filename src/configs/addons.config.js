// configs/addons.config.js
// ═══════════════════════════════════════════════════════════════
// Add-on definitions. Each add-on enriches a generation with
// additional functionality injected via specialized prompts.
//
// status: "available" | "coming_soon"
// phase:  "pre"  — included as generation instructions (invisible add-ons)
//         "post" — applied as a post-generation enhancement (visual add-ons)
// ═══════════════════════════════════════════════════════════════

export const ADDONS = [
  {
    id: "analytics",
    title: "Analytics",
    icon: "BarChart3",
    cost: 4,
    costLabel: "3–5 tokens",
    phase: "post",
    status: "available",
    description:
      "Lightweight visitor tracking with page views, referrers, and engagement events — wired to every link, button, and form on your site.",
    howItWorks:
      "Injects a Plausible or Umami tracking script into your site's <head>, attaches custom event attributes to existing interactive elements, and optionally generates a styled /analytics setup guide page matching your design.",
  },
  {
    id: "forms",
    title: "Contact Form",
    icon: "Mail",
    cost: 6,
    costLabel: "5–8 tokens",
    phase: "post",
    status: "available",
    description:
      "A fully styled, accessible contact form with validation, success/error states, and spam protection — wired to Formspree, Netlify Forms, or a custom endpoint.",
    howItWorks:
      "Generates a responsive form component matching your site's typography, colors, and spacing. Includes client-side validation, honeypot fields, and a configurable action URL. Injects into an existing contact section or creates a new /contact page.",
  },
  {
    id: "blog",
    title: "Blog Engine",
    icon: "FileText",
    cost: 10,
    costLabel: "8–12 tokens",
    phase: "post",
    status: "available",
    description:
      "A complete blog with index page, post template, tags, reading time, and 2–3 sample articles — all inheriting your site's design language.",
    howItWorks:
      "Generates a blog index with article cards, a reusable post layout with metadata and share links, and sample content. For framework exports (Astro, Next.js), includes markdown-powered dynamic routing.",
  },
  {
    id: "cms",
    title: "CMS Integration",
    icon: "Database",
    cost: 10,
    costLabel: "8–12 tokens",
    phase: "post",
    status: "coming_soon",
    description:
      "Makes your content editable by extracting hardcoded text into a structured content layer — JSON-based, Sanity, or Contentful.",
    howItWorks:
      "Refactors your generated HTML to read from a content.json file or a headless CMS API. Generates the content schema, client config, and a setup guide. Your site's layout stays identical — only the data source changes.",
  },
];

// Quick lookup helpers
export const getAddon = (id) => ADDONS.find((a) => a.id === id);
export const getAvailableAddons = () =>
  ADDONS.filter((a) => a.status === "available");
export const getAddonCost = (selectedAddons = {}) =>
  ADDONS.filter((a) => selectedAddons[a.id]).reduce(
    (sum, a) => sum + a.cost,
    0
  );
