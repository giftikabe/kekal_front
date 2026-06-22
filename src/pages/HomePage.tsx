import Hero from "../components/Hero";
import FeaturedCollections from "../components/FeaturedCollections";
import DesignerSection from "../components/DesignerSection";
import CommunityEventsSection from "../components/CommunityEventsSection";
import UpcomingEvents from "../components/UpcomingEvents";

import { getHomePageContent } from "../services/homeService";
import { getFeaturedCollections } from "../services/collectionService";
import { getDesigner } from "../services/designerService";
import { getFeaturedEvents } from "../services/eventService";
import { getUpcomingEvents } from "../services/upcomingEventService";
import HomeValueCards from "../components/HomeValueCards";

export default function HomePage() {
  const homePageContent = getHomePageContent();

  const featuredCollections = getFeaturedCollections();

  const designer = getDesigner();

  const featuredEvents = getFeaturedEvents();

  const upcomingEvents = getUpcomingEvents();

  return (
    <>
      <Hero
        tagline={homePageContent.hero.tagline}
        description={homePageContent.hero.description}
        image={homePageContent.hero.image}
      />

      <HomeValueCards values={homePageContent.values} />

      <FeaturedCollections
        title={homePageContent.featuredCollections.title}
        collections={featuredCollections}
      />

      <DesignerSection
        title={homePageContent.designerSection.title}
        ctaText={homePageContent.designerSection.ctaText ?? ""}
        designer={designer}
      />

      <UpcomingEvents
        title={homePageContent.upcomingEventSection.title}
        events={upcomingEvents}
      />

      <CommunityEventsSection
        title={homePageContent.communityEventsSection.title}
        events={featuredEvents}
      />
    </>
  );
}
