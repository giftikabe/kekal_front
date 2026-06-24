import type { Product } from "../database-types/product";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

import styles from "./ProductBody.module.css";

interface ProductBodyProps {
  product: Product;
}

export default function ProductBody({ product }: ProductBodyProps) {
  return (
    <section className={styles.section}>
      <ProductGallery product={product} />

      <ProductInfo product={product} />
    </section> 
  );
}
