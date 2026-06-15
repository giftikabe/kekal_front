import AboutHero from "../components/AboutHero";
import DesignerStorySection from "../components/DesignerStorySection";
import QuoteSection from "../components/QuoteSection";
import BrandStorySection from "../components/BrandStorySection";
import CraftProcessSection from "../components/CraftProcessSection";
import VisionImpactSection from "../components/VisionImpactSection";
import ContactCTASection from "../components/ContactCTASection";

import { getDesigner } from "../services/designerService";
import { getAbout } from "../services/aboutService";

export default function AboutPage() {
  const designer = getDesigner();

  const about = getAbout();

  return (
    <>
      <AboutHero name={designer.name} image={designer.portrait} />

      <DesignerStorySection
        title="The Designer"
        image={designer.portrait}
        introduction={designer.shortBio}
        journey={designer.fullBio}
      />

      <QuoteSection quote={designer.quote} author={designer.name} />

      <BrandStorySection
        title={about.brandStory.title}
        content={about.brandStory.content}
        images={about.brandStory.images}
      />
      <CraftProcessSection
        title={about.craftProcess.title}
        content={about.craftProcess.content}
        images={about.brandStory.images}
      />

      <VisionImpactSection
        title={about.visionImpact.title}
        content={about.visionImpact.content}
        images={about.brandStory.images}
      />

      <ContactCTASection
        title={about.contactCta.title}
        description={about.contactCta.description}
        buttonText={about.contactCta.buttonText}
      />
    </>
  );
}
