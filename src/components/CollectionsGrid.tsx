import CollectionCard from "./CollectionCard";

import type { Collection } from "../database-types/collection";

import styles from "./CollectionsGrid.module.css";

interface CollectionsGridProps {
  collections: Collection[];
}

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
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
