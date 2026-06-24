import Hero from "../components/Hero";
import FeaturedCollections from "../components/FeaturedCollections";
import DesignerSection from "../components/DesignerSection";
import CommunityEventsSection from "../components/CommunityEventsSection";
import UpcomingEvents from "../components/UpcomingEvents";
import HomeValueCards from "../components/HomeValueCards";

import { getBrandIdentityByKey } from "../database-services/brandIdentityService";
import { getBrandValues } from "../database-services/brandValueService";
import { getFeaturedCollections } from "../database-services/collectionService";
import { getDesignerProfileByKey } from "../database-services/designerProfileService";
import { getFeaturedEvents } from "../database-services/eventService";
import { getUpcomingEvents } from "../database-services/upcomingEventService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function HomePage() {
  // ─── Brand Identity ────────────────────────────────────────────────────────
  const heroTagline = getBrandIdentityByKey("tagline");
  const heroDescription = getBrandIdentityByKey("description");
  const heroImage = getBrandIdentityByKey("home_hero_image");

  // ─── Brand Values ──────────────────────────────────────────────────────────
  const brandValues = getBrandValues();

  // ─── Collections ───────────────────────────────────────────────────────────
  const featuredCollections = getFeaturedCollections();

  // ─── Designer ──────────────────────────────────────────────────────────────
  const designer = {
    name: getDesignerProfileByKey("name"),
    title: getDesignerProfileByKey("title"),
    portrait: getDesignerProfileByKey("portrait"),
    shortBio: getDesignerProfileByKey("short_bio"),
  };

  // ─── Events ────────────────────────────────────────────────────────────────
  const featuredEvents = getFeaturedEvents();
  const upcomingEvents = getUpcomingEvents();

  // ─── Page Sections (titles & CTA labels) ──────────────────────────────────
  const featuredCollectionsSection = getSectionByPageAndName("page-home", "featured_collections");
  const designerSection = getSectionByPageAndName("page-home", "designer_section");
  const upcomingEventSection = getSectionByPageAndName("page-home", "upcoming_event");
  const communityEventsSection = getSectionByPageAndName("page-home", "community_events");

  return (
    <>
      <Hero
        tagline={heroTagline}
        description={heroDescription}
        image={heroImage}
      />

      <HomeValueCards values={brandValues} />

      <FeaturedCollections
        title={featuredCollectionsSection?.sectionHeader ?? "Featured Collections"}
        collections={featuredCollections} 
      />

      <DesignerSection
        title={designerSection?.sectionHeader ?? "Meet The Designer"}
        ctaText={designerSection?.buttonLabels[0] ?? "Read More →"}
        designer={designer}
      />

      <UpcomingEvents
        title={upcomingEventSection?.sectionHeader ?? "Upcoming Event"}
        events={upcomingEvents}
      />

      <CommunityEventsSection
        title={communityEventsSection?.sectionHeader ?? "Community & Events"}
        events={featuredEvents}
      />
    </>
  );
}
