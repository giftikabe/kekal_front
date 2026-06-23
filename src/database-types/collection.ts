export interface Collection {
  id: string;

  name: string;

  slug: string;

  description: string;

  coverImage: string;

  releaseYear: number;

  createdAt: string;

  status: "current" | "archive";

  inStock: boolean;

  featured: boolean;
}