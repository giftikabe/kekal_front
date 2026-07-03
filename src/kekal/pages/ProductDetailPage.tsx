import { useParams } from "react-router-dom";

import ProductHero from "../components/product-detail/ProductHero";
import ProductBody from "../components/product-detail/ProductBody";
import RelatedProductsGrid from "../components/product-detail/RelatedProductsGrid";

import { useProductBySlug, useProductsByCollection } from "../hooks/useProducts";
import { useCollectionById } from "../hooks/useCollections";
import { useSectionByPageAndName } from "../hooks/usePages";
import Seo from "../components/common/Seo";


export default function ProductDetailsPage() {
  const { slug } = useParams();

  const { data: product, loading } = useProductBySlug(slug ?? "");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const { data: relatedSection } = useSectionByPageAndName(
    "page-product-details",
    "related_products"
  );

  // ─── Collection ────────────────────────────────────────────────────────────
  const collectionId = (product as any)?.collectionId ?? "";
  const { data: collection } = useCollectionById(collectionId);

  // ─── Related Products ──────────────────────────────────────────────────────
  const { data: collectionProducts } = useProductsByCollection(collectionId);
  const relatedProducts =
    (collectionProducts as any[])
      ?.filter((p) => p.id !== (product as any)?.id)
      .slice(0, 4) ?? [];

  if (loading) return null;
  if (!product) return <p>Product not found.</p>;

  <Seo
    fallbackTitle={(product as any).name}
    fallbackDescription={(product as any).description}
    fallbackImage={(product as any).mainImage}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Product",
      name: (product as any).name,
      description: (product as any).description,
      image: (product as any).mainImage,
      offers: {
        "@type": "Offer",
        availability: (product as any).inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    }}
  />;

  return (
    <>
      <ProductHero
        productName={(product as any).name}
        collectionName={(collection as any)?.name ?? ""}
      />

      <ProductBody product={product as any} />

      <RelatedProductsGrid
        title={(relatedSection as any)?.sectionHeader ?? "Related Products"}
        viewCollectionText={
          (relatedSection as any)?.buttonLabels?.[0] ?? "View Entire Collection →"
        }
        products={relatedProducts}
        collectionSlug={(collection as any)?.slug ?? ""}
      />
    </>
  );
}
