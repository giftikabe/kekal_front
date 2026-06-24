/**
 * Core brand values displayed on the website.
 *
 * Examples:
 * - Ethiopian Handmade Textiles
 * - Artisan Empowerment
 * - Quality & Comfort
 * - Conscious & Slow
 *
 * icon: lucide-react icon name (e.g. "Leaf", "Users", "Shirt", "Heart")
 */
export interface BrandValue {
  id: string;

  icon: string;

  title: string;

  description: string;
}