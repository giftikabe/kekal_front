import styles from "./ContactHero.module.css";

interface ContactHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}

export default function ContactHero({
  eyebrow,
  title,
  description,
  image,
}: ContactHeroProps) {
  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        {image && (
          <img
            src={image}
            alt=""
            className={styles.image}
            loading="eager"
            fetchPriority="high"
          />
        )}

        <div className={styles.overlay}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
    </section>
  );
}
