import ContactFormSection from "./ContactFormSection";
import ContactDetailsSection from "./ContactDetailsSection";

import { useContactInfoByKey } from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

import styles from "./ContactSection.module.css";

interface PageSectionData {
  sectionHeader?: string;
  buttonLabels?: string[];
}

/**
 * Previously this component imported `contactInfoService` and
 * `pageSectionService` — modules that don't exist anywhere in this
 * codebase (the project moved to the `useContactInfoByKey` /
 * `useSectionByPageAndName` hooks everywhere else, e.g. ContactPage.tsx).
 * That made this component impossible to build. Rewritten to match the
 * rest of the app.
 */
export default function ContactSection() {
  const { value: address } = useContactInfoByKey("address");
  const { value: phone } = useContactInfoByKey("phone");
  const { value: email } = useContactInfoByKey("email");

  const { data: formSection } = useSectionByPageAndName(
    "page-contact",
    "contact_form",
  );
  const { data: detailsSection } = useSectionByPageAndName(
    "page-contact",
    "contact_details",
  );

  const form = formSection as PageSectionData | null;
  const details = detailsSection as PageSectionData | null;

  return (
    <section className={styles.section}>
      <div className={styles.layout}>
        <ContactFormSection
          title={form?.sectionHeader ?? "Contact Form"}
          buttonText={form?.buttonLabels?.[0] ?? "Send"}
          recipientEmail={email}
        />

        <ContactDetailsSection
          title={details?.sectionHeader ?? "Direct Contact"}
          address={address}
          phone={phone}
          email={email}
        />
      </div>
    </section>
  );
}
