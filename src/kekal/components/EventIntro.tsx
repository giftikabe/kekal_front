import styles from "./EventIntro.module.css";

interface EventIntroProps {
  intro: string;
}

export default function EventIntro({ intro }: EventIntroProps) {
  if (!intro) return null;
  return (
    <section className={styles.section}>
      <p>{intro}</p>
    </section>
  );
}
