import styles from "./AcademiaHero.module.css";

export default function AcademiaHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg} />
      <div className={styles.content}>
        <span className={styles.eyebrow}>KEKAL Academy</span>
        <h1 className={styles.title}>Craft, Passed Forward</h1>
        <p className={styles.subtitle}>
          Learn the techniques and heritage behind every KEKAL piece
        </p>
        <span className={styles.badge}>Coming Soon</span>
      </div>
    </section>
  );
}