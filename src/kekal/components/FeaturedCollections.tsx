import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import SectionHeader from "./SectionHeader";

import styles from "./FeaturedCollections.module.css";

interface FeaturedCollection {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  releaseYear: number;
}

interface FeaturedCollectionsProps {
  title: string;
  collections: FeaturedCollection[];
}

export default function FeaturedCollections({
  title,
  collections,
}: FeaturedCollectionsProps) {
  if (collections.length === 0) return null;

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
                src={optimizeImageUrl(collection.coverImage, 800)}
                alt={collection.name}
                className={styles.image}
                loading="lazy"
                decoding="async"
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
