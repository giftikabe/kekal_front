import { useParams } from "react-router-dom";

import ProductHero from "../components/ProductHero";
import ProductBody from "../components/ProductBody";
import RelatedProductsGrid from "../components/RelatedProductsGrid";

import { getProductBySlug, getProductsByCollection } from "../database-services/productService";
import { getCollectionById } from "../database-services/collectionService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function ProductDetailsPage() {
  const { slug } = useParams();

  const product = getProductBySlug(slug ?? "");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const relatedSection = getSectionByPageAndName("page-product-details", "related_products");

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
        title={relatedSection?.sectionHeader ?? "Related Products"}
        viewCollectionText={relatedSection?.buttonLabels[0] ?? "View Entire Collection →"}
        products={relatedProducts}
        collectionSlug={collection?.slug ?? ""}
      />
    </>
  );
}
