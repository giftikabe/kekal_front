import AboutHero from "../components/AboutHero";
import DesignerStorySection from "../components/DesignerStorySection";
import QuoteSection from "../components/QuoteSection";
import BrandStorySection from "../components/BrandStorySection";
import CraftProcessSection from "../components/CraftProcessSection";
import VisionImpactSection from "../components/VisionImpactSection";
import ContactCTASection from "../components/ContactCTASection";

import { getDesigner } from "../services/designerService";
import { getAbout } from "../services/aboutService";
import { getAboutPageContent } from "../services/aboutPageService";

export default function AboutPage() {
  const designer = getDesigner();

  const about = getAbout();

  const aboutPageContent = getAboutPageContent();

  return (
    <>
      <AboutHero
        name={designer.name}
        image={designer.portrait}
      />

      <DesignerStorySection
        title={aboutPageContent.designerStory.title}
        image={designer.portrait}
        introduction={designer.shortBio}
        journey={designer.fullBio}
      />

      <QuoteSection
        quote={designer.quote}
        author={designer.name}
      />

      <BrandStorySection
        title={aboutPageContent.brandStory.title}
        content={about.brandStory.content}
        images={about.brandStory.images}
      />

      <CraftProcessSection
        title={aboutPageContent.craftProcess.title}
        content={about.craftProcess.content}
        images={about.brandStory.images}
      />

      <VisionImpactSection
        title={aboutPageContent.visionImpact.title}
        content={about.visionImpact.content}
        images={about.brandStory.images}
      />

      <ContactCTASection
        title={aboutPageContent.contactCta.title}
        description={aboutPageContent.contactCta.description}
        buttonText={aboutPageContent.contactCta.buttonText}
      />
    </>
  );
}