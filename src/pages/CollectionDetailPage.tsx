import { useParams } from "react-router-dom";

import CollectionHero from "../components/CollectionHero";
import CollectionStorySection from "../components/CollectionStorySection";
import ProductsGrid from "../components/ProductsGrid";

import { useCollectionBySlug } from "../hooks/useCollections";
import { useProductsByCollection } from "../hooks/useProducts";
import { useSectionByPageAndName } from "../hooks/usePages";

export default function CollectionDetailsPage() {
  const { slug } = useParams();

  const { data: collection, loading } = useCollectionBySlug(slug ?? "");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const { data: collectionStorySection } = useSectionByPageAndName(
    "page-collection-details",
    "collection_story"
  );
  const { data: productsSection } = useSectionByPageAndName(
    "page-collection-details",
    "products"
  );

  // ─── Products for this collection ─────────────────────────────────────────
  const collectionId = (collection as any)?.id ?? "";
  const { data: products } = useProductsByCollection(collectionId);

  if (loading) return null;
  if (!collection) return <p>Collection not found.</p>;

  return (
    <>
      <CollectionHero collection={collection as any} />

      <CollectionStorySection
        title={(collectionStorySection as any)?.sectionHeader ?? "Collection Story"}
        description={(collection as any).description}
      />

      <ProductsGrid
        title={(productsSection as any)?.sectionHeader ?? "Products"}
        products={(products as any[]) ?? []}
      />
    </>
  );
}
