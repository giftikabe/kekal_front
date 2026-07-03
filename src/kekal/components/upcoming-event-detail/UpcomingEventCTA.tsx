import styles from "./UpcomingEventCTA.module.css";

interface UpcomingEventCTAProps {
  ctaText: string;

  registrationUrl?: string;
}

export default function UpcomingEventCTA({
  ctaText,
  registrationUrl,
}: UpcomingEventCTAProps) {
  if (!registrationUrl) {
    return null;
  }

  return (
    <section className={styles.section}>
      <a
        href={registrationUrl}
        target="_blank"
        rel="noreferrer"
        className={styles.button}
      >
        {ctaText}
      </a>
    </section>
  );
}
