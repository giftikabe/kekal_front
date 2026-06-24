import type { Event } from "../database-types/event";

import styles from "./EventHero.module.css";

interface EventHeroProps {
  event: Event;
}

export default function EventHero({ event }: EventHeroProps) {
  return (
    <section className={styles.hero}>
      <img
        src={event.featuredImage}
        alt={event.title}
        className={styles.image}
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1>{event.title}</h1>

        <p>
          {event.eventDate} • {event.location}
        </p>
      </div>
    </section>
  );
}
