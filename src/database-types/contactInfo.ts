/**
 * Contact information, social links, and location details.
 *
 * Typical keys:
 * - email
 * - phone
 * - whatsapp
 * - address
 * - google_map
 * - instagram
 * - facebook
 * - tiktok
 * - linkedin
 */
export interface ContactInfo {
  id: string;

  key: string;

  label: string;

  value: string;
}