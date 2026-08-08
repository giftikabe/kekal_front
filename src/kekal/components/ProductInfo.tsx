import styles from "./ProductInfo.module.css";
import { useState } from 'react';

import SizeGuideModal from './SizeGuideModal';

interface ProductInfoData {
  description: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
}

interface ProductInfoProps {
  product: ProductInfoData;
}

const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className={styles.container}>
      <p className={styles.description}>{product.description}</p>

      {product.colors.length > 0 && (
        <div className={styles.group}>
          <h3>Colors</h3>
          <div className={styles.colors}>
            {product.colors.map((hex) => (
              <div key={hex} className={styles.colorItem}>
                <span
                  className={styles.colorSwatch}
                  style={{ backgroundColor: hex }}
                  aria-hidden="true"
                />
                <span>{hex}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
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
      )}
      
      {product.sizeGuide && (

  <button

    type="button"

    className={styles.sizeGuideLink}

    onClick={() => setSizeGuideOpen(true)}

  >

    Size Guide →

  </button>

)}

{sizeGuideOpen && product.sizeGuide && (

  <SizeGuideModal sizeGuide={product.sizeGuide} onClose={() => setSizeGuideOpen(false)} />

)}

      <div className={styles.group}>
        <h3>Availability</h3>
        <p className={styles.availability}>
          <span
            className={product.inStock ? styles.dotInStock : styles.dotOutOfStock}
            aria-hidden="true"
          />
          {product.inStock ? "Available" : "Out of Stock"}
        </p>
      </div>
    </div>
  );
}
