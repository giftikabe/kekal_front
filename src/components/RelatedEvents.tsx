import type { Event } from "../types/event";

import styles from "./RelatedEvents.module.css";

import SectionHeader from "./SectionHeader";

interface RelatedEventsProps {
  events: Event[];
}

export default function RelatedEvents({ events }: RelatedEventsProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <SectionHeader title="Related Events" />

      <div className={styles.grid}>
        {events.map((event) => (
          <a
            key={event.id}
            href={`/events/${event.slug}`}
            className={styles.card}
          >
            <img
              src={event.featuredImage}
              alt={event.title}
              className={styles.image}
            />

            <div className={styles.content}>
              <span className={styles.category}>{event.category}</span>

              <h3>{event.title}</h3>

              <p>{event.eventDate}</p>

              <p>{event.location}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
