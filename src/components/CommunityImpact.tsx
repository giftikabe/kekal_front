import type { Event } from "../types/event";

import SectionHeader from "./SectionHeader";

import styles from "./CommunityImpact.module.css";

import { Link } from "react-router-dom";

interface CommunityImpactProps {
  title: string;

  ctaText: string;

  items: Event[];
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
            className={`${styles.item} ${
              index % 2 !== 0 ? styles.reverse : ""
            }`}
          >
            <div className={styles.imageWrapper}>
              <img
                src={item.featuredImage}
                alt={item.title}
                className={styles.image}
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
