import type { Collection } from "../types/collection";

export const collections: Collection[] = [
  {
    id: "restful-living-2025",
    name: "Restful Living",
    slug: "restful-living-2025",
    description: "A collection exploring comfort, simplicity, and contemporary silhouettes using Ethiopian handmade fabrics.",
    coverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    releaseYear: 2025,
    createdAt: "2026-06-12", // Month 1
    status: "current",
    inStock: true,
    featured: true, // 1/5 True
    seo: {
      metaTitle: "Restful Living Collection | KeKal Studio",
      metaDescription: "Explore the Restful Living collection by KeKal Studio.",
      keywords: ["kekal studio", "ethiopian fashion", "handmade garments", "restful living"],
      socialImage: "/images/collections/restful-living-cover.jpg",
    },
  },
  {
    id: "woven-futures",
    name: "Woven Futures",
    slug: "woven-futures",
    description: "A design exploration combining traditional textile techniques with modern forms.",
    coverImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    releaseYear: 2024,
    createdAt: "2026-05-20", // Month 2
    status: "archive",
    inStock: true,
    featured: false, // 1/5 False
    seo: {
      metaTitle: "Woven Futures Collection | KeKal Studio",
      metaDescription: "Explore the Woven Futures collection by KeKal Studio.",
      keywords: ["woven futures", "ethiopian textiles", "fashion design"],
      socialImage: "/images/collections/woven-futures-cover.jpg",
    },
  },
  {
    id: "highland-mist",
    name: "Highland Mist",
    slug: "highland-mist",
    description: "Inspired by the cool mornings of the Ethiopian highlands, featuring soft textures and muted earth tones.",
    coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
    releaseYear: 2025,
    createdAt: "2026-04-15", // Month 3
    status: "current",
    inStock: true,
    featured: true, // 2/5 True
    seo: {
      metaTitle: "Highland Mist Collection | KeKal Studio",
      metaDescription: "Discover highland-inspired garments crafted with care.",
      keywords: ["highland mist", "outerwear", "ethiopian craftsmanship"],
      socialImage: "/images/collections/highland-mist-cover.jpg",
    },
  },
  {
    id: "sunset-sheger",
    name: "Sunset Sheger",
    slug: "sunset-sheger",
    description: "Capturing the vibrant golden hour hues of Addis Ababa through premium hand-woven cotton silhouettes.",
    coverImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    releaseYear: 2025,
    createdAt: "2026-03-10", // Month 4
    status: "current",
    inStock: false,
    featured: false, // 2/5 False
    seo: {
      metaTitle: "Sunset Sheger Collection | KeKal Studio",
      metaDescription: "Warm palettes and breathable fabrics inspired by modern cityscape horizons.",
      keywords: ["sunset sheger", "addis ababa fashion", "hand-woven cotton"],
      socialImage: "/images/collections/sunset-sheger-cover.jpg",
    },
  },
  {
    id: "rift-valley-clay",
    name: "Rift Valley Clay",
    slug: "rift-valley-clay",
    description: "A minimalist exploration of structured shapes and deep terracotta tones native to the Great Rift Valley landscape.",
    coverImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    releaseYear: 2024,
    createdAt: "2026-02-18", // Month 5
    status: "archive",
    inStock: true,
    featured: true, // 3/5 True
    seo: {
      metaTitle: "Rift Valley Clay Collection | KeKal Studio",
      metaDescription: "Terracotta and clay tones meet minimal streetwear architecture.",
      keywords: ["rift valley", "minimalist design", "organic tones"],
      socialImage: "/images/collections/rift-valley-clay-cover.jpg",
    },
  },
  {
    id: "blue-nile-threads",
    name: "Blue Nile Threads",
    slug: "blue-nile-threads",
    description: "Flowing indigo dyes and fluid garments that celebrate the majestic journey of the Nile River.",
    coverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    releaseYear: 2024,
    createdAt: "2026-01-05", // Month 6
    status: "archive",
    inStock: true,
    featured: false, // 3/5 False
    seo: {
      metaTitle: "Blue Nile Threads | KeKal Studio",
      metaDescription: "Flowing shapes and natural indigo garments from KeKal Studio.",
      keywords: ["blue nile", "indigo dye", "fluid tailoring"],
      socialImage: "/images/collections/blue-nile-threads-cover.jpg",
    },
  },
  {
    id: "monolithic-echoes",
    name: "Monolithic Echoes",
    slug: "monolithic-echoes",
    description: "Sharp lines, pleating details, and heavy structural handlooms drawing deep inspiration from the rock-hewn architecture of Lalibela.",
    coverImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
    releaseYear: 2023,
    createdAt: "2025-12-22", // Month 7
    status: "archive",
    inStock: false,
    featured: true, // 4/5 True
    seo: {
      metaTitle: "Monolithic Echoes Collection | KeKal Studio",
      metaDescription: "Architectural heritage translated seamlessly into structural contemporary wear.",
      keywords: ["monolithic echoes", "lalibela inspired", "structural garments"],
      socialImage: "/images/collections/monolithic-echoes-cover.jpg",
    },
  },
  {
    id: "axumite-gold",
    name: "Axumite Gold",
    slug: "axumite-gold",
    description: "An elegant evening capsule elevated with delicate, metallic tilet patterns and refined heritage embroidery work.",
    coverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    releaseYear: 2023,
    createdAt: "2025-11-14", // Month 8
    status: "archive",
    inStock: true,
    featured: false, // 4/5 False
    seo: {
      metaTitle: "Axumite Gold Collection | KeKal Studio",
      metaDescription: "Premium evening ensembles showcasing historical luxury embroidery.",
      keywords: ["axumite gold", "tilet embroidery", "luxury evening wear"],
      socialImage: "/images/collections/axumite-gold-cover.jpg",
    },
  },
  {
    id: "urban-habesha-2025",
    name: "Urban Habesha",
    slug: "urban-habesha-2025",
    description: "Casual, modular, every-day street staples remixed gracefully using handspun, native Ethiopian organic cotton threads.",
    coverImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    releaseYear: 2025,
    createdAt: "2025-10-01", // Month 9
    status: "current",
    inStock: true,
    featured: false, // 
    seo: {
      metaTitle: "Urban Habesha Staples | KeKal Studio",
      metaDescription: "Discover modular lightweight cotton staples designed for flexible modern life.",
      keywords: ["urban habesha", "streetwear", "everyday lounge"],
      socialImage: "/images/collections/urban-habesha-cover.jpg",
    },
  },
  {
    id: "timeless-tilet",
    name: "Timeless Tilet",
    slug: "timeless-tilet",
    description: "An open, continuous capsule piece celebrating the geometric complexity of traditional decorative border weaving artistry.",
    coverImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    releaseYear: 2022,
    createdAt: "2025-09-08", // Month 10
    status: "archive",
    inStock: true,
    featured: false, // 5/5 False
    seo: {
      metaTitle: "Timeless Tilet Heritage Collection | KeKal Studio",
      metaDescription: "Celebrating pattern history with iconic woven geometrics.",
      keywords: ["timeless tilet", "geometric weaving", "heritage border patterns"],
      socialImage: "/images/collections/timeless-tilet-cover.jpg",
    },
  },
];