import type { Collection } from "../types/collection";
import styles from "./FeaturedCollections.module.css";

interface FeaturedCollectionsProps {
  collections: Collection[];
}

export default function FeaturedCollections({
  collections,
}: FeaturedCollectionsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Featured Collections</h2>
      </div>

      <div className={styles.grid}>
        {collections.map((collection) => (
          <article
            key={collection.id}
            className={styles.card}
          >
            <img
              src={collection.coverImage}
              alt={collection.name}
              className={styles.image}
            />

            <div className={styles.content}>
  <h3>{collection.name}</h3>

  <span>{collection.releaseYear}</span>
</div>
          </article>
        ))}
      </div>
    </section>
  );
}