import ContactFormSection from "./ContactFormSection";

import ContactDetailsSection from "./ContactDetailsSection";

import styles from "./ContactSection.module.css";

export default function ContactSection() {
  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <ContactFormSection />

        <ContactDetailsSection />
      </div>
    </section>
  );
}
