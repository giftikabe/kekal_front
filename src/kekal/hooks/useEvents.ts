import { eventsApi } from "../api";
import { useAsync } from "./useAsync";

export function useEvents() {
  return useAsync(() => eventsApi.getAll(), "events");
}

export function useEventBySlug(slug: string) {
  return useAsync(() => eventsApi.getBySlug(slug), `event-${slug}`);
}

export function useFeaturedEvents() {
  return useAsync(() => eventsApi.getFeatured(), "events-featured");
}

export function usePastEvents() {
  return useAsync(() => eventsApi.getPast(), "events-past");
}

export function useCommunityImpactItems() {
  return useAsync(
    () => eventsApi.getCommunityImpact(),
    "events-community-impact",
  );
}

export function useRelatedEvents(slug: string, limit = 3) {
  const { data, loading, error } = useAsync(
    () => eventsApi.getRelated(slug),
    `events-related-${slug}`,
  );
  const sliced = (data as any[])?.slice(0, limit) ?? null; // eslint-disable-line @typescript-eslint/no-explicit-any
  return { data: sliced, loading, error };
}
