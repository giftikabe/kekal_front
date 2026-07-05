import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import SectionHeader from "./SectionHeader";

import styles from "./CommunityImpact.module.css";

interface CommunityImpactEvent {
  id: string;
  slug: string;
  title: string;
  intro: string;
  featuredImage: string;
  category: string;
}

interface CommunityImpactProps {
  title: string;
  ctaText: string;
  items: CommunityImpactEvent[];
}

export default function CommunityImpact({
  title,
  ctaText,
  items,
}: CommunityImpactProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.list}>
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`${styles.item} ${index % 2 !== 0 ? styles.reverse : ""}`}
          >
            <div className={styles.imageWrapper}>
              <img
                src={optimizeImageUrl(item.featuredImage, 900)}
                alt={item.title}
                className={styles.image}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className={styles.content}>
              <span className={styles.category}>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.intro}</p>
              <Link to={`/events/${item.slug}`} className={styles.link}>
                {ctaText}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
