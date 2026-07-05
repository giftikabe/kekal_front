import { optimizeImageUrl } from "../utils/image";
import styles from "./CollectionHero.module.css";

interface CollectionHeroData {
  name: string;
  coverImage: string;
  releaseYear: number;
}

interface CollectionHeroProps {
  collection: CollectionHeroData;
}

export default function CollectionHero({ collection }: CollectionHeroProps) {
  return (
    <section className={styles.section}>
      <img
        src={optimizeImageUrl(collection.coverImage, 1600)}
        alt=""
        className={styles.image}
        loading="eager"
        fetchPriority="high"
      />

      <div className={styles.overlay}>
        <p>{collection.releaseYear}</p>
        <h1>{collection.name}</h1>
      </div>
    </section>
  );
}
