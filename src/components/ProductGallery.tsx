import { useEffect, useState } from "react";

import type { Product } from "../database-types/product";

import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = [product.mainImage, ...product.gallery];

  const [activeImage, setActiveImage] = useState(0);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImage((current) =>
        current === images.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  const previousImage = () => {
    setAutoPlay(false);

    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const nextImage = () => {
    setAutoPlay(false);

    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  const selectImage = (index: number) => {
    setAutoPlay(false);

    setActiveImage(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.viewer}>
        <img
          src={images[activeImage]}
          alt={product.name}
          className={styles.mainImage}
          onClick={() => setIsLightboxOpen(true)}
        />

        <div className={styles.controls}>
          <button type="button" onClick={previousImage}>
            ‹
          </button>

          <button type="button" onClick={nextImage}>
            ›
          </button>
        </div>
      </div>

      <div className={styles.thumbnails}>
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.thumbnailButton} ${
              activeImage === index ? styles.active : ""
            }`}
            onClick={() => selectImage(index)}
          >
            <img src={image} alt={product.name} className={styles.thumbnail} />
          </button>
        ))}
      </div>

      {isLightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setIsLightboxOpen(false)}
          >
            ×
          </button>

          <img
            src={images[activeImage]}
            alt={product.name}
            className={styles.lightboxImage}
          />
        </div>
      )}
    </div>
  );
}
