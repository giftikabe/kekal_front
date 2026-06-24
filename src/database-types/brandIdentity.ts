/**
 * Brand identity and brand-wide assets.
 *
 * Typical keys:
 * - name
 * - title
 * - tagline
 * - description
 * - logo
 * - announcement_text
 * - copyright_text
 * - home_hero_image
 * - contact_hero_image
 *
 * Example:
 * {
 *   id: "1",
 *   key: "tagline",
 *   label: "Tagline",
 *   value: "Everyday Life. Relaxed."
 * }
 */
export interface BrandIdentity {
  id: string;

  key: string;

  label: string;

  value: string;
}