/**
 * Website pages.
 *
 * Examples:
 * - Home
 * - About
 * - Collections
 * - Events
 * - Contact
 * - Collection Details
 * - Product Details
 */
export interface Page {
  id: string;

  name: string;

  route: string;
}