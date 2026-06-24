import { Link } from "react-router-dom";

import type { Product } from "../database-types/product";

import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className={styles.card}>
      <img
        src={product.mainImage}
        alt={product.name}
        className={styles.image} 
      />

      <div className={styles.content}>
        <h2>{product.name}</h2>
      </div>
    </Link>
  );
}
