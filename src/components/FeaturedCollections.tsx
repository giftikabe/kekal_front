import { Link } from "react-router-dom";

import type { Collection } from "../types/collection";

import SectionHeader from "./SectionHeader";

import styles from "./FeaturedCollections.module.css";

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
      <SectionHeader title={title} />

      <div className={styles.grid}>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.slug}`}
            className={styles.cardLink}
          >
            <article className={styles.card}>
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
          </Link>
        ))}
      </div>
    </section>
  );
}
