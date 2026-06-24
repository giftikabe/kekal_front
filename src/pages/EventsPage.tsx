import CommunityEventsHero from "../components/CommunityEventsHero";
import UpcomingEvents from "../components/UpcomingEvents";
import EventArchive from "../components/EventsArchive";
import CommunityImpact from "../components/CommunityImpact";

import { getPastEvents, getCommunityImpactItems } from "../database-services/eventService";
import { getUpcomingEvents } from "../database-services/upcomingEventService";
import { getBrandMessageByKey } from "../database-services/brandMessageService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();
  const communityImpactItems = getCommunityImpactItems();

  // ─── Hero ──────────────────────────────────────────────────────────────────
  const eventsHero = getBrandMessageByKey("events_hero");

  // ─── Page Sections ─────────────────────────────────────────────────────────
  const upcomingSection = getSectionByPageAndName("page-events", "upcoming_events");
  const archiveSection = getSectionByPageAndName("page-events", "event_archive");
  const communitySection = getSectionByPageAndName("page-events", "community_impact");

  return (
    <>
      <CommunityEventsHero
        title={eventsHero?.title ?? "Fashion Beyond the Studio"}
        description={eventsHero?.description ?? ""}
      />

      <UpcomingEvents
        title={upcomingSection?.sectionHeader ?? "Upcoming Event"}
        events={upcomingEvents}
      />

      <EventArchive
        title={archiveSection?.sectionHeader ?? "Event Archive"}
        events={pastEvents}
      />

      <CommunityImpact
        title={communitySection?.sectionHeader ?? "Community Impact"}
        ctaText={communitySection?.buttonLabels[0] ?? "View Story"}
        items={communityImpactItems}
      />
    </>
  );
}
