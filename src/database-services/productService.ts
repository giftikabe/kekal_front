import { products } from "../database-data/products";

export function getProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find(
    (product) => product.slug === slug,
  );
}

export function getProductsByCollection(collectionId: string) {
  return products.filter(
    (product) => product.collectionId === collectionId,
  );
}