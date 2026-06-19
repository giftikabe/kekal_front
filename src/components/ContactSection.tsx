import ContactFormSection from "./ContactFormSection";
import ContactDetailsSection from "./ContactDetailsSection";

import styles from "./ContactSection.module.css";

import { getSiteSettings } from "../services/siteSettingsService";

export default function ContactSection() {
  const siteSettings = getSiteSettings();

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <ContactFormSection title="Contact Form" buttonText="Send" />

        <ContactDetailsSection
          title="Direct Contact"
          address={siteSettings.address}
          phone={siteSettings.phone}
          email={siteSettings.email}
        />
      </div>
    </section>
  );
}
