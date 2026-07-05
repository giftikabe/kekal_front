import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSeoByRoute } from "../hooks/usePages";
import { useBrandIdentityByKey } from "../hooks/useBrand";

interface SeoProps {
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  jsonLd?: object | object[];
  /** Set on 404s and other pages that shouldn't appear in search results. */
  noindex?: boolean;
}

// Falls back to the production origin if the env var isn't set so canonical
// URLs are never accidentally emitted as relative/localhost paths.
const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://kekalstudio.com").replace(/\/$/, "");

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(data: object | object[] | undefined) {
  const existing = document.getElementById("page-jsonld");
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement("script");
  script.id = "page-jsonld";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Renders no DOM — it only manages <head> tags for the current route.
 * Every page should mount exactly one <Seo /> with route-appropriate
 * fallbacks; page-seo data (managed in the admin "Pages & SEO" screen)
 * always takes priority once it loads.
 */
export default function Seo({
  fallbackTitle,
  fallbackDescription = "",
  fallbackImage = "",
  jsonLd,
  noindex = false,
}: SeoProps) {
  const location = useLocation();
  const { data: seo, loading } = useSeoByRoute(location.pathname);
  const { value: siteName } = useBrandIdentityByKey("name");

  useEffect(() => {
    if (loading) return;

    const resolvedSiteName = siteName || "KEKAL";
    const s = seo as {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
      socialImage?: string;
    } | null;

    // NOTE: these are the actual camelCase field names the API returns
    // (see page-seo.json / pageSeo.ts) — a previous version of this file
    // read meta_title/meta_description/social_image, which never matched
    // anything the backend sends, so every page silently fell back to
    // fallbackTitle/fallbackDescription and admin-managed SEO copy was
    // never actually applied.
    const title = s?.metaTitle || fallbackTitle || resolvedSiteName;
    const description = s?.metaDescription || fallbackDescription;
    const keywords = Array.isArray(s?.keywords) ? s.keywords.join(", ") : "";
    const image = s?.socialImage || fallbackImage;
    const canonical = `${SITE_URL}${location.pathname}`;

    document.title = "KEKAL";

    setMetaTag("name", "description", description);
    if (keywords) setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", resolvedSiteName);
    if (image) setMetaTag("property", "og:image", image);

    setMetaTag(
      "name",
      "twitter:card",
      image ? "summary_large_image" : "summary",
    );
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    if (image) setMetaTag("name", "twitter:image", image);

    setLinkTag("canonical", canonical);
    setJsonLd(jsonLd);
  }, [
    seo,
    loading,
    siteName,
    location.pathname,
    fallbackTitle,
    fallbackDescription,
    fallbackImage,
    jsonLd,
    noindex,
  ]);

  return null;
}
