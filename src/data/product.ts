import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "rest-shirt-01",

    collectionId: "restful-living-2025",

    name: "Rest Shirt",

    slug: "rest-shirt",

    description:
      "A relaxed-fit shirt crafted from Ethiopian handmade cotton fabric, designed for comfort and everyday wear.",

    mainImage:
      "/images/products/rest-shirt/main.jpg",

    gallery: [
      "/images/products/rest-shirt/gallery-1.jpg",
      "/images/products/rest-shirt/gallery-2.jpg",
      "/images/products/rest-shirt/gallery-3.jpg",
    ],

    colors: [
      {
        name: "Natural White",

        code: "#F5F3EE",

        images: [
          "/images/products/rest-shirt/white-1.jpg",
          "/images/products/rest-shirt/white-2.jpg",
        ],
      },

      {
        name: "Charcoal",

        code: "#36454F",

        images: [
          "/images/products/rest-shirt/charcoal-1.jpg",
          "/images/products/rest-shirt/charcoal-2.jpg",
        ],
      },
    ],

    sizes: ["S", "M", "L", "XL"],

    inStock: true,

    featured: true,

    seo: {
      metaTitle: "Rest Shirt | KeKal Studio",

      metaDescription:
        "Modern handmade shirt crafted using Ethiopian textiles.",

      keywords: [
        "shirt",
        "ethiopian textile",
        "handmade fashion",
        "kekal studio",
      ],

      socialImage:
        "/images/products/rest-shirt/main.jpg",
    },
  },

  {
    id: "woven-dress-01",

    collectionId: "woven-futures",

    name: "Woven Dress",

    slug: "woven-dress",

    description:
      "A contemporary dress celebrating traditional weaving techniques through modern design.",

    mainImage:
      "/images/products/woven-dress/main.jpg",

    gallery: [
      "/images/products/woven-dress/gallery-1.jpg",
      "/images/products/woven-dress/gallery-2.jpg",
    ],

    colors: [
      {
        name: "Sand",

        code: "#D8C3A5",

        images: [
          "/images/products/woven-dress/sand-1.jpg",
          "/images/products/woven-dress/sand-2.jpg",
        ],
      },
    ],

    sizes: ["S", "M", "L", "XL"],

    inStock: true,

    featured: false,

    seo: {
      metaTitle: "Woven Dress | KeKal Studio",

      metaDescription:
        "Contemporary dress inspired by Ethiopian weaving traditions.",

      keywords: [
        "dress",
        "woven futures",
        "ethiopian fashion",
      ],

      socialImage:
        "/images/products/woven-dress/main.jpg",
    },
  },
];