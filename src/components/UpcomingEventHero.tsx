import type { UpcomingEvent } from "../database-types/upcomingEvent";

import styles from "./UpcomingEventHero.module.css";

interface UpcomingEventHeroProps {
  event: UpcomingEvent;
}

export default function UpcomingEventHero({ event }: UpcomingEventHeroProps) {
  return (
    <section className={styles.hero}>
      <img
        src={event.featuredImage}
        alt={event.title}
        className={styles.image}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.category}>{event.category}</span>

        <h1>{event.title}</h1>
      </div>
    </section>
  );
}
