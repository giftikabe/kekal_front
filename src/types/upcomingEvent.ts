import type { SEO } from "./collection";

import type { EventCategory } from "./event";

export interface UpcomingEvent {
  id: string;

  title: string;

  slug: string;

  intro: string;

  content: string;

  featuredImage: string;

  category: EventCategory;

  eventDate: string;

  location: string;

  organizer: string;

  registrationUrl?: string;

  ctaText: string;

  featured: boolean;

  seo: SEO;
}