import ContactHero from "../components/ContactHero";
import ContactSection from "../components/ContactSection";

import { getContact } from "../services/contactService";
//import { getSiteSettings } from "../services/siteSettingsService";

export default function ContactPage() {
  const contact = getContact();

  //const siteSettings = getSiteSettings();

  return (
    <>
      <ContactHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        description={contact.hero.description}
        image={contact.hero.image}
      />

      <ContactSection />
    </>
  );
}
