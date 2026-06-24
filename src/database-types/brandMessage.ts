/**
 * Reusable marketing copy used across pages.
 *
 * Typical keys:
 * - about_cta
 * - contact_cta
 *
 * title = headline
 * description = supporting text
 */
export interface BrandMessage {
  id: string;

  key: string;

  title: string;

  description: string;
}