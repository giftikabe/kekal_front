import type { HomePageContent } from "../types/home";

import heroImage from "../assets/hero.png";

export const homePageContent: HomePageContent = {
  hero: {
    name: "KEKAL",

    title: "EVERYDAY LIFE. RELAXED",

    tagline: "Ethiopian Textiles. Made for Everyday Life.",

    description:
      "Relaxed pieces handcrafted by Ethiopian artisans, inspired by heritage and made for modern living.",

    image: heroImage,
  },

  values: [
    {
      icon: "leaf",

      title: "ETHIOPIAN HANDMADE TEXTILES",

      description: "Rooted in heritage",
    },

    {
      icon: "people",

      title: "ARTISAN EMPOWERMENT",

      description: "Creating fair opportunities",
    },

    {
      icon: "shirt",

      title: "QUALITY & COMFORT",

      description: "Made for everyday life",
    },

    {
      icon: "heart",

      title: "CONSCIOUS & SLOW",

      description: "Thoughtful. Timeless. Meaningful.",
    },
  ],

  featuredCollections: {
    title: "Featured Collections",
  },

  designerSection: {
    title: "Meet The Designer",

    ctaText: "Read More →",
  },

  communityEventsSection: {
    title: "Community & Events",
  },

  upcomingEventSection: {
    title: "Upcoming Event",

    ctaText: "Learn More →",
  },
};
