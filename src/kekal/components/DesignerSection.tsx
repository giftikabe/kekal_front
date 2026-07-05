import { Link } from "react-router-dom";

import SectionHeader from "./SectionHeader";
import { optimizeImageUrl } from "../utils/image";

import styles from "./DesignerSection.module.css";

export interface DesignerSummary {
  name: string;
  title: string;
  portrait: string;
  shortBio: string;
}

interface DesignerSectionProps {
  title: string;
  ctaText: string;
  designer: DesignerSummary;
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
            src={optimizeImageUrl(designer.portrait, 700)}
            alt={designer.name}
            className={styles.image}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.content}>
          <h3>{designer.name}</h3>
          <p className={styles.role}>{designer.title}</p>
          <p className={styles.bio}>{designer.shortBio}</p>

          {/* Internal route: use <Link> so this is a client-side
              navigation instead of a full page reload. */}
          <Link to="/about" className={styles.link}>
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
