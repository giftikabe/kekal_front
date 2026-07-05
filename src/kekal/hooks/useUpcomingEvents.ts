import { upcomingEventsApi } from "../api";
import { useAsync } from "./useAsync";

export function useUpcomingEvents() {
  return useAsync(() => upcomingEventsApi.getAll(), "upcoming-events");
}

export function useUpcomingEventBySlug(slug: string) {
  return useAsync(
    () => upcomingEventsApi.getBySlug(slug),
    `upcoming-event-${slug}`,
  );
}

export function useFeaturedUpcomingEvents() {
  return useAsync(
    () => upcomingEventsApi.getFeatured(),
    "upcoming-events-featured",
  );
}

export function useRelatedUpcomingEvents(currentEventId: string, limit = 3) {
  const { data, loading, error } = useAsync(
    () => upcomingEventsApi.getAll(),
    "upcoming-events",
  );
  const related =
    (data as any[]) // eslint-disable-line @typescript-eslint/no-explicit-any
      ?.filter((e) => e.id !== currentEventId)
      .slice(0, limit) ?? null;
  return { data: related, loading, error };
}
