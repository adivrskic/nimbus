# Nimbus — AI Website Generator

Nimbus is a full-stack web application that generates production-ready, responsive websites from plain-English prompts using AI. Users describe the site they want, fine-tune it with 60+ design controls, preview in real time as HTML streams in, then export as static HTML or scaffolded framework projects (Vite + React, Next.js, Astro). The entire flow — from prompt to live preview to download — happens in-browser with no local tooling required.

**Live:** [nimbuswebsites.com](https://nimbuswebsites.com)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Core Systems](#core-systems)
5. [Authentication](#authentication)
6. [Contexts & State Management](#contexts--state-management)
7. [UI Components](#ui-components)
8. [Styling](#styling)
9. [Backend — Supabase Edge Functions](#backend--supabase-edge-functions)
10. [Deployment](#deployment)
11. [Environment Variables](#environment-variables)
12. [Getting Started](#getting-started)
13. [Roadmap](#roadmap)

---

## Architecture Overview

Nimbus follows a client-heavy architecture where the React frontend orchestrates all user interactions, and a single Supabase Edge Function handles AI generation. There is no traditional backend server — Supabase provides auth, database, and serverless compute, while Anthropic's Claude API generates the HTML.

```
Browser (React SPA on Netlify)
  │
  ├─ User prompt + 60+ design selections + brand options
  │        │
  │        ▼
  │  Supabase Edge Function (generate-website)
  │        │
  │        ├─ Builds multi-layered system prompt from selections
  │        ├─ Calculates token cost & deducts from user balance
  │        ├─ Calls Claude API (claude-sonnet-4-20250514)
  │        │     └─ Streams response back via ReadableStream
  │        │
  │        ▼
  │  Browser receives streamed HTML chunks
  │        │
  │        ├─ Detects PATCH vs full-HTML response format
  │        ├─ Applies incremental DOM patches in real time
  │        ├─ Parses multi-page FILE markers if present
  │        └─ Renders live preview in sandboxed iframe
  │
  ├─ Supabase Auth (Google & GitHub OAuth via PKCE)
  ├─ Supabase Postgres (profiles, projects, feedback)
  └─ Stripe (token purchases)
```

The key architectural decision is that **all HTML generation happens server-side** via Claude, but the **preview rendering and patch application happen entirely client-side**. This means the edge function never needs to parse or validate HTML — it simply proxies the AI response as a stream. The client handles parsing, patching, multi-page splitting, and iframe rendering.

---

## Tech Stack

| Layer           | Technology                                               |
| --------------- | -------------------------------------------------------- |
| Frontend        | React 19, Vite 7, React Router 6, SCSS                   |
| Icons           | Lucide React                                             |
| Animation       | Framer Motion, Three.js + React Three Fiber (background) |
| Payments        | Stripe Elements + React Stripe                           |
| Backend         | Supabase (Auth, Postgres, Edge Functions on Deno)        |
| AI              | Anthropic Claude API (claude-sonnet-4-20250514)          |
| Export          | JSZip (zip packaging)                                    |
| Deploy          | Netlify (frontend), Supabase (edge functions)            |
| Package Manager | Yarn (with Corepack via .yarnrc.yml)                     |
| Node            | v20.19.5 (pinned via Volta)                              |

---

## Project Structure

```
src/
├── main.jsx                     # Entry point, renders <App />
├── App.jsx                      # Router + nested context provider tree
│
├── pages/
│   └── Home.jsx                 # Main page — orchestrates all generation logic
│
├── contexts/
│   ├── AuthContext.jsx           # Supabase auth, user/profile/token state
│   ├── ProjectContext.jsx        # Saved projects CRUD + client-side cache
│   ├── ModalContext.jsx          # Central modal open/close state machine
│   ├── GenerationContext.jsx     # Global isGenerating flag + preview pill
│   └── ThemeContext.jsx          # Light/dark theme with system detection
│
├── hooks/
│   ├── useGeneration.js          # Core generate + enhance + streaming logic
│   ├── useHomeState.js           # Home page UI state (panels, overlays)
│   ├── useSelections.js          # Design option selection management
│   ├── useProjectSave.js         # Save/load projects + version history
│   ├── useTypewriter.js          # Animated placeholder cycling in search bar
│   ├── useModalAnimation.js      # Enter/exit animation timing for modals
│   └── useKeyboardShortcuts.js   # Escape key handler chain
│
├── utils/
│   ├── generateWebsite.js        # Non-streaming generation (Supabase invoke)
│   ├── generateWebsiteStream.js  # Streaming generation (fetch + ReadableStream)
│   ├── generationCache.js        # In-memory LRU cache for repeated prompts
│   ├── patchParser.js            # PATCH op parser + incremental DOM applier
│   ├── parseMultiPage.js         # FILE marker splitter for multi-page sites
│   ├── tokenCalculator.js        # Client-side token cost estimation
│   ├── tokenCosts.js             # Cost maps for every design option
│   ├── downloadZip.js            # JSZip packaging for export
│   └── exportScaffold.js         # Framework scaffolding (4 formats)
│
├── configs/
│   ├── options.config.js          # All 60+ design option definitions
│   ├── categories.config.js       # Option category groupings + filters
│   ├── addons.config.js           # Add-on definitions (analytics, forms, etc.)
│   ├── defaults.config.js         # Default persistent options + example prompts
│   └── index.js                   # Config barrel export
│
├── components/
│   ├── Header.jsx                 # Nav bar: auth, tokens, projects, theme toggle
│   ├── Footer.jsx                 # Marketing sections + feature grid
│   ├── SearchBar.jsx              # Prompt input with typewriter placeholder
│   ├── BackgroundWave.jsx         # Three.js animated gradient background
│   ├── GeneratedPreview.jsx       # Sandboxed iframe for live HTML preview
│   └── Modals/
│       ├── AddonsModal.jsx        # Add-on selection + inline config panels
│       ├── AuthModal.jsx          # Google/GitHub OAuth sign-in
│       ├── FeedbackModal.jsx      # Thumbs up/down + comment on generations
│       ├── GitHubImportModal.jsx  # Import static HTML sites from GitHub repos
│       ├── HelpModal.jsx          # How-it-works guide + tips
│       ├── LegalModal.jsx         # Terms + Privacy accordion
│       ├── OptionsModal.jsx       # 60+ design options (Design + Brand tabs)
│       ├── PreviewModal.jsx       # Full preview + code editor + enhance input
│       ├── ProjectsModal.jsx      # Saved projects list with actions
│       ├── RoadmapModal.jsx       # Public roadmap
│       ├── SupportModal.jsx       # Support contact
│       ├── TokenModal.jsx         # Cost breakdown overlay
│       ├── TokenPurchaseModal.jsx  # Stripe-powered token purchase
│       └── VersionHistoryModal.jsx # Version timeline for a project
│
├── lib/
│   ├── supabaseClient.js          # Supabase client init (PKCE, auto-refresh)
│   └── analytics.js               # Lightweight event tracking
│
├── styles/
│   ├── global.scss                # CSS custom properties, reset, theme tokens
│   ├── modals.scss                # Shared modal styles
│   └── component_styles/          # Per-component SCSS modules
│
supabase/
└── functions/
    └── generate-website/
        └── index.ts               # Edge function — prompt assembly + Claude API
```

---

## Core Systems

### Generation Pipeline

The generation flow begins when the user types a prompt and clicks Generate. The system builds a multi-layered prompt for Claude:

1. **Static system prompt** — Hardcoded in the edge function (~800 lines). Contains HTML generation rules, responsive CSS requirements (a mandatory responsive style block injected into every page), mobile hamburger menu mandates, image handling via `picsum.photos`, inline style requirements, and output format rules. Three variants exist: `STATIC_SYSTEM_PROMPT` (single-page), `STATIC_MULTIPAGE_SYSTEM_PROMPT` (multi-page), and `STATIC_REFINEMENT_PROMPT` (patch mode for enhancements).

2. **Dynamic prompt part** — Built at request time by `buildDynamicPromptPart()`. This function translates every user selection — layout style, typography, color palette, hero style, card style, animation level, image treatment, and 50+ more — into natural-language instructions. It also injects persistent brand options (business name, tagline, contact info, social links) as concrete content directives.

3. **Creative variation** — Each generation randomly selects from pools of `CREATIVE_BOOSTERS`, `LAYOUT_VARIATIONS`, and `TYPOGRAPHY_VARIATIONS` to prevent repetitive output. These inject instructions like "Think like a senior designer at a top agency" or "Use varied section heights — not everything needs to be the same size."

4. **Add-on instructions** — If any add-ons are active, their full prompt blocks (defined in `ADDON_PROMPTS`) are appended. Each block contains concrete implementation instructions (e.g., exact Netlify Forms attributes, honeypot fields, validation JS).

The edge function calls `anthropic.messages.stream()` with prompt caching enabled (`cache_control: { type: "ephemeral" }` on the static system prompt) to reduce latency and cost on repeated generations.

### Streaming & Patch System

**Initial generations** stream full HTML. The frontend's `generateWebsiteStream.js` opens a fetch connection to the edge function, reads chunks from `response.body.getReader()`, accumulates them into a growing HTML string, detects the current phase (head → body → complete), and fires `onProgress` callbacks. The `useGeneration` hook receives these callbacks and updates `generatedCode` via a debounced setter (50ms), which causes the preview iframe to re-render in near-real-time.

**Enhancements** (follow-up edits to an existing site) use a custom **patch protocol** to avoid regenerating the entire page. The `STATIC_REFINEMENT_PROMPT` instructs Claude to output `<!-- PATCH -->` delimited operations instead of full HTML. Six operations are available:

| Operation                 | Use Case                       | Payload                                 |
| ------------------------- | ------------------------------ | --------------------------------------- |
| `REPLACE_VARS`            | Color/theme changes            | New `:root` CSS custom properties block |
| `REPLACE_STYLES`          | Layout/responsive changes      | Complete new `<style>` block            |
| `REPLACE #selector`       | Content changes in one section | New HTML for that element               |
| `INSERT_AFTER #selector`  | Add a new section              | HTML to insert after target             |
| `INSERT_BEFORE #selector` | Add a new section              | HTML to insert before target            |
| `REMOVE #selector`        | Delete a section               | (no payload)                            |

The `patchParser.js` module provides three key exports:

- `parsePatchOps(text)` — Regex-based parser that extracts operations from streamed text
- `applySinglePageOps(html, ops)` — Applies operations to a single HTML document via `DOMParser` and DOM manipulation
- `createIncrementalApplier(baseHtml)` — Stateful object that tracks which operations have been applied, so new patches can be applied incrementally as they stream in

For multi-page sites, `REPLACE_VARS` and `REPLACE_STYLES` apply globally across all pages, while targeted operations apply to pages containing matching selectors.

The system auto-detects whether a response is a patch or full HTML by checking if the first non-whitespace content is `<!-- PATCH`. If Claude decides the changes affect more than ~70% of the page, it falls back to returning full HTML, and the frontend handles both cases transparently.

### Token Economy

Every generation costs tokens. Cost is calculated identically on both client and server using shared cost maps:

- **Base cost:** 1 token per ~30 words in the prompt, minimum 8
- **Option surcharges:** Each non-default selection adds 0–3 tokens. For example, "Experimental" creativity costs 3, "Neumorphic" style costs 2, selecting 6+ sections costs extra
- **Add-on costs:** Analytics (5), Contact Forms (6), Blog Engine (10), CMS (10)
- **Refinement discount:** Enhancements use a lower base cost than full generations
- **Min/max bounds:** Enforced to keep costs predictable

The client-side `tokenCalculator.js` mirrors the edge function's `calculateTokenCost()` exactly, so the cost shown in the UI before generating is always accurate. The edge function validates the balance server-side before calling Claude, returning a 402 with the breakdown if insufficient.

Token purchases go through Stripe via `TokenPurchaseModal`, which uses `@stripe/react-stripe-js` for the payment form and a Supabase edge function for the webhook that credits the user's balance.

### Customization Engine

`options.config.js` defines every design option as a structured object:

```js
{
  label: "Style",
  subtitle: "Visual design approach",
  icon: Sparkles,
  promptKey: "design_style",
  choices: [
    { value: "Minimal", prompt: "Use a minimal, whitespace-heavy design" },
    { value: "Modern", prompt: "Use a modern, contemporary design..." },
    { value: "Neumorphic", prompt: "Use a soft UI neumorphic style" },
    // ... 10 options
  ]
}
```

Options cover: template type, layout style, color palette (with visual swatches), custom colors (color picker), appearance (light/dark), typography, hero style, card style, animation level, image treatment, spacing, border radius, button style, header style, footer style, icon style, creativity level, content tone, sections (multi-select), sticky elements, and more.

The `OptionsModal` has two tabs:

- **Design** — All selectable options, filterable by category (Layout, Visual, Content, Technical)
- **Brand & Business** — Persistent fields: brand name, tagline, email, phone, address, social URLs, copyright text. These survive across generations and are injected as concrete content.

### Multi-Page Generation

When the user selects a multi-page template, the system:

1. Switches to `STATIC_MULTIPAGE_SYSTEM_PROMPT`, which mandates complete standalone HTML documents per page with identical headers, footers, and navigation
2. Looks up the page structure from `MULTI_PAGE_STRUCTURES` — e.g., "Multi Page" maps to `[index.html, about.html, services.html, contact.html]` with specific content purposes for each
3. Increases `max_tokens` based on page count (up to 65,536)
4. Requires `<!-- FILE: filename.html -->` markers between pages
5. `parseMultiPage.js` on the frontend splits the response into a `Record<string, string>` map
6. The preview modal renders file tabs for page switching

Supported multi-page templates: Multi Page (4 pages), Documentation (4 pages), Blog (3 pages), E-commerce (4 pages), Web App (3 pages).

### Add-on System

Add-ons extend generated sites with additional functionality. Each is defined in `addons.config.js` with:

- Status: `available` or `coming_soon`
- Configurable fields (e.g., form provider selection, analytics script URL)
- Phase: `pre` (injected during generation) or `post` (applied after)
- Token cost

**Available add-ons:**

- **Analytics** — Injects Plausible Analytics with custom event tracking on CTAs, form submissions, scroll depth milestones, and outbound links
- **Contact Form** — Configurable provider (Netlify Forms, Formspree, custom endpoint), field sets (minimal/standard/full), client-side validation with regex, honeypot spam protection, success/error states, and full accessibility markup

**Planned:** Blog Engine, CMS Integration

When configurable add-ons are active, the `AddonsModal` shows an inline configuration panel (e.g., dropdown for form provider, conditional text input for endpoint URL). The configuration is passed through to the edge function as `addonConfig`, which injects provider-specific attributes into the form prompt.

### Export & Scaffolding

`exportScaffold.js` generates complete project scaffolds in four formats:

| Format       | Output                      | Key Files                                               |
| ------------ | --------------------------- | ------------------------------------------------------- |
| Static HTML  | Raw files, no build step    | `index.html`, `README.md`                               |
| Vite + React | React SPA with hash routing | `package.json`, `vite.config.js`, `src/pages/*.jsx`     |
| Next.js      | App Router with SSR         | `package.json`, `next.config.mjs`, `app/page.js`        |
| Astro        | Content-first static site   | `package.json`, `astro.config.mjs`, `src/pages/*.astro` |

For React and Next.js scaffolds, each HTML page is wrapped in a component that renders via Shadow DOM (`attachShadow({ mode: 'open' })`) to isolate the generated styles from the framework's own styles.

`downloadZip.js` packages everything into a `.zip` via JSZip, including an `images/` placeholder folder with a `.gitkeep`.

### Project Persistence

Projects are stored in Supabase Postgres via edge functions. Each project record contains:

- `prompt` — The original generation prompt
- `html_content` — The current HTML
- `customization` — Selections, persistent options, version history, and file map
- Timestamps for created/updated

The `useProjectSave` hook manages:

- **Auto-versioning:** Before each enhancement, the current HTML is snapshotted into `versionHistory`
- **Save:** Upserts the project with current state
- **Load:** Restores prompt, code, selections, and version history
- **Version navigation:** Jump to any historical version via `VersionHistoryModal`

---

## Authentication

Auth uses Supabase Auth with PKCE flow and two OAuth providers:

- **Google** — Standard OAuth
- **GitHub** — OAuth with `repo` scope (enables GitHub Import)

`AuthContext` handles: session initialization on mount, `onAuthStateChange` subscription, tab visibility tracking (queues auth events while the tab is hidden and processes them on refocus), periodic session validation every 10 minutes, automatic profile creation on first sign-in (20 starter tokens), and email verification flow via OTP.

The `provider_token` from GitHub OAuth is used by `GitHubImportModal` to access the GitHub API for repository browsing and file import. This token is only available immediately after OAuth redirect — the modal shows a "Reconnect" button if it has expired.

---

## Contexts & State Management

Five contexts form a nested provider tree in `App.jsx`:

```jsx
<Router>
  <AuthProvider>
    {" "}
    {/* Session, profile, tokens */}
    <ThemeProvider>
      {" "}
      {/* Light/dark/system theme */}
      <ProjectProvider>
        {" "}
        {/* Saved projects cache */}
        <GenerationProvider>
          {" "}
          {/* Global generation flag */}
          <ModalProvider>
            {" "}
            {/* Modal open/close state */}
            <AppContent />
          </ModalProvider>
        </GenerationProvider>
      </ProjectProvider>
    </ThemeProvider>
  </AuthProvider>
</Router>
```

Generation-specific state (code, files, streaming phase, enhance prompt, cache) lives in the `useGeneration` hook, local to `Home.jsx`. This keeps the generation lifecycle tightly scoped — only the global `isGenerating` flag is shared via `GenerationContext` (used by `Header` to disable navigation during generation).

`ModalContext` centralizes modal state for: auth, token purchase, projects, legal, roadmap, support, and GitHub import. Each modal gets `open`/`close` callbacks exposed via `useModals()`.

---

## UI Components

**SearchBar** — Main prompt input with an animated typewriter placeholder that cycles through example prompts from `defaults.config.js`. Auto-expands on focus. Enter key triggers generation, Shift+Enter for newlines.

**PreviewModal** — Full-screen modal with sandboxed iframe. During streaming, a phase indicator shows progress (head → body → complete). Includes: code editor toggle, enhance input for follow-up changes, file tabs for multi-page sites, version dropdown, save/download/feedback buttons.

**OptionsModal** — Two-tab modal. The Design tab shows a filterable grid of options; each expands to reveal choices with visual indicators (color swatches, icons). The Brand tab has grouped text inputs. Selection counts are shown as badges.

**BackgroundWave** — Three.js animated gradient mesh via React Three Fiber + custom shader material. Generates random marble colors per session. Auto-disables during generation to preserve performance.

**Header** — Top bar with: logo (animated cloud icon), theme toggle (cycles light → dark → system), token balance display, Projects button, and auth state (sign-in button or avatar + logout). When the preview is minimized, a floating pill appears showing generation state with the marble color scheme.

---

## Styling

SCSS with CSS custom properties for theming. `global.scss` defines two complete token sets under `[data-theme="light"]` and `[data-theme="dark"]`:

- **Colors:** background, surface, surface-elevated, border, text (primary/secondary/tertiary), accent
- **Effects:** Glass background/blur, neumorphism shadows (light and dark variants), gradient accent
- **Shadows:** Four levels (sm, md, lg, xl) plus pressed variants for interactive states
- **Spacing/Radius/Transitions:** Design tokens for consistent spacing, border radii, and animation timing
- **Breakpoints:** sm (640), md (768), lg (1024), xl (1280), 2xl (1536)

Component styles use BEM naming (`.gh-import__repo-item`). Modal styles are centralized in `modals.scss`. Theme switching uses `document.documentElement.setAttribute("data-theme", theme)` with a brief CSS transition on `background-color`.

---

## Backend — Supabase Edge Functions

The primary edge function is **`generate-website`** (~1,400 lines, Deno runtime). Its responsibilities:

1. **CORS** — Handles preflight OPTIONS requests
2. **Auth** — Extracts Bearer token, verifies via `supabaseClient.auth.getUser()`
3. **Token cost** — Calculates cost from prompt + selections + add-ons using the same cost maps as the frontend
4. **Balance check** — Reads profile tokens, returns 402 if insufficient
5. **Prompt assembly** — Selects static prompt variant, builds dynamic part via `buildDynamicPromptPart()`, appends add-on instructions via `buildAddonInstructions()`
6. **Max tokens** — Dynamically calculated: base 12,288 for single-page, up to 65,536 for multi-page + add-ons
7. **Claude call** — `anthropic.messages.stream()` for streaming (default) or `anthropic.messages.create()` for non-streaming. Uses prompt caching on the static system prompt
8. **Response** — Streaming: pipes chunks through a `ReadableStream` directly to the client. Non-streaming: returns JSON with `{ html, files, tokensUsed, tokensRemaining, breakdown }`

Other edge functions (referenced in code but deployed separately):

- **`get-projects`** — Fetches user's saved projects
- **`save-project`** — Upserts a project with HTML, selections, and version history
- **Stripe webhooks** — Handles payment confirmation and credits token balance

---

## Deployment

**Frontend** deploys to Netlify:

```toml
[build]
  command = "yarn install && yarn run build"
  publish = "dist"
```

Vite builds the SPA into `dist/`. Netlify serves static files with automatic client-side routing fallback.

**Edge functions** deploy via the Supabase CLI (`supabase functions deploy generate-website`).

**DNS** points `nimbuswebsites.com` to Netlify.

---

## Environment Variables

**Frontend** (in `.env`, prefixed with `VITE_`):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Edge functions** (set in Supabase dashboard):

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

---

## Getting Started

```bash
# Clone and install
git clone <repo-url>
cd website-builder
yarn install

# Set up environment
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# Run dev server
yarn dev
```

Open [http://localhost:5173](http://localhost:5173).

Prerequisites for full functionality:

- A Supabase project with Google and GitHub OAuth providers configured
- The `generate-website` edge function deployed with a valid Anthropic API key
- A `profiles` table with columns: `id` (uuid, FK to auth.users), `email`, `full_name`, `tokens` (integer)
- A `projects` table for saved projects
- A `feedback` table for generation feedback
- Stripe configured for token purchases (optional for development)

---

## Roadmap

**Shipped:**

- AI website generation with 60+ design options
- Real-time streaming preview with phase indicators
- Enhancement system with PATCH protocol (6 operation types)
- Multi-page site generation (5 template types)
- Export to 4 framework formats (HTML, Vite+React, Next.js, Astro)
- Dark/light/system theme
- Project save/load with version history
- Stripe token purchases
- Analytics add-on (Plausible with custom events)
- Google and GitHub OAuth

**In Progress:**

- Contact form add-on (Netlify Forms / Formspree / custom endpoint)
- GitHub import (browse repos, import static HTML sites)
- One-click deploy to Netlify/Vercel

**Planned:**

- Push-to-GitHub export (create/commit to repos)
- Blog engine add-on
- CMS integration add-on
- Custom domain management
- Collaborative editing
- Template marketplace
