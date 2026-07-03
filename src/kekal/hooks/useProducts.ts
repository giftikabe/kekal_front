/**
 * useProducts.ts
 *
 * Replaces:
 *   - productService → getProducts, getProductBySlug, getProductsByCollection
 */

import { productsApi } from "../api/api";
import { useAsync } from "./useAsync";

/** Returns all products. Mirrors: getProducts() */
export function useProducts() {
  return useAsync(() => productsApi.getAll(), "products");
}

/**
 * Returns a single product by slug.
 * Mirrors: getProductBySlug(slug)
 */
export function useProductBySlug(slug: string) {
  return useAsync(
    () => productsApi.getBySlug(slug),
    `product-${slug}`
  );
}

/**
 * Returns all products in a given collection.
 * Mirrors: getProductsByCollection(collectionId)
 */
export function useProductsByCollection(collectionId: string) {
  return useAsync(
    () => productsApi.getByCollection(collectionId),
    `products-collection-${collectionId}`
  );
}
