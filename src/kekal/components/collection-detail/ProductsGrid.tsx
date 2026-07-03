import type { Product } from "../../../database-types/product";

import ProductCard from "../common/ProductCard";
import SectionHeader from "../common/SectionHeader";

import styles from "./ProductsGrid.module.css";

interface ProductsGridProps {
  title: string;

  products: Product[];
}

export default function ProductsGrid({ title, products }: ProductsGridProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
