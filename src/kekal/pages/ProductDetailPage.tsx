import { useParams } from "react-router-dom";

import ProductHero from "../components/ProductHero";
import ProductBody from "../components/ProductBody";
import RelatedProductsGrid from "../components/RelatedProductsGrid";
import Seo from "../components/Seo";
import NotFoundPage from "./NotFoundPage";

import { useProductBySlug, useProductsByCollection } from "../hooks/useProducts";
import { useCollectionById } from "../hooks/useCollections";
import { useSectionByPageAndName } from "../hooks/usePages";

interface PageSectionData {
  sectionHeader?: string;
  buttonLabels?: string[];
}

export default function ProductDetailsPage() {
  const { slug } = useParams();

  const { data: product, loading } = useProductBySlug(slug ?? "");

  const { data: relatedSection } = useSectionByPageAndName(
    "page-product-details",
    "related_products",
  );

  const collectionId = (product as any)?.collectionId ?? "";
  const { data: collection } = useCollectionById(collectionId);

  const { data: collectionProducts } = useProductsByCollection(collectionId);
  const relatedProducts =
    (collectionProducts as any[])
      ?.filter((p) => p.id !== (product as any)?.id)
      .slice(0, 4) ?? [];

  if (loading) return null;
  if (!product) return <NotFoundPage />;

  const p = product as any;
  const section = relatedSection as PageSectionData | null;

  return (
    <>
      <Seo
        fallbackTitle={p.name}
        fallbackDescription={p.description}
        fallbackImage={p.mainImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.description,
          image: [p.mainImage, ...(p.gallery ?? [])].filter(Boolean),
          // No price/currency exists anywhere in the product data model —
          // omitting `offers` entirely is the correct choice here rather
          // than inventing a price, but if online purchase is ever added
          // this is the field to fill in.
          ...(p.inStock !== undefined
            ? {
                offers: {
                  "@type": "Offer",
                  availability: p.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                },
              }
            : {}),
        }}
      />

      <ProductHero productName={p.name} collectionName={(collection as any)?.name ?? ""} />

      <ProductBody product={p} />

      <RelatedProductsGrid
        title={section?.sectionHeader ?? "Related Products"}
        viewCollectionText={section?.buttonLabels?.[0] ?? "View Entire Collection →"}
        products={relatedProducts}
        collectionSlug={(collection as any)?.slug ?? ""}
      />
    </>
  );
}
