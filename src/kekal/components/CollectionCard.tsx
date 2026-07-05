import { Link } from "react-router-dom";

import { optimizeImageUrl } from "../utils/image";
import styles from "./CollectionCard.module.css";

interface CollectionCardData {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  releaseYear: number;
}

interface CollectionCardProps {
  collection: CollectionCardData;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link to={`/collections/${collection.slug}`} className={styles.card}>
      <img
        src={optimizeImageUrl(collection.coverImage, 800)}
        alt={collection.name}
        className={styles.image}
        loading="lazy"
        decoding="async"
      />

      <div className={styles.content}>
        <h2>{collection.name}</h2>
        <p>{collection.releaseYear}</p>
      </div>
    </Link>
  );
}
