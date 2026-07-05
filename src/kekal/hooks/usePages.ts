import { pagesApi } from "../api";
import { useAsync } from "./useAsync";

export function usePages() {
  return useAsync(() => pagesApi.getAll(), "pages");
}

export function usePageSections() {
  return useAsync(() => pagesApi.getSections(), "page-sections");
}

export function useSectionsByPageId(pageId: string) {
  return useAsync(
    () => pagesApi.getSectionsByPage(pageId),
    `page-sections-${pageId}`,
  );
}

export function useSectionByPageAndName(pageId: string, sectionName: string) {
  return useAsync(
    () => pagesApi.getSectionByPageAndName(pageId, sectionName),
    `page-section-${pageId}-${sectionName}`,
  );
}

export function useSeoByRoute(route: string) {
  return useAsync(() => pagesApi.getSeoByRoute(route), `seo-${route}`);
}
