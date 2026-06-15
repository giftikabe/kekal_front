import SectionHeader from "./SectionHeader";

import ImageSlider from "./ImageSlider";

import styles from "./VisionImpactSection.module.css";

interface VisionImpactSectionProps {
  title: string;

  content: string;

  images: string[];
}

export default function VisionImpactSection({
  title,
  content,
  images,
}: VisionImpactSectionProps) {
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
