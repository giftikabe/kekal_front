import type { EventCategory } from "./event";


/**
 * Future events accepting registrations or promotion.
 *
 * registrationUrl = external registration link
 * ctaText = button label shown on frontend
 */

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
}