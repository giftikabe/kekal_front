import { pageSections } from "../database-data/pageSections";

export function getPageSections() {
  return pageSections;
}

export function getSectionsByPageId(pageId: string) {
  return pageSections.filter((s) => s.pageId === pageId);
}

export function getSectionByPageAndName(pageId: string, sectionName: string) {
  return pageSections.find(
    (s) => s.pageId === pageId && s.sectionName === sectionName
  );
}