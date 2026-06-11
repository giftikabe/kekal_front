import { collections } from "../data/collection";

export async function getCollections() {
  return collections;
}

export async function getCollectionBySlug(
  slug: string
) {
  return collections.find(
    (collection) =>
      collection.slug === slug
  );
}

export async function getFeaturedCollections() {
  return collections.filter(
    (collection) => collection.featured
  );
}