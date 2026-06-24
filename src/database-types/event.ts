export type EventCategory =
  | "exhibition"
  | "bazaar"
  | "workshop"
  | "talk"
  | "collaboration"
  | "other";

export type EventType =
  | "event"
  | "community-impact";
/**
 * Past events and community impact activities.
 *
 * type:
 * - event
 * - community-impact
 *
 * gallery supports multiple images.
 */

export interface Event {
  id: string;

  title: string;

  slug: string;

  intro: string;

  content: string;

  featuredImage: string;

  gallery: string[];

  videoUrl?: string;

  category: EventCategory;

  type: EventType;

  eventDate: string;

  location: string;

  organizer: string;

  featured: boolean;
}