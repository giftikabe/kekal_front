import { productsApi } from "../api";
import { useAsync } from "./useAsync";

export function useProducts() {
  return useAsync(() => productsApi.getAll(), "products");
}

export function useProductBySlug(slug: string) {
  return useAsync(() => productsApi.getBySlug(slug), `product-${slug}`);
}

export function useProductsByCollection(collectionId: string) {
  return useAsync(
    () => productsApi.getByCollection(collectionId),
    `products-collection-${collectionId}`,
  );
}
