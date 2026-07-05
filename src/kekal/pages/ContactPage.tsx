import ContactHero from "../components/ContactHero";
import ContactSection from "../components/ContactSection";
import Seo from "../components/Seo";

import { useBrandIdentityByKey } from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

interface PageSectionData {
  sectionHeader?: string;
}

export default function ContactPage() {
  const { data: heroSection } = useSectionByPageAndName("page-contact", "hero");
  const { value: eyebrow } = useBrandIdentityByKey("contact_hero_eyebrow");
  const { value: description } = useBrandIdentityByKey("contact_hero_description");
  const { value: image } = useBrandIdentityByKey("contact_hero_image");

  const hero = heroSection as PageSectionData | null;

  return (
    <>
      <Seo fallbackTitle="Contact" fallbackDescription={description} fallbackImage={image} />

      <ContactHero
        eyebrow={eyebrow}
        title={hero?.sectionHeader ?? "Contact"}
        description={description}
        image={image}
      />

      <ContactSection />
    </>
  );
}
