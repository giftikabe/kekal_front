import { Link } from "react-router-dom";

import type { Collection } from "../types/collection";

import styles from "./CollectionCard.module.css";

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link to={`/collections/${collection.slug}`} className={styles.card}>
      <img
        src={collection.coverImage}
        alt={collection.name}
        className={styles.image}
      />

      <div className={styles.content}>
        <h2>{collection.name}</h2>

        <p>{collection.releaseYear}</p>
      </div>
    </Link>
  );
}
