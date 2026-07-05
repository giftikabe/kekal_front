/**
 * Generates public/sitemap.xml from live API data instead of a hardcoded
 * list of routes, so newly published collections/products/events are
 * automatically included on the next deploy.
 *
 * Run via `npm run generate:sitemap` (wire into your deploy pipeline,
 * e.g. as a prebuild/postbuild step) so the sitemap never goes stale.
 */
const API_BASE = process.env.VITE_API_BASE_URL || "https://kekal-back.kekal.workers.dev";
const SITE_URL = (process.env.VITE_SITE_URL || "https://kekalstudio.com").replace(/\/$/, "");

const STATIC_ROUTES = ["/", "/about", "/collections", "/events", "/contact"];

async function getJson(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function urlEntry(loc, lastmod) {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>${
    lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
  }\n  </url>`;
}

async function main() {
  const [collections, products, events, upcoming] = await Promise.all([
    getJson("/collections"),
    getJson("/products"),
    getJson("/events"),
    getJson("/upcoming-events"),
  ]);

  const entries = [
    ...STATIC_ROUTES.map((r) => urlEntry(r)),
    ...collections.map((c) => urlEntry(`/collections/${c.slug}`, c.createdAt)),
    ...products.map((p) => urlEntry(`/products/${p.slug}`)),
    ...events.map((e) => urlEntry(`/events/${e.slug}`, e.eventDate)),
    ...upcoming.map((e) => urlEntry(`/upcoming-events/${e.slug}`, e.eventDate)),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join(
    "\n",
  )}\n</urlset>\n`;

  const fs = await import("node:fs/promises");
  await fs.writeFile(new URL("../public/sitemap.xml", import.meta.url), xml, "utf8");
  console.log(`sitemap.xml written with ${entries.length} URLs`);
}

main();
