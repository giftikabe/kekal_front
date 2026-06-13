import SectionHeader from "./SectionHeader";

import styles from "./BrandStorySection.module.css";

interface BrandStorySectionProps {
  title: string;

  content: string;

  image: string;
}

export default function BrandStorySection({
  title,
  content,
  image,
}: BrandStorySectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.layout}>
        <div className={styles.content}>
          <p>{content}</p>
        </div>

        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
        </div>
      </div>
    </section>
  );
}
