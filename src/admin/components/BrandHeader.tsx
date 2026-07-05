import styles from "./BrandHeader.module.css";

interface BrandHeaderProps {
  size?: "sm" | "lg";
}

export default function BrandHeader({ size = "lg" }: BrandHeaderProps) {
  return (
    <div className={`${styles.header} ${size === "sm" ? styles.sm : ""}`}>
      <div className={styles.logoCol}>
        <div className={styles.logoMark} aria-hidden="true">K</div>
      </div>
      <div className={styles.textCol}>
        <div className={styles.name}>KEKAL</div>
        <div className={styles.title}>Studio</div>
        <div className={styles.subtitle}>Admin Dashboard</div>
      </div>
    </div>
  );
}
