import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  return (
    <div className={styles.bar}>
      WORLDWIDE SHIPPING
      <span className={styles.separator}>|</span>
      MADE IN ETHIOPIA
    </div>
  );
}
