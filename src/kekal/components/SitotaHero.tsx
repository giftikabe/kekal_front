import styles from "./SitotaHero.module.css";

interface SitotaHeroProps {
  tagline: string;
  subtitle: string;
  image: string;
}

export default function SitotaHero({ tagline, subtitle, image }: SitotaHeroProps) {
  return (
    <section className={styles.hero}>
      <img
        src={image}
        alt=""
        className={styles.image}
        loading="eager"
        fetchPriority="high"
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Sitota</p>
        <div className={styles.line} />
        <h1 className={styles.tagline}>{tagline}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <span className={styles.scrollHint}>Scroll to Explore</span>
      </div>
    </section>
  );
}