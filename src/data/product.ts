import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "restful-living-coat",
    collectionId: "restful-living-2025",
    name: "Restful Living Coat",
    slug: "restful-living-coat",
    description:
      "A relaxed outer layer crafted for comfort and everyday elegance.",
    mainImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    gallery: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    ],
    colors: [
      {
        name: "Natural White",
        code: "#F5F1E8",
        images: [
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
        ],
      },
    ],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: true,
    seo: {
      metaTitle: "Restful Living Coat | KeKal Studio",
      metaDescription: "Relaxed contemporary outerwear.",
      keywords: ["coat", "restful living", "kekal"],
      socialImage:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    },
  },

  {
    id: "restful-living-dress",
    collectionId: "restful-living-2025",
    name: "Restful Living Dress",
    slug: "restful-living-dress",
    description: "A flowing dress designed around movement and simplicity.",
    mainImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    gallery: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    ],
    colors: [
      {
        name: "Natural White",
        code: "#F5F1E8",
        images: [
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
        ],
      },
      {
        name: "Charcoal",
        code: "#3A3A3A",
        images: [
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
        ],
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    featured: false,
    seo: {
      metaTitle: "Restful Living Dress | KeKal Studio",
      metaDescription: "Flowing contemporary dress.",
      keywords: ["dress", "restful living"],
      socialImage:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    },
  },

  {
    id: "woven-futures-jacket",
    collectionId: "restful-living-2025",
    name: "Woven Futures Jacket",
    slug: "woven-futures-jacket",
    description:
      "Traditional weaving inspiration translated into modern tailoring.",
    mainImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
    gallery: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
    ],
    colors: [
      {
        name: "Indigo",
        code: "#264B73",
        images: [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
        ],
      },
    ],
    sizes: ["S", "M", "L"],
    inStock: true,
    featured: false,
    seo: {
      metaTitle: "Woven Futures Jacket | KeKal Studio",
      metaDescription: "Modern tailoring inspired by traditional weaving.",
      keywords: ["woven futures", "jacket"],
      socialImage:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
    },
  },

  {
    id: "woven-futures-trousers",
    collectionId: "restful-living-2025",
    name: "Woven Futures Trousers",
    slug: "woven-futures-trousers",
    description: "Relaxed tailoring with strong textile character.",
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    gallery: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    ],
    colors: [
      {
        name: "Indigo",
        code: "#264B73",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772"],
      },
      {
        name: "Sand",
        code: "#D8C3A5",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
        ],
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    featured: false,
    seo: {
      metaTitle: "Woven Futures Trousers | KeKal Studio",
      metaDescription: "Relaxed woven trousers.",
      keywords: ["woven futures", "trousers"],
      socialImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    },
  },

  {
    id: "highland-mist-coat",
    collectionId: "highland-mist",
    name: "Highland Mist Coat",
    slug: "highland-mist-coat",
    description:
      "Soft structured outerwear inspired by Ethiopian highland mornings.",
    mainImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    ],
    colors: [
      {
        name: "Mist Grey",
        code: "#B7B7B7",
        images: [
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
        ],
      },
    ],
    sizes: ["M", "L"],
    inStock: true,
    featured: true,
    seo: {
      metaTitle: "Highland Mist Coat | KeKal Studio",
      metaDescription: "Soft structured outerwear.",
      keywords: ["highland mist", "coat"],
      socialImage:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    },
  },
];
