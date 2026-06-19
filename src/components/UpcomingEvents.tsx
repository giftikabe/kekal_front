import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import type { UpcomingEvent } from "../types/upcomingEvent";

import SectionHeader from "./SectionHeader";

import styles from "./UpcomingEvents.module.css";

interface UpcomingEventsProps {
  events: UpcomingEvent[];

  title: string;
}

export default function UpcomingEvents({ events, title }: UpcomingEventsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === events.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  if (events.length === 0) {
    return null;
  }

  const event = events[activeIndex];

  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.banner}>
        <img
          src={event.featuredImage}
          alt={event.title}
          className={styles.image}
        />

        <div className={styles.overlay} />

        <div className={styles.content}>
          <span className={styles.category}>{event.category}</span>

          <h3>{event.title}</h3>

          <p className={styles.meta}>
            {event.eventDate} • {event.location}
          </p>

          <p className={styles.intro}>{event.intro}</p>

          <Link to={`/upcoming-events/${event.slug}`} className={styles.link}>
            {event.ctaText}
          </Link>
        </div>
      </div>

      {events.length > 1 && (
        <div className={styles.dots}>
          {events.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Event ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`${styles.dot} ${
                activeIndex === index ? styles.active : ""
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
