import type { Event } from "../database-types/event";

export const events: Event[] = [
  {
    id: "1",

    title: "Addis Handmade Fashion Showcase",

    slug: "addis-handmade-fashion-showcase",

    intro:
      "Celebrating Ethiopian craftsmanship through contemporary fashion.",

    content:
      "A showcase bringing together designers, artisans, and textile enthusiasts.",

    featuredImage: "https://landing.com/event-1.jpg",

    gallery: [
      "https://landing.com/event-1a.jpg",
      "https://landing.com/event-1b.jpg",
    ],

    category: "exhibition",

    type: "event",

    eventDate: "2026-03-15",

    location: "Addis Ababa",

    organizer: "KEKAL",

    featured: true,
  },

  {
    id: "2",

    title: "Women Artisan Training Program",

    slug: "women-artisan-training-program",

    intro:
      "Supporting local artisans through practical skill development.",

    content:
      "Community initiative focused on creating sustainable opportunities.",

    featuredImage: "https://landing.com/event-2.jpg",

    gallery: [
      "https://landing.com/event-2a.jpg",
    ],

    category: "other",

    type: "community-impact",

    eventDate: "2026-01-10",

    location: "Addis Ababa",

    organizer: "KEKAL",

    featured: true,
  },
];