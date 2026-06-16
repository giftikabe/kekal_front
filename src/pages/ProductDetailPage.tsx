import { useParams } from "react-router-dom";

import ProductHero from "../components/ProductHero";
import ProductBody from "../components/ProductBody";
import RelatedProductsGrid from "../components/RelatedProductsGrid";

import { getProductBySlug } from "../services/productService";
import { getCollectionById } from "../services/collectionService";
import { getProductsByCollection } from "../services/productService";

export default function ProductDetailsPage() {
  const { slug } = useParams();

  const product = getProductBySlug(slug ?? "");

  if (!product) {
    return <p>Product not found.</p>;
  }

  const collection = getCollectionById(product.collectionId);

  const relatedProducts = getProductsByCollection(product.collectionId)
    .filter((relatedProduct) => relatedProduct.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductHero
        productName={product.name}
        collectionName={collection?.name ?? ""}
      />

      <ProductBody product={product} />

      <RelatedProductsGrid
        products={relatedProducts}
        collectionSlug={collection?.slug ?? ""}
      />
    </>
  );
}
