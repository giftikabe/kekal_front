import type { AboutContentBlock } from "../database-types/aboutContentBlock";

import SectionHeader from "./SectionHeader";
import ImageSlider from "./ImageSlider";

import styles from "./Aboutcontentsection.module.css";

interface AboutContentSectionProps {
  blocks: AboutContentBlock[];
}

export default function AboutContentSection({ blocks }: AboutContentSectionProps) {
  return (
    <>
      {blocks.map((block, index) => {
        const isReversed = index % 2 === 0; // even index → image right, content left

        return (
          <section
            key={block.id}
            className={`${styles.section} ${isReversed ? styles.reversed : ""}`}
          >
            <SectionHeader title={block.title} />

            <div className={styles.layout}>
              <div className={styles.imageContainer}>
                <ImageSlider images={block.images} />
              </div>

              <div className={styles.content}>
                <p>{block.content}</p>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
