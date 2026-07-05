import type { ReactElement } from "react";

import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

import styles from "./ProductsGrid.module.css";

interface ProductGridItem {
  id: string;
  slug: string;
  name: string;
  mainImage: string;
  inStock: boolean;
}

interface ProductsGridProps {
  title: string;
  products: ProductGridItem[];
}

export default function ProductsGrid({
  title,
  products,
}: ProductsGridProps): ReactElement {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      {products.length === 0 ? (
        <p className={styles.empty}>No products in this collection yet.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
