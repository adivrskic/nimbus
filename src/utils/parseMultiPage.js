export function parseMultiPageHtml(html) {
  if (!html) return null;

  const filePattern = /<!--\s*(?:=+\s*)?FILE:\s*(\S+\.html)\s*(?:=+\s*)?-->/gi;
  const parts = html.split(filePattern);

  if (parts.length <= 1) return null;

  const files = {};
  for (let i = 1; i < parts.length; i += 2) {
    const filename = parts[i]?.trim();
    const content = parts[i + 1]?.trim();
    if (filename && content) {
      files[filename] = content;
    }
  }

  return Object.keys(files).length > 0 ? files : null;
}

export function getPageDisplayName(filename) {
  const names = {
    "index.html": "Home",
    "about.html": "About",
    "services.html": "Services",
    "contact.html": "Contact",
    "products.html": "Products",
    "product-detail.html": "Product Detail",
    "cart.html": "Cart",
    "blog.html": "Blog",
    "post.html": "Blog Post",
    "dashboard.html": "Dashboard",
    "settings.html": "Settings",
    "getting-started.html": "Getting Started",
    "api-reference.html": "API Reference",
    "examples.html": "Examples",
  };
  return names[filename] || filename.replace(".html", "").replace(/-/g, " ");
}
