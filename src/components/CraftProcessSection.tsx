import SectionHeader from "./SectionHeader";

import styles from "./CraftProcessSection.module.css";

interface CraftProcessSectionProps {
  title: string;

  content: string;

  image: string;
}

export default function CraftProcessSection({
  title,
  content,
  image,
}: CraftProcessSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.layout}>
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
        </div>

        <div className={styles.content}>
          <p>{content}</p>
        </div>
      </div>
    </section>
  );
}
