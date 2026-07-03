import styles from "./CommunityEventsHero.module.css";

interface CommunityEventsHeroProps {
  title: string;

  description: string;
}

export default function CommunityEventsHero({
  title,
  description,
}: CommunityEventsHeroProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>

        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}
