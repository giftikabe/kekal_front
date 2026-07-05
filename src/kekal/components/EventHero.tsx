import { optimizeImageUrl } from "../utils/image";
import styles from "./EventHero.module.css";

interface EventHeroData {
  title: string;
  featuredImage: string;
  eventDate: string;
  location: string;
}

interface EventHeroProps {
  event: EventHeroData;
}

export default function EventHero({ event }: EventHeroProps) {
  return (
    <section className={styles.hero}>
      <img
        src={optimizeImageUrl(event.featuredImage, 1600)}
        alt=""
        className={styles.image}
        loading="eager"
        fetchPriority="high"
      />

      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1>{event.title}</h1>
        <p>
          {event.eventDate} • {event.location}
        </p>
      </div>
    </section>
  );
}
