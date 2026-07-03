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
        <img src={image} alt={title} className={styles.image} />

        <div className={styles.overlay}>
          <p className={styles.eyebrow}>{eyebrow}</p>

          <h1>{title}</h1>

          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </section>
  );
}
