import styles from "./CollectionsHero.module.css";

interface CollectionsHeroProps {
  eyebrow: string;

  title: string;

  description: string;
}

export default function CollectionsHero({
  eyebrow,
  title,
  description,
}: CollectionsHeroProps) {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>

      <h1>{title}</h1>

      <p className={styles.description}>{description}</p>
    </section>
  );
}
