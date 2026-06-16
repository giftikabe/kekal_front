import { Link } from "react-router-dom";

import type { Product } from "../types/product";

import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";

import styles from "./RelatedProductsGrid.module.css";

interface RelatedProductsGridProps {
  products: Product[];

  collectionSlug: string;
}

export default function RelatedProductsGrid({
  products,
  collectionSlug,
}: RelatedProductsGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <SectionHeader title="Related Products" />

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className={styles.viewCollectionWrapper}>
        <Link
          to={`/collections/${collectionSlug}`}
          className={styles.viewCollection}
        >
          View Entire Collection →
        </Link>
      </div>
    </section>
  );
}
