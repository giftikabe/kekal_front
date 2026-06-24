/**
 * SEO settings for static pages.
 *
 * One record per page route.
 *
 * Examples:
 * - /
 * - /about
 * - /collections
 * - /events
 * - /contact
 */
export interface PageSeo {
  id: string;

  route: string;

  metaTitle: string;

  metaDescription: string;

  keywords: string[];

  socialImage: string;
}