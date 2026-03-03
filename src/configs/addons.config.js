export const ADDONS = [
  {
    id: "analytics",
    title: "Analytics",
    icon: "BarChart3",
    cost: 5,
    costLabel: "5 tokens",
    phase: "pre",
    status: "available",
    description:
      "Privacy-friendly visitor tracking via Plausible — page views, referrers, UTM campaigns, and custom events on every button, link, and form. No cookies, no consent banner required.",
    howItWorks:
      "Adds a single Plausible script tag to your <head> with a placeholder domain you swap out after deploying. Tags all CTAs, navigation links, and form submissions as custom event goals so you can see exactly what visitors click. Works immediately — just sign up for Plausible's free tier (or self-host) and replace the domain.",
  },
  {
    id: "forms",
    title: "Contact Form",
    icon: "Mail",
    cost: 6,
    costLabel: "6 tokens",
    phase: "post",
    status: "available",
    description:
      "A fully styled, accessible contact form with validation, success/error states, and spam protection — wired to Netlify Forms, Formspree, or a custom endpoint.",
    howItWorks:
      "Generates a responsive form component matching your site's typography, colors, and spacing. Includes client-side validation, honeypot fields, and a configurable action URL. Injects into an existing contact section or creates a new one before the footer.",
    configurable: true,
    configFields: [
      {
        key: "formProvider",
        label: "Form Provider",
        type: "select",
        default: "netlify",
        options: [
          { value: "netlify", label: "Netlify Forms" },
          { value: "formspree", label: "Formspree" },
          { value: "custom", label: "Custom Endpoint" },
        ],
      },
      {
        key: "formEndpoint",
        label: "Endpoint URL",
        type: "text",
        placeholder: "https://formspree.io/f/your-id",
        showWhen: { formProvider: ["formspree", "custom"] },
      },
      {
        key: "formFields",
        label: "Fields",
        type: "select",
        default: "standard",
        options: [
          { value: "minimal", label: "Name + Email + Message" },
          { value: "standard", label: "Name + Email + Subject + Message" },
          {
            value: "full",
            label: "Name + Email + Phone + Company + Subject + Message",
          },
        ],
      },
      {
        key: "formSuccessBehavior",
        label: "On Success",
        type: "select",
        default: "inline",
        options: [
          { value: "inline", label: "Show inline success message" },
          { value: "redirect", label: "Redirect to thank-you page" },
        ],
      },
    ],
  },
  {
    id: "blog",
    title: "Blog Engine",
    icon: "FileText",
    cost: 10,
    costLabel: "10 tokens",
    phase: "post",
    status: "coming_soon",
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
    costLabel: "10 tokens",
    phase: "post",
    status: "coming_soon",
    description:
      "Makes your content editable by extracting hardcoded text into a structured content layer — JSON-based, Sanity, or Contentful.",
    howItWorks:
      "Refactors your generated HTML to read from a content.json file or a headless CMS API. Generates the content schema, client config, and a setup guide. Your site's layout stays identical — only the data source changes.",
  },
];

export const getAddon = (id) => ADDONS.find((a) => a.id === id);
export const getAvailableAddons = () =>
  ADDONS.filter((a) => a.status === "available");
export const getAddonCost = (selectedAddons = {}) =>
  ADDONS.filter((a) => selectedAddons[a.id]).reduce(
    (sum, a) => sum + a.cost,
    0
  );
