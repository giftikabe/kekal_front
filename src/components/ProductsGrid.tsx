import type { Product } from "../types/product";

import ProductCard from "./ProductCard";

import SectionHeader from "./SectionHeader";

import styles from "./ProductsGrid.module.css";

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title="Products" />

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
