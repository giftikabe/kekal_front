import type { UpcomingEvent } from "../database-types/upcomingEvent";

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "1",

    title: "Spring Artisan Bazaar",

    slug: "spring-artisan-bazaar",

    intro:
      "A gathering of artisans, makers, and textile enthusiasts.",

    content:
      "Join us for a day of exhibitions, networking, and celebration of handmade craftsmanship.",

    featuredImage: "https://landing.com/upcoming-event-1.jpg",

    category: "bazaar",

    eventDate: "2026-08-15",

    location: "Addis Ababa",

    organizer: "KEKAL",

    registrationUrl: "https://landing.com",

    ctaText: "Register Now",

    featured: true,
  },

  {
    id: "2",

    title: "Textile Workshop",

    slug: "textile-workshop",

    intro:
      "Hands-on learning experience with traditional textile techniques.",

    content:
      "Explore weaving, fabric selection, and contemporary applications of handmade textiles.",

    featuredImage: "https://landing.com/upcoming-event-2.jpg",

    category: "workshop",

    eventDate: "2026-09-10",

    location: "Addis Ababa",

    organizer: "KEKAL",

    registrationUrl: "https://landing.com",

    ctaText: "Reserve Your Seat",

    featured: false,
  },
];