import { useEffect, useState } from "react";

import styles from "./ImageSlider.module.css";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) =>
        current === images.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.slider}>
      <img src={images[currentIndex]} alt="" className={styles.image} />

      <div className={styles.dots}>
        {images.map((_, index) => (
          <button
            key={index}
            className={
              index === currentIndex
                ? `${styles.dot} ${styles.active}`
                : styles.dot
            }
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
