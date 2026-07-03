/**
 * useCollections.ts
 *
 * Replaces:
 *   - collectionService → getCollections, getCollectionBySlug,
 *                         getFeaturedCollections, getLatestCollections,
 *                         getCollectionById
 */

import { collectionsApi } from "../api/api";
import { useAsync } from "./useAsync";

/** Returns all collections. Mirrors: getCollections() */
export function useCollections() {
  return useAsync(() => collectionsApi.getAll(), "collections");
}

/**
 * Returns a single collection by slug.
 * Mirrors: getCollectionBySlug(slug)
 */
export function useCollectionBySlug(slug: string) {
  return useAsync(
    () => collectionsApi.getBySlug(slug),
    `collection-${slug}`
  );
}

/** Returns featured collections. Mirrors: getFeaturedCollections() */
export function useFeaturedCollections() {
  return useAsync(() => collectionsApi.getFeatured(), "collections-featured");
}

/** Returns collections sorted latest-first. Mirrors: getLatestCollections() */
export function useLatestCollections() {
  return useAsync(() => collectionsApi.getLatest(), "collections-latest");
}

/**
 * Returns a single collection by its id.
 * Mirrors: getCollectionById(id)
 *
 * Note: The API does not have a /collections/by-id/:id endpoint.
 * We fetch all collections and find by id on the client — same result,
 * and the full list is small enough that this is fine.
 */
export function useCollectionById(id: string) {
  const { data, loading, error } = useAsync(
    () => collectionsApi.getAll(),
    "collections"
  );
  const collection = (data as any[])?.find((c) => c.id === id) ?? null;
  return { data: collection, loading, error };
}
