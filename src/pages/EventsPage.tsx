import CommunityEventsHero from "../components/CommunityEventsHero";
import UpcomingEvents from "../components/UpcomingEvents";
import EventArchive from "../components/EventsArchive";
import CommunityImpact from "../components/CommunityImpact";

import {
  getPastEvents,
  getCommunityImpactItems,
} from "../services/eventService";

import { getUpcomingEvents } from "../services/upcomingEventService";
import { getEventsPageContent } from "../services/eventsPageService";

export default function EventsPage() {
  const pageContent = getEventsPageContent();

  const upcomingEvents = getUpcomingEvents();

  const pastEvents = getPastEvents();

  const communityImpactItems = getCommunityImpactItems();

  return (
    <>
      <CommunityEventsHero
        title={pageContent.hero.title}
        description={pageContent.hero.description}
      />

      <UpcomingEvents
        title={pageContent.upcomingEvents.title}
        events={upcomingEvents}
      />

      <EventArchive
        title={pageContent.eventArchive.title}
        events={pastEvents}
      />

      <CommunityImpact
        title={pageContent.communityImpact.title}
        ctaText={pageContent.communityImpact.ctaText}
        items={communityImpactItems}
      />
    </>
  );
}
