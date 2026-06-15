import SectionHeader from "./SectionHeader";

import ImageSlider from "./ImageSlider";

import styles from "./CraftProcessSection.module.css";

interface CraftProcessSectionProps {
  title: string;

  content: string;

  images: string[];
}

export default function CraftProcessSection({
  title,
  content,
  images,
}: CraftProcessSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.layout}>
        <div className={styles.imageContainer}>
          <ImageSlider images={images} />
        </div>

        <div className={styles.content}>
          <p>{content}</p>
        </div>
      </div>
    </section>
  );
}
