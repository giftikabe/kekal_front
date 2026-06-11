import type { SEO } from "./collection";

export interface ProductColor {
  name: string;

  code: string;

  images: string[];
}

export interface Product {
  id: string;

  collectionId: string;

  name: string;

  slug: string;

  description: string;

  mainImage: string;

  gallery: string[];

  colors: ProductColor[];

  sizes: string[];

  inStock: boolean;

  featured: boolean;

  seo: SEO;
}