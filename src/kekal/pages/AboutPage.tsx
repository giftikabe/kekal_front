import AboutHero from "../components/AboutHero";
import DesignerStorySection from "../components/DesignerStorySection";
import QuoteSection from "../components/QuoteSection";
import AboutContentSection from "../components/Aboutcontentsection";
import ContactCTASection from "../components/ContactCTASection";
import Seo from "../components/Seo";

import {
  useDesignerProfileByKey,
  useAboutContentBlocks,
  useBrandMessageByKey,
} from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

interface PageSectionData {
  sectionHeader?: string;
}
interface BrandMessageData {
  title?: string;
  description?: string;
}

export default function AboutPage() {
  // ─── Designer ──────────────────────────────────────────────────────────────
  const { value: designerName } = useDesignerProfileByKey("name");
  const { value: designerPortrait } = useDesignerProfileByKey("portrait");
  const { value: designerShortBio } = useDesignerProfileByKey("short_bio");
  const { value: designerFullBio } = useDesignerProfileByKey("full_bio");
  const { value: designerQuote } = useDesignerProfileByKey("quote");
  const { value: designerQuoteAuthor } = useDesignerProfileByKey("quote_author");

  // ─── About Content Blocks ──────────────────────────────────────────────────
  const { data: aboutBlocks } = useAboutContentBlocks();

  // ─── Contact CTA ───────────────────────────────────────────────────────────
  const { data: contactCta } = useBrandMessageByKey("about_cta");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const { data: designerStorySection } = useSectionByPageAndName(
    "page-about",
    "designer_story",
  );

  const cta = contactCta as BrandMessageData | null;

  return (
    <>
      <Seo
        fallbackTitle="About"
        fallbackDescription={designerShortBio}
        fallbackImage={designerPortrait}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          about: {
            "@type": "Person",
            name: designerName,
            jobTitle: "Founder & Creative Designer",
            image: designerPortrait || undefined,
          },
        }}
      />

      <AboutHero name={designerName} image={designerPortrait} />

      <DesignerStorySection
        title={(designerStorySection as PageSectionData | null)?.sectionHeader ?? "The Designer"}
        image={designerPortrait}
        introduction={designerShortBio}
        journey={designerFullBio}
      />

      <QuoteSection quote={designerQuote} author={designerQuoteAuthor || designerName} />

      <AboutContentSection blocks={(aboutBlocks as any[]) ?? []} />

      <ContactCTASection
        title={cta?.title ?? "Let's Create Together"}
        description={cta?.description ?? ""}
        buttonText="Contact"
      />
    </>
  );
}
