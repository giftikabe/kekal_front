import SectionHeader from "./SectionHeader";

import ImageSlider from "./ImageSlider";

import styles from "./BrandStorySection.module.css";

interface BrandStorySectionProps {
  title: string;

  content: string;

  images: string[];
}

export default function BrandStorySection({
  title,
  content,
  images,
}: BrandStorySectionProps) {
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
