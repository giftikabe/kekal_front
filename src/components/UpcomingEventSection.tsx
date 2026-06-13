import type { Event } from "../types/event";

import SectionHeader from "./SectionHeader";

import styles from "./UpcomingEventSection.module.css";

interface UpcomingEventSectionProps {
  title: string;

  ctaText: string;

  event: Event;
}

export default function UpcomingEventSection({
  title,
  ctaText,
  event,
}: UpcomingEventSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.imageContainer}>
        <img
          src={event.featuredImage}
          alt={event.title}
          className={styles.image}
        />

        <div className={styles.overlay} />

        <div className={styles.content}>
          <SectionHeader title={title} />

          <h3>{event.title}</h3>

          <p className={styles.meta}>
            {event.eventDate} • {event.location}
          </p>

          <p className={styles.intro}>{event.intro}</p>

          <a href={`/community-events/${event.slug}`} className={styles.link}>
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
