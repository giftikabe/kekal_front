import styles from "./ContactHero.module.css";

interface ContactHeroProps {
  title: string;

  description: string;
}

export default function ContactHero({ title, description }: ContactHeroProps) {
  return (
    <section className={styles.section}>
      <h1>{title}</h1>

      <p>{description}</p>
    </section>
  );
}
