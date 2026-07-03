import styles from "./EventIntro.module.css";

interface EventIntroProps {
  intro: string;
}

export default function EventIntro({ intro }: EventIntroProps) {
  return (
    <section className={styles.section}>
      <p>{intro}</p>
    </section>
  );
}
