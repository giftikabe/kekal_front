import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import styles from "./ProductCard.module.css";

interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  mainImage: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className={styles.card}>
      <img
        src={optimizeImageUrl(product.mainImage, 600)}
        alt={product.name}
        className={styles.image}
        loading="lazy"
        decoding="async"
      />

      <div className={styles.content}>
        <h2>{product.name}</h2>
        {!product.inStock && (
          <span className={styles.outOfStock}>Out of stock</span>
        )}
      </div>
    </Link>
  );
}
