import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import styles from "./EventCard.module.css";

interface EventCardData {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  eventDate: string;
}

interface EventCardProps {
  event: EventCardData;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link to={`/events/${event.slug}`} className={styles.card}>
      <img
        src={optimizeImageUrl(event.featuredImage, 700)}
        alt={event.title}
        className={styles.image}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.content}>
        <h3>{event.title}</h3>
        <span className={styles.date}>{event.eventDate}</span>
      </div>
    </Link>
  );
}
