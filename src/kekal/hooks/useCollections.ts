import { collectionsApi } from "../api";
import { useAsync } from "./useAsync";

export function useCollections() {
  return useAsync(() => collectionsApi.getAll(), "collections");
}

export function useCollectionBySlug(slug: string) {
  return useAsync(() => collectionsApi.getBySlug(slug), `collection-${slug}`);
}

export function useFeaturedCollections() {
  return useAsync(() => collectionsApi.getFeatured(), "collections-featured");
}

export function useLatestCollections() {
  return useAsync(() => collectionsApi.getLatest(), "collections-latest");
}

/**
 * The API has no /collections/by-id/:id endpoint, so we fetch the full
 * (small) list and find client-side.
 */
export function useCollectionById(id: string) {
  const { data, loading, error } = useAsync(
    () => collectionsApi.getAll(),
    "collections",
  );
  const collection =
    (data as any[])?.find((c) => c.id === id) ?? null; // eslint-disable-line @typescript-eslint/no-explicit-any
  return { data: collection, loading, error };
}
