import type { Event } from "../types/event";

export const events: Event[] = [
  {
    id: "addis-creative-bazaar",

    title: "Addis Creative Bazaar",

    slug: "addis-creative-bazaar",

    intro:
      "KeKal participated in a city-wide creative market bringing together designers, artisans, and independent makers.",

    content:
      "The Addis Creative Bazaar brought together creative entrepreneurs from across Ethiopia. KeKal showcased selected pieces, connected with customers, and participated in conversations about the future of local design and craftsmanship.",

    featuredImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",

    gallery: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    ],

    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    category: "bazaar",

    type: "event",

    eventDate: "2025-06-15",

    location: "Addis Ababa, Ethiopia",

    organizer: "Creative Hub Ethiopia",

    featured: true,

    seo: {
      metaTitle: "Addis Creative Bazaar | KeKal",

      metaDescription: "KeKal participation at the Addis Creative Bazaar.",

      keywords: ["kekal", "creative bazaar", "ethiopian design"],

      socialImage:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    },
  },

  {
    id: "women-in-design-workshop",

    title: "Women in Design Workshop",

    slug: "women-in-design-workshop",

    intro:
      "A workshop focused on entrepreneurship, design thinking, and creative leadership for women.",

    content:
      "The workshop gathered women working across fashion, design, and creative industries. Participants shared experiences, discussed business challenges, and explored opportunities for collaboration.",

    featuredImage:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952",

    gallery: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    ],

    category: "workshop",

    type: "community-impact",

    eventDate: "2025-08-12",

    location: "Addis Ababa, Ethiopia",

    organizer: "Women Entrepreneurs Network",

    featured: true,

    seo: {
      metaTitle: "Women in Design Workshop | KeKal",

      metaDescription:
        "Participation in a design and entrepreneurship workshop.",

      keywords: ["design workshop", "women entrepreneurs", "kekal"],

      socialImage:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    },
  },

  {
    id: "african-textile-expo",

    title: "African Textile Expo",

    slug: "african-textile-expo",

    intro:
      "An international exhibition celebrating textile traditions and contemporary African design.",

    content:
      "The African Textile Expo welcomed designers, manufacturers, and cultural institutions from across the continent. KeKal presented selected work inspired by Ethiopian craftsmanship and contemporary design.",

    featuredImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",

    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b",
    ],

    category: "exhibition",

    type: "event",

    eventDate: "2025-10-05",

    location: "Nairobi, Kenya",

    organizer: "African Textile Network",

    featured: false,

    seo: {
      metaTitle: "African Textile Expo | KeKal",

      metaDescription:
        "Showcasing Ethiopian handmade textiles at an international exhibition.",

      keywords: ["textile expo", "african design", "ethiopian textiles"],

      socialImage:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    },
  },
];
