import type { SectionHeaderProps } from "../types/sectionHeader";
import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>

      {description && (
        <p>{description}</p>
      )}
    </div>
  );
}