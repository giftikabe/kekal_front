import type { Collection } from "../database-types/collection";

export const collections: Collection[] = [
  {
    id: "1",

    name: "Lounge Collection",

    slug: "lounge-collection",

    description:
      "Relaxed silhouettes designed for comfort and everyday living.",

    coverImage: "https://landing.com/lounge-collection.jpg",

    releaseYear: 2026,

    createdAt: "2026-01-01",

    status: "current",

    inStock: true,

    featured: true,
  },

  {
    id: "2",

    name: "Heritage Collection",

    slug: "heritage-collection",

    description:
      "Contemporary garments inspired by Ethiopian textile traditions.",

    coverImage: "https://landing.com/heritage-collection.jpg",

    releaseYear: 2025,

    createdAt: "2025-01-01",

    status: "archive",

    inStock: false,

    featured: false,
  },
];