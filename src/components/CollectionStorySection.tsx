import SectionHeader from "./SectionHeader";

import styles from "./CollectionStorySection.module.css";

interface CollectionStorySectionProps {
  description: string;
}

export default function CollectionStorySection({
  description,
}: CollectionStorySectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title="Collection Story" />

      <p>{description}</p>
    </section>
  );
}
