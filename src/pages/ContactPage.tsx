import ContactHero from "../components/ContactHero";
import ContactSection from "../components/ContactSection";

import { useBrandIdentityByKey } from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

export default function ContactPage() {
  // ─── Contact Hero ──────────────────────────────────────────────────────────
  const { data: heroSection } = useSectionByPageAndName("page-contact", "hero");
  const { value: eyebrow } = useBrandIdentityByKey("contact_hero_eyebrow");
  const { value: description } = useBrandIdentityByKey("contact_hero_description");
  const { value: image } = useBrandIdentityByKey("contact_hero_image");

  return (
    <>
      <ContactHero
        eyebrow={eyebrow}
        title={(heroSection as any)?.sectionHeader ?? "Contact"}
        description={description}
        image={image}
      />

      <ContactSection />
    </>
  );
}
