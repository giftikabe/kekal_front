import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import SectionHeader from "./SectionHeader";

import styles from "./RelatedEvents.module.css";

interface RelatedEvent {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  category: string;
  eventDate: string;
  location: string;
}

interface RelatedEventsProps {
  title: string;
  events: RelatedEvent[];
}

export default function RelatedEvents({ title, events }: RelatedEventsProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.grid}>
        {events.map((event) => (
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
    </section>
  );
}
