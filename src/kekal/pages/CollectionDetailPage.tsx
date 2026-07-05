import { useParams } from "react-router-dom";

import CollectionHero from "../components/CollectionHero";
import CollectionStorySection from "../components/CollectionStorySection";
import ProductsGrid from "../components/ProductsGrid";
import Seo from "../components/Seo";
import NotFoundPage from "./NotFoundPage";

import { useCollectionBySlug } from "../hooks/useCollections";
import { useProductsByCollection } from "../hooks/useProducts";
import { useSectionByPageAndName } from "../hooks/usePages";

interface PageSectionData {
  sectionHeader?: string;
}

export default function CollectionDetailsPage() {
  const { slug } = useParams();

  const { data: collection, loading } = useCollectionBySlug(slug ?? "");

  const { data: collectionStorySection } = useSectionByPageAndName(
    "page-collection-details",
    "collection_story",
  );
  const { data: productsSection } = useSectionByPageAndName(
    "page-collection-details",
    "products",
  );

  const collectionId = (collection as any)?.id ?? "";
  const { data: products } = useProductsByCollection(collectionId);

  if (loading) return null;
  if (!collection) return <NotFoundPage />;

  const c = collection as any;
  const productList = (products as any[]) ?? [];

  return (
    <>
      <Seo
        fallbackTitle={c.name}
        fallbackDescription={c.description}
        fallbackImage={c.coverImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: c.name,
          description: c.description,
          image: c.coverImage,
          hasPart: productList.map((p: any) => ({
            "@type": "Product",
            name: p.name,
            image: p.mainImage,
          })),
        }}
      />

      <CollectionHero collection={c} />

      <CollectionStorySection
        title={(collectionStorySection as PageSectionData | null)?.sectionHeader ?? "Collection Story"}
        description={c.description}
      />

      <ProductsGrid
        title={(productsSection as PageSectionData | null)?.sectionHeader ?? "Products"}
        products={productList}
      />
    </>
  );
}
