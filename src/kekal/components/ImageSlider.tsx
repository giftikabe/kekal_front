import { useEffect, useState } from "react";

import { optimizeImageUrl } from "../utils/image";
import styles from "./ImageSlider.module.css";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) =>
        current === images.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className={styles.slider}>
      <img
        src={optimizeImageUrl(images[currentIndex], 800)}
        alt=""
        className={styles.image}
        loading="lazy"
        decoding="async"
      />

      {images.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Image slideshow">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-selected={index === currentIndex}
              className={
                index === currentIndex
                  ? `${styles.dot} ${styles.active}`
                  : styles.dot
              }
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
