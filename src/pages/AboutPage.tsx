import AboutHero from "../components/AboutHero";
import DesignerStorySection from "../components/DesignerStorySection";
import QuoteSection from "../components/QuoteSection";
import BrandStorySection from "../components/BrandStorySection";
import CraftProcessSection from "../components/CraftProcessSection";
import VisionImpactSection from "../components/VisionImpactSection";
import ClosingImageSection from "../components/ClosingImageSection";
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
        bio={designer.fullBio}
      />

      <QuoteSection quote={designer.quote} />

      <BrandStorySection
        title={about.brandStory.title}
        content={about.brandStory.content}
        image={about.brandStory.image}
      />

      <CraftProcessSection
        title={about.craftProcess.title}
        content={about.craftProcess.content}
        image={about.craftProcess.image}
      />

      <VisionImpactSection
        title={about.visionImpact.title}
        content={about.visionImpact.content}
        image={about.visionImpact.image}
      />

      <ClosingImageSection
        image={about.closingImage.image}
        alt={about.closingImage.alt}
      />

      <ContactCTASection
        title={about.contactCta.title}
        description={about.contactCta.description}
        buttonText={about.contactCta.buttonText}
      />
    </>
  );
}
