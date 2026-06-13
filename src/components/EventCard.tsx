import type { Event } from "../types/event";

import styles from "./EventCard.module.css";

interface EventCardProps {
  event: Event;
}

export default function EventCard({
  event,
}: EventCardProps) {
  return (
    <article className={styles.card}>
      <img
        src={event.featuredImage}
        alt={event.title}
        className={styles.image}
      />

      <div className={styles.content}>
        <h3>{event.title}</h3>

        <span className={styles.date}>
          {event.eventDate}
        </span>

        <p>{event.intro}</p>
      </div>
    </article>
  );
}