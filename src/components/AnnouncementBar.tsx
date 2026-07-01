import { useEffect, useState } from "react";
import { brandApi } from "../api";
import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>([
    "WORLDWIDE SHIPPING",
  ]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    brandApi
      .getIdentityByKey("announcements")
      .then((item: any) => {
        if (!item?.value) return;
        try {
          const parsed = JSON.parse(item.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed);
          } else if (typeof item.value === "string" && item.value) {
            setAnnouncements([item.value]);
          }
        } catch {
          // raw string fallback
          if (item.value) setAnnouncements([item.value]);
        }
      })
      .catch(() => {
        // silently keep default — announcement bar is non-critical
      });
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;

    const DISPLAY_MS = 4000;
    const FADE_MS = 400;

    const timer = setInterval(() => {
      // fade out
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % announcements.length);
        setVisible(true);
      }, FADE_MS);
    }, DISPLAY_MS + FADE_MS);

    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className={styles.bar}>
      <span className={styles.text} style={{ opacity: visible ? 1 : 0 }}>
        {announcements[current]}
      </span>
    </div>
  );
}
