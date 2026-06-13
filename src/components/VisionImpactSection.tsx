import SectionHeader from "./SectionHeader";

import styles from "./VisionImpactSection.module.css";

interface VisionImpactSectionProps {
  title: string;

  content: string;

  image: string;
}

export default function VisionImpactSection({
  title,
  content,
  image,
}: VisionImpactSectionProps) {
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
