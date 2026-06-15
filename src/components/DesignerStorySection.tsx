import SectionHeader from "./SectionHeader";

import styles from "./DesignerStorySection.module.css";

interface DesignerStorySectionProps {
  title: string;

  image: string;

  introduction: string;

  journey: string;
}

export default function DesignerStorySection({
  title,
  image,
  introduction,
  journey,
}: DesignerStorySectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.layout}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
        </div>

        <div className={styles.content}>
          <p>{introduction}</p>

          <p>{journey}</p>
        </div>
      </div>
    </section>
  );
}
