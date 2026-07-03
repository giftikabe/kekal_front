import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSeoByRoute } from "../../hooks/usePages";

interface SeoProps {
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
  jsonLd?: object | object[];
}

const SITE_NAME = "KEKAL";
const SITE_URL = "https://kekal.com"; // TODO: set to your real production domain

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

export default function Seo({
  fallbackTitle = SITE_NAME,
  fallbackDescription = "",
  fallbackImage = "",
  jsonLd,
}: SeoProps) {
  const location = useLocation();
  const { data: seo, loading } = useSeoByRoute(location.pathname);

  useEffect(() => {
    if (loading) return;

    const s = seo as any;
    const title = s?.meta_title || fallbackTitle;
    const description = s?.meta_description || fallbackDescription;
    const keywords = Array.isArray(s?.keywords) ? s.keywords.join(", ") : "";
    const image = s?.social_image || fallbackImage;
    const canonical = `${SITE_URL}${location.pathname}`;

    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    setMetaTag("name", "description", description);
    if (keywords) setMetaTag("name", "keywords", keywords);

    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", SITE_NAME);
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
    location.pathname,
    fallbackTitle,
    fallbackDescription,
    fallbackImage,
    jsonLd,
  ]);

  return null;
}
