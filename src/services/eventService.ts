import { events } from "../data/event";

export async function getEvents() {
  return events;
}

export async function getEventBySlug(
  slug: string
) {
  return events.find(
    (event) => event.slug === slug
  );
}

export async function getFeaturedEvents() {
  return events.filter(
    (event) => event.featured
  );
}

export async function getUpcomingEvents() {
  return events.filter(
    (event) => event.status === "upcoming"
  );
}

export async function getPastEvents() {
  return events.filter(
    (event) => event.status === "past"
  );
}