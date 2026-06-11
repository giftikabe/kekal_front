import type { Collection } from "../types/collection";

export const collections: Collection[] = [
  {
    id: "restful-living-2025",

    name: "Restful Living",

    slug: "restful-living-2025",

    description:
      "A collection exploring comfort, simplicity, and contemporary silhouettes using Ethiopian handmade fabrics.",

    coverImage:
      "/images/collections/restful-living-cover.jpg",

    releaseYear: 2025,

    status: "current",

    inStock: true,

    featured: true,

    seo: {
      metaTitle: "Restful Living Collection | KeKal Studio",

      metaDescription:
        "Explore the Restful Living collection by KeKal Studio.",

      keywords: [
        "kekal studio",
        "ethiopian fashion",
        "handmade garments",
        "restful living",
      ],

      socialImage:
        "/images/collections/restful-living-cover.jpg",
    },
  },

  {
    id: "woven-futures",

    name: "Woven Futures",

    slug: "woven-futures",

    description:
      "A design exploration combining traditional textile techniques with modern forms.",

    coverImage:
      "/images/collections/woven-futures-cover.jpg",

    releaseYear: 2024,

    status: "archive",

    inStock: true,

    featured: false,

    seo: {
      metaTitle: "Woven Futures Collection | KeKal Studio",

      metaDescription:
        "Explore the Woven Futures collection by KeKal Studio.",

      keywords: [
        "woven futures",
        "ethiopian textiles",
        "fashion design",
      ],

      socialImage:
        "/images/collections/woven-futures-cover.jpg",
    },
  },
];