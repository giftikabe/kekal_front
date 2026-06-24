import type { Product } from "../database-types/product";

import styles from "./ProductInfo.module.css";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className={styles.container}>
      <p className={styles.description}>{product.description}</p>

      <div className={styles.group}>
        <h3>Colors</h3>

        <div className={styles.colors}>
          {product.colors.map((hex) => (
            <div key={hex} className={styles.colorItem}>
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: hex }}
              />

              <span>{hex}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3>Sizes</h3>

        <div className={styles.sizes}>
          {product.sizes.map((size) => (
            <span key={size} className={styles.size}>
              {size}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <h3>Availability</h3>

        <p>{product.inStock ? "Available" : "Out of Stock"}</p>
      </div>
    </div>
  );
}
