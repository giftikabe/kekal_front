import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import styles from "./Hero.module.css";

interface HeroProps {
  tagline: string;
  description: string;
  image: string;
  /** Button copy for [primary, secondary]. Falls back to sensible defaults
   * if the "hero" page-section record hasn't defined them, but the real
   * source of truth is the buttonLabels array on that section. */
  buttonLabels?: string[];
}

export default function Hero({
  tagline,
  description,
  image,
  buttonLabels = [],
}: HeroProps) {
  const [primaryLabel = "Explore Collection", secondaryLabel = "Our Story"] =
    buttonLabels;

  return (
    <section className={styles.hero}>
      <img
        src={optimizeImageUrl(image, 1600)}
        alt=""
        className={styles.image}
        loading="eager"
        // This is almost always the Largest Contentful Paint element on the
        // homepage, so it should never be lazy-loaded or deprioritized.
        fetchPriority="high"
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.decorativeLine} />

        <h1>{tagline}</h1>

        <p>{description}</p>

        <div className={styles.actions}>
          <Link to="/collections" className={styles.primaryButton}>
            {primaryLabel}
          </Link>

          <Link to="/about" className={styles.secondaryButton}>
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
