import type { Designer } from "../types/designer";

import SectionHeader from "./SectionHeader";

import styles from "./DesignerSection.module.css";

interface DesignerSectionProps {
  title: string;

  ctaText: string;

  designer: Designer;
}

export default function DesignerSection({
  title,
  ctaText,
  designer,
}: DesignerSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.layout}>
        <div className={styles.imageContainer}>
          <img
            src={designer.portrait}
            alt={designer.name}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <h3>{designer.name}</h3>

          <p className={styles.role}>{designer.title}</p>

          <p className={styles.bio}>{designer.shortBio}</p>

          <a href="/about" className={styles.link}>
            {ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}