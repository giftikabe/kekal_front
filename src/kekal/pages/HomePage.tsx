import Hero from "../components/Hero";
import FeaturedCollections from "../components/FeaturedCollections";
import DesignerSection from "../components/DesignerSection";
import CommunityEventsSection from "../components/CommunityEventsSection";
import UpcomingEvents from "../components/UpcomingEvents";
import HomeValueCards from "../components/HomeValueCards";
import Seo from "../components/Seo";

import {
  useBrandIdentityByKey,
  useBrandValues,
  useDesignerProfileByKey,
  useContactInfoByKey,
} from "../hooks/useBrand";
import { useFeaturedCollections } from "../hooks/useCollections";
import { useFeaturedEvents } from "../hooks/useEvents";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import { useSectionByPageAndName } from "../hooks/usePages";

interface PageSectionData {
  sectionHeader?: string;
  buttonLabels?: string[];
}

export default function HomePage() {
  // ─── Brand Identity ────────────────────────────────────────────────────────
  const { value: heroTagline } = useBrandIdentityByKey("tagline");
  const { value: heroDescription } = useBrandIdentityByKey("description");
  const { value: heroImage } = useBrandIdentityByKey("home_hero_image");
  const { value: siteName } = useBrandIdentityByKey("name");
  const { value: logo } = useBrandIdentityByKey("logo");

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

  // ─── Contact (for Organization schema) ─────────────────────────────────────
  const { value: instagram } = useContactInfoByKey("instagram");
  const { value: facebook } = useContactInfoByKey("facebook");
  const { value: tiktok } = useContactInfoByKey("tiktok");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const { data: heroSection } = useSectionByPageAndName("page-home", "hero");
  const { data: featuredCollectionsSection } = useSectionByPageAndName(
    "page-home",
    "featured_collections",
  );
  const { data: designerSection } = useSectionByPageAndName(
    "page-home",
    "designer_section",
  );
  const { data: upcomingEventSection } = useSectionByPageAndName(
    "page-home",
    "upcoming_event",
  );
  const { data: communityEventsSection } = useSectionByPageAndName(
    "page-home",
    "community_events",
  );

  const hero = heroSection as PageSectionData | null;

  const designer = {
    name: designerName,
    title: designerTitle,
    portrait: designerPortrait,
    shortBio: designerShortBio,
  };

  const sameAs = [instagram, facebook, tiktok].filter(Boolean);

  return (
    <>
      <Seo
        fallbackTitle={siteName}
        fallbackDescription={heroDescription}
        fallbackImage={heroImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName || "KEKAL",
          description: heroDescription,
          logo: logo || undefined,
          ...(sameAs.length > 0 ? { sameAs } : {}),
        }}
      />

      <Hero
        tagline={heroTagline}
        description={heroDescription}
        image={heroImage}
        buttonLabels={hero?.buttonLabels}
      />

      <HomeValueCards values={(brandValues as any[]) ?? []} />

      <FeaturedCollections
        title={(featuredCollectionsSection as PageSectionData | null)?.sectionHeader ?? "Featured Collections"}
        collections={(featuredCollections as any[]) ?? []}
      />

      <DesignerSection
        title={(designerSection as PageSectionData | null)?.sectionHeader ?? "Meet The Designer"}
        ctaText={(designerSection as PageSectionData | null)?.buttonLabels?.[0] ?? "Read More →"}
        designer={designer}
      />

      <UpcomingEvents
        title={(upcomingEventSection as PageSectionData | null)?.sectionHeader ?? "Upcoming Event"}
        events={(upcomingEvents as any[]) ?? []}
      />

      <CommunityEventsSection
        title={(communityEventsSection as PageSectionData | null)?.sectionHeader ?? "Community & Events"}
        events={(featuredEvents as any[]) ?? []}
      />
    </>
  );
}
