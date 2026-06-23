import type { Product } from "../database-types/product";

export const products: Product[] = [
  {
    id: "1",

    collectionId: "1",

    name: "Lounge Robe",

    slug: "lounge-robe",

    description:
      "A relaxed robe crafted from Ethiopian handmade textiles.",

    mainImage: "https://landing.com/lounge-robe.jpg",

    gallery: [
      "https://landing.com/lounge-robe-1.jpg",
      "https://landing.com/lounge-robe-2.jpg",
    ],

    colors: ["Natural", "Black"],

    sizes: ["S", "M", "L", "XL"],

    inStock: true,

    featured: true,
  },

  {
    id: "2",

    collectionId: "1",

    name: "Comfort Top",

    slug: "comfort-top",

    description:
      "Designed for everyday comfort and effortless styling.",

    mainImage: "https://landing.com/comfort-top.jpg",

    gallery: [
      "https://landing.com/comfort-top-1.jpg",
      "https://landing.com/comfort-top-2.jpg",
    ],

    colors: ["Natural"],

    sizes: ["S", "M", "L"],

    inStock: true,

    featured: false,
  },
];