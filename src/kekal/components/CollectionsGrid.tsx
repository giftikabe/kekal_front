import CollectionCard from "./CollectionCard";
import styles from "./CollectionsGrid.module.css";

interface CollectionListItem {
  id: string;
  slug: string;
  name: string;
  coverImage: string;
  releaseYear: number;
}

interface CollectionsGridProps {
  collections: CollectionListItem[];
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  if (collections.length === 0) {
    return (
      <section className={styles.section}>
        <p className={styles.empty}>No collections to show yet.</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
