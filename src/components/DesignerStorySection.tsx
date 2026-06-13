import SectionHeader from "./SectionHeader";

import styles from "./DesignerStorySection.module.css";

interface DesignerStorySectionProps {
  title: string;

  image: string;

  bio: string;
}

export default function DesignerStorySection({
  title,
  image,
  bio,
}: DesignerStorySectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.layout}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
        </div>

        <div className={styles.content}>
          <p>{bio}</p>
        </div>
      </div>
    </section>
  );
}
