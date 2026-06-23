export interface Product {
  id: string;

  collectionId: string;

  name: string;

  slug: string;

  description: string;

  mainImage: string;

  gallery: string[];

  colors: string[];

  sizes: string[];

  inStock: boolean;

  featured: boolean;
}