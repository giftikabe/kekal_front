import { events } from "../data/event";

export function getEvents() {
  return events;
}

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}

export function getFeaturedEvents() {
  return events.filter((event) => event.featured);
}

export function getUpcomingEvents() {
  return events.filter((event) => event.status === "upcoming");
}
