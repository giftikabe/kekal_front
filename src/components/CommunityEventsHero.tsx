import styles from "./CommunityEventsHero.module.css";

export default function CommunityEventsHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Fashion Beyond the Studio</h1>

        <p className={styles.description}>
          Discover the exhibitions, markets, workshops, collaborations, and
          community initiatives that connect KeKal Studio with creatives,
          makers, and communities across Ethiopia and beyond.
        </p>
      </div>
    </section>
  );
}
