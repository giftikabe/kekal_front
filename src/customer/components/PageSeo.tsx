import { useEffect } from "react";
import { pagesApi } from "../api";

interface PageSeoProps {
  route: string;
  fallbackTitle?: string;
}

export default function PageSeo({ route, fallbackTitle = "KEKAL" }: PageSeoProps) {
  useEffect(() => {
    pagesApi.getSeoByRoute(route)
      .then((seo: any) => {
        if (!seo) return;
        document.title = seo.metaTitle || fallbackTitle;
        setMeta("description", seo.metaDescription);
        setMeta("keywords", seo.keywords?.join(", "));
        setOgMeta("og:title", seo.metaTitle);
        setOgMeta("og:description", seo.metaDescription);
        setOgMeta("og:image", seo.socialImage);
      })
      .catch(() => { document.title = fallbackTitle; });

    return () => { document.title = "KEKAL"; };
  }, [route, fallbackTitle]);

  return null;
}

function setMeta(name: string, content?: string) {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

function setOgMeta(property: string, content?: string) {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
  el.setAttribute("content", content);
}
