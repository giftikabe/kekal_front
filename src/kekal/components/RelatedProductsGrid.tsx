import { Link } from "react-router-dom";

import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";

import styles from "./RelatedProductsGrid.module.css";

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  mainImage: string;
  inStock: boolean;
}

interface RelatedProductsGridProps {
  title: string;
  viewCollectionText: string;
  products: RelatedProduct[];
  collectionSlug: string;
}

export default function RelatedProductsGrid({
  title,
  viewCollectionText,
  products,
  collectionSlug,
}: RelatedProductsGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {collectionSlug && (
        <div className={styles.viewCollectionWrapper}>
          <Link
            to={`/collections/${collectionSlug}`}
            className={styles.viewCollection}
          >
            {viewCollectionText}
          </Link>
        </div>
      )}
    </section>
  );
}
