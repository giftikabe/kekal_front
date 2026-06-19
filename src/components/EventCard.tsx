import type { Event } from "../types/event";

import styles from "./EventCard.module.css";

import { Link } from "react-router-dom";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link to={`/events/${event.slug}`} className={styles.card}>
      {" "}
      <img
        src={event.featuredImage}
        alt={event.title}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3>{event.title}</h3>

        <span className={styles.date}>{event.eventDate}</span>
      </div>
    </Link>
  );
}

