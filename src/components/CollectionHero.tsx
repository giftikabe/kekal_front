import type { Collection } from "../types/collection";

import styles from "./CollectionHero.module.css";

interface CollectionHeroProps {
  collection: Collection;
}

export default function CollectionHero({ collection }: CollectionHeroProps) {
  return (
    <section className={styles.section}>
      <img
        src={collection.coverImage}
        alt={collection.name}
        className={styles.image}
      />

      <div className={styles.overlay}>
        <p>{collection.releaseYear}</p>

        <h1>{collection.name}</h1>
      </div>
    </section>
  );
}
