import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

import styles from "./ProductBody.module.css";

interface ProductBodyData {
  name: string;
  description: string;
  mainImage: string;
  gallery: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
}

interface ProductBodyProps {
  product: ProductBodyData;
}

export default function ProductBody({ product }: ProductBodyProps) {
  return (
    <section className={styles.section}>
      <ProductGallery product={product} />
      <ProductInfo product={product} />
    </section>
  );
}
