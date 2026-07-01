/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { pagesApi } from "../api";

interface SectionData {
  id: string;
  pageId: string;
  sectionName: string;
  sectionHeader: string;
  buttonLabels: string[];
}

export function useSectionData(pageId: string) {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pagesApi.getSectionsByPage(pageId)
      .then((data) => setSections(data as SectionData[]))
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, [pageId]);

  const getSection = (sectionName: string): SectionData | null =>
    sections.find((s) => s.sectionName === sectionName) || null;

  const getSectionHeader = (sectionName: string, fallback = ""): string =>
    getSection(sectionName)?.sectionHeader || fallback;

  const getButtonLabel = (sectionName: string, index = 0, fallback = ""): string =>
    getSection(sectionName)?.buttonLabels?.[index] || fallback;

  return { sections, loading, getSection, getSectionHeader, getButtonLabel };
}
