import ContactFormSection from "./ContactFormSection";
import ContactDetailsSection from "./ContactDetailsSection";

import styles from "./ContactSection.module.css";

import { getContactInfoByKey } from "../database-services/contactInfoService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function ContactSection() {
  const address = getContactInfoByKey("address");
  const phone = getContactInfoByKey("phone");
  const email = getContactInfoByKey("email");

  const formSection = getSectionByPageAndName("page-contact", "contact_form");
  const detailsSection = getSectionByPageAndName("page-contact", "contact_details");

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        
        <ContactFormSection
          title={formSection?.sectionHeader ?? "Contact Form"}
          buttonText={formSection?.buttonLabels[0] ?? "Send"}
        />

        <ContactDetailsSection
          title={detailsSection?.sectionHeader ?? "Direct Contact"}
          address={address}
          phone={phone}
          email={email}
        />
      </div>
    </section>
  );
}
