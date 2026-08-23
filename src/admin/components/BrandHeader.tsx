import styles from "./BrandHeader.module.css";
import logoMark from "../../../public/KEKAL_logomark_white_on_black.jpg";

interface BrandHeaderProps {
  size?: "sm" | "lg";
}

export default function BrandHeader({ size = "lg" }: BrandHeaderProps) {
  return (
    <div className={`${styles.header} ${size === "sm" ? styles.sm : ""}`}>
      <div className={styles.logoCol}>
        <img
  src={logoMark}
  alt="KEKAL"
  className={`${styles.logoMark} ${size === "sm" ? styles.logoMarkSm : ""}`}
/>
      </div>
      <div className={styles.textCol}>
        <div className={styles.name}>KEKAL</div>
        <div className={styles.title}>Studio</div>
        <div className={styles.subtitle}>Admin Dashboard</div>
      </div>
    </div>
  );
}