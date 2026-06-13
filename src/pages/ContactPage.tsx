import ContactHero from "../components/ContactHero";
import ContactInformationSection from "../components/ContactInformationSection";
import ContactFormSection from "../components/ContactFormSection";
import MapSection from "../components/MapSection";
import ContactCTASection from "../components/ContactCTASection";

import { getContact } from "../services/contactService";
import { getSiteSettings } from "../services/siteSettingsService";

export default function ContactPage() {
  const contact = getContact();

  const siteSettings = getSiteSettings();

  return (
    <>
      <ContactHero
        title={contact.hero.title}
        description={contact.hero.description}
      />

      <ContactInformationSection siteSettings={siteSettings} />

      <ContactFormSection />

      <MapSection siteSettings={siteSettings} />

      <ContactCTASection
        title={contact.cta.title}
        description={contact.cta.description}
        buttonText={contact.cta.buttonText}
      />
    </>
  );
}
