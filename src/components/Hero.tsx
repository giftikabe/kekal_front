import styles from "./Hero.module.css";

interface HeroProps {
  title: string;
  tagline: string;
  description: string;
  image: string;
}

export default function Hero({
  title,
  tagline,
  description,
  image,
}: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={title}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <h1>{title}</h1>

        <h2>{tagline}</h2>

        <p>{description}</p>
      </div>
    </section>
  );
}