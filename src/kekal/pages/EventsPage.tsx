import CommunityEventsHero from "../components/events/CommunityEventsHero";
import UpcomingEvents from "../components/common/UpcomingEvents";
import EventArchive from "../components/events/EventsArchive";
import CommunityImpact from "../components/events/CommunityImpact";

import { usePastEvents, useCommunityImpactItems } from "../hooks/useEvents";
import { useUpcomingEvents } from "../hooks/useUpcomingEvents";
import { useBrandMessageByKey } from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

export default function EventsPage() {
  const { data: upcomingEvents } = useUpcomingEvents();
  const { data: pastEvents } = usePastEvents();
  const { data: communityImpactItems } = useCommunityImpactItems();

  // ─── Hero ──────────────────────────────────────────────────────────────────
  const { data: eventsHero } = useBrandMessageByKey("events_hero");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const { data: upcomingSection } = useSectionByPageAndName("page-events", "upcoming_events");
  const { data: archiveSection } = useSectionByPageAndName("page-events", "event_archive");
  const { data: communitySection } = useSectionByPageAndName("page-events", "community_impact");

  return (
    <>
      <CommunityEventsHero
        title={(eventsHero as any)?.title ?? "Fashion Beyond the Studio"}
        description={(eventsHero as any)?.description ?? ""}
      />

      <UpcomingEvents
        title={(upcomingSection as any)?.sectionHeader ?? "Upcoming Event"}
        events={(upcomingEvents as any[]) ?? []}
      />

      <EventArchive
        title={(archiveSection as any)?.sectionHeader ?? "Event Archive"}
        events={(pastEvents as any[]) ?? []}
      />

      <CommunityImpact
        title={(communitySection as any)?.sectionHeader ?? "Community Impact"}
        ctaText={(communitySection as any)?.buttonLabels?.[0] ?? "View Story"}
        items={(communityImpactItems as any[]) ?? []}
      />
    </>
  );
}
