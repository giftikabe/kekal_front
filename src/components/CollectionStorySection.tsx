import SectionHeader from "./SectionHeader";

import styles from "./CollectionStorySection.module.css";

interface CollectionStorySectionProps {
  title: string;

  description: string;
}

export default function CollectionStorySection({
  title,
  description,
}: CollectionStorySectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <p>{description}</p>
    </section>
  );
} 
  