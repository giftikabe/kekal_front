//import type { Product } from "../types/product";

import styles from "./ProductHero.module.css";

interface ProductHeroProps {
  productName: string;

  collectionName: string;
}

export default function ProductHero({
  productName,
  collectionName,
}: ProductHeroProps) {
  return (
    <section className={styles.section}>
      <p className={styles.collectionName}>
        {collectionName}
      </p>

      <h1 className={styles.productName}>
        {productName}
      </h1>
    </section>
  );
}