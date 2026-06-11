import type { Event } from "../types/event";

export const events: Event[] = [
  {
    id: "addis-fashion-week-2025",

    title: "Addis Fashion Week 2025",

    slug: "addis-fashion-week-2025",

    content:
      "KeKal Studio presented a selection of garments exploring contemporary silhouettes through Ethiopian handmade fabrics. The presentation highlighted craftsmanship, comfort, and textile heritage.",

    featuredImage:
      "/images/events/addis-fashion-week-2025/cover.jpg",

    gallery: [
      "/images/events/addis-fashion-week-2025/gallery-1.jpg",
      "/images/events/addis-fashion-week-2025/gallery-2.jpg",
      "/images/events/addis-fashion-week-2025/gallery-3.jpg",
    ],

    videoUrl:
      "https://www.youtube.com/watch?v=example",

    eventDate: "2025-10-15",

    location: "Addis Ababa, Ethiopia",

    organizer: "Addis Fashion Week",

    status: "past",

    featured: true,

    seo: {
      metaTitle:
        "Addis Fashion Week 2025 | KeKal Studio",

      metaDescription:
        "KeKal Studio at Addis Fashion Week 2025.",

      keywords: [
        "fashion week",
        "addis ababa",
        "ethiopian fashion",
        "kekal studio",
      ],

      socialImage:
        "/images/events/addis-fashion-week-2025/cover.jpg",
    },
  },

  {
    id: "textile-craft-exhibition",

    title: "Textile Craft Exhibition",

    slug: "textile-craft-exhibition",

    content:
      "An exhibition showcasing the role of handmade textiles in contemporary garment design.",

    featuredImage:
      "/images/events/textile-craft-exhibition/cover.jpg",

    gallery: [
      "/images/events/textile-craft-exhibition/gallery-1.jpg",
      "/images/events/textile-craft-exhibition/gallery-2.jpg",
    ],

    videoUrl: "",

    eventDate: "2026-09-10",

    location: "Addis Ababa, Ethiopia",

    organizer: "Cultural Design Center",

    status: "upcoming",

    featured: false,

    seo: {
      metaTitle:
        "Textile Craft Exhibition | KeKal Studio",

      metaDescription:
        "Upcoming exhibition featuring handmade textile traditions and contemporary design.",

      keywords: [
        "textile exhibition",
        "ethiopian textiles",
        "craftsmanship",
      ],

      socialImage:
        "/images/events/textile-craft-exhibition/cover.jpg",
    },
  },
];