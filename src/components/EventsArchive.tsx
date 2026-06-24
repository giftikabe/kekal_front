import { useState } from "react";

import type { Event } from "../database-types/event";

import SectionHeader from "./SectionHeader";

import styles from "./EventsArchive.module.css";

import { Link } from "react-router-dom";

interface EventArchiveProps {
  title: string;

  events: Event[];
}

export default function EventArchive({ title, events }: EventArchiveProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", ...new Set(events.map((event) => event.category))];

  const filteredEvents =
    activeCategory === "all"
      ? events
      : events.filter((event) => event.category === activeCategory);

  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.filters}>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`${styles.filter} ${
              activeCategory === category ? styles.active : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredEvents.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.slug}`}
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
          </Link>
        ))}
      </div>
    </section>
  );
}
