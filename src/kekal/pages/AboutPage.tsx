import AboutHero from "../components/about/AboutHero";
import DesignerStorySection from "../components/about/DesignerStorySection";
import QuoteSection from "../components/about/QuoteSection";
import AboutContentSection from "../components/about/Aboutcontentsection";
import ContactCTASection from "../components/about/ContactCTASection";

import {
  useDesignerProfileByKey,
  useAboutContentBlocks,
  useBrandMessageByKey,
} from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

import Seo from "../components/common/Seo";


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

  <Seo
    fallbackTitle="Timeless Contemporary Fashion"
    fallbackDescription={designerShortBio}
    fallbackImage={designerPortrait}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "KEKAL",
      url: "https://kekalliving.com",
    }}
  />;

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
