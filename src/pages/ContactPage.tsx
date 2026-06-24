import ContactHero from "../components/ContactHero";
import ContactSection from "../components/ContactSection";

import { getBrandIdentityByKey } from "../database-services/brandIdentityService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function ContactPage() {
  // ─── Contact Hero ──────────────────────────────────────────────────────────
  const heroSection = getSectionByPageAndName("page-contact", "hero");
  const eyebrow = getBrandIdentityByKey("contact_hero_eyebrow");
  const description = getBrandIdentityByKey("contact_hero_description");
  const image = getBrandIdentityByKey("contact_hero_image");

  return (
    <>
      <ContactHero
        eyebrow={eyebrow}
        title={heroSection?.sectionHeader ?? "Contact"}
        description={description}
        image={image}
      />

      <ContactSection />
    </>
  );
}
