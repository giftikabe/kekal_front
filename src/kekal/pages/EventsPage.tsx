import CommunityEventsHero from "../components/CommunityEventsHero";
import UpcomingEvents from "../components/UpcomingEvents";
import EventArchive from "../components/EventsArchive";
import CommunityImpact from "../components/CommunityImpact";
import Seo from "../components/Seo";

import { usePastEvents, useCommunityImpactItems } from "../hooks/useEvents";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import { useBrandMessageByKey } from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

interface PageSectionData {
  sectionHeader?: string;
  buttonLabels?: string[];
}
interface BrandMessageData {
  title?: string;
  description?: string;
}

export default function EventsPage() {
  const { data: upcomingEvents } = useUpcomingEvents();
  const { data: pastEvents } = usePastEvents();
  const { data: communityImpactItems } = useCommunityImpactItems();

  const { data: eventsHero } = useBrandMessageByKey("events_hero");

  const { data: upcomingSection } = useSectionByPageAndName("page-events", "upcoming_events");
  const { data: archiveSection } = useSectionByPageAndName("page-events", "event_archive");
  const { data: communitySection } = useSectionByPageAndName("page-events", "community_impact");

  const hero = eventsHero as BrandMessageData | null;

  return (
    <>
      <Seo
        fallbackTitle={hero?.title ?? "Events"}
        fallbackDescription={hero?.description}
      />

      <CommunityEventsHero
        title={hero?.title ?? "Fashion Beyond the Studio"}
        description={hero?.description ?? ""}
      />

      <UpcomingEvents
        title={(upcomingSection as PageSectionData | null)?.sectionHeader ?? "Upcoming Event"}
        events={(upcomingEvents as any[]) ?? []}
      />

      <EventArchive
        title={(archiveSection as PageSectionData | null)?.sectionHeader ?? "Event Archive"}
        events={(pastEvents as any[]) ?? []}
      />

      <CommunityImpact
        title={(communitySection as PageSectionData | null)?.sectionHeader ?? "Community Impact"}
        ctaText={(communitySection as PageSectionData | null)?.buttonLabels?.[0] ?? "View Story"}
        items={(communityImpactItems as any[]) ?? []}
      />
    </>
  );
}
