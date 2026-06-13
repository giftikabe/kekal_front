import type { SiteSettings } from "../types/siteSettings";

import SectionHeader from "./SectionHeader";

import styles from "./ContactInformationSection.module.css";

interface ContactInformationSectionProps {
  siteSettings: SiteSettings;
}

export default function ContactInformationSection({
  siteSettings,
}: ContactInformationSectionProps) {
  return (
    <section className={styles.section}>
      <SectionHeader title="Contact Information" />

      <div className={styles.content}>
        <p>{siteSettings.address}</p>

        <p>{siteSettings.phone}</p>

        <p>{siteSettings.email}</p>
      </div>
    </section>
  );
}
