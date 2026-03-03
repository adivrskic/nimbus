export const EXPORT_FORMATS = [
  {
    id: "html",
    label: "Static HTML",
    description: "Plain HTML, CSS & JS — open in any browser",
    icon: "html",
  },
  {
    id: "vite-react",
    label: "Vite + React",
    description: "Modern React app with Vite bundler",
    icon: "react",
  },
  {
    id: "nextjs",
    label: "Next.js",
    description: "Full-stack React framework with SSR",
    icon: "next",
  },
  {
    id: "astro",
    label: "Astro",
    description: "Content-first static site framework",
    icon: "astro",
  },
];

export function generateScaffold(
  format,
  htmlContent,
  files,
  projectName = "website"
) {
  const safeName = sanitizeName(projectName);

  switch (format) {
    case "vite-react":
      return scaffoldViteReact(htmlContent, files, safeName);
    case "nextjs":
      return scaffoldNextJs(htmlContent, files, safeName);
    case "astro":
      return scaffoldAstro(htmlContent, files, safeName);
    case "html":
    default:
      return scaffoldStaticHtml(htmlContent, files, safeName);
  }
}

function sanitizeName(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "website"
  );
}

function scaffoldStaticHtml(htmlContent, files, name) {
  const output = {};

  if (files && Object.keys(files).length > 0) {
    Object.entries(files).forEach(([filename, content]) => {
      output[filename] = content;
    });
  } else {
    output["index.html"] = htmlContent;
  }

  output["README.md"] = staticHtmlReadme(name, Object.keys(output));
  return output;
}

function scaffoldViteReact(htmlContent, files, name) {
  const output = {};
  const pageFiles =
    files && Object.keys(files).length > 0
      ? files
      : { "index.html": htmlContent };
  const pageNames = Object.keys(pageFiles);

  output["package.json"] = JSON.stringify(
    {
      name,
      private: true,
      version: "0.0.1",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.3.4",
        vite: "^6.0.0",
      },
    },
    null,
    2
  );

  output["vite.config.js"] = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;

  output["index.html"] = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;

  output["src/main.jsx"] = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

  if (pageNames.length === 1) {
    output["src/App.jsx"] = `import Page from './pages/Index'

export default function App() {
  return <Page />
}
`;
    output["src/pages/Index.jsx"] = wrapHtmlAsReactComponent(
      "IndexPage",
      pageFiles[pageNames[0]]
    );
  } else {
    const imports = pageNames
      .map((f, i) => {
        const compName = fileToComponentName(f);
        return `import ${compName} from './pages/${compName}'`;
      })
      .join("\n");

    const routes = pageNames
      .map((f) => {
        const compName = fileToComponentName(f);
        const route = f === "index.html" ? '""' : `"${f.replace(".html", "")}"`;
        return `    case ${route}: return <${compName} />`;
      })
      .join("\n");

    output["src/App.jsx"] = `import { useState, useEffect } from 'react'
${imports}

function getRoute() {
  return window.location.hash.replace('#/', '').replace('#', '') || ''
}

export default function App() {
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  switch (route) {
${routes}
    default: return <${fileToComponentName(pageNames[0])} />
  }
}
`;

    pageNames.forEach((filename) => {
      const compName = fileToComponentName(filename);
      output[`src/pages/${compName}.jsx`] = wrapHtmlAsReactComponent(
        compName,
        pageFiles[filename]
      );
    });
  }

  output["README.md"] = frameworkReadme(name, "Vite + React", [
    "npm install",
    "npm run dev",
  ]);

  return output;
}

function scaffoldNextJs(htmlContent, files, name) {
  const output = {};
  const pageFiles =
    files && Object.keys(files).length > 0
      ? files
      : { "index.html": htmlContent };
  const pageNames = Object.keys(pageFiles);

  output["package.json"] = JSON.stringify(
    {
      name,
      version: "0.0.1",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
      },
      dependencies: {
        next: "^15.0.0",
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
    },
    null,
    2
  );

  output["next.config.mjs"] = `/** @type {import('next').NextConfig} */
const nextConfig = {}
export default nextConfig
`;

  output["app/layout.js"] = `export const metadata = {
  title: '${name}',
  description: 'Generated with Nimbus',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;

  if (pageNames.length === 1) {
    output["app/page.js"] = wrapHtmlAsNextPage(pageFiles[pageNames[0]]);
  } else {
    pageNames.forEach((filename) => {
      if (filename === "index.html") {
        output["app/page.js"] = wrapHtmlAsNextPage(pageFiles[filename]);
      } else {
        const slug = filename.replace(".html", "");
        output[`app/${slug}/page.js`] = wrapHtmlAsNextPage(pageFiles[filename]);
      }
    });
  }

  output["README.md"] = frameworkReadme(name, "Next.js", [
    "npm install",
    "npm run dev",
  ]);

  return output;
}

function scaffoldAstro(htmlContent, files, name) {
  const output = {};
  const pageFiles =
    files && Object.keys(files).length > 0
      ? files
      : { "index.html": htmlContent };
  const pageNames = Object.keys(pageFiles);

  output["package.json"] = JSON.stringify(
    {
      name,
      type: "module",
      version: "0.0.1",
      scripts: {
        dev: "astro dev",
        build: "astro build",
        preview: "astro preview",
      },
      dependencies: {
        astro: "^4.0.0",
      },
    },
    null,
    2
  );

  output["astro.config.mjs"] = `import { defineConfig } from 'astro/config'

export default defineConfig({})
`;

  output["tsconfig.json"] = JSON.stringify(
    { extends: "astro/tsconfigs/strict" },
    null,
    2
  );

  pageNames.forEach((filename) => {
    const astroName = filename.replace(".html", ".astro");
    output[`src/pages/${astroName}`] = `---
// ${filename} — generated with Nimbus
---

${pageFiles[filename]}
`;
  });

  output["README.md"] = frameworkReadme(name, "Astro", [
    "npm install",
    "npm run dev",
  ]);

  return output;
}

function fileToComponentName(filename) {
  const base = filename.replace(".html", "");
  return base
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function wrapHtmlAsReactComponent(name, html) {
  const escaped = html.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  return `import { useRef, useEffect } from 'react'

export default function ${name}() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const shadow = containerRef.current.attachShadow
      ? containerRef.current.shadowRoot || containerRef.current.attachShadow({ mode: 'open' })
      : null

    if (shadow) {
      shadow.innerHTML = htmlContent
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', minHeight: '100vh' }} />
}

const htmlContent = \`${escaped}\`
`;
}

function wrapHtmlAsNextPage(html) {
  const escaped = html.replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  return `'use client'
import { useRef, useEffect } from 'react'

export default function Page() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const shadow = containerRef.current.attachShadow
      ? containerRef.current.shadowRoot || containerRef.current.attachShadow({ mode: 'open' })
      : null

    if (shadow) {
      shadow.innerHTML = htmlContent
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', minHeight: '100vh' }} />
}

const htmlContent = \`${escaped}\`
`;
}

function staticHtmlReadme(name, fileList) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `# ${name}

Generated on ${date}

## Quick Start

Open \`index.html\` in your browser. No build step required.

## Files

${fileList.map((f) => `- ${f}`).join("\n")}

---

Built with Nimbus Websites
`;
}

function frameworkReadme(name, framework, setupSteps) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `# ${name}

Generated on ${date} — ${framework} project

## Getting Started

\`\`\`bash
${setupSteps.join("\n")}
\`\`\`

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

\`\`\`bash
npm run build
\`\`\`

## Deploy

This project can be deployed to Vercel, Netlify, or any static hosting provider.

---

Built with Nimbus Websites
`;
}
