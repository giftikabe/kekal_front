import AboutHero from "../components/AboutHero";
import DesignerStorySection from "../components/DesignerStorySection";
import QuoteSection from "../components/QuoteSection";
import AboutContentSection from "../components/Aboutcontentsection";
import ContactCTASection from "../components/ContactCTASection";

import { getDesignerProfileByKey } from "../database-services/designerProfileService";
import { getAboutContentBlocks } from "../database-services/aboutContentBlockService";
import { getBrandMessageByKey } from "../database-services/brandMessageService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function AboutPage() {
  // ─── Designer ──────────────────────────────────────────────────────────────
  const designerName = getDesignerProfileByKey("name");
  const designerPortrait = getDesignerProfileByKey("portrait");
  const designerShortBio = getDesignerProfileByKey("short_bio");
  const designerFullBio = getDesignerProfileByKey("full_bio");
  const designerQuote = getDesignerProfileByKey("quote");

  // ─── About Content Blocks (brand_story, craft_process, vision_impact) ──────
  const aboutBlocks = getAboutContentBlocks();

  // ─── Contact CTA ───────────────────────────────────────────────────────────
  const contactCta = getBrandMessageByKey("about_cta");

  // ─── Page Sections (titles) ────────────────────────────────────────────────
  const designerStorySection = getSectionByPageAndName("page-about", "designer_story");

  return (
    <>
      <AboutHero
        name={designerName}
        image={designerPortrait}
      />

      <DesignerStorySection
        title={designerStorySection?.sectionHeader ?? "The Designer"}
        image={designerPortrait}
        introduction={designerShortBio}
        journey={designerFullBio}
      />

      <QuoteSection
        quote={designerQuote}
        author={designerName}
      />

      <AboutContentSection blocks={aboutBlocks} />

      <ContactCTASection
        title={contactCta?.title ?? "Let's Create Together"}
        description={contactCta?.description ?? ""}
        buttonText="Contact"
      />
    </>
  );
}
