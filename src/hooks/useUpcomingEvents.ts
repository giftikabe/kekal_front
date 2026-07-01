/**
 * useUpcomingEvents.ts
 *
 * Replaces:
 *   - upcomingEventService → getUpcomingEvents, getUpcomingEventBySlug,
 *                            getFeaturedUpcomingEvents, getRelatedUpcomingEvents
 */

import { upcomingEventsApi } from "../api";
import { useAsync } from "./useAsync";

/** Returns all upcoming events. Mirrors: getUpcomingEvents() */
export function useUpcomingEvents() {
  return useAsync(() => upcomingEventsApi.getAll(), "upcoming-events");
}

/**
 * Returns a single upcoming event by slug.
 * Mirrors: getUpcomingEventBySlug(slug)
 */
export function useUpcomingEventBySlug(slug: string) {
  return useAsync(
    () => upcomingEventsApi.getBySlug(slug),
    `upcoming-event-${slug}`
  );
}

/** Returns featured upcoming events. Mirrors: getFeaturedUpcomingEvents() */
export function useFeaturedUpcomingEvents() {
  return useAsync(
    () => upcomingEventsApi.getFeatured(),
    "upcoming-events-featured"
  );
}

/**
 * Returns related upcoming events, excluding the current event.
 * Mirrors: getRelatedUpcomingEvents(currentEventId, limit)
 *
 * Note: No dedicated related endpoint exists for upcoming events.
 * We fetch all and exclude by id client-side, matching the old service behaviour.
 */
export function useRelatedUpcomingEvents(currentEventId: string, limit = 3) {
  const { data, loading, error } = useAsync(
    () => upcomingEventsApi.getAll(),
    "upcoming-events"
  );
  const related =
    (data as any[])
      ?.filter((e) => e.id !== currentEventId)
      .slice(0, limit) ?? null;
  return { data: related, loading, error };
}
