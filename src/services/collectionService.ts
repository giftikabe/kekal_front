import { collections } from "../data/collection";

export function getCollections() {
  return collections;
}

export function getCollectionBySlug(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}

export function getFeaturedCollections() {
  return collections.filter((collection) => collection.featured);
}

export function getLatestCollections() {
  return [...collections].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getCollectionById(id: string) {
  return collections.find((collection) => collection.id === id);
}