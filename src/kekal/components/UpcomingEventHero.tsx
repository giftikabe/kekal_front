import { optimizeImageUrl } from "../utils/image";
import styles from "./UpcomingEventHero.module.css";

interface UpcomingEventHeroData {
  title: string;
  featuredImage: string;
  category?: string | null;
}

interface UpcomingEventHeroProps {
  event: UpcomingEventHeroData;
}

export default function UpcomingEventHero({ event }: UpcomingEventHeroProps) {
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
        {event.category && (
          <span className={styles.category}>{event.category}</span>
        )}
        <h1>{event.title}</h1>
      </div>
    </section>
  );
}
