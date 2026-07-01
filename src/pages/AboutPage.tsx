import AboutHero from "../components/AboutHero";
import DesignerStorySection from "../components/DesignerStorySection";
import QuoteSection from "../components/QuoteSection";
import AboutContentSection from "../components/Aboutcontentsection";
import ContactCTASection from "../components/ContactCTASection";

import {
  useDesignerProfileByKey,
  useAboutContentBlocks,
  useBrandMessageByKey,
} from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

export default function AboutPage() {
  // ─── Designer ──────────────────────────────────────────────────────────────
  const { value: designerName } = useDesignerProfileByKey("name");
  const { value: designerPortrait } = useDesignerProfileByKey("portrait");
  const { value: designerShortBio } = useDesignerProfileByKey("short_bio");
  const { value: designerFullBio } = useDesignerProfileByKey("full_bio");
  const { value: designerQuote } = useDesignerProfileByKey("quote");

  // ─── About Content Blocks ──────────────────────────────────────────────────
  const { data: aboutBlocks } = useAboutContentBlocks();

  // ─── Contact CTA ───────────────────────────────────────────────────────────
  const { data: contactCta } = useBrandMessageByKey("about_cta");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const { data: designerStorySection } = useSectionByPageAndName("page-about", "designer_story");

  return (
    <>
      <AboutHero
        name={designerName}
        image={designerPortrait}
      />

      <DesignerStorySection
        title={(designerStorySection as any)?.sectionHeader ?? "The Designer"}
        image={designerPortrait}
        introduction={designerShortBio}
        journey={designerFullBio}
      />

      <QuoteSection
        quote={designerQuote}
        author={designerName}
      />

      <AboutContentSection blocks={(aboutBlocks as any[]) ?? []} />

      <ContactCTASection
        title={(contactCta as any)?.title ?? "Let's Create Together"}
        description={(contactCta as any)?.description ?? ""}
        buttonText="Contact"
      />
    </>
  );
}
