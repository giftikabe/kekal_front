import { useState } from "react";
import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import SectionHeader from "./SectionHeader";

import styles from "./EventsArchive.module.css";

interface ArchiveEvent {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  category: string;
  eventDate: string;
  location: string;
}

interface EventArchiveProps {
  title: string;
  events: ArchiveEvent[];
}

export default function EventArchive({ title, events }: EventArchiveProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    "all",
    ...Array.from(new Set(events.map((event) => event.category))),
  ];

  const filteredEvents =
    activeCategory === "all"
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      {categories.length > 2 && (
        <div className={styles.filters} role="group" aria-label="Filter events by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`${styles.filter} ${
                activeCategory === category ? styles.active : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <p className={styles.empty}>No past events in this category yet.</p>
      ) : (
        <div className={styles.grid}>
          {filteredEvents.map((event) => (
            <Link key={event.id} to={`/events/${event.slug}`} className={styles.card}>
              <img
                src={optimizeImageUrl(event.featuredImage, 700)}
                alt={event.title}
                className={styles.image}
                loading="lazy"
                decoding="async"
              />

              <div className={styles.content}>
                <span className={styles.category}>{event.category}</span>
                <h3>{event.title}</h3>
                <p>{event.eventDate}</p>
                <p>{event.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
