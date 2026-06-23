import { upcomingEvents } from "../database-data/upcomingEvents";

export function getUpcomingEvents() {
  return upcomingEvents;
}

export function getUpcomingEventBySlug(slug: string) {
  return upcomingEvents.find(
    (event) => event.slug === slug,
  );
}

export function getFeaturedUpcomingEvents() {
  return upcomingEvents.filter(
    (event) => event.featured,
  );
}

export function getRelatedUpcomingEvents(
  currentEventId: string,
  limit = 3,
) {
  return upcomingEvents
    .filter((event) => event.id !== currentEventId)
    .slice(0, limit);
}