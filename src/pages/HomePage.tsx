import Hero from "../components/Hero";
import FeaturedCollections from "../components/FeaturedCollections";
import DesignerSection from "../components/DesignerSection";
import CommunityEventsSection from "../components/CommunityEventsSection";
import UpcomingEventSection from "../components/UpcomingEventSection";

import { getHomePageContent } from "../services/homeService";
import { getFeaturedCollections } from "../services/collectionService";
import { getDesigner } from "../services/designerService";
import { getFeaturedEvents, getUpcomingEvents } from "../services/eventService";

export default function HomePage() {
  const homePageContent = getHomePageContent();

  const featuredCollections = getFeaturedCollections();

  const designer = getDesigner();

  const featuredEvents = getFeaturedEvents();

  const upcomingEvents = getUpcomingEvents();

  return (
    <>
      <Hero
        title={homePageContent.hero.title}
        tagline={homePageContent.hero.tagline}
        description={homePageContent.hero.description}
        image={homePageContent.hero.image}
      />

      <FeaturedCollections
        title={homePageContent.featuredCollections.title}
        collections={featuredCollections}
      />

      <DesignerSection
        title={homePageContent.designerSection.title}
        ctaText={homePageContent.designerSection.ctaText ?? ""}
        designer={designer}
      />

      {upcomingEvents.length > 0 && (
        <UpcomingEventSection
          title={homePageContent.upcomingEventSection.title}
          ctaText={homePageContent.upcomingEventSection.ctaText ?? ""}
          event={upcomingEvents[0]}
        />
      )}

      <CommunityEventsSection
        title={homePageContent.communityEventsSection.title}
        events={featuredEvents}
      />
    </>
  );
}
