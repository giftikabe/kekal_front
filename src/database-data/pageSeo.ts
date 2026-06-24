import type { PageSeo } from "../database-types/pageSeo";

export const pageSeo: PageSeo[] = [
  // ─── Static Pages ────────────────────────────────────────────────────────────
  {
    id: "seo-home",
    route: "/",
    metaTitle: "KeKal Studio | Handmade for Restful Living",
    metaDescription:
      "Relaxed pieces handcrafted by Ethiopian artisans, inspired by heritage and made for modern living.",
    keywords: ["kekal studio", "ethiopian fashion", "handmade textiles", "restful living"],
    socialImage: "/assets/hero.png",
  },
  {
    id: "seo-about",
    route: "/about",
    metaTitle: "About | KeKal Studio",
    metaDescription:
      "Learn about KeKal Studio — the brand, the designer, the craft process, and the vision behind Ethiopian contemporary fashion.",
    keywords: ["kekal studio", "about", "ethiopian fashion", "kalkidan adane"],
    socialImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    id: "seo-collections",
    route: "/collections",
    metaTitle: "Collections | KeKal Studio",
    metaDescription:
      "Explore seasonal collections and signature pieces that reflect the studio's approach to craftsmanship, culture, and contemporary design.",
    keywords: ["kekal studio", "collections", "ethiopian textiles", "fashion archive"],
    socialImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
  },
  {
    id: "seo-events",
    route: "/events",
    metaTitle: "Events & Shows | KeKal Studio",
    metaDescription:
      "Discover the exhibitions, markets, workshops, collaborations, and community initiatives that connect KeKal Studio with creatives across Ethiopia and beyond.",
    keywords: ["kekal studio", "events", "exhibitions", "community", "ethiopian design"],
    socialImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
  },
  {
    id: "seo-contact",
    route: "/contact",
    metaTitle: "Contact | KeKal Studio",
    metaDescription:
      "For inquiries, collaborations, custom projects, appointments, or partnerships, we would love to hear from you.",
    keywords: ["kekal studio", "contact", "collaboration", "custom projects"],
    socialImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
  },

  // ─── Collection Pages ─────────────────────────────────────────────────────────
  {
    id: "seo-collection-restful-living-2025",
    route: "/collections/restful-living-2025",
    metaTitle: "Restful Living Collection | KeKal Studio",
    metaDescription: "Explore the Restful Living collection by KeKal Studio.",
    keywords: ["kekal studio", "ethiopian fashion", "handmade garments", "restful living"],
    socialImage: "/images/collections/restful-living-cover.jpg",
  },
  {
    id: "seo-collection-woven-futures",
    route: "/collections/woven-futures",
    metaTitle: "Woven Futures Collection | KeKal Studio",
    metaDescription: "Explore the Woven Futures collection by KeKal Studio.",
    keywords: ["woven futures", "ethiopian textiles", "fashion design"],
    socialImage: "/images/collections/woven-futures-cover.jpg",
  },
  {
    id: "seo-collection-highland-mist",
    route: "/collections/highland-mist",
    metaTitle: "Highland Mist Collection | KeKal Studio",
    metaDescription: "Discover highland-inspired garments crafted with care.",
    keywords: ["highland mist", "outerwear", "ethiopian craftsmanship"],
    socialImage: "/images/collections/highland-mist-cover.jpg",
  },
  {
    id: "seo-collection-sunset-sheger",
    route: "/collections/sunset-sheger",
    metaTitle: "Sunset Sheger Collection | KeKal Studio",
    metaDescription:
      "Warm palettes and breathable fabrics inspired by modern cityscape horizons.",
    keywords: ["sunset sheger", "addis ababa fashion", "hand-woven cotton"],
    socialImage: "/images/collections/sunset-sheger-cover.jpg",
  },
  {
    id: "seo-collection-rift-valley-clay",
    route: "/collections/rift-valley-clay",
    metaTitle: "Rift Valley Clay Collection | KeKal Studio",
    metaDescription: "Terracotta and clay tones meet minimal streetwear architecture.",
    keywords: ["rift valley", "minimalist design", "organic tones"],
    socialImage: "/images/collections/rift-valley-clay-cover.jpg",
  },
  {
    id: "seo-collection-blue-nile-threads",
    route: "/collections/blue-nile-threads",
    metaTitle: "Blue Nile Threads | KeKal Studio",
    metaDescription: "Flowing shapes and natural indigo garments from KeKal Studio.",
    keywords: ["blue nile", "indigo dye", "fluid tailoring"],
    socialImage: "/images/collections/blue-nile-threads-cover.jpg",
  },
  {
    id: "seo-collection-monolithic-echoes",
    route: "/collections/monolithic-echoes",
    metaTitle: "Monolithic Echoes Collection | KeKal Studio",
    metaDescription:
      "Architectural heritage translated seamlessly into structural contemporary wear.",
    keywords: ["monolithic echoes", "lalibela inspired", "structural garments"],
    socialImage: "/images/collections/monolithic-echoes-cover.jpg",
  },
  {
    id: "seo-collection-axumite-gold",
    route: "/collections/axumite-gold",
    metaTitle: "Axumite Gold Collection | KeKal Studio",
    metaDescription: "Premium evening ensembles showcasing historical luxury embroidery.",
    keywords: ["axumite gold", "tilet embroidery", "luxury evening wear"],
    socialImage: "/images/collections/axumite-gold-cover.jpg",
  },
  {
    id: "seo-collection-urban-habesha-2025",
    route: "/collections/urban-habesha-2025",
    metaTitle: "Urban Habesha Staples | KeKal Studio",
    metaDescription:
      "Discover modular lightweight cotton staples designed for flexible modern life.",
    keywords: ["urban habesha", "streetwear", "everyday lounge"],
    socialImage: "/images/collections/urban-habesha-cover.jpg",
  },
  {
    id: "seo-collection-timeless-tilet",
    route: "/collections/timeless-tilet",
    metaTitle: "Timeless Tilet Heritage Collection | KeKal Studio",
    metaDescription: "Celebrating pattern history with iconic woven geometrics.",
    keywords: ["timeless tilet", "geometric weaving", "heritage border patterns"],
    socialImage: "/images/collections/timeless-tilet-cover.jpg",
  },

  // ─── Product Pages ────────────────────────────────────────────────────────────
  {
    id: "seo-product-restful-living-coat",
    route: "/collections/restful-living-2025/restful-living-coat",
    metaTitle: "Restful Living Coat | KeKal Studio",
    metaDescription: "Relaxed contemporary outerwear.",
    keywords: ["coat", "restful living", "kekal"],
    socialImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
  },
  {
    id: "seo-product-restful-living-dress",
    route: "/collections/restful-living-2025/restful-living-dress",
    metaTitle: "Restful Living Dress | KeKal Studio",
    metaDescription: "Flowing contemporary dress.",
    keywords: ["dress", "restful living"],
    socialImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
  },
  {
    id: "seo-product-woven-futures-jacket",
    route: "/collections/woven-futures/woven-futures-jacket",
    metaTitle: "Woven Futures Jacket | KeKal Studio",
    metaDescription: "Modern tailoring inspired by traditional weaving.",
    keywords: ["woven futures", "jacket"],
    socialImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
  },
  {
    id: "seo-product-woven-futures-trousers",
    route: "/collections/woven-futures/woven-futures-trousers",
    metaTitle: "Woven Futures Trousers | KeKal Studio",
    metaDescription: "Relaxed woven trousers.",
    keywords: ["woven futures", "trousers"],
    socialImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  },
  {
    id: "seo-product-highland-mist-coat",
    route: "/collections/highland-mist/highland-mist-coat",
    metaTitle: "Highland Mist Coat | KeKal Studio",
    metaDescription: "Soft structured outerwear.",
    keywords: ["highland mist", "coat"],
    socialImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
  },

  // ─── Event Pages ──────────────────────────────────────────────────────────────
  {
    id: "seo-event-addis-creative-bazaar",
    route: "/events/addis-creative-bazaar",
    metaTitle: "Addis Creative Bazaar | KeKal",
    metaDescription: "KeKal participation at the Addis Creative Bazaar.",
    keywords: ["kekal", "creative bazaar", "ethiopian design"],
    socialImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
  },
  {
    id: "seo-event-women-in-design-workshop",
    route: "/events/women-in-design-workshop",
    metaTitle: "Women in Design Workshop | KeKal",
    metaDescription: "Participation in a design and entrepreneurship workshop.",
    keywords: ["design workshop", "women entrepreneurs", "kekal"],
    socialImage: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
  },
  {
    id: "seo-event-african-textile-expo",
    route: "/events/african-textile-expo",
    metaTitle: "African Textile Expo | KeKal",
    metaDescription:
      "Showcasing Ethiopian handmade textiles at an international exhibition.",
    keywords: ["textile expo", "african design", "ethiopian textiles"],
    socialImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
  },
  {
    id: "seo-upcoming-emerging-designers-mentorship",
    route: "/events/emerging-designers-mentorship",
    metaTitle: "Emerging Designers Mentorship | KeKal Studio",
    metaDescription: "A mentorship program supporting emerging fashion designers.",
    keywords: ["fashion mentorship", "young designers", "kekal studio"],
    socialImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: "seo-upcoming-makers-market-weekend",
    route: "/events/makers-market-weekend",
    metaTitle: "Makers Market Weekend | KeKal Studio",
    metaDescription: "KeKal Studio at the Makers Market Weekend.",
    keywords: ["makers market", "handmade fashion", "ethiopian design"],
    socialImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  },
];