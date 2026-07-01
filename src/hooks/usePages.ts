/**
 * usePages.ts
 *
 * Replaces:
 *   - pageService        → getPages
 *   - pageSectionService → getPageSections, getSectionsByPageId,
 *                          getSectionByPageAndName
 *   - pageSeoService     → getPageSeo, getSeoByRoute
 */

import { pagesApi } from "../api";
import { useAsync } from "./useAsync";

// ─── Pages ────────────────────────────────────────────────────────────────────

/** Returns all pages. Mirrors: getPages() */
export function usePages() {
  return useAsync(() => pagesApi.getAll(), "pages");
}

// ─── Page Sections ────────────────────────────────────────────────────────────

/** Returns all page sections. Mirrors: getPageSections() */
export function usePageSections() {
  return useAsync(() => pagesApi.getSections(), "page-sections");
}

/**
 * Returns all sections for a given page id.
 * Mirrors: getSectionsByPageId(pageId)
 */
export function useSectionsByPageId(pageId: string) {
  return useAsync(
    () => pagesApi.getSectionsByPage(pageId),
    `page-sections-${pageId}`
  );
}

/**
 * Returns a single section by page id and section name.
 * Mirrors: getSectionByPageAndName(pageId, sectionName)
 */
export function useSectionByPageAndName(pageId: string, sectionName: string) {
  return useAsync(
    () => pagesApi.getSectionByPageAndName(pageId, sectionName),
    `page-section-${pageId}-${sectionName}`
  );
}

// ─── Page SEO ─────────────────────────────────────────────────────────────────

/**
 * Returns SEO data for a given route.
 * Mirrors: getSeoByRoute(route)
 */
export function useSeoByRoute(route: string) {
  return useAsync(
    () => pagesApi.getSeoByRoute(route),
    `seo-${route}`
  );
}
