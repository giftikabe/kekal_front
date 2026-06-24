/**
 * Sections belonging to a page.
 *
 * Examples:
 * - hero
 * - featured_collections
 * - designer_section
 * - community_events
 * - upcoming_event
 *
 * buttonLabels supports multiple CTA buttons.
 */
export interface PageSection {
  id: string;

  pageId: string;

  sectionName: string;

  sectionHeader: string;

  buttonLabels: string[];
}