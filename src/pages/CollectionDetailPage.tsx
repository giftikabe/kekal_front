import { useParams } from "react-router-dom";

import CollectionHero from "../components/CollectionHero";
import CollectionStorySection from "../components/CollectionStorySection";
import ProductsGrid from "../components/ProductsGrid";

import { getCollectionBySlug } from "../database-services/collectionService";
import { getProductsByCollection } from "../database-services/productService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function CollectionDetailsPage() {
  const { slug } = useParams();

  const collection = getCollectionBySlug(slug ?? "");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const collectionStorySection = getSectionByPageAndName("page-collection-details", "collection_story");
  const productsSection = getSectionByPageAndName("page-collection-details", "products");

  if (!collection) {
    return <p>Collection not found.</p>;
  }

  const products = getProductsByCollection(collection.id);

  return (
    <>
      <CollectionHero collection={collection} />

      <CollectionStorySection
        title={collectionStorySection?.sectionHeader ?? "Collection Story"}
        description={collection.description}
      />

      <ProductsGrid
        title={productsSection?.sectionHeader ?? "Products"}
        products={products}
      />
    </>
  );
}
