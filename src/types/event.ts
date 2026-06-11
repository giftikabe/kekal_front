import type { SEO } from "./collection";

export interface Event {
  id: string;

  title: string;

  slug: string;

  content: string;

  featuredImage: string;

  gallery: string[];

  videoUrl: string;

  eventDate: string;

  location: string;

  organizer: string;

  status: "upcoming" | "past";

  featured: boolean;

  seo: SEO;
}