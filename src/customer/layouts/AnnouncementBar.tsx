import { useBrand } from "../hooks/useBrand";
import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  const { identity } = useBrand();
  const text = identity["announcement_text"];
  if (!text) return null;

  return (
    <div className={styles.bar}>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
