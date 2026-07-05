import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
