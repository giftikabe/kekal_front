import type { Collection } from "../types/collection";
import styles from "./FeaturedCollections.module.css";

import SectionHeader from "./SectionHeader";

interface FeaturedCollectionsProps {
    title: string;

  collections: Collection[];
}


export default function FeaturedCollections({
  title,
  collections,
}: FeaturedCollectionsProps) {
  return (
    <section className={styles.section}>
<SectionHeader
    title={title}
/>
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