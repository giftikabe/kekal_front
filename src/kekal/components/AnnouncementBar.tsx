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
    let cancelled = false;
    brandApi
      .getIdentityByKey("announcements")
      .then((item: { value?: string }) => {
        if (cancelled || !item?.value) return;
        try {
          const parsed = JSON.parse(item.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed);
          } else if (typeof item.value === "string" && item.value) {
            setAnnouncements([item.value]);
          }
        } catch {
          if (item.value) setAnnouncements([item.value]);
        }
      })
      .catch(() => {
        // Non-critical: keep the default announcement rather than show nothing.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const DISPLAY_MS = 4000;
    const FADE_MS = 400;

    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % announcements.length);
        setVisible(true);
      }, FADE_MS);
    }, DISPLAY_MS + FADE_MS);

    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className={styles.bar} role="region" aria-label="Site announcements">
      <span
        className={styles.text}
        style={{ opacity: visible ? 1 : 0 }}
        aria-live="polite"
      >
        {announcements[current]}
      </span>
    </div>
  );
}
