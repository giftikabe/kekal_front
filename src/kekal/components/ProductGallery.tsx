import { useEffect, useRef, useState } from "react";

import { optimizeImageUrl } from "../utils/image";
import styles from "./ProductGallery.module.css";

interface GalleryProduct {
  name: string;
  mainImage: string;
  gallery: string[];
}

interface ProductGalleryProps {
  product: GalleryProduct;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const images = [product.mainImage, ...product.gallery].filter(Boolean);

  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setActiveImage((current) =>
        current === images.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, images.length]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    closeButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

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
          src={optimizeImageUrl(images[activeImage], 1000)}
          alt={product.name}
          className={styles.mainImage}
          loading="eager"
          fetchPriority="high"
          onClick={() => setIsLightboxOpen(true)}
          style={{ cursor: "zoom-in" }}
        />

        {images.length > 1 && (
          <div className={styles.controls}>
            <button type="button" onClick={previousImage} aria-label="Previous image">
              ‹
            </button>
            <button type="button" onClick={nextImage} aria-label="Next image">
              ›
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              className={`${styles.thumbnailButton} ${
                activeImage === index ? styles.active : ""
              }`}
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={activeImage === index}
            >
              <img
                src={optimizeImageUrl(image, 200)}
                alt=""
                className={styles.thumbnail}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} — full size image`}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close image viewer"
          >
            <span aria-hidden="true">×</span>
          </button>

          <img
            src={optimizeImageUrl(images[activeImage], 1600)}
            alt={product.name}
            className={styles.lightboxImage}
          />
        </div>
      )}
    </div>
  );
}
