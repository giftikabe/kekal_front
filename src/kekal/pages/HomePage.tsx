import Hero from "../components/home/Hero";
import FeaturedCollections from "../components/home/FeaturedCollections";
import DesignerSection from "../components/home/DesignerSection";
import CommunityEventsSection from "../components/home/CommunityEventsSection";
import UpcomingEvents from "../components/common/UpcomingEvents";
import HomeValueCards from "../components/home/HomeValueCards";

import { useBrandIdentityByKey, useBrandValues, useDesignerProfileByKey } from "../hooks/useBrand";
import { useFeaturedCollections } from "../hooks/useCollections";
import { useFeaturedEvents } from "../hooks/useEvents";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import { useSectionByPageAndName } from "../hooks/usePages";
import Seo from "../components/common/Seo";
// ...


export default function HomePage() {
  // ─── Brand Identity ────────────────────────────────────────────────────────
  const { value: heroTagline } = useBrandIdentityByKey("tagline");
  const { value: heroDescription } = useBrandIdentityByKey("description");
  const { value: heroImage } = useBrandIdentityByKey("home_hero_image");

  // ─── Brand Values ──────────────────────────────────────────────────────────
  const { data: brandValues } = useBrandValues();

  // ─── Collections ───────────────────────────────────────────────────────────
  const { data: featuredCollections } = useFeaturedCollections();

  // ─── Designer ──────────────────────────────────────────────────────────────
  const { value: designerName } = useDesignerProfileByKey("name");
  const { value: designerTitle } = useDesignerProfileByKey("title");
  const { value: designerPortrait } = useDesignerProfileByKey("portrait");
  const { value: designerShortBio } = useDesignerProfileByKey("short_bio");

  // ─── Events ────────────────────────────────────────────────────────────────
  const { data: featuredEvents } = useFeaturedEvents();
  const { data: upcomingEvents } = useUpcomingEvents();

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const { data: featuredCollectionsSection } = useSectionByPageAndName("page-home", "featured_collections");
  const { data: designerSection } = useSectionByPageAndName("page-home", "designer_section");
  const { data: upcomingEventSection } = useSectionByPageAndName("page-home", "upcoming_event");
  const { data: communityEventsSection } = useSectionByPageAndName("page-home", "community_events");

  const designer = {
    name: designerName,
    title: designerTitle,
    portrait: designerPortrait,
    shortBio: designerShortBio,
  };

  <Seo
    fallbackTitle="Timeless Contemporary Fashion"
    fallbackDescription={heroDescription}
    fallbackImage={heroImage}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "KEKAL",
      url: "https://kekalliving.com",
    }}
  />;

  return (
    <>
      <Hero
        tagline={heroTagline}
        description={heroDescription}
        image={heroImage}
      />

      <HomeValueCards values={(brandValues as any[]) ?? []} />

      <FeaturedCollections
        title={(featuredCollectionsSection as any)?.sectionHeader ?? "Featured Collections"}
        collections={(featuredCollections as any[]) ?? []}
      />

      <DesignerSection
        title={(designerSection as any)?.sectionHeader ?? "Meet The Designer"}
        ctaText={(designerSection as any)?.buttonLabels?.[0] ?? "Read More →"}
        designer={designer}
      />

      <UpcomingEvents
        title={(upcomingEventSection as any)?.sectionHeader ?? "Upcoming Event"}
        events={(upcomingEvents as any[]) ?? []}
      />

      <CommunityEventsSection
        title={(communityEventsSection as any)?.sectionHeader ?? "Community & Events"}
        events={(featuredEvents as any[]) ?? []}
      />
    </>
  );
}
