import { products } from "../data/product";

export async function getProducts() {
  return products;
}

export async function getProductBySlug(
  slug: string
) {
  return products.find(
    (product) => product.slug === slug
  );
}

export async function getProductsByCollection(
  collectionId: string
) {
  return products.filter(
    (product) =>
      product.collectionId === collectionId
  );
}

export async function getFeaturedProducts() {
  return products.filter(
    (product) => product.featured
  );
}

export async function getRelatedProducts(
  productId: string,
  collectionId: string
) {
  return products.filter(
    (product) =>
      product.collectionId === collectionId &&
      product.id !== productId
  );
}