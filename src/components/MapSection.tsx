import type { SiteSettings } from "../types/siteSettings";

import SectionHeader from "./SectionHeader";

import styles from "./MapSection.module.css";

interface MapSectionProps {
  siteSettings: SiteSettings;
}

export default function MapSection({ siteSettings }: MapSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title="Location" />

      <div className={styles.map}>{siteSettings.address}</div>
    </section>
  );
}
