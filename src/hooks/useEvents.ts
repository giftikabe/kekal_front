/**
 * useEvents.ts
 *
 * Replaces:
 *   - eventService → getEvents, getEventBySlug, getFeaturedEvents,
 *                    getPastEvents, getCommunityImpactItems, getRelatedEvents
 */

import { eventsApi } from "../api";
import { useAsync } from "./useAsync";

/** Returns all events. Mirrors: getEvents() */
export function useEvents() {
  return useAsync(() => eventsApi.getAll(), "events");
}

/**
 * Returns a single event by slug.
 * Mirrors: getEventBySlug(slug)
 */
export function useEventBySlug(slug: string) {
  return useAsync(
    () => eventsApi.getBySlug(slug),
    `event-${slug}`
  );
}

/** Returns featured events. Mirrors: getFeaturedEvents() */
export function useFeaturedEvents() {
  return useAsync(() => eventsApi.getFeatured(), "events-featured");
}

/** Returns past events. Mirrors: getPastEvents() */
export function usePastEvents() {
  return useAsync(() => eventsApi.getPast(), "events-past");
}

/** Returns community impact items. Mirrors: getCommunityImpactItems() */
export function useCommunityImpactItems() {
  return useAsync(
    () => eventsApi.getCommunityImpact(),
    "events-community-impact"
  );
}

/**
 * Returns related events for a given event slug.
 * Mirrors: getRelatedEvents(currentEventId, limit)
 *
 * Note: The old service filtered by id; the API uses slug.
 * Pass the current event's slug to fetch its related events from the backend.
 */
export function useRelatedEvents(slug: string, limit = 3) {
  const { data, loading, error } = useAsync(
    () => eventsApi.getRelated(slug),
    `events-related-${slug}`
  );
  const sliced = (data as any[])?.slice(0, limit) ?? null;
  return { data: sliced, loading, error };
}
