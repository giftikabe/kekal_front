import { Link } from "react-router-dom";

import styles from "./Hero.module.css";

interface HeroProps {
  tagline: string;
  description: string;
  image: string;
}

export default function Hero({ tagline, description, image }: HeroProps) {
  return (
    <section className={styles.hero}>
      <img src={image} alt={tagline} className={styles.image} />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.decorativeLine} />

        <h1>{tagline}</h1>

        <p>{description}</p>

        <div className={styles.actions}>
          <Link to="/collections" className={styles.primaryButton}>
            Explore Collection
          </Link>

          <Link to="/about" className={styles.secondaryButton}>
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
