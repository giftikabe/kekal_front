import { events } from "../database-data/events";

export function getEvents() {
  return events;
}

export function getEventBySlug(slug: string) {
  return events.find(
    (event) => event.slug === slug,
  );
}

export function getFeaturedEvents() {
  return events.filter(
    (event) => event.featured,
  );
}

export function getPastEvents() {
  return events.filter(
    (event) => event.type === "event",
  );
}

export function getCommunityImpactItems() {
  return events.filter(
    (event) => event.type === "community-impact",
  );
}

export function getRelatedEvents(
  currentEventId: string,
  limit = 3,
) {
  return events
    .filter((event) => event.id !== currentEventId)
    .slice(0, limit);
}