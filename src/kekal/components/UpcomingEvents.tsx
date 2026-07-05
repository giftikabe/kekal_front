import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import SectionHeader from "./SectionHeader";

import styles from "./UpcomingEvents.module.css";

interface UpcomingEventItem {
  id: string;
  slug: string;
  title: string;
  intro: string;
  featuredImage: string;
  category?: string | null;
  eventDate: string;
  location: string;
  ctaText: string;
}

interface UpcomingEventsProps {
  events: UpcomingEventItem[];
  title: string;
}

export default function UpcomingEvents({ events, title }: UpcomingEventsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
          src={optimizeImageUrl(event.featuredImage, 1400)}
          alt=""
          className={styles.image}
          loading="lazy"
          decoding="async"
        />

        <div className={styles.overlay} />

        <div className={styles.content}>
          {event.category && (
            <span className={styles.category}>{event.category}</span>
          )}

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
        <div className={styles.dots} role="tablist" aria-label="Upcoming events">
          {events.map((e, index) => (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-label={`Show ${e.title}`}
              aria-selected={activeIndex === index}
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
